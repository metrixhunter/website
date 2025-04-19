'use client';

import { Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import logout from '../../logout/logout'; // Import the logout utility

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
    logout(); // Call logout utility to clear session data
    router.push('/'); // Redirect to the root route (`/`)
  };

  return (
    <main style={{ padding: '1rem' }}>
      <h2 style={{ textAlign: 'center' }}>Welcome back, FinEdge User 👋</h2>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout} // Trigger handleLogout for logout and redirect
        >
          Logout
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          margin: '2rem 0',
          paddingBottom: '1rem',
        }}
      >
        {actions.map((action, idx) => (
          <Card key={idx} style={{ minWidth: '140px', textAlign: 'center', cursor: 'pointer' }}>
            <CardContent>
              <div style={{ fontSize: '1.8rem' }}>{action.icon}</div>
              <div style={{ marginTop: '0.5rem' }}>{action.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}











