

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                    <Navbar />
                    <div className="container mx-auto p-4">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<Navigate to="/login" />} />

                            {/* ADMIN Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/users" element={<AdminUsers />} />
                                <Route path="/admin/stores" element={<AdminStores />} />
                            </Route>

                            {/* OWNER Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
                                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                            </Route>

                            {/* USER Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
                                <Route path="/stores" element={<UserStores />} />
                            </Route>

                            {/* SHARED Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/profile" element={<Profile />} />
                            </Route>

                            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
                            <Route path="*" element={<div>404 Not Found</div>} />
                        </Routes>
                    </div>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
