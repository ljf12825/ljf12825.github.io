---
title: C# and .NET
date: 2025-06-01
categories: [C#, .NET]
tags: [Architecture]
author: "ljf12825"
type: blog
summary: Overview of C# and .NET
---

## 1. C#
一种高级的、面向对象的编程语言。由微软开发，语法类似于Java和C++；人类易读、易写，但CPU无法直接理解；C#编译器（`csc.exe`）将`.cs`源代码文件编译成CIL（而不是直接编译成机器码）

## 2. .NET Framework / .NET 5+
一个软件开发平台，提供了一个全面的编程模型和庞大的代码库来构建应用程序\
**现主要分为**
  - .NET Framework：传统给的、仅限Windows的平台
  - .NET Core / .NET 5+：现代的、开源的、跨平台的接班人。从.NET 5开始，`.NET Core`和`.NET Framework`开始统一为`.NET`
  - Mono：一个第三方、开源的.NET运行时，早在.NET Core出现之前就实现了.NET的跨平台。它尤其重要，因为它是Unity游戏引擎和许多其他跨平台应用的基石
  - .NET Standard：一个规范的API集合（而不是实现），旨在解决不同.NET平台之间的代码共享问题。类库可以targeting.NET Standard 2.0，从而保证能在任何实现类该标准的平台上运行（但随着.NET 5+的统一，.NET Standard的重要性正在降低，因为API已经统一了）


**核心组成部分**
  - 编译器（如Roslyn）：将C#, F#, VB.NET等语言直接编译成CIL
  - 基础类库（BCL/FCL）：一个巨大的、可重用的代码库（如`System.IO`, `System.Data`），提供了文件操作、数据库连接、网络通信等常用功能。可以直接调用这些库，无需重复造轮子
  - 运行时：负责执行编译好的代码
  - 开发工具：用于编写、构建、调试和发布应用程序的软件

## 3. CIL / IL / MSIL（公共中间语言）
一种介于高级语言和机器码之间的低级、于CPU无关的指令集。它看起来有点像汇编语言，但不依赖于任何特定的CPU架构；实现了.NET的“语言互操作性”。不同语言（C#, F#, VB.NET）只要能被编译成CIL，就可以在同一个项目中无缝协作。这也是.NET应用能够“一次编译，多处运行”的基石。编译后的CIL代码存储在以`.exe`或`.dll`为扩展名的程序集（Assembly）中。程序集还包含元数据（Manifest）等信息

## 4. CLR（公共语言运行时）
.NET平台的“执行引擎”。它是所有.NET应用程序的运行环境，可以看作是一个虚拟机\
**核心功能**
  - JIT编译：在运行时将CIL代码即时编译成本地机器码
  - 垃圾回收（GC）：自动管理内存分配和释放，防止内存泄露。这是.NET开发如此高效的重要原因之一
  - 异常处理：提供标准化的错误处理机制
  - 类型安全：在运行时确保代码是类型安全的，增强了安全性和稳定性
  - 线程管理：管理多线程程序的执行
  - 安全模型：.NET里有Code Access Secrity（CAS），虽然现在用的少，但它体现了CLR不仅仅是执行器，还能做安全策略的沙箱
  - 跨语言互操作：用C#写的类，可以被F#或VB.NET调用，这是CLR的IL中立性带来的

## 5. 编译与部署模式
### JIT（Just-In-Time Compilation）
CLR的一个核心组件，JIT是默认方式，但不是唯一方式\
它是一种介于解释执行和提前编译之间的执行方式\
**工作流程**
  - 当.NET程序首次运行时，CLR被加载
  - 在方法被首次调用前，CLR会检查该方法的CIL代码
  - JIT编译器被触发，将该方法的CIL代码实时编译成当前CPU架构可执行的本地机器码
  - 编译后的本地机器码被缓存到内存中。下次调用该方法时，直接执行缓存中的本地代码，无需再次JIT编译，这极大地提高了效率

### AOT（Ahead-of-Time Compilation）
与JIT相对。AOT编译器在程序运行之前就将CIL嗲买完全编译成本地机器码
- 优点：启动速度极快（无需JIT编译）、可以部署到不允许JIT编译的环境（如某些iOS限制）、更小的内存占用
- 实现：.NET提供了Native AOT（生成完全原生的独立可执行文件）和iOS AOT等模式

### R2R(ReadyToRun)
一种混合模式。程序集在发布时就被部分编译成本地代码（类似于AOT），但仍然需要CLR来运行（用于垃圾回收、反射等）。它是对纯JIT的一种优化，能显著改善大型应用的启动速度

## 核心组件与工具
- BCL(Base Class Library) / FCL(Framework Class Library)：.NET自带的一个巨大的、可重用的类库集合，提供了从文件操作、网络请求到数据结构等一切功能
- Roslyn(.NET Compiler Platform)：C#和VB.NET编译器的名字。它不仅仅是黑盒工具，更是一套开放的API。开发者可以利用Roslyn API进行代码分析、重构、甚至编写自己的代码生成工具，极大地丰富了.NET的开发工具生态
- ASP.NET Core：用于构建现代Web应用、API和微服务的高性能、跨平台框架，运行在统一的.NET平台上

## 一个C#程序的完整生命周期
1. 编写：程序员用C#编写源代码（`Program.cs`）
2. 编译：C#编译器将`Program.cs`编译成包含CIL的程序集（`Program.exe`）
3. 分发：将`Program.exe`和它依赖的其他程序集（`.dll`）分发给用户。用户需要安装对应版本的.NET运行时（即CLR）
4. 执行：用户双击`Program.exe`
5. 加载：操作系统启动，但识别出这是.NET程序，于是把控制权交给CLR
6. JIT编译：CLR加载程序集，当需要执行某个方法时，JIT编译器将该方法的CIL代码编译成本地机器码
7. 运行：CPU执行编译好的本地机器码
8. 管理：在整个过程中，CLR的垃圾回收器自动回收不再使用的内存，确保程序稳定高效运行

## 程序集（Assembly）
- 定义：程序集是.NET程序的基本部署单元，通常是一个`.dll`或`.exe`文件
- 内容：一个程序集包含三大块
  1. IL代码（Intermediate Language） -> C#语言编译后的中间语言
  2. 元数据（Metadata） -> 描述类型、方法、属性、特性等信息的表
  3. 资源（Resources）-> 嵌入的图片、字符串、配置文件等

可以理解为：程序集 = IL + 元数据 + 资源 + 清单（Manifest）\
当写下
```cs
public class Player {
  public int HP { get; set; }
  public void Attack() { Console.WriteLine("Attack!"); }
}
```
编译后，Player类的代码会被存成IL，而它的名字、属性、方法签名会写进程序集的元数据表

### 程序集的组成
一个程序集的结构大概是这样：
- PE文件头（和普通的Windows可执行文件相同）
- CLR Header（.NET Header）
- IL代码区：程序的逻辑，只是字节码序列，不自带参数名字、类型这些信息
- 元数据表：存放关于代码的描述信息，表示程序的结构，CLR在执行时会查元数据表来知道方法签名、类型层级等
  - TypeDef表：类/接口的定义
  - MethodDef表：方法定义（名字、签名、IL入口点）
  - FieldDef表：字段定义
  - Property表：属性定义
  - CustomAttribute表：特性
  - MemberRef表：引用了外部程序集的方法或字段
  - Assembly表：程序集信息（名字、版本、Culture、强名称等）
  - Module表：模块信息（一个程序集可能包含多个模块）
  - InterrfaceImpl表：结构实现关系
- Manifest：程序集清单：程序集的顶层描述信息，它本质上也存储在元数据表中，但概念上独立。让CLR知道如何加载这个程序集，提供程序集边界。内容包括：
  - 程序集的名称、版本号、区域性（Culture）
  - 强名称签名（如果有强签名）
  - 所有模块（.dll/.netmodule）的泪飙
  - 程序集依赖外部程序集及版本要求
  - 资源文件清单（比如嵌入的图片、配置文件）

可以用`ILDasm(IL Disassembler)`反汇编出来查看

#### CLR Header
CLR头是PE的一部分，是.NET专属结构，让Windows知道这个是.NET程序，不是普通程序

```css
[ DOS Header ]
[ PE Header ]
[ Section Table ]
[ CLR Header (.NET Header) ]   <─
[ Metadata ]
[ IL Code ]
[ Resources ]
```
- DOS Header：老DOS程序兼容头（一般没用）
- PE Header：标准Windows可执行文件头
- Section Table：程序代码和数据的区分表
- CLR Header：专门为.NET加的头部，告诉系统要用CLR执行
- Metadata/IL：程序的实际逻辑和描述

##### CLR Header具体内容
CLR Header其实是一个叫IMAGE_COR20_HEADER的数据结构（定义在`corhdr.h`里）\
它的主要作用：
1. 指明程序集是托管的（需要CLR运行）
2. 告诉CLR元数据和IL在文件中的位置和大小
3. 提供一些运行时信息（入口点、强名称签名、资源表位置等）

###### CLR Header的字段
简化版的`IMAGE_COR20_HEADER`包含这些信息
- cb：CLR Header结构的大小
- MajorRuntimeVersion/MinorRuntimeVersion：目标CLR版本
- MetaData：指向元数据区的RVA和大小
- Flags：程序集的特性标志，比如是否强名称签名、是否IL Only
- EntryPointToken：程序入口点（Main方法）的元数据标记
- Resources：资源数据的RVA和大小
- StrongNameSignature：强名称签名的RVA和大小
- CodeManagerTable/VTableFixups：托段代码运行时需要的结构

##### CLR Header的作用
- 对操作系统：告诉Windows Loader，这不是传统PE，而是.NET程序，需要加载CLR
- 对CLR：告诉CLR去哪里找到元数据、IL代码、入口点
- 对开发者：几乎透明，平时用不到，但反射、反编译器、IL2CPP都要用

```md
1. C# 语言概览，设计哲学
2. .NET CLR JIT IL等，上面的内容
3. CLI(Common Language Infrastructure), BCL(Base Class Library), FCL(Framework Class Library)
```