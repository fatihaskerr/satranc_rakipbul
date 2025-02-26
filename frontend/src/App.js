import React, { useState, useEffect } from 'react';
import './App.css';
import Messages from './components/Messages';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  Avatar
} from '@mui/material';
import Matches from './components/Matches';
import Profile from './components/Profile';
import LoginDialog from './components/LoginDialog';
import {
  SportsEsports as GameIcon,
  Message as MessageIcon,
  Person as ProfileIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    rating: ''
  });
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Şehirler yüklenirken hata oluştu:', error);
    }
  };

  const fetchDistricts = async (city) => {
    if (!city) {
      setDistricts([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/cities/${encodeURIComponent(city)}/districts`);
      if (!response.ok) {
        throw new Error('İlçeler yüklenemedi');
      }
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error('İlçeler yüklenirken hata oluştu:', error);
      setDistricts([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setLoginData({ username: '', password: '' });
        } else {
          alert('Kullanıcı bilgileri alınamadı');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Giriş başarısız!');
      }
    } catch (error) {
      console.error('Giriş yapılırken hata oluştu:', error);
      alert('Giriş yapılırken bir hata oluştu');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      
      if (response.ok) {
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        setShowLogin(true);
        setRegisterData({ username: '', email: '', password: '', rating: '' });
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Kayıt olurken hata oluştu:', error);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSuccess = (user) => {
    setUser(user);
    setLoginDialogOpen(false);
  };

  if (!user) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Satranç Rakip Bulma Platformu</h1>
        </header>
        
        <main className="auth-container">
          {showLogin ? (
            <section className="auth-section">
              <h2>Giriş Yap</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Kullanıcı Adı:</label>
                  <input
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Şifre:</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                
                <button type="submit">Giriş Yap</button>
              </form>
              <p>
                Hesabınız yok mu?{' '}
                <button className="link-button" onClick={() => setShowLogin(false)}>
                  Kayıt Ol
                </button>
              </p>
            </section>
          ) : (
            <section className="auth-section">
              <h2>Kayıt Ol</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Kullanıcı Adı:</label>
                  <input
                    type="text"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>E-posta:</label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Şifre:</label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Rating:</label>
                  <input
                    type="number"
                    name="rating"
                    value={registerData.rating}
                    onChange={handleRegisterChange}
                    min="0"
                    max="3000"
                  />
                </div>
                
                <button type="submit">Kayıt Ol</button>
              </form>
              <p>
                Zaten hesabınız var mı?{' '}
                <button className="link-button" onClick={() => setShowLogin(true)}>
                  Giriş Yap
                </button>
              </p>
            </section>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <AppBar position="sticky" sx={{ 
        background: 'linear-gradient(135deg, #1A2634 0%, #364B54 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: 'none', 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              <TrophyIcon sx={{ fontSize: 28, color: '#FFD700' }} />
              Satranç Buluşmaları
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              '& .MuiButton-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                borderRadius: 2,
                py: 1,
                px: { xs: 1.5, sm: 2 },
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }
              }
            }}>
              <Button
                component={Link}
                to="/matches"
                color="inherit"
                startIcon={<GameIcon sx={{ color: location.pathname === '/matches' ? '#4CAF50' : 'inherit' }} />}
                sx={{
                  backgroundColor: location.pathname === '/matches' ? 'rgba(76,175,80,0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(76,175,80,0.25)'
                  }
                }}
              >
                Maçlar
              </Button>

              <Button
                component={Link}
                to="/messages"
                color="inherit"
                startIcon={<MessageIcon sx={{ color: location.pathname === '/messages' ? '#FF9800' : 'inherit' }} />}
                sx={{
                  backgroundColor: location.pathname === '/messages' ? 'rgba(255,152,0,0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,152,0,0.25)'
                  }
                }}
              >
                Mesajlar
              </Button>

              {user ? (
                <Button
                  component={Link}
                  to="/profile"
                  color="inherit"
                  startIcon={
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24,
                        bgcolor: location.pathname === '/profile' ? '#E91E63' : '#9C27B0',
                        fontSize: '0.875rem'
                      }}
                    >
                      {user.username ? user.username[0].toUpperCase() : 'U'}
                    </Avatar>
                  }
                  sx={{
                    backgroundColor: location.pathname === '/profile' ? 'rgba(233,30,99,0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(233,30,99,0.25)'
                    }
                  }}
                >
                  {user.username || 'Profil'}
                </Button>
              ) : (
                <Button
                  onClick={() => setLoginDialogOpen(true)}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)'
                    }
                  }}
                >
                  Giriş Yap
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Login Dialog */}
      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLogin={handleLoginSuccess}
      />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/matches" />} />
        <Route path="/matches" element={
          <Matches 
            user={user}
            cities={cities}
            districts={districts}
            fetchDistricts={fetchDistricts}
          />
        } />
        <Route path="/messages" element={<Messages user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
