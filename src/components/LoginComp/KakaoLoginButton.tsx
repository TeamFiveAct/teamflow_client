import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  login,
  setAuthProvider,
  setSessionStatus,
} from '../../store/modules/checkSessionSlice';

export default function KakaoLoginButton() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleKakaoSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // 새 팝업 창을 열고 카카오 로그인 페이지로 이동
    const popup = window.open(
      `http://localhost:8000/v1/user/kakao-login`,
      'kakaoLogin',
      'width=500,height=600',
    );
    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);
        // 팝업이 닫힌 후, 세션 상태를 확인
        dispatch(setSessionStatus(true));
        navigate('/v1/mySpace');
      }
    }, 500);
    // 부모 창에서 메시지 수신
    const messageHandler = (event: MessageEvent) => {
      // event.origin이 백엔드 도메인인지 확인 (개발 환경이므로 localhost 확인)
      if (event.origin !== 'http://localhost:8000/v1') return;
      const { status, data, message } = event.data;
      if (status === 'SUCCESS' && message.includes('성공')) {
        dispatch(login({ nickname: data.nickname, authProvider: '카카오' }));
        dispatch(setSessionStatus(true));
        dispatch(setAuthProvider('카카오'));
        navigate('/v1/mySpace');
      } else {
        alert(message || '카카오 로그인에 실패했습니다.');
        navigate('/v1/user/login');
      }
      window.removeEventListener('message', messageHandler);
      setLoading(false);
      // 팝업 닫기
      popup?.close();
    };

    window.addEventListener('message', messageHandler);
  };

  return (
    <Button variant="link" onClick={handleKakaoSubmit} disabled={loading}>
      <img
        src="/assets/KakaoTalk_logo.svg"
        alt="카카오톡 로그인"
        className="img-fluid"
        style={{ width: '30px', height: '30px' }}
      />
      {/* {loading ? '로그인 중...' : '카카오 로그인'} */}
    </Button>
  );
}
