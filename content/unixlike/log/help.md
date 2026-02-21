---
title: help
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git help
---

`git help`的主要作用是显示Git命令的帮助信息。当不记得某个命令的具体用法、选项或者想深入了解其功能时

## 基本语法
```bash
git help <command>
# 或者
git <command> --help
```
这两种形式在大多数情况下是等价的

```bash
git help -a
# 或
git help --all
```
这会列出Git所有可用的命令、概念指南等，内容非常全面，且长

```bash
git help -g
# 或
git help --guides
```
这会列出如`giteveryday`（日常常用命令）、`gittutorial`（入门教程）、`gitworkflows`（工作流）等有用的指南

**指定帮助查看器**\
Git的帮助信息可以通过不同的“查看器”来显示，最常见的有：
- `web`（浏览器）
- `man`（Linux man page, 默认值）
- `info`（Info文档）
- `auto`（自动选择）

```bash
# 使用默认查看器
git help commit

# 指定在浏览器中打开
git help -w commit

# 指定使用`info`查看器
git help --info add
```

[在线文档](https://git-scm.com/docs)