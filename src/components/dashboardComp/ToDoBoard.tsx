// import React from 'react';
// import TaskColumn from './TaskColumn';
// import '../../style/dashboard/todoBoard.scss';
// import { Task } from '../../types/types';

// interface ToDoBoardProps {
//   tasks: Task[];
//   onEdit: (task: Task) => void;
//   onDelete: (task: Task) => void;
//   onCreate: (state: 'open' | 'in_progress' | 'done') => void;
//   onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
// }

// export default function ToDoBoard({
//   tasks,
//   onEdit,
//   onDelete,
//   onCreate,
//   onFilter,
// }: ToDoBoardProps) {
//   return (
//     <div className="todo-board container py-4">
//       <div className="row g-3">
//         <div className="col-md-4">
//           <TaskColumn
//             title="계획 중"
//             state="open"
//             tasks={tasks.filter(task => task.state === 'open')}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onCreate={onCreate}
//             onFilter={onFilter}
//           />
//         </div>

//         <div className="col-md-4">
//           <TaskColumn
//             title="진행 중"
//             state="in_progress"
//             tasks={tasks.filter(task => task.state === 'in_progress')}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onCreate={onCreate}
//             onFilter={onFilter}
//           />
//         </div>

//         <div className="col-md-4">
//           <TaskColumn
//             title="완료"
//             state="done"
//             tasks={tasks.filter(task => task.state === 'done')}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onCreate={onCreate}
//             onFilter={onFilter}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import TaskColumn from './TaskColumn';
import '../../style/dashboard/todoBoard.scss';
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
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]); // 상태 관리
  const [page, setPage] = useState(1); // 페이지 상태
  const tasksPerPage = 5; // 한 번에 보일 할 일 개수
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 초기 로드 시, 5개 항목만 보여주기
  useEffect(() => {
    console.log('dummyTasks:', tasks); // 디버깅을 위한 콘솔 출력
    setVisibleTasks(tasks.slice(0, tasksPerPage)); // 처음 5개만 보이게 설정
  }, [tasks]);

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
    if (visibleTasks.length < tasks.length) {
      const nextPage = page + 1;
      setPage(nextPage);
      const nextTasks = tasks.slice(
        nextPage * tasksPerPage - tasksPerPage,
        nextPage * tasksPerPage,
      );
      setVisibleTasks(prevTasks => [...prevTasks, ...nextTasks]); // 기존 항목에 추가
    }
  };

  return (
    <div className="todo-board container py-4">
      <div className="row g-3">
        <div className="col-md-4">
          <TaskColumn
            title="계획 중"
            state="open"
            tasks={visibleTasks.filter(task => task.state === 'open')}
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
            tasks={visibleTasks.filter(task => task.state === 'in_progress')}
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
            tasks={visibleTasks.filter(task => task.state === 'done')}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onCreate}
            onFilter={onFilter}
          />
        </div>
      </div>

      {/* 스크롤을 감지할 컨테이너 */}
      <div
        className="task-list-container"
        ref={containerRef}
        onScroll={handleScroll}
        style={{ maxHeight: '400px', overflowY: 'auto' }} // 스크롤이 가능하게 설정
      >
        {/* 할 일 목록 표시 */}
      </div>
    </div>
  );
}
