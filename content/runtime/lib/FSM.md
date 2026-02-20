---
title: "FSM"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Unity System, AI]
author: "ljf12825"
type: blog
summary: Introduction and implement of FSM
---
FSM(Finite State Machine，有限状态机)是一种常用的编程模型，广泛应用于游戏开发中，尤其是在行为控制、游戏角色AI、UI系统、动画控制方面

它的核心就是在一组有限的状态中进行切换，且每次状态转移都遵循一定的规则

## 基本概念
FSM由以下几个基本元素构成：
- 状态（State）：系统当前的状态，表示系统的一种具体行为或情境
- 状态转移（Transition）：从一个状态到另一个状态的路径，通常基于某种条件或事件触发
- 事件（Event）：触发状态转移的条件或输入，通常由外部世界的变化或内部系统的某些操作引起
- 动作（Action）：状态进入、退出或在某个状态时发生的具体行为

## FSM的组成部分
- 状态：状态机的每个状态都表示某一特定的系统情境。每个状态可能有自己的内部逻辑和行为。
- 状态转移：从一个状态到另一个状态的过渡。转移通常由条件（如事件、输入、计时等）触发，状态机的核心就是处理这些条件，并做出相应的状态转换。
- 事件与触发器：状态转移的条件。通常是由外部输入（如玩家输入、定时器超时、游戏中的其他事件）来触发。
- 动作：当状态转移时会执行某些动作。比如，进入某个状态时播放动画，退出某个状态时停止某个动作等。

## FSM的工作流程
FSM的工作过程可以概括为：每个时刻系统处于某个状态，系统等待某个事件的发生，一旦事件发生，就会根据事件的定义从当前状态转移到下一个状态，并可能触发某些动作。这个过程是循环的，状态机一直在不断地检查事件、进行状态转移。

## FSM示例：AI行为
假设开发一个游戏中的敌人AI，敌人的行为可以通过FSM来管理，比如敌人有以下几个行为状态：
- 巡逻（Patrolling）：敌人沿着一个固定路径来回走
- 追击（Chasing）：敌人发现玩家并开始追逐
- 攻击（Attacking）：敌人接近玩家并进行攻击
- 待机（Idle）：敌人没有做任何事情，处于等待状态

状态转移图：
- 如果敌人没有发现玩家，状态保持在巡逻
- 如果敌人发现玩家并进入追击状态，当玩家进入攻击范围时，切换到攻击状态
- 如果玩家离开视野，回到巡逻状态
- 如果敌人不再追击或攻击，返回待机状态

每当敌人状态发生变化时，会有相应的动作，比如进入追击时播放追击动画，攻击时播放攻击动画

## FSM在Unity中的实现
在Unity中，FSM通常通过脚本来实现。可以使用`enum`来定义状态，`if`条件判断或`switch`语句来管理状态转移，甚至用状态机设计模式来封装整个逻辑

一个简单FSM实现
```cs
public enum EnemyState
{
    Patrolling,
    Chasing,
    Attacking,
    Idle
}

public class EnemyAI : MonoBehaviour
{
    public EnemyState currentState;
    public Transform player;
    public float attackRange = 1.5f;
    public float chaseRange = 10f;

    private void Update()
    {
        switch (currentState)
        {
            case EnemyState.Patrolling:
                Patrolling();
                break;

            case EnemyState.Chasing:
                Chasing();
                break;

            case EnemyState.Attacking:
                Attacking();
                break;

            case EnemyState.Idle:
                Idle();
                break;
        }
    }

    void Patrolling()
    {
        // 巡逻逻辑
        if (Vector3.Distance(transform.position, player.position) < chaseRange)
        {
            currentState = EnemyState.Chasing;
        }
    }

    void Chasing()
    {
        // 追击逻辑
        if (Vector3.Distance (transform.position, player.position) < attackRange)
        {
            currentState = EnemyState.Attacking;
        }
        else if (Vector3.Distance (transform.position, player.position) > chaseRange)
        {
            currentState = EnemyState.Patrolling;
        }
    }

    void Attacking()
    {
        // 攻击逻辑
        if (Vector3.Distance(transform.position - player.position, player.position) >= attackRange)
        {
            currentState = EnemyState.Attacking;
        }
    }

    void Idle()
    {
        // 待机逻辑
        if (Vector3.Distance(transform.position, player.position) < chaseRange)
        {
            currentState = EnemyState.Chasing;
        }
    }
}
```
解释：
- 使用`enum`定义敌人的不同状态
- `switch`语句用于根据当前状态执行不同的行为
- 每个状态的方法中包含了触发状态转移的条件，例如距离检查、时间条件等

## FSM的优缺点
优点：
- 简单直观：FSM很容易理解，适合用于简单的状态管理
- 易于维护：状态转移逻辑清晰，容易跟踪和调试
- 灵活性高：可以轻松增加或修改状态，适应不同的需求

缺点：
- 状态保证：随着系统复杂度增加，状态和状态转移数量可能迅速增加，导致代码变得难以管理
- 不适用于复杂逻辑：对于非常复杂的系统，FSM可能会变得笨重，维护困难

## 优化与扩展
- 层次状态机（Hierarchical FSM）：可以在不同的状态中嵌套子状态机，使得系统结构更加清晰，适合复杂的AI行为
- 事件驱动：通过事件驱动状态转移，可以避免大量的条件判断，提升代码的可维护性
- 状态设计模式：可以将每个状态封装成独立的类，实现更为面向对象的设计，增加灵活性

## 应用场景
FSM不仅在游戏AI中有广泛应用，还可以在其他许多领域发挥作用，例如：
- UI管理：不同的UI界面可以看作不同的状态，每个状态对应不同的UI布局和交互
- 动画控制：可以根据角色的状态切换不同的动画，如走路、跑步、跳跃等
- 玩家控制：玩家可以有不同的状态（走、跑、跳、攻击等），每个状态有不同的输入和动作
