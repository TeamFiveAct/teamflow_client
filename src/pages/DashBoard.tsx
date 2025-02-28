// ///=======
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import ProjectInfo from '../components/dashboardComp/ProjectInfo';
// import MainBoard from '../components/dashboardComp/MainBoard';
// import ChatButton from '../components/chattingComp/ChatButton';
// import { WorkspaceInfo } from '../types/types';

// export default function DashBoard() {
//   const { space_id } = useParams<{ space_id: string }>();
//   const navigate = useNavigate();

//   const [workspace, setWorkSpace] = useState<WorkspaceInfo | null>(null);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isOwner, setIsOwner] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkWorkspaceAccess = async () => {
//       try {
//         // ✅ 1. 현재 로그인한 사용자의 ID 가져오기 (임시로 멤버 목록에서 찾기)
//         const membersResponse = await axios.get(
//           `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/member`,
//           { withCredentials: true },
//         );

//         let currentUserId: number | null = null;
//         if (
//           membersResponse.data.status === 'SUCCESS' &&
//           membersResponse.data.data.length > 0
//         ) {
//           currentUserId =
//             membersResponse.data.data.find(
//               (member: { user_id: number; isMe: boolean }) => member.isMe,
//             )?.user_id || null;
//         }

//         console.log(`🚀 현재 로그인한 사용자 ID: ${currentUserId}`);

//         // ✅ 2. 워크스페이스 정보 가져오기 (`workspace/:space_id`)
//         const workspaceResponse = await axios.get(
//           `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}`,
//           { withCredentials: true },
//         );

//         if (workspaceResponse.data.status === 'SUCCESS') {
//           setWorkSpace(workspaceResponse.data.data);
//           const workspaceOwnerId = workspaceResponse.data.data.user_id;
//           console.log(`🚀 워크스페이스 방장 ID: ${workspaceOwnerId}`);

//           setIsOwner(Number(workspaceOwnerId) === Number(currentUserId));
//           console.log(
//             `🎯 isOwner 설정값: ${
//               Number(workspaceOwnerId) === Number(currentUserId)
//             }`,
//           );
//         } else {
//           alert('워크스페이스 정보를 불러올 수 없습니다.');
//           navigate('/v1/mySpace');
//         }
//       } catch (error) {
//         console.error('워크스페이스 접근 검증 실패:', error);
//         alert('워크스페이스 정보를 확인할 수 없습니다.');
//         navigate('/v1/mySpace');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (space_id) {
//       checkWorkspaceAccess();
//     }
//   }, [space_id, navigate]);

//   // const checkWorkspaceAccess = async () => {
//   //   try {
//   //     // ✅ 1. 현재 로그인한 사용자의 워크스페이스 목록 가져오기
//   //     const response = await axios.get(
//   //       `${process.env.REACT_APP_API_SERVER}/workspace/user`,
//   //       { withCredentials: true },
//   //     );

//   //     if (response.data.status === 'SUCCESS') {
//   //       const userWorkspaces = response.data.data.map(
//   //         (ws: any) => ws.space_id,
//   //       );

//   //       // ✅ 2. 현재 URL의 space_id가 사용자의 워크스페이스 목록에 없으면 차단
//   //       if (!userWorkspaces.includes(Number(space_id))) {
//   //         alert('접근 권한이 없습니다.');
//   //         navigate('/v1/mySpace'); // `MySpace` 페이지로 이동
//   //         return;
//   //       }

//   //       // ✅ 3. 워크스페이스 정보 가져오기
//   //       const workspaceResponse = await axios.get(
//   //         `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}`,
//   //         { withCredentials: true },
//   //       );

//   //       if (workspaceResponse.data.status === 'SUCCESS') {
//   //         setWorkSpace(workspaceResponse.data.data);

//   //         // ✅ 4. 현재 로그인한 사용자가 워크스페이스 방장인지 확인
//   //         const currentUserId = response.data.currentUserId;
//   //         console.log(
//   //           `현재 유저 ID: ${currentUserId}, 워크스페이스 호스트 ID: ${workspaceResponse.data.data.user_id}`,
//   //         ); // 현재 로그인한 사용자 ID
//   //         setIsOwner(workspaceResponse.data.data.user_id === currentUserId);
//   //       } else {
//   //         alert('워크스페이스 정보를 불러올 수 없습니다.');
//   //         navigate('/v1/mySpace'); // `MySpace` 페이지로 이동
//   //       }
//   //     } else {
//   //       alert('세션이 만료되었습니다. 다시 로그인해주세요.');
//   //       navigate('/v1/user/login'); // 로그인 페이지로 이동
//   //     }
//   //   } catch (error) {
//   //     console.error('워크스페이스 접근 검증 실패:', error);
//   //     alert('워크스페이스 정보를 확인할 수 없습니다.');
//   //     navigate('/v1/mySpace'); // `MySpace` 페이지로 이동
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const postSpaceLeave = async () => {
//     if (!space_id) return;

//     try {
//       console.log(`🚀 워크스페이스 나가기 요청: ${space_id}`);
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/leave`,
//         {},
//         { withCredentials: true },
//       );

//       console.log('📝 워크스페이스 나가기 응답:', response.data);

//       if (response.data.status === 'SUCCESS') {
//         alert('워크스페이스에서 나갔습니다.');
//         navigate('/v1/mySpace'); // ✅ 나간 후 MySpace 페이지로 이동
//       } else {
//         alert(response.data.message || '워크스페이스 나가기에 실패했습니다.');
//       }
//     } catch (error) {
//       console.error('❌ 워크스페이스 나가기 실패:', error);
//       alert('워크스페이스 나가기 중 오류가 발생했습니다.');
//     }
//   };

//   // ✅ 🔥 워크스페이스 삭제 함수
//   const postSpaceDestroy = async () => {
//     if (!space_id) return;

//     const confirmDelete = window.confirm(
//       '정말로 워크스페이스를 삭제하시겠습니까?',
//     );
//     if (!confirmDelete) return;

//     try {
//       console.log(`🚀 워크스페이스 삭제 요청: ${space_id}`);
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/destroy`,
//         {},
//         { withCredentials: true },
//       );

//       console.log('📝 워크스페이스 삭제 응답:', response.data);

//       if (response.data.status === 'SUCCESS') {
//         alert('워크스페이스가 삭제되었습니다.');
//         navigate('/v1/mySpace'); // ✅ 삭제 후 MySpace 페이지로 이동
//       } else {
//         alert(response.data.message || '워크스페이스 삭제에 실패했습니다.');
//       }
//     } catch (error) {
//       console.error('❌ 워크스페이스 삭제 실패:', error);
//       alert('워크스페이스 삭제 중 오류가 발생했습니다.');
//     }
//   };

//   if (isLoading) {
//     return <p>워크스페이스 데이터를 불러오는 중...</p>;
//   }

//   if (isLoading) {
//     return <p>워크스페이스 데이터를 불러오는 중...</p>;
//   }

//   return (
//     <div className="dashboard">
//       {workspace ? (
//         <ProjectInfo
//           workspace={workspace}
//           isCollapsed={isCollapsed}
//           toggleCollapse={() => setIsCollapsed(prev => !prev)}
//           isOwner={isOwner}
//           postSpaceLeave={postSpaceLeave} // ✅ API 함수 전달
//           postSpaceDestroy={postSpaceDestroy} // ✅ API 함수 전달
//         />
//       ) : (
//         <p>워크스페이스 정보를 불러올 수 없습니다.</p>
//       )}

//       <MainBoard />
//       <ChatButton />
//     </div>
//   );
// }
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
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // ✅ 현재 로그인한 사용자 ID

  useEffect(() => {
    const checkWorkspaceAccess = async () => {
      try {
        let userId: number | null = null;

        // ✅ 1. 현재 로그인한 사용자의 ID 가져오기 (세션에서 확인)
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/user/info`,
          { withCredentials: true },
        );

        if (userResponse.data.status === 'SUCCESS') {
          userId = userResponse.data.data.user_id; // ✅ 로그인한 사용자 ID
          setCurrentUserId(userId);
          console.log(`🚀 현재 로그인한 사용자 ID: ${userId}`);
        } else {
          alert('세션 정보가 없습니다. 다시 로그인해주세요.');
          navigate('/v1/user/login');
          return;
        }

        // ✅ 2. 워크스페이스 정보 가져오기
        const workspaceResponse = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}`,
          { withCredentials: true },
        );

        if (workspaceResponse.data.status === 'SUCCESS') {
          setWorkSpace(workspaceResponse.data.data);
          const workspaceOwnerId = workspaceResponse.data.data.user_id; // ✅ 방장 ID
          console.log(`🚀 워크스페이스 방장 ID: ${workspaceOwnerId}`);

          // ✅ 3. 현재 로그인한 사용자와 방장 ID 비교하여 `isOwner` 설정
          setIsOwner(userId === workspaceOwnerId);
          console.log(`🎯 isOwner 설정값: ${userId === workspaceOwnerId}`);
        } else {
          alert('워크스페이스 정보를 불러올 수 없습니다.');
          navigate('/v1/mySpace');
        }
      } catch (error) {
        console.error('워크스페이스 접근 검증 실패:', error);
        alert('워크스페이스 정보를 확인할 수 없습니다.');
        navigate('/v1/mySpace');
      } finally {
        setIsLoading(false);
      }
    };

    if (space_id) {
      checkWorkspaceAccess();
    }
  }, [space_id, navigate]);

  // ✅ 🚀 워크스페이스 나가기 함수
  const postSpaceLeave = async () => {
    if (!space_id) return;

    try {
      console.log(`🚀 워크스페이스 나가기 요청: ${space_id}`);
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/leave`,
        {},
        { withCredentials: true },
      );

      console.log('📝 워크스페이스 나가기 응답:', response.data);

      if (response.data.status === 'SUCCESS') {
        alert('워크스페이스에서 나갔습니다.');
        navigate('/v1/mySpace'); // ✅ 나간 후 MySpace 페이지로 이동
      } else {
        alert(response.data.message || '워크스페이스 나가기에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 워크스페이스 나가기 실패:', error);
      alert('워크스페이스 나가기 중 오류가 발생했습니다.');
    }
  };

  // ✅ 🔥 워크스페이스 삭제 함수
  const postSpaceDestroy = async () => {
    if (!space_id) return;

    const confirmDelete = window.confirm(
      '정말로 워크스페이스를 삭제하시겠습니까?',
    );
    if (!confirmDelete) return;

    try {
      console.log(`🚀 워크스페이스 삭제 요청: ${space_id}`);
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/destroy`,
        {},
        { withCredentials: true },
      );

      console.log('📝 워크스페이스 삭제 응답:', response.data);

      if (response.data.status === 'SUCCESS') {
        alert('워크스페이스가 삭제되었습니다.');
        navigate('/v1/mySpace'); // ✅ 삭제 후 MySpace 페이지로 이동
      } else {
        alert(response.data.message || '워크스페이스 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 워크스페이스 삭제 실패:', error);
      alert('워크스페이스 삭제 중 오류가 발생했습니다.');
    }
  };

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
          isOwner={isOwner} // ✅ 방장 여부 전달
          postSpaceLeave={postSpaceLeave} // ✅ API 함수 전달
          postSpaceDestroy={postSpaceDestroy} // ✅ API 함수 전달
        />
      ) : (
        <p>워크스페이스 정보를 불러올 수 없습니다.</p>
      )}

      <MainBoard />
      <ChatButton />
    </div>
  );
}
