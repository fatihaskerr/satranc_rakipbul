import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const LoginDialog = ({ open, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState(0);
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
          onLogin(data.user);
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
        setActiveTab(0);
        setRegisterData({ username: '', email: '', password: '', rating: '' });
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Kayıt olurken hata oluştu:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
          {activeTab === 0 ? 'Giriş Yap' : 'Kayıt Ol'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            minHeight: 48
          }
        }}
      >
        <Tab label="Giriş Yap" />
        <Tab label="Kayıt Ol" />
      </Tabs>

      <DialogContent sx={{ pt: 3 }}>
        {activeTab === 0 ? (
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #34495E 0%, #2980B9 100%)'
                }
              }}
            >
              Giriş Yap
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Şifre"
              name="password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              value={registerData.rating}
              onChange={(e) => setRegisterData({ ...registerData, rating: e.target.value })}
              inputProps={{ min: 0, max: 3000 }}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #34495E 0%, #2980B9 100%)'
                }
              }}
            >
              Kayıt Ol
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog; 