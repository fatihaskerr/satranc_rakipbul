from flask_mongoengine import MongoEngine

db = MongoEngine()

def init_db(app):
    app.config['MONGODB_SETTINGS'] = {
        'db': 'chess_app',
        'host': 'localhost',
        'port': 27017
    }
    db.init_app(app) 