---
title: "Unity Asynchronous and Coroutine"
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity Async]
author: "ljf12825"
summary: Principles and examples of asynchronous and coroutine usage
---
在Unity中，异步编程主要应用于长时间运行的操作或I/O操作，例如加载场景、资源（如纹理、音频文件）、进行网络请求或其他非阻塞操作。Unity提供了几种常见的方式来实现异步操作，通常通过协程和异步编程API（如`async/await`）来实现

## Asynchronous
Unity 从 2017 版本开始支持 `async/await` 异步编程方式，它是 C# 的一部分，适用于处理 耗时的异步操作，如网络请求、文件操作等。通过 `async` 标记方法，并在需要等待的地方使用 `await`，可以简化代码并使其更加可读

**示例：异步加载资源（UnityWebRequest）**  
假设你要从网络上下载文件，可以使用`async/await`来实现非阻塞的异步操作：
```cs
using UnityEngine;
using UnityEngine.Networking;
using System.Threading.Task;

public class AsyncExample : MonoBehaviour
{
    async void Start()
    {
        string url = "https://example.com/resource";
        string result = await DownloadDataAsync(url);
        Debug.Log("下载完成：" + result);
    }

    // 异步下载数据
    private async Task<string> DownloadDataAsync(string url)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(url))
        {
            // 发送请求并等待结果
            await webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.Success)
                return webRequest.downloadHandler.text; // 返回下载的文本内容
            else return "错误：" + webRequest.error;
        }
    }
}
```
在这个例子中，`DownloadDataAsync`使用`async/await`来处理异步操作。`awatiwebRequest.SendWebRequest()`会等待请求完成，避免阻塞主线程

异步操作的常见用途：
- 网络请求：例如从服务器获取数据或上传数据
- 文件操作：读取/写入大文件时避免主线程阻塞
- 资源加载：异步加载资源（比如大型的纹理、音频文件等）

异步编程优缺点：
- 优点：
  - 代码更简洁、易于理解
  - 支持现代C#异步模式，错误处理更加方便
  - 完全非阻塞主线程，不会影响UI和游戏的流畅性

- 缺点：
  - 对于资源加载（如场景加载）等操作，仍然需要通过Unity自带的API来实现
  - 不适用于每一类异步操作，尤其是涉及到Unity特有的对象和接口时

## Coroutine
Unity Coroutine是一种允许在多帧中分布执行代码的机制，它通常用于处理一些需要在多个帧之间等待的任务，比如延时操作、动画播放、资源加载等  
协程本质上是通过一种特殊的方式执行代码，它可以在执行过程中“暂停”并在后续的帧继续执行  

协程是通过`StartCoroutine()`来启动的。协程通常返回一个`IEnumerator`类型的方法
```cs
using UnityEngine;
using System.Collections;

public class CoroutineExample : MonoBehaviour
{
    void Start() => StartCoroutine(MyCoroutine());

    IEnumerator MyCoroutine()
    {
        //在这里执行某些操作
        Debug.Log("协程开始");

        // Wait 2 seconds
        yield return new WaitForSeconds(2);

        // 等待结束后继续执行
        Debug.Log("2秒后继续执行");

        // 继续执行其他操作
        yield return null; // 等待下一帧
        Debug.Log("协程执行完毕");
    }
}
```
在这个例子中，`MyCoroutine`协程将在开始时打印“协程开始”，然后等待2秒后打印“2秒后继续执行”，最后在下一帧打印“协程执行完毕”  

协程可以通过`yield return`暂停执行，直到某个条件满足。常见的暂停类型有：  
- `WaitForSeconds`：等待指定的时间
- `WaitForEndOfFrame`：等待当前帧渲染结束后继续执行
- `WaitForFixedUpdate`：等待下一次物理更新
- `null`：等到下一帧执行

协程并不是自动停止的，你需要显示地停止它  
使用`StopCoroutine()`方法可以停止某个协程，或者通过`StopAllCoroutine()`停止当前对象的所有协程  
```cs
StartCoroutine(MyCoroutine());
StopCoroutine(MyCoroutine());
```

协程通常返回一个`IEnumerator`，但也可以有不同的返回类型，比如`WaitForSeconds`或其他等待条件类型  

### 协程的优缺点
优点：
- 简洁性：相比于传统的`Update`或者使用定时器的方式，协程让代码更简洁、更易于理解
- 灵活性：可以处理复杂的等待逻辑，比如按帧延迟、动态等待、分步执行等 
- 性能优化：协程可以有效避免不必要的多次计算或事件处理，提升游戏性能  

缺点：
- 容易受到Unity引擎主线程调度的影响
- 错误处理不如`async/await`简单

### 注意
- 协程是在主线程中执行的，所以它们会被游戏的主循环驱动，而不能跨线程操作数据
- 协程一旦启动，默认会在对象生命周期内有效，如果对象被销毁，协程会自动停止
- 如果需要频繁控制协程的暂停或停止，可能需要考虑使用更复杂的状态机或事件系统来更好的管理它们

### 进阶应用
协程不仅仅仅限于等待固定时间，也可以与其他逻辑结合实现复杂的功能

**等待某个条件满足后继续执行**
```cs
IEnumerator WaitForCondition()
{
    while (!someCondition) yield return null;

    Debug.Log("条件满足，继续执行");
}
```
### 动态修改等待时间
```cs
IEnumerator DynamicWait(float time)
{
    yield return new WaitForSeconds(time);
    Debug.Log("等待结束");
}
```

**实现动画或缓动**
可以用协程来实现逐个改变的某个值，例如实现一个平滑的动画过渡  
```cs
IEnumerator LerpPosition(Vector3 targetPosition, float duration)
{
    Vector3 startPosition = transform.position;
    float timeElapsed = 0f;

    while (timeElapsed < duration)
    {
        transform.position = Vector3.Lerp(startPosition, targetPosition, timeElapsed / duration);
        timeElapsed += Time.deltaTime;
        yield return null;
    }

    transform.position = targetPosition;
}
```

### 协程的底层机制
在Unity中，协程的执行是通过`IEnumerator`类型的函数来定义的，协程的调用、暂停、恢复都与Unity的主线程紧密结合  
协程不是传统意义上的线程，而是通过Unity引擎内部的协程调度系统来管理的  

通过`StartCoroutine()`方法启动，这个方法接收一个`IEnumerator`类型的函数，或者是一个字符串（表示方法名）
```cs
StartCoroutine(MyCoroutine());

StartCoroutine("MyCoroutine");
```
当调用`StartCoroutine()`时，Unity会为该协程分配一个任务，并把它加入到协程调度队列中  
之后Unity的主循环会负责在每一帧执行协程的代码  

协程本质上时被Unity的引擎框架所调度的，协程代码并不会一次性执行完，而是会按需执行  
**调度流程**  
1.挂起状态：当协程执行到`yield return`语句时，Unity会暂停协程的执行，并把协程的执行状态保存下来（即当前的执行位置和上下文）  
2.等待状态：协程会等待指定的时间、条件、或事件。在等待期间，协程的执行被挂起  
3.恢复执行：当协程等待的条件满足，Unity会再次将协程的执行任务加入到下一帧的调度队列中，并从挂起点继续执行

#### 协程调度的底层实现机制
大致底层实现：  
- 每个协程有一个状态机，包含当前的执行位置、等待的条件等信息
- Unity会管理所有的协程的队列，在每帧中，根据协程的状态和等待条件，决定哪些协程应该继续执行，哪些需要暂停或恢复
- Unity引擎通过`MonoBehaviour`类的`Update()`函数来调度协程，保证协程的状态更新和执行是与游戏主线程同步的
- 每次协程的恢复操作本质上是在下一帧的`Update()`或`LateUpdate()`中继续执行。协程的执行是由Unity内部的协程管理系统控制的  

#### 协程的性能与限制
- 协程过多会影响性能：如果你创建了大量的协程，并且每个协程的执行时间都比较长，可能会导致性能下降。建议根据时间需求合理使用协程
- 协程不能跨线程：协程只能在主线程上允许，它们并不会生成新的线程，因此不能在协程中执行线程相关的任务
- 协程与对象生命周期：协程与对象的生命周期紧密关联，当独享被销毁时，所有挂载该对象上的协程都会自动停止

#### Unity中协程的状态是如何被保存的
1. Coroutine对象
协程的状态是通过`Coroutine`对象来管理的，每个协程在运行时都会创建一个`Coroutine`对象，Unity会使用这个对象来跟踪协程执行状态  

2. IEnumerator状态机
协程通常返回一个`IEnumerator`对象，这实际上就是一个状态机的实现。在协程函数中，你可以通过`yield return`语句控制协程的执行。当协程遇到`yield`语句时，Unity会保存当前的执行上下文（如执行位置、局部变量等），并在下一帧继续从这个位置开始执行

3. 内存和堆栈
在协程执行过程中，Unity会使用内存中的堆栈来保存函数调用的上下文，每次协程被挂起时，它的局部变量、执行位置等信息会被保存在堆栈中，当协程恢复时，这些信息会被取出，协程继续执行  

4. 协程调度器
Unity会管理一个协程调度器，它负责跟踪所有活动的协程，并在每一帧更新它们。协程调度器会检查每个协程的状态，如果协程已经完成，它就会被销毁

5. 状态保存与恢复
Unity通过以下方式来保存和恢复协程状态：
- yield条件：`yield return`语句时协程的暂停点，Unity会记录当前的暂停点（如等待的时间、是否等待某个事件等）
- 协程生命周期：协程的生命周期和GameObject、MonoBehaviour的生命周期有关，只有当对象被销毁或协程被停止时，协程才会完全退出
- 暂停/恢复机制：Unity的协程机制基于状态机模型，每次`yield`返回后，Unity会根据当前的`yield`值来决定合适恢复协程的执行  

#### 结束和清理
当协程结束时，Unity会清理相关的资源并移除协程。若协程被手动停止，Unity会在下一帧停止协程的执行，并释放相关资源

### `IEnumerator`接口
`IEnumerator`是C#中的一个接口，它广泛用于实现迭代器模式，通过`IEnumerator`，我们可以控制集合的遍历、生成懒加载的数据、以及其他的一些需要“暂停”和“恢复”的操作，比如Unity中的协程  

#### `IEnumerator`接口概述
`IEnumerator`是C#中用来实现迭代器模式的接口，它定义了两种方法和一个属性：
- `MoveNext()`：移动到集合中的下一个元素，返回`true`或`false`表示是否还有更多元素可供迭代
- `Current`：返回当前元素
- `Reset()`：将迭代器重置到初始状态（不常用，部分实现会抛出异常）
```cs
public interface IEnumerator
{
    bool MoveNect();
    object Current { get; }
    void Reset();
}
```

#### `IEnumerator`在迭代器中的使用
`IEnumerator`主要用于构建“迭代器”，用于按顺序遍历集合中的元素。一个典型的实现例子是一个自定义集合类，它提供了一个迭代器来遍历集合中的元素：
```cs
public class MyCollection : IEnumerable
{
    private int[] numbers = {1, 2, 3, 4, 5};
    
    public IEnumerator GetEnumerator() => return new MyEnumerator(numbers);

    private class MyEnumerator : IEnumerator
    {
        private int[] _numbers;
        private int _index = -1;

        public MyEnumerator(int[] numbers) => _numbers = numbers;

        public bool MoveNext()
        {
            _index++;
            return _index < _numbers.Length;
        }

        public object Current => _numbers[_index];

        public void Reset() => _index = -1;
    }
}
```
在这个例子中，`MyCollection`实现了`IEnumerable`接口，这样它就可以被`foreach`遍历  
`GetEnumerator`方法返回一个`IEnumerator`实例，负责控制迭代过程  

#### `yield return`和`IEnumerator`
在C#中，`yield return`是实现`IEnumerator`接口的一种简化方式，当你使用`yield return`时，编译器会自动生成一个迭代器类，并且每次`yield`作为一个暂停点来保存当前的状态  
**示例：使用`yield return`返回值**
```cs
public class MyCollection
{
    public IEnumerable<int> GetNumbers()
    {
        yield return 1;
        yield return 2;
        yield return 3;
    }
}
```
`GetNumbers`返回了一个`IEnumerable<int>`类型的对象，这意味着可以通过`foreach`来遍历这个集合。  
每次迭代时，`yield return`会暂停方法的执行，并将当前值返回给调用者，这个过程在每次调用`MoveNext`时自动恢复  

#### `IEnumerator`与Unity协程
Unity中的协程是基于`IEnumerator`实现的，它是延迟执行的核心。协程的执行通过`yield return`来暂停，Unity引擎管理协程的调度和恢复  

#### `yield return`与状态机
在使用`yield return`时，C#编译器会将方法转化为状态机，每次遇到`yield return`时，编译器会保存当前方法的执行状态（局部变量、执行信息等），并返回一个`IEnumerator`迭代器，这个迭代器控制着何时继续执行代码，何时返回控制权  

**状态机生成示例**
假设有协程：
```cs
IEnumerator ExampleCoroutine()
{
    Debug.Log("Step 1");
    yield return new WairForSeconds(1f);
    Debug.Log("Step 2");
}
```
编译器会将这个代码转化成类似以下的状态机：
```cs
private class ExampleCoroutineStateMachine : IEnumerator
{
    private int _state = 0;
    private bool _isPaused = false;

    public bool MoveNext()
    {
        switch (_state)
        {
            case 0:
                Debug.Log("Step 1");
                _state = 1;
                return true; // 暂停，等待外部恢复
            case 1:
                if (_isPaused)
                {
                    _isPaused = false; // 模拟等待1秒
                    Debug.Log("Step 2");
                    return false; // 完成
                }
                return true; // 继续执行
            default:
                return false; // 协程结束
        }
    }
    public object Current => null;
}
```
每次协程执行时，状态机会检查当前状态，并决定是否继续执行或暂停

#### 状态保存与恢复：`IEnumerator`和Unity协程
当Unity执行协程时，每次遇到`yield return`，它会将协程的执行状态（包括局部变量、执行栈、当前指令位置等）保存到内存中。  
Unity引擎管理一个协程调度器，这个调度器负责在每一帧检查协程的状态，并恢复或继续执行这些协程  
`yield`表达式在背后通过`IEnumerator`实现，并通过Unity的调度器继续执行  

#### 自定义`IEumerator`
可以自定义自己的`IEnumerator`来控制更复杂的行为
```cs
public class WaitForCondition : CustomYieldInstruction
{
    private Func<bool> _condition;

    public WaitForCondition(Func<bool> condition) => _condition = condition;

    public override bool keepWaiting => !_condition(); // 直到条件满足才结束
}
```
