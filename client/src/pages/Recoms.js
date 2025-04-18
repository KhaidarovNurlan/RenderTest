import React from 'react';
import { AlertTriangle, Shield, Activity, Sun } from 'lucide-react';

function Recoms() {
  const recommendations = [
    {
      level: 'Хорошее (0-50)',
      color: 'success',
      icon: Shield,
      description: 'Качество воздуха считается удовлетворительным, загрязнение воздуха представляет малый риск или не представляет риска.',
      actions: [
        'Можно заниматься любой деятельностью на открытом воздухе',
        'Идеальное время для прогулок и занятий спортом',
        'Проветривание помещений рекомендуется',
      ]
    },
    {
      level: 'Умеренное (51-100)',
      color: 'warning',
      icon: Sun,
      description: 'Качество воздуха приемлемое, однако некоторые загрязнители могут представлять умеренный риск для небольшого числа людей.',
      actions: [
        'Людям с повышенной чувствительностью следует ограничить длительное пребывание на открытом воздухе',
        'Желательно сократить интенсивные физические нагрузки на улице',
        'Проветривание помещений лучше проводить в утренние часы',
      ]
    },
    {
      level: 'Вредное для чувствительных групп (101-150)',
      color: 'warning',
      icon: Activity,
      description: 'Может оказывать воздействие на здоровье особо чувствительных лиц, на остальных воздействие незначительное.',
      actions: [
        'Пожилым людям, детям и людям с заболеваниями органов дыхания следует избегать длительного пребывания на улице',
        'Рекомендуется использовать защитные маски при выходе на улицу',
        'Ограничить физическую активность на открытом воздухе',
        'Держать окна закрытыми',
      ]
    },
    {
      level: 'Вредное (151-200)',
      color: 'danger',
      icon: AlertTriangle,
      description: 'Может оказывать негативное воздействие на здоровье всех групп населения.',
      actions: [
        'Избегать длительного пребывания на открытом воздухе',
        'Использовать защитные маски с соответствующим уровнем фильтрации',
        'Отложить занятия спортом на открытом воздухе',
        'Использовать очистители воздуха в помещении',
        'Следить за сводками качества воздуха',
      ]
    },
  ];
  return (
    <div className="container py-5">
      <h1 className="display-4 text-center mb-5">Рекомендации по качеству воздуха</h1>
      <div className="row mb-5">
        <div className="col-12">
          <div className="alert alert-info">
            <p className="mb-0">
              Данные рекомендации основаны на индексе качества воздуха (AQI) и предназначены 
              для того, чтобы помочь вам принимать решения о том, когда и как изменить свою 
              активность на открытом воздухе для защиты своего здоровья.
            </p>
          </div>
        </div>
      </div>
      <div className="row g-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="col-12">
            <div className={`card border-${rec.color}`}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <rec.icon className={`text-${rec.color} me-2`} size={24} />
                  <h2 className="rec h4 mb-0">{rec.level}</h2>
                </div>
                <p className="card-text mb-4">{rec.description}</p>
                <h3 className="rec h5 mb-3">Рекомендуемые действия:</h3>
                <ul className="list-unstyled">
                  {rec.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="rec mb-2">
                      <span className={`text-${rec.color} me-2`}>•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recoms;