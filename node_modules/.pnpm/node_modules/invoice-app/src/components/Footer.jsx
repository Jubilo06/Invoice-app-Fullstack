import React from 'react';
import { 
  Box, 
  Container, 
  Stack, 
  Typography, 
  IconButton, 
  Tooltip, 
  Divider, 
  useTheme, 
  alpha 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: <GitHubIcon fontSize="small" />, 
      url: 'https://github.com/Jubilo06',
      hoverColor: '#ffffff'
    },
    { 
      name: 'LinkedIn', 
      icon: <LinkedInIcon fontSize="small" />, 
      url: 'https://www.linkedin.com/in/temiloluwa-amusan-749b134b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      hoverColor: '#0A66C2'
    },
    { 
      name: 'X (Twitter)', 
      icon: <XIcon fontSize="small" />, 
      url: 'https://x.com/jubiloforever?t=4AcX2si_9wGVx5J-2UWL1g&s=09',
      hoverColor: '#ffffff'
    },
    { 
      name: 'WhatsApp', 
      icon: <WhatsAppIcon fontSize="small" />, 
      url: 'https://wa.me/2348133834904',
      hoverColor: '#25D366'
    },
    { 
      name: 'Instagram', 
      icon: <InstagramIcon fontSize="small" />, 
      url: 'https://www.instagram.com/tml_bliss?igsh=YzljYTk10Dg3Zg==',
      hoverColor: '#E4405F'
    },
    { 
      name: 'Facebook', 
      icon: <FacebookIcon fontSize="small" />, 
      url: 'https://www.facebook.com/profile.php?id=100007386554971',
      hoverColor: '#1877F2'
    },
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#090e1a', 
        color: '#e2e8f0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 6, md: 8 },
        pb: { xs: 5, md: 6 },
      }}
    >
      {/* Ambient background glow */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '200px',
          background: `radial-gradient(ellipse at center, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="space-between">
          
          {/* Brand Identity & Tagline */}
          <Grid item xs={12} md={5} textAlign={{ xs: 'center', md: 'left' }}>
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              spacing={1.2}
              sx={{ mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  bgcolor: theme.palette.primary.main,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ReceiptLongRoundedIcon sx={{ fontSize: '1.2rem' }} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Fast<Box component="span" sx={{ color: theme.palette.primary.main }}>Bill</Box>
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', maxWidth: 360, mx: { xs: 'auto', md: 0 }, lineHeight: 1.6 }}>
              Precision financial tools designed for modern contractors, consultants, and growing businesses.
            </Typography>
          </Grid>

          {/* Social Links */}
          <Grid item xs={12} md={7}>
            <Stack 
              direction="column" 
              alignItems={{ xs: 'center', md: 'flex-end' }}
              spacing={1.5}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em', 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  fontWeight: 700 
                }}
              >
                Connect With The Developer
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                {socialLinks.map((social) => (
                  <Tooltip key={social.name} title={social.name} arrow>
                    <IconButton
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        p: 1.2,
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          color: social.hoverColor,
                          bgcolor: alpha(social.hoverColor, 0.12),
                          borderColor: alpha(social.hoverColor, 0.35),
                          transform: 'translateY(-3px)',
                          boxShadow: `0 6px 18px ${alpha(social.hoverColor, 0.25)}`,
                        }
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>
            </Stack>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Bottom Legal / Author Row */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          textAlign="center"
        >
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            © {currentYear} <strong>Jubilo</strong>. All rights reserved.
          </Typography>

          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.6 
            }}
          >
            Engineered with <FavoriteIcon sx={{ fontSize: '0.9rem', color: '#ef4444' }} /> by{' '}
            <Box
              component="a"
              href="https://github.com/Jubilo06"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#ffffff',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { color: theme.palette.primary.main, textDecoration: 'underline' }
              }}
            >
              Temiloluwa Amusan
            </Box>
          </Typography>
        </Stack>

      </Container>
    </Box>
  );
}

// Simple Grid helper if using MUI v5 Grid
import { Grid } from '@mui/material';

export default Footer;