import os
import json
from typing import Dict
from openai import OpenAI
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from ..models.dbmodels import HealthData, Prediction

# Load environment variables from .env file
load_dotenv()

openai_api_key = os.environ.get("OPENAI_API_KEY")
openai_api_base = os.environ.get("OPENAI_API_BASE")
openai_model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

client = None
if openai_api_key:
    if openai_api_base:
        client = OpenAI(api_key=openai_api_key, base_url=openai_api_base)
    else:
        client = OpenAI(api_key=openai_api_key)


def _build_health_context(health: HealthData, pred: Prediction) -> Dict:
    """Build the user health context dictionary consumed by the LLM."""
    # Normalize units
    height_cm = float(
        getattr(health, 'HeightCentimetres', 0) or 0) * 100.0
    weight_kg = float(getattr(health, 'WeightKilograms', 0) or 0)

    conditions = []
    if bool(getattr(health, 'HighCholesterol', False) or False):
        conditions.append("High Cholesterol")
    if bool(getattr(health, 'HyperTension', False) or False):
        conditions.append("Hypertension")
    if bool(getattr(health, 'HeartDisease', False) or False):
        conditions.append("Heart Disease")
    if bool(getattr(health, 'Diabetes', False) or False):
        conditions.append("Diabetes")
    if bool(getattr(health, 'Alcohol', False) or False):
        conditions.append("Alcohol Use")
    if bool(getattr(health, 'SmokingStatus', False) or False):
        conditions.append("Smoking")

    # Activity level derived from Exercise flag
    activity_level = "active" if bool(
        getattr(health, 'Exercise', False) or False) else "sedentary"

    # Probabilities in 0..1 for the prompt
    probs = {
        "cardiovascular_disease": float(getattr(pred, 'CVDChance', 0) or 0) / 100.0,
        "stroke": float(getattr(pred, 'StrokeChance', 0) or 0) / 100.0,
        "diabetes": float(getattr(pred, 'DiabetesChance', 0) or 0) / 100.0,
    }

    sex = "Male" if bool(getattr(health, 'Gender', False)
                         or False) else "Female"

    return {
        "age": int(getattr(health, 'Age', 0) or 0),
        "sex": sex,
        "height_cm": round(height_cm, 1),
        "weight_kg": round(weight_kg, 1),
        "conditions": conditions,
        "activity_level": activity_level,
        "disease_probabilities": probs,
    }


def get_health_recommendations(db_conn: Session, health_data_id: int):
    """
    Generates health recommendations from OpenAI based on real user health
    data and stored prediction probabilities.
    Returns a dict with keys: exercise_recommendation, diet_recommendation, lifestyle_recommendation.
    Falls back to rule-based suggestions if OpenAI is not configured.
    """
    health = db_conn.query(HealthData).filter(
        getattr(HealthData, 'HealthDataID') == health_data_id).first()
    pred = db_conn.query(Prediction).filter(
        getattr(Prediction, 'HealthDataID') == health_data_id).first()

    if not health or not pred:
        return {"error": "Health or prediction data not found."}

    ctx = _build_health_context(health, pred)

    # If OpenAI is not configured, provide a minimal rule-based fallback
    if client is None:
        return _fallback_recommendations(ctx)

    prompt = (
        "You are a medical lifestyle assistant. Based on the following user health data, "
        "generate concise, actionable recommendations. The output MUST be a JSON object with four keys: "
        "\"exercise_recommendation\", \"diet_recommendation\", \"lifestyle_recommendation\", and \"diet_to_avoid_recommendation\".\n\n"
        f"User data:\n"
        f"- Age: {ctx['age']}\n"
        f"- Sex: {ctx['sex']}\n"
        f"- Height: {ctx['height_cm']} cm\n"
        f"- Weight: {ctx['weight_kg']} kg\n"
        f"- Pre-existing conditions: {', '.join(ctx['conditions']) if ctx['conditions'] else 'None'}\n"
        f"- Activity Level: {ctx['activity_level']}\n"
        f"- Disease Probabilities (0-1): {json.dumps(ctx['disease_probabilities'])}\n\n"
        "Guidelines:\n"
        "- Keep each recommendation to 2-4 sentences.\n"
        "- Be practical and safe; avoid medical diagnosis.\n"
        "- Consider risk probabilities and conditions when prioritizing advice.\n"
    )

    try:
        response = client.chat.completions.create(
            model=openai_model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You provide non-diagnostic health lifestyle guidance. Output JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
        )

        content = response.choices[0].message.content if response.choices else None
        if not content:
            raise ValueError("Empty response from OpenAI")

        parsed = json.loads(content)
        return {
            "exercise_recommendation": parsed.get("exercise_recommendation", ""),
            "diet_recommendation": parsed.get("diet_recommendation", ""),
            "lifestyle_recommendation": parsed.get("lifestyle_recommendation", ""),
            "diet_to_avoid_recommendation": parsed.get("diet_to_avoid_recommendation", ""),
        }

    except Exception as e:
        # Log the error and return a graceful fallback
        print(f"Health recommendation generation failed: {e}")
        return _fallback_recommendations(ctx)


def _fallback_recommendations(ctx: Dict):
    """Basic rule-based fallback if OpenAI isn't available or fails."""
    age = ctx.get("age", 0)
    probs = ctx.get("disease_probabilities", {})
    conditions = set(c.lower() for c in ctx.get("conditions", []))

    cardio = probs.get("cardiovascular_disease", 0)
    stroke = probs.get("stroke", 0)
    diabetes = probs.get("diabetes", 0)

    exercise = "Aim for 150 minutes/week of moderate-intensity activity (e.g., brisk walking) split across 3–5 days. "
    if cardio > 0.5 or stroke > 0.4:
        exercise += "Prioritize low-impact cardio and add 2 strength sessions/week; start gradually if currently sedentary. "
    if "smoking" in conditions:
        exercise += "Avoid high-intensity bouts initially; focus on consistency while pursuing smoking cessation. "

    diet = "Adopt a balanced plate: 1/2 non-starchy vegetables, 1/4 lean protein, 1/4 whole grains. Limit processed foods and sugary drinks. "
    if diabetes > 0.4:
        diet += "Prefer low-glycemic carbs, distribute carbs evenly across meals, and monitor portion sizes. "
    if "high cholesterol" in conditions:
        diet += "Increase soluble fiber (oats, legumes) and healthy fats (olive oil, nuts); reduce saturated fats. "

    lifestyle = "Sleep 7–9 hours nightly, manage stress with short daily breathing or mindfulness. Hydrate adequately. "
    if "smoking" in conditions:
        lifestyle += "Begin a smoking cessation plan (nicotine replacement or counseling). "
    if "alcohol use" in conditions:
        lifestyle += "Limit alcohol (≤2 standard drinks/day for men, ≤1 for women; aim for several alcohol-free days/week). "

    diet_to_avoid = "Limit ultra-processed foods, high-sugar desserts, and trans-fat containing snacks. Minimize high-sodium processed meats."
    return {
        "exercise_recommendation": exercise.strip(),
        "diet_recommendation": diet.strip(),
        "lifestyle_recommendation": lifestyle.strip(),
        "diet_to_avoid_recommendation": diet_to_avoid.strip(),
    }
