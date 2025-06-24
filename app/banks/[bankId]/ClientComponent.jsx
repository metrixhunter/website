'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert, CircularProgress, InputAdornment } from '@mui/material';

export default function ClientComponent({ bankId }) {
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const router = useRouter();

  // On mount: try sessionStorage first, then fallback to app/chamcha.json (public folder)
  useEffect(() => {
    const linked = sessionStorage.getItem('linked');
    if (linked === 'true') {
      setMessage('✅ Bank credentials previously verified.');
    } else {
      setMessage('Fill and check your credentials below.');
    }
    setChecked(true);
    setOpenSnackbar(true);

    // Try sessionStorage first
    const sessionUser = sessionStorage.getItem('username');
    const sessionPhone = sessionStorage.getItem('phone');
    const sessionCountry = sessionStorage.getItem('countryCode');
    const sessionAccountNumber = sessionStorage.getItem('accountNumber');
    const sessionDebitCardNumber = sessionStorage.getItem('debitCardNumber');
    if (
      sessionUser &&
      sessionPhone &&
      sessionCountry &&
      sessionAccountNumber &&
      sessionDebitCardNumber
    ) {
      setUsername(sessionUser);
      setPhone(sessionPhone);
      setCountryCode(sessionCountry);
      setAccountNumber(sessionAccountNumber);
      setDebitCard(sessionDebitCardNumber);
      return;
    }

    // If sessionStorage is missing fields, try public/app/chamcha.json
    async function fetchAppBackup() {
      try {
        // Try /app/chamcha.json (relative to public)
        const res = await fetch('/chamcha.json');
        if (res.ok) {
          const text = await res.text();
          // File is newline-separated JSON objects - pick the first matching one
          const lines = text.split('\n').filter(Boolean);
          for (const line of lines) {
            try {
              const obj = JSON.parse(line);
              // Fill the form fields only if all values exist
              if (
                obj &&
                obj.username &&
                obj.phone &&
                obj.countryCode &&
                obj.accountNumber &&
                obj.debitCardNumber
              ) {
                setUsername(obj.username);
                setPhone(obj.phone);
                setCountryCode(obj.countryCode);
                setAccountNumber(obj.accountNumber);
                setDebitCard(obj.debitCardNumber);
                break;
              }
            } catch {}
          }
        }
      } catch {}
    }
    fetchAppBackup();
  }, []);

  // Simulate a "check" action (e.g. would be a server call in real app)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    try {
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
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('phone', phone);
        sessionStorage.setItem('countryCode', countryCode);
        sessionStorage.setItem('accountNumber', accountNumber);
        sessionStorage.setItem('debitCardNumber', debitCard);
        setMessage('✅ Bank account linked successfully.');
      } else {
        sessionStorage.setItem('linked', 'false');
        setMessage(data.message || '❌ Credentials check failed.');
      }
    } catch (error) {
      setSessionFieldsFromAppBackup();
      setMessage('❌ Credentials check failed. Tried to fallback from backup.');
    }
    setOpenSnackbar(true);
    setLoading(false);
  };

  // If API fails, try to set session fields from chamcha.json in app (public)
  const setSessionFieldsFromAppBackup = async () => {
    try {
      const res = await fetch('/chamcha.json');
      if (res.ok) {
        const text = await res.text();
        const lines = text.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const obj = JSON.parse(line);
            if (
              obj &&
              obj.username === username &&
              obj.phone === phone &&
              obj.countryCode === countryCode
            ) {
              sessionStorage.setItem('username', obj.username);
              sessionStorage.setItem('phone', obj.phone);
              sessionStorage.setItem('countryCode', obj.countryCode);
              sessionStorage.setItem('bank', obj.bank || 'icici Bank');
              sessionStorage.setItem('accountNumber', obj.accountNumber || '');
              sessionStorage.setItem('debitCardNumber', obj.debitCardNumber || '');
              localStorage.setItem('loggedIn', 'true');
              router.push('/otp');
              return;
            }
          } catch {}
        }
      }
    } catch {}
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
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            sx={{ mb: 1 }}
          />
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