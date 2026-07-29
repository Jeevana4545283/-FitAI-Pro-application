import api from './api';

export interface WorkoutGeneratePayload {
  goal?: string;
  timeAvailable?: number;
  equipment?: string[];
  experienceLevel?: string;
  difficulty?: string;
  targetMuscle?: string;
}

export const fetchWorkouts = async (category?: string, query?: string) => {
  const params: any = {};
  if (category) params.category = category;
  if (query) params.query = query;
  
  const response = await api.get('/workouts', { params });
  return response.data;
};

export const fetchWorkoutById = async (id: string) => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

export const generateAIWorkoutApi = async (payload: WorkoutGeneratePayload) => {
  const response = await api.post('/workouts/generate', payload);
  return response.data;
};

export const finishWorkoutSessionApi = async (
  workoutId: string = 'wkt-1',
  duration: number = 2700,
  calories: number = 420,
  completedPct: number = 100.0
) => {
  const params = { workout_id: workoutId, duration, calories, completed_pct: completedPct };
  const response = await api.post('/workout-session/finish', null, { params });
  return response.data;
};

export const sendCoachMessageApi = async (message: string, contextCategory: string = 'workout') => {
  const response = await api.post('/coach/chat', { message, contextCategory });
  return response.data;
};
