import React from 'react';
import { Outlet } from 'react-router-dom'; // 🔹 현재 페이지가 동적으로 변경되도록 설정
import Header from '../components/commonComp/HeaderComp';
import Footer from '../components/commonComp/Footer';
import '../style/common.scss'; // 🔹 전역 스타일 적용

export default function Layout() {
  return (
    <div className="layout-container">
      {/* ✅ 고정된 헤더 */}
      <Header />

      {/* ✅ 페이지 콘텐츠 */}
      <main className="content">
        <Outlet /> {/* 🔹 각 페이지가 이 위치에 렌더링됨 */}
      </main>

      {/* ✅ 고정된 푸터 */}
      <Footer />
    </div>
  );
}
