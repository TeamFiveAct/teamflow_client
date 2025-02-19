import React, { useEffect } from 'react';
import '../../style/modal.scss';

interface AboutUsModalProps {
  onClose: () => void;
}

export default function AboutUsModal({ onClose }: AboutUsModalProps) {
  useEffect(() => {
    // ✅ 모달이 열리면 시작하기 버튼 비활성화
    const startButton = document.getElementById('start-button');
    if (startButton) startButton.setAttribute('disabled', 'true');

    return () => {
      // ✅ 모달이 닫히면 다시 활성화
      if (startButton) startButton.removeAttribute('disabled');
    };
  }, []);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="custom-modal-container">
        <div className="aboutus-modal-content">
          <div className="aboutus-modal-header">
            <h5 className="modal-title">About Us</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="aboutus-modal-body">
            <p>
              <strong>TeamFlow</strong>는 효율적인 협업을 위한 플랫폼입니다.
            </p>
            <p>우리 팀은 혁신적인 프로젝트 관리를 제공합니다!</p>
          </div>
          <div className="aboutus-modal-footer">
            {/* ✅ 닫기 버튼은 항상 활성화 */}
            <button className="btn btn-secondary" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
