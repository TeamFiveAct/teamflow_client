import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateSpace from '../components/joinspaceComp/CreateSpace';

export default function JoinSpace() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCreateRoom = async () => {
    //   try {
    //     // 방을 생성하는 API 요청을 보냄 (로그인 상태 확인을 겸함)
    //     const response = await axios.post(
    //       '/api/workspace',
    //       {
    //         space_title: 'Test Room',
    //         space_description: 'Testing',
    //         space_password: '1234',
    //         user_id: 1,
    //       },
    //       { withCredentials: true },
    //     );

    //     if (response.data.status === 'SUCCESS') {
    //       setShowModal(true);
    //     } else {
    //       throw new Error(response.data.message);
    //     }
    //   } catch (error) {
    //     alert('로그인 기간이 만료되었습니다. 다시 로그인 해주세요.');
    //     navigate('/v1/user/login'); // 로그인 페이지로 이동
    //   }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const sessionValid = sessionStorage.getItem('session_valid');
    if (!sessionValid) {
      alert('로그인 기간이 만료되었습니다. 다시 로그인 해주세요.');
      navigate('/v1/user/login');
    }
  }, []);

  return (
    <div>
      <Button onClick={handleCreateRoom}>방 만들기</Button>
      <CreateSpace show={showModal} onClose={handleCloseModal} />
    </div>
  );
}
