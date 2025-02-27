// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';
// import Home from './pages/Home';
// import MyProfile from './pages/MyProfile';
// import Header from './components/commonComp/HeaderComp';
// import { useSelector } from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.css';
// import useCheckSession from './hooks/useCheckSession';

// import Footer from './components/commonComp/Footer';
// import NotFound from './pages/NotFound';
// import DashBoard from './pages/DashBoard';
// import JoinSpace from './pages/JoinSpace';
// import '../src/style/app.scss';

// import LoginPage from './pages/LoginPage';
// import SignUp from './components/LoginComp/SignUp';
// import { RootState } from './store/store';

// // Chat 페이지와 ChatButton 컴포넌트 추가
// import Chat from './components/chatcomp/Chat';
// // import ChatButton from './components/chattingComp/ChatButton';
// // import { createGlobalStyle } from 'styled-components';
// import ChatButton from './components/chattingComp/ChatButton';

// // const GlobalStyle = createGlobalStyle`
// //   * {
// //     margin: 0;
// //     padding: 0;
// //     box-sizing: border-box;
// //   }

// //   body {
// //     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
// //       Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
// //     background: #e9ecef;
// //     color: #212529;
// //     line-height: 1.5;
// //     -webkit-font-smoothing: antialiased;
// //     -moz-osx-font-smoothing: grayscale;
// //   }
// // `;

// function App() {
//   const sessionValid = useSelector(
//     (state: RootState) => state.checkSession.sessionValid,
//   );

//   console.log('현재 세션 상태 app.tsx:', sessionValid); // 세션 상태 로그

//   // 테스트용 사용자 / 워크스페이스 정보
//   const user_id = 1;
//   const workspace_id = 1;

//   return (
//     <>
//       {/* <GlobalStyle /> */}
//       <Router>
//         {/* 조건부로 SessionChecker 호출 */}
//         {sessionValid && <SessionChecker />}
//         {/* 세션이 유효할 경우에만 SessionChecker를 호출 */}
//         <Header />
//         <Routes>
//           {/* <Route path="/" element={<Layout />} /> */}
//           <Route index element={<Home />} />
//           <Route path="/v1/user" element={<MyProfile />} />
//           <Route path="/v1/user/login" element={<LoginPage />} />
//           <Route path="/v1/user/join" element={<SignUp />} />
//           <Route path="/v1/mySpace" element={<JoinSpace />} />
//           {/* /workspace 변경 */}
//           <Route path="/v1/workspace/:space_id" element={<DashBoard />} />
//           {/* Chat 페이지 라우트 추가 */}
//           <Route
//             path="/chat"
//             element={<Chat user_id={user_id} workspace_id={workspace_id} />}
//           />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//         {/* ChatButton 컴포넌트는 고정 위치에 표시되며, 클릭 시 /chat으로 이동 */}
//         <ChatButton />
//         <Footer />
//       </Router>
//     </>
//   );
// }

// // ✅ useCheckSession을 Router 내부에서 실행하기 위한 컴포넌트
// function SessionChecker() {
//   useCheckSession(); // useLocation()이 정상적으로 동작할 수 있도록 Router 내부에서 실행
//   return null;
// }

// export default App;

//----헤더 푸터 설정을 위한 수정 및 정리후입니다. 위 주석 내용과 동일하니 머지할때 위에 있는 부분을 삭제해도 됩니다----
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import useCheckSession from './hooks/useCheckSession';
import { RootState } from './store/store';
import '../src/style/app.scss';

import Header from './components/commonComp/HeaderComp';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignUp from './components/LoginComp/SignUp';
import MyProfile from './pages/MyProfile';
import JoinSpace from './pages/JoinSpace';
import DashBoard from './pages/DashBoard';
import Chat from './components/chatcomp/Chat';
import NotFound from './pages/NotFound';
import Footer from './components/commonComp/Footer';
import ProtectedRoute from './components/commonComp/ProtectedRoute'; // ✅ 보호된 라우트
// import { createGlobalStyle } from 'styled-components';

// const GlobalStyle = createGlobalStyle`
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   body {
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
//       Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//     background: #e9ecef;
//     color: #212529;
//     line-height: 1.5;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//   }
// `;

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
          {/* <Route path="/" element={<Layout />} /> */}
          <Route index element={<Home />} />
          <Route path="/v1/user/login" element={<LoginPage />} />
          <Route path="/v1/user/join" element={<SignUp />} />
          {/* ✅ 로그인한 사용자만 접근 가능하도록 보호된 라우트 적용 */}
          <Route
            path="/v1/mySpace"
            element={<ProtectedRoute element={<JoinSpace />} />}
          />
          <Route
            path="/v1/workspace/:space_id"
            element={<ProtectedRoute element={<DashBoard />} />}
          />
          <Route
            path="/v1/user"
            element={<ProtectedRoute element={<MyProfile />} />}
          />
          {/* /workspace 변경 */}
          {/* Chat 페이지 라우트 추가 */}
          <Route
            path="/chat"
            element={
              <Chat
                user_id={user_id}
                workspace_id={workspace_id}
                onClose={() => console.log('Chat closed')} // 연준님의 코드를 풀 받고 에러 떠서 이 부분 추가함
              />
            }
          />
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
