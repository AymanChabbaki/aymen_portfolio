import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const usePortfolioAnalytics = () => {
  const router = useRouter();
  const sessionIdRef = useRef(null);
  const visitorIdRef = useRef(null);
  const sessionStartRef = useRef(null);
  const pageCountRef = useRef(0);

  // Get or create visitor ID
  const getVisitorId = () => {
    let visitorId = Cookies.get('visitor_id');
    if (!visitorId) {
      visitorId = uuidv4();
      Cookies.set('visitor_id', visitorId, { expires: 365 }); // 1 year
    }
    return visitorId;
  };

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  // Detect device type
  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  // Get browser name
  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    return 'Other';
  };

  // Get OS
  const getOS = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  };

  // Extract UTM parameters
  const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || ''
    };
  };

  // Track page view
  const trackPageView = async (path) => {
    // Skip tracking for dashboard page
    if (path === '/hidden') return;

    const visitorId = visitorIdRef.current;
    const sessionId = sessionIdRef.current;
    const utm = getUTMParams();

    pageCountRef.current += 1;

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pageview',
          sessionId,
          visitorId,
          data: {
            pagePath: path,
            pageTitle: document.title,
            referrer: document.referrer,
            ...utm,
            deviceType: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
          }
        })
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  };

  // Track event
  const trackEvent = async (eventType, eventData = {}) => {
    const visitorId = visitorIdRef.current;
    const sessionId = sessionIdRef.current;

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event',
          sessionId,
          visitorId,
          data: {
            eventType,
            eventData,
            pagePath: router.pathname
          }
        })
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  // Track performance metrics
  const trackPerformance = async () => {
    if (typeof window === 'undefined' || !window.performance) return;

    const sessionId = sessionIdRef.current;
    
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      setTimeout(async () => {
        try {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
          const loadTime = navigation?.loadEventEnd - navigation?.fetchStart || 0;
          
          // Get Web Vitals using PerformanceObserver
          let lcp = 0, fid = 0, cls = 0;

          // LCP
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.renderTime || lastEntry.loadTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FID
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              fid = entry.processingStart - entry.startTime;
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // CLS
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // Send metrics after a delay to capture vitals
          setTimeout(async () => {
            await fetch('/api/analytics/performance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId,
                pagePath: router.pathname,
                metrics: {
                  fcp,
                  lcp,
                  fid,
                  cls,
                  ttfb: navigation?.responseStart - navigation?.fetchStart || 0,
                  loadTime
                }
              })
            });

            // Disconnect observers
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
          }, 3000);

        } catch (error) {
          console.error('Failed to track performance:', error);
        }
      }, 0);
    }
  };

  // Track session start
  const startSession = async () => {
    const visitorId = visitorIdRef.current;
    const sessionId = sessionIdRef.current;
    const isNewVisitor = !Cookies.get('returning_visitor');
    const utm = getUTMParams();

    // Mark as returning visitor
    if (isNewVisitor) {
      Cookies.set('returning_visitor', 'true', { expires: 365 });
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'session_start',
          sessionId,
          visitorId,
          data: {
            isNewVisitor,
            referrer: document.referrer,
            ...utm,
            deviceType: getDeviceType(),
            browser: getBrowser(),
            os: getOS()
          }
        })
      });
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  // Track session end
  const endSession = async () => {
    const sessionId = sessionIdRef.current;
    const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000);

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'session_end',
          sessionId,
          visitorId: visitorIdRef.current,
          data: {
            duration,
            pageCount: pageCountRef.current
          }
        })
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  // Track errors
  const trackError = async (error) => {
    const sessionId = sessionIdRef.current;

    try {
      await fetch('/api/analytics/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          errorMessage: error.message,
          errorStack: error.stack,
          pagePath: router.pathname,
          browser: getBrowser(),
          os: getOS()
        })
      });
    } catch (err) {
      console.error('Failed to track error:', err);
    }
  };

  useEffect(() => {
    // Initialize IDs
    visitorIdRef.current = getVisitorId();
    sessionIdRef.current = getSessionId();
    sessionStartRef.current = Date.now();

    // Start session
    startSession();

    // Track initial page view
    trackPageView(router.pathname);

    // Track performance
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }

    // Track page changes
    const handleRouteChange = (url) => {
      trackPageView(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    // Track session end on page unload
    const handleUnload = () => {
      endSession();
    };
    window.addEventListener('beforeunload', handleUnload);

    // Global error handler
    const handleError = (event) => {
      trackError(event.error);
    };
    window.addEventListener('error', handleError);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('load', trackPerformance);
      window.removeEventListener('error', handleError);
    };
  }, [router]);

  return { trackEvent };
};

export default usePortfolioAnalytics;
