---
title: DirectX
author: ljf12825
date: 2026-05-23
type: file
summary: Overview of DirectX
---

DirectX 是 Microsoft 开发的一套多媒体和游戏开发API\
在没有DirectX之前（比如DOS时代），游戏开发者如果想让游戏支持某款显卡或声卡，必须针对该硬件型号编写专门的代码。而DirectX的出现，在游戏/应用程序与底层硬件之间搭建了一座标准的“桥梁”。开发者只需要针对DirectX接口编写代码，而硬件厂商负责提供支持DirectX的驱动程序，这极大地简化了PC游戏的开发工作

DirectX并不是一个单一的接口，而是一个组件包，它包含了处理不同多媒体任务的多个子模块

| 组件名称 | 主要负责的功能 |
| - | - |
| Direct3D(D3D) | 最核心的组件，负责3D图形的渲染 |
| Direct2D / DirectWrite | 负责 2D 图形渲染和高质量的文本字体渲染 |
| DirectInput / XInput | 负责处理输入设备（键盘、鼠标、手柄）。XInput是专门为Xbox手柄设计的现代接口 |
| DirectSound / XAudio2 | 负责高质感音频的播放、混音以及3D环绕音效 |
| DirectCompute | 允许开发者利用GPU的并行计算能力去处理非图形任务（如物理模拟、AI计算）|


