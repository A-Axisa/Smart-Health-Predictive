from sqlalchemy.orm import Session
from ..models.dbmodels import AuditLog


# Utility function for writing audit logs to the database.
# Call this from any router when a loggable event occurs.

def write_audit_log(db_conn: Session, eventType: str, success: bool, userEmail: str = None,
                    ipAddress: str = None, device: str = None, description: str = None):
    try:
        db_conn.add(AuditLog(
            eventType=eventType,
            success=success,
            userEmail=userEmail,
            ipAddress=ipAddress,
            device=device,
            description=description,
        ))
        db_conn.commit()

    except Exception as e:
        db_conn.rollback()
        print(f"Failed to write audit log: {e}")
