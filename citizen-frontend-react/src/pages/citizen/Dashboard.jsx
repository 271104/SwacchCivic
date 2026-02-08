import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, PlusCircle, LogOut, User, Building2 } from 'lucide-react';
import SMCHeader from '../../components/common/SMCHeader';
import SMCFooter from '../../components/common/SMCFooter';

export default function CitizenDashboard() {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            title: 'Register Complaint',
            titleMarathi: 'तक्रार नोंदणी',
            description: 'Report a new civic issue with photo evidence',
            descriptionMarathi: 'फोटो पुराव्यासह नवीन नागरी समस्या नोंदवा',
            icon: PlusCircle,
            link: '/register-complaint',
            color: 'bg-blue-600',
            hoverColor: 'hover:bg-blue-700',
        },
        {
            title: 'My Complaints',
            titleMarathi: 'माझ्या तक्रारी',
            description: 'View and track your submitted complaints',
            descriptionMarathi: 'तुमच्या सबमिट केलेल्या तक्रारी पहा आणि ट्रॅक करा',
            icon: FileText,
            link: '/my-complaints',
            color: 'bg-green-600',
            hoverColor: 'hover:bg-green-700',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
            <SMCHeader title="Citizen Dashboard | नागरिक डॅशबोर्ड" />
            
            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Welcome, {user?.name}!
                            </h2>
                            <p className="text-lg text-gray-600 mb-1">
                                स्वागत आहे, {user?.name}!
                            </p>
                            <p className="text-gray-600 text-sm">
                                Report civic issues and track their resolution status
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 rounded-lg transition-all font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Menu Cards */}
                <div className="grid md:grid-cols-2 gap-6 animate-slide-up mb-8">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`${item.color} ${item.hoverColor} p-4 rounded-xl transition-colors shadow-lg`}>
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-blue-600 font-medium mb-2">{item.titleMarathi}</p>
                                        <p className="text-gray-600 text-sm">{item.description}</p>
                                        <p className="text-gray-500 text-xs mt-1">{item.descriptionMarathi}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3 border-t border-blue-200">
                                <p className="text-blue-700 text-sm font-medium">Click to proceed →</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-900 mb-2 text-lg">📱 Easy Registration</h4>
                        <p className="text-sm text-gray-700">
                            Register complaints quickly with photo evidence and location details
                        </p>
                        <p className="text-xs text-gray-500 mt-1">फोटो पुरावा आणि स्थान तपशीलांसह तक्रारी त्वरीत नोंदवा</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                        <h4 className="font-bold text-green-900 mb-2 text-lg">⚡ Fast Response</h4>
                        <p className="text-sm text-gray-700">
                            SMC officers review and resolve complaints promptly
                        </p>
                        <p className="text-xs text-gray-500 mt-1">एसएमसी अधिकारी तक्रारींचे त्वरित पुनरावलोकन आणि निराकरण करतात</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                        <h4 className="font-bold text-yellow-900 mb-2 text-lg">📊 Real-time Tracking</h4>
                        <p className="text-sm text-gray-700">
                            Track your complaint status from submission to resolution
                        </p>
                        <p className="text-xs text-gray-500 mt-1">सबमिशनपासून निराकरणापर्यंत तुमच्या तक्रारीची स्थिती ट्रॅक करा</p>
                    </div>
                </div>
            </main>
            
            <SMCFooter />
        </div>
    );
}
