---
title: "Thread"
date: 2025-06-01
categories: [Note]
tags: [Unity, Unity System]
author: "ljf12825"
summary: Thread in Unity(Overview of Unity's Threading Model, Unity API and Thread Limitations, Thread/Task/JobSystem/DOTS, How to Reture to the Main Thread)
---
Unity中的线程机制和使用方式，包括：
- Unity的线程模型概览
- Unity API与线程限制
- 在Unity中使用线程的四种方式（Thread/Task/Job System/DOTS）
- 回到主线程的方法

## Unity线程模型概览
Unity整个运行环境围绕主线程组织，它的执行流程大致如下：
```scss
主线程（Unity Loop）：
 ├─ Start()
 ├─ Update()
 ├─ 渲染提交
 ├─ 动画更新
 ├─ 物理处理（同步 PhysX）
 └─ LateUpdate()
```
**主线程的作用：**
- 唯一能安全访问大多数Unity API的线程
- 游戏逻辑、生命周期函数、事件处理等全部在主线程中执行

## Unity API的线程限制
> Unity引擎的绝大多数API不是线程安全的，只能在主线程中访问

常见不可在子线程中调用的内容：

| 类型         | 示例                                                 |
| ---------- | -------------------------------------------------- |
| 场景对象       | `transform.position`、`gameObject.SetActive()`      |
| UI 操作      | `Text.text`、`Image.sprite`、`CanvasGroup.alpha`     |
| 加载资源       | `Resources.Load`、`AssetBundle.LoadAsset`           |
| UnityEvent | `Invoke()`、`AddListener()`                         |
| 摄像机/渲染设置   | `Camera.fieldOfView`、`RenderSettings.ambientLight` |

### 为什么大多数Unity API不是线程安全的
> 线程安全是指多个线程同时访问某个资源时，不会出现数据竞争、资源冲突或者状态不一致；
> 换句话说，线程安全的代码能保证即使多个线程同时调用，也不会导致程序崩溃或出现错误

#### 1.引擎设计的历史和架构
- Unity是基于单线程渲染和游戏逻辑设计的引擎
- 主线程同时负责游戏逻辑更新、场景管理、物理模拟和渲染指令的提交
- 内部实现很多数据结构和资源管理是非并发安全的，没有加锁保护

#### 2.性能考虑
- 加锁和同步机制会引入性能开销，尤其在游戏高帧率需求下非常敏感
- Unity为了最大化性能，避免在API层面使用大量锁机制，导致API不是线程安全
- 线程安全的实现往往会降低性能，而Unity选择了“主线程访问”策略，性能和复杂度间的平衡

#### 3.复杂的状态和资源管理
- Unity API涉及大量复杂资源（场景、纹理、网格、动画、物理对象等）
- 这些资源的状态常常依赖于引擎内部复杂的生命周期管理和渲染管线
- 多线程访问同一资源可能导致状态不同步、竞争条件和崩溃

#### 4.引擎内部很多操作并非原子性
- 例如`transform.position`实际是底层C++引擎中的一个复杂结构体操作
- 多线程同时读写可能破坏数据一致性，导致场景物体“错乱”或崩溃

## Unity中使用多线程的四种方式
### 1.`Thread`类（低级方案）
适用场景：非常简单的子线程计算任务
```cs
using System.Threading;

void Start()
{
    Thread t = new Thread(() =>{
        int result = HeavyCompute();
        Debug.Log("不能再这里操作 Unity API!");
    });
    t.Start();
}
```
缺点：
- 手动管理生命周期
- 无法直接“回主线程”
- 不支持返回值

### 2.`Task` + `async/await`（推荐方式）
适合：异步加载、复杂逻辑封装
```cs
async void Start()
{
    int result = await Task.Run(() => HeavyCompute());
    // 回到主线程，可以安全使用 Unity API
    Debug.Log($"计算结果：{result}");
}
```
优点：
- 语法简洁
- 自动线程切换
- 支持异常处理
注意：
- `await`后续代码回自动返回主线程（如果是Unity编译器）

### 3.Unity Job System（高性能并发）
适用场景：大量数据并发处理（如物理模拟、AI批量计算）
```cs
using Unity.Burst;
using Unity.Collections;
using Unity.Jobs;

[BurstCompile]
public struct MyJob : IJob
{
    public NativeArray<int> data;

    public void Execute()
    {
        for (int i = 0; i < data.Length; i++)
            data[i] = data[i] * 2;
    }
}

void Start()
{
    NativeArray<int> arr = new NativeArray<int>(100, Allocator.TempJob);

    for (int i = 0; i < arr.Length ++i) arr[i] = i;

    var job = new MyJob { data = arr };
    JobHandle handle = job.Schedule();
    handle.Complete();

    Debug.Log(arr[10]);
    arr.Dispose();
}
```
特点：
- Job数据结构需使用`NativeArray`
- 不支持引用类型（string, class, GameObject）
- 高性能（支持Burst编译器）

### 4.Unity DOTS （ECS + Job + Burst）
适用场景：高度并发的大型项目（如模拟类游戏、成千上万个实体）  
ECS配合Job System形成完整的数据驱动架构  
优点：
- 极致性能
- 自动调度系统和Job
- 易于并行化和分布式
缺点：
- 和传统GameObject不兼容

## 回到主线程的方法
### 场景：你在子线程或Task中获得数据，想更新UI或GameObject
#### 方法一、使用`async/await`自动切换回主线程
```cs
async void LoadData()
{
    string json = await Task.Run(() => File.ReadAllText("config.json"));
    myText.text = json; // 主线程
}
```

#### 方法二、自己封装一个主线程执行器
```cs
public class MainThreadDispatcher : MonoBehaviour
{
    private static readonly Queue<Action> actions = new Queue<Action>();

    public static void Enqueue(Action action)
    {
        lock (actions)
        {
            actions.Enqueue(action);
        }
    }

    void Update()
    {
        lock (actions)
        {
            while (actions.Count > 0)
                actions.Dequeue()?.Invoke();
        }
    }
}
```
使用：
```cs
ThreadPool.QueueUserWorkItem(_ => {
    string data = HeavyLoad();
    MainThreadDispatcher.Enqueue(() => myText.text = data);
});
```

## 使用多线程的场景
- 重计算任务（如路径寻路、AI、噪声生成）
- 网络请求、数据库访问
- 文件读写、图片压缩等I/O操作
- 海量数据处理（如ECS中的大量实体模型）
> 主线程外只用于非Unity API的计算，不允许访问Unity对象，执行完毕后记得退回主线程

### Unity引擎内部是多线程的
虽热大多数逻辑跑在主线程，但Unity引擎内部会使用多线程来提升性能

| 功能           | 是否多线程     | 说明                |
| ------------ | --------- | ----------------- |
| PhysX 物理引擎   |  多线程     | Unity 会自动并行化处理    |
| Audio 音频系统   |  多线程     | 音频解码、播放管理在后台      |
| 渲染管线（SRP）    |  多线程     | 在某些平台支持多线程提交渲染指令  |
| Animation 系统 |  多线程（部分） | 有些姿态计算在 Job 系统中进行 |



