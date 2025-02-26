from datetime import datetime
from config.database import db
from models.user import User
from models.chess_match import ChessMatch

class Rating(db.Document):
    from_user = db.ReferenceField(User, required=True)
    to_user = db.ReferenceField(User, required=True)
    match = db.ReferenceField(ChessMatch, required=True)
    score = db.IntField(min_value=1, max_value=5, required=True)
    comment = db.StringField(max_length=500)
    created_at = db.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'indexes': [
            ('from_user', 'to_user', 'match'),  # Her maç için bir kez değerlendirme yapılabilir
        ]
    } 