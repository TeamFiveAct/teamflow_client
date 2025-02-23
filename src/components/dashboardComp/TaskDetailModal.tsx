import React from 'react';
import '../../style/taskDetailModal.scss';

interface TaskDetailModalProps {
  show: boolean;
  onClose: () => void;
  task: {
    title: string;
    description: string;
    priority: 'small' | 'medium' | 'high' | 'very_high';
    start_date: string;
    due_date: string;
  } | null;
}

export default function TaskDetailModal({
  show,
  onClose,
  task,
}: TaskDetailModalProps) {
  if (!show || !task) return null;

  return (
    <div className="task-detail-modal">
      <div className="modal-content">
        <h3>{task.title}</h3>
        <p className="task-priority">우선순위: {task.priority}</p>
        <p className="task-dates">
          시작: {task.start_date} | 마감: {task.due_date}
        </p>
        <p className="task-description">{task.description}</p>

        <div className="modal-buttons">
          <button className="btn btn-secondary" onClick={onClose}>
            닫기
          </button>
          <button className="btn btn-primary">수정</button>
        </div>
      </div>
    </div>
  );
}
