// SignUp.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Col, Row } from 'react-bootstrap';
import ProfileImg from './ProfileImg';
import TransitionComp from './TransitionComp';
import ErrorMessage from './ErrorMessage'; // ErrorMessage 컴포넌트 import

export default function SignUp() {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 전체 에러 메시지
  const [nicknameError, setNicknameError] = useState(''); // 닉네임 에러 메시지
  const [emailError, setEmailError] = useState(''); // 이메일 에러 메시지
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 에러 메시지
  const [loginType, setLoginType] = useState<'LOGIN' | 'SIGN UP'>('SIGN UP');

  const navigate = useNavigate();
  // 에러 발생 시 포커스를 줄 ref
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);

  // 닉네임 중복 검사
  const checkNickname = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/user/check-name?nickname=${nickname}`,
      );
      if (response.data.status === 'ERROR') {
        setNicknameError(response.data.message);
        nicknameRef.current?.focus();
      } else {
        setNicknameError('');
      }
    } catch (error) {
      console.error('닉네임 중복 검사 실패:', error);
      setNicknameError('서버 오류가 발생했습니다.');
    }
  };

  // 이메일 중복 검사
  const checkEmail = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/user/check-email?email=${email}`,
      );
      if (response.data.status === 'ERROR') {
        setEmailError(response.data.message);
        emailRef.current?.focus();
      } else {
        setEmailError('');
      }
    } catch (error) {
      console.error('이메일 중복 검사 실패:', error);
      setEmailError('서버 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 방지
    setErrorMessage(''); // 전체 에러 초기화

    const userData = {
      profile_image: selectedAvatar,
      nickname,
      email,
      password_hash: password, // 서버의 필드명에 맞춤
    };

    // 빈 값 체크
    if (!email || !password || !nickname) {
      setErrorMessage('이메일, 비밀번호, 닉네임을 모두 입력해주세요.');
      if (!nickname) nicknameRef.current?.focus();
      else if (!email) emailRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/user/join`,
        userData,
        { headers: { 'Content-Type': 'application/json' } },
      );

      console.log('서버 응답:', response.data);

      if (response.data.status === 'ERROR') {
        setErrorMessage(response.data.message);

        // 포커스 이동: 에러 내용에 따라 적절한 input에 포커스
        if (response.data.message.includes('이메일')) {
          emailRef.current?.focus();
        } else if (response.data.message.includes('비번')) {
          passwordRef.current?.focus();
        } else if (response.data.message.includes('닉네임')) {
          nicknameRef.current?.focus();
        }
        return;
      }

      // 회원가입 성공
      alert('회원가입이 성공되었습니다.');
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    if (nickname) checkNickname();
    if (email) checkEmail();
  }, [nickname, email]);

  return (
    <section
      className="d-flex justify-content-center align-items-center px-0 mt-4"
      style={{ height: '100vh' }}
    >
      <Container className="px-0">
        <Row className="d-flex flex-row w-100">
          {/* SignUp 폼 */}
          <Col
            md={6}
            className="d-flex justify-content-center"
            style={{ height: '650px' }}
          >
            <div
              className="card p-4"
              style={{ maxWidth: '600px', width: '100%' }}
            >
              <h3 className="text-center fw-bold">SIGN UP</h3>
              <hr style={{ width: '100%', border: '1px solid black' }} />
              <div>
                <Form onSubmit={handleSubmit} className="mt-3">
                  <ProfileImg onSelectAvatar={setSelectedAvatar} />

                  <Form.Group controlId="nickname" className="mt-3 mb-3">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="닉네임을 작성해주세요"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      ref={nicknameRef} // 포커스 이동을 위한 ref
                    />
                  </Form.Group>
                  {/* ErrorMessage 컴포넌트를 사용하여 닉네임 에러 메시지 표시 */}
                  <ErrorMessage error={nicknameError} />

                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      ref={emailRef} // 포커스 이동을 위한 ref
                    />
                  </Form.Group>
                  {/* ErrorMessage 컴포넌트를 사용하여 이메일 에러 메시지 표시 */}
                  <ErrorMessage error={emailError} />

                  <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="비밀번호를 입력하세요."
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      ref={passwordRef} // 포커스 이동을 위한 ref
                    />
                  </Form.Group>
                  {/* ErrorMessage 컴포넌트를 사용하여 전체 에러 메시지 표시 */}
                  <ErrorMessage error={errorMessage} />

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    가입하기
                  </Button>
                </Form>
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
