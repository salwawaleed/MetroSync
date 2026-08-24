const express = require('express');
const cors = require('cors');
const path = require('path');
const stationRoutes = require('./routes/stationRoutes');
const authRoutes = require('./routes/authRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MetroSync API is running' });
});

app.use('/api/v1/stations', stationRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stations', announcementRoutes);

app.use(errorHandler);

module.exports = app;
