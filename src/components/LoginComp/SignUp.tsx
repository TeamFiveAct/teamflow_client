import Avatar from 'boring-avatars';
import '../../style/common.scss';
import ProfileImg from './ProfileImg';

export default function SignUp() {
  return (
    <>
      <main className="boxContainer">
        <h3>SIGN UP</h3>
        <hr />
        <form className="textContainer">
          {/* 프로필 이미지 랜덤 */}
          <ProfileImg />
          <input type="text" placeholder="닉네임을 작성해주세요" />
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
