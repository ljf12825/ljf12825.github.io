---
title: strace
author: ljf12825
type: file
date: 2026-04-09
summary: using of strace
---

[strace.io](https://strace.io/)

strace是一个Linux用户空间下的用于诊断、调试和指导的工具。它用于监视和干预进程与Linux内核之间的交互，包括系统调用、信号传递和进程状态的变化。strace的运行依赖于内核特性`ptrace`

简单来说，它可以告诉你一个程序在和操作系统“对话”时都做了哪些事情，比如读文件、写文件、打开网络连接、分配内存等等

strace最初由Paul Kranenburg于1991年为SunOS编写

## 核心原理

`strace`利用`ptrace`系统调用附加到目标进程。每当进程执行系统调用、收到信号或发行进程状态变化时，内核会暂停目标进程，将控制权交给`strace`。`strace`读取寄存器、内存中的参数和返回值并格式化输出，然后让目标进程继续运行
