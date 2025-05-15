'use client';

import Sidebar from '@/app/components/Sidebar';
import { Container, Typography, Button } from '@mui/material';

export default function HomePage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar is now included */}

      <Container maxWidth="md" style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4"> 💸 Welcome to FinEdge</Typography>
        <Typography variant="body1">
          Manage your finances efficiently with smart tools and insights.
        </Typography>

        {/* Restoring Login/Signup Buttons */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" href="/login">Login</Button>
          <Button variant="contained" color="secondary" href="/signup">Sign Up</Button>
        </div>
      </Container>
    </div>
  );
}





