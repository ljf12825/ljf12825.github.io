---
title: "Behaviour Tree"
date: 2025-06-01
categories: [Note]
tags: [Unity, Unity System, AI]
author: "ljf12825"
type: blog
summary: The Introduction of behaviour tree in unity. Explanation and implementation examples of behavior tree structure
---
Unity的行为树是一种常用于AI决策的结构，它在游戏开发中用于描述AI的行为和决策逻辑。它通过阻止一系列的节点来表示各种行为，树形结构的设计让它可以清晰地展示AI决策过程

## 基本概念
行为树的每个节点都有一个功能，它们通常分为以下几种类型
- 根节点（Root Node）：行为树的起始点
- 选择节点（Selector Node）：类似于“或”运算，选择一个成功的子节点。如果一个子节点失败，则选择下一个子节点，直到找到成功的节点或者没有子节点可选
- 序列节点（Sequence Node）：类似于“与”运算，执行所有子节点，直到一个子节点失败。如果任何一个子节点失败，序列节点就会失败
- 动作节点（Action Node）：表示具体的行为或操作，例如移动、攻击、闲逛等
- 条件节点（Condition Node）：检查是否满足某个条件，如果条件成立则返回成功，否则返回失败

## 行为树的执行过程
行为树的执行是从根节点开始，逐层向下执行。它通常会根据子节点的状态（成功、失败或运行中）来决定接下来的执行路径
- 成功：当某个节点成功完成时，它会返回“成功”状态，行为树会继续向下执行
- 失败：当某个节点失败时，行为树会返回“失败”状态，选择其他路径或回溯
- 运行中：有些节点会持续执行，并且需要多个帧来完成，比如“寻找敌人”或“等待某个事件发生”

## 行为树的优势
- 可扩展性：行为树非常适合处理复杂的AI逻辑，可以轻松地将新的行为和决策加入树中，而不需要修改现有代码
- 模块化和可维护性：由于行为树的结构类似于树形，它更容易进行维护和扩展。每个节点都是独立的，只有一个明确的职责
- 清晰的决策过程：行为树通过层级结构表达决策逻辑，使得复杂的AI决策变得清晰易懂

## Unity中行为树的实现
Unity中没有内建的行为树系统，但是可以使用一些现有的库来实现行为树，例如：
- Unity ML-Agents：这个包包含了一些用于训练和开发AI代理的工具，但它的行为树实现较为基础
- Behaviour Designer：这是一个非常流行的Unity插件，它提供了一个图形化界面，便于设计和实现行为树
- NodeCanvas：另一个插件，支持行为树、状态机等多种AI决策系统，可以很方便地设计复杂的行为树
- Unity Behavior：2024年底Unity发布的免费行为树包，可视化

## [Unity ML-Agents]({{/blog/ML-Agents/)
[GitHub ML-Agents](https://github.com/Unity-Technologies/ml-agents.git)

ML-Agents (Machine Learning Agents)是由Unity官方提供的一款工具包，旨在帮助开发者在Unity中实现和训练智能体（Agents）使用机器学习算法。它为游戏和仿真环境中的AI提供了一种灵活的方式，利用强化学习、监督学习等技术来训练代理学习从环境中获得经验并做出决策

ML-Agents提供了基于PyTorch的算法实现，可以方便地使用其提供的Python API，通过强化学习、模仿学习、神经进化或任何其他方法训练智能代理

### 核心组件
ML-Agents的工作主要依赖于以下几个核心组件
- Agent：在Unity环境中，Agent是一个学习者，它与环境进行交互并根据所接收到的奖励（reward）和惩罚（penalty）来调整其行为策略。Agent可以是游戏中的一个角色或物体（如玩家、敌人、NPC等）

- Environment：环境是Agent交互的地方，包含了物理世界、场景中的其他对象等。它为Agent提供观测数据并接收来自Agent的动作。一个Unity场景通常包含多个对象，例如地面、障碍物、NPC、敌人等

- Brain：Brain负责决策，它是机器学习模型的实现，可以是一个简单的规则引擎或一个复杂的神经网络。以前，Brain在Unity中是一个单独的组件，现在已经被改进为训练代理的策略。ML-Agents通过Python脚本和Unity连接，进行训练和推理

- Academy：Academy是整个学习过程的核心管理者，它负责协调环境的重置、训练的初始化、代理的奖励以及多个Agent之间的同步

### 机器学习的训练过程
ML-Agents的训练过程包括以下几个主要步骤：
1. 设置环境：需要在Unity中创建一个合适的场景，设置Agent，并为Agent提供可观测的信息（如位置、速度、目标位置等）以及奖励机制（如击中目标、避开障碍物等）

2. 定义Agent的行为：需要为Agent编写C#脚本，告诉它如何根据环境的状态选择动作。通常这会涉及到对传入的观测数据进行处理，并输出动作（例如移动、跳跃等）

3. 训练Agent：通过ML-Agents中的Python接口，利用强化学习算法（如PPO、A3C、DDPG等）训练Agent。训练过程中，代理通过与环境的交互，逐步调整策略以最大化累积的奖励

4. 评估与优化：训练过程中，可以定期评估Agent的表现，查看它是否能成功完成任务，并根据结果调整训练策略或优化环境设计

### ML-Agents的主要特性
- 强化学习：ML-Agents最常用于强化学习（Reinforcement Learning），代理通过与环境交互、执行动作并接受奖励来学习最优策略
- 模仿学习：ML-Agents也支持模仿学习（Imitation Learning），这是一种从专家演示中学习的方式。可以通过记录专家的行为，使用数据来训练Agent模仿这些行为
- 多智能体系统：ML-Agents支持多个Agent同时训练，它们可以共享一个环境进行协作或对抗训练
- 支持多种训练算法：目前，ML-Agent支持多个强化学习算法，如PPO、DDPG等。这些算法适应不同类型的问题，如连续动作空间或离散动作空间

### ML-Agent使用步骤
1. 安装ML-Agents
ML-Agents需要安装Unity插件和Python库
  - 在Unity中，通过Package Manager安装`ML-Agents`
  - 在Python环境中，使用以下命令安装ML-Agents
  ```bash
  pip install mlagents
  ```

2. 创建Agent
可以为Unity中的角色创建一个代理。代理需要实现如下接口
  - OnEpisodeBegin：每当一个训练回合开始时调用，通常用来重置代理和环境
  - CollectObservation：每个步骤手机代理的环境状态，作为输入传递给机器学习模型
  - OnActionReceived：每当代理执行一个动作时调用，基于该动作与环境的互动更新代理的状态，并奖励或惩罚代理

3. 训练代理
通过Python训练脚本，可以开始训练代理。ML-Agents提供了一个命令行工具（`mlagents-learn`），可以通过它来启动训练
```bash
mlagents-learn config/trainer_config.yaml --run-id=first_run
```

4. 使用模型
一旦训练完成，可以导出训练好的模型，并将其加载到Unity项目中，直接替换代理的行为逻辑

### 训练的算法与策略
ML-Agents支持多种强化学习算法
  - PPO（Proximal Policy Optimization）：适用于大多数问题，是一种基于策略梯度的算法，能够较好地处理连续动作空间
  - DDPG（Deep Deterministic Policy Gradient）：用于连续动作空间的深度强化学习算法，适合处理高维、连续的动作问题
  - A3C（Asynchronous Advantage Actor-Critic）：适用于多智能体训练，利用多线程来提升训练效率

## [Behavior Designer](blog/Behaviour-Designer/)
Behaviour Designer是一款强大的Unity插件，用于创建和管理行为树，它让开发者可以通过图形化界面设计复杂的AI行为，而不需要手动编写复杂的代码。Behaviour Designer的主要优势在于它提供了一种直观的方式来构建和调试AI的决策系统，同时支持强化学习和传统的AI算法

### Behaviour Designer的核心功能
- 图形化界面：Behaviour Designer提供了一个直观的拖拽式界面，使得设计和管理行为树变得非常容易。可以通过简单的拖动和连接节点来实现复杂的AI行为
- 节点类型丰富：Behaviour Designer提供了多种节点类型，包括：
  - Selector：选择器节点，依次检查子节点，如果由一个子节点成功则返回成功
  - Sequence：序列节点，依次执行子节点，直到有一个失败时返回失败
  - Condition：条件节点，检查某些条件是否满足，通常用于判断是否执行某个动作
  - Parallel：并行节点，允许多个子任务同时执行，直到所有任务完成或者有一个失败
  - Inverter：取反节点，用于改变子节点的状态（例如将成功转为失败，将失败转为成功）

- 支持自定义节点：Behaviour Designer允许开发者编写自己的自定义行为节点，扩展它的功能。通过C#脚本，可以轻松地创建适应特定要求的节点
- 多智能体支持：可以在同一个场景中创建多个智能体，并使用Behaviour Designer为每个智能体设计不同的行为树，支持不同的AI模式
- 调试和监控：Behaviour Designer具有强大的调试功能，可以实时查看AI的状态、节点的执行情况以及执行的路径。这有助于快速诊断和优化AI的行为
- 黑板（Blackboard）：黑板是存储智能体数据的容器，AI可以通过它共享数据和状态。行为树的节点可以访问黑板上的变量（如智能体的位置、血量、目标等），并基于这些信息进行决策

### Behaviour Designer的使用
1. 安装Behaviour Designer
通过Unity的Package Manager或Asset Store安装Behaviour Designer

2. 创建Behaviour Tree
创建一个新的行为树
  - 在Unity中，右键点击项目窗口中的文件夹，选择Create > Behavior Designer > Behavior Tree
  - 给行为树命名，双击打开Behavior Tree编辑器

3. 设计行为树
在Behavior Tree编辑器中，将看到一个空白的画布，可以通过拖拽不同的节点来创建和连接行为树，例如：
  - 使用Selector节点来检查敌人是否在视野内，如果在视野内则进行攻击
  - 使用Sequence节点来执行巡逻和追击任务
  - 使用Action节点来执行实际的行为，比如移动到目标、攻击敌人等

可以根据需要不断添加、调整和优化行为树

4. 为Agent添加Behavior Tree
将设计好的行为树应用到Unity中的智能体（例如玩家、敌人或NPC）。需要为智能体添加Behavior Tree组件，选择刚才创建的行为树文件作为它的行为树源

5. 调试与优化
  - 实时调试：可以在运行时查看行为树的执行状态，知道哪些节点正在执行，哪些节点失败或成功。可以通过`Behavior Designer`的调试窗口实时查看行为树的执行流程
  - 性能优化：行为树本身非常高效，但在场景中有多个复杂的行为树时，仍然需要关注性能。通过将复杂的逻辑拆分为多个小任务，或使用Parallel和Inverter节点来优化执行路径，确保高效的计算

6. 动态修改行为
可以在游戏运行时动态地修改AI的行为树或更改黑板上的数据。例如，敌人可能会根据当前的血量调整攻击策略，或者根据玩家的行为做出反应。Behavior Designer允许实时修改黑板数据和行为树

### 行为树的设计技巧
- 分层设计：复杂的AI行为可以分解为多个子行为树。通过嵌套行为树或使用子树节点（Subtree Node），可以创建更为复杂和模块化的AI逻辑
- 使用黑板：合理利用黑板来存储AI的状态数据（如目标位置、血量等），可以让行为树更加灵活且易于维护
- 优化选择和序列节点的使用：选择器和序列节是行为树中的基础节点，使用时要确保其优先级设置合理，避免无意义的反复检查和执行
- 模拟现实的AI决策：通过增加条件判断、引入随机性和决策回调，可以模拟更加智能的决策过程，使得AI的行为更接近真实世界中的复杂决策

### Behavior Designer 高级功能
1. 多线程执行
Behavior Designer支持在多个线程中并行执行不同的任务，使得行为树的性能更高，尤其是当AI行为复杂且需要处理多个任务时（如多个敌人同时行动）
2. 事件驱动行为
可以设置一些事件（例如玩家进入攻击范围或触发特定的环境事件）来驱动AI行为树的切换，利用事件触发来灵活控制行为树的执行
3. 条件与动作分离
行为树中的节点通常包括条件判断和实际行为（动作），Behavior Designer允许清晰地将两者分开，便于调试和维护。例如，AI的巡逻i行为可以与判断敌人是否在视野内的逻辑分开
4. 内建的AI任务和动作
Behavior Designer包含了一些常用的AI任务和动作，如NavMesh移动、攻击、逃跑、等待等，可以大大简化开发过程

## [Unity Behavior](blog/Unity-Behavior/)
[Manual Behavior](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/index.html)

## 自定义行为树实现
自定义行为树的实现涉及到创建一套系统，用于描述和管理AI代理（Agent）和行为决策

行为树的主要目的是通过一个树形结构来描述AI的决策过程，其中节点表示AI可能的行为或决策，根节点从树的顶端开始，逐层向下执行
1. 设计行为树的基本结构
行为树的核心概念包括以下几种节点类型
- 根节点：行为树的起始点，通常包含一个选择节点或序列节点
- 选择节点（Selector）：类似“或”逻辑，逐一尝试其子节点，直到一个子节点成功返回
- 序列节点（Sequence）：类似“与”逻辑，依次尝试执行子节点，直到一个失败返回
- 动作节点（Action）：具体的行为，如移动、攻击等
- 条件节点（Condition）：判断条件是否成立，如“敌人在视野内”

2. 定义行为树节点接口
定义一个抽象的节点类`BTNode`，所有的行为树节点都将继承自这个类
```cs
using System;
using System.Collections.Generic;
using UnityEngine;

public enum NodeState
{
    SUCCESS,
    FAILURE,
    RUNNING
}

// 定义行为树节点接口
public abstract class BTNode
{
    public NodeState state;
    
    public abstract NodeState Execute();
}
```

3. Selector实现
选择节点的作用是依次检查每个子节点，只要有一个子节点成功，它就会返回成功。否则，返回失败
```cs
public class SelectorNode : BTNode
{
    private List<BTNode> children = new List<BTNode>();

    public void AddChild(BTNode child) => children.Add(child);

    public override NodeState Execute()
    {
        foreach (var child in children)
        {
            state = child.Execute();
            if (state == NodeState.SUCCESS)
                return NodeState.SUCCESS;
        }
        return NodeState.FAILURE;
    }
}
```

4. Sequence实现
序列节点是按顺序依次执行其子节点，直到一个子节点失败，或者所有子节点执行成功
```cs
public class SequenceNode : BTNode
{
    private List<BTNode> children = new List<BTNode>();

    public void AddChild(BTNode child) => children.Add(child);

    public override NodeState Execute()
    {
        foreach (var child in children)
        {
            state = child.Execute();
            if (state == NodeState.FAILURE)
                return NodeState.FAILURE;
        }
        return NodeState.SUCCESS;
    }
}
```

5. Action实现
动作节点是叶子节点，执行具体的行为（如移动、攻击等）
```cs
public class ActionNode : BTNode
{
    private Func<NodeState> action;

    public ActionNode(Func<NodeState> action) => this.action = action;

    public override NodeState Execute() => action.Invoke();
}
```

6. Condition实现
条件节点用于判断某个条件是否成立。例如，检测敌人是否在视野内
```cs
public class ConditionNode : BTNode
{
    private Func<bool> condition;

    public ConditionNode(Func<bool> condition) => this.condition = condition;

    public override NodeState Execute() => condition.Invoke() ? NodeState.SUCCESS : NodeState.FAILURE;
}
```

7. 构建行为树
现在可以构建一个行为树，假设想要实现一个简单的敌人AI
  1. 如果敌人被发现，攻击敌人
  2. 如果敌人不在视野内，继续巡逻

```cs
public class EnemyAI : MonoBehaviour
{
    private BTNode behaviourTree;

    void Start()
    {
        // 创建行为树节点
        SelectorNode root = new SelectorNode();

        // 创建条件节点：检查敌人是否在视野内
        ConditionNode enemyInSight = new ConditionNode(() => IsEnemyInSight());

        // 创建动作节点：执行攻击
        ActionNode attackEnemy = new ActionNode(() => 
        {
            Attack();
            return NodeState.SUCCESS;
        });

        // 创建序列节点：敌人被发现 -> 攻击
        SequenceNode sequence = new SequenceNode();
        sequence.AddChild(enemyInSight);
        sequence.AddChild(attackEnemy);

        // 将选择节点作为根节点
        root.AddChild(sequence);

        // 行为树
        behaviorTree = root;
    }

    void Update()
    {
        // 执行行为树
        behaviorTree.Execute();
    }

    bool IsEnemyInSight()
    {
        // 假设简单的视野检测，返回随机值
        return UnityEngine.Random.value > 0.5f;
    }

    void Attack()
    {
        Debug.Log("Attacking the enemy!");
    }
}
```

**调试与优化**\
在基本的行为树结构上，接下来可以
- 添加更多类型的节点（如黑板数据存储、任务节点等）
- 调整节点之间的关系，使其更加复杂和智能
- 在行为树中加入事件驱动机制，例如接收到伤害或其他外部条件时触发特定的行为

**扩展与优化**\
- 动态调整行为树：可以在游戏过程中动态修改行为树的结构或切换不同的行为树，例如根据敌人状态切换攻击模式
- 黑板（Blackboard）：行为树的节点可以通过黑板来共享状态数据，如敌人的位置、角色的血量等
- 多智能体支持：在大型游戏中，可能会有多个角色或敌人使用同一行为树。可以使用多线程或队列来管理多个智能体的行为执行
