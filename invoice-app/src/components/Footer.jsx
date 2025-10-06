import React from 'react'
import { Stack, Typography, Link, Icon } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
function Footer() {
  return (
    <Stack bgcolor='#060010' width="100%" justifyContent='center' alignItems='center' my={4} pt={4} pb={4}>
        <Typography color='white' textAlign='center' fontWeight={700}>
            Copyright ©  Jubilo | Designed by Temiloluwa Amusan
        </Typography>
        <Stack direction={{xs:'column', sm:'row'}} spacing={{xs:1,sm :2}} width='100%' justifyContent='center' alignItems='center'>
            <Typography color='white' textAlign='center' fontWeight={700} >Contact me</Typography>
            <Stack direction='row' spacing={2} justifySelf='center'  alignSelf='center'>
                <Link  component='a' href='https://www.facebook.com/profile.php?id=100007386554971' ><Icon><FacebookIcon/></Icon></Link>
                <Link  component='a' href='https://wa.me/2348133834904'><Icon><WhatsAppIcon color='success' /></Icon></Link>
                <Link component='a' href='https://x.com/jubiloforever?t=4AcX2si_9wGVx5J-2UWL1g&s=09'><Icon><XIcon htmlColor='#FFFFFF'/></Icon></Link>
                <Link component='a' href='https://www.instagram.com/tml_bliss?igsh=YzljYTk10Dg3Zg=='><Icon><InstagramIcon htmlColor='#C13584' /></Icon></Link>
                <Link component='a' href='https://www.linkedin.com/in/temiloluwa-amusan-749b134b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'><Icon><LinkedInIcon htmlColor='#0A66C2' /></Icon></Link>
                <Link component='a' href='https://github.com/Jubilo06'><Icon><GitHubIcon htmlColor='white' /></Icon></Link>   
            </Stack>
        </Stack>

    </Stack>
  )
}

export default Footer