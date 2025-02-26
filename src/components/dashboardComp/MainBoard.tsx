import axios from 'axios';
import { useEffect, useState } from 'react';
import { Task } from '../../types/types';
import { useParams } from 'react-router-dom';
import TaskModal from './TaskModal';
import ToDoBoard from './ToDoBoard';

const getWorkSpaceDataList = async (space_id: string | undefined) => {
  console.log('spaceid', space_id);
  if (!space_id) return { plan: [], progress: [], done: [] };

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos`,
      {},
      { withCredentials: true },
    );

    console.log('post전체업무 조회', response.data);
    if (response.data.status === 'SUCCESS' && response.data.data === null) {
      return { plan: [], progress: [], done: [] };
    }

    if (
      response.data.status === 'SUCCESS' ||
      response.data.message.includes('가져왔습니다')
    ) {
      return response.data.data;
    } else {
      console.error('업무 조회 실패:', response.data.message);
      return { plan: [], progress: [], done: [] };
    }
  } catch (error) {
    console.error('전체 업무 조회에 실패하였습니다.', error);
    return { plan: [], progress: [], done: [] };
  }
};
export default function MainBoard() {
  const { space_id } = useParams<{ space_id: string }>();
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [todoList, setTodoList] = useState<{
    plan: Task[];
    progress: Task[];
    done: Task[];
  }>({ plan: [], progress: [], done: [] });
  console.log('MainBoard todoList:', todoList);

  const handleFilter = async (
    filterType: 'priority' | 'due_date' | 'start_date',
  ) => {
    try {
      setCurrentFilter(filterType);
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
        { state: filterType, limit: 100, offset: 0 },
        { withCredentials: true },
      );
      console.log('필터링 정보 조회::', response.data);
      if (response.data.status === 'SUCCESS') {
        const filteredData: Task[] = response.data.data;
        setTodoList({
          plan: filteredData.filter(task => task.status === 'plan'),
          progress: filteredData.filter(task => task.status === 'progress'),
          done: filteredData.filter(task => task.status === 'done'),
        });
      }
    } catch (error) {
      console.error('서버 요청 중 오류 발생:', error);
    }
  };

  const handleCreateTask = (newTaskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    startDate: string;
    dueDate: string | null;
    taskState: 'plan' | 'progress' | 'done';
  }) => {
    // Task 타입에 맞게 변환
    const newTask: Task = {
      todo_id: 0, // 서버에서 생성된 ID로 대체됨
      title: newTaskData.title,
      description: newTaskData.description,
      priority: newTaskData.priority,
      status: newTaskData.taskState, // taskState를 status로 변경
      start_date: newTaskData.startDate,
      due_date: newTaskData.dueDate || 'none',
    };

    setTodoList(prev => ({
      ...prev,
      plan: [...prev.plan, newTask], // 새로 생성된 투두는 plan 상태에 추가
      // progress: [...prev.progress, newTask], // 새로 생성된 투두는 progress 상태에 추가
      // done: [...prev.done, newTask], // 새로 생성된 투두는 done 상태에 추가
    }));
  };

  const handleEditTask = () => {};
  const handleDeleteTask = () => {};

  useEffect(() => {
    console.log('🚀 useEffect 실행됨, space_id:', space_id);

    const loadWorkSpaceDataList = async () => {
      console.log('📢 loadWorkSpaceDataList 실행됨');
      const ListData = await getWorkSpaceDataList(space_id);
      if (ListData) {
        setTodoList(ListData);
        console.log('ListData', ListData);
      }
    };

    loadWorkSpaceDataList();
  }, [space_id]);
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
        <TaskModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          taskState="plan"
          onCreate={handleCreateTask}
        />
      </div>
      <ToDoBoard
        tasksPlan={todoList.plan}
        tasksProgress={todoList.progress}
        tasksDone={todoList.done}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
