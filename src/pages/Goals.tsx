
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { goalsAPI } from '@/lib/api';

interface Goal {
  _id: string;
  name: string;
  type: 'weight' | 'workout' | 'distance' | 'strength' | 'custom';
  target: number;
  unit: string;
  deadline: string;
  progress: number;
  completed: boolean;
}

const Goals: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getAll,
  });

  // Filter and sort goals
  const filteredGoals = React.useMemo(() => {
    if (!goals) return [];
    
    return goals
      .filter((goal: Goal) => {
        const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || goal.type === filterType;
        const matchesStatus =
          filterStatus === 'all' ||
          (filterStatus === 'completed' && goal.completed) ||
          (filterStatus === 'in-progress' && !goal.completed);
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a: Goal, b: Goal) => {
        // Sort by completion status, then by deadline
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
  }, [goals, searchTerm, filterType, filterStatus]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load goals</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
        <Button asChild>
          <Link to="/goals/add">
            <Plus className="mr-2 h-4 w-4" /> Set New Goal
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search goals..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="workout">Workout</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="strength">Strength</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No goals found</p>
            <Button asChild>
              <Link to="/goals/add">
                <Plus className="mr-2 h-4 w-4" /> Set Your First Goal
              </Link>
            </Button>
          </div>
        ) : (
          filteredGoals.map((goal: Goal) => {
            const progressPercent = Math.round((goal.progress / goal.target) * 100);
            const daysLeft = getDaysRemaining(goal.deadline);
            
            return (
              <Link
                key={goal._id}
                to={`/goals/${goal._id}`}
                className="block"
              >
                <div className={cn(
                  "border rounded-lg p-4 hover:bg-muted/50 transition-colors", 
                  goal.completed && "bg-muted/30"
                )}>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          goal.completed ? "bg-fitness-green" : (
                            daysLeft < 7 ? "bg-fitness-orange" : "bg-fitness-blue"
                          )
                        )} />
                        <h3 className="font-medium">{goal.name}</h3>
                      </div>
                      {goal.completed && (
                        <div className="flex items-center text-fitness-green text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" /> Completed
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress: {progressPercent}%</span>
                        <span>{goal.progress} / {goal.target} {goal.unit}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                      <div>Deadline: {formatDate(goal.deadline)}</div>
                      {!goal.completed && (
                        <div className={cn(
                          daysLeft < 0 ? "text-destructive" : 
                          daysLeft < 7 ? "text-fitness-orange" : ""
                        )}>
                          {daysLeft < 0 
                            ? `Overdue by ${Math.abs(daysLeft)} days` 
                            : daysLeft === 0 
                              ? "Due today"
                              : `${daysLeft} days left`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Goals;
