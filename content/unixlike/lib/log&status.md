---
title: log vs status
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: git log and git status
---

# `git log`
git log的作用是显示当前分支（或指定范围）的提交历史
```bash
git log
```
默认会显示
- commit哈希值
- 作者（Author）
- 日期（Date）
- 提交信息（commit message）

常用参数

| 参数                    | 作用               | 示例                             |
| --------------------- | ---------------- | ------------------------------ |
| `--oneline`           | 每个提交一行（短哈希 + 信息） | `git log --oneline`            |
| `--graph`             | 以 ASCII 树形显示分支合并 | `git log --graph --oneline`    |
| `--decorate`          | 显示标签和分支名         | `git log --decorate`           |
| `-n <num>`            | 只显示最近 N 条记录      | `git log -5`                   |
| `--since` / `--until` | 按日期过滤            | `git log --since="2025-08-01"` |
| `--author`            | 按作者过滤            | `git log --author="Jeff"`      |
| `<start>..<end>`      | 显示两个提交间的记录       | `git log v1.0..v2.0`           |
| `-p`                  | 显示每个提交的代码改动      | `git log -p`                   |
| `--stat`              | 统计每个提交改动的文件和行数   | `git log --stat`               |

示例\
分支历史
```bash
git log --graph --oneline --decorate
```
可以直观看到分支和合并情况

## 底层原理
`git log`的底层原理是从HEAD开始，沿着父提交（parent commit）链回溯，读取提交对象（commit object）和树对象（tree object）

# `git status`
`git status`显示工作区（Working Directory）和暂存区（Staging Area）相对于仓库（HEAD）的改动
```bash
git status
```
常见输出包括：
- 当前分支
- 未跟踪文件（Untracked files）
- 已修改但未暂存（Changes not staged for commit）
- 已暂存（Changes to be committed）
- 提示下一步操作（如git add/ git commit）

常用参数

| 参数               | 作用                | 示例               |
| ---------------- | ----------------- | ---------------- |
| `-s` / `--short` | 简洁输出（两列状态码）       | `git status -s`  |
| `-b`             | 显示分支信息（short 模式下） | `git status -sb` |

`git status -s`状态码说明
```ruby
M file1.txt   # 修改但未暂存（工作区改动）
M  file2.txt   # 修改且已暂存
A  file3.txt   # 新增且已暂存
?? file4.txt   # 未跟踪文件
```
两列含义
- 第一列：暂存区的状态（相对于HEAD）
- 第二列：工作区的状态（相对于暂存区）

## 底层原理
`git status`比较三份快照：
1. HEAD（最新提交）
2. 暂存区（.git/index）
3. 工作区对比
它会用哈希比较 + 文件时间戳优化，保证速度快

