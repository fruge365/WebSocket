let socket = null;
let handleMessage = null;
let handleErr = null;
let reconnectAttempts = 0;
let maxReconnectAttempts = 5;
let reconnectInterval = 3000;
let isManualClose = false;
let originalUrl = '';

let originalToken = null;

/**
 * 初始化连接websocket,监听websocket各状态
 * @param {string} url websocket 地址
 * @param {string} token 可选的token参数
 */
function initSocket(url, token = null) {
  if (typeof WebSocket === "undefined") {
    console.error("初始化失败, 不支持使用WebSocket");
    return false;
  }
  
  const protocols = token ? [token] : undefined;
  
  try {
    socket = new WebSocket(url, protocols);
  } catch (error) {
    console.error('WebSocket连接创建失败:', error);
    return false;
  }

  // 连接成功
  socket.onopen = (e) => {
    socketOnOpen();
  };
  // 返回数据
  socket.onmessage = (e) => {
    socketOnMessage(e);
  };
  // 连接失败
  socket.onerror = (e) => {
    socketOnError();
  };
  // 连接关闭时触发
  socket.onclose = (e) => {
    console.log('连接关闭', e.code, e.reason);
    if (!isManualClose && reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        console.log(`尝试重连 (${reconnectAttempts}/${maxReconnectAttempts})`);
        initSocket(originalUrl, originalToken);
      }, reconnectInterval);
    }
  };
  
  return true;
}

// 连接成功后的操作
function socketOnOpen(e) {
  console.log("WebSocket连接成功");
  reconnectAttempts = 0; // 重置重连次数
  isManualClose = false;
}

// 接收到websocket传过来message后的操作
const socketOnMessage = (e) => {
  if (e) {
    handleMessage(e);
  }
}

// 连接错误后的操作
function socketOnError(e) {
  console.error('WebSocket连接错误:', e);
  if (handleErr) {
    handleErr(e);
  }
}

// 向websocket传递参数数据
function socketSend(data) {
  if (!socket) {
    console.error('WebSocket未初始化');
    return false;
  }
  
  if (socket.readyState === WebSocket.OPEN) {
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      socket.send(message);
      return true;
    } catch (error) {
      console.error('发送消息失败:', error);
      return false;
    }
  } else {
    console.warn('WebSocket连接未就绪, 当前状态:', socket.readyState);
    return false;
  }
}

/** 连接websocket
 * @param {String} url 连接的websocket地址
 * @param {Object} options 配置选项

 * @param {String} options.token 可选的token参数

 * @param {Function} options.onMessage 获取websocket传过来的数据后的处理函数
 * @param {Function} options.onError websocket连接出错后的处理函数
 * @param {Number} options.maxReconnectAttempts 最大重连次数，默认5次
 * @param {Number} options.reconnectInterval 重连间隔，默认3000ms
 */
export function connectSocket(url, options = {}) {
  if (!url) {
    console.error('WebSocket URL不能为空');
    return false;
  }
  
  const {

    token = null,

    onMessage = null,
    onError = null,
    maxReconnectAttempts: maxAttempts = 5,
    reconnectInterval: interval = 3000
  } = options;
  
  // 设置全局配置
  maxReconnectAttempts = maxAttempts;
  reconnectInterval = interval;
  
  if (onMessage) {
    handleMessage = onMessage;
  }
  if (onError) {
    handleErr = onError;
  }

  // 保存原始参数用于重连
  originalUrl = url;
  originalToken = token;
  
  return initSocket(url, token);
}

// 关闭webSocket
export function closeSocket() {
  if (socket) {
    isManualClose = true;
    socket.close();
    socket = null;
  }
}

// 发送消息
export function sendMessage(data) {
  return socketSend(data);
}

// 获取连接状态
export function getSocketState() {
  if (!socket) return 'CLOSED';
  
  switch (socket.readyState) {
    case WebSocket.CONNECTING:
      return 'CONNECTING';
    case WebSocket.OPEN:
      return 'OPEN';
    case WebSocket.CLOSING:
      return 'CLOSING';
    case WebSocket.CLOSED:
      return 'CLOSED';
    default:
      return 'UNKNOWN';
  }
}

// 检查是否连接
export function isConnected() {
  return socket && socket.readyState === WebSocket.OPEN;
}
