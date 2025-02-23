import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../store/store';
import {
  setSessionStatus,
  setAuthProvider,
  logout,
} from '../store/modules/checkSessionSlice';
import { useLocation } from 'react-router-dom';

const useCheckSession = (): void => {
  const dispatch = useDispatch();
  const sessionValid = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );
  const location = useLocation();

  useEffect(() => {
    // 로그인 관련 페이지에서는 세션 체크를 실행하지 않음
    if (
      location.pathname === '/v1/user/login' ||
      location.pathname === '/v1/user/join' ||
      location.pathname === '/'
    ) {
      return;
    }

    // 매 페이지마다 세션 체크를 진행합니다.
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/user/session`,
          {
            withCredentials: true,
          },
        );
        console.log('세션 응답:', response.data);
        if (response.data.status === 'SUCCESS') {
          dispatch(setSessionStatus(true));
          // response.data.data가 로그인 방식 정보를 담고 있다고 가정합니다.
          dispatch(setAuthProvider(response.data.data));
        } else {
          dispatch(logout());
          dispatch(setSessionStatus(false));
          window.location.href = '/v1/user/login';
        }
      } catch (error) {
        console.error('세션 확인 중 오류 발생:', error);
        dispatch(setSessionStatus(false));
      }
    };

    checkSession();
  }, [dispatch, location.pathname]);

  // return sessionValid;
};

export default useCheckSession;

// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { RootState } from '../store/store';
// import {
//   setSessionStatus,
//   setAuthProvider,
//   logout,
// } from '../store/modules/checkSessionSlice';
// import { useLocation } from 'react-router-dom';

// const useCheckSession = () => {
//   const dispatch = useDispatch();
//   const sessionValid = useSelector(
//     (state: RootState) => state.checkSession.sessionValid,
//   );
//   const location = useLocation();

//   useEffect(() => {
//     // 특정 경로에서 세션 체크를 하지 않도록 함
//     if (
//       location.pathname === '/v1/user/login' ||
//       location.pathname === '/v1/user/join' ||
//       location.pathname === '/'
//     ) {
//       return;
//     }

//     const checkSession = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_SERVER}/user/session`,
//           {
//             withCredentials: true, // 쿠키와 함께 요청
//           },
//         );
//         console.log(response.data);

//         if (response.data.status === 'SUCCESS') {
//           dispatch(setSessionStatus(true)); // 세션이 유효한 경우 true 설정
//           dispatch(setAuthProvider(response.data.data)); // 로그인 방식 설정
//         } else {
//           // 세션 만료 시 로그아웃 처리
//           dispatch(logout());
//           dispatch(setSessionStatus(false)); // 세션 상태 false로 설정
//           window.location.href = '/v1/user/login'; // 로그인 페이지로 리디렉션
//         }
//       } catch (error) {
//         console.error('세션 확인 중 오류 발생:', error);
//         dispatch(setSessionStatus(false)); // 오류 시 세션 상태 false로 설정
//       }
//     };

//     // 세션이 유효하지 않으면 세션을 체크함
//     if (!sessionValid) {
//       checkSession();
//     }
//   }, [sessionValid, dispatch, location.pathname]);
// };

// export default useCheckSession;
