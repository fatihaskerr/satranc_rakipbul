import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Yeni stiller
const styles = {
  pageContainer: {
    background: 'linear-gradient(145deg, #F8F9FE 0%, #F1F4FC 100%)',
    minHeight: '100vh',
    pt: 4,
    pb: 6
  },
  mainCard: {
    borderRadius: 4,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    overflow: 'visible',
    position: 'relative',
    background: '#fff'
  },
  profileHeader: {
    p: 4,
    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
    color: '#fff',
    borderRadius: '4px 4px 0 0',
    position: 'relative'
  },
  largeAvatar: {
    width: 120,
    height: 120,
    bgcolor: '#fff',
    color: '#FF4B2B',
    fontSize: '3rem',
    mb: 2,
    boxShadow: '0 4px 20px rgba(255,75,43,0.3)'
  },
  statsCard: {
    height: '100%',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
    }
  },
  statIcon: {
    fontSize: '2.5rem',
    mb: 2
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    bgcolor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.3)',
      transform: 'translateY(-2px)'
    },
    transition: 'all 0.3s ease'
  },
  infoChip: {
    borderRadius: 20,
    height: 32,
    px: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    '& .MuiChip-icon': {
      color: '#fff'
    }
  },
  ratingItem: {
    borderRadius: 2,
    mb: 1,
    p: 2,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,75,43,0.05)',
      transform: 'translateX(4px)'
    }
  },
  saveButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
    color: '#fff',
    '&:hover': {
      background: 'linear-gradient(135deg, #45A049 0%, #3D8B40 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(76,175,80,0.4)'
    },
    transition: 'all 0.3s ease'
  },
  statsCardMatches: {
    '& .MuiCardContent-root': {
      background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
      color: '#fff'
    },
    '& .MuiTypography-root': {
      color: '#fff'
    },
    '& svg': {
      color: 'rgba(255,255,255,0.8)'
    }
  },
  statsCardParticipated: {
    '& .MuiCardContent-root': {
      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      color: '#fff'
    },
    '& .MuiTypography-root': {
      color: '#fff'
    },
    '& svg': {
      color: 'rgba(255,255,255,0.8)'
    }
  },
  statsCardActive: {
    '& .MuiCardContent-root': {
      background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
      color: '#fff'
    },
    '& .MuiTypography-root': {
      color: '#fff'
    },
    '& svg': {
      color: 'rgba(255,255,255,0.8)'
    }
  }
};

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    rating: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/profile`);
      if (!response.ok) throw new Error('Profil yüklenemedi');
      const data = await response.json();
      setProfile(data);
      setEditData({
        username: data.username,
        email: data.email,
        rating: data.rating || '',
        password: ''
      });
      setLoading(false);
    } catch (error) {
      setError('Profil yüklenirken bir hata oluştu');
      setLoading(false);
    }
  }, [user?.id]);

  const fetchRatings = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/ratings/users/${user.id}/ratings`);
      if (!response.ok) throw new Error('Değerlendirmeler yüklenemedi');
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error('Değerlendirmeler yüklenirken hata:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      fetchRatings();
    } else {
      setLoading(false);
    }
  }, [user?.id, fetchProfile, fetchRatings]);

  if (!user?.id) return null;
  if (loading) return <CircularProgress />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Güncelleme başarısız');
      }

      setSuccess('Profil başarıyla güncellendi');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth="lg">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {profile && (
          <Paper sx={styles.mainCard}>
            {/* Profil Başlığı */}
            <Box sx={styles.profileHeader}>
              <Button
                variant="contained"
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
                sx={styles.editButton}
              >
                {isEditing ? 'İptal' : 'Düzenle'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={styles.largeAvatar}>
                  {profile.username?.[0]?.toUpperCase() || '?'}
                </Avatar>
                <Typography variant="h4" gutterBottom>
                  {profile.username || 'İsimsiz Kullanıcı'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    icon={<TrophyIcon />}
                    label={`Rating: ${profile.rating || 'Belirtilmemiş'}`}
                    sx={styles.infoChip}
                  />
                  <Chip
                    icon={<PersonIcon />}
                    label={`Üyelik: ${new Date(profile.created_at).toLocaleDateString()}`}
                    sx={styles.infoChip}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* İstatistikler */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ ...styles.statsCard, ...styles.statsCardMatches }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrophyIcon sx={styles.statIcon} />
                      <Typography variant="h4" gutterBottom>
                        {profile.matches_created || 0}
                      </Typography>
                      <Typography variant="subtitle1">
                        Oluşturulan Maçlar
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ ...styles.statsCard, ...styles.statsCardParticipated }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <PersonIcon sx={styles.statIcon} />
                      <Typography variant="h4" gutterBottom>
                        {profile.matches_participated || 0}
                      </Typography>
                      <Typography variant="subtitle1">
                        Katılınan Maçlar
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ ...styles.statsCard, ...styles.statsCardActive }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <StarIcon sx={styles.statIcon} />
                      <Typography variant="h4" gutterBottom>
                        {profile.active_matches || 0}
                      </Typography>
                      <Typography variant="subtitle1">
                        Aktif Maçlar
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Profil Düzenleme Formu */}
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Kullanıcı Adı"
                        name="username"
                        value={editData.username}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="E-posta"
                        name="email"
                        type="email"
                        value={editData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Rating"
                        name="rating"
                        type="number"
                        value={editData.rating}
                        onChange={handleChange}
                        inputProps={{ min: 0, max: 3000 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Yeni Şifre"
                        name="password"
                        type="password"
                        value={editData.password}
                        onChange={handleChange}
                        helperText="Değiştirmek istemiyorsanız boş bırakın"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        fullWidth
                        sx={styles.saveButton}
                      >
                        Kaydet
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, color: '#2C3E50' }}>
                    Değerlendirmeler
                  </Typography>
                  <List>
                    {ratings.length > 0 ? (
                      ratings.map((rating, index) => (
                        <Paper key={index} sx={styles.ratingItem}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: '#6B8CEF' }}>
                                {rating.from_username?.[0]?.toUpperCase() || '?'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography component="span" variant="subtitle1">
                                    {rating.from_username || 'İsimsiz Kullanıcı'}
                                  </Typography>
                                  <Rating
                                    value={rating.score || 0}
                                    readOnly
                                    size="small"
                                  />
                                </Box>
                              }
                              secondary={
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {rating.comment || 'Yorum yok'}
                                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                    {rating.created_at ? new Date(rating.created_at).toLocaleDateString() : '-'}
                                  </Typography>
                                </Typography>
                              }
                            />
                          </ListItem>
                        </Paper>
                      ))
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Henüz değerlendirme yapılmamış
                      </Typography>
                    )}
                  </List>
                </>
              )}
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Profile; 