// import React, { useEffect, useState } from 'react';
// import { Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import CreateSpace from '../components/joinspaceComp/CreateSpace';
// import '../style/joinspace.scss';

// export default function JoinSpace() {
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);

//   const handleCreateRoom = async () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   useEffect(() => {
//     const sessionValid = sessionStorage.getItem('session_valid');
//     if (!sessionValid) {
//       alert('로그인 기간이 만료되었습니다. 다시 로그인 해주세요.');
//       navigate('/v1/user/login');
//     }
//   }, []);

//   return (
//     <section className="pagesSection">
//       <Button className={'mt-300'} onClick={handleCreateRoom}>
//         방 만들기
//       </Button>
//       <CreateSpace show={showModal} onClose={handleCloseModal} />
//     </section>
//   );
// }

import Workspace from '../components/joinspaceComp/Workspace';

const JoinSpace = () => {
  const dummyWorkspaces = [
    { id: 1, name: 'TeamFlow', isActive: true },
    // { id: 2, name: 'Project1', isActive: false },
    { id: 3, name: 'Project2', isActive: false },
  ];

  return (
    <>
      <Workspace workspaces={dummyWorkspaces} />
    </>
  );
};
export default JoinSpace;
