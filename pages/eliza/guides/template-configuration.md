# 🔧 模板和客户端配置

## 概述
本指南涵盖了如何为你的 AI 智能体配置自定义模板和客户端行为。我们将详细介绍所有可用的模板选项和配置设置。

## 模板配置

### 概述
你可以通过在角色的 JSON 文件中覆盖默认的提示模板来定制角色的行为。ai16z/eliza 为标准行为提供了默认的提示，使所有模板字段都是可选的。


### 可用的模板选项
以下是你可以配置的所有模板选项：
```json
{
  "templates": {
    "goalsTemplate": "", // 定义角色目标
    "factsTemplate": "", // 指定角色知识
    "messageHandlerTemplate": "", // 处理一般消息
    "shouldRespondTemplate": "", // 控制响应触发
    "continueMessageHandlerTemplate": "", // 管理对话流程
    "evaluationTemplate": "", // 处理响应评估
    "twitterSearchTemplate": "", // 处理 Twitter 搜索
    "twitterPostTemplate": "", // 格式化 Twitter 帖子
    "twitterMessageHandlerTemplate": "", // 处理 Twitter 消息
    "twitterShouldRespondTemplate": "", // 控制 Twitter 响应
    "telegramMessageHandlerTemplate": "", // 处理 Telegram 消息
    "telegramShouldRespondTemplate": "", // 控制 Telegram 响应
    "discordVoiceHandlerTemplate": "", // 管理 Discord 语音
    "discordShouldRespondTemplate": "", // 控制 Discord 响应
    "discordMessageHandlerTemplate": "" // 处理 Discord 消息
  }
}
```


### 示例用法
```json
{
  "templates": {
    "discordMessageHandlerTemplate": "",
    "discordShouldRespondTemplate": "",
    "telegramShouldRespondTemplate": "",
    "twitterPostTemplate": ""
  }
}
```


## 客户端配置

### 概述
为你的角色配置特定平台的行为，例如处理直接消息和机器人交互。


### 可用选项
```json
{
  "clientConfig": {
    "telegram": {
      "shouldIgnoreDirectMessages": true, // 忽略直接消息
      "shouldIgnoreBotMessages": true // 忽略机器人消息
    },
    "discord": {
      "shouldIgnoreBotMessages": true, // 忽略机器人消息
      "shouldIgnoreDirectMessages": true // 忽略直接消息
    }
  }
}
```


## 最佳实践

1. **模板管理**
    - 保持模板专注且具体。
    - 使用清晰、一致的格式。
    - 记录自定义模板的行为。


2. **客户端配置**
    - 根据需要为每个平台进行配置。
    - 在开发中测试行为。
    - 监控交互模式。


3. **性能考虑**
    - 保持模板简洁。
    - 避免冗余配置。
    - 使用预期的消息量进行测试。
