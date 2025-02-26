//teamflow_client\src\hooks\useUserData.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import { selectIsLoggedIn, selectNickname } from '../store/authSlice';

interface UserData {
  profile_image: string;
  nickname: string;
  email: string;
  authProvider?: string; // ✅ authProvider 속성 추가 (선택적 속성)
}

export default function useUserData() {
  // const isLoggedIn = useSelector(selectIsLoggedIn);
  // const nickname = useSelector(selectNickname);
  const isLoggedIn = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );
  const authProvider = useSelector(
    (state: RootState) => state.checkSession.authProvider,
  ); // ✅ Redux에서 authProvider 가져오기
  const nickname = useSelector(
    (state: RootState) => state.checkSession.nickname,
  );
  const [userData, setUserData] = useState<UserData>({
    profile_image: '',
    nickname: '',
    email: '',
    authProvider: authProvider || '', // 🔹 authProvider 추가
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/v1/user/info', {
          withCredentials: true,
        });

        if (response.data.status === 'SUCCESS') {
          setUserData(prev => ({
            ...prev,
            ...response.data.data,
            authProvider: authProvider, // ✅ authProvider 유지
          }));
        } else {
          console.error('사용자 정보 조회 실패:', response.data.message);
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  return { userData, setUserData, editMode, setEditMode, nickname };
}
