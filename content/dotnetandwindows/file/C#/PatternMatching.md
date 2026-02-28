---
title: Pattern Matching
date: 2025-06-01
author: "ljf12825"
type: file
summary: C# pattern matching
---

## 模式
模式就是一种匹配规则，用来判断对象的结构、类型或值，并可绑定变量\
核心思想：
1. 匹配类型（is it s string? int? Person?）
2. 匹配值或条件（大于0? 小于0? 某属性为true？）
3. 绑定变量（匹配成功后把值赋给变量）
4. 可组合（and/or/not）

可以把模式理解为C#对象解构 + 条件判断 + 绑定语法糖的集合

### 模式的几大类别
C#从7.0到12逐步扩展了模式类型，主要有以下几种

| 模式类型 | 语法示例 | 作用 |
| - | - | - |
| 类型模式（Type Pattern）| `x is int n` | 判断类型，并绑定变量 |
| 常量模式（Constant Pattern）| `x is 0` | 判断值等于某常量 |
| 关系模式（Relational Pattern）| `x is > 0` | 大小比较 |
| 逻辑模式（Logical Pattern）| `x is > 0 and < 10` | 组合多个模式（and/or/not）|
| 否定模式（Negation Pattern）| `x is not null` | 对模式取反 |
| 属性模式（Property Pattern）| `p is { X: 0, Y: 0 }` | 匹配对象的属性结构 |
| 位置模式（Positional Pattern）| `Point(var x, var y)` | 对对象或record解构 |
| 递归模式 | `p is { Name: "Alice", Age: > 0 }` | 可以嵌套匹配对象内部结构 |

## 模式匹配
模式匹配是对对象结构和类型的“解构+判断+绑定”操作\
简单来说，它让`if`、`switch`、`is`不再只是“类型判断”，而是能直接在匹配时提取数据、判断条件

### 解决的痛点

## `is`类型模式
C#7.0之后可以这样写
```cs
object obj = 123;

if (obj is int n) Console.WriteLine($"是整数，值为{n}");
```
这相当于
```cs
if (obj is int)
{
    int n = (int)obj;
    Console.WriteLine(n);
}
```
区别：
- 新写法里`is`直接完成类型检查 + 类型转换 + 变量绑定
- `n`只在`if`的真分支内可见

## 类型模式 + 守卫条件（`when`）
```cs
object obj = 42;

if (obj is int n && n > 0)
    Console.WriteLine("正整数");

// 或者在swtich里写
switch (obj)
{
    case int n when n > 0:
        Console.WriteLine("正数");
        break;
    case int n:
        Console.WriteLine("非正数");
        break;
}
```

## 常见模式类型
C#模式匹配的核心在于这些“模式类型”
### 类型模式（Type Pattern）
`x is int n` 作用：判断类型并绑定变量

### 常量模式（Constant Pattern）
```cs
if (x is 0)
    Console.WriteLine("零");
```
判断对象是否等于某个常量

### 关系模式（Relational Pattern）
```cs
if (x is > 0)
    Console.WriteLine("正数");
else if (x is < 0)
    Console.WriteLine("负数");
```
在C#9.0引入，用`<, >, <=, >=`做比较

### 逻辑模式（Logical Pattern）
可以组合多个模式
```cs
if (x is >= 0 and <= 100)
    Console.WriteLine("在 0~100之间");
if (x is < 0 or > 100)
    Console.WriteLine("超出范围");
```

### 否定模式（Negation Pattern）
```cs
if (obj is not null)
    Console.WriteLine("不是 null");
```

### 位置模式（Positional Pattern）
假设有一个结构体
```cs
public record Point(int X, int Y);
```
可以直接匹配并结构它
```cs
Point p = new(3, 4);

if (p is Point(var x, var y))
    Console.WriteLine($"x={x}, y={y}");
if (p is Point(0, _))
    Console.WriteLine("在Y轴上");
```

### 属性模式（Property Pattern）
可以直接匹配对象的属性结构
```cs
if (p is { X: 0, Y: 0 })
    Console.WriteLine("原点");
if (p is { X: > 0, Y: > 0})
    Console.WriteLine("第一象限");
```

### 组合使用
所有模式都可以嵌套组合
```cs
if (p is { X: > 0 and < 10, Y: > 0})
    Console.WriteLine("右上角小区域");
```

## `switch`表达式（C# 8+）
现代C#最强的模式匹配表达式
```cs
string Describe(Point p) => p switch
{
    { X: 0, Y: 0 } => "原点",
    { X: > 0, Y: > 0 } => "第一象限",
    { X: < 0, Y: > 0 } => "第二象限",
    _ => "其他位置"
};
```
特点：
- `switch`可以直接作为表达式返回值
- 不需要写`break`
- 匹配顺序自上而下
- `_`表示默认模式

## 底层原理
模式匹配的本质：语法糖 + 编译器静态分析 + IL分支重写\
C#的模式匹配——无论是`is`, `switch`，还是各种property/tuple/relational pattern——底层都不是运行时魔法，而是：\
编译器再编译期，把高层模式匹配语法“翻译”成if/else、类型检查、结构调用、常量比较、IL分支指令等基础结构\
所有模式匹配在运行时没有额外runtime支撑，它只靠CLR原有能力：类型检查、常量比较、虚方法调用、IL分支；是纯语法层能力

### 基础原理
编译器生成的IL做了以下几个步骤
1. 类型模式（type pattern）
```cs
if (obj is string s) {}
```
编译成IL的核心是
- `isinst`指令：把对象尝试cast成某类型
- `brtrue.s`/`brfalse.s`：是否null判断

IL大概类似
```text
ldloc obj
isinst [System.String]
stloc s
ldloc s
brtrue label_matched 
```
也就是说：编译器帮你做类型检查和赋值，没有任何runtime pattern 引擎

2. 常量模式（constant pattern）
```cs
if (x is 3) {}
```
编译成
```text
ldloc x
ldc.i4 3
beq label_matched 
```
本质就是一个整数比较，没有额外开销

3. Relational Pattern （关系模式：`< > <= >=`）
```cs
if (x is > 10)
```
编译器会把它拆成
```text
ldloc x
ldc.i4 10
cat (or clt)
brtrue ...
```
本质就是比较指令

4. 属性模式（Property Pattern）
```cs
if (p is { X: > 10, Y: 3})
```
编译器做的事情是
- 先检查类型（如果是引用类型就implicit做isinst）
- 调用属性getter：`callvirt get_X`, `callvirt get_Y`
- 用上面哪些pattern(constant, relational)继续判断

没有额外消耗，本质是
```cs
if (p != null && p.X > 10 && p.Y == 3)
```
这是完全等价的

5. 元组模式（Tuple Pattern）
```cs
if ((x, y) is (>0, <0))
```
编译器展开成
```cs
if (x > 0 && y < 0)
```
IL只是多个比较与逻辑与的组合

### `switch`模式匹配底层：决策树优化（Decision DAG）
这是模式匹配最核心的底层部分，C#编译器针对`switch`语句创建了一套优化决策树，让匹配尽可能少走分支
```cs
switch (shape)
{
    case Circle { Radius: > 10 }: ...
    case Circle { Radius: <= 10 }: ...
    case Rectangle { Width: > 0, Height: > 0 }: ...
}
```
编译器不会按上面写的顺序逐行if/else，而是
1. 先分析shape的动态类型
2. 同类型的case合并
3. 进行属性访问排序
4. 用DGA优化重复条件

最终生成一套最短路径的IL分支逻辑（落到`isinst`/getter/比较指令上）

这提升性能，没有运行时消耗，也不是解析式，而是编译期优化成“最佳分支路径”\
微软Roslyn团队的论文称之为：Decision DAG（决策有向无环图）

可以理解为：编译期把你的模式匹配表达式转换成一个智能的、最优的、最短路径的if-else树

### 总结
模式匹配不会产生运行时反射、不会有动态dispatch，所有复杂的逻辑都在编译期完成
- 分析类型层次
- 分析常量
- 分析pattern结构
- 生成决策树
- 重写IL

运行时就是执行普通代码

CLR层面没有 pattern matching opcode，没有类似`match`, `pattern`，`case_pattern`的IL指令；所有模式匹配最终落在这几个IL指令上
- `isinst`（类型判断）
- `brtrue/brfalse`（条件分支）
- `beq/bge/blt`（数值比较）
- `callvirt`（属性访问）
- `ldc.i4`（加载常量）
- `ldobj`（加载字段）

模式匹配的复杂性都在C#编译器，而非.NET runtime或IL层

## 示例
1. 基本类型模式匹配
```cs
// is 表达式模式
public static void CheckType(object obj)
{
    if (obj is int number)
    {
        Console.WriteLine($"这是一个整数: {number}");
    }
    else if (obj is string text)
    {
        Console.WriteLine($"这是一个字符串: {text}");
    }
    else if (obj is null)
    {
        Console.WriteLine("这是空值");
    }
}

// switch 表达式
public static string GetTypeDescription(object obj) => obj switch
{
    int i => $"整数: {i}",
    string s => $"字符串: {s}",
    double d => $"双精度浮点数: {d}",
    null => "空值",
    _ => "未知类型"
};
```

2. 属性模式匹配
```cs
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string City { get; set; }
}

public static string GetPersonCategory(Person person) => person switch
{
    { Age: < 18 } => "未成年人",
    { Age: >= 18 and < 65 } => "成年人",
    { Age: >= 65 } => "老年人",
    _ => "未知"
};

// 多个属性组合匹配
public static string GetPersonInfo(Person person) => person switch
{
    { Age: >= 18, City: "北京" } => "北京成年人",
    { Age: < 18, City: "上海" } => "上海未成年人",
    { Name: var name, Age: > 60 } => $"{name}是老年人",
    _ => "其他"
};
```

3. 元组模式
```cs
public static string RockPaperScissors(string first, string second) 
    => (first, second) switch
    {
        ("rock", "scissors") => "rock 赢了",
        ("rock", "paper") => "paper 赢了",
        ("paper", "rock") => "paper 赢了",
        ("paper", "scissors") => "scissors 赢了",
        ("scissors", "rock") => "rock 赢了",
        ("scissors", "paper") => "scissors 赢了",
        (_, _) when first == second => "平局",
        _ => "输入无效"
    };
```

4. 位置模式匹配（解构模式）
```cs
public readonly struct Point
{
    public int X { get; }
    public int Y { get; }
    
    public Point(int x, int y) => (X, Y) = (x, y);
    
    public void Deconstruct(out int x, out int y) => (x, y) = (X, Y);
}

public static string GetQuadrant(Point point) => point switch
{
    (0, 0) => "原点",
    var (x, y) when x > 0 && y > 0 => "第一象限",
    var (x, y) when x < 0 && y > 0 => "第二象限",
    var (x, y) when x < 0 && y < 0 => "第三象限",
    var (x, y) when x > 0 && y < 0 => "第四象限",
    _ => "在坐标轴上"
};
```

5. 递归模式匹配
```cs
public abstract class Shape { }
public class Circle : Shape { public double Radius { get; set; } }
public class Rectangle : Shape { public double Width { get; set; } public double Height { get; set; } }
public class Triangle : Shape { public double Base { get; set; } public double Height { get; set; } }

public static double CalculateArea(Shape shape) => shape switch
{
    Circle { Radius: var r } => Math.PI * r * r,
    Rectangle { Width: var w, Height: var h } => w * h,
    Triangle { Base: var b, Height: var h } => 0.5 * b * h,
    _ => throw new ArgumentException("未知形状")
};
```

6. 列表模式匹配（C# 11+）
```cs
public static string CheckList(int[] numbers) => numbers switch
{
    [] => "空数组",
    [1] => "只有一个元素1",
    [1, 2] => "包含1和2",
    [1, 2, .. var rest] => $"以1,2开头，剩余{rest.Length}个元素",
    [var first, .., var last] => $"第一个元素是{first}，最后一个元素是{last}",
    _ => "其他数组"
};

// 使用示例
Console.WriteLine(CheckList(new int[] { }));           // 空数组
Console.WriteLine(CheckList(new int[] { 1 }));         // 只有一个元素1
Console.WriteLine(CheckList(new int[] { 1, 2 }));      // 包含1和2
Console.WriteLine(CheckList(new int[] { 1, 2, 3, 4 }));// 以1,2开头，剩余2个元素
```

7. 关系模式匹配
```cs
public static string GetTemperatureDescription(double temp) => temp switch
{
    < -10 => "极寒",
    >= -10 and < 0 => "寒冷",
    >= 0 and < 15 => "凉爽",
    >= 15 and < 25 => "舒适",
    >= 25 and < 35 => "温暖",
    >= 35 => "炎热"
};

public static string GetGrade(int score) => score switch
{
    >= 90 and <= 100 => "优秀",
    >= 80 and < 90 => "良好",
    >= 70 and < 80 => "中等",
    >= 60 and < 70 => "及格",
    >= 0 and < 60 => "不及格",
    _ => "无效分数"
};
```