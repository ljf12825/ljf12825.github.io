---
title: D-Bus
author: ljf12825
date: 2026-06-02
type: file
summary: Overview of Linux D-Bus
---

D-Bus(Desktop Bus) 是一个进程间通信(IPC, Inter-Process Communication)系统，主要用于Linux/Unix桌面和系统服务之间的消息传递\
D-Bus是freedesktop.org生态的一部分，但严格来说：D-Bus最初是由Havoc Pennington（原GNOME/Red Hat）设计，后来由freedesktop.org社区接管并标准化\
freedesktop.org的目标就是让GNOME, KDE等DE之间能共享一套基础标准\
它让不同程序可以像“发消息”一样互相调用接口，而不需要直接链接库或者用复杂的socket协议\
D-Bus主要解决以下问题：

- 应用程序之间通信（比如桌面环境里各组件）
- 系统服务通信（比如NetworkManager, systemd 服务）
- 事件通知（比如插入USB, 网络变化）
- 提供类似“RPC（远程过程调用）”的能力

D-Bus包含两种总线

1. System Bus（系统总线）
    - 全系统共享
    - 用于系统服务
2. Session Bus（会话总线）
    - 每个用户登录会话一个
    - 用于桌面应用通信
