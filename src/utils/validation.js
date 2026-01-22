import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';

export const validateDonationAmount = (amount) => {
  if (!amount || amount <= 0) {
    throw new Error('Invalid donation amount');
  }
  return true;
};

export const validateEmail = (email) => {
  if (!email) return ERROR_MESSAGES.REQUIRED('Email');
  if (!VALIDATION_RULES.EMAIL.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return ERROR_MESSAGES.REQUIRED('Phone');
  if (!VALIDATION_RULES.PHONE.test(phone)) return ERROR_MESSAGES.INVALID_PHONE;
  return null;
};

export const validatePAN = (pan) => {
  if (!pan) return ERROR_MESSAGES.REQUIRED('PAN');
  if (!VALIDATION_RULES.PAN.test(pan)) return ERROR_MESSAGES.INVALID_PAN;
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim().length === 0) {
    return ERROR_MESSAGES.REQUIRED(fieldName);
  }
  return null;
};

// Re-export formatters (moved to formatters.js)
export { formatCurrency, formatDate, formatPhone, truncate, capitalize, formatFileSize, getInitials } from './formatters'; 