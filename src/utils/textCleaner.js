/**
 * Recursively cleans a string until no more changes occur
 * Handles nested JSON, escape characters, brackets, and multiple encoding layers
 * @param {any} value - The value to clean (string, array, object, etc.)
 * @param {number} maxIterations - Maximum number of cleaning iterations (default: 10)
 * @returns {string} - Cleaned text string
 */
export const deepCleanText = (value, maxIterations = 10) => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Handle arrays - extract first meaningful item
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    // Recursively clean the first item
    return deepCleanText(value[0], maxIterations);
  }

  // Handle objects - try to extract string value
  if (typeof value === 'object') {
    // If it has a toString method, use it
    if (typeof value.toString === 'function') {
      return deepCleanText(value.toString(), maxIterations);
    }
    // Try common properties
    if (value.text) return deepCleanText(value.text, maxIterations);
    if (value.value) return deepCleanText(value.value, maxIterations);
    if (value.content) return deepCleanText(value.content, maxIterations);
    return '';
  }

  // Handle non-string values - convert to string
  if (typeof value !== 'string') {
    return String(value).trim();
  }

  let text = value.trim();
  let previousText = '';
  let iterations = 0;

  // Keep cleaning until no more changes occur or max iterations reached
  while (text !== previousText && iterations < maxIterations) {
    previousText = text;
    iterations++;

    // Step 1: Remove nested brackets and quotes at the start/end
    // Pattern: [[["text"]]] or ["text"] or [\"text\"]
    while (
      (text.startsWith('[') && text.endsWith(']')) ||
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) {
      const startChar = text[0];
      const endChar = text[text.length - 1];
      
      // Only remove if they match
      if (
        (startChar === '[' && endChar === ']') ||
        (startChar === '"' && endChar === '"') ||
        (startChar === "'" && endChar === "'")
      ) {
        text = text.slice(1, -1).trim();
      } else {
        break;
      }
    }

    // Step 2: Remove escape characters and JSON encoding
    // Remove leading/trailing escape sequences
    text = text.replace(/^\\+["[]/g, (match) => match.replace(/\\/g, ''));
    text = text.replace(/[\]"]\\+$/g, (match) => match.replace(/\\/g, ''));

    // Remove escape characters before quotes
    text = text.replace(/\\"/g, '"');
    text = text.replace(/\\'/g, "'");
    text = text.replace(/\\\\/g, '\\');

    // Remove JSON escape sequences
    text = text.replace(/\\n/g, ' ');
    text = text.replace(/\\r/g, ' ');
    text = text.replace(/\\t/g, ' ');

    // Step 3: Try to parse as JSON if it looks like JSON
    const trimmedText = text.trim();
    if ((trimmedText.startsWith('[') || trimmedText.startsWith('{')) && trimmedText.length > 2) {
      try {
        const parsed = JSON.parse(trimmedText);
        
        // If parsed successfully and it's an array, get first item
        if (Array.isArray(parsed)) {
          if (parsed.length > 0) {
            const firstItem = parsed[0];
            // If first item is string, use it; otherwise recursively clean
            if (typeof firstItem === 'string') {
              text = firstItem;
            } else {
              text = deepCleanText(firstItem, maxIterations);
            }
            continue; // Continue cleaning loop with new text
          }
          text = '';
          break;
        }
        
        // If parsed is a string, use it
        if (typeof parsed === 'string') {
          text = parsed;
          continue; // Continue cleaning loop with new text
        }
        
        // If parsed is an object, try to extract text
        if (typeof parsed === 'object' && parsed !== null) {
          if (parsed.text) {
            text = parsed.text;
            continue;
          }
          if (parsed.value) {
            text = parsed.value;
            continue;
          }
          // Convert object to string
          text = JSON.stringify(parsed);
        }
      } catch (e) {
        // JSON parsing failed, continue with current text
      }
    }

    // Step 4: Remove multiple spaces
    text = text.replace(/\s+/g, ' ').trim();

    // Step 5: Remove leading/trailing punctuation that might be from encoding
    text = text.replace(/^[,[\]]+/g, '');
    text = text.replace(/[,[\]]+$/g, '');
    text = text.trim();
  }

  // Final cleanup
  text = text.trim();
  
  // Remove any remaining problematic characters at start/end
  text = text.replace(/^[,[\]]+/g, '');
  text = text.replace(/[,[\]]+$/g, '');
  text = text.trim();

  return text;
};

/**
 * Wrapper function for backward compatibility
 * @param {any} value - The value to clean
 * @returns {string} - Cleaned text string
 */
export const cleanText = (value) => {
  return deepCleanText(value);
};

export default deepCleanText;

