'use client';

import { useRouter } from 'next/navigation';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';
import { logout } from '@/app/logout/logout';

const actions = [
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
    logout(); 
    router.push('/'); 
  };

  return (
    <Container maxWidth="md" style={{ padding: '2rem', textAlign: 'center', position: 'relative', display: 'flex' }}>
      
      {/* 🔹 Sidebar (Always Fixed on Extreme Left) */}
      <Paper
        elevation={3}
        style={{
          position: 'fixed', top: '0', left: '0', height: '100vh',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          width: '220px', padding: '1rem', border: '1px solid #ddd',
          backgroundColor: '#f9f9f9', borderRadius: '0 10px 10px 0'
        }}
      >
       {/* 🔹 Return to Home Button */}
<Button
  fullWidth
  variant="contained"
  style={{
    padding: '10px', fontSize: '16px', fontWeight: 'bold', textTransform: 'none',
    backgroundColor: '#004A99', color: 'white'
  }}
  onClick={() => router.push('/dashboard/home')} // ✅ Redirects to Home after Login
>
  🏠 Return to Home
</Button>


        {/* 🔹 Financial Actions */}
        {actions.map((action, idx) => (
          <Button
            key={idx}
            fullWidth
            variant="outlined"
            style={{
              padding: '10px', fontSize: '16px', fontWeight: 'bold', textTransform: 'none',
              borderColor: 'transparent', backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => router.push(`/${action.label.toLowerCase().replace(/\s+/g, '-')}`)}
          >
            {action.icon} {action.label}
          </Button>
        ))}
      </Paper>

      {/* 🔹 Main Content */}
      <div style={{ marginLeft: '240px', width: '100%' }}> {/* Adjust for sidebar spacing */}
        <Typography variant="h4">{sessionStorage.getItem('username') }</Typography>
        <Typography variant="body1">Welcome to your personal finance dashboard!</Typography>

        <Button variant="contained" color="secondary" style={{ marginTop: '1rem' }} onClick={handleLogout}>
          Logout
        </Button>

        <Grid container spacing={2} justifyContent="center" style={{ marginTop: '2rem' }}>
          {actions.map((action, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Button
                fullWidth
                variant="outlined"
                style={{
                  padding: '10px', fontSize: '16px', fontWeight: 'bold', textTransform: 'none',
                  borderColor: 'transparent', backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => router.push(`/${action.label.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                {action.icon} {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>

    </Container>
  );
}























