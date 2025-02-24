import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileImg from '../LoginComp/ProfileImg';
import Avatar from 'boring-avatars';
import axios from 'axios';
import useUserData from '../../hooks/useUserData';
import useUserActions from '../../hooks/useUserActions';
import useAuthActions from '../../hooks/useAuthActions';
import '../../style/myprofile/myProfile.scss';

export default function UserUpdate() {
  const { handleDeleteAccount } = useAuthActions();
  const { userData, editMode, setEditMode } = useUserData();
  const {
    formData,
    setFormData,
    handleChange,
    verifyCurrentPassword,
    selectedAvatar,
    setSelectedAvatar,
    passwordError,
    currentPasswordError,
    isPasswordVerified,
    setIsPasswordVerified,
  } = useUserActions(userData, setEditMode);

  const [nicknameMessage, setNicknameMessage] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const nicknameRef = useRef<HTMLInputElement>(null);

  // ✅ userData 변경 시 formData 업데이트
  useEffect(() => {
    if (!editMode) {
      setFormData({
        nickname: userData.nickname || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSelectedAvatar(userData.profile_image || '');
    }
  }, [userData, editMode, setFormData, setSelectedAvatar]);

  // ✅ 닉네임 중복 확인 함수
  const checkNickname = async () => {
    if (!formData.nickname) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/user/check-name?nickname=${formData.nickname}`,
      );
      setNicknameMessage(response.data.message);

      if (response.data.status === 'SUCCESS') {
        setIsNicknameChecked(true);
      } else {
        setIsNicknameChecked(false);
        nicknameRef.current?.focus();
      }
    } catch (error) {
      console.error('닉네임 중복 검사 실패:', error);
      setNicknameMessage('서버 오류가 발생했습니다. 관리자에게 문의하세요.');
      setIsNicknameChecked(false);
    }
  };

  // ✅ 변경된 값만 서버에 전송
  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: Record<string, any> = {};

    if (formData.nickname !== userData.nickname) {
      if (!isNicknameChecked) {
        alert('닉네임 중복 확인을 해주세요.');
        nicknameRef.current?.focus();
        return;
      }
      updatedData.nickname = formData.nickname;
    }

    if (selectedAvatar !== userData.profile_image) {
      updatedData.profile_image = selectedAvatar;
    }

    if (formData.newPassword) {
      if (!isPasswordVerified) {
        alert('현재 비밀번호를 확인해주세요.');
        return;
      }
      updatedData.password = formData.newPassword;
    }

    if (Object.keys(updatedData).length === 0) {
      alert('변경된 사항이 없습니다.');
      return;
    }

    if (!isPasswordVerified) {
      alert('현재 비밀번호를 확인해주세요.');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_SERVER}/user/info`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

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
    <div className="container-user mt-5">
      <h2 className="text-center">
        {userData.nickname ? `${userData.nickname}님의 정보` : '회원 정보'}
      </h2>
      <form onSubmit={updateUser} className="profile-form">
        {editMode ? (
          <ProfileImg
            onSelectAvatar={setSelectedAvatar}
            currentAvatar={selectedAvatar}
          />
        ) : (
          <div className="text-center">
            <Avatar
              name={selectedAvatar || 'Default Avatar'}
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
          <div className="input-group">
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={e => {
                handleChange(e);
                setNicknameMessage('');
                setIsNicknameChecked(false);
              }}
              className="form-control"
              disabled={!editMode}
              ref={nicknameRef}
            />
            {editMode && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={checkNickname}
              >
                중복 확인
              </button>
            )}
          </div>
          {nicknameMessage && (
            <div className={`text-${isNicknameChecked ? 'success' : 'danger'}`}>
              {nicknameMessage}
            </div>
          )}
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
                  onChange={handleChange}
                  className="form-control"
                  placeholder="현재 비밀번호 입력"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={verifyCurrentPassword}
                  disabled={!formData.currentPassword.trim()}
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

            {formData.newPassword && (
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
                />
                {passwordError && (
                  <div className="invalid-feedback">
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </div>
            )}
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
      <div className="d-flex justify-content-end mt-3">
        <a
          href="#"
          className="delete-account text-danger"
          onClick={e => {
            e.preventDefault();
            if (window.confirm('정말 회원탈퇴를 진행하시겠습니까?')) {
              handleDeleteAccount();
            }
          }}
        >
          회원탈퇴
        </a>
      </div>
    </div>
  );
}
