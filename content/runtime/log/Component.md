---
title: "Component"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Unity System]
author: "ljf12825"
type: log
summary: All builldin Component in Unity
---
Component是附加在GameObject上的功能模块，每个组件都提供了某种行为或属性，组成了游戏对象的功能
class Component继承自Object，在UnityEngine.CoreModule中实现

## class Component
是所有可依附在GameObject上的类的基类

不可以直接创建Component

### API
**Properties**

| Property | Description |
| - | - |
| gameObject | component附加的GameObject |
| tag | gameObject的tag |
| transform | gameObject的Transform |

**Public Methods**

| 方法                        | 描述                                                         |
|-----------------------------|--------------------------------------------------------------|
| `BroadcastMessage`           | 调用当前 `GameObject` 或其所有子对象的指定方法。                      |
| `CompareTag`                 | 比较 `GameObject` 的标签（tag）与给定标签。                        |
| `GetComponent`               | 获取当前 `GameObject` 上的指定类型的组件。                         |
| `GetComponentInChildren`     | 获取当前 `GameObject` 或其子对象上的指定类型的组件。                |
| `GetComponentIndex`          | 获取组件在其父对象中的索引。                                    |
| `GetComponentInParent`       | 获取当前 `GameObject` 或其父对象上的指定类型的组件。                |
| `GetComponents`              | 获取当前 `GameObject` 上的所有指定类型的组件。                      |
| `GetComponentsInChildren`    | 获取当前 `GameObject` 和其子对象上的所有指定类型的组件。            |
| `GetComponentsInParent`      | 获取当前 `GameObject` 和其父对象上的所有指定类型的组件。            |
| `SendMessage`                | 在当前 `GameObject` 上调用指定的方法，所有附加的 MonoBehaviour 都会收到此消息。 |
| `SendMessageUpwards`         | 调用当前 `GameObject` 及其所有祖先对象上的指定方法。                  |
| `TryGetComponent`            | 尝试获取指定类型的组件，如果存在则返回该组件，否则返回 `null`。       |

[Unity Scripting Component](https://docs.unity3d.com/ScriptReference/Component.html)

## 组件的特性

| 特性        | 描述                                             |
| --------- | ---------------------------------------------- |
| **附加性**   | 可以给 GameObject 添加多个组件。                         |
| **组合式设计** | Unity 的架构是组合优于继承，一个 GameObject 的行为是由多个组件组合而成的。 |
| **可视化编辑** | 在 Unity Inspector 面板中可以直接添加、删除或修改组件。           |
| **脚本组件**  | 你写的 C# 脚本，本质上也是组件，继承自 `MonoBehaviour`。         |

## 在代码中使用组件

```csharp
//获取组件
Rigidbody rb = GetComponent<Rigidbody>();
//添加组件
gameObject.AddComponent<AudioSource>();
```
在Unity中，组件之所以能起作用，是因为Unity引擎在运行时会自动调度和执行组件的逻辑，这个背后是Unity引擎的核心“组件驱动”架构

## 简单理解：Unity的工作循环 + 组件系统
**1.GameObject只是容器**
**2.组件发挥功能**
**3.Unity引擎每一帧都会遍历所有激活的GameObject，调度它们的组件做该做的事**

[Unity组件驱动架构](log/Unity-Component-Driven-Architecture/)

## Unity组件

| Category            | Component Name                         |
|---------------------|----------------------------------------|
| **Audio**           | Chorus Filter                          |
|                     | Distortion Filter                      |
|                     | Echo Filter                            |
|                     | High Pass Filter                       |
|                     | Listener                               |
|                     | Low Pass Filter                        |
|                     | Reverv Filter                          |
|                     | Reverv Zone                            |
|                     | Source                                 |
| **Effects**         | Halo                                   |
|                     | Lens Flare                             |
|                     | Line Renderer                          |
|                     | Particle System                        |
|                     | Projector                              |
|                     | Trail Renderer                         |
|                     | Visual Effect                          |
| **Event**           | Event System                           |
|                     | Event Trigger                          |
|                     | Graphic Raycaster                      |
|                     | Physics 2D Raycaster                   |
|                     | Physics Raycaster                      |
|                     | Standalone Input Module                |
|                     | Touch Input Module                     |
| **Layout**          | Aspect Ratio Fitter                    |
|                     | Canvas                                 |
|                     | Canvas Group                           |
|                     | Cancas Scaler                          |
|                     | Content Size Fitter                    |
|                     | Grid Layout Group                      |
|                     | Horizontal Layout Group                |
|                     | Layout Element                         |
|                     | Rect Transform                         |
|                     | Vertical Layout Group                  |
| **Mesh**            | Mesh Filter                            |
|                     | Mesh Renderer                          |
|                     | Skinned Mesh Renderer                  |
|                     | TextMeshPro - Text                     |
|                     | Text Mesh *(Legacy)*                   |
| **Miscellaneous**   | Aim Constraint                         |
|                     | Animation                              |
|                     | Animator                               |
|                     | Billboard Renderer                     |
|                     | Grid                                   |
|                     | Look At Constraint                     |
|                     | Parent Constraint                      |
|                     | Particle System Force Field            |
|                     | Position Constraint                    |
|                     | Rotation Constraint                    |
|                     | Scale Constraint                       |
|                     | Sprite Mask                            |
|                     | Sprite Shape Renderer                  |
|                     | Terrain                                |
|                     | Wind Zone                              |
| **Navigation**      | Nav Mesh Agent                         |
|                     | Nav Mesh Obstacle                      |
|                     | Off Mesh Link                          |
| **Physics 2D**      | Area Effector 2D                       |
|                     | Box Collider 2D                        |
|                     | Buoyancy Effector 2D                   |
|                     | Capsule Collider 2D                    |
|                     | Circle Collider 2D                     |
|                     | Composite Collider 2D                  |
|                     | Constant Force 2D                      |
|                     | Custom Collider 2D                     |
|                     | Distance Joint 2D                      |
|                     | Edge Collider 2D                       |
|                     | Fixed Joint 2D                         |
|                     | Friction Joint 2D                      |
|                     | Hinge Joint 2D                         |
|                     | Platform Effector 2D                   |
|                     | Point Effector 2D                      |
|                     | Polygon Collider 2D                    |
|                     | Relative Joint 2D                      |
|                     | Rigidbody 2D                           |
|                     | Slider Joint 2D                        |
|                     | Spring Joint 2D                        |
|                     | Surface Effector 2D                    |
|                     | Target Joint 2D                        |
|                     | Wheel Joint 2D                         |
| **Physics**         | Articulation Body                      |
|                     | Box Collider                           |
|                     | Capsule Collider                       |
|                     | Character Controller                   |
|                     | Character Joint                        |
|                     | Cloth                                  |
|                     | Configurable Joint                     |
|                     | Constant Force                         |
|                     | Fixed Joint                            |
|                     | Hinge Joint                            |
|                     | Mesh Collider                          |
|                     | Rigidbody                              |
|                     | Sphere Collider                        |
|                     | Spring Joint                           |
|                     | Terrain Collider                       |
|                     | Wheel Collider                         |
| **Playables**       | Playable Director                      |
| **Rendering**       | Camera                                 |
|                     | Canvas Renderer                        |
|                     | Flare Layer                            |
|                     | LOD Group                              |
|                     | Light                                  |
|                     | Light Probe Group                      |
|                     | Light Probe Proxy Volume               |
|                     | Occlusion Area                         |
|                     | Occlusion Portal                       |
|                     | Reflection Probe                       |
|                     | Skybox                                 |
|                     | Sorting Group                          |
|                     | Sprite Renderer                        |
|                     | Streaming Controller                   |
| **Scripts**         | 自定义脚本           |
| **Tilemap**         | Tilemap                                |
|                     | Tilemap Collider 2D                    |
|                     | Tilemap Renderer                       |
| **UI Toolkit**      | Panel Event Handler                    |
|                     | Panel Raycaster                        |
|                     | UI Document                            |
| **UI**              | Button                                 |
|                     | Dropdown - TMP                         |
|                     | Effects - Outline                      |
|                     | Effects - Position As UV1              |
|                     | Effects - Shadow                       |
|                     | Image                                  |
|                     | Mask                                   |
|                     | Raw Image                              |
|                     | Rect Mask 2D                           |
|                     | Scroll Rect                            |
|                     | Scrollbar                              |
|                     | Selectable                             |
|                     | Slider                                 |
|                     | TMP - Input Field                      |
|                     | TMP - Text                             |
|                     | Toggle                                 |
|                     | Toggle Group                           |
|                     | Dropdown *(Legacy)*                    |
|                     | Input Field *(Legacy)*                 |
|                     | Text *(Legacy)*                        |
| **Video**           | Video Player                           |
| **Visual Scripting**| Animator Message Listener *(Listener)* |
|                     | Script Machine                         |
|                     | State Machine                          |
|                     | Variables                              |


