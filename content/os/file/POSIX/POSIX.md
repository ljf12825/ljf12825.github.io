---
title: POSIX
date: 2026-01-01
summary: POSIX concept
draft: false
---

# POSIX(Portable Operating System Interface)
POSIX全称Portable Operating System Interface，可移植操作系统接口：是一套让Unix系列系统行为一致的标准

- 目标：让为不同Unix系统编写的软件能够很容易地移植到其他Unix系统上，而无需大量重写代码
- 本质：它是一系列的标准和规范，定义了操作系统应该为应用程序提供哪些接口（API）

比如：
- 文件操作要怎么调
- 进程怎么创建
- 信号的语义是什么
- 线程API怎么命名
- 错误码应该返回什么
- 路径语义怎么定义

这些都不是Linux发明的，也不是macOS发明的，它们是因为POSIX定义了统一规则，Unix家族成员都得听

## 出现原因
上世纪Unix分裂严重，每家公司都有自己的Unix：\
Bell UNIX, BSD, HP-UX, AIX, Solaris...\
两大主流分支是AT&T的System V和伯克利的BSD；它们在系统调用、命令工具、库函数等方面存在许多细微差别\
为一个Unix系统（比如SunOS）写的程序，在另一个Unix系统（比如HP-UX）上可能完全编译不过或者运行异常\
为了解决这个原因，IEEE牵头制定了POSIX标准。它统一了“游戏规则”，告诉操作系统厂商：要提供的接口的标准


## POSIX规定内容
POSIX标准涵盖的范围非常广，主要包括
1. 系统调用接口：这是最核心的部分。定义了诸如`fork`, `exec`, `open`, `read/write`, `socket`等底层函数应该如何工作
2. 命令行工具和实用程序：如`ls`, `grep`, `awk`, `sed`, `cp`, `mv`等，它们的选项、行为和输出格式都被标准化了
3. Shell标准：定义了Shell的基本功能和语法。`/bin/sh`就是一个POSIX兼容的Shell。Bash, Zsh等是它的超集
4. 线程接口：`pthreads`库就是POSIX线程标准的一部分，它定义了如何创建、管理和同步线程
5. 文件和目录结构：对文件系统的布局提出了一些建议，例如`/tmp`目录用于存放临时文件，`/dev`目录存放设备文件等

## POSIX的优点和缺点
优点：它是“最低共同规则”，价值纯粹：让你写的代码不至于被操作系统坑
```cpp 
int fd = open("file.txt", O_RDONLY)
```
在Linux, macOS, FreeBSD都能跑\
换线程库
```cpp 
pthread_create(...)
```
也是跨平台一致

它是游戏引擎、服务器、数据库、浏览器的底层基础结构。Unity, UE, Godot在底层抽象平台层的时候，很多接口其实都是基于POSIX来适配Linux/macOS的

缺点：落后\
它不包含select/poll/epoll的现代IO模型（epoll根本不是POSIX），现代线程同步原语（原子操作部分不是POSIX范围），高性能网络API（比如io_uring），现代权限模型（SElinux, AppArmor），容器与namespace（Linux特有）

POSIX只适合作为“最低共识”，想追求性能，必然越界到“非POSIX平台特性”

## POSIX对开发者和用户的意义
- 对开发者/程序员
  - 可移植性：用标准POSIX C API写的代码，只需要在目标系统上重新编译，通常就能直接运行，大大降低了跨平台开发的成本
  - 技能通用性：学习POSIX编程，就等于学会了在绝大多数类Unix系统上编程的方法
  - 清晰的预期：标准规定了函数的行为，开发者无需担心在不同系统上有不同的表现
- 对普通用户/系统管理员
  - 一致的体验：无论在macOS的终端里，还是在远程的Linux服务器上，`ls`, `grep`, `find`等命令的用法基本是一样的
  - 脚本的可移植性：一个用标准Shell语法（`#!/bin/sh`）写的脚本，有很大概率可以在不同POSIX系统上直接运行








