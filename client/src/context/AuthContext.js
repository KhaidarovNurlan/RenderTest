import React, { createContext, useState, useContext, useEffect } from 'react';
import Fingerprint2 from 'fingerprintjs2';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const getDeviceFingerprint = async () => {
    const components = await Fingerprint2.getPromise();
    const values = components.map(component => component.value);
    return Fingerprint2.x64hash128(values.join(''), 31);
  };
  const checkDevice = async () => {
    try {
      const fingerprint = await getDeviceFingerprint();
      const response = await axios.post('http://localhost:5000/api/check-device', {
        deviceFingerprint: fingerprint
      }, { withCredentials: true });

      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error checking device:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDevice();
  }, []);
  
  const login = async (email, password) => {
    try {
      const fingerprint = await getDeviceFingerprint();
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        deviceFingerprint: fingerprint
      }, { withCredentials: true });

      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка входа'
      };
    }
  };

  const register = async (email, password) => {
    try {
      const fingerprint = await getDeviceFingerprint();
      const response = await axios.post('http://localhost:5000/api/register', {
        email,
        password,
        deviceFingerprint: fingerprint
      }, { withCredentials: true });

      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка регистрации'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};