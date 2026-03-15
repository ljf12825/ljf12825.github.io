---
title: linux graphics card
date: 2026-01-14
draft: false
summary: nvidia, amd, intel
---

# GraphicsCard on Linux
对于Linux用户而言，显卡主要涉及两大阵营：NVIDIA和AMD（以及集成显卡巨头Intel）。它们在Linux上的体验和哲学截然不同

## 核心概念：显卡驱动
Linux上显卡驱动由两个关键组成部分
1. 内核驱动：直接与硬件交互，负责电源管理、内存管理、硬件初始化等底层操作。它运行在Linux内核空间
2. 用户空间驱动：通常以共享库的形式存在（如`libGL.so`, `libvulkan.so`），为应用程序和图形栈（如OpenGL, Vulkan）提供接口，实现具体的渲染指令。它运行在用户空间

两者协同工作，才能让显卡发挥全部性能

## Nvidia
NVIDIA在Linux上采取的是 **闭源驱动** 策略\
官方闭源驱动
- 名称：通常被称为`nvidia`或`nvidia-driver`
- 安装方式：通过各发行版的软件包管理器安装
  - Ubuntu/Debian：`sudo apt install nvidia-driver-xxx`（xxx为版本号）
  - Fedora：`sudo dnf install akmod-nvidia`
  - Arch Linux：`sudo pacman -S nvidia`或`nvidia-dkms`
- 优点：
  - 性能最佳：特别是在3D游戏、CUDA计算和AI训练方面，性能远超开源驱动
  - 功能最佳：完整支持Vulkan、OpenGL、光线追踪（RTX）、DLSS等高级特性
  - CUDA支持：NVIDIA的并行计算平台，是AI和科学计算领域的事实标准，仅限官方驱动
  - 良好的专业软件支持：许多专业渲染和仿真软件都针对NVIDIA官方驱动进行认证和优化
- 缺点：
  - 与系统集成度差：由于是闭源，无法紧密集成到Linux内核和图形栈中
  - Wayland支持滞后：虽然现在已经能工作，但在Wayland混合器下的体验（如多显示器刷新率、混成效果）可能不如X11完美，且问题排查困难
  - 安装和更新麻烦：需要与当前运行的内核版本严格匹配，内核升级后可能需要重新配置或生成驱动模块
  - 不支持PRIME Offload的完美同步：在笔记本双显卡（NVIDIA独显 + Intel核显）环境下，虽然可以使用`prime-run`命令启动程序独显，但无法像AMD那样实现无缝的混合图形切换

开源驱动
- 驱动名称：`nouveau`
- 现状：由社区逆向工程开发，没有官方支持
- 优点：
  - 与内核和开源图形栈集成良好
  - 支持基本的2D显示和旧显卡的3D加速
- 缺点：
  - 性能极差：由于缺乏固件和重新时钟支持，现代NVIDIA显卡的性能被锁定在低频状态，3D性能几乎不可用
  - 不支持新特性：不支持Vulkan、CUDA等
  - 开发缓慢：NVIDIA的硬件文档不公开，开发难度大

### NVIDIA PRIME 
NVIDIA PRIME 是Linux系统上的一种技术，用于在同时拥有集成显卡和NVIDIA独立显卡的笔记本电脑（即“双显卡”或“混合显卡”系统）之间进行切换和管理

#### 背景
在Windows系统上，这项技术通常被称为“NVIDIA Optimus”。它可以在运行时动态地在集成显卡和独立显卡之间无缝切换

然而在Linux系统上，由于架构差异，实现这种无缝切换要复杂的多。NVIDIA PRIME就是NVIDIA为Linux提供的解决方案，它经历了几个发展阶段

#### PRIME的几种工作模式
PRIME技术主要有三种工作模式，代表了其演进过程
##### 模式1：PRIME渲染卸载（PRIME Render Offload）- 现代推荐方式
这是目前最推荐、最先进的工作模式。它类似于Windows上的Optimus
- 工作原理：
  - 集成显卡（通常是Intel或AMD APU）始终作为主显示输出，负责将画面显示在屏幕上
  - NVIDIA独立显卡平时处于休眠或低功耗状态
  - 当运行需要高性能图形处理的程序（如游戏、3D渲染软件）时，可以通过一个命令或环境变量，将渲染任务”卸载“给NVIDIA显卡
- 优点：
  - 按需使用：平时用集显，省电安静；需要时调用独显，性能强劲
  - 无缝体验：用户无需注销或启动，即可在命令行中指定某个程序使用独显
- 使用方式
  - 在终端中运行程序时，在前面加上
  `__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia`  - 例如：`__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia glxgears`
  - 许多现代的Linux发行版（如Pop!_OS, Ubuntu）也在图形界面中提供了类似NVIDIA控制面板的切换工具，可以一键设置某个程序默认使用独显

##### 模式2：PRIME同步（PRIME Synchronization）- 解决撕裂问题
这其实是对“PRIME 渲染卸载”模式的一个重要补充，而不是一个独立的模式
- 问题：在早期的”渲染卸载“模式中，由于集成显卡输出和NVIDIA显卡渲染是异步的，可能会导致严重的屏幕撕裂现象
- 解决方案：PRIME Synchronization技术通过协调两张显卡的帧缓冲区，确保渲染和显示的同步，从而消除了撕裂
- 需求：需要较新的内核、Xorg Server和NVIDIA驱动程序支持。在现代Linux发行版上，通常默认已启用

##### 模式3：传统PRIME与NVIDIA作为主显卡 - 旧式/不推荐
这是早期的工作方式，现在通常不推荐普通用户使用
- 工作原理：将NVIDIA独立显卡设置为主要显卡，负责所有渲染工作，然后将最终画面通过某种方式（如使用`xrandr --setprovideroffloadsink`命令）路由到集成显卡进行输出
- 缺点：
  - 配置复杂：需要手动配置Xorg配置文件
  - 功耗高：NVIDIA显卡需要一直处于工作状态，即使只是在浏览网页，导致耗电和发热量都很大
  - 基本已被更高效的”渲染卸载“模式所取代



## AMD 

## Intel 
