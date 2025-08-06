import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import fleetSlice from './slices/fleetSlice';
import routeSlice from './slices/routeSlice';
import deliverySlice from './slices/deliverySlice';
import driverSlice from './slices/driverSlice';
import maintenanceSlice from './slices/maintenanceSlice';
import cargoSlice from './slices/cargoSlice';
import fuelSlice from './slices/fuelSlice';
import customerSlice from './slices/customerSlice';
import chatbotSlice from './slices/chatbotSlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    fleet: fleetSlice,
    route: routeSlice,
    delivery: deliverySlice,
    driver: driverSlice,
    maintenance: maintenanceSlice,
    cargo: cargoSlice,
    fuel: fuelSlice,
    customer: customerSlice,
    chatbot: chatbotSlice,
    dashboard: dashboardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;