---
title: switch
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git switch
---

`git switch`是一个专门用于切换分支的命令。Git在2019发布的2.23版本引入，旨在提供一个更直观、更安全的替代方案

## 核心用法
1. 切换到已存在的分支
```bash
git switch <existing-branch-name>
```

2. 创建新分支并立即切换到该分支
```bash
git -swtich -c <new-branch-name>
```
`-c`标志是`--create`的简写\
等同于
```bash
git checkout -b <new-branch-name>
```

3. 基于某个特定的提交（commit）或分支创建新分支
如果想在一个特定的历史节点（而不是当前分支的最新提交）上创建新分支
```bash
git switch -c <new-branch-name> <start-point>
```
`<start-point>`可以是一个提交的哈希值、一个标签（tag）或另一个分支名

4. 切换到远程分支
当远程创建了一个分支，但你的本地没有，需要下线获取（fetch）这个分支，然后切换到它
相当于
```bash
git checkout --track origin/<remote-branch-name>
```
使用switch为
```bash
# 直接切换，Git会自动为你建立跟踪（tracking）
git swtich <remote-branch-name>
```
如果切换不成功（比如命名冲突），可以使用更明确的命令
```bash
# 明确指定跟踪远程分支
git switch -c <local-branch-name> --track origin/<remote-branch-name>
```

### 常用参数

| 参数 | 全称 | 说明 |
| - | - | - |
| `-c` | `--create` | 创建新分支并切换到它 |
| `-C` | `--force-create` | 强制创建新分支。如果`<new-branch-name>`已存在，它会覆盖已有分支，使用要谨慎 |
| `-d` | `--detach` | 让HEAD进入“分离头指针”状态，切换到某个具体的提交，而不是分支 |
| `-t` | `--track` | 在创建新分支时 ，显式设置要跟踪的远程分支。通常Git会自动处理 |
| `--discard-changes` | | 果断地丢弃工作区和暂存区的修改，以便顺利切换分支。如果有没有提交的更改，Git默认会阻止切换，这个选项可以强制丢弃它们并切换 |