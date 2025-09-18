import { createContext } from "react";
import { useState, useRef, useMemo, useCallback } from "react"; 
import { nanoid } from 'nanoid';
import api from "./Api";

import React from 'react'
export const InvoiceContext = createContext();
export function InvoiceProvider({children}) {
  
  
   const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', password: '' });
   const [loading,setLoading]=useState(false)
   const [invoiceList, setInvoiceList] = useState([]);
    

    const initialData = {
        userTitle:"",
        companyName: '',
        companyLogo: null,
        companyDescription: '',
        companyEmail:"",
        companyPhoneNo:"",
        companyAddress:"",
        extraDetails:"",
        registrationNo:"",
        title:"",
        date:"",
        signature:null,
        currency:"₦",
        clientName: '',
        clientAddress:"",
        clientNo:"",
        dueDate:"",
        terms:"",
        accountDetails:"",
        paymentInstruction:"",
        amountPaid:"0.00",
        sections: [
          {
            id: nanoid(),
            purpose:"Invoice or Quotation",
            title: '',
            items: [
              { id: nanoid(), Product_name: '', description: '', 
                quantity: 0, unit_price: 0, total_price:0  },
            ]
          }
        ],
        manualGrandTotal: '', 
        notes: '', 
        taxEnabled: false,
  discountEnabled: false,
  shippingEnabled: false,
  taxType: 'percentage', // 'percentage' or 'fixed'
  taxValue: null,
  discountType: 'percentage', // 'percentage' or 'fixed'
  discountValue: null,
  shippingValue: null,

      };
    


  const [currentInvoice, setCurrentInvoice] = useState(initialData);
   const updateCurrentInvoiceField = useCallback((field, value) => {
    setCurrentInvoice(prevState => ({
      ...prevState, // Preserves all old properties
      [field]: value  // Overwrites the specific field that changed
    }));
  }, []); 
  const startNewInvoice = useCallback(() => {
    setCurrentInvoice(initialData);
  }, []); // <-- Empty dependency array

  const editInvoice = useCallback((invoiceToEdit) => {
    setCurrentInvoice(invoiceToEdit);
  }, []); // <-- Empty dependency array

  const updateItem = useCallback((sectionId, itemId, field, value) => {
    setCurrentInvoice(prevState => {
      const newSections = prevState.sections.map(section => {
      if (section.id === sectionId) {
        
        const updatedItems = section.items.map(item => {
          if (item.id === itemId) {
            const updatedItem = { ...item, [field]: value };
            if (field === 'quantity' || field === 'unit_price') {
              const quantity = parseFloat(updatedItem.quantity) || 0;
              const unit_price = parseFloat(updatedItem.unit_price) || 0;
              updatedItem.total_price = quantity * unit_price;
            }
            return updatedItem;
          }
          return item; // Return other items unchanged
        });
        return { ...section, items: updatedItems };
      }
      return section; // Return other sections unchanged
    });
    return { ...prevState, sections: newSections };
    });
  }, []);
const createNewInvoice = useCallback(async (invoiceData) => {
  try {
      const response = await api.post('/invoices', invoiceData);
      setInvoiceList(prevList => [response.data, ...prevList]);
      setCurrentInvoice(response.data); // Also update the editor
      alert('Invoice saved to your account!');
    }catch (error) {
      console.error("API Save Error:", error);
      alert('Failed to save invoice to server.');
      throw error; // Re-throw so the component knows it failed
    }
 });
 
  const generateGuestInvoiceNumber = () => {
    const min = 1;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString().padStart(4, "0");
  };

  const saveInvoiceToLocal = (finalInvoiceData) => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('guest_invoices')) || {};
      const newInvoiceNumber = `INV-${generateGuestInvoiceNumber()}`; // Give guests a unique-ish ID
      const dataToSave = { ...finalInvoiceData, invoiceNumber: newInvoiceNumber };
      savedInvoices[newInvoiceNumber] = dataToSave;
      localStorage.setItem('guest_invoices', JSON.stringify(savedInvoices));
      setCurrentInvoice(dataToSave); 
      alert(`Invoice saved locally as ${newInvoiceNumber}. Sign up to save permanently!`);
    } catch (error) {
      console.error("Local Save Error:", error);
      alert('Failed to save invoice locally.');
      throw error;
    }
  };
   const loadUserInvoices = useCallback(async () => { 
      setLoading(true);
    try {
      const response = await api.get('/invoices');
      setInvoiceList(response.data); // Update the list state
    } catch (error) {
      console.error("Failed to load invoices:", error);
      setInvoiceList([]); // Clear list on error
    } finally {
      setLoading(false);
    }

    });
  const updateInvoice = useCallback(async (invoiceId, updatedData) => { 
    console.log("Data being sent to backend for UPDATE:", updatedData);
    try {
      const response = await api.put(`/invoices/${invoiceId}`, updatedData);
      setInvoiceList(prevList => 
        prevList.map(inv => (inv._id === invoiceId ? response.data : inv))
      );
      alert('Invoice updated successfully!');
    } catch (error) {
      console.error("Failed to update invoice:", error);
      alert('Error: Could not update invoice.');
      throw error;
    }
  });
  const deleteInvoice = useCallback(async (invoiceId) => { 
    try {
      await api.delete(`/invoices/${invoiceId}`);
      setInvoiceList(prevList => prevList.filter(inv => inv._id !== invoiceId));
      alert('Invoice deleted successfully!');
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert('Error: Could not delete invoice.');
      throw error;
    }
   });
  const clearSignature = () => {
    sigPadRef.current.clear();
  };
  const saveInvoice = async () => {
    const response = await api.post('/invoices', currentInvoice); 
    setCurrentInvoice(response.data); 
  
    alert('Invoice saved to your account!');
  };
const updateSectionTitle = useCallback((sectionId, title) => {
    setCurrentInvoice(prevState => ({
      ...prevState,
      sections: prevState.sections.map(sec => 
        sec.id === sectionId ? { ...sec, title: title } : sec
      )
    }));
  }, []);

  const removeSection = useCallback((sectionId) => {
    setCurrentInvoice(prevState => ({
      ...prevState,
      sections: prevState.sections.filter(sec => sec.id !== sectionId)
    }));
  }, []);


  const saveSignature = () => {
    const signatureImage = sigPadRef.current.toDataURL();
    updateCurrentInvoiceField('signature', signatureImage);
    alert('Signature saved!');
  };
  const addItem = useCallback((sectionId) => {
    setCurrentInvoice(prevState => ({
      ...prevState,
      sections: prevState.sections.map(section => {
        if (section.id === sectionId) {
          const newItem = { id: nanoid(), Product_name: '', description: '', quantity: 1, unit_price: 0, total_price: 0 };
          return { ...section, items: [...section.items, newItem] };
        }
        return section;
      })
    }));
  }, []);

const addSection = useCallback(() => {
    setCurrentInvoice(prevState => ({
      ...prevState,
      sections: [...prevState.sections, { id: nanoid(), title: 'New Section', items: [] }]
    }));
  }, []);

  
  
  const removeItem = useCallback((sectionId, itemId) => {
    setCurrentInvoice(prevState => ({
      ...prevState,
      sections: prevState.sections.map(section => {
        if (section.id === sectionId) {
          return { ...section, items: section.items.filter(item => item.id !== itemId) };
        }
        return section;
      })
    }));
  }, []);
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const logoDataUrl = reader.result;
      updateCurrentInvoiceField('companyLogo', logoDataUrl);
    };
    reader.readAsDataURL(file);
};
const downloadPdf = async (invoiceData) => {
  try {
    const response = await api.post('/invoices/generate-pdf', invoiceData, {
      responseType: 'blob' // IMPORTANT: Tell axios to expect a file Blob
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `invoice-${invoiceData.invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove(); // Clean up

  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Could not generate PDF.");
  }
};


    const value = {
        updateCurrentInvoiceField,
        updateItem,
        addItem,
        removeItem,
        addSection,
        updateSectionTitle,
        removeSection,
        handleLogoUpload,
        loading, setLoading, formData, setFormData,
        
        clearSignature,
        saveSignature,
    currentInvoice,
    setCurrentInvoice,
    invoiceList,
    loadUserInvoices,
    updateInvoice,
    deleteInvoice,
    createNewInvoice,
    startNewInvoice,
    editInvoice,
 
    saveInvoiceToLocal,
    downloadPdf
    };
    

  return (
  
    <InvoiceContext.Provider value={value}>
        {children}
    </InvoiceContext.Provider>
  )
}

