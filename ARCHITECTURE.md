# Architecture Optimization Guide

This document outlines the optimized architecture for the project, focusing on reusability, maintainability, and minimal code duplication.

## 📁 Directory Structure

```
src/
├── constants/          # All constant values
│   └── index.js       # API endpoints, validation rules, Maharashtra data
├── hooks/             # Custom React hooks
│   ├── useForm.js     # Form state management
│   ├── useApi.js      # API call management
│   ├── useValidation.js # Form validation
│   └── useFileUpload.js # File upload handling
├── components/
│   ├── common/        # Reusable form components
│   │   ├── FormField.jsx
│   │   ├── FormSelect.jsx
│   │   └── FormTextarea.jsx
│   └── ui/            # Base UI components
├── utils/
│   ├── formatters.js  # Formatting utilities
│   ├── validation.js  # Validation utilities
│   └── api.js         # API client
```

## 🎣 Custom Hooks

### useForm
Manages form state, validation, and submission.

```jsx
import { useForm } from '../hooks/useForm';
import { useValidation, validators } from '../hooks/useValidation';

const MyForm = () => {
  const validationRules = {
    email: [
      validators.required('Email is required'),
      validators.email('Invalid email format')
    ],
    phone: [validators.required(), validators.phone()]
  };

  const { validate } = useValidation(validationRules);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useForm(
    { email: '', phone: '' },
    async (formValues) => {
      // Submit logic
    },
    validate
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### useApi
Manages API calls with loading and error states.

```jsx
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '../constants';
import api from '../utils/api';

const MyComponent = () => {
  const { execute, loading, error, data } = useApi(
    async (params) => {
      const response = await api.get(API_ENDPOINTS.EVENTS.LIST, { params });
      return response.data;
    }
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  return <DataDisplay data={data} />;
};
```

### useFetch
Fetches data on component mount.

```jsx
import { useFetch } from '../hooks/useApi';
import { API_ENDPOINTS } from '../constants';

const EventsList = () => {
  const { data, loading, error, refetch } = useFetch(API_ENDPOINTS.EVENTS.LIST);

  if (loading) return <Loader />;
  if (error) return <Error />;
  return <Events data={data} onRefresh={refetch} />;
};
```

### useFileUpload
Handles file uploads with progress tracking.

```jsx
import { useFileUpload } from '../hooks/useFileUpload';

const FileUploader = () => {
  const { upload, uploading, progress, error } = useFileUpload('/api/upload');

  const handleUpload = async (file) => {
    const result = await upload(file, { additionalData: 'value' });
    if (result.success) {
      // Handle success
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {uploading && <ProgressBar value={progress} />}
      {error && <Error message={error} />}
    </div>
  );
};
```

## 🧩 Reusable Components

### FormField
Standardized input field with validation display.

```jsx
import { FormField } from '../components/common';

<FormField
  label="Email"
  name="email"
  type="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.email}
  touched={touched.email}
  required
/>
```

### FormSelect
Standardized select dropdown.

```jsx
import { FormSelect } from '../components/common';
import { MAHARASHTRA_DISTRICTS } from '../constants';

<FormSelect
  label="District"
  name="district"
  value={values.district}
  onChange={handleChange}
  options={MAHARASHTRA_DISTRICTS.map(d => ({ value: d, label: d }))}
  error={errors.district}
  touched={touched.district}
/>
```

## 📦 Constants

All constants are centralized in `src/constants/index.js`:

- `API_ENDPOINTS` - All API endpoint paths
- `MAHARASHTRA_DATA` - Districts and talukas
- `VALIDATION_RULES` - Regex patterns
- `ERROR_MESSAGES` - Standard error messages
- `DONATION_AMOUNTS` - Predefined donation amounts
- `EVENT_STATUS` - Event status types

## 🛠️ Utilities

### Formatters
Located in `src/utils/formatters.js`:

- `formatCurrency(amount, currency, locale)` - Format money
- `formatDate(date, formatStr)` - Format dates
- `formatPhone(phone)` - Format phone numbers
- `truncate(text, maxLength)` - Truncate text
- `getInitials(name)` - Get initials from name

## 🔄 Migration Guide

### Before (Old Pattern)
```jsx
const [formData, setFormData] = useState({ email: '', phone: '' });
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const validate = () => {
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email required';
  // ... more validation
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setLoading(true);
  try {
    await api.post('/endpoint', formData);
  } finally {
    setLoading(false);
  }
};
```

### After (New Pattern)
```jsx
import { useForm } from '../hooks/useForm';
import { useValidation, validators } from '../hooks/useValidation';
import { useApi } from '../hooks/useApi';
import { API_ENDPOINTS } from '../constants';

const validationRules = {
  email: [validators.required(), validators.email()],
  phone: [validators.required(), validators.phone()]
};

const { validate } = useValidation(validationRules);
const { execute: submitForm, loading } = useApi(api.post);

const {
  values,
  errors,
  handleChange,
  handleSubmit
} = useForm(
  { email: '', phone: '' },
  async (data) => await submitForm(API_ENDPOINTS.CONTACT, data),
  validate
);
```

## ✅ Best Practices

1. **Always use constants** for API endpoints, validation rules, and repeated data
2. **Use custom hooks** for form management, API calls, and validation
3. **Use reusable components** for common UI patterns
4. **Keep components under 200 lines** - extract logic to hooks
5. **Avoid code duplication** - create utilities for repeated operations
6. **Use TypeScript-style JSDoc** for better IDE support

## 📝 Example: Complete Refactored Component

See `src/components/ContactUs.refactored.example.jsx` for a complete example of a refactored component using all the new patterns.

