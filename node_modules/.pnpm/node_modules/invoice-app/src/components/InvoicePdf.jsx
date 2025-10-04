import React from 'react';
import { Page, Document, StyleSheet, Text, View, Image, Font } from '@react-pdf/renderer';
import Barcode from 'react-barcode';
// --- 1. Font Registration ---
// The paths are relative to the `public` folder.
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/ARIAL.TTF' },
    { src: '/fonts/ARIALBD.TTF', fontWeight: 'bold' },
  ]
});

// --- 2. StyleSheet Creation (The CSS-in-JS Blueprint) ---
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#212121',
  },
  // Header Section
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Company & Logo Section
  companySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingBottom: 15,
    borderBottom: '1px solid black',
  },
  companyDetails: {
    width: '60%',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyText: {
    fontSize: 9,
    color: '#555555',
  },
  companyLogo: {
    width: 150,
    height: 75,
    objectFit: 'contain',
  },
  // Bill To & Invoice Info Section
  billToSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  billToDetails: {
    width: '50%',
  },
  invoiceInfoDetails: {
    width: '40%',
    textAlign: 'right',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 5,
  },
  // Items Table
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    color: '#ffffff',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #cccccc',
    padding: 5,
    alignItems: 'center',
  },
  tableColProduct: { width: '25%' },
  tableColDesc: { width: '30%' },
  tableColQty: { width: '10%', textAlign: 'right' },
  tableColRate: { width: '15%', textAlign: 'right' },
  tableColAmount: { width: '20%', textAlign: 'right' },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    padding: 5,
    marginTop: 15,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  footerNotes: {
    width: '60%',
    fontSize: 8,
  },
  footerSummary: {
    width: '35%',
    fontSize: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 3,
  },
  totalLine: {
    borderTop: '1px solid #aaaaaa',
    marginTop: 5,
    paddingTop: 5,
  },
  balanceDueRow: {
    borderTop: '2px solid #555555',
    marginTop: 5,
    paddingTop: 5,
  },
  balanceDueText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Signature
  signatureBlock: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureContainer: {
    width: '40%',
    textAlign: 'center',
  },
  signatureImage: {
    width: 150,
    height: 50,
    alignSelf: 'center',
  },
  signatureLine: {
    borderBottom: '1px solid black',
    width: '100%',
     marginTop: 10,
  },
  signatureName: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: 'bold',
  },
  signatureTitle: {
    fontSize: 9,
    marginTop: 10,
  },
  // This is used for page numbers, for example
  pageFooter: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 40,
    textAlign: 'right',
    color: 'grey',
  },
});

// --- 3. The Document Component ---
const InvoicePdf = ({ data }) => {
  // Use the same centralized calculation logic as your frontend
  const calculateTotals = (invoiceData) => {
    const subTotal = (invoiceData.sections || []).reduce((t, s) => t + (s.items || []).reduce((st, i) => st + (parseFloat(i.total_price) || 0), 0), 0);
    let taxAmount = 0; if (invoiceData.taxEnabled) { const taxVal = parseFloat(invoiceData.taxValue) || 0; taxAmount = invoiceData.taxType === 'percentage' ? subTotal * (taxVal / 100) : taxVal; }
    let discountAmount = 0; if (invoiceData.discountEnabled) { const discountVal = parseFloat(invoiceData.discountValue) || 0; discountAmount = invoiceData.discountType === 'percentage' ? subTotal * (discountVal / 100) : discountVal; }
    const shippingAmount = invoiceData.shippingEnabled ? (parseFloat(invoiceData.shippingValue) || 0) : 0;
    const grandTotal = parseFloat(invoiceData.manualGrandTotal) || (subTotal + taxAmount - discountAmount + shippingAmount);
    const amountPaid = parseFloat(invoiceData.amountPaid) || 0;
    const balanceDue = grandTotal - amountPaid;
    return { subTotal, taxAmount, discountAmount, shippingAmount, grandTotal, amountPaid, balanceDue };
  };

  const { subTotal, grandTotal, amountPaid, balanceDue, taxAmount, discountAmount, shippingAmount } = calculateTotals(data);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Title */}
        <Text style={styles.title}>{data.title || 'INVOICE'}</Text>
        
        {data.barcodeImage && (
          <Image src={data.barcodeImage} style={{ width: 150, height: 40, alignSelf: 'left' }} />
        )}

        {/* Company Details & Logo */}
        <View style={styles.companySection}>
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>{data.companyName || ''}</Text>
            <Text style={styles.companyText}>{data.companyDescription || ''}</Text>
            <Text style={styles.companyText}>{data.companyAddress || ''}</Text>
            <Text style={styles.companyText}>{data.registrationNo || ''}</Text>
            <Text style={styles.companyText}>{data.companyEmail || ''}</Text>
            <Text style={styles.companyText}>{data.companyPhoneNo || ''}</Text>
          </View>
          {data.companyLogo && <Image style={styles.companyLogo} src={data.companyLogo} />}
        </View>

        {/* Bill To & Invoice Details */}
        <View style={styles.billToSection}>
          <View style={styles.billToDetails}>
            <Text style={styles.sectionHeader}>Bill To:</Text>
            <Text>{data.clientName || ''}</Text>
            <Text>{data.clientAddress || ''}</Text>
            <Text>{data.clientNo || ''}</Text>
          </View>
          <View style={styles.invoiceInfoDetails}>
            <Text style={styles.sectionHeader}>INV - {data.invoiceNumber || ''}</Text>
            {data.date && <Text>Invoice Date - {data.date}</Text>}
            {data.dueDate && <Text>Invoice Due Date - {data.dueDate}</Text>}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={styles.tableColProduct}>Product/Service</Text>
            <Text style={styles.tableColDesc}>Description</Text>
            <Text style={styles.tableColQty}>Quantity</Text>
            <Text style={styles.tableColRate}>Rate({data.currency})</Text>
            <Text style={styles.tableColAmount}>Amount({data.currency})</Text>
          </View>
          
          {(data.sections || []).map(section => (
            <View key={section.id} wrap={false}>
              <Text style={styles.sectionTitle}>{section.title || ''}</Text>
              {(section.items || []).map(item => (
                <View style={styles.tableRow} key={item.id}>
                  <Text style={styles.tableColProduct}>{item.Product_name || ''}</Text>
                  <Text style={styles.tableColDesc}>{item.description || ''}</Text>
                  <Text style={styles.tableColQty}>{item.quantity || '0'}</Text>
                  <Text style={styles.tableColRate}>{(parseFloat(item.unit_price) || 0).toFixed(2)}</Text>
                  <Text style={styles.tableColAmount}>{(parseFloat(item.total_price) || 0).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        
        {/* Footer Section: Notes & Summary */}
        <View style={styles.footer} wrap={false}>
          <View style={styles.footerNotes}>
            {data.paymentInstruction && <><Text style={{ fontWeight: 'bold' }}>Payment Instruction:</Text><Text>{data.paymentInstruction}</Text></>}
            {data.accountDetails && <><Text style={{ fontWeight: 'bold', marginTop: 5 }}>Bank Details:</Text><Text>{data.accountDetails}</Text></>}
            {data.terms && <><Text style={{ fontWeight: 'bold', marginTop: 5 }}>Terms:</Text><Text>{data.terms}</Text></>}
            {data.notes && <><Text style={{ fontWeight: 'bold', marginTop: 5 }}>Note:</Text><Text>{data.notes}</Text></>}
          </View>
          <View style={styles.footerSummary}>
            <View style={styles.summaryRow}><Text>Subtotal:</Text><Text>{data.currency}{subTotal.toFixed(2)}</Text></View>
            {data.taxEnabled && <View style={styles.summaryRow}><Text>Tax:</Text><Text>{data.currency}{taxAmount.toFixed(2)}</Text></View>}
            {data.discountEnabled && <View style={styles.summaryRow}><Text>Discount:</Text><Text>-{data.currency}{discountAmount.toFixed(2)}</Text></View>}
            {data.shippingEnabled && <View style={styles.summaryRow}><Text>Shipping:</Text><Text>{data.currency}{shippingAmount.toFixed(2)}</Text></View>}
            <View style={[styles.summaryRow, styles.totalLine]}><Text style={styles.summaryLabel}>Total:</Text><Text style={styles.summaryLabel}>{data.currency}{grandTotal.toFixed(2)}</Text></View>
            <View style={styles.summaryRow}><Text>Amount Paid:</Text><Text>{data.currency}{amountPaid.toFixed(2)}</Text></View>
            <View style={[styles.summaryRow, styles.balanceDueRow]}><Text style={styles.balanceDueText}>Balance Due:</Text><Text style={styles.balanceDueText}>{data.currency}{balanceDue.toFixed(2)}</Text></View>
          </View>
        </View>

        {/* Signature */}
        {data.signature && (
          <View style={styles.signatureBlock}>
            <View style={styles.signatureContainer}>
              <Image src={data.signature} style={styles.signatureImage} />
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{`${data.firstName || ''} ${data.lastName || ''}`}</Text>
              <Text style={styles.signatureTitle}>{data.userTitle || 'Authorized Signature'}</Text>
            </View>
          </View>
        )}

        {/* Page Numbers */}
        <Text style={styles.pageFooter} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
export default InvoicePdf;