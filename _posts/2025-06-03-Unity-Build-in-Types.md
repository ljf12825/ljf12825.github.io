---
title: "Unity Build-in Types"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
---
Unity内建类型  

## 1.空间/几何类型（Transform相关）

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

### Vector
`Vector2`、`Vector3`、`Vector4`

它们是Unity提供的三个核心向量类型，广泛用于位置、方向、速度、缩放、颜色等各种场景  

| 向量类型      | 维度                          | 作用                       |
| --------- | --------------------------- | ------------------------ |
| `Vector2` | 2D 向量，包含 `x`, `y`           | 用于 2D 空间中的位置、速度等         |
| `Vector3` | 3D 向量，包含 `x`, `y`, `z`      | 用于 3D 空间中的大多数情况          |
| `Vector4` | 4D 向量，包含 `x`, `y`, `z`, `w` | 用于更高级的计算，如齐次坐标、shader 编程 |

#### Vector2（二维向量）
```csharp
Vector2 position = new Vector2(1.5f, 3.0f);
```
常见用途：
- 2D游戏中的对象位置、速度、加速度等
- 屏幕空间坐标（如UI坐标）
- 纹理坐标（UV mapping）

#### Vector3（三维向量）  
```csharp
Vector3 direction = new Vector3(0f, 1f, 0f); //向上
transform.position += direction * Time.deltaTime;
```
常见用途：
- 3D对象的位置、方向、缩放
- 物理运动（速度、加速度）
- 相机方向、光照方向

##### API
**Static Properties**  
这些属性是`Vector3`结构体的常用快捷方式，简化了常见的方向或特殊值的表示，使得代码更简洁易读

| Property           | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| `back`             | 等价于 `Vector3(0, 0, -1)`。                                                               |
| `down`             | 等价于 `Vector3(0, -1, 0)`。                                                               |
| `forward`          | 等价于 `Vector3(0, 0, 1)`。                                                                |
| `left`             | 等价于 `Vector3(-1, 0, 0)`。                                                               |
| `negativeInfinity` | 等价于 `Vector3(float.NegativeInfinity, float.NegativeInfinity, float.NegativeInfinity)`，表示`-∞` |
| `one`              | 等价于 `Vector3(1, 1, 1)`。                                                                |
| `positiveInfinity` | 等价于 `Vector3(float.PositiveInfinity, float.PositiveInfinity, float.PositiveInfinity)`，表示`+∞` |
| `right`            | 等价于 `Vector3(1, 0, 0)`。                                                                |
| `up`               | 等价于 `Vector3(0, 1, 0)`。                                                                |
| `zero`             | 等价于 `Vector3(0, 0, 0)`。                                                                |

- `negativeInfinity`（负无穷）
  - 定义：表示负无穷大的值
  - 类型：`float.NegativeInfinity`
  - 常见用途
    - 初始化最小值：可以用`negativeInfinity`来初始化一个变量，使其值总是比任何数值都小。例如，在计算最小值时，可以用它来确保首次比较时能正确地更新最小值
    - 比较：用于处理在算法中可能遇到的负无穷大值，比如图形计算中的不可达距离

- `positiveInfinity`（正无穷）
  - 定义：表示正无穷大的值
  - 类型：`float.PositiveInfinity`
  - 常见用途：
      - 初始化最大值：用 `positiveInfinity` 来初始化一个变量，使其值总是比任何数值都大。例如，在计算最大值时，可以用它来确保首次比较时能正确地更新最大值。
      - 比较：用于处理可能出现的正无穷大值，例如在图形学中表示无法到达的最大距离或算法中的最大值。

**Properties**

| Property       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `magnitude`    | 返回此向量的长度（只读）。                                          |
| `normalized`   | 返回基于当前向量的标准化向量。标准化后的向量长度为 1，并与当前向量方向相同。如果当前向量太小，返回零向量。 |
| `sqrMagnitude` | 返回此向量的平方长度（只读）。                                        |
| `this[int]`    | 通过 `[0]`、`[1]`、`[2]` 分别访问向量的 x、y、z 分量。                 |
| `x`            | 向量的 x 分量。                                              |
| `y`            | 向量的 y 分量。                                              |
| `z`            | 向量的 z 分量。                                              |

**Constructors**

| COnstructor | Description |
| - | - |
| `Vector3` | 创建一个三维向量或点 | 

**Public Methods**

| Method     | Description                  |
| ---------- | ---------------------------- |
| `Equals`   | 如果给定的向量与当前向量完全相等，返回 `true`。  |
| `Set`      | 设置现有 `Vector3` 的 x、y 和 z 分量。 |
| `ToString` | 返回该向量的格式化字符串表示。"(x, y, z)" |


**Static Methods**

| Method           | Description                                    |
| ---------------- | ---------------------------------------------- |
| `Angle`          | 计算两个向量之间的夹角。                                   |
| `ClampMagnitude` | 返回一个新的向量，最大长度被限制为 `maxLength`。                 |
| `Cross`          | 计算两个三维向量的叉积。                                   |
| `Distance`       | 计算两个三维点之间的距离。                                  |
| `Dot`            | 计算两个三维向量的点积，定义在相同坐标空间中。                        |
| `Lerp`           | 在两个点之间进行线性插值。                                  |
| `LerpUnclamped`  | 在两个向量之间进行线性插值，不限制插值范围。                         |
| `Max`            | 返回一个由两个向量中最大分量组成的向量。                           |
| `Min`            | 返回一个由两个向量中最小分量组成的向量。                           |
| `MoveTowards`    | 计算一个位置，当前位置到目标位置的最大移动距离不超过 `maxDistanceDelta`。 |
| `Normalize`      | 将向量标准化，使其长度为 1。                                |
| `OrthoNormalize` | 使两个向量都标准化并且相互正交。                               |
| `Project`        | 将一个向量投影到另一个向量上。                                |
| `ProjectOnPlane` | 将一个向量投影到一个平面上。                                 |
| `Reflect`        | 将向量反射到由法线定义的平面上。                               |
| `RotateTowards`  | 将一个向量 `current` 旋转到目标向量 `target`，并计算旋转。        |
| `Scale`          | 逐分量地将两个向量相乘。                                   |
| `SignedAngle`    | 计算两个向量之间相对于某一轴的带符号夹角。                          |
| `Slerp`          | 在两个三维向量之间进行球面线性插值。                             |
| `SlerpUnclamped` | 在两个向量之间进行球面线性插值，不限制插值范围。                       |
| `SmoothDamp`     | 逐渐地将向量朝着目标位置变化，随着时间变化。                         |

**Operators**

| Operator      | Description            |
| ------------- | ---------------------- |
| `operator -`  | 将一个向量从另一个向量中减去。        |
| `operator !=` | 如果两个向量不同，则返回 `true`。   |
| `operator *`  | 将一个向量与一个数值相乘（逐分量相乘）。   |
| `operator /`  | 将一个向量与一个数值相除（逐分量相除）。   |
| `operator +`  | 两个三维向量进行逐分量加法。         |
| `operator ==` | 如果两个向量大致相等，则返回 `true`。 |

[Unity官方文档（Vector3）](https://docs.unity3d.com/ScriptReference/Vector3.html)


#### Vector4（四维向量）
```csharp
Vector4 v = new Vector4(1, 2, 3, 4);
```
常见用途：
- 齐次坐标（矩阵变换常用）
- 传递颜色（Color在底层可能是Vector4(r,g,b,a)）
- shader开发中用于高级数学运算（如平面方程、切线空间等）

### Quaternion & Euler Angles
在Unity中，Quaternion是用来表示旋转的核心数学结构，它避免了Euler Angles的万向节死锁问题，并且适用于平滑插值和复杂3D计算  

#### Quaternion
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
#### Euler Angles

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

### Matrix4×4
在 Unity 中，Matrix4x4 是一个 4x4 的矩阵，通常用于表示和处理 3D 图形变换（例如：平移、旋转、缩放）以及投影变换。它是 Unity 中进行图形学计算时不可或缺的工具之一，特别是在操作坐标系变换和投影时，矩阵起到了重要作用。

#### 结构和基本概念
一个 4x4 的矩阵包含 16 个元素，用来存储 3D 空间中的变换信息。矩阵通常表示为：

$$
\begin{bmatrix}
m_00 & m_01 & m_02 & m_03\\
m_10 & m_11 & m_12 & m_13\\
m_20 & m_21 & m_22 & m_23\\
m_30 & m_31 & m_32 & m_33
\end{bmatrix}
$$

- 前三列（前三个3D向量）：表示选择、缩放和剪切变换
- 最后一列：通常表示平移
- 最后一行：在Unity中一般被设置为`[0, 0, 0, 1]`，它不参与位置和方向的变换，但在某些情况下（如透视投影）可能会发生变化

#### Matrix4×4的常见用途
1) 变换（Transformations）
在3D图形中，变换通常包含平移（Translation）、旋转（Rotation）和缩放（Scaling），这些都可以通过矩阵来表示。矩阵变换是通过矩阵与向量的乘法实现的
  - 平移矩阵：
    通过矩阵中的第四列来实现物体的平移

    $ Translation\;Matrix = \begin{bmatrix} 1 & 0 & 0 & tx\\ 0 & 1 & 0 & ty\\ 0 & 0 & 1 & tz\\ 0 & 0 & 0 & 1 \end{bmatrix} $

    其中，`tx`,`ty`,`tz`是在X,Y,Z轴上的平移距离

  - 旋转矩阵：
    旋转矩阵用于旋转物体在不同轴上的旋转。旋转矩阵有不同的表示方式，常见的是绕X,Y,Z轴旋转的矩阵：
      - 绕X轴旋转：
        ```math
        Rotation\;Matrix(X)=\begin{bmatrix} 1 & 0 & 0 & 0\\ 0 & cos(θ) & -sin(θ) & 0\\ 0 & sin(θ) & cos(θ) & 0\\ 0 & 0 & 0 & 1\end{bmatrix}
        ```

      - 绕Y轴旋转
       ```math
       Rotation\;Matrix(Y)=\begin{bmatrix} cos(θ) & 0 & sin(θ) & 0\\ 0 & 1 & 0 & 0\\ -sin(θ) & 0 & cos(θ) & 0\\ 0 & 0 & 0 & 1\end{bmatrix} 
       ```
       
    
      - 绕Z轴旋转：
        ```math
        Rotation\;Matrix(Z)=\begin{bmatrix} cos(θ) & 0 & sin(θ) & 0\\ 0 & 1 & 0 & 0\\ -sin(θ) & 0 & cos(θ) & 0\\ 0 & 0 & 0 & 1\end{bmatrix} 
        ```
    其中`θ`代表旋转角度

  - 缩放矩阵：
    缩放矩阵控制物体在各个轴上的缩放：
     ```math
    Scale\;Matrix=\begin{bmatrix} sx & 0 & 0 & 0\\ 0 & sy & 0 & 0\\ 0 & 0 & sz & 0\\ 0 & 0 & 0 & 1\end{bmatrix} 
    ```

    其中，`sx`,`sy`,`sz`代表X,Y,Z轴上的缩放因子

2) 矩阵乘法
多个变换（如平移、旋转、缩放）可以通过矩阵乘法结合起来。例如，将旋转和缩放变换合并到一个矩阵中，执行复合变换。
- 如果你有两个矩阵`M1`和`M2`，则复合变换矩阵是通过矩阵乘法得到的：`M = M1 * M2`
- 在Unity中，矩阵乘法通过`Matrix4×4`的`*`操作符完成
```cs
Matrix4x4 rotationMatrix = Matrix4x4.Rotate(Quaternion.Euler(0, 45, 0));
Matrix4x4 scaleMatrix = Matrix4x4.Scale(new Vector3(2, 2, 2));
Matrix4x4 combinedMatrix = rotationMatrix * scaleMatrix; // 复合变换
```

3) 投影矩阵
投影矩阵用于将 3D 场景投影到 2D 屏幕上。常见的投影有 正射投影 和 透视投影。

- 透视投影矩阵：
  透视投影矩阵会产生“透视效果”，即远处的物体看起来更小。透视矩阵的公式通常比较复杂，Unity 提供了 `Matrix4x4.Perspective` 方法来生成透视投影矩阵。
  ```cs
  Matrix4x4 perspectiveMatrix = Matrix4x4.Perspective(60f, 16f/9f, 0.1f, 100f);
  ```
  其中，`60f`是垂直视野角度，`16/9f`是宽高比，`0.1f`和`100f`是近平面和远平面的距离
- 正射投影矩阵
  正射投影没有透视效果，所有物体的大小都是相同的，不随远近变化。可以通过 Matrix4x4.Ortho 来创建
  ```cs
  Matrix4x4 orthoMatrix = Matrix4x4.Ortho(-5f, 5f, -5f, 5f, 0.1f, 100f);
  ```

4) 视图矩阵（View Matrix）
视图矩阵用于描述相机在场景中的位置和朝向。它把世界空间中的物体转换到相机的视图空间
- Unity中可以通过`Camera.worldToCameraMatrix`获取视图矩阵

#### API
**Static Properties**

| Property   | Description         |
| ---------- | ------------------- |
| `identity` | 返回单位矩阵（只读） |
| `zero`     | 返回零矩阵（只读） |

**Properties**

| Property              | Description                     |
| --------------------- | ------------------------------- |
| `decomposeProjection` | 该属性接受一个投影矩阵并返回定义投影视锥体的六个平面坐标。   |
| `determinant`         | 返回矩阵的行列式（只读）。                   |
| `inverse`             | 返回该矩阵的逆矩阵（只读）。                  |
| `isIdentity`          | 检查此矩阵是否为单位矩阵（只读）。               |
| `lossyScale`          | 尝试从矩阵中获取一个缩放值（只读）。              |
| `rotation`            | 尝试从矩阵中获取一个旋转四元数。                |
| `this[int, int]`      | 访问矩阵中的元素，使用 `[row, column]` 索引。 |
| `transpose`           | 返回矩阵的转置矩阵（只读）。                  |

**Public Methods**

| Method             | Description                      |
| ------------------ | -------------------------------- |
| `GetColumn`        | 获取矩阵的某一列。                        |
| `GetPosition`      | 从矩阵中获取位置向量。                      |
| `GetRow`           | 返回矩阵的某一行。                        |
| `MultiplyPoint`    | 使用此矩阵对一个位置进行变换（通用）。              |
| `MultiplyPoint3x4` | 使用此矩阵对一个位置进行快速变换（适用于 3x4 矩阵）。    |
| `MultiplyVector`   | 使用此矩阵对一个方向进行变换。                  |
| `SetColumn`        | 设置矩阵的某一列。                        |
| `SetRow`           | 设置矩阵的某一行。                        |
| `SetTRS`           | 将此矩阵设置为一个平移、旋转和缩放矩阵。             |
| `ToString`         | 返回此矩阵的格式化字符串表示。                  |
| `TransformPlane`   | 返回一个在空间中经过变换的平面。                 |
| `ValidTRS`         | 检查此矩阵是否是一个有效的变换矩阵（平移、旋转、缩放组合矩阵）。 |

**Static Methods**

| Method            | Description                                  |
| ----------------- | -------------------------------------------- |
| `Frustum`         | 返回一个具有视景体（viewing frustum）的投影矩阵，近平面由传入的坐标定义。 |
| `Inverse3DAffine` | 计算一个 3D 仿射矩阵的逆矩阵。                            |
| `LookAt`          | 创建一个“Look At”矩阵，使物体朝向指定的目标点。                 |
| `Ortho`           | 创建一个正交投影矩阵。                                  |
| `Perspective`     | 创建一个透视投影矩阵。                                  |
| `Rotate`          | 创建一个旋转矩阵。                                    |
| `Scale`           | 创建一个缩放矩阵。                                    |
| `Translate`       | 创建一个平移矩阵。                                    |
| `TRS`             | 创建一个平移、旋转和缩放的组合矩阵。                           |

**Operators**

| Operator | Description |
| - | - |
| `operator*` | 两个矩阵相乘 |





## 2.游戏对象相关

| 类型                 | 说明                  |
| ------------------ | ------------------- |
| `GameObject`       | 场景中所有对象的基本单元        |
| `Component`        | 所有组件的基类             |
| `Transform`        | 表示物体的位置、旋转、缩放       |
| `MonoBehaviour`    | 用户自定义脚本的基类          |
| `ScriptableObject` | 可创建的资产类，用于数据管理      |
| `Object`           | Unity 所有对象的基类（包括资源） |


## 3.图形和渲染

| 类型                                      | 说明          |
| --------------------------------------- | ----------- |
| `Mesh`, `MeshRenderer`                  | 网格和其渲染组件    |
| `Material`                              | 材质资源        |
| `Shader`                                | 控制材质渲染效果的程序 |
| `Texture`, `Texture2D`, `RenderTexture` | 贴图资源        |
| `Camera`                                | 摄像机组件       |
| `Light`                                 | 灯光组件        |


## 4.物理相关

| 类型                                             | 说明                   |
| ---------------------------------------------- | -------------------- |
| `Rigidbody`, `Rigidbody2D`                     | 刚体，驱动物体物理行为          |
| `Collider`, `BoxCollider`, `SphereCollider`, 等 | 碰撞器                  |
| `Physics`, `Physics2D`                         | 提供物理检测和操作的静态类        |
| `Joint` 系列                                     | 链接两个刚体（如 HingeJoint） |
| `ContactPoint`                                 | 碰撞点信息结构体             |


## 5.输入和事件

| 类型                    | 说明         |
| --------------------- | ---------- |
| `Input`               | 输入系统静态类    |
| `KeyCode`             | 键盘按键枚举     |
| `Touch`, `TouchPhase` | 触摸输入相关     |
| `Event`, `EventType`  | GUI 系统事件类型 |


## 6.资源与序列化

| 类型                         | 说明                |
| -------------------------- | ----------------- |
| `Resources`, `AssetBundle` | 资源加载管理器           |
| `TextAsset`                | 文本资源，如 JSON、配置文件等 |
| `SerializableAttribute`    | 允许自定义类型序列化存储      |


## 7.UI（UGUI）

| 类型                                    | 说明                  |
| ------------------------------------- | ------------------- |
| `Canvas`, `CanvasRenderer`            | UI 根组件              |
| `RectTransform`                       | 用于 UI 布局的 Transform |
| `Image`, `Text`, `Button`, `Slider` 等 | 基础 UI 组件            |
| `EventSystem`                         | 管理 UI 输入事件          |


## 8.时间、协程与生命周期

| 类型                            | 说明                          |
| ----------------------------- | --------------------------- |
| `Time`                        | 时间相关（如 deltaTime、timeScale） |
| `WaitForSeconds`, `WaitUntil` | 协程等待辅助类                     |
| `Coroutine`                   | 协程对象类型                      |
