import React, { useState } from 'react';
import { UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = isLogin
        ? await login(email, password)
        : await register(email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container d-flex justify-content-center py-5">
      <div className="bg-white p-5 rounded shadow-sm" style={{ maxWidth: '550px', width: '100%' }}>
        <div className="d-flex justify-content-center mb-4">
          {isLogin ? (
            <LogIn className="text-success" size={48} />
          ) : (
            <UserPlus className="text-success" size={48} />
          )}
        </div>
        <h2 className="text-center fw-bold text-dark mb-4 fs-3">
          {isLogin ? 'Вход в систему' : 'Регистрация'}
        </h2>
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <AlertCircle className="me-2" size={20} />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Пароль</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 btn-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="btn btn-link text-success fs-5"
          >
            {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;