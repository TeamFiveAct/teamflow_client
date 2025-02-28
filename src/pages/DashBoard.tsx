///=======
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProjectInfo from '../components/dashboardComp/ProjectInfo';
import MainBoard from '../components/dashboardComp/MainBoard';
import ChatButton from '../components/chattingComp/ChatButton';
import { WorkspaceInfo } from '../types/types';

export default function DashBoard() {
  const { space_id } = useParams<{ space_id: string }>();
  const navigate = useNavigate();

  const [workspace, setWorkSpace] = useState<WorkspaceInfo | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWorkspaceAccess = async () => {
      try {
        // ✅ 1. 현재 로그인한 사용자의 워크스페이스 목록 가져오기
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/workspace/user`,
          { withCredentials: true },
        );

        if (response.data.status === 'SUCCESS') {
          const userWorkspaces = response.data.data.map(
            (ws: any) => ws.space_id,
          );

          // ✅ 2. 현재 URL의 space_id가 사용자의 워크스페이스 목록에 없으면 차단
          if (!userWorkspaces.includes(Number(space_id))) {
            alert('접근 권한이 없습니다.');
            navigate('/v1/mySpace'); // `MySpace` 페이지로 이동
            return;
          }

          // ✅ 3. 워크스페이스 정보 가져오기
          const workspaceResponse = await axios.get(
            `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}`,
            { withCredentials: true },
          );

          if (workspaceResponse.data.status === 'SUCCESS') {
            setWorkSpace(workspaceResponse.data.data);

            // ✅ 4. 현재 로그인한 사용자가 워크스페이스 방장인지 확인
            const currentUserId = response.data.currentUserId; // 현재 로그인한 사용자 ID
            setIsOwner(workspaceResponse.data.data.user_id === currentUserId);
          } else {
            alert('워크스페이스 정보를 불러올 수 없습니다.');
            navigate('/v1/mySpace'); // `MySpace` 페이지로 이동
          }
        } else {
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/v1/user/login'); // 로그인 페이지로 이동
        }
      } catch (error) {
        console.error('워크스페이스 접근 검증 실패:', error);
        alert('워크스페이스 정보를 확인할 수 없습니다.');
        navigate('/v1/mySpace'); // `MySpace` 페이지로 이동
      } finally {
        setIsLoading(false);
      }
    };

    if (space_id) {
      checkWorkspaceAccess();
    }
  }, [space_id, navigate]);

  if (isLoading) {
    return <p>워크스페이스 데이터를 불러오는 중...</p>;
  }

  return (
    <div className="dashboard">
      {workspace ? (
        <ProjectInfo
          workspace={workspace}
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(prev => !prev)}
          isOwner={isOwner}
          postSpaceLeave={() => alert('워크스페이스를 나갔습니다.')}
          postSpaceDestroy={() => alert('워크스페이스를 삭제했습니다.')}
        />
      ) : (
        <p>워크스페이스 정보를 불러올 수 없습니다.</p>
      )}
      <MainBoard />
      <ChatButton />
    </div>
  );
}
