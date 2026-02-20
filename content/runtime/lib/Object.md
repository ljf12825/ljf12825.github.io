---
title: "Object"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Syntax, Class]
author: "ljf12825"
type: blog
summary: Unity's class Object
---
Object是Unity中所有内建物体的基类，实现在UnityEngine.CoreModule中，不同于C#中的`System.Object`，它是托管层（C#）和原生引擎层（C++）之间的桥梁，背后绑定着Unity C++引擎层的资源句柄

## Object的特点（Unity的特有行为）
**引擎资源的绑定**

每个`UnityEngine.Object`对象都对应一个C++层对象，它们通过一个`instance 2D`来关联，且资源的生命周期不由GC管理

比如：
```cs
GameObject go = new GameObject();
Object.Destroy(go);
Debug.Log(go == null);  // true
```
这就是Object的“鬼行为”，此处的`go == null`并非等价于`object is null`

**Unity的“fake null”机制**
`fake null`是Unity中一个特有的概念，通常用来描述已经销毁的对象或者已经不再有效的对象的引用。尽管对象被销毁了，但它仍然存在一个“假”引用，这个引用就像是一个假的`null`，它指向的对象实际上已经不再有效，但在代码层面看起来却任然是一个对象。具体来说，`fake null`让你能够获得一个对象引用，但该对象的属性和方法无法被正常访问，或者会返回默认值，或者不会产生期望的结果

Unity重写了`==`操作符

如果一个`Object`对象在引擎层已经被销毁（Destroy过），但C#还保有托管引用，这时候：
```cs
Debug.Log(go == null); // true
Debug.Log(go.Equals(null)); // false
Debug.Log(ReferenceEquals(go, null)); // false
```

为什么需要fake null
1. 避免NullReferenceException
在传统的编程中，如果一个对象被销毁或设为`null`，而你还试图访问它的属性或方法，就会引发`NullReferenceException`错误。在Unity中，许多对象的销毁并不立即释放内存，尤其是当销毁了一个游戏对象或组件时。为了避免频繁的`null`检查和避免程序崩溃，Unity引入了`fake null`

2. 内存管理的优化
Unity并不是立即销毁对象，而是将其“标记”为无效，保持它的引用存在，但无法访问。这使得Unity可以更高效地管理内存。内存的实际释放通常依赖于垃圾回收器，而不是对象销毁后立即释放内存，从而避免频繁的内存分配和释放造成的性能瓶颈

`fake null`行为总结
1. 引用存在，但对象无效
2. 不抛出异常
3. 确保内存管理不会立即释放内存

### 底层原理
Unity的`Object`在C#层其实只是一个代理，它对应的C++引擎层对象通过C#层的`IntPtr m_CachedPtr`与C++对象通信（该字段可以在反编译时看到）

资源对象（比如一个贴图）在编译器导入时会被转换为native object，保存在场景或资源文件中，加载时通过Unity自己的反序列化系统生成C#代理对象，并挂接`m_CachedPtr`

Unity会使用C++引擎进行资源生命周期的管理，而不是C#的GC，所以Destroy调的是C++的释放接口

```text
Sometimes an instance of Object can be in detached state, where there is no underlying native object. T
his can happen if the instance references an native object that has been destroyed, or a missing Asset or missing type. 
Detached objects retain their InstanceID, but the object cannot be used to call methods or access properties. 
An object in this state will appear to be null, because of special implementations of operator==, operator!= and Ojbect.bool.
Because the object is not truly null, a call to Object.ReferenceEquals(myobject, null) will return false.

The null-comditional operator(?.)and the null-coalescing operator(??)are not supported with Unity Object because they cannot be overridden to treat detached objects the same as null.
It is only safe to use those operators in your scripts if there is certainty that the objects being checked are never in a detached state.
```


## Object API
**Properties**

| 属性 | 类型 | 描述 |
| - | - | - |
| `name` | `string` | 对象名称（可读写） |
| `hideFlags` | `HideFlags` | 控制对象是否可隐藏/可编辑/保存 |

**`hideFlags`**  
常见用途：
- 隐藏对象
- 防止误删或编辑
- 不让对象随着场景保存（通常用于运行时生成的对象）

常用枚举值

| 枚举值                          | 含义                |
| ---------------------------- | ----------------- |
| `HideFlags.None`             | 默认行为，无隐藏          |
| `HideFlags.HideInHierarchy`  | 在 Hierarchy 视图中隐藏 |
| `HideFlags.HideInInspector`  | 在 Inspector 中隐藏   |
| `HideFlags.NotEditable`      | 不允许用户编辑（灰掉）       |
| `HideFlags.DontSave`         | 场景保存时不保存该对象       |
| `HideFlags.DontSaveInBuild`  | 打包时不保存该对象         |
| `HideFlags.DontSaveInEditor` | 编辑器中不保存该对象        |
| `HideFlags.HideAndDontSave`  | 隐藏并不保存（临时对象）      |

**Public Methods**

| Method | Description |
| - | - |
| `GetInstanceID` | 获得object的实例ID |
| `ToString` | 返回`object.name` |

**Static Methods**

| 方法                                                                      | 描述                                    | 示例/说明                                          |
| ----------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| `Destroy(Object obj)` | 销毁一个对象，在当前帧结束时生效                      | `Destroy(gameObject);`                         |
| `Destroy(Object obj, float t)` | 延迟 t 秒销毁对象                            | `Destroy(gameObject, 2.0f);`                   |
| `DestroyImmediate(Object obj)` | 立刻销毁对象，**只推荐在编辑器中使用**                 | `DestroyImmediate(gameObject);`                |
| `DontDestroyOnLoad(Object target)` | 场景切换时不销毁该对象                           | 常用于单例或管理器类                                     |
| `FindAnyObjectByType<T>()` | 获取任何已加载的指定类型对象（不保证顺序）                 | 替代旧版 `FindObjectOfType`                        |
| `FindFirstObjectByType<T>()` | 获取第一个找到的指定类型对象（可能更快）                  | 常用于初始化查找                                       |
| `FindObjectsByType<T>()`                                              | 获取所有已加载的指定类型对象                        | `var allEnemies = FindObjectsByType<Enemy>();` |
| `Instantiate(Object original)`                                        | 克隆一个对象（创建副本）                          | `Instantiate(prefab);`                         |
| `Instantiate(Object original, Vector3 position, Quaternion rotation)` | 在指定位置和旋转创建克隆                          | `Instantiate(prefab, pos, rot);`               |
| `InstantiateAsync(Object original)` | 异步克隆对象，返回 `AsyncInstantiateOperation` | 用于 Addressables 或大型对象，节省主线程开销                  |

**Operators**

| 操作符 | 描述 |
| - | - |
| `bool` | 是否存在 |
| `operator!=` | 比较两个object是否引用不同的物体 |
| `operator==` | 是否引用相同 |


## Object与资源的关系
几乎所有资源类型（包括预制体、贴图、材质、音频、动画等）都继承自`Object`
```cs
Texture tex = Resources.Load<Texture>("MyTexture");
```
`Resources.Load<T>()`返回的其实就是一个`Object`的子类（这里是Texture）

## 继承关系
```text
Object
  ├── GameObject
  └── Component
        ├── MonoBehaviour
        └── Transform / Collider / Renderer / ...
```
所以可以有：
```cs
GameObject go = new GameObject();
Object obj = go; // legal
Component comp = go.GetComponent<Transform>();
Object o2 = comp; // legal
```
`new`出来的`GameObject`是合法的，但不能`new` `Transform`或`Renderer`，必须用`AddComponent`等引擎API创建
