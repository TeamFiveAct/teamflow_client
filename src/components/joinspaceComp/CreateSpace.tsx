import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface CreateRoomModalProps {
  show: boolean;
  onClose: () => void;
}

export default function CreateSpace({ show, onClose }: CreateRoomModalProps) {
  const [projectName, setProjectName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [spacePassword, setSpacePassword] = useState('');
  const navigate = useNavigate();

  const handleCreateProject = async () => {
    console.log('프로젝트명:', projectName);
    console.log('스페이스 패스워드:', spacePassword);
    // const userID = sessionStorage.getItem('user_id');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace`,
        {
          space_title: projectName,
          space_description: spaceDescription,
          space_password: spacePassword,
        },
        { withCredentials: true },
      );
      console.log(response.data);
      if (response.data.status === 'SUCCESS') {
        alert(`워크스페이스의 비밀번호는 ${response.data.data.message}입니다!`);
      } else {
        alert(response.data.message);
        if (response.data.message.includes('생성에 실패')) {
          navigate('/v1/workspace');
        } else if (response.data.message.includes('로그인')) {
          navigate('/v1/user/login');
        }
      }
    } catch (error) {
      alert('로그인 기간이 만료되었습니다. 다시 로그인 해주세요.');
      navigate('/v1/user/login'); // 로그인 페이지로 이동
    }
    //  try {
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
    // 모달 닫기
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>프로젝트 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="spaceName">
            <Form.Label>
              <p>생성할 프로젝트를 작성해주세요..</p>
              <span>프로젝트 이름</span>
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
              placeholder="프로젝트의 설명을 입력하세요."
              value={spaceDescription}
              onChange={e => setSpaceDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="spaceDescription" className="mt-3">
            <Form.Label>스페이스 비밀번호 설정</Form.Label>
            <Form.Control
              type="text"
              placeholder="비밀번호를 설정해주세요."
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
