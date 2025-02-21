//teamflow_client\src\hooks\useUserActions.ts
import { useState } from 'react';
import axios from 'axios';

export default function useUserActions(userData: any, setEditMode: any) {
  const isKakaoUser = userData.authProvider === 'kakao'; // ✅ 카카오 로그인 여부 확인

  const [formData, setFormData] = useState({
    nickname: userData.nickname || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [selectedAvatar, setSelectedAvatar] = useState(userData.profile_image);
  const [passwordError, setPasswordError] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // 🔹 현재 비밀번호 검증 (카카오 로그인 사용자는 실행하지 않음)
  const verifyCurrentPassword = async () => {
    if (isKakaoUser) return; // ✅ 카카오 로그인 사용자는 비밀번호 검증 X

    try {
      const response = await axios.post('/v1/user/login', {
        email: userData.email,
        password_hash: formData.currentPassword,
      });

      if (response.data.status === 'SUCCESS') {
        setIsPasswordVerified(true);
        setCurrentPasswordError(false);
        alert('✅ 비밀번호가 확인되었습니다.');
      } else {
        setIsPasswordVerified(false);
        setCurrentPasswordError(true);
        alert('❌ 현재 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      setIsPasswordVerified(false);
      setCurrentPasswordError(true);
      alert('⚠️ 비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  // 🔹 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prevState => {
      const updatedData = { ...prevState, [name]: value };

      if (name === 'currentPassword') {
        setIsPasswordVerified(false); // ✅ 비밀번호 변경 시 검증 초기화
      }

      if (updatedData.newPassword && updatedData.confirmPassword) {
        setPasswordError(
          updatedData.newPassword !== updatedData.confirmPassword,
        );
      } else {
        setPasswordError(false);
      }

      return updatedData;
    });
  };

  // 🔹 사용자 정보 업데이트 (카카오 로그인 사용자는 비밀번호 검증 없이 저장)
  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 카카오 로그인 사용자는 비밀번호 확인하지 않음
    if (!isKakaoUser) {
      if (passwordError) {
        alert('❌ 새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (!isPasswordVerified) {
        alert('❌ 현재 비밀번호를 확인해주세요.');
        return;
      }
    }

    try {
      const updatedData: any = {
        nickname: formData.nickname,
        profile_image: selectedAvatar,
      };

      // ✅ 일반 로그인 사용자만 비밀번호 업데이트 가능
      if (!isKakaoUser && formData.newPassword) {
        updatedData.password = formData.newPassword;
      }

      const response = await axios.put('/v1/user/info', updatedData);

      if (response.data.status === 'SUCCESS') {
        alert('✅ 사용자 정보가 성공적으로 업데이트되었습니다.');
        setEditMode(false);
        window.location.reload();
      } else {
        alert('❌ 수정 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      alert('⚠️ 서버 오류가 발생했습니다.');
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    verifyCurrentPassword,
    updateUser,
    selectedAvatar,
    setSelectedAvatar,
    passwordError,
    currentPasswordError,
    isPasswordVerified,
    setIsPasswordVerified,
  };
}
