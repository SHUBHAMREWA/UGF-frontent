import React, { forwardRef } from 'react';
import './DonationReceipt.css';

const DonationReceipt = forwardRef(({
  receiptNo,
  date,
  donorName,
  address,
  contact,
  email,
  amount,
  paymentMode,
  transactionId,
  pan,
  representative = '',
  trustName = 'Aarine Foundation',
  trustAddress = '102 First Floor, Ganodevi Krupa Building, Opposite GhanSol Post Office, GhanSol, Navi Mumbai 400701',
  trustContact = '9222238888',
  trustEmail = 'aarinefoundation@yahoo.com',
  trustPAN = 'AAHTA5687L',
  trustRegNo = 'E-35254',
}, ref) => {
  return (
    <div className="receipt-container" ref={ref}>
      <div className="receipt-header">
        <div className="trust-logo">{/* Optionally add logo here */}</div>
        <div className="trust-info">
          <div className="trust-name">{trustName}</div>
          <div className="trust-details">
            Trust Registration No: {trustRegNo} | PAN No: {trustPAN}<br />
            {trustAddress}<br />
            Contact: {trustContact} | Email: {trustEmail}
          </div>
        </div>
      </div>
      <div className="receipt-body">
        <div className="receipt-row">
          <span>Receipt No.: <b>{receiptNo}</b></span>
          <span>Date: <b>{date}</b></span>
        </div>
        <div className="receipt-row">
          <span>We are Thankful to Mr./Ms./Mrs. <b>{donorName}</b></span>
        </div>
        <div className="receipt-row">
          <span>Address: <b>{address}</b></span>
        </div>
        <div className="receipt-row">
          <span>Contact No.: <b>{contact}</b></span>
          <span>Email: <b>{email}</b></span>
        </div>
        <div className="receipt-row">
          <span>For kind donation of Rs. <b>₹{amount}</b></span>
        </div>
        <div className="receipt-row">
          <span>By Mode: <b>{paymentMode}</b></span>
          <span>Transaction ID: <b>{transactionId}</b></span>
        </div>
        <div className="receipt-row">
          <span>PAN No.: <b>{pan}</b></span>
        </div>
        <div className="receipt-row">
          <span>Amount in figures: <b>₹{amount}</b></span>
        </div>
        <div className="receipt-row">
          <span>Signature of Representative: <b>{representative}</b></span>
        </div>
        <div className="receipt-note">
          Please contact for separate receipt for tax benefit under Income Tax Section 80G.
        </div>
      </div>
    </div>
  );
});

export default DonationReceipt; 