// SignUp.tsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Form,
  Container,
  Col,
  Row,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import ServerMessage from './ServerMessage';
import TransitionComp from './TransitionComp';
import ProfileImg from './ProfileImg';

export default function SignUp() {
  const [selectedAvatar, setSelectedAvatar] = useState('Mary Roebling');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState(''); // 닉네임 메시지 상태
  const [emailMessage, setEmailMessage] = useState(''); // 이메일 메시지 상태
  const [allMessage, setAllMessage] = useState(''); // 전체 메시지 상태
  const [checkStatus, setCheckStatus] = useState<'SUCCESS' | 'ERROR'>(
    'SUCCESS',
  );
  const [loginType, setLoginType] = useState<'LOGIN' | 'SIGN UP'>('SIGN UP');

  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const checkNickname = async () => {
    if (!nickname) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/user/check-name?nickname=${nickname}`,
      );
      // setCheckStatus(response.data.status);
      setNicknameMessage(response.data.message);

      if (response.data.status === 'SUCCESS') {
        setIsNicknameChecked(true); // ✅ 중복 확인 완료
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

  const checkEmail = async () => {
    if (!email) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/user/check-email?email=${email}`,
      );
      // setCheckStatus(response.data.status);
      setEmailMessage(response.data.message);

      if (response.data.status === 'SUCCESS') {
        setIsEmailChecked(true); // ✅ 중복 확인 완료
      } else {
        setIsEmailChecked(false);
        emailRef.current?.focus();
      }
    } catch (error) {
      console.error('이메일 중복 검사 실패:', error);
      setEmailMessage('서버 오류가 발생했습니다. 관리자에게 문의하세요.');
      setIsEmailChecked(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNicknameMessage('');
    setEmailMessage('');
    setAllMessage('');

    // ✅ 중복 확인 여부 체크 후 alert 띄우기
    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      nicknameRef.current?.focus();
      return;
    }
    if (!isEmailChecked) {
      alert('이메일 중복 확인을 해주세요.');
      emailRef.current?.focus();
      return;
    }

    // ✅ 필수 입력값 체크
    if (!email || !password || !nickname) {
      setAllMessage('이메일, 비밀번호, 닉네임을 모두 입력해주세요.');
      // setCheckStatus('ERROR');
      if (!nickname) nicknameRef.current?.focus();
      else if (!email) emailRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    // ✅ 비밀번호 유효성 검사
    const passwordRegex = /^[A-Za-z\d\W_]{8,16}$/;
    if (!passwordRegex.test(password)) {
      alert(
        '비밀번호는 8~16자이며, 영어, 숫자, 특수문자로 구성할 수 있습니다.',
      );
      passwordRef.current?.focus();
      return;
    }

    const userData = {
      profile_image: selectedAvatar,
      nickname,
      email,
      password_hash: password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/user/join`,
        userData,
        { headers: { 'Content-Type': 'application/json' } },
      );
      console.log(response.data);

      if (response.data.status === 'ERROR') {
        setAllMessage(response.data.message);
        if (allMessage.includes('이메일')) {
          emailRef.current?.focus();
        } else if (allMessage.includes('비번')) {
          passwordRef.current?.focus();
        } else if (allMessage.includes('닉네임')) {
          nicknameRef.current?.focus();
        } else if (allMessage.includes('가입된 사용자')) {
          alert(setAllMessage);
        }
        return;
      }

      alert('회원가입이 성공되었습니다.');
      navigate('/v1/user/login'); // 메인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      setAllMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-4"
      style={{ paddingTop: '80px' }} // 기본 paddingTop 설정
    >
      <Row className="w-100 justify-content-center g-3">
        {/* 회원가입 카드 */}
        <Col xs={12} md={5} className="d-flex justify-content-center px-3">
          <div className="card p-4 w-100" style={{ maxWidth: '500px' }}>
            <h3 className="text-center fw-bold">SIGN UP</h3>
            <hr />
            <Form onSubmit={handleSubmit}>
              <ProfileImg
                onSelectAvatar={setSelectedAvatar}
                currentAvatar={selectedAvatar}
              />

              <Form.Group controlId="nickname" className="mt-3 mb-3">
                <Form.Label>Nickname</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={nickname}
                    onChange={e => {
                      setNickname(e.target.value);
                      setNicknameMessage('');
                      setIsNicknameChecked(false);
                    }}
                    ref={nicknameRef}
                  />
                  <Button variant="outline-primary" onClick={checkNickname}>
                    중복 확인
                  </Button>
                </InputGroup>
                {nicknameMessage && (
                  <ServerMessage errorMessage={nicknameMessage} />
                )}
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setEmailMessage('');
                      setIsEmailChecked(false);
                    }}
                    ref={emailRef}
                  />
                  <Button variant="outline-primary" onClick={checkEmail}>
                    중복 확인
                  </Button>
                </InputGroup>
                {emailMessage && <ServerMessage errorMessage={emailMessage} />}
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>
                  Password{' '}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip>
                        비밀번호는 8~16자이며 영어, 숫자, 특수문자로 구성할 수
                        있습니다.
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon
                      icon={faCircleQuestion}
                      style={{ cursor: 'pointer', marginLeft: '5px' }}
                    />
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  ref={passwordRef}
                />
                {allMessage && <ServerMessage errorMessage={allMessage} />}
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                가입하기
              </Button>
            </Form>
          </div>
        </Col>

        {/* 로그인 카드 */}
        <Col
          xs={12}
          md={5}
          className="d-flex justify-content-center align-items-center px-3 mt-4 mt-md-0"
        >
          <div className="card p-4 w-100" style={{ maxWidth: '500px' }}>
            <TransitionComp loginType={loginType} setLoginType={setLoginType} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
