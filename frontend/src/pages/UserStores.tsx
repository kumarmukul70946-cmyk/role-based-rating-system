
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useForm } from 'react-hook-form';
import { ShoppingCart, Star, Search, MapPin, Database, Zap } from 'lucide-react';

const UserStores = () => {
    interface Store {
        id: string;
        name: string;
        address: string;
        overallRating: number;
        myRating: number | null;
    }

    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<any>({});
    const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
    const { register, handleSubmit } = useForm();

    const fetchStores = async (params = {}) => {
        setLoading(true);
        try {
            const res = await api.get('/stores', { params });
            setStores(res.data.items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores({ ...filters, ...sort });
    }, [sort]);

    const onSearch = (data: any) => {
        setFilters(data);
        fetchStores({ ...data, ...sort });
    };

    const handleRate = async (storeId: string, rating: number) => {
        if (isNaN(rating)) return;
        try {
            await api.post(`/stores/${storeId}/rating`, { rating });
            fetchStores(filters);
        } catch (err) {
            alert('Failed to rate store');
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-mono p-4 md:p-8">
            <div className="grid-background grid-pink"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-6">
                    <div>
                        <div className="flex items-center text-pink-500 mb-2">
                            <Database size={20} className="mr-2 animate-pulse" />
                            <span className="text-xs tracking-[0.2em] uppercase">Marketplace Matrix</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white tracking-tight uppercase glitch-effect">
                            Store<span className="text-pink-500">Nodes</span>
                        </h1>
                    </div>

                    {/* Search Module */}
                    <form onSubmit={handleSubmit(onSearch)} className="mt-6 md:mt-0 flex flex-col md:flex-row gap-4 bg-gray-900/50 p-4 rounded-lg border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)] w-full md:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-3 top-3 text-pink-500/50 group-focus-within:text-pink-500 transition-colors" size={18} />
                            <input
                                {...register('searchName')}
                                placeholder="Scan by ID..."
                                className="bg-black border border-gray-700 text-pink-100 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-pink-500 transition-all font-mono placeholder-gray-700 w-full md:w-64"
                            />
                        </div>
                        <div className="relative group">
                            <MapPin className="absolute left-3 top-3 text-pink-500/50 group-focus-within:text-pink-500 transition-colors" size={18} />
                            <input
                                {...register('searchAddress')}
                                placeholder="Locate sector..."
                                className="bg-black border border-gray-700 text-pink-100 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-pink-500 transition-all font-mono placeholder-gray-700 w-full md:w-64"
                            />
                        </div>
                        <div className="relative group">
                            <select
                                title="Sort Store Nodes"
                                value={`${sort.sortBy}-${sort.order}`}
                                onChange={(e) => {
                                    const [sortBy, order] = e.target.value.split('-');
                                    setSort({ sortBy, order: order as 'asc' | 'desc' });
                                }}
                                className="bg-black border border-gray-700 text-pink-500 pl-4 pr-10 py-2 rounded focus:outline-none focus:border-pink-500 transition-all font-mono text-xs appearance-none cursor-pointer w-full md:w-auto uppercase tracking-widest font-bold"
                            >
                                <option value="name-asc">Sort: Name (A-Z)</option>
                                <option value="name-desc">Sort: Name (Z-A)</option>
                                <option value="overallRating-desc">Sort: Rating (High)</option>
                                <option value="overallRating-asc">Sort: Rating (Low)</option>
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-pink-500/50">
                                <Zap size={14} />
                            </div>
                        </div>
                        <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded border border-pink-500 hover:bg-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all uppercase tracking-widest font-bold text-xs">
                            Execute
                        </button>
                    </form>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 shadow-[0_0_20px_#ec4899]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map((store) => (
                            <div key={store.id} className="relative bg-gray-900 border border-gray-800 p-6 rounded-lg overflow-hidden group hover:border-pink-500 transition-all duration-300">
                                {/* Holographic Corner Effect */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-3 bg-gray-800 rounded border border-gray-700 text-pink-500 group-hover:shadow-[0_0_10px_rgba(236,72,153,0.4)] transition-all">
                                        <ShoppingCart size={24} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Rating Protocol</div>
                                        <div className="flex items-center justify-end text-pink-400 font-bold text-xl">
                                            {store.overallRating ? store.overallRating.toFixed(1) : '0.0'}
                                            <Star size={14} className="ml-1 fill-pink-500 text-pink-500" />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors uppercase tracking-tight truncate">{store.name}</h2>
                                <p className="text-gray-500 text-xs font-mono mb-6 flex items-start h-8 overflow-hidden">
                                    <MapPin size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                                    {store.address}
                                </p>

                                <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center">
                                        <Zap size={12} className="mr-1 text-yellow-500" />
                                        User Input
                                    </span>

                                    <div className="flex items-center space-x-1 bg-black rounded p-1 border border-gray-800 group-hover:border-pink-500/30 transition-colors">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                title={`Rate ${star} Stars`}
                                                onClick={() => handleRate(store.id, star)}
                                                className={`p-1 transition-all transform hover:scale-125 focus:outline-none ${store.myRating && star <= store.myRating
                                                    ? 'text-pink-500 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]'
                                                    : 'text-gray-700 hover:text-pink-400'
                                                    }`}
                                            >
                                                <Star size={14} fill={store.myRating && star <= store.myRating ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {stores.length === 0 && !loading && (
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg">
                        <Database size={48} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 uppercase tracking-widest">No Data Nodes Found within search parameters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserStores;
