# 🔧 数据库适配器

## 概述
数据库适配器为 Eliza 提供持久化层，支持存储和检索记忆、关系、目标及其他核心数据。该系统通过统一接口支持多种数据库后端。

## 可用的适配器
Eliza 包含以下数据库适配器：
- **PostgreSQL 适配器** (`@eliza/adapter-postgres`) - 适用于生产环境的 PostgreSQL 数据库适配器
- **SQLite 适配器** (`@eliza/adapter-sqlite`) - 轻量级的 SQLite 适配器，非常适合开发环境
- **SQL.js 适配器** (`@eliza/adapter-sqljs`) - 用于测试的内存型 SQLite 适配器
- **Supabase 适配器** (`@eliza/adapter-supabase`) - 适用于 Supabase 的云原生适配器

## 安装
```bash
# PostgreSQL
pnpm add @eliza/adapter-postgres

# SQLite
pnpm add @eliza/adapter-sqlite

# SQL.js
pnpm add @eliza/adapter-sqljs

# Supabase
pnpm add @eliza/adapter-supabase
```

## 快速入门

### SQLite（开发环境）
```typescript
import { SqliteDatabaseAdapter } from "@eliza/adapter-sqlite";
import Database from "better-sqlite3";

const db = new SqliteDatabaseAdapter(new Database("./dev.db"));
```

### PostgreSQL（生产环境）
```typescript
import { PostgresDatabaseAdapter } from "@eliza/adapter-postgres";

const db = new PostgresDatabaseAdapter({
  connectionString: process.env.DATABASE_URL,
  // 可选的连接池设置
  max: 20,
  空闲超时时间（毫秒）: 30000,
  连接超时时间（毫秒）: 2000,
});
```

### Supabase（云端）
```typescript
import { SupabaseDatabaseAdapter } from "@eliza/adapter-supabase";

const db = new SupabaseDatabaseAdapter(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_API_KEY,
);
```

## 核心概念

### 记忆存储
记忆是 Eliza 中存储的基本单元。它们代表消息、文档和其他内容，可选择带有用于语义搜索的嵌入向量。
```typescript
interface Memory {
  id: UUID;
  content: {
    text: string;
    attachments?: Attachment[];
  };
  embedding?: number[];
  userId: UUID;
  roomId: UUID;
  agentId: UUID;
  createdAt: number;
}
```

### 关系
关系用于跟踪用户和智能体之间的连接：
```typescript
interface Relationship {
  userA: UUID;
  userB: UUID;
  状态: "FRIENDS" | "BLOCKED";
}
```

### 目标
目标用于跟踪任务及其进展：
```typescript
interface Goal {
  id: UUID;
  roomId: UUID;
  userId: UUID;
  名称: string;
  状态: GoalStatus;
  目标列表: Objective[];
}
```

## 常见操作

### 记忆管理
```typescript
// 创建一个记忆
await db.createMemory(
  {
    id: uuid(),
    content: { text: "Hello world" },
    userId: user.id,
    roomId: room.id,
    agentId: agent.id,
    createdAt: Date.now(),
  },
  "messages",
);

// 通过嵌入向量搜索记忆
const similar = await db.searchMemoriesByEmbedding(embedding, {
  匹配阈值: 0.8,
  数量: 10,
  房间 ID: room.id,
});

// 获取最近的记忆
const recent = await db.getMemories({
  房间 ID: room.id,
  数量: 10,
  唯一: true,
});
```

### 关系管理
```typescript
// 创建关系
await db.createRelationship({
  userA: user1.id,
  userB: user2.id,
});

// 获取用户的关系
const relationships = await db.getRelationships({
  用户 ID: user.id,
});
```

### 目标管理
```typescript
// 创建目标
await db.createGoal({
  id: uuid(),
  房间 ID: room.id,
  用户 ID: user.id,
  名称: "完成任务",
  状态: "IN_PROGRESS",
  目标列表: [],
});

// 获取活跃目标
const goals = await db.getGoals({
  房间 ID: room.id,
  仅获取进行中的: true,
});
```

## 向量搜索
所有适配器都支持通过向量相似度搜索来检索记忆：
```typescript
// 通过嵌入向量搜索
const memories = await db.searchMemories({
  表名: "memories",
  房间 ID: room.id,
  嵌入向量: [0.1, 0.2,...], // 1536 维向量
  匹配阈值: 0.8,
  匹配数量: 10,
  唯一: true
});

// 获取缓存的嵌入向量
const cached = await db.getCachedEmbeddings({
  查询表名: "memories",
  查询阈值: 0.8,
  查询输入: "搜索文本",
  查询字段名: "content",
  查询子字段名: "text",
  查询匹配数量: 10
});
```

## 性能优化

### 连接池（PostgreSQL）
```typescript
const db = new PostgresDatabaseAdapter({
  连接字符串: process.env.DATABASE_URL,
  最大连接数: 20, // 最大连接池大小
  空闲超时时间（毫秒）: 30000,
  连接超时时间（毫秒）: 2000,
});
```

### 内存使用（SQLite）
```typescript
const db = new SqliteDatabaseAdapter(
  new Database("./dev.db", {
    内存模式: true, // 内存型数据库
    只读: false,
    文件必须存在: false,
  }),
);
```

### 缓存（所有适配器）
```typescript
// 启用记忆缓存
const memory = new MemoryManager({
  runtime,
  表名: "messages",
  缓存大小: 1000,
  缓存生存时间: 3600,
});
```

## 模式管理

### PostgreSQL 迁移
```sql
-- migrations/20240318103238_remote_schema.sql
CREATE TABLE memories (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  embedding vector(1536),
  "userId" UUID NOT NULL,
  "roomId" UUID NOT NULL,
  "agentId" UUID NOT NULL,
  "unique" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL
);
```

### SQLite 模式
```typescript
const sqliteTables = `
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding BLOB,
  userId TEXT NOT NULL,
  roomId TEXT NOT NULL,
  agentId TEXT NOT NULL,
  "unique" INTEGER DEFAULT 0,
  createdAt INTEGER NOT NULL
);
`;
```

## 错误处理
```typescript
try {
  await db.createMemory(memory);
} catch (error) {
  if (error.code === "SQLITE_CONSTRAINT") {
    // 处理唯一约束冲突
  } else if (error.code === "23505") {
    // 处理 Postgres 唯一约束冲突
  } else {
    // 处理其他错误
  }
}
```

## 扩展适配器
要创建自定义适配器，请实现 `DatabaseAdapter` 接口：
```typescript
class CustomDatabaseAdapter extends DatabaseAdapter {
  async createMemory(memory: Memory, tableName: string): Promise<void> {
    // 自定义实现
  }

  async getMemories(params: {
    房间 ID: UUID;
    数量?: number;
    唯一?: boolean;
  }): Promise<Memory[]> {
    // 自定义实现
  }

  // 实现其他必需的方法...
}
```

## 最佳实践

1. **连接管理**
    - 对 PostgreSQL 使用连接池
    - 使用 SQLite 时正确关闭连接
    - 优雅地处理连接错误

2. **向量搜索**
    - 根据用例设置合适的匹配阈值
    - 为嵌入列创建索引以提高性能
    - 缓存频繁访问的嵌入向量

3. **记忆管理**
    - 为旧记忆实施清理策略
    - 使用唯一标志防止重复
    - 考虑对大表进行分区

4. **错误处理**
    - 对临时故障实施重试机制
    - 记录带有上下文的数据库错误
    - 对原子操作使用事务

## 故障排除

### 常见问题

1. **连接超时**
```typescript
// 增加连接超时时间
const db = new PostgresDatabaseAdapter({
  连接超时时间（毫秒）: 5000,
});
```

2. **内存泄漏**
```typescript
// 定期清理旧记忆
await db.removeAllMemories(roomId, tableName);
```

3. **向量搜索性能**
```typescript
// 创建合适的索引
CREATE INDEX embedding_idx ON memories
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## 相关资源
- [记忆管理器文档](./core)
- [数据库模式参考](/api)
