'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const PASSWORD = 'fin123';

export default function SecretUserView() {
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (access) {
      const localData = JSON.parse(localStorage.getItem('surpriseUserData') || '[]');
      setData(localData);
    }
  }, [access]);

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        {!access ? (
          <>
            <Typography>Enter password:</Typography>
            <TextField fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button sx={{ mt: 1 }} onClick={() => setAccess(password === PASSWORD)}>Submit</Button>
          </>
        ) : (
          <>
            <Typography variant="h6">Local User Backup</Typography>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </>
        )}
      </Paper>
    </Container>
  );
}
