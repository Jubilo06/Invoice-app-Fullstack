import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack, 
  Card, 
  CardContent, 
  Chip, 
  Collapse, 
  IconButton, 
  Tooltip, 
  useTheme, 
  alpha 
} from '@mui/material';
import { useNavigate, useRouteError, Link } from 'react-router-dom';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

function ErrorPage({ statusCode = 404, title, message }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const routeError = useRouteError(); // For react-router data routers (optional)

  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determine error codes & messages dynamically
  const displayCode = routeError?.status || statusCode;
  const is404 = displayCode === 404;

  const displayTitle = title || (is404 ? "Lost in the Ledgers?" : "Something Went Wrong");
  const displayMessage = message || (
    is404 
      ? "The page or document you're searching for doesn't exist, has been archived, or the URL was mistyped." 
      : "An unexpected system error occurred while processing this transaction. Our team has been alerted."
  );

  const errorStack = routeError?.data || routeError?.message || routeError?.stack || "No additional error telemetry available.";

  const handleCopyError = () => {
    navigator.clipboard.writeText(typeof errorStack === 'object' ? JSON.stringify(errorStack, null, 2) : String(errorStack));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickLinks = [
    {
      icon: <ReceiptLongRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} />,
      title: 'Your Invoices',
      subtitle: 'Browse all documents',
      path: '/Dashboard'
    },
    {
      icon: <AddCircleOutlineRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} />,
      title: 'Create Invoice',
      subtitle: 'Start a new draft',
      path: '/invoice/new'
    },
    {
      icon: <BusinessRoundedIcon fontSize="small" sx={{ color: 'primary.main' }} />,
      title: 'Company Profile',
      subtitle: 'Check saved defaults',
      path: '/profile'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        px: 2,
        backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.04)} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Background Ambient Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '320px', sm: '600px', md: '750px' },
          height: '400px',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 65%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          
          {/* Status Badge */}
          <Chip
            icon={<SearchOffRoundedIcon sx={{ fontSize: '1rem !important' }} />}
            label={`Error Status: ${displayCode}`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              bgcolor: alpha(theme.palette.error.main, 0.08),
              color: 'error.main',
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              px: 1,
              py: 1.8
            }}
          />

          {/* Giant Numerals */}
          <Typography
            sx={{
              fontSize: { xs: '6rem', sm: '9rem', md: '11rem' },
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              background: `linear-gradient(180deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.15)} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              userSelect: 'none'
            }}
          >
            {displayCode}
          </Typography>

          {/* Headline & Subtitle */}
          <Box sx={{ maxWidth: 580, mx: 'auto' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                fontSize: { xs: '1.6rem', sm: '2.2rem' },
                letterSpacing: '-0.02em',
                mb: 1.5
              }}
            >
              {displayTitle}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                lineHeight: 1.6
              }}
            >
              {displayMessage}
            </Typography>
          </Box>

          {/* Main Action Recovery Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ width: { xs: '100%', sm: 'auto' }, pt: 1 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeRoundedIcon />}
              onClick={() => navigate('/Dashboard')}
              sx={{
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                px: 3.5,
                py: 1.4,
                boxShadow: `0 8px 24px -4px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              Back to Dashboard
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 1.4,
                borderColor: '#cbd5e1',
                color: 'text.primary',
                bgcolor: '#ffffff',
                '&:hover': {
                  borderColor: '#94a3b8',
                  bgcolor: '#f8fafc'
                }
              }}
            >
              Go to Previous Page
            </Button>
          </Stack>

          {/* Useful Quick Links Cards */}
          <Box sx={{ width: '100%', pt: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'text.disabled',
                display: 'block',
                mb: 2
              }}
            >
              Or Jump Directly To
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              {quickLinks.map((link, idx) => (
                <Card
                  key={idx}
                  component={Link}
                  to={link.path}
                  sx={{
                    flex: 1,
                    textDecoration: 'none',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    '&:hover': {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.2, '&:last-child': { pb: 2.2 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }}
                      >
                        {link.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                          {link.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {link.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Diagnostic Console (Collapsible for Devs / Support) */}
          <Box sx={{ width: '100%', pt: 2 }}>
            <Button
              size="small"
              startIcon={<BugReportOutlinedIcon />}
              onClick={() => setShowDetails(!showDetails)}
              sx={{
                color: 'text.disabled',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                '&:hover': { color: 'text.secondary' }
              }}
            >
              {showDetails ? 'Hide Technical Diagnostics' : 'Show Technical Diagnostics'}
            </Button>

            <Collapse in={showDetails}>
              <Box
                sx={{
                  mt: 2,
                  p: 2.5,
                  borderRadius: '12px',
                  bgcolor: '#0f172a',
                  color: '#e2e8f0',
                  textAlign: 'left',
                  position: 'relative',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Tooltip title={copied ? "Copied!" : "Copy Details"}>
                  <IconButton
                    size="small"
                    onClick={handleCopyError}
                    sx={{ position: 'absolute', top: 8, right: 8, color: '#94a3b8' }}
                  >
                    {copied ? <CheckRoundedIcon fontSize="small" sx={{ color: '#4ade80' }} /> : <ContentCopyRoundedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1, fontFamily: 'monospace' }}>
                  // CLIENT DIAGNOSTIC SNAPSHOT
                </Typography>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {typeof errorStack === 'object' ? JSON.stringify(errorStack, null, 2) : String(errorStack)}
                </pre>
              </Box>
            </Collapse>
          </Box>

        </Stack>
      </Container>
    </Box>
  );
}

export default ErrorPage;