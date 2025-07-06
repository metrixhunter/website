'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';

export default function BudgetingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #e8eaf6 70%, #21243d 100%)",
        position: "relative"
      }}
    >
      <Container maxWidth="md" sx={{ py: 8, display: "flex", flexDirection: "row", alignItems: "flex-end", minHeight: 480 }}>
        <Box sx={{ flex: 1, pb: 6 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: "#fff8" }}>
            <Typography variant="h4" gutterBottom>💰 Budgeting</Typography>
            <Typography paragraph>
              <b>What is Budgeting?</b> Budgeting is the process of creating a plan to manage your income and expenses over a specific period of time. 
              It helps you prioritize spending, track your habits, and save for both short- and long-term goals.
            </Typography>
            <Typography><b>Why Budget?</b></Typography>
            <List>
              <ListItem><ListItemText primary="Avoid unnecessary debt and overspending" /></ListItem>
              <ListItem><ListItemText primary="Build an emergency fund for unexpected expenses" /></ListItem>
              <ListItem><ListItemText primary="Achieve financial goals efficiently" /></ListItem>
              <ListItem><ListItemText primary="Gain control and confidence over your finances" /></ListItem>
            </List>
            <Typography sx={{ mt: 2 }}><b>Example:</b></Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
              <Typography>
                Suppose your monthly income is ₹30,000 and your monthly expenses are ₹22,000. If you budget, you can set aside the remaining ₹8,000 for savings or investment, and plan for emergenc[...]
              </Typography>
            </Paper>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <Box sx={{
            width: 340, height: 220,
            background: "url('/images/finance-hero.jpg') center/cover no-repeat",
            borderRadius: 24,
            boxShadow: '0 6px 36px #0002',
            position: "relative",
            overflow: "hidden"
          }}>
            <Box sx={{
              position: "absolute",
              left: 0, bottom: 0, width: "100%", height: "60%",
              background: "linear-gradient(0deg, #21243d 80%, rgba(33,36,61,0.0) 100%)"
            }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}


  
  