import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectNickname } from '../store/authSlice';

interface UserData {
  profile_image: string;
  nickname: string;
  email: string;
}

export default function useUserData() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const nickname = useSelector(selectNickname);
  const [userData, setUserData] = useState<UserData>({
    profile_image: '',
    nickname: '',
    email: '',
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
          setUserData(response.data.data);
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
