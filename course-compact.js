/* 8 个大模块；原 20 个主题保留为标签，80 个学习单元原样保留。 */
(function () {
  "use strict";
  var course = window.COURSE;
  var original = course.modules.slice();
  var groups = [
    {
      from: [1, 2, 3], title: "产品问题与机会", question: "我们究竟在为谁解决什么问题，值不值得做？",
      tags: ["产品入门", "用户研究", "需求判断"],
      artifact: "写一页问题定义：目标用户、真实任务、证据、替代方案和机会排序。",
      completion: "能用用户证据解释问题，并说清优先级背后的取舍。",
      limit: "先找真实问题，不把框架填满当成完成。"
    },
    {
      from: [4, 5], title: "产品方案与商业基础", question: "怎样把问题写成可交付、可衡量的方案？",
      tags: ["PRD", "指标与商业"],
      artifact: "完成一页产品方案，写清关键流程、指标和商业假设。",
      completion: "设计、工程和业务伙伴能据此讨论范围与验证方式。",
      limit: "文档精美度不是目标；先让关键决定可以被讨论。"
    },
    {
      from: [6, 7, 8], title: "AI 与工程判断", question: "模型能做什么，怎样选择并接入产品？",
      tags: ["大模型基础", "工程基础", "模型选型"],
      artifact: "画出一次 AI 请求的链路，比较两种可行方案的能力、成本和风险。",
      completion: "能与工程师讨论输入输出、限制、选型和最小实验。",
      limit: "以当前模型文档核对能力和价格；不要求训练模型。"
    },
    {
      from: [9, 10, 11], title: "AI 方案与知识", question: "怎样把用户任务变成可验证的 AI 行为与知识流程？",
      tags: ["AI 需求", "Prompt", "RAG"],
      artifact: "写一份 AI 行为说明，配提示词、知识来源和失败样例。",
      completion: "关键行为能被观察和评测，知识来源与人工边界清楚。",
      limit: "先验证最小场景；不要因为能接知识库就默认需要 RAG。"
    },
    {
      from: [12, 13], title: "工作流、Agent 与交互", question: "什么时候需要 Agent，用户怎样保持控制？",
      tags: ["Agent", "AI 交互"],
      artifact: "画出任务流，标出工具调用、确认、失败和人工接管节点。",
      completion: "能说明为什么采用工作流或 Agent，以及用户如何理解和纠正结果。",
      limit: "先用确定性流程解决问题，再判断是否需要自主规划。"
    },
    {
      from: [14, 15, 16], title: "评测、安全与上线", question: "怎样证明 AI 产品可用、安全且值得上线？",
      tags: ["评测", "安全治理", "性能成本"],
      artifact: "做一个小型评测集与上线检查表，记录质量、风险、延迟和成本。",
      completion: "能用测试结果解释上线决定，并说明出错时怎样监控和回退。",
      limit: "通用安全清单不能代替具体行业和地区的现行要求。"
    },
    {
      from: [17, 18], title: "增长与团队协作", question: "上线以后怎样持续改善产品、推动团队决策？",
      tags: ["增长", "产品协作"],
      artifact: "写一份上线后的指标观察与下一轮决策记录。",
      completion: "能区分使用量、价值和单位经济，并推动下一步行动。",
      limit: "工具报表不能自动证明用户价值，结论要回到真实使用。"
    },
    {
      from: [19, 20], title: "行业项目与作品集", question: "怎样独立推进一个能被检验的应用型 AI 产品？",
      tags: ["行业分析", "作品集"],
      artifact: "完成一个端到端项目，把问题、方案、实验、结果与反思整理成作品。",
      completion: "别人能看出你做过哪些决定、依据是什么、结果如何。",
      limit: "不虚构用户、指标或上线结果；项目方向可以在学习中确定。"
    }
  ];

  course.version = "0.6";
  course.originalModuleTitles = original.map(function (m) { return m.title; });
  course.oldToNew = {};
  course.oldTagById = {};
  course.modules = groups.map(function (g, i) {
    g.from.forEach(function (n, j) {
      course.oldToNew[n] = i + 1;
      course.oldTagById[n] = g.tags[j];
    });
    return {
      n: i + 1,
      title: g.title,
      question: g.question,
      tags: g.tags,
      units: g.from.reduce(function (all, n) { return all.concat(original[n - 1].units); }, []),
      artifact: g.artifact,
      completion: g.completion,
      limit: g.limit,
      source_policy: "先收集与你当前任务有关的资料；AI 能力和工具操作以当前版本为准。"
    };
  });
  course.tags = groups.reduce(function (all, g) { return all.concat(g.tags); }, []);
  [
    [1, 2], [3, 3], [4, 5], [6, 6], [7, 7], [8, 8]
  ].forEach(function (range, i) { course.stages[i].range = range; });
  course.stages[0].blurb = "从用户问题到产品方案：先把判断说清楚。";
  course.stages[1].blurb = "理解模型能力和工程链路，把技术词汇翻成产品取舍。";
  course.stages[2].blurb = "设计可验证的 AI 行为、知识流程和用户控制。";
  course.stages[3].blurb = "用评测、安全与成本证据决定能否上线。";
  course.stages[4].blurb = "让产品持续被使用，也让团队决定能被执行。";
  course.stages[5].blurb = "做一个真实项目，把判断与结果整理成作品。";
})();
