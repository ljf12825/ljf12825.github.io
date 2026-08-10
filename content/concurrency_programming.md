---
title: Concurrent Programming
author: ljf12825
date: 2026-07-10
tags: [Concurrent]
summary: Summary of concurrent programming
---

# Overview

并发编程(Concurrent Programming)，简单就是说：让一个程序同时推进多个任务，并正确地处理这些任务之间的关系\
这里的同时不一定意味着真的在同一时刻运行，而是强调多个任务可以交错推进

## 顺序执行

最普通的程序是

```
任务A
v
任务B
v
任务C
v
任务D
```

CPU按照程序流程执行，一个任务完成后再做下一个，这属于典型的顺序程序(sequential program)

## 并发

假设程序需要同时做三件事情

- 下载文件
- 处理用户输入
- 播放音乐

如果全部顺序执行，用户体验会很差\
并发程序则可以让这些任务交错执行\
CPU可能在下载，输入，音乐之间不断切换，这就是并发

## 并发编程的难点

真正让并发变复杂的，不是“创建几个线程”，而是：多个执行流开始共享状态之后，程序的正确性变得非常难控制
