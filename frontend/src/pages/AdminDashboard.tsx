
import { useEffect, useState } from 'react';
import api from '../api/client';
import { Users, ShoppingBag, Star, Activity, Plus, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const colorMap: any = {
        cyan: {
            border: 'hover:border-cyan-500',
            bg: 'bg-cyan-500/10',
            text: 'text-cyan-400',
            hoverText: 'group-hover:text-cyan-300',
            hoverShadow: 'group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]',
            line: 'bg-cyan-500'
        },
        purple: {
            border: 'hover:border-purple-500',
            bg: 'bg-purple-500/10',
            text: 'text-purple-400',
            hoverText: 'group-hover:text-purple-300',
            hoverShadow: 'group-hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]',
            line: 'bg-purple-500'
        },
        green: {
            border: 'hover:border-green-500',
            bg: 'bg-green-500/10',
            text: 'text-green-400',
            hoverText: 'group-hover:text-green-300',
            hoverShadow: 'group-hover:shadow-[0_0_10px_rgba(34,197,94,0.5)]',
            line: 'bg-green-500'
        }
    };

    const TechCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string, glow: string }) => {
        const styles = colorMap[color] || colorMap.cyan;
        return (
            <div className={`relative bg-gray-900 border border-gray-800 p-6 rounded-lg overflow-hidden group ${styles.border} transition-all duration-300`}>
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${styles.bg} rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100`}></div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-mono mb-1">{title}</h3>
                        <div className="text-4xl font-mono text-white font-bold tracking-tighter tabular-nums text-shadow-glow">
                            {value < 10 ? `0${value}` : value}
                        </div>
                    </div>
                    <div className={`p-3 bg-gray-800/50 rounded-md border border-gray-700 ${styles.text} ${styles.hoverText} ${styles.hoverShadow} transition-all`}>
                        <Icon size={24} />
                    </div>
                </div>

                <div className="mt-4 flex items-center text-xs font-mono">
                    <span className="text-green-400 flex items-center mr-2">
                        <ArrowUpRight size={12} className="mr-1" /> 12%
                    </span>
                    <span className="text-gray-600">vs last cycle</span>
                </div>

                {/* Bottom line loader effect */}
                <div className={`absolute bottom-0 left-0 h-1 ${styles.line} w-0 group-hover:w-full transition-all duration-700 ease-out`}></div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-mono p-8 selection:bg-cyan-500/30">
            {/* Grid Background Effect */}
            <div className="grid-background grid-cyan"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-end border-b border-gray-800 pb-6">
                    <div>
                        <div className="flex items-center text-cyan-400 mb-2">
                            <Activity size={20} className="mr-2 animate-pulse" />
                            <span className="text-xs tracking-[0.2em] uppercase">System Online</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white tracking-tight uppercase glitch-effect">
                            Command<span className="text-cyan-500">Center</span>
                        </h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500 mb-1">CURRENT SESSION</p>
                        <p className="text-xl text-cyan-400 font-bold">{new Date().toLocaleTimeString()}</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <TechCard
                        title="Registered Users"
                        value={stats.totalUsers}
                        icon={Users}
                        color="cyan"
                        glow="shadow-cyan-500/20"
                    />
                    <TechCard
                        title="Active Stores"
                        value={stats.totalStores}
                        icon={ShoppingBag}
                        color="purple"
                        glow="shadow-purple-500/20"
                    />
                    <TechCard
                        title="Total Ratings"
                        value={stats.totalRatings}
                        icon={Star}
                        color="green"
                        glow="shadow-green-500/20"
                    />
                </div>

                {/* Main Content Areas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Log / Main Panel */}
                    <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-1 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-500"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-500"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-500"></div>

                        <div className="bg-gray-900 border border-gray-800/50 p-6 h-full">
                            <h2 className="text-xl text-white font-bold mb-6 flex items-center">
                                <span className="w-2 h-6 bg-cyan-500 mr-3"></span>
                                SYSTEM_LOGS
                            </h2>
                            <div className="space-y-4 font-mono text-sm">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-3 hover:bg-gray-800/50 transition px-2">
                                        <div className="flex items-center">
                                            <span className="text-gray-500 mr-4">[{new Date().toLocaleTimeString()}]</span>
                                            <span className="text-cyan-300">PROCESS_INIT</span>
                                            <span className="text-gray-400 mx-2">::</span>
                                            <span className="text-gray-300">New user registration verification user_{120 + i}</span>
                                        </div>
                                        <span className="text-green-500 text-xs uppercase px-2 py-1 bg-green-500/10 rounded">Completed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Consoles */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg relative overflow-hidden group hover:border-cyan-500/50 transition">
                            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-4">Quick Deploy</h3>
                            <button title="Initialize New Store Node" className="w-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 py-3 px-4 rounded font-bold hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                                <Plus size={18} className="mr-2" />
                                INITIATE_NEW_STORE
                            </button>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-4">Server Status</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                                        <span>CPU USE</span>
                                        <span className="text-cyan-400">42%</span>
                                    </div>
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 w-[42%] shadow-[0_0_10px_rgba(0,243,255,0.5)]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                                        <span>MEMORY</span>
                                        <span className="text-purple-400">68%</span>
                                    </div>
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[68%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
