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
  const [apiResult, setApiResult] = useState(null);
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

    // Simulate server credential validation via an API
    try {
      // Replace with your real API endpoint and payload if needed
      const res = await fetch('/api/auth/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode,
          phone,
          accountNumber,
          debitCardNumber: debitCard,
        }),
      });

      const data = await res.json();
      setApiResult(data);

      if (res.ok && data.success && data.linked) {
        sessionStorage.setItem('linked', 'true');
        setMessage('✅ Bank account linked successfully.');
      } else {
        sessionStorage.setItem('linked', 'false');
        setMessage(data.message || '❌ Credentials check failed.');
      }
    } catch (error) {
      // If API fails, fall back to local check (old method)
      if (countryCode && phone && accountNumber && debitCard) {
        sessionStorage.setItem('linked', 'true');
        setMessage('✅ Credentials check passed! Bank is linked.');
      } else {
        sessionStorage.setItem('linked', 'false');
        setMessage('❌ Please fill in all fields to check credentials.');
      }
    }
    setOpenSnackbar(true);
    setLoading(false);
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
        {apiResult && apiResult.success && apiResult.linked && (
          <pre style={{ marginTop: 16, background: '#f5f5f5', padding: 10, borderRadius: 6 }}>
            {JSON.stringify(apiResult, null, 2)}
          </pre>
        )}
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}