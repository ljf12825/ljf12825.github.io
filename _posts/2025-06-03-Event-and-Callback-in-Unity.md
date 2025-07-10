---
title: "Event and Callback in Unity"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
---
在Unity中，事件和回调时实现解耦和响应式编程的核心机制。它们能够在不同的组件之间传递消息或相应某些操作

## 事件（Event）
事件是一种特殊的委托类型，允许其他对象订阅并响应某个特定的行为或状态变化。通常用于对象之间的通信，避免了直接调用，使代码更具解耦性

### 基本使用
在Unity中，可以使用C#的`event`关键字来声明一个事件。事件的订阅和触发通常会在组件之间完成
```cs
// 定义事件的委托类型
public delegate void PlayerScored(int score);

public class GameManager : MonoBehaviour
{
    // 声明一个事件
    public event PlayerScored OnPlayerScored;

    public void PlayerScore(int score)
    {
        // 触发事件
        OnPlayerScored?.Invoke(score);
    }
}

public class UIManager : MonoBehaviour
{
    public GameManager gameManager;

    private void OnEnable()
    {
        // 订阅事件
        gameManager.OnPlayerScored += UpdateScoreDisplay;
    }

    private void OnDisable()
    {
        // 取消订阅
        gameManager.OnPlayerScored -= UpdateScoreDisplay;
    }

    void UpdateScoreDisplay(int score)
    {
        // 更新UI
        Debug.Log("Player scored: " + score);
    }
}
```
事件的特点：
- 解耦：`GameManager`不需要知道`UIManager`的存在，UIManager可以独立地响应得分变化
- 多播：一个事件可以有多个订阅者，也可以通过`+=`和`-=`来添加或移除订阅者
- 安全：通过`?.Invoke()`确保事件只在有订阅者时触发，避免空引用异常

## 回调（Callback）
回调是一种通过传递方法引用的方式，在某个操作完成时调用该方法。回调通常用于异步操作或任务完成后的通知

### 基本使用
在Unity中，回调通常通过委托来实现，将一个方法作为参数传递给另一个方法，等到操作完成时再调用这个方法
```cs
public class TaskManager : MonoBehaviour
{
    // 回调函数类型
    public delegate void TaskCompleteCallback(string result);

    // 模拟异步操作
    public void StartTask(TaskCompleteCallback callback) => StartCoroutine(TaskCoroutine(callback));

    private IEnumerator TaskCoroutine(TaskCompleteCallBack callback)
    {
        // 模拟任务执行
        yield return new WaitForSeconds(2);

        // 任务完成后调用回调
        callback?.Invoke("Task Completed!");
    }
}

public class UIManager : MonoBehaviour
{
    public TaskManager taskManager;

    void Start()
    {
        // 执行任务并传入回调方法
        taskManager.StartTask(OnTaskComplete);
    }

    // 回调方法
    void OnTaskComplete(string result)
    {
        Debug.Log(result); // 输出 “Task Completed!"
    }
}
```
回调的特点：
- 异步执行：回调通常用于异步操作，尤其时Unity中的`Coroutine`或事件系统
- 灵活性：可以传递任何符合委托签名的方法，允许更大的灵活性
- 单一响应：一个回调通常只关注一个特定的操作或状态

### Event 和 Callback的区别
- 目的：事件广泛用于广播通知，多个订阅者可以响应；回调更多用于指定一个任务完成后执行某个操作，通常是单一的响应
- 订阅机制：事件通过`+=`和`-=`来订阅和注销，而回调通常是通过传递方法（或委托）来实现
- 灵活性：回调可以传递不同的参数类型，而事件通常会有固定的委托签名

### Unity中的事件与回调应用场景
- 事件：常用于UI系统、游戏状态更新、物体状态改变等。比如，当玩家得分时，通过事件通知UI系统过呢更新得分
- 回调：常用于异步操作，如加载场景、处理动画结束、执行任务完成后的操作等。比如，加载场景完成后通过回调通知UI更新