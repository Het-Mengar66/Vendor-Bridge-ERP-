from sqlalchemy.orm import Session
from app.models.activity_log import ActivityLog
from app.schemas.activity_log import ActivityLogCreate
from typing import Optional

class ActivityService:
    @staticmethod
    def get_all(db: Session, filter_type: Optional[str] = None):
        query = db.query(ActivityLog)
        if filter_type and filter_type != "all":
            query = query.filter(ActivityLog.entity_type == filter_type)
        return query.order_by(ActivityLog.created_at.desc()).all()

    @staticmethod
    def create_log(db: Session, log_in: ActivityLogCreate):
        db_log = ActivityLog(
            user_id=log_in.user_id,
            action_type=log_in.action_type,
            entity_type=log_in.entity_type,
            entity_id=log_in.entity_id,
            description=log_in.description,
            metadata=log_in.metadata
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        return db_log
