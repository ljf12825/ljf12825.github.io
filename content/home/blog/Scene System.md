---
title: "Scene System"
date: 2025-06-01
categories: [Note]
tags: [Unity, Unity System]
author: "ljf12825"
summary: The concept, use and construction of scenes in Unity
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
#### 构建设置
##### 访问构建设置
构建设置可以通过Unity编辑器的菜单访问：
- `File` -> `Build Settings`

构建设置窗口列出了所有可用的场景、平台选项、打包模式、构建设置等。你可以通过它来管理场景、选择构建平台、设置构建选项

![Build Settings](/images/Blog/BuildSettings.jpg)

##### 场景的添加与移除
在构建设置中，所有需要包含在游戏构建中的场景都必须被添加到场景列表中
- 添加场景：点击`Add Open Scenes`按钮，Unity会将当前打开的场景添加到场景列表中
- 移除场景：点击场景旁边的`-`按钮，移除该场景

场景顺序：场景在构建设置中的顺序很重要。Unity会按顺序加载这些场景，并且默认加载列表中的第一个场景作为游戏启动场景

##### 构建平台选择
Unity支持多个平台的构建，包括PC、Mac、Linux、WebGL、iOS、Android、Console等，可以选择目标平台并进行构建。不同平台可能会有不同的构建要求
- 选择平台：在构建设置窗口中，点击平台名称（例如PC，Mac & Linux Standalone）来选择目标平台
- 平台切换：点击`Switch Platform`按钮来切换目标平台，Unity会根据选择的平台进行相应的调整

##### 场景打包模式
在构建设置中，场景的加载方式分为两种模式：
- Additive
- Single

通常情况下，需要选择不同的加载模式来优化内存管理和加载时间

#### 场景构建与打包优化
##### 资源优化
优化游戏的场景和资源打包时提升游戏性能的重要步骤，以下是常见的优化方法：
- 精简资源：确保每个场景中只包含必要的资源，避免冗余的材质、纹理、音频等
- 静态合批：将场景中的静态物体合并成一个大网格，减少draw call，提升渲染效率
- 光照与阴影：减少场景中动态光源数量，合理使用光照贴图（Lightmaps）来优化性能

##### 场景打包设置
Unity提供了对场景打包的一些设置，帮助你控制场景打包的方式：
- 压缩选项：可以选择是否对场景中的资源进行压缩，通常选择压缩可以减少打包文件的大小
- 场景的内存管理：在构建设置中，你可以选择是否将场景资源分离到不同的资源包中（例如Asset Bundles或Addressables），这样可以减少初始加载时间，并按需加载资源

##### 多平台支持
Unity支持在不同平台上进行构建。你可以针对每个平台选择不同的场景优化策略：
- PC和Mac：通常场景中的资源较大，可以通过压缩和剔除不必要的内容来减小文件体积
- 移动平台：对于移动平台，通常需要更严格的内存管理和性能优化，避免过大的场景和冗余资源
- WebGL：Web平台通常有更严格的内存和资源限制，因此需要优化场景资源，减少加载时间

##### 构建设置中的其他选项
- Player Settings：可以对每个平台的构建进行详细配置，例如分辨率、图形设置、资源加载策略等
- Development Build：启用此选项可以使构建版本包含调试信息，用于开发和调试
- Script Debugging：启用后，可以进行脚本调试，适用于开发阶段


### 场景分块加载
对于大型游戏，特别是开放世界类型的游戏，将场景分割成小的块（Chunk）是非常重要的，这样可以按需加载场景，从而减小内存消耗并提高游戏性能

分块加载场景的优势：
- 按需加载：根据玩家的位置或游戏进度，动态加载和卸载场景
- 减少内存占用：只加载当前玩家需要的场景，减少不必要的内存消耗

#### 如何实现场景分块加载：
1. 将一个大场景拆分成多个小场景（例如，分成多个区域）
2. 使用`SceneManager.LoadScene`或`SceneManger.LoadSceneAsync`按需加载这些小场景
3. 使用`LoadSceneMode.Additive`加载多个场景，而不卸载当前场景

```cs
// 异步加载多个场景
IEnumerator LoadChunksAsync()
{
    AsyncOperation asyncLoad = SceneManager.LoadSceneAsync("Chunk1", LoadSceneMode.Additive);

    while(!asyncLoad.isDone) yield return null;

    asyncLoad = SceneManager.LoadSceneAsync("Chunk2", LoadSceneMode.Additive);

    while (!asyncLoad.isDone) yield return null;
}
```

#### 场景分层管理
通过分层管理来控制场景的加载，主要将游戏内容和UI、背景音乐等资源分离，可以提高场景的加载效率，例如：
- 游戏场景：包含主游戏逻辑、任务、敌人、地形等
- UI场景：包含主菜单、设置、游戏暂停界面等
- 音频场景：音频资源可以独立成一个场景，保证游戏时音效不会受到场景切换的影响


### 触发器加载机制

### Addressable与场景加载
#### Addressable Asset System
Unity的Addressable Asset System是一个非常强大的资源管理和加载系统，可以让你更精确地控制资源的加载、卸载、分发和优化。它可以用于按需加载资源，特别适合大规模场景的动态加载

主要特点：
- 按需加载：通过地址引用来加载资源，而不需要将所有资源打包在场景中
- 优化加载：支持异步加载和缓存优化，减少内存消耗

在构建场景时，可以通过Addressable资源来管理和加载场景文件及资源。例如，可以将场景预先打包为Addressable，并在运行时加载它

示例：
```cs
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

void LoadSceneWithAddressable(string sceneName)
{
    // 使用Addressable加载场景
    AsyncOperationHandle<SceneInstance> handle = Addressables.LoadSceneAsync(sceneName, LoadSceneMode.Additive);

    // 可以监听加载过程
    handle.Completed += (op) => { Debug.Log("Scene Loaded: " + sceneName);};
}
```

#### 场景打包为Addressable
将场景打包为Addressable可以极大地优化场景的加载过程，特别是在资源分发和网络加载时，Unity提供了专门的工具来标记场景为Addressable，并管理它们的加载
1. 在Addressable中创建一个项目条目
2. 通过Asset Bundle管理器，将场景资源标记为`Addressable`
3. 使用异步加载方法来加载场景并优化内存使用



