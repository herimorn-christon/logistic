import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setRecords, setAlerts } from '../../store/slices/maintenanceSlice';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { 
  Wrench, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

const MaintenanceManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { records, alerts } = useSelector((state: RootState) => state.maintenance);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    // Mock maintenance data
    const mockRecords = [
      {
        id: '1',
        vehicleId: 'v1',
        vehicleNumber: 'TR-001',
        type: 'scheduled' as const,
        status: 'pending' as const,
        priority: 'high' as const,
        scheduledDate: '2024-01-20',
        description: 'Engine oil change and filter replacement',
        cost: 450.00,
        parts: ['Engine Oil', 'Oil Filter', 'Air Filter'],
        aiPredictions: {
          failureRisk: 25,
          nextMaintenanceDate: '2024-04-20',
          costEstimate: 500.00
        }
      },
      {
        id: '2',
        vehicleId: 'v2',
        vehicleNumber: 'TR-002',
        type: 'emergency' as const,
        status: 'in_progress' as const,
        priority: 'critical' as const,
        scheduledDate: '2024-01-15',
        description: 'Brake system repair - urgent safety issue',
        cost: 1200.00,
        parts: ['Brake Pads', 'Brake Discs', 'Brake Fluid'],
        aiPredictions: {
          failureRisk: 85,
          nextMaintenanceDate: '2024-03-15',
          costEstimate: 1300.00
        }
      },
      {
        id: '3',
        vehicleId: 'v3',
        vehicleNumber: 'TR-003',
        type: 'preventive' as const,
        status: 'completed' as const,
        priority: 'medium' as const,
        scheduledDate: '2024-01-10',
        completedDate: '2024-01-12',
        description: 'Tire rotation and alignment check',
        cost: 280.00,
        parts: ['Wheel Alignment', 'Tire Rotation'],
        aiPredictions: {
          failureRisk: 10,
          nextMaintenanceDate: '2024-07-10',
          costEstimate: 300.00
        }
      }
    ];

    const mockAlerts = [
      {
        id: '1',
        vehicleId: 'v1',
        vehicleNumber: 'TR-001',
        type: 'emergency' as const,
        status: 'pending' as const,
        priority: 'critical' as const,
        scheduledDate: '2024-01-18',
        description: 'Engine temperature warning - immediate attention required',
        cost: 0,
        parts: [],
        aiPredictions: {
          failureRisk: 95,
          nextMaintenanceDate: '2024-01-18',
          costEstimate: 2500.00
        }
      }
    ];

    dispatch(setRecords(mockRecords));
    dispatch(setAlerts(mockAlerts));
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Wrench className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
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
    if (risk <= 30) return 'text-green-600';
    if (risk <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || record.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Predictive Maintenance</h1>
            <p className="text-gray-600">AI-powered vehicle health monitoring and maintenance scheduling</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Schedule Maintenance</span>
          </button>
        </div>

        {/* Critical Alerts */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-900">Critical Maintenance Alerts</h3>
            </div>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white p-3 rounded border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-red-900">{alert.vehicleNumber}</span>
                      <p className="text-sm text-red-700">{alert.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-red-600">
                        Risk: {alert.aiPredictions.failureRisk}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {records.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${records.reduce((sum, r) => sum + r.cost, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(records.reduce((sum, r) => sum + r.aiPredictions.failureRisk, 0) / records.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
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
                placeholder="Search maintenance records..."
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
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Records</h3>
            <p className="text-sm text-gray-600">Track and manage vehicle maintenance with AI predictions</p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{record.vehicleNumber}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(record.priority)}`}>
                          {record.priority}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {record.type}
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

                <div className="mb-4">
                  <p className="text-gray-700 mb-2">{record.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Scheduled Date</span>
                      <p className="font-medium">{new Date(record.scheduledDate).toLocaleDateString()}</p>
                    </div>
                    {record.completedDate && (
                      <div>
                        <span className="text-gray-600">Completed Date</span>
                        <p className="font-medium">{new Date(record.completedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Cost</span>
                      <p className="font-medium">${record.cost.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-600">Failure Risk</span>
                      <span className={`text-lg font-bold ${getRiskColor(record.aiPredictions.failureRisk)}`}>
                        {record.aiPredictions.failureRisk}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600">Next Maintenance</span>
                      <span className="text-sm font-bold text-blue-700">
                        {new Date(record.aiPredictions.nextMaintenanceDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">Est. Cost</span>
                      <span className="text-sm font-bold text-green-700">
                        ${record.aiPredictions.costEstimate.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                {record.parts.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-900">Parts Required:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {record.parts.map((part, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Truck Image for Maintenance */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img 
                      src="https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" 
                      alt="Truck Maintenance"
                      className="w-20 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Vehicle maintenance status and AI predictions help prevent costly breakdowns</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance records found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceManagement;