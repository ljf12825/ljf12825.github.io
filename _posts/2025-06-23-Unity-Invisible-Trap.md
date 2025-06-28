---
title: "Unity Invisible Trap"
layout: single
date: 2025-06-01
categories: [Debug]
tags: [Unity, Debug Log]
author: "ljf12825"
---
Unity实际开发中，有很多“看起来正常、实则容易出错”的**奇怪问题**（或称为**隐形陷阱**）

# Quick List
## Class1 交互相关

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| [按下交互键时多个箱子同时打开](#1多个可交互物体输入触发多个) | 范围内存在多个交互体，未判断距离 | 使用 `OverlapSphere` + 计算最近距离 | 输入、交互  |
| 鼠标点击物体无反应 | 被 UI 或透明物体挡住，Raycast 被拦截 | 检查 UI 的 Raycast Target 设置   | 输入、射线  |
| 射线打不中目标 | 射线层级错误或未设置 LayerMask | 使用正确 Layer 和 LayerMask | 输入、射线  |
| 玩家进入 Trigger 区域被触发两次 | 存在多个 Collider 重叠，重复触发 | 判断 `other.gameObject` 是否重复  | 触发器、碰撞 |

## Class2 动画控制

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| `SetTrigger` 后动画无反应 | 没有关闭 `Has Exit Time` 或过渡设置错误 | 调整 Animator Transition 设置 | 动画、状态机  |
| 动画状态切换卡顿 | 切换时未等待上一状态结束 | 使用 CrossFade，设置合理 transition duration | 动画 |
| 动画参数更新后立即调用 `Play` 无效 | Animator 状态未刷新 | 等待一帧或避免立即 `Play` | 动画、代码时序 |
| 动画过渡后恢复原始状态 | 未使用 `Animator.ResetTrigger` | 设置状态触发后重置 Trigger | 动画、状态机 |

## Class3 UI系统

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| UI 按钮点击无效 | 被其他透明 UI 挡住 | 检查 Canvas 层级，关闭遮挡物的 Raycast Target | UI、输入 |
| Text 性能差、频繁 GC | 使用 `Text` 频繁更新 | 使用 `TextMeshPro` + 对象池 | UI、性能 |
| UI 点击穿透到底部物体 | 未正确使用 `CanvasGroup.blocksRaycasts` | 设置为 false 阻止穿透 | UI、射线 |
| ScrollView 滚动方向错乱 | 锚点、Pivot 设置错误 | 调整 Content 和 Viewport 的锚点 | UI、布局 |

## Class4 物理系统

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| 移动物体穿过墙体 | 使用了 `transform.position` 移动刚体 | 改用 `Rigidbody.MovePosition()` | 物理、穿透 |
| 刚体滑动不自然 | 没有设置 Drag、Mass 等属性 | 设置合理的阻力与摩擦系数 | 物理 |
| 触发器触发失效 | Collider 未勾选 isTrigger，或 Rigidbody 缺失 | 确保至少一方含 Rigidbody 且 Collider 是触发器 | 物理、触发器 |

## Class5 资源加载与管理

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| Resources.Load 的资源未释放 | Destroy 了物体但资源仍驻留内存 | 调用 `Resources.UnloadUnusedAssets()` | 内存、加载 |
| Addressables 资源释放失败 | 未调用 `Release()` | 每次加载后使用 `Addressables.Release(handle)` | Addressables |
| AudioClip 提前中断 | 多个 AudioSource 播放相同 Clip 被覆盖 | 用 `PlayOneShot` 或动态创建 AudioSource | 音频、资源 |

## Class6 生命周期与协程

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| `WaitForSeconds()` 在暂停时不起作用 | 依赖 `Time.timeScale`，暂停后为 0 | 使用 `WaitForSecondsRealtime()` | 协程、暂停 |
| Update 在隐藏物体时仍执行 | 脚本和 GameObject 仍处于 enabled 状态 | 手动控制 `enabled = false` | 生命周期 |
| OnDisable 未被调用 | GameObject 被销毁不是禁用 | 区分 `Destroy` 与 `SetActive(false)` | 生命周期、事件 |

## Class7 性能优化相关

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| 场景切换时卡顿 | 同步加载资源或过多 Awake 初始化 | 用 `LoadSceneAsync`，资源异步预加载 | 性能、加载 |
| Update() 性能开销大 | 多个脚本使用 Update，逻辑分散 | 使用事件驱动 + 管理器合并 Update | 性能、架构 |
| GC Alloc 频繁 | 每帧创建新对象（如字符串、new Vector3） | 复用变量、使用对象池 | 性能、GC |

## Class8 编译器 vs 构建行为差异

| 现象 | 原因 | 解决方式 | 标签 |
| ---- | ---- | ---- | ---- |
| 编辑器正常，打包后报错 | 使用了 `UnityEditor` API | 用 `#if UNITY_EDITOR` 包裹 | 构建、平台差异 |
| 场景中未勾选物体在运行时出现 | 被代码运行时 Instantiate | 确认代码逻辑未动态生成 | 构建、场景管理 |
| 路径访问失败 | 各平台 `persistentDataPath` 不一致 | 使用平台判断封装路径 | IO、平台兼容 |



# Class1 交互相关
## 1.多个可交互物体，输入触发多个
- 场景：靠近多个箱子同时按下`E`，多个箱子一起打开
- 原因：所有物体监听`E`，没有加距离或唯一判定
- 解决方案：只响应最近/朝向前方的一个对象

## 2.Trigger触发多次Enter/Exit
- 场景：一个对象靠近某个Trigger区域，`OnTriggerEnter`被触发两次
- 原因：
  - 可能身上挂有多个Collider
  - 或包含子物体的Collider也触发了
- 解决方案：确认是否是重复触发，加入`other.gameObject == expectedObject`判断

## 3.Button UI点击两次才响应
- 原因：
  - UI按钮背后有透明/未关闭的UI元素挡住射线
  - 或者EventSystem被禁用、Canvas未设置正确Sorting Order
- 解决方案：调试Graphic Raycaster、Canvas排序、Raycast Target勾选项

# Class2 物理系统相关
## 1.Rigidbody设置position导致穿透
- 使用`transform.position = ...`设置刚体位置，会跳过物理引擎检测，导致穿墙
- 正确做法：使用`Rigidbody.MovePosition()`

## 2.Collider和Rigidbody的组合错误
- 常见错误组合
  - 静态物体（如地面）用了非Kinematic的Rigidbody
  - 移动物体没加Rigidbody，靠transform移动导致物理行为异常

- Unity的推荐：
  - 静态物体（地面）用Collider，无Rigidbody
  - 动态物体加Rigidbody，控制用物理接口

# Class3 生命周期相关
## 1.协程中的`WaitForSeconds`在TimeScale为0时失效
```cs
StartCoroutine(Example());

IEnumerator Example()
{
  yield return new WaitForSeconds(2f); // 如果Time.timeScale == 0，不会等待
}
```
- 解决方案：用`WaitForSecondRealtime(2f);

## 2.脚本的`Update()`仍被调用，虽然物体不可见
- 即使物体在摄像机外、隐藏或inactive子物体，只要GameObject时active的、脚本时enable的，Update就会继续执行

# Class4 动画系统相关
## 1.Animator动画不能立即切换
- 使用`SetTrigger`后动画没反应，原因是当前状态没有达到可以跳转的条件或冷却没完成
- 解决方案：Animator控制器中正确配置Transition，并关闭`Has Exit Time`（除非需要完整播放）

## 2.Animator状态机切换卡顿或不触发
- 在代码里调用了：
```cs
animator.SetBool("isOpen", true);
animator.Play("Open");
```
- 原因：设置参数后马上`Play`，但Unity还没更新Animator的状态，应延迟一帧或合并状态逻辑

# Class5 资源加载与内存相关
## 1.Addressables或Resources.Load的资源加载了但没释放
- 开发中用完资源后`Destroy(obj)`了，却发现内存依然飙高
- 原因：Unity对部分资源（如Texture、Mesh）会做缓存，要手动调用`Resources.UnloadUnusedAssets()`或`Addressables.Release(handle)`

## 2.AudioClip播放一半没声音或提前中断
- 多个`AudioSource`播放相同Clip时，其中一个会抢断另一个
- 使用`PlayOneShot()`或实例化新的AudioSource

# Class6 编译器运行与构建差异
## 1.在Editor模式下一切正常，打包后就崩溃
- 原因：用了`AssetDatabase`、`EditorUtility`、`UnityEditor`命名空间代码
- 加`#if UNITY_EDITOR`包裹相关逻辑

## 2.场景中物体没勾选但运行中出现了
- 某些Prefab被脚本`Instantiate()`出来了，但在场景中没看到
- 检查脚本逻辑力是否有运行时代码加载或启动对象

