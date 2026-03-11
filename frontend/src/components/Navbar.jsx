import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Vote, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* --- Logo Section --- */}
        <Link to={user?.role === 'admin' ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2 text-blue-600 font-bold text-xl transition-opacity hover:opacity-80">
          <Vote size={28} />
          <span>SmartVote</span>
        </Link>

        {/* --- User Actions Section --- */}
        <div className="flex items-center gap-4 md:gap-8">
          
          {/* User Display Group */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
              user?.role === 'admin' 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
              {user?.role === 'admin' ? <ShieldCheck size={20} /> : <User size={20} />}
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {user?.name || "Guest User"}
              </span>
              
              {/* Dynamic Role Badge */}
              <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded w-fit ${
                user?.role === 'admin' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-emerald-100 text-emerald-700'
              }`}>
                {user?.role === 'admin' ? 'Administrator' : 'Verified Voter'}
              </span>
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold text-sm transition-colors"
          >
            <div className="p-2 bg-slate-100 group-hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={18} />
            </div>
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;