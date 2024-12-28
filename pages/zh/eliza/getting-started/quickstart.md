# 快速入门指南

## 先决条件

在开始使用 Eliza 之前，请确保你具备以下条件：

- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [pnpm 9+](https://pnpm.io/installation)
- 用于版本控制的 Git
- 一款代码编辑器（推荐使用 [VS Code](https://code.visualstudio.com/) 或 [VSCodium](https://vscodium.com)）
- [CUDA 工具包](https://developer.nvidia.com/cuda-toolkit)（可选，用于 GPU 加速）

## 安装

1. **克隆并安装**

请务必查看 [最新可用的稳定版本标签](https://github.com/ai16z/eliza/tags) 是什么。

克隆仓库：

```bash
git clone https://github.com/ai16z/eliza.git
```

进入目录：

```bash
cd eliza
```

切换到最新的标记版本：

```bash
# 检出最新版本
# 这个项目更新很快，所以我们建议检出最新版本
git checkout $(git describe --tags --abbrev=0)
```

安装依赖项（首次运行时）：

```bash
pnpm install --no-frozen-lockfile
```

### 快速入门指南更新

### 关于 pnpm 锁文件管理的重要说明

默认情况下，基于.npmrc 中 `frozen-lockfile=true` 的设置，在安装过程中 `pnpm` 锁文件不会更新。若要更新锁文件，你需要运行以下命令：

```bash
pnpm install --no-frozen-lockfile
```

请仅在首次初始化仓库、提升包的版本或向 `package.json` 添加新包时使用此命令。这种做法有助于保持项目依赖项的一致性，防止锁文件发生意外更改。

构建本地库：

```bash
pnpm build
```

2. **配置环境**

复制示例环境文件：

```bash
cp.env.example.env
```

编辑 `.env` 并添加你的值：

```bash
# 建议的快速入门环境变量
DISCORD_APPLICATION_ID=  # 用于 Discord 集成
DISCORD_API_TOKEN=      # 机器人令牌
HEURIST_API_KEY=       # 用于大语言模型和图像生成的 Heurist API 密钥
OPENAI_API_KEY=        # OpenAI API 密钥
GROK_API_KEY=          # Grok API 密钥
ELEVENLABS_XI_API_KEY= # 来自 elevenlabs 的 API 密钥（用于语音）
```

## 选择你的模型

Eliza 支持多种 AI 模型：

- **Heurist**：在你的角色文件中设置 `modelProvider: "heurist"`。大多数模型无审查限制。
  - **大语言模型**：在 [此处](https://docs.heurist.ai/dev-guide/supported-models#large-language-models-llms) 选择可用的大语言模型，并配置 `SMALL_HEURIST_MODEL`、`MEDIUM_HEURIST_MODEL`、`LARGE_HEURIST_MODEL`。
  - **图像生成**：在 [此处](https://docs.heurist.ai/dev-guide/supported-models#image-generation-models) 选择可用的 Stable Diffusion 或 Flux 模型，并配置 `HEURIST_IMAGE_MODEL`（默认值为 FLUX.1-dev）。
- **Llama**：设置 `XAI_MODEL=meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`。
- **Grok**：设置 `XAI_MODEL=grok-beta`。
- **OpenAI**：设置 `XAI_MODEL=gpt-4o-mini` 或 `gpt-4o`。

你可以在角色 JSON 文件中设置要使用的模型。

### 本地推理

#### 对于 llama_local 推理：

1. 将 `XAI_MODEL` 设置为你选择的模型。
2. 留空 `X_SERVER_URL` 和 `XAI_API_KEY`。
3. 系统将自动从 Hugging Face 下载模型。
4. `LOCAL_LLAMA_PROVIDER` 可以留空。

注意：llama_local 需要 GPU，目前无法使用 CPU 进行推理。

#### 对于 Ollama 推理：

- 如果 `OLLAMA_SERVER_URL` 留空，默认值为 `localhost:11434`。
- 如果 `OLLAMA_EMBEDDING_MODE` 留空，默认值为 `mxbai-embed-large`。

## 创建你的第一个智能体

1. **创建角色文件**

查看 `characters/trump.character.json` 或 `characters/tate.character.json`，以此作为模板来复制和自定义智能体的个性与行为。

此外，你可以阅读 `core/src/core/defaultCharacter.ts`（在 0.0.10 版本中，重构后将位于 `packages/core/src/defaultCharacter.ts`）。

📝 [角色文档](./core/characterfile.md)

2. **启动智能体**

告知系统你想要运行的角色：

```bash
pnpm start --character="characters/trump.character.json"
```

你也可以使用 `characters` 选项加载多个角色，角色之间用逗号分隔：

```bash
pnpm start --characters="characters/trump.character.json,characters/tate.character.json"
```

3. **与智能体交互**

现在你可以开始与智能体对话了！

打开一个新的终端窗口：

```bash
pnpm start:client
```

客户端运行后，你会看到类似这样的消息：

```
➜  Local:   http://localhost:5173/
```

只需点击链接，或在浏览器中打开 `http://localhost:5173/`。你会看到聊天界面连接到系统，然后就可以开始与你的角色进行交互了。

## 平台集成

### Discord 机器人设置

1. 在 [Discord 开发者门户](https://discord.com/developers/applications) 创建一个新应用程序。
2. 创建一个机器人并获取令牌。
3. 使用 OAuth2 URL 生成器将机器人添加到你的服务器。
4. 在 `.env` 中设置 `DISCORD_API_TOKEN` 和 `DISCORD_APPLICATION_ID`。

### Twitter 集成

在 `.env` 中添加以下内容：

```bash
TWITTER_USERNAME=  # 账号用户名
TWITTER_PASSWORD=  # 账号密码
TWITTER_EMAIL=    # 账号邮箱
TWITTER_COOKIES=  # 账号 cookies（auth_token 和 CT0）
```

**重要提示**：登录 [Twitter 开发者门户](https://developer.twitter.com)，并为你的账号启用 “Automated” 标签，以避免被标记为不真实账号。

#### TWITTER_COOKIES 示例

`TWITTER_COOKIES` 变量应该是一个包含必要 cookies 的 JSON 字符串。你可以在浏览器的开发者工具中找到这些 cookies。以下是一个示例格式：

```bash
TWITTER_COOKIES='[{"key":"auth_token","value":"你的令牌","domain":".twitter.com"},
  {"key":"ct0","value":"你的 ct0","domain":".twitter.com"},
  {"key":"guest_id","value":"你的 guest_id","domain":".twitter.com"}]'
```

### Telegram 机器人

1. 创建一个机器人。
2. 将你的机器人令牌添加到 `.env` 中：

```bash
TELEGRAM_BOT_TOKEN=你的令牌
```

## 可选：GPU 加速

如果你有 NVIDIA GPU：

```bash
# 安装 CUDA 支持
npx --no node-llama-cpp source download --gpu cuda

# 确保已安装 CUDA 工具包、cuDNN 和 cuBLAS
```

## 基本使用示例

### 与你的智能体聊天

```bash
# 启动聊天界面
pnpm start
```

### 运行多个智能体

```bash
pnpm start --characters="characters/trump.character.json,characters/tate.character.json"
```

## 常见问题及解决方案

1. **Node.js 版本**

   - 确保已安装 Node.js 23.3.0。
   - 使用 `node -v` 检查版本。
   - 考虑使用 [nvm](https://github.com/nvm-sh/nvm) 来管理 Node 版本。

2. **Sharp 安装问题**
   如果你遇到与 Sharp 相关的错误：

```bash
pnpm install --include=optional sharp
```

3. **CUDA 设置问题**

   - 验证 CUDA 工具包的安装。
   - 检查 GPU 与工具包的兼容性。
   - 确保设置了正确的环境变量。

4. **退出状态 1**
   如果你看到：

```
triggerUncaughtException(
^
[Object: null prototype] {
[Symbol(nodejs.util.inspect.custom)]: [Function: [nodejs.util.inspect.custom]]
}
```

你可以尝试以下步骤，这些步骤旨在将 `@types/node` 添加到项目的各个部分：

```
# 将依赖项添加到工作区根目录
pnpm add -w -D ts-node typescript @types/node

# 专门将依赖项添加到智能体包
pnpm add -D ts-node typescript @types/node --filter "@ai16z/agent"

# 也将其添加到核心包，因为那里也需要
pnpm add -D ts-node typescript @types/node --filter "@ai16z/eliza"

# 首先清理所有内容
pnpm clean

# 递归安装所有依赖项
pnpm install -r

# 构建项目
pnpm build

# 然后尝试启动
pnpm start
```

5. **better sqlite3 编译的 Node.js 版本不同**
   如果你看到：

```
Error starting agents: Error: The module '.../eliza-agents/dv/eliza/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 131. This version of Node.js requires
NODE_MODULE_VERSION 127. Please try re-compiling or re-installing
```

你可以尝试以下操作，这将尝试重新构建 better-sqlite3：

```bash
pnpm rebuild better-sqlite3
```

如果这不起作用，尝试清除根目录中的 `node_modules`：

```bash
rm -fr node_modules; pnpm store prune
```

然后重新安装所需的依赖项：

```bash
pnpm i
```

## 后续步骤

智能体运行起来后，你可以探索以下内容：

1. 🤖 [了解智能体](./core/agents.md)
2. 📝 [创建自定义角色](./core/characterfile.md)
3. ⚡ [添加自定义动作](./core/actions.md)
4. 🔧 [高级配置](./guides/configuration.md)

如需详细的 API 文档、故障排除和高级功能，请查看我们的 [完整文档](https://ai16z.github.io/eliza/)。

加入我们的 [Discord 社区](https://discord.gg/ai16z) 获取支持和更新！
