---
title: Basic
date: 2026-02-23
author: ljf12825
type: file
summary: lua basic concepts
---

## Lua特点

- 轻量级

Lua体积小（源码几十万行以内），VM简洁，依赖极少，没有庞大运行时

- 嵌入

Lua不是独立语言生态，是一个C library，Lua是ANSI C写的，可以直接被C/C++项目链接

```text
[Program]
  v
Lua Library (C)
  v
Lua VM
```

Lua本身没有main()，没有程序入口，没有自己的运行生命周期，它必须被host调用

比如

```cpp
luaL_dofile(L, "config.lua");
```

执行权永远在宿主程序手里

这和Java, C#, Python的“解释器主导”模型完全不同

- register-based virtual machine

Lua VM是寄存器型虚拟机，而不是像Java的栈机

寄存器机的优点

- 指令更少
- 执行更快
- 更接近真实CPU

这也是Lua性能高的原因之一

- generational garbage collection

Lua有自动GC,分代垃圾回收；它为长期运行嵌入场景设计的，考虑了性能与延迟

- 自定义编程语言

Lua不是给你一种语言，Lua是给你“做语言”的能力

通过

- 注册C函数
- 控制全局环境
- 自定义库

可以

- 做DSL
- 做配置语言
- 做脚本系统
- 做游戏逻辑语言
