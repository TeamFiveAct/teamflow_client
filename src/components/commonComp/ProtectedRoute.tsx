import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

// ✅ 로그인 여부를 체크하여 보호된 라우트를 제공
export default function ProtectedRoute({ element }: ProtectedRouteProps) {
  const isLoggedIn = useSelector((state: RootState) => state.checkSession.sessionValid);

  if (!isLoggedIn) {
    alert('로그인이 필요합니다.');
    return <Navigate to="/v1/user/login" replace />;
  }

  return element;
}
