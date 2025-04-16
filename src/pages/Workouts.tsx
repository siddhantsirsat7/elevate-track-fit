
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { mockWorkouts } from '@/lib/data';
import { cn } from '@/lib/utils';

const Workouts: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');

  // Filter and sort workouts
  const filteredWorkouts = mockWorkouts
    .filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (workout.notes && workout.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || workout.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get workout type label for display
  const getWorkoutTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      strength: 'Strength',
      cardio: 'Cardio',
      flexibility: 'Flexibility',
      sports: 'Sports',
      other: 'Other'
    };
    return types[type] || type;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
        <Button asChild>
          <Link to="/workouts/add">
            <Plus className="mr-2 h-4 w-4" /> Log Workout
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search workouts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="strength">Strength</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="flexibility">Flexibility</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredWorkouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No workouts found</p>
            <Button asChild>
              <Link to="/workouts/add">
                <Plus className="mr-2 h-4 w-4" /> Log Your First Workout
              </Link>
            </Button>
          </div>
        ) : (
          filteredWorkouts.map(workout => (
            <Link
              key={workout.id}
              to={`/workouts/${workout.id}`}
              className="block"
            >
              <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "px-2 py-1 text-xs font-medium rounded-md",
                        workout.type === 'strength' && "bg-fitness-blue/10 text-fitness-blue",
                        workout.type === 'cardio' && "bg-fitness-green/10 text-fitness-green", 
                        workout.type === 'flexibility' && "bg-fitness-purple/10 text-fitness-purple",
                        workout.type === 'sports' && "bg-fitness-orange/10 text-fitness-orange",
                        workout.type === 'other' && "bg-gray-100 text-gray-500"
                      )}>
                        {getWorkoutTypeLabel(workout.type)}
                      </div>
                      <h3 className="font-medium">{workout.name}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {workout.exercises && workout.exercises.length > 0 ? (
                        <span>{workout.exercises.length} exercises</span>
                      ) : (
                        <span>No exercises recorded</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="font-medium">{formatDate(workout.date)}</div>
                      <div className="text-muted-foreground">
                        {workout.duration} min
                        {workout.caloriesBurned && ` • ${workout.caloriesBurned} cal`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Workouts;
