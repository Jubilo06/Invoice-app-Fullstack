// import React from 'react'
// import { useContext, useState, useEffect } from 'react'
// import { Stack, Typography } from '@mui/material'
// import { Link, useNavigate } from 'react-router-dom'
// import { InvoiceContext } from './InvoiceProvider'
// import { AuthContext } from './AuthContext'
// import { Button, CircularProgress, List, ListItem, ListItemText, IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
// import styles from './Invoice.module.css'
// import Aos from 'aos'
// import 'aos/dist/aos.css'


// function Profile() {
//     useEffect(()=>{
//       Aos.init({duration:2000})
//     },[])
//   const { 
//     invoiceList, 
//     setCurrentInvoice,
//     isLoading, 
//     loadUserInvoices, 
//     deleteInvoice,
//     startNewInvoice,
//     editInvoice 
//   } = useContext(InvoiceContext);
  
//   const { user, deleteAccount } = useContext(AuthContext);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (user) {
//       loadUserInvoices();
//     }
//   }, [user]); 

//   const handleEditClick = (invoice) => {
//     editInvoice(invoice);
//     navigate('/invoice/edit/:invoiceId'); 
//   };
  
//   const handleCreateNewClick = () => {
//     startNewInvoice();
//      if (user && user.signature) {
//       setCurrentInvoice(prevInvoice => ({
//         ...prevInvoice,
//         signature: user.signature,
//         userTitle: user.userTitle || '' 
//       }));
//     }
//     navigate('/invoice/new');
//   };

//   const handleDeleteClick = async (invoiceId) => {
//     if (window.confirm('Are you sure you want to delete this invoice?')) {
//       try {
//         await deleteInvoice(invoiceId);
//       } catch (error) {
//       }
//     }
//   };
//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to permanently delete your account and all data?')) {
//       try {
//         await deleteAccount();
//         alert('Account deleted.');
//         navigate('/'); 
//       } catch (error) {
//         alert(`Deletion failed: ${error.message}`);
//       }
//     }
//   };

//   if (isLoading) {
//     return <CircularProgress />;
//   }

//   return (

//     <Stack>
//       <Stack bgcolor='#060010' width='100%' pb={4}  alignItems='center' spacing={10} height='auto'>
//         {user&&<Stack  pt={2}   width='100%'  height='auto'
//         justifySelf='center'   
//         alignSelf='center'>
//         <Typography direction='row' fontWeight={700} variant={{xs:"body2"}} pt={4} pb={4} height='80%' mr={2}  justifySelf={{xs:'flex-end', sm:'right'}} 
//         alignSelf={{xs:'end'}} data-aos="zoom-in" 
//         sx={{ borderRadius:"30px 5px", color:'white', border:'none'}}>
//           Welcome {user.firstName} {user.lastName} <EmojiPeopleIcon htmlColor='white' />
//           </Typography> 
//           <Typography textAlign='center' color='white'>
//             A new User? Click this link to create profile for your company <Link to="/profile" style={{color:'olivedrab', fontSize:'20px'}}>here</Link>
//           </Typography>
//         </Stack>}
        
//         <Stack pt={20}>
//           <Button  variant="contained" onClick={handleCreateNewClick}>
//           + Create New Invoice
//           </Button>
//         </Stack>
        

//         {invoiceList.length>0 ? (
//           <Stack width='100%'>
//             <Typography variant='h5' color='white' textAlign='center'>Your Invoices</Typography>

//               <List style={{backgroundColor:'white', color:'black', width:'98%', justifySelf:'center', alignSelf:'center'}}>
//               {invoiceList.map(invoice => (
//                 <ListItem className={styles.delete}
//                   key={invoice._id}
//                   secondaryAction={
//                     <Stack direction='row' ml={2} pb={5} spacing={{xs:1, sm:2}}>
//                       <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(invoice)}>
//                         <EditIcon htmlColor='green' />
//                       </IconButton>
//                       <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(invoice._id)}>
//                         <DeleteIcon htmlColor='red' />
//                       </IconButton>
//                     </Stack>
//                   }
//                 >
//                   <ListItemText style={{color:'black'}}
//                     primary={`Invoice #${invoice.invoiceNumber}`}
//                     secondary={`To: ${invoice.clientName} - Created on ${new Date(invoice.createdAt).toLocaleDateString()}`}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Stack>
//           ):(
//           <Stack>
//               <Typography variant="h6" color='white'>You haven't created any invoices yet.</Typography>
//               <Typography color="white" textAlign={{xs:'center'}}>Click the button above to get started!</Typography>
//             </Stack>
//         )
//         }
//       </Stack>
//       <Stack className={styles.delete} spacing={3}  pb={6} width='98%' border='1px solid transparent'
//             justifyContent='center' alignItems='center'>
//           <Typography pt={2} fontWeight={700} fontSize={{xs:'25px'}} color="red" textAlign='center'>Delete account permanently</Typography>
//           <Typography variant="h6" textAlign='center'  >
//             Once you delete your account, there is no going back. All of your saved company profile details and all of your created invoices will be permanently erased. Please be certain before proceeding ⚠
//           </Typography>
//           <Button sx={{width:'100px', justifySelf:"center", alignSelf:'center',backgroundColor:"#060010", 
//           textTransform:'capitalize', color:'white', fontSize:"20px"}}  
//           variant="outlined" onClick={handleDelete}>
//             Delete
//           </Button>
//         </Stack>
//         <Stack>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#060010" fill-opacity="1" d="M0,128L11.4,133.3C22.9,139,46,149,69,181.3C91.4,213,114,267,137,256C160,245,183,171,206,128C228.6,85,251,75,274,69.3C297.1,64,320,64,343,58.7C365.7,53,389,43,411,32C434.3,21,457,11,480,58.7C502.9,107,526,213,549,240C571.4,267,594,213,617,165.3C640,117,663,75,686,53.3C708.6,32,731,32,754,64C777.1,96,800,160,823,160C845.7,160,869,96,891,106.7C914.3,117,937,203,960,213.3C982.9,224,1006,160,1029,149.3C1051.4,139,1074,181,1097,186.7C1120,192,1143,160,1166,138.7C1188.6,117,1211,107,1234,117.3C1257.1,128,1280,160,1303,165.3C1325.7,171,1349,149,1371,133.3C1394.3,117,1417,107,1429,101.3L1440,96L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"></path></svg>
//         </Stack>
//     </Stack>
// )
// }

// export default Profile

import React, { useContext, useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Stack, 
  Typography, 
  Button, 
  IconButton, 
  Card, 
  CardContent, 
  Chip, 
  Avatar, 
  Divider, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Tooltip, 
  useTheme, 
  alpha 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// Contexts
import { InvoiceContext } from './InvoiceProvider';
import { AuthContext } from './AuthContext';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BusinessIcon from '@mui/icons-material/Business';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// AOS
import Aos from 'aos';
import 'aos/dist/aos.css';

function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { 
    invoiceList, 
    setCurrentInvoice,
    isLoading, 
    loadUserInvoices, 
    deleteInvoice,
    startNewInvoice,
    editInvoice 
  } = useContext(InvoiceContext);
  
  const { user, deleteAccount } = useContext(AuthContext);

  // Modal Confirmation States
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [accountDialogState, setAccountDialogState] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 800, once: true });
    if (user) {
      loadUserInvoices();
    }
  }, [user]);

  // Handlers
  const handleEditClick = (invoice) => {
    editInvoice(invoice);
    navigate(`/invoice/edit/${invoice._id}`); 
  };
  
  const handleCreateNewClick = () => {
    startNewInvoice();
    if (user && user.signature) {
      setCurrentInvoice(prevInvoice => ({
        ...prevInvoice,
        signature: user.signature,
        userTitle: user.userTitle || '' 
      }));
    }
    navigate('/invoice/new');
  };

  const confirmDeleteInvoice = async () => {
    if (!deleteTargetId) return;
    try {
      setActionLoading(true);
      await deleteInvoice(deleteTargetId);
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Delete invoice failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      setActionLoading(true);
      await deleteAccount();
      navigate('/'); 
    } catch (error) {
      alert(`Account deletion failed: ${error.message}`);
    } finally {
      setActionLoading(false);
      setAccountDialogState(false);
    }
  };

  // Full Page Centered Loading
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          minHeight: '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={45} thickness={4} />
        <Typography variant="body2" color="text.secondary">Loading your workspace...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 12 }}>
      
      {/* ================= TOP HERO BANNER ================= */}
      <Box
        sx={{
          bgcolor: '#0b1120',
          pt: { xs: 5, md: 8 },
          pb: { xs: 8, md: 10 },
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        {/* Glow Accent Orb */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            justifyContent="space-between" 
            spacing={3}
          >
            {/* User Profile Info */}
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar
                sx={{
                  width: { xs: 60, sm: 70 },
                  height: { xs: 60, sm: 70 },
                  bgcolor: theme.palette.primary.main,
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`
                }}
              >
                {user?.firstName ? user.firstName[0].toUpperCase() : <PersonOutlineIcon />}
              </Avatar>

              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: { xs: '1.6rem', sm: '2.1rem' },
                    letterSpacing: '-0.02em'
                  }}
                >
                  Welcome back, {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5 }}>
                  Manage your invoices, company records, and client agreements.
                </Typography>
              </Box>
            </Stack>

            {/* Quick Action: New Invoice */}
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateNewClick}
              sx={{
                borderRadius: '12px',
                py: 1.4,
                px: 3,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: `0 8px 25px -4px ${alpha(theme.palette.primary.main, 0.5)}`,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Create New Invoice
            </Button>
          </Stack>

          {/* Company Profile Setup Notice (if incomplete) */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: '14px',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <BusinessIcon sx={{ color: '#60a5fa' }} />
              <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                Keep your documents professional. Set up your company logo, address, and legal signature.
              </Typography>
            </Stack>

            <Button
              component={Link}
              to="/profile"
              size="small"
              endIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.75rem !important' }} />}
              sx={{ 
                color: '#60a5fa', 
                textTransform: 'none', 
                fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(96, 165, 250, 0.1)' }
              }}
            >
              Configure Profile
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ================= MAIN INVOICE FEED ================= */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        
        {/* Header Count Bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            px: 1
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
              Your Invoices
            </Typography>
            <Chip 
              label={`${invoiceList.length} Total`} 
              size="small" 
              sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}
            />
          </Stack>
        </Box>

        {/* Invoice Cards or Empty State */}
        {invoiceList && invoiceList.length > 0 ? (
          <Stack spacing={2}>
            {invoiceList.map((invoice, index) => (
              <Card
                key={invoice._id || index}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.7),
                  boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.03)}`,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    boxShadow: `0 8px 24px -4px ${alpha(theme.palette.primary.main, 0.12)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    alignItems={{ xs: 'flex-start', sm: 'center' }} 
                    justifyContent="space-between" 
                    spacing={2}
                  >
                    
                    {/* Invoice ID & Meta */}
                    <Stack direction="row" spacing={2.5} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: 'primary.main'
                        }}
                      >
                        <ReceiptLongIcon />
                      </Box>

                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>
                          Invoice #{invoice.invoiceNumber || 'Draft'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Client: <strong>{invoice.clientName || 'Unnamed Client'}</strong>
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Right Side: Date & Action Icons */}
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      spacing={{ xs: 2, sm: 3 }} 
                      sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'space-between' }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: '0.95rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'Recent'}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit Document">
                          <IconButton 
                            onClick={() => handleEditClick(invoice)}
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              color: 'primary.main',
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) }
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Document">
                          <IconButton 
                            onClick={() => setDeleteTargetId(invoice._id)}
                            sx={{ 
                              bgcolor: alpha(theme.palette.error.main, 0.08),
                              color: 'error.main',
                              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.18) }
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>

                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          /* Empty State */
          <Card 
            sx={{ 
              borderRadius: '20px', 
              textAlign: 'center', 
              py: 8, 
              px: 3, 
              border: '1px dashed', 
              borderColor: alpha(theme.palette.divider, 0.8) 
            }}
          >
            <Avatar 
              sx={{ 
                width: 68, 
                height: 68, 
                mx: 'auto', 
                mb: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.08), 
                color: 'primary.main' 
              }}
            >
              <ReceiptLongIcon sx={{ fontSize: 34 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              No invoices created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
              You haven't generated any business documents yet. Create your first automated invoice in just a few minutes.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleCreateNewClick}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 3, py: 1.2, fontWeight: 700 }}
            >
              Create First Invoice
            </Button>
          </Card>
        )}

        {/* ================= DANGER ZONE (ACCOUNT DELETION) ================= */}
        <Box sx={{ mt: 8 }}>
          <Card 
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: alpha(theme.palette.error.main, 0.25),
              bgcolor: alpha(theme.palette.error.main, 0.02)
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                alignItems={{ xs: 'flex-start', md: 'center' }} 
                justifyContent="space-between" 
                spacing={3}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    <WarningAmberRoundedIcon color="error" />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                      Delete Account Permanently
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 650 }}>
                    Once you delete your account, there is no going back. All saved company records, logos, signatures, and compiled invoices will be irreversibly removed.
                  </Typography>
                </Box>

                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => setAccountDialogState(true)}
                  sx={{ 
                    borderRadius: '10px', 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    px: 3, 
                    py: 1, 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  Delete Account
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

      </Container>

      {/* ================= CONFIRM INVOICE DELETE MODAL ================= */}
      <Dialog 
        open={Boolean(deleteTargetId)} 
        onClose={() => setDeleteTargetId(null)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete this invoice?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure you want to permanently remove this document from your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button 
            onClick={() => setDeleteTargetId(null)} 
            disabled={actionLoading}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteInvoice} 
            color="error" 
            variant="contained" 
            disabled={actionLoading}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Delete Invoice'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= CONFIRM ACCOUNT DELETE MODAL ================= */}
      <Dialog 
        open={accountDialogState} 
        onClose={() => setAccountDialogState(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
          Permanently delete your account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will immediately erase your profile, saved credentials, signatures, and all historical invoices. This action is <strong>irreversible</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button 
            onClick={() => setAccountDialogState(false)} 
            disabled={actionLoading}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Keep Account
          </Button>
          <Button 
            onClick={confirmDeleteAccount} 
            color="error" 
            variant="contained" 
            disabled={actionLoading}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Yes, Delete Everything'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default Profile;