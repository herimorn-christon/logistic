import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Vehicle {
  id: string;
  registrationNumber: string;
  type: 'truck' | 'van' | 'trailer';
  status: 'active' | 'maintenance' | 'inactive';
  driver?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  fuelLevel: number;
  mileage: number;
  lastMaintenance: string;
  nextMaintenanceDate: string;
  specifications: {
    make: string;
    model: string;
    year: number;
    capacity: number;
    fuelType: string;
  };
  documents: {
    insurance: string;
    registration: string;
    permit: string;
  };
  aiPredictions: {
    breakdownRisk: number;
    fuelEfficiency: number;
    maintenanceNeeded: boolean;
  };
}

interface FleetState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  selectedVehicle: Vehicle | null;
  filters: {
    status: string[];
    type: string[];
  };
}

const initialState: FleetState = {
  vehicles: [],
  loading: false,
  error: null,
  selectedVehicle: null,
  filters: {
    status: [],
    type: [],
  },
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.push(action.payload);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.vehicles.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
    },
    selectVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.selectedVehicle = action.payload;
    },
    updateVehicleLocation: (state, action: PayloadAction<{ id: string; location: Vehicle['location'] }>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.id);
      if (vehicle) {
        vehicle.location = action.payload.location;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<FleetState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setVehicles, 
  addVehicle, 
  updateVehicle, 
  selectVehicle, 
  updateVehicleLocation, 
  setFilters, 
  setLoading, 
  setError 
} = fleetSlice.actions;
export default fleetSlice.reducer;