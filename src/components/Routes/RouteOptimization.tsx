import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setRoutes, setOptimizedRoutes } from '../../store/slices/routeSlice';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Fuel, 
  Zap, 
  TrendingUp,
  Route,
  Play,
  Save,
  RefreshCw
} from 'lucide-react';

const RouteOptimization: React.FC = () => {
  const dispatch = useDispatch();
  const { routes, optimizedRoutes } = useSelector((state: RootState) => state.route);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    // Mock route data
    const mockRoutes = [
      {
        id: '1',
        name: 'Downtown Delivery Circuit',
        origin: 'Warehouse A - 123 Main St',
        destination: 'Customer Zone - Downtown',
        distance: 45.2,
        estimatedTime: 120,
        status: 'planned' as const,
        vehicleId: 'v1',
        driverId: 'd1',
        deliveries: ['del1', 'del2', 'del3'],
        waypoints: [
          { lat: 40.7128, lng: -74.0060, address: 'Stop 1 - 456 Broadway' },
          { lat: 40.7589, lng: -73.9851, address: 'Stop 2 - 789 5th Ave' },
          { lat: 40.7505, lng: -73.9934, address: 'Stop 3 - 321 Park Ave' }
        ],
        aiOptimizations: {
          fuelEfficiency: 85,
          trafficPrediction: 75,
          etaAccuracy: 92
        }
      },
      {
        id: '2',
        name: 'Suburban Express Route',
        origin: 'Warehouse B - 456 Industrial Blvd',
        destination: 'Suburban District',
        distance: 78.5,
        estimatedTime: 180,
        status: 'active' as const,
        vehicleId: 'v2',
        driverId: 'd2',
        deliveries: ['del4', 'del5'],
        waypoints: [
          { lat: 40.6892, lng: -74.0445, address: 'Stop 1 - 123 Suburban Ave' },
          { lat: 40.6782, lng: -73.9442, address: 'Stop 2 - 567 Oak Street' }
        ],
        aiOptimizations: {
          fuelEfficiency: 78,
          trafficPrediction: 88,
          etaAccuracy: 89
        }
      }
    ];

    dispatch(setRoutes(mockRoutes));
  }, [dispatch]);

  const handleOptimizeRoute = async (routeId: string) => {
    setIsOptimizing(true);
    setSelectedRoute(routeId);

    try {
      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const route = routes.find(r => r.id === routeId);
      if (route) {
        const optimizedRoute = {
          ...route,
          distance: route.distance * 0.85, // 15% reduction
          estimatedTime: route.estimatedTime * 0.9, // 10% reduction
          aiOptimizations: {
            fuelEfficiency: Math.min(95, route.aiOptimizations.fuelEfficiency + 10),
            trafficPrediction: Math.min(95, route.aiOptimizations.trafficPrediction + 5),
            etaAccuracy: Math.min(98, route.aiOptimizations.etaAccuracy + 3)
          }
        };

        dispatch(setOptimizedRoutes([...optimizedRoutes, optimizedRoute]));
      }
    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setIsOptimizing(false);
      setSelectedRoute(null);
    }
  };

  const handleOptimizeAll = async () => {
    setIsOptimizing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const optimized = routes.map(route => ({
        ...route,
        distance: route.distance * 0.85,
        estimatedTime: route.estimatedTime * 0.9,
        aiOptimizations: {
          fuelEfficiency: Math.min(95, route.aiOptimizations.fuelEfficiency + 10),
          trafficPrediction: Math.min(95, route.aiOptimizations.trafficPrediction + 5),
          etaAccuracy: Math.min(98, route.aiOptimizations.etaAccuracy + 3)
        }
      }));

      dispatch(setOptimizedRoutes(optimized));
    } catch (error) {
      console.error('Batch optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Route Optimization</h1>
            <p className="text-gray-600">AI-powered route planning and optimization</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleOptimizeAll}
              disabled={isOptimizing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isOptimizing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              <span>Optimize All Routes</span>
            </button>
          </div>
        </div>

        {/* Optimization Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {routes.reduce((sum, route) => sum + route.distance, 0).toFixed(1)} km
                </p>
              </div>
              <Navigation className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Est. Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(routes.reduce((sum, route) => sum + route.estimatedTime, 0) / 60)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fuel Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(routes.reduce((sum, route) => sum + route.aiOptimizations.fuelEfficiency, 0) / routes.length)}%
                </p>
              </div>
              <Fuel className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ETA Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(routes.reduce((sum, route) => sum + route.aiOptimizations.etaAccuracy, 0) / routes.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Routes List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Routes</h3>
            <p className="text-sm text-gray-600">Manage and optimize your delivery routes</p>
          </div>

          <div className="divide-y divide-gray-200">
            {routes.map((route) => (
              <div key={route.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Route className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{route.name}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status)}`}>
                        {route.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOptimizeRoute(route.id)}
                    disabled={isOptimizing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isOptimizing && selectedRoute === route.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span>Optimize</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Origin: {route.origin}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Destination: {route.destination}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Distance</span>
                      <p className="font-medium">{route.distance} km</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Est. Time</span>
                      <p className="font-medium">{Math.round(route.estimatedTime / 60)}h {route.estimatedTime % 60}m</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Stops</span>
                      <p className="font-medium">{route.waypoints.length}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600">Fuel Efficiency</span>
                      <span className="text-lg font-bold text-blue-700">{route.aiOptimizations.fuelEfficiency}%</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">Traffic Prediction</span>
                      <span className="text-lg font-bold text-green-700">{route.aiOptimizations.trafficPrediction}%</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600">ETA Accuracy</span>
                      <span className="text-lg font-bold text-purple-700">{route.aiOptimizations.etaAccuracy}%</span>
                    </div>
                  </div>
                </div>

                {/* Waypoints */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Route Waypoints</h5>
                  <div className="space-y-2">
                    {route.waypoints.map((waypoint, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          {index + 1}
                        </div>
                        <span>{waypoint.address}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimized Routes */}
        {optimizedRoutes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Optimized Routes</h3>
              <p className="text-sm text-gray-600">AI-optimized route suggestions</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Distance Saved</h4>
                  <p className="text-2xl font-bold text-green-900">
                    {(routes.reduce((sum, route) => sum + route.distance, 0) - 
                      optimizedRoutes.reduce((sum, route) => sum + route.distance, 0)).toFixed(1)} km
                  </p>
                  <p className="text-sm text-green-600">15% reduction</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Time Saved</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    {Math.round((routes.reduce((sum, route) => sum + route.estimatedTime, 0) - 
                      optimizedRoutes.reduce((sum, route) => sum + route.estimatedTime, 0)) / 60)}h
                  </p>
                  <p className="text-sm text-blue-600">10% reduction</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Fuel Saved</h4>
                  <p className="text-2xl font-bold text-purple-900">$245</p>
                  <p className="text-sm text-purple-600">Estimated savings</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <Save className="h-5 w-5" />
                  <span>Apply Optimizations</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RouteOptimization;