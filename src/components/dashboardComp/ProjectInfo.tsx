// import React, { useState } from 'react';
// import {
//   FaChevronUp,
//   FaChevronDown,
//   FaChevronLeft,
//   FaChevronRight,
// } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../style/dashboard/ProjectInfo.scss';
// import { WorkspaceInfo } from '../../types/types';

// interface ProjectInfoProps {
//   workspace: WorkspaceInfo;
//   isCollapsed: boolean;
//   toggleCollapse: () => void;
// }

// // ✅ 더미 사용자 데이터
// const dummyUsers = [
//   {
//     id: 1,
//     nickname: 'User1',
//     profileImg: 'https://via.placeholder.com/40',
//     isOnline: true,
//   },
//   {
//     id: 2,
//     nickname: 'User2',
//     profileImg: 'https://via.placeholder.com/40',
//     isOnline: false,
//   },
//   {
//     id: 3,
//     nickname: 'User3',
//     profileImg: 'https://via.placeholder.com/40',
//     isOnline: true,
//   },
//   {
//     id: 4,
//     nickname: 'User4',
//     profileImg: 'https://via.placeholder.com/40',
//     isOnline: false,
//   },
//   {
//     id: 5,
//     nickname: 'User5',
//     profileImg: 'https://via.placeholder.com/40',
//     isOnline: true,
//   },
// ];

// export default function ProjectInfo({
//   workspace,
//   isCollapsed,
//   toggleCollapse,
// }: ProjectInfoProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const usersPerPage = 3;

//   const handlePrev = () => {
//     setCurrentIndex(prev => Math.max(0, prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex(prev =>
//       Math.min(dummyUsers.length - usersPerPage, prev + 1),
//     );
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
//                 진행 기간: {workspace.created_at} ~ {workspace.end_date}
//               </p>
//             </>
//           )}
//         </div>

//         {/* 사용자 리스트 */}
//         <div className="user-list-container">
//           <button
//             className="arrow-btn left"
//             onClick={handlePrev}
//             disabled={currentIndex === 0}
//           >
//             <FaChevronLeft />
//           </button>
//           <div className="user-list">
//             {dummyUsers
//               .slice(currentIndex, currentIndex + usersPerPage)
//               .map(user => (
//                 <div key={user.id} className="user-item">
//                   <img
//                     src={user.profileImg}
//                     alt={user.nickname}
//                     className="user-avatar"
//                   />
//                   <span
//                     className={`user-status ${
//                       user.isOnline ? 'online' : 'offline'
//                     }`}
//                   ></span>
//                   {!isCollapsed && (
//                     <p className="user-nickname">{user.nickname}</p>
//                   )}
//                 </div>
//               ))}
//           </div>
//           <button
//             className="arrow-btn right"
//             onClick={handleNext}
//             disabled={currentIndex >= dummyUsers.length - usersPerPage}
//           >
//             <FaChevronRight />
//           </button>
//         </div>

//         {/* 접기 버튼 */}
//         <button className="toggle-btn" onClick={toggleCollapse}>
//           {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
//         </button>
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
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/dashboard/ProjectInfo.scss';
import { WorkspaceInfo } from '../../types/types';
import axios from 'axios';

interface ProjectInfoProps {
  workspace: WorkspaceInfo;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isOwner: boolean;
  onLeaveWorkspace: () => void;
  onDeleteWorkspace: () => void;
}

export default function ProjectInfo({
  workspace,
  isCollapsed,
  toggleCollapse,
  isOwner,
  onLeaveWorkspace,
  onDeleteWorkspace,
}: ProjectInfoProps) {
  const [users, setUsers] = useState<any[]>([]); // 실제 워크스페이스 참여자들
  const [currentIndex, setCurrentIndex] = useState(0);
  const usersPerPage = 3;

  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      try {
        // API에서 워크스페이스에 참여한 유저 정보 가져오기
        const response = await axios.get(
          `/v1/workspace/${workspace.space_id}/member`,
          {
            withCredentials: true,
          },
        );
        if (response.data.status === 'SUCCESS') {
          setUsers(response.data.data); // 유저 목록을 상태에 저장
        } else {
          alert('참여자 목록을 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('워크스페이스 참여자 조회 중 오류 발생', error);
        alert('참여자 목록을 불러오는 데 실패했습니다.');
      }
    };

    fetchWorkspaceMembers();
  }, [workspace.space_id]);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(users.length - usersPerPage, prev + 1));
  };

  const handleDeleteWorkspace = async () => {
    try {
      const response = await axios.post(
        `/v1/workspace/${workspace.space_id}/destroy`, // 워크스페이스 삭제 API 호출
        {},
        { withCredentials: true },
      );
      if (response.data.status === 'SUCCESS') {
        alert('워크스페이스가 삭제되었습니다.');
        onDeleteWorkspace(); // 부모 컴포넌트에서 삭제 후 처리
      } else {
        alert('워크스페이스 삭제에 실패하였습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('워크스페이스 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLeaveWorkspace = async () => {
    try {
      const response = await axios.post(
        `/v1/workspace/${workspace.space_id}/leave`, // 워크스페이스 탈퇴 API 호출
        {},
        { withCredentials: true },
      );
      if (response.data.status === 'SUCCESS') {
        alert('워크스페이스에서 나갔습니다.');
        onLeaveWorkspace(); // 부모 컴포넌트에서 나가기 후 처리
      } else {
        alert('워크스페이스 나가기 실패');
      }
    } catch (error) {
      console.error(error);
      alert('워크스페이스 나가기 중 오류가 발생했습니다.');
    }
  };

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
                진행 기간: {workspace.created_at} ~ {workspace.end_date}
              </p>
            </>
          )}
        </div>

        {/* 유저 리스트 */}
        <div className="user-list-container">
          <button
            className="arrow-btn left"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <FaChevronLeft />
          </button>
          <div className="user-list">
            {users
              .slice(currentIndex, currentIndex + usersPerPage)
              .map(user => (
                <div key={user.user_id} className="user-item">
                  <img
                    src={user.profileImg}
                    alt={user.nickname}
                    className="user-avatar"
                  />
                  <span
                    className={`user-status ${
                      user.isOnline ? 'online' : 'offline'
                    }`}
                  ></span>
                  {!isCollapsed && (
                    <p className="user-nickname">{user.nickname}</p>
                  )}
                </div>
              ))}
          </div>
          <button
            className="arrow-btn right"
            onClick={handleNext}
            disabled={currentIndex >= users.length - usersPerPage}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* 접기 버튼 */}
        <button className="toggle-btn" onClick={toggleCollapse}>
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>

        {/* 방장이면 '삭제' 버튼, 참여자는 '나가기' 버튼 */}
        <div className="action-buttons">
          {isOwner ? (
            <button
              className="action-btn delete-btn"
              onClick={handleDeleteWorkspace}
            >
              <FaTrash />
            </button>
          ) : (
            <button
              className="action-btn leave-btn"
              onClick={handleLeaveWorkspace}
            >
              <FaSignOutAlt />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
