import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateSpace from '../components/joinspaceComp/CreateSpace';
import '../style/joinspace.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import EnterSpacePassword from '../components/joinspaceComp/EnterSpacePassword';
import SpaceList from '../components/joinspaceComp/SpaceList';
// import useCheckSession from '../hooks/useCheckSession';

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
    <section className="joinspaceSection">
      <div className="leftSideContainer">
        <div className="createSpaceBtnDiv">
          <h3>TeamFlow에 오신것을 환영합니다!</h3>
          <h5>워크 스페이스 생성을 통해 협업 스페이스를 만들어보세요!</h5>
          <Button className={'mt-300'} onClick={handleCreateRoom}>
            워크 스페이스 생성
          </Button>
          <hr />
        </div>
        <CreateSpace
          show={showModal}
          onClose={handleCloseModal}
          refreshSpaces={handleRefreshSpaces}
        />
        <div className="enterSpaceBtnDiv">
          <EnterSpacePassword refreshSpaces={handleRefreshSpaces} />
        </div>
      </div>

      <div className="mySpacelistDiv">
        <SpaceList spaces={mySpaces} />
      </div>
    </section>
  );
}
