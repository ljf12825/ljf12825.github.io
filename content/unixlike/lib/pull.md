---
title: pull
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: git pull
---

`git pull`的作用是从远程拉取并合并到本地，是`git fetch` + `git merge`的组合
- 先下载远程最新提交到本地的远程跟踪分支
- 再自动和当前分支合并

```bash
git pull <远程名> <分支名>
```
例子
```bash
git pull origin main
```
过程
1. 从远程`origin`拉取`main`最新提交到`origin/main`
2. 把`origin/main`合并到当前分支

**常见问题**
- 自动合并可能产生冲突，需要手动解决
- 如果想避免自动合并，可以改用
```bash
git fetch origin main
git rebase origin/main # 或 merge
```

**常见参数**
- `git pull <remote> <branch>`
拉取指定远程分支的最新更改并合并
```bash
git pull origin main
```

- `--rebase`
拉取时使用`rebase`而不是`merge`，将本地提交应用到最新的远程提交后面，而不是创建合并提交
```bash
git pull --rebase origin main
```

- `--no-rebase`
禁用默认的`rebase`，强制使用`merge`来合并
```bash
git pull --no-rebase origin main
```

- `--ff-only`
只允许快进合并（Fast-forwarding merge）。如果有新的合并提交，它会中止操作
```bash
git pull --ff-only origin main
```

- `verbose`
显示详细的操作信息
```bash
git pull --verbose
```