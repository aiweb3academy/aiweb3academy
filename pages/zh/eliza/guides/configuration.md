# ⚙️ 配置指南

## 概述
本指南涵盖了如何为不同的用例和环境配置 Eliza。我们将详细介绍所有可用的配置选项和最佳实践。

## 环境配置

### 基本设置
第一步是创建环境配置文件：
```bash
cp.env.example.env
```

### 核心环境变量
以下是需要配置的基本环境变量：
```bash
# 核心 API 密钥
OPENAI_API_KEY=sk-your-key # OpenAI 功能所需
ANTHROPIC_API_KEY=your-key  # Claude 模型所需
TOGETHER_API_KEY=your-key   # Together.ai 模型所需

# 默认设置
XAI_MODEL=gpt-4o-mini      # 要使用的默认模型
X_SERVER_URL=              # 可选的模型 API 端点
```

### 客户端特定配置

#### Discord 配置
```bash
DISCORD_APPLICATION_ID=     # 你的 Discord 应用程序 ID
DISCORD_API_TOKEN=         # Discord 机器人令牌
```

#### Twitter 配置
```bash
TWITTER_USERNAME=          # 机器人 Twitter 用户名
TWITTER_PASSWORD=          # 机器人 Twitter 密码
TWITTER_EMAIL=            # Twitter 账户电子邮件
TWITTER_COOKIES=          # Twitter 认证 Cookie
TWITTER_DRY_RUN=false    # 测试模式，不发布内容
```

#### Telegram 配置
```bash
TELEGRAM_BOT_TOKEN=       # Telegram 机器人令牌
```

### 模型提供商设置
你可以配置不同的 AI 模型提供商：
```bash
# OpenAI 设置
OPENAI_API_KEY=sk-*

# Anthropic 设置
ANTHROPIC_API_KEY=

# Together.ai 设置
TOGETHER_API_KEY=

# Heurist 设置
HEURIST_API_KEY=

# 本地模型设置
XAI_MODEL=meta-llama/Llama-3.1-7b-instruct
```

### 图像生成
在角色文件中配置图像生成：
```json
{
  "modelProvider": "heurist",
  "settings": {
    "imageSettings": {
      "steps": 20,
      "width": 1024,
      "height": 1024
    }
  }
}
```
示例用法：
```typescript
const result = await generateImage(
  {
    prompt:
      '一个可爱的动漫女孩，胸部很大，黑色直发，穿着橙色 T 恤。T 恤正面有 "ai16z" 字样。女孩正看着观众',
    width: 1024,
    height: 1024,
    numIterations: 20, // 可选
    guidanceScale: 3, // 可选
    seed: -1, // 可选
    modelId: "FLUX.1-dev", // 可选
  },
  runtime,
);
```

## 角色配置

### 角色文件结构
角色文件定义了智能体的个性和行为。在 `characters/` 目录中创建它们：
```json
{
  "name": "AgentName",
  "clients": ["discord", "twitter"],
  "modelProvider": "openai",
  "settings": {
    "secrets": {
      "OPENAI_API_KEY": "角色特定的密钥",
      "DISCORD_TOKEN": "机器人特定的令牌"
    }
  }
}
```

### 加载角色
你可以通过多种方式加载角色：
```bash
# 加载默认角色
pnpm start

# 加载特定角色
pnpm start --characters="characters/your-character.json"

# 加载多个角色
pnpm start --characters="characters/char1.json,characters/char2.json"
```

## 自定义操作

### 添加自定义操作
1. 创建一个 `custom_actions` 目录。
2. 在其中添加操作文件。
3. 在 `elizaConfig.yaml` 中配置：
```yaml
actions:
  - name: myCustomAction
    path:./custom_actions/myAction.ts
```

### 操作配置结构
```typescript
export const myAction: Action = {
  name: "MY_ACTION",
  similes: ["SIMILAR_ACTION", "ALTERNATE_NAME"],
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    // 验证逻辑
    return true;
  },
  description: "操作描述",
  handler: async (runtime: IAgentRuntime, message: Memory) => {
    // 操作逻辑
    return true;
  },
};
```

## 提供商配置

### 数据库提供商
配置不同的数据库后端：
```typescript
// SQLite（推荐用于开发）
import { SqliteDatabaseAdapter } from "@your-org/agent-framework/adapters";
const db = new SqliteDatabaseAdapter("./dev.db");

// PostgreSQL（生产环境）
import { PostgresDatabaseAdapter } from "@your-org/agent-framework/adapters";
const db = new PostgresDatabaseAdapter({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

### 模型提供商
在角色文件中配置模型提供商：
```json
{
  "modelProvider": "openai",
  "settings": {
    "model": "gpt-4o-mini",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

## 高级配置

### 运行时设置
微调运行时行为：
```typescript
const settings = {
  // 日志记录
  DEBUG: "eliza:*",
  LOG_LEVEL: "info",

  // 性能
  MAX_CONCURRENT_REQUESTS: 5,
  REQUEST_TIMEOUT: 30000,

  // 内存
  MEMORY_TTL: 3600,
  MAX_MEMORY_ITEMS: 1000,
};
```

### 插件配置
在 `elizaConfig.yaml` 中启用和配置插件：
```yaml
plugins:
  - name: solana
    enabled: true
    settings:
      network: mainnet-beta
      endpoint: https://api.mainnet-beta.solana.com

  - name: image-generation
    enabled: true
    settings:
      provider: dalle
      size: 1024x1024
```

## 配置最佳实践

1. **环境隔离**
    - 为不同环境使用不同的 `.env` 文件。
    - 遵循命名约定：`.env.development`、`.env.staging`、`.env.production`。

2. **密钥管理**
    - 绝不要将密钥提交到版本控制中。
    - 在生产环境中使用密钥管理服务。
    - 定期轮换 API 密钥。

3. **角色配置**
    - 保持角色文件模块化和专注。
    - 使用继承来共享特性。
    - 记录角色行为。

4. **插件管理**
    - 仅启用所需的插件。
    - 在单独的文件中配置插件特定的设置。
    - 监控插件性能。

5. **数据库配置**
    - 在开发中使用 SQLite。
    - 在生产环境中配置连接池。
    - 设置适当的索引。

## 故障排除

### 常见问题

1. **环境变量未加载**
```bash
# 检查.env 文件位置
node -e "console.log(require('path').resolve('.env'))"

# 验证环境变量
node -e "console.log(process.env)"
```

2. **角色加载失败**
```bash
# 验证角色文件
npx ajv validate -s character-schema.json -d your-character.json
```

3. **数据库连接问题**
```bash
# 测试数据库连接
npx ts-node scripts/test-db-connection.ts
```

### 配置验证
使用内置的配置验证器：
```bash
pnpm run validate-config
```
这将检查：
- 环境变量。
- 角色文件。
- 数据库配置。
- 插件设置。

## 更多资源
- [快速入门指南](../quickstart.md) 用于初始设置。
- [密钥管理](./secrets-management.md) 用于安全配置。
- [本地开发](./local-development.md) 用于开发设置。
- [高级使用](./advanced.md) 用于复杂配置。
