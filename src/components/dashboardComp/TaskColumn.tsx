// import React, { useState, useRef, useEffect, DragEventHandler } from 'react';
// import { FaEllipsisH, FaTrash } from 'react-icons/fa';
// import TaskDetailModal from './TaskDetailModal';
// import TaskModal from './TaskModal'; // ✅ TaskModal 추가
// import '../../style/dashboard/taskColumn.scss';
// import { Task } from '../../types/types';
// import { useDispatch, useSelector } from 'react-redux';
// // import { updateTask, deleteTask } from '../../store/modules/taskSlice';
// import { AppDispatch, RootState } from '../../store/store';
// import { useParams } from 'react-router-dom';
// import {
//   deleteTaskAsync,
//   updateTaskAsync,
// } from '../../store/modules/taskSlice';

// interface TaskColumnProps {
//   title: string;
//   status: 'plan' | 'progress' | 'done';
//   tasks: Task[];
//   // onDragEnd: (todo_id: number, newState: 'plan' | 'progress' | 'done') => void;
//   // onCreate: (state: 'plan' | 'progress' | 'done') => void;
//   onEdit: (task: Task) => void;
//   onDelete: (task: Task) => void;
//   loadMoreTasks: (status: 'plan' | 'progress' | 'done') => void; // ✅ 추가
//   hasMore: { plan: boolean; progress: boolean; done: boolean }; // ✅ 추가
//   // onFilter: (filterType: 'priority' | 'due_date' | 'start_date') => void;
// }

// export default function TaskColumn({
//   title,
//   status,
//   tasks,
//   onDelete,
//   onEdit,
//   loadMoreTasks,
//   hasMore,
// }: // onDragEnd,
// // onCreate,
// // onFilter,
// TaskColumnProps) {
//   // const handleDragEnd: DragEventHandler = e => {
//   //   const todo_id = parseInt(e.dataTransfer.getData('todo_id'));
//   //   const newState = e.dataTransfer.getData('new_state') as
//   //     | 'plan'
//   //     | 'progress'
//   //     | 'done';
//   //   onDragEnd(todo_id, newState);
//   // };
//   // console.log('taskcolumn의 onDelete존재유무::', onDelete);
//   const { space_id } = useParams<{ space_id: string }>();
//   const updatetasks = useSelector((state: RootState) => state.tasks);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   // const [showCreateModal, setShowCreateModal] = useState(false); // ✅ 생성 모달 상태 추가

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const dispatch = useDispatch<AppDispatch>();
//   // const [showFilterOptions, setShowFilterOptions] = useState(false);
//   const [visibleTasks, setVisibleTasks] = useState<Task[]>([]); // 🚀 1. 초기에는 비어있는 상태
//   const [page, setPage] = useState(1);
//   const TASKS_PER_LOAD = 5;

//   useEffect(() => {
//     console.log(`[${status}] tasks 변경됨:`, tasks);
//     setVisibleTasks(tasks.slice(0, TASKS_PER_LOAD));
//     setPage(1);
//     // console.log('업데이트된 Redux tasks 상태:', updatetasks);
//   }, [tasks]); //updatetasks

//   const loadMoreTasks = async (status: 'plan' | 'progress' | 'done') => {
//     if (!hasMore[status]) return; // 더 이상 불러올 데이터가 없으면 종료
//     try {
//       console.log(
//         `[${status}] 추가 데이터 요청 시작 - 현재 페이지:`,
//         page[status],
//       );

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
//         { state: status, limit: 5, offset: (page[status] + 1) * 5 },
//         { withCredentials: true },
//       );

//       console.log(`[${status}] 추가 데이터 응답:`, response.data);

//       if (response.data.status === 'SUCCESS' && response.data.data.length > 0) {
//         console.log(`[${status}] 기존 데이터 개수:`, todoList[status].length);
//         console.log(
//           `[${status}] 새로 가져온 데이터 개수:`,
//           response.data.data.length,
//         );

//         setTodoList(prev => ({
//           ...prev,
//           [status]: [...prev[status], ...response.data.data], // 기존 데이터 + 새로운 데이터 추가
//         }));

//         setPage(prev => ({ ...prev, [status]: prev[status] + 1 })); // 페이지 증가
//       } else {
//         console.log(`[${status}] 더 이상 추가 데이터 없음.`);
//         setHasMore(prev => ({ ...prev, [status]: false })); // 더 이상 데이터 없음
//       }
//     } catch (error) {
//       console.error(`[${status}] 추가 업무 로드 실패:`, error);
//     }
//   };

//   //---------scrolling------------
//   const handleScroll = () => {
//     if (containerRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//       console.log(
//         `[${status}] 스크롤 위치:`,
//         scrollTop,
//         clientHeight,
//         scrollHeight,
//       );

//       if (scrollTop + clientHeight >= scrollHeight - 10) {
//         console.log(`[${status}] 스크롤 끝 도달!`);
//         loadMoreTasks();
//       }
//     }
//   };
//   //---------scrolling------------

//   // const handleScroll = () => {
//   //   if (containerRef.current) {
//   //     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//   //     if (scrollTop + clientHeight >= scrollHeight - 5) {
//   //       loadMoreTasks();
//   //     }
//   //   }
//   // };

//   // const handleEdit = (task: Task) => {
//   //   if (space_id) {
//   //     dispatch(updateTaskAsync({ spaceId: space_id, updatedTask: task }));
//   //   }
//   // };

//   // const handleDelete = (task: Task) => {
//   //    deleteTaskAsync({ spaceId: space_id, taskId: task.todo_id }),
//   // };

//   const handleOpenDetail = (task: Task) => {
//     setSelectedTask(task);
//     setShowDetailModal(true);
//   };
//   const handleSave = (updatedTask: Task) => {
//     if (space_id) {
//       dispatch(updateTaskAsync({ spaceId: space_id, updatedTask }));
//     }
//     setShowDetailModal(false); // 모달 닫기
//   };
//   // const handleDeleteTask = (task: Task) => {
//   //   console.log('삭제할 todo_id:', task.todo_id); // 선택된 task의 todo_id를 확인
//   //   dispatch(deleteTask(task.todo_id)); // task의 todo_id로 삭제 요청
//   // };
//   // const onDelete = (task: Task) => {
//   //   dispatch(deleteTask(task.todo_id));
//   // };

//   return (
//     // <div className="task-column" onDragEnd={handleDragEnd}>
//     <div className="task-column">
//       <div className="task-column-header">
//         <h3>{title}</h3>
//       </div>

//       <div className="task-list" ref={containerRef} onScroll={handleScroll}>
//         {visibleTasks.map(task => (
//           <div key={task.todo_id} className="task-card" draggable>
//             <div className="task-header">
//               <h5>{task.title}</h5>
//               <span className={`priority-badge ${task.priority}`}>
//                 {task.priority}
//               </span>
//             </div>
//             <p className="task-due-date">마감 기한: {task.due_date}</p>

//             <div className="task-actions">
//               {/* <button
//                 className="task-action-btn"
//                 onClick={() => handleOpenDetail(task)}
//               > */}
//               <button
//                 className="task-action-btn"
//                 onClick={() => {
//                   handleOpenDetail(task);
//                 }}
//               >
//                 <FaEllipsisH />
//               </button>
//               <button
//                 className="task-action-btn delete"
//                 // onClick={() => handleDeleteTask(task)}
//                 onClick={() => onDelete(task)}
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ✅ TaskDetailModal (할 일 상세보기 모달) */}
//       {selectedTask && (
//         <TaskDetailModal
//           show={showDetailModal}
//           onClose={() => setShowDetailModal(false)}
//           task={selectedTask}
//           onEdit={handleSave}
//         />
//       )}

//       {/* ✅ TaskModal (할 일 생성 모달) */}
//       {/* <TaskModal
//         show={showCreateModal}
//         onHide={() => setShowCreateModal(false)}
//         taskState={state}
//       /> */}
//     </div>
//   );
// }

//--------------무한 스크롤링-------
import React, { useState, useRef, useEffect } from 'react';
import '../../style/dashboard/taskColumn.scss';
import TaskDetailModal from './TaskDetailModal';
import { FaEllipsisH, FaTrash } from 'react-icons/fa';
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
  onEdit: (updatedTaskData: {
    space_id?: string;
    todo_id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'plan' | 'progress' | 'done';
    start_date: string;
    due_date: string | null;
  }) => void;
  onDelete: (task: Task) => void;
  loadMoreTasks: (status: 'plan' | 'progress' | 'done') => void;
  hasMore: { plan: boolean; progress: boolean; done: boolean };
}

export default function TaskColumn({
  title,
  status,
  tasks,
  onDelete,
  onEdit,
  loadMoreTasks,
  hasMore,
}: TaskColumnProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const TASKS_PER_LOAD = 5;
  const { space_id } = useParams<{ space_id: string }>();
  const updatetasks = useSelector((state: RootState) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // const [showCreateModal, setShowCreateModal] = useState(false); // ✅ 생성 모달 상태 추가
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  // const [showFilterOptions, setShowFilterOptions] = useState(false);

  useEffect(() => {
    setVisibleTasks(tasks.slice(0, TASKS_PER_LOAD));
    setPage(1);
  }, [tasks]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      console.log(
        `[${status}] 스크롤 위치:`,
        scrollTop,
        clientHeight,
        scrollHeight,
      );
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore[status]) {
        console.log(`[${status}] 스크롤 끝 도달!`);
        loadMoreTasks(status);
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
      </div>

      <div className="task-list" ref={containerRef} onScroll={handleScroll}>
        {tasks.map(task => (
          <div key={task.todo_id} className="task-card" draggable>
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
      {selectedTask && (
        <TaskDetailModal
          show={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          task={selectedTask}
          onEdit={onEdit}
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
