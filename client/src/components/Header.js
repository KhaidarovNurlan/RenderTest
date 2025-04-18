import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm">
      <nav className="container d-flex align-items-center justify-content-between py-3">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <Leaf className="text-success me-2" size={32} />
          <span className="fs-4 fw-semibold text-dark">EcoMonitor</span>
        </Link>
        <div className="d-none d-sm-flex gap-3">
          <Link to="/about" className="d-flex align-items-center text-secondary text-decoration-none link-hover">О нас</Link>
          <Link to="/recoms" className="d-flex align-items-center text-secondary text-decoration-none link-hover">Рекомендации</Link>
          <Link to="/dashboard" className="btn btn-success">Мониторинг</Link>
        </div>
        <button className="d-sm-none btn btn-link text-success p-0"onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isMenuOpen && (
          <div className="position-fixed top-0 start-0 h-100 w-100 bg-white d-sm-none" style={{ zIndex: 1000 }}>
            <div className="container py-3">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/" className="d-flex align-items-center text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                  <Leaf className="text-success me-2" size={32} />
                  <span className="fs-4 fw-semibold text-dark">EcoMonitor</span>
                </Link>
                <button className="btn btn-link text-success p-0" onClick={() => setIsMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="d-flex flex-column gap-4">
                <Link to="/about" className="text-secondary text-decoration-none fs-5" onClick={() => setIsMenuOpen(false)}>О нас</Link>
                <Link to="/recoms" className="text-secondary text-decoration-none fs-5"onClick={() => setIsMenuOpen(false)}>Рекомендации</Link>
                <Link to="/dashboard" className="btn btn-success btn-lg" onClick={() => setIsMenuOpen(false)}>Мониторинг</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;