// src/components/TaskDetailModal.tsx
import React, { useState } from 'react';
import '../../style/dashboard/taskDetailModal.scss';

interface TaskDetailModalProps {
  show: boolean;
  onClose: () => void;
  task?: {
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
  const [editMode, setEditMode] = useState(false);

  if (!show) return null;

  return (
    <div className="task-detail-modal">
      <div className="modal-content">
        {editMode ? (
          <>
            <label className="form-label">제목</label>
            <input
              type="text"
              className="form-control"
              placeholder="제목 입력"
              defaultValue={task?.title || ''}
            />
            <label className="form-label">우선순위</label>
            <select
              className="form-control"
              defaultValue={task?.priority || 'medium'}
            >
              <option value="small">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
              <option value="very_high">매우 높음</option>
            </select>
            <label className="form-label">시작 날짜</label>
            <input
              type="date"
              className="form-control"
              defaultValue={task?.start_date || ''}
            />
            <label className="form-label">마감 날짜</label>
            <input
              type="date"
              className="form-control"
              defaultValue={task?.due_date || ''}
            />
            <label className="form-label">설명</label>
            <textarea
              className="form-control"
              placeholder="설명 입력"
              defaultValue={task?.description || ''}
            ></textarea>
          </>
        ) : (
          <>
            <h3>{task?.title || '할 일 제목'}</h3>
            <p className="task-priority">
              우선순위: {task?.priority || '보통'}
            </p>
            <p className="task-dates">
              시작: {task?.start_date || 'YYYY-MM-DD'} | 마감:{' '}
              {task?.due_date || 'YYYY-MM-DD'}
            </p>
            <p className="task-description">
              {task?.description || '여기에 할 일 설명이 들어갑니다.'}
            </p>
          </>
        )}
        <div className="modal-buttons">
          <button className="btn btn-secondary" onClick={onClose}>
            닫기
          </button>
          {editMode ? (
            <button className="btn btn-success">저장</button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
