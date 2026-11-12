import React, { useContext } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  TextField, 
  InputAdornment, 
  Select, 
  MenuItem, 
  Divider, 
  Chip,
  useTheme, 
  alpha 
} from '@mui/material';

// Context & Calculation Engine
import { InvoiceContext } from './InvoiceProvider';
import { calculateTotals } from './TotalPrice';

// Icons
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

function Summary() {
  const theme = useTheme();
  const { currentInvoice, updateCurrentInvoiceField } = useContext(InvoiceContext);

  if (!currentInvoice) {
    return null;
  }

  const { 
    subTotal = 0, 
    taxAmount = 0, 
    discountAmount = 0, 
    shippingAmount = 0, 
    grandTotal = 0, 
    balanceDue = 0 
  } = calculateTotals(currentInvoice);

  const currencySymbol = currentInvoice.currency || '$';

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const isFullyPaid = balanceDue <= 0 && grandTotal > 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2.2}>
        
        {/* --- Subtotal Row --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Subtotal
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary">
            {currencySymbol} {formatCurrency(subTotal)}
          </Typography>
        </Box>

        {/* --- Tax Row (Conditional) --- */}
        {currentInvoice.taxEnabled && (
          <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Tax / VAT
              </Typography>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                +{currencySymbol} {formatCurrency(taxAmount)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <TextField
                type="number"
                size="small"
                name="taxValue"
                placeholder="Rate"
                value={currentInvoice.taxValue || ''}
                onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', borderRadius: '8px' }
                }}
              />
              <Select
                size="small"
                name="taxType"
                value={currentInvoice.taxType || 'percentage'}
                onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}
                sx={{ bgcolor: '#ffffff', borderRadius: '8px', minWidth: 70, fontWeight: 700 }}
              >
                <MenuItem value="percentage">%</MenuItem>
                <MenuItem value="fixed">{currencySymbol}</MenuItem>
              </Select>
            </Stack>
          </Box>
        )}

        {/* --- Discount Row (Conditional) --- */}
        {currentInvoice.discountEnabled && (
          <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                Discount
              </Typography>
              <Typography variant="body2" fontWeight={700} color="error.main">
                -{currencySymbol} {formatCurrency(discountAmount)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <TextField
                type="number"
                size="small"
                name="discountValue"
                placeholder="Value"
                value={currentInvoice.discountValue || ''}
                onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', borderRadius: '8px' }
                }}
              />
              <Select
                size="small"
                name="discountType"
                value={currentInvoice.discountType || 'percentage'}
                onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}
                sx={{ bgcolor: '#ffffff', borderRadius: '8px', minWidth: 70, fontWeight: 700 }}
              >
                <MenuItem value="percentage">%</MenuItem>
                <MenuItem value="fixed">{currencySymbol}</MenuItem>
              </Select>
            </Stack>
          </Box>
        )}

        {/* --- Shipping Row (Conditional) --- */}
        {currentInvoice.shippingEnabled && (
          <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocalShippingOutlinedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                  Shipping Fee
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                +{currencySymbol} {formatCurrency(shippingAmount)}
              </Typography>
            </Box>

            <TextField
              fullWidth
              size="small"
              type="number"
              name="shippingValue"
              placeholder="0.00"
              value={currentInvoice.shippingValue || ''}
              onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                sx: { bgcolor: '#ffffff', borderRadius: '8px' }
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

        {/* --- Grand Total --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            Grand Total
          </Typography>
          <Typography variant="h6" fontWeight={900} color="text.primary" letterSpacing="-0.02em">
            {currencySymbol} {formatCurrency(grandTotal)}
          </Typography>
        </Box>

        {/* --- Amount Paid Input --- */}
        <Box sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.8}>
            AMOUNT ALREADY PAID
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            name="amountPaid"
            placeholder="0.00"
            value={currentInvoice.amountPaid || ''}
            onChange={(e) => updateCurrentInvoiceField(e.target.name, e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
              sx: { bgcolor: '#ffffff', borderRadius: '10px' }
            }}
          />
        </Box>

        {/* --- Balance Due Highlight Card --- */}
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: '12px', 
            bgcolor: isFullyPaid ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.primary.main, 0.06),
            border: '1px solid',
            borderColor: isFullyPaid ? alpha(theme.palette.success.main, 0.25) : alpha(theme.palette.primary.main, 0.2),
            mt: 1
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography 
                variant="caption" 
                fontWeight={800} 
                textTransform="uppercase" 
                letterSpacing="0.04em"
                color={isFullyPaid ? 'success.main' : 'primary.main'}
              >
                {isFullyPaid ? 'Status' : 'Balance Due'}
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight={900} 
                color={isFullyPaid ? 'success.dark' : 'text.primary'}
                lineHeight={1.2}
              >
                {currencySymbol} {formatCurrency(balanceDue)}
              </Typography>
            </Box>

            {isFullyPaid && (
              <Chip
                icon={<CheckCircleRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                label="Paid in Full"
                size="small"
                color="success"
                sx={{ fontWeight: 700, fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>

      </Stack>
    </Box>
  );
}

export default Summary;