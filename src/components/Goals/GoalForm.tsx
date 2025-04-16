
import React from 'react';
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
import { Loader2 } from 'lucide-react';

// Define schema for form
const formSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  type: z.enum(['weight', 'workout', 'distance', 'strength', 'custom']),
  target: z.number().min(1, 'Target value is required'),
  unit: z.string().min(1, 'Unit is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  progress: z.number().default(0),
});

export type GoalFormValues = z.infer<typeof formSchema>;

interface GoalFormProps {
  onSubmit: (data: GoalFormValues) => void;
  defaultValues?: GoalFormValues;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({ 
  onSubmit, 
  defaultValues,
  isEditing = false,
  isSubmitting = false
}) => {
  // Initialize form with default values
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: '',
      type: 'weight',
      target: 0,
      unit: '',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from today
      progress: 0,
    },
  });

  const goalType = form.watch('type');

  // Update unit based on type selection
  React.useEffect(() => {
    if (goalType === 'weight') {
      form.setValue('unit', 'kg');
    } else if (goalType === 'distance') {
      form.setValue('unit', 'km');
    } else if (goalType === 'workout') {
      form.setValue('unit', 'workouts');
    } else if (goalType === 'strength') {
      form.setValue('unit', 'kg');
    } else {
      form.setValue('unit', '');
    }
  }, [goalType, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Run 10km, Lose weight" {...field} />
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
              <FormLabel>Goal Type</FormLabel>
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
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="workout">Workout Frequency</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step={goalType === 'distance' ? '0.1' : '1'}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={goalType !== 'custom'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Progress</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step={goalType === 'distance' ? '0.1' : '1'}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              isEditing ? 'Update Goal' : 'Save Goal'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GoalForm;
