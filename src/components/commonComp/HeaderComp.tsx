import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSignInAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import '../../style/common.scss';
import AboutUsModal from '../commonComp/AboutUsModal'; // ✅ About Us 모달 가져오기

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authProvider, setAuthProvider] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('/v1/user/session', {
          withCredentials: true,
        });

        console.log(response.data); // ✅ 응답 확인

        if (response.data.status === 'SUCCESS' && response.data.data) {
          setIsLoggedIn(true);
          setAuthProvider(response.data.data.auth_provider);
        }
      } catch (error) {
        console.error('세션 확인 실패:', error);
      }
    };

    fetchSession();
  }, []);

  // ✅ 로그인 페이지 이동
  const handleLogin = () => navigate('/login');

  // ✅ 로그아웃
  const handleLogout = async () => {
    try {
      const logoutUrl =
        authProvider === 'kakao' ? '/v1/user/kakao-logout' : '/v1/user/logout';
      await axios.post(logoutUrl, {}, { withCredentials: true });

      setIsLoggedIn(false);
      setAuthProvider('');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
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
              onClick={isLoggedIn ? handleLogout : handleLogin}
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
              <li className="nav-item">
                <button className="nav-link btn" onClick={() => navigate('/')}>
                  Home
                </button>
              </li>

              {/* ✅ About Us 버튼 클릭 시 모달 열기 */}
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
                    <button className="nav-link btn">Workspace</button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn">Dashboard</button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn">Chat</button>
                  </li>
                </>
              )}

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
