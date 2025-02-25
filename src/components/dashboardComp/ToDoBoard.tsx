import React, { useEffect, useState } from 'react';
import TaskColumn from './TaskColumn';
import '../../style/todoBoard.scss';
import { Task } from '../../types/types';
import TaskModal from './TaskModal';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface ToDoBoardProps {
  tasksPlan: Task[];
  tasksProgress: Task[];
  tasksDone: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  // onCreate: (state: 'plan' | 'progress' | 'done') => void;
  // onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
}

export default function ToDoBoard({
  tasksPlan,
  tasksProgress,
  tasksDone,
  onEdit,
  onDelete,
}: // onCreate,
// onFilter,
ToDoBoardProps) {
  const { space_id } = useParams<{ space_id: string }>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [filteredTasks, setFilteredTasks] = useState<{
    plan: Task[];
    progress: Task[];
    done: Task[];
  }>({ plan: tasksPlan, progress: tasksProgress, done: tasksDone });
  // 필터가 변경될 때 필터링된 결과를 반영

  useEffect(() => {
    if (!currentFilter) {
      // 필터가 없으면 원래 상태 유지
      //   setFilteredTasks({
      //     plan: tasksPlan,
      //     progress: tasksProgress,
      //     done: tasksDone,
      //   });
      // } else {
      //   // 로컬 필터링
      //   const filterTasks = (tasks: Task[]) =>
      //     tasks.filter(
      //       task =>
      //         task.priority === currentFilter ||
      //         task.due_date === currentFilter ||
      //         task.start_date === currentFilter,
      //     );

      //   setFilteredTasks({
      //     plan: filterTasks(tasksPlan),
      //     progress: filterTasks(tasksProgress),
      //     done: filterTasks(tasksDone),
      //   });
      // }
      setFilteredTasks({
        plan: tasksPlan,
        progress: tasksProgress,
        done: tasksDone,
      });
    }
  }, [currentFilter, tasksPlan, tasksProgress, tasksDone]);

  // 조회 버튼 클릭 시 호출되는 함수 (서버에 필터 요청)
  const handleFilter = async (
    filterType: 'priority' | 'due_date' | 'start_date',
  ) => {
    try {
      // if (currentFilter === filterType) {
      //   // // 같은 필터를 다시 클릭하면 필터 해제
      //   // setCurrentFilter(null);
      //   setCurrentFilter(filterType);
      //   // 필터 해제 시, 원래의 tasks 데이터를 사용하여 상태 업데이트
      //   setFilteredTasks({
      //     plan: tasksPlan,
      //     progress: tasksProgress,
      //     done: tasksDone,
      //   });
      //   return;
      // } else {
      //   // 필터가 변경되면 서버에 필터 요청
      setCurrentFilter(filterType);

      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
        {
          state: filterType, // 예시로 'open' 상태만 필터링한다고 가정 (필터 상태도 필요)
          limit: 5, // 개수 제한
          offset: 0, // 페이지네이션 offset
        },
        { withCredentials: true },
      );

      if (response.data.status === 'SUCCESS') {
        // 서버에서 받은 데이터로 필터링된 결과 상태 업데이트
        setFilteredTasks({
          plan: response.data.data.filter(
            (task: Task) => task.status === 'plan',
          ),
          progress: response.data.data.filter(
            (task: Task) => task.status === 'progress',
          ),
          done: response.data.data.filter(
            (task: Task) => task.status === 'done',
          ),
        });
      } else {
        console.error('필터링 실패:', response.data.message);
      }
      // }
    } catch (error) {
      console.error('서버 요청 중 오류 발생:', error);
    }
  };

  return (
    <>
      <div className="task-actions">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + 생성
        </button>
        <div className="filter-container">
          <button
            className="btn btn-sm btn-secondary filter-btn"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            🔍 조회
          </button>
          {showFilterOptions && (
            <div className="filter-options">
              <button onClick={() => handleFilter('priority')}>우선순위</button>
              <button onClick={() => handleFilter('due_date')}>마감일</button>
              <button onClick={() => handleFilter('start_date')}>시작일</button>
            </div>
          )}
        </div>
      </div>
      <TaskModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        taskState="plan" // 생성 시 기본 상태는 'plan' (필요시 동적으로 변경)
      />
      <div className="todo-board container py-4">
        <div className="row g-3">
          <div className="col-md-4">
            <TaskColumn
              title="계획 중"
              state="plan"
              tasks={filteredTasks.plan}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
          <div className="col-md-4">
            <TaskColumn
              title="진행 중"
              state="progress"
              tasks={filteredTasks.progress}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
          <div className="col-md-4">
            <TaskColumn
              title="완료"
              state="done"
              tasks={filteredTasks.done}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
}
