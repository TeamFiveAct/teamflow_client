import { useRef, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import ServerMessage from '../LoginComp/ServerMessage';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  //   spaceId: string;
  //   onInvite: (email: string) => void;
}

export default function InviteMember({
  isOpen,
  onClose,
}: //   onInvite,
InviteModalProps) {
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState<{
    text: string;
    type: 'error' | 'success' | null;
  }>({ text: '', type: null });
  const [loading, setLoading] = useState(false);
  const { space_id } = useParams<{ space_id: string }>();
  const emailRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!email.trim()) {
      setEmailMessage({ text: '이메일을 입력해주세요.', type: 'error' });
      return;
    }
    //     // onInvite(email);
    //     setEmail('');
    //     onClose();
    //   };
    try {
      setLoading(true);
      setEmailMessage({ text: '', type: null });

      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/workspace/${space_id}/invite`,
        {
          email,
        },
        { withCredentials: true },
      );

      if (response.data.status === 'SUCCESS') {
        setEmailMessage({
          text: '초대 이메일이 발송되었습니다.',
          type: 'success',
        });
        // ✅ 1초 후 모달을 닫고 메시지 초기화
        setTimeout(() => {
          setEmail('');
          setEmailMessage({ text: '', type: null });
          onClose();
        }, 1000);
      } else {
        setEmailMessage({
          text: response.data.message || '초대 실패',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('초대 요청 오류:', error);
      setEmailMessage({
        text: '서버 오류로 초대에 실패했습니다.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="custom-modal">
          <div className="modal-header">
            <h5 className="modal-title">같이 일 할 멤버를 초대하세요!</h5>
            {/* <button type="button" className="btn-close" onClick={onHide}></button> */}
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">
                  ✨초대할 멤버의 이메일을 작성해주세요✨
                </label>
                <input
                  type="email"
                  className="border p-2 w-100 max-w-100 mb-4"
                  placeholder="example@example.com"
                  value={email}
                  ref={emailRef}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </form>
            {emailMessage && <ServerMessage message={emailMessage} />}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button className="btn btn-primary" onClick={handleInvite}>
              초대
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
