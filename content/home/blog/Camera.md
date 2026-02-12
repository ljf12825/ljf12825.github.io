---
title: "Camera"
date: 2025-05-28
categories: [Note]
tags: [Unity, Component]
author: "ljf12825"
summary: Usage and document of camera in Unity
---
在Unity中，`Camera`是游戏中视角呈现的核心组件，它决定了玩家从哪里、以什么方式看到游戏世界。

可以将它理解为游戏世界的“观察者”，通过相机的视角来渲染和展示游戏世界的内容

## Camera的核心概念
1. 视野（Field of View, FOV）
  - 视野决定了相机的可见范围，单位通常是角度。FOV越大，显示的范围越广；FOV越小，显示的范围越窄。常见的游戏视角有第一人称（FOV通常较小）和第三人称（FOV较大）
  - 对于透视相机，FOV越大，物体看起来就越远，越小则物体看起来越近
  - 对于正交相机，FOV不影响物体的大小，物体的大小保持不变

2. 摄像机类型
  - 透视摄像机（Perspective）：像人眼一样
    - 透视摄像机FOV = 60
    ![透视摄像机FOV=60](/images/Blog/PerspectiveCameraFOV=60.jpg)
    - 透视摄像机FOV = 20
    ![透视摄像机FOV=20](/images/Blog/PerspectiveCameraFOV=20.jpg)
    - 透视摄像机FOV = 80
    ![透视摄像机FOV=80](/images/Blog/PerspectiveCameraFOV=80.jpg)

  - 正交摄像机（Orthographic）：精确而非真实
    - 正交摄像机
    ![正交摄像机](/images/Blog/OrthographicCamera.jpg)

    - 消除透视畸变
      - 正交摄像机的最大特点是不考虑透视，即：
        - 远处的物体不会变小
        - 近处的物体不会变大
      - 这在某些场景下非常有用，比如：
        - 工程图、建筑图、UI界面、2D游戏等
    - 便于精确计算与对齐
      - 因为所有对象的投影都是平行的，没有缩放失真，所以：
        - 对象之间的相对位置更容易计算
        - 适合用于网格对齐（Grid Snap）和像素精确的渲染
    - 适用于2D游戏开发
      - 大多数2D游戏使用正交摄像机，这样才能保持像素美术不被拉伸或缩放失真
      - 例如：平台跳跃、塔防、策略类游戏
    - 用于UI和HUD绘制
      - UI元素通常使用正交摄像机绘制，以确保在不同屏幕分辨率下保持相同的外观
    - 技术与设计简化
      - 对于一些需要标准比例的场景（如棋盘游戏、等距地图编辑器），正交摄像机可以让开发者更轻松地布局和设计


3. 裁剪平面（Clipping Planes）
  - 每个相机有一个近裁剪面和远裁剪面，这些平面决定了相机能够渲染的场景区域。任何在近裁剪面之前或远裁剪面之后的物体都会被剔除，无法渲染
  - 这两个值非常重要，过小的近裁剪面可能导致深度精度问题，过大的远裁剪面可能会降低性能

4. 深度（Depth）
  - 深度是多个相机渲染顺序的控制参数。较大的深度值表示该相机会在渲染顺序中排在较后，优先渲染的相机会覆盖深度较小的相机。可以使用深度来控制不同相机的渲染顺序
  - 例如，第一人称相机的深度应该大于第三人称相机的深度，这样在同一场景中，第一人称相机的渲染会覆盖第三人称相机

5. 渲染目标（Render Target）
  - 默认情况下，相机会将渲染的图像显示在屏幕上。但是也可以将渲染结果输出到一个纹理中（称为Render Texture），从而创建镜头效果或UI显示

6. 视锥体（View Frustum）
  - 它定义了摄像机能够看到的空间区域
  - 是一个截掉顶部的四棱锥体，表示摄像机的“视野”或“观察体积”
  - 近裁剪面和远裁剪面构成了锥体的前后边界
  - 左右上下边界则由视角和屏幕宽高比决定
  - Unity会自动裁剪视锥体之外的物体，不进行渲染

```csharp
RenderTexture rt = new RenderTexture(1920, 1080, 16);
camera.targetTexture = rt;
```

用途：
- 监控摄像头
- 多人游戏中的小窗口视角
- 后处理特效（Blur, EdgeDetect）

## Camera常用属性

**Clear Flag（清除模式）**

| ClearFlag 模式    | 描述                 |
| --------------- | ------------------ |
| **Skybox**      | 使用当前 Skybox 作为背景   |
| **Solid Color** | 使用指定背景颜色           |
| **Depth Only**  | 仅清除深度缓冲区（常用于叠加 UI） |
| **Nothing**     | 什么都不清除（很少用）        |

**Viewport Rect视口渲染（rect）**

- Viewport Rect定义了相机在屏幕上的显示区域。它使用一个四元组来定义，格式为`(x, y, width, height)`，用于控制相机渲染的区域，可以通过Viewport Rect来在同一屏幕上显示多个相机视图

```csharp
camera.rec = new Rect(x, y, w, h);
```
- `(x, y)`是起点（左下角0,0）
- `(w, h)`是宽度、高度 (0~1)

**示例：左下角显示一个小窗口（小地图）**
```csharp
miniMapCamera.rect = new Rect(0.75f, 0.75f, 0.25f, 0.25f);
```

## 相机控制和效果
1. 相机跟随
  - 游戏中的常见需求之一是让相机跟随玩家或物体运动。可以通过简单的脚本，让相机的`Transform.position`跟随目标物体
  - 平滑跟随：可以利用`Vector3.Lerp`或`Vector3.SmoothDamp`来平滑相机的移动，避免突兀的运动

示例：
```cs
void Update()
{
    Vector3 targetPosition = new Vector3(player.transform.position.x, player.transform.position.y, player.transform.position.z);
    transform.position = Vector3.SmoothDamp(transform.position, targetPosition, ref velocity, 0.3f);
}
```

2. 第一人称与第三人称视角：
  - 第一人称视角：相机直接附加到玩家的头部位置，视角跟随玩家的头部运动
  - 第三人称视角：相机位于玩家背后或上方，保持一定距离并跟随玩家的移动旋转

3. 后处理效果（Post-Processing）
  - Unity的后处理效果可以在渲染之后应用各种视觉效果，比如Bloom、Motion Blur、Depth of Field等。这些效果能够极大地增强游戏的视觉表现
  - 通常使用PostProcessing Stack来处理这些效果，后处理效果会在相机渲染完之后加入，因此对原始场景的渲染不会产生影响

4. 摄像机遮挡与碰撞
  - 在某些情况下，玩家的角色或物体可能会挡住视线，造成相机无法清晰地看到目标。为了避免这种问题，可以在摄像机的脚本中加入简单的碰撞检测，确保相机不会穿透物体


## 常见技巧
1. 相机拉远/拉近（Zoom）
  - 通过调整相机的FOV或者直接调整相机的`Transform.position.z`，可以模拟相机的拉近或拉远效果

2. 自定义相机动画
  - 通过对相机的Transform进行插值动画，可以实现平滑的过渡效果，例如在场景中切换不同视角或执行特定的镜头动作


## 常见使用案例
**1.世界坐标转UI坐标（UI跟随物体）**

```csharp
Vector3 screenPos = Camera.main.WorldToScreenPoint(worldTarget.Position);
uiObject.position = screenPos;
```

**2.鼠标点击获取世界坐标（射线）**

```csharp
Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
if (Physics.Raycast(ray, out RaycastHit hit)) Debug.Log("点击位置是：" + hit.point);
```

**3.多相机渲染UI与3D**

- 主相机渲染3D（depth = 0）
- UI相机渲染UI， clearFlags = DepthOnly, depth = 1


## 优化建议

- 不要同时启用多个全屏相机
- 尽量合并摄像机输出（避免depth重叠）
- 用Layer + cullingMask控制渲染内容
- 使用Object Pool避免动态创建摄像机

## 摄像机插件推荐

**Cinemachine（Unity官方）**

- 更专业的摄像机管理系统
- 支持跟随、过渡、轨迹、抖动等
- 强烈推荐用来代替自定义相机控制脚本


## API

### Properties

| 属性                 | 类型                 | 说明                            |
| ------------------ | ------------------ | ----------------------------- |
| `clearFlags`       | `CameraClearFlags` | 清除模式（背景如何处理）                  |
| `backgroundColor`  | `Color`            | 背景颜色（Clear Flags 为 Color 时有效） |
| `cullingMask`      | `LayerMask`        | 渲染哪些层的物体（通过 Layer 过滤）         |
| `orthographic`     | `bool`             | 是否为正交摄像机（2D 用）                |
| `orthographicSize` | `float`            | 正交相机的可视区域高度一半                 |
| `fieldOfView`      | `float`            | 视野角度（仅透视模式下有效）                |
| `nearClipPlane`    | `float`            | 最近可见距离                        |
| `farClipPlane`     | `float`            | 最远可见距离                        |
| `depth`            | `float`            | 相机渲染优先级（数字大者后绘制）              |
| `targetTexture`    | `RenderTexture`    | 渲染输出目标（用于后处理、UI）              |
| `aspect`           | `float`            | 宽高比，默认由屏幕决定                   |
| `rect`             | `Rect`             | 相机视口（屏幕中的显示区域）                |
| `pixelRect`        | `Rect`             | 实际像素区域                        |
| `cameraType`       | `CameraType`       | 摄像机类型（Game、Scene、Preview）     |
| `enabled`          | `bool`             | 是否启用此相机                       |

### Methods

| 方法                               | 说明                   |
| -------------------------------- | -------------------- |
| `ScreenToWorldPoint(Vector3)`    | 将屏幕坐标转为世界坐标（Z 轴代表深度） |
| `WorldToScreenPoint(Vector3)`    | 将世界坐标转为屏幕坐标          |
| `ScreenToViewportPoint(Vector3)` | 屏幕坐标转视口坐标（0\~1）      |
| `ViewportToWorldPoint(Vector3)`  | 视口转世界坐标              |
| `Render()`                       | 手动触发相机渲染（常用于离屏渲染）    |
| `ResetAspect()`                  | 重置相机宽高比为屏幕比例         |
| `ResetProjectionMatrix()`        | 重置投影矩阵               |

**[Unity官方文档（Camera）](https://docs.unity3d.com/ScriptReference/Camera.html)**




