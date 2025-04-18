import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

function About() {
  return (
    <div className="container py-5">
      <h1 className="display-4 text-center mb-5">О компании EcoMonitor</h1>
      <div className="row mb-5">
        <div className="col-md-6">
          <h2 className="h3 mb-4">Наша миссия</h2>
          <p className="lead text-secondary">
            EcoMonitor - ведущая компания в области мониторинга экологической обстановки. 
            Мы стремимся сделать информацию о качестве воздуха доступной каждому, 
            помогая людям принимать осознанные решения для защиты своего здоровья.
          </p>
        </div>
        <div className="col-md-6">
          <h2 className="h3 mb-4">Наши ценности</h2>
          <ul className="list-unstyled">
            <li className="mb-3">✓ Точность и надежность данных</li>
            <li className="mb-3">✓ Инновационные технологии мониторинга</li>
            <li className="mb-3">✓ Забота об окружающей среде</li>
            <li className="mb-3">✓ Открытость и прозрачность</li>
          </ul>
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="h3 mb-4">Наша команда</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Хайдаров Нурлан</h5>
                  <p className="card-text text-muted">Генеральный директор</p>
                  <p className="card-text">Эксперт в области экологического мониторинга с 15-летним опытом работы</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Хайдаров Нурлан</h5>
                  <p className="card-text text-muted">Технический директор</p>
                  <p className="card-text">Специалист по разработке систем мониторинга качества воздуха</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Хайдаров Нурлан</h5>
                  <p className="card-text text-muted">Руководитель разработки</p>
                  <p className="card-text">Опытный разработчик систем экологического мониторинга</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2 className="h3 mb-4">Контактная информация</h2>
          <div className="card">
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <MapPin className="text-success me-2" />
                    <span className="contact-info">пр-т. Мангилик Ел., Астана 020000, Казахстан</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <Phone className="text-success me-2" />
                    <span className="contact-info">+7 (727) 123-45-67</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <Mail className="text-success me-2" />
                    <span className="contact-info">info@ecomonitor.kz</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Globe className="text-success me-2" />
                    <span className="contact-info">www.ecomonitor.kz</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="ratio ratio-16x9">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2505.9636038921512!2d71.41817089999999!3d51.0906792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424585a605525605%3A0x4dff4a1973f7567e!2sAstana%20IT%20University!5e0!3m2!1sru!2skz!4v1743147545590!5m2!1sru!2skz"
                      className="border-0"
                      allowFullScreen=""
                      loading="lazy"
                      title="Местоположение офиса"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;