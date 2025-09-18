import React, { useContext } from 'react';
import { InvoiceContext } from './InvoiceProvider'

function Currency() {
    const { currentInvoice, updateCurrentInvoiceField } = useContext(InvoiceContext);
     const CURRENCIES = [
      { symbol: '$', name: 'USD' },
      { symbol: '€', name: 'EUR' },
      { symbol: '£', name: 'GBP' },
      { symbol: '¥', name: 'JPY' },
      { symbol: '₦', name: 'NGN' },
      { symbol: '₹', name: 'INR' },
    ];
  return (
    <div style={{backgroundColor:'#060010'}}>
        <label htmlFor="currency-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
        Currency:
      </label>
      <select
        id="currency-select"
        value={currentInvoice.currency}
        onChange={(e) => updateCurrentInvoiceField('currency', e.target.value)}
        style={{ padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        {CURRENCIES.map(currency => (
          <option key={currency.name} value={currency.symbol}>
            {currency.name} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  )
}

export default Currency