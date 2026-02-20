---
title: Unity Hot Update
date: 2025-06-01
categories: [Engine]
tags: [Unity, Hot Update, Lua]
author: "ljf12825"
type: blog
summary: Introduction to hot update ideas and several commonly used hot update methods
---
热更新指的是在游戏运行后，不需要重写打包和分发客户端，就能更新或修复代码、资源的机制\
简单理解：
- 不热更：出了bug -> 改代码 -> 重新打包 -> 玩家重新下载安装
- 热更：除了bug -> 改代码 -> 发布更新包 -> 玩家下小补丁，立即生效

为什么要用热更新
- 移动端、主机端游戏包体大、审核严格，频繁发新包代价极高
- 上线后bug修复：能第一时间止血
- 内容更新：节省分发成本（活动、新关卡、皮肤）
- 快速迭代：尤其是手游和运营类游戏


## Unity热更新常见方式
### 资源热更新
主要解决美术资源、配置文件更新问题\
实现思路：
- 把资源（Prefab/Texture/音效等）打成AssetBundle
- 游戏运行时从服务器下载最新AssetBundle -> 替换旧资源
- 配合资源版本管理（Manifest + Hash）

特点：
- 实现简单
- Unity官方支持
- 只能更新资源，不能更新逻辑代码

### 代码热更新
核心：C#脚本的运行时代码替换\
UnityC#脚本编译后会生成IL（中间语言），运行时通过Mono或IL2CPP执行\
要想热更，需要解决如何加载/执行新代码

常见方案：
1. 反射/动态加载DLL
  - 用Mono编译器在外部生成新的DLL
  - 游戏运行时加载（Assembly.Load）
  - 可以调用新逻辑，但有局限性

缺点：
  - IL2CPP平台不支持直接动态加载DLL（比如iOS）

2. ILRuntime（国内常用）
  - 一个开源的IL解释器
  - 运行时用解释执行外部编译的DLL
  - 解决了IL2CPP的限制，可以在iOS/Android都用

特点：
  - 跨平台
  - 活跃社区，国内大厂常用（比如热更新游戏项目）
  - 性能比原生IL差（解释执行）

3. HybridCLR（近几年兴起）
  - 思路是补全Unity剪掉的AOT元数据，让运行时能加载新的IL
  - 结合热更DLL + 补充元数据，实现近似原生的性能

特点：
  - 性能接近原生
  - 无需解释器，能跑在IL2CPP上
  - 实现复杂，生态还在发展

4. Lua/JS脚本热更
  - 用Lua、JS等脚本语言写游戏逻辑
  - Unity只负责运行时环境
  - 热更就是替换脚本文件

特点：
  - 逻辑热更灵活
  - 不依赖C#
  - 开发效率、IDE支持差，团队要适应

## 混合方案
- 资源用AssetBundle更新
- 逻辑用HybridCLR/ILRuntime/Lua热更
- 配置数据用JSON/CSV/ScriptableObject更新

## 热更的关键技术点
1. 版本管理
  - 需要有版本号、校验Hash、对比差异的机制

2. 更新流程
  - 检查更新 -> 下载资源/DLL -> 校验 -> 替换

3. 安全性
  - 防止恶意替换，通常用签名验证、加密

4. 灰度发布
  - 分批投放，避免更新导致全服崩溃

### 反射和动态加载DLL
这种方式尤其适用于C#脚本的运行时修改\
它的基本思想是将某些逻辑封装在DLL文件中，在游戏运行时动态加载这些DLL，并通过反射来调用其中的功能

#### 原理
**反射**\
反射是C#提供的机制，可以在运行时获取对象的元数据（如类、方法、属性等），并可以通过这些元数据来动态地实例化对象或调用方法\
它是热更新的核心技术之一，通常用来实现在不修改现有代码的情况下调用新DLL中的功能

**动态加载DLL**
C#提供了`Assembly.Load`方法，可以在运行时加载外部的DLL文件，并通过反射来访问其中的类型和成员（如类、方法）\
通过这种方式，可以将新版本中的DLL替换到游戏中，而无需重新打包整个应用

#### 实现
1. 将逻辑封装为DLL

  将业务逻辑代码编译成一个独立的DLL文件
    - 将这部分代码从Unity主项目中分离，独立编译成DLL
    - DLL中的功能可以是游戏中的各种逻辑模块，比如角色行为、敌人AI任务系统等

2. 在运行时动态加载DLL

  使用`Assembly.Load`来加载DLL文件。加载时，可以通过文件路径、资源流等方式加载DLL文件

  ```cs
  using System.Reflecion;

  // 动态加载DLL
  string dllPath = "Assets/HotUpdate/HotUpdate.dll";
  Assembly hotUpdateAssembly = Assembly.LoadFrom(dllPath);
  ```

3. 通过反射调用DLL中的类和方法

  加载完DLL后，可以通过反射来创建DLL中的对象并调用它们的方法\
  例如，假设有一个`Player`类，并且它有一个`Move`方法
  ```cs
  // 获取类型
  Type playerType = hotUpdateAssembly.GetType("HotUpdate.Player");

  // 创建实例
  object playerInstance = Activator.CreateInstance(playerType);

  // 获取方法并调用
  MethodInfo moveMethod = playerType.GetMethod("Move");
  moveMethod.Invoke(playerInstance, null); // 这里传入的参数可以根据需要传入
  ```

4. 处理依赖和接口

  如果想把某些接口保留给DLL使用，可以通过接口实现来避免代码耦合\
  在反射中，通常会使用接口来确保DLL中的代码能访问到需要的功能\
  例如，定义一个公共接口
  ```cs
  public interface IPlayer
  {
    void Move();
    void Attack();
  }
  ```
  然后在DLL中实现这个接口
  ```cs
  public class Player : IPlayer
  {
    public void Move() { /* 运动逻辑 */ }
    public void Attack() { /* 攻击逻辑 */ }
  }
  ```
  主程序运行时加载DLL后，可以通过反射获取到接口和实现类，避免直接引用DLL中的实现类，从而减少耦合

5. 更新和卸载DLL

  每当想更新代码时，只需要替换DLL文件，游戏运行时会加载新的DLL\
  可以实现代码的卸载和重新加载（但这在.NET环境下并不完全支持，尤其是在IL2CPP环境下），可以通过使用AppDomain来卸载和重新加载DLL

#### 特点
**优点**
1. 灵活性高
可以在不修改主程序的情况下更新代码。只需要替换 DLL 文件，玩家无需重新下载游戏
  - 如果是修复 bug 或者增加一些功能，特别是在线游戏，热更新非常有用

2. 快速修复和更新
缩短了开发周期，尤其是在测试阶段，能快速实现代码修改
  - 例如，修复客户端的小问题，可以只更新某个模块的 DLL，而不需要重新发布整包

3. 减少游戏包体大小
  - 大型游戏通常有很多可扩展的模块（如剧情、任务、AI等）
  - 只加载需要更新的DLL文件，避免了整包的更新

4. 跨平台支持
对于支持Mono的平台（如Android、PC），反射和动态加载DLL的方式可以很好地实现热更新\
对于iOS、主机平台等则存在一定限制（特别是IL2CPP环境下）

**缺点**
1. 性能开销
使用反射会带来一定的性能开销。虽然现代的 JIT 编译和优化技术已经减少了这些开销，但比起直接调用普通方法，反射的速度仍然较慢

2. 代码耦合性强
动态加载 DLL 可能会导致项目之间的依赖关系过于复杂，尤其是涉及到多个 DLL 之间的相互引用时
  - 需要通过接口或抽象类来进行解耦，但这增加了代码设计的难度

3. 调试难度增加
动态加载 DLL 后，调试时可能会遇到更多的困难，尤其是在 IDE 中无法直接追踪到 DLL 内的逻辑
  - 如果错误发生在 DLL 中，定位问题会更加复杂

4. IL2CPP不支持直接加载DLL
由于 Unity 的 IL2CPP 编译方式不支持直接加载 DLL，因此这对 iOS 和其他 IL2CPP 平台的支持较差
  - 解决方法是将代码转换成 C++，或者使用 HybridCLR 等解决方案

5. 内存管理问题
在运行时加载和卸载 DLL 会引入一定的内存管理问题，尤其是在没有垃圾回收机制的环境下（如 IL2CPP）
  - 如果没有正确管理内存，可能会导致内存泄漏等问题

#### 适用场景
1. 在线游戏bug修复
对于一些大型的 MMO 或 MOBA 类型的游戏，可能需要频繁修复小的 bug 或调整一些游戏逻辑。通过热更新方式，开发人员可以快速发布修复，用户无需等待长时间的更新包

2. 内容更新和新功能
如果游戏内有定期更新的新功能（例如新的活动、任务、道具等），这时也可以通过热更新的方式，定期加载新的 DLL，而不需要重新下载整个游戏客户端

3. 游戏内测试和调试
开发者可以将测试版本的 DLL 通过热更新的方式推送给玩家，以进行 A/B 测试或者验证某些游戏逻辑的调整，而不需要强制用户重新安装更新包

在实际应用中，反射和动态加载DLL方式常常与AssetBundle和配置文件热更新结合使用，形成一个完整的热更新解决方案

### ILRuntime
ILRuntime是一个开源的C#运行时，它可以在Unity或其他.NET环境中动态加载和执行C#代码，特别是运行时加载的DLL文件中的代码。它可以绕过一些Unity在编译时的限制，提供一种能够在IL2CPP环境下进行代码热更新的解决方案\
ILRuntime允许将游戏逻辑代码编译为单独的DLL文件，并在游戏运行时动态加载这些DLL。这些DLL可以包含希望更新的功能或修复的bug。ILRuntime会在运行时将IL代码加载并解释执行\

ILRuntime的核心功能：
- 热更新支持：通过动态加载IL编译的DLL文件，实现代码热更新
- 跨平台支持：ILRuntime可以在Unity的各种平台（包括iOS和Android）上允许，甚至支持IL2CPP
- 性能优化：ILRuntime提供了接近本地代码的性能，尤其是在Unity使用IL2CPP编译时，比传统的反射和动态加载DLL性能更高
- 支持跨线程执行：ILRuntime支持将热更新的逻辑运行在Unity的主线程以外，提升游戏的性能

#### ILRuntime的实现原理
**原理概述**
ILRuntime基于解释执行原理工作，它并不像传统的JIT（即时编译）那样将IL代码即时转换为机器码，而是通过反射和解释器来执行IL代码
- 加载DLL：ILRuntime会将外部的DLL加载到内存中，进行解析
- 执行IL代码：ILRuntime会通过内部的解释器执行IL代码，而不是直接编译成机器代码。它可以通过将IL代码映射到原生代码的方式来执行动态代码
- 托管代码调用：ILRuntime允许你调用托管代码中的方法、属性等，并且支持多态、委托、反射等常见的.NET特性

**工作流程**
1. 编译DLL：将游戏逻辑编译成一个独立的DLL文件
2. 加载DLL：游戏运行时，ILRuntime会加载这个DLL文件
3. 反射与调用：ILRuntime会通过反射等机制动态调用DLL中的类和方法，实现游戏的功能更新
4. 更新DLL：每次修改代码时，只需编译成新的DLL，然后通过热更新流程替换旧的DLL，游戏会加载新的代码逻辑

**核心组件**
- CLR模拟：ILRuntime基本上是通过模拟.NET CLR的运行时环境来解释执行IL代码
- 解释器：ILRuntime 提供了一套高效的解释器，可以解释执行 IL 代码，而不是通过 JIT 编译器生成机器码
- 跨平台支持：ILRuntime 在 Unity 上的实现特别适用于 IL2CPP 环境，它绕过了 IL2CPP 不支持动态加载 DLL 的限制

#### ILRuntime的特点
##### 优势
1. 性能较好
相比于传统的反射和动态加载 DLL 的方法，ILRuntime 提供了较好的性能，尤其是在 IL2CPP 环境下。ILRuntime 使用的是解释执行，因此相对较慢，但它比传统的反射 要高效
  - 对于需要高性能的游戏，它的性能优化已经足够接近原生代码

2. 跨平台支持
ILRuntime支持Unity所有主流平台，特别是IL2CPP（如iOS）\
ILRuntime解决了Unity在IL2CPP环境下无法动态加载DLL的问题

3. 简化开发
开发者可以在不修改主项目的前提下，通过热更新修复或修改游戏逻辑
  - 比如，修复bug、调整游戏参数、或者添加新功能，只需修改并替换DLL即可
  - 这减少了开发和测试的周期，提高了效率

4. 无缝集成到Unity中
ILRuntime可以与Unity无缝集成，开发者无需对现有的Unity项目做太多改动
  - 它提供了简单易用的API，可以在Unity中快速实现热更新

5. 支持跨线程执行
ILRuntime 支持将热更新代码的执行放在非主线程中，这对于有大量后台计算任务的游戏来说非常有用
  - 可以避免主线程被阻塞，提高游戏的流畅度

##### 缺点
1. 性能开销
尽管ILRuntime已经在性能上做了优化，但它仍然无法与原生编译的代码相媲美
  - 解释执行的方式相对于JIT编译和AOT编译仍然较慢，尤其是在需要大量计算和频繁调用的逻辑中，性能可能受到影响

2. 支持的特性有限
ILRuntime是一个运行时解释器，它并不是一个完全的CLR实现，因此在某些特性上的支持有限
  - 比如，ILRuntime可能不支持一些高级的.NET特性，这要求开发者在使用时要小心

3. 调试困难
由于热更新代码是通过 ILRuntime 在运行时动态加载的，因此调试热更新的代码比直接调试原生 C# 代码要困难一些
  - 特别是在 IDE 中，无法直接对加载到运行时的 DLL 进行调试，开发者需要通过日志和其他手段来调试

4. 内存管理问题
ILRuntime 主要依赖于 垃圾回收机制 来管理内存，因此在使用大量对象和频繁加载 DLL 的场景中，内存管理可能成为一个问题
  - 开发者需要特别注意内存泄漏和 卸载 DLL 时的资源释放

#### 使用场景
1. 游戏运营
  - 大型在线游戏：MMO、MOBA 等类型的游戏，在运营过程中需要频繁修复 bug 或更新游戏内容。ILRuntime 能够支持游戏中的 代码热更新，从而减少重新发布 APK 或重新审核包的时间

2. 灵活的插件系统
  - 插件式结构：一些游戏会采用插件化的架构，例如任务系统、剧情脚本等模块。ILRuntime 允许你把这些模块以 DLL 形式封装，并通过热更新动态加载

3. 快速迭代
  - 在开发阶段，尤其是原型开发阶段，ILRuntime 让开发者能够 快速测试新功能和修复 bug。只需替换 DLL 文件，而不需要重新打包整个游戏

4. 游戏调试和测试
  - 在游戏发布后，ILRuntime 可以支持 游戏内调试和修改。开发者可以在不影响其他部分代码的情况下，独立调试并测试热更新的模块

#### ILRuntime的使用
##### 1. 准备工作
安装并配置ILRuntime环境\
步骤1：导入ILRuntime到Unity
1. 下载ILRuntime，从GitHub或Unity Asset Stroe中
2. 导入Unity项目：
  - 打开Unity项目，在Assets目录下右键选择Import Package或者直接拖拽ILRuntime文件夹导入到项目中
在导入时，需要确保将ILRuntime相关的DLL（比如`ILRuntime.dll`）和支持文件添加到项目中

步骤2：配置ILRuntime
- ILRuntime会依赖Unity项目中的CLR环境，并通过ILRuntime提供的API来加载和执行运行时代码
- 配置完成后，确保`ILRuntime`目录和相关文件在Unity的Assets下正确存在

##### 2. 编译和部署DLL
ILRuntime热更新的关键在于将游戏逻辑代码单独编译为DLL，然后通过ILRuntime在运行时加载和执行\
步骤1：创建独立的项目和代码
1. 创建一个C#类库项目：在Visual Studio中创建一个新的Class Library项目，用于编写和编译热更新代码

例如创建一个`HotUpdate`类库
```cs
namespace HotUpdate
{
    public class GameLogic
    {
        public void StartGame()
        {
            UnityEngine.Debug.Log("Game Started!");
        }
    }
}
```

2. 引用ILRuntime
  - 在C#项目的引用中加入ILRuntime的DLL
  - 可以将ILRuntime的`ILRuntime.dll`拷贝到类库项目中，然后将其添加为引用

3. 编译DLL：编译类库项目，生成一个HotUpdate.dll文件。可以将该DLL文件放到Unity项目的StreamingAssets文件夹下，或者直接放到`Assets`目录下的某个子文件中

步骤2：编译其他需要的DLL
除了主游戏项目的C#代码外，可能还需要编译一些辅助库（例如定义接口的库）作为独立的DLL文件

##### 3. 在Unity中加载和运行DLL
步骤1：加载DLL\
在Unity中，需要编写一个脚本来加载并执行DLL中的代码。以下是加载和执行方法的基本步骤
1. 加载DLL文件：
ILRuntime提供了`ILRuntime.Runtime.Enviorment.AppDomain`来加载和管理动态加载的程序集

```cs
using ILRuntime.Runtime.Enviorment;
using System.Reflection;

public class HotUpdateManager : MonoBehaviour
{
  private AppDomain appDomain;

  void  Start()
  {
    // 初始化 ILRuntime环境
    appDomain = new AppDomain();

    // 加载DLL
    string dllPath = Applicaiton.streamingAssetsPath + "/HotUpdate.dll"; // 假设DLL在StreamingAssets下
    appDomain.LoadAssembly(dllPath);
  }
}
```

在这个例子中，`LoadAssembly`方法会加载之前编译好的HotUpdate.dll

步骤2：反射调用DLL中的类和方法
加载DLL后，需要通过反射调用其中的类和方法。ILRuntime提供的丰富的反射API，可以在运行时获取类型并调用方法\
例如：加载的DLL中包含一个`GameLogic`类和`StartGame`方法：
```cs
using ILRuntime.Runtime.Intereter;
using System;

public class HotUpdateManager : MonoBehaviour
{
  private AppDomain appDomain;

  void Start()
  {
    // 初始化 ILRuntime环境
    appDomain = new AppDomain();

    // 加载DLL
    string dllPath = Application.streamingAssetsPath + "/HotUpdate.dll";
    appDomain.LoadAssembly(dllPath);

    // 获取类型（反射）
    Type gameLogicType = appDomain.LoadedTypes["HotUpdate.GameLogic"];

    // 创建实例
    var gameLogicInstance = Activator.CreateInstance(gameLogicType);

    // 获取方法（反射）
    var startGameMethod = gameLogicType.GetMethod("StartGame");

    // 调用方法
    startGameMethod.Invoke(gameLogicInstance, null);
  }
}
```
- `appDomain.LoadedTypes`用于获取DLL中所有加载的类型
- `Activator.CreateInstance`用于动态创建类的实例
- `GetMethod`和`Invoke`用于动态调用方法

步骤3：处理参数和返回值
ILRuntime支持传递参数并处理返回值。当调用方法时，可以通过反射传递参数给方法，并接收返回值。
```cs
var method = gameLogicType.GetMethod("SomeMethod");
var result = method.Invoke(gameLogicInstance, new object[] { param1, param2 });
```

##### 4. 热更新流程
步骤1：替换DLL
热更新的关键就是替换DLL文件。内次修改并重新编译DLL，只需将新的DLL文件替换掉Unity项目中原有的DLL文件

ILRuntime会在游戏运行时加载新的DLL，并执行其中的代码。Unity会自动通过`LoadAssembly`加载并运行新的DLL

步骤2：动态切换逻辑
如果需要动态切换热更新逻辑（比如用户登录后加载不同的功能模块），可以在运行时加载不同版本的DLL或者不同模块的DLL\
例如，如果更新了某个DLL，可以通过以下方式重新加载并切换数据
```cs
appDomain.LoadAssembly(newDllpath); // 加载新的DLL
```

##### 注意事项
1. 跨平台支持：ILRuntime可以在Unity支持的所有平台上运行，特别适合于iOS和Android（IL2CPP环境）
2. 接口和继承：需要确保热更新的DLL能与主程序共享接口和基类，避免类型冲突。可以将一些接口和抽象类保存在一个公共的程序集（DLL）中
3. 性能考虑：ILRuntime会通过解释执行IL代码，这回带来一定的性能损失。虽然它已经做了优化，但对于高性能要求的游戏，仍需要注意性能瓶颈
4. 调试支持：ILRuntime的调试比直接调试C#代码困难，建议使用日志工具和测试工具来调试热更新代码

### HybridCLR
HybridCLR是一种Unity热更新方案，它解决了传统热更新技术在IL2CPP平台上遇到的限制
- 它允许你在IL2CPP环境下加载和执行C#热更新DLL
- 本质上是原生IL与AOT代码的混合执行，因此叫Hybrid（混合）CLR

特点：
- 支持IL2CPP（iOS、主机平台）
- 热更新性能接近原生C#
- 可以调用原生C++生成的AOT代码
- 支持泛型、委托、接口等完整C#特性

ILRuntime适合快速迭代、小项目，HybridCLR更适合商业项目和高性能需求

#### HybridCLR的原理
HybridCLR的核心是 AOT 补充 + IL 执行
1. AOT 预生成
Unity IL2CPP会将C#转换成C++，编译成机器码。HybridCLR会生成一份补充AOT元数据（Method/Type信息），以支持运行时加载新的DLL

2. DLL热更新
把热更新逻辑编译成DLL（纯IL代码），运行时通过HybridCLR的加载机制调用

3. 混合执行
  - 对AOT已有的方法直接调用原生代码
  - 对热更新DLL中的方法，HybridCLR会利用AOT元数据和IL来执行
  - 支持接口、泛型、委托、虚方法等特性

4. 优势
  - 不用解释执行，性能接近原生
  - 可以热更新几乎完整的C#逻辑
  - 支持IL2CPP平台

#### 使用场景
1. 商业游戏热更新
  - MMOG、MOBA、卡牌等长期运营游戏
  - 需要频繁修复逻辑bug或添加新功能

2. 性能敏感场景
  - 游戏核心逻辑、AI计算、战斗逻辑
  - 使用ILRuntime可能会有性能瓶颈，HybridCLR更适合

3. 跨平台热更新
  - Android/ iOS/ 主机/PC
  - HybridCLR支持所有IL2CPP平台

#### 使用
##### 步骤1：导入HybridCLR
1. 在Unity中导入HybridCLR包（从GitHub或 Unity Package Manager）
2. 配置HybridCLR插件：
  - 打开`HybridCLR/Settings`
  - 设置热更新DLL存放路径
  - 配置需要生成AOT补充的类型

##### 步骤2：编写热更新DLL
1. 创建一个独立的C# Class Library
2. 写希望热更新的逻辑，例如：
```cs
namespace HotUpdate
{
  public class Player
  {
    public void Move()
    {
      UnityEngine.Debug.Log("Player move!");
    }
  }
}
```
3. 编译DLL（确保使用.NET Framework 或 .NET Standard 与 Unity兼容）
4. 将DLL放到Unity项目的热更新目录（通常是`Assets/HotUpdate`或StreamingAssets）

##### 步骤3：生成AOT补充
HybridCLR需要生成AOT元数据补充文件
```bash
# HybridCLR提供了 Editor 工具来生成
HybridCLR/GenerateAOTMetadata
```
- 生成的文件会让 IL2CPP可以调用热更新DLL中的泛型、接口、虚方法等
- 这是HybridCLR核心所在，否则热更新DLL在IL2CPP上无法正常运行

##### 步骤4：加载和调用DLL
Unity热更新代码示例：
```cs
using HybridCLR;
using System;
using UnityEngine;

public class HotUpdateManager : MonoBehaviour
{
  void Start()
  {
    // 初始化 HybridCLR
    var dllPath = Application.streamingAssetsPath + "/HotUpdate.dll";
    var dllBytes = System.IO.File.ReadAllBytes[dllPath];

    HybridCLR.RuntimeApi.LoadMetadataForAOTAssembly(dllBytes); // 加载 AOT 补充

    // 调用热更新 DLL 中的逻辑
    var assembly = System.Reflection.Assembly.Load(dllBytes);
    var type = assembly.GetType("HotUpdate.Player");
    var instance = Activator.CreateInstance(type);
    var method = type.GetMethod("Move");
    method.Invoke(instance, null);
  }
}
```
- LodaMetadataForAOTAssembly是HybridCLR核心API，用于让IL2CPP可以调用热更新DLL
- 之后可以用反射或直接调用热更新逻辑

##### 步骤5：热更新流程
1. 修改热更新代码 -> 编译成新的DLL
2. 上传到服务器或替换 StreamingAssets下的DLL
3. 游戏运行时通过HybridCLR加载新的DLL -> 热更新生效

> 重点：因为HybridCLR使用AOT补充，几乎可以热更新所有C#逻辑，包括泛型、委托、接口和虚方法

#### 特点
##### 优点
1. 性能接近原生：几乎没有解释开销
2. 完整的C#支持：泛型、接口、委托、虚方法都可以热更新
3. 跨平台：IL2CPP平台也能热更新
4. 商业可用

##### 缺点
1. 配置复杂：
  - 需要生成AOT补充
  - DLL编译和路径管理需要规范

2. 调试比普通C#难：热更新逻运行在HybridCLR上，需要日志和测试工具
3. DLL更新流程稍复杂：热更新DLL + AOT补充同步发布

### Lua/JS脚本热更
#### 存在原因
1. C# 在 iOS 上不能JIT，早期Unity开发者为了热更，常用Lua/JS解释器来绕过限制
2. 脚本语言灵活：代码写好后直接存文本（.lua或.js），无需重新编译Unity工程
3. 资源热更配合：逻辑脚本放AssetBundle或远程下载，运行时动态加载

#### 原理
1. Unity中嵌入一个Lua/JS虚拟机（解释器）
  - Lua常用xLua、sLua
  - JS常用Puerts，底层基于V8引擎

2. Unity启动时
  - 先加载解释器（一个MonoBehaviour挂在场景里）
  - 把本地或服务器下载的`.lua/.js`文件读到内存，交给解释器执行

3. 脚本中调用Unity API
  - 通过绑定/桥接代码（C# <->Lua/JS）访问GameObject、Transform、UI等
  - 常见方式：代码生成器 + 反射注册

4. 逻辑更新时：新版本只需要下发Lua/JS脚本文件，Unity客户端无需重新打包

#### Lua热更示例（xLua为例）
**特点**
- 性能好，Lua解释器很轻量
- 对Unity API绑定比较成熟

**使用步骤**
1. 导入xLua插件
2. 初始化LuaEnv
```cs
LuaEnv luaenv = new LuaEnv();
luaenv.DoString("print('Hello Lua!')");
```

3. 从外部加载Lua脚本
```cs
string script = File.ReadAllText("path/to/script.lua");
luaenv.DoString(script);
```

4. C# 与 Lua互调
  - 在Lua注册一个函数 -> C#调用
  - 在C#注册一个delegate -> Lua调用

**热更方式**
- 脚本放到AssetBundle或StreamingAssets
- 启动时加载Lua文件，替换旧逻辑即可

#### JS热更示例（Puerts为例）
**特点**
- 绑定 TypeScript，支持静态检查、编辑器智能提示
- 可以使用npm包生态
- 对复杂项目开发体验更好，但性能略逊于Lua

**使用步骤**
1. 导入Puerts插件（内置V8引擎）
2. 初始化JsEnv：
```cs
JsEnv jsEnv = new JsEnv();
jsEnv.Eval("console.log('Hello Lua!')");
```
3. 调用Unity API
```js
const UnityEngine = require("csharp").UnityEngine;
UnityEngine.Debug.Log("Hello from JS");
```

4. 热更同理：加载`.js/.ts`文件，替换逻辑即可

#### 特点
##### 优点
- 真正的热更新，直接替换脚本，无需重新打包
- 脚本语言灵活，开发效率高
- 行业已验证可行性

##### 缺点
- 性能不如C#直接执行（解释执行/绑定开销）
- 与Unity API交互需要生成绑定代码，工作量大
- 逻辑写在Lua/JS中，IDE支持不如C#原生

#### 适用场景
- 移动端大项目：需要频繁修Bug或活动更新 -> Lua/JS热更更稳妥
- 原型开发：快速试错 -> JS/TS有利于迭代
- 不适合超高性能/计算密集，推荐ILRuntime/HybridCLR

