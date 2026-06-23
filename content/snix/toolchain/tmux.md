---
title: Tmux
date: 2026-04-21
author: ljf12825
type: file
summary: usage of tmux
---

tmux(Terminal Multiplexer)是一个终端复用器，允许在单个终端窗口中同时访问多个终端会话，并在它们之前切换

## 基本概念
- 会话(Session)：包含多个窗口的容器，负责“工作上下文”
- 窗口(Window)：占据整个屏幕的区域，包含多个窗格，负责“任务分组”
- 窗格(Pane)：窗口中的分割区域，负责“并行执行单元”

### Session（会话）
#### 定义
Session是tmux中最高级的运行实体，它代表一组长期存在的终端工作状态
- session由tmux server 管理
- session不依附于某个终端窗口
- 可以被attach/detach 
- SSH断开 != session 消失

#### 本质
Session = 一个完整的工作现场\
它定义的是：
- 你在干什么事
- 有哪些窗口
- 每个窗口里有哪些pane 
- 所有进程是否继续跑

> tmux中的Session就像是操作系统中的一个登录用户

#### 典型用法
- `session dev`：长期开发环境
- `session build`：重编译/实验
- `session remote`：某台服务器

> 一个session = 一个“主题明确的长期任务”

### Window（窗口）
#### 定义
Window是session 内的一级容器，表示一组相关任务
- 每个window全屏占据terminal 
- window之间互相隔离
- window下包含若干pane 

#### 本质
Window = 任务分类

不是并行，不是并发，是逻辑分组

> window就像浏览器中的一个Tab 

#### 使用方式
不要把window当“分屏”

window是“切换思维焦点”的单位

- window0：编辑代码
- window1：编译/运行
- window2：文档/笔记 

### Pane（面板）
#### 定义
Pane是window内的最小执行单元
- 一个pane对应一个shell/进程组
- pane可以横向/纵向切分
- pane是并行存在的

#### 本质
Pane = 同时盯着的几个东西

> Pane就像操作系统的一个终端实例 

pane是并行观察与控制

#### 使用原则
pane不能多，2-3个是上限，超过就是认知噪音

### tmux解决的问题
不使用tmux时
- 一个终端 = 一个会话
- SSH断了 = 全部进程死
- 一个屏幕只能干一件事
- 开几个终端窗口 -> 上下文碎裂

使用tmux后
```text 
[ tmux server ]
   ├─ session A
   │    ├─ window 1
   │    │    ├─ pane
   │    │    └─ pane
   │    └─ window 2
   └─ session B
```
断线不死/窗口管理/pane切分/工作区隔离
- pane不能跨window
- window不能跨session 
- session可以attach多个终端

### Session, Window, Pane的正确使用方式
tmux的三层结构不是随意的技术设计，而是精心设计的认知管理工具
```text 
认知层次：
┌─────────────────────────────┐
│   Session：我在做什么事      │  ← 战略层
├─────────────────────────────┤
│   Window：我的注意力焦点在哪 │  ← 战术层  
├─────────────────────────────┤
│   Pane：我需要同时看到什么   │  ← 操作层
└─────────────────────────────┘
```
#### Session：战略层面的工作容器
##### 核心职责
定义工作上下文和工作模式，Session回答的问题是”我当前的主任务是什么“

##### 正确理解
1. 不是终端标签，而是项目/环境容器
2. 不是临时工作区，而是长期存在的上下文
3. 不是按技术划分，而是按目标划分

##### 正确使用方式
应该按这样创建Session 
```bash 
# 按项目划分
tmux new -s project-alpha # Alpha项目
tmux new -s project-beta # Beta项目

# 按环境划分
tmux new -s production # 生产环境操作
tmux new -s staging # 预发布环境
tmux new -s local-dev # 本地开发

# 按角色/任务划分
tmux new -s code-review # 代码审查专用
tmux new -s incident-202401 # 故障处理会话
tmux new -s learning-go # Go语言学习
```

##### 错误使用方式
```bash 
# 错误：按技术栈划分（这应该是Window的职责）
tmux new -s docker # 这是技术，不是目标
tmux new -s python # 这是工具，不是项目

# 错误：按时间划分
tmux new -s morning-work # 时间不是工作上下文
```

##### Session生命周期管理
```text 
典型的Session生命周期：创建 -> 长期使用 -> 可能暂停（detach）-> 继续 -> 完成 -> 归档/删除
```
黄金法则：一个Session应该存在数天到数周，甚至数月

#### Window（窗口）：战术层面的注意力管理器
##### 核心职责
管理当前注意力的焦点，Window回答的问题是：我现在要关注什么任务

##### 正确理解
1. 不是并行执行工具（这是Pane的职责）
2. 不是持久化存储（Session才是持久的）
3. 是当前工作焦点的容器

##### 正确使用方式
应该这样使用Window
```text 
在一个"web-dev" Session中：
├── window-1：前端开发（注意力：React组件）
│   ├── pane1：代码编辑器
│   └── pane2：浏览器预览
├── window-2：后端API开发（注意力：REST API）
│   ├── pane1：Go代码
│   └── pane2：API测试
├── window-3：数据库工作（注意力：数据模型）
│   ├── pane1：psql
│   └── pane2：数据迁移脚本
└── window-4：部署监控（注意力：系统状态）
    ├── pane1：日志跟踪
    └── pane2：性能监控
```
##### Window的命名反映注意力焦点
```bash 
# 好的命名（反映当前任务）
1:editor # 清晰表明这是编辑器窗口
2:test-run # 测试运行窗口
3:db-console # 数据库控制台
4:logs-tail # 日志跟踪窗口

# 更好的命名（使用emoji直观表达）
1:📝-editor
2:⚡-test
3:🗄️-db
4:📊-monitor
```

##### 错误使用方式
不要这样使用Window
```bash 
# 错误：用作文件管理器
# （一个Window里开10个pane，每个pane一个目录）

# 错误：作为命令历史记录
# （每执行一个长期命令就开新Window）

# 错误：按服务划分（如果它们需要同时查看）
# window1：nginx日志
# window2：应用日志  
# window3：数据库日志
# （这些应该在一个Window的多个Pane中同时查看！）
```

##### Window切换的心理模型
```text 
开发者思维：
“我现在要写代码” -> 切换到 coding window 
“我需要测试一下” -> 切换到 testing window 
“查看部署状态” -> 切换到 deploy window 
“处理用户反馈” -> 切换到 feedback window
```
黄金法则：当你的思维上下文需切换时，切换Window 

#### Pane（窗格）：操作层面的并行视图
##### 核心职责
提供同时观察和操作的能力，Pane回答的问题是：为了完成当前任务，我需要同时看到什么“

##### 正确理解
1. 不是多任务并行执行（虽然可以，但这不是主要目的）
2. 不是长期运行进程的存放处（进程在Pane中运行，但Pane不是为存放而设计的）
3. 是相关视图的并排放置

##### 认知心理学基础：7±2法则
人类的短期记忆只能处理5-9个信息块，因此：\
黄金法则：一个Window中的Pane数量不应超过4个，理想是2-3个

##### 正确使用方式
应该这样使用Pane
```text 
Window "前端开发" 中的Pane布局：
┌────────────────┬────────────────┐
│                │                │
│  代码编辑器    │  浏览器实时预览 │
│  (vim/vscode)  │  (localhost:3000)│
│                │                │
├────────────────┼────────────────┤
│                │                │
│  终端测试      │  API Mock服务   │
│  (npm test)    │  (json-server)  │
│                │                │
└────────────────┴────────────────┘

每个Pane都与中心任务相关，可以同时观察交互结果。
```

##### 优秀的Pane组合模式
1. 编辑器 + 预览模式（最常见）
```text 
┌──────────────┬──────────────┐
│   编辑       │    预览       │
│   vim        │   browser    │
└──────────────┴──────────────┘
```

2. 代码 + 测试输出（TDD工作流）
```text 
┌──────────────┬──────────────┐
│   写测试      │  运行测试     │
│   test.js    │   jest       │
└──────────────┴──────────────┘
```

3. 主程序 + 日志监控（服务器开发）
```text 
┌──────────────┬──────────────┐
│   运行服务    │  查看日志     │
│   server.go  │   tail -f    │
└──────────────┴──────────────┘
```

4. 三窗格全能模式（全栈开发）
```text 
┌──────┬──────┬──────┐
│ 前端 │ 后端 │ 数据 │
│React │ API  │  DB  │
└──────┴──────┴──────┘
```

##### 错误的使用方式
```bash 
# 错误：创建不相关的pane
# pane1: 项目A的代码编辑
# pane2: 项目B的日志查看
# pane3: 个人笔记记录
# （这些应该在不同的Window甚至不同的Session中！）

# 错误：pane数量过多（认知超载）
# 超过4个pane，你已经开始记不清哪个是哪个了

# 错误：将pane作为"后台进程存储"
# 只是为了让进程不退出而开个pane，应该用nohup或systemd
```

#### 决策流程图：何时使用Session/Window/Pane 
```text 
开始新任务
    ↓
问：这是一个全新的项目/环境吗？
    ├── 是 → 创建新的 Session
    └── 否 → 使用现有 Session
            ↓
问：我需要切换注意力焦点吗？
    ├── 是 → 在Session中创建/切换到新的 Window
    └── 否 → 保持在当前 Window
            ↓
问：我需要同时观察多个相关事物吗？
    ├── 是 → 在当前Window中创建新的 Pane
    └── 否 → 保持单Pane或关闭不需要的Pane
```

## 基本使用

### tmux的“前缀键”模型
tmux所有命令都要先按前缀键\
默认前缀
```text 
Ctrl + b 
```
> Prefix + command 

### 启动和退出
```bash 
# 启动新会话
tmux 

# 启动新会话并命名
tmux new -s session_name

# 退出会话
exit 或 Ctrl+d 

# 分离会话（保持后台运行）
Ctrl+b d 
```

### 单元管理 
#### Pane（窗格）

| 操作 | 按键 |
| - | - |
| 横向分屏 | `Ctrl+b %` |
| 纵向分屏 | `Ctrl+b "` |
| 在pane间移动 | `Ctrl+b ^v<>` |
| 显示窗格编号，然后输入编号切换 | `Ctrl+b q` |
| 调整窗格大小，逐步调整 | `Ctrl+b Alt+^v<>` |
| 调整窗格大小，快速调整 | `Ctrl+b Ctrl+^v<>` |
| 关闭当前窗格 | `Ctrl+b x` | 
| 全屏/恢复窗格 | `Ctrl+b z` |
| 重新排列窗格布局，循环切换布局 | `Ctrl+b Space` |
| 将当前pane转换为独立窗口 | `prefix + !` |

#### Window（标签页）
| 操作 | 按键 |
| - | - |
| 新建窗口 | `Ctrl+b c` |
| 下一个窗口 | `Ctrl+b n` |
| 上一个窗口 | `Ctrl+b p` |
| 切换到上次使用的窗口 | `Ctrl+b l` |
| 切换到指定编号窗口 | `Ctrl+b 0~9` |
| 重命名窗口 | `Ctrl+b ,` | 
| 关闭当前窗口 | `Ctrl+b &` |

#### Session（工作区）

| 操作 | 命令 |
| - | - |
| 新session | `tmux new -s name` |
| 查看session  | `tmux ls` |
| 进入session | `tmux attach -t name` |
| 退出session，但不结束(detach) | `Ctrl+b d` |
| 杀session  | `tmux kill-session -t name` |
| 重新链接到session  | `tmux attach -t session_name` |
| 重命名当前session | `Ctrl+b $` |


### 常用快捷键
所有操作都以`Ctrl+b`为前缀

#### 基础快捷键

| command | description |
| - | - |
| `?` | 显示所有快捷键帮助 |
| `:` | 进入命令行模式 |
| `[` | 进入复制模式（用方向键移动，q退出）|
| `]` | 粘贴 |
| `=` | 选择要粘贴的缓冲区 |

#### session管理快捷键

| command | description |
| - | - |
| `s` | 列出所有会话并切换 |
| `$` | 重命名当前会话 |
| `(` | 切换到上一个会话 |
| `)` | 切换到下一个会话 |

#### window管理快捷键

| command | description |
| - | - |
| `c` | 创建新窗口 |
| `,` | 重命名当前窗口 |
| `w` | 列出所有窗口 |
| `&` | 关闭当前窗口 |
| `f` | 查找窗口 |
| `.` | 移动窗口（输入新编号）|

#### pane管理快捷键 

| command | description |
| - | - |
| `!` | 将当前窗格拆分为新窗口 |
| `o` | 切换到下一个窗格 |
| `;` | 切换到上一个使用的窗格 |
| `{` | 与上一个窗格交换位置 |
| `}` | 与下一个窗格交换位置 |
| `t` | 显示时钟 |
| `q` | 显示pane编号 |

## 配置文件
配置文件位置：`~/.tmux.conf`，是tmux的核心，它决定了tmux的外观、行为和快捷键

### 配置文件位置与结构
#### 主要配置文件
```bash 
# 用户级配置文件（优先级最高）
~/.tmux.conf 

# 系统级配置文件
/etc/tmux.conf 

# 命令行加载指定配置
tmux -f /path/to/config.conf 
```

#### 配置文件语法
```bash 
# 注释以#开头
# 基础格式：命令 参数
set-option -g option value 
bind-key key command 

# 分号分隔多个命令
bind r source-file ~/.tmux.conf \; display "加载完成"
```

### 配置分类详解
#### 前缀键设置
```bash 
# 设置前缀键为Ctrl+a 
set-option -g prefix C-a 

# 取消默认前缀键绑定
unbind-key C-b 

# 允许按两次前缀键发送到应用
bind-key C-a send-prefix 

# 设置第二前缀键（可选）
set-option -g prefix2 C-b 
```

#### 响应时间设置
```bash 
# 减少前缀键响应延迟（单位：ms）
set-option -sg escape-time 10 # 推荐10-50ms 

# 设置命令提示延迟
set-option -g display-time 1500 # 状态消息显示时间
```

#### 编号系统
```bash 
# 窗口和窗格从1开始编号（更符合直觉）
set -g base-index 1 # 窗口编号
set -g pane-base-index 1 # 窗格编号

# 重新编号窗口（关闭后保持连续）
set -g renumber-window on 

# 设置历史行数
set -g history-limit 5000 # 默认2000行 
```

#### 完整鼠标配置
```bash 
# 启用鼠标支持（现代tmux）
set -g mouse on 

# 详细鼠标配置（旧版本兼容）
set -g mouse-utf8 on # 废弃 
set -g mouse-resize-pane on 
set -g mouse-select-pane on 
set -g mouse-select-window on 

# 复制模式中使用鼠标滚轮
setw -g mode-mouse on # 废弃

# 禁用鼠标时快速切换
bind m set -g mouse on \; display "Mouse: ON"
bind M set -g mouse off \; display "Mouse: OFF"
```

#### 状态栏基础配置
```bash 
# 启用状态栏
set -g status on 

# 状态栏设置
set -g status-position top # top 或 bottom 

# 状态栏刷新间隔（毫秒）
set -g status-interval 1 

# 状态栏长度
set -g status-left-length 20 
set -g status-right-length 150 
```

#### 状态栏样式
```bash 
# 颜色设置
set -g status-style "bg=colour235,fg=colour250"  # 灰色系
# 或
set -g status-bg black
set -g status-fg white

# 当前窗口样式
setw -g window-status-current-style "bg=red,fg=black,bold"

# 活动窗口样式
setw -g window-status-activity-style "bg=colour237,fg=colour250"

# 铃铛样式
set -g window-status-bell-style "fg=colour255,bg=colour1,bold"

# 窗口列表样式
setw -g window-status-style "fg=colour244,bg=colour234"
setw -g window-status-format " #I:#W#F "
setw -g window-status-current-format " #I:#W#F "
```

#### 状态栏内容
```bash 
# 左侧内容
set -g status-left "#[fg=green]#H #[fg=blue]#S #[fg=yellow]%Y-%m-%d"
set -g status-left-length 50

# 右侧内容（支持多种系统信息）
set -g status-right "#{cpu_percentage} | #{battery_icon} #{battery_percentage} | %a %H:%M"
set -g status-right-length 150

# 使用插件增强状态栏
set -g @plugin 'tmux-plugins/tmux-cpu'
set -g @plugin 'tmux-plugins/tmux-battery'
set -g @plugin 'tmux-plugins/tmux-net-speed'
```

#### 窗格边框
```bash 
# 边框样式
set -g pane-border-style "fg=colour240"      # 非活动边框
set -g pane-active-border-style "fg=green"   # 活动边框

# 边框字符
set -g pane-border-indicators "both"  # arrows, colour, both

# 显示窗格编号
set -g display-panes-time 1500        # 显示时间（毫秒）
set -g display-panes-colour blue
set -g display-panes-active-colour red
```

#### 窗格行为
```bash 
# 允许窗格重命名
set -g allow-rename on

# 鼠标选择时自动切换窗格
set -g mouse-select-pane on

# 同步窗格输入（广播到所有窗格）
bind C-s set-window-option synchronize-panes

# 设置窗格切换延迟
set -g repeat-time 300
```

#### 窗口配置
```bash 
# 窗口自动重命名
set -g automatic-rename on
set -g automatic-rename-format '#{b:pane_current_path}'

# 窗口铃铛
set -g visual-activity on
set -g visual-bell on
set -g visual-silence on
set -g bell-action any

# 窗口列表样式
setw -g window-status-separator " | "
```

## 会话持久化
tmux的会话默认在重启后会丢失\
要实现会话持久化，可以使用以下方法
1. 使用tmux-resurrect插件
```bash 
# 安装步骤
# 1. 安装tpm(tmux插件管理器)
git clone https://github.com/tmux-plugins/tpm~/.tmux/plugins/tpm 

# 2. 在~/.tmux.conf中添加
set -g @plugins 'tmux-plugins/tpm'
set -g @plugins 'tmux-plugins/tmux-resurrect'

# 3. 重新加载配置后配置前缀键 + I 安装插件

# 使用方法
# 保存会话：前缀键 + Ctrl-s 
# 恢复会话：前缀键 + Ctrl-r 
```
resurrect不能恢复进程内部状态，只能恢复session/window/pane结构、cwd、命令行（部分），tmux-resurrect解决的是”工作结构丢失“，不是”程序状态恢复“

2. 手动保存和恢复
```bash 
# 保存会话
tmux list-sessions > ~/.tmux-sessions 

# 恢复会话（脚本）
#!/bin/bash 
while IFS= read -r session; do 
    tmux new-session -d -s "$session"
done < ~/tmux-sessions 
```

3. 自动保存脚本
```bash 
# 在~/.tmux.conf中添加
set -g @resurrect-save 'S'
set -g @resurrect-restore 'R'
```

## 批量操作
1. 同步输入到多个窗格
```bash 
# 进入同步模式
Ctrl+b :setw synchronize-panes 

# 或添加到配置文件
bind y setw synchronize-panes \; display "同步模式：#{?pane_synchronized,ON,OFF}"
```

2. 批量创建窗格
```bash 
# 创建3个垂直排列的窗格
tmux split-window -v 
tmux split-window -v 

# 创建2x2网格
tmux split-window -v
tmux split-window -h 
tmux select-pane -t 0 
tmux split-window -h 
```

3. 在所有窗格执行相同命令
```bash 
# 方法1：使用同步模式
Ctrl+b :setw synchronize-panes on 
# 然后输入命令，所有窗格都会执行

# 方法2：使用 send-keys 
Ctrl+b :list-panes -s -F '#{pane_id}' | xargs -I {} tmux send-keys -t {} 'ls' Enter
```

4. 布局管理
```bash 
# 保存布局到文件
tmux list-windows -F '#{window_layout}' > layout.txt 

# 应用布局
tmux select-layout $(cat layout.txt)
```

## 插件管理
使用TPM(Tmux Plugin Manager)，TPM是最流行的tmux插件管理器

### 安装
```bash 
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

### 配置
在`~/.tmux.conf`中添加
```bash 
# 列出TPM插件
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @plugin 'tmux-plugins/tmux-yank'
set -g @plugin 'tmux-plugins/tmux-pain-control'

# 其他配置

# 初始化TPM（必须放在文件末尾）
run '~/.tmux/plugins/tpm/tpm'
```

#### 常用插件列表

| 插件 | 功能 | 安装命令 |
| - | - | - |
| tmux-resurrect | 会话持久化 | `set -g @plugin 'tmux-plugins/tmux-resurrect'` |
| tmux-continuum | 自动保存/恢复 | `set -g @plugin 'tmux-plugins/tmux-continuum'` |
| tmux-yank | 系统剪贴板集成 | `set -g @plugin 'tmux-plugins/tmux-yank'` |
| tmux-pain-control | 增强窗格操作 | `set -g @plugin 'tmux-plugins/tmux-pain-control'` |
| tmux-battery | 电池状态显示 | `set -g @plugin 'tmux-plugins/tmux-battery'` |
| tmux-cpu | CPU使用率显示 | `set -g @plugin 'tmux-plugins/tmux-cpu'` | 
| tmux-net-speed | 网络速度显示 | `set -g @plugin 'tmux-plugins/tmux-net-speed'` |


#### 插件介绍
##### `tmux-plugins/tpm`
TPM = 插件管理器，本身不是功能插件\
TPM(Tmux Plugin Manager)只干一件事：管理其他tmux插件的安装/更新/卸载\
没有TPM,所有插件都不能用

###### 它解决的问题
- 不用手动`git clone`每个插件
- 不用记插件路径
- 插件集中管理、可复现 

###### 使用

| 操作 | 快捷键 |
| - | - |
| 安装插件 | `Ctrl+b I` |
| 更新插件 | `Ctrl+b U` |
| 卸载插件 | `Ctrl+b Alt+u` |


##### `tmux-plugins/tmux-sensible`
官方认可的”默认最佳实践集合”，它是一组社区共识的sane defaults,比如
- 更合理的复制模式
- 更好的键盘行为
- 修复tmux的一些反直觉默认设置

###### 它解决的问题
tmux默认配置非常“老派”，不适合现代开发者，`sensible`相当于：“你就当tmux本来就该这样工作”

###### 使用
安装即生效，没有快捷键，没有配置项，工程建议几乎所有人都应该装，这是tmux的“地基插件”

##### `tmux-plugins/tmux-resurrect`
会话结构保存/恢复
- session/window/pane结构
- pane当前目录
- pane中运行的命令（部分）

###### 它解决的问题
重启机器，tmux server 被杀，SSH掉线，工作结构不丢

###### 使用

| 操作 | 快捷键 |
| - | - |
| 保存会话 | `Ctrl+b Ctrl+s` |
| 恢复会话 | `Ctrl+b Ctrl+r` |

它不会恢复程序内部状态，例如gdb断点，vim buffer内容，Python REPL内存等；它只恢复“壳”，不恢复“灵魂”

##### `tmux-plugins/tmux-continuum`
它在`tmux-resurrect`之上做了两件事
- 定时自动保存
- tmux启动时自动恢复

###### 它解决的问题
不需要手动保存

###### 基本配置
```tmux 
set -g @continuum-restore 'on'
set -g @continuum-save-interval '15' # 分钟
```

###### 使用
安装好就行，tmux启动即恢复，基于resurrect 

##### `tmux-plugins/tmux-yank`
tmux与系统剪贴板的桥梁，让你在tmux里复制的内容，真正进入到系统剪贴板，而不是tmux内部buffer

###### 它解决的问题
- tmux复制 -> 浏览器粘贴
- tmux复制 -> 编辑器/GUI 

###### 使用
1. 进入复制模式
```bash 
Ctrl+b [
```
2. 选中内容
3. 按`y`，内容进入系统剪贴板

前提条件，你需要系统有
- X11：`xclip`或`xsel`
- Wayland：`wl-clipboard`

否则插件不会报错，但也不会生效

##### `tmux-plugins/tmux-pain-control`
窗格操作效率插件，为pane操作提供更符合直觉的快捷键

###### 它解决的问题
原生tmux pane 操作键位分散，不连续，手感差

###### 常用快捷键

| 操作       | 快捷键        |
| -------- | ---------- |
| 向左切 pane | `Ctrl+b h` |
| 向下       | `Ctrl+b j` |
| 向上       | `Ctrl+b k` |
| 向右       | `Ctrl+b l` |
| 横向分屏     | `Ctrl+b \|` |
| 纵向分屏     | `Ctrl+b -` |


## 命令模式

按下`prefix + :` 进入命令模式

### pane交换

输入

```bash
swap-pane -s [源编号] -t [目标编号]
```

可将pane进行交换

### 移动pane到另一个window

移动到指定window

```bash
# 将当前pane移动到 window 2

join-pane -t :2 # 移动到 window 2
join-pane -t 窗口名 # 移动到指定名称的窗口
```

### 查看所有pane信息

```bash
line-pane
```








