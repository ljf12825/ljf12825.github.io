---
title: Attribute
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: Attribute
---

# Attribute
Attribute是C#里一个非常强大的元编程机制——它让代码可以携带额外的“说明性数据”，这些数据可以再运行时或编译时被读取，用来改变程序的行为、提供元信息或做自动化处理\
可以把它理解为：给类型、方法、字段等打标签，然后通过反射读取这些标签

## Attribute是什么
在.NET世界里，Attribute是继承自`System-Attribute`的类，用来给程序元素（类、方法、属性、参数、程序集等）附加元数据（metadata）

这些元数据在编译后会被写入到程序集的metadata字段里，在运行时可以通过反射(`System.Reflection`)读取

## 系统内置的常见Attribute

| 名称 | 用途 |
| `[Obsolete]` | 标记成员已废弃。编译器会警告或报错 |
| `[Serializable]` | 标记类可以被序列化 |
| `[NoSerialized]` | 标记字段在序列化时被跳过 |
| `[DllImport]` | 用于调用非托管代码（P/Invoke）|
| `[Conditional]` | 根据编译条件决定是否调用方法 |
| `[AttributeUsage]` | 限定自定义Attribute的使用范围 |

### `[Obsolete]`
告诉编译器“这个方法、类或属性已经过时”，鼓励使用新API

定义 （.NET Framework源码）
```cs
[AttributeUsage(AttributeTargets.All, Inherited = false)]
public sealed class ObsoleteAttribute : Attribute
{
    public string Message { get; }
    public bool IsError { get; }

    public ObsoleteAttribute(string message, bool error = false) { ... }
}
```
使用
```cs
public class Game
{
    [Obsolete("Use InitGame instead", true)] // 第二个参数为true会报错
    public void StartGame() { }

    public void InitGame() { }
}
```
调用
```cs
var g = new Game();
// g.StartGame(); // CS0619
```
- 第一个参数是提示消息
- 第二个参数`true`表示编译错误，`false`只警告
- 这是编译器特性，不会影响运行时

用法场景：在API版本升级时非常常见，比如Unity的老API或.NET的旧接口

### `[Serializable]`
告诉.NET序列化器（如BinaryFormatter、XmlSerializer）这个类的对象可以被序列化（即转成字节流保存或传输）
```cs
[Serializable]
public class Player
{
    public string Name;
    public int Level;

    [NonSerialized]
    public int TempScore;
}
```
序列化
```cs
var palyer = new Player { Name = "LJF", Level = 10, TempScore = 99 };

using (var fs new FileStream("player.dat", FileMode.Create))
{
    var formatter = new BinaryFormatter();
    formatter.Serialize(fs, player);
}
```
反序列化
```cs
using (var fs = new FileStream("player.dat", FileMode.Open))
{
    var formatter = new BinaryFormatter();
    var restore = (Player)formatter.Deserialize(fs);
    Console.WriteLine(rstored.Name); // 输出LJF
    Console.WriteLine(restored.TempScore); // 输出0（被跳过了）
}
```
`[Serializable]`告诉运行时在反射扫描时，将该类型字段纳入序列化流程

### `[NonSerialized]`
配合`[Serializable]`使用，表示该字段在序列化时被忽略
```cs
[Serializable]
public class Player
{
    public string Name;
    [NonSerialized]
    public string Password;
}
```
`Password`在序列化时不会被写入数据流\
常用于跳过缓存字段、临时数据或敏感信息\
只对字段(field)生效，不作用于属性(property)

> 二进制序列化已经被废弃，取而代之的是Json序列化

### `[DllImport]`
用于声明外部函数（通常是C/C++ 动态库函数），告诉CLR这是个“外部实现”的方法\
定义（位于`System.Runtime.InteropServices`）
```cs
[AttributeUsage(AttributeTargets.Method)]
public sealed class DllImportAttribute : Attribute
{
    public DllImportAttribute(string dllName) { ... }
    public CallingConvention CallingConvention { get; set; }
    public string EntryPoint { get; set; }
}
```
使用例子
```cs
using System.Runtime.InteropServices;

public class NativeMethods
{
    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    public static extern int MessageBox(IntPtr hWnd, string text, string caption, int type);
}

NativeMethods.MessageBox(IntPtr.Zero, "你好", "提示", 0)
```
这就是P/Invoke\
C#会在运行时加载`user32.dll`并调用其中的`MessageBox`函数

用法场景：
Unity、.NET Core、Mono都广泛使用它来桥接C/C++层，比如
- 调用OpenGL/Vulkan/Win32 API
- 调用C写的音频或图像库
- 嵌入系统底层调用

### `[Conditional]`
让某个方法在特定条件下才会被编译调用
```cs
using System.Diagnostics;

public class Logger
{
    [Conditional("DEBUG")] // VS在Debug模式下，会自动#define DEBUG，因此会生效
    public static void Log(string msg) => Console.WriteLine(msg);
}
```
使用
```cs
Logger.Log("Game started!");
```
编译
- 如果定义了宏`DEBUG`（在项目属性或`#define DEBUG`），这行代码会保留
- 否则整行会被编译器直接忽略（像从源代码中删掉一样）

注意
- 仅影响调用，不影响方法定义
- 只能修饰返回类型为`void`的方法
- 可用多个条件，如`[Conditional("DEBUG"), Conditional("TRACE")]`

这在日志系统、调试开关、断言机制中非常有用

### `[AttributeUsage]`
控制自定义Attriute的适用位置、可重复性、继承性
```cs
[AttributeUsage(
    AttributeTargets.Class | AttributeTargets.Method,
    AllowMultiple = true,
    Inherited = false)]
public class AuthorAttribute : Attribute
{
    public string Name { get; }
    public AuthorAttribute(string name) { Name = name; }
}
```
- AtrributeTargets: 限定能贴在哪些元素上（类、方法、属性、字段、参数等）
- AllowMultiple：是否能多次使用同一个特性
- Inherited：是否能被子类继承

示例
```cs
[Author("ljf12825")]
[Author("system", AllowMultiple = true)]
public class GameEngine { }
```
反射读取
```cs
var attrs = typeof(GameEngine).GetCustomAttributes(typeof(AuthorAttribute), false);
foreach (AuthorAttribute attr in attrs)
    Console.WriteLine(attr.Name);
```

### 小结
这六种基本Attribute代表了Attribute的“六种哲学”

| 特性 | 领域 | 核心思想 |
| - | - | - |
| `[Obsolete]` | 编译期提示 | 可攻至版本演化 |
| `[Serializable]`/`[NonSerialized]` | 运行时序列化 | 数据状态的持久化控制 |
| `[DllImport]` | 系统互操作 | 扩展托管代码边界 |
| `[Conditional]` | 条件编译 | 动态编译控制 |
| `[AttributeUsage]` | 自定义约束 | 元编程的元规则 |

这些特性合起来体现了C#的一个哲学：“元数据驱动的行为控制”\
它不是仅仅写死逻辑，而是把“信息”挂在结构上，再由编译器、运行时或框架去解释执行\
这正式Unity、ASP.NET、Entity Framework、XUnit等框架的底层机制所在

## 自定义Attribute
自定义Attribute只需要继承自`System.Attribute`即可
```cs 
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorAttribute : Attribute
{
    public string Name { get; }
    public int Version { get; set; }

    public AuthorAttribute(string name) => Name = name;
}
```
使用
```cs 
[Author("ljf12825", Version = 1)]
public class GameEngine
{
    [Author("tester", Version = 2)]
    public void Innit() { }
}
```

## 读取Attribute（反射）
可以在运行时读取类或方法上的特性，并作出相应逻辑
```cs 
Type type = typeof(GameEngine);
var attrs = type.GetCustomAttributes(typeof(AuthorAttriute), false)

foreach (AuthorAttribute attr in attrs)
{
    Console.WriteLine($"Author: {attr.Name}, Version: {attr.Version}");
}
```
也可以这样查方法
```cs
var method = type.GetMethod("Init");
var attr = (AuthorAttribute)method.GetCustomAttribute(typeof(AuthorAttribute));
Console.WriteLine($"Method Author: {attr.Name}");
```
