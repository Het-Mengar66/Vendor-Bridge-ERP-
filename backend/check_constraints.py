from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
r = db.execute(text("SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c WHERE conname LIKE '%status%'"))
for row in r:
    print(row)
db.close()
