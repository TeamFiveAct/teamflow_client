// // src/components/commonComp/HeaderComp.tsx
// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   login,
//   logout,
//   deleteAccount,
//   selectIsLoggedIn,
//   selectAuthProvider,
// } from '../../store/authSlice';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import {
//   FaSignInAlt,
//   FaSignOutAlt,
//   FaBars,
//   FaUser,
//   FaTrashAlt,
// } from 'react-icons/fa';
// import '../../style/common.scss';
// import AboutUsModal from '../commonComp/AboutUsModal';
// import Login from '../LoginComp/Login';

// export default function Header() {
//   const isLoggedIn = useSelector(selectIsLoggedIn);
//   const authProvider = useSelector(selectAuthProvider);
//   const dispatch = useDispatch();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showAboutUs, setShowAboutUs] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         const response = await axios.get('/v1/user/session', {
//           withCredentials: true,
//         });

//         console.log('Session Response:', response.data);

//         if (response.data.status === 'SUCCESS' && response.data.data) {
//           dispatch(
//             login({
//               nickname: response.data.data.nickname,
//               authProvider: response.data.data.auth_provider,
//             }),
//           );
//           sessionStorage.setItem('session_valid', 'true');
//           sessionStorage.setItem('user_id', response.data.data.nickname);
//         }
//       } catch (error) {
//         console.error('세션 확인 실패:', error);
//       }
//     };

//     fetchSession();
//   }, [dispatch]);

//   const handleLogin = () => navigate('/v1/user/login');

//   const handleLogout = async () => {
//     try {
//       const logoutUrl =
//         authProvider === 'kakao' ? '/v1/user/kakao-logout' : '/v1/user/logout';
//       await axios.post(logoutUrl, {}, { withCredentials: true });

//       dispatch(logout());
//       sessionStorage.removeItem('session_valid');
//       sessionStorage.removeItem('user_id');

//       navigate('/');
//     } catch (error) {
//       console.error('로그아웃 실패:', error);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (!window.confirm('정말로 계정을 삭제하시겠습니까?')) return;

//     try {
//       await axios.delete('/v1/user', { withCredentials: true });

//       dispatch(deleteAccount());
//       sessionStorage.removeItem('session_valid');
//       sessionStorage.removeItem('user_id');

//       alert('회원 탈퇴가 완료되었습니다.');
//       navigate('/');
//     } catch (error) {
//       console.error('회원 탈퇴 실패:', error);
//       alert('회원 탈퇴 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <>
//       <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
//         <div className="container-fluid">
//           <button
//             className="navbar-brand fw-bold btn"
//             onClick={() =>
//               isLoggedIn ? navigate('/v1/workspace') : navigate('/')
//             }
//           >
//             TeamFlow
//           </button>

//           <div className="d-flex align-items-center">
//             <button
//               className="btn btn-outline-primary d-lg-none me-2"
//               onClick={isLoggedIn ? handleLogout : handleLogin}
//             >
//               {isLoggedIn ? (
//                 <FaSignOutAlt size={20} />
//               ) : (
//                 <FaSignInAlt size={20} />
//               )}
//             </button>

//             <button
//               ref={buttonRef}
//               className="navbar-toggler"
//               type="button"
//               onClick={() => setMenuOpen(prev => !prev)}
//               aria-controls="navbarNav"
//               aria-expanded={menuOpen}
//               aria-label="Toggle navigation"
//             >
//               <FaBars size={24} />
//             </button>
//           </div>

//           <div
//             ref={menuRef}
//             className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
//             id="navbarNav"
//           >
//             <ul className="navbar-nav ms-auto">
//               {!isLoggedIn && (
//                 <li className="nav-item">
//                   <button
//                     className="nav-link btn"
//                     onClick={() => navigate('/')}
//                   >
//                     Home
//                   </button>
//                 </li>
//               )}

//               <li className="nav-item">
//                 <button
//                   className="nav-link btn"
//                   onClick={() => setShowAboutUs(true)}
//                 >
//                   About Us
//                 </button>
//               </li>

//               {isLoggedIn && (
//                 <>
//                   <li className="nav-item">
//                     <button
//                       className="nav-link btn"
//                       onClick={() => navigate('/v1/workspace')}
//                     >
//                       Workspace
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className="nav-link btn"
//                       onClick={() => navigate('/v1/user')}
//                     >
//                       <FaUser /> MyPage
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className="nav-link btn text-danger"
//                       onClick={handleDeleteAccount}
//                     >
//                       <FaTrashAlt /> 회원 탈퇴
//                     </button>
//                   </li>
//                 </>
//               )}

//               <li className="nav-item d-none d-lg-block">
//                 <button
//                   className="btn btn-primary"
//                   onClick={isLoggedIn ? handleLogout : handleLogin}
//                 >
//                   {isLoggedIn ? 'Logout' : 'Login'}
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {showAboutUs && <AboutUsModal onClose={() => setShowAboutUs(false)} />}
//     </>
//   );
// }

import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
                      onClick={() => navigate('/v1/user')}
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
