import React, { useEffect, useRef } from 'react';
import ClipboardJS from 'clipboard';

interface PasswordModalProps {
  show: boolean;
  onClose: () => void;
  password: string;
}

const PasswordModal = ({ show, onClose, password }: PasswordModalProps) => {
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (copyButtonRef.current) {
      const clipboard = new ClipboardJS(copyButtonRef.current, {
        text: () => password,
      });

      clipboard.on('success', () => {
        alert('비밀번호가 복사되었습니다!');
      });

      clipboard.on('error', () => {
        alert('복사에 실패했습니다.');
      });

      return () => {
        clipboard.destroy();
      };
    }
  }, [password]);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">워크스페이스 생성 완료</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            워크스페이스의 <b>비밀번호는 {password}</b> 입니다!
          </p>
          <p>비밀번호를 복사해주세요!</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" ref={copyButtonRef}>
            복사하기
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;

// PasswordModal.tsx

// import React from 'react';
// import { Modal, Button } from 'react-bootstrap';

// interface PasswordModalProps {
//   show: boolean;
//   onClose: () => void;
//   password: string;
//   container?: HTMLElement; // container 속성 추가
// }

// const PasswordModal = ({
//   show,
//   onClose,
//   password,
//   container,
// }: PasswordModalProps) => {
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(password);
//       alert('비밀번호가 복사되었습니다!');
//     } catch (err) {
//       alert('복사에 실패했습니다.');
//     }
//   };

//   return (
//     <Modal
//       show={show}
//       onHide={onClose}
//       centered
//       container={container} // container 속성 전달
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>워크스페이스 생성 완료</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p>
//           워크스페이스의 <b>비밀번호는 {password}</b> 입니다!
//         </p>
//         <p>비밀번호를 복사해주세요!</p>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleCopy}>
//           복사하기
//         </Button>
//         <Button variant="primary" onClick={onClose}>
//           확인
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default PasswordModal;
