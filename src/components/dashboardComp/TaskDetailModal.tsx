// src/components/dashboardComp/TaskDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../../style/taskDetailModal.scss';
import { Task } from '../../types/types';
import { updateTaskAsync } from '../../store/modules/taskSlice';
import { AppDispatch } from '../../store/store';

interface TaskDetailModalProps {
  show: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskDetailModal({
  show,
  onClose,
  task,
}: TaskDetailModalProps) {
  const { space_id } = useParams<{ space_id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'small' | 'medium' | 'high' | 'very_high'>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 태스크 정보가 변경될 때 폼 상태 업데이트
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStartDate(task.start_date);
      setDueDate(task.due_date);
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    
    if (!startDate) {
      newErrors.startDate = '시작 날짜를 선택해주세요.';
    }
    
    if (!dueDate) {
      newErrors.dueDate = '마감 날짜를 선택해주세요.';
    } else if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      newErrors.dueDate = '마감 날짜는 시작 날짜 이후여야 합니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !space_id || !task) return;
    
    setIsSubmitting(true);
    
    try {
      await dispatch(updateTaskAsync({
        spaceId: Number(space_id),
        taskId: task.todo_id,
        updates: {
          title,
          description,
          priority,
          start_date: startDate,
          due_date: dueDate,
        }
      })).unwrap();
      
      // 성공적으로 수정되면 수정 모드 종료
      setEditMode(false);
    } catch (error) {
      console.error('업무 수정 중 오류 발생:', error);
      alert('업무 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditMode(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="task-detail-modal">
      <div className="modal-content">
        {editMode ? (
          <>
            <label className="form-label">제목 *</label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            
            <label className="form-label">우선순위</label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'small' | 'medium' | 'high' | 'very_high')}
            >
              <option value="small">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
              <option value="very_high">매우 높음</option>
            </select>
            
            <label className="form-label">시작 날짜 *</label>
            <input
              type="date"
              className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            
            <label className="form-label">마감 날짜 *</label>
            <input
              type="date"
              className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
            
            <label className="form-label">설명</label>
            <textarea
              className="form-control"
              placeholder="설명 입력"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <button className="btn btn-secondary" onClick={handleClose}>
            닫기
          </button>
          {editMode ? (
            <button 
              className="btn btn-success" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
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
