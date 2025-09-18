import React from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import { useContext, useState } from 'react'
import { InvoiceContext } from './InvoiceProvider'
import styles from './Invoice.module.css'
import {Stack, Typography, Button} from '@mui/material'
import { nanoid } from 'nanoid';
import InvoiceTable from './InvoiceTable'
import Summary from './Summary'


function Main() {
    const {invoiceData,updateField, addItem, removeItem, updateItem,handleLogoUpload,
          addSection,updateSectionTitle,removeSection,calculatedGrandTotal,newerItem, setNewerItem, handleAddItem, handleInputChanges 
        } = useContext(InvoiceContext);
         
  return (
    <Stack>
        {invoiceData.sections.map((section, index) => (
        <div key={section.id} className="section-container" style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px' }}>
          
          <input 
            type="text"
            value={section.title}
            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            placeholder={`Section ${index + 1} Title`}
            style={{ fontSize: '1.5em', border: 'none', marginBottom: '10px' }}
          />
          <ItemForm sectionId={section.id} />
          <InvoiceTable section={section} />

          

        </div>
      ))}
      <button onClick={addSection}>+ Add New Section</button>
      
    </Stack>
  )
}

export default Main