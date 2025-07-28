---
title: "ScriptableObject"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Syntax]
author: "ljf12825"
permalink: /posts/2025-07-11-ScriptableObject/
---
`ScriptableObject` 是 Unity 中的一种特殊类型的对象，它是用于存储数据的，类似于普通的 C# 类，但它不需要与游戏对象（`GameObject`）关联

`ScriptableObject` 主要用于节省内存、提高性能和简化数据的管理。它通常用来存储可重用的数据，如配置、设置、状态信息等

## 基本概念
`ScriptableObject` 是 Unity 提供的一种特殊对象类型，允许你将数据持久化到磁盘上，并能够在编辑器中方便地进行编辑和管理。这与普通的 MonoBehaviour 类（需要附加到 GameObject 上）不同，`ScriptableObject` 并不依赖于场景中的任何对象

**主要特点**
- 独立于GameObject：`ScriptableObject`并不需要绑定到一个`GameObject`上，因此它可以轻松地存储全局数据
- 可在编辑器中编辑：可以在Unity编辑器中查看、编辑和保存`ScriptableObject`实例
- 性能优化：`ScriptableObject`实例是共享的，因此多个对象可以引用同一个`ScriptableObject`实例，这有助于减少内存消耗
- 数据持久化：`ScriptableObject`支持数据持久化，可以将其作为资源保存在磁盘上，便于管理和编辑

## 创建和使用
1. 创建ScriptableObject类
要创建 ScriptableObject，首先需要继承 ScriptableObject 基类，并为它定义一个静态方法来实例化对象
```cs
using UnityEngine;

[CreateAssetMenu(fileName = "NewCharacterData", menuName = "ScriptableObjects/CharacterData")]
public class CharacterData : ScriptableObject
{
    public string characterName;
    public int health;
    public float speed;
}
```
这个例子中，定义了一个`CharacterData`类，存储角色的数据（如名字、生命值和速度）

`CreateAssetMenu`特性使得可以通过右键点击创建该类型的`ScriptableObject`实例

2. 创建实例
在Unity编辑器中，可以右键点击项目视图中的文件夹，并选择`Create` > `ScriptableObjects` > `CharacterData`，然后创建一个新的`CharacterData`实例。它将出现在项目文件中，并且可以像其他资源一样编辑

3. 使用ScriptableObject
一旦创建了`ScriptableObject`实例，就可以通过代码引用它，或者将其赋值给其他对象的字段
```cs
using UnityEngine;

public class Character : MonoBehaviour
{
    public CharacterData characterData;

    void Start() => Debug.Log($"{characterData.Name}, {characterData.health}, {characterData.Speed}");
}
```
在这个示例中，`Character`脚本引用了一个`CharacterData`类型的字段，并在`Start`方法中打印出角色的数据。在Unity编辑器中，可以将创建的`CharacterData`实例拖动到`Character`脚本的`characterData`字段上

## 使用场景和优势
1. 数据驱动设计
`ScriptableObject`非常适合用于数据驱动的设计模式，尤其是需要存储大量的静态数据时（例如游戏中的关卡配置、角色属性、武器属性等），使用`ScriptableObject`可以让你将这些数据与游戏逻辑分离，使其更加模块化和易于管理

2. 节省内存
由于`ScriptableObject`实例是引用传递的，而不是每次都创建新对象，它可以显著减少内存开销。多个游戏对象可以共享同一个`ScriptableObject`实例，避免了每个对象都存储一份重复的数据

3. 配置和设置
在游戏开发中，很多时候会需要管理一组设置，例如游戏难度、音效音量等，`ScriptableObject`可以很方便地存储这些配置，并且能在编辑器中直接查看和修改

4. 序列化复杂数据结构
`ScriptableObject`支持序列化复杂的数据结构，包括数组、列表、字典等，可以轻松地管理这些数据

## 常见用法
1. 创建游戏配置数据
`ScriptableObject`在游戏配置中非常常见
```cs
[CreateAssetMenu(fileName = "GameSettings", menuName = "ScriptableObjects/GameSettings")]
public class GameSettings : ScriptableObject
{
    public float musicVolume;
    public float sfxVolume;
    public bool isFullscreen;
}
```
然后可以在`GameSettings`资源中编辑这些值，或者通过脚本加载并应用它们

2. 创建状态机（State Mechine）
每个状态可以是一个`ScriptableObject`实例
```cs
public abstract class State : ScriptableObject
{
    public abstract void Enter();
    public abstract void Exit();
}
```

3. 对象池
在对象池模式中，`ScriptableObject`可以用来存储池中对象的配置和初始化数据

## 注意事项
- 生命周期管理：`ScriptableObject`不是MonoBehaviour，它并不绑定到游戏对象上，因此它的生命周期需要手动管理
- 避免修改数据：如果修改了一个`ScriptableObject`实例的数据，它会影响到所有引用了该实例的对象，因此需要小心管理，避免意外修改
- 场景与非场景资源：`ScriptableObject`不依赖于场景，保存为资源文件（例如`.asset`文件）。因此，可以在多个场景中共享相同的`ScriptableObject`实例

## API
`ScriptableObject` inherites from `Object` Implemented in `UnityEngine.CoreModule`

**Static Methods**

| Method | Description |
| - | - |
| `CreateInstance` | 创建实例 |

**Message**

| Message | Description |
| - | - |
| `Awake` | 当实例被创建时调用 |
| `OnDestroy` | 当实例被销毁时调用 |
| `OnDisable` | 当超出范围时调用 |
| `OnEnable` | 当被加载时调用 |
| `OnValidate` | 仅在编辑器状态下，当脚本被加载或值发生改变时调用 |
| `Reset` | 恢复默认值 |

## ScriptableObject设计原理
`ScriptableObject`的原理涉及Unity引擎中的几个关键概念：资源管理、序列化、以及数据共享

### ScriptableObject是Unity引擎的资源系统的一部分
`ScriptableObject`继承自Unity的`UnityEngine.Object`，这是Unity中所有资源的基类；与普通的`MonoBehaviour`不同，`ScriptableObject`不直接绑定到`GameObject`上，它更像是一个独立的资源对象

#### 资源管理
在Unity中，资源是通过 Asset Database来管理的，而`ScriptableObject`是其中的一部分。它可以在Project视图中作为资源文件存在，通常是`.asset`文件。这些资源通过Unity的资源管理系统进行管理，在加载和卸载时可以更高效地共享和复用

每个`ScriptableObject`实例实际上是一个持久化的资源文件，这些文件与场景分离，能够在场景之间进行共享，甚至能在多个项目之间共享

#### 序列化
`ScriptableObject` 能够被 Unity 引擎 序列化。这意味着，它的字段可以被保存到磁盘上（比如 `.asset` 文件），并且可以通过 Unity 编辑器直接编辑和查看。Unity 通过其内置的序列化机制，使得 `ScriptableObject` 的数据可以在编辑器和运行时之间进行持久化存储。

与普通的 C# 类不同，`ScriptableObject` 对其字段的修改不需要手动管理存储或写入磁盘，它们会自动序列化到资源文件中。Unity 会根据字段类型将数据转化为可存储的形式（如整数、浮点数、字符串等），并且能够在资源文件中对这些数据进行持久化。

#### 内存共享
Unity 内部采用了对象池的机制来管理 `ScriptableObject` 实例。多个 `GameObjec` 或 `MonoBehaviour` 可以引用同一个 `ScriptableObject` 实例，而不需要为每个对象创建一个新的实例。这个共享机制显著降低了内存消耗，因为所有引用都指向同一个实例，而不是复制一份新的对象

## ScriptableObject与单例模式
`ScriptableObject`在某些情况下可以代替单例模式，但它和传统的单例模式有一些关键的区别，适用场景也不同

### 相似性
- 全局数据管理：`ScriptableObject`可以用来存储全局数据，这使得它类似于单例模式中的静态实例，允许不同的对象共享相同的数据
- 避免重复创建：`ScriptableObject`实例在项目中是共享的，多个类可以引用同一个`ScriptableObject`实例，避免了多次创建相同的对象

### 区别
1. 生命周期和资源管理
  - 单例模式：单例通常由程序控制其生命周期，通常在应用程序启动时创建，并在整个生命周期内存在。它会保持在内存中，直到应用程序结束
  - ScriptableObject：`ScriptableObject`是资源文件，它的生命周期由Unity管理，通常是与资源文件关联的，而不是直接由代码控制。它可以在场景之间共享，而且它的数据通常是持久化存储的。可以在编辑器中创建并编辑它，且它能通过引用在多个场景或对象之间共享

2. 用途和场景
  - 单例模式：适用于一些全局管理的场景，如全局配置、应用程序级别的控制器等，特别是那些需要在整个应用程序生命周期内保持唯一且不变的实例的场合。
  - ScriptableObject：更多用于数据存储和共享，尤其适用于配置文件、游戏数据、状态机、资源管理等场景。它非常适合用于开发过程中可以被编辑和调整的数据，且数据是资源化的，可以在 Unity 编辑器中查看和修改。

3. 线程安全
  - 单例模式：如果使用静态实例，你需要确保它是线程安全的，尤其是在多线程环境中。很多时候，单例实现中需要用到锁（如 `lock`）来保证线程安全
  - ScriptableObject：它本身不需要担心线程安全问题，因为 Unity 的大多数 API 只能在主线程中访问。`ScriptableObject` 更多是用于游戏的主线程数据管理

4. 序列化和编辑器功能
  - 单例模式：通常，单例实例不是可序列化的，因此无法在 Unity 编辑器中直接编辑它们。单例通常需要使用 `Awake()` 或 `Start()` 方法来初始化。
  - ScriptableObject：可以在 Unity 编辑器中直接创建、编辑和保存为资源。它支持序列化，可以作为 `.asset` 文件保存，并且可以在多个场景中共享。

### 何时选择`ScriptableObject`
1. 数据驱动的设计
如果需要在多个场景或多个对象之间共享数据，且这些数据不需要实时动态计算或修改，那么 `ScriptableObject` 是一个很好的选择。例如，角色配置、物品数据等，都可以使用 `ScriptableObject` 来代替单例模式

2. 避免手动管理生命周期
`ScriptableObject` 会由 Unity 自动管理生命周期，无需手动控制它的创建和销毁。它的资源化特性非常适合于项目中需要持久化的共享数据

3. 需要在编辑器中修改数据
如果数据需要频繁修改或调试，而不仅仅是运行时的数据，那么 `ScriptableObject` 会更加方便，因为它可以在 Unity 编辑器中直接编辑，并且会自动序列化为 `.asset` 文件进行保存

### 何时选择单例模式
1. 需要单一实例控制的场景
如果类需要保持唯一性并且不希望被多个场景或多个对象引用（例如全局游戏管理器，音频管理器等），传统的单例模式更为合适

2. 无法进行编辑和修改的场景
如果数据在运行时需要根据某些动态条件调整，`ScriptableObject` 就不太合适。它通常用于静态数据，而动态计算和状态管理可能更适合单例模式

## ScriptableSingleton
ScriptableSingleton 是一种结合了 `ScriptableObject` 和单例模式的设计模式，它继承自 `ScriptableObject` 利用了 `ScriptableObject` 的资源管理和共享特性，同时确保数据只有一个实例，并且可以全局访问。这种模式在 Unity 开发中非常常见，特别是在需要保持全局唯一的数据管理对象时

### 概念
`ScriptableSingleton` 本质上是一个`ScriptableObject`，但是它确保在整个项目中只有一个实例，它的使用方式类似于传统的单例模式

关键特点：
- 唯一性：确保全局只有一个实例，可以在任何地方访问
- 资源化：与`ScriptableObject`类似，`ScriptableObject`作为资源存在，可以在Unity编辑器中查看和修改其数据
- 全局共享：它可以被多个对象引用而不会创建新的副本，因为它是一个`ScriptableObject`，Unity会自动共享它的实例

### 实现
1. 基础实现
创建一个继承自`ScriptableObject`的类，并在其中实现单例逻辑
```cs
using UnityEngine;

public class ScriptableSingleton<T> : ScriptableObject where T : ScriptableObject
{
    private static T _instance;

    // 保证在资源文件中只存在一个实例
    public static T Instance
    {
        get
        {
            if (_instance == null)
            {
                // 尝试从资源文件中加载该实例
                _instance = Resources.Load<T>(typeof(T).Name);
                if (_instance == null)
                {
                    // 如果不存在，创建新的实例并保存
                    _instance = CreateInstance<T>();
                    Debug.LogWarning($"Creating new instance of {typeof(T).Name}.");
                }
            }
            return _instance;
        }
    }
}
```
在这个基础实现中：
- 通过`Instance`属性获取`ScriptableSingleton`的唯一实例
- 当第一次访问实例时，它会尝试从资源文件中加载该实例，如果加载不到，就会创建一个新的实例并保持其唯一性
- `Resources.Load<T>(typeof(T).Name)`会从`Resource`文件夹中加载资源，如果没有该资源，则会使用`CreateInstance<T>()`创建一个新的实例

2. 使用
当需要使用`ScriptableSingleton`时，只需创建一个继承自`ScriptableSingleton`的类
```cs
[CreateAssetMenu(fileName = "GameSettings", menuName = "ScriptableObjects/GameSettings")]
public class GameSettings : ScriptableSingleton<GameSettings>
{
    public float musicVolume;
    public float sfxVolume;
}
```
这样，`GameSetting`类就变成了一个`ScriptableSingleton`

### API
**Static Properties**

| Property | Description |
| - | - |
| `instance` | 获得单例的实例，当第一次使用这个属性时，Unity会创建这个单例的实例 |

**Protected Methods**

| Method | Description |
| - | - |
| `Save` | 保存当前单例的状态 |

**Static Methods**

| Method | Description |
| - | - |
| `GetFilePath` | 获得ScriptableSingleton的文件路径 |