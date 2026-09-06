---
title: OS Boot
author: ljf12825
date: 2026-09-06
tags: [OS]
summary: Boot an operating system from scratch
---

- Bootstrapping(Pulling oneself up by one's bootstarps)

# X86-64

```text
UEFI/BIOS 自检与初始化
v
查找引导设备（硬盘/U盘/光驱）
v
加载引导加载程序(GRUB/Windows Boot Manager)
v
加载内核与关键驱动(Linux Kernel / ntoskrnl.exe)
v
内核初始化（切换CPU模式、内存管理、加载驱动）
v
启动用户态(systemd/wininit)
v
登录界面/桌面环境
```
