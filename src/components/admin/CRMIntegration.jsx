import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OfflineDonationsCRM from './OfflineDonationsCRM';

const CRMIntegration = () => {
  return (
    <Routes>
      <Route path="/offline-donations" element={<OfflineDonationsCRM />} />
      <Route path="/" element={<Navigate to="/offline-donations" replace />} />
    </Routes>
  );
};

export default CRMIntegration;
