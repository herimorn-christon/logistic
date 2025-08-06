import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  actualTime?: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  vehicleId: string;
  driverId: string;
  deliveries: string[];
  waypoints: Array<{ lat: number; lng: number; address: string }>;
  aiOptimizations: {
    fuelEfficiency: number;
    trafficPrediction: number;
    etaAccuracy: number;
  };
}

interface RouteState {
  routes: Route[];
  optimizedRoutes: Route[];
  loading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  routes: [],
  optimizedRoutes: [],
  loading: false,
  error: null,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload;
    },
    setOptimizedRoutes: (state, action: PayloadAction<Route[]>) => {
      state.optimizedRoutes = action.payload;
    },
    addRoute: (state, action: PayloadAction<Route>) => {
      state.routes.push(action.payload);
    },
    updateRoute: (state, action: PayloadAction<Route>) => {
      const index = state.routes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.routes[index] = action.payload;
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

export const { setRoutes, setOptimizedRoutes, addRoute, updateRoute, setLoading, setError } = routeSlice.actions;
export default routeSlice.reducer;