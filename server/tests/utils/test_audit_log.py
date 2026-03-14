import pytest
from ...models.dbmodels import AuditLog, LogEventType
from ...utils.audit_log import write_audit_log
from ...utils.database import get_db


@pytest.fixture(scope="module", autouse=True)
def db_conn():
    db = next(get_db())

    # Delete any existing logs before tests.
    db.query(AuditLog).delete()
    db.commit()

    yield db

    # Clean up after tests.
    db.query(AuditLog).delete()
    db.commit()


def test_write_audit_log_stores_correct_values(db_conn):
    write_audit_log(
        db_conn=db_conn,
        eventType=LogEventType.LOGIN,
        success=True,
        userEmail="test@test.com",
        ipAddress="127.0.0.1",
        device="Mozilla",
        description="Successful login attempt."
    )
    log = db_conn.query(AuditLog).filter_by(UserEmail="test@test.com").first()
    assert log is not None
    assert log.EventType == "LOGIN"
    assert log.Success is True
    assert log.UserEmail == "test@test.com"
    assert log.IPAddress == "127.0.0.1"
    assert log.Device == "Mozilla"
    assert log.Description == "Successful login attempt."


def test_write_audit_log_optional_params_default_none(db_conn):
    write_audit_log(
        db_conn=db_conn,
        eventType=LogEventType.LOGOUT,
        success=False
    )
    log = db_conn.query(AuditLog).filter_by(EventType="LOGOUT").first()
    assert log is not None
    assert log.Success is False
    assert log.UserID is None
    assert log.UserEmail is None
    assert log.IPAddress is None
    assert log.Device is None
    assert log.Description is None
