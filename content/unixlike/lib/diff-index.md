---
title: diff-index
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: blog
summary: git diff-index
---

简单来说，`git diff-index`是一个用于比较Git索引（暂存区）与某个特定提交（或树对象）之间的低级别命令
- “低级”命令：这意味着它功能强大且直接，但通常不如我们日常使用的高级命令（如`git diff`、`git status`）那么用户友好。它输出的格式更原始，常用于脚本或作为其他高级命令的底层实现
- 比较对象：它的核心的比较双方是
  - Git索引：也就是暂存区，使用`git add`后文件存放的地方
  - 一个树对象：通常是一个提交（如`HEAD`、某个分支名或commit hash），但也可以是任何树对象

## 基本语法
```bash 
git diff-index [<选项>] <commit> [--] [<路径>...]
```
- `<commit>`：要与之比较的提交，最常见的是`HEAD`
- `[<路径>...]`：可选的路径限制，只比较特定文件或目录
- `--`：可选的分隔符，用于明确表示后面跟的是文件路径，而不是分支或选项

## 示例
1. 比较暂存区与最后一次提交（`HEAD`）
这是最常用的场景，它可以告诉你哪些修改已经被`git add`到了暂存区
```bash 
git diff-index HEAD 
```
输出示例
```text 
:100644 100644 7898192... 0623b42... M      README.md
:100644 100644 6be6f5a... 8da6b8a... M      src/main.py
:000000 100644 0000000... e69de29... A      new_file.txt
```
输出遵循`git diff-index`的格式，每一行代表一个文件的变更
- 模式变更：`:100644 100644`
  - 第一个模式是提交（`HEAD`）中的文件模式
  - 第二个模式是索引（暂存区）中的文件模式
  - `100644`代表普通文件，`100755`代表可执行文件，`160000`代表子模块，`000000`代表文件不存在
- SHA-1哈希：`7898192... 0623b42...`
  - 第一个SHA-1是提交（`HEAD`）中的文件blob哈希
  - 第二个SHA-2是索引（暂存区）中的文件blob哈希
- 状态标识：`M`, `A`, `D`等
  - `M`：文件内容被修改
  - `A`：文件是新添加的
  - `D`：文件被删除
  - `R`：文件被重命名
  - `T`：文件类型被更改（如从普通文件变为链接）
- 文件名：最后的`README.md`是文件名

2. 更友好的输出（使用`--patch`或`-p`）
默认的输出信息量很大但不直观。可以让它输出像`git diff`那样的补丁格式
```bash 
git diff-index -p HEAD 
```
输出示例
```diff 
diff --git a/README.md b/README.md
index 7898192..0623b42 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # My Project
+This is a new line added to the README.
```
这样就能清晰地看到每个文件具体修改了什么内容，和`git diff --cached`的输出非常相似

## 相关命令对比

| 命令 | 比较双方 | 主要用途 |
| - | - | - |
| `git diff-index HEAD` | 索引（暂存区）vs 最后一次提交（`HEAD`）| 查看以暂存的更改（准备提交的更改）|
| `git diff`（无参数）| 工作区 vs 索引 | 查看未暂存的更改（还没有`git add`的更改）|
| `git diff --cached`（或`git diff --staged`）| 索引 vs HEAD | 查看所有更改的总和（包括已暂存和未暂存的）|
| `git diff HEAD` | 工作区 vs HEAD | 查看所有更改的总和（包括已暂存和未暂存）|
| `git status` | - | 给出一个概括性的、人类可读的变更总结，告诉你哪些文件被修改、已暂存或未跟踪 |

`git diff-index HEAD` 在功能上等同于`git diff --cached`
