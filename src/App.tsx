// bootstrap 불러오기
// import 'bootstrap/dist/css/bootstrap.css';

import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/LoginComp/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/v1/user/login" element={<Login />} />
    </Routes>
  );
}

export default App;
