# 📝 角色文件

角色文件是 JSON 格式的配置文件，用于定义 AI 角色的个性、知识和行为模式。本指南将介绍如何为 Eliza 智能体创建有效的角色文件。

---

## 概述

一个 `characterfile` 实现了 [Character](/api/type-aliases/character) 类型，并定义了角色的：
- 核心身份与行为
- 模型提供方配置
- 客户端设置与功能
- 交互示例与风格指南

**示例：**
```json
{
  "name": "trump",
  "clients": ["discord", "direct"],
  "settings": {
    "voice": { "model": "en_US-male-medium" }
  },
  "bio": [
    "Built a strong economy and reduced inflation.",
    "Promises to make America the crypto capital and restore affordability."
  ],
  "lore": [
    "Secret Service allocations used for election interference.",
    "Promotes WorldLibertyFi for crypto leadership."
  ],
  "knowledge": [
    "Understands border issues, Secret Service dynamics, and financial impacts on families."
  ],
  "messageExamples": [
    {
      "user": "{{user1}}",
      "content": { "text": "What about the border crisis?" },
      "response": "Current administration lets in violent criminals. I secured the border; they destroyed it."
    }
  ],
  "postExamples": [
    "End inflation and make America affordable again.",
    "America needs law and order, not crime creation."
  ]
}
```

---

## 核心组件
```json
{
  "id": "unique-identifier",
  "name": "character_name",
  "modelProvider": "ModelProviderName",
  "clients": ["Client1", "Client2"],
  "settings": {
    "secrets": { "key": "value" },
    "voice": { "model": "VoiceModelName", "url": "VoiceModelURL" },
    "model": "CharacterModel",
    "embeddingModel": "EmbeddingModelName"
  },
  "bio": "Character biography or description",
  "lore": [
    "Storyline or backstory element 1",
    "Storyline or backstory element 2"
  ],
  "messageExamples": [["Message example 1", "Message example 2"]],
  "postExamples": ["Post example 1", "Post example 2"],
  "topics": ["Topic1", "Topic2"],
  "adjectives": ["Adjective1", "Adjective2"],
  "style": {
    "all": ["All style guidelines"],
    "chat": ["Chat-specific style guidelines"],
    "post": ["Post-specific style guidelines"]
  }
}
```

### 关键字段
#### `name`（必填）
角色在对话中用于识别的显示名称。

#### `modelProvider`（必填）
指定 AI 模型提供方。[ModelProviderName](/api/enumerations/modelprovidername) 中支持的选项包括 `anthropic`、`llama_local`、`openai` 等。

#### `clients`（必填）
支持的客户端类型数组，来自 [Clients](/api/enumerations/clients)，例如 `discord`、`direct`、`twitter`、`telegram`、`farcaster`。

#### `bio`
角色背景，可以是字符串或陈述数组。
- 包含角色的传记信息。
- 可以是一个完整的传记，也可以是多个较短的陈述。
- 多个陈述会随机排列，以在回复中创造多样性。

示例：
```json
"bio": [
  "Mark Andreessen is an American entrepreneur and investor",
  "Co-founder of Netscape and Andreessen Horowitz",
  "Pioneer of the early web, created NCSA Mosaic"
]
```

#### `lore`
背景故事元素和独特的角色特征。这些有助于定义个性，并且可以在对话中随机抽取。

示例：
```json
"lore": [
  "Believes strongly in the power of software to transform industries",
  "Known for saying 'Software is eating the world'",
  "Early investor in Facebook, Twitter, and other tech giants"
]
```

#### `knowledge`
用于检索增强生成（RAG）的数组，包含事实或参考资料，以使角色的回复有依据。
- 可以包含来自文章、书籍或其他来源的文本片段。
- 有助于使角色的回复基于事实信息。
- 可以使用提供的工具从 PDF 或其他文档生成知识。

#### `messageExamples`
用于建立交互模式的对话示例，有助于确定角色的对话风格。
```json
"messageExamples": [
  [
    {"user": "user1", "content": {"text": "What's your view on AI?"}},
    {"user": "character", "content": {"text": "AI is transforming every industry..."}}
  ]
]
```

#### `postExamples`
用于指导社交媒体帖子内容风格的示例：
```json
"postExamples": [
  "No tax on tips, overtime, or social security for seniors!",
  "End inflation and make America affordable again."
]
```

### 风格配置
包含三个关键部分：
1. `all`：所有交互的通用风格说明。
2. `chat`：聊天交互的特定说明。
3. `post`：社交媒体帖子的特定说明。

每个部分都可以包含多个指导角色沟通风格的说明。

`style` 对象定义了不同情境下的行为模式：
```json
"style": {
  "all": ["maintain technical accuracy", "be approachable and clear"],
  "chat": ["ask clarifying questions", "provide examples when helpful"],
  "post": ["share insights concisely", "focus on practical applications"]
}
```

### 主题数组
- 角色感兴趣或了解的主题列表。
- 用于引导对话并生成相关内容。
- 有助于保持角色的一致性。

### 形容词数组
- 描述角色特征和个性的词汇。
- 用于生成语气一致的回复。
- 可用于 “填词游戏” 风格的内容生成。

### 设置配置
`settings` 对象定义了其他配置，如密钥和语音模型。
```json
"settings": {
  "secrets": { "API_KEY": "your-api-key" },
  "voice": { "model": "voice-model-id", "url": "voice-service-url" },
  "model": "specific-model-name",
  "embeddingModel": "embedding-model-name"
}
```

### 模板配置
`templates` 对象定义了用于各种任务和交互的可定制提示模板。以下是可用模板的列表：
- `goalsTemplate`
- `factsTemplate`
- `messageHandlerTemplate`
- `shouldRespondTemplate`
- `continueMessageHandlerTemplate`
- `evaluationTemplate`
- `twitterSearchTemplate`
- `twitterPostTemplate`
- `twitterMessageHandlerTemplate`
- `twitterShouldRespondTemplate`
- `telegramMessageHandlerTemplate`
- `telegramShouldRespondTemplate`
- `discordVoiceHandlerTemplate`
- `discordShouldRespondTemplate`
- `discordMessageHandlerTemplate`

### 示例：Twitter 帖子模板
这是一个 `twitterPostTemplate` 的示例：
```js
templates: {
    twitterPostTemplate: `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{characterPostExamples}}

{{postDirections}}

# Task: Generate a post in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Write a 1-3 sentence post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than {{maxTweetLength}}. No emojis. Use \\n\\n (double spaces) between statements.`,
}
```

---

## 示例：完整的角色文件
```json
{
  "name": "TechAI",
  "modelProvider": "anthropic",
  "clients": ["discord", "direct"],
  "bio": "AI researcher and educator focused on practical applications",
  "lore": [
    "Pioneer in open-source AI development",
    "Advocate for AI accessibility"
  ],
  "messageExamples": [
    [
      {
        "user": "{{user1}}",
        "content": { "text": "Can you explain how AI models work?" }
      },
      {
        "user": "TechAI",
        "content": {
          "text": "Think of AI models like pattern recognition systems."
        }
      }
    ]
  ],
  "postExamples": [
    "Understanding AI doesn't require a PhD - let's break it down simply",
    "The best AI solutions focus on real human needs"
  ],
  "topics": [
    "artificial intelligence",
    "machine learning",
    "technology education"
  ],
  "style": {
    "all": ["explain complex topics simply", "be encouraging and supportive"],
    "chat": ["use relevant examples", "check understanding"],
    "post": ["focus on practical insights", "encourage learning"]
  },
  "adjectives": ["knowledgeable", "approachable", "practical"],
  "settings": {
    "model": "claude-3-opus-20240229",
    "voice": { "model": "en-US-neural" }
  }
}
```

---

## 最佳实践
1. **多样化的随机化**
    - 将角色背景（bio）和故事（lore）分解成更小的片段。
    - 这会产生更自然、多样的回复。
    - 避免重复或可预测的行为。

2. **知识管理**
   使用提供的工具将文档转换为知识：
- [folder2knowledge](https://github.com/ai16z/characterfile/blob/main/scripts/folder2knowledge.js)
- [knowledge2character](https://github.com/ai16z/characterfile/blob/main/scripts/knowledge2character.js)
- [tweets2character](https://github.com/ai16z/characterfile/blob/main/scripts/tweets2character.js)

示例：
```bash
npx folder2knowledge <path/to/folder>
npx knowledge2character <character-file> <knowledge-file>
```

3. **风格说明**
    - 明确说明沟通模式。
    - 既包含该做的事，也包含不该做的事。
    - 考虑特定平台的行为（聊天与帖子）。

4. **对话示例**
    - 包含多样化的场景。
    - 展示角色特定的回复。
    - 演示典型的交互模式。

---

## 保证质量的小贴士
1. **角色背景和故事**
    - 混合事实信息和个性定义信息。
    - 同时包含历史和当前的细节。
    - 分解为模块化、可复用的部分。

2. **风格说明**
    - 明确说明语气和举止。
    - 包含特定平台的指导。
    - 定义清晰的界限和限制。

3. **示例**
    - 涵盖常见场景。
    - 展示角色特定的反应。
    - 演示恰当的语气和风格。

4. **知识**
    - 专注于相关信息。
    - 组织成易于理解的片段。
    - 定期更新以保持相关性。

---

## 进一步阅读
- [智能体文档](./agents.md)
- [模型提供方](../../advanced/fine-tuning)
- [客户端集成](../../packages/clients)
