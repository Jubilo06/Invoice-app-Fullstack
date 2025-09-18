import React, { useContext } from 'react';
import { InvoiceContext } from './InvoiceProvider';
import { Stack, FormControlLabel, Switch, Typography } from '@mui/material';

function InvoiceOptions() {
  const { currentInvoice, setCurrentInvoice } = useContext(InvoiceContext);
  const handleToggle = (event) => {
    const { name, checked } = event.target;
    setCurrentInvoice(prev => ({
      ...prev,
      [name]: checked // e.g., { ... taxEnabled: true ... }
    }));
  };
  if (!currentInvoice) return null;

  return (
    <Stack width={{xs:'96%'}} color='#060010' my={2} direction={{xs:'column', sm:'column', md:'row'}} 
    bgcolor='ivory' spacing={2} sx={{ mb: 2, borderRadius:{xs:'5px 5px', sm:'20px 20px'} }} p={{xs:0, sm:'1'}} alignItems='center'
    justifyContent='center'>
      <Typography  variant="subtitle1">Options:</Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={currentInvoice.taxEnabled || false}
            onChange={handleToggle}
            name="taxEnabled"
          />
        }
        label="Add Tax"
      />

      <FormControlLabel
        control={
          <Switch
            checked={currentInvoice.discountEnabled || false}
            onChange={handleToggle}
            name="discountEnabled"
          />
        }
        label="Add Discount"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={currentInvoice.shippingEnabled || false}
            onChange={handleToggle}
            name="shippingEnabled"
          />
        }
        label="Add Shipping"
      />
    </Stack>
  );
}

export default InvoiceOptions;