---
title: system information
date: 2026-01-14
draft: false
summary: common Linux system information commands
---

# System Information
Linux的系统信息来源可以分成三个层级
1. 内核层(Kernel Space)
内核维护着系统所有运行状态的真实数据，例如CPU状态，内存分配表、进程表、块设备队列、网络接口状态等\
用户空间程序无法直接访问这些数据，只能通过系统调用或虚拟文件系统接口间接读取

2. 接口层（/proc与/sys文件系统）
这是Linux的“信息桥梁”层
    - `/proc`提供运行时状态信息（进程、内存、CPU、系统负载等）
    - `/sys`提供静态与硬件属性信息（设备拓扑、驱动参数、功耗控制、热插拔支持等）
3. 用户空间层（命令行工具与库）
各种命令（`lscpu`, `free`, `lsblk`, `top`, `uname`等）或系统调用库函数（如`sysinfo()`, `uname()`）这是对这些接口的封装

## 命令

- 当前用户：`whoami`
- 登录信息：`who`
- 所有登录：`w`
- 用户ID：`id`
- Shell：`echo $SHELL`
- 终端：`tty`
- 历史命令：`history`
- 上次登录：`last`
- 主机名：`hostname`
- 详细系统：`hostnamectl`
- 发行版：`cat /etc/os-release`
- 内核：`uname -a`
- CPU架构：`arch`
- 运行时间：`uptime`
- 当前时间：`date`
- CPU

```bash
lscpu
cat /proc/cpuinfo
```

- 内存

```bash
free -h
cat /proc/meminfo
vmstat
```

- 磁盘

```bash
lsblk
df -h
mount
```

- PCI/USB

```bash
lspci
lsusb
```

- 内核参数：`sysctl -a`
- 模块：`lsmod`
- slab：`slabtop`
- 中断：`cat /proc/self/interrupts`
- 内存映射：`cat /proc/self/maps`
- 调度：`cat /proc/sched_debug`
- 进程自身信息

```bash
echo $$ # 当前 shell PID
cat /proc/$$/status
cat /proc/$$/limits
cat /proc/$$/maps
cat /proc/$$/fd
```

- IP：`ip a`
- 路由：`ip r`
- DNS：`cat /etc/resolv.conf`
- 环境变量：`env`
- PATH：`echo $PATH`
