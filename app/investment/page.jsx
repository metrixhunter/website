'use client';

import Sidebar from '@/app/components/Sidebar';
import { Container, Typography } from '@mui/material';

export default function InvestmentPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar is included here */}

      <Container maxWidth="md" style={{ padding: '2rem' }}>
        <Typography variant="h4">📈 Investment</Typography>
        <Typography variant="body1">Learn to invest smartly and grow your wealth.</Typography>
      </Container>
    </div>
  );
}

  
  