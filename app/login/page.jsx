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

  // ✅ Predefined users
  const predefinedUsers = [
    { username: 'Kamla', email: 'kamladevi@gmail.com', password: 'saksham' },
    { username: 'Rohan', email: 'rohansatyam@gmail.com', password: 'saksham' }
  ];

  const handleLogin = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // ✅ Combine predefined and stored users
    const allUsers = [...predefinedUsers, ...storedUsers];

    // ✅ Search for matching user
    const user = allUsers.find((user) => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', user.username);
      router.push('/banks');
    } else {
      setMessage('Invalid email or password. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem' }}
    >
      <FinEdgeLogo />

      <Paper elevation={3} style={{ padding: '2rem', width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Login</Typography>

        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Button variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }} onClick={handleLogin}>
          Log In
        </Button>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="error">{message}</Alert>
      </Snackbar>
    </Container>
  );
}







