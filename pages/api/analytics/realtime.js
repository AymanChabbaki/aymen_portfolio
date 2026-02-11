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
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Active visitors (last 5 minutes)
    const { data: activeVisitors, error: activeError } = await supabase
      .from('page_views')
      .select('visitor_id, page_path, created_at, country, city')
      .gte('created_at', fiveMinutesAgo.toISOString())
      .order('created_at', { ascending: false });

    if (activeError) throw activeError;

    const uniqueActiveVisitors = new Set(activeVisitors?.map(v => v.visitor_id) || []).size;

    // Recent activity (last hour)
    const { data: recentActivity, error: activityError } = await supabase
      .from('page_views')
      .select('visitor_id, page_path, created_at, country, city, device_type, browser, referrer')
      .gte('created_at', oneHourAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (activityError) throw activityError;

    // Format recent activity
    const activityLog = recentActivity?.map(item => ({
      visitor_id: item.visitor_id,
      page: item.page_path,
      location: item.city ? `${item.city}, ${item.country}` : item.country,
      device: item.device_type,
      browser: item.browser,
      referrer: item.referrer || 'Direct',
      timestamp: item.created_at
    })) || [];

    // Hourly traffic (last 24 hours)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { data: hourlyData, error: hourlyError } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', twentyFourHoursAgo.toISOString());

    if (hourlyError) throw hourlyError;

    const hourlyTraffic = {};
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000).getHours();
      hourlyTraffic[hour] = 0;
    }

    hourlyData?.forEach(view => {
      const hour = new Date(view.created_at).getHours();
      hourlyTraffic[hour] = (hourlyTraffic[hour] || 0) + 1;
    });

    const hourlyChartData = Object.entries(hourlyTraffic)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([hour, views]) => ({ hour: `${hour}:00`, views }));

    // Entry and exit pages
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('entry_page, exit_page')
      .gte('start_time', oneHourAgo.toISOString());

    if (sessionsError) throw sessionsError;

    const entryPages = {};
    const exitPages = {};
    sessions?.forEach(session => {
      if (session.entry_page) entryPages[session.entry_page] = (entryPages[session.entry_page] || 0) + 1;
      if (session.exit_page) exitPages[session.exit_page] = (exitPages[session.exit_page] || 0) + 1;
    });

    const topEntryPages = Object.entries(entryPages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));

    const topExitPages = Object.entries(exitPages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));

    res.status(200).json({
      activeVisitors: uniqueActiveVisitors,
      recentActivity: activityLog,
      hourlyTraffic: hourlyChartData,
      entryPages: topEntryPages,
      exitPages: topExitPages
    });

  } catch (error) {
    console.error('Realtime stats error:', error);
    res.status(500).json({ error: 'Failed to fetch realtime stats', details: error.message });
  }
}
