
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { UserPlus, Database } from 'lucide-react';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            await api.post('/auth/register', data);
            navigate('/login');
        } catch (err: any) {
            if (!err.response) {
                setError('Network Error [V2.1-REG]: Cannot reach the server. Ensure DATABASE_URL is correct.');
            } else {
                setError(err.response?.data?.message || 'Registration failed');
            }
        }
    };

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    return (
        <div className="flex justify-center items-center min-h-screen bg-black relative overflow-hidden font-mono p-4">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80 z-0 h-full"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="tech-card border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.1)] p-8">
                    <div className="text-center mb-6">
                        <UserPlus size={48} className="mx-auto text-purple-500 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <h2 className="text-3xl font-bold text-white tracking-tight uppercase">User<span className="text-purple-500">Init</span></h2>
                        <p className="text-gray-500 text-xs tracking-widest mt-2 uppercase">Create New Identity Node</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 mb-6 rounded flex items-center text-xs tracking-wide">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-purple-400/80 text-xs uppercase tracking-widest mb-1">Full Identity // Name</label>
                            <input
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: { value: 20, message: 'Must exceed 20 characters' },
                                    maxLength: 60
                                })}
                                className="w-full bg-gray-900/50 border border-gray-700 text-purple-100 p-3 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono placeholder-gray-700"
                                placeholder="Johnathon Doe the Third..."
                            />
                            {errors.name && <span className="text-red-500 text-xs mt-1 block">:: {errors.name.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-purple-400/80 text-xs uppercase tracking-widest mb-1">Contact Protocol // Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="w-full bg-gray-900/50 border border-gray-700 text-purple-100 p-3 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono placeholder-gray-700"
                                placeholder="entity@sector7.com"
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1 block">:: {errors.email.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-purple-400/80 text-xs uppercase tracking-widest mb-1">Physical Coordinates // Address</label>
                            <textarea
                                {...register('address', { maxLength: 400 })}
                                className="w-full bg-gray-900/50 border border-gray-700 text-purple-100 p-3 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono placeholder-gray-700 h-24 resize-none"
                                placeholder="Sector 4, Void Quadrant..."
                            />
                            {errors.address && <span className="text-red-500 text-xs mt-1 block">:: {errors.address.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-purple-400/80 text-xs uppercase tracking-widest mb-1">Security Key // Password</label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    pattern: {
                                        value: passwordRegex,
                                        message: 'Alpha-Numeric-Symbol Required'
                                    }
                                })}
                                className="w-full bg-gray-900/50 border border-gray-700 text-purple-100 p-3 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono placeholder-gray-700"
                                placeholder="••••••••"
                            />
                            {errors.password && <span className="text-red-500 text-xs mt-1 block">:: {errors.password.message as string}</span>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600/20 text-purple-400 border border-purple-500/50 py-3 rounded mt-4 font-bold hover:bg-purple-500 hover:text-black transition-all uppercase tracking-widest hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                <Database size={16} className="mr-2" /> Initialize Account
                            </span>
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-600 uppercase tracking-wide">
                        Existing Entity? <Link to="/login" className="text-purple-500 hover:text-purple-300 transition-colors ml-1 border-b border-purple-500/30 hover:border-purple-500">Access Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
