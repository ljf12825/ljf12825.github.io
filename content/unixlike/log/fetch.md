---
title: fetch
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git fetch
---

`git fetch`的作用是
- 把远程仓库的更新下载到本地
- 更新远程跟踪分支（如`origin/main`）
- 不会修改档期按工作区或本地分支

```bash
git fetch <远程名> <分支名>
```
例子
```bash
git fetch origin main
```
结果：
- 远程有新提交 -> 本地`origin/main`更新
- 你的`main`不会变

**用法场景**\
想先看看远程改了什么，再决定怎么合并
```bash
git fetch origin main
git diff main origin/main
```

`fetch`的原理是从远程获取缺失对象，更新本地`refs/remote/origin/xxx`指针

**常用参数**
- `git fetch <remote>`
拉取指定远程仓库的更新
```bash
git fetch origin
```

- `--all`
获取所有远程仓库的更新
```bash
git fetch --all
```

- `--tags`
拉取所有远程仓库的标签
```bash
git fetch --tags
```

- `--prune`
删除远程仓库已删除的分支
```bash
git fetch --prune
```

- `--depth <depth>`
限制获取历史的深度，适用于获取较小的历史（浅克隆）
```bash
git fetch --depth 1 origin
```

- `--dry-run`
模拟拉取操作，不执行实际的拉取，只查看将会获取的内容
```bash
git fetch --dry-run
```

## 推荐协作习惯
- 拉取用`fetch` + `rebase`而不是直接`pull`
```bash
 git fetch origin
 git rebase origin/main
 ```
这样提交历史更干净（避免多余的merge commit）

- 推送前先拉取