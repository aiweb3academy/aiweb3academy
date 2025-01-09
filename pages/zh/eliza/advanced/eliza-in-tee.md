# 🫖 Eliza 在 TEE 中

![](/images/eliza/eliza_in_tee.jpg)

## 概述

Eliza 智能体可以部署在 TEE 环境中，以确保智能体数据的安全性和隐私性。本指南将引导你使用 Eliza 框架中的 TEE 插件在 TEE 环境中设置和运行 Eliza 智能体的过程。

### 背景

Eliza 框架中的 TEE 插件建立在 [Dstack SDK](https://github.com/Dstack-TEE/dstack) 之上，该 SDK 旨在简化开发人员将程序部署到 CVM（机密虚拟机）的步骤，并默认遵循安全最佳实践。主要功能包括：

- 将任何 Docker 容器转换为 CVM 镜像以部署在支持的 TEE 上。
- 远程证明 API 和 Web UI 上的信任链可视化。
- 在 0xABCD.dstack.host 上使用内容寻址域进行自动 RA-HTTPS 封装。
- 通过去中心化的信任根将应用程序的执行和状态持久化与特定硬件解耦。

---

## 核心组件

Eliza 的 TEE 实现由两个主要的提供者组成，它们处理安全密钥管理操作和远程证明。

这些组件共同提供：

1. 在 TEE 内的安全密钥派生。
2. TEE 执行的可验证证明。
3. 对开发（模拟器）和生产环境的支持。

这些提供者通常一起使用，例如在钱包密钥派生过程中，每个派生的密钥都包含一个证明报价，以证明它是在 TEE 环境中生成的。

---

### 派生密钥提供者

派生密钥提供者（DeriveKeyProvider）支持在 TEE 环境中进行安全密钥派生。它支持：

- 多种 TEE 模式：
  - `LOCAL`：在 `localhost:8090` 连接到模拟器，用于 Mac/Windows 的本地开发。
  - `DOCKER`：通过 `host.docker.internal:8090` 连接到模拟器，用于 Linux 的本地开发。
  - `PRODUCTION`：当部署到 [TEE 云](https://teehouse.vercel.app) 时连接到实际的 TEE 环境。

主要功能：

- 支持派生 Ed25519（Solana）和 ECDSA（EVM）密钥对。
- 基于秘密盐和智能体 ID 生成确定性密钥。
- 为每个派生密钥提供远程证明。
- 支持原始密钥派生用于自定义用例。

示例用法：

```typescript
const provider = new DeriveKeyProvider(teeMode);
// 对于 Solana
const { keypair, attestation } = await provider.deriveEd25519Keypair(
    "/",
    secretSalt,
    agentId
);
// 对于 EVM
const { keypair, attestation } = await provider.deriveEcdsaKeypair(
    "/",
    secretSalt,
    agentId
);
```

---

### 远程证明提供者

远程证明提供者（RemoteAttestationProvider）处理 TEE 环境验证和报价生成。它：

- 连接到与派生密钥提供者相同的 TEE 模式。
- 生成具有重放保护（RTMRs）的 TDX 报价。
- 提供可由第三方验证的证明数据。

主要功能：

- 生成带有自定义报告数据的证明报价。
- 包含用于报价验证的时间戳。
- 支持模拟器和生产环境。

示例用法：

```typescript
const provider = new RemoteAttestationProvider(teeMode)
const quote = await provider.generateAttestation(reportData)
```

## 教程

---

### 先决条件

在开始使用 Eliza 之前，请确保你拥有：

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 或 [Orbstack](https://orbstack.dev/)（推荐使用 Orbstack）。
- 对于 Mac/Windows：查看 [快速入门指南](./quickstart.md) 中的先决条件。
- 对于 Linux：你只需要 Docker。

---

### 环境设置

要为 TEE 开发设置环境：

1. **配置 TEE 模式**
   设置 `TEE_MODE` 环境变量为以下之一：

```env
# 对于 Mac/Windows 本地开发
TEE_MODE=LOCAL

# 对于 Linux/Docker 本地开发
TEE_MODE=DOCKER

# 对于生产部署
TEE_MODE=PRODUCTION
```

2. **设置所需的环境变量**

```env
# 密钥派生所需
WALLET_SECRET_SALT=你的秘密盐
```

3. **启动 TEE 模拟器**

```bash
docker pull phalanetwork/tappd-simulator:latest
# 默认情况下模拟器在 localhost:8090 可用
docker run --rm -p 8090:8090 phalanetwork/tappd-simulator:latest
```

### 在本地使用 TEE 模拟器运行 Eliza 智能体

1. **配置 Eliza 智能体**
   按照 [配置指南](./configuration.md) 来设置你的 Eliza 智能体。
2. **启动 TEE 模拟器**
   根据你的 TEE 模式遵循上述模拟器设置说明。
3. **对于 Mac/Windows**
   确保将 `TEE_MODE` 环境变量设置为 `LOCAL`。然后你可以安装依赖并在本地运行智能体：

```bash
pnpm i
pnpm build
pnpm start --character=./characters/你的角色.character.json
```

4. **验证 TEE 证明**
   你可以通过访问 [TEE RA 浏览器](https://ra-quote-explorer.vercel.app/) 并粘贴智能体日志中的证明报价来验证 TEE 证明。以下是与 Eliza 智能体交互询问其钱包地址的示例：

```bash
你：你的钱包地址是什么？
```

智能体的日志输出：

```bash
为以下内容生成证明：{"agentId":"025e0996-69d7-0dce-8189-390e354fd1c1","publicKey":"9yZBmCRRFEBtA3KYokxC24igv1ijFp6tyvzKxRs3khTE"}
rtmr0: a4a17452e7868f62f77ea2039bd2840e7611a928c26e87541481256f57bfbe3647f596abf6e8f6b5a0e7108acccc6e89
rtmr1: db6bcc74a3ac251a6398eca56b2fcdc8c00a9a0b36bc6299e06fb4bb766cb9ecc96de7e367c56032c7feff586f9e557e
rtmr2: 2cbe156e110b0cc4b2418600dfa9fb33fc60b3f04b794ec1b8d154b48f07ba8c001cd31f75ca0d0fb516016552500d07
rtmr3: eb7110de9956d7b4b1a3397f843b39d92df4caac263f5083e34e3161e4d6686c46c3239e7fbf61241a159d8da6dc6bd1f
远程证明报价：{
quote: '0x0400030081000000736940f888442c8ca8cb432d7a87145f9b7aeab1c5d129ce901716a7506375426ea8741ca69be68e92c5df29f539f103eb60ab6780c56953b0d81af523a031617b32d5e8436cceb019177103f4aceedbf114a846baf8e8e2b8e6d3956e96d6b89d94a0f1a366e6c309d77c77c095a13d2d5e2f8e2d7f51ece4ae5ffc5fe8683a37387bfdb9acb8528f37342360abb64ec05ff438f7e4fad73c69a627de245a31168f69823883ed8ba590c454914690946b7b07918ded5b89dc663c70941f8704978b91a24b54d88038c30d20d14d85016a524f7176c7a7cff7233a2a4405da9c31c8569ac3adfe5147bdb92faee0f075b36e8ce794aaf596facd881588167fbcf5a7d059474c1e4abff645bba8a813f3083c5a425fcc88cd706b19494dedc04be2bc3ab1d71b2a062ddf62d0393d8cb421393cccc932a19d43e315a18a10d216aea4a1752cf3f3b0b2fb36bea655822e2b27c6156970d18e345930a4a589e1850fe84277e0913ad863dffb1950fbeb03a4a17452e7868f62f77ea2039bd2840e7611a928c26e87541481256f57bfbe3647f596abf6e8f6b5a0e7108acccc6e89db6bcc74a3ac251a6398eca56b2fcdc8c00a9a0b36bc6299e06fb4bb766cb9ecc96de7e367c56032c7feff586f9e557e2cbe156e110b0cc4b2418600dfa9fb33fc60b3f04b794ec1b8d154b48f07ba8c001cd31f75ca0d0fb516016552500d07eb7110de9956d7b4b1a3397f843b39d92df4caac263f5083e34e3161e4d6686c46c3239e7fbf61241a159d8da6dc6bd13df734883d4d0d78d670a1d17e28ef09dffbbfbd15063b73113cb5bed692d68cc30c38cb9389403fe6a1c32c35dbac75464b77597e27b854839db51dfde0885462020000530678b9eb99d1b9e08a6231ef000055560f7d3345f54ce355da68725bb38cab0caf84757ddb93db87577758bb06de7923c4ee3583453f284c8b377a1ec2ef613491e051c801a63da5cb42b9c12e26679fcf489f3b14bd5e8f551227b09d976975e0fbd68dcdf129110a5ca8ed8d163dafb60e1ec4831d5285a7fbae81d0e39580000dc010000ebb282d5c6aca9053a21814e9d65a1516ebeaacf6fc88503e794d75cfc5682e86aa04e9d6e58346e013c5c1203afc5c72861e2a7052afcdcb3ddcccd102dd0daeb595968edb6a6c513db8e2155fc302eeca7a34c9ba81289d6941c4c813db9bf7bd0981d188ab131e5ae9c4bb831e4243b20edb7829a6a7a9cf0eae1214b450109d990e2c824c2a60a47faf90c24992583bc5c3da3b58bd8830a4f0ad5c650aa08ae0e067d4251d251e56d70972ad901038082ee9340f103fd687ec7d91a9b8b8652b1a2b7befb4cbfdb6863f00142e0b2e67198ddc8ddbe96dc02762d935594394f173114215cb5abcf55b9815eb545683528c990bfae34c34358dbb19dfc1426f56cba12af325d7a2941c0d45d0ea4334155b790554d3829e3be618eb1bfc6f3a06f488bbeb910b33533c6741bff6c8a0ca43eb2417eec5ecc2f50f65c3b40d26174376202915337c7992cdd44471dee7a7b2038605415a7af593fd9066661e594b26f4298baf6d001906aa8fc1c460966fbc17b2c35e0973f613399936173802cf0453a4e7d8487b6113a77947eef190ea8d47ba531ce51abf5166448c24a54de09d671fd57cbd68154f5995aee6c2ccfd6738387cf3ad9f0ad5e8c7d46fb0a0000000000000000000000bd920a00000000000000000000000000',
timestamp: 1733606453433
}
```

取 `quote` 字段
