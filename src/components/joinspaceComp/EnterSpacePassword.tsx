// EnterSpacePassword.tsx
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface EnterSpacePasswordProps {
  refreshSpaces: () => void;
}

const EnterSpacePassword = ({ refreshSpaces }: EnterSpacePasswordProps) => {
  const [spacePwInput, setSpacePwInput] = useState('');
  const navigate = useNavigate();

  // 스페이스 참여 신청 후 SpaceList를 갱신할 수 있도록 부모로부터 콜백을 받을 수 있습니다.
  // 여기서는 간단하게 페이지 리로드나 SpaceList 컴포넌트 내부에서 갱신 로직을 구현할 수 있습니다.

  const handleSubmitSpacePw = async () => {
    if (!spacePwInput) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/join`,
        { space_password: spacePwInput },
        { withCredentials: true },
      );
      console.log(response.data);
      if (response.data.status === 'SUCCESS') {
        alert(
          response.data.message || '워크스페이스에 성공적으로 참여하였습니다.',
        );
        // 참여가 성공하면 페이지를 새로고침하거나 SpaceList를 재호출
        refreshSpaces();
        navigate(0);
      } else {
        alert(response.data.message || '참여에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('참여 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Form>
        <Form.Group controlId="spacePasswordInput">
          <Form.Label>
            <h5>참여할 프로젝트가 있으신가요?</h5>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="스페이스 비밀번호를 입력하세요"
            value={spacePwInput}
            onChange={e => setSpacePwInput(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Button onClick={handleSubmitSpacePw}>스페이스 참여하기</Button>
    </>
  );
};

export default EnterSpacePassword;
