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

    <Stack>
      <Stack bgcolor='#060010' width='100%' pb={4}  alignItems='center' spacing={10} height='auto'>
        {user&&<Stack  pt={2}   width='100%'  height='auto'
        justifySelf='center'   
        alignSelf='center'>
        <Typography direction='row' fontWeight={700} variant={{xs:"body2"}} pt={4} pb={4} height='80%' mr={2}  justifySelf={{xs:'flex-end', sm:'right'}} 
        alignSelf={{xs:'end'}} data-aos="zoom-in" 
        sx={{ borderRadius:"30px 5px", color:'white', border:'none'}}>
          Welcome {user.firstName} {user.lastName} <EmojiPeopleIcon htmlColor='white' />
          </Typography> 
          <Typography textAlign='center' color='white'>
            A new User? Click this link to create profile for your company <Link to="/profile" style={{color:'olivedrab', fontSize:'20px'}}>here</Link>
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
      </Stack>
      <Stack className={styles.delete} spacing={3}  pb={6} width='98%' border='1px solid transparent'
            justifyContent='center' alignItems='center'>
          <Typography pt={2} fontWeight={700} fontSize={{xs:'25px'}} color="red" textAlign='center'>Delete account permanently</Typography>
          <Typography variant="h6" textAlign='center'  >
            Once you delete your account, there is no going back. All of your saved company profile details and all of your created invoices will be permanently erased. Please be certain before proceeding ⚠
          </Typography>
          <Button sx={{width:'100px', justifySelf:"center", alignSelf:'center',backgroundColor:"#060010", 
          textTransform:'capitalize', color:'white', fontSize:"20px"}}  
          variant="outlined" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
        <Stack>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#060010" fill-opacity="1" d="M0,128L11.4,133.3C22.9,139,46,149,69,181.3C91.4,213,114,267,137,256C160,245,183,171,206,128C228.6,85,251,75,274,69.3C297.1,64,320,64,343,58.7C365.7,53,389,43,411,32C434.3,21,457,11,480,58.7C502.9,107,526,213,549,240C571.4,267,594,213,617,165.3C640,117,663,75,686,53.3C708.6,32,731,32,754,64C777.1,96,800,160,823,160C845.7,160,869,96,891,106.7C914.3,117,937,203,960,213.3C982.9,224,1006,160,1029,149.3C1051.4,139,1074,181,1097,186.7C1120,192,1143,160,1166,138.7C1188.6,117,1211,107,1234,117.3C1257.1,128,1280,160,1303,165.3C1325.7,171,1349,149,1371,133.3C1394.3,117,1417,107,1429,101.3L1440,96L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"></path></svg>
        </Stack>
    </Stack>
)
}

export default Profile