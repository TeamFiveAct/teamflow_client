// src/components/TaskModal.tsx
import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../style/taskModal.scss';
import { useDispatch } from 'react-redux';
// import { createTask } from '../../store/modules/taskSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../style/dashboard/taskModal.scss';
import { AppDispatch } from '../../store/store';
import { createTaskAsync } from '../../store/modules/taskSlice';
import { Task } from '../../types/types';

interface TaskModalProps {
  show: boolean;
  onHide: () => void;
  // taskState: 'plan' | 'progress' | 'done';
  onCreate: (taskData: {
    space_id?: string;
    todo_id?: number;
    title: string;
    status: 'plan' | 'progress' | 'done';
    description: string;
    priority: 'low' | 'medium' | 'high';
    startDate: string;
    dueDate: string;
    // taskState: 'plan' | 'progress' | 'done';
  }) => void;
}

export default function TaskModal({
  show,
  onHide,
  // taskState,
  onCreate,
}: TaskModalProps) {
  const [title, setTitle] = useState(''); // 제목
  const titleRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState(''); // 설명
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low'); // 우선순위
  const [status, setStatus] = useState<'plan' | 'progress' | 'done'>('plan'); // 우선순위
  const [startDate, setStartDate] = useState(''); // 시작 날짜
  const [dueDate, setDueDate] = useState(''); // 마감 날짜
  const { space_id } = useParams<{ space_id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const handleCreateTask = async () => {
    if (title.trim() === '') {
      alert('제목을 입력해주세요');
      titleRef.current?.focus();
      return;
    }

    if (startDate.trim() === '') {
      alert('시작 날짜를 선택해주세요');
      startDateRef.current?.focus();
      return;
    }

    if (dueDate.trim() === '') {
      alert('마감 날짜를 선택해주세요');
      dueDateRef.current?.focus();
      return;
    }

    const validDueDate = dueDate || 'none';

    // mainboard에서 전달한 onCreate 호출
    await onCreate({
      title,
      description,
      priority,
      status,
      startDate,
      dueDate: validDueDate,
      // taskState: taskState || 'plan',
    });

    // 입력 필드 초기화 및 모달 닫기
    setTitle('');
    setDescription('');
    setPriority('low');
    setStatus('plan');
    setStartDate('');
    setDueDate('');
    onHide();
  };

  //     if (response.data.status === 'SUCCESS') {
  //       // 생성된 업무를 Redux 상태에 추가
  //       dispatch(createTask(response.data.data.todo)); // 데이터 구조에 맞게 수정 필요
  //       alert(response.data.message);

  //       setTitle('');
  //       setDescription('');
  //       setPriority('low');
  //       setStartDate('');
  //       setDueDate('');
  //       onCreate({
  //         title,
  //         description,
  //         priority,
  //         startDate,
  //         dueDate: validDueDate,
  //         taskState: taskState || 'plan',
  //       });

  //       // 저장 후 모달 닫기
  //       onHide();
  //     } else {
  //       console.error('업무 생성 실패');
  //     }
  //   } catch (error) {
  //     console.error('Error creating task:', error);
  //     alert('서버와의 연결에 문제가 있습니다.');
  //   }
  // };
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div
        className="custom-modal"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="modal-header">
          <h5 className="modal-title">할 일 생성 </h5>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <div
          className="modal-body"
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          <form>
            <div className="mb-3">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-control"
                placeholder="제목 입력"
                value={title}
                ref={titleRef}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">설명</label>
              <textarea
                className="form-control"
                placeholder="설명 입력"
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">우선순위</label>
              <select
                className="form-control"
                value={priority}
                onChange={e =>
                  setPriority(e.target.value as 'low' | 'medium' | 'high')
                }
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">진행상태</label>
              <select
                className="form-control"
                value={status}
                onChange={e =>
                  setStatus(e.target.value as 'plan' | 'progress' | 'done')
                }
              >
                <option value="plan">계획 중</option>
                <option value="progress">진행 중</option>
                <option value="done">완료</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">시작 날짜</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                ref={startDateRef}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">마감 날짜</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                ref={dueDateRef}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onHide}>
            닫기
          </button>
          <button className="btn btn-primary" onClick={handleCreateTask}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
