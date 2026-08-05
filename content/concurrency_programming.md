---
title: Concurrent Programming Core
author: ljf12825
date: 2026-07-10
tags: [Concurrent]
summary: Core of concurrent programming
---

并发编程，本质是理解多个独立执行流，在有限资源上如何安全、高效、有序地协作\
和绝大多数计算机知识一样，并发编程也是根据一个核心概念，在多层次上进行实现，并发的实现几乎贯穿整个计算机体系

## 并发编程核心概念

并发编程主要有以下几个共同核心

### 多个执行流(Execution Flow)

所有并发系统首先都要面对：有多个东西在“推进”\
这个东西可能叫：

- thread
- task
- coroutine
- process
- actor

名字不同，但本质都是

```txt
执行流A
v
执行流B
v
执行流C
```

系统都需要管理：

- 谁运行
- 谁等待
- 谁被唤醒
- 谁先谁后

### 共享资源(Shared Resource) 

并发的根本问题：多个执行流访问同一个东西

资源可以是：

- 内存变量
- 文件
- 数据库
- 网络连接
- GPU资源
- 硬件设备

例如

```txt
线程A ----\
           ---> counter
线程B ----/
```

如果只有一个线程

```txt
counter++
```

没有问题，一旦多个执行流

```txt
A:
读取

B:
读取

A:
修改

B:
修改
```

就会出现问题

## 硬件层面

## 操作系统层面

## 语言层面







