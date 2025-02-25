import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import useCheckSession from '../../hooks/useCheckSession';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute 컴포넌트
 * 인증이 필요한 라우트를 보호하는 컴포넌트입니다.
 * 세션이 유효하지 않은 경우 로그인 페이지로 리디렉션합니다.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // 세션 체크 훅 실행
  useCheckSession();
  
  // Redux 스토어에서 세션 상태 가져오기
  const sessionValid = useSelector(
    (state: RootState) => state.checkSession.sessionValid
  );
  
  const location = useLocation();

  // 세션이 유효하지 않으면 로그인 페이지로 리디렉션
  if (!sessionValid) {
    // 현재 경로를 state로 전달하여 로그인 후 원래 페이지로 돌아올 수 있도록 함
    return <Navigate to="/v1/user/login" state={{ from: location }} replace />;
  }

  // 세션이 유효하면 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default PrivateRoute;
