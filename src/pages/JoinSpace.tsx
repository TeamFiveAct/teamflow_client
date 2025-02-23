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

  const handleCreateRoom = async () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        <CreateSpace show={showModal} onClose={handleCloseModal} />
        <div className="enterSpaceBtnDiv">
          <EnterSpacePassword />
        </div>
      </div>

      <div className="mySpacelistDiv">
        <SpaceList />
      </div>
    </section>
  );
}
