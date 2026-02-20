---
title: "ScriptedImporter"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Syntax]
author: "ljf12825"
type: blog
summary: Introduction and Usage of ScriptedImporter
---
在Unity中，`ScriptedImporter`是一个非常强大的特性，它允许开发者自定义资源的导入流程。与默认的资源导入器（如图片、模型、音频等）不同，`ScriptedImporter`使开发者可以创建自己的资源类型，并通过代码控制它们在Unity中的导入方式

这个功能对于：
- 自定义数据格式（例如：JSON、YAML、XML、CSV、自定义二进制格式）
- 外部工具导出的数据（如Tiled、Spine、自定义关卡编辑器）
- 自定义配置文件（技能表、怪物表、剧情脚本等）

非常有用

## ScriptedImporter概述
`ScriptedImporter`是Unity提供的一个可扩展导入器基类，可以通过继承它来实现一个支持自定义文件格式的资源导入器，所有继承自`ScriptedImporter`的类都能在Unity导入资源时自动调用对应的逻辑

## 使用方法
1. 创建一个自定义类继承`ScriptedImporter`
2. 使用`[ScriptedImporter(version, extension)]`注册扩展名
3. 重写`OnImportAsset`方法。处理文件内容
4. 使用`AssetImporterContext`注册生成的对象（如ScriptableObject）
5. 将`.youformat`文件放入Assets文件夹，Unity自动导入

## 实例：导入`.myjson`格式为ScriptableObject
假设有一个JSON文件，路径`Assets/Data/monster.myjson`
```json
{
    "name": "Goblin",
    "hp": 100,
    "atk": 25
}
```

创建数据容器类
```cs
using UnityEngine;

[CreateAssetMenu(fileName = "MonsterData", menuName = "MyGame/Monster")]
public class MonsterData : ScriptableObject
{
    public string monsterName;
    public int hp;
    public int atk;
}
```

创建Importer类
```cs
using UnityEditor;
using UnityEditor.AssetImporters;
using UnityEngine;
using System.IO;

[ScriptedImporter(1, "myjson")] // 绑定导入器与文件扩展名
public class MonsterImporter : ScriptableImporter
{
    public override void OnImporterAsset(AssetImportContext ctx)
    {
        string json = File.ReadAllText(ctx.assetPath);
        MonsterRawData raw = JsonUtility.FromJson<MonsterRawData>(json);

        MonsterData asset = ScriptableObject.CreateInstance<MonsterData>();
        asset.monsterName = raw.name;
        asset.hp = raw.hp;
        asset.atk = raw.atk;

        ctx.AddObjectToAsset("main", asset); // 向资源系统注册导入出的子对象
        ctx.SetMainObject(asset);  // 设置主资源对象（Inspector中默认显示的对象）
    }

    [System.Serializable]
    class MonsterRawData
    {
        public stirng name;
        public int hp;
        public int atk;
    }
}
```

使用  
将`monster.myjson`拖到`Assets/Data/`文件夹时，Unity会：
- 自动调用`MonsterImporter`
- 解析JSON
- 创建一个`MonsterData`的ScriptableObject
- 自动将其加入资源系统，并显示在面板中

## ScriptedImporter的高级应用
1. 多文件合成一个资源
将`.animdef`和多个`.frame.png`合成为一个动画资源

2. 可视化工具生成文件 + 自定义Importer自动解析
例如配合Excel -> JSON -> ScriptableObject -> 自动进入Unity的流程

3. 热更新资源标记

4. 支持`.byte`, `.txt`, `.xml`, `.cvs`, `.bin`等任意格式

## 调试
- 导入失败时：
  - 控制台中会显示`OnImportAsset`报错信息
  - 确保`.yourformat`文件的格式正确

- 强制重新导入资源：
  - 右键 -> Reimport

- 更新文件后自动刷新
  - Unity会检测文件变动，自动重新导入
