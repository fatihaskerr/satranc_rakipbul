from flask import Blueprint, request, jsonify
from models.chess_match import ChessMatch
from models.user import User
from utils.cities import CITIES_DATA
from datetime import datetime

matches = Blueprint('matches', __name__)

@matches.route('/', methods=['POST'])
def create_match():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'Geçersiz veri formatı'}), 400

        # Kullanıcı kontrolü
        user = User.objects(id=data['user_id']).first()
        if not user:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

        # Şehir ve ilçe kontrolü
        if data['city'] not in CITIES_DATA:
            return jsonify({'error': 'Geçersiz şehir'}), 400
        if data['district'] not in CITIES_DATA[data['city']]:
            return jsonify({'error': 'Geçersiz ilçe'}), 400
        
        new_match = ChessMatch(
            title=data['title'],
            city=data['city'],
            district=data['district'],
            date_time=datetime.fromisoformat(data['date_time']),
            rating=int(data.get('rating', 0)),
            contact_info=data['contact_info'],
            creator_id=str(user.id)
        )
        new_match.save()
        
        return jsonify({
            'message': 'Maç ilanı başarıyla oluşturuldu',
            'id': str(new_match.id)
        }), 201

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Sunucu hatası oluştu'}), 500

@matches.route('/<match_id>/join', methods=['POST'])
def join_match(match_id):
    try:
        data = request.get_json()
        if not data or 'user_id' not in data:
            return jsonify({'error': 'Kullanıcı ID gerekli'}), 400

        match = ChessMatch.objects(id=match_id).first()
        if not match:
            return jsonify({'error': 'Maç bulunamadı'}), 404

        if match.status != 'open':
            return jsonify({'error': 'Bu maça artık katılınamaz'}), 400

        if str(match.creator_id) == str(data['user_id']):
            return jsonify({'error': 'Kendi maçınıza katılamazsınız'}), 400

        match.participant_id = data['user_id']
        match.status = 'closed'
        match.save()

        return jsonify({
            'message': 'Maça başarıyla katıldınız',
            'match': {
                'id': str(match.id),
                'title': match.title,
                'creator_id': str(match.creator_id),
                'participant_id': str(match.participant_id),
                'status': match.status
            }
        }), 200

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Maça katılırken bir hata oluştu'}), 500

@matches.route('/', methods=['GET'])
def get_matches():
    matches = ChessMatch.objects.order_by('date_time')
    return jsonify([{
        'id': str(match.id),
        'title': match.title,
        'city': match.city,
        'district': match.district,
        'date_time': match.date_time.isoformat(),
        'rating': match.rating,
        'contact_info': match.contact_info,
        'created_at': match.created_at.isoformat(),
        'creator_id': str(match.creator_id),
        'participant_id': str(match.participant_id) if match.participant_id else None,
        'status': match.status
    } for match in matches])

@matches.route('/<match_id>/close', methods=['POST'])
def close_match(match_id):
    data = request.json
    match = ChessMatch.objects(id=match_id).first()
    
    if not match:
        return jsonify({'error': 'Maç bulunamadı'}), 404
    
    if match.creator_id != data['user_id']:
        return jsonify({'error': 'Bu ilanı sadece sahibi kapatabilir'}), 403
    
    if match.status != 'open':
        return jsonify({'error': 'Bu ilan zaten kapalı'}), 400
    
    match.status = 'cancelled'
    match.save()
    
    return jsonify({'message': 'İlan başarıyla kapatıldı'}) 