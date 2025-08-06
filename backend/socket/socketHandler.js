const logger = require('../utils/logger');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join user to their specific room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      logger.info(`User ${userId} joined room`);
    });

    // Vehicle location updates
    socket.on('vehicleLocationUpdate', (data) => {
      socket.broadcast.emit('vehicleLocationUpdate', data);
    });

    // Driver location updates
    socket.on('driverLocationUpdate', (data) => {
      socket.broadcast.emit('driverLocationUpdate', data);
    });

    // Delivery status updates
    socket.on('deliveryStatusUpdate', (data) => {
      socket.broadcast.emit('deliveryStatusUpdate', data);
    });

    // Maintenance alerts
    socket.on('maintenanceAlert', (data) => {
      io.emit('maintenanceAlert', data);
    });

    // Fuel alerts
    socket.on('fuelAlert', (data) => {
      io.emit('fuelAlert', data);
    });

    // Geofencing alerts
    socket.on('geofenceAlert', (data) => {
      io.emit('geofenceAlert', data);
    });

    // Emergency alerts
    socket.on('emergencyAlert', (data) => {
      io.emit('emergencyAlert', data);
    });

    // Chat messages
    socket.on('chatMessage', (data) => {
      socket.broadcast.emit('chatMessage', data);
    });

    // Dashboard updates
    socket.on('requestDashboardUpdate', () => {
      // Fetch and emit latest dashboard data
      socket.emit('dashboardUpdate', {
        timestamp: new Date().toISOString(),
        metrics: {
          activeVehicles: Math.floor(Math.random() * 200) + 100,
          completedDeliveries: Math.floor(Math.random() * 1000) + 2000,
          // Add more real-time metrics
        }
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;