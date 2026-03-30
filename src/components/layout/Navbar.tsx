import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, User as UserIcon, Bell, LogOut, Settings, ChevronDown, Building2 } from 'lucide-react';
import type { User } from '@/shared/types';
import { BatchCart } from '@/features/batch/components/BatchCart';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  currentDepartment: '學術發展部' | '圖書服務部' | '業務部' | '學術出版部';
  setCurrentDepartment: (dept: '學術發展部' | '圖書服務部' | '業務部' | '學術出版部') => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  currentDepartment,
  setCurrentDepartment,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDeptMenuOpen, setIsDeptMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const deptMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (deptMenuRef.current && !deptMenuRef.current.contains(event.target as Node)) {
        setIsDeptMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
      ? 'bg-indigo-100 text-indigo-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`;
  };

  const handleDepartmentChange = (dept: '學術發展部' | '圖書服務部' | '業務部' | '學術出版部') => {
    setCurrentDepartment(dept);
    setIsDeptMenuOpen(false);
    // Optional: Redirect to the search page of the new department to avoid 404s if on a specific contract page
    if (dept === '學術發展部') {
      navigate('/academic/search');
    } else if (dept === '圖書服務部') {
      navigate('/ddd/search');
    } else if (dept === '業務部') {
      navigate('/business/search');
    } else if (dept === '學術出版部') {
      navigate('/academic-publishing/search');
    }
  };

  return (
    <header className="shrink-0 bg-white shadow-sm border-b border-gray-200 z-30 relative">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <Link to="/search-contract" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              <span>合約管理系統</span>
            </Link>
          </h1>

          <nav className="hidden md:flex items-center space-x-1">
            {currentDepartment === '學術發展部' && (
              <>
                <Link to="/academic/search" className={getNavLinkClass('/academic/search')}>
                  搜尋合約
                </Link>
                <Link to="/academic/contract/new" className={getNavLinkClass('/academic/contract/new')}>
                  新增合約
                </Link>
                <Link to="/settings/templates" className={getNavLinkClass('/settings/templates')}>
                  範本管理
                </Link>
                {currentUser?.permissions.maintainParams === '學術發展部' && (
                  <Link to="/xuefa-params" className={getNavLinkClass('/xuefa-params')}>
                    參數設定
                  </Link>
                )}
              </>
            )}

            {currentDepartment === '圖書服務部' && (
              <>
                <Link to="/ddd/search" className={getNavLinkClass('/ddd/search')}>
                  搜尋合約
                </Link>
                <Link to="/ddd/contract/new" className={getNavLinkClass('/ddd/contract/new')}>
                  新增合約
                </Link>
                <Link to="/ddd/settings/templates" className={getNavLinkClass('/ddd/settings/templates')}>
                  範本管理
                </Link>
                {(currentUser?.permissions.maintainParams === '圖書服務部' || currentUser?.permissions.adminOnly) && (
                  <Link to="/ddd-params" className={getNavLinkClass('/ddd-params')}>
                    參數設定
                  </Link>
                )}
              </>
            )}

            {currentDepartment === '業務部' && (
              <>
                <Link to="/business/search" className={getNavLinkClass('/business/search')}>
                  搜尋合約
                </Link>
                <Link to="/business/contract/new" className={getNavLinkClass('/business/contract/new')}>
                  新增合約
                </Link>
              </>
            )}

            {currentDepartment === '學術出版部' && (
              <div className="px-3 py-2 text-sm font-medium text-gray-400 italic">
                內容建置中...
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-1">

          {/* Department Switcher */}
          <div className="relative" ref={deptMenuRef}>
            <button
              onClick={() => setIsDeptMenuOpen(!isDeptMenuOpen)}
              className="flex items-center space-x-0.5 px-1 py-1 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors border border-transparent hover:border-gray-200"
            >
              <Building2 className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{currentDepartment}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDeptMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDeptMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 animate-in fade-in slide-in-from-top-2 z-50">
                {(['學術發展部', '圖書服務部', '業務部', '學術出版部'] as const).map((dept) => (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentChange(dept)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${currentDepartment === dept ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}`}
                  >
                    <span>{dept}</span>
                    {currentDepartment === dept && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <BatchCart />



          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm text-white font-medium text-sm">
                {currentUser?.name?.charAt(0) || <UserIcon className="w-5 h-5" />}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p className="font-semibold text-gray-900">{currentUser?.name || '使用者'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currentUser?.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {currentUser?.department || '未分配部門'}
                    </span>
                  </div>
                </div>

                {currentUser?.permissions.adminOnly && (
                  <Link
                    to="/settings/users"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                    權限管理
                  </Link>
                )}

                <Link
                  to="/my-notification-settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Bell className="w-4 h-4 mr-3 text-gray-400" />
                  通知設定
                </Link>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={() => {
                    onLogout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  登出
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;