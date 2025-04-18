import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Droplets, TreePine } from 'lucide-react';

function Home() {
  return (
    <div className="container py-5">
      <div className="text-center fade-in">
        <h1 className="display-4 fw-bold text-dark mb-4">Мониторинг экологии в реальном времени</h1>
        <p className="lead text-secondary mb-4">Следите за качеством воздуха и экологической обстановкой в вашем городе с помощью современных технологий мониторинга</p>
        <Link to="/dashboard" className="btn btn-success btn-lg">Начать мониторинг</Link>
      </div>
      <div className="row mt-5 g-4">
        <div className="col-md-4">
          <div className="feature-card p-4 rounded shadow-sm slide-in" style={{animationDelay: '0.1s'}}>
            <Wind className="mb-3 text-success" size={48} />
            <h3 className="h5 fw-semibold text-dark">Качество воздуха</h3>
            <p className="text-secondary">Мониторинг концентрации вредных веществ и качества воздуха</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card p-4 rounded shadow-sm slide-in" style={{animationDelay: '0.2s'}}>
            <Droplets className="mb-3 text-success" size={48} />
            <h3 className="h5 fw-semibold text-dark">Влажность</h3>
            <p className="text-secondary">Отслеживание уровня влажности и комфортности среды</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card p-4 rounded shadow-sm slide-in" style={{animationDelay: '0.3s'}}>
            <TreePine className="mb-3 text-success" size={48} />
            <h3 className="h5 fw-semibold text-dark">Экосистема</h3>
            <p className="text-secondary">Анализ состояния окружающей среды и экосистемы</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;