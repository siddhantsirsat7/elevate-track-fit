
// Mock data for initial development
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';
  name: string;
  duration: number; // minutes
  caloriesBurned?: number;
  exercises?: Exercise[];
  notes?: string;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // minutes
  distance?: number; // km
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  type: 'weight' | 'workout' | 'distance' | 'strength' | 'custom';
  target: number;
  unit: string;
  deadline: string;
  progress: number;
  completed: boolean;
}

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=1EAEDB&color=fff',
};

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    userId: '1',
    date: '2023-04-15',
    type: 'strength',
    name: 'Morning Strength Training',
    duration: 45,
    caloriesBurned: 320,
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 70 },
      { name: 'Squats', sets: 3, reps: 12, weight: 100 },
      { name: 'Pull-Ups', sets: 3, reps: 8 },
    ],
    notes: 'Felt strong today, increased weights on all exercises.',
  },
  {
    id: '2',
    userId: '1',
    date: '2023-04-14',
    type: 'cardio',
    name: 'Evening Run',
    duration: 30,
    caloriesBurned: 280,
    exercises: [
      { name: 'Running', duration: 30, distance: 5 },
    ],
    notes: 'Easy pace, recovery run.',
  },
  {
    id: '3',
    userId: '1',
    date: '2023-04-13',
    type: 'flexibility',
    name: 'Yoga Session',
    duration: 60,
    caloriesBurned: 180,
    notes: 'Focused on hip mobility.',
  },
  {
    id: '4',
    userId: '1',
    date: '2023-04-12',
    type: 'strength',
    name: 'Upper Body Focus',
    duration: 50,
    caloriesBurned: 350,
    exercises: [
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: 20 },
      { name: 'Bicep Curls', sets: 3, reps: 15, weight: 15 },
      { name: 'Tricep Extension', sets: 3, reps: 15, weight: 15 },
      { name: 'Push-Ups', sets: 3, reps: 20 },
    ],
  },
  {
    id: '5',
    userId: '1',
    date: '2023-04-11',
    type: 'cardio',
    name: 'Interval Training',
    duration: 25,
    caloriesBurned: 300,
    notes: 'HIIT session, 30sec on, 15sec off',
  },
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    name: 'Run 100km this month',
    type: 'distance',
    target: 100,
    unit: 'km',
    deadline: '2023-04-30',
    progress: 65,
    completed: false,
  },
  {
    id: '2',
    userId: '1',
    name: 'Bench press 100kg',
    type: 'strength',
    target: 100,
    unit: 'kg',
    deadline: '2023-06-30',
    progress: 85,
    completed: false,
  },
  {
    id: '3',
    userId: '1',
    name: 'Lose 5kg',
    type: 'weight',
    target: 5,
    unit: 'kg',
    deadline: '2023-05-15',
    progress: 3,
    completed: false,
  },
  {
    id: '4',
    userId: '1',
    name: 'Complete 20 workouts',
    type: 'workout',
    target: 20,
    unit: 'workouts',
    deadline: '2023-04-30',
    progress: 12,
    completed: false,
  },
];

// Weekly activity data for charts
export const weeklyActivityData = [
  { day: 'Mon', minutes: 45, calories: 320 },
  { day: 'Tue', minutes: 30, calories: 280 },
  { day: 'Wed', minutes: 60, calories: 450 },
  { day: 'Thu', minutes: 0, calories: 0 },
  { day: 'Fri', minutes: 50, calories: 350 },
  { day: 'Sat', minutes: 75, calories: 520 },
  { day: 'Sun', minutes: 20, calories: 180 },
];

// Monthly workout types for charts
export const workoutTypeData = [
  { name: 'Strength', value: 12 },
  { name: 'Cardio', value: 8 },
  { name: 'Flexibility', value: 5 },
  { name: 'Sports', value: 3 },
  { name: 'Other', value: 1 },
];
