from datetime import datetime
from decimal import Decimal
from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..utils.database import get_db
from ..models.dbmodels import HealthData, Prediction

router = APIRouter()

# Temporary current user resolver until authentication is implemented
async def get_current_user():
    # TODO: replace with real authentication. For now default to user id 1.
    return {"username": "testuser", "user_id": 1}


class HealthMetric(BaseModel):
    # ISO datetime string of the prediction creation time
    date: str
    month: str
    strokeProbability: float
    cardioProbability: float
    diabetesProbability: float


def _to_float(val) -> float:
    if isinstance(val, Decimal):
        return float(val)
    try:
        return float(val)
    except Exception:
        return 0.0


@router.get("/api/health-analytics", response_model=List[HealthMetric])
async def get_health_analytics(
    current_user: dict = Depends(get_current_user),
    db_conn: Session = Depends(get_db),
):
    """
    Returns time-series health risk probabilities for the current user
    using historical predictions stored in the database.
    """
    user_id = int(current_user.get("user_id", 1))

    # Join predictions with health data to scope by user, order by prediction time
    rows = (
        db_conn.query(
            getattr(Prediction, 'CreatedAt'),
            getattr(Prediction, 'StrokeChance'),
            getattr(Prediction, 'CVDChance'),
            getattr(Prediction, 'DiabetesChance'),
        )
        .join(
            HealthData,
            getattr(Prediction, 'HealthDataID') == getattr(HealthData, 'HealthDataID'),
        )
        .filter(getattr(HealthData, 'UserID') == user_id)
        .order_by(getattr(Prediction, 'CreatedAt').asc())
        .all()
    )

    def month_label(dt: datetime) -> str:
        # e.g., 'Jan 2025' to help distinguish years if data spans multiple years
        try:
            return dt.strftime("%b %Y")
        except Exception:
            return str(dt)

    data: List[HealthMetric] = []
    for created_at, stroke, cvd, diab in rows:
        data.append(
            HealthMetric(
                date=(created_at.isoformat() if isinstance(created_at, datetime) else str(created_at)),
                month=month_label(created_at),
                strokeProbability=_to_float(stroke),
                cardioProbability=_to_float(cvd),
                diabetesProbability=_to_float(diab),
            )
        )

    return data
