---
title: checkout
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: git checkout
---

`git checkout`是Git中最早的命令之一，也是最常用、最强大的命令之一\

### 作用
`git checkout`命令是Git中的多功能工具，用于以下几种主要操作
- 切换分支：在不同的分支之间切换
- 恢复文件：恢复工作目录中的文件到制定的提交状态
- 创建新分支并切换：创建新分支并立刻切换过去
- 查看历史版本：切换到某个历史提交，查看代码在那个时刻的状态

### 使用
基本语法
```bash
git checkout [options] <branch-or-commit> -- <file>
```
- `branch-or-commit`：可以是分支名，也可以是提交的哈希值
- `<file>`：指定某个文件，或者如果没有提供文件，则会影响整个工作区

1. 切换分支

```bash
git checkout <branch>
```
最常见的`git checkout`用法就是切换分支。这是Git中最常用的操作之一，当在开发过程中需要从一个功能分支切换到另一个功能分支时，可以使用该命令\
示例\
假设正在工作于`feature-1`分支，但现在需要切换到`feature-2`分支
```bash
git checkout feature-2
```
这条命令会：
- 切换到`feature-2`分支
- 更新工作目录，使其包含`feature-2`分支上最新的提交

注意事项
- 如果有未提交的更改，Git会阻止切换分支，以避免当前工作丢失，可以通过`git status`查看当前工作区状态
- 如果希望强制切换，可以使用`git checkout -f <branch>`（谨慎使用）

2. 创建并切换新分支
```bash
git checkout -b <new-branch>
```
`git checkout`可以通过`-b`选项创建并立即切换到一个新的分支

示例\
假设正在开发某个功能并希望在当前工作基础上创建一个新分支`feature-3`
```bash
git checkout -b feature-3
```
这条命令会：
- 在当前分支的基础上创建一个新的`feature-3`分支
- 自动切换到`feature-3`分支

注意事项
- 新分支是基于当前分支的最新提交创建的。如果在切换前有未提交的更改，最好先暂存这些更改
- 如果希望新分支跟踪远程分支，可以通过`git checkout -b <new-branch> origin/<remote-branch>`来实现

3. 恢复文件到指定版本
```bash
git checkout -- <file>
```
在开发过程中，可能会有一些临时的修改，且不希望这些修改被提交，使用`git checkout`可以恢复文件到某个提交版本\
示例\
当修改了`file.txt`，但现在决定放弃这些更改并恢复到上一个提交的版本
```bash
git checkout -- file.txt
```
这条命令会：
- 恢复`file.txt`到最新提交的状态
- 删除对该文件的所有未提交更改

注意事项
- 使用`git checkout -- <file>`会丢失对该文件的所有未提交更改
- 如果只是想暂时保存更改以便稍后恢复，可以使用`git stash`

4. 恢复到某个历史提交
```bash
git checkout <commit-hash>
```
`git checkout`也可以用于切换到历史提交，查看历史版本的文件内容。这个操作不会改变当前的分支，但可以查看代码在某个时刻的状态

示例\
假设想查看某个历史提交的状态，并切换到该提交
```bash
git checkout <commit-hash>
```
这条命令会：
- 切换到指定的提交
- 更新工作区的文件，反映该提交时的状态

注意事项
- 使用`git checkout <commit-hash>`会进入“分离头指针”状态，即HEAD不再指向某个分支，而是指向某个提交。这时，任何新的提交都不会影响到任何分支
- 如果想要恢复到分支状态，可以使用`git checkout -`，回到上一个分支

5. 切换远程分支
```bash
git checkout -b <branch> origin/<remote-branch>
```
如果想从远程仓库切换到一个远程分支，可以通过`git checkout`来创建一个本地分支并与远程分支建立跟踪关系

示例\
假设想切换到远程仓库`feature-4`分支
```bash
git checkout -b feature-4 origin/feature-4
```
这条命令会
- 创建一个本地分支`feature-4`
- 将它与远程分支`origin/feature-4`建立跟踪关系

### 参数
1. `-b`：创建并切换到新分支
2. `-f`：强制切换分支
3. `--track`：设置跟踪分支
用于为本地分支创建一个与远程分支的跟踪关系，通常用于从远程仓库检出分支时。这个选项会将本地分支设置为跟踪远程分支
```bash
git checkout --track origin/<remote-branch>
```
示例
```bash
git checkout --track origin/feature-1
```
这会创建一个本地分支`feature-1`，并且该分支会跟踪远程分支`origin/feature-1`

4. `--orphan`：创建一个没有历史记录的新分支
```bash
git checkout --orphan <new-branch>
```

5. `--`：恢复文件
6. `<commit-hash>`：切换到某个特定提交
7. `-`：返回到上一个分支
8. `<branch>`：切花到指定分支
9. `--no-track`：不建立跟踪分支
创建一个新的分支并不像将它与远程分支关联

10. `--recurse-submodules`：递归更新子模块
11. `-m`：合并更改
如果在切换分支时遇到冲突并且希望Git自动合并更改
```bash
git checkout -m <branch>
```

### 本质
`git checkout`的本质是移动HEAD指针。当执行`git checkout`时，Git会更新HEAD的位置，将它指向所指定的分支、提交或文件状态\
除了移动HEAD，`git checkout`还会更新工作目录，使其与目标分支或提交的内容一致，这就导致工作目录中有未提交的修改时，在试图切换分支时，Git会阻止并提示冲突\
对于暂存区，切换分支时，Git会将暂存区的文件更新为目标分支的状态。如果在切换分支时有暂存的更改，Git会根据当前的分支状态来决定如何处理这些更改

### 分支切换冲突
在Git中切换分支时遇到冲突，通常是因为当前工作区（即本地的修改）与目标分支的内容发生了冲突。Git无法自动合并这些更改，因此会阻止分支切换，并提示存在冲突。冲突的发生通常有以下几种原因：
1. 当前分支有未提交的更改
如果在当前分支上有未提交的更改，而这些更改与目标分支上的内容不兼容，Git无法完成分支切换。此时，Git会提示进行处理\
示例
- 在`feature-1`分支上修改了`file.txt`文件，并且没有提交这些修改
- 尝试切换到`feature-2`分支，而`feature-2`分支上的`file.txt`也发生了修改，并且这些需改与`feature-1`分支上的修改不兼容

Git会检测到这种冲突，并阻止切换分支

解决方法
- 提交当前更改：在切换分之前，提交更改
- 暂存更改：切换分支后恢复
- 放弃更改：`git checkout -- <file>`

2. 目标分支的修改与当前分支有冲突
即使没有未提交的修改，如果目标分支和当前分支的文件内容发生了冲突，Git也会阻止切换分支

解决方法：
- 使用`git diff`查看差异
- 手动解决冲突

3. Git的 Detached HEAD
如果在 Detached HEAD状态下工作，也就是检出了一个具体的提交，而不是某个分支，Git在切换分支时可能会遇到一些问题，尤其是有未提交的更改并且这些更改与目标分支不兼容

解决方法：
- 确保提交更改：在切换分支之前，确保更改被提交或暂存
- 回到分支：避免在Detached HEAD下长期工作

4. 修改了Git配置的内容（如`.gitignore`、`config`）
如果这些修改与目标分支的配置文件冲突，Git也会在切换分支时遇到问题

5. Git忽略文件或子模块冲突
如果项目中使用了子模块，或者某些文件被Git忽略（例如`.gitignore`中指定的文件），也可能会导致切换分支时出现冲突。特别是如果目标分支中有不同的子模块版本或者不同的文件状态，Git可能无法自动处理这些差异

解决方法：
- 更新子模块：`git submodule update --init --recursive`
- 清理未跟踪文件：`git clean`

#### 发生冲突的原理
Git的本质是通过工作目录和暂存区来管理文件的修改和版本。当在当前分支上修改了文件，Git会把这些修改记录在工作目录中（即尚未提交的修改）。如果尝试切换到另一个分支，而这个分支上的同一文件也被修改了，Git就无法确定该如何合并这两者的修改，因此会发生冲突
- 工作目录与目标分支的差异：Git在切换分支时，会尝试更新工作目录中的文件，使它们反映目标分支上的内容。如果在当前分支上有未提交的修改，且这些修改与目标分支的内容有冲突，Git就无法自动解决这些冲突
- 目标分支与当前分支的修改不兼容：如果目标分支中的文件和当前分支中的文件在相同位置或相同内容上有不兼容的修改，Git也会提示冲突

**Git为了保证数据安全，并没有对切换分支后的未提交工作区内容进行舍弃，而是交由用户自己决断**

由于`git checkout`功能过多，Git2.23引入了两个新命令：
- [`git switch`](/Switch.md)：专门用于分支切换
- [`git restore`](/Restore.md)-专门用于文件恢复