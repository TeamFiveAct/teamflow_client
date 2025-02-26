import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PasswordModal from './PasswordModal';

interface CreateRoomModalProps {
  show: boolean;
  onClose: () => void;
  refreshSpaces: () => void; // 부모 콜백
}

const CreateSpace = ({
  show,
  onClose,
  refreshSpaces,
}: CreateRoomModalProps) => {
  const [projectName, setProjectName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const navigate = useNavigate();
  const [passwordModalShow, setPasswordModalShow] = useState(false);
  const [uniquePassword, setUniquePassword] = useState('');

  const handleCreateProject = async () => {
    console.log('프로젝트명:', projectName);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace`,
        {
          space_title: projectName,
          space_description: spaceDescription,
        },
        { withCredentials: true },
      );
      console.log(response.data);
      if (response.data.status === 'SUCCESS') {
        const password = response.data.data.space_password;
        setUniquePassword(password);
        setPasswordModalShow(true); // 모달을 표시

        refreshSpaces();
      } else {
        if (response.data.message.includes('생성에 실패')) {
          alert(response.data.message);
          navigate('/v1/mySpace');
        } else if (response.data.message.includes('로그인')) {
          alert(response.data.message);
          navigate('/v1/user/login');
        }
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <>
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

      {/* 비밀번호 모달 표시 */}
      <PasswordModal
        show={passwordModalShow}
        onClose={() => setPasswordModalShow(false)}
        password={uniquePassword}
      />
    </>
  );
};

export default CreateSpace;

// // CreateSpace.tsx
// // CreateSpace.tsx

// import React, { useState } from 'react';
// import { Modal, Form, Button } from 'react-bootstrap';
// import PasswordModal from './PasswordModal';
// import axios from 'axios';

// interface CreateRoomModalProps {
//   show: boolean;
//   onClose: () => void;
//   refreshSpaces: () => void;
// }

// const CreateSpace = ({
//   show,
//   onClose,
//   refreshSpaces,
// }: CreateRoomModalProps) => {
//   const [projectName, setProjectName] = useState('');
//   const [spaceDescription, setSpaceDescription] = useState('');
//   const [passwordModalShow, setPasswordModalShow] = useState(false);
//   const [uniquePassword, setUniquePassword] = useState('');

//   const handleCreateProject = async () => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_SERVER}/workspace`,
//         {
//           space_title: projectName,
//           space_description: spaceDescription,
//         },
//         { withCredentials: true },
//       );
//       if (response.data.status === 'SUCCESS') {
//         setUniquePassword(response.data.data.space_password);
//         setPasswordModalShow(true); // 비밀번호 모달을 표시
//         refreshSpaces();
//       } else {
//         alert(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//     onClose();
//   };

//   return (
//     <>
//       <Modal show={show} onHide={onClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>프로젝트 생성</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="spaceName">
//               <Form.Label>프로젝트 이름</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="프로젝트 이름을 입력하세요."
//                 value={projectName}
//                 onChange={e => setProjectName(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group controlId="spaceDescription" className="mt-3">
//               <Form.Label>프로젝트 설명</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="프로젝트 설명을 입력하세요."
//                 value={spaceDescription}
//                 onChange={e => setSpaceDescription(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={onClose}>
//             취소
//           </Button>
//           <Button variant="primary" onClick={handleCreateProject}>
//             생성
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* 비밀번호 모달 */}
//       <PasswordModal
//         show={passwordModalShow}
//         onClose={() => setPasswordModalShow(false)}
//         password={uniquePassword}
//         container={document.body} // 최상위 body에 렌더링
//       />
//     </>
//   );
// };

// export default CreateSpace;
