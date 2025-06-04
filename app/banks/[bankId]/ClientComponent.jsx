'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert, CircularProgress, InputAdornment } from '@mui/material';

export default function ClientComponent({ bankId }) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    try {
      // Step 1: Verify bank info
      const res = await fetch('/api/user/bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          countryCode,
          bank: bankId,
          accountNumber,
          debitCardNumber: debitCard
        })
      });

      const data = await res.json();

      if (data.success) {
        // Step 2: Link bank info
        const linkRes = await fetch('/api/auth/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: '', // If you want to use a username, fetch from storage or add a username input
            phone,
            countryCode,
            bank: bankId,
            accountNumber,
            debitCardNumber: debitCard,
          }),
        });
        const linkData = await linkRes.json();

        if (linkRes.ok && linkData.success) {
          // Store for future sessions if needed
          sessionStorage.setItem('bank', bankId);
          sessionStorage.setItem('accountNumber', accountNumber);
          sessionStorage.setItem('debitCardNumber', debitCard);
          sessionStorage.setItem('linked', 'true');
          sessionStorage.setItem('phone', phone);
          sessionStorage.setItem('countryCode', countryCode);
          localStorage.setItem('linkedBank', JSON.stringify({
            bank: bankId,
            accountNumber,
            debitCardNumber: debitCard,
            phone,
            countryCode,
            // Add username if available
          }));

          setMessage('✅ Verification & linking successful!');
          setOpenSnackbar(true);
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setMessage(`❌ ${linkData.message || 'Failed to link bank account.'}`);
          setOpenSnackbar(true);
        }
      } else {
        setMessage(`❌ ${data.error || 'Verification failed.'}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      setMessage('❌ Error verifying or linking bank. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Verify Your Bank Account</Typography>
        <form onSubmit={handleSubmit}>
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
          <TextField label="Account Number" fullWidth margin="normal" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
          <TextField label="Debit Card Number" fullWidth margin="normal" value={debitCard} onChange={e => setDebitCard(e.target.value)} required />
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={22} /> : 'Verify'}
          </Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}