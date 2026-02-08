import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { complaintsAPI } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchComplaints();
    }, []);

    useEffect(() => {
        filterComplaints();
    }, [searchTerm, statusFilter, complaints]);

    const fetchComplaints = async () => {
        try {
            const response = await complaintsAPI.getMine();
            setComplaints(response.data.complaints || []);
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const filterComplaints = () => {
        let filtered = complaints;

        if (statusFilter !== 'all') {
            filtered = filtered.filter((c) => c.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (c) =>
                    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredComplaints(filtered);
    };

    if (loading) return <Loading message="Loading your complaints..." />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-6xl mx-auto pt-8">
                {/* Header */}
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Complaints</h1>
                    <p className="text-gray-600">Track all your submitted complaints</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by type or location..."
                                className="input pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="md:w-48">
                        <select
                            className="input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Complaints Grid */}
                {filteredComplaints.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-card p-12 text-center">
                        <p className="text-gray-500 text-lg">No complaints found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredComplaints.map((complaint) => (
                            <div key={complaint._id} className="card hover:shadow-soft transition-shadow">
                                {/* Image */}
                                {complaint.photoPath && (
                                    <img
                                        src={`http://localhost:5000/${complaint.photoPath.replace(/\\/g, '/')}`}
                                        alt={complaint.type}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}

                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-xl font-bold text-gray-900">{complaint.type}</h3>
                                        <StatusBadge status={complaint.status} />
                                    </div>

                                    {complaint.aiAnalysis?.priorityLevel && (
                                        <div>
                                            <PriorityBadge
                                                level={complaint.aiAnalysis.priorityLevel}
                                                score={complaint.aiAnalysis.priorityScore}
                                            />
                                        </div>
                                    )}

                                    {complaint.location && (
                                        <p className="text-gray-600 text-sm">📍 {complaint.location}</p>
                                    )}

                                    {complaint.description && (
                                        <p className="text-gray-700">{complaint.description}</p>
                                    )}

                                    {complaint.aiAnalysis?.aiDescription && (
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-xs text-blue-700 font-medium mb-1">🤖 AI Analysis</p>
                                            <p className="text-sm text-blue-900">{complaint.aiAnalysis.aiDescription}</p>
                                        </div>
                                    )}

                                    {complaint.aiAnalysis?.severity && (
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-600">
                                                Severity: <span className="font-bold text-gray-900">{complaint.aiAnalysis.severity}%</span>
                                            </span>
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-500">
                                        Submitted: {formatDate(complaint.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
