---
title: ML Agents
date: 2026-05-07
tags: [ML Agents, D0, Unity2017]
author: ljf12825
alive: true
type: file
summary: Tutorial of Unity's ML Agents
---

## [Unity ML-Agents]({{/log/ML-Agents/)
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