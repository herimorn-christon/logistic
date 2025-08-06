import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setVehicles, setFilters } from '../../store/slices/fleetSlice';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Fuel, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const FleetManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { vehicles, filters } = useSelector((state: RootState) => state.fleet);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockVehicles = [
      {
        id: '1',
        registrationNumber: 'TR-001',
        type: 'truck' as const,
        status: 'active' as const,
        driver: 'John Doe',
        location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
        fuelLevel: 75,
        mileage: 125000,
        lastMaintenance: '2024-01-15',
        nextMaintenanceDate: '2024-04-15',
        specifications: {
          make: 'Volvo',
          model: 'VNL 860',
          year: 2022,
          capacity: 40000,
          fuelType: 'Diesel',
        },
        documents: {
          insurance: 'INS-001',
          registration: 'REG-001',
          permit: 'PER-001',
        },
        aiPredictions: {
          breakdownRisk: 15,
          fuelEfficiency: 85,
          maintenanceNeeded: false,
        },
      },
      {
        id: '2',
        registrationNumber: 'TR-002',
        type: 'truck' as const,
        status: 'maintenance' as const,
        driver: 'Jane Smith',
        location: { lat: 40.7589, lng: -73.9851, address: 'Manhattan, NY' },
        fuelLevel: 45,
        mileage: 98000,
        lastMaintenance: '2024-02-01',
        nextMaintenanceDate: '2024-05-01',
        specifications: {
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2021,
          capacity: 35000,
          fuelType: 'Diesel',
        },
        documents: {
          insurance: 'INS-002',
          registration: 'REG-002',
          permit: 'PER-002',
        },
        aiPredictions: {
          breakdownRisk: 65,
          fuelEfficiency: 78,
          maintenanceNeeded: true,
        },
      },
    ];

    dispatch(setVehicles(mockVehicles));
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'inactive':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return 'text-green-600';
    if (risk <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.specifications.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.specifications.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status.length === 0 || filters.status.includes(vehicle.status);
    const matchesType = filters.type.length === 0 || filters.type.includes(vehicle.type);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
            <p className="text-gray-600">Manage your fleet of vehicles and monitor their performance</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    {['active', 'maintenance', 'inactive'].map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={(e) => {
                            const newStatus = e.target.checked
                              ? [...filters.status, status]
                              : filters.status.filter(s => s !== status);
                            dispatch(setFilters({ status: newStatus }));
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <div className="space-y-2">
                    {['truck', 'van', 'trailer'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={(e) => {
                            const newType = e.target.checked
                              ? [...filters.type, type]
                              : filters.type.filter(t => t !== type);
                            dispatch(setFilters({ type: newType }));
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{vehicle.registrationNumber}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{vehicle.specifications.make} {vehicle.specifications.model}</span>
                    <span className="ml-2">({vehicle.specifications.year})</span>
                  </div>
                  {vehicle.driver && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Driver: {vehicle.driver}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{vehicle.location.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vehicle.fuelLevel}%</div>
                      <div className="text-xs text-gray-500">Fuel Level</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vehicle.mileage.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Miles</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">AI Risk Score</span>
                    <span className={`font-medium ${getRiskColor(vehicle.aiPredictions.breakdownRisk)}`}>
                      {vehicle.aiPredictions.breakdownRisk}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Fuel Efficiency</span>
                    <span className="font-medium text-blue-600">{vehicle.aiPredictions.fuelEfficiency}%</span>
                  </div>
                </div>

                {vehicle.aiPredictions.maintenanceNeeded && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">Maintenance Required</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FleetManagement;