// // // src/components/joinspaceComp/SpaceList.tsx
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import { Spinner, Container, Row, Col, Button } from 'react-bootstrap';
// // import { Swiper, SwiperSlide } from 'swiper/react';
// // import { Navigation, Pagination } from 'swiper/modules';
// // import 'swiper/css';
// // import 'swiper/css/navigation';
// // import 'swiper/css/pagination';

// // interface Workspace {
// //   space_id: number;
// //   space_title: string;
// // }

// // interface SpaceListProps {
// //   spaces: Workspace[];
// // }
// // const ITEMS_PER_PAGE = 6; // ✅ 한 번에 보여줄 개수 (2줄 × 3개)

// // const SpaceList = ({ spaces }: SpaceListProps) => {
// //   const navigate = useNavigate();
// //   const [currentPage, setCurrentPage] = useState(0);

// //   if (!spaces) return <Spinner animation="border" />;

// //   // ✅ 현재 페이지에 해당하는 6개의 항목만 가져오기
// //   const totalPages = Math.ceil(spaces.length / ITEMS_PER_PAGE);
// //   const currentItems = spaces.slice(
// //     currentPage * ITEMS_PER_PAGE,
// //     (currentPage + 1) * ITEMS_PER_PAGE,
// //   );

// //   return (
// //     <Container className="space-list-container">
// //       <h5>내가 참여한 워크스페이스</h5>
// //       {spaces.length === 0 ? (
// //         <p>참여한 워크스페이스가 없습니다.</p>
// //       ) : (
// //         <>
// //           {/* ✅ 2줄 × 3개의 그리드 형태로 표시 */}
// //           <Row className="space-grid">
// //             {currentItems.map(space => (
// //               <Col key={space.space_id} xs={4} className="space-item">
// //                 <div
// //                   className="space-circle"
// //                   onClick={() => navigate(`/v1/workspace/${space.space_id}`)}
// //                 >
// //                   {space.space_title}
// //                 </div>
// //               </Col>
// //             ))}
// //           </Row>

// //           {/* ✅ 페이지네이션 버튼 */}
// //           {totalPages > 1 && (
// //             <div className="pagination-buttons">
// //               <Button
// //                 variant="secondary"
// //                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
// //                 disabled={currentPage === 0}
// //               >
// //                 이전
// //               </Button>
// //               <span>
// //                 {currentPage + 1} / {totalPages}
// //               </span>
// //               <Button
// //                 variant="secondary"
// //                 onClick={() =>
// //                   setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
// //                 }
// //                 disabled={currentPage === totalPages - 1}
// //               >
// //                 다음
// //               </Button>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </Container>
// //   );
// // };

// // export default SpaceList;

// //         <Swiper
// //           slidesPerView={1}
// //           spaceBetween={10}
// //           navigation
// //           pagination={{ clickable: true }}
// //           modules={[Navigation, Pagination]}
// //           breakpoints={{
// //             768: { slidesPerView: 3 }, // 화면 크기가 768px 이상이면 한 줄에 3개
// //           }}
// //           className="space-slider"
// //         >
// //           {spaces.map(space => (
// //             <SwiperSlide key={space.space_id}>
// //               <div
// //                 className="space-item"
// //                 onClick={() => navigate(`/v1/workspace/${space.space_id}`)}
// //               >
// //                 {space.space_title}
// //               </div>
// //             </SwiperSlide>
// //           ))}
// //         </Swiper>
// //       )}
// //     </Container>
// //   );
// // };

// // export default SpaceList;

// //------------x-----test 수정정

// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Container } from 'react-bootstrap';
// import axios from 'axios';
// import { DoorOpen } from 'react-bootstrap-icons'; // ✅ 나가기 아이콘 추가

// interface Workspace {
//   space_id: number;
//   space_title: string;
// }

// interface SpaceListProps {
//   spaces: Workspace[];
// }

// const SpaceList = ({ spaces }: SpaceListProps) => {
//   const navigate = useNavigate();
//   const [scrollIndex, setScrollIndex] = useState(0);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // ✅ 워크스페이스 탈퇴 기능
//   const handleLeaveWorkspace = async (spaceId: number) => {
//     if (!window.confirm('이 워크스페이스에서 탈퇴하시겠습니까?')) return;
//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_API_SERVER}/workspace/leave/${spaceId}`,
//         { withCredentials: true },
//       );
//       alert('워크스페이스에서 탈퇴되었습니다.');
//       window.location.reload(); // 새로고침하여 목록 갱신
//     } catch (error) {
//       console.error('탈퇴 실패:', error);
//       alert('워크스페이스 탈퇴에 실패했습니다.');
//     }
//   };

//   // ✅ 스크롤 기능 (왼쪽, 오른쪽 이동)
//   const scrollLeft = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollLeft -= 120;
//       setScrollIndex(prev => Math.max(prev - 1, 0));
//     }
//   };

//   const scrollRight = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollLeft += 120;
//       setScrollIndex(prev => Math.min(prev + 1, spaces.length - 3));
//     }
//   };

//   return (
//     <Container className="space-list-container">
//       <h5 className="workspace-title">내가 참여한 워크스페이스</h5>

//       {/* ✅ 스크롤 버튼 (워크스페이스가 3개 이상일 때 표시) */}
//       {spaces.length > 3 && (
//         <div className="scroll-buttons">
//           <Button variant="light" className="scroll-left" onClick={scrollLeft}>
//             &lt;
//           </Button>
//           <Button
//             variant="light"
//             className="scroll-right"
//             onClick={scrollRight}
//           >
//             &gt;
//           </Button>
//         </div>
//       )}

//       {/* ✅ 워크스페이스 동그라미 리스트 */}
//       <div className="workspace-list" ref={scrollRef}>
//         {spaces.map(space => (
//           <div key={space.space_id} className="space-circle">
//             <div
//               className="space-content"
//               onClick={() => navigate(`/v1/workspace/${space.space_id}`)}
//             >
//               {space.space_title}
//             </div>
//             <Button
//               variant="danger"
//               size="sm"
//               className="leave-button"
//               onClick={e => {
//                 e.stopPropagation(); // 부모 클릭 방지
//                 handleLeaveWorkspace(space.space_id);
//               }}
//             >
//               <DoorOpen size={14} /> {/* ✅ 나가기 아이콘 적용 */}
//             </Button>
//           </div>
//         ))}
//       </div>
//     </Container>
//   );
// };

// export default SpaceList;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'; // 🔹 화살표 아이콘 추가
import '../../style/joinspace/spacelist.scss';

interface Workspace {
  space_id: number;
  space_title: string;
}

interface SpaceListProps {
  spaces: Workspace[];
}

const ITEMS_PER_PAGE = 3; // 🔹 한 번에 보이는 개수

const SpaceList = ({ spaces }: SpaceListProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(spaces.length / ITEMS_PER_PAGE);

  // 🔹 현재 페이지에서 보여줄 워크스페이스 3개
  const currentItems = spaces.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  // 🔹 이전 버튼 클릭 (이전 3개 표시)
  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  // 🔹 다음 버튼 클릭 (다음 3개 표시)
  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  return (
    <div className="mySpacelistDiv">
      <h5 className="workspace-title">내가 참여한 워크스페이스</h5>

      <div className="workspace-wrapper">
        {/* 🔹 왼쪽 화살표 버튼 */}
        <Button
          variant="light"
          className="scroll-btn scroll-left"
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={24} />
        </Button>

        {/* 🔹 3개씩 보이는 워크스페이스 리스트 */}
        <div className="workspace-list">
          {currentItems.map(space => (
            <div
              key={space.space_id}
              className="space-circle"
              onClick={() => navigate(`/v1/workspace/${space.space_id}`)}
            >
              {space.space_title}
            </div>
          ))}
        </div>

        {/* 🔹 오른쪽 화살표 버튼 */}
        <Button
          variant="light"
          className="scroll-btn scroll-right"
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );
};

export default SpaceList;
