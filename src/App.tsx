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
import PrivateRoute from './components/commonComp/PrivateRoute';


function App() {
  const sessionValid = useSelector(
    (state: RootState) => state.checkSession.sessionValid,
  );

  console.log('현재 세션 상태 app.tsx:', sessionValid); // 세션 상태 로그

  return (
    <>
      <Router>
        {/* SessionChecker를 항상 호출하도록 수정 */}
        <SessionChecker />
        <Header />
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element={<Home />} />
          {/* 공개 라우트 - 로그인 없이 접근 가능 */}
          <Route path="/v1/user/login" element={<LoginPage />} />
          <Route path="/v1/user/join" element={<SignUp />} />
          
          {/* 보호된 라우트 - 로그인 필요 */}
          <Route path="/v1/user" element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          } />
          <Route path="/v1/mySpace" element={
            <PrivateRoute>
              <JoinSpace />
            </PrivateRoute>
          } />
          <Route path="/v1/workspace/:space_id" element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

// useCheckSession을 Router 내부에서 실행하기 위한 컴포넌트
function SessionChecker() {
  useCheckSession(); // useLocation()이 정상적으로 동작할 수 있도록 Router 내부에서 실행
  return null;
}

export default App;
