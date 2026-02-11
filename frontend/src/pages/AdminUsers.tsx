
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useForm } from 'react-hook-form';
import { Search, UserPlus, Shield, Database, Trash2, Edit, ChevronUp, ChevronDown } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState<any>({});
    const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
    const { register, handleSubmit } = useForm();

    // Create User Form
    const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate } = useForm();
    const [showCreate, setShowCreate] = useState(false);

    const fetchUsers = async (params = {}) => {
        try {
            const res = await api.get('/admin/users', { params });
            setUsers(res.data.items);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers({ ...filters, ...sort });
    }, [sort]);

    const onSearch = (data: any) => {
        setFilters(data);
        fetchUsers({ ...data, ...sort });
    };

    const handleSort = (field: string) => {
        setSort(prev => ({
            sortBy: field,
            order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sort.sortBy !== field) return <div className="w-4" />;
        return sort.order === 'asc' ? <ChevronUp size={14} className="ml-1 text-cyan-400" /> : <ChevronDown size={14} className="ml-1 text-cyan-400" />;
    };

    const onCreate = async (data: any) => {
        try {
            await api.post('/admin/users', { ...data, role: data.role || 'USER' });
            setShowCreate(false);
            resetCreate();
            fetchUsers(filters);
        } catch (err) {
            alert('Failed to create user');
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-mono p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-end border-b border-gray-800 pb-6">
                    <div>
                        <div className="flex items-center text-cyan-500 mb-2">
                            <Shield size={20} className="mr-2 animate-pulse" />
                            <span className="text-xs tracking-[0.2em] uppercase">Security Clearance Level 5</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight uppercase glitch-effect">
                            User<span className="text-cyan-500">Directory</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 px-4 py-2 rounded font-bold hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest flex items-center group"
                    >
                        <UserPlus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
                        {showCreate ? 'Abort Sequence' : 'Initialize New User'}
                    </button>
                </header>

                {showCreate && (
                    <div className="bg-gray-900 border border-cyan-500/30 p-6 rounded-lg mb-8 relative overflow-hidden animate-slide-down">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                        <h3 className="font-bold text-cyan-400 mb-4 uppercase tracking-widest flex items-center">
                            <Database size={16} className="mr-2" /> New Entity Parameters
                        </h3>
                        <form onSubmit={handleSubmitCreate(onCreate)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input {...registerCreate('name', { required: true })} placeholder="Identity Name" className="tech-input" />
                            <input {...registerCreate('email', { required: true })} placeholder="Contact Protocol (Email)" className="tech-input" />
                            <input {...registerCreate('password', { required: true })} placeholder="Access Key" type="password" className="tech-input" />
                            <select {...registerCreate('role')} className="tech-input appearance-none">
                                <option value="USER">Clearance: USER</option>
                                <option value="ADMIN">Clearance: ADMIN</option>
                                <option value="OWNER">Clearance: OWNER</option>
                            </select>
                            <button type="submit" className="tech-button col-span-2 md:col-span-1 bg-cyan-500 text-black hover:bg-cyan-400">
                                Commit to Database
                            </button>
                        </form>
                    </div>
                )}

                {/* Filter Bar */}
                <form onSubmit={handleSubmit(onSearch)} className="mb-6 flex gap-4 bg-gray-900/50 p-4 rounded border border-gray-800">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                        <input {...register('name')} placeholder="Search Identity..." className="w-full bg-black border border-gray-700 text-gray-300 pl-10 p-2 rounded focus:border-cyan-500 transition-colors font-mono text-sm" />
                    </div>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                        <input {...register('email')} placeholder="Search Protocol..." className="w-full bg-black border border-gray-700 text-gray-300 pl-10 p-2 rounded focus:border-cyan-500 transition-colors font-mono text-sm" />
                    </div>
                    <button type="submit" className="bg-gray-800 text-gray-400 px-6 py-2 rounded hover:text-white hover:bg-gray-700 border border-gray-700 uppercase text-xs tracking-widest">
                        Scan
                    </button>
                </form>

                {/* Data Grid */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
                    <table className="min-w-full">
                        <thead className="bg-gray-950">
                            <tr>
                                <th onClick={() => handleSort('name')} className="tech-table-header text-cyan-500/70 cursor-pointer hover:bg-gray-900 group">
                                    <div className="flex items-center">Identity <SortIcon field="name" /></div>
                                </th>
                                <th onClick={() => handleSort('email')} className="tech-table-header text-cyan-500/70 cursor-pointer hover:bg-gray-900 group">
                                    <div className="flex items-center">Protocol ID <SortIcon field="email" /></div>
                                </th>
                                <th onClick={() => handleSort('role')} className="tech-table-header text-cyan-500/70 cursor-pointer hover:bg-gray-900 group">
                                    <div className="flex items-center">Clearance <SortIcon field="role" /></div>
                                </th>
                                <th className="tech-table-header text-cyan-500/70">Rating Metric</th>
                                <th onClick={() => handleSort('createdAt')} className="tech-table-header text-cyan-500/70 cursor-pointer hover:bg-gray-900 group">
                                    <div className="flex items-center">Initialization <SortIcon field="createdAt" /></div>
                                </th>
                                <th className="tech-table-header text-cyan-500/70 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((u: any) => {
                                let ratingDisplay = 'N/A';
                                if (u.role === 'OWNER' && u.stores && u.stores.length > 0) {
                                    const totalRating = u.stores.reduce((acc: number, store: any) => {
                                        const storeTotal = store.ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
                                        const storeAvg = store.ratings.length > 0 ? storeTotal / store.ratings.length : 0;
                                        return acc + storeAvg;
                                    }, 0);
                                    const avgRating = totalRating / u.stores.length;
                                    ratingDisplay = avgRating.toFixed(1);
                                }

                                return (
                                    <tr key={u.id} className="tech-table-row group">
                                        <td className="px-6 py-4 font-bold text-white group-hover:text-cyan-400 transition-colors">{u.name}</td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`tech-badge border ${u.role === 'ADMIN' ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/50' :
                                                u.role === 'OWNER' ? 'bg-green-900/20 text-green-400 border-green-500/50' :
                                                    'bg-pink-900/20 text-pink-400 border-pink-500/50'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-yellow-500">{ratingDisplay}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button title="Edit User Identity" className="text-gray-600 hover:text-cyan-400 transition-colors mr-3"><Edit size={16} /></button>
                                            <button title="Terminate User Node" className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{`
                .tech-input {
                    @apply w-full bg-black border border-gray-700 text-cyan-400 p-3 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono placeholder-gray-600;
                }
                .tech-button {
                    @apply w-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 py-3 rounded font-bold hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)];
                }
                .tech-table-header {
                    @apply px-6 py-4 text-left text-xs font-bold uppercase tracking-widest border-b border-gray-800;
                }
                .tech-table-row {
                    @apply border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer;
                }
                .tech-badge {
                    @apply px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-[0_0_5px_rgba(0,0,0,0.5)];
                }
            `}</style>
        </div>
    );
};

export default AdminUsers;
