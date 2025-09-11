---
title: "Mesh"
date: 2025-06-01
categories: [Note]
tags: [Unity, Renderer, Graphic]
author: "ljf12825"
summary: Introduction Mesh，Mesh in Unity
---
Unity中的Mesh（网格）是一切3D模型、地形、角色、道具、甚至某些UI元素的几何基础，是“物体的骨架”  
包含顶点、面、法线、UV、颜色等数据，是3D图形渲染的核心单位

## Mesh的构成

| 数据                 | 作用                   |
| ------------------ | -------------------- |
| **顶点（Vertices）**   | 网格的点，构成形状的基础         |
| **三角形（Triangles）** | 每三个顶点组成一个三角面，是渲染最小单元 |
| **法线（Normals）**    | 每个顶点的方向，用于光照计算       |
| **UV 坐标（UVs）**     | 纹理坐标，用来决定贴图怎么铺在模型上   |
| **顶点色（Colors）**    | 每个顶点的颜色，用于特效、调色      |
| **切线（Tangents）**   | 用于法线贴图的方向辅助向量        |

这些数据最终会交给GPU，进行渲染

## Mesh在Unity中的用途

| 用途       | 举例                         |
| -------- | -------------------------- |
|  渲染模型   | 静态模型、角色模型、环境场景             |
|  自定义几何体 | Procedural Mesh（如地形、波浪、水面） |
|  碰撞体数据  | Mesh Collider 也使用 Mesh     |
|  特效/轨迹  | 线性 Mesh（如剑气轨迹、能量波）         |
|  角色换装   | 动态换装系统中组合不同 Mesh           |


## 如何创建、操作Mesh
Unity提供`Mesh`类，支持自定义几何体

### 示例：创建一个简单三角形Mesh
```cs
Mesh mesh = new Mesh();

Vector3[] vertices = new Vector3[]
{
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(1, 0, 0)
};

int[] triangles = new int[] {0, 1, 2};

mesh.vertices = vertices;
mesh.triangles = triangles;
mesh.RecalculateNormals(); // 自动生成法线

GetComponent<MeshFilter>().mesh = mesh;
```
## MeshFilter 和 MeshRenderer
在Unity中，`MeshFilter`和`MeshRenderer`是构成立体物体（3D模型）渲染的核心组件
- `MeshFilter`：提供集合形状（顶点、三角形等）
- `MeshRenderer`：将形状渲染到屏幕上（使用材质、光照等）

![MeshFilterandMeshRenderer](/assets/images/MeshFilterandMeshRenderer.jpg);

### MeshFilter：提供模型数据
- MeshFilter包含一个Mesh对象，这是3D模型的几何体，比如立方体、球体、角色模型等
- 这些Mesh是`.fbx`、`.obj`导入的，或运行时通过代码生成

可以通过以下方式获取或赋值Mesh
```cs
MeshFilter mf = GetComponenet<MeshFilter>();
Mesh mesh = mf.mesh; // 当前使用的实例化mesh
mf.mesh = someOtherMesh; // 替换为新的Mesh
```
>`.mesh`是一个实例副本，你修改它不会影响原始资源；`.sharedMesh`是共享原始资源

### MeshRenderer：负责把模型画出来
- MeshRenderer负责把`MeshFilter`提供的几何体渲染到屏幕上
- 控制材质、阴影、光照、剔除、光照探针等参数

#### 面板参数
##### Element 0, 1...
- 控制使用哪个材质渲染对应子网格
- 通常一个对象只有一个材质，如果是多个SubMesh，会有多个材质槽
适用场景：
- 多材质角色：身体/衣服/装备使用不同的材质
- 不同部件不同特效：一个材质透明，一个闪光

##### Lighting
**Cast Shadows(投射阴影)**
- 控制该物体是否想地面等对象投影
- 选项：
  - `On`：始终投射阴影
  - `Off`：不投影
  - `Two Sided`：背面也能投影（适用于双面平面）
  - `Shadows Only`：只显示阴影，不渲染模型本体（隐形）

**Receive Shadows(接收阴影)**
- 是否接收其他物体的阴影（比如树被房子挡住时）
- 关闭可提升性能，但视觉上可能不真实

##### Probes（探针相关，环境光/间接光）
在Unity中，`Probes`是一类帮助处理间接光照和环境反射的技术，目的是让动态物体（如角色、道具）在光照和反射效果上看起来更自然，融入环境  

**为什么需要探针**

Unity中有两类光照
- 直接光照：来自灯光（如Dirctional Light）
- 间接光照：来自物体间的反弹、环境照明

对于静态物体，Unity可以烘焙光照贴图（Lightmap）来记录间接光照  
但动态物体（移动的角色、道具）不能使用烘焙光照贴图，这时候就需要探针来帮它“感受环境的光”

> 探针是一种轻量级采样方式，让动态物体获得类似烘焙光照/环境反射的技术，从而避免使用高开销的实时光照和实时反射

**Light Probes**
- 是否接受光照探针（动态光照采样，用于小物体，如动态角色）
- 一般设置为`Blend Probes`（自动采样探针）

**Reflection Probes**
- 是否使用反射探针（环境反射用）
- 选项：
  - `Off`
  - `Blend Probes`（常用）
  - `Simple`（不混合，只是用最近一个）

##### Additional Settings（附加设置）
**Motion Vectors**
- 控制是否为该物体生成运动矢量（供后处理如动态模糊使用）
- 推荐开启：`Per Object Motion`

**Lightmap Static**
- 如果你将对象标记为静态，会自动启用Lightmap烘焙支持
- 静态光照适用于不动的建筑、地面等


