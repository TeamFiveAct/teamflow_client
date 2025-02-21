import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { selectAuthProvider } from '../../store/authSlice';
import ProfileImg from '../LoginComp/ProfileImg';
import Avatar from 'boring-avatars';
import useUserData from '../../hooks/useUserData';
import useUserActions from '../../hooks/useUserActions';

export default function KakaoUserUpdate() {
  const { userData, editMode, setEditMode } = useUserData();
  const authProvider = useSelector(selectAuthProvider); // ✅ Redux에서 가져오기
  const isKakaoUser = authProvider === 'kakao';

  const {
    formData,
    setFormData,
    handleChange,
    updateUser, // ✅ 비밀번호 검증을 안 하는 업데이트 함수
    selectedAvatar,
    setSelectedAvatar,
  } = useUserActions(userData, setEditMode);

  // 🔹 userData 변경 시 formData 업데이트 (닉네임 표시)
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      nickname: userData.nickname || '',
    }));
  }, [userData.nickname, setFormData]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">
        {userData.nickname ? `${userData.nickname}님의 정보` : '회원 정보'}
      </h2>
      <p className="text-center text-muted">
        {isKakaoUser
          ? '카카오 계정으로 로그인하였습니다.'
          : '일반 계정으로 로그인하였습니다.'}
      </p>

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

        {/* ✅ 이메일 (읽기 전용) */}
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

        {/* ✅ 닉네임 (수정 가능) */}
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

        {/* ✅ 비밀번호 입력 필드 없음 */}

        {/* ✅ 수정하기 버튼 / 저장 + 취소 버튼 */}
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
            <button type="submit" className="btn btn-success w-100">
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
