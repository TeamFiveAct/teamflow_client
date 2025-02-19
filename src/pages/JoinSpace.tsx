import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import CreateSpace from '../components/joinspaceComp/CreateSpace';
// import { useNavigate } from 'react-router-dom'; // 로그인 후 페이지 이동을 위한 코드 (주석처리)

export default function JoinSpace() {
  const [showModal, setShowModal] = useState(false);

  // 로그인 유효성 검사 (주석처리)
  // const navigate = useNavigate();

  const handleCreateRoom = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {/* 로그인 유효성 검사 코드 (주석처리) */}
      {/* if (!isLoggedIn) {
        navigate('/login');
        return;
      } */}

      <Button onClick={handleCreateRoom}>방 만들기</Button>

      {/* 방 만들기 모달 */}
      <CreateSpace show={showModal} onClose={handleCloseModal} />
    </div>
  );
}
