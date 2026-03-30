import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout';
import { useAuth } from '@/features/auth/hooks/useAuth';

// --- 引入頁面模組 ---
import Login from '@/pages/Login';
import DDDContract from '@/pages/DDDContract';
import DDDMaintainContract from '@/pages/DDDMaintainContract';
import AcademicContract from '@/pages/AcademicContract';
import AcademicMaintainContract from '@/pages/AcademicMaintainContract';
import AcademicSearchContract from '@/features/academic/search/AcademicSearchContract';
import DDDSearchContract from '@/features/ddd/search/DDDSearchContract';
import BusinessContract from '@/pages/BusinessContract';

import {
  UserManagement,
  TemplateManagement,
  ParameterSettings,
  PersonalNotificationSettings
} from '@/features/settings';
import { DDDTemplateManagement } from '@/features/ddd/pages/DDDTemplateManagement';
import { DDDParameterSettings } from '@/features/ddd/pages/DDDParameterSettings';
import { BatchProvider } from '@/features/batch/context/BatchContext';


const App: React.FC = () => {
  // --- Auth Context ---
  const { isLoggedIn, currentUser, logout } = useAuth();

  // UI 狀態
  const [currentDepartment, setCurrentDepartment] = useState<'學術發展部' | '圖書服務部' | '業務部' | '學術出版部'>('學術發展部');

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- 主要渲染 ---
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <BatchProvider>
      <div className="flex h-screen bg-gray-100 font-sans flex-col">
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          currentDepartment={currentDepartment}
          setCurrentDepartment={setCurrentDepartment}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 relative">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/academic/search" replace />}
            />

            {/* Academic Routes */}
            <Route path="/academic/search" element={<AcademicSearchContract />} />
            <Route path="/academic/contract/new" element={<AcademicContract />} />
            <Route path="/academic/contract/:id" element={<AcademicMaintainContract />} />

            {/* DDD (圖書服務部) Routes */}
            <Route path="/ddd/search" element={<DDDSearchContract />} />
            <Route path="/ddd/contract/new" element={<DDDContract />} />
            <Route path="/ddd/contract/:id" element={<DDDMaintainContract />} />

            {/* Business (業務部) Routes */}
            <Route path="/business/contract/new" element={<BusinessContract />} />

            {/* Settings Routes */}
            <Route path="/settings/users" element={<UserManagement />} />
            <Route path="/settings/templates" element={<TemplateManagement />} />

            {/* DDD Settings */}
            <Route path="/ddd/settings/templates" element={<DDDTemplateManagement />} />
            <Route path="/ddd-params" element={<DDDParameterSettings />} />

            <Route path="/xuefa-params" element={<ParameterSettings />} />
            <Route path="/my-notification-settings" element={<PersonalNotificationSettings />} />

            <Route path="*" element={<div className="p-8 text-center text-gray-500">頁面建置中...</div>} />
          </Routes>

          {/* BatchFloatingIndicator removed - moved to Navbar */}
        </main>
      </div>
    </BatchProvider>
  );
};

export default App;