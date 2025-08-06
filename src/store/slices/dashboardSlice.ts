import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardMetrics {
  totalVehicles: number;
  activeVehicles: number;
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  totalDrivers: number;
  activeDrivers: number;
  fuelConsumption: number;
  revenue: number;
  maintenanceAlerts: number;
  co2Emissions: number;
}

interface DashboardState {
  metrics: DashboardMetrics;
  recentActivities: any[];
  alerts: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: {
    totalVehicles: 0,
    activeVehicles: 0,
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    fuelConsumption: 0,
    revenue: 0,
    maintenanceAlerts: 0,
    co2Emissions: 0,
  },
  recentActivities: [],
  alerts: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload;
    },
    setRecentActivities: (state, action: PayloadAction<any[]>) => {
      state.recentActivities = action.payload;
    },
    setAlerts: (state, action: PayloadAction<any[]>) => {
      state.alerts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMetrics, setRecentActivities, setAlerts, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;