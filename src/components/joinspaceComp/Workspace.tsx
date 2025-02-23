// components/Workspace.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/workspace.scss';
import CreateSpace from './CreateSpace';
import { useNavigate } from 'react-router-dom';

interface WorkspaceProps {
  workspaces: { id: number; name: string; isActive: boolean }[];
}

const Workspace: React.FC<WorkspaceProps> = ({ workspaces }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleWorkspaceClick = (id: number) => {
    navigate(':space_id');
  };

  return (
    <div className="container-fluid workspace-container d-flex">
      <div className="col-md-6 workspace-left d-flex flex-column align-items-center justify-content-center">
        {workspaces.length === 0 ? (
          <div className="workspace-message text-center text-muted">
            <p>등록된 워크스페이스가 없습니다.</p>
            <p>새로운 워크스페이스를 만들거나, 등록 후 사용해 주세요.</p>
          </div>
        ) : (
          <div className="workspace-list d-flex gap-3 overflow-auto">
            {workspaces.map(workspace => (
              <div
                key={workspace.id}
                className="workspace-circle"
                onClick={() => handleWorkspaceClick(workspace.id)}
              >
                {workspace.name}
              </div>
            ))}
            <div
              className="workspace-circle add"
              onClick={() => setModalOpen(true)}
            >
              +
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽 패널: 워크스페이스 생성 및 참가 */}
      <div className="col-md-6 workspace-right d-flex flex-column align-items-center justify-content-center p-4">
        <div className="workspace-create mb-3 text-center w-75">
          <h5 className="text-muted">새로운 워크스페이스를 만드시겠습니까?</h5>
          <button
            className="btn btn-primary mt-2 w-100"
            onClick={() => setModalOpen(true)}
          >
            생성
          </button>
        </div>
        <div className="workspace-join text-center w-75">
          <h5 className="text-muted">
            이미 만들어진 워크스페이스를 등록하시겠습니까?
          </h5>
          <input
            type="text"
            placeholder="코드를 입력하세요"
            className="form-control mt-2 w-100"
          />
          <button className="btn btn-success mt-3 w-100">등록</button>
        </div>
      </div>

      {isModalOpen && (
        <CreateSpace show={isModalOpen} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default Workspace;
