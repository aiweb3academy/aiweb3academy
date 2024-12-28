#  📈 自主交易

## 概述
Eliza 的自主交易系统能够在 Solana 区块链上实现自动化的代币交易。该系统与 Jupiter 聚合器集成，以实现高效的代币交换，实现了智能订单路由，并包含风险管理功能。

## 核心组件

### 代币提供者
管理代币信息和市场数据：
```typescript
class TokenProvider {
  constructor(
    private tokenAddress: string,
    private walletProvider: WalletProvider,
  ) {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 分钟的缓存
  }

  async fetchPrices(): Promise<Prices> {
    const { SOL, BTC, ETH } = TOKEN_ADDRESSES;
    // 获取当前价格
    return {
      solana: { usd: "0" },
      bitcoin: { usd: "0" },
      ethereum: { usd: "0" },
    };
  }

  async getProcessedTokenData(): Promise<ProcessedTokenData> {
    return {
      security: await this.fetchTokenSecurity(),
      tradeData: await this.fetchTokenTradeData(),
      holderDistributionTrend: await this.analyzeHolderDistribution(),
      highValueHolders: await this.filterHighValueHolders(),
      recentTrades: await this.checkRecentTrades(),
      dexScreenerData: await this.fetchDexScreenerData(),
    };
  }
}
```

### 交换执行
使用 Jupiter 进行代币交换的实现：
```typescript
async function swapToken(
  connection: Connection,
  walletPublicKey: PublicKey,
  inputTokenCA: string,
  outputTokenCA: string,
  amount: number,
): Promise<any> {
  // 获取代币小数位数
  const decimals = await getTokenDecimals(connection, inputTokenCA);
  const adjustedAmount = amount * 10 ** decimals;

  // 获取报价
  const quoteResponse = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${inputTokenCA}` +
      `&outputMint=${outputTokenCA}` +
      `&amount=${adjustedAmount}` +
      `&slippageBps=50`,
  );

  // 执行交换
  const swapResponse = await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    body: JSON.stringify({
      quoteResponse: await quoteResponse.json(),
      userPublicKey: walletPublicKey.toString(),
      wrapAndUnwrapSol: true,
    }),
  });

  return swapResponse.json();
}
```

## 头寸管理

### 订单簿系统
```typescript
interface Order {
  userId: string;
  ticker: string;
  contractAddress: string;
  timestamp: string;
  buyAmount: number;
  price: number;
}

class OrderBookProvider {
  async addOrder(order: Order): Promise<void> {
    let orderBook = await this.readOrderBook();
    orderBook.push(order);
    await this.writeOrderBook(orderBook);
  }

  async calculateProfitLoss(userId: string): Promise<number> {
    const orders = await this.getUserOrders(userId);
    return orders.reduce((total, order) => {
      const currentPrice = this.getCurrentPrice(order.ticker);
      const pl = (currentPrice - order.price) * order.buyAmount;
      return total + pl;
    }, 0);
  }
}
```

### 头寸规模
```typescript
async function calculatePositionSize(
  tokenData: ProcessedTokenData,
  riskLevel: "LOW" | "MEDIUM" | "HIGH",
): Promise<CalculatedBuyAmounts> {
  const { liquidity, marketCap } = tokenData.dexScreenerData.pairs[0];

  // 基于流动性的影响百分比
  const impactPercentages = {
    LOW: 0.01, // 流动性的 1%
    MEDIUM: 0.05, // 流动性的 5%
    HIGH: 0.1, // 流动性的 10%
  };

  return {
    none: 0,
    low: liquidity.usd * impactPercentages.LOW,
    medium: liquidity.usd * impactPercentages.MEDIUM,
    high: liquidity.usd * impactPercentages.HIGH,
  };
}
```

## 风险管理

### 代币验证
```typescript
async function validateToken(token: TokenPerformance): Promise<boolean> {
  const security = await fetchTokenSecurity(token.tokenAddress);

  // 风险检查
  if (
    security.rugPull ||
    security.isScam ||
    token.rapidDump ||
    token.suspiciousVolume ||
    token.liquidity.usd < 1000 || // 最小 1000 美元的流动性
    token.marketCap < 100000 // 最小 10 万美元的市值
  ) {
    return false;
  }

  // 持有者分布检查
  const holderData = await fetchHolderList(token.tokenAddress);
  const topHolderPercent = calculateTopHolderPercentage(holderData);
  if (topHolderPercent > 0.5) {
    // 前几名持有者持有超过 50%
    return false;
  }

  return true;
}
```

### 交易管理
```typescript
interface TradeManager {
    async executeTrade(params: {
        inputToken: string,
        outputToken: string,
        amount: number,
        slippage: number
    }): Promise<string>;

    async monitorPosition(params: {
        tokenAddress: string,
        entryPrice: number,
        stopLoss: number,
        takeProfit: number
    }): Promise<void>;

    async closePosition(params: {
        tokenAddress: string,
        amount: number
    }): Promise<string>;
}
```

## 市场分析

### 价格数据收集
```typescript
async function collectMarketData(
  tokenAddress: string,
): Promise<TokenTradeData> {
  return {
    price: await fetchCurrentPrice(tokenAddress),
    volume_24h: await fetch24HourVolume(tokenAddress),
    price_change_24h: await fetch24HourPriceChange(tokenAddress),
    liquidity: await fetchLiquidity(tokenAddress),
    holder_data: await fetchHolderData(tokenAddress),
    trade_history: await fetchTradeHistory(tokenAddress),
  };
}
```

### 技术分析
```typescript
function analyzeMarketConditions(tradeData: TokenTradeData): MarketAnalysis {
  return {
    trend: analyzePriceTrend(tradeData.price_history),
    volume_profile: analyzeVolumeProfile(tradeData.volume_history),
    liquidity_depth: analyzeLiquidityDepth(tradeData.liquidity),
    holder_behavior: analyzeHolderBehavior(tradeData.holder_data),
  };
}
```

## 交易执行

### 交换实现
```typescript
async function executeSwap(
  runtime: IAgentRuntime,
  input: {
    tokenIn: string;
    tokenOut: string;
    amountIn: number;
    slippage: number;
  },
): Promise<string> {
  // 准备交易
  const { swapTransaction } = await getSwapTransaction(input);

  // 签署交易
  const keypair = getKeypairFromPrivateKey(
    runtime.getSetting("SOLANA_PRIVATE_KEY")??
      runtime.getSetting("WALLET_PRIVATE_KEY"),
  );
  transaction.sign([keypair]);

  // 执行交换
  const signature = await connection.sendTransaction(transaction);

  // 确认交易
  await connection.confirmTransaction({
    signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });

  return signature;
}
```

### DAO 集成
```typescript
async function executeSwapForDAO(
  runtime: IAgentRuntime,
  params: {
    inputToken: string;
    outputToken: string;
    amount: number;
  },
): Promise<string> {
  const authority = getAuthorityKeypair(runtime);
  const [statePDA, walletPDA] = await derivePDAs(authority);

  // 准备指令数据
  const instructionData = prepareSwapInstruction(params);

  // 通过 DAO 执行交换
  return invokeSwapDao(
    connection,
    authority,
    statePDA,
    walletPDA,
    instructionData,
  );
}
```

## 监控与安全

### 健康检查
```typescript
async function performHealthChecks(): Promise<HealthStatus> {
  return {
    connection: await checkConnectionStatus(),
    wallet: await checkWalletBalance(),
    orders: await checkOpenOrders(),
    positions: await checkPositions(),
  };
}
```

### 安全限制
```typescript
const SAFETY_LIMITS = {
  MAX_POSITION_SIZE: 0.1, // 投资组合的 10%
  MAX_SLIPPAGE: 0.05, // 5% 的滑点
  MIN_LIQUIDITY: 1000, // 最小 1000 美元的流动性
  MAX_PRICE_IMPACT: 0.03, // 3% 的价格影响
  STOP_LOSS: 0.15, // 15% 的止损
};
```

## 错误处理

### 交易错误
```typescript
async function handleTransactionError(
  error: Error,
  transaction: Transaction,
): Promise<void> {
  if (error.message.includes("insufficient funds")) {
    await handleInsufficientFunds();
  } else if (error.message.includes("slippage tolerance exceeded")) {
    await handleSlippageError(transaction);
  } else {
    await logTransactionError(error, transaction);
  }
}
```

### 恢复程序
```typescript
async function recoverFromError(
  error: Error,
  context: TradingContext,
): Promise<void> {
  // 停止所有活跃交易
  await stopActiveTrades();

  // 关闭风险头寸
  await closeRiskyPositions();

  // 重置系统状态
  await resetTradingState();

  // 通知管理员
  await notifyAdministrators(error, context);
}
```
