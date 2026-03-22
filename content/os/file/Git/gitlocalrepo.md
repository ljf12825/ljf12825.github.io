---
title: .git/
date: 2025-12-31
categories: [Git, Linux]
tags: [local]
author: "ljf12825"
type: log
summary: git local structure
---

# .git/
`.git/`是Git仓库的核心，包含了所有版本控制信息。它是一个隐藏的目录，位于每个Git仓库的根目录下\
Git通过`.git/`来存储项目的历史记录、配置信息、分支信息等，是整个版本管理系统的核心，是整个Git系统的缩影\
每次执行git命令，实际上都是在对`.git/`文件夹中的内容进行修改或读取

## 主要目录结构
```text
.git/
|__ HEAD 
|__ config 
|__ description 
|__ COMMIT_EDITMSG 
|__ FETCH_HEAD 
|__ ORIG_HEAD 
|__ MERGE_HEAD, MERGE_MODE, MERGE_MSG
|__ index 
|__ packed-refs 
|__ hooks/ 
|__ info/ 
|__ logs/ 
|__ objects/ 
|__ refs/ 
|__ rebase-apply/, rebase-merge/
|__ branches/
|__ worktrees/
```

### HEAD 
- 作用：记录当前检出的分支的引用。这个文件指向当前分支或提交的对象（通常是`refs/heads/branch-name`或某个具体的提交哈希值）
- 用途：Git使用它来确定当前的工作状态，即当前在哪个分支或哪个提交上

#### 基本概念
- HEAD是一个指针，指向当前检出的分支或者直接指向某个具体提交（commit）
- 可以把它理解为Git仓库当前“活跃状态”的代表：它告诉Git当前所在的分支或提交

#### HEAD存储位置与内容
HEAD是一个文本文件，位于`.git/HEAD`，内容通常有两种形式
##### 1. 指向分支
```bash 
ref: refs/heads/master
```
- `ref:`表示这是一个引用
- `refs/heads/master`表示当前检出的是`master`分支
- Git会通过分支引用找到对应的最新提交

##### 2. 直接指向提交(Detached HEAD) 
``` 
f4c3b00c8a6f9e5a2d3...
```
- HEAD指向一个具体的提交哈希值，而不是分支
- 这种状态下，对代码的修改不会影响任何分支，除非手动创建新分支或cherry-pick 

#### HEAD与分支的关系
- 当HEAD指向分支时
  - 你所做的提交会更新分支引用
  - 分支总是指向最新提交
- 当HEAD是Detached（分离头指针）状态时
  - 提交不会更新任何分支
  - 临时提交可以被丢弃，如果不创建分支保存，会被垃圾回收

```bash 
HEAD -> refs/heads/feature 
feature -> commit c 
```
当执行`git commit`
- 新提交C1产生
- feature分支指针更新到C1 
- HEAD仍然指向feature分支

如果是 detached HEAD 
```bash 
HEAD -> commit B 
```
- 新提交 C2 产生
- HEAD指向C2,但没有分支引用跟随
- 如果没有新分支保存，C2将可能被丢弃

#### HEAD的常用操作
1. 切换分支
```bash 
git checkout branch_name 
```
更新HEAD指向新的分支

2. 临时切换到历史提交
```bash 
git checkout <commit_hash> 
```
HEAD进入Detached状态

3. 创建新分支并切换
```bash 
git checkout -b new_branch 
```
HEAD指向新分支，分支指针初始化为当前提交

4. 重置HEAD 
```bash 
git reset --hard HEAD~1
```
HEAD和当前分支指针一起退回一个提交，工作区和暂存区会同步更新（--hard）

#### HEAD与Git内部机制的关系
HEAD决定了索引（index）和工作区的基准提交，当执行`git commit`，Git会
- 找到HEAD指向的分支或提交
- 将index（暂存区）的内容生成新提交对象
- 更新HEAD所指向的分支引用（如果HEAD指向分支）

HEAD是Git版本控制的入口点，所有diff, merge, reset等操作都是基于HEAD的状态来计算的

### config 
`config`是`.git`里的“意识形态”文件，它决定了：这个仓库”怎么思考、怎么行动、遵守什么规则“\
`.git/config`是这个仓库的局部Git世界观，它不关心历史，不关心代码内容，只关心三件事：
- 你是谁
- 你和远程仓库怎么相处
- 这个仓库有哪些“特例规则”

#### config在Git配置体系里的位置
Git的配置是分层覆盖模型，不是单一文件
- system级（整台机器`/etc/gitconfig`）
- global级（当前用户`~/.gitconfig`）
- local级（当前仓库，也就是`.git/config`）

`.git/config`优先级最高\
system -> global -> local 覆盖\
这意味着：可以在同一台机器、同一个用户下，让不同仓库表现出完全不同的行为

#### config的物理本质
`.git/config`是一个INI风格的纯文本文件
```ini 
[section "subsection"]
    key = value
```
Git内部不是“魔法”，就是字符串解析 + 查表

#### config的核心模块
##### `[core]`—— Git的基础行为
这是Git的“操作系统参数”，core决定Git如何理解“文件系统现实”
```ini 
[core]
    repositoryformatversion = 0
    filemode = true
    bare = false 
    ignorecase = false 
```
- `filemode`
    决定Git是否跟踪文件权限变化，在Linux下很重要

- `ignorecase`
    在大小写敏感文件系统下必须是false 

- `bare`
    决定这个仓库有没有工作区，裸仓库（bare repo）就是靠这个标志存在的

- `repositoryformatversion`
    定义仓库的格式版本，确保Git客户端能正确处理仓库数据
    - `version0`(默认值) 
      - 最原始和最广泛兼容的格式
      - 不支持扩展功能
      - 所有现代Git版本都兼容
    - `version1`(添加扩展支持)
      - 添加了扩展机制，支持可选功能
      - 允许向后兼容的扩展

    当`repositoryformatversion = 1`时，可以启用以下扩展
    ```ini 
    [extensions]
        # 与提交钩子索引
        precomposeunicode = true

        # 部分克隆支持
        partialclone = true 

        # 提交图（commit-graph）
        commit-graph = true

        # 文件系统监视
        fsmonitor = true 

        # 使用SHA-256进行哈希计算
        objectFormat = sha256
    ```
    - 常见使用场景
      - 新功能启用：某些Git功能（如commit-graph, fsmonitor）需要version1
      - 仓库迁移：升级仓库格式以支持新特性
      - 兼容性检查：确保Git客户端能正确处理仓库
    - 注意事项
      - 谨慎修改：通常不需要手动修改此值，Git会在必要时自动更新
      - 向后兼容：高版本Git可以读取低版本仓库，但反过来不行
      - 克隆影响：仓库格式版本会影响克隆和共享仓库的行为

#### `[user]` —— 提交的身份来源
```ini 
[user]
    name = ljf12825
    email = ljf12825@graingen.com 
```
关键不是“名字和邮箱”，而是
- 提交对象（commit）永久写入
- 一旦进入历史，就不可更改（除非重写历史）

这意味着：config不是配置，是历史的签名器

#### `[remote]` —— 远程仓库定义
```ini 
[remote "origin"]
    url = git@github.com:xxx/yyy.git 
    fetch = +refs/heads/*:refs/remotes/origin/*
```
这段东西解释了Git的一个底层事实：Git不存在“服务器”，只存在引用同步规则

`fetch`这一行定义了
- 远程那些ref 
- 映射成本地哪些ref 

远程不是概念，是ref映射表

#### `[branch]` —— 分支行为配置
```ini 
[branch "main"]
    remote = origin 
    merge = refs/heads/main 
```
这解释了一个常被误解的点

`git pull`并不是“魔法操作”，而是：
- fetch（由remote决定）
- merge/rebase（由branch config决定）

branch本身只是一个ref, branch config 才决定它“怎么长大”

#### `[pull]/[merge]/[rebase]`
控制`git pull`的默认策略，不修改历史数据，只修改操作方式
```ini 
[pull]
    rebase = true
```

#### `[alias]`
记录别名，只是命令展开，不影响Git内部逻辑
```ini 
[alias]
    st = status 
    co = checkout 
```

### description
`.git/description`是一个“仓库描述字符串文件”\
它的作用只有一个：给仓库本身提供一段简短说明，用于某些Git仓库浏览工具提示；它不参与任何Git行为

#### 文件本质
它是一个单行纯文本文件，比如
```text 
Unnamed repository; edit this file 'description' to name the repository.
```
可以改成
```text 
My personal compiler experiments
```
没有格式、没有语法、没有解析规则，就是原样读取

#### 使用场景
1. GitWeb/cgit/老式仓库浏览器
通常显示在仓库列表页，仓库标题或简介位置

2. 裸仓库(bare repository)里更常见
在bare repo中
``` 
project.git/
|__ HEAD 
|__ objects/
|__ refs/
|__ description
```
这种仓库没有工作区，也没有README给人看，`description`就成了“唯一的自我介绍”

#### 存在原因
历史原因：
- Git最早服务对象是
  - 内核开发
  - 自建Git服务器
  - GitWeb 

那个时代没有README预览，没有Web UI的仓库简介栏，`description`就是当年的“仓库简介字段”

#### 实用建议
- 普通开发仓库
不用管，甚至可以忽略它的存在

- 裸仓库/自建Git服务
可以认真写一句话，方便列表页识别

- 公共仓库
用README,平台描述，不用`description`

### COMMIT_EDITMSG
这个临时文件保存了在`git commit`操作过程中编辑的提交信息。每次提交时，Git会自动在这个文件中写入提交信息，直到提交完成

#### 内容
```text 
fix parser bug

- handle empty token
- add boundary check
```

#### 出现时机
- 执行`git commit`（不带`-m`）
- Git启动编辑器前，把模板写进这个文件
- 保存并退出编辑器后：
  - Git读取这个文件
  - 生成commit对象
  - 文件内容写入 commit message

#### 关键点
它不是历史，它不是缓存，它只是“这一次commit的输入缓冲区“

提交完成后，文件通常还在，内容会被下次commit覆盖

### FETCH_HEAD
- 作用：这个文件记录了最后一次`git fetch`操作中拉取的远程分支信息。它包含了远程仓库分支的最新状态

内容
```text 
a1b2c3d4 refs/heads/main from origin
```

在执行`git pull`(pull = fetch + merge/rebase)或`git merge`时，Git会参考这个文件

它记录了远程分支的最新提交，但不等于远程分支引用
- `refs/remotes/origin/main` -> 持久的远程跟踪分支
- `FETCH_HEAD` -> 这一次fetch的临时结果

#### 存在意义
因为Git支持这种操作
```bash 
git fetch origin 
git merge FETCH_HEAD
```
也就是说：FETCH_HEAD是”这次fetch的结果指针“

它有以下特点
- 会被反复覆盖
- 不保证完整
- 不参与历史
- 是pull/merge的输入源

### ORIG_HEAD
Git在执行可能改变历史的操作：
- `git reset`
- `git merge`
- `git rebase`
- `git pull`（部分情况）

会将之前的`HEAD`记录在`ORIG_HEAD`中，作为回滚点；提供一个回滚的机会，允许恢复到执行该操作之前的状态

示例
```bash 
git reset --hard HEAD~3
# 回退错误

git reset --hard ORIG_HEAD
```
只要ORIG_HEAD还在，就能回去

### MERGE_HEAD, MERGE_MODE, MERGE_MSG
这三个文件都属于合并过程中的“临时状态文件”\
特点：
- 只在merge进行中存在
- 合并完成或中止后删除
- 不进入历史
- 不参与对象存储

它们的存在目的只有一个：让一次“多阶段”的merge操作可以被中断、恢复、继续

#### `MERGE_HEAD`
当前正在被合并进来的提交（或多个提交）的SHA-1列表，octopus merge（多分支合并）时可能有多行

##### 存在意义
合并不是一个原子操作
1. 切换index 
2. 尝试自动合并
3. 可能发生冲突
4. 等待解决冲突
5. 再创建merge commit 

Git必须记住：“我原本是打算把谁合进来”，`MERGE_HEAD`就是这个答案

##### 写入时机
- 执行`git merge <other-branch>`
- 在真正生成commit之前
- 且merge尚未完成

##### 使用方式
当解决冲突后执行
```bash 
git commit 
```
Git会
- 读取`MERGE_HEAD`
- 把里面的commit hash 作为第二父提交
- 生成merge commit 

#### `MERGE_MODE`
记录当前merge的模式（strategy flags）

##### 存在意义
Git的merge有多种行为
- fast-forward
- no-ff 
- squash 
- 不同 strategy（recursive, ort等）

一旦merge被中断（冲突），Git必须记住“当初你打算怎么合”，`MERGE_MODE`就是保存这个决策的

##### 示例
```bash 
git merge --no-ff feature
```
如果发生冲突：
- `MERGE_MODE`=`no-ff`
- 解决冲突后继续commit 
- Git仍然按no-ff生成merge commit 

##### 注意
不是所有merge都会有这个文件，只有在需要保留策略语义时才会写入

#### `MERGE_MSG`
合并提交的默认提交信息草稿

##### 生成时间
- merge开始时
- 在commit尚未发生之前

##### 作用
当执行
```bash 
git commit 
```
如果检测到`MERGE_HEAD`存在，且没有指定`-m`，Git会读取`MERGE_MSG`，作为commit message初始内容

#### 三者如何协同工作
以一次有冲突的merge为例
1. `git merge feature`
2. Git写入
    - `MERGE_HEAD`
    - `MERGE_MODE`
    - `MERGE_MSG`
3. 自动合并失败，停下来
4. 解决冲突，`git add`
5. 执行`git commit`
6. Git:
    - 读取`MERGE_HEAD` -> 父提交
    - 读取`MERGE_MODE` -> 决定提交形态
    - 读取`MERGE_MSG` -> 充填message 
7. 生成merge commit 
8. 删除这三个文件

### index 
`.git/index`是Git的暂存区数据库文件，是下一次提交(commit)将要使用的文件状态表，它是Git三态模型里的“中间态”

```text 
HEAD(上一次提交) -> index（下一次提交）-> working tree（工作区）
```

#### 物理形态
- 路径`.git/index`
- 类型：二进制文件
- 由Git直接读写，人工不可编辑
- 格式有版本（v2/v3/v4）

可以用命令查看逻辑内容
```bash 
git ls-files --stage 
```

#### index文件内部结构
`.git/index`并不是一个简单的列表，它是一个结构化的二进制文件，大致由以下部分组成

##### Header 
- magic：`DIRC`
- version：2/3/4
- entry count：条目数量

##### Entry
每一个被跟踪的文件，对应一个entry，每个entry记录
- 文件路径
- 文件模式（100644/100755/120000）
- 对应的blob对象hash 
- 文件大小
- 时间戳（ctime/mtime）
- stage（0-3，用于merge）

> index里存的是“路径 -> blob”的映射

##### Extensions
用于性能优化和高级功能
- cache-tree（加速tree构建）
- resolve-undo（merge冲突回退）
- fsmonitor
- sparse-checkout 

这些扩展让index即是数据表，又是状态机

##### Checksum
- 整个index文件的SHA-1
- 用于一致性校验

#### stage的真实含义
index支持同一路径多条记录，靠stage区分

| stage | 含义 |
| - | - |
| 0 | 正常文件 |
| 1 | merge base |
| 2 | ours |
| 3 | theirs |

这就是Git能“暂停在冲突中”的根本原因

#### 核心命令如何操作`.git/index`
##### `git add`
内部流程
1. 读取工作区文件
2. 写入blob对象
3. 更新index中该路径的entry 

如果多次add
- 后一次直接覆盖前一次entry 

##### `git commit`
1. 读取 index
2. 按路径构建tree对象
3. tree + parent + message -> commit 

commit 只看 index,不看working tree 

##### `git reset`
- `--soft`：不碰index 
- `--mixed`：HEAD -> index 
- `--hard`：HEAD -> index -> working tree 

##### `git checkout`
- checkout 分支
  - tree -> index -> working tree 
- checkout 文件
  - index -> working tree 

#### index存在意义
没有index会发生什么
- 不能分批提交
- 不能部分add 
- merge冲突无法建模
- commit必须直接基于working tree 

index的本质是：把历史构建与工作修改解耦

#### index与性能的关系
index不是简单表，而是高度优化的数据结构
- 路径排序
- 哈希加速
- cache-tree 
- fsmonitor

这也是Git在超大仓库下仍然可用的原因之一

### packed-refs 
`.git/packed-refs`是Git的“引用压缩表”\
它存储的是大量refs（分支、标签等） -> commit hash的集中映射\
本质上，它是对`.git/refs/`目录树的一个只读快照优化

#### 存在意义
早期的Git每个ref一个文件，ref数量一多，文件操作成本极高，`stat/open`成为瓶颈\
解决方案：把大量ref打包成一个文件，减少inode和系统调用，这就是`packed-refs`

#### `packed-refs`生成时机
它不是实时更新的，而是在这些场景生成或更新
- `git pack-refs`
- `git gc`
- 某些fetch/prune操作
- ref数量达到阈值

生成后：
- 原来的ref文件可能被删除
- 也可能和loose refs混合存在

#### 文件格式
`packed-refs`是纯文本文件
```text 
# pack-refs with: peeled fully-peeled
a1b2c3d4e5f6 refs/tags/v1.0
^b7c8d9e0f1a2
c3d4e5f6a1b2 refs/heads/main
```
##### 注释行
```text 
# pack-refs with: peeled fully-peeled
```
- 已包含tag的peeled（解引用）结果

##### 普通ref行
```text 
<hash> <refname>
```
```text 
c3d4e5f6a1b2 refs/heads/main
```
- `main`分支指向该commit 

##### `^`行（annotated tag）
```bash 
a1b2c3... refs/tags/v1.0
^deadbeef...
```
- 第一行：tag对象
- `^`行：tag最终指向的commit 

这是为了避免反复解引用tag 

#### loose refs vs packed refs 
Git同时支持两种形式

loose refs 
```bash 
.git/refs/heads/main 
```
- 一个 ref一个文件
- 适合频繁修改

packed refs 
```bash 
.git/packed-refs
```
- 集中存储
- 只读
- 适合大量、稳定refs 

Git查找顺序：先查loose refs,再查packed-refs；loose ref会覆盖packed ref 

#### 为什么packed-refs是只读的
改写一个ref != 改写一行文本，需要原子性、锁、并发安全\
所有Git的策略是：更新ref -> 写loose ref，定期 -> 打包进packed-refs\
这保证了：正确性，性能，并发安全

#### packed-refs不存什么
不存HEAD, 不存index,不存reflog,不存remote配置，它只存ref -> object的最终映射

### hooks/
见`./Hooks.md`

### info/
`info/`用来存放“只对当前仓库生效，但不进入版本控制”的辅助配置与规则
- 不污染提交历史
- 不影响远端
- 不影响其他clone 
- 只影响当前working tree 的Git行为

#### `info/`中的内容
默认情况下，`info/`目录很小，甚至可能只有一个文件
```text 
.git/info/
└── exclude
```
以及在特定功能开启时
```text 
.git/info/
├── exclude
└── sparse-checkout
```

#### `.git/info/exclude`
这是`info/`目录最核心、最常见的文件\
它是仓库级`.gitignore`，但不参与版本控制，语义完全等价于`.gitignore`，但作用域不同

Git忽略规则的优先级顺序是
1. `.git/info/exclude`（最高）
2. `.gitignore`（项目内）
3. 全局ignore（`~/.config/git/ignore`）

##### 典型使用场景
- 本地IDE配置
- 临时生成文件
- 私有测试脚本
- 本地调试产物

而你不想
- 提交
- 修改`.gitignore`
- 影响团队

#### `.git/info/sparse-checkout`
当启用sparse checkout时，Git会用到这个文件\
它描述working tree中“哪些路径需要被检出”\
Git根据`info/sparse-checkout`动态构造index的可见子集，其他路径在工作区消失

> info/是escape hatch，是为极端/高级用户准备的，不鼓励团队依赖

### logs/
logs/记录的是引用（refs）如何随时间变化的历史，它是reflog的物理存储

#### `logs/`的目录结构
```text 
.git/logs/
├── HEAD
└── refs/
    ├── heads/
    │   ├── main
    │   └── dev
    └── remotes/
        └── origin/
            └── main
```
- `logs/HEAD`：HEAD的移动历史
- `logs/refs/...`：每个ref的移动历史

详见`reflog.md`

### objects/
Git是一个内容寻址的对象数据库，`objects/`就是这个数据库本身，存储了仓库中的所有对象（提交对象、树对象、文件对象等）;每次提交、合并等操作时，Git会将提交和文件的内容以对象形式存储在这个目录中，使用SHA-1哈希值唯一标识每个对象\
它存储的是Git的四种基础对象
1. blob —— 文件内容
2. tree —— 目录结构
3. commit —— 一次快照 + 元信息
4. tag —— 对某个对象的命名与注释

#### Git对象的共同特征
所有Git对象都满足
1. 不可变（immutable）
2. 内容寻址（content-addressed）
3. 压缩存储（zlib）
4. 无类型引用关系（靠hash连接）

Git不关心名字，只关心内容

#### 对象的真实物理格式
一个Git对象在写入磁盘前，会先变成这样
```text 
"<type> <size>\0<content>"
```
然后
- 计算hash 
- zlib压缩
- 写入`.git/objects/`

示例
```text 
blob 14\0Hello, world!\n 
```
hash对应的文件名完全由内容决定

#### blob
- 只存文件内容
- 不存文件名
- 不存权限（部分）

同一个内容在不同路径，不同文件名，只存一次；这是Git高效的根本原因之一

#### tree
tree对象存的是
```text 
<mode> <name>\0<hash>
```
例如
```text 
100644 main.c\0<blob-hash> 
040000 src\0<tree-hash>
```
tree = 目录快照

#### commit
commit对象包含
```text 
tree <tree-hash> 
parent <parent-hash> 
author ...
committer ...

commit message 
```
- commit 不直接指向文件，commit -> tree -> blob 

#### tag
轻量tag不是对象，只是ref\
annotated tag本身也是对象
```text 
object <hash>
type commit 
tag v1.0 
tagger ...

message 
```
#### 目录结构
```bash 
.git/objects/
├── info/
├── pack/
├── ab/
│   └── cdef1234...
├── 9f/
│   └── 01ab5678...
```
规则
- 对象按SHA-1/SHA-256哈希分片存储
- 前2位作为目录名
- 后面作为文件名

这是为了避免单目录下文件过多

##### `objects/info/`
用途很小，历史遗留
- `alternates`
- `commit-graph`（新Git）

用于跨仓库共享对象，优化遍历

##### `objects/pack`
当loose objects 太多
- Git会进行pack
- 合并成`.pack`文件
- 生成`.idx`索引

```text 
.git/objects/pack/
├── pack-xxxx.pack
└── pack-xxxx.idx
```
这就是Git能处理百万级对象的关键

###### loose objects vs packed objects

| 类型 | loose | pack |
| - | - | - |
| 存储 | 单文件 | 聚合 |
| 修改 | 快 | 满 |
| 查找 | 慢 | 快 |
| 数量 | 少 | 多 |

Git的策略：写 -> loose, 稳定 -> pack 

##### GC与objects
Git判断一个对象是否该删除
- 是否可达
- 从哪些ref/reflog出发可达

不可达对象
- 进入“宽限期”
- 最终被`git gc`删除

### refs/
存储Git的引用（refs）
- `heads/`：本地分支的引用
- `tags`：标签的引用
- `remotes`：远程仓库分支的引用

是对Git对象的命名，是对 人类可读名称 -> 不可变对象hash 的映射

#### refs内容
一个ref文件的内容极其简单
```txt 
<40-byte hash>\n 
```
例如
```txt 
a1b2c3d4e5f6...
```
含义：这个名字当前指向哪个对象（通常是commit）

#### refs/目录结构
```txt 
.git/refs/
├── heads/
│   ├── main
│   └── dev
├── tags/
│   └── v1.0
└── remotes/
    └── origin/
        └── main
```

#### 三类核心refs 
1. `refs/heads/*`：本地分支
    - 可读可写
    - 会随着commit/reset移动
    - HEAD通常指向这里

```bash 
refs/heads/main 
```

2. `refs/tags/*`：标签
轻量标签
```txt  
refs/tags/v1.0 -> commit hash 
```
只是ref,没有对象

注释标签
```txt 
refs/tags/v1.0 -> tag object -> commit 
```

3. `refs/remotes/*`：远端跟踪分支
只读语义（不能直接commit），由fetch更新，表示上次看到的远端的状态
```bash 
refs/remotes/origin/main 
```

#### HEAD与refs的关系
HEAD不是ref本身，但是ref的入口
1. 正常状态（symbolic ref）
```bash 
HEAD -> refs/heads/main 
```
HEAD文件内容
```bash 
ref: refs/heads/main 
```

2. detached HEAD
```bash 
HEAD -> commit hash 
```
此时
- 不指向refs 
- commit 不会被任何分支自动引用

#### symbolic ref（符号引用）
一些ref不存hash,而是指向另一个ref，例如HEAD\
这类ref本身不是状态，只是转发，Git内部称之为symbolic ref 

#### refs的写入协议（非常关键）
Git更新ref时不是直接写文件，会进行如下流程
1. 写`.lock`文件
```bash 
refs/heads/main.lock 
```
2. fsync
3. 原子`rename` 
4. 删除lock

保证
- 崩溃安全
- 并发安全
- 不出现半写状态

### rebase-apply/, rebase-merge/
`rebase-apply`和`rebase-merge`是Git在rebase过程中用于保存“执行进度、上下文和中间态”的临时目录
- `rebase-apply`：基于patch apply的rebase（早期/简单）
- rebase-merge：基于merge machinery的rebase（现代/默认）

#### rebase目录存在意义
rebase本质做的是：取出一串commit -> 按顺序“重放”到新的base上 -> 生成一串新commit \
这是一个多步、可中断、可恢复的过程，所以Git必须
- 记住做到第几步
- 保存原始commit信息
- 保存当前冲突状态
- 能`--continue / --abort / --skip`

这些信息就落在`.git/rebase-*`里 

#### `rebase-apply`（apply模式）
##### 使用场景
触发条件之一
- 旧版本Git
- `git rebase --apply`
- 使用`git am`风格的重做

核心机制：把commit转成patch,然后apply 

##### 目录结构
```text 
.git/rebase-apply/
├── apply-opt
├── next
├── last
├── head-name
├── orig-head
├── patch
├── message
└── abort-safety
```
- `patch`：当前正在apply的patch 
- `next`/`last`：当前第几个patch/总patch数 
- `orig-head`：rebase前HEAD
- `head-name`：原分支名
- `message`：commit message草稿 

##### apply模式的局限
- 基于diff,语义弱
- 冲突处理能力有限
- 对rename.binary支持差

所以现在很少单独使用

#### `rebase-merge`（merge模式，主流）
##### 使用场景
- 现代Git默认
- `git rebase -i`
- 需要处理复杂历史、交互式操作

核心机制：用merge machinery 重放每个commit 

##### 目录结构
```text  
.git/rebase-merge/
├── git-rebase-todo
├── git-rebase-todo.backup
├── done
├── msgnum
├── end
├── orig-head
├── head-name
├── onto
├── message
├── author-script
└── stopped-sha
```
- `git-rebase-todo`：rebase的“执行脚本”

```text  
pick a1b2c3 commit message
reword d4e5f6 another commit
squash ...
```
这是rebase的程序本身

- `done`：已经执行完成的步骤
```text 
pick a1b2c3 ...
```

- `msgnum`/`end`
    - 当前执行到几步
    - 总步数

- `onto`：rebase的目标base commit 
- `orig-head`：开始前HEAD 
- `head-name`：原分支名（symbolic ref）
- `stopped-sha`：当冲突发生时，记录当前commit，用于`--continue`
- `author-script`：在重写commit时恢复作者信息
-

### branches/
`.git/branches/`是一个几乎已经被废弃的历史遗留目录\
在现代Git中
- 它默认不存在
- 即使存在，也不参与核心流程
- 真正的分支早已全部由`refs/heads/*`管理

#### 历史定位
这是Git非常早期（pre-1.5时代）的设计产物\
当时Git还没有现在这种
- 清晰的refs命名空间
- 完整的remote tracking分支体系

于是引入了`.git/branches/`，用于存放分支对应的远端信息

#### `.git/branches/`作用
在早期Git中
```bash 
.git/branch/<branch-name> 
```
文件内容通常是
```txt 
<remote-repo-URL>
```
含义是：这个本地分支，默认对应哪个远端仓库

也就是说
- 它不存commit hash 
- 也不是分支指针
- 而是pull/push的隐式配置

#### 淘汰原因
随着Git演进，几个关键变化出现了
1. 引入了完整的`refs/remotes`
远端分支有了明确位置
```bash 
refs/remotes/origin/main 
```

2. 引入了`branch.<name>.*`配置
```ini 
[branch "main"]
    remote = origin 
    merge = refs/heads/main 
```
这些信息被统一收敛到`.git/config`

3. 配置与数据彻底分离
Git的成熟架构是
- 数据 -> `object`
- 引用 -> `refs`
- 策略/行为 -> `config`

`.git/branches` 明显不符合这一分层 

在现代Git中，`.git/branches/`仍保留兼容读取逻辑，但优先级非常低，仅用于支持非常老的仓库格式，几乎不可能在新仓库里看到它

### worktrees/
- 作用
  - 当使用Git工作树（git worktrees）功能时，这个目录会出现
  - 它记录了当前仓库关联的额外工作树信息
  - 工作树允许你在同一个Git仓库中，创建多个独立的工作目录，每个工作目录可以检出不同的分支，而不干扰主工作目录
- 典型内容
  - 每个子目录对应一个附加工作树，包含
    - 关联的分支名称
    - HEAD指针
    - 工作树路径
- 用途示例
```bash 
# 添加一个新的工作树
git worktree add ../feature-branch feature 

# 查看当前仓库的所有工作树
git worktree list 
```
上面的命令会在`git/worktrees`下生成记录信息，Git会通过这些信息管理多个工作树的状态









