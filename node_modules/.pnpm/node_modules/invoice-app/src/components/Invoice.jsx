import React, { useContext, useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Stack, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Alert, 
  Divider, 
  IconButton, 
  CircularProgress, 
  InputAdornment, 
  useTheme, 
  alpha 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Contexts
import { AuthContext } from './AuthContext';
import { InvoiceContext } from './InvoiceProvider';

// Subcomponents
import SignatureCanvas from 'react-signature-canvas';
import LogoUploader from './LogoUpLoader';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import GestureIcon from '@mui/icons-material/Gesture';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// AOS
import Aos from 'aos';
import 'aos/dist/aos.css';

function Invoice() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { user, updateUserProfile, isLoading } = useContext(AuthContext);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [sigSaved, setSigSaved] = useState(false);

  const sigPadRef = useRef(null);

  useEffect(() => {
    Aos.init({ duration: 800, once: true });
  }, []);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    companyAddress: '',
    userTitle: '',
    companyLogo: null,
    companyDescription: '',
    companyEmail: '',
    companyPhoneNo: '',
    extraDetails: '',
    registrationNo: '',
    signature: null
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        companyName: user.companyName || '',
        companyAddress: user.companyAddress || '',
        companyLogo: user.companyLogo || null,
        companyDescription: user.companyDescription || '',
        companyEmail: user.companyEmail || '',
        companyPhoneNo: user.companyPhoneNo || '',
        extraDetails: user.extraDetails || '',
        registrationNo: user.registrationNo || '',
        signature: user.signature || null,
        userTitle: user.userTitle || '',
      });
      if (user.signature) {
        setSigSaved(true);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (feedback.message) setFeedback({ type: '', message: '' });
  };

  const handleLogoChange = (newLogoDataUrl) => {
    setProfileData(prev => ({
      ...prev,
      companyLogo: newLogoDataUrl
    }));
  };

  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setSigSaved(false);
      setProfileData(prev => ({ ...prev, signature: null }));
    }
  };

  const saveDefaultSignature = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const signatureImage = sigPadRef.current.toDataURL();
      setProfileData(prev => ({ ...prev, signature: signatureImage }));
      setSigSaved(true);
      setFeedback({ type: 'info', message: 'Signature captured! Click "Save All Profile Changes" to make it permanent.' });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await updateUserProfile(profileData);
      setFeedback({ type: 'success', message: 'Profile updated successfully! Redirecting...' });
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1200);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 14 }}>
      
      {/* ================= TOP BRAND HEADER ================= */}
      <Box
        sx={{
          bgcolor: '#0b1120',
          pt: { xs: 4, sm: 6 },
          pb: { xs: 8, sm: 10 },
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        {/* Ambient Top Glow */}
        <Box
          sx={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.25)} 0%, transparent 70%)`,
            filter: 'blur(90px)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/Dashboard')}
              sx={{ color: 'rgba(255,255,255,0.7)', width: 'fit-content', textTransform: 'none', '&:hover': { color: '#ffffff' } }}
            >
              Back to Dashboard
            </Button>

            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', sm: '2.5rem' }, letterSpacing: '-0.02em' }}>
              Company Branding & Defaults
            </Typography>

            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: 680, lineHeight: 1.6 }}>
              Set up your profile once. This information, your corporate logo, and your digital signature will automatically pre-populate every new invoice and quotation you generate.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ================= MAIN CONFIGURATION FORM ================= */}
      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>
        
        {/* Floating Notification Banner */}
        {feedback.message && (
          <Alert 
            severity={feedback.type} 
            sx={{ mb: 3, borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
          >
            {feedback.message}
          </Alert>
        )}

        <form onSubmit={handleUpdate}>
          <Grid container spacing={3.5}>
            
            {/* ================= LEFT COLUMN: BRAND & CONTACT (7 COLS) ================= */}
            <Grid item xs={12} lg={7}>
              <Stack spacing={3.5}>
                
                {/* Section 1: Corporate Identity & Logo */}
                <Card sx={{ borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                      <BusinessIcon color="primary" />
                      <Box>
                        <Typography variant="h6" fontWeight={800}>Company Identity</Typography>
                        <Typography variant="body2" color="text.secondary">Your official business name and registration mark</Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={2.5}>
                      <Box sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#f8fafc', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1.5}>
                          OFFICIAL CORPORATE LOGO
                        </Typography>
                        <LogoUploader
                          currentLogo={profileData.companyLogo}
                          onLogoChange={handleLogoChange}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={profileData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Acme Engineering Solutions Ltd"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Registration / Tax ID (RC/EIN)"
                        name="registrationNo"
                        value={profileData.registrationNo}
                        onChange={handleChange}
                        placeholder="e.g. RC-98234710"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Company Description / Scope"
                        name="companyDescription"
                        value={profileData.companyDescription}
                        onChange={handleChange}
                        placeholder="Brief summary of your specialized trade, engineering focus, or services..."
                      />
                    </Stack>
                  </CardContent>
                </Card>

                {/* Section 2: Contact & Official Address */}
                <Card sx={{ borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                      <LocationOnIcon color="primary" />
                      <Box>
                        <Typography variant="h6" fontWeight={800}>Contact & Location</Typography>
                        <Typography variant="body2" color="text.secondary">Where clients can reach you and direct formal communication</Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={2.5}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Official Email"
                            name="companyEmail"
                            value={profileData.companyEmail}
                            onChange={handleChange}
                            placeholder="billing@company.com"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="companyPhoneNo"
                            value={profileData.companyPhoneNo}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Physical / Registered Address"
                        name="companyAddress"
                        value={profileData.companyAddress}
                        onChange={handleChange}
                        placeholder="Suite 400, 100 Tech Boulevard, Austin, TX"
                      />

                      <TextField
                        fullWidth
                        label="Your Signatory Title"
                        name="userTitle"
                        value={profileData.userTitle}
                        onChange={handleChange}
                        placeholder="e.g. Managing Director, Lead Project Consultant"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>

              </Stack>
            </Grid>

            {/* ================= RIGHT COLUMN: SIGNATURE STUDIO & ACTION (5 COLS) ================= */}
            <Grid item xs={12} lg={5}>
              <Stack spacing={3.5} sx={{ position: { lg: 'sticky' }, top: { lg: 30 } }}>
                
                {/* Section 3: Digital Signature Pad */}
                <Card sx={{ borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ p: { xs: 3, sm: 3.5 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                      <GestureIcon color="primary" />
                      <Box>
                        <Typography variant="h6" fontWeight={800}>Default Signature</Typography>
                        <Typography variant="body2" color="text.secondary">Automatically stamped onto valid estimates</Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ border: '2px dashed #cbd5e1', borderRadius: '14px', bgcolor: '#ffffff', overflow: 'hidden', mt: 2 }}>
                      <SignatureCanvas
                        ref={sigPadRef}
                        canvasProps={{
                          style: { width: '100%', height: '170px', cursor: 'crosshair', display: 'block' }
                        }}
                      />
                    </Box>

                    <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="center" mt={2}>
                      <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={clearSignature}
                        sx={{ color: 'text.secondary', textTransform: 'none' }}
                      >
                        Reset Canvas
                      </Button>

                      <Button
                        size="small"
                        variant={sigSaved ? "contained" : "outlined"}
                        color={sigSaved ? "success" : "primary"}
                        startIcon={sigSaved ? <CheckCircleOutlineIcon /> : null}
                        onClick={saveDefaultSignature}
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
                      >
                        {sigSaved ? 'Signature Ready' : 'Capture Signature'}
                      </Button>
                    </Stack>

                    {/* Saved Signature Live Verification Preview */}
                    {profileData.signature && (
                      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" mb={1}>
                          CURRENT DEFAULT ON FILE:
                        </Typography>
                        <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: '10px', display: 'inline-block', border: '1px solid #e2e8f0' }}>
                          <img src={profileData.signature} alt="Saved Corporate Signature" style={{ height: 60, maxWidth: '100%', objectFit: 'contain' }} />
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Primary Action Card */}
                <Card sx={{ borderRadius: '18px', border: '1px solid #e2e8f0', p: 1 }}>
                  <CardContent>
                    <Button
                      fullWidth
                      type="submit"
                      size="large"
                      variant="contained"
                      disabled={isSaving}
                      startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{
                        py: 1.6,
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: `0 8px 24px -4px ${alpha(theme.palette.primary.main, 0.4)}`,
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {isSaving ? 'Saving Changes...' : 'Save All Profile Changes'}
                    </Button>
                  </CardContent>
                </Card>

              </Stack>
            </Grid>

          </Grid>
        </form>

      </Container>
    </Box>
  );
}

export default Invoice;