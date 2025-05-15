'use client';

import { Container, Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <Container maxWidth="md" style={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1">
        Welcome to your personal finance dashboard!
      </Typography>
    </Container>
  );
}


    