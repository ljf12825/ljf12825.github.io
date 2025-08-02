---
title: "Loose Coupling"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Architecture]
author: "ljf12825"
permalink: /posts/2025-07-15-Loose-Coupling/
---
松耦合（Loose Coupling）是构建可维护、可扩展的关键原则之一，尤其在多人协作、项目复杂度高、后期需要频繁迭代更新的场景中尤为重要

定义\
- 松耦合意味着模块/组件之间尽可能少的依赖关系，彼此互不知晓或只了解对方的接口或行为
- 相对的，紧耦合指的是模块之间依赖彼此的具体实现或生命周期，改一个就可能影响其他多个

常见术语\
- 松耦合（Loose Coupling）：模块间依赖最小化，只通过接口/事件通信
- 紧耦合（Tight Coupling）：模块间强依赖，变动风险高
- 事件聚合器（Event Aggregator）：集中管理事件订阅/分发的工具
- Service Locator：通过统一容器提供服务（注意与DI的区别）

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
public class GameEvent : ScriptableObject
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
    private static Dictionary<Type, Delegate> events = new();

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
- 可能扩展为插件式架构或可配置组件系统

注意事项
- 滥用单例：会造成全局状态污染和耦合加剧
- 事件泛滥：太多事件让系统变得难以追踪
- ServiceLocator滥用：会模糊依赖关系，隐藏依赖路径
- 模块间隐藏依赖：看似解耦，实则绕路依赖（隐藏依赖路径导致维护困难）

避免事件泛滥的建议\
- 事件命名清晰、语义正确
- 尽量使用局部事件系统（局部EventBus或Observer）
- 增加注释，标注事件的发送者与接收者模块

避免 ServiceLocator 滥用\
- 配合接口使用，避免隐藏依赖
- 在注册服务时记录调用栈或来源模块，便于调试

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
public interface IGoldReceiver => void AddGold(int amount);
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
        var newDelegate = Delegate.Remove(existingDelegate, listener);

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

## 耦合陷阱（反例）
1. God Object

所有逻辑集中于单一类，模块之间强依赖

所谓God Object是一个职责过多、控制过多模块的类，它知道系统中几乎所有其他对象的细节，承担太多功能、拥有过多依赖\
它像“上帝”一样：
- 拥有全局控制权
- 知道每个模块的内部状态
- 什么都要管，什么都要处理

典型表现
- 类文件巨大
- 拥有大量字段和方法：涉及UI、逻辑、输入、网络、声音等多个模块
- 依赖多：包含多个组件、管理大量GameObject
- 经常与单例模式结合：通常是GameManager、MainController这种类
- 系统变动时频繁修改它：其他模块功能增加或修改时经常影响这个类

Gob Object存在的问题
- 违背单一职责原则（SRP）：一个类处理太多功能，代码难以理解
- 难以维护：修改一个逻辑可能影响多个功能，容易引入bug
- 难以测试：不能隔离测试某一部分功能
- 拓展性差：新增功能需要不断修改God Object
- 强耦合：所有模块紧密依赖，模块无法独立更换

举个例子：Unity中常见的God Object
```cs
public class GameManager : MonoBehaviour
{
    public Player player;
    public EnemyManager enemyManager;
    public UIManager uiManager;
    public AudioSource audio;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.P)) PauseGame();
        if (player.health <= 0) GameOver();

        uiManager.UpdateHealthBar(player.health);
        enemyManager.SpawnIfNeeded();
        audio.Play();
        SaveData();
        LoadScene();
        // ...管理一切
    }

    void PauseGame() { ... }
    void GameOver() { ... }
    void SaveData() { ... }
    void LoadScene() { ... }
}
```

如何避免或重构God Object
- 拆分职责：将逻辑拆分成多个独立的组件或管理类
- 使用接口：面向接口编程，避免过多细节暴露给主类
- 使用事件系统：让模块之间通过事件通信而不是直接依赖
- 使用状态机：将状态相关逻辑分离出去，例如FSM
- 避免滥用单例：使用依赖注入、组件引用替代全局访问

示例：拆分成多个专责管理器
```cs
public class GameManager : MonoBehaviour
{
    private IGameState state;
    private IEventSystem events;
    private IAudioService audio;
    private IUIServicce ui;

    void Start()
    {
        state = new GameplayState();
        events.Subscribe<PlayerDeadEvent>(OnPlayerDead);
    }

    void OnPlayerDead(PlayerDeadEvent evt)
    {
        state = new GameOverState();
        ui.ShowGameOver();
    }
}
```
God Object是一种看似方便，实则代价高昂的设计\
虽然在项目初期它可能加快开发，但随着功能增长，它将变成维护地狱。好的架构应当遵循SRP、低耦合、高内聚原则，鼓励模块间解耦、职责明确

---

2. 静态工具类滥用

静态工具类是指包含一系列静态方法、没有实例化的类。它们通常提供全局访问，且不依赖对象的状态。

这种工具类通常用于提供一些全局的、独立于对象的功能，比如数学运算、字符串处理、文件操作等

静态工具类滥用指的是将本应该封装在类内部的逻辑功能都放入静态类中，导致多个模块过度依赖静态类的实现细节，进而增加了系统的耦合度和维护难度

静态工具类滥用的典型表现\
- 全局可用的静态方法：方法是静态的，可以从任何地方调用
- 无状态设计：静态类通常不需要实例化，任何地方都能直接调用
- 过多的职责：静态类承担了系统中多个模块的功能，变得越来越庞大
- 依赖过度：很多模块之间通过静态类共享状态或实现功能，导致紧耦合

存在的问题
- 增加耦合：静态工具类通常作为全局对象，系统中各模块直接依赖它，导致模块间依赖加剧
- 难以测试：静态类的依赖难以模拟和替换，在单元测试中很难注入mock对象，导致测试变得困难
- 可维护性差：静态类没有生命周期管理，无法轻松替换，修改静态类可能影响到系统的其他部分，增加了维护难度
- 全局状态污染：静态类往往维护全局状态，可能在不同模块间发生意外的状态更改，导致意料之外的结果

示例：静态工具类滥用
```cs
public static class GameUtils
{
    public static void SaveGameData(GameData data)
    {
        // save data
    }

    public static void LoadGameData(out GameData data)
    {
        // load data
        data = new GameData();
    }

    public static void PlaySound(string soundName)
    {
        // play sfx
    }

    public static void ShowMessage(string message)
    {
        // show
    }
}
```
`GameUtils` 静态类包含了与游戏数据、音效和消息展示相关的多个功能。任何地方只需要调用 `GameUtils.SaveGameData()` 或 `GameUtils.PlaySound()` 就能执行这些操作，但是这种方式导致了以下问题：
- 难以测试：无法为这些方法编写单元测试，因为它们不依赖于具体的对象
- 系统耦合过高：任何模块都可以直接访问这些静态方法，导致模块间的紧耦合
- 扩展困难：如果要添加新的功能（如新增一种保存方式或新的音效系统），需要修改`GameUtils`类，这回影响到所有依赖它的模块

避免方式
1. 封装功能于具体类

避免将所有功能集中在一个静态类中，应该根据职责将功能分离到不同类中
```cs
public class GameDataManager
{
    public void Save(GameData data)
    {
        // 保存游戏数据
    }

    public GameData Load()
    {
        // 加载游戏数据
        return new GameData();
    }
}

public class AudioManager
{
    public void PlaySound(string soundName)
    {
        // 播放音效
    }
}

public class MessageManager
{
    public void ShowMessage(string message)
    {
        // 显示消息
    }
}
```

2. 依赖注入

通过DI，将类之间的依赖关系明确化，避免通过静态方法共享状态
```cs
public class GameController
{
    private readonly GameDataManager dataManager;
    private readonly AudioManager audioManager;
    private readonly MessageManager messageManager;

    public GameController(GameDataManager dataManager, AudioManager audioManager, MessageManager messageManager)
    {
        this.dataManager = dataManager;
        this.audioManager = audioManager;
        this.messageManager = messageManager;
    }

    public void SaveGame(GameData data)
    {
        dataManager.Save(data);
    }

    public void PlayGameOverSound()
    {
        audioManager.PlaySound("GameOver");
    }

    public void ShowGameOverMessage()
    {
        messageManager.ShowMessage("Game Over");
    }
}
```

3. 使用单例模式

如果某些功能确实需要全局唯一的实例来管理（如音效、UI管理），可以使用单例模式，但要避免滥用
```cs
public class AudioManager
{
    private static AudioManager instance;

    private AudioManager() { }

    public static AudioManager Instance => instance ??= new AudioManager();

    public void PlaySound(string soundName)
    {
        // 播放音效
    }
}
```

4. 将状态和行为分离

避免在工具类中维护全局状态。如果工具类必须有状态，应考虑将行为分离到独立类中

---
// TODO

3. Find滥用
使用`GameObject.Find`创建隐式耦合，维护困难

4. 单例滥用
全局访问引起模块间共享状态混乱，耦合加剧

5. 事件滥用
事件过多系统难以追踪、调试

## 总结
松耦合是一种重要的架构思想，在Unity开发中具有实际意义

通过事件机制、接口抽象、ScriptableObject和事件聚合器等手段，可以构建出更加灵活、可维护、可扩展的系统

**解耦不是目的，而是为应对复杂性而采取的策略**