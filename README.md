<div align="center">

# 🚀 websocket-fruge365

**一个简单易用的WebSocket客户端库，支持自动重连、错误处理和消息管理**

[![npm version](https://img.shields.io/npm/v/websocket-fruge365.svg?style=flat-square)](https://www.npmjs.com/package/websocket-fruge365)
[![npm downloads](https://img.shields.io/npm/dm/websocket-fruge365.svg?style=flat-square)](https://www.npmjs.com/package/websocket-fruge365)
[![license](https://img.shields.io/npm/l/websocket-fruge365.svg?style=flat-square)](https://github.com/fruge365/websocket-fruge365/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/websocket-fruge365.svg?style=flat-square)](https://www.npmjs.com/package/websocket-fruge365)

</div>

---

## ✨ 特性

<div align="center">

| 特性 | 描述 |
|------|------|
| 🚀 | **简单易用的API** - 几行代码即可实现WebSocket连接 |
| 🔄 | **自动重连机制** - 连接断开时自动尝试重连 |
| 🛡️ | **完善的错误处理** - 提供详细的错误信息和处理机制 |
| 📝 | **TypeScript支持** - 完整的类型定义，开发更安全 |
| 🌐 | **跨平台支持** - 同时支持浏览器和Node.js环境 |
| ⚡ | **轻量级设计** - 无额外依赖，体积小巧 |

</div>

## 📦 安装

<div align="center">

```bash
# 使用 npm
npm install websocket-fruge365

# 或者使用 yarn
yarn add websocket-fruge365

# 或者使用 pnpm
pnpm add websocket-fruge365
```

</div>

## 🚀 快速开始

### 基本用法

```javascript
import { connectSocket, sendMessage, closeSocket } from 'websocket-fruge365';

// 连接WebSocket
connectSocket('ws://localhost:8080', {
  onMessage: (event) => {
    console.log('收到消息:', event.data);
  },
  onError: (error) => {
    console.error('连接错误:', error);
  }
});

// 发送消息
sendMessage({ type: 'hello', message: 'Hello WebSocket!' });

// 关闭连接
closeSocket();
```

### 带参数连接

```javascript
import { connectSocket } from 'websocket-fruge365';

connectSocket('ws://localhost:8080?userId=123&token=abc', {
  token: 'your-auth-token',
  onMessage: (event) => {
    const data = JSON.parse(event.data);
    console.log('收到消息:', data);
  },
  onError: (error) => {
    console.error('连接失败:', error);
  },
  maxReconnectAttempts: 3,
  reconnectInterval: 5000
});

// 连接成功后发送消息
setTimeout(() => {
  sendMessage({ action: 'join', room: 'chat-room' });
}, 1000);
```

### Vue3中使用

```javascript
<script setup>
import { connectSocket, sendMessage, closeSocket } from 'websocket-fruge365';
import { onMounted, onUnmounted } from 'vue';

const initWebSocket = () => {
  connectSocket('ws://localhost:8080', {
    onMessage: (event) => {
      console.log('收到消息:', event.data);
    },
    onError: (error) => {
      console.error('连接错误:', error);
    }
  });
  
  // 等待连接建立后发送消息
  setTimeout(() => {
    sendMessage({ type: 'hello', message: 'Hello from Vue3!' });
  }, 1000);
}

onMounted(() => {
  initWebSocket();
});

onUnmounted(() => {
  closeSocket();
});
</script>
```

## 📚 API 文档

### 🔗 connectSocket(url, options)

连接WebSocket服务器。

**参数:**
- `url` (string): WebSocket服务器地址
- `options` (object): 配置选项

  - `token` (string): 可选的token参数

  - `onMessage` (function): 消息处理函数
  - `onError` (function): 错误处理函数
  - `maxReconnectAttempts` (number): 最大重连次数，默认5次
  - `reconnectInterval` (number): 重连间隔，默认3000ms

**返回值:**
- `boolean`: 是否成功初始化连接

### 📤 sendMessage(data)

发送消息到WebSocket服务器。

**参数:**
- `data` (any): 要发送的数据，会自动转换为JSON字符串

**返回值:**
- `boolean`: 是否发送成功

### 🔒 closeSocket()

关闭WebSocket连接。

### 📊 getSocketState()

获取当前连接状态。

**返回值:**
- `string`: 连接状态 ('CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNKNOWN')

### ✅ isConnected()

检查是否已连接。

**返回值:**
- `boolean`: 是否已连接

## 💡 使用示例

### 聊天应用

```javascript
import { connectSocket, sendMessage, isConnected } from 'websocket-fruge365';

class ChatClient {
  constructor(url, userId) {
    this.userId = userId;
    this.connect(url);
  }

  connect(url) {
    connectSocket(`${url}?userId=${this.userId}`, {
      onMessage: this.handleMessage.bind(this),
      onError: this.handleError.bind(this),
      maxReconnectAttempts: 5,
      reconnectInterval: 3000
    });
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);
    console.log(`${message.user}: ${message.text}`);
  }

  handleError(error) {
    console.error('聊天连接错误:', error);
  }

  sendChatMessage(text) {
    if (isConnected()) {
      sendMessage({
        type: 'chat',
        user: this.userId,
        text: text,
        timestamp: Date.now()
      });
    } else {
      console.warn('未连接到聊天服务器');
    }
  }
}

// 使用示例
const chat = new ChatClient('ws://localhost:8080', 'user123');
chat.sendChatMessage('Hello everyone!');
```

### 实时数据监控

```javascript
import { connectSocket, getSocketState } from 'websocket-fruge365';

connectSocket('ws://api.example.com/realtime', {
  onMessage: (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'price':
        updatePriceDisplay(data.value);
        break;
      case 'volume':
        updateVolumeChart(data.value);
        break;
    }
  },
  onError: (error) => {
    console.error('数据连接中断:', error);
    showConnectionStatus('disconnected');
  },
  maxReconnectAttempts: 10,
  reconnectInterval: 2000
});

// 连接成功后订阅数据
setTimeout(() => {
  sendMessage({ subscribe: ['price', 'volume'] });
}, 1000);

// 定期检查连接状态
setInterval(() => {
  const state = getSocketState();
  console.log('连接状态:', state);
}, 5000);
```

## 🔷 TypeScript 支持

本库提供完整的TypeScript类型定义：

```typescript
import { connectSocket, WebSocketOptions, SocketState } from 'websocket-fruge365';

const options: WebSocketOptions = {
  onMessage: (event: MessageEvent) => {
    console.log(event.data);
  },
  maxReconnectAttempts: 3
};

connectSocket('ws://localhost:8080?room=123', options);

connectSocket('ws://localhost:8080', options);
```

## 🌐 浏览器兼容性

<div align="center">

| 浏览器 | 支持版本 |
|---------|----------|
| 🌐 Chrome | 16+ |
| 🦊 Firefox | 11+ |
| 🦣 Safari | 7+ |
| 🟦 Edge | 12+ |
| 🔵 IE | 10+ |

</div>

## 🟢 Node.js 支持

需要Node.js 12.0.0或更高版本。在Node.js环境中使用时，需要安装`ws`包：

```bash
npm install ws
```

然后在代码中：

```javascript
// Node.js环境
global.WebSocket = require('ws');
import { connectSocket } from 'websocket-fruge365';
```

## 📄 许可证

MIT License

## 👨💻 作者信息

<div align="center">

**👋 作者**: fruge365

[![GitHub](https://img.shields.io/badge/GitHub-fruge365-181717?style=flat-square&logo=github)](https://github.com/fruge365)
[![CSDN](https://img.shields.io/badge/CSDN-fruge365-FC5531?style=flat-square&logo=csdn)](https://fruge365.blog.csdn.net/)

**✨ 快乐编码！如果这个库对你有帮助，请给个 Star ⭐**

</div>

---

## 🤝 贡献

欢迎提交Issue和Pull Request！让我们一起让这个库变得更好。

<div align="center">

---

**🚀 感谢使用 websocket-fruge365！**

*如果这个项目对你有帮助，请考虑给个 ⭐ Star*

</div>

## 📝 更新日志

<details>
<summary>📅 点击查看历史版本</summary>

### 🎆 v1.0.6 (Latest)
- ✨ 移除params参数，简化API
- 🔧 修复重连token丢失问题
- 📝 更新文档和示例

### 🔄 v1.0.2
- 🔧 修复参数拼接问题

### 🎉 v1.0.1
- ✨ 添加自动重连功能
- 🛡️ 改进错误处理
- 📝 添加TypeScript类型定义
- 🚀 优化API设计

### 🎆 v1.0.0
- 🎉 初始版本发布

</details>