'use client';

import { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const PASSWORD = 'finlock123';

export default function ServerUserView() {
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleAccess = async () => {
    if (password === PASSWORD) {
      try {
        const res = await fetch('/api/secret/userdump');
        if (!res.ok) throw new Error('Server error');
        const users = await res.json();
        setData(users);
        setAccess(true);
        setError('');
      } catch (err) {
        setError('Failed to fetch user data from server.');
      }
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        {!access ? (
          <>
            <Typography>Enter password:</Typography>
            <TextField
              fullWidth
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button sx={{ mt: 1 }} onClick={handleAccess}>Submit</Button>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Typography variant="h6">Server User Data</Typography>
            {data && data.length > 0 ? (
              <pre style={{ maxHeight: 400, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
            ) : (
              <Typography>No users found.</Typography>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}