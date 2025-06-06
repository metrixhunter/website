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

  // Only check for 'linked' state on mount, do not prefill credentials
  useEffect(() => {
    const linked = sessionStorage.getItem('linked');
    if (linked === 'true') {
      setMessage('✅ Bank credentials previously verified.');
    } else {
      setMessage('Fill and check your credentials below.');
    }
    setChecked(true);
    setOpenSnackbar(true);
  }, []);

  // Simulate a "check" action (e.g. would be a server call in real app)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    // Simulate "checking" credentials
    setTimeout(() => {
      // "Server" check logic: all fields must be non-empty
      if (countryCode && phone && accountNumber && debitCard) {
        // Simulate a server response object
        const data = { linked: true };
        if (data.linked !== false)
          sessionStorage.setItem('linked', data.linked ? 'true' : 'false');
        setMessage('✅ Credentials check passed! Bank is linked.');
      } else {
        const data = { linked: false };
        if (data.linked !== false)
          sessionStorage.setItem('linked', 'false');
        setMessage('❌ Please fill in all fields to check credentials.');
      }
      setOpenSnackbar(true);
      setLoading(false);
    }, 900);
  };

  if (!checked) {
    return (
      <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Checking previous status...</Typography>
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
          />
          <TextField
            label="Account Number"
            fullWidth
            margin="normal"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            required
          />
          <TextField
            label="Debit Card Number"
            fullWidth
            margin="normal"
            value={debitCard}
            onChange={e => setDebitCard(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={22} /> : 'Check Credentials'}
          </Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}
