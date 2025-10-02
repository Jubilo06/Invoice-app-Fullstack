import React, { useContext } from 'react';
import { InvoiceContext } from './InvoiceProvider';
import { calculateTotals } from './TotalPrice';
import { Stack, Typography, TextField, /* ... */ } from '@mui/material';

function Main() {
  const { currentInvoice, setCurrentInvoice } = useContext(InvoiceContext);
  if (!currentInvoice) return <div>Loading...</div>;
  const { subTotal, taxAmount, discountAmount, shippingAmount, grandTotal, balanceDue } = calculateTotals(currentInvoice);
  return (
    <Stack spacing={1.5} sx={{ /* ... */ }}>
        <Typography variant="h6">Summary</Typography>
        
        <Stack direction="row" justifyContent="space-between">
            <Typography>Subtotal:</Typography>
            <Typography>{currentInvoice.currency} {subTotal.toFixed(2)}</Typography>
        </Stack>

        {/* --- All your conditional inputs for Tax, Discount, Shipping --- */}
        {/* They remain the same, as they are for *setting* the values */}

        <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Grand Total:</Typography>
            <Typography variant="h6">{currentInvoice.currency} {grandTotal.toFixed(2)}</Typography>
        </Stack>
        
        {/* Input for Amount Paid */}
        <Stack direction="row" justifyContent="space-between">
            <Typography>Amount Paid:</Typography>
            <TextField type="number" name="amountPaid" /* ... */ />
        </Stack>
        
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Balance Due:</Typography>
            <Typography variant="h6" color="green">{currentInvoice.currency} {balanceDue.toFixed(2)}</Typography>
        </Stack>
    </Stack>
  );
}
export default Main;