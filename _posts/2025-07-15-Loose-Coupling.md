---
title: "Loose Coupling"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Architecture]
author: "ljf12825"
permalink: /posts/2025-07-15-Loose-Coupling/
---
松耦合（Loose Coupling）是构建可维护、可扩展的关键原则之一，尤其在多人协作、项目复杂度搞、后期需要频繁迭代更新的场景中尤为重要

定义\
- 松耦合意味着模块/组件之间尽可能少的依赖关系，彼此互不知晓或只了解对方的接口或行为
- 相对的，紧耦合指的是模块之间依赖彼此的具体实现或生命周期，改一个就可能影响其他多个

优势\

| 优势     | 说明               |
| ------ | ---------------- |
| 可维护性高  | 修改一个模块时，不会影响其他模块 |
| 可测试性强  | 可以独立单元测试         |
| 可扩展性好  | 可以方便地添加、替换模块     |
| 降低耦合风险 | 避免“牵一发而动全身”      |

## Unity中常见的松耦合方式
1. 事件/委托机制
> 让监听者注册感兴趣的事件，而不是让对象彼此直接调用

优点：发送者不知道接收者是谁，实现解耦

[Event and Callback]({{site.baseurl}}/posts/2025-06-03-Event-and-Delegate/)

2. 接口与抽象
编程时面向接口，而不是具体类
[Interface Oriented Design]({{site.baseurl}}/posts/2025-07-15-Interface-Oriented-Design/)

3. ScriptableObject作为配置 & 消息中介
```cs
public class GameEvent : ScriptableObejct
{
    private event Action listeners;

    public void Raise() => listeners.Invoke();

    public void Register(Action callback) => listeners += callback;

    public void Unregister(Action callback) => listeners -= callback;
}
```
中介层完全解耦了调用者与接收者，并且支持在Inspector中配置

4. 事件聚合器（EventBus/EventAggregator）
建立一个中心事件系统用于发布和订阅
```cs
public static class EventBus
{
    private static Dirctionary<Type, Delegate> events = new();

    public static void Subscribe<T>(Action<T> callback)
    {
        if (events.TryGetValue(typeof(T), out var d))
            events[typeof(T)] = Delegate.Combine(d, callback);
        else events[typeof(T)] = callback;
    }

    public static void Publish<T>(T data)
    {
        if(events.TryGetValue(typeof(T), out var d))
            (d as Action<T>)?.Invoke(data);
    }
}
```
各模块不直接通信，而是通过EventBus中转

5. Service Locator / 依赖注入（DI）
控制依赖获取的方式，不直接new出对象
```cs
public static class ServiceLocator
{
    private static Dictionary<Type, object> services = new();

    public static void Register<T>(T service) => services[typeof(T)] = service;
    public static T Get<T>() => (T)services[typeof(T)];
}
```
通过容器获取依赖，模块间没有强依赖

## 设计建议
松耦合的使用场景
- 多个模块可能被复用或频繁改动
- 多人协作，责任边界需要清晰
- 希望支持热更或运行时配置替换
- 可能扩展位插件式架构或可配置组件系统

注意事项
- 滥用单例：会造成全局状态污染和耦合加剧
- 事件泛滥：太多事件让系统变得难以追踪
- ServiceLocator滥用：会模糊依赖关系，隐藏依赖路径
- 模块间隐藏依赖：看似解耦，实则绕路依赖

组合模式
- 事件系统 + 接口编程：解耦逻辑流程与具体执行逻辑
- ScriptableObject + 数据驱动：配置可视化、可热更、可重用
- State Pattern + 接口：实现灵活的FSM
- EventBus + 架构层拆分：构建大型系统（如战斗、任务）

## 场景示例
通过一个“玩家捡金币”的例子来对比“高度耦合”和“解耦后的设计”

**场景描述**\
当玩家(`Player`)碰到金币(`Coin`)时：
1. 金币消失
2. 播放金币音效
3. 更新UI显示当前金币数

**高度耦合写法**
```cs
public class Coin : MonoBehaviour
{
    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            // 增加金币
            other.GetComponent<Player>().AddGold(1);

            // 更新UI（耦合 UIManager）
            FindObjectOfType<UIManager>().UpdateGoldUI();

            // 播放音效（耦合 AudioManager）
            FindObjectOfType<AudioManager>().Play("CoinSound");

            // 销毁自己
            Destroy(gameObject);
        }
    }
}
```
问题（紧耦合）：
- 依赖Player的具体实现：直接访问Player的方法和组件
- 依赖UIManager：Coin强依赖UIManager存在并可访问
- 依赖AudioManager：直接调用具体的音效播放逻辑
- 可测试性低：单元测试Coin时必须构建完整环境
- 拓展困难：若增加一个“金币上报服务器”逻辑，需要修改Coin代码，破坏封装性

**解耦后的设计**\
使用
- 接口（如`IGoldReceiver`）
- 事件机制（如`GoldCollecttedEvent`）
- ScriptableObject（可选）

Player接收金币逻辑
```cs
public interface IGolderReceiver => void AddGold(int amount);
```
```cs
public class Player : MonoBehaviour, IGoldReceiver
{
    private int gold = 0;

    public void AddGold(int amount)
    {
        gold += amount;
        EventBus.Publish(new GoldCollectedEvent(gold));
    }
}
```

Coin逻辑解耦
```cs
public class Coin : MonoBehaviour
{
    private void OnTriggerEnter(Collider other)
    {
        var receiver = other.GetComponent<IGoldReceiver>();
        if (receiver != null)
        {
            receiver.AddGold(1);
            Destroy(gameObject)l
        }
    }
}
```

监听事件更新UI
```cs
public class UIManager : MonoBehaviour
{
    private void OnEnable() => EventBus.Subscribe<GoldCollectedEvent>(OnGoldUpdated);

    private void OnDisable() => EventBus.UnSubscribe<GoldCollectedEvent>(OnGoldUpdated);

    void OnGoldUpdated(GoldCollectedEvent evt) => goldText.text = $"Gold: {evt.CurrentGold}";
}
```

播放音效模块
```cs
public class CoinSoundPlayer : MonoBehaviour
{
    private void OnEnable() => EventBus.Subscribe<GoldCollectedEvent>(_ => PlayCoinSound());

    void PlayCoinSound() => GetComponent<AudioSource>().Play();
}
```

EventBus实现
```cs
public static class EventBus
{
    private static readonly Dictionary<Type, Delegate> eventTable = new();

    public static void Subscribe<T>(Action<T> listener)
    {
        if (eventTable.TryGetValue(typeof(T), out var existingDelegate))
        {
            eventTable[typeof(T)] = Delegate.Combine(existingDelegate, listener);
        }
        else
        {
            eventTable[typeof(T)] = listener;
        }
    }
}

public static void Unsubscribe<T>(Action<T> listener)
{
    if (eventTable.TryGetValue(typeof(T), out var existingDelegate))
    {
        var newDelegate = Delegate.Remove(exsitingDelegate, listener);

        if (newDelegate == null) eventTable.Remove(typeof(T));
        else eventTable[typeof(T)] = newDelegate;
    }
}

public static void Publish<T>(T eventData)
{
    if (eventTable.TryGetValue(typeof(T), out var d))
        (d as Action<T>)?.Invoke(eventData);
}

public static void ClearAll() => eventTable.Clear();
```