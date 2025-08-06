import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'scheduled' | 'emergency' | 'preventive';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: string;
  completedDate?: string;
  description: string;
  cost: number;
  parts: string[];
  aiPredictions: {
    failureRisk: number;
    nextMaintenanceDate: string;
    costEstimate: number;
  };
}

interface MaintenanceState {
  records: MaintenanceRecord[];
  alerts: MaintenanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  records: [],
  alerts: [],
  loading: false,
  error: null,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<MaintenanceRecord[]>) => {
      state.records = action.payload;
    },
    setAlerts: (state, action: PayloadAction<MaintenanceRecord[]>) => {
      state.alerts = action.payload;
    },
    addRecord: (state, action: PayloadAction<MaintenanceRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<MaintenanceRecord>) => {
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

export const { setRecords, setAlerts, addRecord, updateRecord, setLoading, setError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;