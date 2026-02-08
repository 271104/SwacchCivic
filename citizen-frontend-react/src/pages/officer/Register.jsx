import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Phone, Lock, User, Building2 } from 'lucide-react';
import { authAPI } from '../../services/api';
import { adminAPI } from '../../services/adminAPI';
import toast from 'react-hot-toast';

export default function OfficerRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        department: ''
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDepts, setLoadingDepts] = useState(true);
    const [registered, setRegistered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            // Fetch departments from public endpoint (no auth required)
            const response = await fetch('http://localhost:5000/api/departments');
            const data = await response.json();
            
            console.log('Departments fetched:', data);
            
            if (data.departments && data.departments.length > 0) {
                setDepartments(data.departments);
            } else {
                // Fallback departments if API returns empty
                console.warn('No departments returned from API, using fallback');
                setDepartments([
                    { id: '1', name: 'Sanitation Department', complaintTypes: ['Garbage'] },
                    { id: '2', name: 'Roads & Infrastructure Department', complaintTypes: ['Road Damage'] },
                    { id: '3', name: 'Water Supply Department', complaintTypes: ['Water Leakage'] },
                    { id: '4', name: 'Electrical Department', complaintTypes: ['Street Light'] },
                    { id: '5', name: 'Drainage & Sewerage Department', complaintTypes: ['Drainage'] }
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            // Fallback departments if API fails
            toast.error('Could not load departments. Using default list.');
            setDepartments([
                { id: '1', name: 'Sanitation Department', complaintTypes: ['Garbage'] },
                { id: '2', name: 'Roads & Infrastructure Department', complaintTypes: ['Road Damage'] },
                { id: '3', name: 'Water Supply Department', complaintTypes: ['Water Leakage'] },
                { id: '4', name: 'Electrical Department', complaintTypes: ['Street Light'] },
                { id: '5', name: 'Drainage & Sewerage Department', complaintTypes: ['Drainage'] }
            ]);
        } finally {
            setLoadingDepts(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (!formData.department) {
            toast.error('Please select a department');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.officerRegister({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                department: formData.department
            });

            toast.success('Registration submitted successfully!');
            setRegistered(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (registered) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-700 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Registration Submitted!</h2>
                        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
                            <p className="text-yellow-200 text-sm mb-2">
                                ⏳ Your registration is pending admin approval
                            </p>
                            <p className="text-gray-400 text-xs">
                                You will be able to login once an administrator approves your account.
                                This usually takes 24-48 hours.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="text-left bg-gray-700/50 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">Your Details:</p>
                                <p className="text-sm text-white">📧 {formData.email}</p>
                                <p className="text-sm text-white">📱 {formData.phone}</p>
                                <p className="text-sm text-white">🏢 {departments.find(d => d.id === formData.department)?.name}</p>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <Link
                                to="/officer/login"
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Officer Registration</h1>
                    <p className="text-gray-400">Register as a municipal officer</p>
                </div>

                {/* Registration Card */}
                <div className="bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-700 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="officer@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        {/* Department Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Building2 className="w-4 h-4 inline mr-2" />
                                Department
                            </label>
                            {loadingDepts ? (
                                <div className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                                    Loading departments...
                                </div>
                            ) : (
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    required
                                >
                                    <option value="">Select your department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name} ({dept.complaintTypes?.join(', ')})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Create a password (min 6 characters)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3">
                            <p className="text-blue-200 text-xs">
                                ℹ️ Your registration will be reviewed by an administrator before you can access the system.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || loadingDepts}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Register as Officer
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                        <Link to="/officer/login" className="text-sm text-gray-400 hover:text-gray-300">
                            Already registered? Login here →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
