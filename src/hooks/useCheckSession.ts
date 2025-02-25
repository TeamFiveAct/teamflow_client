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

/**
 * 사용자 세션 상태를 확인하는 훅
 * 로그인 관련 페이지를 제외한 모든 페이지에서 세션 유효성을 검사합니다.
 */
const useCheckSession = (): void => {
  const dispatch = useDispatch();
  const sessionValid = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );
  const location = useLocation();

  useEffect(() => {
    // 로그인 관련 페이지에서는 세션 체크를 실행하지 않음
    const publicPaths = ['/v1/user/login', '/v1/user/join', '/'];
    if (publicPaths.includes(location.pathname)) {
      return;
    }

    // 세션 체크 함수
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
          // 리디렉션은 PrivateRoute 컴포넌트에서 처리하므로 여기서는 제거
        }
      } catch (error) {
        console.error('세션 확인 중 오류 발생:', error);
        dispatch(setSessionStatus(false));
      }
    };

    // 세션 체크 실행
    checkSession();
  }, [dispatch, location.pathname]);
};

export default useCheckSession;
