
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { mockGoals } from '@/lib/data';

const GoalProgress: React.FC = () => {
  // Sort goals by deadline
  const sortedGoals = [...mockGoals].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // Get up to 3 goals to display
  const displayGoals = sortedGoals.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Goal Progress</CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-2">
        {displayGoals.map((goal) => (
          <div key={goal.id} className="mb-4 last:mb-2">
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
        ))}

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
