
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Zap } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            const res = await api.post('/auth/login', data);
            login(res.data.accessToken, res.data.user);

            // Redirect based on role
            if (res.data.user.role === 'ADMIN') navigate('/admin/dashboard');
            else if (res.data.user.role === 'OWNER') navigate('/owner/dashboard');
            else navigate('/stores');
        } catch (err: any) {
            if (!err.response) {
                setError('Network Error: Cannot reach the authentication server. Please check your VITE_API_URL configuration.');
            } else {
                setError(err.response?.data?.message || 'Authentication Failed');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black relative overflow-hidden font-mono p-4">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80 z-0"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="tech-card border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)] p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 border border-cyan-500/30 text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <Zap size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight uppercase">Access<span className="text-cyan-500">Node</span></h2>
                        <p className="text-gray-500 text-xs tracking-widest mt-2">SECURE LOGIN PROTOCOL</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 mb-6 rounded flex items-center text-xs tracking-wide">
                            <ShieldAlert size={16} className="mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-cyan-500/80 text-xs uppercase tracking-widest mb-2">Identifier // Email</label>
                            <input
                                {...register('email', { required: true })}
                                className="w-full bg-gray-900/50 border border-gray-700 text-cyan-100 p-3 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono placeholder-gray-700"
                                placeholder="user@domain.com"
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1 block">:: Required Field</span>}
                        </div>

                        <div>
                            <label className="block text-cyan-500/80 text-xs uppercase tracking-widest mb-2">Access Key // Password</label>
                            <input
                                type="password"
                                {...register('password', { required: true })}
                                className="w-full bg-gray-900/50 border border-gray-700 text-cyan-100 p-3 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono placeholder-gray-700"
                                placeholder="••••••••"
                            />
                            {errors.password && <span className="text-red-500 text-xs mt-1 block">:: Required Field</span>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 py-3 rounded font-bold hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] relative overflow-hidden group"
                        >
                            <span className="relative z-10">Authenticate</span>
                            <div className="absolute inset-0 bg-cyan-400/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-600 uppercase tracking-wide">
                        New User? <Link to="/register" className="text-cyan-500 hover:text-cyan-300 transition-colors ml-1 border-b border-cyan-500/30 hover:border-cyan-500">Initiate Registration</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes shine {
                    100% {
                        transform: translateX(100%) skewX(-12deg);
                    }
                }
                .group-hover\\:animate-shine:hover {
                    animation: shine 0.7s;
                }
            `}</style>
        </div>
    );
};

export default Login;
