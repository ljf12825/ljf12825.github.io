---
title: "Unity Debug"
date: 2025-06-01
categories: [笔记]
tags: [Unity, UnityTool]
author: "ljf12825"
summary: classDebug, Breaking Debugging, Profiler, UnityTest
---
Unity调试时游戏开发中非常重要的一环，能够帮助开发者快速定位和解决问题。Unity提供了多种调试工具和方法，主要包括日志输出、断点调试、内存和性能分析等

## 日志输出（Logging）
在Unity中，最常用的调试方法时通过输入日志，查看游戏运行时的状态。这些日志通常包括错误、警告和信息

### class Debug
`Debug`类是Unity中的一个非常重要的工具类，用于在开发过程中输出调试信息、记录错误、警告以及其他状态信息。它位于`UnityEngine`命名空间下，提供了几个常用的方法，帮助开发者在运行时查看日志、跟踪错误以及确保游戏的逻辑正确性

### API
#### Static Properties

| Property                  | Description                     |
| ------------------------- | ------------------------------- |
| `developerConsoleEnabled` | 允许启用或禁用开发者控制台。                  |
| `developerConsoleVisible` | 控制开发者控制台是否可见。                   |
| `isDebugBuild`            | 检查当前是否为开发构建（Development Build）。 |
| `unityLogger`             | 获取默认的调试日志记录器。                   |

#### Static Methods

| Method                       | Description                     |
| ---------------------------- | ------------------------------- |
| `Assert()`                   | 断言条件，如果条件为假，记录错误信息。             |
| `AssertFormat()`             | 断言条件并记录格式化的错误信息。                |
| `Break()`                    | 暂停编辑器的执行，通常用于调试时暂停游戏。           |
| `CheckIntegrity()`           | 执行当前进程的完整性检查并返回发现的错误。           |
| `ClearDeveloperConsole()`    | 清除开发者控制台中的所有日志。                 |
| `DrawLine()`                 | 在场景中绘制一条线段。                     |
| `DrawRay()`                  | 在场景中绘制一条射线。                     |
| `ExtractStackTraceNoAlloc()` | 提取当前调用栈并将其填充到未管理的缓冲区中，不会分配GC内存。 |
| `IsValidationLevelEnabled()` | 返回指定的验证级别是否已启用。                 |
| `Log()`                      | 记录常规日志消息到控制台。                   |
| `LogAssertion()`             | 记录断言日志消息到控制台。                   |
| `LogAssertionFormat()`       | 记录格式化的断言日志消息到控制台。               |
| `LogError()`                 | 记录错误日志消息到控制台。                   |
| `LogErrorFormat()`           | 记录格式化的错误日志消息到控制台。               |
| `LogException()`             | 记录异常信息到控制台。                     |
| `LogFormat()`                | 记录格式化的日志消息到控制台。                 |
| `LogWarning()`               | 记录警告日志消息到控制台。                   |
| `LogWarningFormat()`         | 记录格式化的警告日志消息到控制台。               |
| `RetrieveStartupLogs()`      | 返回捕获的启动日志信息。                    |


## 断点调试（Breakpoint Debugging）
Unity与Visual Studio等IDE集成，支持断点调试。可以通过设置断点来暂停程序的执行，查看变量值、调用栈等信息
- 在Visual Studio中，打开需要调试的脚本，然后点击行号旁边的空白处，设置断点
- 在Visual Studio中，点击"Attach to Unity"按钮，这将把Visual Studio与Unity连接
- 在Unity运行时，程序会在断点处暂停，可以查看当前的变量、堆栈信息等，帮助定位问题

## Visual Studio调试插件
Unity默认支持与Visual Studio的集成，在Visual Studio中可以使用许多调试功能：
- Watch变量：在断点停下时，可以通过"Watch"窗口观察指变量的实时值
- 调用栈（Call Stack）：查看当前执行路径，帮助定位错误的来源
- 本地变量（Locals）：查看当前函数的局部变量，检查它们的状态是否符合预期

## Profiler（性能分析器）
[Unity Profiler]({{site.baseurl}}/posts/2025-06-11-Unity-Profiler/)

## Memory Profiler （内存分析器）
[Unity Memory Profiler]({{site.baseurl}}/posts/2025-07-12-Unity-Memory-Profiler/)

## Unity Console
Unity的控制台时查看日志的主要地方

- 过滤日志：通过控制台顶部的过滤器，你可以选择只显示`Error`、`Warning`或`Info`，让你更专注于当前需要的日志信息

- 双击日志：在控制台中，双击日志信息，会自动跳转到日志触发的代码行，便于快速定位问题

## 输入模拟（Input Simulation）
如果你要调试控制器或输入相关的代码，Unity提供了输入模拟工具。你可以使用Unity编辑器内的`Input`工具进行模拟和测试。例如，测试不同设备的控制器输入，模拟键盘、鼠标或触摸事件

## Test Runner（单元测试）
[Unity Test Runner]({{site.baseurl}}/posts/2025-07-12-Unity-Test-Runner/)
