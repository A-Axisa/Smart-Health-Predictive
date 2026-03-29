"""Insert dummy data

Revision ID: 8184ee23453b
Revises: 954c38c31b17
Create Date: 2025-10-16 22:53:08.849981

"""
from typing import Sequence, Union
from alembic import op
from models.dbmodels import *

# revision identifiers, used by Alembic.
revision: str = '8184ee23453b'
down_revision: Union[str, Sequence[str], None] = '6ddecd1fff22'
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
        Clinic.__table__,
        [
            {
                'ClinicID': 1,
                'ClinicName': 'MyMock Health Center',
                'CreatedAt': '2025-06-01 15:25:30',
            },
            {
                'ClinicID': 2,
                'ClinicName': 'Some-Sample Clinic',
                'CreatedAt': '2025-08-19 03:10:56',
            },
        ]
    )
    op.bulk_insert(
        UserAccount.__table__,
        [
            # Admin
            {
                'UserID': 1963533055,
                'ClinicID': None,
                'Email': 'SHP_Admin@example.com',
                'PasswordHash': '$argon2id$v=19$m=19456,t=2,p=1$MzTHleFMLuRjzV0EBw5SHw$PMjErE7kYpUJmIzsZrwUj5KNQUXy9XFn+kNYJE4PGms',
                'PhoneNumber': '44758313798',
                'CreatedAt': '2025-03-19 01:53:13',
                'IsValidated': True,
                'TokenVersion': 3141,
            },
            # Standard Users
            {
                'UserID': 151742614,
                'ClinicID': None,
                'Email': 'audrey.young@example.com',
                'PasswordHash': '$argon2id$v=19$m=19456,t=2,p=1$4v/iZ3p/DIU3rCRgglMkxA$toBUsW8SlGSTu9Tda8dNl0YA8CuxU5rRwOHkumT5mJI',
                'PhoneNumber': '19171025615',
                'CreatedAt': '2025-05-13 05:24:31',
                'IsValidated': True,
                'TokenVersion': 101,
            },
            {
                'UserID': 68849883,
                'ClinicID': None,
                'Email': 'steven.wallace@example.com',
                'PasswordHash': '$argon2id$v=19$m=19456,t=2,p=1$FwZ41MhT/pXK2NgWJdszOg$dinqjoOrdaqLC9RKPeTvAlemF+ID8fHwSQUS6Kcp5RM',
                'PhoneNumber': '18057045603',
                'CreatedAt': '2025-05-27 20:07:55',
                'IsValidated': True,
                'TokenVersion': 16,
            },
            {
                'UserID': 1424460213,
                'ClinicID': None,
                'Email': 'adam.peake@example.com',
                'PasswordHash': '$argon2id$v=19$m=19456,t=2,p=1$6TmC4/zjkbQHyDWjGVNNgQ$w+KD+s5F/fzosD/hOlMn6ATxrPDBAHcxGx/pOmhIEuo',
                'PhoneNumber': '4915194494606',
                'CreatedAt': '2025-07-04 11:41:03',
                'IsValidated': True,
                'TokenVersion': 42,
            },
            {
                'UserID': 938812579,
                'ClinicID': None,
                'Email': 'keith.hart@example.com',
                'PasswordHash': '$argon2id$v=19$m=19456,t=2,p=1$sgnaZDdqHKon7+ISKcQPMw$dn8vgiUBe/wt21A1TcoY6wjD45gbETh7kUYcx9QEjuw',
                'PhoneNumber': '61463531525',
                'CreatedAt': '2025-09-22 00:30:22',
                'IsValidated': True,
                'TokenVersion': 7,
            },
            # Merchant Users
            {
                'UserID': 401920695,
                'ClinicID': 1,
                'Email': 'service@example.com',
                'PasswordHash': '$argon2id$v=19$m=19456,t=2,p=1$wMVYCUJFnwOnZUWlFdJuIQ$rAp4FpSkBV7I8hkGnDVGk65TOgvh5ImnfcEudOdqGFQ',
                'PhoneNumber': '61492923497',
                'CreatedAt': '2025-06-01 15:25:30',
                'IsValidated': True,
                'TokenVersion': 312,
            },
            {
                'UserID': 120989818,
                'ClinicID': 2,
                'Email': 'analysis@example.com',
                'PasswordHash': '$argon2id$v=19$m=19456,t=2,p=1$w8NXy+fYpIeVfptmwOCBVw$KwAiNvGR5grygFKoE2Ka+X+WzDNKod3fMUjOQ1C5Vvc',
                'PhoneNumber': '819029061947',
                'CreatedAt': '2025-08-19 03:10:56',
                'IsValidated': True,
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
                'AssignedAt': '2025-03-19 01:53:13',
            },
            {
                'RoleID': 331928555,
                'UserID': 151742614,
                'AssignedAt': '2025-05-13 05:24:31',
            },
            {
                'RoleID': 331928555,
                'UserID': 68849883,
                'AssignedAt': '2025-05-27 20:07:55',
            },
            {
                'RoleID': 331928555,
                'UserID': 1424460213,
                'AssignedAt': '2025-07-04 11:41:03',
            },
            {
                'RoleID': 331928555,
                'UserID': 938812579,
                'AssignedAt': '2025-09-22 00:30:22',
            },
            {
                'RoleID': 62809281,
                'UserID': 401920695,
                'AssignedAt': '2025-06-01 15:25:30',
            },
            {
                'RoleID': 62809281,
                'UserID': 120989818,
                'AssignedAt': '2025-08-19 03:10:56',
            },
        ]
    )
    op.bulk_insert(
        Patient.__table__,
        [
            {
                'PatientID': 1,
                'UserID': 151742614,
                'GivenNames': 'Audrey',
                'FamilyName': 'Young',
                'Gender': 1,
                'Weight': 65.0,
                'Height': 170,
                'DateOfBirth': '1994-01-01',
                'CreatedAt': '2025-05-13 05:24:31',
            },
            {
                'PatientID': 2,
                'UserID': 68849883,
                'GivenNames': 'Steven',
                'FamilyName': 'Wallace',
                'Gender': 1,
                'Weight': 48.5,
                'Height': 150,
                'DateOfBirth': '2001-01-01',
                'CreatedAt': '2025-05-27 20:07:55',
            },
            {
                'PatientID': 3,
                'UserID': 1424460213,
                'GivenNames': 'Adam',
                'FamilyName': 'Peake',
                'Gender': 1,
                'Weight': 83.7,
                'Height': 160,
                'DateOfBirth': '1982-01-01',
                'CreatedAt': '2025-07-04 11:41:03',
            },
            {
                'PatientID': 4,
                'UserID': 938812579,
                'GivenNames': 'Keith',
                'FamilyName': 'Hart',
                'Gender': 1,
                'Weight': 70.0,
                'Height': 175,
                'DateOfBirth': '1990-01-01',
                'CreatedAt': '2025-09-22 00:30:22',
            },
        ]
    )

    op.bulk_insert(
        UserPatientAccess.__table__,
        [
            {
                'UserID': 401920695,
                'PatientID': 1,
                'CreatedAt': '2025-06-01 15:30:00',
            },
            {
                'UserID': 401920695,
                'PatientID': 2,
                'CreatedAt': '2025-06-01 15:30:01',
            },

            {
                'UserID': 120989818,
                'PatientID': 3,
                'CreatedAt': '2025-08-19 03:20:00',
            },
            {
                'UserID': 120989818,
                'PatientID': 4,
                'CreatedAt': '2025-08-19 03:20:01',
            },
        ]
    )

    op.bulk_insert(
        HealthData.__table__,
        [
            {
                'HealthDataID': 1795457253,
                'PatientID': 1,
                'Age': 31,
                'WeightKilograms': 65.0,
                'HeightCentimetres': 170,
                'Gender': True,
                'BloodGlucose': 4.5,
                'APHigh': 130.0,
                'APLow': 120.0,
                'HighCholesterol': False,
                'HyperTension': True,
                'HeartDisease': False,
                'Diabetes': False,
                'Alcohol': False,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-05-13 05:54:31',
            },
            {
                'HealthDataID': 94751102,
                'PatientID': 1,
                'Age': 31,
                'WeightKilograms': 65.3,
                'HeightCentimetres': 170,
                'Gender': True,
                'BloodGlucose': 5.6,
                'APHigh': 135.0,
                'APLow': 123.0,
                'HighCholesterol': False,
                'HyperTension': True,
                'HeartDisease': False,
                'Diabetes': False,
                'Alcohol': False,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-06-10 03:02:45',
            },
            {
                'HealthDataID': 640740242,
                'PatientID': 1,
                'Age': 31,
                'WeightKilograms': 64.4,
                'HeightCentimetres': 170,
                'Gender': True,
                'BloodGlucose': 4.3,
                'APHigh': 132.0,
                'APLow': 131.0,
                'HighCholesterol': False,
                'HyperTension': True,
                'HeartDisease': False,
                'Diabetes': False,
                'Alcohol': False,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-07-15 06:32:04',
            },
            {
                'HealthDataID': 1009923657,
                'PatientID': 1,
                'Age': 31,
                'WeightKilograms': 64.8,
                'HeightCentimetres': 170,
                'Gender': True,
                'BloodGlucose': 4.8,
                'APHigh': 136.0,
                'APLow': 127.0,
                'HighCholesterol': False,
                'HyperTension': True,
                'HeartDisease': False,
                'Diabetes': False,
                'Alcohol': False,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-08-18 14:21:27',
            },
            {
                'HealthDataID': 1323241858,
                'PatientID': 1,
                'Age': 31,
                'WeightKilograms': 66.2,
                'HeightCentimetres': 170,
                'Gender': True,
                'BloodGlucose': 7.1,
                'APHigh': 140.0,
                'APLow': 128.0,
                'HighCholesterol': False,
                'HyperTension': True,
                'HeartDisease': False,
                'Diabetes': False,
                'Alcohol': True,
                'SmokingStatus': 0,
                'MaritalStatus': 1,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-09-14 05:32:56',
            },
            {
                'HealthDataID': 504567277,
                'PatientID': 1,
                'Age': 31,
                'WeightKilograms': 69.2,
                'HeightCentimetres': 170,
                'Gender': True,
                'BloodGlucose': 7.2,
                'APHigh': 139.0,
                'APLow': 131.0,
                'HighCholesterol': False,
                'HyperTension': True,
                'HeartDisease': False,
                'Diabetes': False,
                'Alcohol': True,
                'SmokingStatus': 1,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-10-05 07:14:08',
            },
            {
                'HealthDataID': 1321508180,
                'PatientID': 2,
                'Age': 24,
                'WeightKilograms': 48.5,
                'HeightCentimetres': 150,
                'Gender': True,
                'BloodGlucose': 5.6,
                'APHigh': 155.0,
                'APLow': 118.2,
                'HighCholesterol': False,
                'HyperTension': False,
                'HeartDisease': True,
                'Diabetes': False,
                'Alcohol': False,
                'SmokingStatus': 0,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-05-27 20:08:09',
            },
            {
                'HealthDataID': 1041945971,
                'PatientID': 2,
                'Age': 24,
                'WeightKilograms': 45.3,
                'HeightCentimetres': 150,
                'Gender': True,
                'BloodGlucose': 4.8,
                'APHigh': 163.1,
                'APLow': 109.5,
                'HighCholesterol': False,
                'HyperTension': False,
                'HeartDisease': True,
                'Diabetes': False,
                'Alcohol': True,
                'SmokingStatus': 0,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-08-03 19:10:12',
            },
            {
                'HealthDataID': 2099391310,
                'PatientID': 2,
                'Age': 24,
                'WeightKilograms': 62.7,
                'HeightCentimetres': 150,
                'Gender': True,
                'BloodGlucose': 4.3,
                'APHigh': 205.6,
                'APLow': 175.9,
                'HighCholesterol': True,
                'HyperTension': True,
                'HeartDisease': True,
                'Diabetes': True,
                'Alcohol': False,
                'SmokingStatus': 0,
                'MaritalStatus': 0,
                'WorkingStatus': 1,
                'Stroke': 0,
                'CreatedAt': '2025-08-29 15:32:45',
            },
            {
                'HealthDataID': 1268867211,
                'PatientID': 3,
                'Age': 62,
                'WeightKilograms': 83.7,
                'HeightCentimetres': 160,
                'Gender': True,
                'BloodGlucose': 8.1,
                'APHigh': 180.6,
                'APLow': 110.9,
                'HighCholesterol': True,
                'HyperTension': True,
                'HeartDisease': True,
                'Diabetes': True,
                'Alcohol': True,
                'SmokingStatus': 1,
                'MaritalStatus': 1,
                'WorkingStatus': 0,
                'Stroke': 0,
                'CreatedAt': '2025-07-04 11:45:56',
            },
            {
                'HealthDataID': 1978933213,
                'PatientID': 3,
                'Age': 63,
                'WeightKilograms': 87.1,
                'HeightCentimetres': 160,
                'Gender': True,
                'BloodGlucose': 7.2,
                'APHigh': 185.6,
                'APLow': 145.4,
                'HighCholesterol': True,
                'HyperTension': True,
                'HeartDisease': True,
                'Diabetes': True,
                'Alcohol': True,
                'SmokingStatus': 1,
                'MaritalStatus': 1,
                'WorkingStatus': 0,
                'Stroke': 0,
                'CreatedAt': '2025-08-22 08:10:34',
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
            {
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
                'PredictionID': 1098100917,
                'HealthDataID': 2099391310,
                'StrokeChance': 24,
                'DiabetesChance': 19.75,
                'CVDChance': 2,
                'CreatedAt': '2025-08-29 15:32:50',
            },
            {
                'PredictionID': 993604216,
                'HealthDataID': 1268867211,
                'StrokeChance': 24.0,
                'DiabetesChance': 17.8,
                'CVDChance': 6.0,
                'CreatedAt': '2025-07-04 11:46:25',
            },
            {
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
