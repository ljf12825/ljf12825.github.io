---
title: ls-files
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: blog
summary: git ls-files
---

`git ls-files`是用来查看Git索引（index）和工作目录中的文件信息。它可以显示
- 被Git跟踪的文件（cached / staged）
- 未被跟踪的文件（others / untracked）
- 被忽略的文件（ignored）
- 已修改或已删除但未暂存的文件（modified / deleted）
- 未合并冲突的文件（unmerged）

## 常用选项

| 选项 | 功能 |
| - | - |
| `-c`/`--cached` | 显示索引中已跟踪的文件（默认行为）|
| `-d`/`--deleted` | 显示已删除但未暂存的文件 |
| `-m``--modified` | 显示已修改但未暂存的文件 |
| `-o`/`--others` | 显示未跟踪的文件 |
| `-i`/`--ignored` | 显示被忽略的文件（通常需要配合`-o`或`-c` | 
| `-s`/`--stage` | 显示文件的stage信息，包括mode、object和stage number |
| `-u`/`--unmerged` | 显示未合并文件（冲突文件）|
| `--full-name` | 强制显示相对于项目根目录的路径 |
| `-t` | 显示状态标签 |
| `--exclude-standard` | 使用标准忽略规则（.gitignore、全局exclude、info/exclude）|
| `--format` | 自定义输出格式，例如`%(objectname) %(path)` |

## 标签状态（`-t`）

| 标签 | 含义 |
| - | - |
| H | 已跟踪文件，未合并或未skip-worktree |
| S | 已跟踪文件，skip-worktree |
| M | 已跟踪文件，未合并 |
| R | 已跟踪文件，未暂存删除 |
| C | 已跟踪文件，未暂存修改 |
| K | 未跟踪文件，但存在文件/目录冲突阻止写入 |
| ? | 未跟踪文件 |
| U | resolve-undo 信息文件 |


