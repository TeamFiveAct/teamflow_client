import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/taskModal.scss';

interface TaskModalProps {
  show: boolean;
  onHide: () => void;
  taskState: 'open' | 'in_progress' | 'done' | null;
}

export default function TaskModal({ show, onHide, taskState }: TaskModalProps) {
  if (!show) return null; // ✅ 모달이 닫힌 상태에서는 렌더링하지 않음

  return (
    <div className="modal-overlay">
      {' '}
      {/* ✅ 모달 배경 (오버레이) */}
      <div className="custom-modal">
        {' '}
        {/* ✅ 기존 Bootstrap modal 제거 후 커스텀 모달 사용 */}
        <div className="modal-header">
          <h5 className="modal-title">할 일 생성 ({taskState})</h5>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          <p>할 일 생성 모달입니다. ({taskState})</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onHide}>
            닫기
          </button>
          <button className="btn btn-primary">저장</button>
        </div>
      </div>
    </div>
  );
}
