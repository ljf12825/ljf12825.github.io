---
title: UML
date: 2025-12-31
author: "ljf12825"
summary: Overview of UML
type: file
---

UML(Unified Modeling Language，统一建模语言)是用来描述软件系统结构、行为和交互的标准化图形语言\
它由Grady Booch, James Rumbaugh和Ivar Jacobson（被称为“三友”）于1990年代中期开发，1997年被OMG（对象管理组织）采纳为行业标准

## 核心思想

- 统一标准：不同团队、不同语言都能用UML表达系统
- 可视化思维：把抽象的类、对象、状态、流程、数据流画成图
- 与过程无关：可用于任何开发方法
- 面向对象：特别适合面向对象分析和设计
- 多角度描述系统
  - 静态结构：类、模块、组件
  - 动态行为：交互、流程、状态变化

## UML的图分类（14种图）

### 结构图（静态建模）- 6种

#### 类图(Class Diagram)

- 先后is类、接口、协作及其关系
- 核心元素：类名、属性、方法

```uml
class Car {
    - String brand
    - int speed
    + accelerate()
    + brake()
}
```

#### 对象图(Object Diagram)

特定时间点的对象实例及其关系

#### 组件图(Component Diagram)

显示系统的物理组件及其依赖关系

#### 部署图(Deployment Diagram)

硬件节点和软件组件的部署关系

#### 包图(Package Diagram)

将相关元素分组为包，显示包间依赖

#### 复合结构图

展示类的内部结构

### 行为图(动态建模) - 8种

#### 用例图(Use Case Diagram)

从用户角度展示系统功能

```text
参与者 -> 用例
（用户 -> 登录系统）
```

#### 活动图(Activity Diagram)

类似流程图，展示业务流程或操作序列

#### 状态机图(State Machine Diagram)

对象在其生命周期种的状态变化

#### 序列图(Sequence Diagram)

强调时间顺序的消息交互

```uml
User → System: 登录请求
System → Database: 验证凭据
Database → System: 验证结果
System → User: 登录响应
```

#### 通信图(Communication Diagram)

强调对象间结构关系的交互

#### 时序图(Timing Diagram)

关注状态随时间的变化

#### 交互概览图

活动图和序列图的结合

### 其他辅助图

#### ER图/数据流图

可结合UML表示数据结构

#### 行为树

#### 决策树

#### 组件依赖图

## 核心建模元素

1. 事物(Things)
    - 结构事物：类、接口、用例等
    - 行为事物：交互、状态机
    - 分组事物：包
    - 注释事物：注释
2. 关系(Relationships)
    - 依赖(Dependency)：虚线箭头
    - 关联(Association)：实线
    - 聚合(Aggregation)：空心菱形
    - 组合(Composition)：实心菱形
    - 泛化(Generalization)：实线空心三角
    - 实现(Realization)：虚线空心三角

## UML在实际开发中的应用

1. 需求分析阶段
    - 用例图：捕获用户需求
    - 活动图：分析业务流程
2. 设计阶段
    - 类图：设计系统结构
    - 序列图：设计对象交互
    - 状态图：设计对象行为
3. 架构设计
    - 组件图：定义软件架构
    - 部署图：规划系统部署

## 最佳实践指南

1. 适度使用原则
    - 不要为每行代码都画UML图
    - 关键复杂部分才需要详细建模
2. 分层展示
    - 概念层：业务概念和关系
    - 规约层：接口和抽象定义
    - 实现层：具体实现细节
3. 工具支持
    - 常用工具：Enterprise Architect, Visual Paradigm, StarUML, PlantUML
    - 代码生成：正向工程（UML -> 代码）
    - 反向工程：代码 -> UML

## 常见误区和注意事项

1. 不要过度建模：UML是手段而非目的
2. 保持同步：代码变更时及时更新UML
3. 选择合适的图：根据沟通目的选择图标类型
4. 关注可读性：避免过于复杂的图表
