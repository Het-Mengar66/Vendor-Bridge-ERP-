from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse, NotificationCreate
from uuid import UUID
from typing import List

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

MOCK_USER_ID = UUID("00000000-0000-0000-0000-000000000000")

@router.get("/", response_model=List[NotificationResponse])
def get_user_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == MOCK_USER_ID).order_by(Notification.created_at.desc()).all()

@router.post("/", response_model=NotificationResponse)
def create_notification(notification_in: NotificationCreate, db: Session = Depends(get_db)):
    db_notif = Notification(
        user_id=notification_in.user_id,
        title=notification_in.title,
        message=notification_in.message,
        type=notification_in.type,
        entity_type=notification_in.entity_type,
        entity_id=notification_in.entity_id,
        is_read=notification_in.is_read
    )
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(notification_id: UUID, db: Session = Depends(get_db)):
    db_notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not db_notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    db_notif.is_read = True
    db.commit()
    db.refresh(db_notif)
    return db_notif

@router.put("/read-all")
def mark_all_notifications_as_read(db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == MOCK_USER_ID, Notification.is_read == False).update({Notification.is_read: True})
    db.commit()
    return {"message": "All notifications marked as read"}
