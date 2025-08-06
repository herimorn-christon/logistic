import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Cargo {
  id: string;
  deliveryId: string;
  type: 'general' | 'fragile' | 'hazardous' | 'refrigerated' | 'oversized';
  weight: number;
  dimensions: { length: number; width: number; height: number };
  value: number;
  temperature?: { current: number; min: number; max: number };
  humidity?: number;
  status: 'loaded' | 'in_transit' | 'delivered' | 'damaged';
  aiMonitoring: {
    conditionScore: number;
    riskAssessment: number;
    temperatureAlerts: boolean;
  };
}

interface CargoState {
  cargos: Cargo[];
  loading: boolean;
  error: string | null;
}

const initialState: CargoState = {
  cargos: [],
  loading: false,
  error: null,
};

const cargoSlice = createSlice({
  name: 'cargo',
  initialState,
  reducers: {
    setCargos: (state, action: PayloadAction<Cargo[]>) => {
      state.cargos = action.payload;
    },
    addCargo: (state, action: PayloadAction<Cargo>) => {
      state.cargos.push(action.payload);
    },
    updateCargo: (state, action: PayloadAction<Cargo>) => {
      const index = state.cargos.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cargos[index] = action.payload;
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

export const { setCargos, addCargo, updateCargo, setLoading, setError } = cargoSlice.actions;
export default cargoSlice.reducer;