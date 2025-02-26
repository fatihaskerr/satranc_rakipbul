import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  List, 
  ListItemText,
  ListItemButton,
  Avatar,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Send as SendIcon, Search as SearchIcon } from '@mui/icons-material';

// Yeni stiller
const styles = {
  pageContainer: {
    background: 'linear-gradient(145deg, #f6f8ff 0%, #f0f3ff 100%)',
    minHeight: '100vh',
    pt: 4,
    pb: 6
  },
  mainCard: {
    borderRadius: 4,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    position: 'relative',
    background: '#fff',
    display: 'flex',
    height: 'calc(100vh - 120px)',
    minHeight: '600px'
  },
  usersList: {
    width: '320px',
    borderRight: '1px solid rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column'
  },
  searchBar: {
    p: 2,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    '& .MuiOutlinedInput-root': {
      borderRadius: 30,
      backgroundColor: '#fff',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }
    }
  },
  userItem: {
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(107,140,239,0.08)',
    },
    '&.selected': {
      backgroundColor: 'rgba(107,140,239,0.12)',
    }
  },
  userAvatar: {
    bgcolor: '#6B8CEF',
    color: '#fff',
    width: 40,
    height: 40
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  messagesList: {
    flex: 1,
    overflowY: 'auto',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  messageInput: {
    p: 2,
    borderTop: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: 30,
      backgroundColor: '#fff',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }
    },
    '& .MuiIconButton-root': {
      color: '#6B8CEF',
      '&:hover': {
        backgroundColor: 'rgba(107,140,239,0.08)'
      },
      '&.Mui-disabled': {
        color: 'rgba(0,0,0,0.26)'
      }
    }
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    position: 'relative',
    wordBreak: 'break-word'
  },
  sentMessage: {
    backgroundColor: '#6B8CEF',
    color: '#fff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px'
  },
  receivedMessage: {
    backgroundColor: '#F1F5F9',
    color: '#1E293B',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },
  messageTime: {
    fontSize: '0.75rem',
    opacity: 0.7,
    marginTop: '4px',
    textAlign: 'right'
  },
  noChat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#94A3B8',
    gap: 2
  }
};

const Messages = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata oluştu:', error);
    }
  }, [user]);

  const fetchMessages = useCallback(async () => {
    if (!user?.id || !selectedReceiverId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/messages?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error('Mesajlar yüklenemedi');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Geçersiz veri formatı');
      }
      const filteredMessages = data.filter(message => 
        (message.sender_id === user.id && message.receiver_id === selectedReceiverId) ||
        (message.sender_id === selectedReceiverId && message.receiver_id === user.id)
      ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setMessages(filteredMessages);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata oluştu:', error);
      setMessages([]);
    }
  }, [selectedReceiverId, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUsers();
    }
  }, [user?.id, fetchUsers]);

  useEffect(() => {
    if (user?.id && selectedReceiverId) {
      fetchMessages();
    }
  }, [user?.id, selectedReceiverId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedReceiverId) return;

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: selectedReceiverId,
          content: newMessage
        }),
      });

      if (response.ok) {
        const newMessageData = await response.json();
        setMessages(prevMessages => [...prevMessages, newMessageData]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedReceiverId(user.id);
    setSelectedUser(user);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      // MongoDB'den gelen ISOString formatındaki tarihi parse et
      const date = new Date(dateString);
      
      // Geçerli bir tarih mi kontrol et
      if (isNaN(date.getTime())) {
        return '';
      }

      // Bugünün tarihi
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Aynı gün içindeyse sadece saat
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      }
      // Dün ise "Dün" ve saat
      else if (date.toDateString() === yesterday.toDateString()) {
        return `Dün ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
      }
      // Diğer günler için tarih ve saat
      else {
        return date.toLocaleString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Tarih formatlanırken hata:', error);
      return '';
    }
  };

  if (!user) return null;

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth="lg">
        <Paper sx={styles.mainCard}>
          {/* Kullanıcılar Listesi */}
          <Box sx={styles.usersList}>
            <Box sx={styles.searchBar}>
              <TextField
                fullWidth
                size="small"
                placeholder="Kullanıcı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <List sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredUsers.map(user => (
                <ListItemButton
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  sx={{
                    ...styles.userItem,
                    ...(selectedReceiverId === user.id && { backgroundColor: 'rgba(107,140,239,0.12)' })
                  }}
                >
                  <Avatar sx={styles.userAvatar}>
                    {user.username[0].toUpperCase()}
                  </Avatar>
                  <ListItemText 
                    primary={user.username}
                    secondary={user.rating ? `Rating: ${user.rating}` : 'Rating belirtilmemiş'}
                    sx={{ ml: 2 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Mesajlaşma Alanı */}
          <Box sx={styles.chatContainer}>
            {selectedReceiverId ? (
              <>
                {/* Seçili Kullanıcı Başlığı */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Avatar sx={styles.userAvatar}>
                    {selectedUser?.username[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="h6">
                    {selectedUser?.username}
                  </Typography>
                </Box>

                {/* Mesajlar Listesi */}
                <Box sx={styles.messagesList}>
                  {messages.map((message, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          ...styles.messageBubble,
                          ...(message.sender_id === user.id ? styles.sentMessage : styles.receivedMessage)
                        }}
                      >
                        <Typography>{message.content}</Typography>
                        <Typography sx={styles.messageTime}>
                          {formatMessageTime(message.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Mesaj Gönderme Formu */}
                <Box component="form" onSubmit={handleSendMessage} sx={styles.messageInput}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            type="submit" 
                            disabled={!newMessage.trim()}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </>
            ) : (
              <Box sx={styles.noChat}>
                <Typography variant="h6" color="inherit">
                  Mesajlaşmaya Başlayın
                </Typography>
                <Typography variant="body2" color="inherit">
                  Soldaki listeden bir kullanıcı seçin
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Messages; 