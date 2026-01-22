import React, { createContext, useContext, useState, useCallback } from 'react';

const LoaderContext = createContext();

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState('Loading...');
  const [loaderType, setLoaderType] = useState('tea'); // tea, forest, ocean, mountain

  const showLoader = useCallback((text = 'Loading...', type = 'tea') => {
    setLoaderText(text);
    setLoaderType(type);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setLoaderText('Loading...');
  }, []);

  const value = {
    isLoading,
    loaderText,
    loaderType,
    showLoader,
    hideLoader,
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
};

export default LoaderContext;

