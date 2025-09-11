---
title: "Assets Import and Load"
date: 2025-06-01
categories: [Note]
tags: [Unity, Asset]
author: "ljf12825"
summary: Unity assets and resources management system(Resources folder, Asset Bundles and Addressables)
---
如何将外部资源导入到Unity中并在运行时使用

## 资源导入
资源导入是指Unity将外部资源文件（如.fbx、.png、.mp3等）转换为引擎可以使用的内部格式。导入过程不仅包括将资源放入Unity项目中，还涉及到Unity如何优化、压缩、管理这些资源

### 资源导入的关键步骤
- 文件放置：在资源文件中放入Unity项目的`Assets`文件中。Unity会自动检测到这些文件，并开始导入流程
- 导入设置：在Inspector面板中，选中资源文件后，可以看到不同类型资源的导入设置（如`Texture Type`、`Model Import Settings`等）。不同的资源类型有不同的设置，影响最终的导入结果
  - 对于纹理，可以设置纹理的类型（如2D或Sprite），以及压缩选项（如DXT1、DXT5等）
  - 对于模型，可以设置模型的网格、骨骼、动画等导入选项
  - 对于音频，可以设置压缩类型、采样率等
- 资源优化：Unity会根据导入设置自动处理资源，可能会进行压缩、网格简化、生成多种LOD等优化操作
- Meta文件：Unity会为每个导入的资源创建一个`.meta`文件，用于保存资源的设置、ID等信息。这个文件对资源管理非常重要，尤其是在团队协作时，避免丢失资源链接

### 常见的资源类型导入
- 纹理（Texture）：Unity会自动识别常见的纹理文件类型，并提供压缩、过滤等选项
  详见[Texture 导入]({{site.baseurl}}/posts/2025-06-29-Texture/)

- 模型（Models）：Unity支持多种3D模型格式，尤其是`.fbx`，并支持自动生成碰撞体、网格和骨骼动画
  详见[Model]({{site.baseurl}}/posts/2025-06-07-Model/)

- 音频（Audio）：音频文件支持不同的压缩格式，可以设置为单声道、立体声等
  详见[Audio System]({{site.baseurl}}/posts/2025-06-11-Audio-System/)

- 动画（Animations）：可以通过`Animator`系统来管理和播放
  详见[Animation System]({{site.baseurl}}/posts/2025-06-11-Animation-System/)


## 资源加载
在游戏运行时，如何高效地加载和管理这些已经导入的资源至关重要，尤其是在需要加载大量资源时。Unity提供了多种加载资源的方式，以便优化性能和内存使用

### class Resources
`Resources`类在Unity中提供了一种动态加载资产的方式，允许你访问存储在特定文件夹中的对象，如Texture，Prefab，Audio Clips等。这些文件必须存放在项目中名为“Resources”的文件夹内

#### 存放资产到Resources文件夹
- 希望在运行时动态加载的所有资产必须存放在名为“Resources”的文件夹中。你可以在`Assets`目录下创建多个“Resources”文件夹
- 存放在这些文件夹中的资产不会通过Inspector自动引用，因此Unity无法对它们进行优化，直接包含在最终构建中

#### 加载方式
- `Resources.Load()`和`Resources.FindObjectsOfTypeAll()`函数可以用来加载和访问资产
  - `Resouces.Load()`：按路径加载单个资产
  - `Resouces.FindObjectsOfTypeAll()`：用于查找并访问场景中或`Resources`文件夹下的所有对象
- 使用路径加载资产时，所有存放在`Resources`文件夹中的资产会被纳入构建中，这可能导致构建大小增加

#### 构建优化问题
通常，Unity 会通过 Inspector 暴露对资产的引用，这样在构建时它可以自动计算出哪些资产是实际使用的，从而避免不必要的资源被包含在最终构建中。但如果使用 `Resources` 文件夹，Unity 无法做到这一点，因此所有资产都会被包含在构建中，即使你没有使用它们

#### 不推荐过度使用路径加载
使用路径名来加载资产会导致代码不那么可复用，因为脚本会硬编码依赖于资产存放的位置。这不如通过Inspector暴露的引用直观和易于维护

#### 使用场景
在一些情况下，直接通过代码加载资产会更方便，特别是在你需要在运行时生成对象时。例如，程序化生成一个游戏物体并为其赋予纹理，或者加载动态生成的资源时，使用 Resources.Load() 会非常方便

#### 内存管理
使用 `Resources.Load()` 加载的资产，特别是纹理等资源，可能会占用内存，即使这些实例没有出现在场景中。为了释放内存，可以调用 `Resources.UnloadUnusedAssets()` 来卸载不再使用的资源。
> `Resources`文件夹在创建项目时不会自动生成，需要手动创建这个文件夹才能使用

#### API

| 方法                          | 描述                                                                 |
|-------------------------------|----------------------------------------------------------------------|
| `FindObjectsOfTypeAll`         | 返回当前内存中所有指定类型 `T` 的对象列表。                              |
| `InstanceIDIsValid`            | 如果给定的实例 ID 对应一个有效的对象，则返回 `true`。该对象可能已经被删除或尚未加载到内存中。 |
| `InstanceIDsToValidArray`      | 将实例 ID 数组转换为布尔数组，指示每个实例 ID 是否对应内存中的有效对象。对象可能已删除或未加载。 |
| `InstanceIDToObject`           | 将实例 ID 转换为对象引用。                                           |
| `InstanceIDToObjectList`       | 将实例 ID 数组转换为对象引用列表。                                    |
| `Load`                         | 加载存储在 `Resources` 文件夹路径下的指定类型的资源。                   |
| `LoadAll`                      | 加载 `Resources` 文件夹路径下的文件夹或文件中的所有资源。              |
| `LoadAsync`                    | 异步加载存储在 `Resources` 文件夹路径下的资源。                        |
| `UnloadAsset`                  | 从内存中卸载指定的资源。                                             |
| `UnloadUnusedAssets`           | 卸载未使用的资源，释放内存。                                         |

[Unity Scripting Resources](https://docs.unity3d.com/ScriptReference/Resources.html)

### Asset Bundles
Asset Bundles是Unity的一个资源打包系统，允许开发者将游戏中的资源（如模型、纹理、音频等）打包成一个或多个独立的文件（称为Asset Bundles），以便按需加载。

这种方式适用于大规模资源的管理，尤其是当资源文件较大或需要动态加载时，Asset Bundles提供了比`Resources`文件夹更灵活的资源加载和内存管理方式

#### Asset Bundles的核心概念
- 打包：将游戏资源（如纹理、模型、音频等）打包成独立的文件，以便后期按需加载
- 加载：通过代码加载Asset Bundles中的资源，而不是将所有资源一次性加载到内存中，从而优化内存使用和加载速度
- 卸载：通过代码释放已加载的Asset Bundles资源，确保内存得到有效管理

#### 创建Asset Bundles
创建Asset Bundles的过程涉及将资源打包成独立的文件，这些文件可以在运行时动态加载

打包资源步骤：
1. 设置资源为Asset Bundle：
  在Unity编辑器中，选择资源（如纹理、模型、音频等），在`Inspector`面板中为资源分配一个Asset Bundles名称
  - 在`Inspector`中的`Asset Bundle`选项设置中，给资源指定一个名字，例如：`MyBundle/Textures`
2. 构建Asset Bundles
  使用BuildPipeline API构建 Asset Bundles
  ```cs
  using UnityEditor;
  
  public class AssetBundleBuilder
  {
    [MenuItem("Assets/Build Asset Bundles")]
    static void BuildAllAssetBundles()
    {
      BuildPipeline.BuildAssetBundles("Assets/AssetBundles", BuildAssetBundleOptions.None, BuildTarget.StandaloneWindows);
    }
  }
  ```
  这段代码会将所有标记为Asset Bundle的资源打包到`Assets/Bundles`目录中，并生成适用于Windows平台的Asset Bundle
    - `BuildAssetBundleOptionjs.None`：没有特殊选项，可以根据需要选择不同的选项（例如压缩、增量构建等）
    - `BuildTarget.StandaloneWindows`：指定构建目标平台，可以选择其他平台

3. 输出：
  构建后，Unity会在指定的目录中生成Asset Bundle文件

#### 加载Asset Bundles
在游戏运行时，可以通过以下方式加载和使用Asset Bundles

加载Asset Bundle：
加载Asset Bundle通常是异步的，避免阻塞主线程，保证游戏运行流畅
- 从文件系统加载Asset Bundle
  ```cs
  using UnityEngine;

  public class AssetBundleLoader : MonoBehaviour
  {
    AssetBundle myLoadedAssetBundle;

    void Start()
    {
      // 异步加载 Asset Bundle
      StartCoroutine(LoadAssetBundleAsync("Assets/AssetBundles/MyBundle"));
    }

    IEnumerator LoadAssetBundleAsync(string bundleUrl)
    {
      // 异步加载Asset Bundle
      AssetBundleCreateRequest bundleRequest = AssetBundle.LoadFromFileAsync(bundleUrl);
      yield return bundleRequest;

      myLoadedAssetBundle = bundleRequest.assetBundle;
      if (myLoadedAssetBundle == null)
      {
        Debug.LogError("Failed to load AssetBundle!");
        yield break;
      }

      // 加载资源
      AssetBundleRequest assetRequest = myLoadedAssetBundle.LoadAssetAsync<Texture>("MyTextrue");
      yield reutrn assetRequest;

      Texture texture = assetRequest.asset as Texture;
      // 使用加载的资源

    }
  }
  ```

  - 从URL加载Asset Bundle（适用于远程资源）
  如果Asset Bundle存储在远程服务器上，可以使用`UnityWebRequest`从URL加载资源
  ```cs
  using UnityEngine;
  using UnityEngine.Networking;

  public class AssetBundleRemoteLoader : MonoBehaviour
  {
    AssetBundle myLoadedAssetBundle;

    void Start()
    {
      StartCoroutine(LoadAssetBundleFromURL("http://mycdn.com/assets/MyBundle"));
    }

    IEnumerator LoadAssetBundleFromURL(string url)
    {
      UnityWebRequest www = UnityWebRequestAssetBundle.GetAssetBundle(url);
      yield return www.SendWebRequest();

      if (www.result != UnityWebRequest.Result.Success)
      {
        Debug.LogError("Failed to load AssetBundle from URL!");
        yield break;
      }

      myLoadedAssetBundle = DownloadHandlerAssetBundle.GetContent(www);
      AssetBundleRequest assetRequest = myLoadedAssetBundle.LoadAssetAsync<Texture>("MyTexture");
      yield return assetRequest;

      Texture texture = assetRequest.asset as Texture;
      // 使用加载的资源

    }
  }
  ```

- 加载资源：通过`LoadAssetAsync()`或`LoadAsset()`方法加载Asset Bundle中的资源， `LoadAssetAsync()`更适合异步加载，可以避免阻塞主线程

#### 卸载Asset Bundle
加载后的Asset Bundle和资源可以通过`Unload()`方法释放，以防止内存泄露
- 卸载资源和Asset Bundle
```cs
myLoadAssetBundle.Unload(false);
```
`false`参数意味着只卸载Asset Bundle，不会卸载已经加载的资源。如果设置为`true`，则会卸载资源和Asset Bundle

#### Asset Bundle的优点和缺点
优点：
1. 按需加载：Asset Bundles 允许你将资源分离成不同的包，并且按需加载，这减少了内存的占用，并提高了加载速度。
2. 资源分组和优化：你可以将资源按类型或加载频率进行分组（例如，UI 资源、场景资源、远程资源），并根据需要加载，提高游戏性能。
3. 远程资源加载：Asset Bundles 支持从远程服务器加载资源，非常适合动态内容更新、DLC（可下载内容）和游戏数据包的分发。
4. 平台兼容性：你可以为不同的平台（Windows、Android、iOS）构建不同的 Asset Bundle，确保在不同平台上使用合适的资源格式。

缺点：
1. 管理复杂：随着游戏项目变得越来越大，Asset Bundles 的管理和维护可能变得更加复杂。你需要合理分配资源、管理多个 Asset Bundle、确保版本一致性等。
2. 版本控制：由于 Asset Bundles 是外部资源包，Unity 并不直接将它们与项目文件一起进行版本控制。你需要单独管理 Asset Bundles 的版本和依赖关系。
3. 构建时间：Asset Bundles 构建过程可能需要一些时间，尤其是当项目包含大量资源时。
4. 缓存管理：在远程加载资源时，可能会遇到缓存问题，需要合理设置 CDN 或服务器端的缓存策略，确保资源的最新版本被加载。

#### API
**Static Properties**

| Property        | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `memoryBudgetKB`| 控制共享的 AssetBundle 加载缓存的大小，默认值为 1MB。                          |

**Properties**

| Property                     | Description                              |
| ---------------------------- | ---------------------------------------- |
| `isStreamedSceneAssetBundle` | 如果 AssetBundle 包含 Unity 场景文件，则返回 `true`。 |

**Public Methods**

| Method                        | Description                 |
| ----------------------------- | --------------------------- |
| `Contains`                    | 检查 AssetBundle 是否包含特定的对象。   |
| `GetAllAssetNames`            | 返回 AssetBundle 中所有资源的名称。    |
| `GetAllScenePaths`            | 返回 AssetBundle 中所有场景的路径。    |
| `LoadAllAssets`               | 同步加载 AssetBundle 中包含的所有资源。  |
| `LoadAllAssetsAsync`          | 异步加载 AssetBundle 中包含的所有资源。  |
| `LoadAsset`                   | 同步加载 AssetBundle 中的某个资源。    |
| `LoadAssetAsync`              | 异步加载 AssetBundle 中的某个资源。    |
| `LoadAssetWithSubAssets`      | 同步加载 AssetBundle 中的资源及其子资源。 |
| `LoadAssetWithSubAssetsAsync` | 异步加载 AssetBundle 中的资源及其子资源。 |
| `Unload`                      | 卸载 AssetBundle，释放其占用的数据。    |
| `UnloadAsync`                 | 异步卸载 AssetBundle 中的资源。      |

**Static Methods**

| Method                       | Description                              |
| ---------------------------- | ---------------------------------------- |
| `GetAllLoadedAssetBundles`   | 获取当前所有已加载的 AssetBundle 的枚举。              |
| `LoadFromFile`               | 从磁盘文件同步加载 AssetBundle。                   |
| `LoadFromFileAsync`          | 从磁盘文件异步加载 AssetBundle。                   |
| `LoadFromMemory`             | 从内存区域同步加载 AssetBundle。                   |
| `LoadFromMemoryAsync`        | 从内存区域异步加载 AssetBundle。                   |
| `LoadFromStream`             | 从托管流同步加载 AssetBundle。                    |
| `LoadFromStreamAsync`        | 从托管流异步加载 AssetBundle。                    |
| `RecompressAssetBundleAsync` | 异步将下载或存储的 AssetBundle 从一个构建压缩格式重新压缩到另一个。 |
| `UnloadAllAssetBundles`      | 卸载所有当前加载的 AssetBundle。                   |

[Unity Scripting AssetBundle](https://docs.unity3d.com/ScriptReference/AssetBundle.html)


### Addressable Assets System
这是Unity推荐的现代资源加载方式，通过Addressable Asset System，开发者可以将资源分组并动态加载，支持远程加载资源包，极大地提升了资源管理的灵活性和性能

#### 简介
Addressable Asset System允许开发者通过地址使用资产，一旦一个资产被标记为“addressable”，它便生成一个地址，可以在任何地方被调用；无论这个资产是在本地或远程，系统都会定位它和它的依赖，然后返回它

通过`Windows->Asset Management->Addressables`使用地址资源系统

Addressables使用异步加载技术，支持从任意位置加载任意依赖项集合。无论是使用直接引用、传统Asset Bundle还是Resources文件夹，Addressables都可以提供一种更简便的方法

[Addressables]({{site.baserul}}/posts/2025-06-05-Addressables/)

## 资源卸载
资源加载后，不及时释放也可能导致内存泄露

## 资源优化
为了优化资源的加载与使用，Unity有多种工具和策略
- Asset Bundles：Unity提供的Asset Bundles可以将资源打包成一个文件，支持按需加载，适合于游戏内容更新或者大规模的资源管理
- 内存管理：Unity的内存管理非常关键，尤其是在移动设备或者内存受限的设备上。通过精确的资源加载和卸载策略，可以避免内存占用过多
