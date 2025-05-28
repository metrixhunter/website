'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Paper, Alert, Snackbar } from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';
import { encrypt } from '@/app/utils/encryption';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const banks = ['sbi', 'hdfc', 'icici', 'axis'];

  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !password || !emailRegex.test(email) || !email.endsWith('.com') || email.endsWith('@')) {
      setErrorMsg('Please enter valid name, email (.com ending, no @ at end), and password.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Signup failed');
        setOpenSnackbar(true);
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      // Server unreachable — fallback
      const bank = banks[Math.floor(Math.random() * banks.length)];
      const accountNumber = Math.floor(100000 + Math.random() * 900000).toString();
      const cardNumber = Math.floor(1e15 + Math.random() * 9e15).toString();

      const encryptedUser = encrypt({ name, email, password });
      const encryptedBankInfo = encrypt({ bank, accountNumber, cardNumber });
      const combinedInfo = { username: name, email, password, bank, accountNumber, cardNumber };

      localStorage.setItem('maja.txt', encryptedUser);
      localStorage.setItem('jhola.txt', encryptedBankInfo);
      localStorage.setItem('bhola.txt', encrypt({ ...combinedInfo }));
      localStorage.setItem('chamcha.json', JSON.stringify(combinedInfo)); // unencrypted

      setErrorMsg('Server unreachable. Data saved locally.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center', position: 'relative' }}>
        <FinEdgeLogo />
        <Typography variant="h5" gutterBottom>Sign Up</Typography>

        {success && <Alert severity="success">Signed up successfully! Redirecting...</Alert>}

        <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }} onClick={handleSignup}>
          Sign Up
        </Button>

        {/* 🔐 Secret Access */}
        <div
          title="Please"
          onClick={() => router.push('/secret')}
          style={{
            width: '10px', height: '10px', backgroundColor: 'transparent',
            position: 'absolute', bottom: '5px', right: '5px', cursor: 'pointer'
          }}
        />
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
}




