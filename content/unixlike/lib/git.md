---
title: git
date: 2025-12-31
categories: [Git, Linux]
tags: [Toolchains]
author: "ljf12825"
type: blog
summary: the git self
---

## 直接记录快照，而非差异比较
Git和其他版本控制系统的主要区别在于Git对待数据的方法。概念上来区分，其他大部分系统以文件变更列表的方式存储信息。

这类系统（CVS、Subversion、Perforce、Bazaar等）将它们保存的信息看作是一组基本文件和每个文件随时间逐步积累的差异

![another](/images/anotherstream.drawio.svg)

Git不按照以上方式对待或保存数据。反之，Git更像是吧数据看作是对小型文件系统的一组快照。每次你提交更新，或在Git中保存项目状态时，它主要对当时的全部文件制作一个快照并保存这个快照的索引。为了高效，如果文件没有修改，Git不再重新存储该文件，而是只保留一个链接指向之前存储的文件。Git对待数据更像是一个快照流

![git](/images/git.drawio.svg)

这是Git与几乎所有其他版本控制系统的重要区别。因此Git重新考虑了以前每一代版本控制系统的诸多方面。Git更像是一个小型的文件系统，提供了许多以此为基础构建的工具

## 近乎所有操作都是本地执行
在Git中的绝大多数操作都只需要访问本地文件和资源，一般不需要来自网络上其他计算机的信息

举个例子，要浏览项目的历史，Git不需外连到服务器去获取历史，然后再显示出来，它只需要直接从本地数据库中读取。你能立即看到项目历史。如果你想查看当前版本与一个月前的版本之间引入的修改，Git会查找到一个月前的文件做一次本地差异计算，而不是由远程服务器处理或从远程服务器拉回旧版本文件再来本地处理

## Git保证完整性
Git中所有数据再存储前都计算校验和，然后以校验和来引用。这意味着不可能再Git不知情时更改任何文件内容或目录内容。这个功能建构在Git底层，是构成Git哲学不可或缺的部分。若你在传送过程中丢失信息或损坏文件，Git就能发现

Git用于计算校验和的机制叫做SHA-1散列（hash，哈希）。这是一个由40个十六进制字符（0-9和a-f）组成的字符串，基于Git中文件的内容或目录结构计算出来  
Git中使用这种哈希值的情况很多，你经常看到这种哈希值。实际上，Git数据库中保存的信息都是以文件内容的哈希值来索引，而不是文件名

## Git 一般只添加数据
你执行的Git操作，几乎之往Git数据库中增加数据。很难让Git执行任何不可以操作，或者让它以任何方式清除数据。同别的VCS一样，未提交更新时有可能丢失或弄乱修改的内容；但是一旦你提交快照到Git中，就难以再丢失数据，特别是如果你定期的推送数据库到其他仓库的话

## 三种状态
Git有三种状态，你的文件可能处于其中之一：已提交(Committed)、已修改(Modified)和已暂存(Staged)。已提交表示数据已经安全的保存在本地数据库中。已修改表示修改了文件，但还没保存到数据库中。已暂存表示对一个已修改文件的当前版本做了标记，使之包含再下次提交的快照中

由此引入Git项目的三个工作区概念：Git仓库、工作目录以及暂存区域

![gitworkspace](/images/gitworkspace.svg)

- Git仓库目录是Git用来保存项目的元数据和对象数据库的地方。这是Git中最重要的部分，从其他计算机克隆仓库时，拷贝的就是这里的数据

- 工作目录是对项目的某个版本独立提取出来的内容。这些从Git仓库的压缩数据库中提取出来的文件，放在磁盘上供你使用或修改

- 暂存区是一个文件，保存了下次将提交的文件列表信息，一般在Git仓库目录中。有时候也被叫做“索引”

基本的Git工作流程如下：
1. 在工作目录中修改文件

2. 暂存文件，将文件的快照放入暂存区域

3. 提交更新找到暂存区的文件，将快照永久性存储到Git仓库目录

如果Git目录中保存着的特定版本文件，就属于已提交状态。如果作了修改并已放入暂存区，就属于暂存状态。如果自上次取出后，作了修改但还没有放到暂存区，就是已修改状态

## 核心思想
Git不是简单的“保存文件快照”工具，而是一个内容寻址文件系统（content-addressable filesystem） + 版本管理系统
- 一切皆对象：Git里面的所有东西（文件内容、目录、提交、标签）都存储为对象
- 不可变性：一旦写入对象，就永远不会被修改（内容哈希做索引）
- 快照而非差异：不像SVN那样存储“差异（diff）”，Git存储的是整个文件的快照。但因为相同内容的文件会被哈希去重，所以效率很高

### 快照（snapshot）
每次commit，Git并不是存储“相对上次改动了哪些行”，而是：
- 保存整个项目目录（tree）的快照
- 每个文件内容用blob对象存储
- 目录结构用tree对象组织
- commit对象指向这棵树

Git的对象是不可变 + 哈希去重的，所以如果文件没有变化，Git会直接复用之前的blob，而不是再存一份

#### 快照与差异的区别
- 传统版本控制（CVS/SVN）
存的是“差异”（patch / diff），每个版本依赖于上一个版本，历史像一条链条
- Git
存的是“快照”。每个提交就是一个完整的独立状态，可以直接跳到任意commit，而不用回放所有差异

这就是为什么Git切换分支（checkout）很快——它直接切到某个commit的快照，而不是回放一堆补丁

#### 示例
假设有一个项目
```sql
v1 提交 (commit A)
project/
 ├─ readme.txt   (blob a1)
 └─ main.c       (blob b1)

v2 提交 (commit B)
project/
 ├─ readme.txt   (blob a2)   ← 修改了
 └─ main.c       (blob b1)   ← 没变，复用

v3 提交 (commit C)
project/
 ├─ readme.txt   (blob a2)   ← 没变
 └─ main.c       (blob b2)   ← 修改了
 └─ util.c       (blob c1)   ← 新增
```
- Git每次提交都保存了一棵完整的目录树（tree）
- 但没有变化的文件直接复用之前的blob对象
- 这样既保证了快照的完整性，又节省了空间

#### 快照的特点
##### 优点
1. 直接访问历史版本（快速回溯）
  - 每个commit是完整的快照，独立存在
  - 要切换版本，只需把HEAD指针移到对应commit -> 立刻得到当时的全量项目状态
  - 不需要像SVN那样“回放所有差异（diff）”，因此速度非常快

2. 分支/合并高效
  - 分支就是一个指向commit的指针
  - 因为commit是完整快照，切分支/合并时，只需操作指针和快照之间的关系，不必重算历史补丁
  - 这就是为什么Git分支几乎是O(1)操作

3. 不可变性 + 安全性
  - 每个对象（blob/tree/commit）的内容由哈希计算
  - 快照一旦写入，不会被修改，只能生成新快照
  - 历史不会“被篡改”，这让Git很安全（类似区块链的思想）

4. 空间利用高效
  - 快照看似是“存整个项目“，但Git做了优化
    - 没改动的文件直接复用旧blob
    - 相同文件自动去重
    - 压缩打包成packfile，还能做差异存储
  - 实际空间远比“每次拷贝一份”要小很多

5. 简化逻辑
  - 用户角度：每个commit就是一个“完整的项目状态”
  - 思维模型清晰：不需要考虑“这个版本 + 前 10 个补丁 = 最终状态”

##### 缺点
1. 对象数量膨胀
  - 每次修改都会产生新blob
  - 如果频繁修改大文件（尤其是二进制文件），会生成大量不可重用的blob -> 仓库迅速膨胀
  - 解决方法：使用Git LFS或外部存储

2. 小改动也会创建快照
  - 即使只改了一个字母，整个文件的blob都会重建
  - 虽然文本可被delta压缩，但二进制文件压缩效果差

3. 历史不可变（难以修改）
  - 快照一旦写入就是永久的
  - 如果提交错误，虽然可以用`git rebase`、`git filter-branch`等修改历史，但本质上是新建快照 -> 历史被重写
  - 所以Git的“撤销”比传统diff系统要复杂一些

## Git的数据模型（四大对象）
Git的内部数据由对象数据库（Object Database）和引用（Refs）组成。核心对象有四种
### Blob（Binary Large Object）
**特征**
- 表示文件内容，不存文件名，只存内容
- 哈希寻址：blob的ID通过SHA-1或SHA-256（取决于Git版本）计算哈希作为，完全由文件内容决定
  - 如果再次写入相同内容，Git直接复用同一个blob，不会再创建
- 不可变：blob一旦写入（通过`git add`进入对象库），就永远不会改变
- 去重存储：相同内容的文件在Git中只会存一份

**行为**
比如修改一个`readme.txt`并提交：
1. Git计算新内容 -> 得到一个新blob（hash不同）
2. 新建一个tree对象，记录`readme.txt -> 新 blob`，其他没变的文件继续指向旧blob
3. 新建commit，指向这个tree

此时：
- 旧的blob依然存在（还在对象库里）
- 新commit不再引用旧blob
- 但是旧commit依然引用旧blob，所以它不会丢
- 特殊情况：删除了某些提交，旧的commit没人引用它，它指向的blob也会被标记为垃圾，最终被GC回收

每次修改都会产生新的blob，所以blob的数量理论上会越来越多；但Git设计得非常聪明，不会让仓库无限膨胀\
Git是内容寻址存储：只要文件变了，就会生成一个新的blob，但Git会通过几个机制来控制空间：
1. 不重复存储
  - 相同内容的文件，只会存一份blob
  - 例如回滚到老版本再提交，Git会复用旧的blob

2. 只存变动文件
  - 每次提交，Git不会重写整个仓库
  - 没变化的文件继续引用之前的blob

3. packfile压缩
  - `.git/objects`里的blob一开始是松散对象，一个blob一个文件
  - 运行`git gc`或自动触发时，Git会打包成一个packfile
    - 相同内容去重
    - 相似内容做delta压缩（差异存储）
    - 文件通常能被压缩得很小

### Tree（树对象）
Tree负责记录“目录结构 + 文件名 + blob/tree的对应关系”\
- blob = 文件内容
- tree = 文件夹

Tree的作用：
- 把blob组织成文件系统
- 保证commit能还原出完整的“工程目录状态”
- 实现快照模型

Tree的特点：
- 不可变性：一旦写入，不会修改
- 共享性：相同目录结构可以被多个commit复用
- 层次化：树状结构，支持子目录

commit并不直接指向文件，而是指向根tree对象，然后通过这棵tree递归引用子tree和blob，完整表示整个项目的状态\
commit本身不存文件，而是存tree的哈希，多个commit可能复用同一个tree

**结构**\
Tee对象是一张映射表：
```php-template
<文件模式> <文件名> <对象ID>
```
- 文件模式（mode）表示文件类型和权限
  - `100644`普通文件
  - `100755`可执行文件
  - `120000`符号链接
  - `040000`目录（即子tree）
- 文件名
当前目录下的文件名或子目录名

- 对象ID
指向blob或子tree的哈希值

**示例**\
假设项目结构如下
```css
project/
 ├─ readme.txt
 ├─ src/
 │   ├─ main.c
 │   └─ util.c
```

在Git里会表示为
```scss
tree (root)
 ├─ 100644 readme.txt → blob(哈希 a1)
 └─ 040000 src        → tree(哈希 t1)

tree (t1, src/)
 ├─ 100644 main.c → blob(哈希 b1)
 └─ 100644 util.c → blob(哈希 c1)
```

可以用命令来查看tree：
```bash
git ls-tree HEAD
```
输出示例
```css
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391    readme.txt
040000 tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904    src
```
再进入子目录
```bash
git ls-tree <tree_hash>
```

### Commit（提交对象）
- 记录一次快照，内容包括：
  - 指向一个tree（当前项目根目录快照）
  - 指向父提交（一个或多个）
  - 提交信息（author, committer, message）
- 形成一个链表（或DAG，有分支时）

**内部结构**\
一个commit对象的原始内容大致是这样（用`git cat-file -p <commit>`可以查看）
```sql
tree <tree_hash>
parent <parent_commit_hash>
author Alice <alice@example.com> 1693300000 +0800
committer Alice <alice@expample.com> 1693300000 +0800

Add new feature X
```
字段说明：
- tree
指向本次提交的根tree对象（完整快照）

- parent
父提交的哈希（初始提交没有parent，合并提交可能有多个parent）

- author
原作者信息（谁写的代码，什么时候写的）

- committer
实际提交到仓库的人（可能和作者不同，比如代码由别人代提交）

- message
提交说明

因为commit保存了parent指针，多个commit串起来就是一个链，这就是`git log`看到的历史\
而且，因为一个commit可能有多个parent（分支合并），历史记录实际是一个有向无环图（DAG）

**commit与分支的关系**
- 分支本质上就是一个指向commit的引用
- HEAD决定了你当前在哪个commit/分支

所以分支很轻量，本质只是一个指针而已

**特性**
1. 不可变性
  - commit内容一旦写入，哈希就固定
  - 修改commit = 生成新的commit

2. 可溯源性
  - 每个commit都指向父commit
  - 历史完整可追踪

3. 高效性
  - 因为commit只是指针 + 元数据，本身很小
  - 实际文件快照在tree + blob里存储

#### DAG（Directed Acyclic Graph，有向无环图）
- 有向：边有方向，commit A指向 commit B 表示 B 是 A 的父提交
- 无环：图里没有回路，历史不能回到自己

在Git中
- 节点 = commit
- 边 = parent 指针（指向父commit）
- DAG描述了整个项目的历史结构

##### 作用
1. 记录完整历史
  - 任何commit都能追溯到初始提交
  - Git可以高效地遍历历史、计算差异、生成日志

2. 支持分支与合并
  - 分支只是指向DAG中某个commit的指针
  - 合并commit指向多个parent -> 表示历史分支合并

3. 保证不可篡改
  - 每个commit的hash取决于tree + parent + 元数据
  - 改变任何 commit -> 整个后续DAG都会变化
  - 所以历史是不可篡改的

##### DAG 与 Git 操作的对应

| 操作 | DAG内部表现 |
| - | - |
| `git commit` | 创建新节点，parent指向当前HEAD |
| `git branch` | 创建指针指向某节点 |
| `git merge` | 新 commit 指向多个 parent |
| `git rebase` | 重新建立一条新的DAG（生成新的 commit 节点） |
| `git log` | 遍历 DAG |

##### 图示
```css
A -- B -- C (main)
      \
       D -- E (feature)
```
- `A` -> 初始提交
- `B` -> 两个分支的共同祖先
- `C` -> main分支继续
- `D` -> feature分支
- `E` -> feature分支继续

在合并时
```lua
C ----- F (merge commit)
D ---/
```
- `F`的parent = `C`和`E`
- DAG仍然无环，有向边表示时间流向


### Tag（标签对象）
- 给特定的commit起一个名字
- 可以是轻量标签（直接引用commit），也可以是带元信息的标签对象

## Git的内部机制
### 哈希存储
Git存储的**每个对象（blob、tree、commit、tag）**都不是按文件名存放的，而是
- 计算对象的哈希值（SHA-1 或 SHA-256）
- 用这个哈希作为对象的“唯一ID”
- 对象存储在`.git/objects/`目录下，以哈希前两位作为子目录，后38位作为文件名

例如，一个blob的哈希是
```nginx
e69de29bb2d1d6434b8b29ae775ad8c2e48c5391
```
存储路径会是
```bash
.git/objects/e6/9de29bb2d1d6434b8b29ae775ad8c2e48c5391
```

**哈希计算**
```ini
hash = SHA1( "<类型> <大小>\0<内容>" )
```

**优点**
1. 唯一性
  - 每个对象的ID由哈希决定
  - 如果内容一样，哈希必然一样 -> 自动去重
  - 如果内容不同，几乎不可能哈希冲突

2. 不可变性
  - 一旦写入，内容和哈希绑定
  - 改变任何一个字节 -> 哈希值完全不同
  - 保证历史数据不会被篡改

3. 完整性校验
  - Git可以随时重新计算哈希，验证对象是否被破坏
  - 这就是为什么Git仓库能很容易检测到损坏或篡改



### 分支和引用（Refs）
#### 分支
分支本质上是一个指向commit的指针，它本身不存文件或快照，只存一个commit哈希\
切换分支，其实就是移动HEAD指针到不同分支对应的commit

#### 引用
refs = Git中的命名指针
- 类型：
  1. heads -> 分支指针
    - `.git/refs/heads/main` -> commit A
    - `.git/res/heads/feature` -> commit B
  
  2. tags -> 标签指针
    - `.git/refs/tags/v1.0` -> commit A
  
  3. remotes -> 远程分支指针
    - `.git/refs/remotes/origin/main` -> commit A
- Git操作分支/checkout/merge，本质上就是移动引用指针

#### HEAD指针
- HEAD = 当前所在位置
- 可以指向一个分支
```bash
HEAD -> refs/heads/main
```
也可以直接指向某个commit（游离HEAD状态）
```css
HEAD -> commit B
```

- 操作分支就是移动HEAD和分支引用的指针
```bash
git checkout feature
```
实际上就是：
```bash
HEAD -> refs/heads/feature
```

3. 暂存区（Index/Stage）
  - 位于`.git/index`文件中
  - 作用：记录工作区哪些文件的哪些版本会进入下一个commit
  - 可以理解为“即将要提交的快照”

## Git的工作流程
1. 暂存`git add`
  - 计算文件内容的哈希 -> 存为 blob对象
  - 在index里记录：文件名 -> blob哈希
2. 提交`git commit`
  - 把index中的所有记录打包成一个tree对象
  - 生成一个commit对象，指向这个tree，并附带提交信息、父提交
  - 更新当前分支引用（refs/heads/xxx -> 新 commit）

3. 查看历史`git log`
  - 顺着commit的父指针，一直往前追溯
  - 形成一个有向无环图（DAG）

4. 分支与合并
  - 新建分支 = 新建一个指针，指向当前commit
  - 合并时，Git会尝试把两个分支的DAG合并在一起（可能触发三方合并）

5. `git checkout` & `git reset`
  - `git checkout`：移动`HEAD`，切换到某个提交或分支
  - `git reset`：移动分支指针本身