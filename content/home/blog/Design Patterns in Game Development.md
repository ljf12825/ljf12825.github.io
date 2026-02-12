---
title: "Design Patterns in Game Development"
date: 2025-06-01
categories: [Note]
tags: [Unity, Architecture]
author: "ljf12825"
summary: Introducing and guide of all the design patterns in game development.
---
游戏开发中，设计模式是组织代码、提升可维护性、扩展性和复用性的基础工具。尤其是大型游戏项目或使用Unity、Unreal等引擎开发时，恰当使用设计模式能显著提高架构质量

基于Gof23种设计模式，常用于游戏开发的设计模式有以下几种：

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
单例模式用于确保一个类只有一个实例，并提供一个全局访问点

用途：管理全局对象，如AudioManager、UIManager、GameManager

单例模式的核心思想：确保一个类仅有一个实例，并提供一个访问它的全局方式\
#### 典型结构
```cs
public class GameManager
{
    private static GameManager _instance;
    public static GameManager Instance
    {
        get
        {
            if (_instance == null)
                _instance = new GameManager();
            
            return _instance;
        }
    }

    private GameManager() {} // 私有构造

    public void StartGame()
    {
        // 游戏启动逻辑
    }
}
```
#### 典型用途
1. 游戏管理器（GameManager）
控制游戏状态（开始、暂停、结束、重启等）
```cs
GameManager.Instance.StartGame();
```

2. 音效管理器（AudioManager）
```cs
AudioManager.Instance.PlaySound("Explosion");
```

3. 资源管理器（ResourceManager）
加载资源（Prefab、音效、贴图等），避免重复加载
```cs
var bullet = ResourceManager.Instance.LoadPrefab("Bullet");
```

4. UI管理器（UIManager）
打开、关闭UI界面，维护UI栈
```cs
UIManager.Instance.ShowPanel("MainMenu");
```

5. 输入管理器（InputManager）
统一收集和管理玩家输入，避免在多个地方监听

6. 配置表管理器（ConfigManager）
统一读取CSV/JSON配置数据

#### Unity中的单例实现
在Unity中，单例类一般继承自`MonoBehaviour`，并用`DontDestroyOnLoad`保持在多个场景中持久存在
```cs
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void StartGame() { ... }
}
```
将其拖到场景中的一个空物体上就可以使用了

如果不想拖脚本，可以实现自动创建
```cs
public class GameManager : MonoBehaviour
{
    private static GameManager _instance;
    public static GameManager Instance;
    {
        get
        {
            if (_instance == null)
            {
                // 查找场景中是否存在
                _instance = FindObjectOfType<GameManager>();

                // 如果没有，创建一个新的GameObject挂上它
                if (_instance == null)
                {
                    GameObject obj = new GameObject("GameManager");
                    _instance = obj.AddComponent<GameManager>();
                    DontDestroyOnLoad(obj);
                }
            }
            return _instance;
        }
    }

    private void Awake()
    {
        // 防止重复
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else if (_instance != this) Destroy(gameObject);
    }
}
```

#### 单例模式的特点
**优点**
1. 全局访问：任何脚本都能方便地访问
2. 数据共享：多个系统共享同一份数据，如游戏状态、资源
3. 节省资源：避免多次实例化相同管理器
4. 逻辑集中：将一类功能集中处理，方便维护

**缺点**
1. 隐藏依赖：使用单例模式可能让类间依赖不明显，降低可读性
2. 生命周期管理难：尤其在Unity中，切换场景可能出现多实例、空引用等问题
3. 难以测试：单例可能使单元测试变得困难（不可隔离、难模拟）
4. 违背面向对象原则：单例是全局状态，本质上是一种全局变量。过度依赖会让程序耦合严重

**改进建议**
1. 使用懒汉式 vs 饿汉式
  - 懒汉式（Lazy）：只有第一次访问时才创建实例
  - 饿汉式（Eager）：程序启动时立即创建

2. 使用接口隔离
将单例隐藏在接口后面，便于替换和测试
```cs
public interface IAudioManager
{
    void PlaySound(string name);
}
```

3. 使用依赖注入容器
如Zenject、Extenject等

### ObjectPool 对象池
用途：频繁生成/销毁对象如子弹、粒子效果，减少GC
[ObjectPooling](blog/Object-Pooling/)


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

