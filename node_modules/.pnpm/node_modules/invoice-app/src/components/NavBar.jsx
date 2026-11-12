import React, { useState, useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Stack, 
  Avatar, 
  Container, 
  Divider, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  useTheme, 
  alpha 
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Context
import { AuthContext } from './AuthContext';

// Icons
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';

function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElMobile, setAnchorElMobile] = useState(null);

  // Handlers
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenMobileMenu = (event) => setAnchorElMobile(event.currentTarget);
  const handleCloseMobileMenu = () => setAnchorElMobile(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    handleCloseMobileMenu();
    logout();
    navigate('/');
  };

  const handleNavigate = (path) => {
    handleCloseUserMenu();
    handleCloseMobileMenu();
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.8),
        color: 'text.primary',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          
          {/* ================= BRAND LOGO ================= */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5}
            component={Link} 
            to={user ? "/dashboard" : "/"} 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              mr: { xs: 2, md: 4 }
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: theme.palette.primary.main,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 18px -4px ${alpha(theme.palette.primary.main, 0.5)}`,
              }}
            >
              <ReceiptLongRoundedIcon fontSize="small" />
            </Box>

            <Typography 
              variant="h6" 
              component="span" 
              sx={{ 
                fontWeight: 900, 
                letterSpacing: '-0.03em',
                fontSize: '1.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#0f172a'
              }}
            >
              Fast<Box component="span" sx={{ color: theme.palette.primary.main }}>Bill</Box>
            </Typography>
          </Stack>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {user && (
              <>
                <Button
                  component={Link}
                  to="/dashboard"
                  startIcon={<DashboardOutlinedIcon sx={{ fontSize: '1.1rem !important' }} />}
                  sx={{
                    px: 2,
                    py: 0.9,
                    borderRadius: '10px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.925rem',
                    color: isActive('/dashboard') ? theme.palette.primary.main : 'text.secondary',
                    bgcolor: isActive('/dashboard') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  component={Link}
                  to="/profile"
                  startIcon={<BusinessRoundedIcon sx={{ fontSize: '1.1rem !important' }} />}
                  sx={{
                    px: 2,
                    py: 0.9,
                    borderRadius: '10px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.925rem',
                    color: isActive('/profile') ? theme.palette.primary.main : 'text.secondary',
                    bgcolor: isActive('/profile') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  Company Setup
                </Button>
              </>
            )}
          </Box>

          {/* ================= RIGHT CONTROLS ================= */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {/* Fast Create Action Button */}
                <Button
                  component={Link}
                  to="/invoice/new"
                  variant="contained"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 2.2,
                    py: 1,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  New Document
                </Button>

                {/* User Avatar with Dropdown Menu */}
                <Tooltip title="Account Settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, border: '2px solid transparent', '&:hover': { borderColor: theme.palette.primary.main } }}>
                    <Avatar 
                      sx={{ 
                        width: 38, 
                        height: 38, 
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}
                    >
                      {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                {/* Account Menu */}
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: '16px',
                      minWidth: 220,
                      p: 1,
                      boxShadow: '0 16px 36px -8px rgba(0,0,0,0.12)',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.6)
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={800} noWrap>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {user.companyName || user.username}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={() => handleNavigate('/dashboard')} sx={{ borderRadius: '8px', py: 1 }}>
                    <ListItemIcon><DashboardOutlinedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}>Dashboard</ListItemText>
                  </MenuItem>

                  <MenuItem onClick={() => handleNavigate('/profile')} sx={{ borderRadius: '8px', py: 1 }}>
                    <ListItemIcon><PersonOutlineRoundedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}>Profile & Branding</ListItemText>
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', py: 1, color: 'error.main' }}>
                    <ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }}>Log Out</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Guest Links
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    px: 2,
                    borderRadius: '10px',
                    '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) }
                  }}
                >
                  Sign In
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    bgcolor: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    px: 2.5,
                    py: 1,
                    borderRadius: '10px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      bgcolor: '#1e293b',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            )}
          </Box>

          {/* ================= MOBILE HAMBURGER ================= */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
            <IconButton
              size="large"
              aria-label="open mobile navigation menu"
              onClick={handleOpenMobileMenu}
              sx={{ color: '#0f172a' }}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElMobile}
              open={Boolean(anchorElMobile)}
              onClose={handleCloseMobileMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 250,
                  borderRadius: '18px',
                  p: 1.2,
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18)',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.8)
                }
              }}
            >
              {user ? [
                <Box key="header" sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={800}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.username}
                  </Typography>
                </Box>,
                <Divider key="div1" sx={{ my: 1 }} />,
                <MenuItem key="create" onClick={() => handleNavigate('/invoice/new')} sx={{ borderRadius: '10px', py: 1.2, bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main', mb: 0.5 }}>
                  <ListItemIcon><AddRoundedIcon fontSize="small" color="primary" /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }}>+ Create Invoice</ListItemText>
                </MenuItem>,
                <MenuItem key="dashboard" onClick={() => handleNavigate('/dashboard')} sx={{ borderRadius: '10px', py: 1.2 }}>
                  <ListItemIcon><DashboardOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}>Dashboard</ListItemText>
                </MenuItem>,
                <MenuItem key="profile" onClick={() => handleNavigate('/profile')} sx={{ borderRadius: '10px', py: 1.2 }}>
                  <ListItemIcon><PersonOutlineRoundedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}>Company Profile</ListItemText>
                </MenuItem>,
                <Divider key="div2" sx={{ my: 1 }} />,
                <MenuItem key="logout" onClick={handleLogout} sx={{ borderRadius: '10px', py: 1.2, color: 'error.main' }}>
                  <ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700 }}>Log Out</ListItemText>
                </MenuItem>
              ] : [
                <MenuItem key="login" onClick={() => handleNavigate('/login')} sx={{ borderRadius: '10px', py: 1.2 }}>
                  <ListItemIcon><LoginRoundedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 600 }}>Sign In</ListItemText>
                </MenuItem>,
                <MenuItem key="register" onClick={() => handleNavigate('/register')} sx={{ borderRadius: '10px', py: 1.2, bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main', mt: 0.5 }}>
                  <ListItemIcon><HowToRegRoundedIcon fontSize="small" color="primary" /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 700 }}>Get Started</ListItemText>
                </MenuItem>
              ]}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;