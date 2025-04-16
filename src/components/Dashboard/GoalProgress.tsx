
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { goalsAPI } from '@/lib/api';

interface Goal {
  _id: string;
  name: string;
  target: number;
  unit: string;
  deadline: string;
  progress: number;
  completed: boolean;
}

const GoalProgress: React.FC = () => {
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getAll,
  });
  
  // Sort goals by deadline and filter incomplete ones
  const displayGoals = React.useMemo(() => {
    if (!goals) return [];
    
    return [...goals]
      .filter((goal: Goal) => !goal.completed)
      .sort((a: Goal, b: Goal) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  }, [goals]);

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Goal Progress</CardTitle>
          <Target className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load goals</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Goal Progress</CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : displayGoals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-2">No active goals</p>
            <Button variant="link" asChild className="text-sm p-0">
              <Link to="/goals/add">
                Set a new goal
              </Link>
            </Button>
          </div>
        ) : (
          displayGoals.map((goal: Goal) => (
            <div key={goal._id} className="mb-4 last:mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{goal.name}</span>
                <span className="text-sm font-medium">
                  {Math.round((goal.progress / goal.target) * 100)}%
                </span>
              </div>
              <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {goal.progress} / {goal.target} {goal.unit}
                </span>
                <span className="text-xs text-muted-foreground">
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}

        <div className="mt-4 text-center">
          <Button variant="link" asChild className="text-sm p-0">
            <Link to="/goals" className="flex items-center">
              View All Goals <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
