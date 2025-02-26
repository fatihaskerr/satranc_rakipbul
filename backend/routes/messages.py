from flask import Blueprint, request, jsonify
from models.message import Message
from models.user import User
from datetime import datetime

messages = Blueprint('messages', __name__)

@messages.route('/', methods=['GET'])
def get_messages():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'Kullanıcı ID gerekli'}), 400

        # Kullanıcının gönderdiği ve aldığı tüm mesajları getir
        messages = Message.objects(
            (Message.sender_id == user_id) | 
            (Message.receiver_id == user_id)
        ).order_by('created_at')

        return jsonify([{
            'id': str(message.id),
            'sender_id': message.sender_id,
            'receiver_id': message.receiver_id,
            'content': message.content,
            'created_at': message.created_at.isoformat(),
            'is_read': message.is_read
        } for message in messages])

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Mesajlar alınırken bir hata oluştu'}), 500

@messages.route('/', methods=['POST'])
def send_message():
    try:
        data = request.json
        if not data or not all(k in data for k in ('sender_id', 'receiver_id', 'content')):
            return jsonify({'error': 'Eksik bilgi'}), 400

        # Gönderen ve alıcı kontrolü
        sender = User.objects(id=data['sender_id']).first()
        receiver = User.objects(id=data['receiver_id']).first()

        if not sender or not receiver:
            return jsonify({'error': 'Geçersiz kullanıcı'}), 404

        message = Message(
            sender_id=str(sender.id),
            receiver_id=str(receiver.id),
            content=data['content']
        )
        message.save()

        message_data = {
            'id': str(message.id),
            'sender': {
                'id': str(sender.id),
                'username': sender.username
            },
            'receiver': {
                'id': str(receiver.id),
                'username': receiver.username
            },
            'content': message.content,
            'created_at': message.created_at.isoformat(),
            'is_read': message.is_read
        }

        return jsonify(message_data), 201

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Mesaj gönderilirken bir hata oluştu'}), 500

@messages.route('/<message_id>/read', methods=['POST'])
def mark_as_read(message_id):
    try:
        message = Message.objects(id=message_id).first()
        if not message:
            return jsonify({'error': 'Mesaj bulunamadı'}), 404

        message.is_read = True
        message.save()

        return jsonify({'message': 'Mesaj okundu olarak işaretlendi'})

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({'error': 'Mesaj işaretlenirken bir hata oluştu'}), 500 