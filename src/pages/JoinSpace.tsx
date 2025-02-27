import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateSpace from '../components/joinspaceComp/CreateSpace';
// import '../style/joinspace/joinspace.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import EnterSpacePassword from '../components/joinspaceComp/EnterSpacePassword';
import SpaceList from '../components/joinspaceComp/SpaceList';

export default function JoinSpace() {
  const navigate = useNavigate();
  const sessionValid = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );
  // const sessionValid = useCheckSession();
  const [showModal, setShowModal] = useState(false);
  const [mySpaces, setMySpaces] = useState<any[]>([]); // 스페이스 목록 상태
  const [loading, setLoading] = useState(true);

  const fetchMySpaces = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/workspace/user`,
        { withCredentials: true },
      );
      if (response.data.status === 'SUCCESS') {
        // 서버가 빈 배열일 경우 배열로 반환하도록 보장
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setMySpaces(data);
      } else {
        alert(
          response.data.message || '워크스페이스 목록을 불러오지 못했습니다.',
        );
      }
    } catch (error) {
      console.error(error);
      alert('워크스페이스 목록 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionValid) {
      alert('로그인 기간이 만료되었습니다. 다시 로그인 해주세요.');
      navigate('/v1/user/login');
    }
    fetchMySpaces();
  }, [sessionValid, navigate]);

  const handleRefreshSpaces = () => {
    fetchMySpaces();
  };

  const handleCreateRoom = async () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchMySpaces();
  };

  useEffect(() => {
    if (!sessionValid) {
      alert('로그인 기간이 만료되었습니다. 다시 로그인 해주세요.');
      navigate('/v1/user/login');
    }
  }, [sessionValid, navigate]);

  return (
    <section className="joinspaceSection container-fluid d-flex vh-100">
      {/* ✅ 왼쪽 패널 */}
      <div className="leftSideContainer d-flex flex-column justify-content-center align-items-center">
        <div className="text-center workspace-actions">
          <h3>TeamFlow에 오신 것을 환영합니다!</h3>
          <br />
          <h5>워크스페이스를 생성하여 협업 공간을 만들어보세요!</h5>
          <Button className="mt-3 w-75" onClick={handleCreateRoom}>
            워크 스페이스 생성
          </Button>
          <hr />
        </div>

        {/* ✅ 워크스페이스 생성 모달 */}
        <CreateSpace
          show={showModal}
          onClose={handleCloseModal}
          refreshSpaces={handleRefreshSpaces}
        />

        {/* ✅ 초대 코드 입력 */}
        <div className="enterSpaceBtnDiv text-center mt-3 w-75">
          <EnterSpacePassword refreshSpaces={handleRefreshSpaces} />
        </div>
      </div>

      {/* ✅ 오른쪽 패널 (워크스페이스 목록) */}
      <div className="mySpacelistDiv d-flex flex-column justify-content-center align-items-center">
        {/* <h5 className="text-center mb-4">내가 참여한 워크스페이스</h5> */}
        {loading ? <p>로딩 중...</p> : <SpaceList spaces={mySpaces} />}
      </div>
    </section>
  );
}
