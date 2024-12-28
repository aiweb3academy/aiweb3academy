# 💻 本地开发指南

## 概述

本指南涵盖了在开发环境中设置和使用 Eliza 的相关内容。

## 先决条件

在开始之前，请确保你拥有：

```bash
# 必需
Node.js 23 及以上版本
pnpm
Git

# 可选但推荐
VS Code
Docker（用于数据库开发）
CUDA 工具包（用于 GPU 加速）
```

## 初始设置

### 1. 仓库设置

```bash
# 克隆仓库
git clone https://github.com/ai16z/eliza.git
cd eliza

# 安装依赖项
pnpm install

# 安装可选依赖项
pnpm install --include=optional sharp
```

### 2. 环境配置

创建开发环境文件：

```bash
cp.env.example.env
```

配置基本开发变量：

```bash
# 本地开发的最低要求
OPENAI_API_KEY=sk-*           # 可选，用于 OpenAI 功能
X_SERVER_URL=                 # 留空以进行本地推理
XAI_API_KEY=                 # 留空以进行本地推理
XAI_MODEL=meta-llama/Llama-3.1-7b-instruct  # 本地模型
```

### 3. 本地模型设置

对于不依赖 API 的本地推理：

```bash
# 为 NVIDIA GPU 安装 CUDA 支持
npx --no node-llama-cpp source download --gpu cuda

# 系统将在首次运行时自动从 Hugging Face 下载模型
```

## 开发工作流

### 运行开发服务器

```bash
# 以默认角色启动
pnpm run dev

# 以特定角色启动
pnpm run dev --characters="characters/my-character.json"

# 以多个角色启动
pnpm run dev --characters="characters/char1.json,characters/char2.json"
```

### 开发命令

```bash
pnpm run build          # 构建项目
pnpm run clean         # 清理构建产物
pnpm run dev           # 启动开发服务器
pnpm run test          # 运行测试
pnpm run test:watch    # 以监视模式运行测试
pnpm run lint          # 检查代码
```

### 直接客户端聊天界面

```
# 打开一个终端并以特定角色启动
pnpm run dev --characters="characters/my-character.json"
```

```
# 打开第二个终端并启动客户端
pnpm start:client
```

查找消息：
`  ➜  Local:   http://localhost:5173/`
点击该链接或在浏览器中打开该地址。这样你将看到聊天界面连接到系统，并且可以开始与你的角色交互。

## 数据库开发

### SQLite（推荐用于开发）

```typescript
import { SqliteDatabaseAdapter } from '@ai16z/eliza/adapters'
import Database from 'better-sqlite3'

const db = new SqliteDatabaseAdapter(new Database('./dev.db'))
```

### 内存数据库（用于测试）

```typescript
import { SqlJsDatabaseAdapter } from '@ai16z/eliza/adapters'

const db = new SqlJsDatabaseAdapter(new Database(':memory:'))
```

### 模式管理

```bash
# 创建新的迁移
pnpm run migration:create

# 运行迁移
pnpm run migration:up

# 回滚迁移
pnpm run migration:down
```

## 测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定的测试文件
pnpm test tests/specific.test.ts

# 运行带有覆盖率的测试
pnpm test:coverage

# 运行特定于数据库的测试
pnpm test:sqlite
pnpm test:sqljs
```

### 编写测试

```typescript
import { runAiTest } from '@ai16z/eliza/test_resources'

describe('功能测试', () => {
  beforeEach(async () => {
    // 设置测试环境
  })

  it('应该执行预期行为', async () => {
    const result = await runAiTest({
      messages: [
        {
          user: 'user1',
          content: { text: '测试消息' },
        },
      ],
      expected: '预期响应',
    })
    expect(result.success).toBe(true)
  })
})
```

## 插件开发

### 创建新插件

```typescript
// plugins/my-plugin/src/index.ts
import { Plugin } from '@ai16z/eliza/types'

export const myPlugin: Plugin = {
  name: 'my-plugin',
  description: '我的自定义插件',
  actions: [],
  evaluators: [],
  providers: [],
}
```

### 自定义操作开发

```typescript
// plugins/my-plugin/src/actions/myAction.ts
export const myAction: Action = {
  name: 'MY_ACTION',
  similes: ['SIMILAR_ACTION'],
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    return true
  },
  handler: async (runtime: IAgentRuntime, message: Memory) => {
    // 实现代码
    return true
  },
  examples: [],
}
```

## 调试

### VS Code 配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "调试 Eliza",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "DEBUG": "eliza:*"
      }
    }
  ]
}
```

### 调试技巧

1. 启用调试日志

```bash
# 添加到.env 文件中
DEBUG=eliza:*
```

2. 使用调试点

```typescript
const debug = require('debug')('eliza:dev')

debug('操作细节: %O', {
  operation: 'functionName',
  params: parameters,
  result: result,
})
```

3. 内存调试

```bash
# 为开发增加 Node.js 内存
NODE_OPTIONS="--max-old-space-size=8192" pnpm run dev
```

## 常见开发任务

### 1. 添加新角色

```json
{
  "name": "DevBot",
  "description": "开发测试机器人",
  "modelProvider": "openai",
  "settings": {
    "debug": true,
    "logLevel": "debug"
  }
}
```

### 2. 创建自定义服务

```typescript
class CustomService extends Service {
  static serviceType = ServiceType.CUSTOM

  async initialize() {
    // 初始化代码
  }

  async process(input: any): Promise<any> {
    // 服务逻辑
  }
}
```

### 3. 使用模型

```typescript
// 本地模型配置
const localModel = {
  modelProvider: 'llamalocal',
  settings: {
    modelPath: './models/llama-7b.gguf',
    contextSize: 8192,
  },
}

// 云模型配置
const cloudModel = {
  modelProvider: 'openai',
  settings: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
  },
}
```

## 性能优化

### CUDA 设置

对于 NVIDIA GPU 用户：

1. 安装带有 cuDNN 和 cuBLAS 的 CUDA 工具包。
2. 设置环境变量：

```bash
CUDA_PATH=/usr/local/cuda  # Windows: C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.0
```

### 内存管理

```typescript
class MemoryManager {
  private cache = new Map()
  private maxSize = 1000

  async cleanup() {
    if (this.cache.size > this.maxSize) {
      // 实现清理逻辑
    }
  }
}
```

## 故障排除

### 常见问题

1. 模型加载问题

```bash
# 清除模型缓存
rm -rf./models/*
# 重新启动以进行新的下载
```

2. 数据库连接问题

```bash
# 测试数据库连接
pnpm run test:db-connection
```

3. 内存问题

```bash
# 检查内存使用情况
node --trace-gc index.js
```

### 开发工具

```bash
# 生成 TypeScript 文档
pnpm run docs:generate

# 检查循环依赖
pnpm run madge

# 分析包大小
pnpm run analyze
```

## 最佳实践

1. 代码组织

   - 将自定义操作放在 `custom_actions/` 中。
   - 将角色文件保存在 `characters/` 中。
   - 将测试数据存储在 `tests/fixtures/` 中。

2. 测试策略

   - 为新功能编写单元测试。
   - 为插件使用集成测试。
   - 使用多个模型提供程序进行测试。

3. Git 工作流
   - 创建功能分支。
   - 遵循约定式提交。
   - 保持 PR 内容集中。

## 附加工具

### 角色开发

```bash
# 从 Twitter 数据生成角色
npx tweets2character

# 将文档转换为知识库
npx folder2knowledge <path/to/folder>

# 将知识添加到角色
npx knowledge2character <character-file> <knowledge-file>
```

### 开发脚本

```bash
# 分析代码库
./scripts/analyze-codebase.ts

# 提取推文用于训练
./scripts/extracttweets.js

# 清理构建产物
./scripts/clean.sh
```

## 更多资源

- [配置指南](./configuration.md) 用于设置细节。
- [高级使用](./advanced.md) 用于复杂功能。
- [API 文档](/api) 用于完整的 API 参考。
- [贡献指南](../community/contributing.md) 用于贡献准则。
