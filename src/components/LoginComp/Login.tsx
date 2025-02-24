import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ServerMessage from './ServerMessage';
import TransitionComp from './TransitionComp';
import { useDispatch } from 'react-redux'; //추가한 것것
import { login, setSessionStatus } from '../../store/modules/checkSessionSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'LOGIN' | 'SIGN UP'>('LOGIN');
  const [emailMessage, setEmailMessage] = useState(''); // 이메일 메시지 상태
  const [passwordMessage, setPasswordMessage] = useState(''); // 이메일 메시지 상태
  const [allMessage, setAllMessage] = useState(''); // 전체 메시지 상태
  const [checkStatus, setCheckStatus] = useState<'SUCCESS' | 'ERROR'>(
    'SUCCESS',
  );
  const dispatch = useDispatch(); // 추가한 것
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // 로그인 처리 함수
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 제출 방지
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
        dispatch(login(response.data.data.nickname)); // 세션 발급 및 Redux 저장
        // 세션이 유효하다고 표시
        dispatch(setSessionStatus(true));
        navigate('/v1/mySpace');
      }
    } catch (error) {
      setAllMessage('로그인 중 오류가 발생했습니다.');
      console.error('로그인 오류:', error);
    }
  };

  return (
    <section
      className="d-flex justify-content-center align-items-center px-0 mt-4"
      style={{ height: '100vh' }}
    >
      <Container className="px-0">
        <Row className="d-flex flex-row w-100">
          {/* 로그인 폼 */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
            style={{ height: '500px' }}
          >
            <div
              className="card p-4 d-flex flex-column justify-content-center"
              style={{ maxWidth: '500px', width: '100%', height: '100%' }}
            >
              <h3 className="text-center fw-bold">LOGIN</h3>
              <hr style={{ width: '100%', border: '1px solid black' }} />
              <div
                className=" d-flex flex-column justify-content-center align-items-center"
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
                      onChange={e => setEmail(e.target.value)}
                    />
                    {/* 이메일 에러 메시지 */}
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
                    {/* 비밀번호 에러 메시지 */}

                    {passwordMessage && (
                      <ServerMessage errorMessage={passwordMessage} />
                    )}
                  </Form.Group>

                  {/* 전체 에러 메시지 */}
                  {allMessage && <ServerMessage errorMessage={allMessage} />}

                  <Button variant="primary" type="submit" className="w-100">
                    로그인
                  </Button>
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
            </div>
          </Col>

          {/* TransitionComp */}
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
