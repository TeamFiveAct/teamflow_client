import React, { useEffect, useState } from 'react';
import ProjectInfo from '../components/dashboardComp/ProjectInfo';
import ToDoBoard from '../components/dashboardComp/ToDoBoard';
import { Task, WorkspaceInfo } from '../types/types';
// import '../style/dashboard.scss';
// import ChatButton from '../components/chattingComp/ChatButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChatButton from '../components/chattingComp/ChatButton';

const getWorkspaceInfo = async (space_id: string | undefined) => {
  if (!space_id) return null;
  // import { Task } from '../types/types';
  // import '../style/dashboard/dashboard.scss';
  // import ChatButton from '../components/chatcomp/ChatButton';

  // // ✅ 예제 데이터 추가
  // const dummyTasks: Task[] = [
  //   {
  //     todo_id: 1,
  //     title: 'UI 디자인 개선',
  //     description: '메인 페이지 UI 변경',
  //     priority: 'high',
  //     state: 'open',
  //     start_date: '2024-02-10',
  //     due_date: '2024-02-20',
  //   },
  //   {
  //     todo_id: 2,
  //     title: 'API 연결',
  //     description: '백엔드 API 연동',
  //     priority: 'medium',
  //     state: 'in_progress',
  //     start_date: '2024-02-11',
  //     due_date: '2024-02-21',
  //   },
  //   {
  //     todo_id: 3,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'done',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 4,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'done',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 5,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'done',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 6,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'in_progress',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 7,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'in_progress',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 8,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'in_progress',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 9,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'done',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 10,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'done',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  //   {
  //     todo_id: 11,
  //     title: '리팩토링',
  //     description: '코드 정리',
  //     priority: 'small',
  //     state: 'in_progress',
  //     start_date: '2024-02-12',
  //     due_date: '2024-02-22',
  //   },
  // ];

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}`,
      { withCredentials: true },
    );
    console.log('REACT_APP_API_SERVER::', process.env.REACT_APP_API_SERVER);
    console.log('responsedata::', response.data);
    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      console.error('워크스페이스 조회 실패:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('워크스페이스 조회에 실패하였습니다.', error);
    return null;
  }
};

const getWorkSpaceDataList = async (space_id: string | undefined) => {
  if (!space_id) return { plan: [], progress: [], done: [] };

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos`,
      {},
      { withCredentials: true },
    );
    console.log('post전체업무 조회', response.data);
    if (response.data.status === 'SUCCESS') {
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

// 방장 여부 (임시로 true로 설정)
const isOwner = true;

// 워크스페이스 나가기
const handleLeaveWorkspace = () => {
  alert('워크스페이스를 나갔습니다.');
};

// 워크스페이스 삭제
const handleDeleteWorkspace = () => {
  alert('워크스페이스를 삭제했습니다.');
};
export default function DashBoard() {
  const { space_id } = useParams<{ space_id: string }>();
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [todoList, setTodoList] = useState<{
    plan: Task[];
    progress: Task[];
    done: Task[];
  }>({ plan: [], progress: [], done: [] });
  const [isCollapsed, setIsCollapsed] = useState(false);
  // console.log('REACT_APP_API_SERVER::', process.env.REACT_APP_API_SERVER);
  // console.log(space_id);

  useEffect(() => {
    const loadWorkSpaceInfoData = async () => {
      const workspaceData = await getWorkspaceInfo(space_id);
      setWorkspace(workspaceData);
    };

    const loadWorkSpaceDataList = async () => {
      const ListData = await getWorkSpaceDataList(space_id);
      if (ListData) {
        setTodoList(ListData);
      }
    };

    loadWorkSpaceInfoData();
    loadWorkSpaceDataList();
  }, [space_id]);

  const handleEditTask = (task: Task) => {
    console.log('수정 버튼 클릭:', task);
  };

  const handleDeleteTask = (task: Task) => {
    console.log('삭제 버튼 클릭:', task);
    if (window.confirm(`"${task.title}" 할 일을 삭제하시겠습니까?`)) {
      console.log('삭제됨');
    }
  };

  // const handleCreateTask = (state: 'plan' | 'progress' | 'done') => {
  //   console.log(`${state} 할 일 생성`);
  // };

  // const handleFilterTasks = (
  //   filterType: 'priority' | 'due_date' | 'start_date',
  // ) => {
  //   console.log(`할 일 조회 - 기준: ${filterType}`);
  // };

  if (!workspace) return <div>로딩 중...</div>;

  return (
    <div className="dashboard">
      <ProjectInfo
        workspace={workspace}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(prev => !prev)}
        isOwner={isOwner}
        onLeaveWorkspace={handleLeaveWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
      />
      <ToDoBoard
        tasksPlan={todoList.plan}
        tasksProgress={todoList.progress}
        tasksDone={todoList.done}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
      <ChatButton />
    </div>
  );
}

// ✅ 예제 데이터 추가
// const dummyTasks: Task[] = [
//   {
//     todo_id: 1,
//     title: 'UI 디자인 개선',
//     description: '메인 페이지 UI 변경',
//     priority: 'high',
//     state: 'open',
//     start_date: '2024-02-10',
//     due_date: '2024-02-20',
//   },
//   {
//     todo_id: 2,
//     title: 'API 연결',
//     description: '백엔드 API 연동',
//     priority: 'medium',
//     state: 'in_progress',
//     start_date: '2024-02-11',
//     due_date: '2024-02-21',
//   },
//   {
//     todo_id: 3,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'done',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 4,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'done',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 5,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'done',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 6,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'in_progress',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 7,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'in_progress',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 8,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'in_progress',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 9,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'in_progress',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 10,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'in_progress',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
//   {
//     todo_id: 11,
//     title: '리팩토링',
//     description: '코드 정리',
//     priority: 'small',
//     state: 'in_progress',
//     start_date: '2024-02-12',
//     due_date: '2024-02-22',
//   },
// ];

// // ✅ 예제 워크스페이스 정보
// const dummyWorkspace = {
//   space_id: 1,
//   space_title: 'Team Project',
//   space_description: '이 프로젝트는 팀 협업을 위한 작업 관리 시스템입니다.',
//   created_at: '2024-02-01',
//   end_date: '2024-06-01',
// };
// const getTodoList = async () => {
//   try {
//     const getAllTodos = await axios.get(
//       `${process.env.REACT_APP_API_SERVER}/todos`,
//       { withCredentials: true },
//     );
//     if (getAllTodos.data.status === 'SUCCESS') {
//     }
//   } catch (error) {
//     console.log("'전체 업무조회에 실패하였습니다.'", error);
//   }
// };

// export default function DashBoard() {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const handleEditTask = (task: Task) => {
//     console.log('수정 버튼 클릭:', task);
//   };

//   const handleDeleteTask = (task: Task) => {
//     console.log('삭제 버튼 클릭:', task);
//     if (window.confirm(`"${task.title}" 할 일을 삭제하시겠습니까?`)) {
//       console.log('삭제됨');
//     }
//   };

//   const handleCreateTask = (state: 'open' | 'in_progress' | 'done') => {
//     console.log(`${state} 할 일 생성`);
//   };

//   const handleFilterTasks = (
//     filterType: 'priority' | 'due_date' | 'start_date',
//   ) => {
//     console.log(`할 일 조회 - 기준: ${filterType}`);
//   };

//   return (
//     <div className="dashboard">
//       <ProjectInfo
//         workspace={}
//         isCollapsed={isCollapsed}
//         toggleCollapse={() => setIsCollapsed(prev => !prev)}
//       />
//       <ToDoBoard
//         tasks={}
//         onEdit={handleEditTask}
//         onDelete={handleDeleteTask}
//         onCreate={handleCreateTask}
//         onFilter={handleFilterTasks}
//       />
//       <ChatButton /> {/* ✅ Chat 버튼 추가 */}
//     </div>
//   );
// }
// const getTodoList = async () => {
//   try {
//     const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/todos`, { withCredentials: true });
//     if (response.data.status === "SUCCESS") {
//       return response.data.data; // API에서 받은 할 일 목록
//     } else {
//       console.log('업무 조회 실패:', response.data.message);
//       return [];
//     }
//   } catch (error) {
//     console.error('전체 업무조회에 실패하였습니다.', error);
//     return [];
//   }
// };
