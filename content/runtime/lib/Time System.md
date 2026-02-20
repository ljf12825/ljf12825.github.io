---
title: "Time System"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Unity System]
author: "ljf12825"
type: blog
summary: Unity's class Time
---
Unity的时间系统管理游戏中的时间流逝，包括帧率、时间步长、暂停和加速等

## 几个核心概念
### 1.Time.deltaTime
这是Unity时间系统中最常用的属性之一，它表示上一帧和当前帧之间的时间（单位为秒），通常用于实现与帧率无关的平滑运动和动画  
```cs
float speed = 5f;
void Update() => transform.Translate(Vector3.forward * speed * Time.deltaTime);
```
`Time.deltaTime`确保无论游戏的帧率是多少，物体的移动速度始终相同  

### 2.Time.time
表示自游戏开始以来经过的时间（单位为秒）

### 3.Time.timeScale
`timeScale`是Unity时间系统中一个非常重要的属性。它控制整个游戏的时间流速。默认值是1，表示正常速度。如果将其设置为0，游戏将暂停。如果设置为大于1的值，时间将加速。

### 4.Time.fixedDeltaTime
与`Time.deltaTime`类似，`fixedDeltaTime`是每个固定时间步长的时间（单位为秒）。它用于`FixedUpdate()`方法，确保物理计算在所有帧率下都是一致的，默认值为0.02s，表示每秒更新50次
```cs
void FixedUpdate() => transform.Translate(Vector3.forward * speed * Time.fixedDeltaTime);
```

### 5.Time.unscaledDeltaTime
类似于`Time.deltaTime`，但`unscaledDeltaTime`不会受到`Time.timeScale`的影响。用于不受时间缩放影响的功能（如UI动画、计时器等）
```cs
void Update()
{
    float countdown = 10f;
    countdown -= Time.unscaledDeltaTime; 
}
```

### 6.Time.realtimeSinceStartup
返回自游戏启动以来的实际时间（单位为秒），不受`timeScale`影响

### 7.Time.smoothDeltaTime
类似于`Time.deltaTime`，但它提供了更平滑的值，适用于需要更平滑的插值计算的场景。通常在帧率不稳定时，可以使用它来减少跳动  

### 8.Time.captureDeltaTime
`captureDeltaTime`提供的是实时的时间间隔，而不受Unity内部时间优化的影响。用于精确时间测量

## Time API

| **属性**                           | **描述**                                                      |
| -------------------------------- | ----------------------------------------------------------- |
| **captureDeltaTime**             | 通过减慢应用程序的播放时间，使Unity可以在帧之间保存截图。                             |
| **captureDeltaTimeRational**     | 通过减慢应用程序的播放时间，使Unity可以在帧之间保存截图。                             |
| **captureFramerate**             | `Time.captureDeltaTime`的倒数。                                 |
| **deltaTime**                    | 从上一帧到当前帧的时间间隔（单位：秒，只读）。                                    |
| **fixedDeltaTime**               | 游戏内物理和其他固定帧率更新（如`FixedUpdate`）执行的时间间隔（单位：秒）。                |
| **fixedTime**                    | 当前`FixedUpdate`开始的时间，单位为自游戏开始以来的秒数（只读）。                    |
| **fixedTimeAsDouble**            | 上一次`FixedUpdate`开始的双精度时间（只读）。这是自游戏开始以来的时间（单位：秒）。           |
| **fixedUnscaledDeltaTime**       | 时间流速独立的（“真实”）时间间隔，用于物理和其他固定帧率更新（如`FixedUpdate`）的执行（只读）。    |
| **fixedUnscaledTime**            | 上一次`FixedUpdate`阶段开始时的时间，时间流速独立（只读）。这是自游戏开始以来的时间（单位：秒）。    |
| **fixedUnscaledTimeAsDouble**    | 上一次`FixedUpdate`阶段开始时的双精度时间，时间流速独立（只读）。这是自游戏开始以来的时间（单位：秒）。 |
| **frameCount**                   | 自游戏开始以来的总帧数（只读）。                                           |
| **inFixedTimeStep**              | 如果在固定时间步长回调（如`FixedUpdate`）中调用，则返回`true`，否则返回`false`（只读）。  |
| **maximumDeltaTime**             | 每帧`Time.deltaTime`的最大值。限制了两个帧之间`Time.time`的最大增量，单位为秒。       |
| **maximumParticleDeltaTime**     | 每帧可用于粒子更新的最大时间。如果一帧时间超过此值，则更新将被分成多个较小的更新。                   |
| **realtimeSinceStartup**         | 自游戏启动以来的真实时间（单位：秒，只读）。                                     |
| **realtimeSinceStartupAsDouble** | 自游戏启动以来的真实时间（单位：秒，只读）。`realtimeSinceStartup`的双精度版本。        |
| **smoothDeltaTime**              | 平滑过的`Time.deltaTime`（只读）。                                  |
| **time**                         | 当前帧开始时的时间，单位为自应用程序启动以来的秒数（只读）。                             |
| **timeAsDouble**                 | 当前帧开始时的双精度时间（只读）。这是自游戏开始以来的时间（单位：秒）。                       |
| **timeAsRational**               | 本帧开始时的时间（只读）。这是自游戏开始以来的时间，表示为`RationalTime`。               |
| **timeScale**                    | 时间流速的比例。                                                    |
| **timeSinceLevelLoad**           | 自上一个非附加场景加载完成以来的时间（单位：秒，只读）。                               |
| **timeSinceLevelLoadAsDouble**   | 自上一个非附加场景加载完成以来的双精度时间（单位：秒，只读）。                            |
| **unscaledDeltaTime**            | 时间流速独立的，从上一帧到当前帧的时间间隔（单位：秒，只读）。                            |
| **unscaledTime**                 | 本帧的时间，时间流速独立（只读）。这是自游戏开始以来的时间（单位：秒）。                       |
| **unscaledTimeAsDouble**         | 本帧的双精度时间，时间流速独立（只读）。这是自游戏开始以来的时间（单位：秒）。                    |
                        |

[UnityScripting Time](https://docs.unity3d.com/ScriptReference/Time.html)
