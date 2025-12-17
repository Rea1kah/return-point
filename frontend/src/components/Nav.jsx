import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from './ConfirmModal';
import '../styles/Nav.css';

export default function Nav() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    showToast('Kamu sudah berhasil logout. Sampai jumpa kembali yaa!', 'success', 'Logout Berhasil');
    setShowLogoutModal(false);
  };

  const isAdmin = user?.role === 'admin';
  const roleLabel = isAdmin ? 'Administrator' : 'Mahasiswa';
  const roleClass = isAdmin ? 'role-admin' : 'role-user';

  return (
    <>
      <div className="nav-wrapper">
        <header className="nav-glass">
          <Link to="/" className="nav-brand">
            Return<span className="brand-dot">Point</span>
          </Link>
          
          <nav className="nav-menu">
            <div className="nav-links-group">
              <Link 
                to="/found" 
                className={`nav-link ${location.pathname.startsWith('/found') ? 'active' : ''}`}
              >
                Found Items
              </Link>
              <Link 
                to="/lost" 
                className={`nav-link ${location.pathname.startsWith('/lost') ? 'active' : ''}`}
              >
                Lost Items
              </Link>
            </div>

            <div className="nav-separator"></div>

            {user ? (
              <div className="user-profile">
                <div className="user-info">
                  <div className={`user-avatar ${isAdmin ? 'bg-amber-500' : ''}`} style={isAdmin ? {background: '#f59e0b'} : {}}>
                    {isAdmin ? <FaUserShield size={14} /> : user.username.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="user-text-info">
                    <span className="user-name">{user.username}</span>
                    <span className={`role-badge ${roleClass}`}>{roleLabel}</span>
                  </div>
                </div>

                <button onClick={handleLogoutClick} className="btn-logout-icon" title="Logout">
                  <FaSignOutAlt size={14} />
                </button>
              </div>
            ) : (
              <div className="auth-group">
                <Link to="/login" className="nav-auth-link">
                  Sign In
                </Link>
                <Link to="/register" className="btn-signup-pill">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </header>
      </div>

      <ConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Sign Out?"
        message="Apakah Anda yakin ingin keluar dari akun Anda saat ini?"
        confirmText="Logout"
        isDanger={true}
        icon={<FaSignOutAlt />}
      />
    </>
  );
}