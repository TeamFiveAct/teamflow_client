import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisH, FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskDetailModal from './TaskDetailModal';
import TaskModal from './TaskModal';
import '../../style/taskColumn.scss';
import { Task } from '../../types/types';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../../store/modules/taskSlice';

interface TaskColumnProps {
  title: string;
  state: 'open' | 'in_progress' | 'done';
  tasks: Task[];
  onCreate: (state: 'open' | 'in_progress' | 'done') => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
  sortBy?: 'priority' | 'due_date' | 'start_date' | null;
  sortOrder?: 'asc' | 'desc';
}

export default function TaskColumn({
  title,
  state,
  tasks,
  onCreate,
  onEdit,
  onDelete,
  onFilter,
  sortBy = null,
  sortOrder = 'asc',
}: TaskColumnProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // ✅ 생성 모달 상태 추가
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const [showFilterOptions, setShowFilterOptions] = useState(false);

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

  const handleEdit = (task: Task) => {
    onEdit(task);
  };

  const handleDelete = (task: Task) => {
    onDelete(task);
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
                <button 
                  onClick={() => onFilter('priority')}
                  className={sortBy === 'priority' ? 'active' : ''}
                >
                  우선순위
                  {sortBy === 'priority' && (
                    sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
                <button 
                  onClick={() => onFilter('due_date')}
                  className={sortBy === 'due_date' ? 'active' : ''}
                >
                  마감일
                  {sortBy === 'due_date' && (
                    sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
                <button 
                  onClick={() => onFilter('start_date')}
                  className={sortBy === 'start_date' ? 'active' : ''}
                >
                  시작일
                  {sortBy === 'start_date' && (
                    sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Droppable droppableId={state}>
        {(provided) => (
          <div 
            className="task-list" 
            ref={(el) => {
              // 두 ref를 모두 설정
              containerRef.current = el;
              provided.innerRef(el);
            }}
            onScroll={handleScroll}
            {...provided.droppableProps}
          >
            {visibleTasks.map((task, index) => (
              <Draggable 
                key={task.todo_id.toString()} 
                draggableId={task.todo_id.toString()} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                  >
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
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDetailModal(true);
                        }}
                      >
                        <FaEllipsisH />
                      </button>
                      <button
                        className="task-action-btn delete"
                        onClick={() => handleDelete(task)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* ✅ TaskDetailModal (할 일 상세보기 모달) */}
      <TaskDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        task={selectedTask}
      />

      {/* ✅ TaskModal (할 일 생성 모달) */}
      <TaskModal
        show={showCreateModal}
        onHide={() => {
          console.log('TaskColumn state 값:', state);
          setShowCreateModal(false);
        }}
        taskState={state}
      />
    </div>
  );
}
