import React, { useEffect, useState } from 'react';
import ProjectInfo from '../components/dashboardComp/ProjectInfo';
import ToDoBoard from '../components/dashboardComp/ToDoBoard';
import { Task, WorkspaceInfo } from '../types/types';

// import '../style/dashboard.scss';
// import ChatButton from '../components/chattingComp/ChatButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChatButton from '../components/chattingComp/ChatButton';
import TaskModal from '../components/dashboardComp/TaskModal';
import { keyframes } from 'styled-components';
import MainBoard from '../components/dashboardComp/MainBoard';

const getWorkspaceInfo = async (space_id: string | undefined) => {
  if (!space_id) return null;

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}`,
      { withCredentials: true },
    );
    // console.log('REACT_APP_API_SERVER::', process.env.REACT_APP_API_SERVER);
    console.log('responsedata::', response.data);
    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      console.error('워크스페이스 조회 실패:', response.data.message);
      return response.data.data;
    }
  } catch (error) {
    console.error('워크스페이스 조회에 실패하였습니다.', error);
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

  // const [filteredTasks, setFilteredTasks] = useState<{
  //   plan: Task[];
  //   progress: Task[];
  //   done: Task[];
  // }>;

  const [workspace, setWorkSpace] = useState<WorkspaceInfo | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // console.log('REACT_APP_API_SERVER::', process.env.REACT_APP_API_SERVER);
  // console.log(space_id);
  console.log(
    `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/todos`,
  );
  useEffect(() => {
    const loadWorkSpaceInfoData = async () => {
      const workspaceData = await getWorkspaceInfo(space_id);
      setWorkSpace(workspaceData);
    };

    loadWorkSpaceInfoData();
  }, [space_id]);

  // Log the workspace state after render
  // useEffect(() => {
  //   console.log('workspace state after render:', workspace);
  // }, [workspace]);
  // useEffect(() => {
  //   const loadWorkSpaceInfoData = async () => {
  //     const workspaceData = await getWorkspaceInfo(space_id);
  //     setWorkspace(workspaceData);
  //   };

  //   const loadWorkSpaceDataList = async () => {
  //     const ListData = await getWorkSpaceDataList(space_id);
  //     setTodoList(ListData);
  //   };

  //   loadWorkSpaceInfoData();
  //   loadWorkSpaceDataList();
  // }, [space_id]);

  // const handleCreateTask = (state: 'plan' | 'progress' | 'done') => {
  //   console.log(`${state} 할 일 생성`);
  // };

  // const handleFilterTasks = (
  //   filterType: 'priority' | 'due_date' | 'start_date',
  // ) => {
  //   console.log(`할 일 조회 - 기준: ${filterType}`);
  // };

  // if (!workspace || !todoList || !todoList.plan.length)
  //   return <div>로딩 중...</div>;
  // if (
  //   !todoList.plan.length &&
  //   !todoList.progress.length &&
  //   !todoList.done.length
  // ) {
  //   return <div>현재 할 일이 없습니다.</div>; // todoList가 비었을 때 보여줄 메시지
  // }
  return (
    <div className="dashboard">
      {workspace === null ? (
        <p>워크스페이스 데이터를 불러오는 중...</p>
      ) : (
        <ProjectInfo
          workspace={workspace}
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(prev => !prev)}
          isOwner={isOwner}
          onLeaveWorkspace={handleLeaveWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
        />
      )}
      <MainBoard />
      <ChatButton />
    </div>
  );
}
