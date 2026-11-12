// import React, { useContext, useState } from 'react';
// import { InvoiceContext } from './InvoiceProvider'
// import { Stack, TableContainer,TableBody,TableCell,TableHead,TableRow, 
//   Paper,Table,IconButton, Button, Typography, TextField} from '@mui/material'
// import Currency from './Currency';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';

// function InvoiceItems() {
//   const { invoiceData, addSection, updateSectionTitle, removeSection, currentInvoice,
//     addItem, updateItem, removeItem, updateCurrentInvoiceField } =useContext(InvoiceContext);
//   if (!currentInvoice || !Array.isArray(currentInvoice.sections)) {
//     return <div>Loading items...</div>;
//   }
//   return (
//       <Stack direction='column' spacing={3} 
//           borderRadius={1} width={{xs:'100%', sm:'100%'}} bgcolor='#060010' >
//         <Stack width='100%'>
//           <Typography>Choose your currency:</Typography>
//           <Currency />
//         </Stack>
        
        
//         {currentInvoice.sections.map((section, sectionIndex) => (
//           <Stack key={section.id} spacing={2}  width='100%'
//             sx={{border: '1px solid #ddd', borderRadius: 1 }}>
            
//             {/* Section Header */}
//             <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
//               <Stack width='100%' spacing={1} sx={{ border: '1px solid #ddd'}} justifyContent="center" alignItems="center">
//                 <Typography><strong>Section:</strong></Typography>
//                 <TextField
//                   variant="outlined"
//                   value={section.title}
//                   onChange={(e) => updateSectionTitle(section.id, e.target.value)}
//                   label={`Section ${sectionIndex + 1} Title (optional)`}
//                   sx={{ width:'80%', paddingBottom:'5px',
//                     '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F', fontSize:'20px'},
//                     '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
//                     '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
//                       '& .MuiOutlinedInput-input': {color: 'white', },
//                     },
//                   }}
//                 />
//               </Stack>
//               <Button style={{backgroundColor:'gold', color:'black'}} onClick={() => removeSection(section.id)} >Remove Section</Button>
//             </Stack>
  
//             {/* --- Loop for each ITEM in the section --- */}
//             {section.items.map(item => {
//               const canCalculate = (parseFloat(item.quantity) || 0) > 0 && (parseFloat(item.Unit_price) || 0) > 0;
              
//               // ✅ ALL JSX for one item is now inside this single return statement
//               return (
//                 <Stack key={item.id} spacing={2} justifyContent="center" alignItems="center" sx={{borderTop: '1px solid #eee' }}>
//                   <Stack direction="row" spacing={2} pt={2} justifyContent="center" alignItems="center" width='100%'>
//                     <TextField label="Product/Service" type="text" value={item.Product_name || ''} 
//                       onChange={(e) => updateItem(section.id, item.id, 'Product_name', e.target.value)} 
//                       sx={{ width:'80%',
//                         '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
//                         '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
//                         '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
//                           '& .MuiOutlinedInput-input': {color: 'white', },
//                         },
//                       }}
//                     />
//                   </Stack>
                  
//                   <TextField label="Description" type="text" value={item.description || ''} 
//                     onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)} 
//                     sx={{ width:'80%',
//                         '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
//                         '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
//                         '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
//                           '& .MuiOutlinedInput-input': {color: 'white', },
//                         },
//                       }}
//                     />
                    
//                   <Stack direction="column" spacing={2} width="100%" justifyContent="center" alignItems="center">
//                     <TextField label="Quantity" type="number" value={item.quantity || ''} 
//                       onChange={(e) => updateItem(section.id, item.id, 'quantity', e.target.value)} 
//                       sx={{ width:'80%',
//                         '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
//                         '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
//                         '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
//                           '& .MuiOutlinedInput-input': {color: 'white', },
//                         },
//                       }}
//                    />
                    
//                     <TextField label={`Rate (${currentInvoice.currency})`} type="number" value={item.unit_price || ''} 
//                       onChange={(e) => updateItem(section.id, item.id, 'unit_price', e.target.value)}  
//                       sx={{ width:'80%',
//                         '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
//                         '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
//                         '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
//                           '& .MuiOutlinedInput-input': {color: 'white', },
//                         },
//                       }}
//                     />
                    
//                     {/* The conditional Amount field */}
//                     {canCalculate ? (
//                       <TextField label="Amount" type="number" value={(item.quantity * item.unit_price).toFixed(2)}
//                         disabled 
//                         sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000' },
//                              '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
//                              '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
//                               '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
//                             '& .MuiOutlinedInput-input': {color: 'white', },
//                         },
//                       }} />
//                     ) : (
//                       <TextField label="Amount" type="number" placeholder="Total" value={item.total_price || ''}
//                         onChange={(e) => updateItem(section.id, item.id, 'total_price', e.target.value)}  
//                         sx={{ width:'80%', 
//                              '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
//                              '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
//                               '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
//                             '& .MuiOutlinedInput-input': {color: 'white', },
//                         },
//                       }}
//                       />
//                     )}
//                   </Stack>
//                  <Stack>
//                     <Button style={{backgroundColor:'gold', color:'black', width:"80%", justifySelf:'center', alignSelf:'center'}} 
//                       onClick={() => removeItem(section.id, item.id)}>
//                           Remove Item from Section
//                     </Button>
//                  </Stack>
//                 </Stack>
//               );
//             })}
//             <Stack direction='row' spacing={4} pb={2} width='100%' justifyContent="center" alignItems="center">
//               <Button style={{backgroundColor:'gold',color:'black'}} onClick={() => addItem(section.id)} startIcon={<AddIcon />}>
//                 Add Item to Section
//               </Button>
//             </Stack>          
            
//           </Stack>
//         ))}
  
//        <Button onClick={addSection} variant="contained" sx={{ mt: 2 }}>
//          + Add New Section
//        </Button>
//       </Stack>
//     );
// }
// export default InvoiceItems;


import React, { useContext } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Card, 
  CardContent, 
  Grid, 
  Divider, 
  Tooltip, 
  Chip, 
  InputAdornment, 
  useTheme, 
  alpha 
} from '@mui/material';

// Context
import { InvoiceContext } from './InvoiceProvider';

// Components & Icons
import Currency from './Currency';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

function InvoiceItems() {
  const theme = useTheme();
  const { 
    currentInvoice,
    addSection, 
    updateSectionTitle, 
    removeSection, 
    addItem, 
    updateItem, 
    removeItem 
  } = useContext(InvoiceContext);

  if (!currentInvoice || !Array.isArray(currentInvoice.sections)) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">Loading invoice items...</Typography>
      </Box>
    );
  }

  const currencySymbol = currentInvoice.currency || '$';

  return (
    <Stack spacing={3.5} width="100%">
      
      {/* ================= TOP CURRENCY BAR ================= */}
      <Box 
        sx={{ 
          p: 2.5, 
          borderRadius: '14px', 
          bgcolor: '#f8fafc', 
          border: '1px solid #e2e8f0',
          display: 'flex', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box 
            sx={{ 
              width: 36, 
              height: 36, 
              borderRadius: '10px', 
              bgcolor: alpha(theme.palette.primary.main, 0.1), 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PaidOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Invoice Currency</Typography>
            <Typography variant="caption" color="text.secondary">All item rates and line sums match this currency</Typography>
          </Box>
        </Stack>

        <Box sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 160 }}>
          <Currency />
        </Box>
      </Box>

      {/* ================= SECTIONS LIST ================= */}
      {currentInvoice.sections.map((section, sectionIndex) => (
        <Card 
          key={section.id} 
          sx={{ 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            overflow: 'visible'
          }}
        >
          {/* Section Header */}
          <Box 
            sx={{ 
              p: 2.5, 
              bgcolor: '#ffffff', 
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
              <LayersOutlinedIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
              <TextField
                variant="standard"
                placeholder={`Section ${sectionIndex + 1} Title (e.g. Phase 1 / Materials)`}
                value={section.title || ''}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                InputProps={{
                  disableUnderline: false,
                  sx: {
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: 'text.primary',
                    '&:before': { borderColor: 'transparent' },
                    '&:hover:not(.Mui-disabled):before': { borderColor: '#cbd5e1' },
                    '&:after': { borderColor: theme.palette.primary.main }
                  }
                }}
                sx={{ maxWidth: { xs: '100%', sm: 400 }, width: '100%' }}
              />
              <Chip 
                label={`${section.items.length} ${section.items.length === 1 ? 'item' : 'items'}`} 
                size="small" 
                sx={{ fontWeight: 600, fontSize: '0.75rem', bgcolor: '#f1f5f9' }}
              />
            </Stack>

            {currentInvoice.sections.length > 1 && (
              <Tooltip title="Remove entire section">
                <IconButton 
                  size="small" 
                  onClick={() => removeSection(section.id)}
                  sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.08) } }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Header Column Labels (Visible on Desktop) */}
            {section.items.length > 0 && (
              <Grid container spacing={2} sx={{ display: { xs: 'none', md: 'flex' }, pb: 1.5, px: 1 }}>
                <Grid item md={5}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">Item & Description</Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">Quantity</Typography>
                </Grid>
                <Grid item md={2.5}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">Unit Rate</Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" align="right" display="block">Amount</Typography>
                </Grid>
                <Grid item md={0.5} />
              </Grid>
            )}

            {/* Items Rows */}
            <Stack spacing={2}>
              {section.items.map((item, itemIdx) => {
                const qty = parseFloat(item.quantity) || 0;
                const unitPrice = parseFloat(item.unit_price ?? item.Unit_price) || 0;
                const canCalculate = qty > 0 && unitPrice > 0;
                const calculatedTotal = (qty * unitPrice).toFixed(2);

                return (
                  <Box 
                    key={item.id || itemIdx}
                    sx={{ 
                      p: { xs: 2, md: 1.5 }, 
                      borderRadius: '12px', 
                      bgcolor: { xs: '#f8fafc', md: 'transparent' },
                      border: { xs: '1px solid #e2e8f0', md: 'none' },
                      borderBottom: { md: '1px solid #f1f5f9' },
                      transition: 'bgcolor 0.2s ease',
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      
                      {/* Product Name & Description */}
                      <Grid item xs={12} md={5}>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Product or service name..."
                            value={item.Product_name || ''}
                            onChange={(e) => updateItem(section.id, item.id, 'Product_name', e.target.value)}
                            InputProps={{ sx: { bgcolor: '#ffffff', borderRadius: '8px' } }}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Optional item details / specifications..."
                            value={item.description || ''}
                            onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                            InputProps={{ 
                              sx: { bgcolor: '#ffffff', borderRadius: '8px', fontSize: '0.85rem' } 
                            }}
                          />
                        </Stack>
                      </Grid>

                      {/* Quantity */}
                      <Grid item xs={6} md={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Qty"
                          type="number"
                          placeholder="1"
                          value={item.quantity || ''}
                          onChange={(e) => updateItem(section.id, item.id, 'quantity', e.target.value)}
                          InputProps={{ sx: { bgcolor: '#ffffff', borderRadius: '8px' } }}
                        />
                      </Grid>

                      {/* Unit Price */}
                      <Grid item xs={6} md={2.5}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Rate"
                          type="number"
                          placeholder="0.00"
                          value={item.unit_price ?? item.Unit_price ?? ''}
                          onChange={(e) => updateItem(section.id, item.id, 'unit_price', e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                            sx: { bgcolor: '#ffffff', borderRadius: '8px' }
                          }}
                        />
                      </Grid>

                      {/* Calculated Amount or Manual Flat Total */}
                      <Grid item xs={10} md={2}>
                        {canCalculate ? (
                          <Box sx={{ textAlign: { xs: 'left', md: 'right' }, px: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', md: 'none' } }}>
                              Total Amount:
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                              {currencySymbol} {Number(calculatedTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </Box>
                        ) : (
                          <TextField
                            fullWidth
                            size="small"
                            label="Total"
                            type="number"
                            placeholder="Flat rate"
                            value={item.total_price || ''}
                            onChange={(e) => updateItem(section.id, item.id, 'total_price', e.target.value)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                              sx: { bgcolor: '#ffffff', borderRadius: '8px' }
                            }}
                          />
                        )}
                      </Grid>

                      {/* Delete Item Button */}
                      <Grid item xs={2} md={0.5} sx={{ textAlign: 'right' }}>
                        <Tooltip title="Delete Item">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => removeItem(section.id, item.id)}
                            sx={{ '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) } }}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Grid>

                    </Grid>
                  </Box>
                );
              })}
            </Stack>

            {/* Empty State within Section */}
            {section.items.length === 0 && (
              <Box 
                sx={{ 
                  py: 4, 
                  textAlign: 'center', 
                  borderRadius: '12px', 
                  border: '1px dashed #cbd5e1', 
                  bgcolor: '#f8fafc',
                  my: 1 
                }}
              >
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  No items listed in this section yet.
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<AddRoundedIcon />} 
                  onClick={() => addItem(section.id)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Add First Item
                </Button>
              </Box>
            )}

            {/* Add Item Trigger Button */}
            {section.items.length > 0 && (
              <Button
                startIcon={<AddRoundedIcon />}
                onClick={() => addItem(section.id)}
                sx={{
                  mt: 2.5,
                  borderRadius: '10px',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) }
                }}
              >
                Add Item
              </Button>
            )}

          </CardContent>
        </Card>
      ))}

      {/* ================= ADD NEW SECTION ACTION ================= */}
      <Button
        variant="outlined"
        startIcon={<PostAddRoundedIcon />}
        onClick={addSection}
        sx={{
          py: 1.6,
          borderRadius: '14px',
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderColor: '#cbd5e1',
          color: 'text.secondary',
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.95rem',
          bgcolor: '#ffffff',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.04)
          }
        }}
      >
        + Add New Section (e.g. Labor, Materials, Milestone 2)
      </Button>

    </Stack>
  );
}

export default InvoiceItems;