import React, { useEffect, useRef } from 'react';
import Barcode from 'react-barcode';

function BarcodeGenerator({ value, onBarcodeGenerated }) {
  const barcodeContainerRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (barcodeContainerRef.current) {
        const svgElement = barcodeContainerRef.current.querySelector('svg');
        if (svgElement) {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgElement);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-t' });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const barcodeDataUrl = canvas.toDataURL('image/png');
            onBarcodeGenerated(barcodeDataUrl);
            URL.revokeObjectURL(url);
          };

          // 8. Set the image source to start the loading process.
          img.src = url;
        }
      }
    }, 100); // A small delay to ensure the SVG has rendered
    return () => clearTimeout(timeoutId);
    
  }, [value, onBarcodeGenerated]); // Rerun when the invoice number changes
  return (
    <div ref={barcodeContainerRef} style={{ display: 'none' }}>
      <Barcode value={value || 'N/A'} renderer="svg" />
    </div>
  );
}

export default BarcodeGenerator;