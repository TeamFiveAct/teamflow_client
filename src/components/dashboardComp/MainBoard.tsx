import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TaskModal from './TaskModal';
import ToDoBoard from './ToDoBoard';
import { AppDispatch, RootState } from '../../store/store';
// import { updateTask, loadMoreTasks } from '../../store/modules/taskSlice';
import { Task } from '../../types/types';
import {
  createTaskAsync,
  deleteTaskAsync,
  updateTaskAsync,
} from '../../store/modules/taskSlice';
// import { deleteTask, moveTaskAsync } from '../../store/modules/taskSlice';
type TodoList = {
  plan: Task[];
  progress: Task[];
  done: Task[];
};

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
      console.log('가져온 데이터 확인::', response.data.data);
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
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [isOpen, setIsOpen] = useState(false); // 모달 상태 관리
  // const handleDragEnd = (
  //   todo_id: number,
  //   newState: 'plan' | 'progress' | 'done',
  // ) => {
  //   dispatch(
  //     moveTaskAsync({ todo_id, newState } as {
  //       todo_id: number;
  //       newState: 'plan' | 'progress' | 'done';
  //     }),
  //   );
  // };

  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //-------scrolling----------

  const [page, setPage] = useState<{
    plan: number;
    progress: number;
    done: number;
  }>({ plan: 0, progress: 0, done: 0 });

  const [hasMore, setHasMore] = useState<{
    plan: boolean;
    progress: boolean;
    done: boolean;
  }>({ plan: true, progress: true, done: true });

  //-------scrolling----------
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
        { state: filterType, limit: 100, offset: 0 },
        { withCredentials: true },
      );
      if (response.data.status === 'SUCCESS') {
        // dispatch(loadTasksAsync(response.data.data));
        console.log(response.data);
      }
    } catch (error) {
      console.error('서버 요청 중 오류 발생:', error);
    }
  };

  const handleCreateTask = async (newTaskData: {
    space_id?: string;
    todo_id?: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'plan' | 'progress' | 'done';
    startDate: string;
    dueDate: string | null;
  }) => {
    // Task 타입에 맞게 변환
    const newTask = {
      // space_id: space_id,
      todo_id: 0, // 서버에서 생성된 ID로 대체됨
      title: newTaskData.title,
      description: newTaskData.description,
      priority: newTaskData.priority,
      status: newTaskData.status, // taskState를 status로 변경
      start_date: newTaskData.startDate,
      due_date: newTaskData.dueDate || 'none',
    };

    // // space_id를 함께 전달하여 작업을 생성
    if (space_id) {
      try {
        if (isSubmitting) return; // 이미 제출 중이면 함수 종료
        setIsSubmitting(true); // 제출 시작
        // 서버에 요청 보내고 응답을 기다림
        const response = await dispatch(
          createTaskAsync({ spaceId: space_id, newTask: newTask }),
        ).unwrap();
        console.log('createTaskAsync response:', response);

        // 응답에서 받은 데이터로 생성된 투두 추가
        const createdTask = response; // 이미 반환된 데이터는 createdTask
        setTodoList(prev => ({
          ...prev,
          plan:
            createdTask.status === 'plan'
              ? [...(prev.plan || []), createdTask]
              : prev.plan || [],
          progress:
            createdTask.status === 'progress'
              ? [...(prev.progress || []), createdTask]
              : prev.progress || [],
          done:
            createdTask.status === 'done'
              ? [...(prev.done || []), createdTask]
              : prev.done || [],
        }));
      } catch (error) {
        console.error('Error creating task:', error);
      } finally {
        setIsSubmitting(false); // 제출 끝났으면 상태 변경
      }
    }
    // space_id를 함께 전달하여 작업을 생성
    // if (space_id) {
    //   dispatch(createTaskAsync({ spaceId: space_id, newTask: newTask })); // Slice에서 space_id를 처리하도록 수정
    // }

    // setTodoList(prev => ({
    //   ...prev,
    //   plan: [...prev.plan, newTask], // 새로 생성된 투두는 plan 상태에 추가
    //   // progress: [...prev.progress, newTask], // 새로 생성된 투두는 progress 상태에 추가
    //   // done: [...prev.done, newTask], // 새로 생성된 투두는 done 상태에 추가
    // }));
    // // dispatch(loadTasksAsync([...tasks, newTask])); // 새 작업을 상태에 추가
  };

  // Task 수정 함수 (추가)
  const handleEditTask = async (updatedTaskData: {
    space_id?: string;
    todo_id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'plan' | 'progress' | 'done';
    start_date: string;
    due_date: string | null;
  }) => {
    const updatedTasks = {
      // space_id: space_id,
      todo_id: updatedTaskData.todo_id, // 서버에서 생성된 ID로 대체됨
      title: updatedTaskData.title,
      description: updatedTaskData.description,
      priority: updatedTaskData.priority,
      status: updatedTaskData.status, // taskState를 status로 변경
      start_date: updatedTaskData.start_date,
      due_date: updatedTaskData.due_date || 'none',
    };
    try {
      const spaceId = space_id;
      // const updatedTask = updatedTaskData;
      // console.log('updatedTask::', task);
      console.log('updatedTask::', updatedTasks);
      console.log('updatedTask::', spaceId);

      if (!spaceId) {
        alert('Space ID가 유효하지 않습니다.');
        return;
      }

      const actionResult = await dispatch(
        updateTaskAsync({ spaceId: spaceId, updatedTask: updatedTasks }),
      ).unwrap();

      console.log('업데이트된 데이터:', actionResult);

      // 상태에 맞게 todoList 업데이트
      setTodoList((prevTodoList: TodoList) => {
        const updatedList: TodoList = { ...prevTodoList };

        // 해당 상태(TaskColumn) 내에서 수정된 task를 반영
        updatedList[actionResult.data.status as keyof TodoList] = updatedList[
          actionResult.data.status as keyof TodoList
        ].map((task: Task) =>
          task.todo_id === actionResult.data.todo_id ? actionResult : task,
        );

        // 상태 변경 후 해당 상태(TaskColumn으로 이동)
        if (actionResult.data.status !== updatedTaskData.status) {
          updatedList[updatedTaskData.status as keyof TodoList] = updatedList[
            updatedTaskData.status as keyof TodoList
          ].filter((task: Task) => task.todo_id !== actionResult.data.todo_id);

          updatedList[actionResult.data.status as keyof TodoList] = [
            ...updatedList[actionResult.data.status as keyof TodoList],
            actionResult,
          ];
        }

        return updatedList;
      });
      // 데이터를 최신 상태로 갱신하기 위해 getWorkSpaceDataList 호출
      const ListData = await getWorkSpaceDataList(space_id);
      if (ListData) {
        setTodoList(ListData); // 최신 데이터를 업데이트
      }
      return true;
    } catch (error) {
      console.error('업무 수정에 실패했습니다:', error);
      alert('업무 수정에 실패했습니다.');
      return false;
    }
  };
  // const handleSave = async (task: Task) => {
  //   try {
  //     const spaceId = task.space_id; // task에서 space_id 추출
  //     const updatedTask = task; // task 자체를 updatedTask로 사용

  //     if (!spaceId) {
  //       alert('Space ID가 유효하지 않습니다.');
  //       return; // spaceId가 없으면 작업을 진행하지 않음
  //     }
  //     const actionResult = await dispatch(
  //       updateTaskAsync({ spaceId, updatedTask }),
  //     );
  //     console.log('actionResult라는 수정콘솔::', actionResult);
  //     if (updateTaskAsync.fulfilled.match(actionResult)) {
  //       // 서버에서 수정된 데이터가 성공적으로 반환된 경우
  //       const updatedTaskData = actionResult.payload;

  //       // 상태에 맞게 todoList 업데이트
  //       setTodoList((prevTodoList: TodoList) => {
  //         const updatedList: TodoList = { ...prevTodoList };

  //         // 해당 상태(TaskColumn) 내에서 수정된 task를 반영
  //         updatedList[updatedTaskData.status as keyof TodoList] = updatedList[
  //           updatedTaskData.status as keyof TodoList
  //         ].map((task: Task) =>
  //           task.todo_id === updatedTaskData.todo_id ? updatedTaskData : task,
  //         );

  //         // 상태가 변경된 경우, 상태 변경 후 해당 상태(TaskColumn으로 이동)
  //         if (updatedTaskData.status !== task.status) {
  //           // 상태 변경 후 이동 (예: plan -> progress)
  //           updatedList[task.status as keyof TodoList] = updatedList[
  //             task.status as keyof TodoList
  //           ].filter((task: Task) => task.todo_id !== updatedTaskData.todo_id);

  //           updatedList[updatedTaskData.status as keyof TodoList] = [
  //             ...updatedList[updatedTaskData.status as keyof TodoList],
  //             updatedTaskData,
  //           ];
  //         }

  //         return updatedList;
  //       });
  //     } else {
  //       alert('업무 수정에 실패했습니다.');
  //     }
  //   } catch (error) {
  //     console.error('Error updating task:', error);
  //     alert('업무 수정에 실패했습니다.');
  //   }
  // };

  // const handleTaskEdit = (task: Task) => {
  //   // 예시: 투두 수정을 위한 Modal을 띄운 후 수정된 내용을 받아오고 handleEditTask 호출
  //   handleEditTask(task.todo_id, { ...task, title: '수정된 제목' }); // 예시 수정
  // };

  // const handleDeleteTask = async (task: Task) => {
  //   try {
  //     alert('이 업무내용을 삭제하시겠습니까?');
  //     // 서버에 삭제 요청
  //     const response = await axios.delete(
  //       `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/${task.todo_id}`,
  //       { withCredentials: true },
  //     );
  //     console.log('delete버튼의 콘솔::', response.data);
  //     if (response.data.status === 'SUCCESS') {
  //       // 서버에서 성공적으로 삭제되면 상태에서 바로 삭제
  //       dispatch(deleteTaskAsync(task.todo_id));

  //       setTodoList(prev => ({
  //         plan: prev.plan.filter(item => item.todo_id !== task.todo_id),
  //         progress: prev.progress.filter(item => item.todo_id !== task.todo_id),
  //         done: prev.done.filter(item => item.todo_id !== task.todo_id),
  //       }));
  //     } else {
  //       console.error('업무 삭제 실패:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('업무 삭제 중 오류 발생:', error);
  //   }
  // };
  const handleDeleteTask = async (task: Task) => {
    try {
      alert('이 업무내용을 삭제하시겠습니까?');
      // if (space_id) {
      //   dispatch(deleteTaskAsync({ space_id, taskId }));
      // } else {
      //   console.error('space_id가 없습니다.');
      // }
      if (space_id) {
        // dispatch(deleteTaskAsync({ spaceId: space_id, taskId: task.todo_id })); // Slice에서 space_id를 처리하도록 수정
        const response = await dispatch(
          deleteTaskAsync({ spaceId: space_id, taskId: task.todo_id }),
        ).unwrap(); // ✅ unwrap() 사용

        if (response === task.todo_id) {
          // 성공하면
          setTodoList(prev => ({
            plan: prev.plan.filter(item => item.todo_id !== task.todo_id),
            progress: prev.progress.filter(
              item => item.todo_id !== task.todo_id,
            ),
            done: prev.done.filter(item => item.todo_id !== task.todo_id),
          }));
        }
      }
    } catch (error) {
      console.error('업무 삭제 중 오류 발생:', error);
    }
  };

  //------------scrolling--------------

  useEffect(() => {
    const loadInitialData = async () => {
      const ListData = await getWorkSpaceDataList(space_id);
      if (ListData) {
        setTodoList(ListData);
      }
    };
    loadInitialData();
  }, [space_id]);

  const loadMoreTasks = async (status: 'plan' | 'progress' | 'done') => {
    if (!hasMore[status]) return; // 가져올 데이터가 없으면 종료
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
        { state: status, limit: 5, offset: page[status] * 5 },
        { withCredentials: true },
      );
      console.log(`[${status}] 추가 데이터 응답:`, response.data);
      if (response.data.status === 'SUCCESS' && response.data.data.length > 0) {
        setTodoList(prev => ({
          ...prev,
          [status]: [...prev[status], ...response.data.data],
        }));
        setPage(prev => ({ ...prev, [status]: prev[status] + 1 })); // 페이지 증가
      } else {
        console.log(`[${status}] 추가 데이터 없음. 더 이상 불러오지 않음.`);
        setHasMore(prev => ({ ...prev, [status]: false })); // 더 이상 데이터 없음
      }
    } catch (error) {
      console.error('추가 업무 로드 실패:', error);
    }
  };

  //------scrolling----------
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
  }, [space_id, dispatch]);
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
          // taskState="plan"
          onCreate={handleCreateTask}
        />
      </div>
      <ToDoBoard
        tasksPlan={todoList.plan} // todoList를 사용하도록 수정
        tasksProgress={todoList.progress}
        tasksDone={todoList.done}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        loadMoreTasks={loadMoreTasks} // ✅ 추가
        hasMore={hasMore} // ✅ 추
      />
      {/* <ToDoBoard
        tasksPlan={tasks.filter(task => task.status === 'plan')}
        tasksProgress={tasks.filter(task => task.status === 'progress')}
        tasksDone={tasks.filter(task => task.status === 'done')}
        // onDragEnd={handleDragEnd} // 드래그 앤 드랍 처리
      /> */}
    </>
  );
}

// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import TaskModal from './TaskModal';
// import ToDoBoard from './ToDoBoard';
// import { RootState } from '../../store/store';
// import { updateTasks, loadMoreTasks } from '../../store/taskSlice';
// import { Task } from '../../types/types';

// const TASKS_PER_LOAD = 5; // 한 번에 불러올 업무 개수

// export default function MainBoard() {
//   const { space_id } = useParams<{ space_id: string }>();
//   const dispatch = useDispatch();
//   const tasks = useSelector((state: RootState) => state.tasks);

//   const [currentFilter, setCurrentFilter] = useState<string | null>(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showFilterOptions, setShowFilterOptions] = useState(false);
//   const [offsets, setOffsets] = useState({ plan: 0, progress: 0, done: 0 });

//   // ✅ 전체 업무 리스트 가져오기
//   const fetchTaskList = async () => {
//     if (!space_id) return;
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos`,
//         {},
//         { withCredentials: true },
//       );
//       if (response.data.status === 'SUCCESS' && response.data.data) {
//         dispatch(updateTasks(response.data.data)); // Redux 상태 업데이트
//       }
//     } catch (error) {
//       console.error('전체 업무 조회 오류:', error);
//     }
//   };

//   // ✅ 특정 상태별 업무 리스트 추가 로드 (무한 스크롤)
//   const loadMore = async (status: 'plan' | 'progress' | 'done') => {
//     if (!space_id) return;
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
//         { state: status, limit: TASKS_PER_LOAD, offset: offsets[status] },
//         { withCredentials: true },
//       );
//       if (response.data.status === 'SUCCESS') {
//         dispatch(loadMoreTasks({ status, newTasks: response.data.data }));
//         setOffsets(prev => ({
//           ...prev,
//           [status]: prev[status] + TASKS_PER_LOAD,
//         }));
//       }
//     } catch (error) {
//       console.error('추가 업무 로드 오류:', error);
//     }
//   };

//   // ✅ 필터링된 업무 리스트 가져오기
//   const handleFilter = async (
//     filterType: 'priority' | 'due_date' | 'start_date',
//   ) => {
//     if (!space_id) return;
//     try {
//       setCurrentFilter(filterType);
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos/statelodeed`,
//         { state: filterType, limit: 100, offset: 0 },
//         { withCredentials: true },
//       );
//       if (response.data.status === 'SUCCESS') {
//         dispatch(updateTasks(response.data.data));
//       }
//     } catch (error) {
//       console.error('필터링 오류:', error);
//     }
//   };

//   const handleCreateTask = (newTaskData: {
//     title: string;
//     description: string;
//     priority: 'low' | 'medium' | 'high';
//     startDate: string;
//     dueDate: string | null;
//     taskState: 'plan' | 'progress' | 'done';
//   }) => {
//     // Task 타입에 맞게 변환
//     const newTask: Task = {
//       todo_id: 0, // 서버에서 생성된 ID로 대체됨
//       title: newTaskData.title,
//       description: newTaskData.description,
//       priority: newTaskData.priority,
//       status: newTaskData.taskState, // taskState를 status로 변경
//       start_date: newTaskData.startDate,
//       due_date: newTaskData.dueDate || 'none',
//     };

//     // setTodoList(prev => ({
//     //   ...prev,
//     //   plan: [...prev.plan, newTask], // 새로 생성된 투두는 plan 상태에 추가
//     //   // progress: [...prev.progress, newTask], // 새로 생성된 투두는 progress 상태에 추가
//     //   // done: [...prev.done, newTask], // 새로 생성된 투두는 done 상태에 추가
//     // }));
//   };

//   useEffect(() => {
//     fetchTaskList(); // 공간 변경 시 전체 리스트 다시 가져오기
//   }, [space_id, dispatch]);

//   return (
//     <>
//       <div className="task-actions">
//         <button
//           className="btn btn-sm btn-primary"
//           onClick={() => setShowCreateModal(true)}
//         >
//           + 생성
//         </button>
//         <div className="filter-container">
//           <button
//             className="btn btn-sm btn-secondary filter-btn"
//             onClick={() => setShowFilterOptions(!showFilterOptions)}
//           >
//             🔍 조회
//           </button>
//           {showFilterOptions && (
//             <div className="filter-options">
//               <button onClick={() => handleFilter('priority')}>우선순위</button>
//               <button onClick={() => handleFilter('due_date')}>마감일</button>
//               <button onClick={() => handleFilter('start_date')}>시작일</button>
//             </div>
//           )}
//         </div>
//         <TaskModal
//           show={showCreateModal}
//           onHide={() => setShowCreateModal(false)}
//           taskState="plan"
//           onCreate={handleCreateTask}
//         />
//       </div>
//       <ToDoBoard
//         tasksPlan={tasks.plan}
//         tasksProgress={tasks.progress}
//         tasksDone={tasks.done}
//         onLoadMore={loadMore} // 스크롤링 시 추가 로드
//       />
//     </>
//   );
// }
