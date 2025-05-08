import React, { useState } from 'react';

const InsuranceSearch = ({ onSearch }) => {
  const [insuranceNumber, setInsuranceNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(insuranceNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="insurance-form">
      <input
        type="text"
        value={insuranceNumber}
        onChange={(e) => setInsuranceNumber(e.target.value)}
        placeholder="Enter insurance number"
      />
      <button type="submit">Find</button>
    </form>
  );
};

export default InsuranceSearch;