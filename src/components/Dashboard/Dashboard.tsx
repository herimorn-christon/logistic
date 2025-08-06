import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setMetrics, setRecentActivities, setAlerts } from '../../store/slices/dashboardSlice';
import useSocket from '../../hooks/useSocket';
import DashboardLayout from './DashboardLayout';
import MetricsCards from './MetricsCards';
import RecentActivities from './RecentActivities';
import AlertsPanel from './AlertsPanel';
import LiveMap from './LiveMap';
import PerformanceCharts from './PerformanceCharts';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { metrics, recentActivities, alerts, loading } = useSelector((state: RootState) => state.dashboard);
  const { emit } = useSocket();

  useEffect(() => {
    // Fetch initial dashboard data
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls
        const mockMetrics = {
          totalVehicles: 156,
          activeVehicles: 142,
          totalDeliveries: 2847,
          completedDeliveries: 2654,
          pendingDeliveries: 193,
          totalDrivers: 89,
          activeDrivers: 76,
          fuelConsumption: 45230,
          revenue: 1247500,
          maintenanceAlerts: 8,
          co2Emissions: 125.4,
        };

        const mockActivities = [
          { id: '1', type: 'delivery', message: 'Delivery #D-2024-001 completed', timestamp: new Date().toISOString() },
          { id: '2', type: 'maintenance', message: 'Vehicle TR-001 scheduled for maintenance', timestamp: new Date().toISOString() },
          { id: '3', type: 'route', message: 'Route optimization completed for 15 vehicles', timestamp: new Date().toISOString() },
        ];

        const mockAlerts = [
          { id: '1', type: 'critical', message: 'Vehicle TR-045 requires immediate maintenance', timestamp: new Date().toISOString() },
          { id: '2', type: 'warning', message: 'Driver fatigue detected for John Doe', timestamp: new Date().toISOString() },
        ];

        dispatch(setMetrics(mockMetrics));
        dispatch(setRecentActivities(mockActivities));
        dispatch(setAlerts(mockAlerts));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    // Set up real-time updates
    const interval = setInterval(() => {
      emit('requestDashboardUpdate', {});
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, emit]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Updates</span>
          </div>
        </div>

        <MetricsCards metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveMap />
          </div>
          <div>
            <AlertsPanel alerts={alerts} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceCharts />
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;