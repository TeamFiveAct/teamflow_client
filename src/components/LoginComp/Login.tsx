import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Col, Row } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ServerMessage from './ServerMessage';
import TransitionComp from './TransitionComp';
import { useDispatch } from 'react-redux';
import { login, setSessionStatus } from '../../store/modules/checkSessionSlice';

export default function Login() {
  // 로그인 관련 상태들
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'LOGIN' | 'SIGN UP'>('LOGIN');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [allMessage, setAllMessage] = useState('');
  const [checkStatus, setCheckStatus] = useState<'SUCCESS' | 'ERROR'>('SUCCESS');

  // 비밀번호 재설정 모드 상태 및 관련 변수
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const resetEmailRef = useRef<HTMLInputElement>(null);

  // 로그인 처리 함수 (기존 로직 그대로)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailMessage('');
    setPasswordMessage('');
    setAllMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/user/login`,
        {
          email,
          password_hash: password,
        },
        { withCredentials: true },
      );

      const { status, message } = response.data;
      setCheckStatus(status);

      if (status === 'ERROR') {
        if (message.includes('가입된 사용자')) {
          setEmailMessage(message);
          emailRef.current?.focus();
        } else if (message.includes('비밀번호')) {
          setPasswordMessage(message);
          passwordRef.current?.focus();
        } else {
          setAllMessage(message);
        }
      } else if (status === 'SUCCESS') {
        console.log('로그인 성공:', response.data);
        dispatch(login(response.data.data.nickname));
        dispatch(setSessionStatus(true));
        
        // 리디렉션 처리: 이전에 접근하려던 페이지가 있으면 해당 페이지로, 없으면 기본 페이지로
        const from = location.state?.from?.pathname || '/v1/mySpace';
        navigate(from, { replace: true });
      }
    } catch (error) {
      setAllMessage('로그인 중 오류가 발생했습니다.');
      console.error('로그인 오류:', error);
    }
  };

  // 비밀번호 재설정 요청 함수
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setResetMessage('');
    setResetError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/user/request-reset`,
        { email: resetEmail }
      );
      const { status, message } = response.data;
      if (status === 'SUCCESS') {
        setResetMessage('재설정 링크가 이메일로 발송되었습니다.');
      } else {
        setResetError(message || '비밀번호 재설정 요청에 실패했습니다.');
      }
    } catch (error) {
      setResetError('비밀번호 재설정 요청 중 오류가 발생했습니다.');
      console.error('비밀번호 재설정 오류:', error);
    }
  };

  return (
    <section
      className="d-flex justify-content-center align-items-center px-0 mt-4"
      style={{ height: '100vh' }}
    >
      <Container className="px-0">
        <Row className="d-flex flex-row w-100">
          {/* 왼쪽 영역: 로그인 폼 또는 비밀번호 재설정 폼 */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            style={{ height: '500px' }}
          >
            <div
              className="card p-4 d-flex flex-column justify-content-center"
              style={{ maxWidth: '500px', width: '100%', height: '100%' }}
            >
              {isResetMode ? (
                // 비밀번호 재설정 요청 컴포넌트
                <>
                  <h3 className="text-center fw-bold">비밀번호 재설정</h3>
                  <hr style={{ width: '100%', border: '1px solid black' }} />
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '100%' }}
                  >
                    <Form onSubmit={handlePasswordReset} style={{ width: '100%' }}>
                      <Form.Group controlId="resetEmail" className="mb-5">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="example@example.com"
                          value={resetEmail}
                          ref={resetEmailRef}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </Form.Group>

                      {resetMessage && <ServerMessage errorMessage={resetMessage} />}
                      {resetError && <ServerMessage errorMessage={resetError} />}

                      <Button variant="primary" type="submit" className="w-100 mb-2">
                        재설정 링크 발송
                      </Button>
                    </Form>
                    <div className="text-center">
                      <Button
                        variant="link"
                        style={{ fontSize: '0.8rem', padding: 0 }}
                        onClick={() => setIsResetMode(false)}
                      >
                        로그인 화면으로 돌아가기
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                // 기존 로그인 폼
                <>
                  <h3 className="text-center fw-bold">LOGIN</h3>
                  <hr style={{ width: '100%', border: '1px solid black' }} />
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '100%' }}
                  >
                    <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                      <Form.Group controlId="email" className="mb-5">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="example@example.com"
                          value={email}
                          ref={emailRef}
                          onChange={e => {
                            setEmail(e.target.value);
                            // 선택 사항: 로그인 시 입력된 이메일을 재설정 폼에도 반영
                            setResetEmail(e.target.value);
                          }}
                        />
                        {emailMessage && (
                          <ServerMessage errorMessage={emailMessage} />
                        )}
                      </Form.Group>

                      <Form.Group controlId="password" className="mb-5">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="비밀번호를 입력하세요."
                          value={password}
                          ref={passwordRef}
                          onChange={e => setPassword(e.target.value)}
                        />
                        {passwordMessage && (
                          <ServerMessage errorMessage={passwordMessage} />
                        )}
                      </Form.Group>

                      {allMessage && <ServerMessage errorMessage={allMessage} />}

                      <Button variant="primary" type="submit" className="w-100 mb-2">
                        로그인
                      </Button>

                      {/* 비밀번호 찾기 버튼: 페이지 이동없이 컴포넌트 전환 */}
                      <div className="text-center">
                        <Button
                          variant="link"
                          style={{ fontSize: '0.8rem', padding: 0 }}
                          onClick={() => setIsResetMode(true)}
                        >
                          비밀번호 찾기
                        </Button>
                      </div>
                    </Form>

                    <Button
                      variant="link"
                      href={`${process.env.REACT_APP_API_SERVER}/user/kakao-login`}
                      target="_blank"
                    >
                      <img
                        src="/assets/KakaoTalk_logo.svg"
                        alt="카카오톡 로그인"
                        className="img-fluid"
                        style={{ width: '30px', height: '30px' }}
                      />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Col>

          {/* 오른쪽 영역: TransitionComp (기존 로직 그대로) */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <div
              className="card p-4"
              style={{ maxWidth: '600px', width: '100%' }}
            >
              <TransitionComp
                loginType={loginType}
                setLoginType={setLoginType}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
