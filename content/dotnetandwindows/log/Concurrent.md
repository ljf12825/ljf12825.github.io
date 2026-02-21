---
title: C# Concurrent
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# concurrent
---

并发是真正能把程序“撑大”的武器，它出现的场景几乎都指向一个目标：把等待变成生产力，把CPU的空转变成有效工作

1. I/O等待
    只要程序遇到以下情况
    - 等网络
    - 等磁盘
    - 等数据库
    - 等文件
    - 等用户输入

线程就闲着；并发的作用就是：当A线程在等IO，CPU去处理B、C、D的任务\
例如：游戏里加载角色模型时，同时加载动画数据、贴图、音频，当然不想按顺序来等它们

2. 有大量独立任务的场景
    比如：
    - 上万条日志要解析
    - 上千张图片要压缩
    - 大规模数据格式转换
    - 游戏里AI代理（多NPC逻辑）

在这里，并发是为了把任务分给多个执行单元，让整体吞吐量大幅提升。本质是“流水线拆分”

3. 需要提高响应速度的场景
即便是单个请求，也可能需要并发\
比如游戏服务器收到一次战斗结算请求，它可能内部要：查数据库，算奖励，发消息到其他模块，写日志，推送给消息队列

这些步骤之间可能并行，这样整个请求响应更快；并发让系统更“灵动”，而不是“流水线式排队”

4. 实时性要求高的系统
比如：游戏主线程负责渲染，后台线程负责加载资源，另一个线程负责音频，另一个线程跑AI，再开几个线程做物理模拟\
没有并发，游戏就只能一帧做一件事

5. 分布式和服务端
服务端一天到晚都是并发：一个API接口，1秒中来了1万个请求，不可能同步一个个处理，必须让线程池、协程、事件循环把它们同时调度起来

6. 需要同时处理多个外部设备或数据源
    典型场景
    - 多摄像头数据流
    - 实时传感器
    - 多网络客户端
    - 同时从多个第三方API拉数据 

## 并发的意义
解决CPU空闲问题\
解决等待造成的浪费\
解决吞吐量不足的问题\
解决响应不够及时的问题\
解决系统结构不够灵活的问题\

只要发现程序经常“等”，那就是该上并发的地方

---

- 进程 vs 线程：可以把一个进程理解为一个独立的应用程序（比如一个打开的Word文档）。而线程则是进程内部的一个独立执行流。一个进程可以包含多个线程，这些线程共享进程的内存和资源（如静态变量、文件句柄等），但各自拥有独立的执行栈和寄存器
- 为什么要多线程
  - 保持UI响应：在桌面应用中，将耗时操作（如文件读写、网络请求）放在后台线程，可以防止用户界面“卡死”
  - 高效利用CPU：在多核CPU上，可以将工作分解到多个线程并行执行，充分利用计算资源，提高吞吐量
  - 异步操作：处理多个I/O密集型任务时，可以在一个线程等待时，让另一个线程继续工作

线程的唯一作用就是用来处理函数\
从操作系统角度来看：
- 线程 = 调度单位（获得CPU时间片）
- 函数 = 要执行的指令序列
- 执行函数 = 在时间片内运行这些指令

底层共识：绝大多数情况下，一个程序在启动时只会有一个主线程（Main Thread），除非主动创建其他线程，或者使用async/await让运行时调度线程池参与执行
1. 用户默认程序只有一个主线程
    这意味着
    - 你写的`Main()`只会在这个线程里跑
    - 普通同步代码都在这个线程执行
    - 没有显式创建线程，也没有人帮你创建线程
    - 程序的生命周期由这个线程的执行决定

    这是纯净、简单的单线程世界

2. async/await本身不会创建线程
    async/await是状态机，不是线程\
    只有当await任务涉及线程池时，才会“顺带”用到其他线程
```cs
await Task.Run(() => { ... });
```
这个才会跑到线程池（获取新线程）

但如果写
```cs
await Task.Delay(1000);
```
这只是设置一个计时器，主线程不被占用，但也没有新线程在跑代码

3. 系统内部可能偷偷创建线程，但与你写的逻辑无关
    比如：
    - GC在后台跑自己的线程
    - Finalizer线程负责清理对象
    - CLR/JIT有自己的辅助线程
    - 某些库可能创建IO线程
    - UI框架（WPF/WinForms/Unity）内部有自己的线程模型
    
    但这些线程不是你的业务线程，也不会执行你的代码

4. 只有显式声明了，才会出现并发
    以下情况会出现新线程或并发
    - `new Thread(...)`
    - `Task.Run(...)`
    - `.ContinueWith(...)`
    - `Parallel.For`
    - `async`配合一些IO/ThreadPool操作
    - 定时器（Timer）触发的回调
    - 后台服务（Host, Kestrel）启动时的线程池调度
    - 游戏引擎内部的worker thread
    
    但没有这些，你写的程序永远只有主线程在跑你的代码

5. 主线程退出 = 程序结束
    这是大多数系统的默认行为

    常规 Console App中
    - 主线程结束
    - 除非创建的是后台线程，否则程序直接退出

    如果创建后台线程（IsBackground = true），主线程结束时它直接被强制杀掉

    这也是为什么async Main可行\
    编译器会为async Main生成一个等待逻辑，使得主线程在async完成前不会退出

## C#中的线程生命周期 
C#的线程生命周期其实和操作系统底层的线程模型密切相关，只不过被.NET封装的更易用

### 主要状态
C#中线程对象（`System.Threading.Thread`）大致经历以下几个状态
1. Unstarted（未启动）
    - 线程被创建了，但还没开始执行
    - 例如
```cs
Thread t = new Thread(SomeMethod);
// 此时 t 处于 Unstarted 状态
```
直到调用`t.Start()`，它才会被交给操作系统调度

2. Running（运行中）
    - 调用`Start()`后，线程进入可调度状态，被操作系统安排执行
    - 此时线程在CPU上运行，执行传入的委托（`SomeMethod`）

3. WaitSleepJoin（等待/阻塞）
    - 当线程主动或被动地进入等待状态时，比如
      - 调用了`Thread.Sleep(ms)`
      - 调用了`Thread.Join()`等待另一个线程
      - 或者等待锁（`Monitor.Enter()`/`lock`）被释放
    - 在这期间它不会消耗CPU时间

4. Suspended（已挂起）现在已被弃用
    - 早期.NET支持`Suspend()`/`Resume()`，但后来被弃用，因为会导致死锁或状态不一致
    - 现代.NET不建议用这个状态，而是用信号量、事件或同步原语来控制执行

5. Stopped（已终止）
    - 线程执行完入口方法（或抛出未捕获异常）后，会进入此状态
    - 线程一旦终止，就无法重新启动。再次调用`Start()`会抛`ThreadStateException`

```ini
        ┌────────────┐
        │  Unstarted │
        └──────┬─────┘
               │ Start()
               ▼
        ┌────────────┐
        │   Running  │
        └──┬────┬────┘
           │    │
           │    │Sleep()/Wait()/Join()
           │    ▼
           │  ┌────────────┐
           │  │WaitSleepJoin│
           │  └──────┬─────┘
           │         │(被唤醒)
           └─────────┘
               │
               ▼
        ┌────────────┐
        │   Stopped  │
        └────────────┘
```


## 传统线程的使用（`System.Threading`）
`System.Threading`是.NET中的多线程与并发控制的核心命名空间，几乎所有的线程、锁、信号量、定时器、任务调度器都从这里生长出来。可以把它看作是“多线程操作系统的缩影”
```md
## 核心：线程与线程池
1. `Thread`
传统线程类，直接映射操作系统线程
- 启动/终止/挂起/唤醒线程
- 设置优先级、名字、后台/前台状态
- 控制线程生命周期

这是整个命名空间的核心

2. `ThreadPool`
线程复用机制。避免频繁创建和销毁OS线程，适用于短时任务\
CLR会自动管理线程数量和调度策略\
现代`Task`（`System.Threading.Tasks.Task`）内部几乎都运行在线程池上

## 同步与锁机制
线程间通信的关键部分，确保共享资源安全

| 类 | 作用 |
| - | - |
| `Monitor` | 最基础的同步锁（`lock`语法糖的底层实现）|
| `Mutex` | 系统级互斥锁，可以跨进程使用 |
| `Semaphore`/`SemaphoreSlim` | 控制并发访问数量的锁，比如限制同时执行的线程数 |
| `SpinLock` | 自旋锁，用于短时间锁定的高性能场景（避免线程切换开销）|
| `ReaderWriterlockSlim` | 允许多个读者、单个写者的锁（多读写少场景）|
| `Interlocked` | 原子操作（加减、交换、比较交换等），CPU级别原语 |
| `Volatile` | 保证读写不会被编译器/CPU重排序 |
| `Barrier` | 多线程同步点，所有线程都到达后才能继续执行 |
| `CountdownEvent` | 线程等待多个事件完成的同步点（类似倒计时锁）|
| `ManualResetEvent`/`AutoResetEvent` | 信号机制，用于线程间通知 |
| `EventWaitHandle` | 信号量的通用基类，可以手动/自动复位 |

## 并发工具与调度

| 类 | 说明 |
| - | - |
| `Timer` | 定时器，在后台线程上周期性执行回调 |
| `ThreadLocal<T>` | 线程本地存储，每个线程有独立的变量副本 |
| `LocalDataStoreSlot` | 较旧的线程局部存储API（`ThreadLocal<T>`的前身）|
| `ExecutionContext`/`SynchronizationContext` | 控制上下文流动（比如异步方法中保持当前线程环境）|
| `LazyInitializer` | 延迟初始化工具类，线程安全地延迟构造对象 |
| `SpinWait` | 主动自旋等待（比Thread.Sleep更轻量）|

## 线程安全与并发基础结构
- `ThreadPriority`：线程优先级枚举
- `ThreadState`：线程状态枚举（Unstarted、Running、Stopped...）
- `ThreadAbortException`, `ThreadInterruptedException`：线程控制相关异常
- `ThreadStaticAttribute`：让静态变量在不同线程中拥有独立副本

```

### `Thread`
`System.Threading.Thread`是对操作系统原生线程（Windows下是Win32 thread, Linux下是pthread）的封装\
它允许你显式地控制线程的创建、启动、休眠、优先级、后台运行等细节

在现代C#中，一般用`Task`和`async/await`，但理解`Thread`才能真正明白底层是怎么运转的

### 创建与启动线程
最基础的创建方式是传入一个委托（`ThreadStart`或`ParameterizedThreadStart`）
```cs
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        Thread t = new Thread(PrintNumbers);
        t.Start(); // 启动线程

        // 主线程继续执行
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Main: {i}");
            Thread.Sleep(200);
        }
    }

    static void PrintNumbers()
    {
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Worker: {i}");
            Thread.Sleep(300);
        }
    }
}
```
执行后可以看到主线程与子线程交错输出，说明它们在并发运行

### 带参数的线程
传统线程不能像`Task`那样轻易传参，只能通过`ParameterizedThreadStart`或Lambda
```cs
Thread t = new Thread(obj => {
    string name = (string)obj;
    Console.WriteLine($"Hello, {name}!");

});
t.Start("ljf12825");
```
或者直接捕获外部变量
```cs
string name = "ljf12825";
Thread t = new Thread(() => Console.WriteLine($"Hello, {name}!"));
t.Start();
```

### 前台线程 vs 后台线程
- 前台线程：默认创建的线程是前台线程。只要有一个前台线程在运行，进程就不会结束
- 后台线程：将`IsBackground`属性设置为`true`。当所有前台线程结束时，后台线程会被CLR强制终止，无论它是否执行完毕。适合做后台服务、监控等不关键的任务
```cs
Thread bgThread = new Thread(DoWork);
bgThread.IsBackground = true; // 设置为后台线程
bgThread.Start();
```

### 线程控制操作
`Thread`提供一套基础的控制API

| 方法 | 作用 |
| - | - |
| `Start()` | 启动线程 |
| `Join()` | 等待线程结束 |
| `Sleep(ms)` | 让当前线程暂停指定毫秒数 |
| `Abort()` | 强制终止线程（已废弃）|
| `Interrupt()` | 中断处于阻塞状态的线程 |
| `isAlive` | 判断线程是否仍在运行 |
| `ThreadState` | 获取当前状态（如Running、Stopped等）|

### 线程优先级与命名
每个线程都有优先级（Priority）和名字（Name）属性，方便调试和调度
```cs
Thread t = new Thread(SomeWork)
{
    Name = "WorkerThread",
    Priority = ThreadPriority.AboveNormal
};
t.Start();
```
优先级只是调度建议，操作系统可以无视它。真正的性能调度仍由内核决定

### 线程同步与安全
多个线程访问共享资源时，可能会发生竞态条件，导致数据不一致\
传统线程编程的最棘手的就是同步问题\
主要的同步原语包括
- `lock`（语法糖，底层是`Monitor`）
- `Monitor.Enter/Exit/Wait/Pulse`
- `Mutex`
- `Semaphore`
- `AutoResetEvent`/`ManualResetEvent`

示例：使用`lock`关键字（Monitor语法糖）
```cs
class BankAccount
{
    private readonly object _balanceLock = new object(); // 专用的锁对象
    private decimal _balance = 1000;

    public void Withdraw(decimal amount)
    {
        // 使用 lock 确保同一时间只有一个线程能进入此代码块
        lock (_balanceLock)
        {
            if (_balance >= amount)
            {
                Console.WriteLine($"Balance before withdrawal: {_balance}");
                _balance -= amount;
                Console.WriteLine($"Balance after withdrawal: {_balance}");
            }
        }
    }
}
```
注意：
- 锁对象通常使用`private readonly object`
- 避免锁定`this`, `Type`对象或字符串，因为这可能导致意外的死锁

### Thread中的异常
在C#中，线程内抛出的异常默认情况下不会自动传递到创建该线程的父线程，如果不进行专门的处理，这些异常可能会导致线程静默失败

```cs
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        Console.WriteLine("主线程开始");
        
        try
        {
            // 创建并启动新线程
            Thread thread = new Thread(Worker);
            thread.Start();
            
            // 主线程继续执行
            Thread.Sleep(2000);
            Console.WriteLine("主线程结束");
        }
        catch (Exception ex)
        {
            // 这里不会捕获到工作线程的异常！
            Console.WriteLine($"主线程捕获到异常: {ex.Message}");
        }
        
        Console.ReadLine();
    }
    
    static void Worker()
    {
        Console.WriteLine("工作线程开始");
        Thread.Sleep(1000);
        
        // 在工作线程中抛出异常
        throw new InvalidOperationException("工作线程发生错误！");
        
        // 这行代码不会执行
        Console.WriteLine("工作线程结束");
    }
}
```
解决方案
1. 在线程方法内部捕获异常
```cs
static void SafeWorker()
{
    try
    {
        Console.WriteLine("安全的工作线程开始");
        Thread.Sleep(1000);
        throw new InvalidOperationException("工作线程发生错误！");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"工作线程内部捕获异常: {ex.Message}");
        // 可以记录日志、通知主线程等
    }
}
```

2. 使用自定义异常处理机制
```cs
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        Console.WriteLine("主线程开始");
        
        Exception workerException = null;
        
        Thread thread = new Thread(() =>
        {
            try
            {
                Worker();
            }
            catch (Exception ex)
            {
                workerException = ex;
            }
        });
        
        thread.Start();
        thread.Join(); // 等待线程完成
        
        if (workerException != null)
        {
            Console.WriteLine($"捕获到工作线程异常: {workerException.Message}");
        }
        else
        {
            Console.WriteLine("工作线程正常完成");
        }
        
        Console.WriteLine("主线程结束");
    }
    
    static void Worker()
    {
        Console.WriteLine("工作线程开始");
        Thread.Sleep(1000);
        throw new InvalidOperationException("工作线程发生错误！");
    }
}
```

3. 使用Task和async/await
4. 使用Task异常处理

### 传统线程的代价
优点是完全控制、无抽象损耗；
缺点是繁琐、难以管理、容易死锁、线程数量有限

每个线程都占用独立的栈（默认1MB左右），频繁创建销毁非常昂贵\
因此后来引入了线程池（`ThreadPool`）和任务系统（Task）来复用线程

可以这样看待层级关系
```txt
Thread -> 最底层封装（控制粒度最大）
ThreadPool -> 自动管理线程生命周期
Task -> 基于线程池的逻辑任务抽象
async/await -> 语法层面的异步封装
```
掌握`Thread`是理解并发体系的“地基”\
上层封装虽然方便，但它们都在依赖底层`System.Threading`的线程模型

## 现代C#的并发编程（推荐方式）
虽然`Thread`类很基础，但直接管理线程非常繁琐。现代C#推荐使用更高级的抽象

### 线程池（`ThreadPool`）
线程池（`ThreadPool`）是C#并发体系从“手动并发”走向“自动调度”的分水岭\

#### 是什么
线程池（Thread Pool）是.NET CLR内置的线程管理器，它维护一组可复用的工作线程（worker threads），用来执行短小、频繁的任务，而不是为每个任务都创建新的`Thread`对象\
它更像是一个基础设施，而不是直接给业务层用的工具\
它会出现以下问题：
- 无法感知异常：如果任务里抛异常，主线程完全不止
- 无法等待任务完成（除非用同步手段自己实现）
- 无法组合任务（不能像Task那样ContinueWith或await）
- 不支持取消或超时控制
- 不能获取返回值
- 调试和跟踪困难

普通业务逻辑几乎永远不该直接用ThreadPool，只有极少数情况下才直接用它，比如：
- 写自定义的异步/并行库
- 控制线程池的配置（`SetMinThreads`, `SetMaxThreads`）
- 手动调度一批轻量短任务，而不需要结果或同步
- 写性能测试、底层框架

但它是Task的底层依赖，所以需要研究它

#### 存在意义
创建一个线程的代价相当高昂
- 需要分配独立的栈内存（默认1MB）
- 注册到操作系统的调度器
- 上下文切换（CPU的寄存器、缓存状态保存/恢复）
- 销毁时还要回收资源

如果每个任务都创建线程，系统开销会爆炸\
线程池的解决方式是——预创建 + 循环复用

#### 用法
```cs
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        ThreadPool.QueueUserWorkItem(Work, "Task1");
        ThreadPool.QueueUserWorkItem(Work, "Task2");

        Console.WriteLine();
    }

    static void Work(object state)
    {
        Console.WriteLine($"Thread {Thread.CurrentThread.ManagedThreadId} handling {state}");
        Thread.Sleep(500);
    }
}
```
输出示例
```text
Thread 4 handling Task1
Thread 5 handling Task2
```

#### 线程池的特性
1. 自动调度
CLR会根据负载动态调整线程数
- 当任务积压时，线程数增加
- 当系统空闲时，线程会回收或休眠

2. 线程复用
线程执行完任务后会返回池中等待下一个任务

3. 限制最大数量
默认线程池的最大线程数受系统资源限制，可通过
```cs
ThreadPool.GetMaxThreads(out int worker, out int io);
```
获取

4. 分为两类线程
    - Worker Threads：普通任务
    - I/O Completion Threads：异步I/O回调使用（如网络、文件操作）

5. 后台线程
池中的线程都是后台线程（`IsBackground = true`）\
所以主程序退出时，它们不会阻止线程结束

#### 线程池的生命周期
简单来说，它经历
```
初始化 -> 分配任务 -> 运行 -> 归还 -> 空闲等待（或销毁）
```
线程池管理器（ThreadPoolMgr）负责
- 追踪队列中的任务数
- 动态分配新线程
- 平衡CPU利用率与响应速度

CLR内部有一个hill climbing algorithm（爬山算法）来决定最优线程数：
它会定期评估吞吐量变化，调整线程数量

##### hill climbing algorithm
CLR线程池的核心目标是：自动维持一个最优线程数，使CPU利用率最高、任务延迟低\
何为“最优线程数”
- 线程太少 -> CPU闲置，吞吐量低
- 线程太多 -> 上下文切换频繁，CPU反而浪费时间在调度上

线程池必须在两者之间动态平衡，这就是hill climbing algorithm的职责

###### 直觉理解
将线程数视为X轴，吞吐量视为Y轴
- 当线程数量太少时，增加线程数会提高吞吐量
- 但到达某个临界点后，增加线程数反而会降低吞吐量（因为调度负担太重）

```
吞吐量 ^
       |            /\  
       |           /  \
       |          /    \
       |_________/______\_______> 线程数
                     ↑
                 最优点
```
CLR线程池做的事就是：动态调整线程数，沿着“山坡”寻找最高点

###### 算法核心思想
Hill Climbing是一种启发式搜索算法\
.NET版本大致遵循以下过程：
1. 初始化阶段
    - 程序启动时，线程池有一个最小线程数（例如每核1~2个）
    - 然后进入采样阶段
2. 周期性采样
    - CLR每隔一段时间测量一次“吞吐量”（即单位时间内完成的工作项数）
    - 它会记录：
      - 当前线程数
      - 最近完成的任务数
      - 平均延迟、排队长度
3. 调整方向
    - 如果吞吐量增加，说明上坡 -> 再多开几个线程
    - 如果吞吐量下降，说明越界 -> 少开几个线程
    - 这就像盲人登山：一步步试探坡度方向
4. 调整步幅
    - 初期步幅较大（探测快）
    - 越接近峰值步幅越小（避免来回震荡）
5. 平滑机制
    - 使用低通滤波（Exponential Moving Average）平滑采样波动
    - 避免短期噪声导致线程数频繁抖动

###### 伪代码
实际的实现要复杂很多，但逻辑类似
```cs
while (true)
{
    MeasureThroughput();

    if (throughput > lastThroughput)
        threadCount += step; // 上坡：增加线程
    else
        threadCount -= step; // 下坡：减少线程
    
    step *= 0.9; // 越来越小
    lastThroughput = throughput;

    Sleep(sampleInterval);
}
```
源码在[runtime/src/libraries/System.Private.CoreLib/scr/System/Threading/PortableThreadPool.HillClimbing.cs](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/Threading/PortableThreadPool.HillClimbing.cs)\
微软的完整实现，里面有积分控制、采样窗口、噪声抑制等高精度逻辑

#### 与Task的关系
现代C#的`Task`（`System.Threading.Tasks.Task`）实际上就是运行在线程池上的任务抽象
```cs
Task.Run(() => DoWork());
// 本质上等价于 ThreadPool.QueueUserWorkItem()
```
区别在于
- `ThreadPool`只接受无返回值的回调
- `Task`能返回结果、链式调度、支持异常传播和取消

#### 线程池 vs 普通线程

| 特性 | Thread | ThreadPool |
| - | - | - |
| 创建方式 | 手动`new Thread()` | 自动复用 |
| 是否后台线程 | 可前台 | 全后台 |
| 生命周期 | 明确控制 | 自动管理 |
| 适合场景 | 长时间运行的任务 | 短小频繁的任务 |
| 可控性 | 高（能设置优先级等）| 低（由CLR管理）|

游戏主循环、实时数据采集等长生命周期任务，用`Thread`\
日志写入、网络请求、AI计算这种短任务，用线程池

#### `ThreadPool`的配置与监控
可通过以下方法调整
```cs
ThreadPool.GetMinThreads(out int workerMin, out int ioMin);
ThreadPool.GetMaxThreads(out int workerMax, out int ioMax);

ThreadPool.SetMinThreads(8, 8); // 保证最低并发线程数
```

###### 任务饥饿与长任务
线程池适合短、快、频繁的任务\
如果在池中执行长时间阻塞任务，会导致“任务饥饿”：长任务霸占线程，其他任务排队，调度器无法及时响应\
解决方案
```cs
Task.Factory.StartNew(LongTask, CancellationToken.None, TaskCreationOptions.LongRunning, TaskScheduler.Default)
```
加上`LongRunning`提示调度器为它创建独立线程，避免堵塞池内线程

### Task任务并行库（TPL, Task Parallel Library）-现代首选
TPL是.NET Framework 4 引入的一个核心并发组件，用于简化多线程与并行编程\
TPL本质是一个高层封装：在传统的`Thread`, `ThreadPool`, `BackgroundWorker`基础上，提供了更现代、更易控制的并行模型

#### 核心概念：`Task`
`Task`是TPL的基本单位，表示一个异步操作或任务\
它可以在未来某个时刻完成（或失败、或被取消）
相比旧式的`Thread`, `Task`更轻量，能自动调度执行（通常在线程池中），并且支持
- 返回结果（通过`Task<TResult>`）
- 异常传播
- 任务取消（`CancellationToken`）
- 任务组合（`ContinueWith`, `WhenAll`, `WhenAny`）

从底层看，Task是一个由线程池驱动的轻量线程单元，但它不是线程
- 线程：执行的实际载体（Thread）
- 任务：逻辑上的工作单元（Task）

##### Task的生命周期
任务的状态变化大致如下
```txt
Created -> WaitingToRun -> Running -> RanToCompletion / Faulteed / Canceled
```
- Created：创建但未启动
- WaitingToRun：等待调度执行
- Running：正在执行
- RanToCompletion：正常完成
- Faulted：执行中抛出异常
- Canceled：任务被取消

```cs
Task t = new Task(() => Console.WriteLine("执行任务"));
Console.WriteLine(t.Status); // Created
t.Start();
t.Wait();
Console.WriteLine(t.Status); // RanToCompletion
```
在实际开发中，几乎不用`new Task()` + `Start()`，而是用更简洁的
```cs
Task.Run(() => Console.WriteLine("执行任务"))；
```

##### 带返回值的任务`Task<TResult>`
有返回值时使用泛型版本`Task<TResult>`，它在完成后会返回结果
```cs
Task<int> t = Task.Run(() => {
    int sum = 0;
    for (int i = 0; i < 100; i++) sum += i;
    return sum;
});
Console.WriteLine(t.Result);
```
`Result`会阻塞直到结果可用，相当于`t.Wait()`之后取值\
如果在异步方法里，可以直接用`await`
```cs
int result = await Task.Run(() => Compute());
```

##### 异常处理
Task的异常不会直接抛出，而是被包装成`AggregateException`
```cs
try {
    Task t = Task.Run(() => throw new InvalidOperationException("出错了"));
    t.Wait();
} catch (AggregateException e) {
    Console.WriteLine(e.InnerException.Message); // 出错了
}
```
异步方法中用`await`时，异常会自动解包，不需要显式处理`AggregateException`
```cs
try {
    await Task.Run(() => throw new InvalidOperationException("出错了"));
} catch (Exception e) {
    Console.WriteLine(e.Message);
}
```

##### 取消任务
Task与`CancellationToken`搭配可实现任务取消机制
```cs
var cts = new CancellationTokenSource();
var token = cts.Token;

Task t = Task.Run(() => {
    for (int i = 0; i < 10; i++)
    {
        token.ThrowIfCancellationRequested();
        Console.WriteLine(i);
        Thread.Sleep(500);
    }
}, token);

// 请求取消
cts.Cancel();
```
`ThrowIfCancellationRequested()`会抛出`OperationCanceledException`，让任务进入`Canceled`状态而不是`Faulted`

##### 等待与继续（Wait/ContinueWith）
可以在任务完成后继续执行另一个任务
```cs
Task t1 = Task.Run(() => Console.WriteLine("任务1"))；
Task t2 = t1.ContinueWith(prev => Console.WriteLine("任务2在任务1之后执行"));
```
或者等待任务完成
```cs
Task t = Task.Run(() => DoWork());
t.Wait(); // 阻塞等待
```
`ContinueWith`更灵活，适合串联任务或构造任务依赖图

##### Task的执行上下文（调度器）
`Task`并不是总在新线程执行\
默认情况下，它使用`ThreadPoolTaskScheduler`调度，意味着：
- 可能在线程池的任意线程执行
- 系统会自动管理并发量
- 对于`async/await`，会自动在适合的同步上下文（如UI线程）恢复执行

简单示例
```cs
Task t = Task.Run(() => {
    Console.WriteLine("任务在线程池中执行");
});
t.Wait(); // 阻塞直到任务完成
```
带返回值的版本
```cs
Task<int> t2 = Task.Run(() => {
    return Enumerable.Range(1, 100).Sum();
});
Console.WriteLine($"结果：{t2.Result}");
```

##### Task与ThreadPool
`Task.Run()`和`TaskFactory.StartNew()`实际上都是往线程池中提交一个任务项（work item）\
它不会立刻建立新线程，而是交给线程池的调度器去决定
- 当前是否有空闲线程
- 线程池中任务队列的负载情况
- 是否需要扩展线程数

```text
Task.Run() 
   ↓
TaskScheduler（默认 ThreadPoolTaskScheduler）
   ↓
ThreadPool（工作线程队列）
   ↓
执行任务
```

底层结构示意
```txt
┌──────────┐       ┌────────────────┐       ┌───────────────┐
│  逻辑层  | ---> │ 调度器(TaskScheduler) │ ---> │ 执行层(ThreadPool) │
└──────────┘       └────────────────┘       └───────────────┘
    Task                   调度策略                   线程资源
```
- Task：定义任务做什么
- Scheduler：决定任务何时、在哪执行
- ThreadPool：实际执行代码的物理线程群

###### `TaskScheduler`
`TaskScheduler`是调度策略层
- 默认调度器是`ThreadPoolTaskScheduler`，直接用线程池
- 也可以自定义调度器，比如限制并发数、绑定到特定线程等

###### Task的执行路径（简化流程）
以`Task.Run()`为例
1. 创建一个`Task`对象
2. 调用默认的`TaskScheduler`
3. 调度器将任务封装成`ThreadPoolWorkItem`
4. 把它丢进线程池的全局任务队列
5. 线程池中的某个空闲线程取出任务执行
6. 执行完毕后，线程回到池中等待下一次任务

###### 线程池的调度策略
.NET的线程池调度算法相当复杂，但可以简化理解为
- 最小线程数：初始线程数（通常是CPU核数）
- 最大线程数：默认32767
- 动态扩容：如果任务太多、线程都在忙，线程池会延迟性地添加新线程
- 任务偷取（work stealing）：每个线程有资金及的本地队列，如果自己空了，会“偷”别的线程的任务以保持负载均衡

#### TPL的调度机制
##### TaskScheduler
TaskScheduler是Task的任务分配中心；当调用
```cs
Task.Run(() => Work());
```
或者
```cs
new Task(() => Work()).Start();
```
其实底层都调用了
```cs
TaskScheduler.Current.QueueTask(task);
```
也就是说，TaskScheduler决定了
- 这个任务在哪个线程上执行
- 什么时候执行
- 是否排队、并行或串行执行

##### 默认调度器：线程池调度器
绝大多数情况下，TPL使用的是
```cs
TaskScheduler.Default
```
这个默认调度器使用.NET ThreadPool（线程池）执行任务\
这也是为什么Task是轻量级的原因——它们共享线程池中的线程

默认行为特征：
- 会利用CPU的核心数（基于工作窃取算法）
- 并行任务由多个线程池线程执行
- 线程是后台线程（不会阻止进程退出）
- 当CPU忙碌时，线程池会延迟创建新线程

##### 工作窃取算法
这是TPL调度效率的关键\
每个线程池维护一个本地任务队列
- 当线程自己创建了新任务（比如在`Parallel.For`或递归任务中），会把任务放进自己的队列
- 如果本地队列空了，就从其他线程的队列“偷取”任务执行

这种策略有两个巨大的好处
- 减少竞争锁：线程大多操作自己队列，互不干扰
- 负载均衡：空闲线程会主动偷任务，防止部分线程闲置

这让TPL能高效地在多核CPU上分配任务负载

##### 任务调度的上下文：Current vs Default

| Scheduler | 含义 |
| - | - |
| `TaskScheduler.Default` | 全局默认调度器（线程池）|
| `TaskScheduler.Current` | 当前上下文的调度器 |

示例
```cs
Task t = Task.Factory.StartNew(() => {
    Console.WriteLine(TaskScheduler.Current);
});
```
如果在普通控制台程序中执行：-> `TaskScheduler.Current` == `TaskScheduler.Default`\
如果在UI程序（如WPF、WinForms）或ASP.NET中执行：-> `TaskScheduler.Current`会绑定到UI或请求上下文

这就意味着：
- 在UI中`await`会恢复到主线程
- 而`Task.Run`则强制调度到线程池线程

这种机制保证了
- 异步后台逻辑不阻塞UI
- UI更新在正确的线程执行

##### 自定义调度器
TPL允许完全接管调度器逻辑——创建自己的TaskScheduler

比如：一个顺序执行调度器（所有任务都在同一线程顺序执行）
```cs
class SingleThreadTaskScheduler : TaskScheduler
{
    private readonly BlockingColleciton<Task> _task = new();

    public SingleThreadTaskScheduler()
    {
        var thread = new Thread(new ThreadStart(Execute));
        thread.IsBackground = true;
        thread.Start();
    }

    private void Execute()
    {
        foreach (var task in _tasks.GetConsumingEnumerable())
        {
            TryExecuteTask(task);
        }
    }

    protected override IEnumerable<Task> GetScheduledTasks() => _tasks;

    protected override void QueueTask(Task task) => _tasks.Add(task);

    protected override bool TryExecuteTaskInline(Task task, bool taskWasPreviouslyQueued)
    {
        // 禁止内联执行，强制排队
        return false;
    }
}
```
使用
```cs
var scheduler = new SingleThreadTaskScheduler();
Task.Factory.StartNew(() => DoSomething(), CancellationToken.None, TaskCreationOptions.None, shceduler);
```
这个任务会在调度器专属线程上执行

这种自定义调度器可以用于：
- 游戏逻辑主线程（Unity就常用类似机制）
- 串行执行（避免锁竞争）
- 限制并发数量
- 调试或性能分析

##### 任务的内联执行（Inlining）
有时任务会被“内联”执行（即直接在当前线程运行）
```cs
t.ContinueWith(..., TaskContinuationOptions.ExecuteSynchronously);
```
如果设置了`ExecuteSynchronously`，调度器可能直接在当前线程调用`TryExecuteTask`，省去了线程切换开销

这在频繁小任务中能显著减少上下文切换成本

##### 任务调度的可控选项
可以通过`TaskCreationOptions`或`TaskContinuationOptions`影响调度：
- `LongRunning`：提示调度器单独开线程（绕过线程池）
- `PreferFairness`：尽量按提交顺序调度
- `HideScheduler`：子任务不继承父调度器
- `AttachedToParent`：让子任务附属父任务的生命周期
- `ExecuteSynchronously`：尽量内联执行

#### 并行化API：Parallel类
`Parallel`是TPL的另一部分，用于在CPU密集型任务中自动并行化循环
```cs
Parallel.For(0, 10, i => {
    Console.WriteLine($"任务 {i} 在线程 {Thread.CurrentThread.ManagedThreadId}");
});
```
或者并行遍历集合
```cs
Parallel.ForEach(Enumerable.Range(1, 10), i => {
    Console.WriteLine($"处理 {i}");
});
```
`Parallel`会自动分配线程并负载均衡，也可以通过选项控制
```cs
var options = new ParallelOptions { MaxDegreeOfParallelism = 4 };
Parallel.ForEach(data, options, ProcessItem);
```

#### 任务控制、组合、依赖、取消和异常
单个任务只是“异步函数”，当能控制、组合、取消和捕获错误时，它才成为一种可编排的异步系统

##### 任务控制
任务控制就是掌握任务的生命周期和执行行为
1. 启动与等待
Task默认会在创建时自动启动（`Task.Run`就是如此）\
但也可以显式控制它
```cs
Task t = new Task(() => Console.WriteLine("手动启动任务"));
t.Start(); // 启动
t.Wait(); // 等待任务结束
```
`Wait()`会阻塞当前线程，直到任务完成

2. 检查状态
任务的状态可以通过`t.Status`获取
```cs
Console.WriteLine(t.Status); // Created, Running, RanToCompletion, Faulted, Canceled
```
还有两个方便的布尔属性
```cs
t.IsCompleted;
t.IsFaulted;
t.IsCanceled;
```

3. 控制选项
通过`TaskCreationOptions`可以定制任务行为，例如
```cs
Task.Factory.StartNew(Action, CancellationToken.None, TaskCreationOptions.LongRunning, TaskScheduler.Default);
```
- `LongRunning`：提示调度器单独开线程（不占用线程池）
- `PreferFairness`：尽量按提交顺序执行
- `AttachedToParent`：让子任务附属于父任务（父任务等待所有子任务完成）

##### 任务组合
这是TPL的强项：任务可以组成成更大的逻辑单元
1. ContinueWith链式执行
```cs
Task.Run(() => 42)
    .ContinueWith(prev => prev.Result * 2)
    .ContinueWith(prev => Console.WriteLine(prev.Result));
```
这相当于手动写了一个“任务管道”\
但是`ContinueWith`不会自动在UI线程恢复，也不会传播异常\
因此现代C#用`await`替代它
```cs
int r = await Task.Run(() => 42);
r *= 2;
Console.WriteLine(r);
```

2. 组合多个任务
可以把多个任务组合在一起等待或竞争
- `Task.WhenAll`：等待所有任务完成
```cs
var tasks = new[] {
    Task.Run(() => DoA()),
    Task.Run(() => DoB())
};
await Task.WhenAll(tasks);
Console.WriteLine("所有任务都完成")；
```

- `Task.WhenAny`：等待第一个完成的任务
```cs
var t1 = Task.Run(() => SlowWork());
var t2 = Task.Run(() => FastWork());

Task finished = await Task.WhenAny(t1, t2);
Console.WriteLine($"先完成的是 {finished.Id}");
```

3. 组合返回值
`WhenAll`返回所有任务的结果
```cs
Task<int>[] tasks = {
    Task.Run(() => 1).
    Task.Run(() => 2),
    Task.Run(() => 3)
};

int[] results = await Task.WhenAll(tasks);
Console.WriteLine(results.Sum()); // 6
```

##### 任务依赖
任务依赖表示一个任务需要等待另一个任务完成后才能执行；TPL允许显式表达这种关系
```cs
Task<int> t1 = Task.Run(() => 5);
Task<int> t2 = t1.ContinueWith(prev => prev.Result * 2);
Task<int> t3 = t2.ContinueWith(prev => prev.Result + 3);
Console.WriteLine(t3.Result); // 13
```
但在现代写法中，推荐
```cs
int result = await Task.Run(() => 5);
result = result * 2;
result = result + 3;
```
编译器在背后把这转成状态机，会自动维护这些依赖关系

##### 任务取消
TPL的取消机制是协作式的；任务自己检查是否被取消，而不是强制终止
1. 基本结构
```cs
var cts = new CancellationTokenSource();
var token = cts.Token;

Task t = Task.Run(() => {
    for (int i = 0; i < 10; i++) {
        token.ThrowIfCancellationRequested();
        Console.WriteLine(i);
        Thread.Sleep(500);
    }
}, token);

// 取消任务
cts.Cancel();
```
当`ThrowIfCancellationRequested()`被调用时，任务会抛出`OperationCanceledException`，状态变为`Canceled`

2. 任务主动响应取消
```cs
Task t = Task.Run(async () => {
    while (!token.IsCancellationRequested) {
        Console.WriteLine("Running...");
        await Task.Delay(500);
    }
});
```
如果不检查`token`，任务是不会自动停的

3. 组合取消
多个任务可以共享一个`CancellationToken`，统一控制
```cs
CancellationTokenSource cts = new();
var token = cts.Token;

Task t1 = Task.Run(() => Work1(token));
Task t2 = Task.Run(() => Work2(token));

// 一次取消全部
cts.Cancel();
```

##### 任务异常
Task的异常管理非常系统化
1. 同步等待
如果用`Wait()`或访问`Result`，异常会被包装在`AggregateException`里
```cs
try {
    Task t = Task.Run(() => throw new InvalidOperationException("出错了"));
    t.Wait();
} catch (AggregateException e) {
    Console.WriteLine(e.InnerException.Message);
}
```

2. 异步等待
使用`await`时，C#编译器会自动拆包，直接抛出原始异常类型
```cs
try {
    await Task.Run(() => throw new InvalidOperationException("出错了"));
} catch (Exception e) {
    Console.WriteLine(e. GetType()); // InvalidOperationException
}
```

3. 多个异常
如果多个任务都出错（比如`WhenAll`），异常会聚合
```cs
vaar tasks = new[] {
    Task.Run(() => throw new Exception("A")),
    Task.Run(() => throw new Exception("B"))
};

try {
    await Task.WhenAll(tasks);
} catch (Exception e) {
    foreach (var ex in ((AggregateException)e).InnerExceptions)
        Console.WriteLine(ex.Message);
}
```

##### TPL与async/await
TPL是`async/await`的基础\
`async/await`把TPL的回调结构（`ContinueWith`）变成了更优雅的语法糖
```cs
async Task<int> ComputeAsync()
{
    await Task.Delay(1000);
    return 42;
}
```
编译器会自动把这个转换成`Task.ContinueWith`链式调用

#### `CancellationToken`
它的作用是优雅停止异步操作的信号源\
它允许一个操作（比如一个长时间运行的任务）被另一个操作（比如用户点击“取消”按钮）安全地取消\
它是一个“取消信号”，一个线程（或异步任务）会时不时地检查这个信号，如果它发现信号被触发（即收到了取消请求），它就会优雅地停止当前的工作

##### 存在意义
在没有`CancellationToken`的时代，停止一个线程通常需要使用像`Thread.Abort()`这样的方法，这种方法是强制性的和不安全的，因为它会立即中断线程，可能导致资源未释放、数据处于不一致状态等严重问题\
`CancellationToken`提供了一种协作式的机制：
- 请求方：发出取消请求
- 执行方：负责在**方便且安全**的时候检查取消请求，并做出响应
- 这确保了程序状态的稳定性和数据的一致性

异步任务可能
- 正在等待IO
- 正在下载资源
- 正在跑无限循环
- 正在执行流式逻辑（如IAsyncEnumerable）
- 正在队列里排队没开始执行

不可能随手暴力把它杀掉，否则
- 文件句柄泄露
- 套接字没关闭
- 不一致状态
- 死锁
- Unity/游戏服务器直接炸掉

`CancellationToken`是避免这些灾难的现代解法

##### 关键组成部分
`CancellationToken`通常与`CancellationTokenSource`一起使用
1. `CancellationTokenSource`
    - 这是取消信号的“创建者和控制器”
    - 它负责生成`CancellationToken`并通过调用`.Cancel()`方法来触发取消
2. `CancellationToken`
    - 这是传递给需要被取消的操作的“信号本身”
    - 执行中的代码通过检查这个Token来感知是否收到了取消请求

##### 运作机制
各个任务（Task, async, IAsyncEnumerable）持续监听广播（取消令牌, CancellationToken），取消源（CancellationTokenSource）一旦发出取消信号，各个任务就会执行一套关闭流程（清理资源并停止）\
异步操作一般有三个地方响应取消
1. 显式检查
```cs
token.ThrowIfCancellationRequested();
```
2. 传入异步方法，让内部自己检查
```cs
await Task.Delay(1000, token);
```
3. 在异步流自然响应取消
`await foreach`会把token注入给enumerator，让MoveNextAsync在内部检查

所有这些机制最终做的事情是一样的：发现token被取消 -> 抛出 OperationCanceledException -> 异步逻辑马上停止

这就是“协作式取消”


##### 本质
一个结构体，内部记录了“是否取消”的状态，供任务读取
```cs
var cts = new CancellationTokenSource();
CancellationToken token = cts.Token;
```
- `CancellationTokenSource`（源）能发出取消信号
- `CancellationToken`（令牌）是read-only，他把它传给所有可能“要停”的地方

当
```cs
cts.Cancel()
```
token的内部状态会从
```cs
IsCancellationRequested = false
```
变成
```cs
IsCancellationRequested = true
```
然后任务就会基于这个状态自己停下来

##### 使用示例
1. 同步操作中的取消
```cs
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        // 1. 创建信号控制器
        var cancellationTokenSource = new CancellationTokenSource();
        // 2. 获取信号令牌
        var token = cancellationTokenSource.Token;

        // 3. 启动一个长时间运行的任务，并传递 token
        Task longRunningTask = Task.Run(() =>
        {
            for (int i = 0; i < 1000; i++)
            {
                // 4. 在循环中定期检查取消请求
                if (token.IsCancellationRequested)
                {
                    // 执行清理工作（如果需要）
                    Console.WriteLine("任务被取消了！");
                    return; // 优雅地退出任务
                }

                // 模拟工作
                Thread.Sleep(500);
                Console.WriteLine($"工作进度： {i}");
            }
        }, token); // 注意：Token 也在这里传递给 Task.Run，以便任务在开始前就能被取消。

        Console.WriteLine("按 ‘c’ 键来取消操作...");
        if (Console.ReadKey(true).KeyChar == 'c')
        {
            // 5. 用户按下 ‘c’，触发取消
            Console.WriteLine("\n正在请求取消...");
            cancellationTokenSource.Cancel();
        }

        // 等待任务完成（无论是正常完成还是因取消而完成）
        try
        {
            longRunningTask.Wait();
        }
        catch (AggregateException ae)
        {
            // 如果任务因为取消而抛出 OperationCanceledException，它会在这里被捕获
            ae.Handle(e => e is OperationCanceledException);
            Console.WriteLine("任务已确认取消。");
        }

        Console.WriteLine("主线程结束。");
        cancellationTokenSource.Dispose(); // 好的实践：释放资源
    }
}
```
2. 异步操作中的取消
```cs
using System;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // 1. 创建信号控制器
        using var cts = new CancellationTokenSource();
        var token = cts.Token;

        // 2. 设置一个超时取消（5秒后自动取消）
        cts.CancelAfter(5000);

        try
        {
            // 3. 调用一个支持取消的异步方法
            await DoLongRunningWorkAsync(token);
            Console.WriteLine("工作成功完成！");
        }
        catch (OperationCanceledException) // 专门捕获取消异常
        {
            Console.WriteLine("工作被取消或超时了！");
        }
    }

    static async Task DoLongRunningWorkAsync(CancellationToken cancellationToken = default)
    {
        for (int i = 0; i < 10; i++)
        {
            // 4. 最推荐的方式：直接抛出异常来终止操作
            cancellationToken.ThrowIfCancellationRequested();

            // 或者，你也可以手动检查并处理
            // if (cancellationToken.IsCancellationRequested)
            // {
            //     // 进行一些清理...
            //     throw new OperationCanceledException("Operation was cancelled.", cancellationToken);
            // }

            // 模拟异步工作
            await Task.Delay(1000, cancellationToken); // 注意：Task.Delay 也接受 Token！
            Console.WriteLine($"完成了第 {i + 1} 项工作。");
        }
    }
}
```
在这个异步示例中，5秒后`cts`会自动触发取消，`Task.Delay`和`DoLongRunningWorkAsync`中的`ThrowIfCancellationResquested()`会抛出`OperationCanceledException`，从而跳出循环，在`Main`方法的`catch`块中捕获

##### 主要特性和方法
- `IsCancellationRequested`：一个布尔属性，如果取消被请求，则返回`true`。用于手动检查
- `ThrowIfCancellationRequested()`：如果取消被请求，这个方法会立即抛出一个`OperationCanceledException`。这是在异步和并行任务中最常用的方式
- `WaitHandle`：提供了一个可以用来等待取消信号被触发的等待句柄（主要用于旧的同步代码）
- `Register(Action callback)`：允许注册一个回调方法，当取消被触发时，这个方法会被执行。适用于需要资源清理的场景

### `async`/`await`

#### 异步的出发点：非阻塞的任务执行
同步调用时，线程会一直等待任务完成
```cs
var data = Download(); // 阻塞直到返回
Console.WriteLine(data);
```
异步的目标是：当等待的工作还没完成时，让当前线程去干别的事

传统方式是用回调
```cs
DownloadAsync(url, result => {
    Console.WriteLine(result);
});
```
但回调地狱太混乱，于是C#发明了一个魔法：用同步的写法描述异步逻辑

#### `async`/`await`是什么
`async`修饰方法，让它能使用`await`并自动返回一个`Task`（声明这个方法中可能会出现异步操作）\
`await`修饰“可能产生延迟（返回Task）的操作”，告诉编译器这里是异步等待点（标记在这里暂停，把后续代码拆出来，等这个任务完成后再继续）

这两个关键字配合Task，让异步代码像同步代码一样清晰
```cs
async Task<int> GetDataAsync()
{
    var data = await DownloadAsync(); // 暂停点
    return data.Length;
}
```
这段代码的真实运行过程，其实是：
1. 执行到`await`
2. 把后续代码打包成“回调”
3. 当前方法返回一个未完成的Task
4. 当DownloadAsync完成后，自动恢复执行后面的逻辑

#### 编译器行为

编译器看到`async`/`await`后，会
1. 生成一个隐藏的“状态机类”（类似协程的结构体）
2. 把你的方法体拆成若干个状态块（case语句）
3. 用字段记录当前状态、返回值、异常等
4. 当Task完成后，调度器会触发状态机的“下一步执行”

```cs
async Task<int> FooAsync()
{
    await Task.Delay(1000);
    return 42;
}
```
编译器会把它变成（简化版伪代码）
```cs
private struct FooAsyncStateMachine : IAsyncStateMachine
{
    public int _state;                        // 当前状态
    public AsyncTaskMethodBuilder<int> _builder;  // 异步任务构建器
    private TaskAwaiter _awaiter;             // await 对象

    void IAsyncStateMachine.MoveNext()
    {
        int result;
        try
        {
            if (_state == -1)  // 初始状态
            {
                _awaiter = Task.Delay(1000).GetAwaiter();
                if (!_awaiter.IsCompleted)
                {
                    _state = 0;  // 设置下一个状态
                    _awaiter.OnCompleted(MoveNext);  // 注册回调
                    return;       // 返回控制权
                }
            }

            if (_state == 0)
            {
                _awaiter.GetResult();  // 等待结果
            }

            result = 42;
            _builder.SetResult(result);  // 通知任务完成
        }
        catch (Exception e)
        {
            _builder.SetException(e);
        }
    }

    void IAsyncStateMachine.SetStateMachine(IAsyncStateMachine stateMachine) { }
}
```
然后，原始方法`FooAsync()`会变成
```cs
Task<int> FooAsync()
{
    var stateMachine = new FooAsyncStateMachine();
    stateMachine._builder = AsyncTaskMethodBuilder<int>.Create();
    stateMachine._state = -1;
    stateMachine._builder.Start(ref stateMachine);
    return stateMachine._builder.Task;
}
```
也就是说：
- `AsyncTaskMethodBuilder<T>`是真正创建和管理`Task<T>`的对象
- 状态机只是封装控制流
- `MoveNext()`控制执行的进度
- 每个`await`都可能导致状态暂停与恢复

##### `AsyncTaskMethodBuilder`
这个类型是async/await与TPL之间的关键连接点\
它的职责包括
1. 创建一个`Task`
2. 持有结果或异常
3. 驱动状态机（调用`MoveNext()`）
4. 协调同步上下文

简化理解
```cs
public struct AsyncTaskMethodBuilder<T>
{
    private TaskCompletionSource<T> _tcs;

    public static AsyncTaskMethodBuilder<T> Create() => new AsyncTaskMethodBuilder<T>();

    public Task<T> Task => _tcs.Task;

    public void SetResult(T result) => _tcs.SetResult(result);

    public void SetException(Exception e) => _tcs.SetException(e);

    public void Start<TStateMachine>(ref TStateMachine sm) where TStateMachine : IAsyncStateMachine => sm.MoveNext();
}
```
真实实现要复杂的多（比如优化内存分配、支持同步上下文切换），但原理是一致的

##### `Awaiter`与`OnCompleted`
每个可以被`await`的类型都必须实现`GetAwaiter()`，返回一个awaiter对象，它实现以下接口
```cs
public interface INotifyCompletion
{
    void OnCompleted(Action continuation);
}
```
常见的`awaiter`类型
- `TaskAwaiter`
- `ConfiguredTaskAwaitable.ConfiguredTaskAwaiter`

当`await`遇到未完成的任务：
1. 编译器会调用`GetAwaiter()`
2. 如果`awaiter.IsCompleted == false`:
    - 保存当前状态
    - 注册`awaiter.OnCompleted(MoveNext)`
    - 返回
3. 当任务完成后，`await`调用`MoveNext()`恢复执行

##### 与`TaskScheduler`/`SynchronizationContext`的协作
当异步任务恢复执行时，系统需要决定在哪个线程上继续执行

这里有两种策略
1. 如果当前存在`SynchronizationContext`（例如WPF/WinForms UI线程），则使用它
2. 否则，回到默认调度器（即线程池TaskScheduler）

这就是为什么
```cs
await Task.Delay(1000); // UI线程不会卡死
label.Text = "Done"; // await后自动回到UI线程
```
在内部`awaiter.OnCompleted`会这样调用
```cs
SynchronizationContext.Current.Post(_ => MoveNext(), null);
```
而如果写了
```cs
await Task.Delay(1000).ConfigureAwait(false);
```
那么它会跳过同步上下文，直接在`ThreadPool`上继续执行


##### 异常取消与传播及支付
- 在状态机的`MoveNext()`内部，所有异常都会被`catch`到
- 然后交给`_builder.SetException(e)`
- 这样，外层的Task就会进入Faulted状态
- 当`await`它时，编译器会自动解包异常，重新`throw`出来

同理，取消机制通过`CancellationToken`协调，当检测到取消请求时，`TaskCanceledException`会被抛出并封装

##### 与TPL的关系
Task是运行单位，async/await是语法糖\
`async`/`await`本质上是基于TPL的异步状态机
```txt
Task = 任务抽象（执行单位）
TPL = 任务调度与依赖框架
async/await = 状态机语法层（让异步更像同步）
```
```
Thread -> ThreadPool -> Task -> async/await
```
每一层都往更高层抽象和自动化

```txt
async 方法调用
    ↓
编译器生成状态机（IAsyncStateMachine）
    ↓
AsyncTaskMethodBuilder 创建 Task
    ↓
遇到 await：
       ├─> 任务未完成 → 注册 OnCompleted 回调 → 返回控制权
       └─> 任务已完成 → 直接执行下一步
    ↓
任务完成时回调 MoveNext()
    ↓
恢复状态 → 执行下一部分逻辑
    ↓
最终调用 SetResult() / SetException()
    ↓
外部 await 任务，获取结果或捕获异常

```

#### async方法的返回类型

| 返回类型 | 含义 |
| - | - |
| `Task` | 无返回值异步方法 |
| `Task<T>` | 有返回值异步方法 |
| `void` | 特殊用法（通常只用于事件处理）|

```cs
async Task<int> ComputeAsync() { ... }
```
返回的是一个`Task<int>`对象\
`await ComputeAsync()`实际上等价于
```cs
var t = ComputeAsync();
var result = t.Result; // 只是 await 不会阻塞
```

#### await的工作机制
`await`并不会“阻塞”线程\
它做的事情是
- 检查Task是否完成
- 如果完成了，直接取结果继续执行
- 如果没完成，则注册一个回调（在Task完成后调用），然后退出方法

这时，方法已经返回一个未完成的Task，外层可以`await`它\
整个调用链因此形成异步的“任务接力”\
也就是说，线程不是被卡住了，而是被释放取干别的任务；程序的执行暂停了，但线程没闲着

`await`就像Unity的`yield return`，但更强：它有类型安全、异常传播、同步上下文等特性

##### 什么时候会“像是”阻塞
1. 如果在主线程（UI线程或控制台主函数）里调用
```cs
SomeAsyncMethod().Wait();
```
或
```cs
var result = SomeAsyncMethod().Result;
```
那就会真的阻塞线程，因为`.Wait()`是同步等待，不释放线程

2. 或者当异步任务内部出现死循环、未真正异步的操作，那就算加了`await`，也会卡死线程

#### 同步上下文（SynchronizationContext）
这是`await`的一个隐藏特性\
当在UI线程（如WPF、WinForms）里执行`await`时
- `await`之后的代码会自动回到原线程（UI线程）执行
- 这是通过`SynchronizationContext`记录上下文完成的

```cs
async void Button_Click(...)
{
    await Task.Delay(1000);
    label.Text = "Done"; // 回到 UI 线程安全地修改控件
}
```
但如果在控制台或服务器环境（无UI上下文），await后续的代码通常会在线程池线程执行

在库代码或高性能场景下，通常不希望回到原上下文
```cs
await SomeIOAsync().ConfigureAwait(false);
```
这会告诉编译器：恢复执行时不必切回原线程，直接在线程池上继续执行\
这是避免UI同步上下文死锁的关键手段

#### 异常传播
如果异步方法内部抛出了异常，编译器会自动将其封装到Task内部
```cs
try
{
    await FailingAsync();
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}
```
区别在于：`await`自动帮你解包异常，不用手动访问`AggregateException`

### 现代C#开发指南
1. 默认选择`async/await`：对于I/O密集型操作（文件、网络、数据库）
2. 使用`Task.Run`：对于需要卸载到后台的CPU密集型操作
3. 尽量避免直接使用`Thread`：除非有非常特殊的、需要精细控制的场景
4. 永远不要使用`Thread.Abort()`：它会引发`ThreadAbortException`，可能导致资源无法正确释放和状态不一致，非常危险