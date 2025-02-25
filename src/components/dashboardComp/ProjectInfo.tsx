import React, { useState } from 'react';
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/ProjectInfo.scss';
import { WorkspaceInfo } from '../../types/types';
import { RootState } from '../../store/store';
import UserAvatar from '../commonComp/UserAvatar';

interface ProjectInfoProps {
  workspace: WorkspaceInfo;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}


export default function ProjectInfo({
  workspace,
  isCollapsed,
  toggleCollapse,
}: ProjectInfoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const usersPerPage = 3;
  
  // Redux 스토어에서 온라인 사용자 목록 가져오기
  const onlineUsers = useSelector((state: RootState) => {
    console.log('[ProjectInfo] Redux 상태:', state);
    console.log('[ProjectInfo] 온라인 사용자 목록:', state.onlineUsers.users);
    return state.onlineUsers.users;
  });

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev =>
      Math.min(onlineUsers.length - usersPerPage, prev + 1),
    );
  };

  // 디버깅: 컴포넌트 렌더링 시 사용자 목록 로깅
  console.log('[ProjectInfo] 렌더링 - 온라인 사용자 수:', onlineUsers.length);

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

        {/* 사용자 리스트 */}
        <div className="user-list-container">
          <button
            className="arrow-btn left"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <FaChevronLeft />
          </button>
          <div className="user-list">
            {onlineUsers.length > 0 ? (
              onlineUsers
                .slice(currentIndex, currentIndex + usersPerPage)
                .map(user => (
                  <div key={user.userId} className="user-item">
                    <div className="user-avatar">
                      <UserAvatar 
                        name={user.profileImg || `User${user.userId}`} 
                        size={40} 
                      />
                    </div>
                    <span className="user-status online"></span>
                    {!isCollapsed && (
                      <p className="user-nickname">{user.nickname}</p>
                    )}
                  </div>
                ))
            ) : (
              <div className="no-users">접속 중인 사용자가 없습니다.</div>
            )}
          </div>
          <button
            className="arrow-btn right"
            onClick={handleNext}
            disabled={currentIndex >= onlineUsers.length - usersPerPage}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* 접기 버튼 */}
        <button className="toggle-btn" onClick={toggleCollapse}>
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>
    </div>
  );
}
