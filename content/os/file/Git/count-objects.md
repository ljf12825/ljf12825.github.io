---
title: count-object
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: log
summary: git count-object
---

统计已解压的对象数量及其磁盘占用空间,帮助决定何时是重新打包的好时机
```bash
git count-objects [-v] [-H | --human-readable]
```
- `-v / --verbose`
提供更详细的报告\
  - count：松散对象的数量
  - size：松散对象占用的磁盘空间，单位KiB（除非用-H明确）
  - in-pack：包中对象数量
  - packs：包文件的数量
  - size-pack：包占用的磁盘空间，单位KiB（除非用-H明确）
  - prune-packable：存在于包中的散落对象的数量。这些对象可以使用`git prune-packed`进行修剪
  - garbage：数据库中既不是可达松散对象也不是可达包的数来数量
  - size-garbage：垃圾文件占用磁盘空间，单位KiB（除非用-H明确）
  - alternate：备用对象数据库的绝对路径；可以出现多次，每个路径占一行。如果路径包含不可打印字符，则可以使用双引号将其括起来，并包含C风格的反斜杠转义序列

- `-H`
人类可读：以人类可读格式打印大小
