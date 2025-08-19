---
title: "Mono and IL2CPP"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Complie, Cross-paltform]
author: "ljf12825"
permalink: /posts/2025-08-02-Mono-and-IL2CPP/
---
`Mono`和`IL2CPP`都是Unity的脚本运行后端（Scripting Backend），它们是两中IL语言的处理方式；Mono的处理方式类似C#程序的执行，而IL2CPP则是将其转化为C++代码，交由C++编译器处理

## Mono
Mono是一个跨平台的.NET运行时实现，最初由Xamarin公司开发，用来在非Windows平台上运行C#程序；Unity在早期就选择了Mono作为C#脚本运行环境

**核心组件：**
- Mono运行时：执行托管代码的核心引擎
- 即时编译器（JIT）：在运行时将IL代码编译为原生机器码
- 提前编译器（AOT）：可选功能，在运行前编译部分代码
- 类库：实现.NET基础类库

**特点：**
- 解释执行 + JIT
  - 脚本代码（C#） -> 编译成CIL（Common Intermediate Language，通用中间语言）
  - Mono会在运行时JIT（即时编译）把CIL编译成机器码执行
- 跨平台性强：一次编译的C#程序可以在多个平台跑
- 反射支持强：很多第三方库依赖反射，Mono可以支持
- 灵活，但性能不如原生代码：因为JIT/解释执行比不上直接生成平台原生代码

**局限性：**
- 性能开销：JIT编译和GC可能引起卡顿
- 安全风险：IL代码较容易被反编译
- 平台限制：某些平台（如iOS）不允许JIT编译

## IL2CPP
IL2CPP是Unity自己研发的脚本后端，意为：
- IL -> C++ -> 平台原生代码（AOT编译）

**工作流程：**
1. C#脚本 -> 编译成IL（和Mono一样的中间语言）
2. Unity的IL2CPP工具链把IL翻译成C++代码
3. 使用C++编译器编译生成目标平台的机器码
4. 最终得到一个完全原生的二进制可执行文件

**特点：**
- AOT（Ahead of Time编译）：运行前就已经编译成机器码，运行时无需JIT
- 性能更高：执行效率比Mono/JIT方案高，平均有1.2-2倍的性能提升
- 平台兼容性更好：特别是iOS上，苹果严格限制JIT，IL2CPP就成了唯一选择
- 更安全：因为代码已经转成C++，反编译难度更大（虽然还是能逆向，但比Mono的CIL难得多）
- 内存效率：更好的内存布局和缓存利用率

**局限性：**
- 构建时间延长：额外的转换和编译步骤
- 调试困难：生成的C++代码难以直接调试
- 灵活性降低：不支持运行时代码生成
- 体积增大：最终二进制文件通常更大

## 总体流程
1. 从C#到IL（中间语言）
无论是Mono还是IL2CPP，第一步都是一样的：
  - C#脚本（例如`Player.cs`）
  -  Unity调用Roslyn编译器（csc.exe）把C#源码编译成IL（中间语言，Common Intermediate Language）
     - 输出结果是一个或多个.dll程序集（如`Assembly-CSharp.dll`）

这一步和普通.NET程序是一样的

2. Mono路线（编辑器/Debug模式常用）
Mono的工作流是：
  - 加载程序集：Unity编辑器或游戏运行时，Mono加载你的`Assembly-Csharp.dll`
  - JIT编译：Mono运行时逐个把IL转换成本地机器码，存在内存里
    - 执行时翻译 -> 所以叫JIT（Just-In-Time）
  - 执行机器码：CPU直接执行

特点：
  - 编译快：改一行代码 -> 重新编译成dll -> Mono直接跑
  - 运行稍慢：因为每次方法第一次调用时，Mono都要现编译一下
  - 调试友好：断点、反射、热重载都支持


3. IL2CPP路线（发布版本常用）
IL2CPP的流程比Mono多几步
  - C#编译成IL(.dll)（和上一步一样）
  - IL2CPP工具链把.dll里的IL代码转换成C++源码
    - 例如`Player.cs` -> `Assembly-CSharp.dll` -> `il2cpp` -> `Assembly-CSharp.cpp`
  - C++编译器（Clang/MSVC/GCC）把生成的C++源码编译成目标平台的原生机器码（.exe/.apk/.ipa/.so/.dll等）
  - 运行时执行：游戏运行时直接执行已经编译好的机器码

特点
- 性能好：不需要JIT，运行时就是纯机器码，接近C++程序的速度
- 安全性高：反编译难度比Mono大很多
- 编译慢：因为每次都要跑C++编译器

![流程图](/assets/images/MonoandIL2CPP.png)

---

## Mono vs IL2CPP

| 特性   | Mono                       | IL2CPP                |
| ---- | -------------------------- | --------------------- |
| 编译方式 | JIT / 解释执行                 | AOT（IL → C++ → 原生机器码） |
| 性能   | 中等，依赖 JIT 优化               | 高，接近 C++ 原生性能         |
| 平台支持 | 跨平台，但某些平台有限制（如 iOS 禁止 JIT） | 全平台，尤其是移动端和主机端首选      |
| 反射   | 完整支持                       | 部分受限，需要 `link.xml` 保留 |
| 编译时间 | 快，开发迭代效率高                  | 慢，需要 C++ 编译整个工程       |
| 安全性  | 容易被反编译（ILSpy 直接看源码）        | 较难逆向（但不是绝对安全）         |

---

**使用场景：**\
选择Mono的情况
- 开发阶段快速迭代
- 需要动态加载代码或使用反射
- 目标平台允许JIT执行
- 项目对性能要求不高
- 需要最小化构建体积

选择IL2CPP的情况
- 发布到iOS平台
- 需要最大化运行时性能
- 项目对安全性要求高
- 目标设备内存有限
- 使用复杂泛型或值类型


**Unity的选择**
- 编辑器模式/PC Debug模式 -> Mono（调试快、编译快）
- iOS/主机平台/大多数正式发布版本 -> IL2CPP（性能、安全性）
- Android -> 可以选Mono或IL2CPP（推荐IL2CPP）

Unity的策略其实是
- 开发时用Mono提高迭代效率
- 打包发布时用IL2CPP提高性能和安全

---

**迁移注意事项：**
从Mono迁移到IL2CPP时需要注意：
- 反射限制：某些反射操作可能不再工作
- 序列化变化：二进制序列化可能有差异
- 平台特定代码：需要检查平台相关代码的兼容性
- 第三方库：确保所有插件支持IL2CPP
- 构建配置：可能需要调整链接器设置


[Unity Packaging and Building]({{site.baseurl}}/posts/2025-07-18-Unity-Packaging-and-Building/)

## 性能优化
**IL2CPP特有优化：**
- 使用`[Preseve]`属性防止代码被裁剪
- 优化泛型使用，避免过多特化
- 减少反射操作，改用显式调用
- 使用`IL2CPP_EXTERN_C`与原生代码交互

**通用优化：**
- 对象池减少GC压力
- 避免每帧分配内存
- 使用结构体替代类
- 缓存组件引用

---

**未来发展趋势**\
Unity正在持续改进IL2CPP，缩短构建时间、增强调试支持、改进泛型处理、更好的异常处理、增量构建支持等。随着Unity的发展，IL2CPP正成为更主流的选择，特别是在性能敏感和移动平台项目中
