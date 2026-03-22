---
title: diff
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git diff
---

`git diff`用来比较两个版本之间的差异，以文本形式显示修改了哪些行

它的本质是：
- 计算两份文件的差异（patch）
- 按行标记增加（`+`）、删除（`-`）
- 使用颜色高亮（终端支持时）
> 它不只是比较已提交的版本，还可以比较工作区、暂存区、历史提交等不同状态

**Git的三个状态**\

| 名称                            | 存储位置           | 作用        | 常用命令查看       |
| ----------------------------- | -------------- | --------- | ------------ |
| **工作区（Working Directory）**    | 本地文件系统         | 你正在编辑的文件  | `ls`、编辑器     |
| **暂存区（Staging Area / Index）** | `.git/index`   | 准备提交的文件快照 | `git status` |
| **本地仓库（Repository / HEAD）**   | `.git/objects` | 已提交的版本历史  | `git log`    |

**常用对比场景**\
`git diff`的核心是比较这三者之间的差别

| 命令 | 比较对象| 作用 | 场景举例|
| - | - | - | - |
| `git diff` | **工作区** vs **暂存区** | 查看修改但未 `git add` 的内容 | 检查还没加入暂存区的改动 |
| `git diff --cached` 或 `git diff --staged` | **暂存区** vs **本地仓库（HEAD）** | 查看已 `git add` 但未提交的内容 | 检查提交前的改动 |
| `git diff HEAD` | **工作区** vs **HEAD** | 查看所有未提交的改动（包含未暂存 + 暂存）| 总览全部本地变更 |
| `git diff commitA commitB` | **两个提交** | 比较历史版本 | 看某次功能从 v1 改成 v2 的细节 |
| `git diff branchA branchB` | **两分支最新提交** | 分支差异 | 合并前检查差别 |
| `git diff tagA tagB` | **两个标签** | 版本对比 | 比较正式版本 |

**常用参数**\

| 参数                                             | 作用                  | 示例                                |
| ---------------------------------------------- | ------------------- | --------------------------------- |
| `--name-only`                                  | 只显示修改的文件名           | `git diff --name-only`            |
| `--name-status`                                | 显示文件名 + 修改类型（A/M/D） | `git diff --name-status`          |
| `--stat`                                       | 统计每个文件的修改行数         | `git diff --stat`                 |
| `-p`（默认）                                       | 生成补丁格式              | `git diff -p`                     |
| `--color-words`                                | 按词高亮而不是按行           | `git diff --color-words`          |
| `--word-diff`                                  | 显示逐词修改              | `git diff --word-diff`            |
| `-U<num>`                                      | 控制上下文行数             | `git diff -U0`（只显示改动的行）           |
| `--ignore-space-change` / `--ignore-all-space` | 忽略空格差异              | `git diff --ignore-all-space`     |
| `--no-index`                                   | 比较两个任意文件，不需要 git 仓库 | `git diff --no-index a.txt b.txt` |

**示例**\
假设改了一个文件`main.c`
```diff
diff --git a/main.c b/main.c
index 83db48f..bf269f1 100644
--- a/main.c
+++ b/main.c
@@ -2,7 +2,7 @@
int main() {
-   printf("Hello World\n");
+   printf("Hello Git\n");
    return 0;
}
```
含义：
1. `diff --git a/main.c b/main.c`
  - 比较`a/main.c`（旧版本）和`b/main.c`（新版本）

2. `index`行
  - 显示旧文件和新文件的blod对象ID

3. `---`/`+++`
  - `---`是旧版本文件路径
  - `+++`是新版本文件路径

4. `@@ -2,7 +2,7 @@`
  - `-2,7`：旧文件从第2行起，共7行
  - `+2,7`：新文件从第2行起，共7行

5. `-`开头的行：被删除的内容
6. `+`开头的行：新增的内容

## 底层原理
`git diff`的原理是
1. Git把对比的对象（工作区/暂存区/提交）转换成快照（blob对象）
2. 调用内部的diff算法（最长公共子序列LCS变种）
3. 输出一个统一格式（Unified Diff Format）的补丁

所以它和`diff`命令类似，但Git做了很多优化
- 对二进制用`binary diff`
- 先比较哈希（O(1)）再比较文件内容（O(n)）
- 支持rename detection（检测文件重命名）

## patch file 
- 生成补丁文件
```bash
git diff commitA commitB > change.patch
git apply change.patch
```

### patch file
补丁文件（patch file）是记录文件差异的文本文件，用来告诉别人（或自己）这个项目/文件需要怎么改\
它不是完整的文件副本，而是一个差异描述，按照一定的格式（常见是Unified Diff Format）存储哪些行进行增删\
补丁文件本质上就是git diff的文本化保存

补丁文件的作用
- 版本迁移：把一个版本的改动应用到另一个版本上
- 代码分享：发给别人，让他们再自己的代码上复现你的改动
- 代码审查：方便阅读具体改动（很多代码评审系统背后就是用diff/patch）
- 离线协作：没法用Git仓库时，也能传递修改

补丁文件的使用\
假设有了一个`hello.patch`文件，别人可以在自己的项目种应用
```bash
git apply hello.patch # 只应用改动
git am hello.patch # 应用并生成一次提交（带作者信息）
```
如果不是Git项目，也能用Linux`patch`命令
```bash
patch -p1 < hello.patch
```

补丁文件的优势\
- 体积小（只存差异）
- 可读性高
- 跨平台、跨工具
- 方便审查和版本回滚

Git中生成补丁的几种方式\

| 命令                                      | 作用                          |
| --------------------------------------- | --------------------------- |
| `git diff > file.patch`                 | 生成工作区与暂存区/HEAD 的差异补丁        |
| `git diff commitA commitB > file.patch` | 比较两个提交之间的差异                 |
| `git format-patch commitA..commitB`     | 生成带提交记录、作者、时间的完整补丁（更适合邮件发送） |

- 比较某个历史文件
```bash
git diff HEAD~3 HEAD -- src/game.cpp
```

- 只看新增的函数（配合`grep`）
```bash
git diff HEAD~1 | grep '^+'
```
