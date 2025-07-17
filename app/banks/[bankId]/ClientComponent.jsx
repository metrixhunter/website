'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  InputAdornment,
} from '@mui/material';

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
  const [checked, setChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    function fetchSessionUser() {
      const bank = sessionStorage.getItem('bank');
      const accountNumber = sessionStorage.getItem('accountNumber');
      const debitCardNumber = sessionStorage.getItem('debitCardNumber');
      const countryCode = sessionStorage.getItem('countryCode');
      const phone = sessionStorage.getItem('phone');

      if (bank && accountNumber && debitCardNumber && countryCode && phone) {
        setMessage('✅ Loaded credentials from session');
        setOpenSnackbar(true);
      } else {
        setMessage('Please enter your credentials');
        setOpenSnackbar(true);
      }

      setChecked(true);
    }

    fetchSessionUser();
  }, []);

  const handleCheck = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    const user = {
      bank: sessionStorage.getItem('bank'),
      accountNumber: sessionStorage.getItem('accountNumber'),
      debitCardNumber: sessionStorage.getItem('debitCardNumber'),
      countryCode: sessionStorage.getItem('countryCode'),
      phone: sessionStorage.getItem('phone'),
    };

    const match =
      user &&
      user.bank?.toLowerCase() === bank.toLowerCase() &&
      user.accountNumber === accountNumber &&
      user.debitCardNumber === debitCard &&
      user.countryCode === countryCode &&
      user.phone === phone;

    if (match) {
      setMessage(`✅ Credentials verified`);
      sessionStorage.setItem('linked', 'true');
      router.push('/balance');
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
        <form onSubmit={handleCheck} autoComplete="on">
          <TextField
            label="Bank"
            select
            fullWidth
            margin="normal"
            value={bank}
            onChange={(e) => setBank(e.target.value)}s
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

