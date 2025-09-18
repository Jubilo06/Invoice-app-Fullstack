import React from 'react'
import { useState,useContext, useMemo } from 'react'
import { InvoiceContext } from './InvoiceProvider'
import { Stack, Typography, TextField, InputAdornment, Select, MenuItem } from '@mui/material'
import { AuthContext } from './AuthContext'


function Summary() {
    const { invoiceData, updateItem, addItem, removeItem,sigPadRef,clearSignature,
        saveSignature,addSection,updateSectionTitle,removeSection, currentInvoice, updateCurrentInvoiceField
       } = useContext(InvoiceContext); 


  const subTotal = useMemo(() => {
    let total = 0;
    currentInvoice?.sections?.forEach(section => {
      section?.items?.forEach(item => {
        total += parseFloat(item.total_price) || 0;
      });
    });
    return total;
  }, [currentInvoice?.sections]);
  let taxAmount = 0;
  if (currentInvoice.taxEnabled) {
    const taxVal = parseFloat(currentInvoice.taxValue) || 0;
    taxAmount = currentInvoice.taxType === 'percentage' ? subTotal * (taxVal / 100) : taxVal;
  }
  
  let discountAmount = 0;
  if (currentInvoice.discountEnabled) {
    const discountVal = parseFloat(currentInvoice.discountValue) || 0;
    discountAmount = currentInvoice.discountType === 'percentage' ? subTotal * (discountVal / 100) : discountVal;
  }
  
  const shippingAmount = currentInvoice.shippingEnabled ? (parseFloat(currentInvoice.shippingValue) || 0) : 0;
  const grandTotal = subTotal + taxAmount - discountAmount + shippingAmount;
  const amountPaid = parseFloat(currentInvoice.amountPaid) || 0;
  const balanceDue = grandTotal - amountPaid;
  if (!currentInvoice) {
    return <div>Loading summary...</div>; 
  }
  return (
    <Stack spacing={3} sx={{ mt: 4,pl:1,pr:1, border: '1px solid #e0e0e0', borderRadius: 1 }} bgcolor="#060010" width={{xs:'100%',sm:'100%'}}>
        <Typography variant="h6">Summary</Typography>
        <Stack direction="row" justifyContent="space-between">
            <Typography>Subtotal:</Typography>
            <Typography>{currentInvoice.currency} {subTotal.toFixed(2)}</Typography>
        </Stack>
        {currentInvoice.taxEnabled && (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>Tax:</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField type="number" name="taxValue" size="small"  value={currentInvoice.taxValue || ''} onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)} 
                sx={{width:'200px',
                      '& .MuiInputLabel-root': { color: 'white',},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                      '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'white',},
                      '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                        '& .MuiOutlinedInput-input': {color: 'black', },
                      },
                    }}  
              />
              <Select 
              sx={{color: 'white','& .MuiSelect-icon': {
                  color: 'white', },'& .MuiOutlinedInput-notchedOutline': {borderColor: 'white',},
                '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: 'white',},
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: 'white',},
              }}  
          name="taxType"  size="small" value={currentInvoice.taxType || 'percentage'} onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}>
                <MenuItem color='white' value="percentage">%</MenuItem>
                <MenuItem color='white' value="fixed">{currentInvoice.currency}</MenuItem>
              </Select>
              <Typography>({currentInvoice.currency}{taxAmount.toFixed(2)})</Typography>
            </Stack>
          </Stack>
        )}
        {currentInvoice.discountEnabled && (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>Discount:</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField type="number" name="discountValue" size="small"  value={currentInvoice.discountValue || ''} onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)} 
                sx={{width:'200px',
                      '& .MuiInputLabel-root': { color: 'white',},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                      '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'white',},
                      '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                        '& .MuiOutlinedInput-input': {color: 'black', },
                      },
                }}  
              />
              <Select 
                sx={{color: 'white','& .MuiSelect-icon': {
                    color: 'white', },'& .MuiOutlinedInput-notchedOutline': {borderColor: 'white',},
                  '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: 'white',},
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: 'white',},
                }}  
               name="discountType" size="small" value={currentInvoice.discountType || 'percentage'} onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}>
                <MenuItem value="percentage">%</MenuItem>
                <MenuItem value="fixed">{currentInvoice.currency}</MenuItem>
              </Select>
              <Typography color="error">(-{currentInvoice.currency}{discountAmount.toFixed(2)})</Typography>
            </Stack>
          </Stack>
        )}
        {currentInvoice.shippingEnabled && (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>Shipping:</Typography>
            <TextField
              type="number" name="shippingValue" size="small" 
              value={currentInvoice.shippingValue || ''}
              onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start">{currentInvoice.currency}</InputAdornment> }}
              sx={{width:'200px',
                      '& .MuiInputLabel-root': { color: 'white',},'& .MuiInputLabel-root.Mui-focused': { color: '#000000',},
                      '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'white',},
                      '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                        '& .MuiOutlinedInput-input': {color: 'black', },
                      },
              }}
            />
          </Stack>
        )}
        <Stack direction="row" justifyContent="space-between" sx={{ borderTop: '1px solid #ccc', pt: 1, mt: 1 }}>
            <Typography variant="h6">Grand Total:</Typography>
            <Typography variant="h6">{currentInvoice.currency} {grandTotal.toFixed(2)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>Amount Paid:</Typography>
            <TextField type="number" name="amountPaid" size="small"  value={currentInvoice.amountPaid || ''} onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">{currentInvoice.currency}</InputAdornment> }} 
              sx={{width:'200px',
                      '& .MuiInputLabel-root': { color: 'white',},'& .MuiInputLabel-root.Mui-focused': { color: 'black',},
                      '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'transparent',},
                      '&:hover fieldset': {borderColor: 'transparent',}, '&.Mui-focused fieldset': {borderColor: 'transparent',},
                        '& .MuiOutlinedInput-input': {color: 'black', },
                      },
              }}
            />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Balance Due:</Typography>
            <Typography variant="h6" color="green">{currentInvoice.currency} {balanceDue.toFixed(2)}</Typography>
        </Stack>
    </Stack>
  );
}

export default Summary