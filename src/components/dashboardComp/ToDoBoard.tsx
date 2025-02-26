import React, { useCallback, useEffect, useRef, useState } from 'react';
import TaskColumn from './TaskColumn';
import '../../style/dashboard/todoBoard.scss';
import { Task } from '../../types/types';
// import TaskModal from './TaskModal';

interface ToDoBoardProps {
  tasksPlan: Task[];
  tasksProgress: Task[];
  tasksDone: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function ToDoBoard({
  tasksPlan,
  tasksProgress,
  tasksDone,
  onEdit,
  onDelete,
}: ToDoBoardProps) {
  // 페이지당 표시할 할 일 개수
  console.log('tasksPlan:::', tasksPlan, tasksDone);
  const tasksPerPage = 10;
  const [visibleTasks, setVisibleTasks] = useState({
    plan: tasksPlan.slice(0, tasksPerPage),
    progress: tasksProgress.slice(0, tasksPerPage),
    done: tasksDone.slice(0, tasksPerPage),
  });
  const [page, setPage] = useState(1); // 페이지 상태
  const containerRef = useRef<HTMLDivElement | null>(null);

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
            status="plan"
            tasks={visibleTasks.plan}
            // tasks={
            //   visibleTasks.plan.length > 0 ? visibleTasks.plan : [emptyTask]
            // }
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        <div className="col-md-4">
          <TaskColumn
            title="진행 중"
            status="progress"
            tasks={visibleTasks.progress}
            // tasks={
            //   visibleTasks.progress.length > 0
            //     ? visibleTasks.progress
            //     : [emptyTask]
            // }
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        <div className="col-md-4">
          <TaskColumn
            title="완료"
            status="done"
            tasks={visibleTasks.done}
            // tasks={
            //   visibleTasks.done.length > 0 ? visibleTasks.done : [emptyTask]
            // }
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
