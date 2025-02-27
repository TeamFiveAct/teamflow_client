// import React, { useRef, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { FaSignInAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
// import axios from 'axios';
// import { persistor } from '../../store/store'; // ✅ persistor 추가
// import '../../style/common/common.scss';
// import AboutUsModal from '../commonComp/AboutUsModal';
// import { RootState } from '../../store/store';

// export default function Header() {
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector(
//     (state: RootState) => state.checkSession.sessionValid,
//   );
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showAboutUs, setShowAboutUs] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const navigate = useNavigate();

//   // ✅ 로그아웃 API 요청 및 Redux 상태 초기화
//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(
//         '/v1/user/logout',
//         {},
//         { withCredentials: true },
//       );

//       if (response.data.status === 'SUCCESS') {
//         alert('로그아웃 성공');

//         // ✅ Redux 상태 업데이트 (UI 즉시 변경)

//         // ✅ Persisted state 초기화
//         persistor.purge();

//         // ✅ sessionStorage에서도 상태 삭제
//         sessionStorage.removeItem('persist:root'); // 🚀 전체 상태 삭제
//         sessionStorage.removeItem('persist:checkSession'); // 🚀 특정 상태만 삭제 가능

//         // ✅ 로그인 페이지로 이동
//         navigate('/v1/user/login');
//         window.location.reload(); // 🔥 강제 새로고침 (헤더 즉시 변경)
//       } else {
//         alert('로그아웃 실패: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('로그아웃 에러:', error);
//       alert('로그아웃 중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <>
//       <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
//         <div className="container-fluid">
//           <button
//             className="navbar-brand fw-bold btn"
//             onClick={() => navigate('/')}
//           >
//             TeamFlow
//           </button>

//           <div className="d-flex align-items-center">
//             <button
//               className="btn btn-outline-primary d-lg-none me-2"
//               onClick={
//                 isLoggedIn ? handleLogout : () => navigate('/v1/user/login')
//               }
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
//                       onClick={() => navigate('/v1/mySpace')}
//                     >
//                       Myspace
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className="nav-link btn"
//                       onClick={() => navigate('/v1/workspace/:space_id')}
//                     >
//                       Workspace
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className="nav-link btn"
//                       onClick={() => {
//                         navigate('/v1/user');
//                         window.location.reload();
//                       }}
//                     >
//                       MyPage
//                     </button>
//                   </li>
//                 </>
//               )}

//               <li className="nav-item d-none d-lg-block">
//                 <button
//                   className="btn btn-primary"
//                   onClick={
//                     isLoggedIn ? handleLogout : () => navigate('/v1/user/login')
//                   }
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

import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import axios from 'axios';
import { persistor } from '../../store/store';
import '../../style/common/common.scss';
import AboutUsModal from '../commonComp/AboutUsModal';
import { RootState } from '../../store/store';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );
  const authProvider = useSelector(
    (state: RootState) => state.checkSession.authProvider,
  ); // ✅ Redux에서 authProvider 가져오기

  const [menuOpen, setMenuOpen] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ✅ 로그아웃 API 요청
  // const handleLogout = async () => {
  //   try {
  //     const logoutApi =
  //       authProvider === 'kakao' ? '/v1/user/kakao-logout' : '/v1/user/logout';

  //     const response = await axios.post(
  //       logoutApi,
  //       {},
  //       { withCredentials: true },
  //     );

  //     if (response.data.status === 'SUCCESS') {
  //       alert('로그아웃 성공');

  //       // ✅ 1. 브라우저 쿠키 삭제 (자동 로그인 방지)
  //       document.cookie = 'connect.sid=; Max-Age=0; path=/';
  //       document.cookie = '_kadu=; Max-Age=0; path=/';
  //       document.cookie = '_kakao_sso=; Max-Age=0; path=/';
  //       sessionStorage.removeItem('selectedSpaceId');

  //       // ✅ 2. Redux persist 초기화

  //       persistor.purge();
  //       // ✅ 3. sessionStorage 삭제
  //       sessionStorage.removeItem('persist:root');
  //       sessionStorage.removeItem('persist:checkSession');

  //       // ✅ 4. 로그인 페이지로 이동 (새로고침)
  //       navigate('/v1/user/login');
  //       window.location.reload();
  //     } else {
  //       alert('로그아웃 실패: ' + response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('로그아웃 에러:', error);
  //     alert('로그아웃 중 오류가 발생했습니다.');
  //   }
  // };
  const handleLogout = async () => {
    try {
      let logoutApi = '/v1/user/logout'; // 기본 이메일 로그아웃 API
      if (authProvider === 'kakao') {
        logoutApi = '/v1/user/kakao-logout'; // 카카오 로그아웃 API
      }

      const response = await axios.post(
        logoutApi,
        {},
        { withCredentials: true },
      );

      if (response.data.status === 'SUCCESS') {
        alert(
          authProvider === 'kakao' ? '카카오 로그아웃 성공' : '로그아웃 성공',
        );

        // ✅ 브라우저 쿠키 삭제 (자동 로그인 방지)
        document.cookie = 'connect.sid=; Max-Age=0; path=/';
        document.cookie = '_kadu=; Max-Age=0; path=/';
        document.cookie = '_kakao_sso=; Max-Age=0; path=/';

        // ✅ Redux persist 초기화
        persistor.purge();

        // ✅ sessionStorage 삭제
        sessionStorage.removeItem('persist:root');
        sessionStorage.removeItem('persist:checkSession');
        sessionStorage.removeItem('selectedSpaceId');

        // ✅ 로그인 페이지로 이동 후 새로고침
        navigate('/v1/user/login');
        window.location.reload();
      } else {
        alert(`로그아웃 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // ✅ 세션이 만료되었을 경우 자동 로그아웃 처리
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/v1/user/session', {
          withCredentials: true,
        });

        if (response.data.status !== 'SUCCESS') {
          handleLogout();
        }
      } catch (error) {
        console.error('세션 확인 실패:', error);
        handleLogout();
      }
    };

    if (isLoggedIn) {
      checkSession();
    }
  }, [isLoggedIn]);

  // ✅ 네비게이션 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
        <div className="container-fluid">
          <button
            className="navbar-brand fw-bold btn"
            onClick={() => navigate('/')}
          >
            <img
              src="/favicon.ico"
              alt="logo"
              width={20}
              style={{ borderRadius: '3px' }}
            />{' '}
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
                <ul className="navbar-nav ms-auto">
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
                      onClick={async () => {
                        // ✅ 현재 로그인한 유저의 워크스페이스 목록 조회
                        try {
                          const response = await axios.get(
                            `${process.env.REACT_APP_API_SERVER}/workspace/user`,
                            { withCredentials: true },
                          );

                          if (
                            response.data.status === 'SUCCESS' &&
                            response.data.data.length > 0
                          ) {
                            const storedSpaceId =
                              sessionStorage.getItem('selectedSpaceId'); // ✅ `sessionStorage`에서 가져오기
                            if (storedSpaceId) {
                              navigate(`/v1/workspace/${storedSpaceId}`); // ✅ 저장된 워크스페이스로 이동
                            } else {
                              alert('워크스페이스를 선택해주세요.'); // ✅ 알람 표시
                              navigate('/v1/mySpace'); // ✅ `MySpace` 페이지로 이동
                            }
                          } else {
                            alert('참여한 워크스페이스가 없습니다.'); // ✅ 유저가 워크스페이스에 속해 있지 않음
                            navigate('/v1/mySpace'); // ✅ `MySpace` 페이지로 이동
                          }
                        } catch (error) {
                          console.error('워크스페이스 정보 확인 실패:', error);
                          alert(
                            '워크스페이스 정보를 불러오는 데 실패했습니다.',
                          );
                          navigate('/v1/mySpace'); // ✅ `MySpace` 페이지로 이동
                        }
                      }}
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
                </ul>
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
