import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import '../../style/todoBoard.scss';
import { Task } from '../../types/types';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateTaskStateAsync } from '../../store/modules/taskSlice';
import { AppDispatch } from '../../store/store';

interface ToDoBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreate: (state: 'open' | 'in_progress' | 'done') => void;
  onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
}

// 상태 ID 정의
const STATE_IDS = {
  OPEN: 'open' as const,
  IN_PROGRESS: 'in_progress' as const,
  DONE: 'done' as const
};

type TaskState = 'open' | 'in_progress' | 'done';

export default function ToDoBoard({
  tasks = [],
  onEdit,
  onDelete,
  onCreate,
  onFilter,
}: ToDoBoardProps) {
  const { space_id } = useParams<{ space_id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [sortBy, setSortBy] = useState<'priority' | 'due_date' | 'start_date' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 안전 장치: tasks가 배열이 아니면 빈 배열로 설정
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // 드래그 앤 드롭 처리 함수
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 드롭 위치가 없거나 시작 위치와 같으면 아무 작업도 하지 않음
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // 드래그된 태스크 찾기
    const taskId = parseInt(draggableId);
    const task = safeTasks.find(t => t.todo_id === taskId);

    if (!task || !space_id) return;

    // 새 상태가 현재 상태와 다른 경우에만 업데이트
    if (destination.droppableId !== task.state) {
      // 상태 업데이트 액션 디스패치
      dispatch(updateTaskStateAsync({
        spaceId: parseInt(space_id),
        taskId: task.todo_id,
        state: destination.droppableId as 'open' | 'in_progress' | 'done'
      }));
    }
  };

  // 정렬 함수
  const handleSort = (type: 'priority' | 'due_date' | 'start_date') => {
    if (sortBy === type) {
      // 같은 타입으로 다시 정렬하면 정렬 순서 변경
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 새로운 타입으로 정렬
      setSortBy(type);
      setSortOrder('asc');
    }
    
    // 기존 필터 함수 호출
    onFilter(type);
  };

  // 태스크 정렬
  const sortTasks = (tasksToSort: Task[]) => {
    if (!sortBy) return tasksToSort;

    return [...tasksToSort].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { small: 1, medium: 2, high: 3, very_high: 4 };
        const aValue = priorityOrder[a.priority] || 0;
        const bValue = priorityOrder[b.priority] || 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortBy === 'due_date' || sortBy === 'start_date') {
        const aDate = new Date(a[sortBy]).getTime();
        const bDate = new Date(b[sortBy]).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      return 0;
    });
  };

  // 각 상태별 태스크 필터링 및 정렬
  const openTasks = sortTasks(safeTasks.filter(task => task.state === 'open'));
  const inProgressTasks = sortTasks(safeTasks.filter(task => task.state === 'in_progress'));
  const doneTasks = sortTasks(safeTasks.filter(task => task.state === 'done'));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="todo-board container py-4">
        <div className="row g-3">
          <div className="col-md-4">
            <TaskColumn
              title="계획 중"
              state="open"
              tasks={openTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreate={onCreate}
              onFilter={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>

          <div className="col-md-4">
            <TaskColumn
              title="진행 중"
              state="in_progress"
              tasks={inProgressTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreate={onCreate}
              onFilter={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>

          <div className="col-md-4">
            <TaskColumn
              title="완료"
              state="done"
              tasks={doneTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreate={onCreate}
              onFilter={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
