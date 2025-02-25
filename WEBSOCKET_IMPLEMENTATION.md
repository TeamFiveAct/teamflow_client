# WebSocket 구현 가이드

이 문서는 TeamFlow 클라이언트에 구현된 WebSocket 기능에 대한 설명과 서버 측 구현 가이드를 제공합니다.

## 1. 클라이언트 측 구현 내용

### 1.1 WebSocket 서비스 (src/services/websocketService.ts)

WebSocket 연결 및 이벤트 처리를 담당하는 서비스 클래스입니다. 다음 기능을 제공합니다:

- WebSocket 연결 초기화 및 관리
- 워크스페이스 입장/퇴장 처리
- 업무 관련 이벤트 수신 및 발신
- Redux 스토어와 연동하여 실시간 상태 업데이트

### 1.2 Redux 액션 연동 (src/store/modules/taskSlice.ts)

업무 관련 액션(생성, 수정, 삭제, 상태 변경)이 발생할 때 WebSocket 이벤트를 발신하도록 수정했습니다:

- `createTaskAsync`: 업무 생성 시 `task:created` 이벤트 발신
- `updateTaskAsync`: 업무 수정 시 `task:updated` 이벤트 발신
- `updateTaskStateAsync`: 업무 상태 변경 시 `task:state_changed` 이벤트 발신
- `deleteTaskAsync`: 업무 삭제 시 `task:deleted` 이벤트 발신

### 1.3 대시보드 컴포넌트 연동 (src/pages/DashBoard.tsx)

대시보드 컴포넌트에서 WebSocket 연결을 초기화하고 관리합니다:

- 컴포넌트 마운트 시 WebSocket 연결 및 워크스페이스 입장
- 컴포넌트 언마운트 시 워크스페이스 퇴장 및 연결 종료

## 2. 서버 측 구현 가이드

서버 측에서는 Socket.IO를 사용하여 WebSocket 서버를 구현해야 합니다. 예제 코드는 `websocket-server-example.js` 파일에 제공되어 있습니다.

### 2.1 필요 패키지 설치

```bash
npm install express socket.io cors
```

### 2.2 주요 기능 구현

1. **Socket.IO 서버 설정**
   ```javascript
   const express = require('express');
   const http = require('http');
   const { Server } = require('socket.io');
   const cors = require('cors');

   const app = express();
   const server = http.createServer(app);
   const io = new Server(server, {
     cors: {
       origin: 'http://localhost:3000',
       methods: ['GET', 'POST'],
       credentials: true
     }
   });
   ```

2. **연결 처리**
   ```javascript
   io.on('connection', (socket) => {
     console.log('사용자 연결됨:', socket.id);
     
     // 연결 종료
     socket.on('disconnect', () => {
       console.log('사용자 연결 종료:', socket.id);
     });
   });
   ```

3. **워크스페이스 입장/퇴장 처리**
   ```javascript
   // 워크스페이스 입장
   socket.on('join:workspace', ({ workspaceId }) => {
     const roomName = `workspace:${workspaceId}`;
     socket.join(roomName);
   });

   // 워크스페이스 퇴장
   socket.on('leave:workspace', ({ workspaceId }) => {
     const roomName = `workspace:${workspaceId}`;
     socket.leave(roomName);
   });
   ```

4. **업무 관련 이벤트 처리**
   ```javascript
   // 업무 생성 이벤트
   socket.on('task:created', (data) => {
     const roomName = `workspace:${data.spaceId}`;
     socket.to(roomName).emit('task:created', data);
   });

   // 업무 업데이트 이벤트
   socket.on('task:updated', (data) => {
     const roomName = `workspace:${data.spaceId}`;
     socket.to(roomName).emit('task:updated', data);
   });

   // 업무 상태 변경 이벤트
   socket.on('task:state_changed', (data) => {
     const roomName = `workspace:${data.spaceId}`;
     socket.to(roomName).emit('task:state_changed', data);
   });

   // 업무 삭제 이벤트
   socket.on('task:deleted', (data) => {
     const roomName = `workspace:${data.spaceId}`;
     socket.to(roomName).emit('task:deleted', data);
   });
   ```

### 2.3 서버 실행

```bash
node websocket-server-example.js
```

## 3. 이벤트 목록

### 3.1 클라이언트 → 서버 이벤트

| 이벤트 이름 | 데이터 | 설명 |
|------------|-------|------|
| `join:workspace` | `{ workspaceId: number, userId: number }` | 워크스페이스 입장 |
| `leave:workspace` | `{ workspaceId: number }` | 워크스페이스 퇴장 |
| `task:created` | `{ spaceId: number, task: Task }` | 업무 생성 |
| `task:updated` | `{ spaceId: number, task: Partial<Task> }` | 업무 수정 |
| `task:state_changed` | `{ spaceId: number, taskId: number, newState: string }` | 업무 상태 변경 |
| `task:deleted` | `{ spaceId: number, taskId: number }` | 업무 삭제 |

### 3.2 서버 → 클라이언트 이벤트

| 이벤트 이름 | 데이터 | 설명 |
|------------|-------|------|
| `task:created` | `{ spaceId: number, task: Task }` | 업무 생성 알림 |
| `task:updated` | `{ spaceId: number, task: Partial<Task> }` | 업무 수정 알림 |
| `task:state_changed` | `{ spaceId: number, taskId: number, newState: string }` | 업무 상태 변경 알림 |
| `task:deleted` | `{ spaceId: number, taskId: number }` | 업무 삭제 알림 |
| `user:joined` | `{ user: WorkspaceUser }` | 사용자 입장 알림 |
| `user:left` | `{ userId: number }` | 사용자 퇴장 알림 |
| `workspace:users` | `{ users: WorkspaceUser[] }` | 워크스페이스 사용자 목록 |
| `error` | `{ message: string }` | 오류 알림 |

### 3.3 사용자 정보 인터페이스

```typescript
interface WorkspaceUser {
  userId: number;
  nickname: string;
  profileImg: string;
}
```

## 4. 인증 처리 (선택 사항)

보안이 필요한 경우 Socket.IO 미들웨어를 사용하여 인증을 구현할 수 있습니다:

```javascript
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
```

클라이언트에서는 연결 시 인증 토큰을 제공합니다:

```typescript
this.socket = io(url, {
  withCredentials: true,
  auth: {
    token: 'your-auth-token'
  }
});
```

## 5. 테스트 및 디버깅

### 5.1 클라이언트 측 테스트

브라우저 콘솔에서 WebSocket 연결 및 이벤트를 확인할 수 있습니다. 다음과 같은 로그가 출력됩니다:

- `WebSocket connected`: 연결 성공
- `Joined workspace: [ID]`: 워크스페이스 입장
- `Emitted task created event: [DATA]`: 업무 생성 이벤트 발신
- `Task updated: [DATA]`: 업무 업데이트 이벤트 수신

### 5.2 서버 측 테스트

서버 콘솔에서 다음과 같은 로그를 확인할 수 있습니다:

- `사용자 연결됨: [SOCKET_ID]`: 새로운 연결
- `사용자 [SOCKET_ID]가 workspace:[ID]에 입장`: 워크스페이스 입장
- `업무 생성 이벤트 수신: [DATA]`: 업무 생성 이벤트 수신
- `[ROOM]의 다른 사용자들에게 업무 생성 이벤트 전달`: 이벤트 브로드캐스트

## 6. 주의사항

1. WebSocket 서버는 클라이언트와 동일한 도메인에서 실행하거나, CORS 설정을 올바르게 구성해야 합니다.
2. 프로덕션 환경에서는 보안을 위해 인증 처리를 구현하는 것이 좋습니다.
3. 대규모 시스템에서는 Redis 어댑터를 사용하여 여러 서버 인스턴스 간에 Socket.IO 이벤트를 공유할 수 있습니다.
