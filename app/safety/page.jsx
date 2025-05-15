'use client';

import Sidebar from '@/app/components/Sidebar';
import { Container, Typography } from '@mui/material';

export default function SafetyPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar is included here */}

      <Container maxWidth="md" style={{ padding: '2rem' }}>
        <Typography variant="h4">🔒 Financial Safety</Typography>
        <Typography variant="body1">Protect yourself from fraud and manage financial risks wisely.</Typography>
      </Container>
    </div>
  );
}

  
  