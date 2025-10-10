/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';
import { db } from '@/firebase/firebaseClient'; // ✅ Firestore client
import { collection, doc, setDoc } from 'firebase/firestore';

const countryCodes = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+86', label: 'China (+86)' },
];

const banks = ['ICICI', 'AXIS', 'SBI', 'HDFC'];

// Random generators
const getRandomBank = () => banks[Math.floor(Math.random() * banks.length)];
const getRandomAccountNumber = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();
const getRandomDebitCardNumber = () =>
  Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
const getRandomPin = () => Math.floor(1000 + Math.random() * 9000).toString();
const getRandomBankBalance = () =>
  Math.floor(10000 + Math.random() * 70000); // 10k–80k rupees

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const redirectToOtp = () => {
    router.push(`/otp?redirect=/accountfound`);
  };

  const handleSignup = async () => {
    if (!username.trim()) {
      setErrorMsg('Please enter a username.');
      setOpenSnackbar(true);
      return;
    }
    if (!phone.match(/^\d{10}$/)) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      setOpenSnackbar(true);
      return;
    }

    const bank = getRandomBank();
    const accountNumber = getRandomAccountNumber();
    const debitCardNumber = getRandomDebitCardNumber();
    const pin = getRandomPin();
    const bankBalance = getRandomBankBalance();

    // Default UPI balance = 0
    const userData = {
      username,
      phone,
      countryCode,
      upiBalance: 0,
      bank,
      bankDetails: {
        accountNumber,
        debitCardNumber,
        pin,
        balance: bankBalance,
      },
      transactions: [],
      createdAt: new Date().toISOString(),
    };

    try {
      // ✅ Save to MongoDB (for main identity)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, countryCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed.');

      // ✅ Save to Firestore
    await setDoc(doc(db, 'users', phone), userData);



      setSuccess(true);
      setErrorMsg('');
      setOpenSnackbar(true);

      // Save basic info to sessionStorage
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('phone', phone);
      sessionStorage.setItem('countryCode', countryCode);
      console.log("✅ Firestore write successful, redirecting to OTP...");

      // Redirect to OTP page
       setTimeout(() => {
      router.push('/otp?redirect=/accountfound');
    }, 2200);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg(err.message || 'Signup failed. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 3, width: '100%', textAlign: 'center' }}>
        <FinEdgeLogo />
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>

        {success && (
          <Alert severity="success">
            Signed up successfully! Redirecting to OTP page...
          </Alert>
        )}

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Box display="flex" gap={1} alignItems="center">
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="country-code-label">Code</InputLabel>
            <Select
              labelId="country-code-label"
              id="country-code"
              value={countryCode}
              label="Code"
              onChange={(e) => setCountryCode(e.target.value)}
              size="small"
            >
              {countryCodes.map((option) => (
                <MenuItem value={option.code} key={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            sx={{ flex: 1 }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignup}
          disabled={success}
        >
          Sign Up
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={success ? 'success' : 'error'}>
          {success ? 'Signed up successfully!' : errorMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}*/
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';
import { db } from '@/firebase/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

const countryCodes = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+86', label: 'China (+86)' },
];

const banks = ['ICICI', 'AXIS', 'SBI', 'HDFC'];

const getRandomBank = () => banks[Math.floor(Math.random() * banks.length)];
const getRandomAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
const getRandomDebitCardNumber = () => Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
const getRandomPin = () => Math.floor(1000 + Math.random() * 9000).toString();
const getRandomBankBalance = () => Math.floor(10000 + Math.random() * 70000);

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  // ✅ Ensure reliable OTP redirect
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/otp?redirect=/accountfound');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSignup = async () => {
    if (!username.trim()) {
      setErrorMsg('Please enter a username.');
      setOpenSnackbar(true);
      return;
    }
    if (!phone.match(/^\d{10}$/)) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      setOpenSnackbar(true);
      return;
    }

    const bank = getRandomBank();
    const accountNumber = getRandomAccountNumber();
    const debitCardNumber = getRandomDebitCardNumber();
    const pin = getRandomPin();
    const bankBalance = getRandomBankBalance();

    // ✅ Correct MongoDB structure
    const userData = {
      username,
      phone,
      countryCode,
      upiBalance: 0,
      banks: [
        {
          bankName: bank,
          bankDetails: {
            accountNumber,
            debitCardNumber,
            pin,
            balance: bankBalance,
          },
        },
      ],
      transactions: [],
      comments: [],
      linked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // ✅ Register on MongoDB
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, countryCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed.');

      // ✅ Save same structure to Firestore
      await setDoc(doc(db, 'users', phone), userData);

      // ✅ Success feedback
      setSuccess(true);
      setErrorMsg('');
      setOpenSnackbar(true);

      // Save session
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('phone', phone);
      sessionStorage.setItem('countryCode', countryCode);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg(err.message || 'Signup failed. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 3, width: '100%', textAlign: 'center' }}>
        <FinEdgeLogo />
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>

        {success && <Alert severity="success">Signed up successfully! Redirecting...</Alert>}

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Box display="flex" gap={1} alignItems="center">
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="country-code-label">Code</InputLabel>
            <Select
              labelId="country-code-label"
              value={countryCode}
              label="Code"
              onChange={(e) => setCountryCode(e.target.value)}
              size="small"
            >
              {countryCodes.map((opt) => (
                <MenuItem key={opt.code} value={opt.code}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignup}
          disabled={success}
        >
          Sign Up
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={success ? 'success' : 'error'}>
          {success ? 'Signed up successfully!' : errorMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
