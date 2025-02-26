from datetime import datetime
from config.database import db

class Message(db.Document):
    sender_id = db.StringField(required=True)
    receiver_id = db.StringField(required=True)
    content = db.StringField(required=True)
    created_at = db.DateTimeField(default=datetime.utcnow)
    is_read = db.BooleanField(default=False)

    meta = {
        'collection': 'messages',
        'indexes': [
            'sender_id',
            'receiver_id',
            'created_at'
        ]
    } 