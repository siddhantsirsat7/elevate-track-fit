
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { workoutsAPI } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

const AddWorkoutForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    name: '',
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    caloriesBurned: 0,
    notes: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 3, reps: 10, weight: 0 }
  ]);

  const workoutMutation = useMutation({
    mutationFn: (data: any) => workoutsAPI.create(data),
    onSuccess: () => {
      toast({
        title: "Workout Added",
        description: "Your workout has been successfully logged",
      });
      navigate('/workouts');
    },
    onError: (error: any) => {
      console.error("Error adding workout:", error);
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setWorkoutData(prev => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the data for submission
      const formattedData = {
        ...workoutData,
        duration: Number(workoutData.duration),
        caloriesBurned: Number(workoutData.caloriesBurned),
        exercises: exercises.filter(ex => ex.name.trim() !== '').map(ex => ({
          ...ex,
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          weight: Number(ex.weight),
          duration: ex.duration ? Number(ex.duration) : undefined,
          distance: ex.distance ? Number(ex.distance) : undefined,
        })),
      };

      workoutMutation.mutate(formattedData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                name="name"
                value={workoutData.name}
                onChange={handleChange}
                placeholder="Morning Run, Chest Day, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Workout Type</Label>
              <Select
                value={workoutData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={workoutData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={workoutData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caloriesBurned">Calories Burned</Label>
              <Input
                id="caloriesBurned"
                name="caloriesBurned"
                type="number"
                min="0"
                value={workoutData.caloriesBurned}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Exercises</h3>
              <Button type="button" variant="outline" onClick={addExercise}>
                Add Exercise
              </Button>
            </div>

            {exercises.map((exercise, index) => (
              <div key={index} className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Exercise {index + 1}</h4>
                  {exercises.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-name-${index}`}>Name</Label>
                    <Input
                      id={`exercise-name-${index}`}
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      placeholder="Bench Press, Running, etc."
                    />
                  </div>

                  {workoutData.type === 'strength' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`sets-${index}`}>Sets</Label>
                        <Input
                          id={`sets-${index}`}
                          type="number"
                          min="0"
                          value={exercise.sets || 0}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`reps-${index}`}>Reps</Label>
                        <Input
                          id={`reps-${index}`}
                          type="number"
                          min="0"
                          value={exercise.reps || 0}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                        <Input
                          id={`weight-${index}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight || 0}
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        />
                      </div>
                    </>
                  ) : workoutData.type === 'cardio' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${index}`}>Duration (min)</Label>
                        <Input
                          id={`duration-${index}`}
                          type="number"
                          min="0"
                          value={exercise.duration || 0}
                          onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`distance-${index}`}>Distance (km)</Label>
                        <Input
                          id={`distance-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={exercise.distance || 0}
                          onChange={(e) => handleExerciseChange(index, 'distance', e.target.value)}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={workoutData.notes}
              onChange={handleChange}
              placeholder="How was your workout? Any achievements?"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/workouts')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Workout'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddWorkoutForm;
