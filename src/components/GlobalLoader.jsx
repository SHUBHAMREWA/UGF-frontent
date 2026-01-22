import React from 'react';
import { useLoader } from '../context/LoaderContext';
import ImageLoader from './ImageLoader';
import './GlobalLoader.css';

const GlobalLoader = () => {
  const { isLoading, loaderText } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader-content">
        <ImageLoader text={loaderText} size={140} />
      </div>
    </div>
  );
};

export default GlobalLoader;

