import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timeRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // 1. Total visitors (unique visitor_ids)
    const { data: totalVisitors, error: visitorsError } = await supabase
      .from('page_views')
      .select('visitor_id')
      .gte('created_at', startDate.toISOString());

    if (visitorsError) throw visitorsError;

    const uniqueVisitors = new Set(totalVisitors?.map(v => v.visitor_id) || []).size;
    const totalPageViews = totalVisitors?.length || 0;

    // 2. New vs Returning visitors
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('is_new_visitor')
      .gte('start_time', startDate.toISOString());

    if (sessionsError) throw sessionsError;

    const newVisitors = sessions?.filter(s => s.is_new_visitor).length || 0;
    const returningVisitors = sessions?.filter(s => !s.is_new_visitor).length || 0;

    // 3. Top countries/cities
    const { data: locations, error: locationsError } = await supabase
      .from('page_views')
      .select('country, city')
      .gte('created_at', startDate.toISOString());

    if (locationsError) throw locationsError;

    const countryCounts = {};
    const cityCounts = {};
    locations?.forEach(loc => {
      countryCounts[loc.country] = (countryCounts[loc.country] || 0) + 1;
      const cityKey = `${loc.city}, ${loc.country}`;
      cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
    });

    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // 4. Traffic sources
    const { data: trafficSources, error: trafficError } = await supabase
      .from('page_views')
      .select('referrer, utm_source, utm_medium')
      .gte('created_at', startDate.toISOString());

    if (trafficError) throw trafficError;

    let direct = 0, social = 0, search = 0, other = 0;
    trafficSources?.forEach(source => {
      if (!source.referrer || source.referrer === '') {
        direct++;
      } else if (source.utm_medium === 'social' || /facebook|twitter|instagram|linkedin|tiktok/i.test(source.referrer)) {
        social++;
      } else if (/google|bing|yahoo|duckduckgo/i.test(source.referrer)) {
        search++;
      } else {
        other++;
      }
    });

    // 5. Device & Browser stats
    const { data: devices, error: devicesError } = await supabase
      .from('page_views')
      .select('device_type, browser')
      .gte('created_at', startDate.toISOString());

    if (devicesError) throw devicesError;

    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    const browserCounts = {};
    devices?.forEach(d => {
      if (d.device_type) deviceCounts[d.device_type] = (deviceCounts[d.device_type] || 0) + 1;
      if (d.browser) browserCounts[d.browser] = (browserCounts[d.browser] || 0) + 1;
    });

    const topBrowsers = Object.entries(browserCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // 6. Engagement metrics
    const { data: completedSessions, error: engagementError } = await supabase
      .from('sessions')
      .select('duration, page_count, bounce')
      .gte('start_time', startDate.toISOString())
      .not('duration', 'is', null);

    if (engagementError) throw engagementError;

    const avgDuration = completedSessions?.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length)
      : 0;

    const avgPagesPerSession = completedSessions?.length > 0
      ? (completedSessions.reduce((sum, s) => sum + (s.page_count || 0), 0) / completedSessions.length).toFixed(2)
      : 0;

    const bounceRate = completedSessions?.length > 0
      ? Math.round((completedSessions.filter(s => s.bounce).length / completedSessions.length) * 100)
      : 0;

    // 7. Goal conversions
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('event_type')
      .gte('created_at', startDate.toISOString());

    if (eventsError) throw eventsError;

    const eventCounts = {};
    events?.forEach(e => {
      eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
    });

    const downloads = eventCounts['download_cv'] || 0;
    const contactSubmissions = eventCounts['contact_submit'] || 0;
    const socialClicks = eventCounts['social_click'] || 0;

    // 8. Performance metrics
    const { data: perfMetrics, error: perfError } = await supabase
      .from('performance_metrics')
      .select('lcp, fid, cls, load_time')
      .gte('created_at', startDate.toISOString());

    if (perfError) throw perfError;

    const avgLCP = perfMetrics?.length > 0
      ? (perfMetrics.reduce((sum, p) => sum + (p.lcp || 0), 0) / perfMetrics.length).toFixed(0)
      : 0;

    const avgFID = perfMetrics?.length > 0
      ? (perfMetrics.reduce((sum, p) => sum + (p.fid || 0), 0) / perfMetrics.length).toFixed(0)
      : 0;

    const avgCLS = perfMetrics?.length > 0
      ? (perfMetrics.reduce((sum, p) => sum + (p.cls || 0), 0) / perfMetrics.length).toFixed(3)
      : 0;

    const avgLoadTime = perfMetrics?.length > 0
      ? (perfMetrics.reduce((sum, p) => sum + (p.load_time || 0), 0) / perfMetrics.length).toFixed(0)
      : 0;

    // 9. Traffic by page
    const { data: pageTraffic, error: pageTrafficError } = await supabase
      .from('page_views')
      .select('page_path')
      .gte('created_at', startDate.toISOString());

    if (pageTrafficError) throw pageTrafficError;

    const pageCounts = {};
    pageTraffic?.forEach(p => {
      pageCounts[p.page_path] = (pageCounts[p.page_path] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));

    // 10. Error rate
    const { data: errors, error: errorsError } = await supabase
      .from('errors')
      .select('error_message')
      .gte('created_at', startDate.toISOString());

    if (errorsError) throw errorsError;

    const errorCount = errors?.length || 0;
    const errorRate = totalPageViews > 0 ? ((errorCount / totalPageViews) * 100).toFixed(2) : 0;

    // 11. Daily trends (for charts)
    const { data: dailyViews, error: dailyError } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (dailyError) throw dailyError;

    const dailyTrends = {};
    dailyViews?.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0];
      dailyTrends[date] = (dailyTrends[date] || 0) + 1;
    });

    const trendsData = Object.entries(dailyTrends).map(([date, views]) => ({ date, views }));

    // Return all stats
    res.status(200).json({
      overview: {
        totalVisitors: uniqueVisitors,
        totalPageViews,
        newVisitors,
        returningVisitors,
        topCountries,
        topCities
      },
      trafficSources: {
        direct,
        social,
        search,
        other
      },
      devices: {
        counts: deviceCounts,
        browsers: topBrowsers
      },
      engagement: {
        avgDuration,
        avgPagesPerSession,
        bounceRate
      },
      conversions: {
        downloads,
        contactSubmissions,
        socialClicks
      },
      performance: {
        avgLCP,
        avgFID,
        avgCLS,
        avgLoadTime
      },
      topPages,
      errorRate,
      errorCount,
      trends: trendsData
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
}
