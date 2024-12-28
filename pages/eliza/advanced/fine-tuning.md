# 🎯 微调指南

## 概述
Eliza 支持多个 AI 模型提供商，并为微调模型行为、嵌入生成和性能优化提供了广泛的配置选项。

## 模型提供商

Eliza 通过一个灵活的配置系统支持多个模型提供商：
```typescript
enum ModelProviderName {
  OPENAI,
  ANTHROPIC,
  CLAUDE_VERTEX,
  GROK,
  GROQ,
  LLAMACLOUD,
  LLAMALOCAL,
  GOOGLE,
  REDPILL,
  OPENROUTER,
  HEURIST,
}
```

### 提供商配置
每个提供商都有特定的设置：
```typescript
const models = {
  [ModelProviderName.ANTHROPIC]: {
    settings: {
      stop: [],
      maxInputTokens: 200000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      temperature: 0.3,
    },
    endpoint: "https://api.anthropic.com/v1",
    model: {
      [ModelClass.SMALL]: "claude-3-5-haiku",
      [ModelClass.MEDIUM]: "claude-3-5-sonnet-20241022",
      [ModelClass.LARGE]: "claude-3-5-opus-20240229",
    },
  },
  //... 其他提供商
};
```

## 模型类别
根据其能力将模型分类为不同的类别：
```typescript
enum ModelClass {
    SMALL,    // 快速，适用于简单任务
    MEDIUM,   // 性能和能力平衡
    LARGE,    // 能力最强但更慢/更昂贵
    EMBEDDING // 专门用于向量嵌入
    IMAGE     // 图像生成能力
}
```

## 嵌入系统

### 配置
```typescript
const embeddingConfig = {
  dimensions: 1536,
  modelName: "text-embedding-3-small",
  cacheEnabled: true,
};
```

### 实现
```typescript
async function embed(runtime: IAgentRuntime, input: string): Promise<number[]> {
  // 先检查缓存
  const cachedEmbedding = await retrieveCachedEmbedding(runtime, input);
  if (cachedEmbedding) return cachedEmbedding;

  // 生成新的嵌入
  const response = await runtime.fetch(
    `${runtime.modelProvider.endpoint}/embeddings`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${runtime.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        model: runtime.modelProvider.model.EMBEDDING,
        dimensions: 1536,
      }),
    },
  );

  const data = await response.json();
  return data?.data?.[0].embedding;
}
```

## 微调选项

### 温度控制
配置模型的创造性与确定性：
```typescript
const temperatureSettings = {
  creative: {
    temperature: 0.8,
    frequency_penalty: 0.7,
    presence_penalty: 0.7,
  },
  balanced: {
    temperature: 0.5,
    frequency_penalty: 0.3,
    presence_penalty: 0.3,
  },
  precise: {
    temperature: 0.2,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  },
};
```

### 上下文窗口
管理令牌限制：
```typescript
const contextSettings = {
  OPENAI: {
    maxInputTokens: 128000,
    maxOutputTokens: 8192,
  },
  ANTHROPIC: {
    maxInputTokens: 200000,
    maxOutputTokens: 8192,
  },
  LLAMALOCAL: {
    maxInputTokens: 32768,
    maxOutputTokens: 8192,
  },
};
```

## 性能优化

### 缓存策略
```typescript
class EmbeddingCache {
  private cache: NodeCache;
  private cacheDir: string;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 分钟的 TTL
    this.cacheDir = path.join(__dirname, "cache");
  }

  async get(key: string): Promise<number[] | null> {
    // 先检查内存缓存
    const cached = this.cache.get<number[]>(key);
    if (cached) return cached;

    // 检查磁盘缓存
    return this.readFromDisk(key);
  }

  async set(key: string, embedding: number[]): Promise<void> {
    this.cache.set(key, embedding);
    await this.writeToDisk(key, embedding);
  }
}
```

### 模型选择
```typescript
async function selectOptimalModel(
  task: string,
  requirements: ModelRequirements,
): Promise<ModelClass> {
  if (requirements.speed === "fast") {
    return ModelClass.SMALL;
  } else if (requirements.complexity === "high") {
    return ModelClass.LARGE;
  }
  return ModelClass.MEDIUM;
}
```

## 提供商特定的优化

### OpenAI
```typescript
const openAISettings = {
  endpoint: "https://api.openai.com/v1",
  settings: {
    stop: [],
    maxInputTokens: 128000,
    maxOutputTokens: 8192,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    temperature: 0.6,
  },
  model: {
    [ModelClass.SMALL]: "gpt-4o-mini",
    [ModelClass.MEDIUM]: "gpt-4o",
    [ModelClass.LARGE]: "gpt-4o",
    [ModelClass.EMBEDDING]: "text-embedding-3-small",
    [ModelClass.IMAGE]: "dall-e-3",
  },
};
```

### Anthropic
```typescript
const anthropicSettings = {
  endpoint: "https://api.anthropic.com/v1",
  settings: {
    stop: [],
    maxInputTokens: 200000,
    maxOutputTokens: 8192,
    temperature: 0.3,
  },
  model: {
    [ModelClass.SMALL]: "claude-3-5-haiku",
    [ModelClass.MEDIUM]: "claude-3-5-sonnet-20241022",
    [ModelClass.LARGE]: "claude-3-5-opus-20240229",
  },
};
```

### 本地 LLM
```typescript
const llamaLocalSettings = {
  settings: {
    stop: ["<|eot_id|>", "<|eom_id|>"],
    maxInputTokens: 32768,
    maxOutputTokens: 8192,
    repetition_penalty: 0.0,
    temperature: 0.3,
  },
  model: {
    [ModelClass.SMALL]: "NousResearch/Hermes-3-Llama-3.1-8B-GGUF",
    [ModelClass.MEDIUM]: "NousResearch/Hermes-3-Llama-3.1-8B-GGUF",
    [ModelClass.LARGE]: "NousResearch/Hermes-3-Llama-3.1-8B-GGUF",
    [ModelClass.EMBEDDING]: "togethercomputer/m2-bert-80M-32k-retrieval",
  },
};
```

### Heurist 提供商
```typescript
const heuristSettings = {
  settings: {
    stop: [],
    maxInputTokens: 32768,
    maxOutputTokens: 8192,
    repetition_penalty: 0.0,
    temperature: 0.7,
  },
  imageSettings: {
    steps: 20,
  },
  endpoint: "https://llm-gateway.heurist.xyz",
  model: {
    [ModelClass.SMALL]: "hermes-3-llama3.1-8b",
    [ModelClass.MEDIUM]: "mistralai/mixtral-8x7b-instruct",
    [ModelClass.LARGE]: "nvidia/llama-3.1-nemotron-70b-instruct",
    [ModelClass.EMBEDDING]: "", // 稍后添加
    [ModelClass.IMAGE]: "FLUX.1-dev",
  },
};
```

## 测试和验证

### 嵌入测试
```typescript
async function validateEmbedding(
  embedding: number[],
  expectedDimensions: number = 1536,
): Promise<boolean> {
  if (!Array.isArray(embedding)) return false;
  if (embedding.length!== expectedDimensions) return false;
  if (embedding.some((n) => typeof n!== "number")) return false;
  return true;
}
```

### 模型性能测试
```typescript
async function benchmarkModel(
  runtime: IAgentRuntime,
  modelClass: ModelClass,
  testCases: TestCase[]): Promise<BenchmarkResults> {
  const results = {
    latency: [],
    tokenUsage: [],
    accuracy: [],
  };

  for (const test of testCases) {
    const start = Date.now();
    const response = await runtime.generateText({
      context: test.input,
      modelClass,
    });
    results.latency.push(Date.now() - start);
    //... 其他指标
  }

  return results;
}
```

## 最佳实践

### 模型选择指南

1. **任务复杂性**
    - 对于简单、快速的响应使用 SMALL 模型。
    - 对于性能平衡使用 MEDIUM 模型。
    - 对于复杂推理使用 LARGE 模型。

2. **上下文管理**
    - 保持提示简洁和集中。
    - 有效使用上下文窗口。
    - 实现适当的上下文截断。

3. **温度调整**
    - 对于事实性响应降低温度。
    - 对于创造性任务提高温度。
    - 根据用例进行平衡。

### 性能优化

1. **缓存策略**
    - 为频繁访问的内容缓存嵌入。
    - 实现分层缓存（内存/磁盘）。
    - 定期清理缓存。

2. **资源管理**
    - 监控令牌使用情况。
    - 实施速率限制。
    - 优化批处理。

## 故障排除

### 常见问题

1. **令牌限制**
```typescript
function handleTokenLimit(error: Error) {
  if (error.message.includes("token limit")) {
    return truncateAndRetry();
  }
}
```

2. **嵌入错误**
```typescript
function handleEmbeddingError(error: Error) {
  if (error.message.includes("dimension mismatch")) {
    return regenerateEmbedding();
  }
}
```

3. **模型可用性**
```typescript
async function handleModelFailover(error: Error) {
  if (error.message.includes("model not available")) {
    return switchToFallbackModel();
  }
}
```
