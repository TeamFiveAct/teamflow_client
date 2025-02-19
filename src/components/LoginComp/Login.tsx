import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage'; // 에러 메시지 컴포넌트 import
import TransitionComp from './TransitionComp';
import { NULL } from 'sass';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(''); // 이메일 에러 메시지 상태
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 에러 메시지 상태
  const [error, setError] = useState(''); // 전체 에러 메시지
  const [loginType, setLoginType] = useState<'LOGIN' | 'SIGN UP'>('LOGIN');

  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // 로그인 처리 함수
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 제출 방지
    setError(''); // 전체 에러 초기화
    setEmailError(''); // 이메일 에러 초기화
    setPasswordError(''); // 비밀번호 에러 초기화

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/user/login`,
        {
          email,
          password_hash: password,
        },
      );

      if (response.data.status === 'ERROR') {
        const { message } = response.data;
        if (message.includes('이메일')) {
          setEmailError(message);
          emailRef.current?.focus();
        } else if (message.includes('비밀번호')) {
          setPasswordError(message);
          passwordRef.current?.focus();
        } else {
          setError(message);
        }
      } else if (response.data.status === 'SUCCESS') {
        // 로그인 성공 시 페이지 이동
        console.log('로그인 성공:', response.data);
        navigate('/'); // 메인 페이지로 이동
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
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
            style={{ height: '650px' }}
          >
            <div
              className="card p-4 d-flex flex-column justify-content-center"
              style={{ maxWidth: '600px', width: '100%', height: '100%' }}
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
                    <ErrorMessage error={emailError} />
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
                    <ErrorMessage error={passwordError} />
                  </Form.Group>

                  {/* 전체 에러 메시지 */}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Button variant="primary" type="submit" className="w-100">
                    로그인
                  </Button>
                </Form>

                <Button
                  variant="link"
                  href="http://localhost:8000/v1/user/kakao-login"
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
