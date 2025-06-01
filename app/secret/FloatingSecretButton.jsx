'use client';

import { useState } from 'react';
import { Box, Fab, Popover, Typography, Modal, Paper, Button, TextField, Container, Tabs, Tab } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PASSWORD = 'finlock123';

function LocalUserView() {
  const [data, setData] = useState(null);

  const loadData = () => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem('chamcha.json');
      try {
        setData(item ? JSON.parse(item) : {});
      } catch {
        setData({});
      }
    }
  };

  // Load data on mount
  useState(() => { loadData(); }, []);

  return (
    <>
      <Typography variant="h6">Local User Backup</Typography>
      <pre style={{ maxHeight: 400, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

function ServerUserView() {
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleAccess = async () => {
    if (password === PASSWORD) {
      try {
        const res = await fetch('/api/secret/userdump');
        if (!res.ok) throw new Error('Server error');
        const users = await res.json();
        setData(users);
        setAccess(true);
        setError('');
      } catch (err) {
        setError('Failed to fetch user data from server.');
      }
    } else {
      setError('Incorrect password.');
    }
  };

  return !access ? (
    <>
      <Typography>Enter password:</Typography>
      <TextField
        fullWidth
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button sx={{ mt: 1 }} onClick={handleAccess}>Submit</Button>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </>
  ) : (
    <>
      <Typography variant="h6">Server User Data</Typography>
      {data && data.length > 0 ? (
        <pre style={{ maxHeight: 400, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <Typography>No users found.</Typography>
      )}
    </>
  );
}

export default function FloatingSecretButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState(0);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClick = () => {
    setOpenModal(true);
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleTabChange = (_, value) => {
    setTab(value);
  };

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
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, minWidth: 350, maxWidth: 500 }}>
            <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
              <Tab label="Server" />
              <Tab label="Local" />
            </Tabs>
            {tab === 0 ? <ServerUserView /> : <LocalUserView />}
          </Box>
        </Box>
      </Modal>
    </>
  );
}