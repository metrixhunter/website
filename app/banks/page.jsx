'use client';

import { useRouter } from 'next/navigation';
import { Container, Card, CardContent, Button, Typography, Grid } from '@mui/material';
import FloatingSecretButton from '../secret/FloatingSecretButton';

const banks = [
  { name: 'State Bank of India', id: 'sbi' },
  { name: 'HDFC Bank', id: 'hdfc' },
  { name: 'ICICI Bank', id: 'icici' },
  { name: 'Axis Bank', id: 'axis' }
];

/**
 * Checks the bank stored in sessionStorage (in user credentials) vs
 * the selectedBankId. If different, override the stored bank with selectedBankId.
 * Stores the selection temporarily in localStorage as well.
 */
export function selectOrOverrideBank(selectedBankId) {
  // Save user's selection to localStorage (temp before linking)
  localStorage.setItem('selectedBank', selectedBankId);

  try {
    const storedRaw = sessionStorage.getItem('bank');
    if (storedRaw) {
      const creds = JSON.parse(storedRaw);

      if (!creds.bank || creds.bank !== selectedBankId) {
        // Override stored bank with selected one
        creds.bank = selectedBankId;
        sessionStorage.setItem('bank', JSON.stringify(creds));
      }
    }
  } catch (e) {
    // If sessionStorage parsing fails, ignore safely
  }
}

export default function BanksPage() {
  const router = useRouter();

  const handleBankClick = (id) => {
    selectOrOverrideBank(id);
    router.push(`/banks/${id}`);
  };

  return (
    <>
      <Container maxWidth="md" style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom textAlign="center">Select Your Bank</Typography>

        <Grid container spacing={2} justifyContent="center">
          {banks.map((bank) => (
            <Grid item xs={6} sm={4} md={3} key={bank.id}>
              <Card style={{ textAlign: 'center', cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="h6">{bank.name}</Typography>
                  <Button variant="contained" color="primary" fullWidth onClick={() => handleBankClick(bank.id)}>
                    Select
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <FloatingSecretButton />
    </>
  );
}
