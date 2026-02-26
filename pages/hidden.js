import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Head from 'next/head';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeData, setRealtimeData] = useState(null);
  const [contactsData, setContactsData] = useState(null);
  const [adminEmail] = useState('aymanchabbaki@gmail.com'); // Admin email
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('dashboard_auth', 'true');
        fetchStats();
        fetchRealtimeData();
        fetchContactsData();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`/api/analytics/stats?timeRange=${timeRange}`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      const data = await response.json();
      setRealtimeData(data || {
        activeVisitors: 0,
        recentActivity: [],
        hourlyTraffic: [],
        entryPages: [],
        exitPages: []
      });
    } catch (err) {
      console.error('Failed to fetch realtime data:', err);
      setRealtimeData({
        activeVisitors: 0,
        recentActivity: [],
        hourlyTraffic: [],
        entryPages: [],
        exitPages: []
      });
    }
  };

  const fetchContactsData = async () => {
    try {
      const response = await fetch(`/api/analytics/contacts?timeRange=${timeRange}`);
      const data = await response.json();
      setContactsData(data || {
        contacts: [],
        feedbacks: [],
        totalContacts: 0,
        totalFeedbacks: 0
      });
    } catch (err) {
      console.error('Failed to fetch contacts data:', err);
      setContactsData({
        contacts: [],
        feedbacks: [],
        totalContacts: 0,
        totalFeedbacks: 0
      });
    }
  };

  const exportData = () => {
    const exportObj = {
      stats,
      realtimeData,
      contactsData,
      exportedAt: new Date().toISOString(),
      timeRange
    };
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('dashboard_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchStats();
      fetchRealtimeData();
      fetchContactsData();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchContactsData();
    }
  }, [timeRange]);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        fetchStats();
        fetchContactsData();
      }, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, timeRange]);

  // Realtime data auto-refresh (every 30 seconds)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        fetchRealtimeData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const COLORS = ['#a78bfa', '#c084fc', '#e879f9', '#f0abfc', '#fbbf24'];

  const getAlerts = () => {
    if (!stats) return [];
    const alerts = [];

    if (parseFloat(stats.performance?.avgLCP || 0) > 2500) {
      alerts.push({ type: 'warning', message: 'LCP is above 2.5s (Poor)' });
    }
    if (parseFloat(stats.performance?.avgFID || 0) > 100) {
      alerts.push({ type: 'warning', message: 'FID is above 100ms (Poor)' });
    }
    if (parseFloat(stats.performance?.avgCLS || 0) > 0.1) {
      alerts.push({ type: 'warning', message: 'CLS is above 0.1 (Poor)' });
    }
    if (parseFloat(stats.engagement?.bounceRate || 0) > 70) {
      alerts.push({ type: 'warning', message: `High bounce rate: ${stats.engagement?.bounceRate || 0}%` });
    }
    if (parseFloat(stats.errorRate || 0) > 1) {
      alerts.push({ type: 'error', message: `Error rate: ${stats.errorRate || 0}% (${stats.errorCount || 0} errors)` });
    }

    return alerts;
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>🔒 Dashboard - {adminEmail}</title>
          <style>{`
            * { cursor: auto !important; }
          `}</style>
        </Head>
        <div className="lg:min-h-screen bg-black flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
            <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mb-2">Analytics Dashboard</h1>
              <p className="text-gray-light-3 text-center mb-6">Enter password to access</p>
              
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-black border border-gray-light-1/20 rounded-lg text-white focus:border-indigo-light focus:outline-none mb-4"
                  autoFocus
                />
                
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-indigo-light hover:bg-indigo-light/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Access Dashboard'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Head>
          <title>📊 Analytics - {adminEmail}</title>
          <style>{`
            * { cursor: auto !important; }
          `}</style>
        </Head>
        <div className="lg:min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
      </>
    );
  }

  const alerts = getAlerts();

  return (
    <>
      <Head>
        <title>📊 Analytics Dashboard - {adminEmail}</title>
        <style>{`
          * { cursor: auto !important; }
          select option { background-color: #1a1a1a; color: white; }
        `}</style>
      </Head>
      <div className="lg:min-h-screen bg-black text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/*(Rest of dashboard JSX from previous version - continued in next part)*/}
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-indigo-light to-purple-500">Analytics Dashboard</h1>
                {realtimeData && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-semibold">{realtimeData.activeVisitors} Active</span>
                  </motion.div>
                )}
              </div>
              <p className="text-gray-light-3 mt-1">Portfolio Performance Metrics</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-light-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{adminEmail}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-dark border border-gray-light-1/20 rounded-lg text-white focus:border-indigo-light focus:outline-none text-sm cursor-pointer"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                <option value="24h" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Last 24 Hours</option>
                <option value="7d" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Last 7 Days</option>
                <option value="30d" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Last 30 Days</option>
                <option value="90d" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Last 90 Days</option>
              </select>

              <button onClick={exportData} className="px-4 py-2 bg-gray-dark border border-gray-light-1/20 rounded-lg hover:border-indigo-light/30 transition-colors flex items-center gap-2" title="Export Data">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </button>

              <button onClick={fetchRealtimeData} className="px-4 py-2 bg-gray-dark border border-gray-light-1/20 rounded-lg hover:border-green-400/30 transition-colors" title="Refresh Realtime">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>

              <button onClick={fetchStats} disabled={refreshing} className="px-4 py-2 bg-gray-dark border border-gray-light-1/20 rounded-lg hover:border-indigo-light/30 transition-colors disabled:opacity-50">
                <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('dashboard_auth'); }} className="px-4 py-2 bg-gray-dark border border-gray-light-1/20 rounded-lg hover:border-red-400/30 transition-colors text-red-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {alerts.map((alert, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`flex items-center gap-3 p-4 rounded-lg border ${alert.type === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <svg className={`w-5 h-5 flex-shrink-0 ${alert.type === 'error' ? 'text-red-400' : 'text-yellow-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm">{alert.message}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} title="Total Visitors" value={(stats.overview?.totalVisitors || 0).toLocaleString()} change={`${stats.overview?.totalSessions || 0} sessions`} />
            <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} title="New Visitors" value={(stats.overview?.newVisitors || 0).toLocaleString()} change={`${stats.overview?.returningVisitors || 0} returning`} />
            <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Avg. Duration" value={`${Math.floor((stats.engagement?.avgDuration || 0) / 60)}:${((stats.engagement?.avgDuration || 0) % 60).toString().padStart(2, '0')}`} change={`${stats.engagement?.avgPagesPerSession || 0} pages/session`} />
            <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Bounce Rate" value={`${stats.engagement?.bounceRate || 0}%`} change={(stats.engagement?.bounceRate || 0) < 50 ? 'Good' : (stats.engagement?.bounceRate || 0) < 70 ? 'Average' : 'High'} />
          </div>

          {/* Hourly Traffic & Recent Activity */}
          {realtimeData && realtimeData.hourlyTraffic && realtimeData.recentActivity && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Hourly Traffic (Last 24h)" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={realtimeData.hourlyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="font-semibold">Recent Activity</h3>
                  </div>
                  <div className="text-xs text-gray-light-3">Live</div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(realtimeData.recentActivity || []).slice(0, 8).map((activity, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 bg-black/30 rounded-lg text-sm"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-gray-light-2">
                          <span className="truncate">{activity.page}</span>
                          <span className="text-gray-light-3">•</span>
                          <span>{activity.location}</span>
                        </div>
                        <div className="text-xs text-gray-light-3 mt-0.5">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Entry & Exit Pages */}
          {realtimeData && realtimeData.entryPages && realtimeData.exitPages && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DataCard title="Top Entry Pages" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>} data={(realtimeData.entryPages || []).map(p => ({ label: p.page, value: p.count }))} />
              <DataCard title="Top Exit Pages" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>} data={(realtimeData.exitPages || []).map(p => ({ label: p.page, value: p.count }))} />
            </div>
          )}

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard title="Traffic Trend" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="sessions" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Traffic Sources" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={[{ name: 'Direct', value: stats.trafficSources?.direct || 0 }, { name: 'Social', value: stats.trafficSources?.social || 0 }, { name: 'Search', value: stats.trafficSources?.search || 0 }, { name: 'Other', value: stats.trafficSources?.other || 0 }]} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard title="Device Breakdown" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[{ device: 'Mobile', count: stats.devices?.counts?.mobile || 0 }, { device: 'Desktop', count: stats.devices?.counts?.desktop || 0 }, { device: 'Tablet', count: stats.devices?.counts?.tablet || 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="device" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Browsers" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.devices?.browsers || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#c084fc" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Location & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <DataCard title="Top Countries" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} data={(stats.overview?.topCountries || []).map(c => ({ label: c.name, value: c.count }))} />
            <DataCard title="Top Cities" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} data={(stats.overview?.topCities || []).map(c => ({ label: c.name, value: c.count }))} />

            <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="font-semibold">Core Web Vitals</h3>
              </div>
              <div className="space-y-3">
                <MetricBar label="LCP" value={`${stats.performance?.avgLCP || 0}ms`} percentage={(parseFloat(stats.performance?.avgLCP || 0) / 4000) * 100} status={parseFloat(stats.performance?.avgLCP || 0) < 2500 ? 'good' : parseFloat(stats.performance?.avgLCP || 0) < 4000 ? 'average' : 'poor'} />
                <MetricBar label="FID" value={`${stats.performance?.avgFID || 0}ms`} percentage={(parseFloat(stats.performance?.avgFID || 0) / 300) * 100} status={parseFloat(stats.performance?.avgFID || 0) < 100 ? 'good' : parseFloat(stats.performance?.avgFID || 0) < 300 ? 'average' : 'poor'} />
                <MetricBar label="CLS" value={stats.performance?.avgCLS || 0} percentage={(parseFloat(stats.performance?.avgCLS || 0) / 0.25) * 100} status={parseFloat(stats.performance?.avgCLS || 0) < 0.1 ? 'good' : parseFloat(stats.performance?.avgCLS || 0) < 0.25 ? 'average' : 'poor'} />
                <MetricBar label="Load Time" value={`${stats.performance?.avgLoadTime || 0}ms`} percentage={(parseFloat(stats.performance?.avgLoadTime || 0) / 5000) * 100} status={parseFloat(stats.performance?.avgLoadTime || 0) < 3000 ? 'good' : parseFloat(stats.performance?.avgLoadTime || 0) < 5000 ? 'average' : 'poor'} />
              </div>
            </div>
          </div>

          {/* Conversions & Top Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold">Goal Conversions</h3>
              </div>
              <div className="space-y-4">
                <ConversionRow icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} label="CV Downloads" value={stats.conversions?.downloads || 0} />
                <ConversionRow icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} label="Contact Submissions" value={stats.conversions?.contactSubmissions || 0} />
                <ConversionRow icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>} label="Social Link Clicks" value={stats.conversions?.socialClicks || 0} />
              </div>
            </div>

            <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="font-semibold">Top Pages</h3>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {(stats.topPages || []).slice(0, 10).map((page, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-light-1/10 last:border-0">
                    <span className="text-gray-light-2 text-sm truncate flex-1">{page.path || '/'}</span>
                    <span className="text-indigo-light font-semibold ml-4">{page.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Submissions & Feedbacks */}
          {contactsData && contactsData.contacts && contactsData.feedbacks && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-semibold">Contact Submissions</h3>
                  </div>
                  <span className="text-sm text-indigo-light font-semibold">{contactsData.totalContacts}</span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {contactsData.contacts.length === 0 ? (
                    <p className="text-gray-light-3 text-sm text-center py-8">No contact submissions yet</p>
                  ) : (
                    (contactsData.contacts || []).slice(0, 10).map((contact, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-black/30 rounded-lg border border-gray-light-1/10 hover:border-indigo-light/20 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-white">{contact.name}</p>
                            <a href={`mailto:${contact.email}`} className="text-sm text-indigo-light hover:underline">{contact.email}</a>
                          </div>
                          <span className="text-xs text-gray-light-3">{new Date(contact.timestamp).toLocaleDateString()}</span>
                        </div>
                        {contact.message && (
                          <p className="text-sm text-gray-light-2 line-clamp-2">{contact.message}</p>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h3 className="font-semibold">User Feedback</h3>
                  </div>
                  <span className="text-sm text-indigo-light font-semibold">{contactsData.totalFeedbacks}</span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {contactsData.feedbacks.length === 0 ? (
                    <p className="text-gray-light-3 text-sm text-center py-8">No feedback yet</p>
                  ) : (
                    (contactsData.feedbacks || []).slice(0, 10).map((feedback, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-black/30 rounded-lg border border-gray-light-1/10 hover:border-indigo-light/20 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{feedback.name}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-light-3">{new Date(feedback.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-light-2 line-clamp-2">{feedback.feedback}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, title, value, change }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6 hover:border-indigo-light/30 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-black/50 rounded-lg text-indigo-light">{icon}</div>
    </div>
    <h3 className="text-gray-light-3 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className="text-gray-light-3 text-xs">{change}</p>
  </motion.div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
    <div className="flex items-center gap-2 mb-4">
      <div className="text-indigo-light">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const DataCard = ({ title, icon, data }) => (
  <div className="bg-gray-dark border border-gray-light-1/20 rounded-lg p-6">
    <div className="flex items-center gap-2 mb-4">
      <div className="text-indigo-light">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-light-1/10 last:border-0">
          <span className="text-gray-light-2 text-sm truncate flex-1">{item.label}</span>
          <span className="text-indigo-light font-semibold ml-4">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const MetricBar = ({ label, value, percentage, status }) => {
  const statusColors = { good: 'bg-green-400', average: 'bg-yellow-400', poor: 'bg-red-400' };
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-light-2">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
      <div className="w-full bg-black/50 rounded-full h-2">
        <div className={`h-2 rounded-full ${statusColors[status]}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  );
};

const ConversionRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="text-indigo-light">{icon}</div>
      <span className="text-gray-light-2">{label}</span>
    </div>
    <span className="text-xl font-bold text-white">{value}</span>
  </div>
);

export default Dashboard;
