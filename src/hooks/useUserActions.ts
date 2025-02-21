// import { useState } from 'react';
// import axios from 'axios';

// export default function useUserActions(userData: any, setEditMode: any) {
//   const [formData, setFormData] = useState({
//     nickname: userData.nickname || '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });

//   const [selectedAvatar, setSelectedAvatar] = useState(userData.profile_image);
//   const [passwordError, setPasswordError] = useState(false);
//   const [currentPasswordError, setCurrentPasswordError] = useState(false);
//   const [isPasswordVerified, setIsPasswordVerified] = useState(false);
//   const [nicknameMessage, setNicknameMessage] = useState(''); // ✅ 닉네임 메시지
//   const [isNicknameChecked, setIsNicknameChecked] = useState(false); // ✅ 닉네임 중복 확인 여부

//   // 🔹 입력값 변경 핸들러
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setFormData(prevState => {
//       const updatedData = { ...prevState, [name]: value };

//       if (name === 'nickname') {
//         setIsNicknameChecked(false); // 닉네임이 변경되면 중복 체크 초기화
//         setNicknameMessage('');
//       }

//       if (updatedData.newPassword && updatedData.confirmPassword) {
//         setPasswordError(
//           updatedData.newPassword !== updatedData.confirmPassword,
//         );
//       } else {
//         setPasswordError(false);
//       }

//       return updatedData;
//     });
//   };

//   // 🔹 현재 비밀번호 검증
//   const verifyCurrentPassword = async () => {
//     try {
//       const response = await axios.post('/v1/user/login', {
//         email: userData.email,
//         password_hash: formData.currentPassword,
//       });

//       if (response.data.status === 'SUCCESS') {
//         setIsPasswordVerified(true);
//         setCurrentPasswordError(false);
//         alert('✅ 비밀번호가 확인되었습니다.');
//       } else {
//         setIsPasswordVerified(false);
//         setCurrentPasswordError(true);
//         alert('❌ 현재 비밀번호가 틀렸습니다.');
//       }
//     } catch (error) {
//       console.error('비밀번호 확인 실패:', error);
//       setIsPasswordVerified(false);
//       setCurrentPasswordError(true);
//       alert('⚠️ 비밀번호 확인 중 오류가 발생했습니다.');
//     }
//   };

//   // 🔹 사용자 정보 업데이트
//   const updateUser = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (passwordError) {
//       alert('❌ 새 비밀번호가 일치하지 않습니다.');
//       return;
//     }

//     if (!isPasswordVerified) {
//       alert('❌ 현재 비밀번호를 확인해주세요.');
//       return;
//     }

//     try {
//       const response = await axios.put('/v1/user/info', {
//         nickname: formData.nickname,
//         profile_image: selectedAvatar,
//         password: formData.newPassword || undefined,
//       });

//       // ✅ 닉네임 중복 에러 처리
//       if (
//         response.data.status === 'ERROR' &&
//         response.data.message.includes('이미 사용중인 닉네임')
//       ) {
//         setNicknameMessage('❌ 이미 사용 중인 닉네임입니다.');
//         setIsNicknameChecked(false);
//         return;
//       }

//       if (response.data.status === 'SUCCESS') {
//         alert('✅ 사용자 정보가 성공적으로 업데이트되었습니다.');
//         setEditMode(false); // ✅ 저장 후 회원정보 확인 단계로 이동
//       } else {
//         alert('❌ 수정 실패: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('사용자 정보 수정 실패:', error);
//       alert('⚠️ 서버 오류가 발생했습니다.');
//     }
//   };

//   return {
//     formData,
//     setFormData,
//     handleChange,
//     verifyCurrentPassword,
//     updateUser,
//     selectedAvatar,
//     setSelectedAvatar,
//     passwordError,
//     currentPasswordError,
//     nicknameMessage,
//     isNicknameChecked,
//   };
// }

import { useState } from 'react';
import axios from 'axios';

export default function useUserActions(userData: any, setEditMode: any) {
  const [formData, setFormData] = useState({
    nickname: userData.nickname || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [selectedAvatar, setSelectedAvatar] = useState(userData.profile_image);
  const [passwordError, setPasswordError] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // ✅ 추가됨

  // 🔹 현재 비밀번호 검증
  const verifyCurrentPassword = async () => {
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

  // 🔹 사용자 정보 업데이트
  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      alert('❌ 새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isPasswordVerified) {
      alert('❌ 현재 비밀번호를 확인해주세요.');
      return;
    }

    try {
      const response = await axios.put('/v1/user/info', {
        nickname: formData.nickname,
        profile_image: selectedAvatar,
        password: formData.newPassword || undefined,
      });

      if (response.data.status === 'SUCCESS') {
        alert('✅ 사용자 정보가 성공적으로 업데이트되었습니다.');
        setEditMode(false);
        // ✅ mypage 새로고침
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
    isPasswordVerified, // ✅ 추가됨
    setIsPasswordVerified, // ✅ 추가됨 (UserUpdate.tsx에서 사용 가능)
  };
}
