import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, Shield, LogOut } from 'lucide-react';

export default function OfficerDashboard() {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            title: 'Pending Complaints',
            description: 'View and manage complaints awaiting resolution',
            icon: Clock,
            link: '/officer/pending',
            color: 'bg-orange-500',
            hoverColor: 'hover:bg-orange-600',
        },
        {
            title: 'Resolved Complaints',
            description: 'View history of resolved complaints',
            icon: CheckCircle,
            link: '/officer/resolved',
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-white shadow-lg border-b-4 border-yellow-500">
                {/* Top Bar */}
                <div className="bg-gray-900 py-2 px-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm text-gray-300">
                        <div className="text-yellow-400 font-semibold">Officer Portal | अधिकारी पोर्टल</div>
                        <div className="hidden md:block">Government of Maharashtra</div>
                    </div>
                </div>
                
                {/* Header with Banner Background and Logo Overlay */}
                <div className="relative">
                    {/* Banner as Background */}
                    <div className="w-full h-24 md:h-32">
                        <img 
                            src="/SMC_banner.jpg" 
                            alt="Solapur Smart City" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Logo Overlaying Banner - Professional Styling */}
                    <div className="absolute top-2 left-4">
                        <div className="bg-white rounded-xl shadow-2xl p-2 md:p-3 border-2 border-blue-100">
                            <img 
                                src="/SMC_logo.jpg" 
                                alt="Solapur Municipal Corporation" 
                                className="h-14 md:h-20 w-auto object-contain"
                            />
                        </div>
                    </div>
                    
                    {/* Logout Button Overlaying Banner */}
                    <div className="absolute top-3 right-4">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-white hover:text-white hover:bg-red-600 border-2 border-red-600 rounded-lg transition-all font-medium shadow-lg"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome, Officer {user?.name}
                    </h2>
                    <p className="text-gray-400">
                        Manage and resolve citizen complaints efficiently
                    </p>
                </div>

                {/* Menu Cards */}
                <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="group bg-gray-800 border border-gray-700 rounded-xl shadow-card p-6 hover:shadow-soft hover:scale-105 transition-all duration-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${item.color} ${item.hoverColor} p-4 rounded-xl transition-colors`}>
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400">{item.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700">
                        <h4 className="font-semibold text-blue-100 mb-2">🤖 AI Prioritization</h4>
                        <p className="text-sm text-blue-200">
                            Complaints are automatically sorted by AI-calculated priority scores
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700">
                        <h4 className="font-semibold text-purple-100 mb-2">📊 Smart Insights</h4>
                        <p className="text-sm text-purple-200">
                            Get AI-powered severity assessments and issue detection
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700">
                        <h4 className="font-semibold text-green-100 mb-2">⚡ Efficient Workflow</h4>
                        <p className="text-sm text-green-200">
                            Focus on critical issues first with intelligent prioritization
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
