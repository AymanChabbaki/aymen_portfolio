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
      errorMessage,
      errorStack,
      pagePath,
      browser,
      os
    } = req.body;

    const { error } = await supabase.from('errors').insert({
      session_id: sessionId,
      error_message: errorMessage,
      error_stack: errorStack,
      page_path: pagePath,
      browser,
      os
    });

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking error:', error);
    res.status(500).json({ error: 'Failed to track error' });
  }
}
