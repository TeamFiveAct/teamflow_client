import React, { useEffect, useState } from 'react';
import '../../style/dashboard/taskDetailModal.scss';
import axios from 'axios'; // Axios 임포트
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateTask } from '../../store/modules/taskSlice';

interface TaskDetailModalProps {
  show: boolean;
  onClose: () => void;
  task: {
    todo_id: number; // todo_id 추가
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'plan' | 'progress' | 'done';
    start_date: string;
    due_date: string;
  } | null;
  onSave: (task: any) => void; // onSave 함수 추가
}

export default function TaskDetailModal({
  show,
  onClose,
  task,
  onSave,
}: TaskDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<typeof task | null>(null); // 타입 수정
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { space_id } = useParams<{ space_id: string }>();

  useEffect(() => {
    setUpdatedTask(task); // task가 변경되면 updatedTask도 업데이트
  }, [task]);

  if (!show || !task) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setUpdatedTask(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!updatedTask) return;
    try {
      setIsLoading(true);
      // 서버에 PATCH 요청 보내기
      const response = await axios.patch(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/${task?.todo_id}`,
        updatedTask,
        { withCredentials: true },
      );
      console.log('업무수정의 콘솔확인::', response.data);
      if (response.data.status === 'SUCCESS') {
        dispatch(updateTask(response.data.data));
        setIsLoading(false);
        onSave(updatedTask); // 부모 컴포넌트에게 수정된 task 전달
        onClose();
      } else {
        setIsLoading(false);
        alert('업무 수정에 실패했습니다.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating task:', error);
      alert('업무 수정에 실패했습니다.');
    }
  };

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
              value={updatedTask?.title || ''}
              name="title"
              onChange={handleChange}
            />
            <label className="form-label">우선순위</label>
            <select
              className="form-control"
              value={updatedTask?.priority || 'medium'}
              name="priority"
              // onChange={handleChange}
              onChange={handleChange}
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
            <label className="form-label">진행 상태</label>
            <select
              className="form-control"
              value={updatedTask?.status || 'plan'}
              name="status"
              // onChange={handleChange}
              onChange={handleChange}
            >
              <option value="plan">계획 중</option>
              <option value="progress">진행 중</option>
              <option value="done">완료</option>
            </select>
            <label className="form-label">시작 날짜</label>
            <input
              type="date"
              className="form-control"
              value={updatedTask?.start_date || ''}
              name="start_date"
              onChange={handleChange}
            />
            <label className="form-label">마감 날짜</label>
            <input
              type="date"
              className="form-control"
              value={updatedTask?.due_date || ''}
              name="due_date"
              onChange={handleChange}
            />
            <label className="form-label">설명</label>
            <textarea
              className="form-control"
              placeholder="설명 입력"
              value={updatedTask?.description || ''}
              name="description"
              onChange={handleChange}
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
            <button
              className="btn btn-success"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '저장'}
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
