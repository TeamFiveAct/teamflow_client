import React from 'react';
import TaskColumn from './TaskColumn';
import '../../style/todoBoard.scss';
import { Task } from '../../types/types';

interface ToDoBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreate: (state: 'open' | 'in_progress' | 'done') => void;
  onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
}

export default function ToDoBoard({
  tasks,
  onEdit,
  onDelete,
  onCreate,
  onFilter,
}: ToDoBoardProps) {
  return (
    <div className="todo-board container py-4">
      <div className="row g-3">
        <div className="col-md-4">
          <TaskColumn
            title="계획 중"
            state="open"
            tasks={tasks.filter(task => task.state === 'open')}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onCreate}
            onFilter={onFilter}
          />
        </div>

        <div className="col-md-4">
          <TaskColumn
            title="진행 중"
            state="in_progress"
            tasks={tasks.filter(task => task.state === 'in_progress')}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onCreate}
            onFilter={onFilter}
          />
        </div>

        <div className="col-md-4">
          <TaskColumn
            title="완료"
            state="done"
            tasks={tasks.filter(task => task.state === 'done')}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onCreate}
            onFilter={onFilter}
          />
        </div>
      </div>
    </div>
  );
}
