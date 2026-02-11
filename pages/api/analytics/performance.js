import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      sessionId,
      pagePath,
      metrics
    } = req.body;

    const { error } = await supabase.from('performance_metrics').insert({
      session_id: sessionId,
      page_path: pagePath,
      fcp: metrics.fcp,
      lcp: metrics.lcp,
      fid: metrics.fid,
      cls: metrics.cls,
      ttfb: metrics.ttfb,
      load_time: metrics.loadTime
    });

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Performance tracking error:', error);
    res.status(500).json({ error: 'Failed to track performance', details: error.message });
  }
}
