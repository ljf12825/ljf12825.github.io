---
title: Worktree
date: 2025-12-31
categories: [Git]
tags: [Mechanism, Command, Porcelain]
author: "ljf12825"
type: log
summary: Git Worktree
---

Git Worktree允许在一个仓库中同时处理多个工作区（working directory），而不必克隆多个仓库\
通过Worktree，可以在不同的分支上工作，且这些分支分别有自己的独立工作区，这样避免了在同一个工作区中切换分支产生的干扰\
简单来说，Worktree的存在意义就是把分支映射为根目录下的文件夹，避免了分支切换带来的负面影响

## 基本概念
Git中`worktree`是一个与仓库中的数据区（repsitory data）相关联的工作目录\
通常情况下，会在一个工作区中进行开发，比如你有一个主分支`main`，你在该分支上工作，切换到另一个分支时，Git会清理工作目录并加载目标分支的内容。这意味着你无法同时在多个分支上进行开发

而Git Worktree解决了这个问题，它允许你在一个仓库中创建多个工作区，每个工作区都可以独立地操作不同分支。例如，你可以在一个工作区上开发`feature-a`分支，在另一个工作区上开发`feature-b`分支，这两个工作区之间互不干扰

## Git Worktree命令
### 添加工作区
`git worktree add`是创建新工作区的命令，使用时可以指定一个新的路径和分支名。如果指定的分支不存在，Git会自动为你创建该分支
```bash
git worktree add <path> <branch>
```
- `<path>`：新的工作区路径
- `<branch>`：目标分支名。如果该分支不存在，Git会创建一个新的分支并切换到该分支

**示例**
```bash
git worktree add ../feature-branch feature-branch 
```
这会在当前目录的父目录下创建一个新的工作区`feature-branch`，并切换到该分支。此时你可以在`../feature-branch`目录中独立工作

### 移除工作区
如果你不再需要某个工作区，可以通过`git worktree remove`命令将其移除。移除的只是该工作区的文件，并不会影响到Git仓库的历史或分支
```bash
git worktree remove <path>
```

### 列出所有工作区
可以使用`git worktree list`命令来查看当前所有的工作区和他们对应的分支
```bash
git worktree list
```

### 查看工作区的状态
与普通的Git仓库相同，可以在工作区中执行`git status`来查看当前分支的状态，查看那些文件被修改，那些文件被暂存等\
可以在多个工作区中同时进行开发，每个工作区都拥有独立的`git status`，不会互相干扰

## 工作区和仓库的关系
- 共享Git仓库：Git Worktree是基于同一个Git仓库工作的，即多个工作区共享同一个`.git`目录。Git仓库中的对象（commits、branches等）不会被重复存储，而是直接共享。这意味着磁盘空间得到了节省
- 独立工作区：每个工作区都有自己独立的文件系统环境，允许你对不同分支进行独立的操作。你可以在不同的工作区中自由切换分支，而不需要每次切换时将工作区内容清空或切换

## 工作流示例
### 并行开发多个功能
假设你正在开发一个功能`feature-1`，并且在开发过程中，团队需要你处理一个急需修复的bug 
- 你可以在当前的工作区继续开发`feature-1`，然后使用Git Wokrtree创建一个新的工作区，切换到`main`分支修复bug 
```bash
# 在当前工作区上开发feature-1
# 创建一个新的工作区用于修复 bug
git worktree add ../bugfix main 
```
- 可以在`../bugfix`目录中进行bug修复，并且这个操作不会影响到你在`feature-1`上的开发

### 使用工作区来测试不同版本
假设你想要对比`main`分支和`feature-1`分支的变化，可以在一个工作区中检查`main`，在另一个工作区中检查`feature-1`，此时你可以同时对比两个分支的差异
```bash
# 创建一个工作区用于 main 分支
git worktree add ../main main 
# 创建另一个工作区用于 feature-1 分支
git worktree add ../feature-1 feature-1
```
然后可以分别在`../main`和`../feature-1`目录中查看文件差异，进行对比

### 保持多个功能开发的独立性
如果需要同时开发多个功能或修复多个bug,并且希望它们独立地进行，你可以为每个功能/bug创建一个工作区。这可以避免在切换分支时对工作区内容造成的干扰
```bash
# 在当前工作区开发 feature-1
git worktree add ../feature-2 feature-2
git worktreee add ../bugfix bugfix 
```
这时，可以分别在`../feature-2`和`../bugfix`工作区中进行开发，它们互不干扰

## 推送远端
每个工作区对应远端一个分支，根目录也会对应一个分支\
每个工作区目录改动后，根目录的Git状态也会发生改变\
因此，建议将根目录作为工作区管理目录，不要放其他内容\

## 优势与局限
**优势**
- 节省空间：工作区共享同一个Git仓库的对象库（objects），不会重复下载相同的数据
- 并行开发：可以在不同的工作区中并行开发不同的分支，提升开发效率
- 简化操作：避免频繁切换分支时丢失工作内容或遇到合并冲突

**局限**
- 操作复杂性：Git Worktree的使用比普通的Git分支切换更复杂，特别是当你有多个工作区时，需要小心管理它们，特别注意：要关注当前所在路径，因为不同路径对应不同的分支
- 文件系统限制：某些操作系统可能会对多个工作区的文件路径长度或文件数量有一些限制
