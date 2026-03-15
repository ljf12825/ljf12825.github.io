---
title: Class Diagram
date: 2025-12-31
author: "ljf12825"
summary: How draw Class diagram
type: file
---

类图是系统的结构蓝图，它描述的是

- 系统里有哪些类
- 它们有哪些属性、方法
- 它们之间如何关联、依赖、继承、组合

## 类的标准画法

一个类用一个矩形表示，分三层

```text
+------------------+
|     Player       |  类名
+------------------+
| - hp : int       |  属性
| - speed : float  |
+------------------+
| + Move() : void  |  方法
| + Attack()       |
+------------------+
```

### 可见性符号

| 符号 | 含义 |
| `+` | public |
| `-` | private |
| `#` | protected |
| `~` | package |

## 类之间的6种核心关系

### 1. 继承（泛化Generalization）

```text
Enemy
  ▲
  │
Boss
```

- 表示：Boss is-a Enemy
- `class Boss : public Enemy`

### 2. 关联(Association)

```text
Player ───── Weapon
```

- 表示“有关系”
- 成员变量指针/引用

```cpp
class Player {
    Weapon* weapon;
}
```

### 3. 聚合(Aggregation) —— 弱拥有

```text
Team ◇──── Player
```

- Team有Player,但Player不依赖Team生存
- 比如：球队解散，球员还在

```cpp
class Team {
    std::vector<Player*> players;
};
```

### 4. 组合(Composition) —— 强拥有（生命周期绑定）

```text
Car ◆──── Engine
```

- Car销毁 -> Engine也销毁
- 通常用值成员

```cpp
class Car {
    Engine engine;
};
```

### 5. 依赖(Dependency)

```text
A -----> B
```

- A的函数参数/局部变量中用到B
- 表示“临时使用”

```cpp
void Render(Mesh& mesh)
```

### 6. 实现(接口)

```text
IWeapon
   ▲
Sword
```

C++抽象类

```cpp
class IWeapon {
public:
    virtual void Attack() = 0;
};
```

### 关系强度对比(从弱到强)

```
依赖 -> 关联 -> 聚合 -> 组合 -> 继承
```

| 关系 | 生命周期绑定 | 所有权 |
| - | - | - |
| 依赖 | ❌ | ❌ |
| 关联 | ❌ | ❌ |
| 聚合 | ❌ | 弱 |
| 组合 | ✅ | ✅ |
| 继承 | ✅ | 类型绑定 |

## 类图的作用

- 架构设计：防止耦合爆炸
- 模块边界：明确责任

在做系统时，可以先画类图，再写头文件，最后写实现
