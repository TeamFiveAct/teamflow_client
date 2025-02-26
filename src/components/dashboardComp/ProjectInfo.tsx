// //--------------------------------------

// import React, { useState, useEffect } from 'react';
// import {
//   FaChevronUp,
//   FaChevronDown,
//   FaTrash,
//   FaSignOutAlt,
//   FaChevronRight,
//   FaChevronLeft,
// } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import '../../style/dashboard/ProjectInfo.scss';
// import { WorkspaceInfo, ProjectInfoProps } from '../../types/types';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// export default function ProjectInfo({
//   workspace,
//   isCollapsed,
//   toggleCollapse,
//   onLeaveWorkspace,
//   onDeleteWorkspace,
// }: ProjectInfoProps) {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState<any[]>([]); // 참여자 목록
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null); // 현재 로그인한 유저 ID
//   const [isOwner, setIsOwner] = useState<boolean>(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const { space_id } = useParams<{ space_id: string }>();

//   const usersPerPage = 3;

//   // ✅ 현재 로그인한 사용자 정보 가져오기
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_SERVER}/user/info`,
//           {
//             withCredentials: true,
//           },
//         );

//         if (response.data.status === 'SUCCESS') {
//           const userId = response.data.data.user_id;
//           setCurrentUserId(userId);
//           console.log('현재 로그인한 유저 ID:', userId);
//         } else {
//           console.error('현재 사용자 정보를 불러오지 못했습니다.');
//         }
//       } catch (error) {
//         console.error('현재 사용자 정보 조회 중 오류 발생', error);
//       }
//     };

//     fetchCurrentUser();
//   }, []);

//   // ✅ 워크스페이스 소유자 확인
//   useEffect(() => {
//     if (workspace && currentUserId !== null) {
//       console.log('워크스페이스 생성자 ID:', workspace.user_id);
//       console.log('현재 로그인한 유저 ID:', currentUserId);

//       // 정확한 비교를 위해 Number 변환 적용
//       setIsOwner(Number(workspace.user_id) === Number(currentUserId));
//     }
//   }, [workspace, currentUserId]);

//   // ✅ 워크스페이스 멤버 가져오기
//   useEffect(() => {
//     const fetchWorkspaceMembers = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/member`,
//           { withCredentials: true },
//         );

//         if (response.data.status === 'SUCCESS') {
//           setUsers(response.data.data || []);
//         } else {
//           alert(`${response.data.message}, 참여자 목록을 불러오지 못했습니다.`);
//         }
//       } catch (error) {
//         console.error('워크스페이스 참여자 조회 중 오류 발생', error);
//         alert('참여자 목록을 불러오는 데 실패했습니다.');
//       }
//     };

//     if (space_id) {
//       fetchWorkspaceMembers();
//     }
//   }, [space_id]);

//   // ✅ 이전 페이지로 유저 리스트 이동
//   const handlePrev = () => {
//     setCurrentIndex(prev => Math.max(0, prev - 1));
//   };

//   // ✅ 다음 페이지로 유저 리스트 이동
//   const handleNext = () => {
//     setCurrentIndex(prev => Math.min(users.length - usersPerPage, prev + 1));
//   };

//   // ✅ 워크스페이스 삭제
//   const handleDeleteWorkspace = async () => {
//     if (!isOwner) {
//       alert('워크스페이스 삭제 권한이 없습니다.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${workspace.space_id}/destroy`,
//         {},
//         { withCredentials: true },
//       );

//       if (response.data.status === 'SUCCESS') {
//         alert('워크스페이스가 삭제되었습니다.');
//         onDeleteWorkspace();
//         navigate('/v1/mySpace'); // ✅ 삭제 후 페이지 이동
//       } else {
//         alert('워크스페이스 삭제에 실패하였습니다.');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('워크스페이스 삭제 중 오류가 발생했습니다.');
//     }
//   };

//   // ✅ 워크스페이스 나가기
//   const handleLeaveWorkspace = async () => {
//     if (isOwner) {
//       alert('호스트는 탈퇴할 수 없습니다.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace/${workspace.space_id}/leave`,
//         {},
//         { withCredentials: true },
//       );

//       if (response.data.status === 'SUCCESS') {
//         alert('워크스페이스에서 나갔습니다.');
//         onLeaveWorkspace();
//         navigate('/v1/mySpace'); // ✅ 삭제 후 페이지 이동
//       } else {
//         alert('워크스페이스 나가기 실패');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('워크스페이스 나가기 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <div className="project-info-container">
//       <div className="project-info-wrapper">
//         {/* 프로젝트 정보 */}
//         <div className="project-info">
//           <h5 className="fw-bold">{workspace.space_title}</h5>
//           {!isCollapsed && (
//             <>
//               <p className="project-description">
//                 {workspace.space_description}
//               </p>
//               <p className="project-date">
//                 진행 기간:{' '}
//                 {new Date(workspace.created_at).toLocaleDateString('ko-KR')}
//               </p>
//             </>
//           )}
//         </div>

//         {/* 유저 리스트 */}
//         <div className="user-list-container">
//           <button
//             className="arrow-btn left"
//             onClick={handlePrev}
//             disabled={currentIndex === 0}
//           >
//             <FaChevronLeft />
//           </button>
//           <div className="user-list">
//             {users
//               .slice(currentIndex, currentIndex + usersPerPage)
//               .map(user => (
//                 <div key={user.user_id} className="user-item">
//                   <img
//                     src={user.profileImg}
//                     alt={user.nickname}
//                     className="user-avatar"
//                   />
//                   {/* 현활 보류  */}
//                   {/* <span
//                     className={`user-status ${
//                       user.isOnline ? 'online' : 'offline'
//                     }`}
//                   /> */}
//                   {/* 현활 보류  */}
//                   {!isCollapsed && (
//                     <p className="user-nickname">{user.nickname}</p>
//                   )}
//                 </div>
//               ))}
//           </div>
//           <button
//             className="arrow-btn right"
//             onClick={handleNext}
//             disabled={currentIndex >= users.length - usersPerPage}
//           >
//             <FaChevronRight />
//           </button>
//         </div>

//         {/* 접기 버튼 */}
//         <button className="toggle-btn" onClick={toggleCollapse}>
//           {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
//         </button>

//         {/* 방장이면 삭제 버튼, 참여자는 나가기 버튼 */}
//         <div className="action-buttons">
//           {isOwner ? (
//             <button
//               className="action-btn delete-btn"
//               onClick={handleDeleteWorkspace}
//             >
//               <FaTrash />
//             </button>
//           ) : (
//             <button
//               className="action-btn leave-btn"
//               onClick={handleLeaveWorkspace}
//             >
//               <FaSignOutAlt />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  FaChevronUp,
  FaChevronDown,
  FaTrash,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
} from 'react-icons/fa';
import Avatar from 'boring-avatars'; // ✅ 기본 아바타 라이브러리
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/dashboard/ProjectInfo.scss';
import { WorkspaceInfo, ProjectInfoProps } from '../../types/types';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProjectInfo({
  workspace,
  isCollapsed,
  toggleCollapse,
  onLeaveWorkspace,
  onDeleteWorkspace,
}: ProjectInfoProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]); // 참여자 목록
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // 현재 로그인한 유저 ID
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { space_id } = useParams<{ space_id: string }>();

  const usersPerPage = 3;

  // ✅ 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/user/info`,
          { withCredentials: true },
        );

        if (response.data.status === 'SUCCESS') {
          const userId = response.data.data.user_id;
          setCurrentUserId(userId);
        } else {
          console.error('현재 사용자 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('현재 사용자 정보 조회 중 오류 발생', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // ✅ 워크스페이스 소유자 확인
  useEffect(() => {
    if (workspace && currentUserId !== null) {
      setIsOwner(Number(workspace.user_id) === Number(currentUserId));
    }
  }, [workspace, currentUserId]);

  // ✅ 워크스페이스 멤버 가져오기
  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/member`,
          { withCredentials: true },
        );

        if (response.data.status === 'SUCCESS') {
          const members = response.data.data || [];

          // ✅ 각 멤버의 프로필 사진을 가져오기 위해 추가 요청
          const userDetailsPromises = members.map(async (member: any) => {
            try {
              const userResponse = await axios.get(
                `${process.env.REACT_APP_API_SERVER}/user/info?user_id=${member.user_id}`,
                { withCredentials: true },
              );

              if (userResponse.data.status === 'SUCCESS') {
                return {
                  ...member,
                  profileImg: userResponse.data.data.profile_image, // ✅ 실제 프로필 사진 적용
                };
              } else {
                return { ...member, profileImg: null }; // 실패 시 기본값
              }
            } catch (error) {
              console.error(`유저 ${member.user_id} 정보 조회 실패:`, error);
              return { ...member, profileImg: null }; // 실패 시 기본값
            }
          });

          // ✅ 병렬로 모든 요청 실행 후 상태 업데이트
          const usersWithProfileImages = await Promise.all(userDetailsPromises);
          setUsers(usersWithProfileImages);
        } else {
          alert(`${response.data.message}, 참여자 목록을 불러오지 못했습니다.`);
        }
      } catch (error) {
        console.error('워크스페이스 참여자 조회 중 오류 발생', error);
        alert('참여자 목록을 불러오는 데 실패했습니다.');
      }
    };

    if (space_id) {
      fetchWorkspaceMembers();
    }
  }, [space_id]);

  return (
    <div className="project-info-container">
      <div className="project-info-wrapper">
        {/* 프로젝트 정보 */}
        <div className="project-info">
          <h5 className="fw-bold">{workspace.space_title}</h5>
          {!isCollapsed && (
            <>
              <p className="project-description">
                {workspace.space_description}
              </p>
              <p className="project-date">
                진행 기간:{' '}
                {new Date(workspace.created_at).toLocaleDateString('ko-KR')}
              </p>
            </>
          )}
        </div>

        {/* 유저 리스트 */}
        <div className="user-list-container">
          <button
            className="arrow-btn left"
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <FaChevronLeft />
          </button>
          <div className="user-list">
            {users
              .slice(currentIndex, currentIndex + usersPerPage)
              .map(user => (
                <div key={user.user_id} className="user-item">
                  {user.profile_image ? (
                    // ✅ `profile_image`가 아바타 이름 값이면 boring-avatars로 표시
                    <Avatar
                      name={user.profile_image} // 👈 boring-avatars의 이름 값으로 아바타 생성
                      colors={[
                        '#0db2ac',
                        '#f5dd7e',
                        '#fc8d4d',
                        '#fc694d',
                        '#faba32',
                      ]}
                      variant="beam"
                      size={40}
                    />
                  ) : (
                    <Avatar
                      name={user.nickname || 'Unknown User'} // 👈 닉네임을 기본값으로
                      colors={[
                        '#0db2ac',
                        '#f5dd7e',
                        '#fc8d4d',
                        '#fc694d',
                        '#faba32',
                      ]}
                      variant="beam"
                      size={40}
                    />
                  )}
                  {!isCollapsed && (
                    <p className="user-nickname">{user.nickname}</p>
                  )}
                </div>
              ))}
          </div>
          <button
            className="arrow-btn right"
            onClick={() =>
              setCurrentIndex(prev =>
                Math.min(users.length - usersPerPage, prev + 1),
              )
            }
            disabled={currentIndex >= users.length - usersPerPage}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* 접기 버튼 */}
        <button className="toggle-btn" onClick={toggleCollapse}>
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>

        {/* 방장이면 삭제 버튼, 참여자는 나가기 버튼 */}
        <div className="action-buttons">
          {isOwner ? (
            <button
              className="action-btn delete-btn"
              onClick={() => onDeleteWorkspace()}
            >
              <FaTrash />
            </button>
          ) : (
            <button
              className="action-btn leave-btn"
              onClick={() => onLeaveWorkspace()}
            >
              <FaSignOutAlt />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
