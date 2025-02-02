import React from 'react';
import { useBarcode } from 'next-barcode';

interface BarcodeProps {
  value: string;
}

const Barcode = ({ value }: BarcodeProps) => {
  const { inputRef } = useBarcode({
    value: value || 'default-barcode',
    options: {
      background: 'RGBA(255, 255, 255, 0)',
    },
  });

  return <svg ref={inputRef} />;
};

export default Barcode;
