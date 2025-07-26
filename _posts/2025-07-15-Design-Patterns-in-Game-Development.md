---
title: "Design Patterns in Game Development"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Architecture]
author: "ljf12825"
permalink: /posts/2025-07-15-Design-Patterns-in-Game-Development/
---
游戏卡法中，设计模式时组织代码、提升可维护性、扩展性和复用性的基础工具。尤其是大型游戏项目或使用Unity、Unreal等引擎开发时，恰当使用设计模式能显著提高架构质量

| 分类      | 模式                   | 用途                                 |
| ------- | -------------------- | ---------------------------------- |
| **创建型** | Singleton（单例）        | 管理全局状态（如 GameManager、AudioManager） |
|         | Factory Method（工厂方法） | 创建敌人、道具、技能等实例                      |
|         | Prototype（原型）        | 克隆预制体、生成技能副本等                      |
|         | Object Pool（对象池）   | 管理大量频繁生成/销毁的对象（子弹、特效）              |
| **结构型** | Component（组件）      | Unity核心模式（基于组合而非继承）                |
|         | Decorator（装饰器）       | 给技能、Buff添加额外效果                     |
|         | Flyweight（享元）        | 减少内存（如重复使用同一 Mesh、材质）              |
| **行为型** | State（状态机）         | 角色状态切换（Idle、Run、Jump、Attack）       |
|         | Observer（观察者）      | UI监听角色属性变化、事件派发系统                  |
|         | Command（命令）       | 实现撤销/重做、输入缓存、动作序列                  |
|         | Strategy（策略）       | 多种AI行为切换，技能释放策略等                   |
|         | EventBus（事件总线）     | 解耦不同系统的事件通信（如成就、音效）                |
|         | Mediator（中介者）        | 管理复杂交互系统（UI面板交互）                   |
|         | Visitor（访问者）         | 用于遍历不同 GameObject 执行操作（如保存、统计）     |

## Unity中常用的设计模式
### Singleton 单例模式
用途：管理全局对象，如AudioManager、UIManager、GameManager
```cs
public class GameManager : MonoBehaviour
{
    public static GameManager Instance {get; private set;}

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }
}
```
Unity要注意处理生命周期（场景切换）

### ObjectPool 对象池
用途：频繁生成/销毁对象如子弹、粒子效果，减少GC
[ObjectPooling]({{site.baseurl}}/posts/2025-06-06-Object-Pooling/)


### State 状态机模式
用途：角色状态管理
```cs
public interface IState
{
    void Ender();
    void Execute();
    void Exit();
}

public class IdleState : IState { ... }
public class RunState : IState { ... }

public class StateMechine
{
    private IState currentState;

    public void ChangeState(IState newState)
    {
        currentState?.Exit();
        currentState = newState;
        currentState.Enter();
    }

    public void Update() => currentState?.Execute();
}
```

### Observer 观察者模式
用途：事件通知系统、属性变化通知UI
```cs
public class Health : MonoBehaviour
{
    public Action<int> OnHealtChanged;
    private int hp;

    public void SetHP(int value)
    {
        hp = value;
        OnHealthChanged?.Invoke(hp);
    }
}
```

### Strategy 策略模式
用途：定义不同行为策略（如攻击方式、AI逻辑）
```cs
public interface IAttackStrategy
{
    void Attack();
}

public class MeleeAttack : IAttackStrategy { ... }
public class RangedAttack : IAttackStrategy { ... }

public class Character
{
    public IAttackStrategy attackStrategy;
    public void PerformAttack() => attackStrategy.Attack();
}
```

### Command 命令模式
用途：实现撤销、按键映射、行为记录
```cs
public interface ICommand
{
    void Execute();
    void Undo();
}

public class MoveCommand : ICommand { ... }

public class InputHandler
{
    Stack<ICommand> history = new Stack<ICommand>();
    public void HandleInput()
    {
        ICommand cmd = new MoveCommand();
        cmd.Execute();
        history.Push(cmd);
    }

    public void Undo() => history.Pop().Undo();
}
```

### EventBus 事件总线
用途：各个系统之间通信解耦
```cs
public static class EventBus
{
    public static event Action OnLevelComplete;
    public static void LevelComplete() => OnLevelComplete?.Invoke();
}
```

## Unity自带的设计模式

| 系统                     | 使用的设计模式      |
| ---------------------- | ------------ |
| GameObject + Component | Component 模式 |
| ScriptableObject       | 数据驱动、配置注入    |
| Coroutine              | 类似状态机/命令模式   |
| Animator Controller    | 状态机（FSM）     |
| Input System           | 命令模式、策略模式    |
| UI System（事件系统）        | 观察者模式、命令模式   |

推荐书籍：《游戏编程模式》 Game Programming Patterns
