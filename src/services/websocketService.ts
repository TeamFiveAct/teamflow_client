//websocketService
import { io, Socket } from 'socket.io-client';
import actionDispatcherService from './actionDispatcherService';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../store/modules/taskSlice';

// WebSocket 이벤트 타입 정의
export enum WebSocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  TASK_CREATED = 'task:created',
  TASK_UPDATED = 'task:updated',
  TASK_DELETED = 'task:deleted',
  TASK_STATE_CHANGED = 'task:state_changed',
  JOIN_WORKSPACE = 'join:workspace',
  LEAVE_WORKSPACE = 'leave:workspace',
  USER_JOINED = 'user:joined',
  USER_LEFT = 'user:left',
  WORKSPACE_USERS = 'workspace:users',
  ERROR = 'error'
}

// 워크스페이스 사용자 정보 인터페이스
export interface WorkspaceUser {
  userId: number;
  nickname: string;
  profileImg: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private workspaceId: number | null = null;
  private userId: number | null = null;
  private connectedUsers: WorkspaceUser[] = [];
  private onUsersChanged: ((users: WorkspaceUser[]) => void) | null = null;

  // WebSocket 연결 초기화
  public init(url: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(url, {
      withCredentials: true,
      transports: ['websocket']
    });

    // 디버깅: 모든 이벤트 로깅
    this.socket.onAny((event, ...args) => {
      console.log(`[WebSocket] 이벤트 수신: ${event}`, args);
    });

    this.setupEventListeners();
  }

  // 워크스페이스 입장 (userId 매개변수 추가)
  public joinWorkspace(workspaceId: number, userId: number): void {
    if (!this.socket) {
      console.error('WebSocket is not initialized');
      return;
    }

    this.workspaceId = workspaceId;
    this.userId = userId;
    
    // userId가 없으면 오류 로그
    if (!userId) {
      console.error('User ID is required to join workspace');
      return;
    }
    
    // workspaceId와 userId 함께 전송
    this.socket.emit(WebSocketEvent.JOIN_WORKSPACE, { 
      workspaceId, 
      userId 
    });
    
    console.log(`Joined workspace: ${workspaceId} with user: ${userId}`);
    
    // 디버깅: 자신을 사용자 목록에 추가
    const selfUser: WorkspaceUser = {
      userId,
      nickname: `User${userId}`,
      profileImg: `User${userId}` // 기본값으로 사용자 ID 기반 이름 사용
    };
    
    // 자신을 사용자 목록에 추가하고 알림
    this.connectedUsers = [selfUser];
    this.notifyUsersChanged();
    console.log('[WebSocket] 자신을 사용자 목록에 추가:', selfUser);
  }

  // 워크스페이스 퇴장
  public leaveWorkspace(): void {
    if (!this.socket || !this.workspaceId) {
      return;
    }

    this.socket.emit(WebSocketEvent.LEAVE_WORKSPACE, { workspaceId: this.workspaceId });
    this.workspaceId = null;
    this.userId = null;
    console.log('Left workspace');
  }

  // 연결 종료
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.workspaceId = null;
      this.userId = null;
    }
  }

  // 이벤트 리스너 설정
  private setupEventListeners(): void {
    if (!this.socket) return;

    // 연결 성공
    this.socket.on(WebSocketEvent.CONNECT, () => {
      console.log('WebSocket connected');
      
      // 이미 워크스페이스 ID와 사용자 ID가 있으면 자동으로 재입장
      if (this.workspaceId && this.userId) {
        this.joinWorkspace(this.workspaceId, this.userId);
      }
    });

    // 연결 종료
    this.socket.on(WebSocketEvent.DISCONNECT, (reason) => {
      console.log(`WebSocket disconnected: ${reason}`);
    });

    // 업무 생성 이벤트
    this.socket.on(WebSocketEvent.TASK_CREATED, (data) => {
      console.log('Task created:', data);
      actionDispatcherService.dispatch(createTask(data.task));
    });

    // 업무 업데이트 이벤트
    this.socket.on(WebSocketEvent.TASK_UPDATED, (data) => {
      console.log('Task updated:', data);
      actionDispatcherService.dispatch(updateTask(data.task));
    });

    // 업무 삭제 이벤트
    this.socket.on(WebSocketEvent.TASK_DELETED, (data) => {
      console.log('Task deleted:', data);
      actionDispatcherService.dispatch(deleteTask(data.taskId));
    });

    // 업무 상태 변경 이벤트
    this.socket.on(WebSocketEvent.TASK_STATE_CHANGED, (data) => {
      console.log('Task state changed:', data);
      actionDispatcherService.dispatch(updateTask({
        todo_id: data.taskId,
        state: data.newState
      }));
    });

    // 사용자 입장 이벤트
    this.socket.on(WebSocketEvent.USER_JOINED, (data) => {
      console.log('User joined:', data);
      this.connectedUsers.push(data.user);
      this.notifyUsersChanged();
    });

    // 사용자 퇴장 이벤트
    this.socket.on(WebSocketEvent.USER_LEFT, (data) => {
      console.log('User left:', data);
      this.connectedUsers = this.connectedUsers.filter(
        user => user.userId !== data.userId
      );
      this.notifyUsersChanged();
    });

    // 워크스페이스 사용자 목록 이벤트
    this.socket.on(WebSocketEvent.WORKSPACE_USERS, (data) => {
      console.log('Workspace users:', data);
      this.connectedUsers = data.users;
      this.notifyUsersChanged();
    });

    // 에러 이벤트
    this.socket.on(WebSocketEvent.ERROR, (error) => {
      console.error('WebSocket error:', error);
    });
  }

  // 사용자 목록 변경 알림
  private notifyUsersChanged(): void {
    if (this.onUsersChanged) {
      this.onUsersChanged([...this.connectedUsers]);
    }
  }

  // 이벤트 발신 메서드
  public emitTaskCreated(spaceId: number, task: any): void {
    if (!this.socket) {
      console.error('WebSocket is not initialized');
      return;
    }
    this.socket.emit(WebSocketEvent.TASK_CREATED, { spaceId, task });
    console.log('Emitted task created event:', { spaceId, task });
  }

  public emitTaskUpdated(spaceId: number, task: any): void {
    if (!this.socket) {
      console.error('WebSocket is not initialized');
      return;
    }
    this.socket.emit(WebSocketEvent.TASK_UPDATED, { spaceId, task });
    console.log('Emitted task updated event:', { spaceId, task });
  }

  public emitTaskStateChanged(spaceId: number, taskId: number, newState: string): void {
    if (!this.socket) {
      console.error('WebSocket is not initialized');
      return;
    }
    this.socket.emit(WebSocketEvent.TASK_STATE_CHANGED, { spaceId, taskId, newState });
    console.log('Emitted task state changed event:', { spaceId, taskId, newState });
  }

  public emitTaskDeleted(spaceId: number, taskId: number): void {
    if (!this.socket) {
      console.error('WebSocket is not initialized');
      return;
    }
    this.socket.emit(WebSocketEvent.TASK_DELETED, { spaceId, taskId });
    console.log('Emitted task deleted event:', { spaceId, taskId });
  }

  // 연결된 사용자 목록 반환
  public getConnectedUsers(): WorkspaceUser[] {
    return [...this.connectedUsers];
  }

  // 사용자 목록 변경 콜백 설정
  public setOnUsersChanged(callback: (users: WorkspaceUser[]) => void): void {
    this.onUsersChanged = callback;
  }
}

// 싱글톤 인스턴스 생성
export const websocketService = new WebSocketService();
export default websocketService;
