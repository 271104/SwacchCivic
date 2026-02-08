// pages/admin/PendingApprovals.jsx
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminAPI } from '../../services/adminAPI';
import Loading from '../../components/common/Loading';

const PendingApprovals = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingOfficers();
  }, []);

  const fetchPendingOfficers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching pending officers...');
      console.log('Admin token:', localStorage.getItem('adminToken') ? 'Present' : 'Missing');
      
      const data = await adminAPI.getPendingOfficers();
      console.log('✅ Pending officers data:', data);
      
      setOfficers(data.officers || []);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to fetch pending officers:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to load pending officers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (officerId) => {
    if (!confirm('Are you sure you want to approve this officer?')) {
      return;
    }

    try {
      setProcessing(officerId);
      await adminAPI.approveOfficer(officerId);
      await fetchPendingOfficers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve officer');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (officerId) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      setProcessing(officerId);
      await adminAPI.rejectOfficer(officerId, reason);
      await fetchPendingOfficers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject officer');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-600 mt-2">
              Review and approve officer registration requests
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Count Badge */}
          {officers.length > 0 && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-yellow-800 font-semibold">
                {officers.length} officer{officers.length > 1 ? 's' : ''} awaiting approval
              </p>
            </div>
          )}

          {/* Officers List */}
          <div className="space-y-4">
            {officers.map((officer) => (
              <div
                key={officer._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Officer Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{officer.name}</h3>
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          Pending Approval
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      <div>
                        <p className="text-sm text-gray-600">Registered On</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(officer.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Department Complaint Types */}
                    {officer.department?.complaintTypes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Complaint Types</p>
                        <div className="flex flex-wrap gap-2">
                          {officer.department.complaintTypes.map((type, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleApprove(officer._id)}
                      disabled={processing === officer._id}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{processing === officer._id ? 'Processing...' : 'Approve'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleReject(officer._id)}
                      disabled={processing === officer._id}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{processing === officer._id ? 'Processing...' : 'Reject'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {officers.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending officer approvals at the moment</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PendingApprovals;
