// src/components/joinspaceComp/SpaceList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner, Container, Row, Col, Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Workspace {
  space_id: number;
  space_title: string;
}

interface SpaceListProps {
  spaces: Workspace[];
}
const ITEMS_PER_PAGE = 6; // ✅ 한 번에 보여줄 개수 (2줄 × 3개)

const SpaceList = ({ spaces }: SpaceListProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  if (!spaces) return <Spinner animation="border" />;

  // ✅ 현재 페이지에 해당하는 6개의 항목만 가져오기
  const totalPages = Math.ceil(spaces.length / ITEMS_PER_PAGE);
  const currentItems = spaces.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  return (
    <Container className="space-list-container">
      <h5>내가 참여한 워크스페이스</h5>
      {spaces.length === 0 ? (
        <p>참여한 워크스페이스가 없습니다.</p>
      ) : (
        <>
          {/* ✅ 2줄 × 3개의 그리드 형태로 표시 */}
          <Row className="space-grid">
            {currentItems.map(space => (
              <Col key={space.space_id} xs={4} className="space-item">
                <div
                  className="space-circle"
                  onClick={() => navigate(`/v1/workspace/${space.space_id}`)}
                >
                  {space.space_title}
                </div>
              </Col>
            ))}
          </Row>

          {/* ✅ 페이지네이션 버튼 */}
          {totalPages > 1 && (
            <div className="pagination-buttons">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                이전
              </Button>
              <span>
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default SpaceList;
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={10}
//           navigation
//           pagination={{ clickable: true }}
//           modules={[Navigation, Pagination]}
//           breakpoints={{
//             768: { slidesPerView: 3 }, // 화면 크기가 768px 이상이면 한 줄에 3개
//           }}
//           className="space-slider"
//         >
//           {spaces.map(space => (
//             <SwiperSlide key={space.space_id}>
//               <div
//                 className="space-item"
//                 onClick={() => navigate(`/v1/workspace/${space.space_id}`)}
//               >
//                 {space.space_title}
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       )}
//     </Container>
//   );
// };

// export default SpaceList;
