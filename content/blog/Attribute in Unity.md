---
title: "Attribute in Unity"
date: 2025-06-01
categories: [Note]
tags: [Unity, Syntax]
author: "ljf12825"
summary: The usage and principles of common Attributes in Unity and C#
---
Unity中的特性用于控制Unity编译器的行为，或者用于运行时特定的逻辑

## Unity中常见特性
Unity为许多常见的操作都提供了特性

1. `SerializeField`

- 作用：使私有字段在Unity的Inspector面板中可见。通常用于控制字段访问性，但仍希望它出现在Inspector中进行编辑

```cs
[SerializeField]
private int playerHealth;
```

2. `HideInInspector`

- 作用：标记字段不显示在Inspector中，但它仍然是类的成员，仍然可以在代码中使用

```cs
[HideInInspector]
public int secretValur;
```

3. `Range`

- 作用：为字段设置一个值的范围，通常用于浮动值或整数值。Range会在Inspector中为字段添加一个滑块

```cs
[Range(0, 100)]
public int speed;
```

4. `Head`

- 作用：在Inspector中为字段添加一个标题或标签，通常用于分组和提高可读性

```cs
[Header("Player Settings")]
public float speed;
public int health;
```

5. `Tooltip`

- 作用：在Inspector中为字段提供一个悬浮提示文本，鼠标悬停在字段上时显示该提示

```cs
[Tooltip("Player's health value")]
public float health;
```

6. `ExecuteInEditMode`

- 作用：使脚本在编辑模式下运行，而不仅仅是在播放模式下运行。这对于需要在编辑模式下进行自定义操作的脚本（如编辑器扩展）非常有用

```cs
[ExecuteInEditMode]
public class CustomEditorScript : MonoBehaviour
{
    void Update()
    {
        // 在编辑模式下也会执行
    }
}
```

7. `ContextMenu`

- 作用：为字段或方法添加一个右键菜单选项。在Unity编辑器的Inspector中，右键点击该字段或方法时，可以显示一个上下文菜单，允许快速执行该方法

```cs
[ContextMenu("Reset Health")]
public void ResetHealth()
{
    health = 100;
}
```
8. `FormerlySerializedAs`

- 作用：当字段名称更改后，Unity仍能够反序列化旧的数据，并保持数据的兼容性。适用于字段重命名后仍想保持对旧数据的支持

```cs
[FormerlySerializedAs("oldPlayerHealth")]
[SerializeField]
private int health;
```

9. `DisallowMultipleComponent`

- 作用：防止同一个GameObject上添加多个同类组件。适用于那些只应当存在一个实例的组件，如`Camera`组件

```cs
[DisallowMultipleComponent]
public class MainCamera : MonoBehaviour{}
```

10. `RequireComponent`

- 作用：确保在同一个GameObject上附加这个脚本时，自动添加指定的组件。如果没有指定的组件，Unity会自动将其添加

```cs
[RequireComponent(typeof(Rigidbody))]
public class Player : MonoBehaviour {}
```

11. `HideFlags`

- 作用：控制一个对象在Hierarchy面板、Inspector面板中的显示行为。可以设置为隐藏对象（例如，场景中的某些对象可能只用于逻辑，不需要再编辑器中显示）

```cs
gameObject.hideFlags = HideFlags.HideInHierarchy;
```

12. `MenuItem`

- 作用：在Unity的顶部菜单中添加自定义菜单项，点击该菜单项可以执行自定义代码

```cs
[MenuItem("Tools/Custom Action")]
public static void CustomAction() => Debug.Log("Custom action executed!");
```

13.`Obsolete`

- 作用：标记一个方法或类为过时的，通常会在Unity中显示警告消息，提示开发者不要再使用该方法或类

```cs
[Obsolete("This method is obsolete. Use NewMethod() instead.")]
public void OldMethod() {}
```


