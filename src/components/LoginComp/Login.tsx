import '../../style/common.scss';
import ProfileImg from './ProfileImg';

export default function Login() {
  return (
    <>
      <main className="boxContainer">
        <h3>LOGIN</h3>
        <hr />
        <ProfileImg />
        <form className="textContainer">
          <div>Email</div>
          <input type="text" placeholder="example@example.com" />
          <br />
          <div>Password</div>
          <input type="password" placeholder="비밀번호를 입력하세요." />
          <br />
          <button type="submit">로그인</button>
        </form>
      </main>
    </>
  );
}
