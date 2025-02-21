export interface Task {
  todo_id: number;
  title: string;
  description: string;
  state: 'open' | 'in_progress' | 'done';
  priority: 'small' | 'medium' | 'high' | 'very_high';
  start_date?: string;
  due_date?: string;
}
