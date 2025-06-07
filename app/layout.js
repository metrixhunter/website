'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import FinEdgeLogo from '@/app/components/FinEdgeLogo';
import { ThemeProvider, useThemeContext } from '@/app/context/ThemeContext';
import ThemePicker from '@/app/components/ThemePicker';
import FooterFinancialNav from '@/app/components/FooterFinancialNav';
import './globals.css';

// Sidebar links for all financial pages
const sidebarLinks = [
  { href: '/', label: '🏠 Go to Main Page', color: '#222' },
  { href: '/budgeting', label: '💰 Budgeting', color: '#004A99' },
  { href: '/saving', label: '🏦 Saving', color: '#007B5E' },
  { href: '/credit', label: '💳 Credit', color: '#D32F2F' },
  { href: '/investment', label: '📈 Investment', color: '#388E3C' },
  { href: '/safety', label: '🔒 Financial Safety', color: '#F57C00' }
];

function FinanceSidebar({ show, setShow, pathname }) {
  const isFinancialPage = sidebarLinks.some(link => link.href === pathname);

  if (!isFinancialPage) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShow((prev) => !prev)}
        style={{
          position: 'fixed', top: '20px', left: show ? '210px' : '10px',
          padding: '10px', backgroundColor: '#333', color: '#fff',
          border: 'none', borderRadius: '5px', cursor: 'pointer',
          fontSize: '24px', transition: 'left 0.3s'
        }}
        aria-label="Toggle Finance Tools Sidebar"
      >
        {show ? '⬅' : '☰'}
      </button>
      {/* Side Bar */}
      {show && (
        <div style={{
          position: 'fixed', top: '60px', left: '10px',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          width: '200px', padding: '1rem', border: '1px solid #ddd',
          backgroundColor: '#f9f9f9', borderRadius: '10px', zIndex: 1200
        }}>
          <h3 style={{ margin: 0, fontWeight: 700 }}>Finance Tools</h3>
          {sidebarLinks.map(link => (
            <Link href={link.href} key={link.href}>
              <button style={{
                padding: '10px', width: '100%',
                backgroundColor: link.color, color: 'white', borderRadius: '5px', border: 'none'
              }}>
                {link.label}
              </button>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function MainPageContent() {
  return (
    <Box sx={{ position: 'relative' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', pt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
          <FinEdgeLogo style={{ width: 60, height: 60 }} />
        </Box>
        <Typography variant="h3" sx={{ mt: 2, mb: 2 }}>Welcome to FinEdge</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Securely manage your finances and unlock your financial potential with ease.
        </Typography>
        <Paper elevation={2} sx={{ p: 3, mt: 3, textAlign: 'left' }}>
          <Typography paragraph>
            <b>FinEdge</b> is your all-in-one financial companion—helping you budget, save, invest, and protect your wealth. 
            Our platform is designed for everyone: whether you’re a student, professional, or retiree, you’ll find tools and guidance for smarter money management.
          </Typography>
          <Typography paragraph>
            <b>Specialty:</b> FinEdge is powered by an <b>AI assistant</b> that provides:
          </Typography>
          {/* Fix the ul bug: do not nest ul in Typography with paragraph */}
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li>Personalized savings advice</li>
            <li>Basic financial knowledge</li>
            <li>Guidance on money transfers within FinEdge</li>
            <li>Explanations of how money works</li>
            <li>And more—tailored for your needs!</li>
          </Box>
          <Typography paragraph>
            <b>Get started by exploring our tools for budgeting, saving, investing, credit, and safety—from the links below or the sidebar.</b>
          </Typography>
        </Paper>
      </Container>
      <FooterFinancialNav links={[
        { href: '/budgeting', label: '💰 Budgeting' },
        { href: '/saving', label: '🏦 Saving' },
        { href: '/investment', label: '📈 Investment' },
        { href: '/credit', label: '💳 Credit' },
        { href: '/safety', label: '🛡️ Safety' }
      ]} />
      <ThemePicker />
    </Box>
  );
}

export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <ThemedLayout>{children}</ThemedLayout>
    </ThemeProvider>
  );
}

function ThemedLayout({ children }) {
  const pathname = usePathname();
  const { bgImage } = useThemeContext();
  const [showFinanceSidebar, setShowFinanceSidebar] = useState(false);

  // Determine if sidebar should show on this page
  const isFinancialPage = sidebarLinks.some(link => link.href === pathname);

  return (
    <html lang="en">
      <body className="app-container" style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover', backgroundAttachment: 'fixed'
      }}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold', color: '#004A99', fontFamily: 'inherit' }}>
                {/* Can add logo or app name here */}
              </Typography>
            </Link>
            {/* Only show LOGIN/SIGNUP on Main Page */}
            {pathname === '/' && (
              <Box>
                <Button variant="text" href="/login" sx={{ mr: 1 }}>LOGIN</Button>
                <Button variant="contained" color="secondary" href="/signup">SIGNUP</Button>
              </Box>
            )}
          </Box>

          {/* Finance Sidebar */}
          <FinanceSidebar show={showFinanceSidebar} setShow={setShowFinanceSidebar} pathname={pathname} />

          {/* Main Content */}
          <main className="main-content" style={{ flexGrow: 1, padding: '2rem' }}>
            {pathname === '/' ? <MainPageContent /> : children}
          </main>
        </div>
      </body>
    </html>
  );
}