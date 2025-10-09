'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';

export default function SupportPage() {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [response, setResponse] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const categories = [
    'Billing',
    'Transactions',
    'Login Issues',
    'Wallet / UPI',
    'General Help',
  ];

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('finedge_tickets');
    if (stored) setTickets(JSON.parse(stored));
  }, []);

  // Save to localStorage
  const saveTickets = (newTickets) => {
    localStorage.setItem('finedge_tickets', JSON.stringify(newTickets));
    setTickets(newTickets);
  };

  const handleSubmit = () => {
    if (!category || !message.trim()) {
      alert('Please fill all fields.');
      return;
    }

    const newTicket = {
      id: Date.now(),
      category,
      message,
      date: new Date().toLocaleString(),
      status: 'Open',
      reply: generateReply(category),
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);

    setResponse(newTicket.reply);
    setOpenSnackbar(true);
    setMessage('');
    setCategory('');
  };

  const generateReply = (category) => {
    switch (category) {
      case 'Billing':
        return '💡 Your billing query has been received. Our finance team will review your statement within 24 hours.';
      case 'Transactions':
        return '🔎 We are looking into your transaction issue. Please keep your transaction ID ready for reference.';
      case 'Login Issues':
        return '🔐 Try resetting your password from the login page. If the issue persists, our team will contact you.';
      case 'Wallet / UPI':
        return '💰 FinEdge Wallet queries are usually resolved within 1 hour. We’ll notify you once verified.';
      default:
        return '📞 Thank you for contacting FinEdge Support. Our representative will reach out shortly.';
    }
  };

  const clearTickets = () => {
    localStorage.removeItem('finedge_tickets');
    setTickets([]);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: '16px' }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          
          <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
            FinEdge Support Center
          </Typography>
        </Box>

        <Typography variant="body1" align="center" color="text.secondary">
          How can we assist you today?
        </Typography>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Describe your issue"
          sx={{ mt: 2 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Box textAlign="center" mt={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Ticket
          </Button>
        </Box>

        {response && (
          <Box mt={3} p={2} sx={{ bgcolor: '#f4f6f8', borderRadius: '10px' }}>
            <Typography variant="subtitle1" color="primary">
              Support Reply:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {response}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">🧾 Previous Support Tickets</Typography>
        {tickets.length === 0 ? (
          <Typography color="text.secondary">No tickets yet.</Typography>
        ) : (
          <>
            <List sx={{ mt: 1 }}>
              {tickets.map((ticket) => (
                <ListItem key={ticket.id} divider alignItems="flex-start">
                  <ListItemText
                    primary={`${ticket.category} • ${ticket.date}`}
                    secondary={
                      <>
                        <Typography variant="body2">{ticket.message}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          💬 {ticket.reply}
                        </Typography>
                      </>
                    }
                  />
                  <Chip
                    label={ticket.status}
                    color={ticket.status === 'Open' ? 'warning' : 'success'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
            <Box textAlign="center" mt={2}>
              <Button variant="outlined" color="error" onClick={clearTickets}>
                Clear History
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">✅ Your support ticket has been submitted!</Alert>
      </Snackbar>
    </Container>
  );
}

