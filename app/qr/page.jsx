'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  IconButton
} from '@mui/material';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

export default function QRCodePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const bank = sessionStorage.getItem('bank');
    const phone = sessionStorage.getItem('phonenumber') || sessionStorage.getItem('accountNumber');

    if (username && bank && phone) {
      const userData = { username, bank, phone };
      setUser(userData);
      generateQR(userData);
      return;
    }

    const item = localStorage.getItem('chamcha.json');
    try {
      const localUser = item ? JSON.parse(item) : {};
      if (localUser.username && localUser.bank && localUser.accountNumber) {
        setUser(localUser);
        generateQR({
          username: localUser.username,
          bank: localUser.bank,
          phone: localUser.accountNumber,
        });
      } else {
        router.replace('/banks');
      }
    } catch {
      router.replace('/banks');
    }
  }, [router]);

  async function generateQR(userData) {
    setLoading(true);
    try {
      const qrContent = JSON.stringify({
        username: userData.username,
        bank: userData.bank,
        phone: userData.phone,
      });

      const url = await QRCode.toDataURL(qrContent);
      setQrDataUrl(url);
    } catch (err) {
      console.error('QR generation failed:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${user?.username || 'user'}-bank-qr.png`;
    link.click();
  }

  // --- QR SCANNER FUNCTIONS ---
  const startScan = async () => {
    setScanning(true);
    setScannedData(null);

    const videoElem = document.getElementById('qr-video');
    if (!videoElem) return;

    const qrScanner = new QrScanner(
      videoElem,
      (result) => {
        setScannedData(result?.data || '');
        qrScanner.stop();
        setScanning(false);
      },
      { returnDetailedScanResult: true }
    );

    setScanner(qrScanner);
    await qrScanner.start();
  };

  const stopScan = () => {
    if (scanner) {
      scanner.stop();
      setScanner(null);
    }
    setScanning(false);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #e3f2fd, #ffffff)',
        py: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          borderRadius: 4,
          bgcolor: '#fff',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => router.back()}
            sx={{ mr: 1, color: 'text.secondary' }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            QR Code Center
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {!scanning ? (
              <>
                {user && qrDataUrl ? (
                  <>
                    <Avatar
                      sx={{
                        bgcolor: '#1976d2',
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <AccountBalanceIcon fontSize="large" />
                    </Avatar>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {user.bank}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {user.username} — {user.phone}
                    </Typography>

                    <Box
                      sx={{
                        border: '2px solid #1976d2',
                        borderRadius: 3,
                        display: 'inline-block',
                        p: 1.5,
                        mb: 2,
                      }}
                    >
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        style={{
                          width: 220,
                          height: 220,
                        }}
                      />
                    </Box>

                    <Stack spacing={1}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        sx={{ borderRadius: 2, fontWeight: 500 }}
                      >
                        Download QR
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<QrCodeScannerIcon />}
                        onClick={startScan}
                        sx={{ borderRadius: 2 }}
                      >
                        Scan QR Code
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => router.push('/banks')}
                        sx={{ borderRadius: 2 }}
                      >
                        Back to Banks
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Typography color="text.secondary">
                    No user data found. Please link your bank account.
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Scanning QR Code...
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    border: '2px solid #1976d2',
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 2,
                  }}
                >
                  <video id="qr-video" style={{ width: '100%' }} />
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={stopScan}
                  sx={{ borderRadius: 2 }}
                >
                  Stop Scan
                </Button>

                {scannedData && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: '#f5f5f5',
                      borderRadius: 2,
                      textAlign: 'left',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      ✅ Scanned Data:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {scannedData}
                    </Typography>
                    {(() => {
                      try {
                        const parsed = JSON.parse(scannedData);
                        return (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              <strong>User:</strong> {parsed.username}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Bank:</strong> {parsed.bank}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Phone:</strong> {parsed.phone}
                            </Typography>
                          </Box>
                        );
                      } catch {
                        return null;
                      }
                    })()}
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}
