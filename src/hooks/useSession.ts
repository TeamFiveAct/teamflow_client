import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

export default function useSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('/v1/user/session', {
          withCredentials: true,
        });

        if (response.data.status === 'SUCCESS' && response.data.data) {
          dispatch(
            login({
              nickname: response.data.data.nickname,
              authProvider: response.data.data.auth_provider,
            }),
          );

          sessionStorage.setItem('session_valid', 'true');
          sessionStorage.setItem('user_id', response.data.data.nickname);
        }
      } catch (error) {
        console.error('세션 확인 실패:', error);
      }
    };

    fetchSession();
  }, [dispatch]);
}
