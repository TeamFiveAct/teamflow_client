import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProjectInfo from '../components/dashboardComp/ProjectInfo';
import ToDoBoard from '../components/dashboardComp/ToDoBoard';
import { Task } from '../types/types';
import '../style/dashboard.scss';
import ChatButton from '../components/chattingComp/ChatButton';
import UserAvatar from '../components/commonComp/UserAvatar';
import { 
  fetchTasks, 
  updateTaskAsync, 
  deleteTaskAsync, 
  createTaskAsync,
  setError
} from '../store/modules/taskSlice';
import { setOnlineUsers } from '../store/modules/onlineUsersSlice';
import { RootState, AppDispatch } from '../store/store';
import axios from 'axios';
import websocketService, { WorkspaceUser } from '../services/websocketService';

// 워크스페이스 정보 타입
interface WorkspaceDetail {
  space_id: number;
  space_title: string;
  space_description: string;
  created_at: string;
  end_date: string;
}

export default function DashBoard() {
  const { space_id } = useParams<{ space_id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  // 워크스페이스 정보 가져오기
  useEffect(() => {
    const fetchWorkspaceInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}`,
          { withCredentials: true }
        );
        
        if (response.data.status === 'SUCCESS') {
          setWorkspace(response.data.data);
        } else {
          console.error('워크스페이스 정보를 불러오지 못했습니다:', response.data.message);
        }
      } catch (error) {
        console.error('워크스페이스 정보 요청 중 오류가 발생했습니다:', error);
      } finally {
        setWorkspaceLoading(false);
      }
    };

    if (space_id) {
      fetchWorkspaceInfo();
    }
  }, [space_id]);

  // WebSocket 연결 초기화
  useEffect(() => {
    if (space_id) {
      // WebSocket 서버 URL
      const wsUrl = process.env.REACT_APP_WS_SERVER || 'http://localhost:8000';
      
      // 사용자 정보 가져오기
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_SERVER}/user/info`,
            { withCredentials: true }
          );
          
          if (response.data.status === 'SUCCESS') {
            const userId = response.data.data.user_id;
            
            // WebSocket 연결 초기화
            websocketService.init(wsUrl);
            
            // 사용자 목록 변경 콜백 등록
            websocketService.setOnUsersChanged((users: WorkspaceUser[]) => {
              console.log('[DashBoard] 사용자 목록 변경:', users);
              
              // 중복 제거: userId를 기준으로 중복 사용자 제거
              const uniqueUsers = Array.from(
                new Map(users.map(user => [user.userId, user])).values()
              );
              
              // 현재 사용자 정보
              const currentUserId = userId;
              const currentUserNickname = response.data.data.nickname || `User${userId}`;
              const currentUserProfileImg = response.data.data.profile_image || `User${userId}`;
              
              // 현재 사용자가 목록에 없으면 추가
              if (!uniqueUsers.some(user => user.userId === currentUserId)) {
                const selfUser: WorkspaceUser = {
                  userId: currentUserId,
                  nickname: currentUserNickname,
                  profileImg: currentUserProfileImg
                };
                
                console.log('[DashBoard] 자신을 사용자 목록에 추가:', selfUser);
                dispatch(setOnlineUsers([...uniqueUsers, selfUser]));
              } else {
                dispatch(setOnlineUsers(uniqueUsers));
              }
            });
            
            // 워크스페이스 입장 (사용자 ID 포함)
            websocketService.joinWorkspace(Number(space_id), userId);
          } else {
            console.error('사용자 정보를 불러오지 못했습니다:', response.data.message);
          }
        } catch (error) {
          console.error('사용자 정보 요청 중 오류가 발생했습니다:', error);
        }
      };
      
      fetchUserInfo();
      
      // 컴포넌트 언마운트 시 연결 종료
      return () => {
        websocketService.leaveWorkspace();
        websocketService.disconnect();
      };
    }
  }, [space_id, dispatch]);

  // 업무 목록 가져오기
  useEffect(() => {
    if (space_id) {
      dispatch(fetchTasks(Number(space_id)));
    }
  }, [dispatch, space_id]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(setError(''));
    }
  }, [error, dispatch]);

  const handleEditTask = (task: Task) => {
    if (!space_id) return;
    
    const { todo_id, title, description, priority, state, start_date, due_date } = task;
    dispatch(updateTaskAsync({
      spaceId: Number(space_id),
      taskId: todo_id,
      updates: { title, description, priority, state, start_date, due_date }
    }));
  };

  const handleDeleteTask = (task: Task) => {
    if (!space_id) return;
    
    if (window.confirm(`"${task.title}" 할 일을 삭제하시겠습니까?`)) {
      dispatch(deleteTaskAsync({
        spaceId: Number(space_id),
        taskId: task.todo_id
      }));
    }
  };

  const handleCreateTask = (state: 'open' | 'in_progress' | 'done') => {
    // TaskModal에서 처리할 예정
    console.log(`${state} 할 일 생성`);
  };

  // 필터링 및 정렬 상태
  const [sortBy, setSortBy] = useState<'priority' | 'due_date' | 'start_date' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 필터링 및 정렬 처리
  const handleFilterTasks = useCallback((
    filterType: 'priority' | 'due_date' | 'start_date',
  ) => {
    if (sortBy === filterType) {
      // 같은 필터를 다시 선택하면 정렬 순서 변경
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // 새로운 필터 선택
      setSortBy(filterType);
      setSortOrder('asc');
    }
    
    console.log(`할 일 조회 - 기준: ${filterType}, 순서: ${sortOrder === 'asc' ? '오름차순' : '내림차순'}`);
  }, [sortBy, sortOrder]);

  // 정렬된 태스크 목록
  const sortedTasks = useCallback(() => {
    if (!sortBy || !Array.isArray(tasks)) return tasks;

    return [...tasks].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { small: 1, medium: 2, high: 3, very_high: 4 };
        const aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortBy === 'due_date' || sortBy === 'start_date') {
        const aDate = new Date(a[sortBy]).getTime();
        const bDate = new Date(b[sortBy]).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      return 0;
    });
  }, [tasks, sortBy, sortOrder]);

  if (workspaceLoading) {
    return <div className="loading">워크스페이스 정보를 불러오는 중...</div>;
  }

  if (!workspace) {
    return <div className="error">워크스페이스 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="dashboard">
      <ProjectInfo
        workspace={workspace}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(prev => !prev)}
      />
      {loading ? (
        <div className="loading">업무 목록을 불러오는 중...</div>
      ) : (
        <ToDoBoard
          tasks={Array.isArray(tasks) ? tasks : []}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onCreate={handleCreateTask}
          onFilter={handleFilterTasks}
        />
      )}
      <ChatButton />
    </div>
  );
}
