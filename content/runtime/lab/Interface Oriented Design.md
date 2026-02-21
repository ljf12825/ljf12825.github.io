---
title: Interface Oriented Design
type: lab
status: active # active/archived/dead/unstable
summary: Implement Interface Oriented Design in Unity
---

"Interface Oriented Design"面向接口设计，是软件架构中的一种重要思想，它强调通过接口而非具体实现进行编程

在Unity中，面向接口设计不仅有助于降低耦合、增强可测试性，还在组件化开发、热更架构、解耦系统中发挥了非常关键的作用

> 定义行为接口，让对象只依赖接口而不是具体实现，从而实现解耦、扩展与测试的灵活性

## Unity中的典型应用场景

- 控制系统分离：`IInputHandler`抽象输入，无论是键盘、手柄还是虚拟按钮都统一处理
- 热更系统对接：ILRuntime、HybridCLR下通过接口对热更代码调用，避免直接依赖反射
- AI行为系统：`IState`、`ITask`、`ICondition`组合行为树模块
- 资源加载系统：`IAssetLoader`抽象出不同加载器(Resources、Addressables、AB)
- 游戏流程系统：`IGameState`,`IFlowNode`构建状态流、任务流
- 特效触发系统：`ITrigger`,`IEffectReceiver`解耦触发与响应

## Interface的几个核心特性
- 明确定义“行为契约”
- 不依赖具体类，从而实现松耦合
- 便于单元测试（可用mock实现）
- 可实现多态性与模块化组合
- 更适合插件式、模块式开发

## 示例：输入控制器的面向接口设计
**定义接口**
```cs
public interface IInputHandler
{
    Vector2 GetMoveInput();
    bool IsJumpPressed();
}
```
**两种实现方式**
```cs
public class KeyboardInput : IInputHandler
{
    public Vector2 GetMoveInput() => new Vector2(Input.GetAxis("Horizontal"), Input.GetAxis("Vertical"));
    public bool IsJumpPressed() => Input.GetKeyDown(KeyCode.Space);
}

public class MobileInput : IInputHandler
{
    public Vector2 GetMoveInput() => joystick.Direction;
    public bool IsJumpPressed() => jumpButton.IsPressed;
}
```
**游戏角色逻辑只依赖接口**
```cs
public class PlayerController : MonoBehaviour
{
    public IInputHandler input;

    void Update()
    {
        Vector2 move = input.GetMoveInput();
        if (input.IsJumpPressed()) Jump();
    }
}
```
这样就可以轻松替换不同输入源，而无需修改`PlayerController`的任何逻辑

## 示例：子弹造成伤害
```cs
public interface IDamageable
{
    void TakeDamage(int amount);
}

public class Enemy : MonoBehaviour, IDamageable
{
    public void TakeDamage(int amount) => Debug.Log($"Enemy took {amount} damage.");
}

public class Bullet : MonoBehaviour
{
    void OnCollisionEnter(Collision collision)
    {
        var damageable = collision.gameObject.GetComponent<IDamageable>();
        damageable?.TakeDamage(10);
    }
}
```
Bullet不关心对象是不是Enemy，只在乎能不能被“伤害”

优点：
1. 松耦合
接口使得组件之间的耦合性降到最低。`Bullet`类并不知道`Enemy`类的实现细节，它只关心`Enemy`是否实现了`IDamageable`接口。这使得组件之间可以灵活地进行替换和扩展

2. 可扩展性
如果以后需要增加新的可伤害对象，只需要让新的类实现`IDamageable`接口，而不需要修改已有的`Enemy`类

3. 可维护性
当项目需要调整某些行为时，接口提供了一个良好的抽象层。例如，如果要改变`Bullet`伤害计算方式，只需要修改`Bullet`类，而不需要影响到其他类的交互

4. 灵活性
接口可以被用作插件或模块化系统的基础。比如，游戏中有多个物品类型，它们都可能具有被攻击的行为。可以创建一个`IDamageable`接口，让这些物品实现不同的伤害逻辑，而不需要知道具体类型

## Unity中面向接口设计的典型架构模式

| 模式                          | 与接口结合点                                                  |
| --------------------------- | ------------------------------------------------------- |
| **策略模式 (Strategy)**         | 定义一组策略接口，如 `IMovementStrategy`, `ISkillStrategy`        |
| **状态模式 (State)**            | 定义 `IState`, 例如 `IdleState`, `AttackState`，用于 FSM 或流程控制 |
| **事件发布订阅**                  | `IEventListener<T>`，订阅不同类型事件                            |
| **服务定位器 (Service Locator)** | 注册与获取 `IService` 接口实例                                   |
| **依赖注入 (DI)**               | 将接口作为依赖注入类中，提升模块解耦性                                     |

## Interface Oriented vs Inheritance Oriented

| 特性        | 面向接口     | 面向继承                 |
| --------- | -------- | -------------------- |
| 耦合度       | 低（只依赖接口） | 高（依赖具体类）             |
| 多重继承      | 支持       | C# 只支持单继承            |
| 可测试性      | 高        | 一般                   |
| 扩展性       | 强        | 受限于父类设计              |
| Unity 中建议 | 优先接口   | 谨慎继承 MonoBehaviour |

## 建议
1. 尽量避免直接在逻辑中引用MonoBehaviour类
  - 改为`interface + bridge`结构组合

2. 构建模块接口层
  - 如`ISoundSystem`,`IResourceSystem`,`IGameFlowSystem`等

3. 配合ScriptableObject实现运行时数据配置

4. 配合依赖注入容器实现自动绑定

