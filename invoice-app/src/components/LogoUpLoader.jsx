import React, { useContext } from 'react';
import { InvoiceContext } from './InvoiceProvider';
import { Stack, Button, Typography } from '@mui/material';

function LogoUploader({ currentLogo, onLogoChange }) {
  const { invoiceData, updateField } = useContext(InvoiceContext);
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    
    reader.onload = () => {
      const logoDataUrl = reader.result;
      onLogoChange(logoDataUrl);
    };

    reader.readAsDataURL(file);
  };

  

  return (
    <Stack spacing={2}  width='100%' >
      <Typography variant="subtitle1">Upload your Compan's Logo</Typography>
      <input
        type="file"
        id="logo-upload"
        width='50%'
        accept="image/png, image/jpeg"
        onChange={handleFileSelect}
      />
      {/* --- Display the current logo if it exists --- */}
      {currentLogo && (
        <Stack direction="row" spacing={2} alignItems="center">
          <img 
            src={currentLogo} 
            alt="company-logo" 
            style={{ maxWidth: '150px', maxHeight: '100px', border: '1px solid #ddd' }} 
            />
            
        </Stack>
      )}

        </Stack>
  );
}

export default LogoUploader;