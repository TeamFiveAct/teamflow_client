// src/components/joinspaceComp/SpaceList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Workspace {
  space_id: number;
  space_title: string;
}

const SpaceList = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMySpaces = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/workspace/user`,
        { withCredentials: true },
      );
      if (response.data.status === 'SUCCESS') {
        setWorkspaces(response.data.data);
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
    fetchMySpaces();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="space-list-container">
      <h5>내가 참여한 워크스페이스</h5>
      {workspaces.length === 0 ? (
        <p>참여한 워크스페이스가 없습니다.</p>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            768: { slidesPerView: 3 }, // 화면 크기가 768px 이상이면 한 줄에 3개
          }}
          className="space-slider"
        >
          {workspaces.map(space => (
            <SwiperSlide key={space.space_id}>
              <div
                className="space-item"
                onClick={() => navigate(`/v1/workspace/${space.space_id}`)}
              >
                {space.space_title}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Container>
  );
};

export default SpaceList;
