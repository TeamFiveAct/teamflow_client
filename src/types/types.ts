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
  user_id: number;
}

export interface Workspace {
  space_id: number;
  space_title: string;
}

export interface SpaceListProps {
  spaces: Workspace[];
}

export interface ProjectInfoProps {
  workspace: WorkspaceInfo;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isOwner: boolean; // ✅ isOwner 추가
  onLeaveWorkspace: () => void;
  onDeleteWorkspace: () => void;
}
