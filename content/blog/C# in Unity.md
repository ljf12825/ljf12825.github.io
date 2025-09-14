---
title: "C# in Unity"
date: 2025-06-01
categories: [Note]
tags: [Unity, C#]
author: "ljf12825"
summary: The Range of C# in Unity Game Development
image: "/images/Blog/ScriptingIntroPic.jpg"
---
C#作为Unity开发的首选脚本语言，熟练掌握C#和C.NET Framework对项目架构，可维护性和性能优化的理解能够更加深入\
C#不同于C++，它的核心是它庞大的框架和生态系统\
它的设计哲学是底层一致，上层多个分支\
底层是指：
- 同统一的语言（C#）：语法、核心特性（OOP、泛型、委托、LINQ、async/await）在所有领域都是完全一致的
- 统一的运行时（CLR -> .NET）：无论是ASP.NET Core、MAUI还是Unity（基于Mono/.NET），最终代码都在一个托管运行时上执行，共享同样的GC、JIT（或AOT）和内存模型
- 统一的基础类库（BCL）：`System.*`命名空间下的核心库（如集合、文件IO、网络、加密、并发）被所有应用类型共享

学C#核心知识永远不会浪费，切换领域只是在不同的上下文中应用它们

上层是指：\
为了针对不同的应用场景和平台，.NET在统一的基础之上，构建了众多高度专业化的应用程序框架\
- Web开发：ASP.NET Core(MVC, Razor Pages, Blazor, Web API)
- 跨平台桌面/移动：.NET MAUI
- Windows原生卓铭：WPF, WinForms, WinUI
- 游戏开发：Unity（使用C#作为脚本语言）
- 云原生/微服务：基于ASP.NET Core，但有一套特定的架构模式和库（如Dapr、Orleans）
- 机器学习：ML.NET
- 物联网：loT Core

每个分支都是一个庞大的、自称体系的生态，有自己独有的概念、API、设计模式和最佳实践\
因此，放弃完全掌握的想法，加固底层（C#核心），和专精某一分支（比如Unity）

作为一名Unity开发者，学习C#的路径和侧重点是为能够高效解决游戏开发问题，大致可以分为以下几个层级

### 层次一：核心基础
这是写任何脚本的基石，必须达到条件反射般的熟练程度
1. OOP
  - 类和对象
  - 封装（Encapsulation）
  - 继承（Inheritance）
  - 多态（Polymorphism）

2. 基本语法和类型
  - 变量、方法、循环、条件判断
  - 值类型和引用类型
3. 集合（Collections）
  - 数组、列表、字典

### 层次二：Unity开发中的特色核心
这些是C#在Unity环境下的特色应用，直接关系到游戏性能和架构
1. 委托（`delegate`）和事件（`event`）
  - 这是实现脚本间通信最优雅、最解耦的方式
  - Unity事件：`UnityEvent`和`UnityAction`，用于Inspector中的可视化事件绑定
2. 协程（`Coroutine`）
  - 用于处理随时间序列执行的操作，是`Update`的替代方案，更高效
3. 属性（`Properties`）
  - 不仅是语法糖。可以用它们创建在Inspector中只读的变量，或者在get/set时加入逻辑
4. 接口（`Interface`）
  - 定义契约行为

### 层级三：中级概念
这些知识能让你写出更优秀、更专业、性能更好的代码
1. 泛型（`Generics`）
  - 编写可重用、类型安全的代码
2. LINQ
  - 查询集合
3. 异步编程（`async`/`await`）
  - 在Unity中作为协程的另一种选择，在某些场景（如加载资源、网络请求）写法更优雅

### 层级四：进阶概念
这些是C#的高级特性或在Unity中较少使用的部分
- 反射（Reflection）：Unity本身大量使用，但不建议在业务中使用，除非用于基础设施开发
- 复杂的表达式树（Expression Trees）
- 完整的委托进阶（协变、逆变）
- 大部分关于多线程（`Thread`）的内容：Unity的API大部分必须在主线程调用。如果要使用多线程处理密集计算（如寻路、生成地形），需使用`Thread`但要将结果通过主线程更新。更常用的是`Job System`和`Burst`编译器

### Unity开发中的C#知识体系
这是专家级的知识体系，超越了特定领域，涵盖了语言本身、底层原理、生态系统和软技能的全方位深度知识

| 类别 | 具体内容 | 说明与深度要求 |
| - | - | - |
| 一、语言核心与CLR底层 |  | 理解“为什么”而不仅仅是“怎么用” |
|  | CLR（公共语言运行时）内部机制 | 深刻理解程序集加载、JIT编译、GC generations（分代垃圾回收）、Large Object Heap（大对象堆）、Just-In-Time vs AOT（如Native AOT）|
|  | 内存管理高级专题 | 精通`IDisposable`模式、`finalizer`、`SafeHandle`。理解内存泄露的成因（如事件注册、静态引用）并使用工具（如dotMemory）诊断 |
|  | 值类型和引用类型深度探索 | `struct`布局（`LayoutKind`）、`ref`返回和局部变量、`in`/`out`参数修饰符、`Span<T>`/`Memory<T>`用于高性能无分配操作 |
|  | 异常处理最佳实践 | 那些异常是可恢复的，哪些不是。会使用`ThrowHelper`模式避免性能损耗。理解第一次机会异常（First-chance exception）|
| 二、类型系统与高级特性 | | 将语言特性运用至极致的艺术 |
|  | 泛型系统内部原理 | 理解运行时泛型实例化、类型擦除、约束（`where`）的编译时影响 |
|  | 委托与事件的本质 | 理解委托是MulticastDelegate, `+=`/`-=`的线程安全问题。会使用`Delegate.CreateDelegate`进行反射高级操作 |
|  | 反射与元数据高级操作 | 精通`System.Reflection.Emit`在运行时动态生成IL代码。理解Attribute的检索性能及其应用场景 |
|  | 动态编程 | 精通`dynamic`关键字与DLR（动态语言运行时）的交互，并能说明其与反射的优劣对比 |
| 三、并发与异步编程 |  | 构建高性能、高响应应用的基石 |
|  | 内存模型与volatile | 理解C#内存模型（ECMA CLI规范）、`volatile`关键字、`Volatile.Read`/`Write`、内存屏障（`MemoryBarrier`） |
|  | TPL（任务并行库）高级用法 | 精通`Task`状态机内部原理、`TaskScheduler`自定义、`TaskCreationOptions`、`TaskContinuationOptions` |
|  | 异步流（Async Streams）| 熟练使用`IAsyncEnumerable<T>`处理异步数据流（如分页拉取所有数据库记录）|
|  | 并行与数据并行 | 精通`Parallel.For/ForEach`及其分区策略（Partitioner）、`PLINQ`与LINQ的性能权衡与调优 |
|  | 高级同步原语 | 超越`lock`，精通`SemaphoreSlim`、`ReaderWriterLockSlim`、`ManualResetEventSlim`、`SpinLock`、`Barrier`等的使用场景与性能特性 |
| 四、性能优化与诊断 |  | 从能跑到飞驰的转变 |
|  | 基准测试 | 精通使用BenchmarkDotNet进行科学、准确的微基准测试，避免常见的性能测试误区 |
|  | 诊断工具链 | 熟练使用PerfView、dotnet trace、dotnet counters、Visual Studio Diagnositic Tool 分析性能瓶颈、GC压力、线程竞争等 |
|  | 不分配（Zero Allocation）技巧 | 熟练使用`ArrayPool<T>`、`String.Create`、`stackalloc`（在安全上下文中）来避免托管分配 |
|  | 内在函数（Intrinsics）与SIMD | 了解`System.Runtime.Intrinsics`命名空间，能使用硬件指令集（如SSE,AVX2）进行超高性能计算 |
| 五、生态系统与工程化 |  | 从代码到可交付的全局视野 |
|  | Roslyn编译器平台 | 能编写分析器（Analyzer）和代码修正（Code Fix）来实施团队规范，实现“编译器即平台” |
|  | 依赖注入高级模式 | 超越基本用法，精通工厂模式、命名服务、装饰器模式与DI容器（如Microsoft.Extensions.DI）的集成、生命周期管理陷阱 |
|  | 源代码生成器（Source Generators）| 能使用SG在编译时生成代码，用于AOT友好、高性能序列化、API绑定等场景 |
|  | 跨平台与运行时 | 深刻理解`.NET`与`.NET Framework`的差异，熟悉`RID`（运行时标识符），并能处理跨平台兼容性问题 |
| 六、架构与设计 |  | 构建可维护、可扩展系统的思维 |
|  | 领域驱动设计（DDD）| 精通限界上下文、实体、值对象、聚合根、领域事件等概念，并能落地实现 |
|  | 高级设计模式 | 精通并灵活使用装饰器、适配器、策略、观察者、代理等模式，并理解其现代实现（如基于DI的代理） |
|  | 原则与规范 | 不仅遵循SOLID，更能深刻理解其背后的哲学，并能批判性地应用。精通CQS/CQRS、Event Sourcing等架构模式 |
|  | 代码度量与质量 | 使用工具（如SonarQube, NDepend）维护代码质量，关注圈复杂度、继承深度、耦合度等指标 |
| 七、软技能 |  | 专家区别于高级工程师的关键 |
|  | 技术选型与决策 | 能评估不同技术方案（如gRPC vs REST， SQL vs NoSQL）的利弊，并做出符合业务目标的合理决策 |
|  | mentorship（指导）| 能有效地指导和提升团队其他成员的水平，进行有效的代码评审 |
|  | 技术债务管理 | 能识别并规划偿还技术债务，平衡业务需求与技术卓越 |
|  | 持续学习与社区参与 | 持续关注语言和生态发展（如.NET Conf），阅读核心团队博客，甚至为开源项目（如.NET Runtime, Roslyn）贡献代码 |