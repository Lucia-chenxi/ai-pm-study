/* AI PM 学习手册 —— 课程方案数据 v0.5
   这是 6 阶段 / 20 模块 / 80 单元的学习路径，不是 80 篇完整课文。
   所有资料元数据原样保留：date、date_type、date_evidence、verified_on。 */

window.COURSE = {
  version: "0.5",
  checkedDate: "2026-10-29",
  checkedLabel: "资料由你自己收藏，阅读时请核对原始页面的当前内容",
  stages: [
    {
      n: 1,
      name: "产品基础",
      en: "FOUNDATIONS",
      range: [1, 5],
      blurb: "从产品是什么、用户问题怎么找，到方案怎么写、指标怎么定。先把判断说清楚。"
    },
    {
      n: 2,
      name: "AI 与工程",
      en: "AI & ENGINEERING",
      range: [6, 8],
      blurb: "理解模型、一次请求的链路和选型取舍，把技术词汇翻成产品判断。"
    },
    {
      n: 3,
      name: "AI 方案设计",
      en: "SOLUTION DESIGN",
      range: [9, 13],
      blurb: "把用户任务写成可验证的 AI 行为：需求、提示词、知识库、工作流与信任。"
    },
    {
      n: 4,
      name: "评测与交付",
      en: "EVAL & DELIVERY",
      range: [14, 16],
      blurb: "评测、治理和上线运营：用证据判断改动是不是真的变好了。"
    },
    {
      n: 5,
      name: "运营与协作",
      en: "OPS & COLLAB",
      range: [17, 18],
      blurb: "数据、增长与组织沟通：让产品持续被使用，也让决定能被执行。"
    },
    {
      n: 6,
      name: "专业与作品",
      en: "CRAFT & PORTFOLIO",
      range: [19, 20],
      blurb: "选一个行业做深，再把过程整理成可以被核对的作品。"
    }
  ],
  modules: [
    {
      n: 1,
      title: "产品与产品经理入门",
      question: "一名产品经理需要作出哪些决定？",
      units: [
        "区分产品、功能、用户问题与业务目标",
        "认识 B 端、C 端、内部工具及使用者/购买者差异",
        "串起发现、定义、交付、验证和迭代",
        "认识产品、设计、工程与运营的分工"
      ],
      primary: {
        title: "Atlassian：Product Manager",
        url: "https://www.atlassian.com/agile/product-management/product-manager",
        reading_scope: "职责、关键能力与协作部分；用一个熟悉产品对照理解。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "B 站｜马力的北邮产品经理入门课程",
        url: "https://www.bilibili.com/video/BV1h94y1U74x",
        reading_scope: "先看第 1 课，梳理产品经理如何从问题走到交付；后续按需选课。",
        date: "2022-05-26",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "2,109 赞 · 7,453 收藏（2026-10-29）"
      },
      artifact: "把熟悉产品拆成用户、任务、价值、功能和指标，并画一张协作图。",
      completion: "能区分“交付功能”和“解决问题”，解释 PM 在哪些节点作决定。",
      limit: "不要求先学 Jira/Confluence，也不照搬厂商的组织设置。",
      source_policy: "经典产品/基础方法按质量保留，案例和工具界面按当前版本核对。"
    },
    {
      n: 2,
      title: "用户研究与问题定义",
      question: "这个问题是真实发生的，还是我们想象出来的？",
      units: [
        "先写信息缺口，再选择访谈、观察或数据分析",
        "追问最近一次真实经历，避免诱导",
        "区分观察事实、用户观点、自己的解释和待验证假设",
        "整理用户任务、现有流程、痛点与替代方案"
      ],
      primary: {
        title: "GOV.UK：深度访谈",
        url: "https://www.gov.uk/service-manual/user-research/using-in-depth-interviews",
        reading_scope: "Plan、Design、Do、After 四部分，先掌握中性提问和真实事例。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "B 站｜产品经理究竟如何做用户调研？",
        url: "https://www.bilibili.com/video/BV1Ju411q7yM",
        reading_scope: "5 分钟看提问与研究流程，随后自己写一份访谈提纲。",
        date: "2022-03-20",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "417 赞 · 943 收藏（2026-10-29）"
      },
      artifact: "一份研究计划、一份访谈提纲和一次获得同意的真实访谈记录。",
      completion: "能用原始记录支持问题陈述；AI 模拟用户只用于练习提问。",
      limit: "英国政府的行政流程和固定研究节奏不直接当作个人项目要求。",
      source_policy: "经典产品/基础方法按质量保留，案例和工具界面按当前版本核对。"
    },
    {
      n: 3,
      title: "需求分析、优先级与机会判断",
      question: "为什么现在做这个，第一版做到哪里？",
      units: [
        "将功能请求改写为用户问题",
        "建立目标→机会→方案→待验证假设的关系",
        "比较非 AI 方案与 AI 方案",
        "用价值、证据、投入和风险缩小 MVP 范围"
      ],
      primary: {
        title: "Teresa Torres：机会解决方案树",
        url: "https://www.producttalk.org/opportunity-solution-trees/",
        reading_scope: "重点读机会与方案的区别、目标机会选择和假设测试。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "Intercom：RICE 优先级",
        url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers",
        reading_scope: "理解 Reach/Impact/Confidence/Effort 及估算局限。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      artifact: "一张机会图、三种解决方式和第一版范围说明。",
      completion: "能解释被舍弃方案的理由，并指出最危险的假设。",
      limit: "RICE 估分是判断辅助；无用户证据时不制造精确排名。",
      source_policy: "经典产品/基础方法按质量保留，案例和工具界面按当前版本核对。"
    },
    {
      n: 4,
      title: "产品方案、交互与需求文档基础",
      question: "怎样把想法写成别人能理解和验收的方案？",
      units: [
        "画任务流程与低保真原型",
        "定义输入、输出、规则与状态",
        "写目标、范围、用户故事和验收条件",
        "观察真实用户完成原型任务"
      ],
      primary: {
        title: "Atlassian：PRD 写作",
        url: "https://www.atlassian.com/agile/product-management/requirements",
        reading_scope: "读目标、背景、假设、用户故事、交互、待决问题和范围。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "B 站｜PRD 产品设计文档怎么写？",
        url: "https://www.bilibili.com/video/BV1kv4y1A7rH",
        reading_scope: "看文档结构与写法，用当前项目只写必要章节。",
        date: "2022-05-21",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "4,311 赞 · 10,129 收藏（2026-10-29）"
      },
      artifact: "简版 PRD、流程图、原型和可用性问题记录。",
      completion: "别人可按文档完成一次验收，能走通失败、空白和取消路径。",
      limit: "工具操作按需补；不把文档长度或视觉精美作为通过标准。",
      source_policy: "经典产品/基础方法按质量保留，案例和工具界面按当前版本核对。"
    },
    {
      n: 5,
      title: "产品指标与商业基础",
      question: "我们怎样知道这个产品有价值？",
      units: [
        "区分计数、比例、均值、中位数及样本口径",
        "定义分子、分母、人群与观察周期",
        "连接用户价值、成功指标与保护指标",
        "用表格测算成本、节约时间和付费假设"
      ],
      primary: {
        title: "Amplitude：North Star Framework",
        url: "https://amplitude.com/books/north-star/about-north-star-framework",
        reading_scope: "只读 North Star 与输入指标的关系，先不展开完整增长系统。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "SQLBolt：交互式 SQL 入门",
        url: "https://sqlbolt.com/",
        reading_scope: "选读 SELECT、筛选、排序和聚合；先用表格理解同一口径。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      artifact: "一页指标词典、简单漏斗和价值/成本测算。",
      completion: "能重算指标，发现分母或统计窗口变化带来的误判。",
      limit: "北极星框架不覆盖统计学与财务全部基础，课程需另配中文小例题；本章不是完整商业课。",
      source_policy: "经典产品/基础方法按质量保留，案例和工具界面按当前版本核对。"
    },
    {
      n: 6,
      title: "AI、机器学习与大模型基础",
      question: "模型为什么会答错，技术词汇与产品有什么关系？",
      units: [
        "认识规则、传统 ML 与生成式 AI 的不同任务",
        "理解训练、推理、测试数据与泛化",
        "理解 Token、上下文、Embedding 与幻觉",
        "用文字、图像和语音任务建立能力边界的直觉"
      ],
      primary: {
        title: "微软：Generative AI for Beginners（简体中文）",
        url: "https://github.com/microsoft/generative-ai-for-beginners/blob/main/translations/zh-CN/README.md",
        reading_scope: "先读生成式 AI 介绍和模型比较的概念课，代码课以后再做。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "Google：Gemini API Models",
        url: "https://ai.google.dev/gemini-api/docs/models",
        reading_scope: "对照当前可用模型、能力与状态，不背静态榜单。",
        date: null,
        date_type: "持续更新官方文档",
        date_evidence: "页面未明确标注本次更新时间；2026-10-26 核验当前内容，不把核验日期当发布日期。",
        verified_on: "2026-10-26"
      },
      artifact: "概念关系图，以及同一任务在不同输入下的模型表现记录。",
      completion: "用自己的例子解释概念，指出不确定性如何影响体验和验收。",
      limit: "不要求从线性回归开始通读算法课程或推导公式；先理解模型能力与适用边界。",
      source_policy: "中文课程用于稳定基础概念；当代模型能力以当前官方模型文档核对。不得将旧课程里的型号、API 或价格当现行事实。"
    },
    {
      n: 7,
      title: "产品经理的最小工程基础",
      question: "一次模型请求怎样从界面到服务，再返回结果？",
      units: [
        "理解浏览器、服务、数据库和 API",
        "读懂 JSON 输入输出、HTTP 状态和鉴权",
        "观察日志，定位输入、网络或服务错误",
        "借助 AI 修改小原型与 SQL 查询"
      ],
      primary: {
        title: "MDN：How the web works",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
        reading_scope: "只读 How the web works，理解请求响应链路。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "Datawhale：Easy-Vibe",
        url: "https://github.com/datawhalechina/easy-vibe",
        reading_scope: "选 Stage 1 和附录中的 API、前后端、Git、环境变量等相关内容。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      artifact: "一个能提交输入、显示结果、处理报错的小原型；SQLBolt 另作查询练习。",
      completion: "能说明数据和密钥位于哪里，能解释一次失败请求。",
      limit: "先能调用和排错，再逐步读 Python；不展开完整全栈开发路线。",
      source_policy: "经典产品/基础方法按质量保留，案例和工具界面按当前版本核对。"
    },
    {
      n: 8,
      title: "模型与技术路线选择",
      question: "应该用规则、模型调用、RAG 还是 Agent？",
      units: [
        "先建立不用 AI 的效果与成本基线",
        "区分模型能力问题、知识问题和流程问题",
        "建立固定任务集比较质量、延迟、成本及数据约束",
        "记录选型理由与重新选择条件"
      ],
      primary: {
        title: "Anthropic：Choosing the right model",
        url: "https://platform.claude.com/docs/en/about-claude/models/choosing-a-model",
        reading_scope: "按任务、质量、延迟、成本选择模型；结论需在自己的测试集上核对。",
        date: null,
        date_type: "持续更新官方文档",
        date_evidence: "页面未明确标注本次更新时间；2026-10-26 核验当前内容，不把核验日期当发布日期。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "B 站｜AI 工作流与 Agent 有什么区别？",
        url: "https://www.bilibili.com/video/BV1Q5TN6XEri",
        reading_scope: "5 分钟建立两种方案的直观区别，再画自己的选型表。",
        date: "2026-06-28",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "749 赞 · 1,167 收藏（2026-10-29）"
      },
      artifact: "一份多方案对比和同一组任务的对照结果。",
      completion: "能解释简单方案为何足够，或复杂方案多出的收益来自哪里。",
      limit: "厂商榜单只作线索；比较实验从本章开始，评测不延后到第 14 章。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 9,
      title: "AI 需求定义与产品方案进阶",
      question: "怎样把用户任务转成 AI 可验证的行为要求？",
      units: [
        "确定 AI 承担的任务、人承担的判断及边界",
        "定义数据来源、输入输出与成功标准",
        "将“自然、准确、智能”拆成评分规则和正反例",
        "补齐拒答、澄清、人工接管和非 AI 降级"
      ],
      primary: {
        title: "Anthropic：Define success criteria and build evaluations",
        url: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
        reading_scope: "先选读可测量的成功标准；完整评测方法在模块 14 深化。",
        date: null,
        date_type: "持续更新官方文档",
        date_evidence: "页面未明确标注本次更新时间；2026-10-26 核验当前内容，不把核验日期当发布日期。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "Google Codelabs：Building Trusted AI Products",
        url: "https://codelabs.developers.google.com/codelabs/pair-guidebook",
        reading_scope: "重点读 Translate user needs to an AI problem、数据和用户信任的相关练习。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      artifact: "在模块 4 的 PRD 上补 AI 行为说明、评测样例及异常流程。",
      completion: "每个关键目标都有可观察的结果；能描述不能回答时的行为。",
      limit: "先练习把用户问题翻译成可验证的产品行为，不要求实现模型训练代码。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 10,
      title: "Prompt、上下文与结构化输出",
      question: "怎样让模型在明确约束下稳定完成一个任务？",
      units: [
        "编写清晰任务、边界、示例与输出要求",
        "比较提示词版本，记录成功与失败样例",
        "区分上下文选择、压缩和过期信息",
        "理解结构化输出的格式校验与语义校验"
      ],
      primary: {
        title: "Anthropic：Prompting best practices（当前文档）",
        url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
        reading_scope: "通用清晰指令、示例、输出约束先学，再按所用模型查看差异。",
        date: null,
        date_type: "持续更新官方文档",
        date_evidence: "页面未明确标注本次更新时间；2026-10-26 核验当前内容，不把核验日期当发布日期。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "Anthropic：The new rules of context engineering for Claude 5 generation models",
        url: "https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models",
        reading_scope: "选读模型能力变化后如何检查冗余上下文；不能将某产品的简化结果直接推广到所有任务。",
        date: "2026-07-24",
        date_type: "页面发布日期",
        date_evidence: "具体文章页标明日期，2026-10-26 重新打开核验。",
        verified_on: "2026-10-26"
      },
      artifact: "有版本记录的提示词、测试输入、结果及一次改进对照。",
      completion: "改进能在保留测试集上复现；JSON 合法与事实正确分别检查。",
      limit: "以所用模型的当前指南为准；旧教程中的模型能力和交互方式需要重新核对。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 11,
      title: "数据、知识库与 RAG",
      question: "模型找不到资料与找到后答错，分别怎么解决？",
      units: [
        "检查资料来源、质量、权限与更新",
        "理解解析、切分、Embedding、检索与重排",
        "分别测试检索命中与回答正确性",
        "设计引用、无答案处理与访问隔离"
      ],
      primary: {
        title: "Dify：How to Create Knowledge in Dify (For Beginner)",
        url: "https://dify.ai/blog/create-knowledge-in-dify-for-beginners",
        reading_scope: "先跑通建库与连接问答，再对照文档测试检索和生成。",
        date: "2026-06-23",
        date_type: "页面发布日期",
        date_evidence: "具体文章页标明日期，2026-10-26 重新打开核验。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "B 站｜RAG 工作机制详解",
        url: "https://www.bilibili.com/video/BV1JLN2z4EZQ",
        reading_scope: "17 分钟看检索、切分、召回与生成的完整链路；对照官方文档做一个知识库。",
        date: "2025-06-21",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "19,023 赞 · 26,811 收藏（2026-10-29）"
      },
      extra: [{
        title: "小红书｜AI 产品经理必看：RAG 全流程一下讲透",
        url: "https://www.xiaohongshu.com/explore/6a80bbd9000000002500c56d?xsec_source=pc_search&source=web_explore_feed",
        reading_scope: "用 5 张图建立分片、索引、召回、重排、生成的直观认识；具体实现与正确性仍以官方文档和自己的测试为准。",
        date: "08-16",
        date_type: "小红书页面仅显示月日，未明示年份",
        date_evidence: "2026-10-29 在已登录的小红书笔记页核验标题、正文、月日和互动数；年份未由页面明确给出。",
        verified_on: "2026-10-29",
        engagement: "241 赞 · 249 收藏（2026-10-29）"
      }],
      artifact: "一套小型知识问答、检索测试记录及错误分类。",
      completion: "能把找不到、找错、答错分开；用不同权限用户检查信息边界。",
      limit: "默认设置只适合入门，不能保证检索或回答正确；要用自己的数据验收。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 12,
      title: "工作流、Agent 与工具生态",
      question: "哪些步骤写死，哪些交给模型决定？",
      units: [
        "先画确定性流程，再判断自主决策需求",
        "理解工具调用、参数与执行结果",
        "定义状态、记忆、停止条件、预算和人工审批",
        "理解 MCP、Skill 与 Harness 各自所在层次"
      ],
      primary: {
        title: "Dify：How to Build Your First Agent",
        url: "https://dify.ai/blog/build-your-first-agent-in-dify",
        reading_scope: "从一个可检查结果的助手开始，关注工具、任务边界和失败处理。",
        date: "2026-08-27",
        date_type: "页面发布日期",
        date_evidence: "具体文章页标明日期，2026-10-26 重新打开核验。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "B 站｜一人公司如何用 Agent 工作流提效",
        url: "https://www.bilibili.com/video/BV1ngJH6yEKH",
        reading_scope: "用 11 分钟看一个工作流实例，标出工具调用、人工确认与失败处理。",
        date: "2026-06-15",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "3,161 赞 · 4,783 收藏（2026-10-29）"
      },
      artifact: "一个边界明确的任务助手，附工具权限、停止规则与失败恢复说明。",
      completion: "能从执行记录证明任务完成，而不是只看模型说“完成了”。",
      limit: "入门先选一种可验证的实现；不要同时追多套框架，也不要把旧工具教程当现行操作指南。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 13,
      title: "AI 产品的交互与信任",
      question: "用户怎样知道它能做什么、错了又能怎么办？",
      units: [
        "根据任务选择对话、表单或嵌入式辅助",
        "设计初次引导、等待、引用和失败反馈",
        "设置修改、撤销、确认与人工接管",
        "解释能力与数据使用，校准用户预期"
      ],
      primary: {
        title: "Dify：Why We Redesigned Dify’s Agent?",
        url: "https://dify.ai/blog/why-we-redesigned-dify-agent",
        reading_scope: "按产品案例分析构建过程、运行边界和工作流协作；结合 PAIR 原则设计自己的界面。",
        date: "2026-08-27",
        date_type: "页面发布日期",
        date_evidence: "具体文章页标明日期，2026-10-26 重新打开核验。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "Google PAIR：Feedback + Control",
        url: "https://pair.withgoogle.com/guidebook-v2/chapter/feedback-controls/",
        reading_scope: "读反馈粒度、反馈价值及控制/自动化平衡。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      artifact: "完整主流程和失败流程原型，附可用性观察。",
      completion: "用户能发现错误、纠正或退出，并理解关键操作的后果。",
      limit: "单个团队的案例只能说明其取舍，不能代替通用的交互方法；要回到自己的用户任务验证。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 14,
      title: "AI 评测与实验",
      question: "改动究竟提升了效果，还是只修好了几个例子？",
      units: [
        "把用户成功条件落实成测试集与评分规则",
        "覆盖典型、边缘、无答案和对抗场景",
        "校准人工评测与模型裁判，检查标注一致性",
        "分析错误根因、回归结果和上线门槛"
      ],
      primary: {
        title: "Google：Evaluating AI agents: moving past the vibe check",
        url: "https://developers.googleblog.com/evaluating-ai-agents-moving-past-the-vibe-check/",
        reading_scope: "先检查实际执行记录与失败模式，再逐步形成自动检查、回归和上线门槛。",
        date: "2026-10-15",
        date_type: "页面发布日期",
        date_evidence: "具体文章页标明日期，2026-10-26 重新打开核验。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "B 站｜AI Agent 大横评",
        url: "https://www.bilibili.com/video/BV1phaq6bEyQ",
        reading_scope: "看它如何设计比较维度；自己补上任务成功率、错误和成本，不照搬排名。",
        date: "2026-09-28",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "4,003 赞 · 5,514 收藏（2026-10-29）"
      },
      artifact: "评测集、评分说明、错误归因和发布判断。",
      completion: "能复现对照，解释测试集局限；不把模型裁判当绝对真值。",
      limit: "练习评测方法和术语即可；不照搬别人的项目日程作为个人学习时限。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 15,
      title: "安全、治理与可靠性",
      question: "系统被误导、越权或依赖失败时，怎样限制损失？",
      units: [
        "识别提示注入、数据泄露与过度权限",
        "划清数据、工具与用户授权边界",
        "设计确认、隔离、日志及人工兜底",
        "处理超时、重试、重复执行与降级"
      ],
      primary: {
        title: "OWASP GenAI LLM Top 10 2026",
        url: "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/",
        reading_scope: "按 2026 版阅读应用风险和缓解措施，不沿用 2025 编号。",
        date: "2026-08-03",
        date_type: "官方资源页日期",
        date_evidence: "资源页标记 August 3, 2026；另有 9 月发布公告，不混用两个日期。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "Anthropic：How we contain Claude across products",
        url: "https://www.anthropic.com/research/how-we-contain-claude",
        reading_scope: "选读环境边界、监督能力与外部资源信任；把工程案例转成产品权限与风险问题。",
        date: "2026-05-25",
        date_type: "页面发布日期",
        date_evidence: "具体文章页标明日期，2026-10-26 重新打开核验。",
        verified_on: "2026-10-26"
      },
      artifact: "风险表、权限矩阵及异常情形的检查记录。",
      completion: "每个关键风险有负责人、缓解措施和测试方法。",
      limit: "安全清单与供应商案例都不能代替特定行业和地区的合规判断；实际项目要查现行要求。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 16,
      title: "性能、成本与上线运营",
      question: "怎样在质量、等待时间和成本之间作取舍？",
      units: [
        "区分首字延迟、完整响应时间和任务成功率",
        "测算每次成功任务的模型、工具、重试及人工成本",
        "比较缓存、模型路由与缩小任务范围",
        "设计灰度、监测、回滚和反馈处理"
      ],
      primary: {
        title: "Anthropic：Reducing latency（当前文档）",
        url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency",
        reading_scope: "测量响应时间，比较模型、输入输出长度与流式响应。",
        date: null,
        date_type: "持续更新官方文档",
        date_evidence: "页面未明确标注本次更新时间；2026-10-26 核验当前内容，不把核验日期当发布日期。",
        verified_on: "2026-10-26"
      },
      secondary: {
        title: "B 站｜Token 是什么？AI 怎样计费？",
        url: "https://www.bilibili.com/video/BV1SxEV6qETL",
        reading_scope: "3 分钟弄清输入、输出 Token 与计费，再估算一次成功任务的成本。",
        date: "2026-06-09",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "2,194 赞 · 1,710 收藏（2026-10-29）"
      },
      artifact: "质量/延迟/成本对照表和发布监控计划。",
      completion: "能算成功任务成本并解释一种优化损害了什么。",
      limit: "不要求实现完整 SRE 平台；价格与缓存规则在实际实验时核对。",
      source_policy: "近期文章或当前官方文档为主，较早材料仅提供稳定原理。"
    },
    {
      n: 17,
      title: "数据分析、增长与商业化",
      question: "用户愿意持续用、持续付费吗？",
      units: [
        "定义激活与首次价值时刻",
        "分析漏斗、留存、用户群和失败任务",
        "比较按席位、用量或结果计费的假设",
        "将增长实验与单位经济性、用户体验联系起来"
      ],
      primary: {
        title: "Amplitude：North Star Framework",
        url: "https://amplitude.com/books/north-star/about-north-star-framework",
        reading_scope: "本轮深入输入指标、业务价值和产品增长关系，对照模块 5 的指标定义。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "Stripe：Usage-based billing",
        url: "https://docs.stripe.com/billing/subscriptions/usage-based",
        reading_scope: "了解按使用量计费及用量记录；仅学产品规则，接入选择跟随当前文档。",
        date: null,
        date_type: "持续更新官方文档；本轮未再次检查具体页面",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      artifact: "指标树、增长实验、定价假设和单次成功任务的收入/成本模型。",
      completion: "能解释留存或利润变化，并给出下一项验证，而不只报告调用次数。",
      limit: "工具文档不能证明用户愿意付费；需要实际需求和付费验证补证据。",
      source_policy: "增长方法可经典；AI 单位成本、可用计费方案在项目实际测算时查当前规则。"
    },
    {
      n: 18,
      title: "产品组织、沟通与持续决策",
      question: "如何让不同角色在约束下作出并执行决定？",
      units: [
        "明确负责推进、拍板、贡献意见与知情角色",
        "将技术约束转译成业务选项",
        "管理范围、依赖、优先级与预期变化",
        "记录决策依据、反证及重新评估条件"
      ],
      primary: {
        title: "Atlassian：DACI 决策框架",
        url: "https://www.atlassian.com/team-playbook/plays/daci",
        reading_scope: "读角色定义、决策背景、选项比较和结果共享。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "B 站｜产品经理 6 大沟通场景",
        url: "https://www.bilibili.com/video/BV1WY411K7Pp",
        reading_scope: "10 分钟看需求评审、协作和分歧处理；用一页决策记录练习对齐。",
        date: "2022-07-01",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "746 赞 · 1,301 收藏（2026-10-29）"
      },
      artifact: "一份有方案比较、取舍、负责人和后续检查点的决策记录。",
      completion: "另一位协作者能理解决定为何作出、何时需要重议。",
      limit: "框架用于明确责任，不代表所有团队必须采用同一审批结构。",
      source_policy: "经典产品/基础方法按质量保留，案例和工具界面按当前版本核对。"
    },
    {
      n: 19,
      title: "选择一个行业或产品形态深入",
      question: "在具体行业里，什么才是有价值的 AI 任务？",
      units: [
        "选能接触用户与数据的窄场景",
        "了解任务、采购/分发、行业约束和现有方案",
        "拆解同类产品的质量、成本与商业假设",
        "核对案例收益是否适用于自己场景"
      ],
      primary: {
        title: "GOV.UK：Discovery 阶段",
        url: "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works",
        reading_scope: "读问题重构、约束、用户流程与继续/停止判断。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "Anthropic：Customer stories",
        url: "https://claude.com/customers",
        reading_scope: "只选一个相关行业案例，再用用户访谈、产品试用和独立证据核查。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      artifact: "行业任务地图、竞品分析、数据约束和待验证机会。",
      completion: "能指出供应商案例缺少什么证据，并提出自己的验证。",
      limit: "案例入口是选题线索，非中立效果证明；现在不预先锁定行业。",
      source_policy: "行业分析方法可经典；正式选题后只取近半年产品案例并核对真实使用与业务证据。"
    },
    {
      n: 20,
      title: "端到端项目与个人作品集",
      question: "如何证明自己具备推进产品的能力？",
      units: [
        "串起问题证据、方案取舍和可运行原型",
        "保留评测、真实用户反馈与迭代",
        "明确个人贡献和协作边界",
        "区分计划、模拟数据和实际结果"
      ],
      primary: {
        title: "Datawhale：Easy-Vibe",
        url: "https://github.com/datawhalechina/easy-vibe",
        reading_scope: "按 Stage 1 完成一个问题到可演示原型的过程；是否深入部署由项目决定。",
        date: null,
        date_type: "基础方法或教材；原始发布日期本轮未重新确认",
        date_evidence: "保留适用的基础知识；不标为近期发布。具体内容与选读范围沿用 v0.4。",
        verified_on: null
      },
      secondary: {
        title: "B 站｜产品经理作品集需要哪三类文档？",
        url: "https://www.bilibili.com/video/BV1NZ4y1u7xn",
        reading_scope: "10 分钟看作品集结构，只保留你真实做过且可核对的证据。",
        date: "2020-07-05",
        date_type: "页面发布日期（B 站视频）",
        date_evidence: "B 站视频详情页标注发布日期；2026-10-29 核验点赞和收藏。互动数据会变化，不作为内容正确性的证明。",
        verified_on: "2026-10-29",
        engagement: "1,729 赞 · 2,596 收藏（2026-10-29）"
      },
      extra: [{
        title: "小红书｜0 经验如何通过 Vibe Coding 项目转行 AI 产品",
        url: "https://www.xiaohongshu.com/explore/6a118a420000000035029ca6?xsec_source=pc_search&source=web_explore_feed",
        reading_scope: "看作者怎样从找需求、商业化设想到做项目和讲述项目；作品集只采用自己真实完成的证据。",
        date: "07-27",
        date_type: "小红书页面显示编辑月日，未明示年份",
        date_evidence: "2026-10-29 在已登录的小红书笔记页核验标题、正文、编辑月日和互动数；页面声明含 AI 生成内容。",
        verified_on: "2026-10-29",
        engagement: "1,307 赞 · 1,582 收藏（2026-10-29）"
      }],
      artifact: "可体验原型、项目案例、评测报告和复盘。",
      completion: "读者可以核对你作过什么判断、依据什么、效果如何以及仍存什么问题。",
      limit: "作品集可以借鉴清晰的表达结构，但不能把某份模板当作 AI PM 能力标准；项目从前面阶段就开始。",
      source_policy: "作品表达可经典；API、部署与 AI 开发教程在实际练习前核对当前版本。"
    }
  ]
};
