import React, { useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Chip,
  useTheme,
  alpha 
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DescriptionIcon from '@mui/icons-material/Description';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// AOS Import
import AOS from 'aos';
import 'aos/dist/aos.css';

function FeaturesSection() {
  const theme = useTheme();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }, []);

  const features = [
    {
      icon: <ReceiptLongIcon fontSize="medium" />,
      tag: 'Invoicing',
      title: 'Professional Invoices',
      description: 'Get Paid Faster. Create itemized, automated invoices in seconds with built-in calculations for taxes, regional levies, discounts, and shipping.'
    },
    {
      icon: <RequestQuoteIcon fontSize="medium" />,
      tag: 'Estimates',
      title: 'Detailed Quotations',
      description: 'Win More Projects. Present crystal-clear proposals with itemized breakdowns that clients can understand and approve in a single click.'
    },
    {
      icon: <DescriptionIcon fontSize="medium" />,
      tag: 'Agreements',
      title: 'Proforma Invoices',
      description: 'Solidify Deals Early. Issue legally binding proforma drafts to secure upfront commitments prior to inventory dispatch or project kick-off.'
    },
    {
      icon: <CalculateIcon fontSize="medium" />,
      tag: 'Engineering',
      title: 'BEME Evaluations',
      description: 'Engineering-Grade Precision. Built specifically for contractors to dynamically quantify complex labor, material units, and equipment run-rates.'
    },
    {
      icon: <AccountCircleIcon fontSize="medium" />,
      tag: 'Identity',
      title: 'Secure Brand Profiles',
      description: 'Zero Redundant Input. Securely store your business registration, vector logos, and executive signatures for seamless automated document headers.'
    },
    {
      icon: <PictureAsPdfIcon fontSize="medium" />,
      tag: 'Export Engine',
      title: 'Vector PDF Engine',
      description: 'Flawless Documents Every Time. Generate ultra-crisp, print-ready PDFs compiled server-side for razor-sharp typography and exact layout geometry.'
    }
  ];

  return (
    <Box 
      component="section"
      sx={{ 
        position: 'relative',
        bgcolor: 'background.default',
        py: { xs: 8, sm: 12, md: 16 },
        overflow: 'hidden',
        // Subtle background grid pattern
        backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.04)} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Top Ambient Glow Orb */}
      <Box
        sx={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '320px', sm: '650px', md: '900px' },
          height: '450px',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.18)} 0%, transparent 65%)`,
          filter: 'blur(90px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        
        {/* --- HEADER SECTION --- */}
        <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', mb: { xs: 7, md: 10 } }}>
          
          {/* Badge */}
          <Box data-aos="fade-down" data-aos-duration="600">
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '0.95rem !important' }} />}
              label="Next-Gen Financial Workflow"
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                mb: 2.5,
                py: 1.8,
                px: 1,
                boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.15)}`
              }}
            />
          </Box>

          {/* Title */}
          <Typography 
            variant="h2" 
            component="h2"
            data-aos="fade-up"
            data-aos-delay="100"
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.4rem' },
              lineHeight: { xs: 1.2, md: 1.15 },
              letterSpacing: '-0.025em',
              color: 'text.primary',
              mb: 2.5
            }}
          >
            A Complete Toolkit for Your{' '}
            <Box 
              component="span" 
              sx={{
                display: { xs: 'block', sm: 'inline' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.light || '#60a5fa', 0.8)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Financial Documents
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="body1" 
            data-aos="fade-up"
            data-aos-delay="200"
            sx={{ 
              color: 'text.secondary', 
              fontSize: { xs: '1rem', md: '1.2rem' },
              lineHeight: 1.6,
              maxWidth: 640,
              mx: 'auto'
            }}
          >
            Transform cumbersome manual billing into an automated, error-free pipeline. Built from the ground up for modern businesses, consultants, and engineers.
          </Typography>
        </Box>

        {/* --- GRID CARDS --- */}
        <Grid container spacing={{ xs: 3, md: 3.5 }}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Box
                data-aos="fade-up"
                data-aos-delay={100 + (idx * 80)} // Dynamic Staggered cascade
                data-aos-duration="700"
                sx={{
                  p: { xs: 3.5, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.7),
                  boxShadow: `0px 4px 20px -2px ${alpha(theme.palette.common.black, 0.04)}`,
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',

                  // Glowing Top Accent Line (Animated on Hover)
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                    opacity: 0,
                    transition: 'opacity 0.35s ease',
                  },

                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    boxShadow: `0px 20px 40px -12px ${alpha(theme.palette.primary.main, 0.18)}`,
                    '&::before': {
                      opacity: 1,
                    },
                    '& .icon-wrapper': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      transform: 'scale(1.08) rotate(-4deg)',
                    },
                    '& .arrow-icon': {
                      opacity: 1,
                      transform: 'translateX(4px)',
                      color: 'primary.main'
                    }
                  }
                }}
              >
                {/* Top Row: Icon Container & Watermark Index */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box 
                    className="icon-wrapper"
                    sx={{ 
                      width: 52, 
                      height: 52, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '14px', 
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      transition: 'all 0.35s ease',
                      boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.15)}`,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  {/* Watermark Index Number (01, 02...) */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 800, 
                      fontFamily: 'monospace',
                      color: alpha(theme.palette.text.primary, 0.18),
                      fontSize: '1.25rem',
                      userSelect: 'none'
                    }}
                  >
                    {`0${idx + 1}`}
                  </Typography>
                </Box>

                {/* Tag Pill */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.08em',
                    color: 'primary.main',
                    fontSize: '0.72rem',
                    mb: 1
                  }}
                >
                  {feature.tag}
                </Typography>

                {/* Title */}
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: '1.25rem',
                    mb: 1.5,
                    color: 'text.primary',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {feature.title}
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    lineHeight: 1.7,
                    fontSize: '0.925rem',
                    flexGrow: 1,
                    mb: 2.5
                  }}
                >
                  {feature.description}
                </Typography>

                {/* Bottom Interactive Prompt */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5, 
                    pt: 1.5, 
                    borderTop: `1px dashed ${alpha(theme.palette.divider, 0.8)}`,
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'text.secondary',
                      fontSize: '0.78rem'
                    }}
                  >
                    Learn more
                  </Typography>
                  <ArrowForwardIcon 
                    className="arrow-icon"
                    sx={{ 
                      fontSize: '0.95rem', 
                      opacity: 0.4, 
                      transition: 'all 0.3s ease',
                      color: 'text.secondary'
                    }} 
                  />
                </Box>

              </Box>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}

export default FeaturesSection;