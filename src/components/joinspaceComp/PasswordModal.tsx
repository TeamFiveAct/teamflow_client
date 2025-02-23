// PasswordModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PasswordModalProps {
  show: boolean;
  onClose: () => void;
  password: string;
}

const PasswordModal = ({ show, onClose, password }: PasswordModalProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      alert('비밀번호가 복사되었습니다!');
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>워크스페이스 생성 완료</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          워크스페이스의 <b>비밀번호는 {password}</b> 입니다!
        </p>
        <p>비밀번호를 복사해주세요!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCopy}>
          복사하기
        </Button>
        <Button variant="primary" onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PasswordModal;
