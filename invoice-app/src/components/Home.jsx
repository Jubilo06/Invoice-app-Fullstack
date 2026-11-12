import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack, 
  Chip,
  useTheme, 
  alpha 
} from '@mui/material';
import { Link } from 'react-router-dom';
import FeaturesSection from './FeatureSection';
import src26 from '../assets/src26.jpg';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// AOS
import Aos from 'aos';
import 'aos/dist/aos.css';

function Home() {
  const theme = useTheme();

  useEffect(() => {
    Aos.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  const trustBadges = [
    'No credit card required',
    'Instant Vector PDF export',
    'Engineered for accuracy'
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default', overflowX: 'hidden' }}>
      
      {/* ================= HERO SECTION ================= */}
      <Box
        component="header"
        sx={{
          position: 'relative',
          minHeight: { xs: '88vh', sm: '92vh', md: '95vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          backgroundImage: `
            linear-gradient(
              180deg, 
              rgba(11, 17, 32, 0.72) 0%, 
              rgba(11, 17, 32, 0.88) 60%, 
              rgba(11, 17, 32, 0.98) 100%
            ), 
            url(${src26})
          `,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack 
            spacing={{ xs: 3, md: 4 }} 
            alignItems="center" 
            textAlign="center"
            sx={{ maxWidth: 860, mx: 'auto' }}
          >
            
            {/* Top Announcement Pill */}
            <Box data-aos="fade-down" data-aos-duration="600">
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important', color: '#60a5fa' }} />}
                label="Next-Gen Billing & Document Engine"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.04em',
                  color: '#e2e8f0',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  px: 1,
                  py: 2,
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
                }}
              />
            </Box>

            {/* Main Headline */}
            <Typography
              component="h1"
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '3.4rem', md: '4.2rem' },
                lineHeight: { xs: 1.18, sm: 1.15, md: 1.1 },
                letterSpacing: '-0.03em',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              Create, manage, and send{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                beautiful invoices
              </Box>{' '}
              in minutes.
            </Typography>

            {/* Supportive Subtitle */}
            <Typography
              variant="body1"
              data-aos="fade-up"
              data-aos-delay="200"
              sx={{
                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.35rem' },
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: 680,
                fontWeight: 400,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              Take control of your cash flow with an all-in-one suite for invoices, 
              engineering BEME evaluations, quotations, and instant server-side PDF generation.
            </Typography>

            {/* Call To Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              width={{ xs: '100%', sm: 'auto' }}
              pt={1.5}
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  px: 4,
                  py: 1.7,
                  borderRadius: '12px',
                  boxShadow: `0 10px 28px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 14px 34px -4px ${alpha(theme.palette.primary.main, 0.65)}`,
                  }
                }}
              >
                Get Started Free
              </Button>

              <Button
                component="a"
                href="#features"
                variant="outlined"
                size="large"
                startIcon={<PlayCircleOutlineIcon />}
                sx={{
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.35)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  px: 3.5,
                  py: 1.7,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#ffffff',
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                See How It Works
              </Button>
            </Stack>

            {/* Trust Badges */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1.5, sm: 3.5 }} 
              pt={{ xs: 2, sm: 3 }}
              alignItems="center"
              justifyContent="center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              {trustBadges.map((badge, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: '1.15rem', color: '#34d399' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500, fontSize: '0.85rem' }}>
                    {badge}
                  </Typography>
                </Box>
              ))}
            </Stack>

          </Stack>
        </Container>
      </Box>

      {/* ================= FEATURES SECTION ================= */}
      <Box id="features">
        <FeaturesSection />
      </Box>

    </Box>
  );
}

export default Home;