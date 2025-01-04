import { ImageZoom } from 'nextra/components'
import { useCallback, useState } from 'react'

const sections = [
  'Agent Prompting Interface',
  'Agentic Behavior',
  'Long Term Memory Processor',
  'Parallel Processing',
  'Stateful AI Runner (SAR)',
  'Coordinator',
  'Model Storage',
  'Long Term Memory',
  'Modular Stateful AI Runner (SAR)',
  'Initial Agent Offering (IAO)',
  'Real-Time Value Streaming',
  'Immutable Contribution Vault',
]

function StackElementTitle({ section }: { section: string }) {
  switch (section) {
    case 'Agent Prompting Interface':
      return <>Agent Prompting Interface（智能体提示词接口）</>
    case 'Agentic Behavior':
      return <>Agentic Behavior（智能体行为）</>
    case 'Long Term Memory Processor':
      return <>Long Term Memory Processor（长期记忆处理器）</>
    case 'Parallel Processing':
      return <>Parallel Processing（并行处理）</>
    case 'Stateful AI Runner (SAR)':
      return <>Stateful AI Runner（SAR，有状态 AI 运行器）</>
    case 'Coordinator':
      return <>Coordinator（协调器）</>
    case 'Model Storage':
      return <>Model Storage（模型存储）</>
    case 'Long Term Memory':
      return <>Long Term Memory（长期记忆）</>
    case 'Modular Stateful AI Runner (SAR)':
      return <>Modular Stateful AI Runner（SAR，模块化有状态 AI 运行器）</>
    case 'Initial Agent Offering (IAO)':
      return <>Initial Agent Offering（IAO，初始智能体发行）</>
    case 'Real-Time Value Streaming':
      return <>Real-Time Value Streaming（实时价值流）</>
    case 'Immutable Contribution Vault':
      return <>Immutable Contribution Vault（不可变贡献库）</>
    default:
      return <></>
  }
}

function StackElementDesc({ section }: { section: string }) {
  switch (section) {
    case 'Agent Prompting Interface':
      return (
        <>
          此接口由一组 API 和 SDK 组成，可实现外部应用程序与 Virtuals Agent Composer（Virtuals
          智能体组合器）之间的无缝集成。这种双向接口允许应用程序调用 AI
          智能体的服务来执行各种计算任务或用户交互，促进动态且响应迅速的 AI 驱动功能。
        </>
      )
    case 'Agentic Behavior':
      return (
        <>
          这个框架定义了 AI 智能体的核心能力。感知子系统处理感知数据，<span className="text-[#404040]">动作执行器</span>
          将命令转化为动作，而 <span className="text-[#404040]">战略规划引擎</span>
          使用诸如马尔可夫决策过程（MDP）之类的算法来优化多步计划。<span className="text-[#404040]">学习模块</span>
          通过强化学习来优化行为。此外，智能体通过 <span className="text-[#404040]">链上钱包操作员</span>
          管理数字资产和交易的链上活动。
        </>
      )
    case 'Long Term Memory Processor':
      return (
        <>
          一个专门用于存储、检索和管理持久数据结构（如知识图谱或内存嵌入）的子系统，使智能体能够在不同会话中保持连续性和上下文感知能力。
        </>
      )
    case 'Parallel Processing':
      return (
        <>
          一个并发管理组件，它协调多个智能体行为的并行执行，利用多线程或分布式计算框架来优化性能，以确保实时交互和决策。
        </>
      )
    case 'Stateful AI Runner (SAR)':
      return (
        <>
          Stateful AI Runners（有状态 AI 运行器）是托管 AI 智能体的个性、语音和视觉的服务器。它们包括{' '}
          <span className="text-[#404040]">Sequencer（定序器）</span>
          ，该定序器按顺序或并行处理和链接模型以实现期望的结果；以及各种{' '}
          <span className="text-[#404040]">Models（模型）</span>，如
          LLM（大型语言模型）、Text-to-Speech（文本到语音）、Audio-to-Facial（音频到面部）、Audio-to-Gesture（音频到手势）、Music-to-Dance（音乐到舞蹈）和
          Image Generation（图像生成）模型，用于创建多模态 AI 智能体。
        </>
      )
    case 'Coordinator':
      return (
        <>
          一个同步守护进程，它监视链上和链下的状态变化，协调系统中 AI
          模型、数据集和配置的更新。它会根据链上事件触发实时调整。
        </>
      )
    case 'Model Storage':
      return <>一种用于持久化存储 AI 模型的去中心化、分布式存储解决方案，确保高可用性和冗余性。</>
    case 'Long Term Memory':
      return (
        <>
          一个专门用于存档历史数据、决策和交互的组件。它采用持久存储技术来确保数据的安全性和可访问性，使智能体能够在未来的决策中利用过去的经验。
        </>
      )
    case 'Modular Stateful AI Runner (SAR)':
      return (
        <>
          这些是 SAR 的模块化、容器化实例，它们被打包以便在异构虚拟环境或 GPU
          集群中进行部署，允许可扩展且灵活地集成到不同的基础设施生态系统中。
        </>
      )
    case 'Initial Agent Offering (IAO)':
      return (
        <>
          一种用于在区块链上启动和交易 AI 智能体的机制，其中每个智能体都由一个流动性池支持。这个池由符合 ERC-6551
          标准的钱包管理，可实现动态定价和市场驱动的交易。
        </>
      )
    case 'Real-Time Value Streaming':
      return <>每个 AI 智能体都配备了一个 ERC 6551 钱包，能够实现持续的收益累积并将其无缝分配给所有者。</>
    case 'Immutable Contribution Vault':
      return (
        <>
          用户可以上传自定义模型和数据集，它们被安全地存储在区块链上的不可变贡献库（ICV）中。
          <span className="text-[#404040]">模型增强管道</span>
          使用新数据来增强 AI 模型，通过加密证明确保安全性，并进行不可变存储。ICV 内的
          <span className="text-[#404040]">语音和文本数据存储库</span>
          通过去中心化的区块链存储确保数据的完整性和来源可靠性。
        </>
      )
    default:
      return <></>
  }
}

export function ProtocolStack() {
  const [section, _setSection] = useState('Agent Prompting Interface')
  const [index, setIndex] = useState(0)

  const setSection = useCallback((section: string) => {
    _setSection(section)
    setIndex(sections.indexOf(section))
  }, [])

  const nextIndex = useCallback(() => {
    if (index < sections.length - 1) {
      _setSection(sections[index + 1])
      setIndex(index + 1)
    }
  }, [index])
  const prevIndex = useCallback(() => {
    if (index > 0) {
      _setSection(sections[index - 1])
      setIndex(index - 1)
    }
  }, [index])

  return (
    <>
      <h1 className="text-xl text-[#404040] mb-4">Virtuals 协议栈示意图</h1>
      <div className="w-fit max-w-full overflow-x-auto flex flex-col relative self-center mb-6 rounded-[18px] border-[6px] border-white bg-white">
        <img
          src="/images/virtuals/stack-diagram.svg"
          alt="Protocol Stack Diagram"
          style={{ width: '941px', minWidth: '941px' }}
        />
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Agent Prompting Interface' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '497px', left: '764.5px', width: '122px', height: '35px' }}
          onMouseOver={() => setSection('Agent Prompting Interface')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Agentic Behavior' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '162px', left: '222px', width: '144.5px', height: '167.5px' }}
          onMouseOver={() => setSection('Agentic Behavior')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Long Term Memory Processor' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '339.5px', left: '222px', width: '144.5px', height: '56px' }}
          onMouseOver={() => setSection('Long Term Memory Processor')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Parallel Processing' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '133px', left: '259.25px', width: '70px', height: '23px' }}
          onMouseOver={() => setSection('Parallel Processing')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Stateful AI Runner (SAR)' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '133px', left: '470.5px', width: '186px', height: '262.5px' }}
          onMouseOver={() => setSection('Stateful AI Runner (SAR)')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Coordinator' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '574px', left: '764.5px', width: '122px', height: '35px' }}
          onMouseOver={() => setSection('Coordinator')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Model Storage' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '223.5px', left: '749px', width: '152.5px', height: '59.5px' }}
          onMouseOver={() => setSection('Model Storage')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Long Term Memory' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '343px', left: '749px', width: '152.5px', height: '62px' }}
          onMouseOver={() => setSection('Long Term Memory')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Modular Stateful AI Runner (SAR)' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '78px', left: '745px', width: '160px', height: '87px' }}
          onMouseOver={() => setSection('Modular Stateful AI Runner (SAR)')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Initial Agent Offering (IAO)' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '613px', left: '359px', width: '161px', height: '43px' }}
          onMouseOver={() => setSection('Initial Agent Offering (IAO)')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Real-Time Value Streaming' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '478px', left: '222px', width: '140px', height: '87px' }}
          onMouseOver={() => setSection('Real-Time Value Streaming')}
        ></div>
        <div
          className={`absolute ease-in-out transition-all rounded-lg cursor-pointer ${section === 'Immutable Contribution Vault' ? 'ring-[14px] ring-[#0797C5]/40 scale-[1.06] border-[6px] border-[#0797C5]' : ''}`}
          style={{ top: '478px', left: '374px', width: '282.5px', height: '87px' }}
          onMouseOver={() => setSection('Immutable Contribution Vault')}
        ></div>
      </div>

      <div className="flex flex-row items-center mb-4 opacity-0" style={{ opacity: 1 }}>
        <img
          src="/images/virtuals/left.svg"
          alt="left"
          className={`size-[24px] min-w-[24px] object-contain mr-2 cursor-pointer hover:opacity-80 ${index === 0 ? 'opacity-30 hover:opacity-30' : ''}`}
          onClick={prevIndex}
        />
        <img
          src="/images/virtuals/right.svg"
          alt="right"
          className={`size-[24px] min-w-[24px] object-contain mr-4 cursor-pointer hover:opacity-80 ${index === sections.length - 1 ? 'opacity-30 hover:opacity-30' : ''}`}
          onClick={nextIndex}
        />
        <h2 className="text-xl text-[#404040]">
          关于{' '}
          <span className="text-[#236D66]">
            <StackElementTitle section={section} />
          </span>
        </h2>
      </div>

      <div className="opacity-0 flex flex-col" style={{ opacity: 1 }}>
        <p className="text-base text-[#404040]/50 whitespace-pre-line">
          <StackElementDesc section={section} />
        </p>
      </div>

      <div className="bg-[#404040]/30 h-px min-h-px my-10 opacity-0" style={{ opacity: 1 }}></div>

      <p className="text-xl text-[#404040] opacity-0 mb-4" style={{ opacity: 1 }}>
        Introducing Generative Autonomous Multimodal Entities (G.A.M.E)
      </p>

      <div>
        <ImageZoom
          src="/images/virtuals/g.a.m.e.-diagram.png"
          alt="G.A.M.E. Diagram"
          className="w-full max-w-[941px] object-contain mb-6 opacity-0 m-auto"
          style={{ opacity: 1 }}
          width={941}
          height={543}
        />
      </div>

      <p className="text-base text-[#404040]/50 whitespace-pre-line opacity-0" style={{ opacity: 1 }}>
        <span className="text-[#404040]">
          Generative Autonomous Multimodal Entities（G.A.M.E，生成式自主多模态实体）
        </span>
        是为开发人员设计的第一款产品，用于通过 API 和 SDK 访问和试验我们的 AI 智能体。
        <br />
        <br />
        <span className="text-[#404040]">Agent Prompting Interface（智能体提示词接口）</span>
        是访问智能体行为特性的门户。感知子系统合成消息并将其发送到战略规划引擎。战略规划引擎与对话处理模块和链上钱包操作员协作生成响应。
        <span className="text-[#404040]">长期记忆处理器</span>
        有效地提取相关信息——包括经验、反思、动态个性、世界背景和工作记忆——以增强决策能力。
        <br />
        <br />
        通过将结果反馈到框架中，AI 智能体可以优化其一般知识，用于未来的规划，评估其行动和对话的结果。
        <br />
        <br />
        你可以从使用 <span className="text-[#404040]">G.A.M.E.</span>{' '}
        开始，这是一个轻量级框架，允许你在项目中轻松地即插即用 AI 智能体。
      </p>
    </>
  )
}
