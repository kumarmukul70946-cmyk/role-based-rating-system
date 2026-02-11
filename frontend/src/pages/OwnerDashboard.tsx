
import { useEffect, useState } from 'react';
import api from '../api/client';
import { Star, Store, TrendingUp, BarChart2, Shield } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const OwnerDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reviewSort, setReviewSort] = useState<'newest' | 'highest' | 'lowest'>('newest');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/owner/dashboard');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-black text-cyan-500 font-mono">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 shadow-[0_0_20px_#06b6d4]"></div>
            <span className="ml-4 animate-pulse">LOADING_DATA_STREAM...</span>
        </div>
    );

    if (!data || !data.store) return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-500 font-mono">
            <Shield size={64} className="mb-4 text-gray-700 animate-pulse" />
            <p className="text-xl tracking-widest uppercase">No assigned protocol found</p>
        </div>
    );

    // Mock trend data for the area chart
    const trendData = [
        { name: 'Day 1', rating: 4.2 },
        { name: 'Day 2', rating: 3.8 },
        { name: 'Day 3', rating: 4.5 },
        { name: 'Day 4', rating: 4.0 },
        { name: 'Day 5', rating: 4.8 },
        { name: 'Day 6', rating: 4.6 },
        { name: 'Day 7', rating: data.store.averageRating || 4.7 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-cyan-500/50 p-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <p className="text-cyan-400 font-mono text-xs">{`${label} : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-mono p-4 md:p-8 selection:bg-green-500/30">
            {/* Grid Overlay */}
            <div className="grid-background grid-green"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-6">
                    <div>
                        <div className="flex items-center text-green-500 mb-2">
                            <Store size={18} className="mr-2" />
                            <span className="text-xs tracking-[0.3em] uppercase">Store Interface 1.0</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase mb-2">
                            {data.store.name}
                        </h1>
                        <div className="text-xs text-gray-500 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            SYSTEM_STATUS: ONLINE
                        </div>
                    </div>

                    <div className="mt-6 md:mt-0 text-right bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-green-500/50 transition-all group">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 group-hover:text-green-400 transition">Aggregated Rating</p>
                        <div className="flex items-center justify-end">
                            <span className="text-4xl font-bold text-white mr-3 text-shadow-glow">{data.store.averageRating?.toFixed(1)}</span>
                            <div className="flex text-green-500 filter drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < Math.round(data.store.averageRating) ? "currentColor" : "none"}
                                        className={i < Math.round(data.store.averageRating) ? "text-green-500" : "text-gray-700"}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Chart Card */}
                        <div className="bg-gray-900/40 backdrop-blur border border-gray-800 p-1 rounded-xl shadow-lg relative group">
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500"></div>
                            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-green-500"></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-green-500"></div>

                            <div className="bg-gray-950 p-6 rounded-lg h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-green-400 text-sm uppercase tracking-widest flex items-center">
                                        <BarChart2 size={16} className="mr-2" />
                                        Performance_Metric_Log
                                    </h3>
                                    <div className="flex space-x-2 text-xs">
                                        <button title="Show 7 Days Data" className="px-3 py-1 bg-green-900/20 text-green-400 border border-green-800 rounded hover:bg-green-500 hover:text-black transition">7D</button>
                                        <button title="Show 30 Days Data" className="px-3 py-1 bg-gray-900 text-gray-500 border border-gray-800 rounded hover:text-white transition">30D</button>
                                    </div>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData}>
                                            <defs>
                                                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10, fontFamily: 'monospace' }} axisLine={false} />
                                            <YAxis stroke="#666" tick={{ fontSize: 10, fontFamily: 'monospace' }} axisLine={false} domain={[0, 5]} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="rating"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorRating)"
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Reviews Feed */}
                        <div className="border border-gray-800 bg-gray-900/20 rounded-xl overflow-hidden">
                            <div className="bg-gray-900/80 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                                <h3 className="text-gray-300 text-sm uppercase tracking-widest">Incoming_Data_Stream</h3>
                                <div className="flex items-center space-x-4">
                                    <select
                                        title="Sort Reviews"
                                        value={reviewSort}
                                        onChange={(e) => setReviewSort(e.target.value as any)}
                                        className="bg-black border border-gray-800 text-green-500 text-[10px] uppercase font-bold p-1 rounded focus:border-green-500 outline-none"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="highest">Highest Rating</option>
                                        <option value="lowest">Lowest Rating</option>
                                    </select>
                                    <span className="text-green-500 text-xs animate-pulse">● LIVE</span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-800 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {[...(data.raters || [])].sort((a, b) => {
                                    if (reviewSort === 'highest') return b.rating - a.rating;
                                    if (reviewSort === 'lowest') return a.rating - b.rating;
                                    return new Date(b.ratedAt).getTime() - new Date(a.ratedAt).getTime();
                                }).map((rater: any, idx: number) => (
                                    <div key={idx} className="p-4 hover:bg-gray-900/50 transition flex items-start group">
                                        <div className="mr-4 mt-1">
                                            <div className="w-10 h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-green-500 font-bold group-hover:border-green-500/50 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all">
                                                {rater.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className="text-green-400 font-bold text-sm tracking-wide">{rater.name}</span>
                                                <span className="text-gray-600 text-xs font-mono">{new Date(rater.ratedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        fill={i < rater.rating ? "#22c55e" : "none"}
                                                        className={i < rater.rating ? "text-green-500" : "text-gray-800"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-500 text-xs font-mono line-clamp-1 border-l-2 border-green-900 pl-2 mt-2">
                                                User submitted rating value: {rater.rating}.0 verified.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {data.raters.length === 0 && (
                                    <div className="p-8 text-center text-gray-600 font-mono text-xs">
                                        // NO_DATA_PACKETS_RECEIVED
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & System */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <TrendingUp size={100} className="text-green-500" />
                            </div>
                            <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-1">Efficiency Rating</h3>
                            <div className="text-3xl text-white font-bold mb-4 flex items-baseline">
                                High <span className="text-sm text-green-500 ml-2">+4.5%</span>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>RESPONSE_TIME</span>
                                        <span className="text-green-400">12ms</span>
                                    </div>
                                    <div className="h-1 bg-gray-800 w-full rounded-full">
                                        <div className="h-full bg-green-500 w-[90%] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>SATISFACTION_INDEX</span>
                                        <span className="text-green-400">98%</span>
                                    </div>
                                    <div className="h-1 bg-gray-800 w-full rounded-full">
                                        <div className="h-full bg-green-500 w-[98%] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-green-500/20 bg-green-500/5 p-6 rounded-xl relative overflow-hidden group hover:border-green-500/50 transition">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/20 blur-xl rounded-full"></div>
                            <h3 className="text-green-400 text-sm uppercase tracking-widest font-bold mb-2">System Notice</h3>
                            <p className="text-xs text-gray-400 font-mono leading-relaxed mb-4">
                                Optimization protocols active. Your store visibility is boosted by 15% due to high rating metrics.
                            </p>
                            <button title="Acknowledge System Message" className="text-xs bg-green-500/10 text-green-400 border border-green-500/50 px-3 py-2 rounded hover:bg-green-500 hover:text-black transition uppercase tracking-wider font-bold w-full">
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .text-shadow-glow {
                    text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #111827; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #374151; 
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #4b5563; 
                }
            `}</style>
        </div>
    );
};

export default OwnerDashboard;
