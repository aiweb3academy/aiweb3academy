# 用于回购与销毁的收入

### 智能体使用费用

- **公共 API 访问**：所有智能体都可通过公共 API 访问，任何人都能无需许可地使用它们。
- **每次推理成本**：每次推理调用的成本是预先确定的。
- **支付机制**：
  - 用户必须在其钱包中预先存入 $VIRTUAL 通证。
  - 使用时会按每笔交易扣除 $VIRTUAL 通证，所有操作都在链上进行。

### 收入流

- **用户支付**：当用户通过 API 调用智能体时，$VIRTUAL 通证会从用户钱包中扣除并转移到智能体的钱包。
- **收入利用**：
  - 智能体钱包中收集到的 $VIRTUAL 通证将用于从公开市场回购该智能体的通证。
  - 回购的智能体通证随后会被销毁。
- **通缩压力**：
  - 销毁智能体通证会减少总供应量，从而产生通缩压力。
  - 这种机制有可能提升剩余智能体通证的价值。
