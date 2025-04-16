
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Dumbbell, Activity, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockWorkouts } from '@/lib/data';
import { cn } from '@/lib/utils';

// Workout type icons
const workoutIcons = {
  strength: Dumbbell,
  cardio: Activity,  // Using Activity instead of Running
  flexibility: Sun,  // Using Sun instead of Yoga
  sports: Dumbbell,
  other: Dumbbell,
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const RecentWorkouts: React.FC = () => {
  // Get latest 3 workouts
  const recentWorkouts = [...mockWorkouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Recent Workouts</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/workouts/add" className="flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            Add Workout
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentWorkouts.map((workout) => {
            const WorkoutIcon = workoutIcons[workout.type];
            return (
              <div
                key={workout.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                    workout.type === 'strength' && "bg-fitness-blue/10 text-fitness-blue",
                    workout.type === 'cardio' && "bg-fitness-green/10 text-fitness-green", 
                    workout.type === 'flexibility' && "bg-fitness-purple/10 text-fitness-purple",
                    workout.type === 'sports' && "bg-fitness-orange/10 text-fitness-orange",
                    workout.type === 'other' && "bg-gray-100 text-gray-500"
                  )}>
                    <WorkoutIcon size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(workout.date)} • {workout.duration} min
                      {workout.caloriesBurned && ` • ${workout.caloriesBurned} cal`}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/workouts/${workout.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="link" asChild className="text-sm p-0">
            <Link to="/workouts" className="flex items-center justify-center">
              View All Workouts <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentWorkouts;
