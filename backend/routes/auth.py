from flask import Blueprint, request, jsonify
from models.user import User
from datetime import datetime

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        if not data or not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({'error': 'Eksik bilgi'}), 400

        # Kullanıcı adı ve email kontrolü
        if User.objects(username=data['username']).first():
            return jsonify({'error': 'Bu kullanıcı adı zaten kullanılıyor'}), 400
        if User.objects(email=data['email']).first():
            return jsonify({'error': 'Bu email adresi zaten kullanılıyor'}), 400

        user = User(
            username=data['username'],
            email=data['email'],
            rating='0'
        )
        user.set_password(data['password'])
        user.save()

        return jsonify({
            'message': 'Kayıt başarılı',
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'rating': user.rating
            }
        }), 201

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Kayıt sırasında bir hata oluştu'}), 500

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data or not all(k in data for k in ('username', 'password')):
            return jsonify({'error': 'Kullanıcı adı ve şifre gerekli'}), 400

        user = User.objects(username=data['username']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Geçersiz kullanıcı adı veya şifre'}), 401

        return jsonify({
            'message': 'Giriş başarılı',
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'rating': user.rating
            }
        })

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Giriş sırasında bir hata oluştu'}), 500 