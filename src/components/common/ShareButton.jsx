import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaShare, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaLink, FaCopy, FaTimes } from 'react-icons/fa';
import './ShareButton.css';

const ShareButton = ({ url, title, description, image }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareData = {
    title: title || 'Check this out!',
    text: description || 'Take a look at this amazing content',
    url: url || window.location.href
  };

  const handleShare = async (platform) => {
    const encodedUrl = encodeURIComponent(url || window.location.href);
    const encodedTitle = encodeURIComponent(title || 'Check this out!');
    const encodedDescription = encodeURIComponent(description || 'Take a look at this amazing content');

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share(shareData);
            setShowShareMenu(false);
            return;
          } catch (error) {
            console.log('Error sharing:', error);
          }
        }
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url || window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    }
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(true);
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(false);
  };

  const handleShareOptionClick = (e, platform) => {
    e.stopPropagation();
    handleShare(platform);
  };

  const handleCopyClick = (e) => {
    e.stopPropagation();
    handleCopyLink();
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    setShowShareMenu(false);
  };

  // Create portal content
  const sharePopupContent = showShareMenu ? (
    <>
      <div 
        className="share-overlay" 
        onClick={handleOverlayClick}
      />
      <div className="share-popup">
        <div className="share-popup-header">
          <h3>Share this content</h3>
          <button 
            className="share-close-btn"
            onClick={handleCloseClick}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="share-options">
          <button
            className="share-option"
            onClick={(e) => handleShareOptionClick(e, 'native')}
            title="Share via native sharing"
          >
            <FaShare />
            <span>Share</span>
          </button>
          
          <button
            className="share-option"
            onClick={(e) => handleShareOptionClick(e, 'facebook')}
            title="Share on Facebook"
          >
            <FaFacebook />
            <span>Facebook</span>
          </button>
          
          <button
            className="share-option"
            onClick={(e) => handleShareOptionClick(e, 'twitter')}
            title="Share on Twitter"
          >
            <FaTwitter />
            <span>Twitter</span>
          </button>
          
          <button
            className="share-option"
            onClick={(e) => handleShareOptionClick(e, 'whatsapp')}
            title="Share on WhatsApp"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </button>
          
          <button
            className="share-option"
            onClick={(e) => handleShareOptionClick(e, 'linkedin')}
            title="Share on LinkedIn"
          >
            <FaLinkedin />
            <span>LinkedIn</span>
          </button>
          
          <button
            className={`share-option ${copySuccess ? 'success' : ''}`}
            onClick={handleCopyClick}
            title="Copy link"
          >
            {copySuccess ? <FaLink /> : <FaCopy />}
            <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="share-button-container">
      <button
        className="share-button"
        onClick={handleButtonClick}
        aria-label="Share"
      >
        <FaShare />
        <span>Share</span>
      </button>

      {/* Render popup using React Portal */}
      {createPortal(
        sharePopupContent,
        document.body
      )}
    </div>
  );
};

export default ShareButton; 