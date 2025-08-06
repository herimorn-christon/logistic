import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Delivery {
  id: string;
  trackingNumber: string;
  customerId: string;
  routeId: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  pickupLocation: string;
  deliveryLocation: string;
  scheduledPickup: string;
  scheduledDelivery: string;
  actualPickup?: string;
  actualDelivery?: string;
  cargo: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
    type: string;
    value: number;
    specialRequirements: string[];
  };
  aiPredictions: {
    estimatedDeliveryTime: string;
    delayRisk: number;
    trafficImpact: number;
  };
}

interface DeliveryState {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  deliveries: [],
  loading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliveries: (state, action: PayloadAction<Delivery[]>) => {
      state.deliveries = action.payload;
    },
    addDelivery: (state, action: PayloadAction<Delivery>) => {
      state.deliveries.push(action.payload);
    },
    updateDelivery: (state, action: PayloadAction<Delivery>) => {
      const index = state.deliveries.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.deliveries[index] = action.payload;
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

export const { setDeliveries, addDelivery, updateDelivery, setLoading, setError } = deliverySlice.actions;
export default deliverySlice.reducer;