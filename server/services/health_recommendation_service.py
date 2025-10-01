import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

openai_api_key = os.environ.get("OPENAI_API_KEY")
openai_api_base = os.environ.get("OPENAI_API_BASE")

if openai_api_base:
    client = OpenAI(api_key=openai_api_key, base_url=openai_api_base)
else:
    client = OpenAI(api_key=openai_api_key)

def get_health_recommendations(user_id: int):
    """
    Generates health recommendations for a user based on their data.
    
    This is a placeholder function. In a real implementation, this function
    would fetch user's health data from the database.
    """
    # --- Placeholder for database access ---
    # In a real application, you would fetch the user's health data from the database.
    # For example:
    # user_health_data = db.query(UserHealthProfile).filter(UserHealthProfile.user_id == user_id).first()
    # if not user_health_data:
    #     return None
    # For now, we'll use mock data.
    user_health_data = {
        "age": 45,
        "sex": "Female",
        "height": 165, # cm
        "weight": 70, # kg
        "conditions": ["Alcohol, Smoking"],
        "activity_level": "light",
        "disease_probabilities": {
            "cardiovascular_disease": 0.6,
            "stroke": 0.4,
            "kidney_disease": 0.3
        }
    }
    # --- End of placeholder ---

    prompt = f"""
    Based on the following user health data, generate personalized recommendations for exercise, diet, and lifestyle.
    The output MUST be a JSON object with three keys: "exercise_recommendation", "diet_recommendation", and "lifestyle_recommendation".

    User data:
    - Age: {user_health_data['age']}
    - Sex: {user_health_data['sex']}
    - Height: {user_health_data['height']} cm
    - Weight: {user_health_data['weight']} kg
    - Pre-existing conditions: {', '.join(user_health_data['conditions'])}
    - Activity Level: {user_health_data['activity_level']}
    - Disease Probabilities: {json.dumps(user_health_data['disease_probabilities'])}

    Please provide concise and actionable advice for each category in English.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-5-mini",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides health recommendations based on user data. You must output your response as a JSON object."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        
        recommendations_content = response.choices[0].message.content

        # The response from OpenAI should be a JSON string.
        if recommendations_content is None:
            raise ValueError("No content received from OpenAI response.")
        parsed_recommendations = json.loads(recommendations_content)
        
        exercise_recommendation = parsed_recommendations.get("exercise_recommendation", "")
        diet_recommendation = parsed_recommendations.get("diet_recommendation", "")
        lifestyle_recommendation = parsed_recommendations.get("lifestyle_recommendation", "")

        return {
            "exercise_recommendation": exercise_recommendation,
            "diet_recommendation": diet_recommendation,
            "lifestyle_recommendation": lifestyle_recommendation
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return {
            "error": "Failed to generate health recommendations."
        }

if __name__ == '__main__':
    # This is for testing the function directly.
    recommendations = get_health_recommendations(user_id=1)
    if "error" not in recommendations:
        print("--- Health Recommendations ---")
        print("\n[Exercise Recommendation]")
        print(recommendations["exercise_recommendation"])
        print("\n[Diet Recommendation]")
        print(recommendations["diet_recommendation"])
        print("\n[Lifestyle Recommendation]")
        print(recommendations["lifestyle_recommendation"])
        print("\n--------------------------")
    else:
        print(recommendations["error"])
