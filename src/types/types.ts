export interface Task {
  todo_id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'plan' | 'progress' | 'done';
  start_date: string;
  due_date: string;
}

export interface WorkspaceInfo {
  space_id: number;
  space_title: string;
  space_description: string;
  created_at: string;
  end_date?: string;
}

export interface Workspace {
  space_id: number;
  space_title: string;
}

export interface SpaceListProps {
  spaces: Workspace[];
}
