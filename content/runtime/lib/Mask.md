---
title: "Mask"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Component, Rendering, Graphics, UGUI]
author: "ljf12825"
type: blog
summary: Introduction mask principle and usage in Unity
---
遮罩，用于实现遮挡效果，控制子物体的显示区域

![MaskPanel](/images/Blog/MaskPanel.jpg)

## Mask
`Mask`用于裁剪UI子元素的显示区域，通常搭配图片、Scroll View、头像裁剪等使用

### 核心功能和行为

| 特点                    | 说明                                     |
| --------------------- | -------------------------------------- |
|  子物体只在 Mask 图像区域内显示  | 超出部分不可见（不销毁，只裁剪）                       |
|  遮罩区域基于 `Image` 的透明度 | 非透明部分就是显示区域                            |
|  不支持软遮罩（软边缘）         | 默认是硬裁剪，想要软遮罩需用 Shader 或 `UIEffect` 等插件 |

### 使用方法
```plaintext
MaskParent(Image + Mask)
|___Content(Text / Image /等UI)
```
- 父物体挂`Image` + `Mask`，并设置图片为遮罩区域
- 子物体放置UI内容，超出遮罩图形范围会被裁剪

### 常见用途

| 场景              | 使用方式                                |
| --------------- | ----------------------------------- |
| ScrollView 滚动列表 | Viewport 挂 `Image + Mask`，内容只显示在视窗中 |
| 圆形头像裁剪          | 使用圆形 `Image + Mask` 裁剪方形头像图片        |
| 进度条遮罩           | 遮罩下滑动另一个图片或文字，实现“擦除”或“揭示”效果         |
| 文字遮挡/选中效果       | 对文字进行遮罩只显示一部分或高亮部分                  |

### 裁剪区域
`Mask`裁剪的区域由挂载`Mask`的GameObject的`Image`的Alpha通道决定

| Image 类型            | Mask 效果                  |
| ------------------- | ------------------------ |
| Sprite (Alpha通道)    | 透明处裁剪，实色处显示              |
| Sprite (无 Alpha 通道) | 整张图片为裁剪区域                |
| 没有 Image 组件         | `Mask` 不起作用（它依赖 `Image`） |

> Image的`Raycast Target`设置不影响裁剪，但影响事件响应

## Rect Mask 2D
`RectMask2D`是Unity UI中专为矩形区域裁剪而设计的遮罩组件，功能和`Mask`类似，但更高效、轻量，只适用于矩形裁剪

| 特性                   | `RectMask2D`   | `Mask`                    |
| -------------------- | -------------- | ------------------------- |
| **遮罩形状**             | 只能是矩形          | 任意形状（基于 alpha 通道）         |
| **性能**               | 高效           | 相对较低（使用 Stencil Buffer） |
| **软遮罩支持**            | 不支持          | 也不支持（需 Shader 实现）       |
| **需要 Image 吗**       | 不需要          | 必须有 Image（带 alpha）      |
| **ScrollView 默认用谁？** | `RectMask2D` | 不是默认组件                  |

- Softness：控制边缘模糊程度，让裁剪区域的边缘不再是生硬的“硬切线”，而是具有渐隐的柔和效果，也就是软遮罩

```plaintext
RectMask2D.softness = new Vector2(x, y);
```

| 分量  | 含义          |
| --- | ----------- |
| `x` | 左右边缘的模糊像素距离 |
| `y` | 上下边缘的模糊像素距离 |

- 单位是像素数（会随Canvas的Pixel-Per-Unit放大缩小）
- 值越大，模糊过渡越宽
- 值为0时，表现为传统的硬遮罩

### 结构示例：聊天滚动列表

```plaintext
Scroll View
|——Viewport(RectMask2D)
      |__Content（垂直布局 + 自动扩展）
```

- `Viewport`是可视区域，挂`RectMask2D`
- 子元素（Content）会被限制在Viewport范围内，超出部分不可见

### 工作原理
- 裁剪区域 = RectTransform可视区域
- 所有超出这个矩形范围的子元素将不被渲染
- 实现方式基于剪裁矩形，无需stencil buffer，比`Mask`性能更高
- 不依赖图片、不使用alpha通道

## Sprite Mask
`Sprite Mask`时Unity中专为2D精灵系统设计的遮罩组件，用来让某些Sprite按遮罩的形状显示或隐藏，相比UI中的传统`Mask`和`RectMask2D`，它属于2D渲染层级遮罩机制，用于SpriteRenderer渲染对象的裁剪

`Sprite Mask`是一个形状遮罩，允许受控的Sprite只在遮罩区域内渲染，超出部分将不可见

它通常用于：
- 地图”探索雾“
- 道具高亮显示
- 角色潜行、隐身剪影
- Sprite动画部分揭示
- 类似”圆形裁剪头像“的2D实现

### 使用结构示例
```plaintext
SpriteMask (Mask 控制区域)
└── SpriteA (Renderer 被遮罩)
```
或者平行结构也可以
```plaintext
SpriteMask
SpriteA (设置受 Sprite Mask 控制)
```
### 使用方法
1.添加Sprite Mask
- 添加一个空物体，挂`Sprite Mask`组件
- 设置遮罩图形：选择一个带alpha的Sprite（通常是圆形/自定义形状）

2.被遮罩的Sprite设置：  
在`Sprite Renderer`上：
- Mask Interaction设置为：
  - `None`：不受任何遮罩影响
  - `Visible Inside Mask`：仅在遮罩区域内可见
  - `Visible Outside Mask`：仅在遮罩区域外可见

| 参数                           | 含义                             |
| ---------------------------- | ------------------------------ |
| **Sprite**                   | 遮罩形状，使用 Sprite 的 alpha 通道      |
| **Alpha Cutoff**             | 判定透明与非透明的阈值                    |
| **Custom Range**             | 设置可见层范围（Sorting Layer 和 Order） |
| **Sprite Sort Point**        | 以哪个点作为Sprite的排序基准点     |

### 示例
#### 地图探索雾系统
```plaintext
地图遮罩 (SpriteMask：黑色圆形)
角色头顶 (Sprite：Visible Inside Mask)
→ 角色周围区域可见，其余为黑
```

#### 裁剪头像
```plaintext
头像边框 (圆形 SpriteMask)
头像图片 (SpriteRenderer：Visible Inside Mask)
```

#### 潜行效果
遮罩外隐藏角色：
- SpriteRenderer设置为`Visible Inside Mask`
- 动画移动`SpriteMask`即可动态揭示角色
