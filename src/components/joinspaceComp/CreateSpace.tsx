import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

interface CreateRoomModalProps {
  show: boolean;
  onClose: () => void;
}

export default function CreateSpace({ show, onClose }: CreateRoomModalProps) {
  const [projectName, setProjectName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [spacePassword, setSpacePassword] = useState('');

  const handleCreateProject = () => {
    // 서버로 프로젝트 생성 요청 (예시)
    console.log('프로젝트명:', projectName);
    console.log('스페이스 패스워드:', spacePassword);
    // 프로젝트 생성 후, 해당 유저의 방 리스트에 추가하는 로직 필요

    // 모달 닫기
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>프로젝트 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="spaceName">
            <Form.Label>
              <p>생성할 프로젝트를 작성해주세요..</p>
              <p>프로젝트 이름</p>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="프로젝트 이름을 입력하세요."
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="spaceDescription" className="mt-3">
            <Form.Label>프로젝트 설명</Form.Label>
            <Form.Control
              type="text"
              placeholder="프로젝트에 대한 설명을 입력하세요."
              value={spaceDescription}
              onChange={e => setSpaceDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="spaceDescription" className="mt-3">
            <Form.Label>참여코드 설정</Form.Label>
            <Form.Control
              type="text"
              placeholder="프로젝트에 대한 설명을 입력하세요."
              value={spacePassword}
              onChange={e => setSpacePassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleCreateProject}>
          생성
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
