import { useNavigate } from "react-router-dom"; // 새로고침 안 됨 
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/notFound.scss"; 

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">페이지를 찾을 수 없습니다.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>
    </div>
  );
}
