'use client';
import { useEffect, useState, useRef } from 'react';
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
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // Load user info
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const bank = sessionStorage.getItem('bank');
    const phone = sessionStorage.getItem('phonenumber') || sessionStorage.getItem('accountNumber');

    if (username && bank && phone) {
      const userData = { username, bank, phone };
      setUser(userData);
      generateQR(userData);
    } else {
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
    }
  }, [router]);

  // Generate QR
  async function generateQR(userData) {
    setLoading(true);
    try {
      const qrContent = JSON.stringify(userData);
      const url = await QRCode.toDataURL(qrContent);
      setQrDataUrl(url);
    } catch (err) {
      console.error('QR generation failed:', err);
    } finally {
      setLoading(false);
    }
  }

  // Download QR
  function handleDownload() {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${user?.username || 'user'}-bank-qr.png`;
    link.click();
  }

  // Start scanning
  const startScan = async () => {
    try {
      setScanning(true);
      setScannedData(null);

      const videoElem = videoRef.current;
      if (!videoElem) return console.error('Video element not found');

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoElem.srcObject = stream;
      await videoElem.play();
      console.log('🎥 Video playing');

      const qrScanner = new QrScanner(
        videoElem,
        result => {
          console.log('✅ QR detected:', result);
          if (result?.data) {
            setScannedData(result.data);
            stopScan();
          }
        },
        { returnDetailedScanResult: true }
      );

      scannerRef.current = qrScanner;
      await qrScanner.start();
      console.log('🚀 Scanner started');
    } catch (err) {
      console.error('❌ Camera error:', err);
      setScanning(false);
    }
  };

  // Stop scanning
  const stopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  return (
    <Container maxWidth="xs" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3, width: '100%', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
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
                    <Avatar sx={{ bgcolor: '#1976d2', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                      <AccountBalanceIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {user.bank}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {user.username} — {user.phone}
                    </Typography>
                    <Box sx={{ border: '2px solid #1976d2', borderRadius: 3, display: 'inline-block', p: 1.5, mb: 2 }}>
                      <img src={qrDataUrl} alt="QR Code" style={{ width: 220, height: 220 }} />
                    </Box>
                    <Stack spacing={1}>
                      <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
                        Download QR
                      </Button>
                      <Button variant="outlined" startIcon={<QrCodeScannerIcon />} onClick={startScan}>
                        Scan QR Code
                      </Button>
                      <Button variant="outlined" onClick={() => router.push('/banks')}>
                        Back to Banks
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Typography color="text.secondary">No user data found.</Typography>
                )}
              </>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Scanning QR Code...
                </Typography>
                <Box sx={{ border: '2px solid #1976d2', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                  <video ref={videoRef} style={{ width: '100%', backgroundColor: '#000' }} muted playsInline />
                </Box>
                <Button variant="outlined" color="error" onClick={stopScan}>
                  Stop Scan
                </Button>
                {scannedData && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'left' }}>
                    <Typography variant="subtitle2">✅ Scanned Data:</Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {scannedData}
                    </Typography>
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
