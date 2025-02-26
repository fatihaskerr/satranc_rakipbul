from flask import Blueprint, request, jsonify
from models.user import User
from models.chess_match import ChessMatch
from models.rating import Rating

users = Blueprint('users', __name__)

@users.route('/', methods=['GET'])
def get_users():
    try:
        users = User.objects.all()
        return jsonify([{
            'id': str(user.id),
            'username': user.username,
            'rating': user.rating
        } for user in users])
    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Kullanıcılar alınırken bir hata oluştu'}), 500

@users.route('/<user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

        # Kullanıcının oluşturduğu ve katıldığı maçları say
        created_matches = ChessMatch.objects(creator_id=str(user.id)).count()
        participated_matches = ChessMatch.objects(participant_id=str(user.id)).count()
        
        # Aktif maçları say
        active_matches = ChessMatch.objects(
            (ChessMatch.creator_id == str(user.id)) | 
            (ChessMatch.participant_id == str(user.id)),
            status='open'
        ).count()

        # Kullanıcının aldığı değerlendirmeleri hesapla
        ratings = Rating.objects(to_user=user)
        avg_rating = sum(r.score for r in ratings) / ratings.count() if ratings.count() > 0 else 0
        
        return jsonify({
            'id': str(user.id),
            'username': user.username,
            'email': user.email,
            'rating': user.rating,
            'created_at': user.created_at.isoformat(),
            'matches_created': created_matches,
            'matches_participated': participated_matches,
            'active_matches': active_matches,
            'total_ratings': ratings.count(),
            'average_rating': round(avg_rating, 1)
        })

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Profil bilgileri alınırken bir hata oluştu'}), 500

@users.route('/<user_id>/profile', methods=['PUT'])
def update_user_profile(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

        data = request.json
        if not data:
            return jsonify({'error': 'Güncellenecek veri bulunamadı'}), 400

        # Email güncelleme
        if 'email' in data:
            # Email benzersizliğini kontrol et
            existing_user = User.objects(email=data['email']).first()
            if existing_user and str(existing_user.id) != user_id:
                return jsonify({'error': 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor'}), 400
            user.email = data['email']

        # Kullanıcı adı güncelleme
        if 'username' in data:
            # Kullanıcı adı benzersizliğini kontrol et
            existing_user = User.objects(username=data['username']).first()
            if existing_user and str(existing_user.id) != user_id:
                return jsonify({'error': 'Bu kullanıcı adı başka bir kullanıcı tarafından kullanılıyor'}), 400
            user.username = data['username']

        # Rating güncelleme
        if 'rating' in data:
            user.rating = data['rating']

        # Şifre güncelleme
        if 'password' in data:
            user.set_password(data['password'])

        user.save()
        return jsonify({
            'message': 'Profil başarıyla güncellendi',
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'rating': user.rating
            }
        })

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Profil güncellenirken bir hata oluştu'}), 500

@users.route('/<user_id>/matches', methods=['GET'])
def get_user_matches(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

        # Kullanıcının oluşturduğu veya katıldığı maçları getir
        matches = ChessMatch.objects(
            (ChessMatch.creator_id == str(user.id)) | 
            (ChessMatch.participant_id == str(user.id))
        ).order_by('-created_at')

        match_list = []
        for match in matches:
            # Rakip bilgilerini belirle
            is_creator = str(match.creator_id) == str(user.id)
            opponent_id = str(match.participant_id) if is_creator else str(match.creator_id)
            
            if opponent_id:
                opponent = User.objects(id=opponent_id).first()
                opponent_data = {
                    'id': str(opponent.id),
                    'username': opponent.username,
                    'rating': opponent.rating
                } if opponent else None
            else:
                opponent_data = None

            # Kullanıcının bu maç için değerlendirme yapıp yapmadığını kontrol et
            has_rated = False
            if opponent_data:
                rating = Rating.objects(
                    from_user=user,
                    to_user=opponent,
                    match=match
                ).first()
                has_rated = bool(rating)

            match_data = {
                'id': str(match.id),
                'title': match.title,
                'city': match.city,
                'district': match.district,
                'date_time': match.date_time.isoformat(),
                'rating': match.rating,
                'contact_info': match.contact_info,
                'status': match.status,
                'created_at': match.created_at.isoformat(),
                'is_creator': is_creator,
                'opponent': opponent_data,
                'has_rated': has_rated
            }
            match_list.append(match_data)

        return jsonify(match_list)

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Maçlar alınırken bir hata oluştu'}), 500 