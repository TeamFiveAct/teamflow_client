import React, { useState, useRef, useEffect, DragEventHandler } from 'react';
import { FaEllipsisH, FaTrash } from 'react-icons/fa';
import TaskDetailModal from './TaskDetailModal';
import TaskModal from './TaskModal'; // ✅ TaskModal 추가
import '../../style/dashboard/taskColumn.scss';
import { Task } from '../../types/types';
import { useDispatch, useSelector } from 'react-redux';
// import { updateTask, deleteTask } from '../../store/modules/taskSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useParams } from 'react-router-dom';
import {
  deleteTaskAsync,
  updateTaskAsync,
} from '../../store/modules/taskSlice';

interface TaskColumnProps {
  title: string;
  status: 'plan' | 'progress' | 'done';
  tasks: Task[];
  // onDragEnd: (todo_id: number, newState: 'plan' | 'progress' | 'done') => void;
  // onCreate: (state: 'plan' | 'progress' | 'done') => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  // onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
}

export default function TaskColumn({
  title,
  status,
  tasks,
  onDelete,
  onEdit,
}: // onDragEnd,
// onCreate,
// onFilter,
TaskColumnProps) {
  // const handleDragEnd: DragEventHandler = e => {
  //   const todo_id = parseInt(e.dataTransfer.getData('todo_id'));
  //   const newState = e.dataTransfer.getData('new_state') as
  //     | 'plan'
  //     | 'progress'
  //     | 'done';
  //   onDragEnd(todo_id, newState);
  // };
  // console.log('taskcolumn의 onDelete존재유무::', onDelete);
  const { space_id } = useParams<{ space_id: string }>();
  const updatetasks = useSelector((state: RootState) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // const [showCreateModal, setShowCreateModal] = useState(false); // ✅ 생성 모달 상태 추가
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  // const [showFilterOptions, setShowFilterOptions] = useState(false);

  const TASKS_PER_LOAD = 5; // ✅ 한 번에 로드할 할 일 개수

  useEffect(() => {
    setVisibleTasks(tasks.slice(0, TASKS_PER_LOAD));
    setPage(1);
    // console.log('업데이트된 Redux tasks 상태:', updatetasks);
  }, [tasks]); //updatetasks

  const loadMoreTasks = () => {
    const nextTasks = tasks.slice(0, (page + 1) * TASKS_PER_LOAD);
    setVisibleTasks(nextTasks);
    setPage(page + 1);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreTasks();
      }
    }
  };

  // const handleEdit = (task: Task) => {
  //   if (space_id) {
  //     dispatch(updateTaskAsync({ spaceId: space_id, updatedTask: task }));
  //   }
  // };

  // const handleDelete = (task: Task) => {
  //    deleteTaskAsync({ spaceId: space_id, taskId: task.todo_id }),
  // };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };
  const handleSave = (updatedTask: Task) => {
    if (space_id) {
      dispatch(updateTaskAsync({ spaceId: space_id, updatedTask }));
    }
    setShowDetailModal(false); // 모달 닫기
  };
  // const handleDeleteTask = (task: Task) => {
  //   console.log('삭제할 todo_id:', task.todo_id); // 선택된 task의 todo_id를 확인
  //   dispatch(deleteTask(task.todo_id)); // task의 todo_id로 삭제 요청
  // };
  // const onDelete = (task: Task) => {
  //   dispatch(deleteTask(task.todo_id));
  // };

  return (
    // <div className="task-column" onDragEnd={handleDragEnd}>
    <div className="task-column">
      <div className="task-column-header">
        <h3>{title}</h3>
      </div>

      <div className="task-list" ref={containerRef} onScroll={handleScroll}>
        {visibleTasks.map(task => (
          <div key={task.todo_id} className="task-card" draggable>
            <div className="task-header">
              <h5>{task.title}</h5>
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            </div>
            <p className="task-due-date">마감 기한: {task.due_date}</p>

            <div className="task-actions">
              {/* <button
                className="task-action-btn"
                onClick={() => handleOpenDetail(task)}
              > */}
              <button
                className="task-action-btn"
                onClick={() => {
                  handleOpenDetail(task);
                }}
              >
                <FaEllipsisH />
              </button>
              <button
                className="task-action-btn delete"
                // onClick={() => handleDeleteTask(task)}
                onClick={() => onDelete(task)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ TaskDetailModal (할 일 상세보기 모달) */}
      {selectedTask && (
        <TaskDetailModal
          show={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          task={selectedTask}
          onEdit={handleSave}
        />
      )}

      {/* ✅ TaskModal (할 일 생성 모달) */}
      {/* <TaskModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        taskState={state}
      /> */}
    </div>
  );
}
