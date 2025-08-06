import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCargos } from '../../store/slices/cargoSlice';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { 
  Package, 
  Thermometer, 
  Droplets, 
  Camera, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Upload,
  TrendingUp,
  Shield
} from 'lucide-react';

const CargoMonitoring: React.FC = () => {
  const dispatch = useDispatch();
  const { cargos } = useSelector((state: RootState) => state.cargo);
  const [selectedCargo, setSelectedCargo] = useState<string | null>(null);

  useEffect(() => {
    // Mock cargo data
    const mockCargos = [
      {
        id: '1',
        deliveryId: 'del1',
        trackingNumber: 'FF-2024-001',
        type: 'refrigerated' as const,
        weight: 2500,
        dimensions: { length: 300, width: 200, height: 180 },
        value: 15000,
        temperature: { current: 2.5, min: 0, max: 4 },
        humidity: 85,
        status: 'in_transit' as const,
        aiMonitoring: {
          conditionScore: 95,
          riskAssessment: 8,
          temperatureAlerts: false
        }
      },
      {
        id: '2',
        deliveryId: 'del2',
        trackingNumber: 'FF-2024-002',
        type: 'fragile' as const,
        weight: 150,
        dimensions: { length: 80, width: 60, height: 40 },
        value: 8000,
        status: 'loaded' as const,
        aiMonitoring: {
          conditionScore: 88,
          riskAssessment: 15,
          temperatureAlerts: false
        }
      },
      {
        id: '3',
        deliveryId: 'del3',
        trackingNumber: 'FF-2024-003',
        type: 'hazardous' as const,
        weight: 500,
        dimensions: { length: 120, width: 80, height: 100 },
        value: 12000,
        status: 'delivered' as const,
        aiMonitoring: {
          conditionScore: 92,
          riskAssessment: 25,
          temperatureAlerts: false
        }
      }
    ];

    dispatch(setCargos(mockCargos));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loaded': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'refrigerated': return 'bg-blue-100 text-blue-800';
      case 'fragile': return 'bg-orange-100 text-orange-800';
      case 'hazardous': return 'bg-red-100 text-red-800';
      case 'oversized': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 10) return 'text-green-600';
    if (risk <= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConditionColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cargo Monitoring</h1>
            <p className="text-gray-600">Real-time cargo tracking with IoT sensors and AI vision</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Verify Cargo</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cargo</p>
                <p className="text-2xl font-bold text-gray-900">{cargos.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cargos.filter(c => c.status === 'in_transit').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${cargos.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Condition</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(cargos.reduce((sum, c) => sum + c.aiMonitoring.conditionScore, 0) / cargos.length)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Cargo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cargos.map((cargo) => (
            <div key={cargo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Cargo Image */}
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={cargo.type === 'refrigerated' 
                    ? "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                    : cargo.type === 'fragile'
                    ? "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                    : "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  }
                  alt="Cargo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cargo.status)}`}>
                    {cargo.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(cargo.type)}`}>
                    {cargo.type}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{cargo.trackingNumber}</h3>
                  <button 
                    onClick={() => setSelectedCargo(cargo.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{cargo.weight} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Value</span>
                    <span className="font-medium">${cargo.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-medium">
                      {cargo.dimensions.length}×{cargo.dimensions.width}×{cargo.dimensions.height} cm
                    </span>
                  </div>
                </div>

                {/* Temperature & Humidity for Refrigerated */}
                {cargo.temperature && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Temperature</span>
                      </div>
                      <p className="text-lg font-bold text-blue-700">{cargo.temperature.current}°C</p>
                      <p className="text-xs text-blue-600">
                        Range: {cargo.temperature.min}°C - {cargo.temperature.max}°C
                      </p>
                    </div>
                    {cargo.humidity && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Droplets className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Humidity</span>
                        </div>
                        <p className="text-lg font-bold text-green-700">{cargo.humidity}%</p>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Monitoring */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600">Condition</span>
                      <span className={`text-lg font-bold ${getConditionColor(cargo.aiMonitoring.conditionScore)}`}>
                        {cargo.aiMonitoring.conditionScore}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-600">Risk</span>
                      <span className={`text-lg font-bold ${getRiskColor(cargo.aiMonitoring.riskAssessment)}`}>
                        {cargo.aiMonitoring.riskAssessment}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {cargo.aiMonitoring.temperatureAlerts && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">Temperature alert detected</span>
                    </div>
                  </div>
                )}

                {cargo.aiMonitoring.conditionScore < 80 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">Condition monitoring required</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cargo Verification Modal */}
        {selectedCargo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargo Verification</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload cargo photo for AI verification</p>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Choose File
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">AI Vision Analysis</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cargo type detection</li>
                    <li>• Damage assessment</li>
                    <li>• Load/unload validation</li>
                    <li>• Condition scoring</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setSelectedCargo(null)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Verify Cargo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Truck Loading Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargo Loading Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img 
              src="https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
              alt="Truck Loading"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">AI-Powered Monitoring</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Real-time cargo condition tracking</li>
                  <li>• Temperature and humidity monitoring</li>
                  <li>• Computer vision for damage detection</li>
                  <li>• Predictive analytics for cargo safety</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Benefits</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Reduced cargo damage by 40%</li>
                  <li>• Improved customer satisfaction</li>
                  <li>• Lower insurance claims</li>
                  <li>• Enhanced supply chain visibility</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CargoMonitoring;