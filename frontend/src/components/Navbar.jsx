import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Vote, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Vote size={28} />
          <span>SmartVote</span>
        </Link>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={18} />
            </div>
            <span className="hidden sm:inline">Voter</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-lg transition-all font-medium cursor-pointer"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;