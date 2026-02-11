import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, feedback, rating } = req.body;

    // Validate input
    if (!name || !feedback) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and feedback are required' 
      });
    }

    // Convert rating to number and validate
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rating must be between 1 and 5' 
      });
    }

    if (name.length > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name is too long' 
      });
    }

    if (feedback.length > 1000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Feedback is too long' 
      });
    }

    // Insert feedback into Supabase
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([
        {
          name: name.trim(),
          feedback: feedback.trim(),
          rating: ratingNum
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save feedback', 
        details: error.message 
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
