// pages/admin/Complaints.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminAPI } from '../../services/adminAPI';
import Loading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { getPhotoUrl } from '../../utils/photoUrl';

const Complaints = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  
  const [allComplaints, setAllComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(statusFilter);

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [selectedStatus, allComplaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // Fetch all complaints without status filter
      const data = await adminAPI.getComplaints({});
      setAllComplaints(data.complaints || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load complaints:', err);
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    if (selectedStatus === 'all') {
      setComplaints(allComplaints);
    } else {
      setComplaints(allComplaints.filter(c => c.status === selectedStatus));
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return allComplaints.length;
    return allComplaints.filter(c => c.status === status).length;
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
            <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
            <p className="text-gray-600 mt-2">View and manage all complaints</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Status Filter Tabs */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Complaints', color: 'bg-gray-100 text-gray-800' },
                { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
                { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
                { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedStatus(tab.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStatus === tab.value
                      ? tab.color + ' ring-2 ring-offset-2 ring-gray-400'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">
                    {getStatusCount(tab.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id || complaint.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{complaint.type}</h3>
                      <StatusBadge status={complaint.status} />
                      {complaint.aiAnalysis?.priorityLevel && complaint.aiAnalysis.priorityLevel !== 'undefined' && (
                        <PriorityBadge priority={complaint.aiAnalysis.priorityLevel} />
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{complaint.description || complaint.aiAnalysis?.aiDescription || 'No description'}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📍 {complaint.location}</span>
                      <span>👤 {complaint.citizen?.name || 'Unknown'}</span>
                      <span>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {complaint.photoUrl && (
                    <img
                      src={getPhotoUrl(complaint.photoPath)}
                      alt="Complaint"
                      className="w-32 h-32 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>

                {/* AI Analysis */}
                {complaint.aiAnalysis && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Severity</p>
                        <p className="font-semibold text-gray-900">{complaint.aiAnalysis.severity}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Priority Score</p>
                        <p className="font-semibold text-gray-900">{complaint.aiAnalysis.priorityScore || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Department</p>
                        <p className="font-semibold text-gray-900">{complaint.assignedDepartment?.name || 'Unassigned'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confidence</p>
                        <p className="font-semibold text-gray-900">{complaint.aiAnalysis.confidence || 0}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {complaints.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No complaints found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Complaints;
