import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setDrivers } from '../../store/slices/driverSlice';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { 
  Users, 
  Search, 
  Plus, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Eye,
  Edit
} from 'lucide-react';

const DriverManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { drivers } = useSelector((state: RootState) => state.driver);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Mock driver data
    const mockDrivers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@fleetforge.com',
        phone: '+1-555-0123',
        licenseNumber: 'DL123456789',
        status: 'active' as const,
        currentVehicle: 'TR-001',
        location: { lat: 40.7128, lng: -74.0060 },
        performance: {
          rating: 4.8,
          completedDeliveries: 245,
          onTimeDeliveries: 230,
          safetyScore: 95,
          fuelEfficiency: 88
        },
        aiMonitoring: {
          fatigueLevel: 15,
          drivingScore: 92,
          riskAssessment: 8
        }
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@fleetforge.com',
        phone: '+1-555-0124',
        licenseNumber: 'DL987654321',
        status: 'active' as const,
        currentVehicle: 'TR-002',
        location: { lat: 40.7589, lng: -73.9851 },
        performance: {
          rating: 4.9,
          completedDeliveries: 312,
          onTimeDeliveries: 305,
          safetyScore: 98,
          fuelEfficiency: 91
        },
        aiMonitoring: {
          fatigueLevel: 8,
          drivingScore: 96,
          riskAssessment: 3
        }
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@fleetforge.com',
        phone: '+1-555-0125',
        licenseNumber: 'DL456789123',
        status: 'on_leave' as const,
        performance: {
          rating: 4.6,
          completedDeliveries: 189,
          onTimeDeliveries: 175,
          safetyScore: 89,
          fuelEfficiency: 85
        },
        aiMonitoring: {
          fatigueLevel: 0,
          drivingScore: 87,
          riskAssessment: 12
        }
      }
    ];

    dispatch(setDrivers(mockDrivers));
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'on_leave':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 10) return 'text-green-600';
    if (risk <= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFatigueColor = (fatigue: number) => {
    if (fatigue <= 20) return 'text-green-600';
    if (fatigue <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
            <p className="text-gray-600">Manage drivers with AI-powered performance monitoring</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Driver</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(drivers.reduce((sum, d) => sum + d.performance.rating, 0) / drivers.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(drivers.reduce((sum, d) => sum + d.performance.safetyScore, 0) / drivers.length)}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {driver.firstName[0]}{driver.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(driver.status)}`}>
                        {driver.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{driver.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    <span>License: {driver.licenseNumber}</span>
                  </div>
                  {driver.currentVehicle && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="h-4 w-4 mr-2" />
                      <span>Vehicle: {driver.currentVehicle}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{driver.performance.rating}</span>
                    </div>
                    <span className="text-xs text-gray-600">Rating</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{driver.performance.completedDeliveries}</div>
                    <span className="text-xs text-gray-600">Deliveries</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Safety Score</span>
                    <span className="font-medium">{driver.performance.safetyScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${driver.performance.safetyScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fuel Efficiency</span>
                    <span className="font-medium">{driver.performance.fuelEfficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${driver.performance.fuelEfficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                    <div className="text-sm font-bold text-blue-700">{driver.aiMonitoring.drivingScore}</div>
                    <div className="text-xs text-blue-600">Driving</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded-lg text-center">
                    <div className={`text-sm font-bold ${getFatigueColor(driver.aiMonitoring.fatigueLevel)}`}>
                      {driver.aiMonitoring.fatigueLevel}%
                    </div>
                    <div className="text-xs text-yellow-600">Fatigue</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg text-center">
                    <div className={`text-sm font-bold ${getRiskColor(driver.aiMonitoring.riskAssessment)}`}>
                      {driver.aiMonitoring.riskAssessment}%
                    </div>
                    <div className="text-xs text-purple-600">Risk</div>
                  </div>
                </div>

                {driver.aiMonitoring.fatigueLevel > 50 && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">High fatigue detected</span>
                    </div>
                  </div>
                )}

                {driver.performance.onTimeDeliveries / driver.performance.completedDeliveries > 0.95 && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">Excellent on-time performance</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DriverManagement;