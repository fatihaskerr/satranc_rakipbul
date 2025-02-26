import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography
} from '@mui/material';

const RatingDialog = ({ open, onClose, matchId, fromUserId, toUserId, toUsername }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: matchId,
          from_user_id: fromUserId,
          to_user_id: toUserId,
          score: rating,
          comment
        }),
      });

      if (response.ok) {
        onClose(true);
      } else {
        const error = await response.json();
        alert(error.error);
        onClose(false);
      }
    } catch (error) {
      console.error('Değerlendirme gönderilirken hata:', error);
      onClose(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {toUsername} için Değerlendirme
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            label="Yorum"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>İptal</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Değerlendir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog; 