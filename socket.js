let socket = null;
let handleMessage = null;
let handleErr = null;

/**
 * 初始化连接websocket,监听websocket各状态
 * @param {string} url websocket 地址
 * @param {string} params 地址后面拼接的参数，例如 
 */
function initSocket(url, params) {
  if (typeof WebSocket === "undefined") {
    console.log("初始化失败, 不支持使用WebSocket");
  }
  socket = new WebSocket(url + params, [TokenKey]);

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
    console.log('连接关闭');
  };
}

// 连接成功后的操作
function socketOnOpen(e) {
  // console.log("连接成功");
}

// 接收到websocket传过来message后的操作
const socketOnMessage = (e) => {
  if (e) {
    handleMessage(e);
  }
}

// 连接错误后的操作
function socketOnError(e) {
  if (handleErr) {
    handleErr();
  }
}

// 向websocket传递参数数据
function socketSend(data) {
  setTimeout(() => {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(data));
    } else if (socket.readyState === 3) {
      console.log("WebSocket链接已关闭, 没有链接成功");
    }
  }, 500);
}

/** 发送websocket请求
 * @param {String} url 连接的websocket地址
 * @param {Object} data 需要传递的参数
 * @param {Function} handleData 获取websocket传过来的数据后的处理函数
 * @param {Function} handleError websocket连接出错后的处理函数
 */
export function connectSocket(url, data, handleData, handleError) {

  if (handleData) {
    handleMessage = handleData;
  }
  if (handleError) {
    handleErr = handleError;
  }

  initSocket(url, data); //初始化
  socketSend(data); //发送参数
}

// 关闭webSocket
export function closeSocket() {
  if (socket) {
    socket.close();
  }
}
