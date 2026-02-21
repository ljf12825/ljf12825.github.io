---
title: Iterator
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# iterator
---

迭代器是C#中一个非常强大且优雅的特性，它极大地简化了集合枚举的实现

## 概念
- 核心概念：迭代器是一种方法、get访问器或运算符，它使你能够在类或集合中支持`foreach`循环
- 它的作用：它不会一次性返回整个集合，而是按需一次返回一个元素。这在处理大型集合或无限序列时特别有用，因为它可以节省内存
- 关键接口：迭代器的背后是`IEnumerable<T>`和`IEnumerator<T>`接口。有了这些迭代器后，几乎不用手动实现这些接口了

## 工作原理
迭代器的魔力来自于两个关键字：`yield return`和`yield break`
- `yield return <expression>`：向`foreach`循环“提供”下一个值，并暂停方法的执行，保留所有局部状态。当`foreach`循环下一次迭代时，该方法会从暂停的地方继续执行
- `yield break`：终止迭代，表示序列结束

编译器会将这些包含`yield`语句的方法或属性转换成一个实现了`IEnumerable<T>`和`IEnumerator<T>`的状态机类

## 创捷迭代器
### 迭代器方法（返回`IEnumerable<T>`）
```cs
using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        // 使用foreach 遍历迭代器方法
        foreach (int number in GetEvenNumbers(10))
        {
            Console.WriteLine(number);
        }
        // 输出：0 2 4 6 8 10
    }

    // 迭代器方法，返回IEnumerable<int>
    public static IEnumerable<int> GetEvenNumbers(int max)
    {
        for (int i = 0; i <= max; i++)
        {
            // 只有当 i 是偶数时，才 yield return
            if (i % 2 == 0)
            {
                // 在这里暂停，将 i 返回给调用者
                yield return i;
            }
            // 当 foreach 循环请求下一个元素时，从这里继续
        }
        // 方法结束相当于有一个隐式的 yield break
    }
}
```

### 迭代器Get访问器（返回`IEnumerable<T>`）
可以为类的属性创建迭代器
```cs
using System.Collections.Generic;

public class Zoo
{
    private List<string> _animals = new List<string> { "Lion", "Tiger", "Panda", "Elephant" };

    // 迭代器属性
    public IEnumerable<string> Animals
    {
        get
        {
            foreach (var animal in _animals)
            {
                yield return animal;
            }
        }
    }
}

// 使用
Zoo zoo = new Zoo();
foreach (var animal in zoo.Animals)
{
    Console.WriteLine(animal);
}
```

## 迭代器执行流程
```cs
public static void Main()
{
    Console.WriteLine("准备调用 GetNumbers");
    IEnumerable<int> numbers = GetNumbers(); // 1. 调用方法，但方法内的代码尚未执行！

    Console.WriteLine("准备开始 foreach 循环");

    foreach (var num in numbers) // 2. 进入循环时，才第一次执行 GetNumbers 方法体
    {
        Console.WriteLine($"在循环中获取了: {num}");
    }

    Console.WriteLine("循环结束");
}

public static IEnumerable<int> GetNumbers()
{
    Console.WriteLine("GetNumbers: 开始执行");
    yield return 1; // 第一次 foreach 迭代停在这里
    Console.WriteLine("GetNumbers: 返回 1 之后");
    yield return 2; // 第二次 foreach 迭代停在这里
    Console.WriteLine("GetNumbers: 返回 2 之后");
    yield return 3; // 第三次 foreach 迭代停在这里
    Console.WriteLine("GetNumbers: 返回 3 之后，方法结束");
}
```
输出结果
```text
准备调用 GetNumbers
准备开始 foreach 循环
GetNumbers: 开始执行
在循环中获取了: 1
GetNumbers: 返回 1 之后
在循环中获取了: 2
GetNumbers: 返回 2 之后
在循环中获取了: 3
GetNumbers: 返回 3 之后，方法结束
循环结束
```
`GetNumbers`方法中的代码是和`foreach`循环交替执行的

### 底层机制
当编写包含`yield return`的方法时，C#编译器会进行彻底的代码重写，生成一个实现了`IEnumerable<T>`和`IEnumerator<T>`的类
```cs
public static IEnumerable<int> GetNumbers()
{
    Console.WriteLine("开始");
    yield return 1;
    Console.WriteLine("在 1 之后");
    yield return 2;
    Console.WriteLine("在 2 之后");
    yield return 3;
    Console.WriteLine("结束");
}
```
编译器生成的近似代码
```cs
// 编译器生成的类
[CompilerGenerated]
private sealed class <GetNumbers>d__0 : IEnumerable<int>, IEnumerator<int>
{
    // 状态机状态
    private int <>1__state;
    private int <>2__current;

    // 方法参数和局部变量
    public int <>3__max;
    private int <i>5__1;

    // IEnumerator 实现
    int IEnumerator<int>.Current => <>2__current;
    object IEnumerator.Current => <>2__current;

      public <GetNumbers>d__0(int <>1__state)
    {
        this.<>1__state = <>1__state;
    }
    
    private bool MoveNext()
    {
        switch (<>1__state)
        {
            case 0:
                <>1__state = -1;
                Console.WriteLine("开始");
                <>2__current = 1;  // yield return 1
                <>1__state = 1;
                return true;
                
            case 1:
                <>1__state = -1;
                Console.WriteLine("在 1 之后");
                <>2__current = 2;  // yield return 2
                <>1__state = 2;
                return true;
                
            case 2:
                <>1__state = -1;
                Console.WriteLine("在 2 之后");
                <>2__current = 3;  // yield return 3
                <>1__state = 3;
                return true;
                
            case 3:
                <>1__state = -1;
                Console.WriteLine("结束");
                return false;
                
            default:
                return false;
        }
    }
    
    // IEnumerable 实现
    IEnumerator<int> IEnumerable<int>.GetEnumerator()
    {
        if (<>1__state == -2)  // 第一次调用
        {
            <>1__state = 0;
            return this;
        }
        return new <GetNumbers>d__0(0);
    }
}
```
- 状态字段（`<>1__state`）
  - `-2`：初始/已释放状态
  - `-1`：执行中或已完成
  - `0, 1, 2, ...`：对应每个`yield return`的位置
- 当前值字段（`<>2__current`）
存储当前要返回的元素值
- 局部变量字段
所有局部变量都会被提升为类的字段，以便在`MoveNext()`调用之间保持状态

#### 执行流程
跟踪一个`foreach`循环的执行
```cs
foreach (var num in GetNumbers())
{
    Console.WriteLine($"获取：{num}")；
}
```
步骤分解：
1. 第一次调用`GetEnumerator()`
```cs
// 编译器生成
IEnumerator<int> enumerator = new <GetNumbers>d__0(0);
// state = 0, 表示从方法开头开始
```
2. 第一次`MoveNext()`
    - 进入`case 0`
    - 执行`Console.WriteLine("开始")`
    - 设置`<>2__current = 1`
    - 设置`state = 1`（下一个状态）
    - 返回`true`
3. 第一次读取`Current`
    - `foreach`读取`enumerator.Current`得到`1`
    - 执行循环体：`Console.WriteLine("获取：1")`
4. 第二次`MoveNext()`
    - 进入`case 1`
    - 执行`Console.WriteLine("在 1 之后")`
    - 设置`<>2__current = 2`
    - 设置`state = 2`
    - 返回`true`
5. 依此类推...直到`MoveNext()`返回`false`

#### 带局部变量的复杂例子
```cs
public static IEnumerable<string> GetMessages(int count)
{
    string prefix = "Message_";
    
    for (int i = 0; i < count; i++)
    {
        yield return prefix + i;
    }
    
    Console.WriteLine("完成");
}
```
编译器转换后的关键部分
```cs
[CompilerGenerated]
private sealed class <GetMessages>d__1 : IEnumerable<string>, IEnumerator<string>
{
    private int <>1__state;
    private string <>2__current;
    
    // 参数和局部变量变为字段
    public int count;
    public int <>3__count;
    private string <prefix>5__1;  // 原局部变量 prefix
    private int <i>5__2;         // 原局部变量 i
    
    private bool MoveNext()
    {
        switch (<>1__state)
        {
            case 0:
                <>1__state = -1;
                <prefix>5__1 = "Message_";  // 初始化局部变量
                <i>5__2 = 0;                // 循环初始化
                goto case 1;
                
            case 1:
                if (<i>5__2 < count)
                {
                    <>2__current = <prefix>5__1 + <i>5__2;  // yield return
                    <>1__state = 1;
                    <i>5__2++;  // 循环计数器递增
                    return true;
                }
                <>1__state = -1;
                Console.WriteLine("完成");
                return false;
                
            default:
                return false;
        }
    }
}
```

#### 重要的设计考虑
##### 为什么需要状态机
- 保持执行上下文：局部变量在`yield`之间保持其值
- 恢复执行点：知道下一次从哪里继续执行
- 异常安全：正确处理`try-finally`块

##### `try-finally`的处理
```cs
public IEnumerable<int> WithFinally()
{
    try
    {
        yield return 1;
        yield return 2;
    }
    finally
    {
        Console.WriteLine("清理");
    }
}
```
编译器会确保`finally`块在以下情况执行
- 枚举完成时
- 调用`Dispose()`时（如`foreach`提前退出）
- 使用`using`语句时

#### 性能考虑
优点：
- 延迟执行：只在需要时计算值
- 内存高效：一次只保持一个元素在内存中

缺点：
- 对象分配：每次调用迭代器方法都会创建新的状态机实例
- 虚调用：通过接口调用`MoveNext`和`Current`

#### 调试考虑
虽然源代码看起来是线性的，但调试时要注意
- 不能在某些`yield return`语句上设置断点
- 单步执行时会看到在`MoveNext()`中跳转
- 局部变量在监视窗口中的表现可能不符合直觉

## 迭代器的优点
1. 简洁性：无需手动实现`IEnumerator`的`Current`, `MoveNext()`, `Reset()`成员
2. 惰性求值（Lazy Evaluation）：只在需要时才计算下一个值，性能高效
3. 状态自动管理：编译器生成的状态机自动处理局部变量和执行状态，无需关心循环到了哪一步
4. 无限序列：可以表示无限的数学序列

无限序列示例（斐波那契数列）
```cs
public static IEnumerable<long> Fibonacci()
{
    long a = 0;
    long b = 1;

    while (true) // 无限循环！
    {
        yield return a;
        long temp = a;
        a = b;
        b = temp + b;
    }
}

// 使用：只取前10个，否则会无限循环下去
foreach (var fib in Fibonacci().Take(10))
{
    Console.WriteLine(fib);
}
```

## 注意事项
1. 不允许在try-catch块中使用`yield return`
```cs
// 错误写法
public IEnumerable<int> BadExample()
{
    try
    {
        yield return 1; // 编译错误
    }
    catch
    {
        // ...
    }
}
```
但是，可以在`try`块中包装可能抛出异常的代码，只要`yield return`不在其中
```cs
// 正确写法：将yield return 放在 try 块外部
public IEnumerable<int> GoodExample()
{
    int result;
    try
    {
        result = SomeOperationThatMightFail();
    }
    catch
    {
        result = -1;
    }
    yield return result;
}
```
可以使用`try-finally`（`finally`块在迭代提前终止时也会执行）

2. 返回类型必须是`IEnumerable`, `IEnumerable<T>`, `IEnumerator`, `IEnumerator<T>`
3. 不能包含 `ref`或`in`参数