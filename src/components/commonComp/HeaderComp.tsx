import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaUser,
  FaTrashAlt,
} from 'react-icons/fa';
import '../../style/common.scss';
import AboutUsModal from '../commonComp/AboutUsModal';
import useSession from '../../hooks/useSession';
import useAuthActions from '../../hooks/useAuthActions';

export default function Header() {
  useSession(); // ✅ 세션 체크 훅 실행
  const { handleLogin, handleLogout, handleDeleteAccount } = useAuthActions();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
        <div className="container-fluid">
          {/* ✅ 로고 클릭 시 로그인 상태에 따라 이동 */}
          <button
            className="navbar-brand fw-bold btn"
            onClick={() =>
              isLoggedIn ? navigate('/v1/workspace') : navigate('/')
            }
          >
            TeamFlow
          </button>

          <div className="d-flex align-items-center">
            {/* ✅ 모바일 로그인/로그아웃 버튼 (좌측 상단) */}
            <button
              className="btn btn-outline-primary d-lg-none me-2"
              onClick={isLoggedIn ? handleLogout : handleLogin}
            >
              {isLoggedIn ? (
                <FaSignOutAlt size={20} />
              ) : (
                <FaSignInAlt size={20} />
              )}
            </button>

            {/* ✅ 햄버거 메뉴 버튼 */}
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

          {/* ✅ 네비게이션 메뉴 */}
          <div
            ref={menuRef}
            className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              {/* ✅ 로그인 전 홈 버튼 표시 */}
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

              {/* ✅ About Us 모달 버튼 */}
              <li className="nav-item">
                <button
                  className="nav-link btn"
                  onClick={() => setShowAboutUs(true)}
                >
                  About Us
                </button>
              </li>

              {/* ✅ 로그인한 경우 마이페이지, 작업 공간, 로그아웃, 회원 탈퇴 버튼 표시 */}
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={() => navigate('/v1/workspace')}
                    >
                      Workspace
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={() => navigate('/v1/workspace/:space_id')}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn"
                      onClick={() => {
                        navigate('/v1/user'); // ✅ 먼저 이동
                        window.location.reload(); // ✅ 페이지 새로고침 실행
                      }}
                    >
                      MyPage
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn text-danger"
                      onClick={handleDeleteAccount}
                    >
                      회원 탈퇴
                    </button>
                  </li>
                </>
              )}

              {/* ✅ 로그인/로그아웃 버튼 (PC에서만 보임) */}
              <li className="nav-item d-none d-lg-block">
                <button
                  className="btn btn-primary"
                  onClick={isLoggedIn ? handleLogout : handleLogin}
                >
                  {isLoggedIn ? 'Logout' : 'Login'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ✅ About Us 모달 */}
      {showAboutUs && <AboutUsModal onClose={() => setShowAboutUs(false)} />}
    </>
  );
}
