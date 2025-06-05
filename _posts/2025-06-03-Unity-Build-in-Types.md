---
title: "Unity Build-in Types"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
---
Unity内建类型  


## 常见Unity内建类型（按用途分）
### 1.空间/几何类型（Transform相关）

| 类型                              | 说明               |
| ------------------------------- | ---------------- |
| `Vector2`, `Vector3`, `Vector4` | 表示二维/三维/四维向量     |
| `Quaternion`                    | 四元数，表示旋转         |
| `Matrix4x4`                     | 4×4 矩阵，常用于转换     |
| `Bounds`                        | 包围盒（中心+尺寸）       |
| `Ray`, `RaycastHit`             | 射线检测相关类型         |
| `Plane`                         | 表示一个无限平面         |
| `Rect`                          | 二维矩形区域           |
| `Color`, `Color32`              | 表示颜色（线性空间和 sRGB） |

#### **Vector2 & Vector3 & Vector4**
它们是Unity提供的三个核心向量类型，广泛用于位置、方向、速度、缩放、颜色等各种场景  

##### 基本定义

| 向量类型      | 维度                          | 作用                       |
| --------- | --------------------------- | ------------------------ |
| `Vector2` | 2D 向量，包含 `x`, `y`           | 用于 2D 空间中的位置、速度等         |
| `Vector3` | 3D 向量，包含 `x`, `y`, `z`      | 用于 3D 空间中的大多数情况          |
| `Vector4` | 4D 向量，包含 `x`, `y`, `z`, `w` | 用于更高级的计算，如齐次坐标、shader 编程 |

**Vector2（二维向量）**  
```csharp
Vector2 position = new Vector2(1.5f, 3.0f);
```
常见用途：
- 2D游戏中的对象位置、速度、加速度等
- 屏幕空间坐标（如UI坐标）
- 纹理坐标（UV mapping）

**Vector3（三维向量）**  
```csharp
Vector3 direction = new Vector3(0f, 1f, 0f); //向上
transform.position += direction * Time.deltaTime;
```
常见用途：
- 3D对象的位置、方向、缩放
- 物理运动（速度、加速度）
- 相机方向、光照方向

**Vector3常用静态变量**  
```csharp
Vector3.zero      // (0, 0, 0)
Vector3.one       // (1, 1, 1)
Vector3.up        // (0, 1, 0)
Vector3.down      // (0, -1, 0)
Vector3.left      // (-1, 0, 0)
Vector3.right     // (1, 0, 0)
Vector3.forward   // (0, 0, 1)
Vector3.back      // (0, 0, -1)
```

**Vector3静态方法**  

| Method | Description | Declaration |
| - | - | - |
| Angel | 求两向量夹角 | public static float Angle(Vector3 from, Vector3 to); |
| ClampMagnitude | 限制一个向量的长度，防止它超过maxLength，如果vector的长度小于等于maxLength返回原向量，否则返回一个等于maxLength的同向向量 | public static Vector3 ClampMagnitude(Vector3 vector, float maxLength); |
| Cross | 求叉积 | public static Vector3 Cross(Vector3 lhs, Vector3 rhs); |
| Distance | 求三维空间中两点的距离 | public static float Distance(Vector3 point1, Vector3 point2); |
| Dot | 求点乘 | public static float Dot(Vector3 lhs, Vector3 rhs); |
| Lerp | 求线插（不允许外推）,  t -> [0, 1]  | public static Vector3 Lerp(Vector3 a, Vector3 b, float t); |
| LerpUnclamped | 求线插（允许外推，产生超调） | public static Vector3 LerpUnclamped(Vector3 a, Vector3 b, float t); |
| Max | 返回两个向量所能组成的最大向量 | public static Vector3 Max(Vector3 lhs, Vector3 rhs); |
| Min | 返回最小 | 同上 |
| MoveTowards | 以恒定速度向目标位置靠近，直到到达 | public static Vector3 MoveTowards(Vector3 current, Vector3 target, float maxDistanceDelta); |
| Normalize | 归一化 | public void Normalize(); |
| OrthoNormalize | 正交归一化 | public static void OrthoNormalize(ref Vector3 normal, ref Vector3 tangent);  public static void OrthoNormalize(ref Vector3 normal, ref Vector3 tangent, ref Vector3 binormal); |
| Project | 投影到onNormal | public static Vector3 Project(Vector3 vector, Vector3 onNormal); |
| ProjectOnPlane | 投影到planeNormal | public static Vector3 ProjectOnPlane(Vector3 vector, Vector3 planeNormal); |
| Reflect | 反射线，inNormal是法线 | public static Vector3 Reflect(Vector3 inDirection, Vector3  inNormal);
| RotateTowards | 逐步旋转一个方向向量朝向另一个方向向量，maxRadiansDelta是每次最大允许旋转的角度（弧度），maxMagnitudeDelta是每次允许变化的向量长度 | public static Vector3 RotateTowards(Vector3 current, Vector3 target, float maxRadiansDelta, float maxMagnitudeDelta); |
| Scale | 两个向量分量相乘组成新向量 | public static Vector3 Scale(Vector3 a, Vector3 b); |
| SignedAngle | 求带符号夹角，axis是用于确定旋转方向的轴，正值是绕着axis左旋，负值是右旋 | public static float SignedAngle(Vector3 from, Vector3 to, Vector3 axis); |
| Slerp | 球面插值，球面为a，b点所在大圆所在的球的球面，插值在a，b点所在的圆上取 | public static Vector3 Slerp(Vector3 a, Vector3 b, float t); |
| SlerpUnclamped | 球面插值（允许外推，产生超调） | public static Vector3 SlerpUnclamped(Vector3 a, Vector3 b, float t); |
| SmoothDamp | 平滑插值； ref currentVelocity当前速度向量；smoothTime到达目标值所需的预期时间，越小越快越敏感；maxSpeed最大速度（可选）；deltaTime每帧间隔时间（可选） | public static Vector3 SmoothDamp(Vector3 current, Vector3 target, ref Vector3 currentVelocity, float smoothTime, float maxSpeed = Mathf.Infinity, float deltaTime = Time.deltaTime);

[Unity官方文档（Vector3）](https://docs.unity3d.com/ScriptReference/Vector3.html)


**Vector4（四维向量）**
```csharp
Vector4 v = new Vector4(1, 2, 3, 4);
```
常见用途：
- 齐次坐标（矩阵变换常用）
- 传递颜色（Color在底层可能是Vector4(r,g,b,a)）
- shader开发中用于高级数学运算（如平面方程、切线空间等）

#### Quaternion & Euler Angles
在Unity中，Quaternion是用来表示旋转的核心数学结构，它避免了Euler Angles的万向节死锁问题，并且适用于平滑插值和复杂3D计算  

##### Quaternion
Quaternion表示绕某一条单位轴旋转一个角度的这个过程，简单来说：表示一个旋转

**数学本质**
四元数是一种复数扩展：  
```ini
Q = w + xi + yj + zk
```
在Unity中被表示为：
```csharp
public struct Quaternion
{
    public float x;
    public float y;
    public float z;
    public float w;
}
```
`x, y, z`表示旋转轴的向量部分（方向）  
`w`表示旋转的角度部分(cos(θ/2))  

四元数不是角度 + 轴直接拼成的，是通过以下方式构造：
```ini
x=axis.x⋅sin(θ/2)
y=axis.y⋅sin(θ/2)
z=axis.z⋅sin(θ/2)
w=cos(θ/2)
```
其中`axis`是归一化的旋转轴向量  
`θ`是旋转角度（弧度）

你可以把四元数想象成一个旋转操作，它编码了两个信息：
- 1.绕哪个轴旋转
- 2.旋转多少角度

**Quaternion用途**

| 用途场景              | 描述                                             |
| ----------------- | ---------------------------------------------- |
| 表示物体旋转            | 替代 `transform.rotation = new Vector3(...)`，更稳定 |
| 做平滑旋转（Slerp/Lerp） | 保持插值平滑、不跳跃、不变形                                 |
| 实现摄像机跟随           | 平滑跟随目标的朝向                                      |
| 构建旋转动画            | 可结合 Timeline、Animator 使用                       |
| 控制角色面向            | 看向目标、追踪方向等                                     |

**Quaternion API**

| 方法/属性                                             | 说明               |
| ------------------------------------------------- | ---------------- |
| `Quaternion.identity`                             | 零旋转（即不旋转）        |
| `Quaternion.Euler(x, y, z)`                       | 从欧拉角创建旋转         |
| `Quaternion.LookRotation(dir)`                    | 让对象朝向某个方向        |
| `Quaternion.Angle(a, b)`                          | 计算两个旋转之间的角度      |
| `Quaternion.AngleAxis(float angle, Vector3 axis)` | 围绕axis旋转angle度        |
| `Quaternion.Slerp(a, b, t)`                       | 在两个旋转之间平滑插值（匀速）  |
| `Quaternion.Lerp(a, b, t)`                        | 线性插值旋转（不推荐用于大角度） |
| `Quaternion.RotateTowards(a, b, maxDegreesDelta)` | 限制最大旋转角度的平滑旋转    |
| `* 运算符`（例如 `rot * vector`）                        | 将旋转应用于向量，旋转该方向向量 |

**构建方式**
```csharp
Quaternion q = Quaternion.AngleAxis(90, Vector3.up); //绕Y轴旋转90°
```
使用欧拉角构建：
```csharp
Quaternion q = Quaternion.Euler(0, 90, 0); //XYZ分别是绕X Y Z轴的角度
```
##### Euler Angles

**欧拉角的定义**  
欧拉角是用三个角度来描述3D空间中的一个旋转变换，每个角度表示围绕一个坐标轴的旋转量。  
在Unity中，欧拉角就是一个`Vector3`
```csharp
transform.eulerAngles = new Vector3(30, 45, 0);
```
这表示：
- 绕X轴旋转30°
- 然后绕Y轴旋转45°
- 然后绕Z轴旋转0°
>欧拉角的本质是「分轴顺序旋转」，三个角度 + 一个旋转顺序（X -> Y -> Z），顺序不能出现问题，否则结果不同

**欧拉角的特点**

| 特点     | 描述                                            |
| ------ | --------------------------------------------- |
|  直观   | 直接写角度，容易理解和调试                                 |
|  顺序敏感 | 顺序不同，结果不同（ZYX ≠ XYZ）                          |
|  有死锁  | 当某个轴旋转到特定位置时，另一个轴“失效”——**万向节死锁（Gimbal Lock）** |
|  插值难  | 在两个角度之间插值时可能会突然“跳动”或绕远路                       |

**欧拉角适用于：**
- 手动设置角度
- UI显示
- 编辑器中拖拽角度时
- 简单旋转动画、摄像机控制

**实际旋转逻辑中，建议使用Quaternion**

**Euler Angels和Quaternion的关系**  
Unity内部几乎不直接用欧拉角进行旋转运算，它会自动把你设置的欧拉角转换为四元数
```csharp
transform.eulerAngles = new Vector3(0, 90, 0);
// 实际上自动转换为：
transform.rotation = Quaternion.Euler(0, 90, 0);
```

**欧拉角插值出现的问题**
```csharp
Vector3 from = new Vector3(0, 0, 0);
Vector3 to = new Vector3(0, 360, 0);

Vector3 result = Vector3.Lerp(from, to, 0.5f); //会插值到180°
```
实际上，从0°到360°最短路径时0°，这就是欧拉角插值跳变的问题  
使用四元数可以避免  
```csharp
Quaternion q1 = Quaternion.Euler(from);
Quaternion q2 = Quaternion.Euler(to);

Quaternion qResult = Quaternion.Slerp(q1, q2, 0.5f);
```

**Euler Angles和Quaternion的转换**  
欧拉角 -> 四元数
```csharp
Quaternion q = Quaternion.Euler(30, 45, 60);
```
四元数 -> 欧拉角
```csharp
Vector3 euler = q.eulerAngles;
```
>四元数本身不会存储旋转顺序和原始角度，这个反转换可能会出现不寻常的角度，比如-180°、350°等

欧拉角和四元数的关系：三次独立的XYZ轴旋转（Euler Angle）相当于对于某个特定轴旋转特定角度（Quaternion）  
**深入原理**
给定欧拉角 (𝛼, 𝛽, 𝛾)，表示绕 X、Y、Z 旋转，四元数变换公式如下（XYZ顺序）：  
```csharp
Quaternion q = Quaternion.Euler(alpha, beta, gamma);
```
等价于
```csharp
Quaternion qx = Quaternion.AngleAxis(alpha, Vector3.right);
Quaternion qy = Quaternion.AngleAxis(beta, Vector3.up);
Quaternion qz = Quaternion.AngleAxis(gamma, Vector3.forward);
Quaternion q = qy * qx * qz; //组合旋转，顺序重要；Unity为左乘
```

**万向节死锁（Gimbal Lock）**  
Gimbal Lock是指使用欧拉角进行三维旋转时，当两个旋转轴重合，导致自由度从3变成2，某个方向的旋转无法表达的情况  
产生Gimbal Lock的核心原因是欧拉角的特性:  
一组欧拉角描述一个旋转过程：即，围绕每个轴的旋转角度和围绕每个轴旋转的顺序，顺序很重要，不同的顺序会带来不同的结果
Gimbal Lock产生的核心是：先执行旋转的轴会带动后执行旋转的轴转动，即产生新轴；但后执行旋转的轴不会带动先执行旋转的轴转动，即一个轴旋转过后就不会出现新轴了，这就会出现轴重合问题，即导致万向节死锁的产生  
**数学本质是矩阵乘法的非交换性**  
旋转在数学上是用矩阵表示的：
- 旋转操作使用矩阵乘法实现的
- 矩阵乘法不满足交换律，也就是说：Rx × Ry != Ry × Rx

**核心关键是为什么后旋转的轴不能带动先旋转的轴？**  
这个问题涉及到旋转的执行顺序本质上是“嵌套变换”，而不是“同步协商”的。这就像流水线的工序，是不可逆和不可交错的  
核心结论：  
每一步旋转都是在“当前局部坐标系”下完成的，而不是回头修改前面坐标系的历史状态  
后面的旋转只是在前面旋转结果基础上叠加，它并不会“回头影响”之前已经旋转过的坐标系  
举个例子：
假设做一个蛋糕：  
第一步：打鸡蛋    
第二步：加牛奶  
第三步：搅拌  
现在你问：为什么我搅拌的时候不能回头改变我打鸡蛋这个过程？  
因为：打鸡蛋已经做完了，是个不可逆的状态变换，你在搅拌的时候，只能处理“鸡蛋 + 牛奶”的混合物，不能改变已经打完的蛋  

**数学视角：矩阵乘法是方向性的**
旋转是通过矩阵来表示的，顺序matters： `FinalRotation = Rz · Ry · Rx`  
你先执行Rx，然后再执行Ry,再执行Rz  
每个旋转操作都是将当前状态乘上一个旋转矩阵  
一旦Rx被应用，坐标系就已经变了  
之后的Ry是在这个变了的坐标系下进行的  
Ry不会也无法回头修改Rx的效果  
因为矩阵乘法不是可交换的，所以这个顺序是“单向嵌套”，不是“双向影响”

**欧拉角是旋转变换，每次旋转变换都是叠加了上次旋转的状态后再进行的，也就是说，虽然每次变换都是独立的，但都要经历从初始状态按顺序旋转，绕轴旋转角度达到目标状态这一系列流程，这就把时序包含在其中了**  
**初始状态是（0，0，0）**  

**为什么看到的变换是连续的**  
欧拉角变换虽然顺序嵌套，但它们构成的是一个连续函数映射  
欧拉角 → 四元数 → 变换矩阵 → 渲染出模型的姿态
整个链条中：

欧拉角：你手动输入的 (X, Y, Z) 是连续的（例如你拖动滑块）

四元数：Unity 把欧拉角转换成一个四元数，这是一个连续光滑的旋转表示

矩阵：四元数再转成 3×3 旋转矩阵，依然是平滑的

模型：在世界中展示的姿态是自然旋转、连贯变化的

所以你看到的旋转是连续的、平滑的。

**哪些地方是不连续的**  
1.万向节死锁，当某个周旋转到90°，两个轴重合，自由度减少，Unity为了保持“姿态”，可能会自动调整其他轴的值，此时Rotation的值再Inspector中跳变，但物体并没有跳  
2.四元数存在加减号不唯一（180°对称）问题，一个方向可以由两个四元数表示：q和-q，它们作用在物体上是一样的，Unity在背后自动选择最短路径，所以视觉上依旧是连续旋转路径上的最短旋转



### 2.游戏对象相关

| 类型                 | 说明                  |
| ------------------ | ------------------- |
| `GameObject`       | 场景中所有对象的基本单元        |
| `Component`        | 所有组件的基类             |
| `Transform`        | 表示物体的位置、旋转、缩放       |
| `MonoBehaviour`    | 用户自定义脚本的基类          |
| `ScriptableObject` | 可创建的资产类，用于数据管理      |
| `Object`           | Unity 所有对象的基类（包括资源） |


### 3.图形和渲染

| 类型                                      | 说明          |
| --------------------------------------- | ----------- |
| `Mesh`, `MeshRenderer`                  | 网格和其渲染组件    |
| `Material`                              | 材质资源        |
| `Shader`                                | 控制材质渲染效果的程序 |
| `Texture`, `Texture2D`, `RenderTexture` | 贴图资源        |
| `Camera`                                | 摄像机组件       |
| `Light`                                 | 灯光组件        |


### 4.物理相关

| 类型                                             | 说明                   |
| ---------------------------------------------- | -------------------- |
| `Rigidbody`, `Rigidbody2D`                     | 刚体，驱动物体物理行为          |
| `Collider`, `BoxCollider`, `SphereCollider`, 等 | 碰撞器                  |
| `Physics`, `Physics2D`                         | 提供物理检测和操作的静态类        |
| `Joint` 系列                                     | 链接两个刚体（如 HingeJoint） |
| `ContactPoint`                                 | 碰撞点信息结构体             |


### 5.输入和事件

| 类型                    | 说明         |
| --------------------- | ---------- |
| `Input`               | 输入系统静态类    |
| `KeyCode`             | 键盘按键枚举     |
| `Touch`, `TouchPhase` | 触摸输入相关     |
| `Event`, `EventType`  | GUI 系统事件类型 |


### 6.资源与序列化

| 类型                         | 说明                |
| -------------------------- | ----------------- |
| `Resources`, `AssetBundle` | 资源加载管理器           |
| `TextAsset`                | 文本资源，如 JSON、配置文件等 |
| `SerializableAttribute`    | 允许自定义类型序列化存储      |


### 7.UI（UGUI）

| 类型                                    | 说明                  |
| ------------------------------------- | ------------------- |
| `Canvas`, `CanvasRenderer`            | UI 根组件              |
| `RectTransform`                       | 用于 UI 布局的 Transform |
| `Image`, `Text`, `Button`, `Slider` 等 | 基础 UI 组件            |
| `EventSystem`                         | 管理 UI 输入事件          |


### 8.时间、协程与生命周期

| 类型                            | 说明                          |
| ----------------------------- | --------------------------- |
| `Time`                        | 时间相关（如 deltaTime、timeScale） |
| `WaitForSeconds`, `WaitUntil` | 协程等待辅助类                     |
| `Coroutine`                   | 协程对象类型                      |
