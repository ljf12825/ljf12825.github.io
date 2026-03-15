---
title: show-ref
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: log
summary: git show-ref
---

`git show-ref`专门用于列出和验证Git仓库中的引用

## 注解
在Git中，“引用”是一个指向提交的指针。最常见的引用就是分支和标签
- 分支引用：位于`ref/heads/`下，例如`ref/heads/main`指向`main`分支的最新提交
- 标签引用：位于`ref/tags`下，例如`refs/tags/v1.0`指向一个特定的提交（通常是发布版本）
- 远程跟踪分支引用：位于`refs/remotes`下，例如`refs/remotes/origin/main`记录了最后一次从远程仓库`origin`的`main`分支获取的提交

`git show-ref`的作用就是将这些引用和它们指向的提交ID（SHA-1哈希值）清晰地打印出来

## 核心功能
`git show-ref`的核心工作是显示Git仓库中的所有引用及其对应的SHA-1值。引用包括分支、标签、远程跟踪分支等

## 基本用法
在不加任何参数的情况下，`git show-ref`会列出所有本地引用（包括分支、标签和远程跟踪分支）
```bash
$ git show-ref
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b refs/heads/main
c4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b refs/heads/feature-branch
d4a5d3e7e4a4e4a4e4a4e4a4e4a4e4a4e4a4e4a4 refs/tags/v1.0
e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4 refs/remotes/origin/main
```
每一行都遵循`<哈希值> <引用路径>`的格式

## 常用选项和参数
`git show-ref`提供了几个非常实用的选项来过滤和格式化输出

- 只显示本地分支（`--heads`）即`ref/heads/`下的内容
```bash
$ git show-ref --heads
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b refs/heads/main
c4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b refs/heads/feature-branch
```

- 只显示标签（`--tags`）即`ref/tags/`下的内容
```bash
$ git show-ref --tags
d4a5d3e7e4a4e4a4e4a4e4a4e4a4e4a4e4a4e4a4 refs/tags/v1.0
e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5 refs/tags/v1.1
```

- 只显示远程跟踪分支（`--heads`和特定模式）
```bash
$ git show-ref --heads refs/remotes
e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4 refs/remotes/origin/main
f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5 refs/remotes/origin/develop
```

- `--dereference`
对于指向其他对象（而不是直接指向提交）的附注标签，这个选项会显示多一行信息。每一行是标签对象本身的哈希值，第二行（以`^{}`结尾）是这个标签最终指向的提交的哈希值
```bash
# 假设 v1.0 是一个附注标签
$ git show-ref --tags --dereference
e5f6a7b8c9d... refs/tags/v1.0        # 标签对象本身的哈希值
a1b2c3d4e5f... refs/tags/v1.0^{}     # 标签最终指向的提交哈希值
g7h8i9j0k1l... refs/tags/v1.1        # v1.1 是轻量标签，直接指向提交
```

- `-s`或`--hash`
只显示哈希值，不显示引用路径。这在编写脚本时特别有用，因为可能只需要获取哈希值
```bash
$ git show-ref --heads -s
f1e8e6e8a5c...
a1b2c3d4e5f...
```

- `--verify`
以严格模式运行，必须提供一个具体的引用路径作为参数。通常用于在脚本中检查某个引用是否存在
```bash
# 检查 main 分支是否存在
$ git show-ref --verify refs/heads/main
a1b2c3d4e5f... refs/heads/main

# 如果引用不存在，命令会返回错误码且无输出
$ git show-ref --verify refs/heads/non-existent-branch
error: refs/heads/non-existent-branch does not exist
```

- 指定引用模式
可以使用通配符来过滤特定的引用
```bash
# 列出所有以 ‘feat’ 开头的分支
$ git show-ref --heads 'refs/heads/feat*'
```