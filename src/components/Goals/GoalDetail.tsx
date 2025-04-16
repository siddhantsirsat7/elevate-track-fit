
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GoalForm, { GoalFormValues } from '@/components/Goals/GoalForm';
import { goalsAPI } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Loader2, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const GoalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: goal, isLoading } = useQuery({
    queryKey: ['goal', id],
    queryFn: () => goalsAPI.getOne(id!),
    enabled: !!id,
  });

  const { mutate: updateGoal, isPending: isUpdating } = useMutation({
    mutationFn: (data: GoalFormValues) => goalsAPI.update(id!, data),
    onSuccess: () => {
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', id] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update goal",
        description: error.response?.data?.message || "Something went wrong."
      });
    }
  });

  const { mutate: deleteGoal, isPending: isDeleting } = useMutation({
    mutationFn: () => goalsAPI.delete(id!),
    onSuccess: () => {
      toast({
        title: "Goal deleted",
        description: "Your goal has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      navigate('/goals');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to delete goal",
        description: error.response?.data?.message || "Something went wrong."
      });
    }
  });

  const handleSubmit = (data: GoalFormValues) => {
    updateGoal(data);
  };

  // Calculate progress percentage
  const progressPercent = goal ? Math.round((goal.progress / goal.target) * 100) : 0;

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Goal not found</p>
        <Button asChild>
          <Link to="/goals">Back to Goals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/goals">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{goal.name}</h1>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your goal and
                remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteGoal()} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <h3 className="font-medium mb-2">Current Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {progressPercent}%</span>
            <span>{goal.progress} / {goal.target} {goal.unit}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Deadline: {formatDate(goal.deadline)}
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Update Goal</h2>
        <GoalForm 
          onSubmit={handleSubmit} 
          defaultValues={{
            name: goal.name,
            type: goal.type,
            target: goal.target,
            unit: goal.unit,
            deadline: new Date(goal.deadline).toISOString().split('T')[0],
            progress: goal.progress,
          }}
          isEditing={true}
          isSubmitting={isUpdating}
        />
      </div>
    </div>
  );
};

export default GoalDetail;
