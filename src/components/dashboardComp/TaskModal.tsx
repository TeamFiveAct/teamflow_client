// src/components/dashboardComp/TaskModal.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/taskModal.scss';
import { createTaskAsync } from '../../store/modules/taskSlice';
import { AppDispatch } from '../../store/store';

interface TaskModalProps {
  show: boolean;
  onHide: () => void;
  taskState: 'open' | 'in_progress' | 'done' | null;
}

export default function TaskModal({ show, onHide, taskState }: TaskModalProps) {
  const { space_id } = useParams<{ space_id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  console.log('TaskModal에서 받은 taskState 값:', taskState);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'small' | 'medium' | 'high' | 'very_high'>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    if (!validateForm() || !space_id || !taskState) return;
    
    console.log('업무 생성 시 사용되는 taskState 값:', taskState);
    
    setIsSubmitting(true);
    
    try {
      const taskData = {
        title,
        description,
        priority,
        state: taskState,
        start_date: startDate,
        due_date: dueDate,
      };
      
      console.log('업무 생성 요청 데이터:', taskData);
      
      await dispatch(createTaskAsync({
        spaceId: Number(space_id),
        task: taskData
      })).unwrap();
      
      // 성공적으로 생성되면 폼 초기화 및 모달 닫기
      resetForm();
      onHide();
    } catch (error) {
      console.error('업무 생성 중 오류 발생:', error);
      alert('업무 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStartDate('');
    setDueDate('');
    setErrors({});
  };

  // 모달이 닫힐 때 폼 초기화
  const handleClose = () => {
    resetForm();
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">할 일 생성 ({taskState})</h5>
          <button type="button" className="btn-close" onClick={handleClose}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="mb-3">
              <label className="form-label">제목 *</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="제목 입력"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">설명</label>
              <textarea
                className="form-control"
                placeholder="설명 입력"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
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
            </div>
            <div className="mb-3">
              <label className="form-label">시작 날짜 *</label>
              <input 
                type="date" 
                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">마감 날짜 *</label>
              <input 
                type="date" 
                className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            닫기
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
