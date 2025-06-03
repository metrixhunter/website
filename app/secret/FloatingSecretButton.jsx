'use client';

import { useState, useEffect } from 'react';
import { Box, Fab, Popover, Typography, Modal, Button, TextField, Tabs, Tab, Paper, Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PASSWORD = 'finlock123';

function LocalUserView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem('chamcha.json');
      try {
        setData(item ? JSON.parse(item) : {});
      } catch {
        setData({});
      }
    }
  }, []);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Local User Backup</Typography>
      <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </>
  );
}

function ServerUserView() {
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(false);
  const [data, setData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleAccess = async () => {
    if (password === PASSWORD) {
      try {
        const res = await fetch('/api/secret/userdump');
        if (!res.ok) throw new Error('Server error');
        const users = await res.json();
        setData(users);
        setAccess(true);
        setSnackbar({ open: false, message: '', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to fetch user data from server.', severity: 'error' });
      }
    } else {
      setSnackbar({ open: true, message: 'Incorrect password.', severity: 'error' });
    }
  };

  return !access ? (
    <>
      <Typography>Enter password:</Typography>
      <TextField
        fullWidth
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        sx={{ mb: 1 }}
        autoComplete="off"
      />
      <Button variant="contained" sx={{ mt: 1 }} onClick={handleAccess}>Submit</Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  ) : (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Server User Data</Typography>
      <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>
        {data && data.length > 0 ? JSON.stringify(data, null, 2) : 'No users found.'}
      </pre>
    </>
  );
}

export default function FloatingSecretButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState(0);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleButtonClick = () => {
    setOpenModal(true);
    setAnchorEl(null);
  };

  const handleModalClose = () => setOpenModal(false);
  const handleTabChange = (_, value) => setTab(value);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999
        }}
      >
        <Fab
          color="secondary"
          size="small"
          sx={{
            minHeight: 36,
            height: 36,
            width: 36,
            boxShadow: 2,
            opacity: 0.7
          }}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick={handleButtonClick}
        >
          <VisibilityIcon fontSize="small" />
        </Fab>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: { pointerEvents: 'none', p: 1, bgcolor: 'background.paper', fontSize: 12, borderRadius: 1 }
          }}
          disableRestoreFocus
        >
          <Typography variant="caption" color="text.secondary">
            Secret User View
          </Typography>
        </Popover>
      </Box>
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.25)'
          }}
        >
          <Paper sx={{ borderRadius: 2, p: 2, minWidth: 350, maxWidth: 500 }}>
            <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
              <Tab label="Server" />
              <Tab label="Local" />
            </Tabs>
            {tab === 0 ? <ServerUserView /> : <LocalUserView />}
          </Paper>
        </Box>
      </Modal>
    </>
  );
}