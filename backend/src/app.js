const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
