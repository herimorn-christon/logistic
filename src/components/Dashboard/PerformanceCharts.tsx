import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const PerformanceCharts: React.FC = () => {
  const deliveryData = [
    { name: 'Mon', completed: 45, pending: 12 },
    { name: 'Tue', completed: 52, pending: 8 },
    { name: 'Wed', completed: 38, pending: 15 },
    { name: 'Thu', completed: 61, pending: 7 },
    { name: 'Fri', completed: 48, pending: 11 },
    { name: 'Sat', completed: 29, pending: 5 },
    { name: 'Sun', completed: 34, pending: 9 },
  ];

  const fuelData = [
    { name: 'Jan', consumption: 4200, efficiency: 85 },
    { name: 'Feb', consumption: 3800, efficiency: 88 },
    { name: 'Mar', consumption: 4100, efficiency: 86 },
    { name: 'Apr', consumption: 3900, efficiency: 89 },
    { name: 'May', consumption: 4300, efficiency: 84 },
    { name: 'Jun', consumption: 4000, efficiency: 87 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
        <p className="text-sm text-gray-600">Delivery and fuel efficiency trends</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Weekly Delivery Performance</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Fuel Efficiency Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" name="Efficiency %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;