'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert } from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const predefinedUsers = [
    { username: 'Kamla', email: 'kamladevi@gmail.com', password: 'saksham' },
    { username: 'Rohan', email: 'rohansatyam@gmail.com', password: 'saksham' },
  ];

  const handleLogin = async () => {
    // Check against predefined users first
    for (const user of predefinedUsers) {
      if (user.email === email && user.password === password) {
        localStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', user.username);
        router.push('/banks');
        return;
      }
    }

    // Fallback: Check with backend
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Login failed');
        setOpenSnackbar(true);
        return;
      }

      localStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', data.username); // must be returned by backend
      router.push('/banks');
    } catch (err) {
      setMessage('Something went wrong. Please try again later.');
      setOpenSnackbar(true);
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
      }}
    >
      <FinEdgeLogo />
      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
    </Container>
  );
}


