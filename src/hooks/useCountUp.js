import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating numbers from 0 to target value
 * @param {number} end - Target number to count to
 * @param {number} duration - Duration of animation in milliseconds (default: 2000)
 * @param {boolean} startOnMount - Whether to start animation on mount (default: true)
 * @param {function} formatter - Optional function to format the number
 * @returns {object} - Object with count (formatted), rawCount, and isAnimating
 */
const useCountUp = (end, duration = 2000, startOnMount = true, formatter = null) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const countRef = useRef(0);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Don't animate if startOnMount is false or if end is not a valid number
    if (!startOnMount || typeof end !== 'number' || isNaN(end) || !isFinite(end)) {
      setCount(end);
      return;
    }

    // Reset animation state when end value changes significantly
    if (Math.abs(countRef.current - end) > 0.01) {
      setCount(0);
      countRef.current = 0;
      setIsAnimating(true);
      hasAnimatedRef.current = false;
      startTimeRef.current = null;

      // Cancel any existing animation
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      const animate = (currentTime) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic) for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(end * easeOutCubic);

        // Update count only if it changed
        if (currentCount !== countRef.current) {
          countRef.current = currentCount;
          setCount(currentCount);
        }

        // Continue animation if not complete
        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure we end exactly at the target
          setCount(end);
          countRef.current = end;
          setIsAnimating(false);
          hasAnimatedRef.current = true;
        }
      };

      // Start animation
      requestRef.current = requestAnimationFrame(animate);
    }

    // Cleanup function
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [end, duration, startOnMount]);

  // Format the number if formatter is provided
  const formattedCount = formatter ? formatter(count) : count;

  return {
    count: formattedCount,
    rawCount: count,
    isAnimating
  };
};

export default useCountUp;

