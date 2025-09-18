import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { InvoiceContext } from './InvoiceProvider'
import { AuthContext } from './AuthContext'
import { Button, CircularProgress, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';


function Profile() {
  const { 
    invoiceList, 
    setCurrentInvoice,
    isLoading, 
    loadUserInvoices, 
    deleteInvoice,
    startNewInvoice,
    editInvoice 
  } = useContext(InvoiceContext);
  
  const { user } = useContext(AuthContext);
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

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack bgcolor='#060010' width='100%'  alignItems='center' spacing={4} minHeight={600}>
      {user&&<Typography variant='h5' pt={2}   width='98%'  
      justifySelf='center' fontWeight={700}
      alignSelf='center'>
      <Stack direction='row' justifySelf={{xs:'center', sm:'end'}} borderRadius={1} sx={{bgcolor:'gold'}} border='1px dotted white '>
        Welcome {user.firstName} {user.lastName} <EmojiPeopleIcon htmlColor='#060010' />
        </Stack> 
      </Typography>}
      <Stack pt={20}>
        <Button  variant="contained" onClick={handleCreateNewClick}>
        + Create New Invoice
        </Button>
      </Stack>
      

      {invoiceList.length>0 ? (
        <Stack width='100%'>
          <Typography variant='h5' color='white' textAlign='center'>Your Invoices</Typography>

            <List style={{backgroundColor:'lightblue', color:'black', width:'98%', justifySelf:'center', alignSelf:'center'}}>
            {invoiceList.map(invoice => (
              <ListItem 
                key={invoice._id}
                secondaryAction={
                  <Stack direction='row' spacing={2}>
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
    
    </Stack>
  )
}

export default Profile