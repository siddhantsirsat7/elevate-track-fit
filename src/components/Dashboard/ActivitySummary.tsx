
import React from 'react';
import StatCard from '../ui/StatCard';
import { Activity, Dumbbell, Flame, Clock } from 'lucide-react';
import { weeklyActivityData } from '@/lib/data';

const ActivitySummary: React.FC = () => {
  // Calculate total activity stats from the data
  const totalMinutes = weeklyActivityData.reduce((sum, day) => sum + day.minutes, 0);
  const totalCalories = weeklyActivityData.reduce((sum, day) => sum + day.calories, 0);
  const workoutDays = weeklyActivityData.filter(day => day.minutes > 0).length;
  const averageMinutes = Math.round(totalMinutes / workoutDays);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Workouts"
        value={workoutDays}
        icon={<Activity className="h-4 w-4" />}
        description="This week"
        trend={{ value: 10, positive: true }}
      />
      <StatCard
        title="Active Minutes"
        value={totalMinutes}
        icon={<Clock className="h-4 w-4" />}
        description={`${averageMinutes} mins avg/day`}
      />
      <StatCard
        title="Calories Burned"
        value={totalCalories}
        icon={<Flame className="h-4 w-4" />}
        description="This week"
      />
      <StatCard
        title="Strength Level"
        value="Intermediate"
        icon={<Dumbbell className="h-4 w-4" />}
        description="Based on your logs"
      />
    </div>
  );
};

export default ActivitySummary;
