'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert, CircularProgress, InputAdornment } from '@mui/material';

// Optionally, you could get bankList from props or a helper
const bankList = [
  { id: 'icici bank', name: 'ICICI Bank' },
  { id: 'hdfc bank', name: 'HDFC Bank' },
  { id: 'sbi', name: 'State Bank of India' },
  // ...add more as needed
];

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

  // Local user and linked bank info
  const [localUser, setLocalUser] = useState(null);
  const [linkedBank, setLinkedBank] = useState(null);

  const router = useRouter();

  // On mount: try sessionStorage, then public chamcha.json, then localStorage chamcha.json
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

    // If sessionStorage is missing fields, try public/chamcha.json
    async function fetchAppBackup() {
      try {
        const res = await fetch('/chamcha.json');
        if (res.ok) {
          const text = await res.text();
          const lines = text.split('\n').filter(Boolean);
          let foundUser = false;
          for (const line of lines) {
            try {
              const obj = JSON.parse(line);
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
                foundUser = true;
                break;
              }
            } catch {}
          }
          if (!foundUser) {
            // If no user found in chamcha.json, try localStorage
            findLocalUser();
          }
        } else {
          // If fetch fails, try localStorage
          findLocalUser();
        }
      } catch {
        // If fetch error, try localStorage
        findLocalUser();
      }
    }

    // Try localStorage chamcha.json as final fallback (for offline/local user)
    function findLocalUser() {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem('chamcha.json');
        let offlineUser = null;
        if (item) {
          try {
            offlineUser = JSON.parse(item);
          } catch {
            offlineUser = {};
          }
        }

        // Check for all user fields, including phone, username, countryCode, accountNumber, debitCardNumber
        if (
          offlineUser &&
          offlineUser.username === username &&
          offlineUser.phone === phone &&
          offlineUser.countryCode === countryCode &&
          offlineUser.accountNumber === accountNumber &&
          offlineUser.debitCardNumber === debitCard
        ) {
          setLocalUser(offlineUser);
          setUsername(offlineUser.username);
          setPhone(offlineUser.phone || '');
          setCountryCode(offlineUser.countryCode || '');
          setAccountNumber(offlineUser.accountNumber || '');
          setDebitCard(offlineUser.debitCardNumber || '');
          // Find linked bank in list
          const found = bankList.find(
            b => b.id === (offlineUser.bank || '').toLowerCase()
          );
          if (found) {
            setLinkedBank({
              ...found,
              accountNumber: offlineUser.accountNumber,
            });
          }
        } else {
          setMessage('User data not found.');
        }
      }
    }

    fetchAppBackup();
  }, []);

  // Simulate a "check" action (e.g. would be a server call in real app)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    // Remove the API call as requested
    // Instead, just do local validation or show a message
    // If you want to simulate a success, you can do so here

    // Example: Simulate a local only success if all fields match localUser
    if (
      localUser &&
      localUser.username === username &&
      localUser.phone === phone &&
      localUser.countryCode === countryCode &&
      localUser.accountNumber === accountNumber &&
      localUser.debitCardNumber === debitCard
    ) {
      
      setMessage('✅ Bank account linked successfully (local validation).');
    } else {
      setMessage('❌ Credentials check failed (local validation).');
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

  const showUserNotFound =
    !username || !accountNumber || !debitCard || !phone || !countryCode;

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Check Your Bank Account Credentials</Typography>
        {showUserNotFound ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            User data not found. Please enter your details.
          </Alert>
        ) : null}
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
        {linkedBank && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Linked bank: {linkedBank.name} (Account: {linkedBank.accountNumber})
          </Alert>
        )}
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