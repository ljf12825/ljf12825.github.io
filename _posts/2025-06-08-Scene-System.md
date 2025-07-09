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


### 加载场景（Additive 和 Single）
- `Additive`加载：将新场景加载到现有场景中，保持当前场景不变

`Additive`加载意味着将一个新场景加载到现有场景的基础上，当前场景不会被卸载，而是与新场景一起共存。使用这种方式可以让多个场景并行运行，从而实现一些复杂的场景管理，例如分割大型场景，或者在后台加载新的场景内容

使用场景：

- 动态加载关卡：例如一个开放世界游戏，场景可以按需加载。加载一个新的区域时，现有区域不会被卸载
- UI 和游戏分离：UI 可以作为一个单独的场景加载并保持活跃，而游戏逻辑场景则可以独立运行
- 多人游戏：在多人游戏中，玩家可能在多个子场景中互动，Additive 加载可以实现多个玩家在多个区域间的无缝切换

```cs
// Additive
SceneManager.LoadScene("NewScene", LoadSceneMode.Additive);
```

- `Single`加载：加载一个新场景并卸载当前场景

`Single`加载模式表示加载一个新场景并卸载当前的场景。这是传统的场景切换方式，通常用于当你需要完全切换到另一个场景时

使用场景：
- 关卡切换：当玩家从一个关卡进入另一个关卡时，Single 加载通常是最常用的方式
- 游戏状态管理：如果你的游戏有明确的关卡结构或状态，切换到新场景时，可以使用 Single 模式来清空当前场景，加载一个全新的游戏状态

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

### 多场景加载的复杂性和管理
在使用`Additive`加载时，场景之间的资源管理尤为重要。不同场景之间共享资源，可能会导致以下问题：
- 资源冲突：多个场景中可能会使用相同的资源（如材质、纹理、音效等），如果没有适当的管理，可能会发生资源覆盖或重复加载
- 性能瓶颈：加载多个场景会增加内存使用量，尤其是在大型场景中。如果不及时卸载不需要的场景，可能会导致性能下降

**避免场景间资源冲突**  
1. 资源打包：利用Unity的资源打包系统（例如Asset Bundles或Addressables），可以让每个场景只加载所需的资源，避免多个场景之间的资源冲突

2. 场景划分与依赖管理：避免场景间有过强的依赖关系。例如，将游戏逻辑与UI、背景和音效分开，确保每个场景只包含特定职责的内容

3. 共享资源：通过`DontDestroyOnLoad`来管理那些需要跨场景的共享资源（如音频管理器、玩家数据管理器等）

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

- 场景切换动画：为了避免切换场景时的黑屏，你可以在场景切换之前播放一个加载动画或者过渡动画

### 异步加载场景
#### 为什么使用异步加载
异步加载允许你在场景加载的过程中保持游戏的流畅运行。异步加载时，Unity会在后台加载场景，不会阻塞主线程，因此可以避免游戏界面卡顿或掉帧  
异步加载常用于：
- 避免卡顿：在加载大型场景或资源时，异步加载可以有效减少游戏界面卡顿的现象
- 展示加载进度：可以展示进度条或者加载动画，提升用户体验

#### 异步加载基础
通过`SceneManager.LoadSceneAsync`可以异步加载场景，可以使用`AsyncOperation`对象来监控加载进度

**示例：**
```cs
IEnumerator LoadSceneAsync(string sceneName)
{
    // 异步加载场景
    AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName);

    // 等待场景加载完成
    while (!asyncLoad.isDone)
    {
        // 显示加载进度
        float progress = Mathf.Clamp01(asyncLoad.progress / 0.9f); // 进度值[0, 1]
        Debug.Log("Loading progress: " + progress);

        // 可以在这里更新进度条UI

        yield return null; // 每帧执行
    }
}
```

#### `async`和`await`异步加载
Unity在2017之后对C#的异步功能支持更好，支持使用`async`和`await`来简化异步操作。你可以将异步加载过程包装成一个异步方法，从而避免繁琐的协程逻辑
```cs
saync Task LoadSceneAsync(string sceneName)
{
    AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName);

    // 等待加载完成
    while (!asyncLoad.isDone)
    {
        float progress = Mathf.Clamp01(asyncLoad.progress / 0.9f);
        Debug.Log("Loading progress: " + progress);
        await Task.Yield(); // 等待下一帧
    }
}
```

#### 资源顺序加载
有时候，我们希望保证某些资源或场景按特定顺序加载，或者在某些资源完全加载后才能加载其他资源。使用异步加载时，`async`和`await`可以让你控制加载的顺序
```cs
async Task LoadSceneInOrider()
{
    // 加载第一个场景
    await LoadSceneAsync("Scene1");

    // 加载第二个场景
    await LoadSceneAsync("Scene2");

    // 继续加载其他资源
}
```

#### 避免资源加载顺序问题
确保在加载多个场景时，场景中的资源顺序正确。对于大型场景或者有依赖关系的资源，可以使用`Addressables`系统来更细粒度地控制资源的加载顺序

#### 资源优化
异步加载场景和资源时，性能优化是非常重要的。可以使用以下方法：
- 使用`async`和`await`配合加载不同类型的资源：例如先加载场景，然后在后台加载音频、纹理等资源
- 场景切换前缓冲资源：提前加载必要的资源，避免在切换场景时发生卡顿
- 分步加载资源：不必一次性加载所有资源，可以分批次地进行加载，确保用户界面的流畅性


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
`SceneManager`是Unity中用来管理场景加载、卸载和切换的一个类。它提供了许多用于操作场景的方法，比如异步加载场景、场景之间切换、场景的同步加载、查询场景信息等。

`SceneManager`是`UnityEngine.SceneManagement`命名空间的一部分

#### 常用API
##### 加载场景
- 加载单一场景

`SceneManager.LoadScene`用于加载指定的场景
```cs
SceneManager.LoadScene("SceneName");
```

- 异步加载场景

异步加载场景是为了避免在加载时阻塞主线程，可以提高游戏体验
```cs
AsyncOperation asyncOp = SceneManager.LoadSceneAsync("SceneName");
```

异步加载场景时，可以通过`AsyncOperation`对象来获取加载进度，甚至可以控制场景是否在加载完成后自动激活
```cs
asyncOp.allowSceneActivation = false; // 控制场景是否自动激活
```

##### 卸载场景
- 卸载当前场景

`SceneManager.UnloadSceneAsync`用于卸载一个场景，通常用于切换场景时
```cs
SceneManager.UnloadSceneAsync("SceneName");
```

这个方法是异步的，因此可以在后台卸载场景，不会影响游戏的运行

##### 获取当前场景
- 获取当前激活的场景

`SceneManager.GetActiveScene`用于获取当前激活的场景，返回的是一个`Scene`对象
```cs
Scene currentScene = SceneManager.GetActiveScene();
```

可以通过`Scene`对象获取场景的名称、路径、索引等信息
```cs
string sceneName = currentScene.name;
```

##### 场景切换
- 加载多个场景

可以使用`SceneManager.LoadScene`来加载多个场景，这对于一些需要同时存在多个场景的情况（如多人联机或大场景加载）非常有用
```cs
SceneManager.LoadScene("Scene1", LoadSceneMode.Additive); // 加载一个附加场景
```
通过`LoadSceneMode.Additive`，新的场景会叠加到现有场景上

- 切换场景

如果你要切换到一个新的场景并卸载当前场景，可以在加载新场景时使用`LoadSceneMode.Single`，它会在加载新场景的同时卸载当前场景
```cs
SceneManager.LoadScene("NewScene", LoadSceneMode.Single);
```
##### 场景索引
可以通过`Scene`对象来查询更多关于场景的信息：
- 获取场景的名称
```cs
string sceneName = currentScene.name
```

- 获取场景的索引
```cs
int sceneIndex = currentScene.buildIndex
```

- 获取场景的根游戏对象
```cs
GameObject[] rootObjects = currentScene.GetRootGameObjects();
```

##### 事件和回调
Unity提供了一些事件和回调来监听场景加载的状态

- `SceneManager.sceneLoaded`事件

这个事件会在场景加载完成时触发，你可以通过订阅这个事件来执行场景加载后的操作

```cs
SceneManger.sceneLoaded += OnSceneLoaded;

void OnSceneLoaded(Scene scene, LoadSceneMode mode)
{
    Debug.Log("Scene " + scene.name + " loaded.");
}
```

- `SceneManager.sceneUnloaded`事件

这个事件会在场景卸载时触发
```cs
SceneManager.sceneUnloaded += OnSceneUnloaded;

void OnSceneUnloaded(Scene scene) => Debug.Log("Scene " + scene.name + " unloaded.");
```

[UnityScripting SceneManager](https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.html)

### DontDestroyOnLoad
`DontDestroyOnLoad`是Unity中一个非常使用的函数，它可以将某个对象在加载新场景时保持不被销毁。这对于需要在多个场景间共享的对象（如音频管理器、玩家数据等）非常有用

1.基本使用

通过`DontDestroyOnLoad`，你可以使一个游戏对象在场景切换时不被销毁。当你加载一个新场景时，默认情况下，当前场景中所有对象都会被卸载。但如果某个对象调用了`DontDestroyOnLoad`，它就会被保留，直到手动销毁它

```cs
void Start() => DontDestroyOnLoad(gameObject); // 保持这个对象不被销毁
```

2.适用场景

`DontDestroyOnLoad`通常适用于以下情况：
- 音频管理器：游戏中有一个音频管理器对象，需要在不同场景之间共享音乐和音效设置。通过`DontDestroyOnLoad`，你可以确保音频管理器在场景切换时不被销毁
- 玩家数据：例如，玩家的得分、背包内容、任务进度等需要在多个场景之间保持一致。在这种情况下，你可以将数据存储在一个不销毁的对象中
- 全局控制器：如果你有一个控制器或管理器（例如游戏状态控制器、广告管理器等），这些也可以通过`DontDestroyOnLoad`保持跨场景存在

3.注意事项

**可能引起的问题**
- 对象重复创建：`DontDestroyOnLoad`会让对象保持在所有场景之间。但是，如果在多个场景中分别创建了同样的对象，这可能会导致重复的对象。例如，如果你在一个场景中已经有一个音频管理器，并且在加载另一个场景时有创建了一个新的音频管理器，结果可能时两个音频管理器同时存在。为了避免这种情况，需要确保只有一个对象调用了`DontDestroyOnLoad`

解决办法：通常做法是在脚本中加上一个检查，确保只有第一个创建的对象调用`DontDestroyOnLoad`，而其他对象则销毁自己
```cs
void Start()
{
    if (FindObjectsOfType(typeof(MyManager)).Length > 1)
        Destroy(gameObject); // 如果场景中已经有一个该类型的对象，销毁当前对象
    
    else DontDestroyOnLoad(gameObject); // 否则保留该对象
}
```

**使用`DontDestroyOnLoad`时的对象管理**
- 生命周期管理：虽然`DontDestroyOnLoad`防止对象在场景切换时销毁，但它并不会阻止对象在运行时被销毁，如果想在特定时刻销毁该对象，需要手动调用`Destroy()`


**跨场景对象命名问题**
`DontDestroyOnLoad`对象仍然存在于内存中，因此你需要特别注意它们的名字。为了避免在多个场景中有相同名称的对象，通常可以将`DontDestroyOnLoad`对象的名称修改为唯一的标识符
```cs
void Start()
{
    if (FindObjectOfType<MyManager>() == null)
    {
        gameObject.name = "UniqueManager";
        DontDestroyOnLoad(gameObject);
    }
    else Destroy(gameObject);
}
```

#### 底层实现（推测）
Unity的底层实现并没有公开`DontDestroyOnLoad`的具体源码，但我们可以推测它的工作原理基于以下几个步骤：
- 场景对象管理器：当Unity进行场景切换时，它会遍历场景中的所有对象，并将标记为`DontDestroyOnLoad`的对象移除场景的管理队列
- 全局管理容器：这些标记为不销毁的对象会被一如一个全局的容器中，保持在内存中，直到程序结束或手动销毁这些对象
- 不被卸载：这些对象的生命周期与当前场景无关，它们会在Unity的内部管理中维持直到销毁


### 场景打包与构建设置

### 场景分块加载

### 触发器加载机制

### Addressable + Scene Loading

### 性能优化

