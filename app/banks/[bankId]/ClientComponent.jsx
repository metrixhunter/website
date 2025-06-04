'use client';

import { useEffect, useState } from 'react';
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
  const router = useRouter();

  // On mount, check for credentials in session/local storage, and if found, skip form and proceed
  useEffect(() => {
    const storedCountryCode = sessionStorage.getItem('countryCode') || localStorage.getItem('countryCode');
    const storedPhone = sessionStorage.getItem('phone') || localStorage.getItem('phone');
    const storedAccountNumber = sessionStorage.getItem('accountNumber') || localStorage.getItem('accountNumber');
    const storedDebitCard = sessionStorage.getItem('debitCardNumber') || localStorage.getItem('debitCardNumber');

    // If all credentials are present, proceed automatically
    if (storedCountryCode && storedPhone && storedAccountNumber && storedDebitCard) {
      // Optionally, you can set state as well if you want to display the info somewhere
      setCountryCode(storedCountryCode);
      setPhone(storedPhone);
      setAccountNumber(storedAccountNumber);
      setDebitCard(storedDebitCard);

      // Auto-link bank and redirect without showing the form
      autoLinkAndRedirect(storedCountryCode, storedPhone, storedAccountNumber, storedDebitCard);
    }
  }, []);

  // Function to link and redirect (without showing the form)
  const autoLinkAndRedirect = async (countryCode, phone, accountNumber, debitCard) => {
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    try {
      // Directly link bank info (skip verification step)
      const linkRes = await fetch('/api/auth/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '', // Add username logic if needed
          phone,
          countryCode,
          bank: bankId,
          accountNumber,
          debitCardNumber: debitCard,
        }),
      });
      const linkData = await linkRes.json();

      if (linkRes.ok && linkData.success) {
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
        }));

        setMessage('✅ Linking successful!');
        setOpenSnackbar(true);
        setTimeout(() => router.push('/dashboard'), 1200);
      } else {
        setMessage(`❌ ${linkData.message || 'Failed to link bank account.'}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      setMessage('❌ Error linking bank. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    try {
      // Step 2: Link bank info (skip verification)
      const linkRes = await fetch('/api/auth/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '', // Add username logic if needed
          phone,
          countryCode,
          bank: bankId,
          accountNumber,
          debitCardNumber: debitCard,
        }),
      });
      const linkData = await linkRes.json();

      if (linkRes.ok && linkData.success) {
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
        }));

        setMessage('✅ Linking successful!');
        setOpenSnackbar(true);
        setTimeout(() => router.push('/dashboard'), 1200);
      } else {
        setMessage(`❌ ${linkData.message || 'Failed to link bank account.'}`);
        setOpenSnackbar(true);
      }
    } catch (err) {
      setMessage('❌ Error linking bank. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // If autolinking is happening, show a loading spinner and message instead of the form
  if (loading && (countryCode && phone && accountNumber && debitCard)) {
    return (
      <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Linking your bank credentials...
          </Typography>
          <CircularProgress />
        </Paper>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
        </Snackbar>
      </Container>
    );
  }

  // If no credentials found, show the form
  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Link Your Bank Account</Typography>
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
            {loading ? <CircularProgress size={22} /> : 'Link Account'}
          </Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}