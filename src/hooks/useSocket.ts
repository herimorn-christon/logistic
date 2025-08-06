import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { updateVehicleLocation } from '../store/slices/fleetSlice';
import { updateDriverLocation } from '../store/slices/driverSlice';
import { updateDelivery } from '../store/slices/deliverySlice';

const useSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    // Listen for real-time updates
    socket.on('vehicleLocationUpdate', (data) => {
      dispatch(updateVehicleLocation(data));
    });

    socket.on('driverLocationUpdate', (data) => {
      dispatch(updateDriverLocation(data));
    });

    socket.on('deliveryStatusUpdate', (data) => {
      dispatch(updateDelivery(data));
    });

    socket.on('maintenanceAlert', (data) => {
      console.log('Maintenance alert:', data);
      // Handle maintenance alerts
    });

    socket.on('fuelAlert', (data) => {
      console.log('Fuel alert:', data);
      // Handle fuel alerts
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return { emit };
};

export default useSocket;