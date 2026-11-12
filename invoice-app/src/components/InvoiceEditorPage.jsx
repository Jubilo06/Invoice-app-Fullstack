import React, { useContext, useState, useEffect, useRef } from 'react';
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
  Chip, 
  Divider, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  CircularProgress,
  useTheme, 
  alpha,
  useMediaQuery 
} from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';

// Contexts
import { AuthContext } from './AuthContext';
import { InvoiceContext } from './InvoiceProvider';

// Subcomponents
import SignatureCanvas from 'react-signature-canvas';
import LogoUploader from './LogoUpLoader';
import InvoiceItems from './InvoiceItems';
import Summary from './Summary';
import InvoiceOptions from './InvoiceOptions';
import BarcodeGenerator from './BarcodeGenerator';
import InvoicePdf from './InvoicePdf';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GestureIcon from '@mui/icons-material/Gesture';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';

function InvoiceEditorPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useContext(AuthContext);
  const { 
    currentInvoice, 
    createNewInvoice, 
    updateInvoice, 
    startNewInvoice,
    setCurrentInvoice, 
    updateCurrentInvoiceField,
  } = useContext(InvoiceContext);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sigSaved, setSigSaved] = useState(false);

  const sigPadRef = useRef(null);

  useEffect(() => {
    if (!invoiceId) {
      startNewInvoice();
    }
  }, [invoiceId, startNewInvoice]);

  const handleBarcodeGenerated = (imageDataUrl) => {
    setBarcodeImage(imageDataUrl);
  };

  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setSigSaved(false);
    }
  };

  const saveSignature = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const signatureImage = sigPadRef.current.toDataURL();
      updateCurrentInvoiceField('signature', signatureImage);
      setSigSaved(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentInvoice._id) {
        await updateInvoice(currentInvoice._id, currentInvoice);
      } else {
        await createNewInvoice(currentInvoice);
      }
    } catch (err) {
      console.error('Failed to save document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = (newLogoDataUrl) => {
    setCurrentInvoice(prev => ({
      ...prev,
      companyLogo: newLogoDataUrl
    }));
  };

  const safeCurrentInvoice = currentInvoice || {};
  const previewData = {
    ...safeCurrentInvoice,
    barcodeImage: barcodeImage,
    ...(user && { 
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName, 
      companyAddress: user.companyAddress,
      companyLogo: user.companyLogo,
      companyEmail: user.companyEmail,
      companyPhoneNo: user.companyPhoneNo,
      extraDetails: user.extraDetails,   
      signature: user.signature, 
      registrationNo: user.registrationNo,
      companyDescription: user.companyDescription,
    }),
  };

  if (!currentInvoice) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const documentTypes = ['Invoice', 'Quotation', 'BEME', 'Proforma'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 12 }}>
      
      {/* ================= STICKY TOP SUB-HEADER ================= */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          bgcolor: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(16px)', 
          borderBottom: '1px solid', 
          borderColor: alpha(theme.palette.divider, 0.8),
          py: 1.5,
          px: { xs: 2, md: 4 }
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => navigate(-1)} size="small" sx={{ border: '1px solid #e2e8f0' }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' }, lineHeight: 1.2 }}>
                  {currentInvoice._id ? `Edit ${currentInvoice.title || 'Document'}` : `New ${currentInvoice.title || 'Invoice'}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Document #{currentInvoice.invoiceNumber || 'Draft'}
                </Typography>
              </Box>
            </Stack>

            {/* Quick Actions */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => setIsPreviewOpen(true)}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Preview PDF
              </Button>

              <Button
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 2.5 }}
              >
                {currentInvoice._id ? 'Save Changes' : 'Create'}
              </Button>
            </Stack>

          </Stack>
        </Container>
      </Box>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3.5}>
          
          {/* ================= LEFT COLUMN: EDITOR FORM (8 COLS) ================= */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              
              {/* Card 1: Document Type & Numbering */}
              <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                    Document Type
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    {documentTypes.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        clickable
                        color={(currentInvoice.title || 'Invoice').toLowerCase() === type.toLowerCase() ? 'primary' : 'default'}
                        variant={(currentInvoice.title || 'Invoice').toLowerCase() === type.toLowerCase() ? 'filled' : 'outlined'}
                        onClick={() => updateCurrentInvoiceField('title', type)}
                        sx={{ fontWeight: 600, px: 1 }}
                      />
                    ))}
                  </Stack>

                  <TextField
                    fullWidth
                    label="Custom Document Title"
                    value={currentInvoice.title || ''}
                    onChange={(e) => updateCurrentInvoiceField('title', e.target.value)}
                    placeholder="e.g. Bill of Engineering Measurement and Evaluation"
                    size="small"
                  />
                </CardContent>
              </Card>

              {/* Card 2: Parties Involved (From & To) */}
              <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Grid container spacing={3}>
                    
                    {/* Bill From */}
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                        <BusinessIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight={700}>From (Issuer)</Typography>
                      </Stack>

                      {user ? (
                        <Box sx={{ p: 2, borderRadius: '12px', bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                          <Typography variant="subtitle2" fontWeight={700}>{user.companyName || `${user.firstName} ${user.lastName}`}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.companyAddress || 'No address provided'}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.companyEmail}</Typography>
                          <Button component={Link} to="/profile" size="small" sx={{ mt: 1, textTransform: 'none', p: 0, fontWeight: 600 }}>
                            Edit Issuer Profile →
                          </Button>
                        </Box>
                      ) : (
                        <Stack spacing={2}>
                          <LogoUploader currentLogo={currentInvoice.companyLogo || null} onLogoChange={handleLogoChange} />
                          <TextField fullWidth size="small" label="Company Name" value={currentInvoice.companyName || ''} onChange={(e) => updateCurrentInvoiceField('companyName', e.target.value)} />
                          <TextField fullWidth size="small" label="Company Address" value={currentInvoice.companyAddress || ''} onChange={(e) => updateCurrentInvoiceField('companyAddress', e.target.value)} />
                          <TextField fullWidth size="small" label="Company Email" value={currentInvoice.companyEmail || ''} onChange={(e) => updateCurrentInvoiceField('companyEmail', e.target.value)} />
                        </Stack>
                      )}
                    </Grid>

                    {/* Bill To */}
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                        <PersonPinIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight={700}>Bill To (Client)</Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <TextField fullWidth size="small" label="Client / Company Name" value={currentInvoice.clientName || ''} onChange={(e) => updateCurrentInvoiceField('clientName', e.target.value)} />
                        <TextField fullWidth size="small" label="Client Address" value={currentInvoice.clientAddress || ''} onChange={(e) => updateCurrentInvoiceField('clientAddress', e.target.value)} />
                        <TextField fullWidth size="small" label="Client Phone Number" value={currentInvoice.clientNo || ''} onChange={(e) => updateCurrentInvoiceField('clientNo', e.target.value)} />
                      </Stack>
                    </Grid>

                  </Grid>
                </CardContent>
              </Card>

              {/* Card 3: Dates & Invoice Schedule */}
              <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <CalendarMonthIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>Dates & Timeline</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth type="date" label="Issue Date" InputLabelProps={{ shrink: true }} size="small" value={currentInvoice.date || ''} onChange={(e) => updateCurrentInvoiceField('date', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth type="date" label="Payment Due Date" InputLabelProps={{ shrink: true }} size="small" value={currentInvoice.dueDate || ''} onChange={(e) => updateCurrentInvoiceField('dueDate', e.target.value)} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Card 4: Items & Calculator */}
              <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', overflow: 'visible' }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <InvoiceItems />
                  <Divider sx={{ my: 3 }} />
                  <InvoiceOptions />
                </CardContent>
              </Card>

              {/* Card 5: Payment Instructions, Terms & Notes */}
              <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={2}>Payment Terms & Notes</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth multiline rows={3} label="Bank / Account Details" placeholder="Bank Name, IBAN, Swift, Account Number..." value={currentInvoice.accountDetails || ''} onChange={(e) => updateCurrentInvoiceField('accountDetails', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth multiline rows={3} label="Payment Instructions" placeholder="e.g. Please send payment within 14 business days..." value={currentInvoice.paymentInstruction || ''} onChange={(e) => updateCurrentInvoiceField('paymentInstruction', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth multiline rows={2} label="Terms & Conditions" value={currentInvoice.terms || ''} onChange={(e) => updateCurrentInvoiceField('terms', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth multiline rows={2} label="Client Notes" value={currentInvoice.notes || ''} onChange={(e) => updateCurrentInvoiceField('notes', e.target.value)} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Card 6: Signature Pad */}
              {!user && (
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <GestureIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight={700}>Digital Signature</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Draw your signature below to authorize this document.
                    </Typography>

                    <Box sx={{ border: '2px dashed #cbd5e1', borderRadius: '12px', bgcolor: '#ffffff', overflow: 'hidden' }}>
                      <SignatureCanvas
                        ref={sigPadRef}
                        canvasProps={{ style: { width: '100%', height: '160px', cursor: 'crosshair' } }}
                      />
                    </Box>

                    <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={1.5}>
                      <Button startIcon={<ClearIcon />} size="small" color="inherit" onClick={clearSignature} sx={{ textTransform: 'none' }}>
                        Clear
                      </Button>
                      <Button startIcon={sigSaved ? <CheckCircleOutlineIcon /> : null} size="small" variant={sigSaved ? "contained" : "outlined"} color={sigSaved ? "success" : "primary"} onClick={saveSignature} sx={{ textTransform: 'none' }}>
                        {sigSaved ? 'Signature Applied' : 'Apply Signature'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

            </Stack>
          </Grid>

          {/* ================= RIGHT COLUMN: STICKY DOCK (4 COLS) ================= */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 85 } }}>
              <Stack spacing={3}>
                
                {/* Financial Summary Widget */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={800} mb={2}>
                      Payment Summary
                    </Typography>
                    <Summary />

                    <Divider sx={{ my: 2.5 }} />

                    <Stack spacing={1.5}>
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={isSaving}
                        sx={{ py: 1.4, borderRadius: '10px', fontWeight: 700, textTransform: 'none' }}
                      >
                        {currentInvoice._id ? 'Save Updates' : 'Save Invoice'}
                      </Button>

                      <PDFDownloadLink
                        document={<InvoicePdf data={previewData} />}
                        fileName={`Invoice-${previewData.invoiceNumber || 'Draft'}.pdf`}
                        style={{ textDecoration: 'none' }}
                      >
                        {({ loading }) => (
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={loading ? <CircularProgress size={18} /> : <DownloadIcon />}
                            disabled={loading}
                            sx={{ py: 1.2, borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
                          >
                            {loading ? 'Compiling PDF...' : 'Download PDF'}
                          </Button>
                        )}
                      </PDFDownloadLink>

                      <Button
                        fullWidth
                        variant="text"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setIsPreviewOpen(true)}
                        sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                      >
                        Interactive Preview
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Realtime Barcode Verification Box */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
                    DOCUMENT IDENTIFIER BARCODE
                  </Typography>
                  <BarcodeGenerator 
                    value={currentInvoice?.invoiceNumber || 'INV-0000'}
                    onBarcodeGenerated={handleBarcodeGenerated}
                  />
                </Card>

              </Stack>
            </Box>
          </Grid>

        </Grid>
      </Container>

      {/* ================= MODAL PDF VIEWER ================= */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : '20px', height: '90vh', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>Document Live Preview</Typography>
          <IconButton onClick={() => setIsPreviewOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
            <InvoicePdf data={previewData} />
          </PDFViewer>
        </DialogContent>
      </Dialog>

    </Box>
  );
}

export default InvoiceEditorPage;