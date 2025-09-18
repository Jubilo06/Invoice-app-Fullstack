import React, { useContext, useState } from 'react';
import { InvoiceContext } from './InvoiceProvider'
import { Stack, TableContainer,TableBody,TableCell,TableHead,TableRow, 
  Paper,Table,IconButton, Button, Typography, TextField} from '@mui/material'
import Currency from './Currency';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function InvoiceItems() {
  const { invoiceData, addSection, updateSectionTitle, removeSection, currentInvoice,
    addItem, updateItem, removeItem, updateCurrentInvoiceField } =useContext(InvoiceContext);
  if (!currentInvoice || !Array.isArray(currentInvoice.sections)) {
    return <div>Loading items...</div>;
  }
  return (
      <Stack direction='column' spacing={3} 
          borderRadius={1} width={{xs:'100%', sm:'100%'}} bgcolor='#060010' >
        <Stack width='100%'>
          <Typography>Choose your currency:</Typography>
          <Currency />
        </Stack>
        
        
        {currentInvoice.sections.map((section, sectionIndex) => (
          <Stack key={section.id} spacing={2}  width='100%'
            sx={{border: '1px solid #ddd', borderRadius: 1 }}>
            
            {/* Section Header */}
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
              <Stack width='100%' spacing={1} sx={{ border: '1px solid #ddd'}} justifyContent="center" alignItems="center">
                <Typography><strong>Section:</strong></Typography>
                <TextField
                  variant="outlined"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                  label={`Section ${sectionIndex + 1} Title (optional)`}
                  sx={{ width:'80%', paddingBottom:'5px',
                    '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F', fontSize:'20px'},
                    '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                    '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                      '& .MuiOutlinedInput-input': {color: 'white', },
                    },
                  }}
                />
              </Stack>
              <Button style={{backgroundColor:'gold', color:'black'}} onClick={() => removeSection(section.id)} >Remove Section</Button>
            </Stack>
  
            {/* --- Loop for each ITEM in the section --- */}
            {section.items.map(item => {
              const canCalculate = (parseFloat(item.quantity) || 0) > 0 && (parseFloat(item.Unit_price) || 0) > 0;
              
              // ✅ ALL JSX for one item is now inside this single return statement
              return (
                <Stack key={item.id} spacing={2} justifyContent="center" alignItems="center" sx={{borderTop: '1px solid #eee' }}>
                  <Stack direction="row" spacing={2} pt={2} justifyContent="center" alignItems="center" width='100%'>
                    <TextField label="Product/Service" type="text" value={item.Product_name || ''} 
                      onChange={(e) => updateItem(section.id, item.id, 'Product_name', e.target.value)} 
                      sx={{ width:'80%',
                        '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                        '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                        '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                          '& .MuiOutlinedInput-input': {color: 'white', },
                        },
                      }}
                    />
                  </Stack>
                  
                  <TextField label="Description" type="text" value={item.description || ''} 
                    onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)} 
                    sx={{ width:'80%',
                        '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                        '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                        '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                          '& .MuiOutlinedInput-input': {color: 'white', },
                        },
                      }}
                    />
                    
                  <Stack direction="column" spacing={2} width="100%" justifyContent="center" alignItems="center">
                    <TextField label="Quantity" type="number" value={item.quantity || ''} 
                      onChange={(e) => updateItem(section.id, item.id, 'quantity', e.target.value)} 
                      sx={{ width:'80%',
                        '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                        '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                        '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                          '& .MuiOutlinedInput-input': {color: 'white', },
                        },
                      }}
                   />
                    
                    <TextField label={`Rate (${currentInvoice.currency})`} type="number" value={item.unit_price || ''} 
                      onChange={(e) => updateItem(section.id, item.id, 'unit_price', e.target.value)}  
                      sx={{ width:'80%',
                        '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                        '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                        '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                          '& .MuiOutlinedInput-input': {color: 'white', },
                        },
                      }}
                    />
                    
                    {/* The conditional Amount field */}
                    {canCalculate ? (
                      <TextField label="Amount" type="number" value={(item.quantity * item.unit_price).toFixed(2)}
                        disabled 
                        sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000' },
                             '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                             '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                              '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                            '& .MuiOutlinedInput-input': {color: 'white', },
                        },
                      }} />
                    ) : (
                      <TextField label="Amount" type="number" placeholder="Total" value={item.total_price || ''}
                        onChange={(e) => updateItem(section.id, item.id, 'total_price', e.target.value)}  
                        sx={{ width:'80%', 
                             '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                             '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                              '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                            '& .MuiOutlinedInput-input': {color: 'white', },
                        },
                      }}
                      />
                    )}
                  </Stack>
                 <Stack>
                    <Button style={{backgroundColor:'gold', color:'black', width:"80%", justifySelf:'center', alignSelf:'center'}} 
                      onClick={() => removeItem(section.id, item.id)}>
                          Remove Item from Section
                    </Button>
                 </Stack>
                </Stack>
              );
            })}
            <Stack direction='row' spacing={4} pb={2} width='100%' justifyContent="center" alignItems="center">
              <Button style={{backgroundColor:'gold',color:'black'}} onClick={() => addItem(section.id)} startIcon={<AddIcon />}>
                Add Item to Section
              </Button>
            </Stack>          
            
          </Stack>
        ))}
  
       <Button onClick={addSection} variant="contained" sx={{ mt: 2 }}>
         + Add New Section
       </Button>
      </Stack>
    );
}
export default InvoiceItems;