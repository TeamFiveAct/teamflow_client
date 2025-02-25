import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MyProfile from './pages/MyProfile';
import Header from './components/commonComp/HeaderComp';
import Footer from './components/commonComp/Footer';
import NotFound from './pages/NotFound';
import DashBoard from './pages/DashBoard';
import JoinSpace from './pages/JoinSpace';
import '../src/style/app.scss';

// bootstrap 불러오기
import 'bootstrap/dist/css/bootstrap.css';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignUp from './components/LoginComp/SignUp';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import useCheckSession from './hooks/useCheckSession';


function App() {
  const sessionValid = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );

  console.log('현재 세션 상태 app.tsx:', sessionValid); // 세션 상태 로그

  // 테스트용 사용자 / 워크스페이스 정보
  const user_id = 1;
  const workspace_id = 1;

  return (
    <>
      <Router>
        {/* 조건부로 SessionChecker 호출 */}
        {sessionValid && <SessionChecker />}
        {/* 세션이 유효할 경우에만 SessionChecker를 호출 */}
        <Header />
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<Home />} />
          <Route path="/v1/user" element={<MyProfile />} />
          <Route path="/v1/user/login" element={<LoginPage />} />
          <Route path="/v1/user/join" element={<SignUp />} />
          <Route path="/v1/mySpace" element={<JoinSpace />} />
          {/* /workspace 변경 */}
          <Route path="/v1/workspace/:space_id" element={<DashBoard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

// ✅ useCheckSession을 Router 내부에서 실행하기 위한 컴포넌트
function SessionChecker() {
  useCheckSession(); // useLocation()이 정상적으로 동작할 수 있도록 Router 내부에서 실행
  return null;
}

export default App;
