'use client';

import { useRouter } from 'next/navigation';
import { Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import logout from '../../logout/logout'; // Import logout utility

const actions = [
  { label: 'Pay', icon: '💸' },
  { label: 'UPI Money Transfer', icon: '💱' },
  { label: 'Passbook', icon: '📘' },
  { label: 'Add Money', icon: '➕' },
  { label: 'Recharge', icon: '🔋' },
  { label: 'Electricity', icon: '💡' },
  { label: 'Travel', icon: '🧳' },
  { label: 'Hotel', icon: '🏨' },
  { label: 'Send Money', icon: '💰' },
  { label: 'Bank Transfer', icon: '🏦' },
  { label: 'DTH Recharge', icon: '📺' },
];

export default function DashboardHome() {
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Clears session data
    router.push('/'); // Redirects to home
  };

  return (
    <Container maxWidth="md" style={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1">Welcome to your personal finance dashboard!</Typography>

      <Button variant="contained" color="secondary" style={{ marginTop: '1rem' }} onClick={handleLogout}>
        Logout
      </Button>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '2rem' }}>
        {actions.map((action, idx) => (
          <Grid item xs={6} sm={4} md={3} key={idx}>
            <Card style={{ textAlign: 'center', cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h5">{action.icon}</Typography>
                <Typography variant="body2">{action.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}













