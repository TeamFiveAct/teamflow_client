/**
 * WebSocket 서버 예제 코드
 * 
 * 이 파일은 Socket.IO를 사용한 WebSocket 서버 구현 예제입니다.
 * 실제 사용 시에는 기존 백엔드 서버에 통합하거나 별도의 서버로 실행할 수 있습니다.
 * 
 * 설치 필요 패키지:
 * npm install express socket.io cors
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Express 앱 생성
const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // React 앱 주소
  credentials: true
}));

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.IO 서버 생성
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React 앱 주소
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 워크스페이스별 룸 관리
const workspaceRooms = {};

// 연결된 사용자 정보 관리
const connectedUsers = {};

// Socket.IO 연결 처리
io.on('connection', (socket) => {
  console.log('사용자 연결됨:', socket.id);

// 워크스페이스 입장
  socket.on('join:workspace', ({ workspaceId, userId }) => {
    const roomName = `workspace:${workspaceId}`;
    socket.join(roomName);
    console.log(`사용자 ${socket.id}(ID: ${userId})가 ${roomName}에 입장`);
    
    // 사용자 정보 저장
    const userInfo = {
      userId,
      nickname: `User${userId}`, // 실제 구현에서는 사용자 정보 DB에서 가져오기
      profileImg: `https://placehold.co/40x40/gray/white?text=U${userId}`
    };
    
    connectedUsers[socket.id] = userInfo;
    
    // 해당 워크스페이스 룸에 사용자 추가
    if (!workspaceRooms[roomName]) {
      workspaceRooms[roomName] = new Set();
    }
    workspaceRooms[roomName].add(socket.id);
    
    // 새 사용자 입장을 워크스페이스의 모든 사용자에게 알림
    io.to(roomName).emit('user:joined', { user: userInfo });
    console.log(`[서버] 'user:joined' 이벤트 전송:`, { user: userInfo });
    
    // 현재 워크스페이스의 모든 사용자 목록을 새로 접속한 사용자에게 전송
    const usersInRoom = Array.from(workspaceRooms[roomName])
      .map(id => connectedUsers[id])
      .filter(Boolean);
    
    socket.emit('workspace:users', { users: usersInRoom });
    console.log(`[서버] 'workspace:users' 이벤트 전송:`, { users: usersInRoom });
    
    // 현재 룸에 있는 사용자 수 로깅
    console.log(`${roomName}의 현재 사용자 수: ${workspaceRooms[roomName].size}`);
  });

  // 워크스페이스 퇴장
  socket.on('leave:workspace', ({ workspaceId }) => {
    const roomName = `workspace:${workspaceId}`;
    socket.leave(roomName);
    console.log(`사용자 ${socket.id}가 ${roomName}에서 퇴장`);
    
    // 해당 워크스페이스 룸에서 사용자 제거
    if (workspaceRooms[roomName]) {
      workspaceRooms[roomName].delete(socket.id);
      
      // 사용자 퇴장을 워크스페이스의 모든 사용자에게 알림
      if (connectedUsers[socket.id]) {
        io.to(roomName).emit('user:left', { userId: connectedUsers[socket.id].userId });
      }
      
      console.log(`${roomName}의 현재 사용자 수: ${workspaceRooms[roomName].size}`);
    }
  });

  // 업무 생성 이벤트 처리 및 브로드캐스트
  socket.on('task:created', (data) => {
    console.log('업무 생성 이벤트 수신:', data);
    const roomName = `workspace:${data.spaceId}`;
    
    // 같은 워크스페이스의 다른 사용자들에게 이벤트 전달
    socket.to(roomName).emit('task:created', data);
    console.log(`${roomName}의 다른 사용자들에게 업무 생성 이벤트 전달`);
  });

  // 업무 업데이트 이벤트 처리 및 브로드캐스트
  socket.on('task:updated', (data) => {
    console.log('업무 업데이트 이벤트 수신:', data);
    const roomName = `workspace:${data.spaceId}`;
    socket.to(roomName).emit('task:updated', data);
  });

  // 업무 상태 변경 이벤트 처리 및 브로드캐스트
  socket.on('task:state_changed', (data) => {
    console.log('업무 상태 변경 이벤트 수신:', data);
    const roomName = `workspace:${data.spaceId}`;
    socket.to(roomName).emit('task:state_changed', data);
  });

  // 업무 삭제 이벤트 처리 및 브로드캐스트
  socket.on('task:deleted', (data) => {
    console.log('업무 삭제 이벤트 수신:', data);
    const roomName = `workspace:${data.spaceId}`;
    socket.to(roomName).emit('task:deleted', data);
  });

  // 연결 종료
  socket.on('disconnect', () => {
    console.log('사용자 연결 종료:', socket.id);
    
    // 모든 워크스페이스 룸에서 사용자 제거
    Object.keys(workspaceRooms).forEach(roomName => {
      if (workspaceRooms[roomName].has(socket.id)) {
        workspaceRooms[roomName].delete(socket.id);
        
        // 사용자 퇴장을 워크스페이스의 모든 사용자에게 알림
        if (connectedUsers[socket.id]) {
          io.to(roomName).emit('user:left', { userId: connectedUsers[socket.id].userId });
        }
        
        console.log(`${roomName}의 현재 사용자 수: ${workspaceRooms[roomName].size}`);
      }
    });
    
    // 연결된 사용자 목록에서 제거
    delete connectedUsers[socket.id];
  });

  // 에러 처리
  socket.on('error', (error) => {
    console.error('Socket 에러:', error);
  });
});

// 인증 미들웨어 예제 (필요시 활성화)
/*
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  // 토큰 검증 로직
  if (isValidToken(token)) {
    // 사용자 정보를 소켓에 저장
    socket.user = getUserFromToken(token);
    next();
  } else {
    next(new Error('Authentication error'));
  }
});
*/

// 서버 시작
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`WebSocket 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

// 간단한 상태 확인 엔드포인트
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    connections: Object.keys(connectedUsers).length,
    workspaces: Object.keys(workspaceRooms).map(room => ({
      name: room,
      users: workspaceRooms[room].size
    }))
  });
});

/**
 * 서버 실행 방법:
 * 1. 이 파일을 서버에 저장합니다.
 * 2. 필요한 패키지를 설치합니다: npm install express socket.io cors
 * 3. 서버를 실행합니다: node websocket-server-example.js
 * 
 * 클라이언트 측에서는 다음 URL로 연결합니다:
 * - 로컬 개발 환경: http://localhost:8000
 * - 프로덕션 환경: 실제 서버 URL
 */
