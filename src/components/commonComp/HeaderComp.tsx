import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import axios from 'axios';
import { persistor } from '../../store/store'; // ✅ persistor 추가
import '../../style/common/common.scss';
import AboutUsModal from '../commonComp/AboutUsModal';
import { RootState } from '../../store/store';

export default function Header() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // ✅ 로그아웃 API 요청 및 Redux 상태 초기화
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        '/v1/user/logout',
        {},
        { withCredentials: true },
      );

      if (response.data.status === 'SUCCESS') {
        alert('로그아웃 성공');

        // ✅ Redux 상태 업데이트 (UI 즉시 변경)

        // ✅ Persisted state 초기화
        persistor.purge();

        // ✅ sessionStorage에서도 상태 삭제
        sessionStorage.removeItem('persist:root'); // 🚀 전체 상태 삭제
        sessionStorage.removeItem('persist:checkSession'); // 🚀 특정 상태만 삭제 가능

        // ✅ 로그인 페이지로 이동
        navigate('/v1/user/login');
      } else {
        alert('로그아웃 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
        <div className="container-fluid">
          <button
            className="navbar-brand fw-bold btn"
            onClick={() => navigate('/')}
          >
            TeamFlow
          </button>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-primary d-lg-none me-2"
              onClick={
                isLoggedIn ? handleLogout : () => navigate('/v1/user/login')
              }
            >
              {isLoggedIn ? (
                <FaSignOutAlt size={20} />
              ) : (
                <FaSignInAlt size={20} />
              )}
            </button>

            <button
              ref={buttonRef}
              className="navbar-toggler"
              type="button"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-controls="navbarNav"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <FaBars size={24} />
            </button>
          </div>

          <div
            ref={menuRef}
            className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn && (
                <li className="nav-item">
                  <button
                    className="nav-link btn"
                    onClick={() => navigate('/')}
                  >
                    Home
                  </button>
                </li>
              )}

              <li className="nav-item">
                <button
                  className="nav-link btn"
                  onClick={() => setShowAboutUs(true)}
                >
                  About Us
                </button>
              </li>

              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={() => navigate('/v1/mySpace')}
                    >
                      Myspace
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={() => navigate('/v1/workspace/:space_id')}
                    >
                      Workspace
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={() => {
                        navigate('/v1/user');
                        window.location.reload();
                      }}
                    >
                      MyPage
                    </button>
                  </li>
                </>
              )}

              <li className="nav-item d-none d-lg-block">
                <button
                  className="btn btn-primary"
                  onClick={
                    isLoggedIn ? handleLogout : () => navigate('/v1/user/login')
                  }
                >
                  {isLoggedIn ? 'Logout' : 'Login'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {showAboutUs && <AboutUsModal onClose={() => setShowAboutUs(false)} />}
    </>
  );
}
