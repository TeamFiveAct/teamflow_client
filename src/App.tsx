// bootstrap 불러오기
import 'bootstrap/dist/css/bootstrap.css';

import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/loginComp/Login';
import SignUp from './components/loginComp/SignUp';
import CreateSpace from './components/joinspaceComp/CreateSpace';
import DashBoard from './pages/DashBoard';
import JoinSpace from './pages/JoinSpace';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/v1/user/login" element={<Login />} />
      <Route path="/v1/user/join" element={<SignUp />} />
      <Route path="/v1/workspace" element={<JoinSpace />} />
      <Route path="/v1/workspace/:space_id" element={<DashBoard />} />
    </Routes>
  );
}

export default App;
