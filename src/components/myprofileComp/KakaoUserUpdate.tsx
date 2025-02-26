import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import ProfileImg from '../LoginComp/ProfileImg';
import Avatar from 'boring-avatars';
import useUserData from '../../hooks/useUserData';
import useUserActions from '../../hooks/useUserActions';
import { RootState } from '../../store/store';

export default function KakaoUserUpdate() {
  const { userData, editMode, setEditMode } = useUserData();
  const {
    formData,
    setFormData,
    handleChange,
    updateUser,
    selectedAvatar,
    setSelectedAvatar,
  } = useUserActions(userData, setEditMode);

  // ✅ 마이페이지 진입 시 기본적으로 수정 불가 상태 유지 (editMode = false)
  React.useEffect(() => {
    setEditMode(false); // 🔹 마이페이지 들어가면 "수정하기" 버튼만 보이게 초기화
    setFormData(prev => ({
      ...prev,
      nickname: userData.nickname || '',
    }));
  }, [userData.nickname, setFormData, setEditMode]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">{userData.nickname}님의 정보</h2>
      <p className="text-center text-muted">
        카카오 계정으로 로그인하였습니다.
      </p>

      <form onSubmit={updateUser} className="profile-form">
        {/* ✅ 프로필 이미지 */}
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
            />
          </div>
        )}

        {/* ✅ 닉네임 입력 필드 (수정 불가능 상태 유지) */}
        <div className="mb-3">
          <label className="form-label">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="form-control"
            disabled={!editMode} // 🔹 초기에는 수정 불가 상태
          />
        </div>

        {/* ✅ 버튼 상태 전환 */}
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
