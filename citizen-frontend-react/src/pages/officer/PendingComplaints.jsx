import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { complaintsAPI } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function PendingComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    useEffect(() => {
        filterComplaints();
    }, [searchTerm, complaints]);

    const fetchComplaints = async () => {
        try {
            const response = await complaintsAPI.getAll();
            const allComplaints = response.data.complaints || [];
            
            console.log('Fetched complaints:', allComplaints.length);
            if (allComplaints.length > 0) {
                console.log('First complaint sample:', {
                    _id: allComplaints[0]._id,
                    id: allComplaints[0].id,
                    type: allComplaints[0].type,
                    hasPhotoUrl: !!allComplaints[0].photoUrl,
                    hasPhotoPath: !!allComplaints[0].photoPath
                });
            }

            // Filter pending and sort by priority score (highest first)
            const pending = allComplaints
                .filter((c) => c.status === 'pending' || c.status === 'in_progress')
                .sort((a, b) => {
                    const scoreA = a.aiAnalysis?.priorityScore || 50;
                    const scoreB = b.aiAnalysis?.priorityScore || 50;
                    return scoreB - scoreA; // Descending order
                });

            setComplaints(pending);
        } catch (error) {
            console.error('Fetch complaints error:', error);
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const filterComplaints = () => {
        if (!searchTerm) {
            setFilteredComplaints(complaints);
            return;
        }

        const filtered = complaints.filter(
            (c) =>
                c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredComplaints(filtered);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        console.log('Updating complaint:', { id, newStatus, type: typeof id });
        
        if (!id) {
            toast.error('Invalid complaint ID');
            return;
        }
        
        setUpdating(id);
        try {
            await complaintsAPI.updateStatus(id, newStatus);
            toast.success(`Complaint marked as ${newStatus.replace('_', ' ')}`);
            fetchComplaints();
        } catch (error) {
            console.error('Update status error:', error);
            toast.error('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <Loading message="Loading pending complaints..." />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="max-w-7xl mx-auto pt-8">
                {/* Header */}
                <Link to="/officer/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Pending Complaints</h1>
                    <p className="text-gray-400">Sorted by AI-calculated priority (highest first)</p>
                </div>

                {/* Search */}
                <div className="bg-gray-800 rounded-xl shadow-card p-4 mb-6 border border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by type or location..."
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Complaints List */}
                {filteredComplaints.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl shadow-card p-12 text-center border border-gray-700">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No pending complaints</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredComplaints.map((complaint) => (
                            <div key={complaint._id} className="bg-gray-800 border border-gray-700 rounded-xl shadow-card p-6 hover:shadow-soft transition-shadow">
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Image */}
                                    <div>
                                        {complaint.photoUrl && (
                                            <img
                                                src={complaint.photoUrl}
                                                alt={complaint.type}
                                                className="w-full h-48 object-cover rounded-lg"
                                                onError={(e) => {
                                                    console.error('Image load error:', complaint.photoUrl);
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">{complaint.type}</h3>
                                                <p className="text-gray-400 text-sm">📍 {complaint.location || 'No location'}</p>
                                            </div>
                                            <StatusBadge status={complaint.status} />
                                        </div>

                                        {/* Priority & Severity */}
                                        {complaint.aiAnalysis && (
                                            <div className="flex flex-wrap gap-3">
                                                <PriorityBadge
                                                    level={complaint.aiAnalysis.priorityLevel}
                                                    score={complaint.aiAnalysis.priorityScore}
                                                />
                                                {complaint.aiAnalysis.severity && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-900 text-blue-200 border border-blue-700">
                                                        Severity: {complaint.aiAnalysis.severity}%
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* AI Description */}
                                        {complaint.aiAnalysis?.aiDescription && (
                                            <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-800">
                                                <p className="text-xs text-blue-300 font-medium mb-1">🤖 AI Analysis</p>
                                                <p className="text-sm text-blue-100">{complaint.aiAnalysis.aiDescription}</p>
                                            </div>
                                        )}

                                        {/* Detected Issues */}
                                        {complaint.aiAnalysis?.detectedIssues && complaint.aiAnalysis.detectedIssues.length > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-400 mb-2">Detected Issues:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {complaint.aiAnalysis.detectedIssues.map((issue, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-orange-900 bg-opacity-30 text-orange-200 rounded text-xs border border-orange-800">
                                                            {issue.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Description */}
                                        {complaint.description && (
                                            <p className="text-gray-300">{complaint.description}</p>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                            <p className="text-xs text-gray-500">
                                                Submitted: {formatDate(complaint.createdAt)}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                {complaint.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(complaint._id || complaint.id, 'in_progress')}
                                                        disabled={updating === (complaint._id || complaint.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {updating === (complaint._id || complaint.id) ? 'Updating...' : 'Start Work'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusUpdate(complaint._id || complaint.id, 'resolved')}
                                                    disabled={updating === (complaint._id || complaint.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                                                >
                                                    {updating === (complaint._id || complaint.id) ? 'Updating...' : 'Mark Resolved'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
