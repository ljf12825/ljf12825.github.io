---
title: DirectX
author: ljf12825
date: 2026-05-23
type: file
summary: Overview of DirectX
---

## 概述

DirectX 是 Microsoft 开发的一套多媒体和游戏开发API\
在没有DirectX之前（比如DOS时代），游戏开发者如果想让游戏支持某款显卡或声卡，必须针对该硬件型号编写专门的代码。而DirectX的出现，在游戏/应用程序与底层硬件之间搭建了一座标准的“桥梁”。开发者只需要针对DirectX接口编写代码，而硬件厂商负责提供支持DirectX的驱动程序，这极大地简化了PC游戏的开发工作

DirectX并不是一个单一的接口，而是一个组件包，它包含了处理不同多媒体任务的多个子模块

| Component | Description |
| - | - |
| Direct3D(D3D) | Real-time 3D rendering API |
| DXGI | Enumerates adapters and monitors and manages swap chains for Direct3D 10 and later |
| Direct2D | 2D graphics API |
| DirectWrite | Text rendering API |
| XInput | For Xbox 360 controllers |
| DirectX Diagnostics(DxDiag) | A tool for diagnosiing and generating reports on components related to DirectX, such as audio, video, and input drivers |
| XACT3 | High-level audio API |
| XAudio2 | Low-level audio API |
| DirectX Raytracing(DXR) | Real-time raytracing API |
| DirectStorage | GPU-oriented file I/O API |
| DirectML | GPU-accelerated machine learning and artificial intelligence API |
| DirectSR | GPU-accelerated resolution upscaling API |
| Media Foundation | DirectX Video Acceleration for accelerated video playback |
| DirectCompute | API for general-purpose computing on graphics processing units |

Deprecated Component

- DirectX Media: Consists of:
  - DirectAnimation for 2D/3D web animation, DirectShow for multimedia playback and streaming media
  - DirectX Media Objects: Support for streaming objects such as encoders, decoders, and effects(Deprecated in favor of Media Foundation Transforms; MFTs)
  - DirectX Transform for web interactivity, and Direct3D Retained Mode for higher level 3D graphics
  - DirectX plugins for audio signal processing
- DirectDraw: 2D graphics API(Deprecated in favor of Direct2D)
- DirectInput: Input API for interfacing with keyboards, mice, joysticks, and game controllers(Deprecated after version 8 in favor of XInput for Xbox 360 controllers or standard WM_INPUT window message processing for keyboard and mouse input)
- DirectPlay: Network API for communication over a local-area or wide-area network(Deprecated after version 8 in favor of Games for Windows Live and Xbox Live)
- DirectSound: Audio API(Deprecated since DirectX 8 in favor of XAudio2 and XACT3)
- DirectSound3D(DS3D): 3D sounds API
- DirectMusic: Components for playing soundtracks authored in DirectMusic Producer

## 位置

DirectX处于的位置

```txt
┌────────────────────────────┐
│ Game Engine / Application  │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ Direct3D / DirectCompute   │
│ DirectInput / XAudio2 etc  │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ DXGI (Presentation Layer)  │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ GPU Driver (WDDM Model)    │
└──────────────┬─────────────┘
               ↓
┌────────────────────────────┐
│ GPU Hardware (SM / CU)     │
└────────────────────────────┘
```

## 版本

DX家族中，D3D是更新最频繁、技术变革最剧烈、同时也是对游戏性能影响最大的组件\
相比之下，其他的组件更新频率较低，技术变革平缓，甚至多版本共享\
所以很多情况下用DX版本指代D3D，但要注意DX一套多媒体API而不是像Vulkan, OpenGL那样的纯粹图形API

DX自1995年问世，按大版本（主要迭代）来算，DirectX距今共有12个核心版本

| 大版本 | 发布年份 | 对应主要Windows系统 | 核心技术历程 |
| - | - | - | - |
| DX 1.0 | 1995 | Windows 95 | 首次作为Windows Game SDK 推出，用以取代过时的WinG库 |
| DX 2.0 | 1996 | Windows 95 / NT 4.0 | 正式引入了 Direct3D 组件 |
| DX 3.0 | 1996 | Windows 95 OSR 2 | 强化了 Direct3D，是Windows NT 4.0 支持的最后一版 |
| DX 5.0 | 1997 | Windows 98 | 引入了对力反馈游戏手柄的支持和更强的3D雾化效果 |
| DX 6.0 | 1998 | Windows 98 / Dreamcast | 引入了双线性过滤等特性，也曾被Sega主机Dreamcast采用 |
| DX 7.0 | 1999 | Windows 2000 | 引入 T&L（硬件光照与变换），将图形计算从CPU彻底解放到GPU |
| DX 8.0 | 2000 | Windows Me / XP | 划时代的改变：引入Shader Model（可编程着色器），固定管线开始走向可编程 |
| DX 9.0 | 2002 | Windows XP / Xbox 360 | 引入HLSL（高级着色器语言），奠定了现代3D游戏基石 |
| DX 10.0 | 2006 | Windows Vista | 引入 Shader Model 4.0 和几何着色器。仅支持Vista系统，生命周期短，容易被忽视，但非常重要 |
| DX 11.0 | 2009 | Windows 7 | 引入 Tessellation（曲面细分）和Compute Shader（计算着色器）|
| DX 12 | 2015 | Windows 10 / 11 / Xbox One | Low-level API。类似Vulkan，允许开发者更底层地控制GPU资源，大幅提升多核CPU利用率 |

DX9, DX10, DX11 时期，显卡的硬件架构（固定管线 -> 统一着色器架构 -> 曲面细分）发生了翻天覆地的代际变化，老版本的底层框架已经无法承载新硬件，必须“推倒重来”\
DX12 的设计极具前瞻性。它把对硬件控制的底层权力彻底交给了开发者和引擎。这个“地基”足够稳定且灵活，无论往上加什么新技术，现有的DX12底层架构都能完美包容\
除非未来某一天，计算机图形学底层发生了颠覆性革命（例如量子计算图形化，或者完全抛弃多边形渲染的颠覆性硬件出现），DX12才可能被重构为DX13

进入DX 12 时代后，微软改变了频繁更换主版本号的做法，转而通过功能级别(Feature Levels) 和 SDK 升级来延续 DX12 的生命力

- DX 12 Ultimate (Featture Level 12_2)：微软在2020年整合的一个高端标准，成为了现代游戏主机的统一硬件基准。它包含四个重要特性：
  - DXR(DirectX Raytracing)：硬件级光线追踪
  - VRS(Variable Rate Shading)：可变速率着色，提升渲染效率
  - Mesh Shaders：网格着色器，颠覆了传统的几何处理管线
  - Sampler Feedback：采样器反馈，优化纹理流送和显存占用

- DX 12 Agility SDK：微软近年推出的全新分发机制。通过Agility SDK，开发者可以将最新的DX 12 runtime 直接打包在游戏里，不依赖Windows系统中的动态链接库

DirectX可以看成三次范式转移

- DX7及以前是固定管线时代，CPU负责几乎所有逻辑，GPU只是绘制器，渲染流程写死
- 可编程管线时代(DX8 / DX9)，Vertex Shader, Pixel Shader, HLSL(DX9)，GPU变成可编程并行计算设备
- 现代GPU计算时代(DX11 / DX12)
  - DX11：Compute Shader, Tessellation，GPU开始负责通用计算(GPGPU)
  - DX12：控制权回归开发者，Command Queue 显式管理，Descriptor Heap，Pipeline State Object(PSO)，多线程录制命令，减少driver overhead
