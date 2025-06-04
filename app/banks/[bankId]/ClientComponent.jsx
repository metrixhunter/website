'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert, CircularProgress, InputAdornment } from '@mui/material';

export default function ClientComponent({ bankId }) {
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  // On mount, check for credentials in sessionStorage (do not store, just check)
  useEffect(() => {
    const storedCountryCode = sessionStorage.getItem('countryCode') || '';
    const storedPhone = sessionStorage.getItem('phone') || '';
    const storedAccountNumber = sessionStorage.getItem('accountNumber') || '';
    const storedDebitCard = sessionStorage.getItem('debitCardNumber') || '';

    if (storedCountryCode && storedPhone && storedAccountNumber && storedDebitCard) {
      setCountryCode(storedCountryCode);
      setPhone(storedPhone);
      setAccountNumber(storedAccountNumber);
      setDebitCard(storedDebitCard);
      setMessage('✅ Credentials found in session storage.');
      setOpenSnackbar(true);
      setChecked(true);
    } else {
      setMessage('❌ Credentials not found in session storage. Please enter them.');
      setOpenSnackbar(true);
      setChecked(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('This form is for checking credentials only, not for storing.');
    setOpenSnackbar(true);
  };

  if (!checked) {
    return (
      <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Checking credentials...</Typography>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Check Your Bank Account Credentials</Typography>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Country Code"
            fullWidth
            margin="normal"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
            required
            sx={{ mb: 1 }}
            inputProps={{ maxLength: 5 }}
            disabled
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">{countryCode}</Typography>
                </InputAdornment>
              ),
              inputMode: "numeric",
              pattern: "[0-9]*"
            }}
            disabled
          />
          <TextField
            label="Account Number"
            fullWidth
            margin="normal"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            required
            disabled
          />
          <TextField
            label="Debit Card Number"
            fullWidth
            margin="normal"
            value={debitCard}
            onChange={e => setDebitCard(e.target.value)}
            required
            disabled
          />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }} disabled>
            Checked
          </Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}
