import React from 'react';
import { Package, Truck, Route, User, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'delivery' | 'maintenance' | 'route' | 'driver';
  message: string;
  timestamp: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'delivery':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <Truck className="h-5 w-5 text-red-500" />;
      case 'route':
        return <Route className="h-5 w-5 text-green-500" />;
      case 'driver':
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'delivery':
        return 'bg-blue-50 border-blue-200';
      case 'maintenance':
        return 'bg-red-50 border-red-200';
      case 'route':
        return 'bg-green-50 border-green-200';
      case 'driver':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <p className="text-sm text-gray-600">Latest system events and updates</p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;