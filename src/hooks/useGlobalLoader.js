import { useLoader } from '../context/LoaderContext';

/**
 * Custom hook for managing global loader
 * 
 * @example
 * const { showLoader, hideLoader } = useGlobalLoader();
 * 
 * // Show loader with default tea theme
 * showLoader('Loading data...');
 * 
 * // Show loader with specific theme
 * showLoader('Loading data...', 'forest');
 * 
 * // Hide loader
 * hideLoader();
 */
export const useGlobalLoader = () => {
  const { showLoader, hideLoader, isLoading, loaderText, loaderType } = useLoader();

  /**
   * Show loader with async operation wrapper
   * @param {Function} asyncFn - Async function to execute
   * @param {string} loadingText - Text to display while loading
   * @param {string} type - Loader type: 'tea', 'forest', 'ocean', 'mountain'
   * @returns {Promise} - Promise from async function
   */
  const withLoader = async (asyncFn, loadingText = 'Loading...', type = 'tea') => {
    try {
      showLoader(loadingText, type);
      const result = await asyncFn();
      return result;
    } finally {
      hideLoader();
    }
  };

  return {
    showLoader,
    hideLoader,
    withLoader,
    isLoading,
    loaderText,
    loaderType,
  };
};

export default useGlobalLoader;

