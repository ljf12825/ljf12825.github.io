---
title: "Mono and IL2CPP"
date: 2025-06-01
categories: [笔记]
tags: [Unity, Complie, Cross-paltform, Build Pipeline]
author: "ljf12825"
summary: Comparison of Mono and IL2CPP modes
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

在Unity中构建时，无法直接修改Mono或IL2CPP的底层C/C++代码，因为它们是与Unity引擎核心打包在一起的编译好的二进制库\
但是，Mono和IL2CPP的选择并非一个简单的构建选项切换，\
它是一项核心的架构决策，直接影响项目的性能特征、内存模型、平台兼容性以及后期优化策略\
所以理解它们的行为差异，并以此指导上层C#代码编写、项目架构设计和性能优化策略很重要

### 内存管理
#### GC的深层机制对比

##### Mono
Mono使用的是BoehmGC

BoehmGC全称：Boehm-Demers-Weiser Conservative Garbage Collector，由Hans Boehm（HP实验室）编写，它是一种保守式垃圾回收器（Conservative Garbage Collector），它的主要作用是为C/C++/其他非托管语言提供垃圾回收支持；Mono在早期（Unity 4.x ~ 2018.1之前）选择直接集成现成的、稳定的BoehmGC作为默认垃圾回收器

**BoehmGC的工作原理**\
和现代.NET CLR / Unity新GC不一样，BoehmGC是保守式GC，它具有以下特点
- 保守式（Conservative）
  - BoehmGC不严格知道哪些是指针，哪些是普通函数
  - 它通过扫描堆栈、寄存器、全局变量的值，看起来像“指针”的东西就当作指针
  - 好处：兼容C/C++等没有精确元数据的语言
  - 坏处：可能会误判 -> 内存无法释放（内存泄漏风险）
- 标记-清除（Mark-Sweep）
  - GC暂停程序（Stop-the-world）
  - 从根（root）对象触发，递归标记能到达的对象
  - 未被标记的对象回收（释放内存）
- 非分代（Non-generational）
  - 没有分代优化（不像.NET/Java那样有Gen0/Gen1/Gen2）
  - 所以回收性能较差，容易造成长时间卡顿

**BoehmGC in Unity**\
- 在Unity4.x/5.x/2017.x里，C#脚本跑在Mono + BoehmGC上
- 问题
  - GC卡顿明显（Stop-the-world很长）
    - GC暂停时间与堆大小线性相关，无法规避。需将堆大小控制在严格阈值内
    - 吞吐量较低，暂停时间不可预测；应避免在性能关键帧如（Update）中进行任何可能触发主GC的分配
  - 频繁分配内存（尤其是string、List<T>、Lambda）会造成就帧率抖动
    - 会产生大量内存碎片，且不会被压缩。这就导致长期运行后，即使总内存充足，也可能找不到连续控件而分配失败，必须重启
  - 没有分代 -> 小对象也要和大对象一起回收，效率差

这就是为什么老Unity游戏经常出现掉帧/卡顿，原因之一就是BoehmGC的GC暂停

- Mono团队后来实现了 SGen GC（Simple Generational GC）；
  - 分代收集器（Gen0，Gen1，Gen2）性能更好
  - 适合C#程序的高分配频率场景
- Unity从2018.1开始引入了增量式GC（Incremental GC）：
  - 仍基于Boehm/SGen，但支持分步执行回收，减少一次性卡顿
- Unity未来方向：完全替换为更现代的GC（类似CoreCLR的GC），但目前仍在迭代中

##### IL2CPP
IL2CPP不是一个运行时，它只是IL -> C++ -> 机器码的转换工具链\
真正执行的时候，Unity还是需要一个托管内存的GC来帮忙管理C#对象，它会绑定到Unity内置的GC实现

- Unity2017及之前
  - IL2CPP使用BoehmGC，和Mono一样
- Unity2018 ~ 现在
  - IL2CPP默认使用Unity集成的libgc（基于Boehm/SGen改进版）
  - 并且支持增量式GC（Incremental GC）
- Unity2021之后
  - 引入了新的可选GC模式，更接近.NET Core的分代GC思路（但还没有完全一致）
  - 移动端、主机端IL2CPP都能用Incremental GC，减少卡顿

IL2CPP编译出来的C++代码
- 对象分配会走Unity提供的GC_malloc等API
- Unity内置的GC（基于Boehm/SGen/Incremental GC）接管这些分配
- GC会在合适的时间做标记-清除或增量扫描

##### 现实意义
- 开发者角度
  - 不管是Mono还是IL2CPP，平时写C#代码都用`new`、不用手动释放对象，Unity的GC都会帮助回收
  - 差别在于运行时体验（Mono更容易卡顿，IL2CPP + IncrementalGC更平滑）
- 优化角度
  - 在Mono下，频繁分配会立刻暴露GC卡顿
  - 在IL2CPP下，GC机制更强，但仍要避免频繁分配大对象（如`string`拼接、临时List）

#### 高级优化策略
- 自定义内存分配策略：
  - 结构体（Struct）的极致运用：使用`struct`构建数据导向设计（DOD），将热点数据连续存储在原生数组（`NativeArray`）或栈上，彻底规避GC和缓存不命中
  - 非托管内存（Unsafe Code）：在机制性能要求的场景（如网格处理、复杂算法），使用`stackalloc`、`NativeArray`（与Burst编译器结合）或直接`Marshal.AllocHGlobal`在非托管堆分配，完全脱离GC管辖
- GC行为预测与主动管理
  - 在预计的加载界面或过场动画中，主动调用`System.GC.Collect()`，在可控时机触发GC，避免在战斗或复杂场景中发生
  - 使用Profiler监控`GC.Alloc`和`GC.Collect`调用，建立性能基线，并确保关键路径上的分配为零


### 编译与链接

#### 泛型代码共享的深层原理
- 问题本质：AOT编译必须为所有泛型实例化生成具体代码
- Mono（iOS AOT）：为所有值类型泛型（`List<int>`.`List<MyStruct>`）生成独立代码，导致代码爆炸
- IL2CPP的解决方案：实现泛型代码共享（Generic Sharing）
  - 引用类型共享：`List<AnyClass>`共享同一份底层实现，通过运行时传入的“方法头”区分类型
  - 值类型特定化：仍需为不同大小的值类型（如`int`, `long`,`MyStruct`）生成特定代码

#### 链接器（Linker），`link.xml`与代码裁剪（Code Stripping）

##### Linker
在Unity里，Linker是构建管线中的一个步骤：
- 它的任务是分析当前C#程序集（.dll），移除未被使用的类型、方法、字段，减少最终包体大小
- Unity用的是Mono Linker（后来升级为IL Linker，和.NET官方的ILLinker类似）

##### Code Stripping
代码裁剪就是Linker的主要工作

**原理：**
- Linker会从入口点（如`Main()`、Unity的脚本生命周期方法）开始分析依赖
- 标记可达的类型和方法
- 没有被引用的代码会被裁剪掉

**优点：**
- 包体小很多（Unity自带的.NET库、第三方库很多时候只用到一点点）
- 运行时加载更快

**缺点：**
- 反射、序列化、动态调用的代码可能被误删，因为Linker静态分析不到
  - 例如：
  ```cs
  var type = Type.GetType("MyNamespace.MyClass");
  Activator.CreateInstance(type);
  ```
  这里`MyClass`看起来没有直接引用 -> Linker可能会裁掉 -> 运行时崩溃

##### link.xml
为了解决“代码被误裁掉”的问题，Unity提供了link.xml配置文件，显式告诉Linker：哪些类/方法/程序集不要裁剪

```xml
<linker>
<!-- 保留整个程序集 -->
<assembly fullname="MyGameAssembly" preserve="all"/>

<!-- 保留特定类型 -->
<assembly fullname"UnityEngine">
  <type fullname="UnityEngine.GameObject" preserve="all"/>
</assembly>

<!-- 保留某个类的特定方法 -->
<assembly fullname="MyGameAssembly">
  <type fullname="MyNamespace.MyClass">
    <method name="MyMethod" />
  </type>
</assembly>
</linker>
```
`preserve`属性
- `"all"`保留整个类型/程序集
- `"fields"`只保留字段
- `"methods"`只保留方法

Unity规定：
- `link.xml`必须放在Assets文件夹或它的子目录中
  - `Assets/link.xml`
  - 或`Assets/Configs/link.xml`
  - 或`Assets/Plugins/YourLib/link.xml`
- 名字必须是`link.xml`（不能改名，否则Unity不会识别）

只要它在`Assets`目录下，Unity构建时就会自动收集并传递给Linker

多个link.xml的情况
- 可以在项目里放置多个`link.xml`（比如第三方库自带一个，自己再写一个）
- Unity构建时会合并所有link.xml文件
- 如果同一个类型/程序集在多个文件里都有配置，Unity会做并集，不会冲突

构件时打开Editor log，会看到`link.xml`被解析的日志

##### 实际使用场景
需要写`link.xml`的情况
1. 反射：
  - Newtonsoft.Json/Odin Serializer / XLua这类库经常用反射动态创建类型
  - 必须告诉Linker保留哪些类型

2. 序列化：
  - Unity的序列化（尤其是`ScriptableObject`、`JsonUtility`）可能用到未显式引用的字段

3. 热更新框架
  - HybridCLR/XLua/ILRuntime依赖反射加载C#，必须配合link.xml

##### 调试与问题定位
- 构建后报错MissingMethodException/TypeLoadException 很可能是Linker裁掉了代码
- 解决方法：
  - 确认是不是动态调用的代码
  - 在`link.xml`中声明保留
  - 重新打包


### 平台特定深度调优
1. iOS

2. Android

3. WebGL

---

### 未来发展趋势
Unity正在持续改进IL2CPP，缩短构建时间、增强调试支持、改进泛型处理、更好的异常处理、增量构建支持等。随着Unity的发展，IL2CPP正成为更主流的选择，特别是在性能敏感和移动平台项目中
- CoreCLR：Unity正在投资将.NET Core运行时（CoreCLR）集成为第三个脚本后端。这将提供最新的C#语言特性、更高的性能和微软的官方支持。关注其进展，评估其与IL2CPP的性能差异
- Burst编译器：对于机制性能的数学、图形算法，Burst是终极解决方案。它将C# Job编译为高度优化的原生代码，性能堪比C++
  - 高级用法：将Burst与IL2CPP结合，使用Burst处理计算密集型任务，IL2CPP处理游戏逻辑，形成高性能混合架构

**架构层面的考量**
- 热更新需求：如果项目有强烈的热更新需求（如某些手游），Mono（在允许JIT的平台）配合像`HybridCLR`这样的方案是目前的主流选择。IL2CPP由于其AOT特性，热更新需要更复杂的技术（如Lua）

