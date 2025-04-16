
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { weeklyActivityData, workoutTypeData } from '@/lib/data';
import { PieChart, Pie, Cell } from 'recharts';

// Colors for the pie chart
const COLORS = ['#1EAEDB', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'];

const WorkoutChart: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyActivityData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#1EAEDB" />
                <YAxis yAxisId="right" orientation="right" stroke="#4CAF50" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    borderColor: '#ddd'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="minutes" name="Minutes" fill="#1EAEDB" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="calories" name="Calories" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Workout Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col md:flex-row items-center justify-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={workoutTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {workoutTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col space-y-2 mt-4 md:mt-0">
              {workoutTypeData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 mr-2 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutChart;
