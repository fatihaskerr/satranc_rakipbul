import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Tooltip,
  CardActions,
  CardHeader,
  Avatar,
  Fade
} from '@mui/material';
import RatingDialog from './RatingDialog';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  EmojiEvents as TrophyIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Maç Kartları için yeni stil
const cardStyle = {
  height: '100%', 
  display: 'flex', 
  flexDirection: 'column', 
  borderRadius: 2,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  }
};

// Yeni stiller
const styles = {
  pageContainer: {
    background: 'linear-gradient(145deg, #F3F4F8 0%, #E7EAF0 100%)',
    minHeight: '100vh',
    pt: 4,
    pb: 6
  },
  mainCard: {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    background: '#fff'
  },
  tabsContainer: {
    background: 'linear-gradient(135deg, #1A2634 0%, #364B54 100%)',
    position: 'relative',
    padding: '0 20px',
    '& .MuiTab-root': {
      color: 'rgba(255,255,255,0.7)',
      fontWeight: 500,
      fontSize: '0.95rem',
      textTransform: 'none',
      letterSpacing: '0.5px',
      minHeight: 64,
      padding: '6px 24px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'visible',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 3,
        backgroundColor: '#FFD700',
        transition: 'width 0.3s ease',
        borderRadius: '3px 3px 0 0'
      },
      '&:hover': {
        color: '#fff',
        '&::after': {
          width: '30%'
        }
      },
      '&.Mui-selected': {
        color: '#fff',
        fontWeight: 600,
        '&::after': {
          width: '80%'
        }
      }
    },
    '& .MuiTabs-indicator': {
      display: 'none'
    }
  },
  newMatchButton: {
    py: 2,
    px: 4,
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: 2,
    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
    color: '#fff',
    '&:hover': {
      background: 'linear-gradient(135deg, #45A049 0%, #3D8B40 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(76,175,80,0.4)'
    },
    transition: 'all 0.3s ease'
  },
  searchContainer: {
    background: '#fff',
    borderRadius: 2,
    p: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    mb: 3
  },
  searchInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 30,
      backgroundColor: '#F3F4F8',
      '&:hover': {
        backgroundColor: '#fff',
        boxShadow: '0 0 0 2px rgba(76,175,80,0.2)'
      },
      '&.Mui-focused': {
        backgroundColor: '#fff',
        boxShadow: '0 0 0 2px rgba(76,175,80,0.2)'
      }
    }
  },
  filterButton: {
    borderRadius: '50%',
    width: 48,
    height: 48,
    '&:hover': {
      backgroundColor: 'rgba(76,175,80,0.1)'
    }
  },
  matchCard: {
    ...cardStyle,
    border: '1px solid rgba(0,0,0,0.08)',
    '&:hover': {
      ...cardStyle['&:hover'],
      borderColor: 'rgba(76,175,80,0.3)'
    }
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #F8FAFF 0%, #F3F6FF 100%)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    '& .MuiCardHeader-title': {
      fontWeight: 600,
      fontSize: '1.1rem',
      color: '#1A2634'
    }
  },
  cardContent: {
    p: 3
  },
  cardActions: {
    p: 2,
    borderTop: '1px solid rgba(0,0,0,0.05)',
    background: '#F8FAFF'
  },
  infoChip: {
    borderRadius: 20,
    height: 32,
    px: 1.5,
    backgroundColor: 'rgba(76,175,80,0.1)',
    color: '#4CAF50',
    '& .MuiChip-icon': {
      color: '#4CAF50'
    }
  },
  joinButton: {
    background: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(255,75,43,0.4)'
    }
  },
  messageButton: {
    borderColor: '#FF9800',
    color: '#FF9800',
    '&:hover': {
      borderColor: '#F57C00',
      backgroundColor: 'rgba(255,152,0,0.1)'
    }
  },
  closeButton: {
    borderColor: '#E91E63',
    color: '#E91E63',
    '&:hover': {
      borderColor: '#C2185B',
      backgroundColor: 'rgba(233,30,99,0.1)'
    }
  },
  rateButton: {
    borderColor: '#9C27B0',
    color: '#9C27B0',
    '&:hover': {
      borderColor: '#7B1FA2',
      backgroundColor: 'rgba(156,39,176,0.1)'
    }
  }
};

const Matches = ({ user, cities, districts, fetchDistricts }) => {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    district: '',
    date_time: '',
    rating: '',
    contact_info: ''
  });
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    city: '',
    district: '',
    minRating: '',
    maxRating: '',
    status: 'all',
    sortBy: 'date'
  });
  const [filterDistricts, setFilterDistricts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showNewMatchForm, setShowNewMatchForm] = useState(true);

  const fetchMatches = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch('http://localhost:5000/api/matches');
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Maçlar yüklenirken hata oluştu:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchMatches();
    }
  }, [user?.id, fetchMatches]);

  const fetchFilterDistricts = async (city) => {
    if (!city) {
      setFilterDistricts([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/cities/${encodeURIComponent(city)}/districts`);
      if (!response.ok) {
        throw new Error('İlçeler yüklenemedi');
      }
      const data = await response.json();
      setFilterDistricts(data);
    } catch (error) {
      console.error('İlçeler yüklenirken hata oluştu:', error);
      setFilterDistricts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'city') {
        fetchDistricts(value);
        newData.district = '';
      }
      
      return newData;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: value
      };
      
      if (name === 'city') {
        fetchFilterDistricts(value);
        newFilters.district = '';
      }
      
      return newFilters;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Lütfen önce giriş yapın');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, user_id: user.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Maç ilanı oluşturulamadı');
      }

      await response.json();
      setFormData({
        title: '',
        city: '',
        district: '',
        date_time: '',
        rating: '',
        contact_info: ''
      });
      fetchMatches();
      alert('Maç ilanı başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Maç ilanı oluşturulurken hata oluştu:', error);
      alert(error.message);
    }
  };

  const handleJoinMatch = async (matchId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/matches/${matchId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      if (response.ok) {
        await fetchMatches();
        setActiveTab(1);
        alert('Maça başarıyla katıldınız!');
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Maça katılırken hata oluştu:', error);
    }
  };

  const handleCloseMatch = async (matchId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/matches/${matchId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      if (response.ok) {
        await fetchMatches();
        setActiveTab(1);
        alert('Maç başarıyla tamamlandı!');
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Maç kapatılırken hata oluştu:', error);
      alert('Maç kapatılırken bir hata oluştu');
    }
  };

  const handleRatingComplete = (success) => {
    if (success) {
      fetchMatches();
    }
    setRatingDialogOpen(false);
    setSelectedMatch(null);
    setSelectedUser(null);
  };

  const openRatingDialog = (match, toUserId) => {
    setSelectedMatch(match);
    setSelectedUser({
      id: toUserId,
      username: match.creator_id === toUserId ? match.creator_username : match.participant_username
    });
    setRatingDialogOpen(true);
  };

  const filteredMatches = matches
    .filter(match => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!match.title.toLowerCase().includes(query) &&
            !match.city.toLowerCase().includes(query) &&
            !match.district.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (filters.city && match.city !== filters.city) {
        return false;
      }

      if (filters.district && match.district !== filters.district) {
        return false;
      }

      if (filters.minRating && match.rating < parseInt(filters.minRating)) {
        return false;
      }
      if (filters.maxRating && match.rating > parseInt(filters.maxRating)) {
        return false;
      }

      if (activeTab === 0) {
        return match.status === 'open';
      } else {
        return match.status === 'closed' && 
          (match.creator_id === user?.id || match.participant_id === user?.id);
      }
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return new Date(b.date_time) - new Date(a.date_time);
      } else if (filters.sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth="lg">
        {/* Üst Menü */}
        <Paper sx={styles.mainCard}>
          <Box sx={styles.tabsContainer}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="standard"
                sx={{
                  minHeight: 64,
                  '& .MuiTabs-flexContainer': {
                    gap: 2
                  }
                }}
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#4CAF50',
                        boxShadow: '0 0 10px rgba(76,175,80,0.5)'
                      }} />
                      Aktif Maçlar
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#FFC107',
                        boxShadow: '0 0 10px rgba(255,193,7,0.5)'
                      }} />
                      Tamamlanan Maçlar
                    </Box>
                  } 
                />
              </Tabs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 2 }}>
                <Chip
                  label={`${filteredMatches.length} maç`}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 2
                    }
                  }}
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          {/* Yeni Maç Oluştur Butonu */}
          <Box sx={{ p: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowNewMatchForm(!showNewMatchForm)}
              fullWidth
              sx={styles.newMatchButton}
            >
              {showNewMatchForm ? 'Formu Gizle' : 'Yeni Maç İlanı Oluştur'}
            </Button>
          </Box>

          {/* Yeni Maç İlanı Formu */}
          <Fade in={showNewMatchForm}>
            <Box sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2C3E50' }}>
                Yeni Maç İlanı Oluştur
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Başlık"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      sx={styles.searchInput}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Şehir</InputLabel>
                      <Select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        sx={{
                          backgroundColor: '#f8faff',
                          '&:hover': {
                            backgroundColor: '#fff',
                            boxShadow: '0 0 0 2px rgba(107,140,239,0.2)'
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>Şehir Seçin</em>
                        </MenuItem>
                        {cities.map(city => (
                          <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>İlçe</InputLabel>
                      <Select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        disabled={!formData.city}
                        sx={{
                          backgroundColor: '#f8faff',
                          '&:hover': {
                            backgroundColor: '#fff',
                            boxShadow: '0 0 0 2px rgba(107,140,239,0.2)'
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>İlçe Seçin</em>
                        </MenuItem>
                        {districts.map(district => (
                          <MenuItem key={district} value={district}>{district}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Tarih ve Saat"
                      name="date_time"
                      value={formData.date_time}
                      onChange={handleChange}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
                        max: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().slice(0, 16)
                      }}
                      sx={styles.searchInput}
                      helperText="En fazla 3 ay sonrası için maç oluşturabilirsiniz"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 3000 }}
                      placeholder="Örn: 1500"
                      sx={styles.searchInput}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="İletişim Bilgisi"
                      name="contact_info"
                      value={formData.contact_info}
                      onChange={handleChange}
                      required
                      placeholder="Telefon numarası veya e-posta adresi"
                      sx={styles.searchInput}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      type="submit"
                      fullWidth
                      startIcon={<AddIcon />}
                      sx={styles.newMatchButton}
                    >
                      İlan Oluştur
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Fade>

          {/* Arama ve Filtreler */}
          <Box sx={styles.searchContainer}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={8}>
                <TextField
                  fullWidth
                  placeholder="Maç ara..."
                  size="medium"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange({ target: { name: 'searchQuery', value: e.target.value } })}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={styles.searchInput}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Filtreleri Göster/Gizle">
                  <IconButton 
                    onClick={() => setShowFilters(!showFilters)}
                    sx={styles.filterButton}
                  >
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
                <Chip
                  label={`${filteredMatches.length} maç bulundu`}
                  sx={styles.infoChip}
                />
              </Grid>
            </Grid>

            {/* Filtreler */}
            <Fade in={showFilters}>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Şehir</InputLabel>
                      <Select
                        name="city"
                        value={filters.city}
                        onChange={handleFilterChange}
                        size="medium"
                      >
                        <MenuItem value="">Tümü</MenuItem>
                        {cities.map(city => (
                          <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>İlçe</InputLabel>
                      <Select
                        name="district"
                        value={filters.district}
                        onChange={handleFilterChange}
                        disabled={!filters.city}
                        size="medium"
                      >
                        <MenuItem value="">Tümü</MenuItem>
                        {filterDistricts.map(district => (
                          <MenuItem key={district} value={district}>{district}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Min. Rating"
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleFilterChange}
                      size="medium"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Max. Rating"
                      name="maxRating"
                      value={filters.maxRating}
                      onChange={handleFilterChange}
                      size="medium"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </Box>

          {/* Maç Listesi */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredMatches.map((match) => (
                <Grid item xs={12} sm={6} md={4} key={match.id}>
                  <Card sx={styles.matchCard}>
                    <CardHeader
                      sx={styles.cardHeader}
                      avatar={
                        <Avatar sx={{ bgcolor: '#6B8CEF' }}>
                          {match.title[0].toUpperCase()}
                        </Avatar>
                      }
                      title={match.title}
                      subheader={new Date(match.date_time).toLocaleString()}
                    />
                    <CardContent sx={styles.cardContent}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ color: '#6B8CEF' }} />
                          <Typography variant="body2">{match.city}, {match.district}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrophyIcon sx={{ color: '#6B8CEF' }} />
                          <Typography variant="body2">Rating: {match.rating || 'Belirtilmemiş'}</Typography>
                        </Box>
                        {activeTab === 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ color: '#6B8CEF' }} />
                            <Typography variant="body2">{match.contact_info}</Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={styles.cardActions}>
                      {activeTab === 0 ? (
                        match.creator_id !== user?.id ? (
                          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                            <Button 
                              variant="contained"
                              onClick={() => handleJoinMatch(match.id)}
                              fullWidth
                              sx={styles.joinButton}
                            >
                              Maça Katıl
                            </Button>
                            <Link 
                              to="/messages" 
                              state={{ receiverId: match.creator_id }}
                              style={{ textDecoration: 'none', flexGrow: 1 }}
                            >
                              <Button 
                                variant="outlined" 
                                fullWidth
                                sx={styles.messageButton}
                              >
                                Mesaj Gönder
                              </Button>
                            </Link>
                          </Box>
                        ) : (
                          <Box sx={{ width: '100%' }}>
                            <Chip 
                              label="Sizin İlanınız" 
                              sx={styles.infoChip}
                            />
                            <Button 
                              variant="outlined" 
                              color="error"
                              onClick={() => handleCloseMatch(match.id)}
                              fullWidth
                              sx={styles.closeButton}
                            >
                              İlanı Kapat
                            </Button>
                          </Box>
                        )
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => openRatingDialog(match, match.creator_id === user?.id ? match.participant_id : match.creator_id)}
                          fullWidth
                          sx={styles.rateButton}
                        >
                          Rakibini Değerlendir
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Değerlendirme dialog'u */}
      {selectedMatch && selectedUser && (
        <RatingDialog
          open={ratingDialogOpen}
          onClose={handleRatingComplete}
          matchId={selectedMatch.id}
          fromUserId={user?.id}
          toUserId={selectedUser.id}
          toUsername={selectedUser.username}
        />
      )}
    </Box>
  );
};

export default Matches; 