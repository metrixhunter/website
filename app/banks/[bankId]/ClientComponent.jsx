'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert, CircularProgress, MenuItem, InputAdornment } from '@mui/material';

const bankList = [
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'axis', name: 'Axis Bank' },
];

export default function BankCredentialsCheckPage() {
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState(null);
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchOnlineUser() {
      try {
        const res = await fetch('public/user_data/chamcha.json');
        if (res.ok) {
          const user = await res.json();
          if (user?.bank && user?.accountNumber && user?.debitCardNumber && user?.countryCode && user?.phone) {
            setBank(user.bank.toLowerCase());
            setAccountNumber(user.accountNumber);
            setDebitCard(user.debitCardNumber);
            setCountryCode(user.countryCode);
            setPhone(user.phone);
            setOnlineUser(user);
            setMessage('✅ Loaded credentials from online backup');
            setOpenSnackbar(true);
            setChecked(true);
            return;
          }
        }
        fetchOfflineUser();
      } catch {
        fetchOfflineUser();
      }
    }

    function fetchOfflineUser() {
      try {
        const user = JSON.parse(localStorage.getItem('chamcha.json'));
        if (user?.bank && user?.accountNumber && user?.debitCardNumber && user?.countryCode && user?.phone) {
         /* setBank(user.bank.toLowerCase());
          setAccountNumber(user.accountNumber);
          setDebitCard(user.debitCardNumber);
          setCountryCode(user.countryCode);
          setPhone(user.phone);
          setLocalUser(user);*/
          setMessage('✅ Loaded credentials from offline backup');
        } else {
          setMessage('Please enter your credentials');
        }
      } catch {
        setMessage('Please enter your credentials');
      }
      setOpenSnackbar(true);
      setChecked(true);
    }

    fetchOnlineUser();
  }, []);

  const handleCheck = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    const isValid = (user) =>
      user?.bank?.toLowerCase() === bank.toLowerCase() &&
      user?.accountNumber === accountNumber &&
      user?.debitCardNumber === debitCard &&
      user?.countryCode === countryCode &&
      user?.phone === phone;

    const source = isValid(onlineUser)
      ? 'server'
      : isValid(localUser)
      ? 'offline'
      : null;

    if (source) {
      setMessage(`✅ Credentials verified (${source})`);
    } else {
      setMessage('❌ Credentials check failed');
    }
    setOpenSnackbar(true);
    setLoading(false);
  };

  if (!checked) {
    return (
      <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Verify Bank Credentials
        </Typography>
        <form onSubmit={handleCheck} autoComplete="off">
          <TextField
            label="Bank"
            select
            fullWidth
            margin="normal"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            required
          >
            {bankList.map((b) => (
              <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Account Number"
            fullWidth
            margin="normal"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
          <TextField
            label="Debit Card Number"
            fullWidth
            margin="normal"
            value={debitCard}
            onChange={(e) => setDebitCard(e.target.value)}
            required
          />
          <TextField
            label="Country Code"
            fullWidth
            margin="normal"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            required
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body2">{countryCode}</Typography>
                </InputAdornment>
              ),
              inputMode: 'numeric',
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            style={{ marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify Credentials'}
          </Button>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}
