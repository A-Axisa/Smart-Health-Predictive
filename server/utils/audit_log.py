from sqlalchemy.orm import Session
from ..models.dbmodels import AuditLog, LogEventType


def write_audit_log(db_conn: Session, eventType: LogEventType, success: bool, userID: int = None,
                     userEmail: str = None, ipAddress: str = None, device: str = None, description: str = None):
    """Persist an audit-log entry to the database and commit immediately.

    Call this from any router when a loggable event occurs. Failures are
    silently caught and printed to stderr so they never break the request flow.

    :param db_conn: Active database session.
    :param eventType: The category of event being logged.
    :param success: Whether the operation succeeded.
    :param userID: Optional primary key of the acting user.
    :param userEmail: Optional email of the acting user.
    :param ipAddress: Optional client IP address.
    :param device: Optional device / user-agent string.
    :param description: Optional human-readable description of the event.
    """
    try:
        db_conn.add(AuditLog(
            eventType=eventType,
            success=success,
            userID=userID,
            userEmail=userEmail,
            ipAddress=ipAddress,
            device=device,
            description=description,
        ))
        db_conn.commit()

    except Exception as e:
        db_conn.rollback()
        print(f"Failed to write audit log: {e}")
