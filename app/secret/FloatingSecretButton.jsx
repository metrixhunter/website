'use client';

import { useState } from 'react';
import { Box, Fab, Popover, Typography, Modal } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import serveruserview from './Serveruserview';

export default function FloatingSecretButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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
            {/** The component name must match the import (lowercase) */}
            {serveruserview && serveruserview()}
          </Box>
        </Box>
      </Modal>
    </>
  );
}