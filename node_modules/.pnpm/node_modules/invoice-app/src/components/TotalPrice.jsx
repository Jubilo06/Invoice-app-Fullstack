/**
 * Calculates all totals for an invoice.
 * @param {object} data - The invoice data object.
 * @returns {object} An object containing all calculated values.
 */
export const calculateTotals = (data) => {
  // Use fallbacks to prevent errors if data is incomplete
  const sections = data?.sections || [];
  
  // 1. Calculate the Subtotal from all items
  const subTotal = sections.reduce((total, section) => 
    total + (section?.items?.reduce((sectionTotal, item) => 
      sectionTotal + (parseFloat(item.total_price) || 0), 0) || 0), 
    0);

  // 2. Calculate the actual Tax amount
  let taxAmount = 0;
  if (data.taxEnabled) {
    const taxVal = parseFloat(data.taxValue) || 0;
    taxAmount = data.taxType === 'percentage' ? subTotal * (taxVal / 100) : taxVal;
  }
  
  // 3. Calculate the actual Discount amount
  let discountAmount = 0;
  if (data.discountEnabled) {
    const discountVal = parseFloat(data.discountValue) || 0;
    discountAmount = data.discountType === 'percentage' ? subTotal * (discountVal / 100) : discountVal;
  }
  
  // 4. Get the Shipping amount
  const shippingAmount = data.shippingEnabled ? (parseFloat(data.shippingValue) || 0) : 0;

  // 5. Calculate the final Grand Total
  // It's either the user's manual override or the sum of all parts
  const grandTotal = parseFloat(data.manualGrandTotal) || (subTotal + taxAmount - discountAmount + shippingAmount);
  
  // 6. Get the Amount Paid and calculate Balance Due
  const amountPaid = parseFloat(data.amountPaid) || 0;
  const balanceDue = grandTotal - amountPaid;

  // 7. Return all calculated values in a neat object
  return {
    subTotal,
    taxAmount,
    discountAmount,
    shippingAmount,
    grandTotal,
    amountPaid,
    balanceDue
  };
};
