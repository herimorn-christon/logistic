const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();

const db = require('./config/database');
const logger = require('./utils/logger');
const socketHandler = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/auth');
const fleetRoutes = require('./routes/fleet');
const routeRoutes = require('./routes/routes');
const deliveryRoutes = require('./routes/deliveries');
const driverRoutes = require('./routes/drivers');
const maintenanceRoutes = require('./routes/maintenance');
const cargoRoutes = require('./routes/cargo');
const fuelRoutes = require('./routes/fuel');
const customerRoutes = require('./routes/customers');
const chatbotRoutes = require('./routes/chatbot');
const analyticsRoutes = require('./routes/analytics');
const trackingRoutes = require('./routes/tracking');
const contractRoutes = require('./routes/contracts');
const documentRoutes = require('./routes/documents');
const reportRoutes = require('./routes/reports');
const invoiceRoutes = require('./routes/invoices');
const complianceRoutes = require('./routes/compliance');
const coldchainRoutes = require('./routes/coldchain');
const forecastingRoutes = require('./routes/forecasting');
const integrationRoutes = require('./routes/integrations');
const sustainabilityRoutes = require('./routes/sustainability');
const roleRoutes = require('./routes/roles');
const pricingRoutes = require('./routes/pricing');
const geofencingRoutes = require('./routes/geofencing');
const warehouseRoutes = require('./routes/warehouse');
const podRoutes = require('./routes/pod');
const riskRoutes = require('./routes/risk');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.IO
socketHandler(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/coldchain', coldchainRoutes);
app.use('/api/forecasting', forecastingRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/geofencing', geofencingRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/pod', podRoutes);
app.use('/api/risk', riskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Scheduled tasks
cron.schedule('0 */6 * * *', () => {
  logger.info('Running AI predictions update...');
  // Trigger AI prediction updates
});

cron.schedule('0 0 * * *', () => {
  logger.info('Running daily analytics aggregation...');
  // Aggregate daily analytics
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, io };