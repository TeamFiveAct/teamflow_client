import React from 'react';
import '../../style/modal.scss';

interface FooterModalProps {
  onClose: () => void;
}

export default function FooterModal({ onClose }: FooterModalProps) {
  return (
    <>
      {/* ✅ 모달 컨텐츠 */}
      <div className="custom-modal-container" onClick={e => e.stopPropagation()}>
        <div className="custom-modal-content">
          <div className="custom-modal-header">
            <h5 className="modal-title">About FiveAct</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="custom-modal-body">
            <p>
              <strong>팀:</strong> FiveAct
            </p>
            <p>
              <strong>이메일:</strong> contact@fiveact.com
            </p>
            <p>
              <strong>주소:</strong> SeSac Dobong Campus, Seoul, South Korea
            </p>
            <p>협업을 위한 투두 웹~~~~</p>
          </div>
          <div className="custom-modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
