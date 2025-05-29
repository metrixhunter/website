'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  // Optional: Allow some hardcoded users
  const predefinedUsers = [
    { username: 'Kamla', phone: '9999999999' },
    { username: 'Rohan', phone: '8888888888' },
  ];

  const handleLogin = async () => {
    // 1. Check against predefined users (optional)
    for (const user of predefinedUsers) {
      if (user.phone === phone && user.username === username) {
        localStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('phone', user.phone);
        router.push('/banks');
        return;
      }
    }

    // 2. Backend authentication (using username and phone)
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      localStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', data.username);
      sessionStorage.setItem('phone', data.phone);
      router.push('/banks');
    } catch (err) {
      // 3. Offline fallback: check maja.txt or localStorage (username and phone)
      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('chamcha.json');
          let offlineUser = null;
          if (raw) {
            try {
              offlineUser = JSON.parse(raw);
            } catch {
              // fallback: maybe it's just a string
              offlineUser = {};
            }
          }

          if (
            offlineUser &&
            offlineUser.phone === phone &&
            offlineUser.username === username
          ) {
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('phone', phone);
            localStorage.setItem('loggedIn', 'true');
            router.push('/banks');
            return;
          }
        }

        setMessage('Server unreachable and no matching user found.');
        setOpenSnackbar(true);
      } catch (fallbackErr) {
        console.error('Offline login failed:', fallbackErr);
        setMessage('Offline login failed. Try again later.');
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '1rem',
        position: 'relative',
      }}
    >
      <FinEdgeLogo />
      <Paper
        elevation={3}
        style={{ padding: '2rem', width: '100%', textAlign: 'center' }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          label="Phone Number"
          type="tel"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/, ''))}
          required
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={handleLogin}
        >
          Log In
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">{message}</Alert>
      </Snackbar>

      {/* 🔒 Hidden admin link */}
      <div
        title="Please"
        onClick={() => router.push('/secret')}
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          cursor: 'pointer',
        }}
      />
    </Container>
  );
}