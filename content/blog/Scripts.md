---
title: "Scripts"
date: 2025-06-01
categories: [Note]
tags: [Unity, Unity System]
author: "ljf12825"
summary: How to write scripts in Unity
---
Unity脚本就是你编写的C#类，它控制游戏中物体的行为、交互、动画、输入、碰撞、UI等逻辑

## 脚本类型
Unity中的脚本根据其用途可以分为3类：

| 特性     | `MonoBehaviour`        | `ScriptableObject` | 纯 C# 类       |
| ------ | ---------------------- | ------------------ | ------------ |
| 是否可挂载  |  可以挂载到 GameObject     |  不行               |  不行         |
| 生命周期函数 |  有 `Start`、`Update` 等 |  没有               |  没有         |
| 是否能序列化 |  支持                   |  支持               |  默认不支持      |
| 支持协程   |  `StartCoroutine()`   |  不支持              |  不支持        |
| 使用场景   | 行为脚本，控制对象              | 数据容器，可复用资源配置       | 工具类、算法类等逻辑单元 |

1. `MonoBehaviour`（行为脚本）
  - 必须挂载在场景中的GameObject上
  - 用于控制逻辑、角色行为、输入响应等
  - 有生命周期函数
  - 支持协程

  **适用场景**
  1. 角色控制器（移动、跳跃、攻击）
  2. UI交互逻辑
  3. 游戏状态管理
  4. 物理交互处理
  5. 动画状态控制

2. `ScriptableObject`（数据容器）
  - 轻量级对象，不需要挂载，常用于数据复用（如技能表、配置表）
  - 支持序列化，可以做成asset文件
  - 没有生命周期函数，但可以在`OnEnable()`做初始化
  - 更节省内存，场景切换时不会被销毁

  **核心优势**
  - 内存高效：不依赖场景、按需加载
  - 数据复用：同一资源可被多个对象共享
  - 热重载：运行时修改自动同步
  - 版本友好：资源文件便于版本控制

3. 纯C#类（工具类）
  - 用于封装工具、算法、模型等逻辑（如A*算法、存档系统）
  - 不支持Unity生命周期和序列化
  - 由其他脚本调用，解耦业务逻辑

  **适用场景**
  1. 实现复杂算法
  2. 数据模型定义
  3. 工具类库
  4. 设计模式实现

  **优化技巧**
  ```cs
  // 使用partial类拆分大型工具类
  public partial class MathUtility
  {
    public static Vector3 CalculateBazierPoint(...){ ... }
  }
  public partial class MathUtility
  {
    public static Quaternion SmoothDampRoatation(...){ ... }
  }
  
  // 使用扩展方法增强现有功能
  public staitc class TransformExtensions
  {
    public static void Reset(this Transform transform)
    {
      transform.position = Vector3.zero;
      transform.rotation = Quaternion.identity;
      transform.localScale = Vector3.one;
    }
  }
  ```

## 变量声明
在Unity C#脚本中，变量声明是定义数据存储位置的基本方式。变量可以存储各种类型的数据，如数字、文本、布尔值、引用游戏对象等

**基本语法**\
```cs
[访问修饰符] [数据类型] [变量名] [= 初始值]
```

**访问修饰符**\

| 修饰符                        | Inspector 可见 | 其他脚本可访问 | 用途                 |
| -------------------------- | ------------ | ------- | ------------------ |
| `public`                   | 可见            | 可访问       | 对外公开变量（慎用）         |
| `private`                  | 不可见（默认）        | 不可访问       | 仅类内部使用             |
| `[SerializeField] private` | 可见            | 不可访问       | 私有但可在 Inspector 编辑 |

```cs
public int score = 9; // 可见且可访问
private float health = 100f; // 完全私有
[SerializeField] private float moveSpeed = 5f; // Inspector可见但外部不可改
```

**数据类型**\
- 基本数据类型：`int`,`float`,`bool`,`string`等
- [Unity Build in Types]({{site.baseurl}}/posts/2025-06-03-Unity-Build-in-Types/)

**变量特性**\
[Attribute in Unity]({{site.baseurl}}/posts/2025-07-10-Attribute-in-Unity/)

## 脚本间通信（引用其他组件）
[Unity Component Communication]({{site.baseurl}}/posts/2025-07-15-Unity-Component-Communication/)

## 基类: MonoBehaviour
[MonoBehaviour]({{site.baseurl}}/posts/2025-07-11-MonoBehaviour/)

## ScriptableObject（数据驱动）
[ScriptableObject]({{site.baseurl}}/posts/2025-07-11-ScriptableObject/)

## 变量管理策略
### 序列化控制
```cs
// 条件序列化
[SerializeField]
private bool useAdvancedSettings;
[SerializeField, ShowIf("useAdvancedSettings")]
private float advancedParameter;

// 多态序列化
[SerializeReference]
public IWeapon currentWeapon; // 可序列化接口
```

### 组织技巧
```cs
[System.Serializable]
public class CharacterStats
{
  public float health;
  public float stamina;
  public float attackPower;
}

public class Player : MonoBehaviour
{
  [BoxGroup("基础属性")]
  public CharacterStats baseStats;

  [BoxGroup("成长属性")]
  public CharacterStats growthStats;
}
```

## 性能优化
1. 缓存组件引用
```cs
private Rigidbody = _rb;
void Awake() => _rb = GetComponent<Rigidbody>();
```

2. 避免频繁GetComponent
```cs
// 错误做法：每帧调用
void Update() => GetComponent<Rigidbody>().AddForce(...);

// 正确做法
private Rigidbody _rb;
void Awake() => _rb = GetComponent<Rigidbody>();
void Update() => _rb.AddForce(...);
```

3. 使用ObjectPool管理频繁创建/销毁的对象
[Object Pooling]({{site.baseurl}}/posts/2025-06-06-Object-Pooling/)

4. 合理使用Update方法
```cs
// 低频更新示例
private float _nextUpdateTime;
void Update()
{
  if (Time.time < _nextUpdateTime) return;
  _nextUpdateTime = Time.time + 0.5f;
  // 每0.5秒执行一次的逻辑
}
```

## 架构设计建议
1. 事件驱动架构
```cs
public static class GameEvents
{
  public static event Action OnPlayerDeath;
  public static event Action<int> OnScoreChanged;

  public static void TriggerPlayerDeath() => OnPlayerDeath?.Invoke();
}
```

2. 组件化设计
```cs
// 将功能拆分为独立组件
[RequireComponent(typeof(HealthSystem))]
public class Damageable : MonoBehaviour
{
  private HealthSystem _health;
  void Awake() => _health = GetComponent<HealthSystem>();

  public void TakeDamage(float amount) => _health.Reduce(amount);
}
```

3. 状态模式应用
```cs
public interface IPlayerState
{
  void Enter(PlayerController player);
  void Update();
  void Exit();
}

public class JumpState : IPlayerState { ... }
public class AttackState : IPlayerState { ... }
```

## 调试与测试
1. 自定义调试工具
```cs
#if UNITY_EDITOR
[Header{"Debug"}]
[SerializaField] private bool _showDebugInfo;
[SerializeField, ShowIf("_showDebugInfo")]
private Color _debugColor = Color.red;

void OnDrawGizmos()
{
  if(!_showDebugInfo) return;
  Gizmos.color = _debugColor;
  Gizmos.DrawWireSphere(transform.position, 2f);
}
#endif
```

2. 单元测试示例
```cs
#if UNITY_EDITOR
using NUnit.Framework;

public class MathTests
{
  [Test]
  public void VectorAngleTest()
  {
    var v1 = new Vector2(1, 0);
    var v2 = new Vector2(0, 1);
    Assert.AreEqual(90, Vector2.Angle(v1, v2));
  }
}
#endif
```

## 版本兼容性处理
```cs
// API版本检查
#if UNITY_2020_1_OR_NEWER

  // 使用新API
  transform.hasChanged = false;

#else

  // 兼容旧版本的替代方法
  StartCoroutine(CheckTransformChange());
#endif
```

## Unity命名空间
### 1.`UnityEngine`
- 功能：Unity核心功能的主命名空间
- 内容：
  - 游戏对象相关类：`GameObject`,`Transform`,`Component`
  - 数学类型：`Vector2`, `Vector3`, `Quaternion`, `Matrix4x4`
  - 渲染相关：`Material`, `Shader`, `Camera`, `Light`
  - 物理系统：`Rigidbody`, `Collider`, `Physics`
  - 输入系统：`Input`
  - 时间系统：`Time`
  - 资源管理：`Resources`
  >几乎所有 Unity 游戏代码都依赖这个命名空间。

### 2.`UnityEngine.UI`
- 功能：Unity 的传统 UI 系统。
- 内容：
  - UI 控件类：`Button`, `Text`, `Image`, `Slider`, `Canvas`
  - 事件系统相关：`EventSystem`, `PointerEventData`
>用于构建游戏界面，处理用户交互。

### 3.`UnityEngine.SceneManagement`
- 功能：管理场景加载和卸载。
- 内容：
  - 场景管理类：`SceneManager`
  - 场景信息类：`Scene`
- 典型用法：
  - `SceneManager.LoadScene("SceneName")` 加载场景
  - `SceneManager.GetActiveScene()` 获取当前场景

### 4.`UnityEngine.Audio`
- 功能：音频系统相关类。
- 内容：
  - AudioSource, AudioClip, AudioListener
  - 混音器类：AudioMixer
>处理声音播放和混音控制。

### 5.`UnityEngine.EventSystem`
- 功能：底层事件系统，支持 UI 和输入事件。
- 内容：
  - 事件接口：IPointerClickHandler, IDragHandler 等
  - 事件数据类：PointerEventData, BaseEventData
>UI 交互和自定义输入处理常用。

### 6.`UnityEngine.Animation`
- 功能：动画系统相关。
- 内容：
  - 动画控制器：Animator
  - 动画事件和状态机相关类
>用于角色动画控制和状态机管理。

### 7.`UnityEditor`（仅编辑器）
- 功能：编辑器扩展相关
- 内容：
  - 自定义Inspector、编辑器窗口、菜单项等
>只能在编辑器环境使用，构建后不包含

### 8.`Unity.Collections` / `Unity.Jobs` / `Unity.Burst`
- 功能：高性能计算和多线程相关。
- 内容：
  - NativeArray, NativeList
  - 作业系统：IJob, JobHandle
  - Burst 编译器加速
>DOTS（Data-Oriented Technology Stack）架构核心。

[官方文档](https://docs.unity3d.com/ScriptReference/)

## Unity脚本的最佳实践
1. 变量封装
  - 用`[SerializeField] private`替代`public`暴露数据

2. 合理命名
  - 变量名应体现用途：`moveSpeed`比`ms`清晰

3. Inspector优化
  - 用`[Header]`分组变量
  - 用`[Tooltip]`提示变量作用

4. 性能考虑
  - 避免在`Update()`中频繁使用`Find`/`GetComponent`
  - 用缓存变量保存引用

5. 解耦逻辑
  - 数据放ScriptableObject
  - 行为放MonoBehaviour
  - 公共算法放普通C#类
