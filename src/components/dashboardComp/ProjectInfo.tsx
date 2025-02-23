import React, { useState } from 'react';
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/ProjectInfo.scss';
import { WorkspaceInfo } from '../../types/types';

interface ProjectInfoProps {
  workspace: WorkspaceInfo;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

// ✅ 더미 사용자 데이터
const dummyUsers = [
  {
    id: 1,
    nickname: 'User1',
    profileImg: 'https://via.placeholder.com/40',
    isOnline: true,
  },
  {
    id: 2,
    nickname: 'User2',
    profileImg: 'https://via.placeholder.com/40',
    isOnline: false,
  },
  {
    id: 3,
    nickname: 'User3',
    profileImg: 'https://via.placeholder.com/40',
    isOnline: true,
  },
  {
    id: 4,
    nickname: 'User4',
    profileImg: 'https://via.placeholder.com/40',
    isOnline: false,
  },
  {
    id: 5,
    nickname: 'User5',
    profileImg: 'https://via.placeholder.com/40',
    isOnline: true,
  },
];

export default function ProjectInfo({
  workspace,
  isCollapsed,
  toggleCollapse,
}: ProjectInfoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const usersPerPage = 3;

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev =>
      Math.min(dummyUsers.length - usersPerPage, prev + 1),
    );
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
            {dummyUsers
              .slice(currentIndex, currentIndex + usersPerPage)
              .map(user => (
                <div key={user.id} className="user-item">
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
            disabled={currentIndex >= dummyUsers.length - usersPerPage}
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
