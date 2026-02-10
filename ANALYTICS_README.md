# 📊 Analytics Dashboard

## Access the Dashboard

Visit: `http://localhost:3000/hidden`

**Password:** `ayman2024`

## Features

### 📈 Real-time Metrics
- **Total Views** - Page view count
- **Interactions** - Button clicks, link clicks, scrolls
- **Sessions** - Unique visitor sessions
- **Average Session** - Pages per session

### 📄 Top Pages
See which pages are most visited

### 🎯 Interaction Types
Track different user actions:
- **Clicks** - Button and link clicks
- **Scrolls** - Page scroll depth
- **Form Submissions** - Contact form submissions
- **Downloads** - Resume downloads

### 💻 Device Analytics
- Desktop vs Mobile vs Tablet breakdown
- Screen resolutions
- Browser information

### 🌍 Location Data
- Timezone-based location tracking
- Geographic distribution of visitors

### 🔗 Traffic Sources
- Direct traffic
- Referral sources
- Social media links

### ⚡ Recent Activity Feed
Real-time activity log showing:
- Page views
- Interactions
- Timestamps

## How It Works

### Automatic Tracking

The analytics system automatically tracks:

1. **Page Views** - Every page navigation
2. **Sessions** - New visitor sessions (30-minute timeout)
3. **Scroll Depth** - How far users scroll on pages
4. **Time on Page** - Duration spent on each page
5. **Clicks** - Button and link interactions

### Manual Tracking

You can track custom events using these functions:

```javascript
import { trackClick, trackFormSubmission, trackDownload } from '../hooks/useAnalytics';

// Track a click
trackClick('button-name', { additionalData: 'value' });

// Track form submission
trackFormSubmission('contact-form', { fields: 3 });

// Track download
trackDownload('resume.pdf', 'resume');
```

## Data Storage

- All data is stored in **browser localStorage**
- Data persists across sessions
- Privacy-friendly (no server-side storage)
- Can be cleared from dashboard

## Security

- Password protected dashboard
- Session-based authentication
- No sensitive user data collected
- GDPR-friendly approach

## Integration

Already integrated in:
- ✅ Resume download button (Header)
- ✅ Contact form submissions
- ✅ All page navigations
- ✅ Button clicks throughout site
- ✅ Link clicks to external sites
- ✅ Scroll depth tracking

## Customization

### Change Password

Edit `/pages/hidden.js` line 33:
```javascript
if (password === "YOUR_NEW_PASSWORD") {
```

### Add Custom Tracking

Use the `trackInteraction` function:
```javascript
const { trackInteraction } = useAnalytics();

trackInteraction('customEvent', 'elementName', { 
  customData: 'value' 
});
```

### Modify Tracked Data

Edit `/hooks/useAnalytics.js` to customize what data is collected.

## Production Considerations

For production, consider:

1. **Server-side storage** - Use a database instead of localStorage
2. **API integration** - Connect to analytics services (Google Analytics, Mixpanel, etc.)
3. **User consent** - Add cookie consent banner
4. **Data retention** - Implement data cleanup policies
5. **IP anonymization** - Hash or truncate IP addresses
6. **GDPR compliance** - Add privacy policy and data export features

## Sample Analytics API

If you want to move to server-side tracking, create an API endpoint:

```javascript
// pages/api/analytics/track.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { event, data } = req.body;
    
    // Save to database
    // await db.analytics.create({ event, data, timestamp: new Date() });
    
    res.status(200).json({ success: true });
  }
}
```

## Troubleshooting

**Dashboard not loading?**
- Clear browser cache
- Check localStorage is enabled
- Try incognito mode

**No data showing?**
- Navigate through your site first
- Data only appears after interactions
- Check browser console for errors

**Password not working?**
- Default password: `ayman2024`
- Case-sensitive
- Check `/pages/hidden.js` for current password

## Future Enhancements

Potential additions:
- 📊 Chart visualizations
- 📧 Email reports
- 🔔 Real-time notifications
- 📱 Heatmaps
- 🎯 Conversion funnels
- 👥 User journey mapping
- 📈 A/B testing support

---

Built with Next.js, Framer Motion, and localStorage
