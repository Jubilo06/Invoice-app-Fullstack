import React from 'react'
import { useContext, useState, useEffect, useRef } from 'react';
import { Stack, Typography, Button, TextField } from '@mui/material';
import { AuthContext } from './AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { InvoiceContext } from './InvoiceProvider';
import SignatureCanvas from 'react-signature-canvas';
import LogoUploader from './LogoUpLoader';
import InvoiceItems from './InvoiceItems';
import Summary from './Summary';
import InvoiceOptions from './InvoiceOptions';
import { InvoicePreview }  from './InvoicePreview';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePdf from './InvoicePdf';
import BarcodeGenerator from './BarcodeGenerator';
function InvoiceEditorPage() {
  const { user } = useContext(AuthContext);
  const { invoiceData, updateField,
    currentInvoice, createNewInvoice, updateInvoice, startNewInvoice,setCurrentInvoice, updateCurrentInvoiceField,
    saveInvoiceToLocal,editInvoice, downloadPdf
  } = useContext(InvoiceContext);
  const navigate=useNavigate()
   const { invoiceId } = useParams();
   const [isPreviewing, setIsPreviewing] = useState(false);
  const [guestCompanyProfile, setGuestCompanyProfile] = useState({
    companyName: '', companyAddress: '',
        companyLogo:null,
        companyDescription:'',
        companyEmail:'',
        companyPhoneNo:'',
        extraDetails:'',
        registrationNo:'',
        title:'',
  });
   useEffect(() => {
    if (invoiceId) {
      console.log("Editor is in EDIT mode for invoice ID:", invoiceId); 
    } else {
      console.log("Editor is in NEW mode.");
      startNewInvoice();
    }
  }, [invoiceId, startNewInvoice]);
    
  
  const sigPadRef = useRef(null);
  const clearSignature = () => sigPadRef.current.clear();
 const saveSignature = () => {
    if (sigPadRef.current) {
      const signatureImage = sigPadRef.current.toDataURL();
      updateCurrentInvoiceField('signature', signatureImage);
      alert('Signature Saved to this Invoice');
    }
  };
    const handleSave = async () => {
      if (currentInvoice._id) {
        await updateInvoice(currentInvoice._id, currentInvoice);
      } else {
        await createNewInvoice(currentInvoice);
      }
    };
    const handleGuestProfileChange = (e) => {
    setGuestCompanyProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
   const componentToPrintRef = useRef(null);
  const handleSaveAsPdf = () => {
    const input = componentToPrintRef.current;
    if (!input) return;
  html2canvas(input,{
    scale: 2, 
    width: input.scrollWidth,
    height: input.scrollHeight,
    useCORS: true 
  })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${currentInvoice?.invoiceNumber || 'new'}.pdf`);
      });
  };
  const handleDownload = () => {
    downloadPdf(previewData);
  };


  const handleLogoChange = (newLogoDataUrl) => {
    setCurrentInvoice(prev => ({
      ...prev,
      companyLogo: newLogoDataUrl
    }));
  };
  const safeCurrentInvoice = currentInvoice || {};
  const previewData = {
    ...safeCurrentInvoice,
    ...(user && { 
        firstName:user.firstName,
        lastName:user.lastName,
        companyName: user.companyName, 
        companyAddress: user.companyAddress,
        companyLogo: user.companyLogo,
        companyEmail:  user.companyEmail,
        companyPhoneNo: user.companyPhoneNo ,
        extraDetails:user.extraDetails,   
        signature:user.signature, 
        registrationNo:user.registrationNo,
        companyDescription:user.companyDescription,
     }),
  };
    if (!currentInvoice) {
    return <div>Loading editor...</div>;
  }

  return (
    <Stack direction='column' height='auto' width="100%" bgcolor='#060010' spacing={2} justifyContent='center' alignItems='center' color='ivory' >
      <Stack direction="column" width="100%" bgcolor='#060010'  spacing={2} justifySelf={{xs:"center"}} alignItems={{xs:"center"}}>
        <Stack justifySelf="center" alignSelf='center' width='90%' spacing={2} pt={2}>
          <Typography textAlign='center'>{currentInvoice._id ? 'Edit Invoice' : 'Create New Invoice'}</Typography>
          <Typography textAlign='center'>Company Details</Typography>
                    {user ? (
            <Stack textAlign='center'>
              <Typography textAlign='center'>{user.companyName}</Typography>
              <Typography textAlign='center'>{user.companyAddress}</Typography>
              <Typography textAlign='center'>{user.companyEmail}</Typography>
              <a style={{textAlign:"center", backgroundColor:'gold', 
                textDecorationColor:"black", textDecorationLine:'none', width:'200px', height:'50px', 
                borderRadius:'10px 10px', lineHeight:'50px', alignSelf:'center', justifySelf:'center', fontWeight:'bolder'}} 
                href="/profile">Edit company profile</a>
            </Stack>
          ) : (
          <fieldset style={{justifyContent:"center", alignItems:"center"}}>
            <legend>Your Company Details (for this invoice only)</legend>
            <LogoUploader
                currentLogo={currentInvoice.companyLogo || null}
                onLogoChange={handleLogoChange}
            />
            <TextField
            label="Company's Name"
              name="companyName"
              value={currentInvoice.companyName || ""}
              onChange={(e) => updateCurrentInvoiceField('companyName', e.target.value)}
              sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: '#36454F'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'gold',},
                    '& .MuiOutlinedInput-input': {color: 'blue', },
                  },
              }}
            />
            <TextField
                label="Company's address" 
                name="companyAddress"
                type='text'
                value={currentInvoice.companyAddress || ""}
                onChange={(e) => updateCurrentInvoiceField('companyAddress', e.target.value)}
                sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'purple'},'& .MuiInputLabel-root.Mui-focused': { color: 'darkorchid',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'purple',},
                    '& .MuiOutlinedInput-input': {color: 'blue', },
                  },
                }}
            />
            <TextField
                label="Description of company's Services"
                name="companyDescription"
                type='text'
                value={currentInvoice.companyDescription || ""}
                onChange={(e) => updateCurrentInvoiceField('companyDescription', e.target.value)}
                sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'purple'},'& .MuiInputLabel-root.Mui-focused': { color: 'darkorchid',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'purple',},
                    '& .MuiOutlinedInput-input': {color: 'blue', },
                  },
                }}
            />
            <TextField
              label="Company's E-mail address"
              name="companyEmail"
              value={currentInvoice.companyEmail || ""}
              onChange={(e) => updateCurrentInvoiceField('companyEmail', e.target.value)}
              sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'purple'},'& .MuiInputLabel-root.Mui-focused': { color: 'darkorchid',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'purple',},
                    '& .MuiOutlinedInput-input': {color: 'blue', },
                  },
              }}
            />
            <TextField
              label="Company's Phone number"
              name="companyPhoneNo"
              value={currentInvoice.companyPhoneNo || ""}
              onChange={(e) => updateCurrentInvoiceField('companyPhoneNo', e.target.value)}
              sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'purple'},'& .MuiInputLabel-root.Mui-focused': { color: 'darkorchid',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'purple',},
                    '& .MuiOutlinedInput-input': {color: 'blue', },
                  },
              }}
            />
            <TextField
              label="Company's Registration Number"
              name="registrationNo"
              value={currentInvoice.registrationNo || ""}
              onChange={(e) => updateCurrentInvoiceField('registrationNo', e.target.value)}
              sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'purple'},'& .MuiInputLabel-root.Mui-focused': { color: 'darkorchid',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'white',},'& fieldset': {borderColor: 'grey'},
                  '&:hover fieldset': {borderColor: 'darkgrey',}, '&.Mui-focused fieldset': {borderColor: 'purple',},
                    '& .MuiOutlinedInput-input': {color: 'blue', },
                  },
                }}
            />
          </fieldset>
        )}

          <Stack direction="column" py={4} justifySelf="center" alignSelf='center'
          borderRadius={1} width={{xs:'80%', sm:'60%'}} justifyContent='center' alignItems='center'
          spacing={4} border='1px solid white'>
              <TextField
              label='e.g Invoice, Quotation, BEME ...'  
                type="text" 
            
                value={currentInvoice.title || ''} 
                onChange={(e) => updateCurrentInvoiceField('title', e.target.value)}
                sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                  '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                    '& .MuiOutlinedInput-input': {color: 'white', },
                  },
                }}
              />
              <Typography textAlign='center' variant={{xs:'h6', sm:'h4'}}>Client Details</Typography>
              <TextField label="Client's Name "
                  name="clientName"
                  type='text'
                  value={currentInvoice.clientName || ''}
                  onChange={(e) => updateCurrentInvoiceField('clientName', e.target.value)} 
                  sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                  '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                    '& .MuiOutlinedInput-input': {color: 'white', },
                  },
                }}
              />
              <TextField label="Client's Address "
                  name="clientAddress"
                  type='text'
                  value={currentInvoice.clientAddress || ''}
                  onChange={(e) => updateCurrentInvoiceField('clientAddress', e.target.value)} 
                  sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                  '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                    '& .MuiOutlinedInput-input': {color: 'white', },
                  },
                }}
              />
              <TextField label="Client's Phone Number "
                  name="clientNo"
                  type='text'
                  value={currentInvoice.clientNo || ''}
                  onChange={(e) => updateCurrentInvoiceField('clientNo', e.target.value)} 
                  sx={{ width:'80%',
                    '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                    '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                    '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                      '& .MuiOutlinedInput-input': {color: 'white', },
                    },
                  }}
              /> 
              <Typography textAlign='center' variant={{xs:'h6', sm:'h4'}} >Invoice/Quotation/BEME Details</Typography>
              <Stack width="100%">
                <Typography ml={9}>Date:</Typography>
                <TextField
                type="date"
                InputLabelProps={{shrink: true,}}
                value={currentInvoice.date || ''}
                onChange={(e) => updateCurrentInvoiceField('date', e.target.value)}
                sx={{ width:'80%',justifySelf:'center', alignSelf:'center',
                  '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                  '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                    '& .MuiOutlinedInput-input': {color: 'white', },
                  },'& .MuiInputBase-input::-webkit-calendar-picker-indicator': {
                    filter: 'invert(16%) sepia(91%) saturate(5428%) hue-rotate(247deg) brightness(81%) contrast(101%)',
                    cursor: 'pointer',
                    opacity: 0.8,
                    '&:hover': {
                      opacity: 1,
                    },
                  },
                }}
              />
              </Stack>

              <Stack width='100%'>
                <Typography ml={9}>Payment due date:</Typography>
                <TextField 
                  name="dueDate"
                  type='date'
                  InputLabelProps={{shrink: true,}}
                  value={currentInvoice.dueDate || ''}
                  onChange={(e) => updateCurrentInvoiceField('dueDate', e.target.value)} 
                  sx={{ width:'80%',justifySelf:'center', alignSelf:'center',
                    '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                    '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                    '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                      '& .MuiOutlinedInput-input': {color: 'white', },
                    },'& .MuiInputBase-input::-webkit-calendar-picker-indicator': {
                    filter: 'invert(16%) sepia(91%) saturate(5428%) hue-rotate(247deg) brightness(81%) contrast(101%)',
                    cursor: 'pointer',
                    opacity: 1,
                    '&:hover': {
                      opacity: 1,
                    },
                  },
                  }}
                />
              </Stack>
              <TextField
                  label='Terms and condition'
                  multiline
                  name="terms"
                  type='text'
                  value={currentInvoice.terms || ''}
                  onChange={(e) => updateCurrentInvoiceField('terms', e.target.value)} 
                  sx={{ width:'80%',
                    '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                    '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                    '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                      '& .MuiOutlinedInput-input': {color: 'white', },
                    },
                  }}
              />
              <TextField
                label="Payment Instructions"
                name='paymentInstruction'
                multiline
                value={currentInvoice.paymentInstruction || ''}
                onChange={(e) => updateCurrentInvoiceField('paymentInstruction', e.target.value)}
                sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                  '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                    '& .MuiOutlinedInput-input': {color: 'white', },
                  },
                }}
              />
              <TextField label='Account Details'
                  name="accountDetails"
                  type='text'
                  value={currentInvoice.accountDetails || ''}
                  onChange={(e) => updateCurrentInvoiceField('accountDetails', e.target.value)} 
                  sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                  '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                    '& .MuiOutlinedInput-input': {color: 'white' },
                  },
                }}
              />
              <TextField
                label="notes..."
                multiline
                value={currentInvoice.notes || ''}
                onChange={(e) => updateCurrentInvoiceField('notes', e.target.value)}
                sx={{ width:'80%',
                  '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                  '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                  '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                    '& .MuiOutlinedInput-input': {color: 'white', },
                  },
                }}
              />
              <TextField label='Your Title' name="userTitle" value={currentInvoice.userTitle || ''} 
                    onChange={(e) => updateCurrentInvoiceField('userTitle', e.target.value)} 
                    sx={{ width:'80%',
                      '& .MuiInputLabel-root': { color: 'white'},'& .MuiInputLabel-root.Mui-focused': { color: '#36454F',},
                      '& .MuiOutlinedInput-root': {'&': { backgroundColor: 'transparent',},'& fieldset': {borderColor: 'gold'},
                      '&:hover fieldset': {borderColor: 'white',}, '&.Mui-focused fieldset': {borderColor: 'white',},
                        '& .MuiOutlinedInput-input': {color: 'white', },
                      },
                    }}
              />  
                {!user&&
                  <fieldset style={{width:"80%"}}>
                    <Stack direction='column' spacing={2}>
                      <legend>Signature</legend>
                        <Stack direction='column' spacing={2}>
                          <SignatureCanvas ref={sigPadRef} 
                            canvasProps={{ style: { border: "2px solid white", width: '100%', height: '200px', backgroundColor:'white' } }} />
                          <Stack direction='row' spacing={2} justifyContent='center' alignItems='center'>
                            <Button onClick={clearSignature}>Clear</Button>
                            <Button onClick={saveSignature}>Save Signature</Button>
                          </Stack>
                        </Stack>
                    </Stack>
                  </fieldset>
                }
                
            </Stack>
        </Stack>
      </Stack>
      <Stack width={{xs:'80%', sm:'55%'}} bgcolor='#060010' justifyContent='center' alignItems='center' >                
        <InvoiceItems />
        <InvoiceOptions />
        <Summary />
        <Stack direction='row' spacing={2} my={2} justifyContent='center' alignItems='center'>
          <Button sx={{ borderRadius:'8px 8px', backgroundColor:'gold',color:'black'}} onClick={handleSave}>{currentInvoice._id ? 'Save Changes' : 'Create Invoice'}</Button>
        </Stack>
      </Stack>
      <div className="editor-panel">
        <button onClick={() => setIsPreviewing(!isPreviewing)}>
          {isPreviewing ? 'Close Preview' : 'Show PDF Preview'}
        </button>
        
        <PDFDownloadLink
          document={<InvoicePdf data={previewData} />}
          fileName={`Invoice-${previewData.invoiceNumber}.pdf`}
        >
          {({ blob, url, loading, error }) => 
            loading ? 'Preparing PDF...' : 'Download PDF'
          }
        </PDFDownloadLink>
      </div>
    
    {/* The live preview panel */}
      <div className="preview-panel">
        {isPreviewing && (
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <InvoicePdf data={previewData} />
          </PDFViewer>
        )}
      </div>
    </Stack>
  )
}

export default InvoiceEditorPage