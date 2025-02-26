import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import ServerMessage from '../components/LoginComp/ServerMessage';
import { useRef, useState } from 'react';

export default function SettingPassword() {
  const [pwEmailInput, setPwEmailInput] = useState('');
  const [emailMessage, setEmailMessage] = useState<{
    text: string;
    type: 'error' | 'success' | null;
  }>({ text: '', type: null });

  const emailRef = useRef<HTMLInputElement>(null);

  const handleSearchPwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit logic...
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} className="d-flex justify-content-center">
          <div
            className="p-4 d-flex flex-column"
            style={{
              maxWidth: '500px',
              width: '100%',
              height: '500px',
              borderRadius: '12px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
            }}
          >
            {/* 상단: 제목과 구분선 */}
            <div>
              <h3 className="text-center fw-bold">비밀번호 찾기</h3>
              <hr style={{ width: '100%', border: '1px solid black' }} />
            </div>

            {/* 중앙: 이메일 폼을 중간에 정렬 */}
            <div
              className="d-flex flex-column justify-content-center flex-grow-1"
              style={{ minHeight: 0 }}
            >
              <Form onSubmit={handleSearchPwSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@example.com"
                    value={pwEmailInput}
                    ref={emailRef}
                    onChange={e => {
                      setPwEmailInput(e.target.value);
                      setEmailMessage({ text: '', type: null });
                    }}
                  />
                  {emailMessage && <ServerMessage message={emailMessage} />}
                </Form.Group>
              </Form>
            </div>

            {/* 하단: 버튼 */}
            <div>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                onClick={handleSearchPwSubmit}
              >
                비밀번호 찾기
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
