---
title: "UI Event System"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Component, UGUI]
author: "ljf12825"
type: log
summary: Unity UI Event System, Raycaster, Event Trigger, Focus, Navigation
---
`Event System`是Unity UI System中的核心交互管理器，掌控了所有鼠标点击、键盘输入、触摸事件、UI导航的逻辑

Unity的Event System是一个处理用户输入事件的系统，用于发送“点击了谁”“选中了谁”之类的事件，属于UnityEngine.EventSystems命名空间

![EventSystemPanel](/images/content/EventSystemPanel.jpg)

| 组件                                | 用途                                                    |
| --------------------------------- | ----------------------------------------------------- |
| **Event System**                   | 整个输入系统的“大脑”                                           |
| **Input Module**                  | 输入方式模块，比如处理鼠标、键盘、手柄（你可以切换）                            |
| **Raycaster（挂在 Canvas 或 3D 对象上）** | 实际检测点击了哪个物体，比如：`GraphicRaycaster`, `PhysicsRaycaster` |
| **Event Trigger**                 | 通过Inspector可视化配置多种事件响应 |
| **Touch Input Module**            | 输入方式模块，专门负责处理触摸输入事件，适用于手机、平板等触控设备 |

EventSystem会追踪以下交互：

| 类型       | 描述                  | 接口                                                     |
| -------- | ------------------- | ------------------------------------------------------ |
| 点击 Click | 鼠标/触摸点击 UI          | `IPointerClickHandler`                                 |
| 拖拽 Drag  | 拖拽 ScrollRect、物品、滑块 | `IDragHandler`, `IBeginDragHandler`, `IEndDragHandler` |
| 悬停 Hover | 鼠标移动到 UI 上          | `IPointerEnterHandler`, `IPointerExitHandler`          |
| 按钮按下     | 长按、释放               | `IPointerDownHandler`, `IPointerUpHandler`             |
| 键盘导航     | 方向键移动焦点             | `IMoveHandler`                                         |
| 输入       | 表单输入                | `ISubmitHandler`, `ISelectHandler`                     |

任何的UI交互脚本，都是通过这些接口连接到Event System

## EventSystem的工作流程图

```css
[鼠标/键盘/触摸输入]
      ↓
[Input Module] → 分析输入（比如点击、拖动、导航）
      ↓
[Raycaster] → 检测点击了哪个 UI 元素
      ↓
[EventSystem] → 通知对应的组件执行接口函数（如 OnClick）
```

## EventSystem Component
### `EventSystem`
挂载在GameObject上，只有一个  
功能：  
- 管理当前选中的UI对象
- 管理输入模块
- 分发事件：比如点击、拖动、选中等

### EventSystem Panel

| 属性                         | 含义                   |
| -------------------------- | -------------------- |
| **First Selected**         | 初始选中的 UI 对象（用于导航/手柄） |
| **Send Navigation Events** | 是否允许方向键或手柄移动选中项      |
| **Drag Threshold**         | 拖拽时鼠标/手指移动多少才视为“拖拽”  |

### `Standalone Input Module`
适合：鼠标 + 键盘控制  
Unity默认生成  
功能：把输入映射为事件（点击、拖动、导航）

| 属性                              | 说明                                     |
| ------------------------------- | -------------------------------------- |
| Send Pointer Hover To Parent    | 是否强制启用这个模块                             |
| Horizontal Axis / Vertical Axis | 对应键盘方向键（默认是 "Horizontal" 和 "Vertical"） |
| Submit Button / Cancel Button   | 默认是 "Submit"（Enter）和 "Cancel"（Esc）     |
| Input Actions Per Second        | 每秒导航几次                                 |
| Repeat Delay                    | 长按导航前的延迟时间                             |

### `Input System UI Input Module`（新系统）

详见[Input System](log/Input-System/)

适合：新版Unity Input System（使用`Input Actions`的）

| 属性                                  | 说明                       |
| ----------------------------------- | ------------------------ |
| Actions Asset                       | 你设置好的 `.inputactions` 文件 |
| Point / Click / Navigate / Submit 等 | 分别绑定触摸、点击、方向等操作          |
| Move Repeat Rate / Delay            | 同样是手柄方向键长按节奏             |


### Raycaster
EventSystem本身不会知道你点到谁，它需要Raycaster组件配合UI或3D元素

#### `Graphic Raycaster`（用于Canvas UI）
挂在`Canvas`上，专门检测UI元素是否被点中

[Canvas Graphic Raycaster](#graphic-raycaster)

#### `Physics Raycaster`（用于3D物体）
挂在摄像机上，配合3D对象（带Collider）使用，检测鼠标是否点击到物体

#### `Physics2D Raycaster`（用于2D物体）
配合2D Collider检测点击或拖动等交互

### Event Trigger
- 方便地给一个UI元素或者任何GameObject绑定多种事件回调
- 支持的事件类型包括点击、拖拽、指针进入、指针离开等常用事件
- 不需要写代码实现接口，只需要在Inspector面板力配置回调函数（比如拖拽一个脚本组件的方法）

#### 内部原理
- EventTrigger继承自MonoBehaviour，实现了`IEventSystemHandler`中所有相关事件接口（如`IPointerClickHandler`、`IDragHandler`等）
- 当事件被派发到该GameObject时，EventTrigger会收到回调（例如`OnPointerClick`）
- EventTrigger根据收到的事件类型，在它的事件列表中查找对应的`Entry`，然后调用所有绑定的回调函数

| 优点            | 缺点               |
| ------------- | ---------------- |
| 方便快捷，适合快速绑定事件 | 性能稍差，复杂项目不建议大量使用 |
| 无需写代码，设计灵活    | 事件流程不透明，调试困难     |
| 适合简单交互原型      | 绑定过多事件会影响维护和阅读   |

EventTrigger适用于设计师或非程序员，使其能够在Inspector里直接配置各种事件响应

### Touch Input Module
#### 工作原理
1.检测触摸事件  
`TouchInputModule`监听`Input.touches`，获取当前所有触摸点  
2.生成PointerEventData  
每个触摸点对应一个PointerEventData，包含位置、按下时间、手指ID等信息  
3.射线检测   
根据触摸点位置对场景进行射线检测，找到被触摸的UI或物体  
4.事件分发  
通过`ExecuteEvents`把对应事件派发给目标物体的事件处理接口  
5.处理多点触控  
支持同时跟踪多个触摸点，分别生成和管理多个PointerEventData

- 早期Unity中，StandaloneInputModule主要处理键鼠，TouchInputModule专门处理触摸
- 现在，StandaloneInputModule已经扩展支持触摸事件
- 使用新版Unity输入系统时，推荐用`Input System UI Input Module`



## API
### Static Properties

| 属性 | 描述 |
| - | - |
| `current` | 返回当前EventSystem |

### Properties

| 属性                          | 类型                | 说明                                                                                  |
| --------------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| `alreadySelecting`          | `bool`            | **只读**属性，表示 EventSystem 当前是否正在执行 `SetSelectedGameObject()`。<br> 一般用于内部防止递归调用选中事件。 |
| `currentInputModule`        | `BaseInputModule` | 当前正在使用的输入模块（如 `StandaloneInputModule` 或 `InputSystemUIInputModule`）。                |
| `currentSelectedGameObject` | `GameObject`      | 当前选中的 UI 对象（例如当前焦点在某个按钮上时，这就是那个按钮）。                                                 |
| `firstSelectedGameObject`   | `GameObject`      | 场景加载或 EventSystem 启动时最初被选中的对象（通常用于手柄/键盘导航）。                                         |
| `isFocused`                 | `bool`            | 表示 EventSystem 是否处于“聚焦”状态。<br>在 PC 上，这通常意味着游戏窗口是否处于激活状态（失焦时不响应输入）。                  |
| `pixelDragThreshold`        | `int`             | 拖动时鼠标或手指要移动多少像素才算开始拖拽（用来防止误触拖动）。默认是 5。                                              |
| `sendNavigationEvents`      | `bool`            | 是否启用方向键/手柄的导航事件（如按 ↑↓←→ 移动 UI 选择框）。关闭后不能用方向键移动焦点。                                   |

### Public Methods

| 方法                          | 作用                | 常见用途           |
| --------------------------- | ----------------- | -------------- |
| `IsPointerOverGameObject()` | 判断鼠标/手指是否悬停在 UI 上 | 做点击穿透判断        |
| `RaycastAll()`              | 手动执行一次 UI 射线检测    | 获取所有命中的 UI 元素  |
| `SetSelectedGameObject()`   | 设置当前聚焦的 UI        | 控制导航焦点         |
| `UpdateModules()`           | 刷新输入模块            | 很少手动用，一般系统自动处理 |

## Focus
在UI系统中，焦点（Focus）是指当前“被选中、正在响应输入”的UI元素

它表现为：
- 手柄/键盘控制时，按钮会被“高亮”
- 输入框获得焦点后，可以输入文字
- 焦点组件会响应`OnSelect`、`OnDeselect`、`ISubmitHandler`等接口

**焦点只对以下操作有效：**  

| 操作           | 依赖焦点                 |
| ------------ | -------------------- |
| 按方向键移动 UI 选择 |  依赖                 |
| 按 Enter 提交按钮 |  依赖                 |
| 输入框自动聚焦后可打字  |  依赖                 |
| 鼠标点击按钮       |  不依赖焦点（靠点击 Raycast） |

```cs
EventSystem.current.currentSelectedGameObject
```
这就是当前拥有焦点的那个UI元素

### 示例
1.打开页面时设置初始焦点

```cs
public GameObject defaultButton;

void OnEnable()
{
  EventSystem.current.SetSelectedGameObject(null); // 清空旧焦点
  EventSystem.current.SetSelectedGameObject(defaultButton);
}

```

2.按键触发当前焦点的“提交”

```cs
void Update()
{
  if (Input.GetKeyDown(KeyCode.Return))
  {
    var go = EventSystem.currentSelectedGameObject;

    if (go != null)
        ExecuteEvents.Execute<ISubmitHandler>(go, new BaseEventData(EventSystem.current), ExecuteEvents.submitHandler);
  }
}

```

### 焦点与导航（方向键控制）
每个`Selectable`UI（比如 Button、Toggle、InputField）都有导航设置

```cs
Navigation nav = myButton.navigation;
nav.mode = Navigation.Mode.Eplicit;
nav.delectOnRight = anotherButton;
myButton.navigation = nav;
```
按下方向键，跳转到指定的UI元素

## Navigation
用户可以通过键盘、手柄、遥控器等输入设备，在UI组件之间切换焦点并触发交互

导航的核心是EventSystem，它负责追踪当前的Selected GameObject，处理导航方向输入

Selectable系列组件包含导航信息，决定方向键或手柄移动时焦点跳转到哪个元素，UI组件都继承自Selectable类

属性：
- `Navigation`：定义导航方式和目标
  - None：禁用导航
  - Horizontal/Vertical：自动寻找相邻组件
  - Automatic：Unity自动推断相邻组件
  - Explicit：手动指定每个方向的目标组件

### 建议
- 尽量在PC/主机UI中设置清晰的导航路径
- 尽可能使用Explicit导航，避免自动导航出错
- 初始界面时设置默认选中项（通过`EventSystem.current.SetSelectedGameObjct`）
- 遇到复杂导航需求时，可自定义导航逻辑

### 常见问题
- EventSystem丢失或禁用，导致导航无效
- 同一帧中多个`SetSelectedGameObject`造成焦点混乱
- Navigation设置为None/Automatic导致意外行为
- 多个可交互对象重叠或遮挡，Unity自动导航判定错误
