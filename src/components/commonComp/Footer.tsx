import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/common/common.scss';
import FooterModal from './ContactUsModal'; //컴포넌트 가져오기

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <footer className="footer">
        <span className="contact-text" onClick={() => setShowModal(true)}>
          Contact Us
        </span>
        <p className="license-text">Licensed by FiveAct © 2025</p>
      </footer>

      {/* ✅ 모달 컴포넌트 사용 */}
      {showModal && <FooterModal onClose={() => setShowModal(false)} />}
    </>
  );
}
