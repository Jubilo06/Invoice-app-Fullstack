import {Stack, Typography,Button, TextField, Divider} from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import { useContext, useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { InvoiceContext } from './InvoiceProvider'
import { AuthContext } from './AuthContext'
import styles from './Invoice.module.css'
import SignatureCanvas from 'react-signature-canvas';
import LogoUploader from './LogoUpLoader'
import api from "./Api";
import src20 from '../assets/src20.jpg'
import Aos from 'aos'
import 'aos/dist/aos.css'


function Invoice() {
  const {invoiceData,updateField, addItem, removeItem,updateItem, currentInvoice, setCurrentInvoice,
    handleLogoUpload } = useContext(InvoiceContext);
    const { user,updateUserProfile, deleteAccount, isLoading } = useContext(AuthContext);
    const [isSaving, setIsSaving] = useState(false);
    const navigate=useNavigate()
    useEffect(()=>{
          Aos.init({duration:2000})
    },[])

    const [profileData, setProfileData] = useState({
      firstName: '',
        lastName: '',
        companyName: '',
        companyAddress:'',
        userTitle:'',
        companyLogo:null,
        companyDescription:'',
        companyEmail:'',
        companyPhoneNo:'',
        extraDetails:'',
        registrationNo:'',
        title:'',
        date:'',
        signature:null
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
        companyEmail:user.companyEmail || '',
        companyPhoneNo:user.companyPhoneNo || '',
        extraDetails:user.extraDetails || '',
        registrationNo:user.registrationNo || '',
        title:user.title || '',
        date:user.date || '',
        signature:user.signature || null,
        userTitle:user.userTitle,
      });
    }
  }, [user]);
  const updateCurrentInvoiceField = (field, value) => {
    setCurrentInvoice(prev => ({ ...prev, [field]: value }));
  };
  const sigPadRef = useRef(null);
    const clearSignature = () => sigPadRef.current.clear();
   const saveDefaultSignature = () => {
    if (sigPadRef.current) {
      const signatureImage = sigPadRef.current.toDataURL();
      setProfileData(prev => ({ ...prev, signature: signatureImage }));
      alert('Signature captured. Click "Save Profile Changes" to make it permanent.');
    }
  };

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleLogoChange = (newLogoDataUrl) => {
    setProfileData(prev => ({
      ...prev,
      companyLogo: newLogoDataUrl
    }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile(profileData);
      alert('Profile updated successfully!');
      navigate('/Dashboard');
    } catch (error) {
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsSaving(false);
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
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      await api.put('/profile', profileData);
      alert('Profile saved!');  
      navigate("/Dashboard")
    } catch (error) {
      alert('Could not save profile.');
    }
    
  };

  if (isLoading || !user) {
    return <div>Loading profile...</div>;
  }
  return (
    <Stack className={styles.container} bgcolor='#060010' my={1} color='white' justifyContent='center' alignItems='center'
    spacing={2} direction="column" height='auto'  width="100%" divider={<Divider orientation="horizontal" flexItem />}
    sx={{backgroundImage:`url(${src20})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
                    backgroundPosition: 'center'}}>
      <Stack width='100%' height={{xs:200,sm:100}} className={styles.glass3d} justifyContent='center' alignItems='center'>
        <Typography data-aos='zoom-in' width={{xs:'96%', sm:'90%',md:'98%'}}  textAlign='center'>Welcome, {user.firstName} This is your central hub for all your company details. 
        The information you save here will be automatically 
        pre-filled on every new invoice, quotation, or document you create. Fill it out once, and save time forever.
        </Typography>
      </Stack>
      <form onSubmit={handleUpdate} style={{width:'100%'}}>
        <Stack height='auto'  width={{xs:'80%', sm:"60%", md:'40%', lg:'40%'}} borderRadius="1px" 
        justifySelf='center' alignSelf='center' my={10} divider={<Divider orientation="horizontal" flexItem />}
        direction="column" className={styles.glass3d} >
        <Stack className={styles.FormStack} spacing={2} width='100%'>
          <Stack direction="column" spacing={2} width='100%'>
            <Stack spacing={2} justifyContent='center' alignItems='center' width='100%'>
              <Stack justifySelf={{xs:'center'}} alignSelf={{xs:"center"}} width='100%'>
                <LogoUploader
                currentLogo={profileData.companyLogo}
                onLogoChange={handleLogoChange}
              />
              </Stack>
              

              <TextField
                sx={{ width:'90%',
                  '& .MuiInputLabel-root': { color: 'black', width:'80%', fontSize:'15px'},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                    '& .MuiOutlinedInput-input': {color: 'black',width:'100%', fontWeight:'bolder', height:50 },
                  },}}
                type="text"
                label="Name of Company"
                name='companyName'
                value={profileData.companyName}
                placeholder= "your company's name"
                onChange={handleChange}
              />
              <TextField
                sx={{ width:'90%',
                  '& .MuiInputLabel-root': { color: 'black', width:'80%', fontSize:'15px'},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                    '& .MuiOutlinedInput-input': {color: 'black',width:'100%', fontWeight:'bolder',height:50 },
                },}}
                type="text"
                label="Company's Registration Number"
                name='registrationNo'
                value={profileData.registrationNo}
                placeholder= "your company's registration number"
                onChange={handleChange}
              />
              <TextField
                sx={{ width:'90%',
                  '& .MuiInputLabel-root': { color: 'black', width:'80%', fontSize:'15px'},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                    '& .MuiOutlinedInput-input': {color: 'black',width:'100%', fontWeight:'bolder', height:50 },
                },}}
                type="text"
                label="Company's Phone Number"
                name='companyPhoneNo'
                value={profileData.companyPhoneNo}
                placeholder= "your company's phone number"
                onChange={handleChange}
              />
            </Stack>
            <Stack spacing={2} justifyContent='center' alignItems='center' width='100%'>
              <TextField
                sx={{ width:'90%',
                  '& .MuiInputLabel-root': { color: 'black', width:'80%', fontSize:'15px'},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                    '& .MuiOutlinedInput-input': {color: 'black',width:'100%', fontWeight:'bolder', height:50 },
                },}}
                label="Company's Email"
                type="text"
                name='companyEmail'
                value={profileData.companyEmail}
                placeholder= "your company's email"
                onChange={handleChange}
              />
              <TextField
                sx={{ width:'90%',
                  '& .MuiInputLabel-root': { color: 'black', width:'80%', fontSize:'15px'},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                    '& .MuiOutlinedInput-input': {color: 'black',width:'100%', fontWeight:'bolder', height:50 },
                },}}
                type="text"
                label="Company's Address"
                name='companyAddress'
                value={profileData.companyAddress}
                placeholder= "your company's Address"
                onChange={handleChange}
              />
              <TextField
                sx={{ width:'90%',
                  '& .MuiInputLabel-root': { color: 'black', width:'80%', fontSize:'15px'},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                    '& .MuiOutlinedInput-input': {color: 'black',width:'100%', fontWeight:'bolder', height:50 },
                },}}
                type="text"
                label="Describe your company"
                name='companyDescription'
                value={profileData.companyDescription}
                placeholder= "Describe your company"
                onChange={handleChange}
              />
              <TextField
                sx={{ width:'90%',
                  '& .MuiInputLabel-root': { color: 'black', width:'80%', fontSize:'15px'},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                    '& .MuiOutlinedInput-input': {color: 'black',width:'100%', fontWeight:'bolder', height:50 },
                },}}
                type="text"
                label="user's Position"
                name='userTitle'
                value={profileData.userTitle}
                placeholder= "Describe your position in the company"
                onChange={handleChange}
              />
              <fieldset style={{width:"80%", justifySelf:'center', alignSelf:'center', }}>
                <Stack direction='column' spacing={2} justifySelf='center' alignSelf='center'>
                  <legend>Signature</legend>
                    <Stack direction='column' spacing={2} justifySelf='center' alignSelf='center'>
                      <SignatureCanvas ref={sigPadRef} 
                        canvasProps={{ style: { border: "2px solid black", width: '100%', height: '200px', backgroundColor:'white' } }} />
                      <Stack direction='row' spacing={2} justifyContent='center' alignItems='center'>
                        <Button  sx={{backgroundColor:"#060010", color:'whitesmoke', textTransform:'capitalize'}} onClick={clearSignature}>Clear</Button>
                        <Button sx={{backgroundColor:"#060010", color:'whitesmoke',textTransform:'capitalize'}} onClick={saveDefaultSignature}>Save Signature</Button>
                      </Stack>
                      {profileData.signature && (
                          <Stack justifySelf='center' alignSelf='center' bgcolor='white'>
                            <h4 style={{color:'black', alignSelf:'center'}}>Your Saved Signature:</h4>
                            <img src={profileData.signature} alt="Saved Signature" style={{ width: 200 }} />
                          </Stack>
                      )}
                    </Stack>
                </Stack>
            </fieldset>
            </Stack>
          </Stack>
          <Stack justifyContent='center' alignItems='center'><button type='submit' disabled={isSaving} 
          style={{width:'150px', height:"40px", borderRadius:"8px 8px", backgroundColor:'#060010',color:'gold' }}>
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button></Stack>
        </Stack>
          

        </Stack>
      </form>
          </Stack>
  )
}

export default Invoice