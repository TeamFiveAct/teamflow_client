import { useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface TransitionProps {
  loginType: 'LOGIN' | 'SIGN UP';
  setLoginType: (loginType: 'LOGIN' | 'SIGN UP') => void;
}

export default function TransitionComp({
  loginType,
  setLoginType,
}: TransitionProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (loginType) {
      navigate(loginType === 'LOGIN' ? '/v1/user/login' : '/v1/user/join');
    }
  }, [loginType, navigate]);

  const handleNavigation = () => {
    setLoginType(loginType === 'LOGIN' ? 'SIGN UP' : 'LOGIN');
  };

  return (
    <Container style={{ height: '600px' }}>
      <Row className="text-center h-100">
        <Col
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: '100%' }}
        >
          <h3 className="fw-bold">
            {loginType === 'LOGIN' ? 'SIGN UP' : 'LOGIN'}
          </h3>
          <hr style={{ width: '100%', border: '1px solid black' }} />
          <div
            className="mb-4 d-flex flex-column align-items-center justify-content-center"
            style={{ flex: 1, width: '100%' }}
          >
            {loginType === 'LOGIN' ? (
              <>
                <p>아직 회원이 아니신가요?</p>
                <p>
                  회원가입을 통해 팀플로우의 협업 워크스페이스를 경험해보세요!
                </p>
              </>
            ) : (
              <>
                <p>이미 회원이신가요?</p>
                <p>
                  회원 로그인을 통해 TeamFlow의 협업 워크 스페이스를 시작하세요!
                </p>
              </>
            )}
          </div>

          {/* 🔹 네비게이션과 상태 업데이트를 동시에 처리하는 버튼 */}
          <Button variant="link" onClick={handleNavigation}>
            {loginType === 'LOGIN' ? 'Go to Sign Up' : 'Go to Login'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
