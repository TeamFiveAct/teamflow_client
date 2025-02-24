import React, { useEffect } from 'react';
import '../../style/common/aboutUs.scss';

interface AboutUsModalProps {
  onClose: () => void;
}

const frontendMembers = [
  { name: '이지원', role: 'Frontend Developer', emoji: '👩' },
  { name: '아미나', role: 'Frontend Developer', emoji: '👩' },
];

const backendMembers = [
  { name: '최규빈', role: 'Backend Developer', emoji: '👨' },
  { name: '김영준', role: 'Backend Developer', emoji: '👨' },
  { name: '이수진', role: 'Backend Developer', emoji: '👩' },
];

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
      <div className="header-modal-overlay" onClick={onClose}></div>

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
              <strong>TEAMFLOW</strong> 프로젝트를 진행한{' '}
              <strong>FIVEACT</strong> 팀을 소개합니다
            </p>
            <div className="team-section">
              <div className="team-roles">
                <div className="team-row">
                  {frontendMembers.map(member => (
                    <div key={member.name} className="team-member">
                      <div className="team-member-emoji">{member.emoji}</div>
                      <div className="team-member-info">
                        <strong>{member.name}</strong>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="team-row">
                  {backendMembers.map(member => (
                    <div key={member.name} className="team-member">
                      <div className="team-member-emoji">{member.emoji}</div>
                      <div className="team-member-info">
                        <strong>{member.name}</strong>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="aboutus-modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
