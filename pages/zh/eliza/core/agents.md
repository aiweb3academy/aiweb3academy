# 🤖 智能体

智能体是 Eliza 框架的核心组件，负责处理自主交互。每个智能体在运行时环境中运行，并能通过各种客户端（Discord、Telegram 等）进行交互，同时保持一致的行为和记忆。

---

## 概述

[AgentRuntime](/api/classes/AgentRuntime) 类是 [IAgentRuntime](/api/interfaces/IAgentRuntime) 接口的主要实现，它管理智能体的核心功能，包括：
- **消息和记忆处理**：存储、检索和管理对话数据以及上下文记忆。
- **状态管理**：为连贯的持续交互构建和更新智能体的状态。
- **动作执行**：处理诸如转录媒体、生成图像和关注房间等行为。
- **评估和响应**：评估回复、管理目标并提取相关信息。

---

## 核心组件

每个智能体运行时由一些关键组件构成，这些组件实现了灵活且可扩展的功能：

1. **客户端**：支持跨平台（如 Discord、Telegram 和 Direct（REST API））通信，每个平台都有其专门的功能。
2. **提供者**：通过集成额外的服务（例如时间、钱包或自定义数据）来扩展智能体的能力。
3. **动作**：定义智能体的行为，例如关注房间、生成图像或处理附件。可以创建自定义动作以满足特定需求。
4. **评估器**：通过评估消息相关性、管理目标、提取事实和构建长期记忆来管理智能体的回复。

### AgentRuntime 接口

`IAgentRuntime` 接口定义了运行时环境的主要结构，指定了配置和关键组件：
```typescript
interface IAgentRuntime {
  // 核心标识
  agentId: UUID;
  serverUrl: string;
  token: string;

  // 配置
  character: Character;
  modelProvider: ModelProviderName;

  // 组件
  actions: Action[];
  evaluators: Evaluator[];
  providers: Provider[];

  // 数据库和记忆
  databaseAdapter: IDatabaseAdapter;
  messageManager: IMemoryManager;
  descriptionManager: IMemoryManager;
  loreManager: IMemoryManager;
}
```

运行时接口中的每个元素都起着至关重要的作用：
- **标识**：智能体 ID、服务器 URL 和令牌用于认证和标识。
- **配置**：角色配置文件和模型提供方定义了智能体的个性和语言模型。
- **组件**：动作、评估器和提供者支持可扩展的行为、回复评估和服务集成。
- **记忆管理**：专门的记忆管理器跟踪对话、描述和静态知识，以实现上下文和适应性回复。

---

## 创建智能体运行时

本节将演示如何使用基本和可选配置来设置智能体。它提供了一个可运行的示例和示例代码，帮助用户快速开始构建：
```typescript
import { AgentRuntime, ModelProviderName } from "@ai16z/eliza";

// 配置示例
const runtime = new AgentRuntime({
  token: "auth-token",
  modelProvider: ModelProviderName.ANTHROPIC,
  character: characterConfig,
  databaseAdapter: new DatabaseAdapter(),
  conversationLength: 32,
  serverUrl: "http://localhost:7998",
  actions: customActions,
  evaluators: customEvaluators,
  providers: customProviders,
});
```

---

## 状态管理

本节将介绍智能体如何管理和更新状态，重点关注初始状态的构建和更新方法。运行时通过 [State](/api/interfaces/state) 接口维护状态：
```typescript
interface State {
  userId?: UUID;
  agentId?: UUID;
  roomId: UUID;
  bio: string;
  lore: string;
  agentName?: string;
  senderName?: string;
  actors: string;
  actorsData?: Actor[];
  recentMessages: string;
  recentMessagesData: Memory[];
  goals?: string;
  goalsData?: Goal[];
  actions?: string;
  actionNames?: string;
  providers?: string;
}
```

状态的构建和更新通过专门的方法处理：
```typescript
// 构建初始状态
const state = await runtime.composeState(message, {
  additionalContext: "custom-context",
});

// 更新消息状态
const updatedState = await runtime.updateRecentMessageState(state);
```

**最佳实践**：
- 尽可能保持状态不可变。
- 使用 `composeState` 进行初始状态创建。
- 使用 `updateRecentMessageState` 进行更新。
- 缓存频繁访问的状态数据。

---

## 记忆系统

Eliza 框架使用多种类型的记忆来支持智能体的长期参与、上下文理解和适应性回复。每种类型的记忆都有其特定用途：
- **消息历史**：存储最近的对话，以在会话中提供连贯性。这有助于智能体保持对话上下文，避免在短期交流中重复回复。
- **事实记忆**：存储关于用户或环境的特定的基于上下文的事实，例如用户偏好、最近的活动或之前交互中提到的具体细节。这种类型的记忆使智能体能够跨会话记住用户特定的信息。
- **知识库**：包含智能体可能需要用于回复更广泛的查询或提供信息性答案的一般知识。这种记忆相对静态，帮助智能体检索预定义的数据、常见回复或静态的角色背景信息。
- **关系追踪**：管理智能体对其与用户关系的理解，包括用户-智能体交互频率、情感和连接历史等细节。随着时间的推移，这对于建立融洽关系和提供更个性化的交互体验特别有用。
- **RAG 集成**：使用向量搜索根据相似度匹配进行上下文回忆。这使智能体能够根据当前对话的内容和意图检索相关的记忆片段或知识，使其回复更具上下文相关性。

运行时使用多个专门的 [IMemoryManager](/api/interfaces/IMemoryManager) 实例：
- `messageManager` - 对话消息和回复
- `descriptionManager` - 用户描述和档案
- `loreManager` - 静态角色知识

---

## 消息处理

运行时的消息处理通过 [processActions](/api/classes/AgentRuntime#processactions) 方法进行：
```typescript
// 使用动作处理消息
await runtime.processActions(message, responses, state, async (newMessages) => {
  // 处理新消息
  return [message];
});
```

---

## 服务和记忆管理

服务通过 [getService](/api/classes/AgentRuntime#getservice) 和 [registerService](/api/classes/AgentRuntime#registerservice) 方法进行管理：
```typescript
// 注册服务
runtime.registerService(new TranscriptionService());

// 获取服务
const service = runtime.getService<ITranscriptionService>(
  ServiceType.TRANSCRIPTION,
);
```

### 记忆管理
通过 [getMemoryManager](/api/classes/AgentRuntime#getmemorymanager) 访问记忆管理器：
```typescript
// 获取记忆管理器
const memoryManager = runtime.getMemoryManager("messages");

// 创建记忆
await memoryManager.createMemory({
  id: messageId,
  content: { text: "Message content" },
  userId: userId,
  roomId: roomId,
});
```

**最佳实践**：
- 针对不同的数据类型使用合适的记忆管理器。
- 存储数据时考虑内存限制，定期清理内存。
- 使用 `unique` 标志进行去重存储。
- 定期清理旧的记忆。
- 在状态管理中使用不可变性。
- 在服务失败时记录错误并保持系统稳定性。

---

## 评估系统
运行时的 [evaluate](/api/classes/AgentRuntime#evaluate) 方法处理评估：
```typescript
// 评估消息
const evaluationResults = await runtime.evaluate(message, state, didRespond);
```

---

## 使用示例

1. **消息处理**：
```typescript
await runtime.processActions(message, responses, state, (newMessages) => {
  return [message];
});
```

2. **状态管理**：
```typescript
const state = await runtime.composeState(message, {
  additionalContext: "0custom-context",
});
```

3. **记忆管理**：
```typescript
const memoryManager = runtime.getMemoryManager("messages");
await memoryManager.createMemory({
  id: messageId,
  content: { text: "Message content" },
  userId,
  roomId,
});
```

---

## 进一步阅读
- [动作文档](./actions.md)
- [评估器文档](./evaluators.md)
- [提供者文档](./providers.md)
- [完整 API 参考](/api)
