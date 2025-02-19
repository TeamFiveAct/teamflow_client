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
  const { space_id } = useParams<{ space_id: string }>(); // ✅ URL에서 워크스페이스 ID 가져오기
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ 워크스페이스 정보 가져오기
  useEffect(() => {
    if (!space_id) return;

    const fetchWorkspaceData = async () => {
      try {
        // 1️⃣ 워크스페이스 기본 정보 가져오기
        const workspaceResponse = await axios.get(`/v1/workspace/${space_id}`);

        // 2️⃣ 워크스페이스 참여자 정보 가져오기
        const membersResponse = await axios.get(
          `/v1/workspace/${space_id}/member`,
        );

        // 3️⃣ 데이터 합치기
        setWorkspace({
          ...workspaceResponse.data.data,
          members: membersResponse.data.data,
        });
      } catch (error) {
        console.error('워크스페이스 정보를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchWorkspaceData();
  }, [space_id]);

  // ✅ 데이터가 로드되지 않았을 때 로딩 메시지 표시
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
              <p className="text-muted mb-0">{workspace.space_description}</p>
              {/* ✅ 프로젝트 진행 기간 표시 */}
              <p className="project-date">
                진행 기간: {workspace.created_at} ~ {workspace.end_date}
              </p>
            </>
          )}
        </div>

        {/* 멤버 리스트 + 접기 버튼 */}
        <div className="d-flex align-items-center gap-3">
          {/* 접속 멤버 프로필 이미지 */}
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

          {/* 접는 버튼 */}
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
