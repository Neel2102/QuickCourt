import React, { useState } from 'react';
import Button from '../common/Button.jsx';

const PaymentSimulator = ({ amount = 0, onResult }) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = async (success) => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    setProcessing(false);
    onResult && onResult({ success, amount });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600">Amount</p>
        <p className="text-xl font-semibold">${amount.toFixed(2)}</p>
      </div>
      <div className="flex space-x-2">
        <Button loading={processing} onClick={() => handlePay(true)}>Simulate Success</Button>
        <Button variant="danger" disabled={processing} onClick={() => handlePay(false)}>Simulate Failure</Button>
      </div>
    </div>
  );
};

export default PaymentSimulator; 
