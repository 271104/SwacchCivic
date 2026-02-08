import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Citizen Pages
import CitizenLogin from './pages/citizen/Login';
import CitizenRegister from './pages/citizen/Register';
import CitizenDashboard from './pages/citizen/Dashboard';
import RegisterComplaint from './pages/citizen/RegisterComplaint';
import MyComplaints from './pages/citizen/MyComplaints';

// Officer Pages
import OfficerLogin from './pages/officer/Login';
import OfficerRegister from './pages/officer/Register';
import OfficerDashboard from './pages/officer/Dashboard';
import PendingComplaints from './pages/officer/PendingComplaints';
import ResolvedComplaints from './pages/officer/ResolvedComplaints';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Departments from './pages/admin/Departments';
import Officers from './pages/admin/Officers';
import PendingApprovals from './pages/admin/PendingApprovals';
import Statistics from './pages/admin/Statistics';

// Protected Route Component for Citizen/Officer
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();

    console.log('ProtectedRoute - Check:', {
        loading,
        isAuthenticated,
        hasUser: !!user,
        userRole: user?.role,
        requiredRole,
        path: window.location.pathname
    });

    if (loading) {
        console.log('ProtectedRoute - Still loading auth state...');
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('ProtectedRoute - Not authenticated, redirecting to login');
        return <Navigate to={requiredRole === 'officer' ? '/officer/login' : '/login'} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        console.log('ProtectedRoute - Role mismatch, redirecting');
        return <Navigate to="/" replace />;
    }

    console.log('ProtectedRoute - Access granted');
    return children;
};

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, admin, loading } = useAdmin();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Citizen Routes */}
                <Route path="/login" element={<CitizenLogin />} />
                <Route path="/register" element={<CitizenRegister />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requiredRole="citizen">
                            <CitizenDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/register-complaint"
                    element={
                        <ProtectedRoute requiredRole="citizen">
                            <RegisterComplaint />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-complaints"
                    element={
                        <ProtectedRoute requiredRole="citizen">
                            <MyComplaints />
                        </ProtectedRoute>
                    }
                />

                {/* Officer Routes */}
                <Route path="/officer/login" element={<OfficerLogin />} />
                <Route path="/officer/register" element={<OfficerRegister />} />
                <Route
                    path="/officer/dashboard"
                    element={
                        <ProtectedRoute requiredRole="officer">
                            <OfficerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/officer/pending"
                    element={
                        <ProtectedRoute requiredRole="officer">
                            <PendingComplaints />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/officer/resolved"
                    element={
                        <ProtectedRoute requiredRole="officer">
                            <ResolvedComplaints />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/departments"
                    element={
                        <AdminProtectedRoute>
                            <Departments />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/officers"
                    element={
                        <AdminProtectedRoute>
                            <Officers />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/officers/pending"
                    element={
                        <AdminProtectedRoute>
                            <PendingApprovals />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/statistics"
                    element={
                        <AdminProtectedRoute>
                            <Statistics />
                        </AdminProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AdminProvider>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </AdminProvider>
        </AuthProvider>
    );
}

export default App;
