---
name: tech-architecture
description: 网页群的技术架构设计、文件组织结构和部署方案
metadata:
  type: project
---

# 技术架构设计

## 文件组织结构（建议）
```
1945延安/
├── index.html                  # 总入口网页
├── assets/
│   ├── css/
│   │   ├── common.css          # 公共样式（红色革命主题）
│   │   ├── main.css            # 大网页样式
│   │   └── locations.css       # 子网页样式
│   ├── js/
│   │   ├── main.js             # 大网页逻辑（地图导航+答题系统）
│   │   ├── quiz.js             # 答题系统（题库+错题本）
│   │   └── location.js         # 子网页公共逻辑
│   ├── images/
│   │   ├── logo.png            # 队徽
│   │   ├── map/                # 地图相关图片
│   │   ├── locations/          # 各地点图片
│   │   └── characters/         # 人物图片
│   ├── videos/                 # 视频文件
│   └── audio/                  # 人物原声音频
├── locations/
│   ├── 01-zhengfeng/           # 整风运动
│   ├── 02-qida/                # 中共七大
│   ├── 03-yaodongdui/          # 窑洞对
│   ├── 04-kangda/              # 抗大
│   ├── 05-shengli/             # 抗战胜利集会
│   ├── 06-chongqing/           # 重庆谈判筹备
│   └── 07-xibei/               # 战后西北统战治理
├── quiz/                       # 答题系统页面
└── README.md
```

## 每个子网页的页面结构
```
封面页 → 视频页 → 人物卡片页 → 人物详情页（弹窗/新页）
```

## 技术选型
- **前端框架**：原生HTML/CSS/JS（无需构建工具，兼容性好）
- **视频播放**：HTML5 `<video>` 标签
- **音频播放**：HTML5 `<audio>` 标签 / Web Audio API
- **数据存储**：localStorage（错题本、答题记录）
- **地图导航**：CSS绝对定位 + SVG/Canvas 绘制地图路线

## 答题系统设计
- **题库**：每个地点5-10道选择题
- **答题模式**：顺序答题 / 随机抽题
- **错题本**：localStorage存储错题，可复习
- **评分**：答题完成后显示得分

## 部署方案
- **推荐**：GitHub Pages（免费、稳定、支持自定义域名）
- **备选**：Vercel / Netlify
- **NFC/二维码**：每个地点网页URL生成对应二维码

## 移动端适配
- viewport: width=device-width
- 字体使用rem/vw单位
- 触摸友好的按钮尺寸（至少44x44px）
- 图片懒加载
