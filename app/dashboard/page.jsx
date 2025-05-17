'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Typography, Button, Grid, Paper, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { logout } from '@/app/logout/logout';
import Link from 'next/link';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Container maxWidth="xl" style={{ padding: '2rem', display: 'flex' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <Paper
          elevation={3}
          style={{
            position: 'fixed', top: 0, left: 0, height: '100vh',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            width: '220px', padding: '1rem', border: '1px solid #ddd',
            backgroundColor: '#f9f9f9', borderRadius: '0 10px 10px 0',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <Link href="/dashboard" passHref>
          <Button
            fullWidth
            variant="contained"
            style={{ backgroundColor: '#004A99', color: 'white', fontWeight: 'bold', textTransform: 'none' }}
            onClick={() => router.push('/dashboard/home')}
          >
            🏠 Return to Home
          </Button>
          </Link>

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
      )}

      {/* Toggle Button */}
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed', top: 20, left: sidebarOpen ? 230 : 20,
          zIndex: 1000, backgroundColor: '#fff', border: '1px solid #ddd'
        }}
      >
        {sidebarOpen ? <ArrowBackIcon /> : <MenuIcon />}
      </IconButton>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarOpen ? '260px' : '60px', width: '100%', transition: 'margin-left 0.3s ease' }}>
        <Typography variant="h4">User</Typography>

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







    