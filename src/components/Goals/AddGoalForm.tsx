
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import GoalForm, { GoalFormValues } from '@/components/Goals/GoalForm';
import { goalsAPI } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddGoalForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { mutate: createGoal, isPending } = useMutation({
    mutationFn: (goalData: GoalFormValues) => goalsAPI.create(goalData),
    onSuccess: () => {
      toast({
        title: "Goal created",
        description: "Your goal has been created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      navigate('/goals');
    },
    onError: (error: any) => {
      console.error("Error creating goal:", error);
      toast({
        variant: "destructive",
        title: "Failed to create goal",
        description: error.response?.data?.message || "Something went wrong."
      });
    }
  });

  const handleSubmit = (data: GoalFormValues) => {
    createGoal(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Set New Goal</h1>
      </div>
      
      <GoalForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
};

export default AddGoalForm;
