# 🔌 提供者（Providers）

[提供者](../api/interfaces/Provider)是将动态上下文和实时信息注入智能体交互的核心模块。它们充当智能体和各种外部系统之间的桥梁，使智能体能够访问市场数据、钱包信息、情绪分析和时间上下文。

---

## 概述

提供者的主要目的是：

- 提供动态上下文信息
- 与智能体运行时集成
- 为对话模板格式化信息
- 保持一致的数据访问

### 核心结构

```typescript
interface Provider {
  get: (runtime: IAgentRuntime, message: Memory, state?: State) => Promise<string>
}
```

---

## 内置提供者

### 时间提供者

为智能体交互提供时间上下文：

```typescript
const timeProvider: Provider = {
  get: async (_runtime: IAgentRuntime, _message: Memory) => {
    const currentDate = new Date()
    const currentTime = currentDate.toLocaleTimeString('en-US')
    const currentYear = currentDate.getFullYear()
    return `The current time is: ${currentYear}`
  },
}
```

### 事实提供者

来自 bootstrap 插件 - 维护对话事实：

```typescript
const factsProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    // 为最近的消息创建 embedding 并检索相关 facts
    const recentMessages = formatMessages({
      messages: state?.recentMessagesData?.slice(-10),
      actors: state?.actorsData,
    })
    const embedding = await embed(runtime, recentMessages)
    const memoryManager = new MemoryManager({ runtime, tableName: 'facts' })
    const recentFactsData = await memoryManager.getMemories({
      roomId: message.roomId,
      count: 10,
      agentId: runtime.agentId,
    })

    // 合并并格式化 facts
    const allFacts = [...recentFactsData] // 如果没有重叠，可以跳过去重
    const formattedFacts = formatFacts(allFacts)

    return `Key facts that ${runtime.character.name} knows:\n${formattedFacts}`
  },
}

export { factsProvider }
```

### 厌倦（boredom）提供者

来自 bootstrap 插件 - 通过计算聊天室内最近消息的智能体厌倦水平来管理对话动态和参与度。

1. **数据结构**：

   - **boredomLevels**：一个 object 数组，每个 object 表示一个厌倦水平，包含一个最低分数和一组反映智能体当前参与度的状态消息。
   - **interestWords**、**cringeWords** 和 **negativeWords**：根据其在消息中的出现情况影响厌倦分数的单词数组。

2. **厌倦计算**：

   - `boredomProvider` 从智能体最近 15 分钟的对话中获取消息。
   - 它通过分析这些消息的文本来计算 **厌倦分数**。分数受以下因素影响：
     - **兴趣词**：降低厌倦度（减 1 分）。
     - **尴尬词**：增加厌倦度（加 1 分）。
     - **负面词**：增加厌倦度（加 1 分）。
     - **感叹号**：增加厌倦度（加 1 分）。
     - **问号**：根据发送者的不同增加或降低厌倦度。

3. **厌倦水平**：
   - 厌倦分数与 `boredomLevels` 数组中的一个水平相匹配，该水平定义了智能体的参与感。
   - 从所选的厌倦水平中随机选择一个状态消息，并将智能体的名称插入到消息中。

```typescript
interface BoredomLevel {
  minScore: number
  statusMessages: string[]
}
```

结果是一条消息，反映了智能体根据其最近的交互感知到的对话参与水平。

```typescript
const boredomProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory) => {
    const messages = await runtime.messageManager.getMemories({
      roomId: message.roomId,
      count: 10,
    })

    return messages.length > 0 ? '积极参与对话' : '最近没有交互'
  },
}
```

特点：
- 参与度跟踪
- 对话流程管理
- 自然脱离
- 情绪分析
- 响应调整

---

## 实现

### 基本提供者模板

```typescript
import { IAgentRuntime, Memory, Provider, State } from '@elizaos/core'

const customProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    // 使用运行时服务获取相关数据
    const memories = await runtime.messageManager.getMemories({
      roomId: message.roomId,
      count: 5,
    })

    // 格式化并返回上下文
    return formatContextString(memories)
  },
}
```

### 记忆集成

```typescript
const memoryProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory) => {
    // 获取最近的消息
    const messages = await runtime.messageManager.getMemories({
      roomId: message.roomId,
      count: 5,
      unique: true,
    })

    // 获取用户描述
    const descriptions = await runtime.descriptionManager.getMemories({
      roomId: message.roomId,
      userId: message.userId,
    })

    // 合并并格式化
    return `
最近的活动：
${formatMessages(messages)}

用户上下文：
${formatDescriptions(descriptions)}
    `.trim()
  },
}
```

---

## 最佳实践

### 1. 数据管理

- 实施强大的缓存策略
- 对不同的数据类型使用适当的 TTL（生存时间）
- 在缓存前验证数据

### 2. 性能

```typescript
// 优化数据获取的示例
async function fetchDataWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = await cache.get(key)
  if (cached) return cached

  const data = await fetcher()
  await cache.set(key, data)
  return data
}
```

### 3. 错误处理

- 实施重试机制
- 提供回退值
- 全面记录错误
- 处理 API 超时

### 4. 安全

- 验证输入参数
- 清理返回的数据
- 实施速率限制
- 妥善处理敏感数据

---

## 与运行时的集成

提供者向 [AgentRuntime](../api/classes/AgentRuntime) 注册：

```typescript
// 注册提供者
runtime.registerContextProvider(customProvider)

// 通过 composeState 访问提供者
const state = await runtime.composeState(message)
```

## 示例：完整的提供者

```typescript
import { IAgentRuntime, Memory, Provider, State } from '@elizaos/core'

const comprehensiveProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
    try {
      // 获取最近的消息
      const messages = await runtime.messageManager.getMemories({
        roomId: message.roomId,
        count: 5,
      })

      // 获取用户上下文
      const userContext = await runtime.descriptionManager.getMemories({
        roomId: message.roomId,
        userId: message.userId,
      })

      // 获取相关事实
      const facts = await runtime.messageManager.getMemories({
        roomId: message.roomId,
        tableName: 'facts',
        count: 3,
      })

      // 格式化综合上下文
      return `
# 对话上下文
${messages.map(m => `- ${m.content.text}`).join('\n')}

# 用户信息
${userContext.map(c => c.content.text).join('\n')}

# 相关事实
${facts.map(f => `- ${f.content.text}`).join('\n')}
      `.trim()
    } catch (error) {
      console.error('提供者错误：', error)
      return '上下文暂时不可用'
    }
  },
}
```

---

## 故障排除

1. **过时数据**

```typescript
// 实现缓存失效
const invalidateCache = async (pattern: string) => {
  const keys = await cache.keys(pattern)
  await Promise.all(keys.map(k => cache.del(k)))
}
```

2. **速率限制**

```typescript
// 实现回退策略
const backoff = async (attempt: number) => {
  const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
  await new Promise(resolve => setTimeout(resolve, delay))
}
```

3. **API 故障**

```typescript
// 实现回退数据源
const getFallbackData = async () => {
  // 尝试其他数据源
}
```

---

## 进一步阅读

- [智能体运行时](./agents.md)
- [记忆系统](../packages/core)
