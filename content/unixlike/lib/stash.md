---
title: stash
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: git stash
---

`git stash`是Git中用来保存当前工作进度并清理工作目录的命令，通常在你正在做某项工作时，突然需要切换到其他分支去处理紧急任务，而不想提交当前的修改。`git stash`会将这些未提交的更改保存起来，使你可以切换到其他分支，然后再恢复之前的工作

## 基本用法
1. 保存当前的更改
使用`git stash`来保存当前工作目录和暂存区的所有更改
```bash
git stash
```
- 这将会保存暂存区和工作目录中的所有未提交的更改，并且把它们从当前工作目录中移除

2. 查看保存的更改
你可以通过`git stash list`查看当前所有的stash项目：
```bash
git stash list
```
输出示例：
```bash
stash@{0}: WIP on master: 9a8d2ab 修改了文件A
stash@{1}: WIP on feature_branch: d3c5a9e 修改了文件B
```

3. 恢复已保存的修改
你可以使用`git stash pop`来恢复最后一次保存的修改，并且删除该stash项
```bash
git stash pop
```
如果你只想恢复某个特定的stash项目，可以指定他：
```bash
git stash pop stash@{1}
```
如果你只想恢复更改但不删除它，可以使用`git stash apply`
```bash
git stash apply
```
同样可以指定某个特定的stash项目：
```bash
git stash apply stash@{1}
```

4. 删除已保存的更改
有时你不需要恢复某个stash项目，只想将它删除，可以使用`git stash drop`
```bash
git stash drop stash@{0}
```
要删除所有stash项目：
```bash
git stash clear
```

5. 保存部分更改
默认情况下，`git stash`会保存工作目录和暂存区的所有修改。如果你只想保存工作目录的更改，可以使用：
```bash
git stash -k # --keep-index
```
如果你只想保存暂存区的更改而不包括工作目录的修改，可以使用：
```bash
git stash -u # --include-untracked
```

6. 查看更改
如果你想查看某个stash项的具体内容，可以使用`git stash show`，并加上`-p`来查看详细的差异：
```bash
git stash show -p stash@{0}
```

## stash的本质
`git stash`将会把当前工作目录和暂存区的更改（包括修改和新增文件）保存到Git的内部存储区域，这个区域不属于任何分支，它是一个特殊的引用，保存在`.git`目录下的一个栈结构中

### 具体来说，`git stash`会将修改保存到以下位置：
1. 内部存储：
  - `git stash`会将保存的更改保存在Git仓库内部，具体地，它们会存储在`.git/refs/stash`引用文件中，并且在内部以栈的形式存储。这些stash项的内容是不可见的，除非你明确使用`git stash list`、`git stash show`等命令来查看

2. Git的栈结构：
  - Git使用一个栈（Stack）来管理stash的内容，新的stash项会被推入栈顶。栈结构是FILO，也就是说最后一个`git stash`保存的内容会是栈中的第一个（最上面的）项目
  - 每当你执行`git stash`，Git会创建一个新的stash项，并将其保存在栈顶。你可以使用`git stash list`来查看栈中所有的stash项

3. 存储的内容：
  - `git stash`会保存以下内容：
    - 暂存区的修改（staged changes）
    - 工作目录的修改（unstaged changes）
    - 如果使用了`git stash -u`或`git stash --include-untracked`，未追踪文件（untracked files）也会被包含在内
    - 不包括已经提交的内容，即不会影响你本地的commit历史
