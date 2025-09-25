import React from 'react'
import { Stack,Typography, Button } from '@mui/material'
import personal from '../assets/personal.png'
import src10 from '../assets/src10.jpg'
import { Link } from 'react-router-dom'
import { InvoiceContext } from './InvoiceProvider'
import { useContext, useState } from 'react'
import { AuthContext } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './ItemForm.module.css'

function Register() {
    const {loading, setLoading}=useContext(InvoiceContext)
    const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', password: '' });
    const { user, register, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. handleSubmit function started.");
    try {
      console.log("2. About to call the register function with this data:", formData);
      setLoading(true)
      await register(formData);
      console.log("4. Register function completed successfully!");
      alert('Registration successful! Please log in.');
      setLoading(false);
      navigate('/login');
    } catch (error) {
        console.error("5. Caught an error in the component:", error);
      alert(`Registration failed: ${error.message}`);
      setLoading(false)
    }
  };
  return (
    <Stack width="100%" height={{xs:'900px', sm:'1200px',md:'800px'}}  bgcolor='white' justifyContent="center" alignItems='center'
    sx={{backgroundImage:`url(${src10})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
            backgroundPosition: 'center'}}>
        <form onSubmit={handleSubmit} style={{width:'100%'}} >
            <Stack direction="column" width={{xs:'80%',sm:'60%', md:'40%'}}  spacing={3} lineHeight="auto" borderRadius="10px 10px" 
            height='auto' border='1px solid gold' justifySelf='center' alignSelf='center' className={styles.glass3d}>
                <Stack width='200px' pt={2}  height='200px' justifySelf='center' alignSelf='center' 
                sx={{backgroundImage:`url(${personal})`, backgroundRepeat:"no-repeat", backgroundSize: 'contain',
            backgroundPosition: 'center'}}>
                </Stack>
                <Typography textAlign="center" variant='h4' color='white'>Register</Typography>
                <Stack direction='row' width="100%" spacing={2} justifyContent="center" alignItems='center'>
                    <Stack width="40%" justifyContent="center" alignItems='center'>
                        <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} 
                        placeholder='your firstname' style={{width:"90%",textIndent:'5px', height:"40px",borderRadius:"5px 5px"}}  />
                    </Stack>
                    <Stack width="40%" justifyContent="center" alignItems='center'>
                        <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} 
                        placeholder='your lastname' style={{width:"90%",textIndent:'5px', height:"40px",borderRadius:'5px 5px'}}/>
                    </Stack>
                </Stack>
                <Stack width="100%" justifyContent="center" alignItems='center'>
                    <input type='text' name='username' value={formData.username} onChange={handleChange} 
                    placeholder='your username' style={{width:"80%",textIndent:'5px', height:"40px",borderRadius:'5px 5px'}} />
                </Stack>
                <Stack width="100%"justifyContent="center" alignItems='center'>
                    <input type='password' name='password'  value={formData.password} onChange={handleChange} 
                    placeholder='password' style={{width:"80%",textIndent:'5px', height:"40px", borderRadius:'5px 5px'}} />
                </Stack>
                <Stack justifyContent="center" alignItems='center' width="100%" spacing={2}>
                    <Typography color='ivory'>Existing user?&nbsp;&nbsp; <Link style={{textDecoration:'none', color:'white'}} to="/login">sign in</Link></Typography>
                    <Button loading={loading} type='submit' style={{width:'100px', height:'30px', textAlign:'center',border:'1px solid white', 
                    borderRadius:"5px 5px", backgroundColor:"#060010", color:'white', marginBottom:'10px', textTransform:'capitalize'}} 
                     disabled={!formData.username || !formData.password}>Sign Up</Button>
                </Stack>
            </Stack>
        </form>
            
    </Stack>
    
  )
}

export default Register