import '../style/myprofile/myProfile.scss';
import React from 'react';
import { useSelector } from 'react-redux';
// import { selectAuthProvider } from '../store/authSlice';
import KakaoUserUpdate from '../components/myprofileComp/KakaoUserUpdate';
import UserUpdate from '../components/myprofileComp/UserUpdate';
import { RootState } from '../store/store';

export default function MyProfile() {
  // const authProvider = 'kakao'; // ✅ 임시로 카카오 로그인 상태 설정
  const authProvider = useSelector(
    (state: RootState) => state.checkSession.authProvider,
  );

  return <>{authProvider === 'kakao' ? <KakaoUserUpdate /> : <UserUpdate />}</>;
}
