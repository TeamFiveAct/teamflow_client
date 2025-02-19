// SignUpForm.tsx
import React from 'react';
import { Form } from 'react-bootstrap';

// props 타입 정의
interface SignUpFormProps {
  nickname: string;
  email: string;
  password: string;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const SignUpForm = ({
  nickname,
  email,
  password,
  setNickname,
  setEmail,
  setPassword,
}: SignUpFormProps) => {
  return (
    <>
      <Form.Group controlId="nickname" className="mt-3 mb-3">
        <Form.Label>Nickname</Form.Label>
        <Form.Control
          type="text"
          placeholder="닉네임을 작성해주세요"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="example@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Group>
    </>
  );
};

export default SignUpForm;
