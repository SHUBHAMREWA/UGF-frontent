export function cn(...inputs) {
  const classes = inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === 'string') {
        return input;
      }
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
  
  return classes || undefined;
}

