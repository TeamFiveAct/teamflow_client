import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../style/home.scss";

export default function HomeComponent() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false); // ✅ 화면 회색 오버레이를 위한 상태

  return (
    <div className="home-container">
      {/* ✅ 버튼 hover 시 회색 오버레이 추가 */}
      {isHovered && <div className="dark-overlay"></div>}

      <main className="container mt-5 content">
        {/* ✅ 첫 번째 섹션 */}
        <div id="section1" className="scroll-section">
          <div className="row align-items-center">
            <div className="col-md-6 text-section">
              <h1 className="fw-bold">
                개발자들의 협업 스페이스,{" "}
                <span className="text-primary">TeamFlow</span>
              </h1>
              <p className="text-muted">
                TeamFlow는 개발자들이 실시간으로 협업하고, 프로젝트를 관리할 수
                있는 완벽한 플랫폼입니다.
              </p>
            </div>
            <div className="col-md-6">
              <img
                src="/assets/business1.jpg"
                className="img-fluid rounded"
                alt="소개 이미지"
              />
            </div>
          </div>
        </div>

        {/* ✅ 두 번째 섹션 */}
        <div id="section2" className="scroll-section">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                src="/assets/business2.jpg"
                className="img-fluid rounded"
                alt="사용 설명 이미지"
              />
            </div>
            <div className="col-md-6 text-section">
              <h2>TeamFlow 사용법</h2>
              <p>
                회원가입 후 팀을 생성하고, 팀원들을 초대하세요. 프로젝트의 진행
                상태를 쉽게 확인하고, 실시간 채팅으로 원활한 소통이 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ 세 번째 섹션 */}
        <div id="section3" className="scroll-section">
          <div className="row align-items-center">
            <div className="col-md-6 text-section">
              <h2>주요 기능</h2>
              <ul>
                <li>프로젝트 별 협업 공간</li>
                <li> 실시간 채팅 지원</li>
                <li> 투두 리스트 기반 작업 관리</li>
                <li> 직관적인 UI와 간편한 사용법</li>
              </ul>
            </div>
            <div className="col-md-6">
              <img
                src="/assets/business3.jpg"
                className="img-fluid rounded"
                alt="주요 기능 이미지"
              />
            </div>
          </div>
        </div>
      </main>

      {/* ✅ 화면 오른쪽 중간에 고정된 버튼 (화살표 + 시작하기) */}
      <button
        className="floating-start-button"
        onClick={() => navigate("/v1/user/login")}
        onMouseEnter={() => setIsHovered(true)} // ✅ 버튼 호버 시 화면 어두워짐
        onMouseLeave={() => setIsHovered(false)} // ✅ 마우스 이동하면 원래 상태
      >
        🚀 시작하기 <FaArrowRight size={20} />
      </button>
    </div>
  );
}
