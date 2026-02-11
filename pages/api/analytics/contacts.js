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
    
    const now = new Date();
    const daysAgo = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Get contact submissions from events table
    const { data: contacts, error: contactsError } = await supabase
      .from('events')
      .select('created_at, event_data, visitor_id')
      .eq('event_type', 'contact_submit')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (contactsError) throw contactsError;

    // Format contact data
    const contactList = contacts?.map(contact => {
      const data = typeof contact.event_data === 'string' 
        ? JSON.parse(contact.event_data) 
        : contact.event_data;
      
      return {
        email: data?.email || 'N/A',
        name: data?.name || 'Anonymous',
        message: data?.message || '',
        timestamp: contact.created_at,
        visitor_id: contact.visitor_id
      };
    }) || [];

    // Get feedback submissions
    const { data: feedbacks, error: feedbacksError } = await supabase
      .from('feedbacks')
      .select('name, feedback, rating, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (feedbacksError) throw feedbacksError;

    const feedbackList = feedbacks?.map(fb => ({
      name: fb.name,
      feedback: fb.feedback,
      rating: fb.rating,
      timestamp: fb.created_at
    })) || [];

    res.status(200).json({
      contacts: contactList,
      feedbacks: feedbackList,
      totalContacts: contactList.length,
      totalFeedbacks: feedbackList.length
    });

  } catch (error) {
    console.error('Contacts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts', details: error.message });
  }
}
