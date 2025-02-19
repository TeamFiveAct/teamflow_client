import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileImg from '../LoginComp/ProfileImg';

export default function MyPage() {
  const [userData, setUserData] = useState({
    profile_image: 'Mary Roebling',
    nickname: '',
    email: '',
    auth_provider: '', // ✅ 로그인 방식 (카카오 or 일반)
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [selectedAvatar, setSelectedAvatar] = useState(userData.profile_image);
  const [passwordError, setPasswordError] = useState(false);

  // ✅ 사용자 정보 요청 (REST API 사용)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/v1/user', { withCredentials: true });

        if (response.data.status === 'SUCCESS') {
          const userData = response.data.data;

          setUserData(userData);
          setFormData({
            nickname: userData.nickname,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setSelectedAvatar(userData.profile_image || 'Mary Roebling');
        } else {
          console.error('사용자 정보 조회 실패:', response.data.message);
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
      }
    };

    fetchUserData();
  }, []);

  // ✅ 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'newPassword') {
      setPasswordError(e.target.value !== formData.confirmPassword);
    }
    if (e.target.name === 'confirmPassword') {
      setPasswordError(e.target.value !== formData.newPassword);
    }
  };

  // ✅ 프로필 이미지 변경 핸들러
  const handleAvatarSelect = (name: string) => {
    setSelectedAvatar(name);
  };

  // ✅ 사용자 정보 수정 요청 (REST API 사용)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) return;

    if (userData.auth_provider !== 'kakao' && !formData.currentPassword) {
      alert('현재 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const updatedData: any = {
        nickname: formData.nickname,
        profile_image: selectedAvatar,
      };

      if (formData.newPassword) {
        updatedData.password = formData.newPassword;
      }

      const response = await axios.patch('/v1/user', updatedData, {
        withCredentials: true,
      });

      if (response.data.status === 'SUCCESS') {
        alert('사용자 정보가 성공적으로 업데이트되었습니다.');
        setEditMode(false);
      } else {
        alert('수정 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">마이페이지</h2>
      <div className="profile-container">
        <form onSubmit={handleSubmit} className="profile-form">
          <ProfileImg onSelectAvatar={handleAvatarSelect} />

          {/* ✅ 이메일 (카카오 로그인일 경우 '카카오 회원입니다' 문구) */}
          <div className="mb-3">
            <label className="form-label">이메일</label>
            <input
              type="text"
              name="email"
              value={
                userData.auth_provider === 'kakao'
                  ? '카카오 회원입니다.'
                  : userData.email
              }
              className="form-control readonly-style"
              readOnly
            />
          </div>

          {/* ✅ 닉네임 입력 */}
          <div className="mb-3">
            <label className="form-label">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className={`form-control ${!editMode ? 'readonly-style' : ''}`}
              disabled={!editMode}
            />
          </div>

          {/* ✅ 카카오 로그인 사용자는 비밀번호 변경 불가능 */}
          {userData.auth_provider !== 'kakao' && editMode && (
            <>
              <div className="mb-3">
                <label className="form-label">현재 비밀번호</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="현재 비밀번호 입력"
                />
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
                  className={`form-control ${
                    passwordError ? 'is-invalid' : ''
                  }`}
                  placeholder="새 비밀번호 다시 입력"
                  disabled={!formData.newPassword}
                />
                {passwordError && (
                  <div className="invalid-feedback">
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </div>
            </>
          )}

          {/* ✅ 수정 / 저장 / 취소 버튼 */}
          {!editMode ? (
            <button
              className="btn btn-primary w-100"
              onClick={() => setEditMode(true)}
            >
              수정하기
            </button>
          ) : (
            <div className="d-flex">
              <button
                type="submit"
                className="btn btn-success flex-grow-1"
                disabled={passwordError}
              >
                저장
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setEditMode(false)}
              >
                취소
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
