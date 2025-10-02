import React from 'react'
import { useEffect } from 'react'
import { Stack, Typography, Button, Paper, Grid, Box, Container } from '@mui/material'
import FeaturesSection from './FeatureSection'
import { Link } from 'react-router-dom'
import src26 from '../assets/src26.jpg'
import styles from './Home.module.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
function Home() {
  useEffect(()=>{
      Aos.init({duration:2000})
  },[])
  
  return (
    <Stack spacing={20} width='100%' height='auto' bgcolor='white' alignItems={{xs:'center'}} justifyContent={{xs:'center'}}
      sx={{backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${src26})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
                    backgroundPosition: 'center'}}>
      <Stack width={{xs:'90%',sm:'80%', md:'90%'}}  height={{xs:'auto', sm:'auto', md:'auto'}}  >
        <Typography fontWeight='bolder' mt={5}  lineHeight='40px' data-aos="zoom-in"
          border='1px solid transparent'  textAlign='left' fontSize={{xs:20,sm:30,md:40}}
          borderRadius='5px 5px' 
          width="100%" color='white' sx={{height:'100%'}}>Create, manage, and send beautiful invoices in minutes. 
          Get started now and take control of your billing.
        </Typography>  
      </Stack>
      
      <FeaturesSection />
    
    </Stack>
  )
}

export default Home