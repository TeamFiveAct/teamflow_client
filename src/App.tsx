import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MyProfile from './pages/MyProfile';
import Header from './components/commonComp/HeaderComp';
import Footer from './components/commonComp/Footer';
import NotFound from './pages/NotFound';
import Login from './components/loginComp/Login';
import SignUp from './components/loginComp/SignUp';
import CreateSpace from './components/joinspaceComp/CreateSpace';
import DashBoard from './pages/DashBoard';
import JoinSpace from './pages/JoinSpace';
import '../src/style/app.scss';

// bootstrap 불러오기
import 'bootstrap/dist/css/bootstrap.css';
import Layout from './components/Layout';
function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Home />} />

        <Route path="/v1/user" element={<MyProfile />} />

        <Route path="/v1/user/login" element={<Login />} />
        <Route path="/v1/user/join" element={<SignUp />} />
        <Route path="/v1/workspace" element={<JoinSpace />} />
        <Route path="/v1/workspace/:space_id" element={<DashBoard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
