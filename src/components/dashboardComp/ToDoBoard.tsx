import React, { useEffect, useRef, useState } from 'react';
import TaskColumn from './TaskColumn';
import '../../style/dashboard/todoBoard.scss';
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
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  // 서버로부터 필터링된 결과를 받아오기 위한 상태
  const [filteredTasks, setFilteredTasks] = useState<{
    plan: Task[];
    progress: Task[];
    done: Task[];
  }>({ plan: tasksPlan, progress: tasksProgress, done: tasksDone });
  // 필터가 변경될 때 필터링된 결과를 반영

  // 무한 스크롤링을 위한 상태 (전체 투두 리스트 중 현재까지 보여진 목록)
  // const [visibleTasks, setVisibleTasks] = useState<Task[]>([]); // 상태 관리
  const [visibleTasks, setVisibleTasks] = useState<{
    plan: Task[];
    progress: Task[];
    done: Task[];
  }>({
    plan: tasksPlan.slice(0, 5),
    progress: tasksProgress.slice(0, 5),
    done: tasksDone.slice(0, 5),
  });

  const [page, setPage] = useState(1); // 페이지 상태
  const tasksPerPage = 5; // 한 번에 보일 할 일 개수
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 초기 로드 시, 5개 항목만 보여주기
  // useEffect(() => {
  //   console.log('dummyTasks:', tasks); // 디버깅을 위한 콘솔 출력
  //   setVisibleTasks(tasks.slice(0, tasksPerPage)); // 처음 5개만 보이게 설정

  //   if (!currentFilter) {
  //     setFilteredTasks({
  //       plan: tasksPlan,
  //       progress: tasksProgress,
  //       done: tasksDone,
  //     });
  //   }
  // }, [currentFilter, tasksPlan, tasksProgress, tasksDone]);

  // 제가 넣은 상태관리로 돌아가도록 수정했어요!-지원
  useEffect(() => {
    if (!currentFilter) {
      setFilteredTasks({
        plan: tasksPlan,
        progress: tasksProgress,
        done: tasksDone,
      });
      setVisibleTasks({
        plan: tasksPlan.slice(0, tasksPerPage),
        progress: tasksProgress.slice(0, tasksPerPage),
        done: tasksDone.slice(0, tasksPerPage),
      });
    }
  }, [currentFilter, tasksPlan, tasksProgress, tasksDone]);

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreTasks(); // 끝까지 스크롤 시, 새로운 항목 로드
      }
    }
  };

  // 다음 5개 항목 로드
  const loadMoreTasks = () => {
    // visibleTasks에 추가할 항목 계산 (각 상태별)
    // if (visibleTasks.length < tasks.length) {
    //   const nextPage = page + 1;
    //   setPage(nextPage);
    //   const nextTasks = tasks.slice(
    //     nextPage * tasksPerPage - tasksPerPage,
    //     nextPage * tasksPerPage,
    //   );
    //   setVisibleTasks(prevTasks => [...prevTasks, ...nextTasks]); // 기존 항목에 추가
    // }
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      setVisibleTasks({
        plan: [
          ...visibleTasks.plan,
          ...filteredTasks.plan.slice(
            prevPage * tasksPerPage,
            nextPage * tasksPerPage,
          ),
        ],
        progress: [
          ...visibleTasks.progress,
          ...filteredTasks.progress.slice(
            prevPage * tasksPerPage,
            nextPage * tasksPerPage,
          ),
        ],
        done: [
          ...visibleTasks.done,
          ...filteredTasks.done.slice(
            prevPage * tasksPerPage,
            nextPage * tasksPerPage,
          ),
        ],
      });
      return nextPage;
    });
  };

  // 조회 버튼 클릭 시 호출되는 함수 (서버에 필터 요청)
  const handleFilter = async (
    filterType: 'priority' | 'due_date' | 'start_date',
  ) => {
    try {
      // 같은 필터를 다시 클릭하면 필터 해제하여 원래 데이터를 사용
      if (currentFilter === filterType) {
        setCurrentFilter(null);
        // 서버에 필터 해제 요청 없이, 원래 데이터를 사용
        setFilteredTasks({
          plan: tasksPlan,
          progress: tasksProgress,
          done: tasksDone,
        });
        setVisibleTasks({
          plan: tasksPlan.slice(0, tasksPerPage),
          progress: tasksProgress.slice(0, tasksPerPage),
          done: tasksDone.slice(0, tasksPerPage),
        });
        return;
      } else {
        setCurrentFilter(filterType);
      }

      // 서버로 필터 요청
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
        {
          state: filterType, // 선택한 필터 기준
          limit: 100, // 예시로 충분히 큰 숫자
          offset: 0,
        },
        { withCredentials: true },
      );

      if (response.data.status === 'SUCCESS') {
        // 서버에서 받은 데이터로 필터링 결과 업데이트
        const data: Task[] = response.data.data;
        setFilteredTasks({
          plan: data.filter(task => task.status === 'plan'),
          progress: data.filter(task => task.status === 'progress'),
          done: data.filter(task => task.status === 'done'),
        });
        // 무한 스크롤 초기화: 처음 5개씩 보여주기
        setVisibleTasks({
          plan: data
            .filter(task => task.status === 'plan')
            .slice(0, tasksPerPage),
          progress: data
            .filter(task => task.status === 'progress')
            .slice(0, tasksPerPage),
          done: data
            .filter(task => task.status === 'done')
            .slice(0, tasksPerPage),
        });
        setPage(1);
      } else {
        console.error('필터링 실패:', response.data.message);
      }
    } catch (error) {
      console.error('서버 요청 중 오류 발생:', error);
    }
  };

  // 렌더링 시, 필터링된 결과가 있으면 그 값을 사용
  const finalPlanTasks = visibleTasks.plan;
  const finalProgressTasks = visibleTasks.progress;
  const finalDoneTasks = visibleTasks.done;

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
        taskState="plan"
      />
      <div className="todo-board container py-4">
        <div className="row g-3">
          <div className="col-md-4">
            <TaskColumn
              title="계획 중"
              state="plan"
              tasks={finalPlanTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              // onCreate={onCreate}
              // onFilter={onFilter}
            />
          </div>

          <div className="col-md-4">
            <TaskColumn
              title="진행 중"
              state="progress"
              tasks={finalProgressTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              // onCreate={onCreate}
              // onFilter={onFilter}
            />
          </div>

          <div className="col-md-4">
            <TaskColumn
              title="완료"
              state="done"
              tasks={finalDoneTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              // onCreate={onCreate}
              // onFilter={onFilter}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// return (
//   <>
//     <div className="task-actions">
//       <button
//         className="btn btn-sm btn-primary"
//         onClick={() => setShowCreateModal(true)}
//       >
//         + 생성
//       </button>
//       <div className="filter-container">
//         <button
//           className="btn btn-sm btn-secondary filter-btn"
//           onClick={() => setShowFilterOptions(!showFilterOptions)}
//         >
//           🔍 조회
//         </button>
//         {showFilterOptions && (
//           <div className="filter-options">
//             <button onClick={() => handleFilter('priority')}>우선순위</button>
//             <button onClick={() => handleFilter('due_date')}>마감일</button>
//             <button onClick={() => handleFilter('start_date')}>시작일</button>
//           </div>
//         )}
//       </div>
//     </div>
//     <TaskModal
//       show={showCreateModal}
//       onHide={() => setShowCreateModal(false)}
//       taskState="plan" // 생성 시 기본 상태는 'plan' (필요시 동적으로 변경)
//     />
//     <div className="todo-board container py-4">
//       <div className="row g-3">
//         <div className="col-md-4">
//           <TaskColumn
//             title="계획 중"
//             state="plan"
//             tasks={filteredTasks.plan}
//             onEdit={onEdit}
//             onDelete={onDelete}
//           />
//         </div>
//         <div className="col-md-4">
//           <TaskColumn
//             title="진행 중"
//             state="progress"
//             tasks={filteredTasks.progress}
//             onEdit={onEdit}
//             onDelete={onDelete}
//           />
//         </div>
//         <div className="col-md-4">
//           <TaskColumn
//             title="완료"
//             state="done"
//             tasks={filteredTasks.done}
//             onEdit={onEdit}
//             onDelete={onDelete}
//           />
//         </div>
//       </div>
//     </div>
//   </>
// );
// }
