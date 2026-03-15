---
title: "Input System"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Unity System]
author: "ljf12825"
type: log
summary: Introduction and usage of older and new input system
---
Unity目前存在新旧两个输入系统，旧输入系统（Input类）和新输入系统（Input System包）

## Unity旧输入系统（UnityEngine.Input）

这是Unity默认内建的输入方式，无配置即可用，使用非常直观，主要通过静态类`Input`获取各种输入信息  
- 适合快速开发与小型项目
- 不支持热插拔和玩家映射
- 键盘/鼠标输入最简单最稳定
- 建议仅在不考虑复杂输入要求的项目中使用

### 键盘输入
基本方法： 
```cs
Input.GetKey(KeyCode.X); //判断某键是否按住
Input.GetKeyDown(KeyCode.X); // 是否按下（只触发一帧）
Input.GetKeyUp(KeyCode.X)l // 是否刚抬起
```
> `KeyCode`是一个枚举，表示各种键盘和鼠标按键

### 鼠标输入
鼠标按钮
```cs
Input.GetMouseButton(int button);      // 0左键，1右键，2中键
Input.GetMouseButtonDown(int button);
Input.GetMouseButtonUp(int button);
```
鼠标位置和滚轮
```cs
Vector3 mousePos = Input.mousePosition;    // 屏幕坐标
float scrollDelta = Input.mouseScrollDelta.y; // 滚轮滑动
```

### 触摸屏输入（Touch）
移动端专用，支持多点触控
```cs
int count = Input.touchCount;

if (count > 0)
{
    Touch touch = Input.GetTouch(0);
    Debug.Log(touch.position); // 屏幕坐标
    Debug.Log(touch.phase); // Began, Moved, Stationary, Ended, Cancled
}
```

### 虚拟轴（Input Manager）
通过Unity的`Project Setting -> Input Manager`设置，可实现跨平台控制  
它允许你用统一的名字来访问不同平台或设备上的输入  
通过`Input.GetAxis("Horizontal")获取的是一个“横向控制”的抽象值，不需要关心是按了哪个具体按键或移动了哪个摇杆
```cs
float h = Input.GetAxis("Horizontal"); // A/D 或 左/右
float v = Input.GetAxis("Vertical"); // W/S 或 上/下

float raw = Input.GetAxisRaw("Horizontal"); //不经过平滑处理
```

常用默认名称列表

| 名称                  | 类型 | 默认映射键             | 描述              |
| ------------------- | -- | ----------------- | --------------- |
| `Horizontal`        | 轴  | A/D 键、←/→键、手柄左摇杆  | 左右移动轴，范围 -1 到 1 |
| `Vertical`          | 轴  | W/S 键、↑/↓键、手柄左摇杆  | 上下移动轴，范围 -1 到 1 |
| `Fire1`             | 按钮 | Ctrl、鼠标左键、手柄 A 键  | 攻击、射击等          |
| `Fire2`             | 按钮 | Alt、鼠标右键、手柄 B 键   | 次要攻击、取消         |
| `Fire3`             | 按钮 | Shift、鼠标中键、手柄 X 键 | 冲刺或特殊技能         |
| `Jump`              | 按钮 | 空格键、手柄 Y 键        | 跳跃              |
| `Mouse X`           | 轴  | 鼠标横向移动            | 相机/视角横向旋转       |
| `Mouse Y`           | 轴  | 鼠标纵向移动            | 相机/视角纵向旋转       |
| `Mouse ScrollWheel` | 轴  | 鼠标滚轮上下滚动          | 放大缩小、切换武器等      |
| `Submit`            | 按钮 | Enter、手柄 A 键      | UI确认            |
| `Cancel`            | 按钮 | Escape、手柄 B 键     | UI取消            |


### 手柄支持（旧系统的有限支持）
手柄也通过虚拟轴或`KeyCode.JoystickButton0`等访问，但：
- 设备不通用，配置复杂
- 不支持手柄热插拔
- 不支持多个玩家分开处理

## Unity新输入系统（Input System Package）
Unity为了解决旧系统的局限，引入了新输入系统，是一个模块化、可配置、支持多设备的专业输入方案

### 核心概念
**Input System**包
你需要在Unity的Package Manager中安装`Input System`包

**与旧系统的对比**

| 对比项   | 旧系统（Input Manager） | 新系统（Input System） |
| ----- | ------------------ | ----------------- |
| 支持设备  | 键鼠、手柄（有限）          | 键鼠、手柄、触控、移动传感器等   |
| 输入模式  | 较为被动，基于轮询          | 支持事件、轮询、回调        |
| 自定义操作 | 不支持                | 强大的 Action Map 系统 |
| 多玩家支持 | 手动管理               | 内建支持玩家输入分离        |
| 绑定方式  | 硬编码字符串             | 数据驱动 Asset 绑定     |

### 关键组成
**Input Action（输入动作）**  
核心概念是“输入动作”，它是抽象层，将具体按键与游戏行为解耦  
例如：Jump动作绑定Space键、Gamepad A键  
你可以创建一个`.inputactions`文件来集中管理动作映射

**Action Map**  
是Input Action的集合，例如：
- `Player`：Move、Jump、Fire
- `UI`：Navigate、Click、Cancel

**控制方案**
用于支持不同设备类型的输入方案，如：
- Keyboard&Mouse
- Gamepad
- Touch

### 使用流程（常规项目）

- 安装 Input System
  打开 Package Manager
  安装 Input System 包
  Unity 会提示是否启用新的输入系统（可双系统兼容）
- 创建 .inputactions 文件
  Assets -> Create -> Input Actions
  配置 Action Maps、Actions、Bindings
- 生成 C# 类
  勾选 Generate C# Class
  命名生成的类，如 PlayerInputActions.cs
- 在代码中使用
```cs
public class PlayerController : MonoBehaviour
{
    private PlayerInputActions inputActions;

    private void Awake() => inputActions = new PlayerInputActions();

    private void OnEnable()
    {
        inputActions.Enable();
        inputActions.Player.Jump.performed += OnJump;
    }

    private void OnDisable()
    {
        inputActions.Disable();
        inputActions.Player.Jump.performed -= OnJump;
    }

    private void OnJump(InputAction.CallbackContext context) => Debug.Log("Jump!");
}
```
### 配合PlayerInput组件
`PlayerInput`是Unity提供的MonoBehaviour，用于快速接入`.inputactions`资产，支持：
- 自动绑定事件
- 自动识别控制器
- 支持多玩家分离（Join/Leave）
```cs
void OnMove(InputValue value) => Vector2 move = value.Get<Vector2>();
```

### 事件类型

| 类型          | 描述            |
| ----------- | ------------- |
| `started`   | 按下的那一帧        |
| `performed` | 动作生效（按住、滑动）   |
| `canceled`  | 动作取消（松开、停止滑动） |

### 实用技巧
**动态绑定**  
```cs
inputActions.Player.Fire.start += ctx => Shoot();
```

**支持UI操作**
Unity的`Input System UI Input Module`替代源EventSystem，需绑定Input Actions到UI

**多人输入管理**
- 配合`PlayerInputManager`
- 支持热插拔、多设备控制
