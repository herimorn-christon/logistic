import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FuelRecord {
  id: string;
  vehicleId: string;
  driverId: string;
  amount: number;
  cost: number;
  location: string;
  timestamp: string;
  mileage: number;
  fuelType: string;
  aiAnalysis: {
    efficiencyScore: number;
    fraudRisk: number;
    patternAnomaly: boolean;
  };
}

interface FuelState {
  records: FuelRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: FuelState = {
  records: [],
  loading: false,
  error: null,
};

const fuelSlice = createSlice({
  name: 'fuel',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<FuelRecord[]>) => {
      state.records = action.payload;
    },
    addRecord: (state, action: PayloadAction<FuelRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<FuelRecord>) => {
      const index = state.records.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
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

export const { setRecords, addRecord, updateRecord, setLoading, setError } = fuelSlice.actions;
export default fuelSlice.reducer;