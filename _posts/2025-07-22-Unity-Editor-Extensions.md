---
title: "Unity Editor Extensions"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Editor, Tool]
author: "ljf12825"
permalink: /posts/2025-07-22-Unity-Editor-Extensions/
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
1. 自定义Inspector
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

2. 自定义窗口（EditorWindow）
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

3. 菜单扩展
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

4. SceneView扩展
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

5. 资源导入扩展（AssetPostprocessor）
拦截模型、贴图、音频导入过程，自动修改导入设置
```cs
using UnityEditor;

public class MyTextureImporter : AssetPostprocessor
{
    void OnPreprocessTexture()
    {
        var importer = (TextureImporter)assetImporter;
        importer.textureType = TExtureImporterType.Sprite;
        importer.mipmapEnabled = false;
    }
}
```
- 适合团队统一资源规划（比如所有贴图都关掉mipmap）