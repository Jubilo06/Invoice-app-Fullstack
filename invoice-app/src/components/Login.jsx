import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InvoiceContext } from './InvoiceProvider'
import { Stack,Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import personal from '../assets/personal.png'
import { AuthContext } from './AuthContext'
import src3 from '../assets/src3.jpg'
function Login() {

    const {loading, setLoading}=useContext(InvoiceContext)
    const [formData, setFormData] = useState({username: '', password: '' });
        const { login } = useContext(AuthContext);
        const navigate=useNavigate()
        const handleChange = (e) => {
            setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
        };
   
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(formData);
      if (loggedInUser && loggedInUser.companyName) {
        console.log("Profile complete. Navigating to dashboard.");
        navigate('/Dashboard'); // ✅ Go directly to the dashboard
      } else {
        console.log("Profile incomplete. Navigating to profile setup.");
        navigate('/profile'); // ❗ Go to the profile setup page
      }

    } catch (error) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
    return (
    <Stack width="100%" justifyContent="center" alignItems='center' height={{xs:'900px', sm:'1200px', md:'800px'}} overflow='hidden'  pb={2}  bgcolor='white'
    sx={{backgroundImage:`url(${src3})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
                backgroundPosition: 'center'}}>
        <form onSubmit={handleSubmit} style={{width:'100%'}}>
            <Stack direction="column"  width={{xs:'80%',sm:'60%', md:'40%'}} spacing={3} lineHeight="auto" pt={2} height='auto' 
        borderRadius="10px 10px" border='1px solid transparent' 
        justifySelf='center' alignSelf='center'>
              <Stack width='200px' height='200px' justifySelf='center' alignSelf='center' sx={{backgroundImage:`url(${personal})`, backgroundRepeat:"no-repeat", backgroundSize: 'contain',
                  backgroundPosition: 'center'}}>
              </Stack>
            <Typography color='white' textAlign="center" variant='h4'>Sign in</Typography>
            <Stack width="100%" justifyContent="center" alignItems='center'>
                <input type='text' name='username' value={formData.username} onChange={handleChange} 
                placeholder='your username' style={{width:"90%", padding: '10px 40px 10px 10px', borderRadius:'5px 5px', fontSize:'16px'}} />
            </Stack>
            
            <Stack style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter password"
                  style={{
                    width: '100%',
                    padding: '10px 70px 10px 10px', 
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    borderRadius:'5px 5px'
                  }}
                />
                <svg
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    stroke: 'black',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {showPassword ? (
                    <path d="M1 1l22 22M12 5c-7 0-11 7-11 7s4 7 11 7a11.1 11.1 0 0 0 5.5-1.5M12 12a5 5 0 0 1 5 5" />
                  ) : (
                    <>
                      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </>
                  )}
                </svg>
            </Stack>

            <Stack justifyContent="center" alignItems='center' width="100%" spacing={2}>
                <Typography color='white'>New user?&nbsp;&nbsp; <Link to="/register" style={{textDecoration:'none', color:'white'}}>Sign up</Link></Typography>
                <Button type='submit' loading={loading} style={{width:'80px', height:'30px', textAlign:'center',border:'1px solid white', 
                    borderRadius:"5px 5px", backgroundColor:"#060010", color:'white', marginBottom:'10px'}} 
                     disabled={!formData.username || !formData.password}>Login</Button>
            </Stack>
        </Stack>
        </form>
    </Stack>
  )
}

export default Login