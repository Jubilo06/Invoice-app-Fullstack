import React from 'react';
import Barcode from 'react-barcode';
import { Stack, TableContainer,TableBody,TableCell,TableHead,TableRow, 
  Paper,Table,IconButton, Button, Typography, Divider } from '@mui/material'

export const InvoicePreview = React.forwardRef(({ data }, ref) => {

  if (!data || !Array.isArray(data.sections)) {
    return <div ref={ref}>Preparing preview...</div>;
  }
  const calculatedGrandTotal = data.sections.reduce((total, section) => 
    total + (section?.items?.reduce((sectionTotal, item) => 
      sectionTotal + (parseFloat(item.total_price) || 0), 0) || 0), 
    0);
  const grandTotal = parseFloat(data.manualGrandTotal) || calculatedGrandTotal;
  const amountPaid = parseFloat(data.amountPaid) || 0;
  const balanceDue = grandTotal - amountPaid;


  return (
    <Stack ref={ref} width={{xs:'100%', sm:'80%'}} my={4} height='auto' overflow='scroll' 
    justifySelf='center' alignSelf='center'  color='black' bgcolor='white'>
      <Typography width="100%" textAlign='center' variant='h4'>{data.title || 'INVOICE'}</Typography>
      <Stack pl={1}>
        <Barcode value={data.invoiceNumber || 'N/A'} height={50} displayValue={false} />
      </Stack>
      
      <Stack direction='row' justifyContent='space-between'  width='100%' overflow='auto'
      divider={<Divider orientation="horizontal" flexItem />}>
        <Stack  ml={2}>
          <Typography variant='h5'><strong>{data.companyName && <>{data.companyName}</>}</strong></Typography>
          <Typography variant='body2'>{data.companyDescription && <>{data.companyDescription}</>}</Typography>
          <Typography variant='body2'>{data.companyAddress && <>{data.companyAddress}</>}</Typography>
          <Typography variant='body2'>{data.registrationNo && <>{data.registrationNo}</>}</Typography>
          <Typography variant='body2'>{data.companyEmail && <>{data.companyEmail}</>} </Typography>
          <Typography variant='body2'>{data.companyPhoneNo && <>{data.companyPhoneNo}</>}</Typography>
        </Stack>
        {data.companyLogo && <Stack mr={0} width={{xs:"120px",sm:'200px'}} height={{xs:'50px', sm:"100px"}}  sx={{backgroundImage:`url(${data.companyLogo})`, 
        backgroundPosition:"center", backgroundRepeat:"no-repeat", backgroundSize:'contain'}}  ></Stack>}
      </Stack>
      <hr style={{border:"1px solid black"}}/>
      <Stack direction='row' justifyContent='space-between'>
        <Stack direction='column' ml={2}>
          <Typography fontWeight={700}>Bill To:</Typography>
          <Typography>{data.clientName}</Typography>
          <Typography>{data.clientAddress && <>{data.clientAddress}</>} </Typography>
          <Typography>{data.clientNo && <>{data.clientNo}</>}</Typography>
        </Stack>
        <Stack direction='column' mr={1}>
          <Typography fontWeight={700}>INV - {data.invoiceNumber}</Typography>
          <Typography fontWeight={700}>{data.date && <>Invoice Date - {data.date}</>}</Typography>
          <Typography fontWeight={700}>{data.dueDate && <>Invoice Due Date - {data.dueDate}</>}</Typography>
        </Stack>
      </Stack>
      
      <Stack className="preview-main"  width={{xs:'96%'}} justifySelf='center' alignSelf='center' overflow='auto' >
        {data.sections.map(section => (
          <Stack key={section.id} className="section" >
            <Typography fontWeight={700} className="section-title">{section.title && <>{section.title}</>}</Typography>
            <Table>
              <TableHead>
                <TableRow sx={{border:"1px solid black", bgcolor:"white", height:'5px'}}>
                  <TableCell sx={{border:"1px solid black", textAlign:'start', fontWeight:"bolder"}}>Product/Service</TableCell>
                  <TableCell sx={{border:"1px solid black", textAlign:'left', fontWeight:"bolder"}} >Description</TableCell>
                  <TableCell sx={{border:"1px solid black", textAlign:'right',fontWeight:"bolder"}} >Quantity</TableCell>
                  <TableCell sx={{border:"1px solid black", textAlign:'right',fontWeight:"bolder"}}>Rate({data.currency})</TableCell>
                  <TableCell sx={{border:"1px solid black", textAlign:'right',fontWeight:"bolder"}}>Amount({data.currency})</TableCell>
                </TableRow>              
              </TableHead>              
              <TableBody>
                {section.items.map(item => (
                  <TableRow key={item.id} sx={{border:"1px solid black"}}>
                    <TableCell sx={{border:"1px solid black", textAlign:'left'}} >{item.Product_name} </TableCell>
                    <TableCell sx={{border:"1px solid black", textAlign:'left'}}>{item.description}</TableCell>
                    <TableCell sx={{border:"1px solid black", textAlign:'right'}}>{item.quantity}</TableCell>
                    <TableCell sx={{border:"1px solid black", textAlign:'right'}}>{(parseFloat(item.unit_price) || 0).toFixed(2)}</TableCell>
                    <TableCell sx={{border:"1px solid black", textAlign:'right'}}>{(parseFloat(item.total_price) || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        ))}
      </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Stack direction="column" ml={4}>
            <Typography>{data.paymentInstruction && <><strong>Payment Instruction:</strong> <br />Pay Cheque to {data.companyName}</>}</Typography>
            <Typography>{data.accountDetails && <><strong>Sent to bank: </strong><br/>{data.accountDetails}</>} </Typography>
            <Typography>{data.terms && <><strong>Terms:</strong> <br/>{data.terms}</>}</Typography>
            <Typography>{data.notes && <><strong>Note:</strong><br/>{data.notes}</>}</Typography>
          </Stack>
          <Stack direction="column">
            <Typography sx={{borderBottom:"2px solid grey"}} fontWeight="700">Subtotal:{data.currency}{grandTotal.toFixed(2)}</Typography>
            <Typography>{data.shippingValue && <><strong>Shipping:</strong> {data.shippingValue}</>}</Typography>
            <Typography>{data.taxValue && <><strong>Tax:</strong> {data.taxValue}</>}</Typography>
            <Typography>{data.discountValue && <><strong>discount:</strong> - {data.discountValue}</>}</Typography>
            <hr/>
            <Typography fontWeight="700">Total: {data.currency}{grandTotal.toFixed(2)}</Typography>
            <Typography >Amount Paid:{data.currency}{amountPaid.toFixed(2)}</Typography>
            <Typography sx={{borderBottom:"2px solid grey"}} fontWeight="700">Balance Due: {data.currency}{balanceDue.toFixed(2)}</Typography>
          </Stack>
        </Stack>
        <Stack justifyContent='flex-end' justifySelf={{xs:'center'}} alignSelf={{xs:'center'}} direction='row' mr={1} >
          
          {data.signature && (
            <Stack  className="signature-area" justifyContent='center' alignItems='center'
            direction='column' spacing={2} >
              <Stack justifySelf='center' alignItems='center' >
                <img src={data.signature} style={{borderBottom:'1px solid black', width:'150px'}} />
                {/* <Typography sx={{paddingTop:'0px'}}>______________________________</Typography> */}
                
              </Stack>
              <Typography fontWeight={700} textAlign='center' ><strong>{data.firstName} {data.lastName}</strong></Typography>
              <Typography fontWeight={700} textAlign='center'><strong>{data.userTitle || 'Authorized Signature'}</strong></Typography>
            </Stack>
        )}

        </Stack>
            </Stack>
  );
});
