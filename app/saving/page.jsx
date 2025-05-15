'use client';

import Sidebar from '@/app/components/Sidebar';
import { Container, Typography } from '@mui/material';

export default function SavingPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar is included here */}

      <Container maxWidth="md" style={{ padding: '2rem' }}>
        <Typography variant="h4">🏦 Saving</Typography>
        <Typography variant="body1">Build financial security by saving effectively.</Typography>
      </Container>
    </div>
  );
}


