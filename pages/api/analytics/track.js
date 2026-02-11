import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getGeolocation(req) {
  // Try Vercel headers first (production)
  let country = req.headers['x-vercel-ip-country'];
  let city = req.headers['x-vercel-ip-city'];

  // If not available (local development), use ip-api.com as fallback
  if (!country || country === 'Unknown') {
    try {
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                 req.headers['x-real-ip'] || 
                 req.connection?.remoteAddress || 
                 'unknown';
      
      // Skip geolocation for localhost
      if (ip === 'unknown' || ip === '::1' || ip.startsWith('127.')) {
        return { country: 'Local', city: 'Development' };
      }

      const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
      const data = await response.json();
      
      if (data.country) {
        country = data.country;
        city = data.city || 'Unknown';
      }
    } catch (error) {
      console.warn('Geolocation fallback failed:', error);
    }
  }

  return {
    country: country || 'Unknown',
    city: city || 'Unknown'
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      type, // 'pageview', 'event', 'session_start', 'session_end'
      sessionId,
      visitorId,
      data
    } = req.body;

    // Get geolocation from Vercel headers or fallback API
    const { country, city } = await getGeolocation(req);

    if (type === 'pageview') {
      const { error } = await supabase.from('page_views').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        page_path: data.pagePath,
        page_title: data.pageTitle,
        referrer: data.referrer,
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        country,
        city,
        device_type: data.deviceType,
        browser: data.browser,
        os: data.os,
        screen_width: data.screenWidth,
        screen_height: data.screenHeight
      });

      if (error) throw error;

      // Update session page count
      await supabase.rpc('increment_session_page_count', { session_id: sessionId });

    } else if (type === 'event') {
      const { error } = await supabase.from('events').insert({
        session_id: sessionId,
        visitor_id: visitorId,
        event_type: data.eventType,
        event_data: data.eventData || {},
        page_path: data.pagePath
      });

      if (error) throw error;

    } else if (type === 'session_start') {
      // Use upsert to avoid duplicate key errors when session already exists
      const { error } = await supabase.from('sessions').upsert({
        id: sessionId,
        visitor_id: visitorId,
        is_new_visitor: data.isNewVisitor,
        referrer: data.referrer,
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        country,
        city,
        device_type: data.deviceType,
        browser: data.browser,
        os: data.os
      }, { onConflict: 'id', ignoreDuplicates: false });

      if (error) throw error;

    } else if (type === 'session_end') {
      const { error } = await supabase
        .from('sessions')
        .update({
          end_time: new Date().toISOString(),
          duration: data.duration,
          bounce: data.pageCount === 1
        })
        .eq('id', sessionId);

      if (error) throw error;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Failed to track analytics', details: error.message });
  }
}
