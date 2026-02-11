
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/client';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { user } = useAuth();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    const onSubmit = async (data: any) => {
        try {
            await api.post('/auth/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });
            setMessage({ type: 'success', text: 'Access Key Updated Successfully' });
            reset();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update Protocol Failed' });
        }
    };

    const role = user?.role || 'USER';
    const roleColors: any = {
        ADMIN: {
            border: 'border-cyan-500/30',
            line: 'bg-cyan-500 shadow-cyan-500',
            iconBg: 'bg-cyan-500/10 border-cyan-500/50',
            iconText: 'text-cyan-500',
            badge: 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30',
            inputText: 'text-cyan-400',
            inputFocus: 'focus:border-cyan-500',
            button: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500'
        },
        OWNER: {
            border: 'border-green-500/30',
            line: 'bg-green-500 shadow-green-500',
            iconBg: 'bg-green-500/10 border-green-500/50',
            iconText: 'text-green-500',
            badge: 'bg-green-900/30 text-green-400 border-green-500/30',
            inputText: 'text-green-400',
            inputFocus: 'focus:border-green-500',
            button: 'bg-green-600/20 text-green-400 border-green-500/50 hover:bg-green-500'
        },
        USER: {
            border: 'border-pink-500/30',
            line: 'bg-pink-500 shadow-pink-500',
            iconBg: 'bg-pink-500/10 border-pink-500/50',
            iconText: 'text-pink-500',
            badge: 'bg-pink-900/30 text-pink-400 border-pink-500/30',
            inputText: 'text-pink-400',
            inputFocus: 'focus:border-pink-500',
            button: 'bg-pink-600/20 text-pink-400 border-pink-500/50 hover:bg-pink-500'
        }
    };

    const styles = roleColors[role] || roleColors.USER;

    return (
        <div className="min-h-screen bg-black text-gray-300 font-mono p-4 md:p-8 flex justify-center items-start pt-20">
            <div className="grid-background"></div>

            <div className={`relative z-10 w-full max-w-2xl bg-gray-900 border ${styles.border} p-8 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden`}>
                {/* Decorative border line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${styles.line} shadow-[0_0_10px_var(--tw-shadow-color)]`}></div>

                <div className="flex items-center mb-8 border-b border-gray-800 pb-6">
                    <div className={`p-4 rounded-full ${styles.iconBg} mr-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                        <User size={48} className={styles.iconText} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">{user?.name}</h2>
                        <div className="flex items-center mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${styles.badge} border uppercase tracking-widest font-bold`}>
                                Clearance: {user?.role}
                            </span>
                            <span className="text-gray-500 text-xs ml-4 font-mono">{user?.email}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-black/50 p-6 rounded border border-gray-800">
                    <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-6 flex items-center">
                        <Lock size={16} className="mr-2" /> Security Protocol Update
                    </h3>

                    {message && (
                        <div className={`p-3 mb-6 rounded text-xs tracking-wide border ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-500/50' : 'bg-red-900/20 text-red-500 border-red-500/50'
                            }`}>
                            <span className="font-bold mr-2 uppercase">System Notice:</span> {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">Current Access Key</label>
                            <input
                                type="password"
                                {...register('oldPassword', { required: 'Required Authentication' })}
                                className={`w-full bg-black border border-gray-700 ${styles.inputText} p-3 rounded focus:outline-none ${styles.inputFocus} transition-all font-mono placeholder-gray-800`}
                                placeholder="••••••••"
                            />
                            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">:: {errors.oldPassword.message as string}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">New Access Key</label>
                            <input
                                type="password"
                                {...register('newPassword', {
                                    required: 'Required New Credential',
                                    pattern: {
                                        value: passwordRegex,
                                        message: 'Constraint Violation: 1 Upper, 1 Special, 8-16 Chars'
                                    }
                                })}
                                className={`w-full bg-black border border-gray-700 ${styles.inputText} p-3 rounded focus:outline-none ${styles.inputFocus} transition-all font-mono placeholder-gray-800`}
                                placeholder="••••••••"
                            />
                            {errors.newPassword && <p className="text-red-500 text-xs mt-1">:: {errors.newPassword.message as string}</p>}
                        </div>
                        <button type="submit" className={`w-full ${styles.button} hover:text-black py-3 rounded font-bold transition-all uppercase tracking-widest flex justify-center items-center group`}>
                            <Save size={18} className="mr-2 group-hover:animate-pulse" /> Update Credentials
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-widest flex items-center justify-center">
                        <ShieldCheck size={12} className="mr-2 text-gray-500" />
                        Secure Connection Established
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
