/* 1945延安：地点、人物与素材的唯一内容源。 */
(() => {
  const icons = {
    'arrow-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/><path d="M21 12H9"/></svg>',
    'book-open': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4z"/><path d="M21 18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4z"/></svg>',
    'volume-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    'play': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>',
    'x': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    'clock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    'rotate-ccw': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    'check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    'map': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3z"/><path d="M9 3v15M15 6v15"/></svg>'
  };
  window.YananIcons = (name) => icons[name] || '';

  const root = '../../assets/';
  const portraits = {
    mao: { name: '毛泽东', years: '1893—1976', portrait: `${root}images/characters/maozedong.png`, portraitPosition: 'center top', portraitCredit: '项目既有素材，待补充原始来源', quote: '实事求是。', source: '《毛泽东选集》及本项目史料梳理' },
    liu: { name: '刘少奇', years: '1898—1969', portrait: `${root}images/characters/liushaoqi.jpg`, portraitPosition: 'center top', portraitCredit: '项目既有素材，待补充原始来源', quote: '共产党员的修养。', source: '《论共产党员的修养》' },
    chen: { name: '陈云', years: '1905—1995', portrait: `${root}images/characters/chen-yun-1938.jpg`, portraitPosition: 'center top', portraitCredit: '陈云在延安，1938；Wikimedia Commons，公共领域（中国）', quote: '不唯上、不唯书、只唯实。', source: '人物肖像：1938 年延安时期历史照片；语录待后续史料校核' },
    zhu: { name: '朱德', years: '1886—1976', portrait: `${root}images/characters/zhude.png`, portraitPosition: 'center top', portraitCredit: '项目既有素材，待补充原始来源', quote: '没有正确的政治方针，就不能有正确的军事方针。', source: '中共七大相关报告' },
    zhou: { name: '周恩来', years: '1898—1976', portrait: `${root}images/characters/zhouenlai.jpg`, portraitPosition: 'center top', portraitCredit: '项目既有素材，待补充原始来源', quote: '团结一切可以团结的力量。', source: '统一战线工作相关史料', audio: `${root}audio/zhou-enlai-1965.ogg`, audioKind: '历史录音（1965，非本事件原话）' },
    ren: { name: '任弼时', years: '1904—1950', portrait: `${root}images/characters/renbishi.jpg`, portraitPosition: 'center top', portraitCredit: '项目既有素材，待补充原始来源', quote: '在团结中前进。', source: '中共七大秘书处工作史料' },
    huang: { name: '黄炎培', years: '1878—1965', portrait: `${root}images/characters/huangyanpei.jpg`, portraitPosition: 'center top', portraitCredit: '项目既有素材，待补充原始来源', quote: '一部历史，没有能跳出这个周期率。', source: '《延安归来》' },
    lin: { name: '林彪', years: '1907—1971', portrait: `${root}images/characters/lin-biao-nra.jpg`, portraitPosition: 'center top', portraitCredit: '林彪军装照，1930 年代；Wikimedia Commons，公共领域（中国）', quote: '在实践中学习。', source: '人物肖像：1930 年代军装历史照片；引文仅作页面说明，不作为原声' },
    xu: { name: '徐向前', years: '1901—1990', portrait: `${root}images/characters/xu-xiangqian-1930s.jpg`, portraitPosition: 'center top', portraitCredit: '徐向前红军时期，1930—1937；Wikimedia Commons，公共领域（中国）', quote: '把学习同实际工作结合起来。', source: '人物肖像：红军时期历史照片；引文待后续史料校核' },
    wang: { name: '王若飞', years: '1896—1946', portrait: `${root}images/characters/wang-ruofei-1940.jpg`, portraitPosition: 'center top', portraitCredit: '王若飞，1940；Wikimedia Commons，公共领域（中国）', quote: '为了人民的和平。', source: '人物肖像：1940 年历史照片；引文待后续史料校核' },
    xi: { name: '习仲勋', years: '1913—2002', portrait: `${root}images/characters/xi-zhongxun-1946.jpg`, portraitPosition: 'center top', portraitCredit: '习仲勋，1946；Wikimedia Commons，公共领域（中国）', quote: '从群众中来，到群众中去。', source: '人物肖像：1946 年历史照片；引文待后续史料校核' },
    linbo: { name: '林伯渠', years: '1886—1960', portrait: `${root}images/characters/lin-boqu-1941.jpg`, portraitPosition: 'center top', portraitCredit: '林伯渠在延安，1941；吴印咸；Wikimedia Commons，公共领域（中国）', quote: '建设离不开人民。', source: '人物肖像：1941 年延安历史照片；引文待后续史料校核' }
  };

  const person = (key, extra) => ({ ...portraits[key], ...extra });
  window.YananData = {
    locations: [
      {
        id: 'zhengfeng', number: '01', page: '01-zhengfeng', title: '整风运动', shortTitle: '整风', venue: '杨家岭中央党校', date: '1941年5月—1945年春', month: '思想统一', accent: '#9a6b3c', accentSoft: '#e1c08f', map: { x: 56, y: 11, labelSide: 'left', landmarkLabel: '中央党校' },
        theme: '从学习与讨论里，寻找实事求是的共同尺度。', summary: '延安整风在1945年春完成历史性总结，为中共七大的召开准备了思想基础。',
        coverImage: `${root}images/locations/rectification-study.jpg`, coverCredit: '项目史料文档内嵌图片，原始授权待补录', coverPosition: 'center center', videoPoster: `${root}images/locations/yangjialing-caves.jpg`,
        videoCaption: '从学习文件到作风整顿，思想上的共同语言如何成为组织行动的前提。', videoSrc: `${root}videos/zhengfeng-history.mp4`, videoLabel: '整风运动历史影像',
        people: [
          person('mao', { role: '整风运动的重要领导者', eventSummary: '整风期间，他围绕学风、党风和文风提出重要论述，强调把马克思主义基本原理同中国革命具体实践结合起来。', significance: '“实事求是”由此成为理解延安整风的一把钥匙，也影响了此后党的思想建设。' }),
          person('liu', { role: '党的建设理论工作的重要参与者', eventSummary: '刘少奇关于党员修养的论述，成为整风学习的重要内容之一，回应了组织内部如何保持政治品格与工作方法的问题。', significance: '他的论述让党的建设从抽象原则落到党员的学习、检视与实践中。' }),
          person('chen', { role: '中央党校工作的重要参与者', eventSummary: '陈云重视调查研究与从实际出发的工作方法。页面暂保留其人物位置，肖像将在用户逐位确认后补入。', significance: '这一方法与整风倡导的实事求是精神形成呼应，成为理解学习与实践关系的线索。' })
        ]
      },
      {
        id: 'qida', number: '02', page: '02-qida', title: '中共七大', shortTitle: '中共七大', venue: '杨家岭中央大礼堂', date: '1945年4月—6月', month: '春夏之交', accent: '#c6413a', accentSoft: '#f4b2a9', map: { x: 57, y: 27, labelSide: 'left', landmarkLabel: '中央大礼堂' },
        theme: '一次大会，把经验、路线与对战后中国的判断放到同一张议程上。', summary: '中共七大在杨家岭召开，系统总结历史经验，制定夺取抗战胜利和建设新中国的政治路线。',
        coverImage: `${root}images/locations/yangjialing-auditorium.jpg`, coverCredit: 'wanghongliu，CC BY-SA 3.0，Wikimedia Commons', coverPosition: 'center center', videoPoster: `${root}images/locations/yanan-conference-1945.jpg`,
        videoCaption: '礼堂内的报告、讨论与选举，凝结为战后中国政治道路的重要节点。', videoSrc: `${root}videos/qida-history.h264.mp4`, videoLabel: '中共七大历史影像',
        people: [
          person('mao', { role: '作《论联合政府》政治报告', eventSummary: '毛泽东在大会上作《论联合政府》报告，提出建立民主联合政府的政治主张，并分析抗战胜利前后的形势。', significance: '报告把抗战最后阶段的任务和战后中国的政治主张连接起来，成为理解大会的重要文本。' }),
          person('zhu', { role: '作《论解放区战场》军事报告', eventSummary: '朱德在报告中总结了解放区战场的经验与贡献，说明军事斗争需要同正确的政治方针相互配合。', significance: '这一报告让大会的政治议程同战场经验发生了直接联系。' }),
          person('liu', { role: '作关于修改党章的报告', eventSummary: '刘少奇就修改党章作报告，系统阐述党的建设问题，推动大会把毛泽东思想写入党章。', significance: '党章修改将思想建设、组织原则与大会形成的政治共识固定下来。' }),
          person('zhou', { role: '统一战线工作的重要领导者', eventSummary: '周恩来参与大会的重要工作，并围绕统一战线的经验与政策原则进行阐述，回应广泛团结力量的需要。', significance: '统一战线视角使大会的路线不仅面向党内，也面向战后更广阔的政治协商空间。' }),
          person('ren', { role: '大会秘书长', eventSummary: '任弼时主持大会秘书处工作，承担会议组织、文件讨论和代表沟通等事务，使长时间的大会议程能够有序推进。', significance: '看见秘书处工作，才能理解一场重要政治会议如何被具体地组织和执行。' })
        ]
      },
      {
        id: 'yaodongdui', number: '03', page: '03-yaodongdui', title: '窑洞对', shortTitle: '窑洞对', venue: '杨家岭毛泽东旧居', date: '1945年7月', month: '七月', accent: '#c4935c', accentSoft: '#f0d4ad', map: { x: 73, y: 18, labelSide: 'top', landmarkLabel: '毛泽东旧居' },
        theme: '一孔窑洞里的问答，追问政权如何跳出历史周期率。', summary: '黄炎培访问延安，在杨家岭窑洞中提出“历史周期率”之问，毛泽东以“民主”作答。',
        coverImage: `${root}images/locations/yangjialing-caves-commons.jpg`, coverCredit: 'wanghongliu，CC BY-SA 3.0，杨家岭毛泽东旧居', coverPosition: 'center center', videoPoster: `${root}images/locations/rectification-study.jpg`,
        videoCaption: '一问一答的分量，在于它把国家前途与人民监督放在同一张历史桌面上。', videoSrc: `${root}videos/yaodongdui-history.h264.mp4`, videoLabel: '窑洞对历史影像',
        people: [
          person('mao', { role: '窑洞对的答者', eventSummary: '1945年7月，毛泽东在杨家岭接待黄炎培一行。面对历史兴亡的追问，他提出让人民监督政府的“新路”。', significance: '“民主”在这里不是抽象口号，而被置于如何避免脱离人民、避免历史循环的具体问题中。' }),
          person('huang', { role: '提出历史周期率问题的民主人士', eventSummary: '黄炎培以历代政权兴亡为背景提出问题，试图追问一个政权如何避免“其兴也勃焉，其亡也忽焉”。', significance: '他的提问使这场谈话有了开放的公共讨论性质，也留下了“窑洞对”的历史记忆。' })
        ]
      },
      {
        id: 'kangda', number: '04', title: '抗大', shortTitle: '抗大', venue: '抗日军政大学旧址', date: '1945年', month: '全年办学', accent: '#5d7a4a', accentSoft: '#c0d79f', map: { x: 43, y: 45, labelSide: 'left', landmarkLabel: '抗大旧址' },
        theme: '在窑洞课堂、训练场与行军路之间，培养走向战场与基层的干部。', summary: '1945年的抗大持续承担干部培养任务，也面向战后局势调整办学与人才输送方向。',
        coverImage: `${root}images/locations/kangda-old-site.jpg`, coverCredit: 'H2v5o68z，CC0 1.0，Wikimedia Commons', coverPosition: 'center center', videoPoster: `${root}images/locations/rectification-study.jpg`,
        videoCaption: '“团结、紧张、严肃、活泼”八个字，浓缩了这所军政学校的学习与行动气质。', videoSrc: `${root}videos/kangda-history.mp4`, videoLabel: '抗日军政大学历史影像',
        people: [
          person('lin', { role: '抗大校长', eventSummary: '林彪曾任抗大校长，学校在艰苦环境中探索理论学习、军事训练和生产劳动相结合的办学路径。', significance: '抗大的价值不仅是课堂教育，更在于把学习、纪律与实际工作连接为一套培养机制。' }),
          person('mao', { role: '抗大教育委员会主席', eventSummary: '毛泽东为抗大题写“团结、紧张、严肃、活泼”校训，强调革命队伍既要有纪律担当，也要保持集体生机。', significance: '八字校训成为理解抗大教育理念的简洁入口。' }),
          person('xu', { role: '抗大领导工作参与者', eventSummary: '徐向前参与抗大领导工作。页面保留其人物位置，肖像将在用户逐位确认后补入。', significance: '抗大培养的大批干部后来走向抗日战场、解放区建设与战后接管工作。' })
        ]
      },
      {
        id: 'shengli', number: '05', title: '抗战胜利集会', shortTitle: '胜利集会', venue: '革命纪念馆', date: '1945年8月', month: '胜利时刻', accent: '#cfa346', accentSoft: '#f7df9b', map: { x: 66, y: 70, labelSide: 'right', landmarkLabel: '革命纪念馆' },
        theme: '十四年抗战迎来胜利，但庆祝之后，新的问题也已经到来。', summary: '日本宣布投降后，延安举行群众集会，庆祝来之不易的抗战胜利。',
        coverImage: `${root}images/locations/victory-rally-1945.jpg`, coverCredit: '项目史料文档内嵌图片，原始授权待补录', coverPosition: 'center center', videoPoster: `${root}images/locations/yanan-conference-1945.jpg`,
        videoCaption: '消息传来后，城市与乡村的欢庆汇成一场关于胜利、牺牲与新期待的公共记忆。', videoSrc: `${root}videos/shengli-history.mp4`, videoLabel: '抗战胜利集会历史影像',
        people: [
          person('zhu', { role: '八路军总司令', eventSummary: '朱德长期领导人民军队的抗日斗争。胜利之际的延安庆祝，凝结着前线与后方共同付出的代价。', significance: '从总司令到广场上的群众，胜利叙事把战争中的不同位置连接在一起。' }),
          person('mao', { role: '中共中央主席', eventSummary: '抗战胜利前后，毛泽东发表有关时局的重要论述，提醒全党在庆祝中继续面对复杂的国内形势。', significance: '这使“胜利”不只是一个结束，也成为理解战后选择的转折点。' })
        ]
      },
      {
        id: 'chongqing', number: '06', title: '重庆谈判筹备', shortTitle: '重庆谈判', venue: '枣园领导人旧居', date: '1945年8月—10月', month: '胜利之后', accent: '#526d9e', accentSoft: '#c2d6f4', map: { x: 20, y: 32, labelSide: 'right', landmarkLabel: '枣园旧居' },
        theme: '从枣园的研判到延安机场的挥手，为和平争取一个可能。', summary: '面对战后中国的走向，中共中央在延安研判形势、制定方针，并作出赴重庆谈判的重大决策。',
        coverImage: `${root}images/locations/mao-leaving-yanan-1945.jpg`, coverCredit: '公共领域，Wikimedia Commons', coverPosition: 'center center', videoPoster: `${root}images/locations/zaoyuan-site.jpg`,
        videoCaption: '从枣园的研判到赴重庆的出发，这一程既是谈判，也是对和平前途的争取。', videoSrc: `${root}videos/chongqing-history.mp4`, videoLabel: '重庆谈判筹备历史影像',
        people: [
          person('mao', { role: '中共代表团成员', eventSummary: '1945年8月，毛泽东赴重庆谈判。在局势严峻复杂的环境中，这一决定体现了争取和平、揭露内战阴谋的政治担当。', significance: '离开延安的那一刻，成为理解战后中国政治选择的一张重要历史影像。' }),
          person('zhou', { role: '中共代表团成员', eventSummary: '周恩来参与谈判筹备与实际工作，并在多方政治力量之间展开沟通，为争取和平民主作出持续努力。', significance: '筹备工作并非一个瞬间的决定，而是建立在长期判断、协商与组织支持之上。' }),
          person('wang', { role: '中共代表团成员', eventSummary: '王若飞与毛泽东、周恩来共同参加重庆谈判。页面保留其人物位置，肖像将在用户逐位确认后补入。', significance: '三人代表团使这次行程成为一个能够被看见的集体政治行动。' })
        ]
      },
      {
        id: 'xibei', number: '07', title: '战后西北统战治理', shortTitle: '西北治理', venue: '花石砭中共中央西北局旧址', date: '1945年10月起', month: '战后建设', accent: '#d58146', accentSoft: '#f4c99f', map: { x: 45, y: 87, labelSide: 'right', landmarkLabel: '西北局旧址' },
        theme: '战争结束后，恢复生产、团结各方与安定社会成为新的日常课题。', summary: '抗战胜利后，西北局围绕边区恢复、统一战线与社会治理展开新的工作。',
        coverImage: `${root}images/locations/xibei-bureau-site.jpg`, coverCredit: 'Liuxingy，CC BY-SA 4.0，中共中央西北局旧址', coverPosition: 'center center', videoPoster: `${root}images/locations/xibei-bureau-site.jpg`,
        videoCaption: '战后治理的第一步，是让生产恢复、社会安定，并把不同群体团结到新的建设任务中。', videoSrc: `${root}videos/xibei-history.mp4`, videoLabel: '战后西北统战治理历史影像',
        people: [
          person('xi', { role: '中共中央西北局书记', eventSummary: '习仲勋主持西北局工作，参与战后边区的经济恢复、统一战线和社会治理等任务。', significance: '这段工作让“胜利之后怎么办”从政治判断落到基层治理、生产与团结的具体事务中。' }),
          person('linbo', { role: '陕甘宁边区政府主席', eventSummary: '林伯渠长期参与陕甘宁边区政权建设。战后过渡时期，边区治理经验成为恢复生产、组织社会的重要基础。', significance: '理解战后西北，不能只看宏大决策，也要看公共事务如何在地方被重新组织。' })
        ]
      }
    ]
  };
})();
