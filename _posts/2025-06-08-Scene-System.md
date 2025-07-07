---
title: "Scene System"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
permalink: /posts/2025-06-08-Scene-System/
---
Unity Scene System是Unity中用于组织和管理游戏世界的基础结构，Unity支持多个Scene的加载与卸载，允许构建出大型、分块化的世界

## Scene
Scene是Unity游戏项目中的一个基础构建单元，它就像游戏世界中的一个“地图”或“关卡”，一个Scene就是一个逻辑/物理空间的容器，包含了：
- GameObject
- 地形、UI、声音
- 脚本、组件
- 光照信息、烘焙数据等

在Unity中，一个Scene对应一个`.unity`文件

### Scene 生命周期
1.创建或打开场景（`.unity`文件）

2.布置场景内容

3.保存场景

4.构建和加载场景（Build Settings里添加场景）

5.运行时加载和卸载场景

### 场景最佳实践
- 保持每个场景的职责单一（比如UI与游戏逻辑分离）
- 使用Prefab来管理重复对象
- 使用场景加载器或管理器来控制场景切换和数据传递
- 合理使用DontDestroyOnLoad来跨场景保存数据或对象

## Multi Scene
多场景允许你同时加载和管理多个场景，不同场景可以同时存在并且运行在游戏中，允许你灵活地处理加载、切换和卸载场景的需求

1. 加载和卸载场景
- Additive加载：可以在现有场景的基础上加载新的场景，这种方式不会卸载当前场景，而是将多个场景叠加在一起
- Single加载：可以将一个场景替换当前场景，这种方式会卸载当前场景并加载新的场景

2. 常见的多场景应用场景
- 主菜单 + 游戏场景：主菜单和游戏场景可以同时加载，用户操作菜单时，游戏场景依然在后台运行
- 动态加载关卡：可以根据游戏的进度或玩家行为动态加载或卸载不同的场景，比如一个大世界分为多个小场景，按需加载
- UI和游戏场景分离：UI可以独立于游戏场景加载，确保UI始终可用，而不受游戏场景加载状态的影响

3. 如何使用多场景
### 加载场景（Additive 和 Single）
- Additive加载：将新场景加载到现有场景中，保持当前场景不变
```cs
// Additive
SceneManager.LoadScene("NewScene", LoadSceneMode.Additive);
```

- Single加载：加载一个新场景并卸载当前场景
```cs
// 加载场景（Single）
SceneManager.LoadScene("NewScene", LoadSceneMode.Single);
```

### 卸载场景  
如果你使用了`Additive`加载多个场景，可以选择卸载某个场景
```cs
// 卸载场景
SceneManager.UnloadSceneAsync("OldScene");
```

### 切换场景并保持场景之间的交互
使用多场景时，有时候你希望不同的场景之间可以交互。比如，可以在一个场景中控制另一个场景中的对象。  
可以通过`SceneManager.GetSceneByName`或`SceneManager.GetSceneAt`获取其他加载的场景，然后通过`Scene.GetRootGameObjects()`获取该场景中的所有根级对象，进一步操作它们

```cs
// 获取其他场景的根物体
Scene otherScene = SceneManager.GetSceneByName("OtherScene");
GameObject[] rootObjects = otherScene.GetRootGameObjects();

// 操作场景中的物体
foreach (GameObject obj in rootObjects) obj.SetActive(false); // 隐藏物体
```

### 场景加载优化
- 异步加载：如果场景很大，加载时可能会卡顿，可以使用异步加载来平滑过渡：

```cs
// 异步加载场景
IEnumerator LoadSceneAsync(string sceneName)
{
    AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Additive);

    while(!asyncLoad.isDone)
    {
        // 可以在这里显示加载进度条
        yield return null;
    }
}
```
- 场景切换动画：为了避免切换场景时的黑屏，你可以在场景切换之前播放一个加载动画或者过渡动画

### 多场景注意事项
- 场景间的依赖：确保每个场景的独立性。如果一个场景依赖于另一个场景中的对象，加载时可能会出现问题，特别是在异步加载时
- 内存管理：加载多个场景会消耗更多内存，尤其是大型场景。确保合理管理内存，及时卸载不再需要的场景

### 实例：多场景管理器
可以创建一个管理多个场景加载的系统
```cs
using UnityEngine;
using UnityEngine.SceneManagement;

public class MultiSceneManager : MonoBehaviour
{
    public string mainScene = "MainScene";
    public string uiScene = "UIScene";

    void Start()
    {
        // 加载主场景和UI场景
        LoadMainScene();
        LoadUIScene();
    }

    public void LoadMainScene() => SceneManager.LoadScene(mainScene, LoadSceneMode.Additive);

    public void LoadUIScene() => SceneManager.LoadScene(uiScene, LoadSceneMode.Additive);

    public void UnloadMainScene() => SceneManager.UnloadSceneAsync(mainScene);

    public void UnloadUIScene() => SceneManager.UnloadSceneAsync(uiScene);
}
```

### SceneManager

### 加载与切换场景

### Additive Load

### 多场景编辑工作流

### 场景打包与构建设置

### 场景分块加载

### 触发器加载机制

### Addressable + Scene Loading

### 性能优化

