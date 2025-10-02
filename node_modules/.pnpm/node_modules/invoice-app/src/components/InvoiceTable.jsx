import { Stack, TableContainer,TableBody,TableCell,TableHead,TableRow, Paper,Table,IconButton, Button, Typography } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { InvoiceContext } from './InvoiceProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './InvoiceTable.module.css'


function InvoiceTable({section}) {
  const { invoiceData, updateItem,updateField, addItem, removeItem,sigPadRef,clearSignature,
          saveSignature,addSection,updateSectionTitle,removeSection
         } = useContext(InvoiceContext); 
   if (!section.items || section.items.length === 0) {
    return <Typography sx={{ p: 2, fontStyle: 'italic', color: 'text.secondary' }}>No items in this section.</Typography>;
  }
  return (
    <Stack>
      <Typography>{invoiceData.title}</Typography>
        <Stack key={section.id}>
          <Typography>{section.title}</Typography>
          <button onClick={() => removeSection(section.id)}>Remove Section</button>
          <Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product/Service Name</TableCell>
                    <TableCell>Product/Service Description</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price ({invoiceData.currency})</TableCell>
                    <TableCell>Total Price ({invoiceData.currency})</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.items.map(item=>(
                    <TableRow key={item.id}>
                      <TableCell>{item.Product_name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit_price}</TableCell>
                      <TableCell>{(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                      <TableCell sx={{border:"3px solid black"}}><IconButton onClick={()=>removeItem(section.id, item.id)}><DeleteIcon /></IconButton></TableCell>
                    </TableRow>  
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack>
              <button onClick={addSection}> Add New Section</button>
            </Stack>
          </Stack>
        </Stack>  
      
      {/* <TableContainer>
        <Table sx={{border:"3px solid black"}}>
            <TableHead sx={{border:"3px solid black"}}>
                <TableRow sx={{border:"3px solid black"}}>
                    <TableCell sx={{border:"3px solid black"}}>Product Name</TableCell>
                    <TableCell sx={{border:"3px solid black"}}>Description</TableCell>
                    <TableCell sx={{border:"3px solid black"}}>Quantity</TableCell>
                    <TableCell sx={{border:"3px solid black"}}>Unit Price(₦)</TableCell>
                    <TableCell sx={{border:"3px solid black"}}>Total Amount(₦)</TableCell>
                    <TableCell sx={{border:"3px solid black"}}></TableCell>
                </TableRow>
            </TableHead>
            <TableBody sx={{border:"3px solid black"}}>
                {invoiceData.items.map(item=>{
                    return(
                        <TableRow sx={{border:"3px solid black"}} key={item.id} > 
                            <TableCell sx={{border:"3px solid black"}}>{item.Product_name}</TableCell>
                            <TableCell sx={{border:"3px solid black"}}>{item.description}</TableCell>
                            <TableCell sx={{border:"3px solid black"}}>{item.quantity}</TableCell>
                            <TableCell sx={{border:"3px solid black"}}>{item.unit_price}</TableCell>
                            <TableCell sx={{border:"3px solid black"}}>{(item.total_price || 0).toFixed(2)}</TableCell>
                            <TableCell sx={{border:"3px solid black"}}><IconButton onClick={()=>removeItem(item.id)}><DeleteIcon /></IconButton></TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
      </TableContainer> */}
      
    </Stack>
  );
}

export default InvoiceTable;