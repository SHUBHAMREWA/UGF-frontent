import Clarity from '@microsoft/clarity';

/**
 * Initialize Microsoft Clarity analytics
 * @param {string} projectId - Your Clarity project ID from https://clarity.microsoft.com
 */
export const initializeClarity = (projectId) => {
  if (!projectId) {
    console.warn('Microsoft Clarity: Project ID not provided. Clarity will not be initialized.');
    return;
  }

  try {
    Clarity.init(projectId);
    console.log('✅ Microsoft Clarity initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Microsoft Clarity:', error);
  }
};

/**
 * Track custom events in Clarity
 * @param {string} eventName - Name of the event
 * @param {object} eventData - Additional event data
 */
export const trackClarityEvent = (eventName, eventData = {}) => {
  try {
    if (window.clarity) {
      window.clarity('event', eventName, eventData);
    }
  } catch (error) {
    console.error('Error tracking Clarity event:', error);
  }
};

/**
 * Set user ID in Clarity
 * @param {string} userId - User identifier
 */
export const setClarityUserId = (userId) => {
  try {
    if (window.clarity && userId) {
      window.clarity('identify', userId);
    }
  } catch (error) {
    console.error('Error setting Clarity user ID:', error);
  }
};

