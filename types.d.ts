export interface WebSocketOptions {

  /** 可选的token参数 */
  token?: string;

  /** 获取websocket传过来的数据后的处理函数 */
  onMessage?: (event: MessageEvent) => void;
  /** websocket连接出错后的处理函数 */
  onError?: (error: Event) => void;
  /** 最大重连次数，默认5次 */
  maxReconnectAttempts?: number;
  /** 重连间隔，默认3000ms */
  reconnectInterval?: number;
}

export type SocketState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNKNOWN';

/**
 * 连接websocket
 * @param url 连接的websocket地址
 * @param options 配置选项
 * @returns 是否成功初始化连接
 */
export declare function connectSocket(url: string, options?: WebSocketOptions): boolean;

/**
 * 关闭webSocket连接
 */
export declare function closeSocket(): void;

/**
 * 发送消息
 * @param data 要发送的数据
 * @returns 是否发送成功
 */
export declare function sendMessage(data: any): boolean;

/**
 * 获取连接状态
 * @returns 当前连接状态
 */
export declare function getSocketState(): SocketState;

/**
 * 检查是否连接
 * @returns 是否已连接
 */
export declare function isConnected(): boolean;