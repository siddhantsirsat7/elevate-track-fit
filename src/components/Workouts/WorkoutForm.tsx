
import React, { useState } from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Define schema for exercise
const exerciseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sets: z.number().optional(),
  reps: z.number().optional(),
  weight: z.number().optional(),
  duration: z.number().optional(),
  distance: z.number().optional(),
});

// Define schema for form
const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['strength', 'cardio', 'flexibility', 'sports', 'other']),
  name: z.string().min(1, 'Workout name is required'),
  duration: z.number().min(1, 'Duration is required'),
  caloriesBurned: z.number().optional(),
  notes: z.string().optional(),
});

export type WorkoutFormValues = z.infer<typeof formSchema> & {
  exercises: z.infer<typeof exerciseSchema>[];
};

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormValues) => void;
  defaultValues?: WorkoutFormValues;
  isEditing?: boolean;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ 
  onSubmit, 
  defaultValues,
  isEditing = false
}) => {
  const [exercises, setExercises] = useState<z.infer<typeof exerciseSchema>[]>(
    defaultValues?.exercises || []
  );

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      date: new Date().toISOString().split('T')[0],
      type: 'strength',
      name: '',
      duration: 30,
      caloriesBurned: undefined,
      notes: '',
    },
  });

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { name: '', sets: undefined, reps: undefined, weight: undefined, duration: undefined, distance: undefined },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  const handleExerciseChange = (index: number, field: string, value: string | number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      exercises,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Morning Run, Leg Day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="caloriesBurned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories Burned (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Exercises</h3>
            <Button
              type="button"
              size="sm"
              onClick={handleAddExercise}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Exercise
            </Button>
          </div>
          
          {exercises.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-20 text-muted-foreground">
                No exercises added yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Input
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div>
                        <FormLabel className="text-xs">Sets</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Sets"
                          value={exercise.sets || ''}
                          onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs">Reps</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Reps"
                          value={exercise.reps || ''}
                          onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs">Weight (kg)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Weight"
                          value={exercise.weight || ''}
                          onChange={(e) => handleExerciseChange(index, 'weight', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs">Duration (min)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Duration"
                          value={exercise.duration || ''}
                          onChange={(e) => handleExerciseChange(index, 'duration', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs">Distance (km)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Distance"
                          value={exercise.distance || ''}
                          onChange={(e) => handleExerciseChange(index, 'distance', parseFloat(e.target.value) || undefined)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about this workout..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">{isEditing ? 'Update Workout' : 'Save Workout'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkoutForm;
