from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config.database import db

class User(db.Document):
    username = db.StringField(required=True, unique=True)
    password_hash = db.StringField(required=True)
    email = db.StringField(required=True, unique=True)
    rating = db.StringField()
    created_at = db.DateTimeField(default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password) 