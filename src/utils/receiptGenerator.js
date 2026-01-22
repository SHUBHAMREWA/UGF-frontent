// Receipt Generation Utilities - Using Red Template (same as email)

const generateRedTemplateReceipt = (donation, donor) => {
  // Format amount in Indian currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get donor information
  const donorName = donor?.fullName || donation.donorId?.fullName || 'Anonymous';
  const donorEmail = donor?.email || donation.donorId?.email || '';
  const donorPhone = donor?.phone || donation.donorId?.phone || '';
  const donorContact = donorEmail || donorPhone || 'N/A';
  const donorAddress = donor?.address || donation.donorId?.address || 'N/A';
  
  // Get payment method
  const paymentMethod = donation.method === 'UPI' ? 'UPI' : 
                        donation.method === 'NETBANKING' ? 'Net Banking' :
                        donation.method === 'CARD' ? 'Credit/Debit Card' :
                        donation.method === 'CASH' ? 'Cash' :
                        donation.method === 'CHEQUE' ? 'Cheque' :
                        donation.method === 'BANK_TRANSFER' ? 'Bank Transfer' :
                        donation.method || 'Online Transfer';
  
  // Get description/campaign title
  const description = donation.categoryId?.name || donation.title || 'Donation towards social welfare activities';
  
  // Format date
  const donationDate = donation.dateReceived ? 
    new Date(donation.dateReceived).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payment Receipt - United Global Federation India</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f4f4f4;
      font-family: "Segoe UI", Arial, sans-serif;
      color: #7b0f0f !important;
    }
    .receipt {
      width: 800px;
      margin: 40px auto;
      background: #fbf4e8;
      color: #7b0f0f;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.15);
    }
    /* Header */
    .header {
      position: relative;
      padding: 40px 30px 30px;
      background: linear-gradient(135deg, #b51212, #e31c1c);
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .contact-bar {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
      font-size: 14px;
      gap: 15px;
    }
    .contact-bar > div {
      background: rgba(255, 255, 255, 0.2);
      padding: 10px 15px;
      border-radius: 6px;
      color: #fff;
      font-weight: 500;
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    /* Content */
    .content {
      padding: 50px 30px 30px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 10px;
      border-bottom: 2px solid #7b0f0f;
      padding-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    table th, table td {
      border: 1px solid #7b0f0f;
      padding: 12px;
      font-size: 15px;
    }
    table th {
      background: #f3e3cc;
      text-align: left;
    }
    .payment-summary {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      font-size: 16px;
      font-weight: 600;
    }
    .total {
      font-size: 18px;
      font-weight: 700;
    }
    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #7b0f0f;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 14px;
    }
    .footer-note {
      margin-top: 30px;
      font-size: 14px;
      color: #7b0f0f;
      font-weight: 600;
      text-align: center;
    }
    .digital-sign {
      text-align: right;
      font-weight: 600;
    }
    @media print {
      body { 
        background: white; 
      }
      .receipt { 
        box-shadow: none; 
        margin: 0 auto;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>UNITED GLOBAL FEDERATION INDIA</h1>
      <div class="contact-bar">
        <div>📞 +91 84080 80176</div>
        <div>✉️ ugf.ngo@gmail.com</div>
        <div>📍 Tembhurni, Jalna, Maharashtra 431208</div>
      </div>
    </div>
    <div class="content">
      <div class="section-title">Received From</div>
      <table>
        <tr>
          <th>Name</th>
          <td>${donorName}</td>
        </tr>
        <tr>
          <th>Contact</th>
          <td>${donorContact}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>${donorAddress}</td>
        </tr>
        ${donor?.panOrTaxId || donation.donorId?.panOrTaxId ? `
        <tr>
          <th>PAN/Tax ID</th>
          <td>${donor?.panOrTaxId || donation.donorId?.panOrTaxId}</td>
        </tr>
        ` : ''}
      </table>
      <div class="section-title" style="margin-top:30px;">Payment Details</div>
      <table>
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
        <tr>
          <td>${description}</td>
          <td>${formatAmount(donation.amount)}</td>
        </tr>
      </table>
      <div class="payment-summary">
        <div>
          Payment Method: ${paymentMethod}<br>
          Transaction ID: ${donation.reference || donation.receipt?.receiptNo || 'N/A'}<br>
          Date: ${donationDate}<br>
          ${donation.eightyG === 'yes' ? '80G Certificate: Yes' : ''}
        </div>
        <div class="total">
          Total Amount Paid: ${formatAmount(donation.amount)}
        </div>
      </div>
      <div class="footer">
        <div>
          <strong>United Global Federation</strong><br>
          Thank you for your contribution
        </div>
        <div class="digital-sign">
          This receipt is digitally signed<br>
          Receipt No: ${donation.receipt?.receiptNo || 'N/A'}
        </div>
      </div>
      <div class="footer-note">
        Please contact us for a separate receipt for tax benefits under Section 80G
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// Simple text receipt (legacy - kept for backward compatibility)
export const generateSimpleReceipt = (donation, donor) => {
  return `
UNITED GLOBAL FEDERATION INDIA
Donation Receipt

Receipt No: ${donation.receipt?.receiptNo || 'N/A'}
Date: ${new Date(donation.dateReceived).toLocaleDateString('en-IN')}

Donor Details:
Name: ${donor.fullName || 'N/A'}
Mobile: ${donor.phone || 'N/A'}
Email: ${donor.email || 'N/A'}
PAN: ${donor.panOrTaxId || 'N/A'}

Donation Details:
Amount: ₹${donation.amount.toLocaleString('en-IN')}
Purpose: ${donation.categoryId?.name || 'N/A'}
Payment Mode: ${donation.method}
Reference: ${donation.reference || 'N/A'}
80G Certificate: ${donation.eightyG === 'yes' ? 'Yes' : 'No'}

Thank you for your generous donation!
  `;
};

// Professional receipt (now uses red template)
export const generateProfessionalReceipt = (donation, donor) => {
  return generateRedTemplateReceipt(donation, donor);
};

export const downloadReceipt = (donation, donor, format = 'professional') => {
  let receiptContent;
  let fileName;
  let mimeType;
  
  if (format === 'professional') {
    receiptContent = generateRedTemplateReceipt(donation, donor);
    fileName = `Receipt_${donation.receipt?.receiptNo || 'N/A'}_professional.html`;
    mimeType = 'text/html';
  } else {
    receiptContent = generateSimpleReceipt(donation, donor);
    fileName = `Receipt_${donation.receipt?.receiptNo || 'N/A'}_simple.txt`;
    mimeType = 'text/plain';
  }
  
  // Create and download file
  const blob = new Blob([receiptContent], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const printReceipt = (donation, donor, format = 'professional') => {
  if (format === 'professional') {
    const receiptContent = generateRedTemplateReceipt(donation, donor);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  } else {
    const receiptContent = generateSimpleReceipt(donation, donor);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Receipt - ${donation.receipt?.receiptNo || 'N/A'}</title></head>
        <body style="font-family: monospace; white-space: pre-line; padding: 20px;">
          ${receiptContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
};
