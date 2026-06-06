import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_email_with_attachment(to_email: str, subject: str, body: str, attachment_path: str = None) -> bool:
    """
    Mocks sending an email with an attachment.
    In production, this would use smtplib or a service like Resend.
    """
    logger.info(f"--- MOCK EMAIL SENDER ---")
    logger.info(f"To: {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body: {body}")
    if attachment_path:
        logger.info(f"Attachment: {attachment_path}")
    logger.info(f"-------------------------")
    
    return True
