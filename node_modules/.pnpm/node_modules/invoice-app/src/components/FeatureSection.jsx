import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DescriptionIcon from '@mui/icons-material/Description';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
function FeaturesSection() {
    const features = [
        {
            icon: <ReceiptLongIcon fontSize="large" sx={{ color: 'primary.main' }} />,
            title: 'Professional Invoices',
            description: 'Get Paid Faster. Create and send polished, itemized invoices in minutes. Our system automates all calculations, including taxes, discounts, and shipping costs...'
        },
        {
            icon: <RequestQuoteIcon fontSize="large" sx={{ color: 'primary.main' }} />,
            title: 'Detailed Quotations / Estimates',
            description: 'Win More Projects. Present your proposals with clarity and confidence. Build detailed quotations that break down complex jobs into easy-to-understand sections...'
        },
        {
            icon: <DescriptionIcon fontSize="large" sx={{ color: 'primary.main' }} />,
            title: 'Proforma Invoices',
            description: 'Solidify Sales Agreements. Issue a Proforma Invoice to provide a binding commitment to your client before goods are delivered or payment is made...'
        },
        {
            icon: <CalculateIcon fontSize="large" sx={{ color: 'primary.main' }} />,
            title: 'Bill of Engineering Measurement and Evaluation (BEME)',
            description: 'Precision for Complex Projects. Tailor-made for engineers and contractors. Use our flexible sections to categorize every material, labor, and equipment cost...'
        },
        {
            icon: <AccountCircleIcon fontSize="large" sx={{ color: 'primary.main' }} />,
            title: 'Secure User Profiles',
            description: 'Save Once, Use Forever. Create a secure profile to save your company name, logo, and even a default signature, ensuring brand consistency on every document.'
        },
        {
            icon: <PictureAsPdfIcon fontSize="large" sx={{ color: 'primary.main' }} />,
            title: 'High-Quality PDF Generation',
            description: 'Professional Documents, Every Time. Impress your clients with crystal-clear, print-ready PDFs generated on our server for perfect quality and layout.'
        }
    ];
  return (
    <Box sx={{ bgcolor: 'background.paper', mt:0, mb:'4' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          A Complete Toolkit for Your Business Documents
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Go beyond simple billing. Our application is a powerful, all-in-one platform designed to handle every financial document your business needs to thrive.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  height: '100%', // Makes all cards the same height
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box sx={{ mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>{feature.title}</Typography>
                <Typography variant="body1" color="text.secondary">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturesSection;