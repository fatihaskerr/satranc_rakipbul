from datetime import datetime
from config.database import db

class ChessMatch(db.Document):
    creator_id = db.StringField(required=True)
    participant_id = db.StringField()
    title = db.StringField(required=True)
    city = db.StringField(required=True)
    district = db.StringField(required=True)
    date_time = db.DateTimeField(required=True)
    rating = db.IntField()
    contact_info = db.StringField()
    status = db.StringField(default='open')  # open, closed, cancelled
    created_at = db.DateTimeField(default=datetime.utcnow) 