import React from 'react'
import { Stack, Typography, Link, Icon } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import WhatsappIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedinIcon from '@mui/icons-material/Linkedin'
import GithubIcon from '@mui/icons-material/Github'
function Footer() {
  return (
    <Stack bgcolor='gold' width="100%" justifyContent='center' alignItems='center' my={4}>
        <Typography color='white' textAlign='center' fontWeight={700}>
            Copyright ©  Jubilo | Designed by Temiloluwa Amusan
        </Typography>
        <Stack direction='row' spacing={2}>
            <Typography color='white' fontWeight={700}>Contact me</Typography>
            <Stack direction='row' spacing={2}>
                <Link  component='a' href='https://www.facebook.com/profile.php?id=100007386554971' ><Icon><FacebookIcon/></Icon></Link>
                <Link  component='a' href='https://wa.me/2348133834904'><Icon><WhatsappIcon color='success' /></Icon></Link>
                <Link component='a' href='https://x.com/jubiloforever?t=4AcX2si_9wGVx5J-2UWL1g&s=09'><Icon><XIcon htmlColor='#000'/></Icon></Link>
                <Link component='a' href='https://www.instagram.com/tml_bliss?igsh=YzljYTk10Dg3Zg=='><Icon><InstagramIcon htmlColor='#C13584' /></Icon></Link>
                <Link component='a' href='https://www.linkedin.com/in/temiloluwa-amusan-749b134b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'><Icon><LinkedinIcon htmlColor='#0A66C2' /></Icon></Link>
                <Link component='a' href='https://github.com/Jubilo06'><Icon><GithubIcon htmlColor='black' /></Icon></Link>   
            </Stack>
        </Stack>

    </Stack>
  )
}

export default Footer