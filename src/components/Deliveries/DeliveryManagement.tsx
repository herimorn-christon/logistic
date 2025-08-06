import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setDeliveries } from '../../store/slices/deliverySlice';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Clock, 
  User,
  Truck,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react';

const DeliveryManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { deliveries } = useSelector((state: RootState) => state.delivery);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    // Mock delivery data
    const mockDeliveries = [
      {
        id: '1',
        trackingNumber: 'FF-2024-001',
        customerId: 'c1',
        routeId: 'r1',
        status: 'in_transit' as const,
        priority: 'high' as const,
        pickupLocation: 'Warehouse A - 123 Main St',
        deliveryLocation: '456 Customer Ave, Downtown',
        scheduledPickup: '2024-01-15T09:00:00Z',
        scheduledDelivery: '2024-01-15T14:00:00Z',
        actualPickup: '2024-01-15T09:15:00Z',
        cargo: {
          weight: 150.5,
          dimensions: { length: 120, width: 80, height: 60 },
          type: 'Electronics',
          value: 5000,
          specialRequirements: ['Fragile', 'Keep Upright']
        },
        aiPredictions: {
          estimatedDeliveryTime: '2024-01-15T13:45:00Z',
          delayRisk: 15,
          trafficImpact: 25
        }
      },
      {
        id: '2',
        trackingNumber: 'FF-2024-002',
        customerId: 'c2',
        routeId: 'r2',
        status: 'pending' as const,
        priority: 'medium' as const,
        pickupLocation: 'Warehouse B - 789 Industrial Blvd',
        deliveryLocation: '321 Business Park, Suburb',
        scheduledPickup: '2024-01-16T08:00:00Z',
        scheduledDelivery: '2024-01-16T12:00:00Z',
        cargo: {
          weight: 75.2,
          dimensions: { length: 100, width: 60, height: 40 },
          type: 'Documents',
          value: 500,
          specialRequirements: ['Confidential']
        },
        aiPredictions: {
          estimatedDeliveryTime: '2024-01-16T11:30:00Z',
          delayRisk: 5,
          trafficImpact: 10
        }
      },
      {
        id: '3',
        trackingNumber: 'FF-2024-003',
        customerId: 'c3',
        routeId: 'r1',
        status: 'delivered' as const,
        priority: 'urgent' as const,
        pickupLocation: 'Warehouse A - 123 Main St',
        deliveryLocation: '987 Emergency Center',
        scheduledPickup: '2024-01-14T10:00:00Z',
        scheduledDelivery: '2024-01-14T11:00:00Z',
        actualPickup: '2024-01-14T10:05:00Z',
        actualDelivery: '2024-01-14T10:55:00Z',
        cargo: {
          weight: 25.0,
          dimensions: { length: 50, width: 30, height: 20 },
          type: 'Medical Supplies',
          value: 2000,
          specialRequirements: ['Temperature Controlled', 'Urgent']
        },
        aiPredictions: {
          estimatedDeliveryTime: '2024-01-14T11:00:00Z',
          delayRisk: 2,
          trafficImpact: 5
        }
      }
    ];

    dispatch(setDeliveries(mockDeliveries));
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_transit':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 10) return 'text-green-600';
    if (risk <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || delivery.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
            <p className="text-gray-600">Track and manage all deliveries with AI-powered insights</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>New Delivery</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deliveries.filter(d => d.status === 'in_transit').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deliveries.filter(d => d.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deliveries.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
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
                placeholder="Search deliveries..."
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
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Deliveries</h3>
            <p className="text-sm text-gray-600">Manage and track all delivery operations</p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(delivery.status)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{delivery.trackingNumber}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(delivery.priority)}`}>
                          {delivery.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1 text-green-500" />
                      <span className="font-medium">Pickup:</span>
                      <span className="ml-1">{delivery.pickupLocation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-red-500" />
                      <span className="font-medium">Delivery:</span>
                      <span className="ml-1">{delivery.deliveryLocation}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Weight</span>
                      <p className="font-medium">{delivery.cargo.weight} kg</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Value</span>
                      <p className="font-medium">${delivery.cargo.value.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Scheduled Pickup</span>
                    <p className="font-medium">{new Date(delivery.scheduledPickup).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Scheduled Delivery</span>
                    <p className="font-medium">{new Date(delivery.scheduledDelivery).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">AI Estimated Delivery</span>
                    <p className="font-medium">{new Date(delivery.aiPredictions.estimatedDeliveryTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600">Cargo Type</span>
                      <span className="text-sm font-bold text-blue-700">{delivery.cargo.type}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-600">Delay Risk</span>
                      <span className={`text-sm font-bold ${getRiskColor(delivery.aiPredictions.delayRisk)}`}>
                        {delivery.aiPredictions.delayRisk}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600">Traffic Impact</span>
                      <span className={`text-sm font-bold ${getRiskColor(delivery.aiPredictions.trafficImpact)}`}>
                        {delivery.aiPredictions.trafficImpact}%
                      </span>
                    </div>
                  </div>
                </div>

                {delivery.cargo.specialRequirements.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-900">Special Requirements:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {delivery.cargo.specialRequirements.map((req, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredDeliveries.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryManagement;