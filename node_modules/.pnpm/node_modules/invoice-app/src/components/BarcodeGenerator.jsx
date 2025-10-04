import React, { useEffect, useRef } from 'react';
import Barcode from 'react-barcode';

function BarcodeGenerator({ value, onBarcodeGenerated }) {
  // This ref will now point to the container div
  const barcodeContainerRef = useRef(null);

  useEffect(() => {
    // Wait until the barcode has had a chance to render
    const timeoutId = setTimeout(() => {
      if (barcodeContainerRef.current) {
        // 1. Find the <svg> element that `react-barcode` rendered inside our container.
        const svgElement = barcodeContainerRef.current.querySelector('svg');

        if (svgElement) {
          // 2. Create an XMLSerializer to convert the SVG element to a string.
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgElement);

          // 3. Create a new, temporary <canvas> in memory.
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // We need an Image object to draw the SVG onto the canvas.
          const img = new Image();
          
          // 4. Create a "blob" from the SVG string and create a URL for it.
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-t' });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            // 5. When the image has loaded, set the canvas dimensions and draw it.
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // 6. NOW, get the Data URL from our own canvas.
            const barcodeDataUrl = canvas.toDataURL('image/png');
            
            // 7. Send the data back to the parent and clean up the URL object.
            onBarcodeGenerated(barcodeDataUrl);
            URL.revokeObjectURL(url);
          };

          // 8. Set the image source to start the loading process.
          img.src = url;
        }
      }
    }, 100); // A small delay to ensure the SVG has rendered

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
    
  }, [value, onBarcodeGenerated]); // Rerun when the invoice number changes

  // We render the barcode as an SVG inside a div that we can reference.
  return (
    <div ref={barcodeContainerRef} style={{ display: 'none' }}>
      <Barcode value={value || 'N/A'} renderer="svg" />
    </div>
  );
}

export default BarcodeGenerator;