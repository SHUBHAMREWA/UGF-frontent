import { useMemo } from 'react';
import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';

/**
 * Custom hook for form validation
 * @param {Object} rules - Validation rules object
 */
export const useValidation = (rules = {}) => {
  const validate = useMemo(() => {
    return (values) => {
      const errors = {};

      Object.keys(rules).forEach(field => {
        const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
        const value = values[field];

        for (const rule of fieldRules) {
          if (typeof rule === 'function') {
            const error = rule(value, values);
            if (error) {
              errors[field] = error;
              break;
            }
          } else if (typeof rule === 'object') {
            // Handle rule objects like { required: true, minLength: 5 }
            if (rule.required && (!value || value.toString().trim().length === 0)) {
              errors[field] = rule.message || ERROR_MESSAGES.REQUIRED(field);
              break;
            }
            if (rule.minLength && value && value.toString().length < rule.minLength) {
              errors[field] = rule.message || ERROR_MESSAGES.MIN_LENGTH(field, rule.minLength);
              break;
            }
            if (rule.maxLength && value && value.toString().length > rule.maxLength) {
              errors[field] = rule.message || ERROR_MESSAGES.MAX_LENGTH(field, rule.maxLength);
              break;
            }
            if (rule.pattern && value && !rule.pattern.test(value)) {
              errors[field] = rule.message || `Invalid ${field}`;
              break;
            }
            if (rule.validate && typeof rule.validate === 'function') {
              const error = rule.validate(value, values);
              if (error) {
                errors[field] = error;
                break;
              }
            }
          }
        }
      });

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }, [rules]);

  return { validate };
};

/**
 * Common validation functions
 */
export const validators = {
  required: (message) => (value) => {
    if (!value || value.toString().trim().length === 0) {
      return message || 'This field is required';
    }
    return null;
  },

  email: (message) => (value) => {
    if (value && !VALIDATION_RULES.EMAIL.test(value)) {
      return message || ERROR_MESSAGES.INVALID_EMAIL;
    }
    return null;
  },

  phone: (message) => (value) => {
    if (value && !VALIDATION_RULES.PHONE.test(value)) {
      return message || ERROR_MESSAGES.INVALID_PHONE;
    }
    return null;
  },

  pan: (message) => (value) => {
    if (value && !VALIDATION_RULES.PAN.test(value)) {
      return message || ERROR_MESSAGES.INVALID_PAN;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (value && value.toString().length < min) {
      return message || ERROR_MESSAGES.MIN_LENGTH('Field', min);
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (value && value.toString().length > max) {
      return message || ERROR_MESSAGES.MAX_LENGTH('Field', max);
    }
    return null;
  },

  pattern: (pattern, message) => (value) => {
    if (value && !pattern.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  custom: (validator, message) => (value, allValues) => {
    const result = validator(value, allValues);
    if (result !== true) {
      return message || result || 'Validation failed';
    }
    return null;
  }
};

