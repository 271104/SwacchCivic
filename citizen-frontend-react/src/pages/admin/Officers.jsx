// pages/admin/Officers.jsx
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminAPI } from '../../services/adminAPI';
import Loading from '../../components/common/Loading';

const Officers = () => {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching officers with filters:', filters);
      console.log('Admin token:', localStorage.getItem('adminToken') ? 'Present' : 'Missing');
      
      const [officersData, deptsData] = await Promise.all([
        adminAPI.getAllOfficers(filters),
        adminAPI.getDepartments()
      ]);
      
      console.log('✅ Officers data:', officersData);
      console.log('✅ Departments data:', deptsData);
      
      setOfficers(officersData.officers || []);
      setDepartments(deptsData.departments || []);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to load data:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to load officers');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (officerId) => {
    if (!confirm('Are you sure you want to revoke this officer\'s access?')) {
      return;
    }

    try {
      await adminAPI.revokeOfficer(officerId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revoke access');
    }
  };

  const handleActivate = async (officerId) => {
    try {
      await adminAPI.activateOfficer(officerId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to activate officer');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.pending;
  };

  if (loading && officers.length === 0) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Officers</h1>
            <p className="text-gray-600 mt-2">Manage all registered officers</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Name, email, or phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Officers List */}
          <div className="space-y-4">
            {officers.map((officer) => (
              <div
                key={officer._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{officer.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(officer.status)}`}>
                          {officer.status.charAt(0).toUpperCase() + officer.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{officer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{officer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Department</p>
                        <p className="font-medium text-gray-900">
                          {officer.department?.name || 'Not assigned'}
                        </p>
                      </div>
                    </div>

                    {/* Statistics */}
                    {officer.statistics && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{officer.statistics.totalComplaints}</p>
                          <p className="text-xs text-gray-600">Total</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{officer.statistics.resolvedComplaints}</p>
                          <p className="text-xs text-gray-600">Resolved</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{officer.statistics.pendingComplaints}</p>
                          <p className="text-xs text-gray-600">Pending</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    {officer.status === 'active' && (
                      <button
                        onClick={() => handleRevoke(officer._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Revoke Access
                      </button>
                    )}
                    {officer.status === 'inactive' && (
                      <button
                        onClick={() => handleActivate(officer._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {officers.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No officers found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Officers;
