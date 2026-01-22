import React from 'react';
import './Loader.css';

const TeaPlantLoader = ({ size = 120, text = 'Loading...' }) => {
  const scale = size / 120;
  
  return (
    <div className="loader-container nature-loader" style={{ '--scale': scale }}>
      <div className="tea-plantation-loader">
        {/* Breeze particles */}
        <div className="breeze-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="breeze-particle"
              style={{
                '--delay': `${i * 0.15}s`,
                '--duration': `${2 + Math.random() * 1.5}s`,
                '--x-start': `${Math.random() * 100}%`,
                '--x-end': `${Math.random() * 100}%`,
                '--y-start': `${Math.random() * 100}%`,
                '--y-end': `${Math.random() * 100}%`,
                '--size': `${3 + Math.random() * 4}px`,
              }}
            />
          ))}
        </div>

        {/* Tea plants row */}
        <div className="tea-plants-row">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="tea-plant"
              style={{
                '--delay': `${i * 0.1}s`,
                '--swing-duration': `${1.5 + Math.random() * 0.5}s`,
              }}
            >
              {/* Plant stem */}
              <div className="plant-stem" />
              {/* Tea leaves */}
              <div className="plant-leaves">
                <div className="leaf leaf-top" />
                <div className="leaf leaf-left" />
                <div className="leaf leaf-right" />
                <div className="leaf leaf-bottom-left" />
                <div className="leaf leaf-bottom-right" />
              </div>
            </div>
          ))}
        </div>

        {/* Ground/soil */}
        <div className="tea-ground">
          <div className="ground-line" />
          <div className="ground-details">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="ground-detail"
                style={{ '--x': `${i * 12.5}%` }}
              />
            ))}
          </div>
        </div>

        {/* Sun rays in background */}
        <div className="sun-rays">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="sun-ray"
              style={{ '--rotation': `${i * 45}deg` }}
            />
          ))}
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <div className="loader-text nature-text">
          <span className="loader-text-content">{text}</span>
          <span className="loader-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      )}
    </div>
  );
};

const ForestLoader = ({ size = 120, text = 'Loading...' }) => {
  const scale = size / 120;
  
  return (
    <div className="loader-container nature-loader" style={{ '--scale': scale }}>
      <div className="forest-loader">
        {/* Wind particles */}
        <div className="wind-container">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="wind-particle"
              style={{
                '--delay': `${i * 0.2}s`,
                '--duration': `${2.5 + Math.random() * 1}s`,
                '--x-start': `${Math.random() * 100}%`,
                '--x-end': `${Math.random() * 120}%`,
              }}
            />
          ))}
        </div>

        {/* Trees */}
        <div className="trees-row">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="tree"
              style={{
                '--delay': `${i * 0.15}s`,
                '--swing-duration': `${2 + Math.random() * 0.8}s`,
              }}
            >
              <div className="tree-trunk" />
              <div className="tree-crown">
                <div className="tree-leaf" />
                <div className="tree-leaf" />
                <div className="tree-leaf" />
              </div>
            </div>
          ))}
        </div>

        {/* Ground */}
        <div className="forest-ground" />
      </div>

      {text && (
        <div className="loader-text nature-text">
          <span className="loader-text-content">{text}</span>
          <span className="loader-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      )}
    </div>
  );
};

const OceanLoader = ({ size = 120, text = 'Loading...' }) => {
  const scale = size / 120;
  
  return (
    <div className="loader-container nature-loader" style={{ '--scale': scale }}>
      <div className="ocean-loader">
        {/* Waves */}
        <div className="ocean-waves">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />
        </div>

        {/* Floating elements */}
        <div className="ocean-floats">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="float-element"
              style={{
                '--delay': `${i * 0.3}s`,
                '--duration': `${3 + Math.random() * 2}s`,
                '--x-start': `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Sun */}
        <div className="ocean-sun" />
      </div>

      {text && (
        <div className="loader-text nature-text">
          <span className="loader-text-content">{text}</span>
          <span className="loader-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      )}
    </div>
  );
};

const MountainLoader = ({ size = 120, text = 'Loading...' }) => {
  const scale = size / 120;
  
  return (
    <div className="loader-container nature-loader" style={{ '--scale': scale }}>
      <div className="mountain-loader">
        {/* Mountains */}
        <div className="mountains">
          <div className="mountain mountain-1" />
          <div className="mountain mountain-2" />
          <div className="mountain mountain-3" />
        </div>

        {/* Clouds */}
        <div className="clouds">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="cloud"
              style={{
                '--delay': `${i * 0.5}s`,
                '--duration': `${4 + Math.random() * 2}s`,
                '--x-start': `${Math.random() * 120}%`,
              }}
            />
          ))}
        </div>

        {/* Sun */}
        <div className="mountain-sun" />
      </div>

      {text && (
        <div className="loader-text nature-text">
          <span className="loader-text-content">{text}</span>
          <span className="loader-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      )}
    </div>
  );
};

const Loader = ({ 
  size = 120, 
  color = '#0E4C3C', 
  text = 'Loading...',
  type = 'tea' // tea, forest, ocean, mountain
}) => {
  const loaderProps = { size, text };

  switch (type) {
    case 'forest':
      return <ForestLoader {...loaderProps} />;
    case 'ocean':
      return <OceanLoader {...loaderProps} />;
    case 'mountain':
      return <MountainLoader {...loaderProps} />;
    case 'tea':
    default:
      return <TeaPlantLoader {...loaderProps} />;
  }
};

export default Loader;
