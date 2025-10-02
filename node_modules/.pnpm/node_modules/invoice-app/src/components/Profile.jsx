import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { InvoiceContext } from './InvoiceProvider'
import { AuthContext } from './AuthContext'
import { Button, CircularProgress, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import styles from './Invoice.module.css'
import Aos from 'aos'
import 'aos/dist/aos.css'


function Profile() {
    useEffect(()=>{
      Aos.init({duration:2000})
    },[])
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
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      loadUserInvoices();
    }
  }, [user]); 

  const handleEditClick = (invoice) => {
    editInvoice(invoice);
    navigate('/invoice/edit/:invoiceId'); 
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

  const handleDeleteClick = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(invoiceId);
      } catch (error) {
      }
    }
  };
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account and all data?')) {
      try {
        await deleteAccount();
        alert('Account deleted.');
        navigate('/'); 
      } catch (error) {
        alert(`Deletion failed: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack bgcolor='#060010' width='100%'  alignItems='center' spacing={4} minHeight={600}>
      {user&&<Stack  pt={2}   width='100%'  
      justifySelf='center'   
      alignSelf='center'>
      <Typography direction='row' fontWeight={700} variant={{xs:"body2"}} pt={4} pb={4} height='80%' mr={2}  justifySelf={{xs:'flex-end', sm:'right'}} 
      alignSelf={{xs:'end'}} data-aos="zoom-in"
      sx={{ borderRadius:"30px 5px", color:'white', border:'none'}}>
        Welcome {user.firstName} {user.lastName} <EmojiPeopleIcon htmlColor='white' />
        </Typography> 
        <Typography textAlign='center' color='white'>
          A new User?Click this link to create profile for your company <Link to="/profile" style={{color:'olivedrab', fontSize:'20px'}}>here</Link>
        </Typography>
      </Stack>}
      
      <Stack pt={20}>
        <Button  variant="contained" onClick={handleCreateNewClick}>
        + Create New Invoice
        </Button>
      </Stack>
      

      {invoiceList.length>0 ? (
        <Stack width='100%'>
          <Typography variant='h5' color='white' textAlign='center'>Your Invoices</Typography>

            <List style={{backgroundColor:'white', color:'black', width:'98%', justifySelf:'center', alignSelf:'center'}}>
            {invoiceList.map(invoice => (
              <ListItem className={styles.delete}
                key={invoice._id}
                secondaryAction={
                  <Stack direction='row' ml={2} pb={5} spacing={{xs:1, sm:2}}>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(invoice)}>
                      <EditIcon htmlColor='green' />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(invoice._id)}>
                      <DeleteIcon htmlColor='red' />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText style={{color:'black'}}
                  primary={`Invoice #${invoice.invoiceNumber}`}
                  secondary={`To: ${invoice.clientName} - Created on ${new Date(invoice.createdAt).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
        ):(
         <Stack>
            <Typography variant="h6" color='white'>You haven't created any invoices yet.</Typography>
            <Typography color="white" textAlign={{xs:'center'}}>Click the button above to get started!</Typography>
          </Stack>
      )
      }
    
      <Stack pb={2} my={3} spacing={3} className={styles.delete} width='98%' border='1px solid transparent'
          justifySelf='center' alignSelf='center'>
        <Typography pt={2} fontWeight={700} fontSize={{xs:'25px'}} color="red" textAlign='center'>Delete account permanently</Typography>
        <Typography variant="h6" textAlign='center' color='warning'>
          This action cannot be undone ⚠
        </Typography>
        <Button sx={{width:'100px', justifySelf:"center", alignSelf:'center',backgroundColor:"#060010", 
        textTransform:'capitalize', color:'white', fontSize:"20px"}}  
        variant="outlined" onClick={handleDelete}>
          Delete
        </Button>
      </Stack>
    </Stack>
  )
}

export default Profile