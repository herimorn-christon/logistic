import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { loginSuccess } from './store/slices/authSlice';
import useSocket from './hooks/useSocket';

// Components
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import FleetManagement from './components/Fleet/FleetManagement';
import RouteOptimization from './components/Routes/RouteOptimization';
import DeliveryManagement from './components/Deliveries/DeliveryManagement';
import DriverManagement from './components/Drivers/DriverManagement';
import MaintenanceManagement from './components/Maintenance/MaintenanceManagement';
import CargoMonitoring from './components/Cargo/CargoMonitoring';
import Chatbot from './components/AI/Chatbot';

const AppContent: React.FC = () => {
  useSocket(); // Initialize socket connection

  useEffect(() => {
    // Initialize with demo user for development
    const demoUser = {
      id: '1',
      email: 'demo@fleetforge.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin' as const,
      permissions: ['all'],
      avatar: '',
    };
    
    store.dispatch(loginSuccess({ user: demoUser, token: 'demo-token' }));
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fleet" element={<FleetManagement />} />
          <Route path="/routes" element={<RouteOptimization />} />
          <Route path="/deliveries" element={<DeliveryManagement />} />
          <Route path="/drivers" element={<DriverManagement />} />
          <Route path="/maintenance" element={<MaintenanceManagement />} />
          <Route path="/cargo" element={<CargoMonitoring />} />
          <Route path="/fuel" element={<Dashboard />} />
          <Route path="/customers" element={<Dashboard />} />
          <Route path="/chatbot" element={<Dashboard />} />
          <Route path="/pricing" element={<Dashboard />} />
          <Route path="/geofencing" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/tracking" element={<Dashboard />} />
          <Route path="/contracts" element={<Dashboard />} />
          <Route path="/documents" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/invoices" element={<Dashboard />} />
          <Route path="/compliance" element={<Dashboard />} />
          <Route path="/coldchain" element={<Dashboard />} />
          <Route path="/forecasting" element={<Dashboard />} />
          <Route path="/integrations" element={<Dashboard />} />
          <Route path="/sustainability" element={<Dashboard />} />
          <Route path="/roles" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;