# 🤝 信任引擎

## 概述
信任引擎是一个复杂的系统，用于评估、跟踪和管理代币推荐和交易活动的信任分数。它结合了链上分析、交易者指标和历史表现，创建了一个全面的信任框架。

## 核心组件

### 信任分数数据库
数据库模式管理信任的各个方面：
```typescript
interface TrustScoreDatabase {
  // 核心数据结构
  recommenders: Recommender[];
  metrics: RecommenderMetrics[];
  tokenPerformance: TokenPerformance[];
  recommendations: TokenRecommendation[];
}

interface Recommender {
  id: string;
  address: string;
  solanaPubkey?: string;
  telegramId?: string;
  discordId?: string;
  twitterId?: string;
  ip?: string;
}

interface RecommenderMetrics {
  recommenderId: string;
  trustScore: number;
  totalRecommendations: number;
  successfulRecs: number;
  avgTokenPerformance: number;
  riskScore: number;
  consistencyScore: number;
  virtualConfidence: number;
  lastActiveDate: Date;
}
```

### 代币分析
系统跟踪全面的代币指标：
```typescript
interface TokenPerformance {
  tokenAddress: string;
  priceChange24h: number;
  volumeChange24h: number;
  trade_24h_change: number;
  liquidity: number;
  liquidityChange24h: number;
  holderChange24h: number;
  rugPull: boolean;
  isScam: boolean;
  marketCapChange24h: number;
  sustainedGrowth: boolean;
  rapidDump: boolean;
  suspiciousVolume: boolean;
  validationTrust: number;
  lastUpdated: Date;
}
```

## 信任评分系统

### 分数计算
```typescript
async function calculateTrustScore(
  recommenderId: string,
  metrics: RecommenderMetrics,
): Promise<number> {
  const weights = {
    successRate: 0.3,
    avgPerformance: 0.2,
    consistency: 0.2,
    riskMetric: 0.15,
    timeDecay: 0.15,
  };

  const successRate = metrics.successfulRecs / metrics.totalRecommendations;
  const normalizedPerformance = normalizePerformance(
    metrics.avgTokenPerformance,
  );
  const timeDecayFactor = calculateTimeDecay(metrics.lastActiveDate);

  return (
    (successRate * weights.successRate +
      normalizedPerformance * weights.avgPerformance +
      metrics.consistencyScore * weights.consistency +
      (1 - metrics.riskScore) * weights.riskMetric +
      timeDecayFactor * weights.timeDecay) *
    100
  );
}
```

### 代币验证
```typescript
async function validateToken(
  tokenAddress: string,
  performance: TokenPerformance,
): Promise<boolean> {
  // 最低要求
  const requirements = {
    minLiquidity: 1000, // 1000 美元
    minHolders: 100,
    maxOwnership: 0.2, // 单个持有者最大 20%
    minVolume: 500, // 每日 500 美元的交易量
  };

  // 危险信号
  if (
    performance.rugPull ||
    performance.isScam ||
    performance.rapidDump ||
    performance.suspiciousVolume
  ) {
    return false;
  }

  // 基本要求
  return (
    performance.liquidity >= requirements.minLiquidity &&
   !performance.rapidDump &&
    performance.validationTrust > 0.5
  );
}
```

## 交易管理

### 交易表现跟踪
```typescript
interface TradePerformance {
  token_address: string;
  recommender_id: string;
  buy_price: number;
  sell_price: number;
  buy_timeStamp: string;
  sell_timeStamp: string;
  profit_usd: number;
  profit_percent: number;
  market_cap_change: number;
  liquidity_change: number;
  rapidDump: boolean;
}

async function recordTradePerformance(
  trade: TradePerformance,
  isSimulation: boolean,
): Promise<void> {
  const tableName = isSimulation? "simulation_trade" : "trade";
  await db.query(
    `
        INSERT INTO ${tableName} (
            token_address,
            recommender_id,
            buy_price,
            sell_price,
            buy_timeStamp,
            sell_timeStamp,
            profit_usd,
            profit_percent,
            market_cap_change,
            liquidity_change,
            rapidDump
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
    [
      /* 参数 */
    ],
  );
}
```

### 风险管理
```typescript
async function assessTradeRisk(
  token: TokenPerformance,
  recommender: RecommenderMetrics,
): Promise<{
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  maxPositionSize: number;
}> {
  const riskFactors = {
    tokenTrust: token.validationTrust,
    recommenderTrust: recommender.trustScore,
    marketMetrics: {
      liquidity: token.liquidity,
      volume: token.volumeChange24h,
      holders: token.holderChange24h,
    },
  };

  // 计算综合风险分数
  const riskScore = calculateRiskScore(riskFactors);

  // 确定头寸规模
  const maxPosition = determinePositionSize(riskScore);

  return {
    riskLevel: getRiskLevel(riskScore),
    maxPositionSize: maxPosition,
  };
}
```

## 推荐分析

### 模式检测
```typescript
async function analyzeRecommendationPatterns(
  recommenderId: string,
): Promise<RecommendationPattern> {
  const history = await getRecommenderHistory(recommenderId);

  return {
    timeOfDay: analyzeTimingPatterns(history),
    tokenTypes: analyzeTokenPreferences(history),
    successRateByType: calculateTypeSuccessRates(history),
    riskProfile: assessRiskProfile(history),
  };
}
```

### 性能指标
```typescript
interface PerformanceMetrics {
  profitability: number;
  consistency: number;
  riskAdjustedReturn: number;
  maxDrawdown: number;
  winRate: number;
}

async function calculatePerformanceMetrics(
  recommendations: TokenRecommendation[],
): Promise<PerformanceMetrics> {
  const trades = await getTradesFromRecommendations(recommendations);

  return {
    profitability: calculateProfitability(trades),
    consistency: calculateConsistency(trades),
    riskAdjustedReturn: calculateSharpeRatio(trades),
    maxDrawdown: calculateMaxDrawdown(trades),
    winRate: calculateWinRate(trades),
  };
}
```

## 与交易系统集成

### 交易执行
```typescript
async function executeTrade(
  recommendation: TokenRecommendation,
  trustScore: number,
): Promise<boolean> {
  const riskAssessment = await assessTradeRisk(
    recommendation.tokenAddress,
    recommendation.recommenderId,
  );

  // 根据信任分数计算头寸规模
  const positionSize = calculatePositionSize(
    trustScore,
    riskAssessment.maxPositionSize,
  );

  if (positionSize > 0) {
    await executeSwap({
      inputToken: "SOL",
      outputToken: recommendation.tokenAddress,
      amount: positionSize,
    });

    await recordTradeEntry(recommendation, positionSize);
    return true;
  }

  return false;
}
```

### 头寸管理
```typescript
async function managePosition(
  position: TradePosition,
  metrics: TokenPerformance,
): Promise<void> {
  // 退出条件
  if (
    metrics.rapidDump ||
    metrics.suspiciousVolume ||
    calculateDrawdown(position) > MAX_DRAWDOWN
  ) {
    await executeExit(position);
    return;
  }

  // 头寸规模调整
  const newSize = recalculatePosition(position, metrics);
  if (newSize!== position.size) {
    await adjustPosition(position, newSize);
  }
}
```

## 监控和警报

### 性能监控
```typescript
async function monitorTrustMetrics(): Promise<void> {
  // 监控信任分数变化
  const scoreChanges = await getTrustScoreChanges();
  for (const change of scoreChanges) {
    if (Math.abs(change.delta) > TRUST_THRESHOLD) {
      await notifyTrustChange(change);
    }
  }

  // 监控交易表现
  const performanceMetrics = await getPerformanceMetrics();
  for (const metric of performanceMetrics) {
    if (metric.drawdown > MAX_DRAWDOWN) {
      await notifyRiskAlert(metric);
    }
  }
}
```

### 警报系统
```typescript
interface TrustAlert {
  type: "SCORE_CHANGE" | "RISK_LEVEL" | "PERFORMANCE";
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: string;
  data: any;
}

async function handleAlert(alert: TrustAlert): Promise<void> {
  switch (alert.severity) {
    case "HIGH":
      await sendImmediateNotification(alert);
      await pauseTrading(alert.data);
      break;
    case "MEDIUM":
      await sendNotification(alert);
      await adjustRiskLevels(alert.data);
      break;
    case "LOW":
      await logAlert(alert);
      break;
  }
}
```

## 故障排除

### 常见问题

1. **信任分数异常**
```typescript
async function investigateTrustAnomaly(
  recommenderId: string,
): Promise<AnomalyReport> {
  const history = await getRecommenderHistory(recommenderId);
  const metrics = await getRecommenderMetrics(recommenderId);
  const trades = await getRecommenderTrades(recommenderId);

  return analyzeAnomalies(history, metrics, trades);
}
```

2. **交易执行失败**
```typescript
async function handleTradeFailure(
  error: Error,
  trade: TradeAttempt,
): Promise<void> {
  await logTradeError(error, trade);
  await adjustTrustScore(trade.recommenderId, "FAILURE");
  await notifyTradeFailure(trade);
}
```
