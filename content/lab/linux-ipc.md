---
title: Linux IPC
author: ljf12825
date: 2026-08-15
tags: [Exp]
summary: A set of ipc on linux
---

IPC(Inter-Process Communication) 进程间通信，本质上就是：不同进程之间交换数据、同步状态或发送事件的机制

在Linux/Unix体系里，常见的IPC可以分成这些

| IPC | 主要用途 | 特点 |
| - | - | - |
| Pipe（管道）| 父子进程、相关进程通信 | 简单、单向 |
| FIFO（命名管道）| 无亲缘关系进程通信 | 管道的文件系统接口 |
| Unix Domain Socket | 本机进程间通信 | 类似Socket，功能强 |
| TCP/UDP Socket | 本机或跨机器通信 | 网络IPC |
| Shared Memory（共享内存）| 大量数据交换 | 最快的IPC之一 |
| Message Queue（消息队列）| 发送结构化消息 | 以“消息”为单位 |
| Semaphore（信号量）| 进程同步 | 主要解决同步/互斥 |
| Signal（信号）| 通知进程发生事件 | 数据量非常小 |
| Memory-mapped file(mmap) | 通过映射文件共享数据 | 可用于持久化/共享 |
| File（文件）| 间接交换数据 | 最简单，但通常较慢 |
| D-Bus | Linux 桌面/系统服务通信 | 高层IPC |
| ptrace | 调试/控制其他程序 | 特殊用途 |
