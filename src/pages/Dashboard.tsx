
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ActivitySummary from '@/components/Dashboard/ActivitySummary';
import WorkoutChart from '@/components/Dashboard/WorkoutChart';
import GoalProgress from '@/components/Dashboard/GoalProgress';
import RecentWorkouts from '@/components/Dashboard/RecentWorkouts';
import { mockUser } from '@/lib/data';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {mockUser.name.split(' ')[0]}
        </h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/workouts/add" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Log Workout
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/goals/add">
              <Plus className="mr-2 h-4 w-4" /> Set Goal
            </Link>
          </Button>
        </div>
      </div>

      <ActivitySummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkoutChart />
        </div>
        <div>
          <GoalProgress />
        </div>
      </div>
      
      <RecentWorkouts />
    </div>
  );
};

export default Dashboard;
