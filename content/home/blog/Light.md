---
title: "Light"
date: 2025-05-29
categories: [Note]
tags: [Unity, Component, Light, Rendering, Graphics]
author: "ljf12825"
type: blog
summary: Introduction Light' usage and implement in Unity
---
Unity中的Light是照亮场景和物体的核心组件，也是实现逼真视觉效果的关键之一。合理使用光源可以极大提升游戏画面质量，同时也对性能有重要影响
Light决定了场景中物体如何被照亮、阴影如何生成、氛围如何表现

## Light的类型（Type）

Unity中有4种主要光源类型：

| 类型                    | 描述             | 用途示例              |
| --------------------- | -------------- | ----------------- |
| **Directional Light** | 没有位置，只有方向，光线平行 | 太阳光、月光            |
| **Point Light**       | 从一点向所有方向发散     | 灯泡、火把             |
| **Spot Light**        | 从一点向特定方向的锥体发散  | 手电筒、聚光灯           |
| **Area Light**（仅用于烘焙） | 从一个平面区域发光      | 霓虹灯、窗户光线（仅用于静态对象） |

## 光照模式（Mode）

Unity光源有三种模式，关系到实时性和性能：

| 模式           | 描述                 | 用途             |
| ------------ | ------------------ | -------------- |
| **Realtime** | 每帧计算光照，支持动态物体      | 动态灯光，如手电筒、角色法术 |
| **Mixed**    | 静态对象使用烘焙，动态对象使用实时光 | 综合表现和性能        |
| **Baked**    | 所有光照预先烘焙，不支持动态阴影   | 静态场景，如建筑、地形    |

## Light属性
在Unity中，使用``UnityEngine.Light``类可以动态修改光源的各种属性，实现如灯光变化、闪烁、开关、颜色变化等效果
```csharp
Light light = GetComponent<Light>();
```
namespace:``UnityEngine``  
``Behaviour -> Component -> Object``

**常用字段与属性**

| 属性/方法             | 类型                | 说明                                           |
| ----------------- | ----------------- | -------------------------------------------- |
| `type`            | `LightType`       | 光源类型（`Directional`, `Point`, `Spot`, `Area`） |
| `color`           | `Color`           | 光的颜色                                         |
| `intensity`       | `float`           | 光照强度                                         |
| `range`           | `float`           | 光照范围（Point/Spot）                             |
| `spotAngle`       | `float`           | 聚光灯角度（Spot）                                  |
| `enabled`         | `bool`            | 是否启用光源                                       |
| `shadows`         | `LightShadows`    | 阴影类型（None/Hard/Soft）                         |
| `cookie`          | `Texture`         | 光照投影纹理                                       |
| `cookieSize`      | `float`           | Cookie 范围（仅限 Directional Light）              |
| `renderMode`      | `LightRenderMode` | 自动/强制重要/强制非重要                                |
| `bounceIntensity` | `float`           | 间接光强度（GI 反射）                                 |
| `flare`           | `LensFlare`       | 镜头光晕组件                                       |
| `cullingMask`     | `LayerMask`       | 此灯光影响的层（需要启用“Forward Rendering”）             |

**[Unit官方文档（Light）](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Light.html)**

## 示例：动态控制灯光
**1.开关灯**

```csharp
void ToggleLight()
{
    Light light = GetComponent<Light>();
    light.enabled = !light.enabled;
}
```

**2.改变颜色和强度**
```csharp
void SetAlertMode()
{
    Light light = GetCompenent<Light>();
    light.color = Color.red;
    light.instensity = 5f;
}
```

**3.手电筒控制**
```csharp
public Light flashlight;

void Update() => if(Input.GetKeyDown(KeyCode.F)) flashlight.enable = !flashlight.enable;
```

## 枚举类型

``LightType``

```csharp
LightType.Directional
LightType.Point
LightType.Spot
LightType.Area
```

``LightShadows``
```csharp
LightShadows.None
LightShadows.Hard
LightShadows.Soft
```

``LightRenderMode``
```csharp
LightRenderMode.Auto
LightRenderMode.ForcePixel
LightRenderMode.ForceVertex
```

## 动态创建光源
```csharp
GameObject lightObj = new GameObject("My Light");
Light light = lightObj.AddComponent<Light>();
light.type = LightType.Point;
light.color = Color.yellow;
light.range = 10;
light.intensity = 2;
```

## 阴影（Shadows）

**1.Type（类型）**
- **Hard Shadows:** 边缘锐利，性能好
- **SoftShadows:** 边缘柔和，更真实，但性能稍低

**2.Strength（强度）**
控制阴影颜色的不透明度

**3.Bias / Normal Bias**
用于消除“Peter Panning”（阴影漂浮）或自阴影伪影的问题

## 环境光

全局光照设置不依赖于某个 Light，而是在场景中作为基础光存在：

- 打开方式：Window > Rendering > Lighting > Environment

- 设置：

  - Ambient Source：Color / Gradient / Skybox

  - Ambient Intensity：环境光强度

- 可搭配天空盒（Skybox）提升视觉氛围

## 高级功能
**1.Light Cookies（光照贴图）**
使用一张纹理控制光照形状，常用于：
- 手电筒
- 模拟窗户栅栏照进屋内的光影
- 火焰跳动的效果

```csharp
light.cookie = yourTexture;
```

**2.体积光**
Unity标准版本不自带，可通过插件实现（如HDRP或Volumetric Lighting插件）实现光柱、薄雾等效果

## 光照的重要系统
**1.Light Probes**
- 用于让动态对象接收静态光照烘培信息
- 适用于混合模式

**2.Reflection Probes**
- 用于模拟镜面反射或高光反射效果
- 反射球贴图可影响PBR材质

**3.Global Illumination（全局光照）**
- 计算间接光（比如光从墙上反射到地面）
- 分为实时GI和烘焙GI（通过Enlighten或Progressive）

## 光照调试技巧
- 使用`Scene`视图右上角的Lighting工具查看光照影响
- 使用Light Explore（`Window > Rendering > Lighting > Light Explorer`）快速管理所有光源
- 使用`Gizmos`选项查看光源范围

## 性能建议
**1.实时光数量尽量控制在2~4个**  
**2.阴影数量建议仅关键光源开启阴影**  
**3.静态光使用Baked，可大幅提升帧率**  
**4.动态光照使用Light Probe + Mixed模式**  
