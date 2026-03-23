import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState(''); // Added password field support
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Use default password for testing if not provided, or handle as needed
        // The original code in App.tsx didn't have a password field visible but logic checked it?
        // Wait, original App.tsx: const user = sampleUsers.find(u => u.employeeId === loginId); 
        // It completely ignored password checking!
        // My new AuthContext.login(id, password) needs a password.
        // Let's check sampleUsers in mockUsers.ts. They have passwords. 
        // I should probably add a password field to the UI or use a default if simplifying.

        // For now, let's just ask for ID and try to find the user to get their password for "simulation" 
        // or better, add a password input. Let's add a password input for better practice.

        const user = await login(loginId, password || 'password123');

        if (user) {
            // Department-based redirection
            if (user.permissions?.landingPage === '圖書服務部' || user.department === '圖書服務部') {
                navigate('/ddd/search');
            } else {
                navigate('/academic/search');
            }
        } else {
            setError('登入失敗：找不到使用者或密碼錯誤 (測試帳號: 12345 / 0000)');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">合約管理系統</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">帳號 (員工編號)</label>
                        <input
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                            placeholder="測試請輸入: 12345"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="測試密碼: 0000"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full">登入</Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
