# 1945延安 · 沙盘互动网页群

> 以1945年延安为主题的创新创业项目——通过手机NFC/二维码扫描沙盘点位，进入沉浸式历史网页。

## 项目结构

```
1945延安/
├── index.html                     # 总入口（待开发）
├── assets/
│   ├── css/common.css             # 公共样式系统（暗红主题）
│   ├── js/
│   │   ├── location.js            # 子网页公共JS（弹窗/音频/滚动）
│   │   ├── main.js                # 大网页逻辑（待开发）
│   │   └── quiz.js                # 答题系统（待开发）
│   ├── images/
│   │   ├── logo.png               # 队徽
│   │   ├── locations/             # 各地点图片
│   │   └── characters/            # 人物头像
│   ├── videos/                    # 视频文件
│   └── audio/                     # 人物原声音频
├── locations/
│   ├── 01-zhengfeng/              # 整风运动
│   ├── 02-qida/                   # 中共七大
│   ├── 03-yaodongdui/             # 窑洞对 ✅ 已完成
│   ├── 04-kangda/                 # 抗大
│   ├── 05-shengli/                # 抗战胜利集会
│   ├── 06-chongqing/              # 重庆谈判筹备
│   └── 07-xibei/                  # 战后西北统战治理
├── quiz/                          # 答题系统（待开发）
├── memory/                        # 项目记忆文档
└── .design-context.md             # 设计上下文
```

## 技术栈
- 纯 HTML/CSS/JS（无需构建工具）
- 移动端优先（375px基准）
- 深色暗红主题 · "窑洞灯火"设计语言
- 支持 GitHub Pages 部署

## 开发进度
- [x] 设计系统确立
- [x] 公共CSS/JS框架
- [x] 模板页面：窑洞对
- [ ] 其余6个地点页面
- [ ] 大网页（地图导航）
- [ ] 答题系统
- [ ] 总入口页面

## 快速预览
用浏览器打开 `locations/03-yaodongdui/index.html` 查看效果。
