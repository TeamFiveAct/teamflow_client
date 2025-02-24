// src/components/TaskModal.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/taskModal.scss';

interface TaskModalProps {
  show: boolean;
  onHide: () => void;
  taskState: 'open' | 'in_progress' | 'done' | null;
}

export default function TaskModal({ show, onHide, taskState }: TaskModalProps) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">할 일 생성 ({taskState})</h5>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          <form>
            <div className="mb-3">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-control"
                placeholder="제목 입력"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">설명</label>
              <textarea
                className="form-control"
                placeholder="설명 입력"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">우선순위</label>
              <select className="form-control">
                <option value="">선택</option>
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">시작 날짜</label>
              <input type="date" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">마감 날짜</label>
              <input type="date" className="form-control" />
            </div>
          </form>
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
