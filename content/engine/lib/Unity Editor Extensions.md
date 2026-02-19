---
title: "Unity Editor Extensions"
date: 2025-06-01
categories: [Note]
tags: [Unity, Editor, Tool]
author: "ljf12825"
type: blog
summary: class Editor, examples of editor script.
---
Unity编辑器扩展就是用C#编写一些工具或界面，去增强Unity自带的编辑器功能，从而让开发流程更高效、更可控\
它的本质是：利用UnityEditor API在编辑模式下定制Inspector、菜单、窗口、场景视图、资源导入等功能

## 基础概念
- 运行时脚本 vs 编辑器脚本
  - 运行时脚本：放在普通文件夹，打包后在游戏里运行
  - 编辑器脚本：放在`Editor`文件夹下，只在编辑器运行，不会打包进游戏
  - 编辑器脚本需要引用`UnityEditor`命名空间（注意它在运行时不可用）
- 目的
  - 节省重复操作时间（比如批量设置材质、自动生成Prefab）
  - 提供更直观的可视化编辑界面
  - 增强调试能力（自定义日志、场景可视化）

## 常见扩展方式
**自定义Inspector**\
让某个组件在Inspector面板中显示定制的界面

```cs
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(MyComponent))]
public class MyComponentEditor : Editor
{
    public override void OnInspectorGUI()
    {
        var myComp = (MyComponent)target;

        EditorGUILayout.LabelField("自定义字段");
        myComp.health = EditorGUILayout.IntSlider("生命值", myComp.health, 0, 100);

        if (GUILayout.Button("重置生命值")) myComp.health = 100;

        // 如果值改变，标记为脏数据
        if (GUI.changed) EditorUtility.SetDirty(myComp);
    }
}
```

优点：
- 把复杂数据可视化
- 增加按钮、滑条等直接操作数据

**自定义窗口（EditorWindow）**\
可以创建一个独立的工具窗口，比如批量修改工具、关卡生成器

```cs
using UnityEditor;
using UnityEngine;

public class MyToolWindow : EditorWindow
{
    string newName = "Object";

    [MenuItem("Tools/批量改名工具")]
    public static void ShowWindow() => GetWindow<MyToolWindow>("批量改名");

    void OnGUI()
    {
        GUILayout.Label("改名设置", EditorStyles.boldLabel);
        newName = EditorGUILayout.TextField("新名字", newName);

        if (GUILayout.Button("改名选中物体"))
        {
            foreach (var obj in Selection.objects) obj.name = newName;
        }
    }
}
```

**菜单扩展**
在Unity顶部菜单栏或右键菜单添加功能

```cs
[MenuItem("GameObject/重置位置", false, 0)]
static void ResetPosition()
{
    if (Selection.activeTransform != null)
        Selection.activeTransform.position = Vector3.zero;
}
```

- 参数解释
  - 路径`"GameObject/重置位置"`决定菜单位置
  - 第二个参数是是否加到菜单最上面（true为优先）
  - 第三个参数是排序优先级

**SceneView扩展**\
在场景视图中绘制自定义Gizmos或工具按钮

```cs
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(Transform))]
public class TransformGizmo : Editor
{
    void OnSceneGUI()
    {
        Handles.Label(((Transform)target).position + Vector3.up * 2, "这是一个提示");
    }
}
```

可以绘制线条、形状、文字等辅助开发

**资源导入扩展（AssetPostprocessor）**
拦截模型、贴图、音频导入过程，自动修改导入设置

```cs
using UnityEditor;

public class MyTextureImporter : AssetPostprocessor
{
    void OnPreprocessTexture()
    {
        var importer = (TextureImporter)assetImporter;
        importer.textureType = TextureImporterType.Sprite;
        importer.mipmapEnabled = false;
    }
}
```

- 适合团队统一资源规划（比如所有贴图都关掉mipmap）

## UnityEditor
`UnityEditor`是Unity提供的一套专门用于编辑器扩展的API，这些类和方法只能在编辑器里运行，不会包含在游戏打包中；所以，所有用到`UnityEditor`的代码，必须放在Editor文件夹下

- `UnityEngine`：运行时API（游戏打包也能用）
- `UnityEditor`：编辑器API（只能在编辑器中使用）

### 核心作用
主要分成五大类功能
1. 自定义Inspector和窗口
- `Editor`：写自定义Inspector的基类
- `EditorWindow`：写独立工具窗口的基类
- `EditorGUILayout`/`EditorGUI`：绘制各种控件（按钮、滑条、文本框等）
- `PropertyDrawer`：为字段/属性写统一的自定义显式

2. 菜单和快捷工具
- `MenuItem`：给Unity顶部菜单栏或右键菜单加功能
- `EditorUtility`：提供一些编辑器辅助功能（弹窗、选择路径、标记对象为Dirty）
- `EditorApplication`：控制编辑器运行，比如监听playMode切换、编译回调

3. 资源与导入
- `AssetDatabase`：操作资源（创建、删除、移动、加载、刷新）
- `AssetPostprocessor`：拦截资源导入事件（模型、材质、贴图、音频等）
- `PrefabUtility`：处理Prefab（应用修改、还原、实例化）

4. 场景与物体操作
- `Handles`：在Scene视图中绘制辅助线、按钮、文本
- `SceneView`：扩展场景视图，监听事件或绘制GUI
- `Selection`：获取/设置当前选中的对象
- `EditorSceneManager`：控制场景的保存、打开、新建

5. 调试与分析
- `EditorGUIUtility`：常用UI工具，比如加载内置图标
- `Profiler`：性能分析相关API（部分在UnityEditor下）
- `Debug`：（即在UnityEngine也在UnityEditor，有编辑器专用功能）

### 注意事项
1. 不要在运行时脚本里因哟个UnityEditor，否则打包错误
  - 正确做法：把编辑器脚本放到`Editor/`文件夹
  - 或者用`#if UNITY_EDITOR...#endif`包裹
2. 编辑器API不能在游戏运行时使用，比如`AssetDatabase.LoadAssetAtPath`打包后无效
3. 一般项目里会把编辑器扩展集中到
  - `Assets/Editor/`
  - 或者做成Unity Package的`Editor`文件夹

## SerializedObject / SerializedProperty
在自定义Inspector的时候，通常会写类似这样的代码
```cs
var myComp = (MyComponent)target;
myComp.health = EditorGUILayout.IntField("生命值", myComp.health);
```
这样确实能显式和修改数值，但有几个严重问题
- 不支持Undo/Redo（撤销/重做功能会失效）
- 不支持多对象编辑（一次选中多个物体时，只会修改一个）
- 不保证序列化（有些数据Unity不会正确保存到磁盘）

为了解决这些问题，Unity提供了序列化编辑API
- SerializedObject：代表一个序列化的对象（通常是`MonoBehaviour`、`ScriptableObject`等）
- SerializedProperty：代表这个对象中的某个序列化字段

### 核心概念

| 类/方法                        | 作用                                         |
| --------------------------- | ------------------------------------------ |
| `SerializedObject`          | 打开 Unity 对象的序列化数据流，可同时针对多个对象               |
| `SerializedProperty`        | 访问 SerializedObject 内的字段                   |
| `ApplyModifiedProperties()` | 将修改写回对象，并触发 Undo/Prefab 系统                 |
| `Update()`                  | 刷新 SerializedObject，如果对象在外部被修改过，需要先 Update |
| `OnValidate()`              | MonoBehaviour 回调，确保数据合法性（如 Range）          |

> 通过`SerializedProperty`修改数据不会走属性setter，因此需要在`OnValidate()`或其他地方做数据校验

### SerializedObject
`SerializedObject`就是把一个Unity对象包装成可序列化的版本
```cs
SerializedObject so = new SerializedObject(target);
```
- `target`一般是`MonoBehaviour`或`ScriptableObject`

### SerializedProperty
`SerializedProperty`是对单个字段的包装
```cs
SerializedProperty healthProp = so.FindProperty("health");
```
关键点：这里用的是字符串名字（字段名必须是`public`或`[SerializeField]`）\
然后用`EditorGUILayout.PropertyField`绘制
```cs
EditorGUILayout.PropertyField(healthProp, new GUIContent("生命值"));
```

### 示例
假设有一个脚本
```cs
public class MyComponent : MonoBehaviour
{
    public int health = 20;
    [SerializeField] private string playerName = "Hero";
}
```
对应的自定义Inspector
```cs
using UnityEditor;
using UnityEngnine;

[CustomEditor(typeof(MyComponent))]
public class MyComponentEditor : Editor
{
    SerializedObject so;
    SerializedProperty healthProp;
    SerializedProperty nameProp;

    void OnEnable()
    {
        so = new SerializedObject(target); // 包装目标对象
        healthProp = so.FindProperty("health");
        nameProp = so.FindProperty("playerName");
    }

    public override void OnInspectorGUI()
    {
        so.Update(); // 必须，包装数据最新

        EditorGUILayout.PropertyField(healthProp);
        EditorGUILayout.PropertyField(nameProp);

        if (GUILayout.Button("重置生命值"))
            healthProp.intValue = 100; // 修改属性
        
        so.ApplyModifiedProperties(); // 必须，应用修改
    }
}
```
这样做的好处
- Unity自动支持Undo/Redo
- 多选对象时，Unity会正确处理
- 支持Prefab override（预制体差异化显式）

### 注意事项
1. 多对象编辑
  - `SerializedObject`可以针对多个对象
  - 读取`SerializedProperty`的值只会返回第一个对象的值，赋值会应用到所有对象

2. 独立数据流
  - 两个`SerializedObject`实例只想同一个目标对象时，数据流是独立的
  - 如果跨多帧保存，需要手动调用`Update()`同步

3. Undo与Prefab
  - 使用`SerializedObject`自动支持Undo系统
  - 支持Inspector的Prefab override样式

4. 字段合法性
  - 属性setter不会生效
  - Range、Clamp等需要在`OnValidate()`中处理

## EditorGUILayout vs GUILayout
1. GUILayout
  - 命名空间：`UnityEngine`
  - 用途：运行时（Runtime）或编辑器（Editor）中动态布局的GUI
  - 特性：
    - 自动布局控件（自动排列，不需要自己计算位置）
    - 可在`OnGUI()`中使用
    - 支持按钮、标签、文本框、滑动条等控件
  - 常用场景：工具窗口、运行时调试界面、游戏内GUI
```cs
void OnGUI()
{
    GUILayout.Label("Hello World!");
    if (GUILayout.Button("Click Me"))
        Debug.Log("Button clicked!");
    GUILayout.TextField("Input here");
}
```

2. EditorGUILayout
  - 命名空间：`UnityEditor`
  - 用途：专门用于自定义Inspector和编辑器窗口
  - 特性：
    - 可以直接绑定`SerializedProperty`，自动支持Undo、Prefab、Inspector刷新
    - 自动生成字段UI（包括对象引用、枚举、数组等）
    - 自动处理类型（int, float, Vector3, Color, Object等）
  - 常用场景：自定义Inspector、自定义EditorWindow、Editor Tools
  
```cs
using UnityEngine;
using UnityEditor;

[CustomEditor(typeof(MyComponent))]
public class MyComponentEditor : Editor
{
    SerializedProperty speedProp;

    void OnEnable() => speedProp = serializedObject.FindProperty("speed");

    public override void OnInspectorGUI()
    {
        serializedObject.Update();

        EditorGUILayout.PropertyField(speedProp); // 自动绘制 Inspector组件

        if (GUILayout.Button("Reset Speed")) // EditorGUILayout 和 GUILayout都能用
            speedProp.floatValue = 0;
        
        serializedObject.ApplyModifiedProperties();
    }
}
```

| 特性                    | GUILayout                       | EditorGUILayout                                    |
| --------------------- | ------------------------------- | -------------------------------------------------- |
| 所属命名空间                | `UnityEngine`                   | `UnityEditor`                                      |
| 使用场景                  | Runtime 或 Editor GUI            | 编辑器 Inspector / EditorWindow                       |
| 支持 SerializedProperty | 直接绑定字段，需要手动操作                 | 自动绑定 SerializedProperty，支持 Undo & Prefab         |
| 布局方式                  | 自动布局                            | 自动布局                                               |
| 控件类型                  | Button、Label、TextField、Slider 等 | PropertyField、ObjectField、EnumPopup、Vector3Field 等 |
| Undo/Inspector 自动刷新   | no                               | yes                                                |

核心点：`EditorGUILayout`是为编辑器量身定制的`GUILayout`，它的优势在于可以直接操作`SerializedProperty`，同时支持Undo、Prefab、Inspector自动刷新等功能

### 使用关系
- EditorGUILayour基于GUILayout
实际上，EditorGUILayout内部也使用了GUILayout的布局系统，只是在它的控件上增加了对`SerializedProerty`和编辑器特性的支持
- 混合使用
  - 可以在自定义Inspector或EditorWindow中同时使用`GUILayout`和`EditorGUILayout`
  - 一般建议
    - 需要显示`SerializedProperty`用EditorGUILayout
    - 仅做按钮或简单控件GUILayout也可以

## Undo.RecordObject

## Editor Coroutines

--- 

完全没错，`UnityEditor` 绝对是一个 **庞大而深入的主题**，可以说它本身就是 **Unity 编辑器扩展的核心**，涉及的内容从基础到高级，范围非常广。我们可以把它拆解开来更系统地理解。

---

## `UnityEditor` 的本质

* **命名空间**：`UnityEditor`（只能在 Editor 环境下使用，不能打包到游戏运行时）
* **功能**：

  1. 自定义 Inspector 界面。
  2. 自定义 Editor 窗口。
  3. 创建菜单、工具条按钮。
  4. 操作资源、Prefab、场景。
  5. 扩展 Unity 编辑器功能（如自动化处理、批量修改、调试工具）。
* **核心思想**：把 Unity 自带编辑器功能开放给开发者，让你能通过代码 **定制编辑器行为**。

---

## 核心模块

1. **Editor 类与 CustomEditor**

   * `Editor`：用于自定义 Inspector。
   * `[CustomEditor(typeof(MyComponent))]`：绑定你想自定义的组件。
   * 核心方法：

     * `OnInspectorGUI()`：绘制 Inspector UI。
     * `serializedObject` + `SerializedProperty`：安全修改组件字段。

2. **EditorWindow**

   * 自定义窗口（可以挂在 Unity 窗口系统里）。
   * 核心方法：

     * `OnGUI()`：绘制窗口 UI。
     * `Show()` / `GetWindow<>()`：打开窗口。
   * 可用于做工具、调试面板、批量操作面板。

3. **GUILayout / EditorGUILayout**

   * 自动布局的 GUI 系统。
   * EditorGUILayout 是专门支持 Inspector 的高级封装。

4. **MenuItem & 工具栏扩展**

   * `[MenuItem("Tools/MyTool")]`：自定义菜单。
   * 可以调用你的 EditorWindow 或工具逻辑。
   * 支持快捷键。

5. **Scene 交互**

   * `Handles`：在 Scene 视图中绘制可交互控件（如拖动 gizmo）。
   * `EditorGUI` / `EditorGUILayout` 用于 Inspector，`Handles` 用于 Scene。

6. **Asset / Prefab / Project 操作**

   * `AssetDatabase`：操作资源、导入、创建、重命名、删除。
   * `PrefabUtility`：操作 Prefab 连接、替换、实例化。
   * `EditorSceneManager`：操作场景（打开、保存、加载）。

7. **调试与自动化**

   * `Debug`：编辑器内调试。
   * `EditorApplication`：监听编辑器生命周期事件（如更新、播放模式切换）。
   * 可做自动化批量处理（例如批量设置组件属性、生成资源、处理场景数据）。

---

## 使用层次感

可以把 UnityEditor 理解成三层：

```
UnityEditor
 ├─ Editor 类体系 → Inspector 自定义
 ├─ EditorWindow → 工具面板、独立窗口
 ├─ 编辑器 API → AssetDatabase, PrefabUtility, SceneManager, Handles
 └─ GUI 系统 → EditorGUILayout, EditorGUI, GUILayout
```

> 核心逻辑：**Editor 类控制 Inspector，EditorWindow 控制独立窗口，GUI 绘制工具（GUILayout / EditorGUILayout / Handles）显示 UI，其他 API 操作资源和场景。**

---

## 学习建议

1. **先从 Editor 与 Inspector 自定义入手**

   * 学会 `SerializedObject` + `SerializedProperty`，画出组件 Inspector。
2. **进阶 EditorWindow**

   * 写独立工具，熟悉 GUILayout / EditorGUILayout。
3. **Scene 编辑与 Handles**

   * 做可拖拽 gizmo，理解 Scene 交互。
4. **Asset / Prefab / Project 操作**

   * 用 AssetDatabase 和 PrefabUtility 做批量工具。
5. **事件与自动化**

   * EditorApplication 生命周期，自动化工具和调试。

---
