---
title: Subtree
date: 2025-12-31
categories: [Git]
tags: [Mechanism, Command, Porcelain]
author: "ljf12825"
type: log
summary: Git Subtree
---

Git子树是一种在Git仓库中嵌套和管理另一个独立Git仓库的方法。它允许你将外部项目的外争代码库（包括其历史记录）作为主项目的一个子项目来管理

## 核心概念
主项目`Project-A`需要依赖一个第三方库`Library-B`，有几种选择：
1. 直接复制粘贴代码：丢失`Library-B`的所有历史，且难以更新
2. 使用Git子模块：创建一个链接，但需要仓库使用者额外初始化，增加了复杂性
3. 使用Git子树：将`Library-B`的代码和历史记录合并到`Project-A`的一个子目录（如`libs/Library-B`）中

子树的核心思想是第3种。对于主仓库来说，外部仓库的文件就是它自己的文件，存在于一个特定的子目录中

## 子树的关键特性
1. 单一仓库
  - 使用子树的仓库是一个完整的、独立的仓库
  - 克隆主项目时，子树的内容会一次性被克隆下来，不需要像子模块那样额外的`git submodule update --init`步骤
2. 保留历史
  - 子树合并会保留外部项目的完整提交历史。你可以在主项目的历史中看到诸如`Add 'libs/Library-B' from commit <hash>`的提交，并且可以`git log`进入到子目录查看该库原本的提交记录
3. 管理双向工作流
  - 单向依赖：如果你只是使用一个第三方库（如jQuery），并且不打算修改它，子树可以很方便地让你拉取上游的更新
  - 双向贡献：如果你既要在主项目中使用这个库，又需要对这个库本身进行修改并贡献回原始项目，子树也能通过`subtree push`命令支持

## read-tree
`git read-tree`是一个plumbing命令，意味“管道”命令，是为脚本和其他Git命令提供基础操作的底层命令。普通用户在日常使用中很少调用它

它的核心功能是：将指定的树对象（Tree Object）读取到Git的暂存区（Index），替换或合并当前暂存区的内容

```bash
# 将某次提交的树读入暂存区，覆盖当前暂存区
git read-tree <commit-hash>
```
执行后，`git status`会显示工作区文件和暂存区之间的大量差异，因为暂存区已经被替换成了那个提交的状态

`read-tree`有几个重要的选项，与子树相关
- `-m`：执行合并。它可以将最多三个树对象（共同的祖先、我们的版本、他们的版本）合并到暂存区
- `--prefix=<path>`：这是关键。这个选项允许你将读取的树对象不是放在暂存区的根目录，而是放在一个指定的子目录下

### 示例：手动实现“引入一个外部项目”的例子
假设你想把B作为子目录`vendor/project-b`放入项目A中
```bash
# 在项目A的仓库中
# 1. 将项目B的远程仓库添加为一个远程源
git remote add project-b <url-to-project-b>

# 2. 获取项目B的所有数据
git fetch project-b

# 3. 使用 read-tree 将项目B的main分支的树，读入暂存区的 `vendor/project-b/`目录下
git read-tree --prefix=vendor/profect-b/ -u project-b/main 
```
- `--prefix=vendor/project-b/`：告诉Git,把project-b/main的文件树放到这个子目录里
- `-u`：选项让`read-tree`同时更新工作区，所以你会在文件系统中立刻看到`vendor/project-b/`目录以及其里面的文件
- 执行完后，暂存区已经准备好了这次更新，你只需要执行`git commit`即可

这就是`git read-tree`在“子树”操作中扮演的角色：它负责将另一个仓库的完整文件树“嫁接”到当前仓库的一个子目录中

## subtree
`git subtree`是一个porcelain命令，意为“瓷器”命令，是面向用户的、更友好的高级命令。它是一个脚本，封装了包括`git read-tree`在内的一系列底层操作，让子树管理工作变得非常简单\
它解决了手动使用`read-tree`时的一些复杂问题，比如：
- 历史记录的合并：如何保持子目录的历史记录
- 代码的推送和拉取：如何将子目录的更改推回其原始仓库

### `git subtree`的核心子命令
- `git subtree add`
  - 功能：将一个仓库作为子目录加入当前项目
  - 底层：它内部会调用类似`git read-tree --prefix=...`的命令
  - 示例
```bash
git subtree add --prefix=vendor/project-b <url-to-project-b> main --squash 
```
  - 这会将project-b的`main`分支合并到本地的`vendor/project-b`目录
  - `--squash`选项会将子项目的所有历史合并为一次提交，保持主项目历史的整洁；如果想保留历史，去掉此项

- `git subtree pull`
  - 功能：像`git pull`一样，更新子目录的内容
  - 示例
```bash
git subtree pull --prefix=vendor/project-b <url-to-project-b> main --squash
```

- `git subtree push`
  - 功能：将你的子目录所做的更改推回其原始仓库
  - 示例
```bash 
git subtree push --prefix=vendor/project-b <url-to-project-b> feature-branch 
```

| 特性 | `git read-tree`（底层）| `git subtree`（高层）|
| - | - | - |
| 角色 | 底层构建块 | 用户友好的工具 |
| 用途 | 直接操作暂存区中的树 | 管理项目中的子项目依赖 |
| 复杂性 | 高、需要理解Git内部原理 | 低、命令直观易用 |
| 历史管理 | 需要手动处理、可能很复杂 | 自动处理，可以保持或压扁历史 |
| 工作流 | 常用于脚本或自定义合并策略 | 用于日常的子项目更新和同步 |

## 子树的优缺点
优点
- 简化工作流：对于仓库使用者来说是透明的，他们看到的是一个完整的项目
- 兼容性好：不需要任何特殊的Git配置或版本，也适用于任何支持Git的托管平台（如GitHub, GitLab）
- 统一管理：所有代码（自己和依赖的）都在一个仓库里，便于分支、标签和发布管理

缺点
- 仓库体积增大：因为将外部项目的历史合并进来，所以主仓库的体积会变大
- 历史可能变得复杂：如果不使用`--squash`，主项目的提交历史会混入大量外部项目的提交记录，可能影响可读性
- 推送更改稍显复杂：向原始项目推送修改需要使用`git subtree push`，这个命令有时会比较慢，且需要小心处理冲突

## 历史融合
当执行`git subtree add`时，Git的底层机制是
1. 读取子树仓库的完整对象历史到你的主仓库的对象数据库中
2. 将子树的历史与主仓库历史合并
3. 在指定前缀（子目录）下创建文件树

> 子仓库的`.git`内容被“消化吸收”进了主仓库的`.git`目录中，而不是作为一个独立的`.git`文件夹存在

### 底层原理
Git通过树对象来管理目录结构。执行`git subtree add`后
1. 子仓库的所有blob（文件内容）和tree（目录结构）对象被导入主仓库的objects数据库
2. 在主仓库中创建一个新的commit,将子仓库的树对象链接到指定的前缀路径下
3. 所有这些对象都存储在同一个`.git/objects`目录中

## Subtree vs Submodule

| 特性 | 子树 | 子模块 |
| - | - | - |
| 克隆难度 | 简单，`git clone`一次完成 | 需要`git submodule update --init` |
| 仓库大小 | 较大（包含所有依赖的历史）| 较小（只存储连接）|
| 历史记录 | 合并到主仓库历史中 | 完全独立于主仓库 |
| 更新依赖 | 需要显示地`git subtree pull` | 需要显示地`git submodule update` |
| 修改依赖 | 直接在主项目中修改 | 需要进入子模块目录修改并提交 |
| 适用场景 | 依赖关系紧密，经常共同修改 | 依赖关系松散，希望严格锁定版本 |
