export interface Task {
  todo_id: number;
  title: string;
  description: string;
  priority: 'small' | 'medium' | 'high' | 'very_high';
  state: 'open' | 'in_progress' | 'done';
  start_date: string;
  due_date: string;
}

export interface WorkspaceInfo {
  space_id: number;
  space_title: string;
  space_description: string;
  created_at: string;
  end_date: string;
}
