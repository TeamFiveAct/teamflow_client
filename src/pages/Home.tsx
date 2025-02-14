import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div>여기는 홈페이지</div>
      <Link to={'/v1/user/login'}>로그인</Link>
    </>
  );
}
