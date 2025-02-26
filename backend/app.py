from flask import Flask, jsonify, request
from flask_cors import CORS
from config.database import init_db
from routes.auth import auth
from routes.matches import matches
from routes.messages import messages
from routes.ratings import ratings
from routes.users import users
from utils.cities import CITIES_DATA

app = Flask(__name__)

# CORS ayarlarını güncelle
CORS(app, 
     resources={r"/api/*": {
         "origins": ["http://localhost:3000"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }},
     expose_headers=["Content-Range", "X-Content-Range"])

# OPTIONS istekleri için genel handler
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        return response

# MongoDB bağlantısı
init_db(app)

# Blueprint'leri kaydet
app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(matches, url_prefix='/api/matches')
app.register_blueprint(messages, url_prefix='/api/messages')
app.register_blueprint(ratings, url_prefix='/api/ratings')
app.register_blueprint(users, url_prefix='/api/users')

# Şehir ve ilçe endpoint'leri
@app.route('/api/cities', methods=['GET'])
def get_cities():
    return jsonify(list(CITIES_DATA.keys()))

@app.route('/api/cities/<city>/districts', methods=['GET'])
def get_districts(city):
    if city not in CITIES_DATA:
        return jsonify({'error': 'Geçersiz şehir'}), 400
    return jsonify(CITIES_DATA[city])

if __name__ == '__main__':
    app.run(debug=True) 