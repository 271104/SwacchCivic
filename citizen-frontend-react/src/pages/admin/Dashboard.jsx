// pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminAPI } from '../../services/adminAPI';
import Loading from '../../components/common/Loading';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getOverviewStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats?.complaints?.total || 0,
      icon: '📋',
      color: 'bg-blue-500',
      subtext: `${stats?.complaints?.recentWeek || 0} this week`
    },
    {
      title: 'Pending Complaints',
      value: stats?.complaints?.pending || 0,
      icon: '⏳',
      color: 'bg-yellow-500',
      subtext: 'Awaiting action'
    },
    {
      title: 'Resolved Complaints',
      value: stats?.complaints?.resolved || 0,
      icon: '✅',
      color: 'bg-green-500',
      subtext: `${stats?.complaints?.resolutionRate || 0}% resolution rate`
    },
    {
      title: 'Active Officers',
      value: stats?.users?.totalOfficers || 0,
      icon: '👮',
      color: 'bg-purple-500',
      subtext: `${stats?.users?.pendingOfficers || 0} pending approval`
    },
    {
      title: 'Total Citizens',
      value: stats?.users?.totalCitizens || 0,
      icon: '👥',
      color: 'bg-indigo-500',
      subtext: 'Registered users'
    },
    {
      title: 'Departments',
      value: stats?.departments?.total || 0,
      icon: '🏢',
      color: 'bg-red-500',
      subtext: 'Active departments'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to SMC Admin Portal</p>
          </div>

          {/* Pending Approvals Alert */}
          {stats?.users?.pendingOfficers > 0 && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-yellow-800">
                      {stats.users.pendingOfficers} Officer{stats.users.pendingOfficers > 1 ? 's' : ''} Awaiting Approval
                    </p>
                    <p className="text-sm text-yellow-700">Review and approve pending officer registrations</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin/officers/pending')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Review Now
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} text-white text-3xl p-3 rounded-lg`}>
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
                <h3 className="text-gray-700 font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.subtext}</p>
              </div>
            ))}
          </div>

          {/* Complaints by Type */}
          {stats?.complaintsByType && stats.complaintsByType.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Complaints by Type</h2>
              <div className="space-y-3">
                {stats.complaintsByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{item._id || 'Unknown'}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${(item.count / stats.complaints.total) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-gray-900 font-semibold w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin/departments')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">🏢</div>
                <h3 className="font-semibold text-gray-900">Manage Departments</h3>
                <p className="text-sm text-gray-600 mt-1">Add or edit departments</p>
              </button>
              
              <button
                onClick={() => navigate('/admin/officers')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">👮</div>
                <h3 className="font-semibold text-gray-900">Manage Officers</h3>
                <p className="text-sm text-gray-600 mt-1">View all officers</p>
              </button>
              
              <button
                onClick={() => navigate('/admin/officers/pending')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">⏳</div>
                <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
                <p className="text-sm text-gray-600 mt-1">Review officer requests</p>
              </button>
              
              <button
                onClick={() => navigate('/admin/statistics')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900">View Statistics</h3>
                <p className="text-sm text-gray-600 mt-1">Detailed analytics</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
