import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import { complaintsAPI } from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ResolvedComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

            // Filter resolved and sort by resolution date (newest first)
            const resolved = allComplaints
                .filter((c) => c.status === 'resolved')
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            setComplaints(resolved);
        } catch (error) {
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

    if (loading) return <Loading message="Loading resolved complaints..." />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="max-w-7xl mx-auto pt-8">
                {/* Header */}
                <Link to="/officer/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Resolved Complaints</h1>
                    <p className="text-gray-400">View history of completed complaints</p>
                </div>

                {/* Search */}
                <div className="bg-gray-800 rounded-xl shadow-card p-4 mb-6 border border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by type or location..."
                            className="w-full px-4 py-2.5 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Complaints Grid */}
                {filteredComplaints.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl shadow-card p-12 text-center border border-gray-700">
                        <CheckCircle2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No resolved complaints</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredComplaints.map((complaint) => (
                            <div key={complaint._id} className="bg-gray-800 border border-gray-700 rounded-xl shadow-card p-6 hover:shadow-soft transition-shadow">
                                {/* Image */}
                                {complaint.photoUrl && (
                                    <img
                                        src={complaint.photoUrl}
                                        alt={complaint.type}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                        onError={(e) => {
                                            console.error('Image load error:', complaint.photoUrl);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}

                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-xl font-bold text-white">{complaint.type}</h3>
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
                                        <p className="text-gray-400 text-sm">📍 {complaint.location}</p>
                                    )}

                                    {complaint.description && (
                                        <p className="text-gray-300">{complaint.description}</p>
                                    )}

                                    {complaint.aiAnalysis?.aiDescription && (
                                        <div className="p-3 bg-green-900 bg-opacity-20 rounded-lg border border-green-800">
                                            <p className="text-xs text-green-300 font-medium mb-1">🤖 AI Analysis</p>
                                            <p className="text-sm text-green-100">{complaint.aiAnalysis.aiDescription}</p>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-700 space-y-1">
                                        <p className="text-xs text-gray-500">
                                            Submitted: {formatDate(complaint.createdAt)}
                                        </p>
                                        <p className="text-xs text-green-400">
                                            ✓ Resolved: {formatDate(complaint.updatedAt)}
                                        </p>
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
