import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisH, FaTrash } from 'react-icons/fa';
import TaskDetailModal from './TaskDetailModal';
import TaskModal from './TaskModal'; // ✅ TaskModal 추가
import '../../style/taskColumn.scss';
import { Task } from '../../types/types';

interface TaskColumnProps {
  title: string;
  state: 'open' | 'in_progress' | 'done';
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreate: (state: 'open' | 'in_progress' | 'done') => void;
  onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
}

export default function TaskColumn({
  title,
  state,
  tasks,
  onEdit,
  onDelete,
  onCreate,
  onFilter,
}: TaskColumnProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // ✅ 생성 모달 상태 추가
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const TASKS_PER_LOAD = 5; // ✅ 한 번에 로드할 할 일 개수

  useEffect(() => {
    setVisibleTasks(tasks.slice(0, TASKS_PER_LOAD));
    setPage(1);
  }, [tasks]);

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

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  return (
    <div className="task-column">
      <div className="task-column-header">
        <h3>{title}</h3>
        <div className="task-actions">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setShowCreateModal(true)} // ✅ 생성 버튼 클릭 시 모달 열기
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
                <button onClick={() => onFilter('priority')}>우선순위</button>
                <button onClick={() => onFilter('due_date')}>마감일</button>
                <button onClick={() => onFilter('start_date')}>시작일</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="task-list" ref={containerRef} onScroll={handleScroll}>
        {visibleTasks.map(task => (
          <div key={task.todo_id} className="task-card">
            <div className="task-header">
              <h5>{task.title}</h5>
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            </div>
            <p className="task-due-date">마감 기한: {task.due_date}</p>

            <div className="task-actions">
              <button
                className="task-action-btn"
                onClick={() => handleOpenDetail(task)}
              >
                <FaEllipsisH />
              </button>
              <button
                className="task-action-btn delete"
                onClick={() => onDelete(task)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ TaskDetailModal (할 일 상세보기 모달) */}
      <TaskDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        task={selectedTask}
      />

      {/* ✅ TaskModal (할 일 생성 모달) */}
      <TaskModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        taskState={state}
      />
    </div>
  );
}
