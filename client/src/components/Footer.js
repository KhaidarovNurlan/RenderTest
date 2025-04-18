import React from 'react';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-top border-secondary">
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center text-secondary">
          <span>Сделано с </span>
          <Heart className="mx-1 text-success" />
          <span> для экологии</span>
        </div>
        <div className="text-center text-muted mt-2">
          © 2025 EcoMonitor. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

export default Footer;