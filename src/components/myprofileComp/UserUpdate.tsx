import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileImg from '../LoginComp/ProfileImg';
import Avatar from 'boring-avatars';
import useUserData from '../../hooks/useUserData';
import useUserActions from '../../hooks/useUserActions';

export default function UserUpdate() {
  const { userData, editMode, setEditMode } = useUserData();
  const {
    formData,
    setFormData,
    handleChange,
    verifyCurrentPassword,
    updateUser,
    selectedAvatar,
    setSelectedAvatar,
    passwordError,
    currentPasswordError,
    isPasswordVerified, // ✅ 비밀번호 확인 여부

    setIsPasswordVerified, // ✅ 추가됨
  } = useUserActions(userData, setEditMode);

  // 🔹 userData 변경 시 formData 업데이트 (닉네임 표시)
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      nickname: userData.nickname || '',
      currentPassword: '', // ✅ 기본값을 빈 값으로 설정
    }));
  }, [userData.nickname, setFormData]);

  return (
    <div className="container-user mt-5">
      <h2 className="text-center">
        {userData.nickname ? `${userData.nickname}님의 정보` : '회원 정보'}
      </h2>
      <form onSubmit={updateUser} className="profile-form">
        {editMode ? (
          <ProfileImg
            onSelectAvatar={setSelectedAvatar}
            currentAvatar={userData.profile_image}
          />
        ) : (
          <div className="text-center">
            <Avatar
              name={userData.profile_image || 'Default Avatar'}
              variant="beam"
              size={150}
              colors={['#0db2ac', '#f5dd7e', '#fc8d4d', '#fc694d', '#faba32']}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">이메일</label>
          <input
            type="text"
            name="email"
            value={userData.email}
            className="form-control readonly-style"
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="form-control"
            disabled={!editMode}
          />
        </div>

        {editMode && (
          <>
            <div className="mb-3">
              <label className="form-label">현재 비밀번호</label>
              <div className="input-group">
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={e => {
                    handleChange(e);
                    // ✅ 현재 비밀번호가 변경될 때 검증 초기화
                    setFormData(prev => ({
                      ...prev,
                      isPasswordVerified: false,
                    }));
                  }}
                  className={`form-control ${
                    currentPasswordError ? 'is-invalid' : ''
                  }`}
                  placeholder="현재 비밀번호 입력"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={verifyCurrentPassword}
                  disabled={!formData.currentPassword.trim()} // ✅ 비밀번호가 입력되지 않으면 확인 불가
                >
                  확인
                </button>
              </div>
              {currentPasswordError && (
                <div className="invalid-feedback">
                  현재 비밀번호가 틀렸습니다.
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">새 비밀번호</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="새 비밀번호 입력"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">새 비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                placeholder="새 비밀번호 다시 입력"
              />
              {passwordError && (
                <div className="invalid-feedback">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </div>
          </>
        )}

        {!editMode ? (
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => setEditMode(true)}
          >
            수정하기
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={!isPasswordVerified} // ✅ 비밀번호 확인되지 않으면 저장 불가
            >
              저장
            </button>
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={() => setEditMode(false)}
            >
              취소
            </button>
          </>
        )}
      </form>
    </div>
  );
}

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { selectIsLoggedIn, selectAuthProvider } from '../../store/authSlice';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import ProfileImg from '../LoginComp/ProfileImg';
// import Avatar from 'boring-avatars';

// export default function UserUpdate() {
//   const isLoggedIn = useSelector(selectIsLoggedIn);
//   const authProvider = useSelector(selectAuthProvider);

//   const [userData, setUserData] = useState({
//     profile_image: '',
//     nickname: '',
//     email: '',
//   });

//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     nickname: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });

//   const [selectedAvatar, setSelectedAvatar] = useState('');
//   const [passwordError, setPasswordError] = useState(false);
//   const [currentPasswordError, setCurrentPasswordError] = useState(false);
//   const [isPasswordVerified, setIsPasswordVerified] = useState(false); // ✅ 비밀번호 검증 상태

//   useEffect(() => {
//     if (!isLoggedIn) return;

//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('/v1/user/info', {
//           withCredentials: true,
//         });

//         if (response.data.status === 'SUCCESS') {
//           const user = response.data.data;

//           setUserData({
//             profile_image: user.profile_image || 'Mary Roebling',
//             nickname: user.nickname,
//             email: user.email,
//           });

//           setFormData({
//             nickname: user.nickname,
//             currentPassword: '',
//             newPassword: '',
//             confirmPassword: '',
//           });

//           setSelectedAvatar(user.profile_image || 'Mary Roebling');
//         } else {
//           console.error('사용자 정보 조회 실패:', response.data.message);
//         }
//       } catch (error) {
//         console.error('API 요청 실패:', error);
//       }
//     };

//     fetchUserData();
//   }, [isLoggedIn]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setFormData(prevState => {
//       const updatedData = { ...prevState, [name]: value };

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

//   // ✅ 현재 비밀번호 검증 (로그인 API 활용)
//   const verifyCurrentPassword = async () => {
//     try {
//       const response = await axios.post('/v1/user/login', {
//         email: userData.email, // 현재 로그인된 이메일 사용
//         password_hash: formData.currentPassword, // 사용자가 입력한 현재 비밀번호
//       });

//       if (response.data.status === 'SUCCESS') {
//         setIsPasswordVerified(true);
//         setCurrentPasswordError(false);
//         alert('비밀번호가 확인되었습니다.');
//       } else {
//         setIsPasswordVerified(false);
//         setCurrentPasswordError(true);
//         alert('현재 비밀번호가 틀렸습니다.');
//       }
//     } catch (error) {
//       console.error('비밀번호 확인 실패:', error);
//       setIsPasswordVerified(false);
//       setCurrentPasswordError(true);
//       alert('비밀번호 확인 중 오류가 발생했습니다.');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (passwordError) {
//       alert('새 비밀번호가 일치하지 않습니다.');
//       return;
//     }

//     if (authProvider !== 'kakao' && !isPasswordVerified) {
//       alert('현재 비밀번호를 확인해주세요.');
//       return;
//     }
//     // ✅ 비밀번호 유효성 검사 추가
//     const passwordRegex = /^[A-Za-z\d\W_]{8,16}$/;
//     if (formData.newPassword && !passwordRegex.test(formData.newPassword)) {
//       alert(
//         '비밀번호는 8~16자이며, 영어, 숫자, 특수문자로 구성할 수 있습니다.',
//       );
//       return;
//     }
//     try {
//       const updatedData: any = {
//         nickname: formData.nickname,
//         profile_image: selectedAvatar,
//       };

//       if (formData.newPassword) {
//         updatedData.password = formData.newPassword;
//       }

//       const response = await axios.put('/v1/user/info', updatedData, {
//         withCredentials: true,
//       });

//       if (response.data.status === 'SUCCESS') {
//         alert('사용자 정보가 성공적으로 업데이트되었습니다.');
//         setUserData(prev => ({ ...prev, profile_image: selectedAvatar }));
//         setEditMode(false);
//       } else {
//         alert('수정 실패: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('사용자 정보 수정 실패:', error);
//       alert('서버 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center">{userData.nickname}님의 정보</h2>
//       <form onSubmit={handleSubmit} className="profile-form">
//         {/* ✅ 프로필 사진 - 확인 단계에서는 변경 불가, 수정 단계에서는 변경 가능 */}
//         {editMode ? (
//           <ProfileImg
//             onSelectAvatar={setSelectedAvatar}
//             currentAvatar={userData.profile_image}
//           />
//         ) : (
//           <div className="text-center">
//             <Avatar
//               name={userData.profile_image}
//               variant="beam"
//               size={150}
//               colors={['#0db2ac', '#f5dd7e', '#fc8d4d', '#fc694d', '#faba32']}
//             />
//           </div>
//         )}

//         <div className="mb-3">
//           <label className="form-label">이메일</label>
//           <input
//             type="text"
//             name="email"
//             value={userData.email}
//             className="form-control readonly-style"
//             readOnly
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">닉네임</label>
//           <input
//             type="text"
//             name="nickname"
//             value={formData.nickname}
//             onChange={handleChange}
//             className="form-control"
//             disabled={!editMode}
//           />
//         </div>

//         {editMode && authProvider !== 'kakao' && (
//           <>
//             <div className="mb-3">
//               <label className="form-label">현재 비밀번호</label>
//               <div className="input-group">
//                 <input
//                   type="password"
//                   name="currentPassword"
//                   value={formData.currentPassword}
//                   onChange={handleChange}
//                   className={`form-control ${
//                     currentPasswordError ? 'is-invalid' : ''
//                   }`}
//                   placeholder="현재 비밀번호 입력"
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-outline-secondary"
//                   onClick={verifyCurrentPassword}
//                 >
//                   확인
//                 </button>
//               </div>
//               {currentPasswordError && (
//                 <div className="invalid-feedback">
//                   현재 비밀번호가 틀렸습니다.
//                 </div>
//               )}
//             </div>

//             <div className="mb-3">
//               <label className="form-label">새 비밀번호</label>
//               <input
//                 type="password"
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="새 비밀번호 입력"
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">새 비밀번호 확인</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`form-control ${passwordError ? 'is-invalid' : ''}`}
//                 placeholder="새 비밀번호 다시 입력"
//               />
//               {passwordError && (
//                 <div className="invalid-feedback">
//                   비밀번호가 일치하지 않습니다.
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {!editMode ? (
//           <button
//             type="button"
//             className="btn btn-primary w-100"
//             onClick={() => setEditMode(true)}
//           >
//             수정하기
//           </button>
//         ) : (
//           <>
//             <button type="submit" className="btn btn-success w-100">
//               저장
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary w-100 mt-2"
//               onClick={() => setEditMode(false)}
//             >
//               취소
//             </button>
//           </>
//         )}
//       </form>
//     </div>
//   );
// }
