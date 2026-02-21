---
title: read-tree
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: log
summary: git read-tree
---

`git read-tree`是一个底层命令，它的核心功能是将一个或多个树对象读入到暂存区（索引）

可以把它理解为直接操作`.git/index`这个文件的“手术刀”。它不处理工作区里的实际文件，只操作索引

## 存在意义
1. 暂存区：Git有一个叫“暂存区”或“索引”的区域，它本质上是一个文件（`.git/index`），记录了当前项目结构和文件的快照，这个快照就是下一次提交的内容
2. 树对象：在Git中，每一次提交都对应一个“树对象”，它记录了该次提交时项目的目录结构和所有文件的blob哈希值

`git read-tree`就是在暂存区和树对象之间架起的一座桥梁

## 主要场景与使用方法
`git read-tree`本身功能强大，但通常不直接在日常工作中使用，而是被更友好的高层命令（如`git merge`, `git chechout`等）在内部调用。理解它有助于理解Git的内部机制\
以下是它的几个主要模式
### 1. 将指定树对象读入暂存区（覆盖）
这是最基础的用法，它用指定的树对象完全覆盖当前的暂存区
```bash
git read-tree <tree-ish>
```
- `<tree-ish>`可以是提交的哈希、分支名、标签名等

示例
```bash
# 将 main 分支最新的提交所对应的树对象读入暂存区
git read-tree main

# 将某个特定的提交哈希对应的树读入暂存区
git raed-tree abc1234
```
执行后：暂存区会变得和`main`分支的最新提交一模一样。工作区的文件还没有变化。如果此时运行`git status`，它会提示暂存区已经更新，但工作区文件需要更新以匹配暂存区（可以通过`git checkout-index -f -a`来同步工作区）

### 2. 将树对象合并到当前暂存区（`-m`）
这是实现合并操作的核心。它可以将2个或3个树对象合并的结果写入暂存区
```bash
# 三路合并（最常用也是最标准合并的方式）
git read-tree -m <base_tree> <out_tree> <their_tree>

# 两路合并（没有共同祖先，容易冲突）
git read-tree -m <tree1> <tree2>
```
- `-m`：执行合并操作
- `base-tree`：共同祖先的树
- `out_tree`：当前所在分支的树
- `their_tree`：要合并进来的分支的树

Git内部工作流程
1. Git比较`base_tree`和`our_tree`，得到当前所在分支做了哪些修改
2. Git比较`base_tree`和`their_tree`，得到要合并进来的分支做了哪些修改
3. 如果修改没有冲突，Git会自动将这些修改合并，并将结果写入暂存区
4. 如果发生冲突（例如同一行被双方修改），Git会在暂存区中记录冲突状态（stages1, 2, 3），而不会在工作区创建`<<<<<<`冲突标记。需要使用`git checkout-index`来将冲突状态应用到工作区文件

### 3. 将树对象读入暂存区的特定前缀下（`--prefix`）
这就像在暂存区创建一个子目录，然后把另一个树对象的内容放进去。这在实现子模块或复杂项目结构时可能用到 
```bash
git read-tree --prefix=subproject/ <tree-ish>
```
示例：\
假设你有一个库的Git仓库，你想把它作为你的主项目的一个子目录
```bash
# 将 lib-foo 仓库的 main 分支树对象读入暂存区的 `vendor/lib-foo/` 目录下
git read-tree --prefix=vendor/lib-foo/ -u lib-foo-branch
```
- `-u`选项会让命令在更新暂存区后，同时更新工作区的文件

## `read-tree`与高层命令的关系
- `git reset --soft <commit>`：在内部，它很可能调用链`read-tree`来将指定提交的树读入暂存区，同时移动HEAD指针
- `git merge`：它的核心合并逻辑就是通过`read-tree -m`来完成了。`git merge`帮你处理了寻找共同祖先、调用`read-tree`、以及处理合并结果（包括在工作区生成冲突标记）这一整套流程
- `git checkout <branch>`：它会调用`read-tree`来更新暂存区和工作区，以及匹配目标分支