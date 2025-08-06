import React from 'react';
import { Truck, Package, Users, DollarSign, AlertTriangle, Fuel, Activity, Leaf } from 'lucide-react';

interface MetricsCardsProps {
  metrics: {
    totalVehicles: number;
    activeVehicles: number;
    totalDeliveries: number;
    completedDeliveries: number;
    pendingDeliveries: number;
    totalDrivers: number;
    activeDrivers: number;
    fuelConsumption: number;
    revenue: number;
    maintenanceAlerts: number;
    co2Emissions: number;
  };
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Active Vehicles',
      value: metrics.activeVehicles,
      total: metrics.totalVehicles,
      icon: Truck,
      color: 'blue',
      change: '+2.3%',
      changeType: 'positive' as const,
    },
    {
      title: 'Completed Deliveries',
      value: metrics.completedDeliveries,
      total: metrics.totalDeliveries,
      icon: Package,
      color: 'green',
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Drivers',
      value: metrics.activeDrivers,
      total: metrics.totalDrivers,
      icon: Users,
      color: 'purple',
      change: '+5.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Revenue',
      value: `$${(metrics.revenue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: 'yellow',
      change: '+8.7%',
      changeType: 'positive' as const,
    },
    {
      title: 'Maintenance Alerts',
      value: metrics.maintenanceAlerts,
      icon: AlertTriangle,
      color: 'red',
      change: '-15.3%',
      changeType: 'negative' as const,
    },
    {
      title: 'Fuel Consumption',
      value: `${(metrics.fuelConsumption / 1000).toFixed(1)}K L`,
      icon: Fuel,
      color: 'orange',
      change: '-3.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Deliveries',
      value: metrics.pendingDeliveries,
      icon: Activity,
      color: 'indigo',
      change: '+4.1%',
      changeType: 'neutral' as const,
    },
    {
      title: 'CO₂ Emissions',
      value: `${metrics.co2Emissions}t`,
      icon: Leaf,
      color: 'emerald',
      change: '-12.8%',
      changeType: 'positive' as const,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeColor = (changeType: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg border ${getColorClasses(card.color)}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <span className={`text-sm font-medium ${getChangeColor(card.changeType)}`}>
              {card.change}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{card.value}</span>
              {card.total && (
                <span className="text-sm text-gray-500">/ {card.total}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;