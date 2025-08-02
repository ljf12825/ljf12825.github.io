---
title: "Interface Oriented Design"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Architecture]
author: "ljf12825"
permalink: /posts/2025-07-15-Interface-Oriented-Design/
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
