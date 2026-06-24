---
title: GNU
author: ljf12825
date: 2026-01-01
summary: overview of GNU
type: file
---

## 背景

GNU(GNU's Not Unix)\
GNU项目由Richard Stallman在1983年宣布发起\
背景：软件社区逐渐从“自由共享代码”转向“闭源专有”\
目标：创建一个完整的、类Unix的自由操作系统，让全世界的用户可以自由地运行、复制、分发、学习、修改和改进软件\
GNU既是一种操作系统，又是一个具有深远影响的哲学理念和工程项目\
GNU创立了自由软件的哲学

- 四项自由：
  - 为任何目的运行程序的自由
  - 研究程序如何工作，并修改它的自由
  - 再分发拷贝，帮助邻居的自由
  - 改进程序，并向公众发布改进的自由
- GPL许可证(GNU General Public License)：Stallman创造了GPL许可证来实现这些理念。它利用版权法来保障自由，这被称为Copyleft
  - 其核心机制是：如果你分发了一个包含GPL代码的程序，你必须同时提供源代码，并允许接收者同样拥有修改和再分发的权力。这使得自由得以延续，不会被闭源化

## 核心技术贡献

GNU项目开发了大量的基础工具。但没有内核，GNU并不是一个完整的系统，可以抽象为三层

- 应用层
  - Shell工具
  - 文本工具
  - 编译开发工具
- 中间层
  - C Library
  - Runtime支持
- 底层
  - Kernel接口
  - 系统调用封装

典型代表

- GNU Coreutils：`ls`, `cp`. `rm`, `cat`,...
- GNU Bash：大多数Linux发行版默认的命令界面
- GCC(GNU Compiler Collection)：编译套件
- GNU Binutils(Binary Utilities)：一组用于处理二进制文件的底层工具集合：`as`, `ld`, `objdump`, `readelf`, `nm`, ...
- Emacs：一个高度可扩展的编译器
- Glibc：GNU C库，是程序与Linux内核交互的核心库
- GDB：GNU调试器

## GNU 与 Linux

- GNU项目开发了操作系统所需的大部分核心工具（编译器、库、shell等），但缺少一个最关键的部分：内核
- Linux，内核
