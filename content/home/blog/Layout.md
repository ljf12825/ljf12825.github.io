---
title: "Layout"
date: 2025-06-01
categories: [Note]
tags: [Unity, Unity System, UGUI]
author: "ljf12825"
summary: Introduction Layout Component
---

## Layout System
![LayoutSystem](/images/Blog/LayoutSystem.jpg)

### Layout Group
`Layout Group`是Unity UI自动布局系统的核心组件之一，用于在UI Canvas下自动排列其他子物体。它极大地简化了UI元素的排列和适配逻辑，让UI开发变得更结构化、响应式、更易维护

> `Layout Group`是一类MonoBehaviour脚本，用于自动排列RectTransform子物体的位置与尺寸，不需要你手动拖动它们

| 类型                      | 说明                | 用途示例         |
| ----------------------- | ----------------- | ------------ |
| `HorizontalLayoutGroup` | 子物体沿 **水平方向排列**   | 菜单栏、工具条、横向列表 |
| `VerticalLayoutGroup`   | 子物体沿 **垂直方向排列**   | 聊天记录、竖向按钮组   |
| `GridLayoutGroup`       | 子物体按 **网格排列**（行列） | 背包格子、关卡选择界面  |
| `LayoutGroup`           | 抽象基类              | 不直接使用        |


#### Horizontal / Vertical Layout Group

| 属性                   | 说明                  |
| -------------------- | ------------------- |
| `Padding`            | 容器四周的边距             |
| `Spacing`            | 子物体之间的间隔            |
| `Child Alignment`    | 子物体在主轴上的对齐方式（左/中/右） |
| `Reverse Arrangement`| 排列方向反转：从上到下 → 从下到上   |
| `Control Child Size` | 控制子物体是否填满空间         |
| `Use Child Scale`    | 是否使用子物体的缩放比例        |
| `Child Force Expand` | 启用时多个子物体会调整间距，以填充满Width或Height |

> Horizontal Layout Group适用场景：菜单栏、Tab标签页、道具快捷栏等

> Vertical Layout Group适用场景：排行榜列表、聊天内容、选项按钮组等

#### Grid Layout Group
用于将子物体排列成规则网格，每个格子的大小统一

| 属性             | 说明              |
| -------------- | --------------- |
| `Padding`      | 容器四周的边距
| `Cell Size`    | 每个格子的宽高         |
| `Spacing`      | 格子之间的间距         |
| `Start Corner` | 从哪个角开始排列        |
| `Start Axis`   | 是优先横向填充还是纵向     |
| `Child Alignment` | 子物体整体对齐方式      |
| `Constraint`   | 行数/列数限制（可固定行或列） |

> 使用场景：背包系统、九宫格、商城道具、分页列表

#### 常见问题

| 问题                                  | 原因 / 解决方式                                          |
| ----------------------------------- | -------------------------------------------------- |
| 改了内容不刷新布局                           | 调用 `LayoutRebuilder.ForceRebuildLayoutImmediate()` |
| 动态添加元素时抖动                           | 先 `SetActive(false)` 再添加，最后 `SetActive(true)`      |
| 动画或手动设置位置被覆盖                        | LayoutGroup 会自动控制，需禁用 LayoutGroup 才能手动操作           |
| ContentSizeFitter + LayoutGroup 死循环 | 不要放在同一个 GameObject 上                               |

### Layout Element
`Layout Element`用于告诉布局系统如何排布当前UI元素，它本身不会影响UI的大小或位置，而是为其所在的`Layout Group`提供布局建议（尺寸、优先级等），从而参与整个UI的自动布局流程

| 属性                           | 含义       | 举例说明                           |
| ---------------------------- | -------- | ------------------------------ |
| **Ignore Layout**            | 是否忽略布局系统 | 设置为 `true` 会让 Layout Group 忽略它 |
| **Min Width / Height**       | 最小宽高     | 不小于这个尺寸                        |
| **Preferred Width / Height** | 首选宽高     | 想要的尺寸（如果有空间）                   |
| **Flexible Width / Height**  | 灵活宽高     | 有多大就能占多大，类似“权重” ，多个元素剩余空间分配按权重计算 |
| **Layout Priority**          | 优先级       | 如果GameObject上有多个布局相关组件，按优先级顺序计算，优先级与数值成正比 |

#### 常见用途

| 场景         | 使用方式                             |
| ---------- | -------------------------------- |
| 某个按钮不想自动拉伸 | 设置 `Flexible Width = 0`          |
| 聊天条自动增长宽度  | 设置 `Preferred Width = Text 宽度`   |
| 图片强制保持比例   | 设置 `Preferred Width/Height` 同步更新 |
| 某个子元素不参与布局 | 勾选 `Ignore Layout`               |

### Content Size Fitter
`Content Size Fitter`用于让UI元素根据其子元素或自身内容的大小，自动调整RectTransform的尺寸，是实现响应式UI的关键工具之一

比如：让聊天气泡、弹窗、按钮、文字背景根据内容自动扩展

| 属性名                | 类型   | 说明            |
| ------------------ | ---- | ------------- |
| **Horizontal Fit** | enum | 控制横向尺寸的自动适配方式 |
| **Vertical Fit**   | enum | 控制纵向尺寸的自动适配方式 |

每个方向的选项有三种：
- `Unconstrained`（不自动适配，默认）
- `Min Size`（缩小到最小可用大小）
- `Preferred Size`（扩展到推荐大小）

#### 常见用途

| 使用场景              | 使用方式                                                                             |
| ----------------- | -------------------------------------------------------------------------------- |
| 聊天气泡自动撑开          | `Vertical Fit = Preferred Size`（文本高度）<br>`Horizontal Fit = Preferred Size`（文本宽度） |
| 按钮随文字自适应宽度        | 按钮 Image + Text + `ContentSizeFitter`                                            |
| ScrollView 内容自动撑开 | 在 Content 上加 `ContentSizeFitter` + `Layout Group`                                |
| 警告弹窗根据文本自动扩展大小    | Text + 背景图 + ContentSizeFitter                                                   |

#### 常见问题

| 问题                 | 原因 & 解决方案                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| 和 LayoutGroup 冲突 | **不要把 ContentSizeFitter 和 LayoutGroup 放在同一个 GameObject 上**，要分开：父挂 LayoutGroup，子挂 ContentSizeFitter |
| 内容变了但尺寸没变          | 调用：`LayoutRebuilder.ForceRebuildLayoutImmediate(transform as RectTransform)` 手动刷新                  |
| 不生效                | 子物体未使用 `LayoutElement` 或未正确设置 `Preferred Size`                                                     |
| UI 抖动              | 动态内容更新太频繁，建议只在必要时刷新布局                                                                              |

#### 示例
##### 动态文字撑开背景

```cs
public TextMeshProUGUI messageText;
public RectTransform bubble;

void SetMessage(string msg)
{
  messageText.text = msg;
  LayoutRebuilder.ForceRebuildLayoutImmediate(bubble);
}
```

##### 聊天列表自动滚到底
搭配`ScrollRect`：
- 在`Content`上加`VerticalLayoutGroup + ContentSizeFitter`
- 发送新消息后滚动到底部

### Aspect Ratio Fitter
`Aspect Ratio Fitter`用于强制一个UI元素保持固定的宽高比（Aspect Ratio），无论父物体如何拉伸、屏幕怎么变化，它都能保持比例不变

通常用于：
- 图片防拉伸
- 视频播放器窗口
- 正方形/圆形按钮保持比例
- 多分辨率适配中的UI统一性

#### 属性说明

| 属性名              | 类型    | 含义                    |
| ---------------- | ----- | --------------------- |
| **Aspect Mode**  | 枚举    | 控制哪个方向跟随调整以维持宽高比      |
| **Aspect Ratio** | float | 目标宽高比（width / height） |

##### Aspect Mode

| 模式                      | 含义                     |
| ----------------------- | ---------------------- |
| `None`                  | 不启用比例适配                |
| `Width Controls Height` | 宽度不变，根据宽度调整高度          |
| `Height Controls Width` | 高度不变，根据高度调整宽度          |
| `Fit In Parent`         | 保持比例并完全包含在父物体内（不裁剪）    |
| `Envelope Parent`       | 保持比例并**覆盖整个父物体**（可能裁剪） |
