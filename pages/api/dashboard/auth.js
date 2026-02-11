export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  
  // Simple password check - change this to your preferred password
  const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin123';

  if (password === DASHBOARD_PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
}
