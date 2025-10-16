"""Insert dummy data

Revision ID: 8184ee23453b
Revises: 1b51e10b1607
Create Date: 2025-10-16 22:53:08.849981

"""
from typing import Sequence, Union
from alembic import op
from models.dbmodels import *

# revision identifiers, used by Alembic.
revision: str = '8184ee23453b'
down_revision: Union[str, Sequence[str], None] = '1b51e10b1607'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.bulk_insert(
        AccountRole.__table__, 
        [
            {
                'RoleID': 1901881405,
                'RoleName': 'admin',
            },
            {
                'RoleID': 331928555,
                'RoleName': 'standard_user',
            },
            {
                'RoleID': 62809281,
                'RoleName': 'merchant',
            },
        ]
    )

    op.bulk_insert(
        UserAccount.__table__, 
        [
            {
                'UserID': 1963533055,
                'FullName': 'SHP-Head-Admin',
                'Email': 'SHP_Admin@busimail.com',
                'PasswordHash' : '$2b$15$ekun6872qM4ayNJbsQsETO2fED7SY5CsJYw00BbLb1UDrKoBiRl2K',
                'PhoneNumber': '44758313798',
                'CreatedAt': '2025-03-19 01:53:13',
                'Validated': True,
                'TokenVersion': 3141,
            },
            {
                'UserID': 151742614,
                'FullName': 'Audrey Young',
                'Email': 'audrey.young@mockmail.com',
                'PasswordHash' : '$2b$15$vNsnWzyYk3.xk6hCcfUcYuE0.blXtKSHWoFFEL2gx48XCViBMr87S',
                'PhoneNumber': '19171025615',
                'CreatedAt': '2025-05-13 05:24:31',
                'Validated': True,
                'TokenVersion': 101,
            },
            {
                'UserID': 68849883,
                'FullName': 'Steven Wallace',
                'Email': 'steven.wallace@mockmail.com',
                'PasswordHash' : '$2b$15$9q1j6AvupOu3C4dRSDsv..JBGeBkE91oOVHDARL8rVQZFscqnHXEO',
                'PhoneNumber': '18057045603',
                'CreatedAt': '2025-05-27 20:07:55',
                'Validated': True,
                'TokenVersion': 16,
            },
            {
                'UserID': 1424460213,
                'FullName': 'Adam Peake',
                'Email': 'adam.peake@teepost.com',
                'PasswordHash' : '$2b$15$.ZJLl4X3h3Z15oIIucWoOOFakZOQ4MvqtqwoDJ6wqXUX7NXpA82KK',
                'PhoneNumber': '4915194494606',
                'CreatedAt': '2025-07-04 11:41:03',
                'Validated': True,
                'TokenVersion': 42,
            },
            {
                'UserID': 938812579,
                'FullName': 'Keith Hart',
                'Email': 'keith.hart@inlook.com',
                'PasswordHash' : '$2b$15$u94J57mmYqjGBrGwOqS6lO9f0Dh28VnboT7bdEiu4zObKiAPNmjOG',
                'PhoneNumber': '61463531525',
                'CreatedAt': '2025-09-22 00:30:22',
                'Validated': True,
                'TokenVersion': 7,
            },
            {
                'UserID': 401920695,
                'FullName': 'MyMock Health Center',
                'Email': 'service@mymo.com',
                'PasswordHash' : '$2b$15$04gH6ssM5h/lefF1u9RxnO1e.k1fTH/ZaH73NFw.ZYcw3l/nxWlM6',
                'PhoneNumber': '61492923497',
                'CreatedAt': '2025-06-01 15:25:30',
                'Validated': True,
                'TokenVersion': 312,
            },
            {
                'UserID': 120989818,
                'FullName': 'Some-Sample Clinic',
                'Email': 'analysis@some.com',
                'PasswordHash' : '$2b$15$JlqYLN7li1qTgdSCcb.cKuWR09485.tnieY/NSN0ZRSKWhT9Iddt2',
                'PhoneNumber': '819029061947',
                'CreatedAt': '2025-08-19 03:10:56',
                'Validated': True,
                'TokenVersion': 199,
            },
        ]
    )

    op.bulk_insert(
        UserAccountRole.__table__,
        [
            {
                'RoleID': 1901881405,
                'UserID': 1963533055,
                'AssignedAt':'2025-03-19 01:53:13',
            },
            {
                'RoleID': 331928555,
                'UserID': 151742614,
                'AssignedAt':'2025-05-13 05:24:31',
            },
            {
                'RoleID': 331928555,
                'UserID': 68849883,
                'AssignedAt':'2025-05-27 20:07:55',
            },
            {
                'RoleID': 331928555,
                'UserID': 1424460213,
                'AssignedAt':'2025-07-04 11:41:03',
            },
            {
                'RoleID': 331928555,
                'UserID': 938812579,
                'AssignedAt':'2025-09-22 00:30:22',
            },
            {
                'RoleID': 62809281,
                'UserID': 401920695,
                'AssignedAt':'2025-06-01 15:25:30',
            },
            {
                'RoleID': 62809281,
                'UserID': 120989818,
                'AssignedAt':'2025-08-19 03:10:56',
            },
        ]
    )

    op.bulk_insert(
        HealthData.__table__,
        [
            {
                'HealthDataID': 1795457253,
                'UserID': 151742614,
                'Age': 31,
                'WeightInKilograms': 65.0,
                'HeightMeters': 1.7,
                'Gender': 1,
                'BloodGlucose': 4.5,
                'APHigh': 130.0,
                'APLow': 120.0,
                'HighCholesterol': 0,
                'Exercise': 1,
                'HyperTension': 1,
                'HeartDisease': 0,
                'Diabetes': 0,
                'Alcohol': 0,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'CreatedAt': '2025-05-13 05:54:31',
                'MerchantID': None,
            },
            {
                'HealthDataID': 94751102,
                'UserID': 151742614,
                'Age': 31,
                'WeightInKilograms': 65.3,
                'HeightMeters': 1.7,
                'Gender': 1,
                'BloodGlucose': 5.6,
                'APHigh': 135.0,
                'APLow': 123.0,
                'HighCholesterol': 0,
                'Exercise': 1,
                'HyperTension': 1,
                'HeartDisease': 0,
                'Diabetes': 0,
                'Alcohol': 0,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'CreatedAt': '2025-06-10 03:02:45',
                'MerchantID': None,
            },
            {
                'HealthDataID': 640740242,
                'UserID': 151742614,
                'Age': 31,
                'WeightInKilograms': 64.4,
                'HeightMeters': 1.7,
                'Gender': 1,
                'BloodGlucose': 4.3,
                'APHigh': 132.0,
                'APLow': 131.0,
                'HighCholesterol': 0,
                'Exercise': 1,
                'HyperTension': 1,
                'HeartDisease': 0,
                'Diabetes': 0,
                'Alcohol': 0,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'CreatedAt': '2025-07-15 06:32:04',
                'MerchantID': None,
            },
            {
                'HealthDataID': 1009923657,
                'UserID': 151742614,
                'Age': 31,
                'WeightInKilograms': 64.8,
                'HeightMeters': 1.7,
                'Gender': 1,
                'BloodGlucose': 4.8,
                'APHigh': 136.0,
                'APLow': 127.0,
                'HighCholesterol': 0,
                'Exercise': 1,
                'HyperTension': 1,
                'HeartDisease': 0,
                'Diabetes': 0,
                'Alcohol': 0,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'CreatedAt': '2025-08-18 14:21:27',
                'MerchantID': None,
            },
            {
                'HealthDataID': 1323241858,
                'UserID': 151742614,
                'Age': 31,
                'WeightInKilograms': 66.2,
                'HeightMeters': 1.7,
                'Gender': 1,
                'BloodGlucose': 7.1,
                'APHigh': 1140.0,
                'APLow': 128.0,
                'HighCholesterol': 0,
                'Exercise': 0,
                'HyperTension': 1,
                'HeartDisease': 0,
                'Diabetes': 0,
                'Alcohol': 1,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'CreatedAt': '2025-09-14 05:32:56',
                'MerchantID': None,
            },
            {
                'HealthDataID': 504567277,
                'UserID': 151742614,
                'Age': 31,
                'WeightInKilograms': 69.2,
                'HeightMeters': 1.7,
                'Gender': 1,
                'BloodGlucose': 7.2,
                'APHigh': 139.0,
                'APLow': 131.0,
                'HighCholesterol': 0,
                'Exercise': 0,
                'HyperTension': 1,
                'HeartDisease': 0,
                'Diabetes': 0,
                'Alcohol': 1,
                'SmokingStatus': 1,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'CreatedAt': '2025-10-05 07:14:08',
                'MerchantID': None,
            },
            {
                'HealthDataID': 1321508180,
                'UserID': 68849883,
                'Age': 24,
                'WeightInKilograms': 48.5,
                'HeightMeters': 1.5,
                'Gender': 1,
                'BloodGlucose': 5.6,
                'APHigh': 155.0,
                'APLow': 118.2,
                'HighCholesterol': 0,
                'Exercise': 1,
                'HyperTension': 0,
                'HeartDisease': 1,
                'Diabetes': 0,
                'Alcohol': 0,
                'SmokingStatus': 0,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'CreatedAt': '2025-05-27 20:08:09',
                'MerchantID': 401920695,
            },
            {
                'HealthDataID': 1041945971,
                'UserID': 68849883,
                'Age': 24,
                'WeightInKilograms': 45.3,
                'HeightMeters': 1.5,
                'Gender': 1,
                'BloodGlucose': 4.8,
                'APHigh': 163.1,
                'APLow': 109.5,
                'HighCholesterol': 0,
                'Exercise': 1,
                'HyperTension': 0,
                'HeartDisease': 1,
                'Diabetes': 0,
                'Alcohol': 1,
                'SmokingStatus': 0,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'CreatedAt': '2025-08-03 19:10:12',
                'MerchantID': 401920695,
            },
            {
                'HealthDataID': 2099391310,
                'UserID': 68849883,
                'Age': 24,
                'WeightInKilograms': 62.7,
                'HeightMeters': 1.5,
                'Gender': 1,
                'BloodGlucose': 4.3,
                'APHigh': 205.6,
                'APLow': 175.9,
                'HighCholesterol': 1,
                'Exercise': 0,
                'HyperTension': 1,
                'HeartDisease': 1,
                'Diabetes': 1,
                'Alcohol': 0,
                'SmokingStatus': 0,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'CreatedAt': '2025-08-29 15:32:45',
                'MerchantID': 401920695,
            },
            {#
                'HealthDataID': 1268867211,
                'UserID': 1424460213,
                'Age': 62,
                'WeightInKilograms': 83.7,
                'HeightMeters': 1.6,
                'Gender': 1,
                'BloodGlucose': 8.1,
                'APHigh': 180.6,
                'APLow': 110.9,
                'HighCholesterol': 1,
                'Exercise': 0,
                'HyperTension': 1,
                'HeartDisease': 1,
                'Diabetes': 1,
                'Alcohol': 1,
                'SmokingStatus': 1,
                'MaritalStatus': 1,
                'WorkingStatus': 0,
                'CreatedAt': '2025-07-04 11:45:56',
                'MerchantID': 401920695,
            },
            {
                'HealthDataID': 1978933213,
                'UserID': 1424460213,
                'Age': 63,
                'WeightInKilograms': 87.1,
                'HeightMeters': 1.6,
                'Gender': 1,
                'BloodGlucose': 7.2,
                'APHigh': 185.6,
                'APLow': 145.4,
                'HighCholesterol': 1,
                'Exercise': 0,
                'HyperTension': 1,
                'HeartDisease': 1,
                'Diabetes': 1,
                'Alcohol': 1,
                'SmokingStatus': 1,
                'MaritalStatus': 1,
                'WorkingStatus': 0,
                'CreatedAt': '2025-08-22 08:10:34',
                'MerchantID': 401920695,
            },
        ]
    )

    op.bulk_insert(
        Prediction.__table__,
        [
            {
                'PredictionID': 637025531,
                'HealthDataID': 1795457253,
                'StrokeChance': 9.2,
                'DiabetesChance': 4.6,
                'CVDChance': 12.5,
                'CreatedAt': '2025-05-13 05:54:52',
            },
            {
                'PredictionID': 1235765969,
                'HealthDataID': 94751102,
                'StrokeChance': 10.8,
                'DiabetesChance': 4.2,
                'CVDChance': 15.8,
                'CreatedAt': '2025-06-10 03:02:58',
            },
            {
                'PredictionID': 567592464,
                'HealthDataID': 640740242,
                'StrokeChance': 9.8,
                'DiabetesChance': 4.4,
                'CVDChance': 13.9,
                'CreatedAt': '2025-07-15 06:32:49',
            },
            {
                'PredictionID': 1936228579,
                'HealthDataID': 1009923657,
                'StrokeChance': 9.3,
                'DiabetesChance': 3.9,
                'CVDChance': 10.2,
                'CreatedAt': '2025-08-18 14:22:01',
            },
            {
                'PredictionID': 1343474346,
                'HealthDataID': 1323241858,
                'StrokeChance': 19.5,
                'DiabetesChance': 8.4,
                'CVDChance': 22.5,
                'CreatedAt': '2025-09-14 05:33:34',
            },
            {
                'PredictionID': 216360073,
                'HealthDataID': 504567277,
                'StrokeChance': 25.6,
                'DiabetesChance': 11.1,
                'CVDChance': 38.5,
                'CreatedAt': '2025-10-05 07:14:35',
            },
            { #
                'PredictionID': 1230172781,
                'HealthDataID': 1321508180,
                'StrokeChance': 4.2,
                'DiabetesChance': 1.8,
                'CVDChance': 5.2,
                'CreatedAt': '2025-05-27 20:08:32',
            },
            {
                'PredictionID': 2128264698,
                'HealthDataID': 1041945971,
                'StrokeChance': 3.1,
                'DiabetesChance': 0.5,
                'CVDChance': 7.3,
                'CreatedAt': '2025-08-03 19:11:09',
            },
            {
                'PredictionID': 216360073,
                'HealthDataID': 2099391310,
                'StrokeChance': 24,
                'DiabetesChance': 19.75,
                'CVDChance': 2,
                'CreatedAt': '2025-08-29 15:32:50',
            },
            {#
                'PredictionID': 993604216,
                'HealthDataID': 1268867211,
                'StrokeChance': 24.0,
                'DiabetesChance': 17.8,
                'CVDChance': 6.0,
                'CreatedAt': '2025-07-04 11:46:25',
            },
            {#
                'PredictionID': 2056850454,
                'HealthDataID': 1978933213,
                'StrokeChance': 24,
                'DiabetesChance': 16.01,
                'CVDChance': 6,
                'CreatedAt': '2025-08-22 08:12:11',
            },
        ]
    )

    op.bulk_insert(
        Recommendation.__table__,
        [
            {
                'RecommendationID': 1005386487,
                'HealthDataID': 1795457253,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) split across'
                    ' 3–5 days.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy'
                    ' vegetables, 1/4 lean protein, 1/4 whole grains. Limit '
                    'processed foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage stress '
                    'with short daily breathing or mindfulness. Hydrate adequately.',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, '
                    'high-sugar desserts, and trans-fat containing snacks. '
                    'Minimize high-sodium processed meats',
                'CreatedAt': '2025-05-13 05:54:52',
            },
            {
                'RecommendationID': 1056929856,
                'HealthDataID': 94751102,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) split across'
                    ' 3–5 days.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy '
                    'vegetables, 1/4 lean protein, 1/4 whole grains. Limit processed'
                    ' foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage stress '
                    'with short daily breathing or mindfulness. Hydrate adequately.',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, '
                    'high-sugar desserts, and trans-fat containing snacks. Minimize '
                    'high-sodium processed meats.',
                'CreatedAt': '2025-06-10 03:02:58',
            },
            {
                'RecommendationID': 596068245,
                'HealthDataID': 640740242,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) '
                    'split across 3–5 days.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy '
                    'vegetables, 1/4 lean protein, 1/4 whole grains. Limit '
                    'processed foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage '
                    'stress with short daily breathing or mindfulness. '
                    'Hydrate adequately.',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, '
                    'high-sugar desserts, and trans-fat containing snacks. '
                    'Minimize high-sodium processed meats.',
                'CreatedAt': '2025-07-15 06:32:49',
            },
            {
                'RecommendationID': 2082480999,
                'HealthDataID': 1009923657,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) '
                    'split across 3–5 days.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy '
                    'vegetables, 1/4 lean protein, 1/4 whole grains. Limit processed'
                    ' foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage stress '
                    'with short daily breathing or mindfulness. Hydrate adequately.',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium'
                    ' processed meats.',
                'CreatedAt': '2025-08-18 14:22:01',
            },
            {
                'RecommendationID': 976239700,
                'HealthDataID': 1323241858,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) '
                    'split across 3–5 days.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy '
                    'vegetables, 1/4 lean protein, 1/4 whole grains. Limit '
                    'processed foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage stress '
                    'with short daily breathing or mindfulness. Hydrate adequately.'
                    ' Limit alcohol (≤2 standard drinks/day for men, ≤1 for women; '
                    'aim for several alcohol-free days/week).',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium'
                    ' processed meats.',
                'CreatedAt': '2025-09-14 05:33:34',
            },
            {
                'RecommendationID': 811797893,
                'HealthDataID': 504567277,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) split across '
                    '3–5 days. Avoid high-intensity bouts initially; focus on '
                    'consistency while pursuing smoking cessation.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy '
                    'vegetables, 1/4 lean protein, 1/4 whole grains. Limit processed '
                    'foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage stress '
                    'with short daily breathing or mindfulness. Hydrate adequately. '
                    'Begin a smoking cessation plan (nicotine replacement or '
                    'counseling). Limit alcohol (≤2 standard drinks/day for men, ≤1 '
                    'for women; aim for several alcohol-free days/week).',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium'
                    ' processed meats.',
                'CreatedAt': '2025-10-05 07:14:35',
            },
            {
                'RecommendationID': 1691235581,
                'HealthDataID': 1321508180,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) '
                    'split across 3–5 days.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy'
                    ' vegetables, 1/4 lean protein, 1/4 whole grains. Limit '
                    'processed foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage '
                    'stress with short daily breathing or mindfulness. Hydrate '
                    'adequately.',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium '
                    'processed meats.',
                'CreatedAt': '2025-05-27 20:08:32',
            },
            {
                'RecommendationID': 1649562067,
                'HealthDataID': 1041945971,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) '
                    'split across 3–5 days.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy'
                    ' vegetables, 1/4 lean protein, 1/4 whole grains. Limit '
                    'processed foods and sugary drinks.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage '
                    'stress with short daily breathing or mindfulness. Hydrate'
                    ' adequately. Limit alcohol (≤2 standard drinks/day for '
                    'men, ≤1 for women; aim for several alcohol-free days/week).',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium'
                    ' processed meats.',
                'CreatedAt': '2025-08-03 19:11:09',
            },
            {
                'RecommendationID': 752466509,
                'HealthDataID': 2099391310,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) '
                    'split across 3–5 days',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy'
                    ' vegetables, 1/4 lean protein, 1/4 whole grains. Limit '
                    'processed foods and sugary drinks. Increase soluble fiber'
                    ' (oats, legumes) and healthy fats (olive oil, nuts); '
                    'reduce saturated fats.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage'
                    ' stress with short daily breathing or mindfulness. Hydrate'
                    ' adequately.',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium'
                    ' processed meats.',
                'CreatedAt': '2025-08-29 15:32:50',
            },
            {
                'RecommendationID': 1985884499,
                'HealthDataID': 1268867211,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) split across '
                    '3–5 days. Avoid high-intensity bouts initially; focus on '
                    'consistency while pursuing smoking cessation.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy '
                    'vegetables, 1/4 lean protein, 1/4 whole grains. Limit processed'
                    ' foods and sugary drinks. Increase soluble fiber '
                    '(oats, legumes) and healthy fats (olive oil, nuts); reduce '
                    'saturated fats.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage stress '
                    'with short daily breathing or mindfulness. Hydrate adequately.'
                    ' Begin a smoking cessation plan (nicotine replacement or '
                    'counseling). Limit alcohol (≤2 standard drinks/day for men, ≤1 '
                    'for women; aim for several alcohol-free days/week).',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium'
                    ' processed meats.',
                'CreatedAt': '2025-07-04 11:48:11',
            },
            {
                'RecommendationID': 1127231407,
                'HealthDataID': 1978933213,
                'ExerciseRecommendation': 'Aim for 150 minutes/week of '
                    'moderate-intensity activity (e.g., brisk walking) '
                    'split across 3–5 days. Avoid high-intensity bouts '
                    'initially; focus on consistency while pursuing smoking '
                    'cessation.',
                'DietRecommendation': 'Adopt a balanced plate: 1/2 non-starchy'
                    ' vegetables, 1/4 lean protein, 1/4 whole grains. Limit '
                    'processed foods and sugary drinks. Increase soluble fiber '
                    '(oats, legumes) and healthy fats (olive oil, nuts); reduce '
                    'saturated fats.',
                'LifestyleRecommendation': 'Sleep 7–9 hours nightly, manage stress '
                    'with short daily breathing or mindfulness. Hydrate adequately.'
                    ' Begin a smoking cessation plan (nicotine replacement or '
                    'counseling). Limit alcohol (≤2 standard drinks/day for men, ≤1'
                    ' for women; aim for several alcohol-free days/week).',
                'DietToAvoidRecommendation': 'Limit ultra-processed foods, high-sugar'
                    ' desserts, and trans-fat containing snacks. Minimize high-sodium'
                    ' processed meats.',
                'CreatedAt': '2025-08-22 08:12:55',
            },
        ]
    )

def downgrade() -> None:

    pass
