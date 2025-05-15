'use client';

import Sidebar from '../components/Sidebar';
import { Container, Typography } from '@mui/material';

export default function CreditPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar is included here */}

      <Container maxWidth="md" style={{ padding: '2rem' }}>
        <Typography variant="h4">💳 Credit</Typography>
        <Typography variant="body1">Manage your credit wisely and improve your financial stability.</Typography>
      </Container>
    </div>
  );
}

  