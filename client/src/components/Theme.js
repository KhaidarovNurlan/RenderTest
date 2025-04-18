import React from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Theme({ isDark, setIsDark }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };
  return (
    <div className="position-fixed bottom-0 end-0 m-4 d-flex flex-column gap-2">
      <button
        onClick={() => setIsDark(!isDark)}
        className="btn btn-success rounded-circle p-2 d-flex align-items-center justify-content-center"
        style={{ width: '40px', height: '40px' }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      {user && (
        <button
          onClick={handleLogout}
          className="btn btn-success rounded-circle p-2 d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px' }}
        >
          <LogOut size={20} />
        </button>
      )}
    </div>
  );
}

export default Theme;