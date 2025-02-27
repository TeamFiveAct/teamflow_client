// import React, { useCallback, useEffect, useRef } from 'react';
// import TaskColumn from './TaskColumn';
// import '../../style/dashboard/todoBoard.scss';
// import { Task } from '../../types/types';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { loadMoreTasks } from '../../store/modules/taskSlice';

// interface ToDoBoardProps {
//   tasksPlan: Task[];
//   tasksProgress: Task[];
//   tasksDone: Task[];
//   // onEdit: (task: Task) => void;
//   // onDelete: (task: Task) => void;
// }

// export default function ToDoBoard({ tasksPlan, tasksProgress, tasksDone }) {
//   const tasksPerPage = 10;
//   const dispatch = useDispatch();
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // Redux에서 상태 가져오기
//   const { tasksPlan, tasksProgress, tasksDone, loadedTasks } = useSelector(
//     (state: RootState) => {
//       const tasks = state.tasks.tasks;
//       return {
//         tasksPlan: tasks.filter(task => task.status === 'plan'),
//         tasksProgress: tasks.filter(task => task.status === 'progress'),
//         tasksDone: tasks.filter(task => task.status === 'done'),
//         loadedTasks: tasks.length, // 현재 로드된 전체 할 일 개수
//       };
//     },
//   );

//   // 스크롤 이벤트 핸들러
//   const handleScroll = useCallback(() => {
//     if (containerRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//       if (scrollTop + clientHeight >= scrollHeight - 5) {
//         dispatch(loadMoreTasks()); // 더 많은 데이터 요청
//       }
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     const currentContainer = containerRef.current;
//     if (currentContainer) {
//       currentContainer.addEventListener('scroll', handleScroll);
//     }
//     return () => {
//       if (currentContainer) {
//         currentContainer.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, [handleScroll]);

//   return (
//     <div className="todo-board container py-4" ref={containerRef}>
//       <div className="row g-3">
//         <div className="col-md-4">
//           <TaskColumn title="계획 중" status="plan" tasks={tasksPlan} />
//         </div>
//         <div className="col-md-4">
//           <TaskColumn title="진행 중" status="progress" tasks={tasksProgress} />
//         </div>
//         <div className="col-md-4">
//           <TaskColumn title="완료" status="done" tasks={tasksDone} />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragEventHandler } from 'react';
import TaskColumn from './TaskColumn';
import '../../style/dashboard/todoBoard.scss';
import { Task } from '../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
// import TaskModal from './TaskModal';

interface ToDoBoardProps {
  tasksPlan: Task[];
  tasksProgress: Task[];
  tasksDone: Task[];
  // onDragEnd: (todo_id: number, newState: 'plan' | 'progress' | 'done') => void;
  // onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function ToDoBoard({
  tasksPlan,
  tasksProgress,
  tasksDone,
  onDelete,
}: // onEdit,
ToDoBoardProps) {
  // 페이지당 표시할 할 일 개수
  console.log('todoboard의 tasksPlan:::', tasksPlan, tasksDone);

  const tasksPerPage = 10;
  const [visibleTasks, setVisibleTasks] = useState({
    plan: tasksPlan.slice(0, tasksPerPage),
    progress: tasksProgress.slice(0, tasksPerPage),
    done: tasksDone.slice(0, tasksPerPage),
  });
  const [page, setPage] = useState(1); // 페이지 상태
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const tasks = useSelector((state: RootState) => state.tasks);
  // const dispatch = useDispatch();

  const loadMoreTasks = useCallback(() => {
    setVisibleTasks(prevTasks => ({
      plan: [
        ...prevTasks.plan,
        ...tasksPlan.slice(
          prevTasks.plan.length,
          prevTasks.plan.length + tasksPerPage,
        ),
      ],
      progress: [
        ...prevTasks.progress,
        ...tasksProgress.slice(
          prevTasks.progress.length,
          prevTasks.progress.length + tasksPerPage,
        ),
      ],
      done: [
        ...prevTasks.done,
        ...tasksDone.slice(
          prevTasks.done.length,
          prevTasks.done.length + tasksPerPage,
        ),
      ],
    }));
  }, [tasksPlan, tasksProgress, tasksDone]);

  useEffect(() => {
    // const handleScroll = () => {
    //   if (containerRef.current) {
    //     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    //     if (scrollTop + clientHeight >= scrollHeight - 5) {
    //       loadMoreTasks();
    //     }
    //   }
    // };

    // const currentContainer = containerRef.current;
    // if (currentContainer) {
    //   currentContainer.addEventListener('scroll', handleScroll);
    // }

    // return () => {
    //   if (currentContainer) {
    //     currentContainer.removeEventListener('scroll', handleScroll);
    //   }
    // };
    setVisibleTasks({
      plan: tasksPlan.slice(0, tasksPerPage),
      progress: tasksProgress.slice(0, tasksPerPage),
      done: tasksDone.slice(0, tasksPerPage),
    });
  }, [tasksPlan, tasksProgress, tasksDone]);

  const emptyTask: Task = {
    todo_id: 0, // 기본값으로 설정
    title: '환영합니다!',
    description: '',
    priority: 'low',
    start_date: '',
    due_date: '',
    status: 'plan',
  };

  return (
    <div className="todo-board container py-4" ref={containerRef}>
      <div className="row g-3">
        <div className="col-md-4">
          <TaskColumn
            title="계획 중"
            // status={tasksPlan}
            status="plan"
            tasks={visibleTasks.plan}
            // tasks={
            //   visibleTasks.plan.length > 0 ? visibleTasks.plan : [emptyTask]
            // }
            // onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        <div className="col-md-4">
          <TaskColumn
            title="진행 중"
            // status={tasksDone}
            status="progress"
            tasks={visibleTasks.progress}
            // tasks={
            //   visibleTasks.progress.length > 0
            //     ? visibleTasks.progress
            //     : [emptyTask]
            // }
            // onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        <div className="col-md-4">
          <TaskColumn
            title="완료"
            // status={tasksPlan}
            status="done"
            tasks={visibleTasks.done}
            // tasks={
            //   visibleTasks.done.length > 0 ? visibleTasks.done : [emptyTask]
            // }
            // onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
