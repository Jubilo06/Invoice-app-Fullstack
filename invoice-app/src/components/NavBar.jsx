import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // --- Handlers for the Mobile Menu ---
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose(); // Close the menu on action
    logout();
    navigate('/');
  };
  
  // A helper to navigate and close the menu
  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  // --- Reusable Menu Items ---
  // We define the menu items here to avoid repeating code.
  const loggedInLinks = [
    <MenuItem key="dashboard" onClick={() => handleNavigate('/dashboard')}>Dashboard</MenuItem>,
    <MenuItem key="profile" onClick={() => handleNavigate('/profile')}>Profile</MenuItem>,
    <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>,
  ];

  const guestLinks = [
    <MenuItem key="register" onClick={() => handleNavigate('/register')}>Register</MenuItem>,
    <MenuItem key="login" onClick={() => handleNavigate('/login')}>Login</MenuItem>,
  ];

  return (
    <AppBar position="static" sx={{bgcolor:'white'}}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to={user ? "/dashboard" : "/"} 
          sx={{ flexGrow: 1, textDecoration: 'none', color:'#060010' }}
        >
          QuickBill 
        </Typography>

        {/* --- DESKTOP VIEW (Visible on `md` screens and up) --- */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {user ? (
            // Desktop links for logged-in users
            <Stack direction='row' spacing={1}>              
              <Button sx={{textDecoration: 'none', backgroundColor:'#060010', border:'1px solid gold', color:'white', borderRadius:2}}  component={Link} to="/dashboard">Dashboard</Button>              
              <Button sx={{textDecoration: 'none', backgroundColor:'#060010', border:'1px solid old', color:'white',borderRadius:2}} component={Link} to="/profile">Profile</Button>
              <Button sx={{textDecoration: 'none', backgroundColor:'#060010', border:'1px solid gold', color:'white',borderRadius:2}} onClick={handleLogout}>Logout</Button>
            </Stack>
          ) : (
            // Desktop links for guests
            <Stack direction='row' spacing={1} >
              <Button sx={{textDecoration: 'none', color:'white', backgroundColor:'#060010', border:'1px solid gold',borderRadius:2}} component={Link} to="/register">Register</Button>
              <Button sx={{textDecoration: 'none', color:'white', backgroundColor:'#060010', border:'1px solid gold',borderRadius:2}} component={Link} to="/login">Login</Button>
            </Stack>
          )}
        </Box>

        {/* --- MOBILE VIEW (Visible on `xs` and `sm` screens) --- */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="#060010"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            {/* Conditionally render the correct set of menu items */}
            {user ? loggedInLinks : guestLinks}
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;