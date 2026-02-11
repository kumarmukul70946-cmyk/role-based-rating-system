

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Store, LayoutDashboard, Database } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-gray-900 border-b border-gray-800 text-gray-300 shadow-md relative z-50">
            {/* Top glowing line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 shadow-lg ${user?.role === 'ADMIN' ? 'bg-cyan-500 shadow-cyan-500/50' : user?.role === 'OWNER' ? 'bg-green-500 shadow-green-500/50' : 'bg-pink-500 shadow-pink-500/50'}`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Database size={24} className="text-white animate-pulse" />
                    <span className="text-xl font-bold font-mono tracking-widest text-white uppercase ml-2">
                        Nexus<span className={user?.role === 'ADMIN' ? 'text-cyan-400' : user?.role === 'OWNER' ? 'text-green-400' : 'text-pink-400'}>Core</span>
                    </span>
                </div>

                <div className="flex space-x-8 items-center font-mono text-xs uppercase tracking-widest">
                    {user?.role === 'ADMIN' && (
                        <>
                            <Link to="/admin/dashboard" className="px-3 py-2 rounded hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center group">
                                <LayoutDashboard size={14} className="mr-2 group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> Dashboard
                            </Link>
                            <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center group">
                                <User size={14} className="mr-2 group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> Users
                            </Link>
                            <Link to="/admin/stores" className="px-3 py-2 rounded hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center group">
                                <Store size={14} className="mr-2 group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> Stores
                            </Link>
                        </>
                    )}
                    {user?.role === 'OWNER' && (
                        <Link to="/owner/dashboard" className="px-3 py-2 rounded hover:bg-green-500/10 hover:text-green-400 transition-colors flex items-center group">
                            <LayoutDashboard size={14} className="mr-2 group-hover:drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" /> Dashboard
                        </Link>
                    )}
                    {user?.role === 'USER' && (
                        <Link to="/stores" className="px-3 py-2 rounded hover:bg-pink-500/10 hover:text-pink-400 transition-colors flex items-center group">
                            <Store size={14} className="mr-2 group-hover:drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" /> Marketplace
                        </Link>
                    )}

                    <div className="flex items-center space-x-6 pl-6 border-l border-gray-800">
                        <Link to="/profile" className="hover:text-white transition-colors flex items-center group relative">
                            <div className={`w-2 h-2 rounded-full mr-2 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.8)] ${user?.role === 'ADMIN' ? 'bg-cyan-500' : user?.role === 'OWNER' ? 'bg-green-500' : 'bg-pink-500'}`}></div>
                            {user?.name}
                        </Link>
                        <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 flex items-center transition-colors group">
                            <LogOut size={14} className="mr-2 group-hover:animate-pulse" /> EXIT
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
