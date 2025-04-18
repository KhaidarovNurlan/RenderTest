import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Recoms from './pages/Recoms';
import Theme from './components/Theme';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>;
  }
  return user ? children : <Navigate to="/auth" />;
};

function AppContent() {
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();
  return (
    <div className={`d-flex flex-column min-vh-100 ${isDark ? 'dark' : ''}`}>
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/recoms" element={<Recoms />} />
        </Routes>
      </main>
      <Footer />
      <Theme isDark={isDark} setIsDark={setIsDark} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;