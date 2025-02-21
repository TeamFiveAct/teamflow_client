//teamflow_client\src\hooks\useAuthActions.ts
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, deleteAccount, selectAuthProvider } from '../store/authSlice';
import axios from 'axios';

export default function useAuthActions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authProvider = useSelector(selectAuthProvider);

  const handleLogin = () => navigate('/v1/user/login');

  const handleLogout = async () => {
    try {
      const logoutUrl =
        authProvider === 'kakao' ? '/v1/user/kakao-logout' : '/v1/user/logout';

      await axios.post(logoutUrl, {}, { withCredentials: true });

      dispatch(logout());
      sessionStorage.removeItem('session_valid');
      sessionStorage.removeItem('user_id');

      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까?')) return;

    try {
      await axios.delete('/v1/user', { withCredentials: true });

      dispatch(deleteAccount());
      sessionStorage.removeItem('session_valid');
      sessionStorage.removeItem('user_id');

      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return { handleLogin, handleLogout, handleDeleteAccount };
}
