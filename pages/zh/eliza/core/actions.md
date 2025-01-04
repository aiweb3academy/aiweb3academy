# ⚡ 动作（Actions）

动作是 Eliza 中的核心构建块，用于定义智能体如何响应和与消息交互。它们允许智能体与外部系统交互、修改其行为并执行超出简单消息回复的任务。

---

## 概述

每个动作包含以下内容：

- `name`：动作的唯一标识符
- `similes`：替代性的名称/变体的数组
- `description`：动作目的的详细解释
- `validate`：检查动作是否合适的函数
- `handler`：动作行为的实现
- `examples`：使用模式示例的数组

---

## 实现

```typescript
interface Action {
  name: string
  similes: string[]
  description: string
  examples: ActionExample[][]
  handler: Handler
  validate: Validator
}
```

来源：https://github.com/elizaos/eliza/packages/core/src/types.ts

---

# 内置动作

---

## 对话流程

### CONTINUE

- 在需要更多上下文时维持对话
- 管理自然对话的进展
- 最多连续使用 3 次

### IGNORE

- 优雅地结束对话
- 处理：
  - 不恰当的交互
  - 自然对话结束
  - 对话结束后的回复

### NONE

- 默认回复动作
- 用于标准的对话回复

---

## 外部集成

### TAKE_ORDER

- 记录交易/购买订单
- 处理用户的信念水平
- 验证代币符号和合约地址

```typescript
const take_order: Action = {
  name: 'TAKE_ORDER',
  similes: ['BUY_ORDER', 'PLACE_ORDER'],
  description: '根据用户的信念水平记录买入订单。',
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const text = (message.content as Content).text
    const tickerRegex = /\b[A-Z]{1,5}\b/g
    return tickerRegex.test(text)
  },
  //... 其余实现部分
}
```

来源：https://github.com/elizaos/eliza/packages/plugin-solana/src/actions/takeOrder.ts

---

## 创建自定义动作

1. 实现 Action 接口
2. 定义验证逻辑
3. 实现处理函数功能
4. 提供使用示例

示例：

```typescript
const customAction: Action = {
  name: 'CUSTOM_ACTION',
  similes: ['SIMILAR_ACTION'],
  description: '动作目的',
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    // 验证逻辑
    return true
  },
  handler: async (runtime: IAgentRuntime, message: Memory) => {
    // 实现
  },
  examples: [],
}
```

### 测试动作

使用内置测试框架：

```typescript
test('验证动作行为', async () => {
  const message: Memory = {
    userId: user.id,
    content: { text: '测试消息' },
    roomId,
  }

  const response = await handleMessage(runtime, message)
  // 验证回复
})
```

---

## 核心概念

### 动作结构

```typescript
interface Action {
  name: string;
  similes: string[];
  description: string;
  validate: (runtime: IAgentRuntime, message: Memory) => Promise<boolean>;
  handler: (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
  ) => Promise<void>;
  examples: ActionExample[][];
  suppressInitialMessage?: boolean;
}
```

### 关键组件

- **name**：动作的唯一标识符
- **similes**：动作的替代名称/触发器
- **description**：解释动作应在何时以及如何使用
- **validate**：确定动作是否可以执行
- **handler**：实现动作的行为
- **examples**：展示正确的使用模式
- **suppressInitialMessage**：当该值为真时，会在处理操作之前抑制初始响应消息。这对于那些会自行生成响应的操作（如图像生成）很有用。

---

## 内置动作

### CONTINUE

在合适的时候继续对话：

```typescript
const continueAction: Action = {
  name: 'CONTINUE',
  similes: ['ELABORATE', 'KEEP_TALKING'],
  description: '当消息需要后续内容时使用。当对话结束时不要使用。',
  validate: async (runtime, message) => {
    // 验证逻辑
    return true
  },
  handler: async (runtime, message, state) => {
    // 继续逻辑
  },
}
```

### IGNORE

停止对不相关或已结束的对话进行回复：

```typescript
const ignoreAction: Action = {
  name: 'IGNORE',
  similes: ['STOP_TALKING', 'STOP_CHATTING'],
  description: '在适合忽略用户时使用（对话结束、用户表现出攻击性等）',
  handler: async (runtime, message) => {
    return true
  },
}
```

### FOLLOW_ROOM

积极参与对话：

```typescript
const followRoomAction: Action = {
  name: 'FOLLOW_ROOM',
  similes: ['FOLLOW_CHAT', 'FOLLOW_CONVERSATION'],
  description: '开始关注感兴趣的频道，在未被明确提及的情况下进行回复。',
  handler: async (runtime, message) => {
    // 关注房间的逻辑
  },
}
```

---

## 创建自定义动作

### 基本动作模板

```typescript
const customAction: Action = {
  name: 'CUSTOM_ACTION',
  similes: ['ALTERNATE_NAME', 'OTHER_TRIGGER'],
  description: '此动作何时以及如何使用的详细描述',
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    // 验证逻辑
    return true
  },
  handler: async (runtime: IAgentRuntime, message: Memory) => {
    // 实现逻辑
    return true
  },
  examples: [
    [
      {
        user: '{{user1}}',
        content: { text: '触发消息' },
      },
      {
        user: '{{user2}}',
        content: { text: '回复', action: 'CUSTOM_ACTION' },
      },
    ],
  ],
}
```

### 高级动作示例

```typescript
const complexAction: Action = {
  name: 'PROCESS_DOCUMENT',
  similes: ['READ_DOCUMENT', 'ANALYZE_DOCUMENT'],
  description: '处理和分析上传的文档',
  validate: async (runtime, message) => {
    const hasAttachment = message.content.attachments?.length > 0
    const supportedTypes = ['pdf', 'txt', 'doc']
    return hasAttachment && supportedTypes.includes(message.content.attachments[0].type)
  },
  handler: async (runtime, message, state) => {
    const attachment = message.content.attachments[0]

    // 处理文档
    const content = await runtime.getService<IDocumentService>(ServiceType.DOCUMENT).processDocument(attachment)

    // 存储到记忆中
    await runtime.documentsManager.createMemory({
      id: generateId(),
      content: { text: content },
      userId: message.userId,
      roomId: message.roomId,
    })

    return true
  },
}
```

---

## 实现模式

### 基于状态的动作

```typescript
const stateAction: Action = {
  name: 'UPDATE_STATE',
  handler: async (runtime, message, state) => {
    const newState = await runtime.composeState(message, {
      additionalData: 'new-data',
    })

    await runtime.updateState(newState)
    return true
  },
}
```

### 服务集成

```typescript
const serviceAction: Action = {
  name: 'TRANSCRIBE_AUDIO',
  handler: async (runtime, message) => {
    const transcriptionService = runtime.getService<ITranscriptionService>(ServiceType.TRANSCRIPTION)

    const result = await transcriptionService.transcribe(message.content.attachments[0])

    return true
  },
}
```

---

## 最佳实践

### 动作设计

1. **目的明确**

   - 单一职责原则
   - 定义清晰的触发器
   - 明确的成功标准

2. **健壮的验证**

   - 检查先决条件
   - 验证输入数据
   - 处理边缘情况

3. **错误处理**
   - 失败时保持优雅
   - 提供有意义的错误信息
   - 状态恢复

### 示例组织

1. **全面覆盖**

```typescript
examples: [
  // 正常情况
  [basicUsageExample],
  // 边缘情况
  [edgeCaseExample],
  // 错误情况
  [errorCaseExample],
]
```

2. **清晰的上下文**

```typescript
examples: [
  [
    {
      user: '{{user1}}',
      content: {
        text: '显示为何需要动作的上下文消息',
      },
    },
    {
      user: '{{user2}}',
      content: {
        text: '展示动作使用的清晰回复',
        action: 'ACTION_NAME',
      },
    },
  ],
]
```

---

## 故障排除

### 常见问题

1. **动作未触发**

   - 检查验证逻辑
   - 验证 similes 列表
   - 检查示例模式

2. **处理函数失败**

   - 验证服务可用性
   - 检查状态要求
   - 查看错误日志

3. **状态不一致**
   - 验证状态更新
   - 检查并发修改
   - 检查状态转换

## 高级功能

### 动作组合

```typescript
const compositeAction: Action = {
  name: 'PROCESS_AND_RESPOND',
  handler: async (runtime, message) => {
    // 处理第一个动作
    await runtime.processAction('ANALYZE_CONTENT', message)

    // 处理第二个动作
    await runtime.processAction('GENERATE_RESPONSE', message)

    return true
  },
}
```

### 动作链

```typescript
const chainedAction: Action = {
  name: 'WORKFLOW',
  handler: async (runtime, message) => {
    const actions = ['VALIDATE', 'PROCESS', 'RESPOND']

    for (const actionName of actions) {
      await runtime.processAction(actionName, message)
    }

    return true
  },
}
```

---

## 示例：完整的动作实现

```typescript
import { Action, IAgentRuntime, Memory, State } from '@ai16z/eliza'

const documentAnalysisAction: Action = {
  name: 'ANALYZE_DOCUMENT',
  similes: ['READ_DOCUMENT', 'PROCESS_DOCUMENT', 'REVIEW_DOCUMENT'],
  description: '分析上传的文档并提供见解',

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    // 检查文档附件
    if (!message.content.attachments?.length) {
      return false
    }

    // 验证文档类型
    const attachment = message.content.attachments[0]
    return ['pdf', 'txt', 'doc'].includes(attachment.type)
  },

  handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    try {
      // 获取文档服务
      const docService = runtime.getService<IDocumentService>(ServiceType.DOCUMENT)

      // 处理文档
      const content = await docService.processDocument(message.content.attachments[0])

      // 存储分析结果
      await runtime.documentsManager.createMemory({
        id: generateId(),
        content: {
          text: content,
          analysis: await docService.analyze(content),
        },
        userId: message.userId,
        roomId: message.roomId,
        createdAt: Date.now(),
      })

      return true
    } catch (error) {
      console.error('文档分析失败:', error)
      return false
    }
  },

  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: '你能分析这个文档吗？',
          attachments: [{ type: 'pdf', url: 'document.pdf' }],
        },
      },
      {
        user: '{{user2}}',
        content: {
          text: '我会为你分析该文档',
          action: 'ANALYZE_DOCUMENT',
        },
      },
    ],
  ],
}
```

---

# 最佳实践

1. **验证**

   - 彻底检查输入参数
   - 验证运行时条件
   - 处理边缘情况

2. **错误处理**

   - 实现全面的错误捕获
   - 提供清晰的错误信息
   - 正确清理资源

3. **文档**
   - 包含清晰的使用示例
   - 记录预期的输入/输出
   - 解释错误场景

---

## 进一步阅读

- [提供者系统](./providers.md)
- [服务集成](#)
- [记忆管理](../../packages/core)
