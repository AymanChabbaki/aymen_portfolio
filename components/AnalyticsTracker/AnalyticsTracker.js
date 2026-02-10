import { useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const AnalyticsTracker = () => {
  const { trackInteraction } = useAnalytics();

  useEffect(() => {
    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollTimeout;

    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        
        // Debounce scroll tracking
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          trackInteraction('scrolls', 'page', { depth: maxScrollDepth });
        }, 1000);
      }
    };

    // Track time on page
    const startTime = Date.now();
    
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      trackInteraction('timeOnPage', 'page', { seconds: timeSpent });
    };

    // Track clicks on important elements
    const handleClick = (e) => {
      const target = e.target;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        trackInteraction('clicks', 'button', { 
          text: button.textContent.substring(0, 50),
          class: button.className 
        });
      }
      
      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        trackInteraction('clicks', 'link', { 
          href: link.href,
          text: link.textContent.substring(0, 50)
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', trackTimeOnPage);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', handleClick);
      clearTimeout(scrollTimeout);
    };
  }, [trackInteraction]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
