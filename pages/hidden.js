import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem("dashboardAuth");
    if (auth === "authenticated") {
      setIsAuthenticated(true);
      loadAnalytics();
    }
    setLoading(false);
  }, []);

  const loadAnalytics = () => {
    // Load analytics from localStorage
    const pageViews = JSON.parse(localStorage.getItem("analytics_pageViews") || "[]");
    const interactions = JSON.parse(localStorage.getItem("analytics_interactions") || "[]");
    const sessions = JSON.parse(localStorage.getItem("analytics_sessions") || "[]");

    setAnalytics({
      pageViews,
      interactions,
      sessions,
      totalViews: pageViews.length,
      totalInteractions: interactions.length,
      totalSessions: sessions.length,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password protection (in production, use proper authentication)
    if (password === "ayman2024") {
      sessionStorage.setItem("dashboardAuth", "authenticated");
      setIsAuthenticated(true);
      loadAnalytics();
    } else {
      alert("Incorrect password");
    }
  };

  const getTopPages = () => {
    if (!analytics) return [];
    const pageCounts = {};
    analytics.pageViews.forEach((view) => {
      pageCounts[view.page] = (pageCounts[view.page] || 0) + 1;
    });
    return Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getInteractionStats = () => {
    if (!analytics) return {};
    const stats = {
      clicks: 0,
      scrolls: 0,
      formSubmissions: 0,
      downloads: 0,
      other: 0,
    };
    analytics.interactions.forEach((interaction) => {
      if (stats[interaction.type] !== undefined) {
        stats[interaction.type]++;
      } else {
        stats.other++;
      }
    });
    return stats;
  };

  const getDeviceStats = () => {
    if (!analytics) return {};
    const devices = {};
    analytics.sessions.forEach((session) => {
      const device = session.device || "Unknown";
      devices[device] = (devices[device] || 0) + 1;
    });
    return devices;
  };

  const getLocationStats = () => {
    if (!analytics) return {};
    const locations = {};
    analytics.sessions.forEach((session) => {
      const location = session.location || "Unknown";
      locations[location] = (locations[location] || 0) + 1;
    });
    return locations;
  };

  const getReferrerStats = () => {
    if (!analytics) return {};
    const referrers = {};
    analytics.sessions.forEach((session) => {
      const referrer = session.referrer || "Direct";
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });
    return referrers;
  };

  const getRecentActivity = () => {
    if (!analytics) return [];
    const allActivity = [
      ...analytics.pageViews.map((v) => ({ ...v, type: "pageView" })),
      ...analytics.interactions.map((i) => ({ ...i, type: "interaction" })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);
    return allActivity;
  };

  const clearAnalytics = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      localStorage.removeItem("analytics_pageViews");
      localStorage.removeItem("analytics_interactions");
      localStorage.removeItem("analytics_sessions");
      loadAnalytics();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Head>
          <title>Analytics Dashboard - Protected</title>
        </Head>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-8 rounded-lg shadow-2xl max-w-md w-full border border-indigo-light/20"
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🔒 Analytics Dashboard
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-light mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-light to-purple-500 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-indigo-light transition-all duration-300"
            >
              Access Dashboard
            </button>
          </form>
          <p className="text-gray-500 text-sm text-center mt-4">
            Protected analytics page
          </p>
        </motion.div>
      </div>
    );
  }

  const topPages = getTopPages();
  const interactionStats = getInteractionStats();
  const deviceStats = getDeviceStats();
  const locationStats = getLocationStats();
  const referrerStats = getReferrerStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <Head>
        <title>Analytics Dashboard - Ayman Chabbaki</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-light to-purple-500 bg-clip-text text-transparent mb-2">
                📊 Analytics Dashboard
              </h1>
              <p className="text-gray-400">Real-time portfolio insights</p>
            </div>
            <button
              onClick={clearAnalytics}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 border border-red-500/30"
            >
              Clear Data
            </button>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={analytics?.totalViews || 0}
            icon="👁️"
            delay={0.1}
          />
          <StatCard
            title="Interactions"
            value={analytics?.totalInteractions || 0}
            icon="🖱️"
            delay={0.2}
          />
          <StatCard
            title="Sessions"
            value={analytics?.totalSessions || 0}
            icon="👥"
            delay={0.3}
          />
          <StatCard
            title="Avg. Session"
            value={`${Math.round((analytics?.pageViews.length / Math.max(analytics?.totalSessions, 1)) * 10) / 10} pages`}
            icon="⏱️"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📄 Top Pages
            </h2>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex justify-between items-center">
                  <span className="text-gray-300 truncate flex-1">{page.page}</span>
                  <span className="text-indigo-light font-bold ml-4">
                    {page.count} views
                  </span>
                </div>
              ))}
              {topPages.length === 0 && (
                <p className="text-gray-500">No page views yet</p>
              )}
            </div>
          </motion.div>

          {/* Interaction Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🎯 Interaction Types
            </h2>
            <div className="space-y-3">
              {Object.entries(interactionStats).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-300 capitalize">{type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-light to-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(count / Math.max(...Object.values(interactionStats), 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-indigo-light font-bold w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Device Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              💻 Devices
            </h2>
            <div className="space-y-2">
              {Object.entries(deviceStats).map(([device, count]) => (
                <div key={device} className="flex justify-between">
                  <span className="text-gray-300">{device}</span>
                  <span className="text-indigo-light font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(deviceStats).length === 0 && (
                <p className="text-gray-500">No device data</p>
              )}
            </div>
          </motion.div>

          {/* Location Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🌍 Locations
            </h2>
            <div className="space-y-2">
              {Object.entries(locationStats).map(([location, count]) => (
                <div key={location} className="flex justify-between">
                  <span className="text-gray-300">{location}</span>
                  <span className="text-indigo-light font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(locationStats).length === 0 && (
                <p className="text-gray-500">No location data</p>
              )}
            </div>
          </motion.div>

          {/* Referrer Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gray-900 rounded-lg p-6 border border-gray-800"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🔗 Traffic Sources
            </h2>
            <div className="space-y-2">
              {Object.entries(referrerStats).map(([referrer, count]) => (
                <div key={referrer} className="flex justify-between">
                  <span className="text-gray-300 truncate flex-1 mr-2">
                    {referrer}
                  </span>
                  <span className="text-indigo-light font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(referrerStats).length === 0 && (
                <p className="text-gray-500">No referrer data</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ⚡ Recent Activity
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {activity.type === "pageView" ? "👁️" : "🖱️"}
                  </span>
                  <div>
                    <p className="text-white font-medium">
                      {activity.page || activity.action || activity.element}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {activity.type === "pageView" ? "Page View" : activity.type}
                    </p>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-gray-500 text-center py-8">No activity yet</p>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Analytics are stored locally in your browser</p>
          <p className="mt-2">
            Session active • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-indigo-light/30 transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </motion.div>
);

export default AnalyticsDashboard;
