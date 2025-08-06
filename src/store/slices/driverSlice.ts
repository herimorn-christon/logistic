import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'on_leave';
  currentVehicle?: string;
  location?: { lat: number; lng: number };
  performance: {
    rating: number;
    completedDeliveries: number;
    onTimeDeliveries: number;
    safetyScore: number;
    fuelEfficiency: number;
  };
  aiMonitoring: {
    fatigueLevel: number;
    drivingScore: number;
    riskAssessment: number;
  };
}

interface DriverState {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  drivers: [],
  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<Driver[]>) => {
      state.drivers = action.payload;
    },
    addDriver: (state, action: PayloadAction<Driver>) => {
      state.drivers.push(action.payload);
    },
    updateDriver: (state, action: PayloadAction<Driver>) => {
      const index = state.drivers.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.drivers[index] = action.payload;
      }
    },
    updateDriverLocation: (state, action: PayloadAction<{ id: string; location: { lat: number; lng: number } }>) => {
      const driver = state.drivers.find(d => d.id === action.payload.id);
      if (driver) {
        driver.location = action.payload.location;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setDrivers, addDriver, updateDriver, updateDriverLocation, setLoading, setError } = driverSlice.actions;
export default driverSlice.reducer;