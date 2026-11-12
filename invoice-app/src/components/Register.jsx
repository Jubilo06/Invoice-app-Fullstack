import React, { useContext, useState, useEffect } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  Button, 
  TextField, 
  IconButton, 
  InputAdornment, 
  Alert, 
  CircularProgress,
  Avatar,
  Container,
  useTheme,
  alpha 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Contexts & Assets
import { InvoiceContext } from './InvoiceProvider';
import { AuthContext } from './AuthContext';
import personal from '../assets/personal.png';
import src10 from '../assets/src10.jpg';

// AOS
import Aos from 'aos';
import 'aos/dist/aos.css';

function Register() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { loading, setLoading } = useContext(InvoiceContext);
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    username: '', 
    password: '' 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Aos.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear errors when the user types
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      setLoading(true);
      await register(formData);
      setLoading(false);
      navigate('/login');
    } catch (error) {
      console.error("Caught error during registration:", error);
      setErrorMessage(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, sm: 8 },
        backgroundImage: `
          linear-gradient(180deg, rgba(11, 15, 25, 0.78) 0%, rgba(11, 15, 25, 0.92) 100%),
          url(${src10})
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        px: 2
      }}
    >
      <Container maxWidth="xs">
        {/* Glass Card Container */}
        <Box
          data-aos="fade-up"
          sx={{
            p: { xs: 3.5, sm: 4.5 },
            borderRadius: '24px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
          }}
        >
          {/* Avatar / Logo Header */}
          <Avatar
            src={personal}
            alt="User profile icon"
            sx={{
              width: 72,
              height: 72,
              mx: 'auto',
              mb: 2,
              p: 1.2,
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              border: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
              boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              img: { objectFit: 'contain' }
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              mb: 0.5,
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.65)', mb: 3 }}
          >
            Start creating automated invoices in seconds
          </Typography>

          {/* Inline Error Banner */}
          {errorMessage && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: '12px', 
                bgcolor: 'rgba(239, 68, 68, 0.15)', 
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                '& .MuiAlert-icon': { color: '#fca5a5' }
              }}
            >
              {errorMessage}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.2}>
              
              {/* Row 1: First Name & Last Name */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  sx={customInputStyle(theme)}
                />

                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  sx={customInputStyle(theme)}
                />
              </Stack>

              {/* Row 2: Username */}
              <TextField
                fullWidth
                name="username"
                label="Username or Email"
                placeholder="johndoe@example.com"
                value={formData.username}
                onChange={handleChange}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={customInputStyle(theme)}
              />

              {/* Row 3: Password with Show/Hide Toggle */}
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={customInputStyle(theme)}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={!formData.username || !formData.password || loading}
                endIcon={!loading && <ArrowForwardIcon />}
                sx={{
                  mt: 1,
                  py: 1.6,
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  bgcolor: theme.palette.primary.main,
                  color: '#ffffff',
                  boxShadow: `0 8px 25px -4px ${alpha(theme.palette.primary.main, 0.6)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 30px -4px ${alpha(theme.palette.primary.main, 0.8)}`,
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.35)',
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Create Account'}
              </Button>

              {/* Login Route Link */}
              <Box pt={1}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Already have an account?{' '}
                  <Box
                    component={Link}
                    to="/login"
                    sx={{
                      color: theme.palette.primary.light || '#60a5fa',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#93c5fd'
                      }
                    }}
                  >
                    Sign In
                  </Box>
                </Typography>
              </Box>

            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// Reusable styling helper for the glassy text fields
const customInputStyle = (theme) => ({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    bgcolor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.35)',
    },
    '&.Mui-focused': {
      bgcolor: 'rgba(0, 0, 0, 0.35)',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '1.5px',
      }
    }
  }
});

export default Register;