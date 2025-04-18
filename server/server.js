const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const pool = require('./db');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Недействительный токен' });
  }
};

app.post('/api/check-device', async (req, res) => {
  try {
    const { deviceFingerprint } = req.body;
    const deviceResult = await pool.query(
      'SELECT users.* FROM devices JOIN users ON devices.last_user_id = users.user_id WHERE device_fingerprint = $1',
      [deviceFingerprint]
    );
    if (deviceResult.rows.length > 0) {
      const user = deviceResult.rows[0];
      const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      return res.json({ 
        authenticated: true,
        user: { email: user.email }
      });
    }
    res.json({ authenticated: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password, deviceFingerprint } = req.body;
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    await pool.query(
      `INSERT INTO devices (device_fingerprint, last_user_id, last_login)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (device_fingerprint)
       DO UPDATE SET last_user_id = $2, last_login = CURRENT_TIMESTAMP`,
      [deviceFingerprint, user.user_id]
    );
    const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.json({ user: { email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password, deviceFingerprint } = req.body;
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email уже используется' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, passwordHash]
    );
    await pool.query(
      `INSERT INTO devices (device_fingerprint, last_user_id, last_login)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (device_fingerprint)
       DO UPDATE SET last_user_id = $2, last_login = CURRENT_TIMESTAMP`,
      [deviceFingerprint, newUser.rows[0].user_id]
    );
    const token = jwt.sign(
      { userId: newUser.rows[0].user_id, email },
      process.env.JWT_SECRET
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.json({ user: { email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Выход выполнен успешно' });
});

app.post('/api/measurements', authenticateToken, async (req, res) => {
  try {
    const { cityName, aqi, temperature, humidity, pm25, pm10 } = req.body;
    await pool.query(
      `INSERT INTO measurements 
       (user_id, city_name, aqi, temperature, humidity, pm25, pm10)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [req.user.userId, cityName, aqi, temperature, humidity, pm25, pm10]
    );
    res.json({ message: 'Измерение сохранено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/measurements/:cityName', authenticateToken, async (req, res) => {
  try {
    const { cityName } = req.params;
    const measurements = await pool.query(
      `SELECT * FROM measurements 
       WHERE user_id = $1 AND city_name = $2 
       ORDER BY measured_at DESC`,
      [req.user.userId, cityName]
    );
    res.json(measurements.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});