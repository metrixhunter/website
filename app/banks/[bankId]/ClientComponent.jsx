'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selectOrOverrideBank } from '../bankUtils';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

export default function BankCredentialsCheckPage() {
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [pin, setPin] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [linked, setLinked] = useState(false);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [bankBalance, setBankBalance] = useState(0);

  const router = useRouter();

  useEffect(() => {
    // Load selected bank
    const selectedBank = localStorage.getItem('selectedBank');
    if (selectedBank) {
      setBank(selectedBank);
      selectOrOverrideBank(selectedBank);
    }

    // Load session data
    const sessionLinked = sessionStorage.getItem('linked') === 'true';
    const sessionBank = sessionStorage.getItem('bank');
    const sessionPhone = sessionStorage.getItem('phone');
    const sessionCountryCode = sessionStorage.getItem('countryCode');

    if (sessionBank) setBank(sessionBank);
    if (sessionLinked) setLinked(true);
    if (sessionPhone) setPhone(sessionPhone);
    if (sessionCountryCode) setCountryCode(sessionCountryCode);

    // Try to get bank balance from banks array
    const banks = JSON.parse(sessionStorage.getItem('banks') || '[]');
    const bankObj = banks.find(b => b.bankName === sessionBank || b.bankDetails?.accountNumber === accountNumber);

    if (bankObj) {
      const balance = bankObj?.bankDetails?.balance || 0;
      setBankBalance(balance);
    }

    setMessage(sessionLinked ? 'Bank already linked. Enter PIN to view balance.' : 'Please enter your bank credentials');
    setChecked(true);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOpenSnackbar(false);

    const banks = JSON.parse(sessionStorage.getItem('banks') || '[]');

    // Already linked: only verify PIN + phone + countryCode
    if (linked) {
      const storedPin = localStorage.getItem(`${bank}_pin`);
      if (pin === storedPin && phone && countryCode) {
        // Read balance from banks array instead of sessionStorage
        const bankObj = banks.find(b => b.bankName === bank || b.bankDetails?.accountNumber === accountNumber);
        const balance = bankObj?.bankDetails?.balance || 0;
        setBankBalance(balance);
        setMessage(`✅ PIN verified! Bank balance: ₹${balance}`);
      } else {
        setMessage('❌ Incorrect PIN or phone/country code');
      }
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    // First-time verification
    if (!accountNumber || !debitCard || !phone || !countryCode) {
      setMessage('❌ Please fill all required fields');
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    // Simulate successful verification (replace with real API call)
    const verifiedBalance = Math.floor(Math.random() * 50000); // demo balance

    // Update banks array with new balance
    const updatedBanks = banks.map(b => {
      if (b.bankDetails?.accountNumber === accountNumber) {
        return {
          ...b,
          bankDetails: {
            ...b.bankDetails,
            balance: verifiedBalance,
          },
        };
      }
      return b;
    });

    sessionStorage.setItem('linked', 'true');
    sessionStorage.setItem('bank', bank);
    sessionStorage.setItem('banks', JSON.stringify(updatedBanks));

    // Save PIN locally for future quick verification
    localStorage.setItem(`${bank}_pin`, pin);

    setLinked(true);
    setBankBalance(verifiedBalance);
    setMessage(`✅ Bank linked successfully! Balance: ₹${verifiedBalance}`);
    setOpenSnackbar(true);
    setLoading(false);
  };

  if (!checked) {
    return (
      <Container
        maxWidth="xs"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xs"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
    >
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {linked ? 'Enter PIN to Access Bank' : 'Verify Bank Credentials'}
        </Typography>
        <Typography variant="subtitle2" gutterBottom color="textSecondary">
          Bank: {bank || 'Not selected'}
        </Typography>
        <form onSubmit={handleVerify} autoComplete="off">
          {!linked && (
            <>
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
            </>
          )}
          <TextField
            label="PIN"
            fullWidth
            margin="normal"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            type="password"
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
            {loading ? <CircularProgress size={24} /> : linked ? 'Verify PIN' : 'Verify Credentials'}
          </Button>
        </form>
        {linked && bankBalance > 0 && (
          <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
            Current Balance: ₹{bankBalance}
          </Typography>
        )}
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.includes('✅') ? 'success' : 'error'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}
