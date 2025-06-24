'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Typography, Button, Box, Popover } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export default function Layout({ children }) {
  const pathname = usePathname();
  // Header popovers state
  const [exploreAnchor, setExploreAnchor] = useState(null);
  const [calcAnchor, setCalcAnchor] = useState(null);

  return (
    <html lang="en">
      <body style={{ background: "#f5f8fa" }}>
        {/* HEADER: render only on main page */}
        {pathname === '/' && (
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
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="text" href="/login" sx={{ fontWeight: 500 }}>LOGIN</Button>
              <Button variant="contained" color="secondary" href="/signup" sx={{ fontWeight: 600 }}>SIGNUP</Button>
            </Box>
          </Box>
        )}
        {/* Render children (actual page content) */}
        {children}
      </body>
    </html>
  );
}