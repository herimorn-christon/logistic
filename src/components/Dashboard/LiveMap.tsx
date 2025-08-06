import React, { useEffect, useState } from 'react';
import { MapPin, Truck, Navigation, AlertTriangle } from 'lucide-react';

interface MapMarker {
  id: string;
  type: 'vehicle' | 'delivery' | 'alert';
  lat: number;
  lng: number;
  label: string;
  status: string;
}

const LiveMap: React.FC = () => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    // Simulate real-time map data
    const mockMarkers: MapMarker[] = [
      { id: '1', type: 'vehicle', lat: 40.7128, lng: -74.0060, label: 'TR-001', status: 'active' },
      { id: '2', type: 'vehicle', lat: 40.7589, lng: -73.9851, label: 'TR-002', status: 'active' },
      { id: '3', type: 'delivery', lat: 40.7505, lng: -73.9934, label: 'D-001', status: 'in_transit' },
      { id: '4', type: 'alert', lat: 40.7282, lng: -73.7949, label: 'TR-003', status: 'maintenance' },
    ];

    setMarkers(mockMarkers);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarkers(prev => prev.map(marker => ({
        ...marker,
        lat: marker.lat + (Math.random() - 0.5) * 0.01,
        lng: marker.lng + (Math.random() - 0.5) * 0.01,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMarkerIcon = (type: MapMarker['type'], status: string) => {
    switch (type) {
      case 'vehicle':
        return <Truck className={`h-4 w-4 ${status === 'active' ? 'text-green-600' : 'text-red-600'}`} />;
      case 'delivery':
        return <Navigation className="h-4 w-4 text-blue-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMarkerColor = (type: MapMarker['type'], status: string) => {
    switch (type) {
      case 'vehicle':
        return status === 'active' ? 'bg-green-500' : 'bg-red-500';
      case 'delivery':
        return 'bg-blue-500';
      case 'alert':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Live Fleet Tracking</h3>
        <p className="text-sm text-gray-600">Real-time vehicle and delivery tracking</p>
      </div>
      <div className="relative h-96 bg-gray-100 rounded-b-lg overflow-hidden">
        {/* Simulated map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-30"></div>
        
        {/* Map markers */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${((marker.lng + 74.0060) * 10) % 100}%`,
              top: `${((marker.lat - 40.7128) * 50 + 50) % 100}%`,
            }}
            onClick={() => setSelectedMarker(marker)}
          >
            <div className={`w-8 h-8 rounded-full ${getMarkerColor(marker.type, marker.status)} flex items-center justify-center shadow-lg border-2 border-white`}>
              {getMarkerIcon(marker.type, marker.status)}
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
              {marker.label}
            </div>
          </div>
        ))}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Navigation className="h-5 w-5 text-gray-600" />
          </button>
          <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <MapPin className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Active Vehicle</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Alert</span>
            </div>
          </div>
        </div>

        {/* Marker info popup */}
        {selectedMarker && (
          <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              {getMarkerIcon(selectedMarker.type, selectedMarker.status)}
              <span className="font-medium">{selectedMarker.label}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Status: <span className="capitalize">{selectedMarker.status.replace('_', ' ')}</span>
            </p>
            <p className="text-xs text-gray-500">
              Location: {selectedMarker.lat.toFixed(4)}, {selectedMarker.lng.toFixed(4)}
            </p>
            <button
              onClick={() => setSelectedMarker(null)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMap;