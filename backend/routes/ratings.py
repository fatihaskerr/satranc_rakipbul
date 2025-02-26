from flask import Blueprint, request, jsonify
from models.rating import Rating
from models.user import User
from models.chess_match import ChessMatch
from datetime import datetime

ratings = Blueprint('ratings', __name__)

@ratings.route('/', methods=['POST'])
def create_rating():
    try:
        data = request.json
        if not data or not all(k in data for k in ('from_user_id', 'to_user_id', 'match_id', 'score')):
            return jsonify({'error': 'Eksik bilgi'}), 400

        # Kullanıcı ve maç kontrolü
        from_user = User.objects(id=data['from_user_id']).first()
        to_user = User.objects(id=data['to_user_id']).first()
        match = ChessMatch.objects(id=data['match_id']).first()

        if not from_user or not to_user:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404
        if not match:
            return jsonify({'error': 'Maç bulunamadı'}), 404

        # Maçın durumunu kontrol et
        if match.status != 'closed':
            return jsonify({'error': 'Bu maç için henüz değerlendirme yapılamaz'}), 400

        # Daha önce değerlendirme yapılmış mı kontrol et
        existing_rating = Rating.objects(
            from_user=from_user,
            to_user=to_user,
            match=match
        ).first()

        if existing_rating:
            return jsonify({'error': 'Bu maç için zaten değerlendirme yapmışsınız'}), 400

        rating = Rating(
            from_user=from_user,
            to_user=to_user,
            match=match,
            score=data['score'],
            comment=data.get('comment', '')
        )
        rating.save()

        return jsonify({
            'message': 'Değerlendirme başarıyla kaydedildi',
            'rating': {
                'id': str(rating.id),
                'from_user': {
                    'id': str(from_user.id),
                    'username': from_user.username
                },
                'to_user': {
                    'id': str(to_user.id),
                    'username': to_user.username
                },
                'match_id': str(match.id),
                'score': rating.score,
                'comment': rating.comment,
                'created_at': rating.created_at.isoformat()
            }
        }), 201

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Değerlendirme yapılırken bir hata oluştu'}), 500

@ratings.route('/users/<user_id>/ratings', methods=['GET'])
def get_user_ratings(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

        # Kullanıcının aldığı değerlendirmeleri getir
        ratings = Rating.objects(to_user=user).order_by('-created_at')
        
        return jsonify([{
            'id': str(rating.id),
            'from_user': {
                'id': str(rating.from_user.id),
                'username': rating.from_user.username
            },
            'match_id': str(rating.match.id),
            'score': rating.score,
            'comment': rating.comment,
            'created_at': rating.created_at.isoformat()
        } for rating in ratings])

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Değerlendirmeler alınırken bir hata oluştu'}), 500

@ratings.route('/match/<match_id>', methods=['GET'])
def get_match_ratings(match_id):
    try:
        match = ChessMatch.objects(id=match_id).first()
        if not match:
            return jsonify({'error': 'Maç bulunamadı'}), 404

        # Maçla ilgili tüm değerlendirmeleri getir
        ratings = Rating.objects(match=match).order_by('-created_at')
        
        return jsonify([{
            'id': str(rating.id),
            'from_user': {
                'id': str(rating.from_user.id),
                'username': rating.from_user.username
            },
            'to_user': {
                'id': str(rating.to_user.id),
                'username': rating.to_user.username
            },
            'score': rating.score,
            'comment': rating.comment,
            'created_at': rating.created_at.isoformat()
        } for rating in ratings])

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Değerlendirmeler alınırken bir hata oluştu'}), 500 