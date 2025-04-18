import React, { useState, useEffect } from 'react';
import { Wind, Thermometer, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const cities = [
  { name: 'Астана', lat: 51.1801, lon: 71.446 },
  { name: 'Алматы', lat: 43.2567, lon: 76.9286 },
  { name: 'Шымкент', lat: 42.3167, lon: 69.5967 },
  { name: 'Караганда', lat: 49.8047, lon: 73.1094 },
  { name: 'Атырау', lat: 47.1167, lon: 51.8833 }
];

const getAQIDescription = (aqi) => {
  if (aqi <= 50) return { text: 'Хорошее', color: 'text-success' };
  if (aqi <= 100) return { text: 'Умеренное', color: 'text-warning' };
  if (aqi <= 150) return { text: 'Вредное для чувствительных групп', color: 'text-warning' };
  if (aqi <= 200) return { text: 'Вредное', color: 'text-danger' };
  if (aqi <= 300) return { text: 'Очень вредное', color: 'text-danger' };
  return { text: 'Опасное', color: 'text-danger' };
};

const ITEMS_PER_PAGE = 10;

function Dashboard() {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastSavedData, setLastSavedData] = useState(null);
  useEffect(() => {
    if (user) {
      const username = user.email.split('@')[0];
      document.title = `${username} - EcoMonitor`;
    }
    return () => {
      document.title = 'EcoMonitor';
    };
  }, [user]);
  const fetchMeasurements = async (city) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/measurements/${city.name}`,
        { withCredentials: true }
      );
      setMeasurements(response.data);
    } catch (err) {
      console.error('Error fetching measurements:', err);
    }
  };
  const saveMeasurement = async (data, city) => {
    const dataString = JSON.stringify({ aqi: data.aqi, temperature: data.temperature, humidity: data.humidity });
    if (dataString === lastSavedData) {
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/measurements', {
        cityName: city.name,
        aqi: data.aqi,
        temperature: data.temperature,
        humidity: data.humidity,
        pm25: data.components.pm2_5,
        pm10: data.components.pm10
      }, { withCredentials: true });
      setLastSavedData(dataString);
      await fetchMeasurements(city);
    } catch (err) {
      console.error('Error saving measurement:', err);
    }
  };
  const fetchAirQuality = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const [weatherResponse, airResponse] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=b3f4514f601096ddfeb1873890e6cfd2&units=metric`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=b3f4514f601096ddfeb1873890e6cfd2`
        )
      ]);
      if (!weatherResponse.ok || !airResponse.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const [weatherData, airData] = await Promise.all([
        weatherResponse.json(),
        airResponse.json()
      ]);
      const combinedData = {
        aqi: airData.list[0].main.aqi,
        components: airData.list[0].components,
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity
      };
      setAirData(combinedData);
      await saveMeasurement(combinedData, city);
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality(selectedCity);
    fetchMeasurements(selectedCity);
    setCurrentPage(0);
    setLastSavedData(null);
    const interval = setInterval(() => {
      fetchAirQuality(selectedCity);
    }, 300000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const totalPages = Math.ceil(measurements.length / ITEMS_PER_PAGE);
  const paginatedMeasurements = measurements.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h1 className="h3 font-weight-bold text-dark">
          Мониторинг экологии
        </h1>
        <select
          value={selectedCity.name}
          onChange={(e) => setSelectedCity(cities.find(city => city.name === e.target.value) || cities[0])}
          className="form-select w-auto"
        >
          {cities.map((city) => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card p-4">
            <div className="d-flex justify-content-between mb-3">
              <h3 className="h5 text-dark">Качество воздуха</h3>
              <Wind className="h3 text-success" />
            </div>
            {loading ? (
              <div className="animate-pulse h-20 bg-secondary rounded"></div>
            ) : airData && (
              <>
                <div className={`h2 font-weight-bold mb-2 ${getAQIDescription(airData.aqi).color}`}>
                  {getAQIDescription(airData.aqi).text}, AQI = {airData.aqi}
                </div>
                <p className="text-muted">
                  PM2.5: {airData.components.pm2_5.toFixed(1)} мкг/м³; PM10: {airData.components.pm10.toFixed(1)} мкг/м³
                </p>
              </>
            )}
          </div>
        </div>
        <div className="col">
          <div className="card p-4">
            <div className="d-flex justify-content-between mb-3">
              <h3 className="h5 text-dark">Температура</h3>
              <Thermometer className="h3 text-success" />
            </div>
            {loading ? (
              <div className="animate-pulse h-20 bg-secondary rounded"></div>
            ) : airData && (
              <>
                <div className="h2 font-weight-bold text-success mb-2">
                  {airData.temperature.toFixed(1)}°C
                </div>
                <p className="text-muted">
                  {airData.temperature > 25 ? 'Высокая температура' : 
                   airData.temperature < 15 ? 'Низкая температура' : 
                   'Комфортная температура'}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="col">
          <div className="card p-4">
            <div className="d-flex justify-content-between mb-3">
              <h3 className="h5 text-dark">Влажность</h3>
              <Droplets className="h3 text-success" />
            </div>
            {loading ? (
              <div className="animate-pulse h-20 bg-secondary rounded"></div>
            ) : airData && (
              <>
                <div className="h2 font-weight-bold text-success mb-2">
                  {airData.humidity}%
                </div>
                <p className="text-muted">
                  {airData.humidity > 70 ? 'Повышенная влажность' :
                   airData.humidity < 30 ? 'Пониженная влажность' :
                   'Оптимальный уровень'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h4 font-weight-bold text-dark mb-0">
            История измерений
          </h3>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-success"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="btn btn-outline-success"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Качество воздуха</th>
                <th>Температура</th>
                <th>Влажность</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMeasurements.map((measurement, index) => (
                <tr key={index}>
                  <td>{new Date(measurement.measured_at).toLocaleString()}</td>
                  <td>
                    <span className={getAQIDescription(measurement.aqi).color}>
                      {getAQIDescription(measurement.aqi).text}, AQI = {measurement.aqi}
                    </span>
                  </td>
                  <td>{parseFloat(measurement.temperature).toFixed(1)}°C</td>
                  <td>{measurement.humidity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;