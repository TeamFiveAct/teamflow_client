import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/ProjectInfo.scss';

interface Member {
  user_id: number;
  profile_image: string;
}

interface WorkspaceInfo {
  space_id: number;
  space_title: string;
  space_description: string;
  created_at: string;
  end_date: string;
  members: Member[];
}

export default function ProjectInfo() {
  const { space_id } = useParams<{ space_id: string }>();
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ 테스트용 임시 데이터 (긴 설명 포함)
  const mockData: WorkspaceInfo = {
    space_id: 999,
    space_title: '테스트 워크스페이스',
    space_description:
      '이것은 테스트용 워크스페이스입니다. 여기에는 프로젝트의 전체 설명이 들어갑니다. ' +
      '긴 설명을 테스트하기 위해 여러 줄의 텍스트를 추가합니다. 프로젝트 목표, 진행 과정, 사용 기술, ' +
      '참여 인원, 향후 계획 등을 포함할 수 있습니다. 이 프로젝트는 AI 기반 업무 자동화를 목표로 합니다. ' +
      '각 팀원은 특정 역할을 맡고 있으며, 주요 기능으로는 태스크 관리, 실시간 채팅, AI 서포트 기능이 포함됩니다. ' +
      '각 단계별 진행 상황을 모니터링할 수 있으며, 향후 추가될 기능으로는 외부 API 연동, 데이터 시각화 등이 있습니다.',
    created_at: '2024-02-01',
    end_date: '2024-12-31',
    members: [
      {
        user_id: 1,
        profile_image: 'https://via.placeholder.com/40',
      },
      {
        user_id: 2,
        profile_image: 'https://via.placeholder.com/40',
      },
    ],
  };

  useEffect(() => {
    if (!space_id) {
      console.warn('🚨 space_id 없음, 테스트용 더미 데이터 사용!');
      setWorkspace(mockData);
      return;
    }

    const fetchWorkspaceData = async () => {
      try {
        const workspaceResponse = await axios.get(`/v1/workspace/${space_id}`);
        const membersResponse = await axios.get(
          `/v1/workspace/${space_id}/member`,
        );

        setWorkspace({
          ...workspaceResponse.data.data,
          members: membersResponse.data.data,
        });
      } catch (error) {
        console.error(
          '❌ 워크스페이스 정보를 불러오는 데 실패했습니다.',
          error,
        );
        console.warn('✅ 백엔드 데이터가 없으므로 테스트용 더미 데이터 사용!');
        setWorkspace(mockData);
      }
    };

    fetchWorkspaceData();
  }, [space_id]);

  if (!workspace) {
    return (
      <p className="text-center mt-3">워크스페이스 정보를 불러오는 중...</p>
    );
  }

  return (
    <div className="project-info-container w-100">
      <div className="bg-white shadow-sm py-3 px-4 d-flex align-items-center justify-content-between">
        {/* 프로젝트 정보 */}
        <div className="d-flex flex-column">
          <h5 className="mb-1 fw-bold">{workspace.space_title}</h5>

          {!isCollapsed && (
            <>
              <p className="text-muted mb-0 project-description">
                {workspace.space_description}
              </p>

              {/* ✅ 프로젝트 진행 기간 표시 */}
              <p className="project-date">
                진행 기간: {workspace.created_at} ~ {workspace.end_date}
              </p>
            </>
          )}
        </div>

        {/* 멤버 리스트 + 접기 버튼 */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex gap-2">
            {workspace.members.map(member => (
              <img
                key={member.user_id}
                src={member.profile_image}
                alt="User Profile"
                className="rounded-circle border user-avatar"
              />
            ))}
          </div>

          {/* 접기 버튼 */}
          <button
            className="btn btn-outline-secondary toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
      </div>
    </div>
  );
}
