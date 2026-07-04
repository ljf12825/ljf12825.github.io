---
title: DOS
author: ljf12825
date: 2026-07-04
tags: [OS]
summary: Introduction of DOS; Install FreeDOS；Using DOSBox-X
---

DOS(Disk Operation System)，磁盘操作系统，是一类统治了20世纪80年代到90年代的个人计算机操作系统的统称\
它包含以下几个主流分支

- MS-DOS(Microsoft DOS)，1981年微软购入Tim Paterson写的86-DOS，最初叫QDOS(Quick and Dirty Operating System)，并以此为基础为IBM PC打造了操作系统
- PC DOS(IBM Personal Computer DOS)，由微软为IBM专门定制的版本。在早期(DOS 1.0到5.0)，PC DOS 和 MS-DOS的核心代码几乎完全一样，只是改了名字和部分内置工具；到了1993年(DOS 6.0)，微软和IBM结束了合作关系，IBM开始独立开发PC DOS，并内置了IBM自己的高级实用工具
- DR DOS(Digital Research DOS)，由CP/M系统的开发商Digital Research推出，是MS-DOS最强劲的竞争对手，DR-DOS经常在技术上领先微软一步，比如，DR-DOS 5.0/6.0率先引入了优秀的内存管理（把驱动移到高端内存，留出宝贵的640KB常规内存给游戏和软件）和磁盘压缩功能，逼得微软不得不紧急开发MS-DOS 5.0和6.0来应对
- FreeDOS（自由操作系统），一个开源、免费的纯16位DOS兼容系统，于1994年因微软宣布全面转向Windows且准备放弃DOS而由民间发起；它完全兼容MS-DOS的软件和游戏，且至今仍持续更新内核和现代网络/包管理工具。很多现代主板刷BIOS用的引导盘，或者无系统的笔记本出厂预装的系统，很多就是FreeDOS

DOS作为主流桌面操作系统的时代已经在2000年就结束了，但DOS并没有彻底消亡。凭借着极地的硬件开销、无虚拟化延迟的直接硬件访问能力，以及庞大的历史遗产，仍活跃在四大特定领域

- 工业控制、医疗与嵌入式系统的底层控制软件都是80-90年代基于DOS编写的，因为它很稳定，重写底层控制软件的代价很大；一些特定的嵌入式设备，这里指的是只需要跑但个控制程序的硬件，DOS启动速度很快而且不用担心像Windows那样频繁更新或联网蓝屏的风险
- 现代硬件维护和固件刷写，虽然许多现代主板(UEFI)支持在Windows内或直接在BIOS里升级固件，但在许多服务器、工控机或某些特定显卡固件刷写工具中，官方依然会提供一个纯DOS版的闪存工具；一些极其追求“干净运行环境”的底层维护工具（如硬盘检测修复工具MHDD，早期的Memtest86等），仍需要通过DOS引导盘启动。在纯DOS下，没有多任务调度，没有复杂的内存分页和虚拟化保护，软件可以直接向主板I/O端口和寄存器发送K&R/汇编指令，从而获得精准的硬件控制权
- 开源世界中的延续，社区正处于FreeDOS 3.0时代，主要在优化现代硬件的兼容性、引入更完善的网卡驱动等；如果今天去买一台没有预装Windows系统的“裸机”联想、戴尔或惠普笔记本，为了证明电脑硬件完好并应付合规检查，厂商往往会在硬盘里预装FreeDOS
- 怀旧游戏与文化保护，这也是我研究DOS的原因，DOSBox及其变体(DOSBox-Staging, DOSBox-X)：由于现代CPU已经彻底抛弃了纯16位实模式（甚至Intel最新架构正在逐步削减32位支持，全力转向64-bit-only），直接在现代PC上跑旧DOS是不可能的。但通过DOSBox这类模拟器，玩家可以在Windows11, Linux甚至手机上完美模拟出一台拥有Sound Blaster 16声卡和VGA显卡的486电脑；时至今日，很多无数经典的DOS游戏仍然在售卖，它们的底层都捆绑着一个配置好的DOSBox

## FreeDOS的安装

- qemu
- mtools

## DOS的使用

## DOSBox-X 的使用

## 开发环境

- open watcom

<https://freedos.org/>

[![freedos_erase_c](/images/content/freedos_erase_c.png)](/images/content/freedos_erase_c.png)

[![freedos_formatting_c](/images/content/freedos_formatting_c.png)](/images/content/freedos_formatting_c.png)

[![freedos_guide](/images/content/freedos_guide.png)](/images/content/freedos_guide.png)

[![freedos_installing](/images/content/freedos_installing.png)](/images/content/freedos_installing.png)

[![freedos_install](/images/content/freedos_install.png)](/images/content/freedos_install.png)

[![freedos_packages_select](/images/content/freedos_packages_select.png)](/images/content/freedos_packages_select.png)

[![freedos_partition](/images/content/freedos_partition.png)](/images/content/freedos_partition.png)

[![freedos_boot](/images/content/freedos_boot.png)](/images/content/freedos_boot.png)

[![freedos_installed](/images/content/freedos_installed.png)](/images/content/freedos_installed.png)
