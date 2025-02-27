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
  taskState: 'plan' | 'progress' | 'done';
  onCreate: (taskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    startDate: string;
    dueDate: string;
    taskState: 'plan' | 'progress' | 'done';
  }) => void;
}

export default function TaskModal({
  show,
  onHide,
  taskState,
  onCreate,
}: TaskModalProps) {
  const [title, setTitle] = useState(''); // 제목
  const titleRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState(''); // 설명
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low'); // 우선순위
  const [startDate, setStartDate] = useState(''); // 시작 날짜
  const [dueDate, setDueDate] = useState(''); // 마감 날짜
  const { space_id } = useParams<{ space_id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const handleCreateTask = async () => {
    if (title.trim() === '') {
      alert('제목을 입력해주세요');
      if (titleRef.current) {
        titleRef.current.focus();
      }
      return;
    } else if (startDate.trim() === '') {
      if (startDateRef.current) {
        startDateRef.current.focus();
      }
      alert('시작 날짜를 선택해주세요');
      return;
    } else if (dueDate.trim() === '') {
      if (dueDateRef.current) {
        dueDateRef.current.focus();
      }
      alert('시작 날짜를 선택해주세요');
      return;
    }

    const validDueDate = dueDate ? dueDate : 'none';
    // createTask 액션을 dispatch하여 상태에 새로운 task 추가
    const createTaskData = {
      // todo_id: 0,
      space_id: space_id,
      title: title,
      description: description,
      priority: priority,
      start_date: startDate,
      due_date: validDueDate,
    };
    // dispatch(
    //   createTask({
    //     title,
    //     description,
    //     priority,
    //     status: taskState || 'plan', // taskState가 null일 경우 기본값 'plan'
    //     start_date: startDate,
    //     due_date: dueDate || 'none',
    //   }),
    // );

    try {
      // 서버에 요청 보내기 (비동기 처리)
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/add`,
        createTaskData, // createTaskData를 직접 보내기
        { withCredentials: true }, // 쿠키 전송
      );

      console.log('taskmodal의 콘솔::', response.data); // 서버 응답 처리
      // 서버 응답에 따라 필요한 후속 처리 (예: 알림, 상태 갱신 등)
      const newTask = {
        todo_id: response.data.todo_id, // 서버에서 생성된 todo_id 사용
        title: title,
        description: description,
        priority: priority,
        status: taskState || 'plan', // taskState가 없다면 기본값 'plan' 사용
        start_date: startDate,
        due_date: validDueDate,
      };
      try {
        if (space_id) {
          const actionResult = await dispatch(
            createTaskAsync({ spaceId: space_id, newTask: newTask }),
          );

          if (createTaskAsync.fulfilled.match(actionResult)) {
            alert('업무가 성공적으로 생성되었습니다!');
            setTitle('');
            setDescription('');
            setPriority('low');
            setStartDate('');
            setDueDate('');
            onCreate({
              title,
              description,
              priority,
              startDate,
              dueDate: validDueDate,
              taskState: taskState || 'plan',
            });
            onHide();
          } else {
            alert('업무 생성에 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('Error creating task:', error);
        alert('서버와의 연결에 문제가 있습니다.');
      }
    } catch (error) {
      console.error('Error during request:', error);
      alert('서버와의 연결에 문제가 있습니다.');
    }

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
  };
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">할 일 생성 ({taskState})</h5>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
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
