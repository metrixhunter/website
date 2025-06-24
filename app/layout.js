'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Typography, Button, Box, Paper, Popover, Grid, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import './globals.css';

const exploreOptions = [
  { label: "Budgeting", href: "/budgeting" },
  { label: "Credit", href: "/credit" },
  { label: "Saving", href: "/saving" },
  { label: "Safety", href: "/safety" },
  { label: "Investment", href: "/investment" },
];
const calculatorOptions = [
  { label: "EMI Calculator" },
  { label: "Home Loan Calculator" },
  { label: "Education Loan EMI Calculator" },
  { label: "Personal Loan Calculator" },
  { label: "Currency Converter" },
  { label: "My Tools & Calculators" },
];
const footerLinks = [
  {
    title: "What's new",
    links: ["FinEdge AI", "Financial Reports", "Upcoming Features", "Blog", "Webinars"]
  },
  {
    title: "Learn",
    links: ["Budgeting Basics", "Saving Tips", "Investment 101", "Credit Education", "Safety Guides"]
  },
  {
    title: "Tools & Calculators",
    links: ["EMI Calculator", "Loan Tools", "Currency Converter", "My Tools"]
  },
  {
    title: "Company",
    links: ["About", "Support", "Careers", "Privacy", "Terms"]
  }
];

export default function Layout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body style={{
        background: "#f5f8fa"
      }}>
        <MainHeader showLoginSignup={pathname === "/"} />
        <main style={{ minHeight: "70vh" }}>
          {pathname === "/" ? <MainPageContent /> : children}
        </main>
        <FooterLikeMicrosoft />
      </body>
    </html>
  );
}

function MainHeader({ showLoginSignup }) {
  // Popover state
  const [exploreAnchor, setExploreAnchor] = useState(null);
  const [calcAnchor, setCalcAnchor] = useState(null);

  return (
    <Box
      sx={{
        width: '100%',
        px: 4,
        py: 2,
        bgcolor: "#fff",
        boxShadow: '0 2px 8px 0 #0001',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Brand & Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Typography variant="h5" sx={{
          color: "#283593",
          fontWeight: 700,
          fontFamily: "inherit",
          letterSpacing: 1,
          mr: 3
        }}>
          finedge
        </Typography>
        {/* Header buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="primary"
            endIcon={<ExpandMoreIcon />}
            onClick={e => setExploreAnchor(e.currentTarget)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Explore
          </Button>
          <Popover
            open={Boolean(exploreAnchor)}
            anchorEl={exploreAnchor}
            onClose={() => setExploreAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Box sx={{ p: 1 }}>
              {exploreOptions.map(opt =>
                <Button
                  key={opt.label}
                  href={opt.href}
                  component={Link}
                  fullWidth
                  sx={{ justifyContent: "flex-start", fontWeight: 500 }}
                  onClick={() => setExploreAnchor(null)}
                >
                  {opt.label}
                </Button>
              )}
            </Box>
          </Popover>
          <Button
            color="primary"
            endIcon={<ExpandMoreIcon />}
            onClick={e => setCalcAnchor(e.currentTarget)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Financial Tools & Calculators
          </Button>
          <Popover
            open={Boolean(calcAnchor)}
            anchorEl={calcAnchor}
            onClose={() => setCalcAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Box sx={{ p: 1 }}>
              {calculatorOptions.map(opt =>
                <Button
                  key={opt.label}
                  fullWidth
                  sx={{ justifyContent: "flex-start", fontWeight: 500 }}
                  disabled // not functional for now
                >
                  {opt.label}
                </Button>
              )}
            </Box>
          </Popover>
          <Button color="primary" sx={{ textTransform: "none", fontWeight: 600 }} disabled>
            Support
          </Button>
          <Button color="primary" sx={{ textTransform: "none", fontWeight: 600 }} disabled>
            About
          </Button>
        </Box>
      </Box>
      {/* Login/Signup for main page only */}
      {showLoginSignup && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="text" href="/login" sx={{ fontWeight: 500 }}>LOGIN</Button>
          <Button variant="contained" color="secondary" href="/signup" sx={{ fontWeight: 600 }}>SIGNUP</Button>
        </Box>
      )}
    </Box>
  );
}

function MainPageContent() {
  return (
    <Box sx={{ position: "relative", minHeight: "70vh", px: 0 }}>
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "100%",
        minHeight: 320,
        px: { xs: 2, md: 8 },
        pt: 6,
        background: "linear-gradient(to bottom, #e8eaf6 70%, #21243d 100%)",
        position: "relative"
      }}>
        <Box sx={{ maxWidth: 480, pb: 5 }}>
          <Typography variant="h3" sx={{ color: "#102040", fontWeight: 800, mb: 1, textAlign: "left" }}>
            Welcome to FinEdge
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2, textAlign: "left" }}>
            Securely manage your finances and unlock your financial potential with ease.
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mt: 2, textAlign: 'left', borderRadius: 3, background: "#fff8" }}>
            <Typography paragraph sx={{ mb: 1 }}>
              <b>FinEdge</b> is your all-in-one financial companion—helping you budget, save, invest, and protect your wealth.
              Our platform is designed for everyone: whether you’re a student, professional, or retiree, you’ll find tools and guidance for smarter money management.
            </Typography>
            <Typography paragraph sx={{ mb: 1 }}>
              <b>Specialty:</b> FinEdge is powered by an <b>AI assistant</b> that provides:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <li>Personalized savings advice</li>
              <li>Basic financial knowledge</li>
              <li>Guidance on money transfers within FinEdge</li>
              <li>Explanations of how money works</li>
              <li>And more—tailored for your needs!</li>
            </Box>
            <Typography paragraph sx={{ mt: 2 }}>
              <b>Get started by exploring our tools for budgeting, saving, investing, credit, and safety—from the header buttons above.</b>
            </Typography>
          </Paper>
        </Box>
        {/* Finance-themed image with dark tent/gradient at bottom */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <Box sx={{
            width: 360,
            height: 260,
            background: "url('/images/finance-hero.jpg') center/cover no-repeat",
            borderRadius: 24,
            boxShadow: '0 6px 36px #0002',
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Dark tent effect */}
            <Box sx={{
              position: "absolute",
              left: 0, bottom: 0, width: "100%", height: "60%",
              background: "linear-gradient(0deg, #21243d 80%, rgba(33,36,61,0.0) 100%)"
            }} />
          </Box>
        </Box>
      </Box>
      {/* Optionally, add more images/features below */}
    </Box>
  );
}

function FooterLikeMicrosoft() {
  return (
    <Box sx={{
      bgcolor: "#f7f7f7",
      borderTop: "1px solid #e0e0e0",
      mt: 8,
      pb: 0
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {footerLinks.map(section => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{section.title}</Typography>
              <List dense>
                {section.links.map(link =>
                  <ListItem key={link} disablePadding>
                    <ListItemText primary={<Typography sx={{ fontSize: "1rem", color: "#222" }}>{link}</Typography>} />
                  </ListItem>
                )}
              </List>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", py: 1, px: 2, fontSize: 14, color: "#888"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span role="img" aria-label="globe">🌐</span> English (India)
            <Button variant="outlined" size="small" sx={{ mx: 1, p: 0.5, minWidth: 32, height: 28, fontSize: 13 }}>✓</Button>
            Your Privacy Choices
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            Contact FinEdge
            <span>Privacy</span>
            <span>Terms of use</span>
            <span>Trademarks</span>
            <span>About our ads</span>
            <span>© FinEdge 2025</span>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}