import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Phone, Lock } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SMCHeader from '../../components/common/SMCHeader';
import SMCFooter from '../../components/common/SMCFooter';

export default function CitizenLogin() {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            const { user, token } = response.data;

            if (user.role !== 'citizen') {
                toast.error('Please use officer login');
                setLoading(false);
                return;
            }

            login(user, token);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <SMCHeader title="Citizen Complaint Portal" />
            
            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Login</h1>
                        <p className="text-gray-600">नागरिक लॉगिन</p>
                        <p className="text-sm text-gray-500 mt-2">Sign in to register and track complaints</p>
                    </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-soft p-8 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phone Input */}
                        <div>
                            <label className="label">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="input"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="label">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Register here
                            </Link>
                        </p>
                    </div>

                    {/* Officer Login Link */}
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                        <Link to="/officer/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            SMC Officer Login →
                        </Link>
                    </div>
                </div>
            </div>
            </div>
            
            <SMCFooter />
        </div>
    );
}
