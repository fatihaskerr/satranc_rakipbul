# Satranç Rakip Bulma Platformu

Bu platform, satranç oyuncularının birbirleriyle maç ayarlamalarını kolaylaştırmak için tasarlanmış bir web uygulamasıdır.

## Özellikler

- Maç ilanı oluşturma
- Mevcut ilanları görüntüleme
- Konum ve tarih bazlı maç arama
- Seviye belirleme sistemi

## Teknolojiler

### Frontend
- React
- Modern CSS Grid ve Flexbox

### Backend
- Python Flask
- SQLite veritabanı
- Flask-SQLAlchemy
- Flask-CORS

## Kurulum

### Backend Kurulumu

1. Python sanal ortamını oluşturun ve aktif edin:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows için
source venv/bin/activate  # Linux/Mac için
```

2. Gerekli paketleri yükleyin:
```bash
pip install flask flask-cors flask-sqlalchemy python-dotenv
```

3. Uygulamayı çalıştırın:
```bash
python app.py
```

### Frontend Kurulumu

1. Gerekli npm paketlerini yükleyin:
```bash
cd frontend
npm install
```

2. Uygulamayı çalıştırın:
```bash
npm start
```

## Kullanım

1. Frontend uygulaması `http://localhost:3000` adresinde çalışacaktır
2. Backend API `http://localhost:5000` adresinde çalışacaktır
3. Yeni maç ilanı oluşturmak için formu doldurun
4. Mevcut ilanları görüntülemek için ana sayfayı kullanın

## Lisans

MIT 