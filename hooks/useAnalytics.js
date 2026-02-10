import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAnalytics = () => {
  const router = useRouter();

  // Track page view
  const trackPageView = (page) => {
    const pageViews = JSON.parse(localStorage.getItem('analytics_pageViews') || '[]');
    pageViews.push({
      page,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
    });
    localStorage.setItem('analytics_pageViews', JSON.stringify(pageViews));
  };

  // Track interaction
  const trackInteraction = (type, element, data = {}) => {
    const interactions = JSON.parse(localStorage.getItem('analytics_interactions') || '[]');
    interactions.push({
      type,
      element,
      data,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
    });
    localStorage.setItem('analytics_interactions', JSON.stringify(interactions));
  };

  // Track session
  const trackSession = () => {
    const sessions = JSON.parse(localStorage.getItem('analytics_sessions') || '[]');
    
    // Check if session already exists in last 30 minutes
    const lastSession = sessions[sessions.length - 1];
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    if (!lastSession || new Date(lastSession.timestamp) < thirtyMinutesAgo) {
      // Get device type
      const device = /Mobile|Android|iPhone/i.test(navigator.userAgent) 
        ? 'Mobile' 
        : /iPad|Tablet/i.test(navigator.userAgent) 
          ? 'Tablet' 
          : 'Desktop';
      
      // Get referrer
      const referrer = document.referrer 
        ? new URL(document.referrer).hostname 
        : 'Direct';
      
      // Try to get location (this is simplified - in production use a geolocation API)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      sessions.push({
        timestamp: new Date().toISOString(),
        device,
        referrer,
        location: timezone,
        userAgent: navigator.userAgent,
      });
      
      localStorage.setItem('analytics_sessions', JSON.stringify(sessions));
    }
  };

  // Track on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    // Track initial page load
    trackPageView(router.pathname);
    trackSession();

    // Track route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.pathname]);

  return {
    trackPageView,
    trackInteraction,
    trackSession,
  };
};

// Utility function to track clicks
export const trackClick = (element, data = {}) => {
  const interactions = JSON.parse(localStorage.getItem('analytics_interactions') || '[]');
  interactions.push({
    type: 'clicks',
    element,
    data,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  });
  localStorage.setItem('analytics_interactions', JSON.stringify(interactions));
};

// Utility function to track scrolls
export const trackScroll = (depth) => {
  const interactions = JSON.parse(localStorage.getItem('analytics_interactions') || '[]');
  interactions.push({
    type: 'scrolls',
    element: 'page',
    data: { depth },
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  });
  localStorage.setItem('analytics_interactions', JSON.stringify(interactions));
};

// Utility function to track form submissions
export const trackFormSubmission = (formName, data = {}) => {
  const interactions = JSON.parse(localStorage.getItem('analytics_interactions') || '[]');
  interactions.push({
    type: 'formSubmissions',
    element: formName,
    data,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  });
  localStorage.setItem('analytics_interactions', JSON.stringify(interactions));
};

// Utility function to track downloads
export const trackDownload = (fileName, type = 'resume') => {
  const interactions = JSON.parse(localStorage.getItem('analytics_interactions') || '[]');
  interactions.push({
    type: 'downloads',
    element: fileName,
    data: { type },
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  });
  localStorage.setItem('analytics_interactions', JSON.stringify(interactions));
};
