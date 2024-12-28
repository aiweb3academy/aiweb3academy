# 🧩 插件

## 概述
Eliza 的插件系统提供了一种模块化的方式，可通过额外的功能、动作、评估器和提供商来扩展核心功能。插件是自包含的模块，可以轻松添加或删除，以定制智能体的能力。

## 核心插件概念

### 插件结构
Eliza 中的每个插件都必须实现 `Plugin` 接口，该接口具有以下属性：
```typescript
interface Plugin {
    name: string; // 插件的唯一标识符
    description: string; // 插件功能的简要描述
    actions?: Action[]; // 插件提供的自定义动作
    evaluators?: Evaluator[]; // 行为评估的自定义评估器
    providers?: Provider[]; // 消息生成的上下文提供商
    services?: Service[]; // 附加服务（可选）
}
```

## 使用插件

### 安装

1. 安装所需的插件包：
```bash
pnpm add @ai16z/plugin-[name]
```

2. 导入并在角色配置中注册插件：
```typescript
import { bootstrapPlugin } from "@eliza/plugin-bootstrap";
import { imageGenerationPlugin } from "@eliza/plugin-image-generation";
import { buttplugPlugin } from "@eliza/plugin-buttplug";
const character = {
    //... 其他角色配置
    plugins: [bootstrapPlugin, imageGenerationPlugin, buttplugPlugin],
};
```

---

### 可用插件

#### 1. 引导插件（`@eliza/plugin-bootstrap`）
引导插件提供基本的基础功能：

**动作：**
- `continue` - 继续当前对话流程
- `followRoom` - 关注房间以获取更新
- `unfollowRoom` - 取消关注房间
- `ignore` - 忽略特定消息
- `muteRoom` - 关闭房间通知
- `unmuteRoom` - 开启房间通知

**评估器：**
- `fact` - 评估事实准确性
- `goal` - 评估目标完成情况

**提供商：**
- `boredom` - 管理参与度
- `time` - 提供时间上下文
- `facts` - 提供事实信息


#### 2. 图像生成插件（`@eliza/plugin-image-generation`）
支持 AI 图像生成功能：

**动作：**
- `GENERATE_IMAGE` - 基于文本描述创建图像
- 支持多个图像生成服务（Anthropic、Together）
- 为创建的图像自动生成标题


#### 3. 节点插件（`@eliza/plugin-node`）
提供基于 Node.js 的核心服务：

**服务：**
- `BrowserService` - 网页浏览功能
- `ImageDescriptionService` - 图像分析
- `LlamaService` - LLM 集成
- `PdfService` - PDF 处理
- `SpeechService` - 文本转语音
- `TranscriptionService` - 语音转文本
- `VideoService` - 视频处理


#### 4. Solana 插件（`@eliza/plugin-solana`）
集成 Solana 区块链功能：

**评估器：**
- `trustEvaluator` - 评估交易信任分数

**提供商：**
- `walletProvider` - 钱包管理
- `trustScoreProvider` - 交易信任指标

##### 慈善捐款
所有 Coinbase 交易和转账会自动将交易额的 1% 捐赠给慈善机构。目前，慈善地址是根据交易使用的网络硬编码的，当前支持的慈善机构为 X。
每个网络的慈善地址如下：
- **Base**：`0x1234567890123456789012345678901234567890`
- **Solana**：`pWvDXKu6CpbKKvKQkZvDA66hgsTB6X2AgFxksYogHLV`
- **Ethereum**：`0x750EF1D7a0b4Ab1c97B7A623D7917CcEb5ea779C`
- **Arbitrum**：`0x1234567890123456789012345678901234567890`
- **Polygon**：`0x1234567890123456789012345678901234567890`

未来，我们计划集成 The Giving Block API，以实现动态和可配置的捐款，支持更多的慈善组织。

#### 5. Coinbase 商务插件（`@eliza/plugin-coinbase`）
集成 Coinbase 商务功能，用于支付和交易管理：

**动作：**
- `CREATE_CHARGE` - 使用 Coinbase 商务创建支付费用
- `GET_ALL_CHARGES` - 获取所有支付费用
- `GET_CHARGE_DETAILS` - 获取特定费用的详细信息

**描述：**
该插件使 Eliza 能够与 Coinbase 商务 API 交互，创建和管理支付费用，与基于加密货币的支付系统无缝集成。

---

##### Coinbase 钱包管理
该插件会自动处理钱包创建，或者在首次运行时如果提供了所需信息，则使用现有钱包。

1. **首次运行时生成钱包**
   如果未提供钱包信息（`COINBASE_GENERATED_WALLET_HEX_SEED` 和 `COINBASE_GENERATED_WALLET_ID`），插件将：
    - 使用 Coinbase SDK **生成一个新钱包**。
    - 自动 **导出钱包详细信息**（`seed` 和 `walletId`）并安全存储在 `runtime.character.settings.secrets` 或其他配置的存储中。
    - 记录钱包的默认地址以供参考。
    - 如果角色文件不存在，将钱包详细信息保存到 `characters/charactername-seed.txt` 文件中，并注明用户必须手动将这些详细信息添加到 `settings.secrets` 或 `.env` 文件中。


2. **使用现有钱包**
   如果在首次运行时有可用的钱包信息：
    - 通过 `runtime.character.settings.secrets` 或环境变量提供 `COINBASE_GENERATED_WALLET_HEX_SEED` 和 `COINBASE_GENERATED_WALLET_ID`。
    - 插件将 **导入钱包** 并用于处理批量支付。

#### 6. Coinbase 批量支付插件（`@eliza/plugin-coinbase`）
该插件使用 Coinbase SDK 促进加密货币的批量支付处理。它可以创建和管理向多个钱包地址的批量支付，并将所有交易详细信息记录到 CSV 文件中以供进一步分析。

**动作：**
- `SEND_MASS_PAYOUT`
  向多个钱包地址发送加密货币批量支付。
    - **输入**：
        - `receivingAddresses`（字符串数组）：接收资金的钱包地址。
        - `transferAmount`（数字）：发送到每个地址的金额（以最小货币单位，例如 ETH 的 Wei）。
        - `assetId`（字符串）：加密货币资产 ID（例如 `ETH`、`BTC`）。
        - `network`（字符串）：区块链网络（例如 `base`、`sol`、`eth`、`arb`、`pol`）。
    - **输出**：将交易结果（成功/失败）记录在 CSV 文件中。
    - **示例**：
        ```json
        {
            "receivingAddresses": [
                "0xA0ba2ACB5846A54834173fB0DD9444F756810f06",
                "0xF14F2c49aa90BaFA223EE074C1C33b59891826bF"
            ],
            "transferAmount": 5000000000000000,
            "assetId": "ETH",
            "network": "eth"
        }
        ```

**提供商：**
- `massPayoutProvider`
  从生成的 CSV 文件中检索过去交易的详细信息。
    - **输出**：包含以下字段的交易记录列表：
        - `address`：接收方钱包地址。
        - `amount`：发送的金额。
        - `status`：交易状态（`Success` 或 `Failed`）。
        - `errorCode`：错误代码（如果有）。
        - `transactionUrl`：交易详情的 URL（如果可用）。

**描述：**
Coinbase 批量支付插件简化了加密货币分发流程，确保在支持的区块链网络上向多个接收者进行高效且可扩展的支付。

支持的网络：
- `base`（Base 区块链）
- `sol`（Solana）
- `eth`（Ethereum）
- `arb`（Arbitrum）
- `pol`（Polygon）

**设置和配置：**

1. **配置插件**
   将插件添加到角色的配置中：
```typescript
import { coinbaseMassPaymentsPlugin } from "@eliza/plugin-coinbase-masspayments";

const character = {
    plugins: [coinbaseMassPaymentsPlugin],
};
```

2. **所需配置**
   设置以下环境变量或运行时设置：
    - `COINBASE_API_KEY`：Coinbase SDK 的 API 密钥
    - `COINBASE_PRIVATE_KEY`：安全交易的私钥
    - `COINBASE_GENERATED_WALLET_HEX_SEED`：钱包的十六进制种子（如果使用现有钱包）
    - `COINBASE_GENERATED_WALLET_ID`：唯一的钱包 ID（如果使用现有钱包）

**钱包管理：**
该插件通过两种方式处理钱包创建和管理：

1. **自动创建钱包**
   当未提供钱包详细信息时，插件将：
    - 使用 Coinbase SDK 生成一个新钱包。
    - 导出并将钱包详细信息存储在 `runtime.character.settings.secrets` 中。
    - 如果角色文件不存在，将详细信息保存到 `characters/charactername-seed.txt` 中。
    - 记录钱包的默认地址。

2. **使用现有钱包**
   当有可用的钱包信息时：
    - 通过设置或环境变量提供所需的钱包详细信息。
    - 插件将导入并使用现有钱包。

**示例配置：**
```typescript
// 用于自动生成钱包
runtime.character.settings.secrets = {
    // 首次运行时为空设置
};

// 用于使用现有钱包
runtime.character.settings.secrets = {
    COINBASE_GENERATED_WALLET_HEX_SEED:
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    COINBASE_GENERATED_WALLET_ID: "wallet-id-123",
};
```

**示例调用**
```typescript
const response = await runtime.triggerAction("SEND_MASS_PAYOUT", {
    receivingAddresses: [
        "0xA0ba2ACB5846A54834173fB0DD9444F756810f06",
        "0xF14F2c49aa90BaFA223EE074C1C33b59891826bF",
    ],
    transferAmount: 5000000000000000, // 0.005 ETH
    assetId: "ETH",
    network: "eth",
});
console.log("批量支付响应:", response);
```

**交易记录**
所有交易（成功和失败）都记录在插件工作目录中的 `transactions.csv` 文件中：
```plaintext
Address,Amount,Status,Error Code,Transaction URL
0xA0ba2ACB5846A54834173fB0DD9444F756810f06,5000000000000000,Success,,https://etherscan.io/tx/0x...
```

**示例输出：**
成功时，将返回类似以下的响应：
```json
{
    "text": "批量支付已成功完成。\n- 成功交易数: 2\n- 失败交易数: 0\n查看 CSV 文件了解更多详细信息。"
}
```

**最佳实践：**
- **安全存储机密信息**：确保将 `COINBASE_API_KEY` 和 `COINBASE_PRIVATE_KEY` 安全存储在 `runtime.character.settings.secrets` 或环境变量中。可以添加之前运行的 `COINBASE_GENERATED_WALLET_HEX_SEED` 和 `COINBASE_GENERATED_WALLET_ID`，或者将动态创建。
- **验证**：始终验证输入参数，尤其是 `receivingAddresses` 和 `network`，以确保符合预期格式和支持的网络。
- **错误处理**：监控日志中支付过程中的失败交易或错误，并根据需要调整重试逻辑。

#### 7. Coinbase 代币合约插件（`@eliza/plugin-coinbase`）
该插件使用 Coinbase SDK 启用各种代币合约（ERC20、ERC721、ERC1155）的部署和交互。它提供部署新代币合约和与现有合约交互的功能。

**动作：**
1. `DEPLOY_TOKEN_CONTRACT`
   部署新的代币合约（ERC20、ERC721 或 ERC1155）。
    - **输入**：
        - `contractType`（字符串）：要部署的合约类型（`ERC20`、`ERC721` 或 `ERC1155`）
        - `name`（字符串）：代币名称
        - `symbol`（字符串）：代币符号
        - `network`（字符串）：要部署的区块链网络
        - `baseURI`（字符串，可选）：代币元数据的基础 URI（ERC721 和 ERC1155 需要）
        - `totalSupply`（数字，可选）：代币的总供应量（仅 ERC20）
    - **示例**：
        ```json
        {
            "contractType": "ERC20",
            "name": "MyToken",
            "symbol": "MTK",
            "network": "base",
            "totalSupply": 1000000
        }
        ```

2. `INVOKE_CONTRACT`
   调用已部署的智能合约上的方法。
    - **输入**：
        - `contractAddress`（字符串）：要调用的合约地址
        - `method`（字符串）：要调用的方法名称
        - `abi`（数组）：合约 ABI
        - `args`（对象，可选）：方法的参数
        - `amount`（数字，可选）：要发送的资产数量（对于可支付方法）
        - `assetId`（字符串，可选）：要发送的资产 ID
        - `network`（字符串）：要使用的区块链网络
    - **示例**：
        ```json
        {
          "contractAddress": "0x123...",
          "method": "transfer",
          "abi": [...],
          "args": {
            "to": "0x456...",
            "amount": "1000000000000000000"
          },
          "network": "base"
        }
        ```

**描述：**
Coinbase 代币合约插件简化了在支持的区块链网络上部署和与各种代币合约交互的过程。它支持：
- 可定制供应量的 ERC20 代币部署
- 支持元数据 URI 的 ERC721（NFT）部署
- 支持元数据 URI 的 ERC1155（多代币）部署
- 已部署合约的合约方法调用

所有合约部署和交互都记录在 CSV 文件中，用于记录和审计目的。

**使用说明：**

1. **配置插件**
   将插件添加到角色的配置中：
```typescript
import { tokenContractPlugin } from "@eliza/plugin-coinbase";

const character = {
    plugins: [tokenContractPlugin],
};
```

2. **所需配置**
   确保配置以下环境变量或运行时设置：
    - `COINBASE_API_KEY`：Coinbase SDK 的 API 密钥
    - `COINBASE_PRIVATE_KEY`：安全交易的私钥
    - 钱包配置（与批量支付插件相同）

**示例部署：**

1. **ERC20 代币**
```typescript
const response = await runtime.triggerAction("DEPLOY_TOKEN_CONTRACT", {
    contractType: "ERC20",
    name: "MyToken",
    symbol: "MTK",
    network: "base",
    totalSupply: 1000000,
});
```

2. **NFT 集合**
```typescript
const response = await runtime.triggerAction("DEPLOY_TOKEN_CONTRACT", {
    contractType: "ERC721",
    name: "MyNFT",
    symbol: "MNFT",
    network: "eth",
    baseURI: "https://api.mynft.com/metadata/",
});
```

3. **多代币集合**
```typescript
const response = await runtime.triggerAction("DEPLOY_TOKEN_CONTRACT", {
    contractType: "ERC1155",
    name: "MyMultiToken",
    symbol: "MMT",
    network: "pol",
    baseURI: "https://api.mymultitoken.com/metadata/",
});
```

**合同交互示例：**
```typescript
const response = await runtime.triggerAction("INVOKE_CONTRACT", {
  contractAddress: "0x123...",
  method: "transfer",
  abi: [...],
  args: {
    to: "0x456...",
    amount: "1000000000000000000"
  },
  network: "base"
});
```

**最佳实践：**
- 部署前始终验证合同参数。
- 安全存储合同地址和部署细节。
- 在主网部署前在测试网上测试合同交互。
- 使用生成的 CSV 日志跟踪已部署的合同。
- 确保对部署或交互失败进行适当的错误处理。

#### 8. TEE 插件（`@ai16z/plugin-tee`）
集成 [Dstack SDK](https://github.com/Dstack-TEE/dstack) 以启用 TEE（可信执行环境）功能并部署安全和隐私增强的 Eliza 智能体：

**提供商：**
- `deriveKeyProvider` - 允许在 TEE 环境中安全派生密钥。支持为 Solana（Ed25519）和 Ethereum（ECDSA）链派生密钥。
- `remoteAttestationProvider` - 基于 `report_data` 生成远程证明报价。

**DeriveKeyProvider 用法**
```typescript
import { DeriveKeyProvider } from "@ai16z/plugin-tee";

// 初始化提供商
const provider = new DeriveKeyProvider();

// 派生原始密钥
try {
    const rawKey = await provider.rawDeriveKey(
        "/path/to/derive",
        "subject-identifier",
    );
    // rawKey 是一个 DeriveKeyResponse，可用于进一步处理
    // 要获取 uint8Array，请执行以下操作
    const rawKeyArray = rawKey.asUint8Array();
} catch (error) {
    console.error("原始密钥派生失败:", error);
}

// 派生 Solana 密钥对（Ed25519）
try {
    const solanaKeypair = await provider.deriveEd25519Keypair(
        "/path/to/derive",
        "subject-identifier",
    );
    // solanaKeypair 可用于 Solana 操作
} catch (error) {
    console.error("Solana 密钥派生失败:", error);
}

// 派生 Ethereum 密钥对（ECDSA）
try {
    const evmKeypair = await provider.deriveEcdsaKeypair(
        "/path/to/derive",
        "subject-identifier",
    );
    // evmKeypair 可用于 Ethereum 操作
} catch (error) {
    console.error("EVM 密钥派生失败:", error);
}
```

**RemoteAttestationProvider 用法**
```typescript
import { RemoteAttestationProvider } from "@ai16z/plugin-tee";
// 初始化提供商
const provider = new RemoteAttestationProvider();
// 生成远程证明
try {
    const attestation = await provider.generateAttestation("your-report-data");
    console.log("证明:", attestation);
} catch (error) {
    console.error("生成证明失败:", error);
}
```

**配置**
要获取 TEE 模拟器进行本地测试，请使用以下命令：
```bash
docker pull phalanetwork/tappd-simulator:latest
# 默认模拟器在 localhost:8090 可用
docker run --rm -p 8090:8090 phalanetwork/tappd-simulator:latest
```

通过运行时环境使用提供商时，请确保配置以下设置：
```env
 # 可选，用于在 macOS 或 Windows 上进行模拟器测试。对于 Linux x86 机器，留空。
DSTACK_SIMULATOR_ENDPOINT="http://host.docker.internal:8090"
WALLET_SECRET_SALT=your-secret-salt // 单个智能体部署所需
```

#### 9. 网络钩子插件（`@eliza/plugin-coinbase-webhooks`）
使用 Coinbase SDK 管理网络钩子，允许创建和管理网络钩子以监听 Coinbase 平台上的特定事件。

**动作：**
- `CREATE_WEBHOOK` - 创建新的网络钩子以监听特定事件。
    - **输入**：
        - `networkId`（字符串）：网络钩子应监听事件的网络 ID。
        - `eventType`（字符串）：要监听的事件类型（例如，转账）。
        - `eventFilters`（对象，可选）：事件的额外过滤器。
        - `eventTypeFilter`（字符串，可选）：特定的事件类型过滤器。
    - **输出**：带有网络钩子详细信息的确认消息。
    - **示例**：
      ```json
      {
        "networkId": "base",
        "eventType": "transfers",
        "notificationUri": "https://your-notification-uri.com"
      }
      ```

**提供商：**
- `webhookProvider` - 检索所有已配置的网络钩子的列表。
    - **输出**：带有 ID、URL、事件类型和状态等详细信息的网络钩子列表。

**描述：**
网络钩子插件使 Eliza 能够与 Coinbase SDK 交互以创建和管理网络钩子。这允许根据用户设置的特定条件进行实时事件处理和通知。

**使用说明：**

1. **配置插件**
   将插件添加到角色的配置中：
```typescript
import { webhookPlugin } from "@eliza/plugin-coinbase-webhooks";

const character = {
  plugins: [webhookPlugin],
};
```

2. **确保安全配置**
   设置以下环境变量或运行时设置以确保插件安全运行：
- `COINBASE_API_KEY`：Coinbase SDK 的 API 密钥。
- `COINBASE_PRIVATE_KEY`：安全交易的私钥。
- `COINBASE_NOTIFICATION_URI`：应发送通知的 URI。

**示例调用**
要创建网络钩子：
```typescript
const response = await runtime.triggerAction("CREATE_WEBHOOK", {
  networkId: "base",
  eventType: "transfers",
  notificationUri: "https://your-notification-uri.com"
});
console.log("网络钩子创建响应:", response);
```

**最佳实践：**
- **安全存储机密信息**：确保将 `COINBASE_API_KEY`、`COINBASE_PRIVATE_KEY` 和 `COINBASE_NOTIFICATION_URI` 安全存储在 `runtime.character.settings.secrets` 或环境变量中。
- **验证**：始终验证输入参数以确保符合预期格式和支持的网络。
- **错误处理**：监控网络钩子创建期间的日志错误并根据需要调整重试逻辑。

### 编写自定义插件
通过实现 `Plugin` 接口创建新插件：
```typescript
import { Plugin, Action, Evaluator, Provider } from "@ai16z/eliza";

const myCustomPlugin: Plugin = {
    name: "my-custom-plugin",
    description: "添加自定义功能",
    actions: [
        /* 自定义动作 */
    ],
    evaluators: [
        /* 自定义评估器 */
    ],
    providers: [
        /* 自定义提供商 */
    ],
    services: [
        /* 自定义服务 */
    ],
};
```

## 最佳实践

1. **模块化**：保持插件专注于特定功能。
2. **依赖项**：清楚记录任何外部依赖项。
3. **错误处理**：实现强大的错误处理。
4. **文档**：为动作和评估器提供清晰的文档。
5. **测试**：包含插件功能的测试。

## 插件开发指南

### 动作开发
- 实现 `Action` 接口。
- 提供清晰的验证逻辑。
- 包含使用示例。
- 优雅地处理错误。

### 评估器开发
- 实现 `Evaluator` 接口。
- 定义清晰的评估标准。
- 包含验证逻辑。
- 记录评估指标。

### 提供商开发
- 实现 `Provider` 接口。
- 定义上下文生成逻辑。
- 处理状态管理。
- 记录提供商功能。

## 常见问题和解决方案

### 插件加载问题
```typescript
// 检查插件是否正确加载
if (character.plugins) {
    console.log("插件是: ", character.plugins);
    const importedPlugins = await Promise.all(
        character.plugins.map(async (plugin) => {
            const importedPlugin = await import(plugin);
            return importedPlugin;
        }),
    );
    character.plugins = importedPlugins;
}
```

### 服务注册
```typescript
// 正确的服务注册
function registerService(service: Service): void {
    const serviceType = (service as typeof Service).serviceType;
    if (this.services.has(serviceType)) {
        console.warn(`服务 ${serviceType} 已注册`);
        return;
    }
    this.services.set(serviceType, service);
}
```

## 未来扩展
插件系统旨在可扩展。未来的扩展可能包括：
- 数据库适配器。
- 身份验证提供商。
- 自定义模型提供商。
- 外部 API 集成。
- 工作流自动化。
- 自定义 UI 组件。

## 贡献
要贡献新插件：
1. 遵循插件结构指南。
2. 包含全面的文档。
3. 为所有功能添加测试。
4. 提交拉取请求。
5. 更新插件注册表。

如需详细的 API 文档和示例，请参阅 [API 参考](/api)。
