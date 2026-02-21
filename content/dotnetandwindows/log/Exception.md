---
title: Exception
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# exception
---

异常处理是编写健壮、可靠应用程序的基石，它允许程序以可空的方式响应运行时错误，而不是直接崩溃\
C#的异常体系，本质上是把“程序在正常道路上走不下去了”这件事转成一种结构化的、可推断的控制流

## 什么是异常
异常是指在程序执行过程中发生的、破坏正常指令流的不正常或意外情况。通俗地说，就是程序在运行时遇到了一个它无法处理的“错误”
- 尝试打开一个不存在的文件（`FileNotFoundException`）
- 访问数组范围之外的元素（`IndexOutOfRangeException`）
- 将非数字字符串转换为整数（`FormatException`）
- 尝试访问空引用的成员（`NullReferenceException`）
- 网络连接中断（`IOException`）

### 三类异常
1. 开发期异常：比如NullReferenceException, IndexOutOfRangeException, InvalidCastException 它们说明你代码写坏了，本质是bug，出现就应该修。正常运行时不应该去catch这些
2. 环境类异常：IOException, SocketException, UnauthorizedAccessException 它们来自系统或外部资源的不确定性。无法预知什么时候来，但必须处理
3. 业务逻辑异常：通常继承自ApplicationException或自定义。比如角色升级但经验不足、配置数据格式错误、资源引用不存在。这类异常更多是为了简化流程，让错误自动冒泡到合适的地方

## Exception in C#
异常在C#里是一个对象。所有异常都继承自Exception类。它包含错误信息、堆栈、内部异常、HResult等字段。throw做的事情，就是把当前执行栈一路拆开，直到找到能处理它的catch块

这套unwinding机制的重点是：失败不是返回值，而是一种控制流中断。也就是说，只要抛出异常，方法剩下的部分不执行，直接跳出栈帧

为什么这样设计？因为大量错误不属于“业务逻辑”，而是“根本无法继续执行”。比如文件打开失败、网络掉线、索引越界、资源缺失等。如果用返回值层层上传，会污染函数签名；而使用异常则把错误从逻辑通道剥离了

### 异常处理的核心关键字：`try`, `catch`, `finally`
C#使用结构化的异常处理模型，主要围绕三个关键字，语义很直观
- `try`块：开始一段有风险的操作
  - 包含可能会抛出异常的代码
  - 它必须至少跟一个`catch`块或一个`finally`块
- `catch`块：捕获特定类型的异常
  - 用于捕获和处理特定类型的异常
  - 可以有多个`catch`块来捕获不同类型的异常，处理更具体的异常应该放在前面
  - C#支持按类型匹配，也支持when条件过滤；`catch(Exception)`是大网，但别乱用，大网会吞掉本来应该在调试阶段暴露的错误
- `fianlly`块：无论是否发生异常都执行的地方
  - 包含的代码总是会执行，无论是否发生异常
  - 通常用于释放资源，例如关闭文件流、数据库连接等
  - 销毁资源、回收句柄、释放锁都应该写在这里

- `using`：是语法糖
  - 它会在using 块结束时自动调用对象的Dispose，用法等价于try/finally

### 基本语法和工作流程
```cs
try
{
    // 可能会将抛出异常的代码
    int divisor = 0;
    int result = 10 / divisor; // 这将抛出 divideByZeroException
}
catch (DivideByZeroException ex)
{
    // 专门处理除以零的异常
    Console.WriteLine($"发生除以零错误：{ex.Message}");
}
catch (Exception ex)
{
    // 捕获所有其他类型的异常（更通用的异常应该放在后面）
    Console.WriteLine($"发生未知错误：{ex.Message}");
}
finally
{
    // 无论是否发生异常，这里的代码都会执行
    Console.WriteLine("finally 块执行了，用于清理资源");
}
```
执行流程
1. 执行`try`块内的代码
2. 如果无异常，跳过所有`catch`块，执行`finally`块（如果有）
3. 如果有异常，CLR会查找匹配的`catch`块
4. 找到匹配的`catch`块后，执行其中的代码
5. 最后，执行`finally`块（如果有）

### 常见的异常类型（继承自`System.Exception`）
所有异常都派生自`System.Exception`类

| 异常类型 | 描述 |
| `SystemException` | 系统定义的运行时异常的基类 |
| `ArgumentException` | 当向方法传递了无效参数时抛出 |
| `ArgumentNullException` | 当传递了不应为`null`的参数时抛出 |
| `IndexOutOfRangeException` | 当数组索引超出范围时抛出 |
| `NullReferenceException` | 当尝试访问空引用的成员时抛出 |
| `DivideByZeroException` | 当尝试用整数除以零时抛出 |
| `FormatException` | 当参数的格式不符合调用方法的规范时抛出（如`int.Parse("abc")`）|
| `FileNotFoundException` | 当尝试访问不存在的文件时抛出 |
| `IOException` | 发生I/O错误时抛出的异常的基类 |

### 创建和抛出自定义异常
有时，需要创建特定于自己应用程序业务的异常
1. 创建一个类，继承自`Exception`或其子类（如`ApplicationException`），但微软现在更推荐直接继承`Exception`
2. 实现基本的构造函数
```cs
using System;

// 自定义异常类
public class InsufficientFundsException : Exception
{
    public decimal CurrentBalance { get; }
    public decimal WithdrawAmount { get; }

    // 构造函数
    public InsufficientFundsException(string message, decimal currentBalance, decimal withdrawAmount) : base(message)
    {
        CurrentBalance = currentBalance;
        WithdrawAmount = withdrawAmount;
    }

    // 重写 ToString() 来提供更多信息
    public override string ToString()
    {
        return $"{Message} (当前余额：{CurrentBalance}, 尝试取款：{WithdrawAmount})";
    }
}

// 使用自定义异常
public class BankAccount
{
    public decimal Balance { get; private set; }

    public void Withdraw(decimal amount)
    {
        if (amount > Balance)
        {
            // 抛出自定义异常
            throw new InsufficientFundsException("余额不足", Balance, amount);
        }

        Balance -= amount;
    }

    public void Deposit(decimal amount)
    {
        if (amount > 0)
        {
            Balance += amount;
        }
        else return;
    }
}

// 调用
class Program
{
    static void Main()
    {
        try
        {
            var account = new BankAccount { };
            account.Deposit(1);
            account.Withdraw(200); // 这会抛出 InsufficientFundsException
        }
        catch (InsufficientFundsException ex)
        {
            Console.WriteLine(ex.ToString()); 
        }
    }
}
```

### `finally`
`finally`块无论是否抛异常都会执行
```cs
try
{
	OpenConnection();
}
catch
{
	Console.WriteLine("连接失败");
}
finally
{
	CloseConnection(); // 一定执行
}
```
即使在`catch`里`return`，`finally`仍然会执行

#### 简化写法
可以使用`using`替代，`try-finally` `using`本质是try-finally的语法糖
```cs
using (var fs = new FileStream("data.txt", FileMode.Open))
{
	// 自动调用 fs.Dispose()
}
```
等价于
```cs
FileStream fs = null;
try
{
	fs = new FileStream("data.txt", FileMode.Open);
}
finally
{
	fs?.Dispose();
}
```

### 异常机制的底层逻辑
C#的异常是基于CLR的结构化异常处理（SEH）\
一旦发生错误，程序会
1. 创建一个异常对象（派生自`System.Exception`）
2. 沿调用栈逐层回溯，寻找匹配的`catch`
3. 如果没人接住，程序终止

```cs
void A() => B();
void B() => throw new Exception("出错了!")；

try { A(); }
catch (Exception ex)
{
	Console.WriteLine(ex.message);
}
```
输出：`出错了!`\
异常从`B()`一路冒泡，被最外层的`catch`捕获

#### catch的多种形态
C#允许多种`catch`形式
```cs
try
{
	// ...
}
catch (FileNotFoundException ex)
{
	Console.WriteLine("文件未找到");
}
catch (IOException ex)
{
	Console.WriteLine("IO错误");
}
catch (Exception ex)
{
	Console.WriteLine("其他错误");
}
```
- 顺序重要，子类要放在前面
- `catch`可以没有变量
```cs
catch
{
	Console.WriteLine("发生错误");
}
```
- 可以使用过滤器
```cs
catch (Exception ex) when (ex.Message.Contains("网络"))
{
	Console.WriteLine("网络相关异常")；
}
```

### 异常机制底层实现
#### 异常在底层的运行
C#的异常不是“if分支”，而是运行时机制\
当`throw`一个异常时，CLR(.NET运行时)会做三件事
1. 构造异常对象
```cs
throw new InvalidOperationException("非法操作");
```
在堆上分配一个`InvalidOperationException`对象
2. 展开调用栈（stack unwinding）
	- CLR会从当前函数开始，逐层往上查找有无`try`区块
	- 每经过一层函数，都会销毁局部变量（执行析构或`finally`）
	- 直到找到能匹配的`catch`
3. 转移控制流
	- 控制权交给`catch`块
	- 没人接住 -> 程序终止（或触发全局异常事件）

这是一整套系统级过程，不是普通跳转\
所以异常的“代价”主要来自栈展开和对象创建

#### 性能开销
异常的代价不是“存在try-catch”，而是“发生 throw”

不抛异常时\
`try-catch`几乎零性能损耗\
JIT编译器只是在内部生成异常表，正常路径完全一样

抛出异常时\
就贵了，主要开销
1. 创建异常对象（内存分配 + 收集堆栈信息）
2. 栈展开 + 调用`finally`
3. CLR捕获堆栈、调用异常过滤器等

大致成本几倍：
- 普通函数调用：微秒级
- 异常抛出 + 捕获：百微妙~毫秒级（取决于栈深度）
在循环或高频逻辑里抛异常时灾难性的

#### C#为什么要这么设计
因为异常的目的不是性能，而是语义：把“异常流程”从“正常流程”中隔离开\
异常让：
- 调用层代码更干净
- 错误流与业务流分离
- 框架层可以集中捕获并处理

也就是说：异常是一种控制流语义分层机制，不是“错误检测语法糖”

#### `throw`与`throw ex`的区别
```cs
catch (Exception ex)
{
	throw; // 保留原始调用堆栈
}

catch (Exception ex)
{
	throw ex; // 堆栈从这里重新开始，丢失源头
}
```
CLR在执行`throw;`时不会重建异常对象，只是继续向上抛\
这就是为什么总是推荐使用裸`throw;`

#### 内部结果：异常表（Exception Handling Table）
JIT编译时，CLR会为每个函数建立一张异常表

| Try Start | Try End | Handler Type | Handler Start | Exception Type |
| - | - | - | - | - |
| IL_0001 | IL_0020 | Catch | IL_0021 | System.Exception |

也就是说：
- `try-catch`是一种元数据结构
- 不是在每个if中插入判断
- 所以不抛异常时，执行性能几乎一致

### C#中异常控制结构的正确使用方式
抛异常要谨慎。异常不是炫技工具，不是“我不想写if就直接throw”。一个好的throw应该用于“此路径无法继续”的时刻，而不是替代if-check

C#的异常会导致GC压力增加，因为堆栈信息需要分配对象。同时，它会破坏CPU分支预测，对性能敏感的场景，比如Update循环、深度递归中、每帧执行的热路径，都尽量避免抛异常。Unity的游戏逻辑尤其如此，异常抛多了，不仅卡顿，还让profiler看起来像在尖叫

#### 最佳实践
1. 只在真正异常的情况下使用异常
    - 不要用异常来控制正常的程序流程。例如，检查文件是否存在应该用`File.Exists`，而不是通过捕获`FileNotFoundException`来实现

不好的做法
```cs
try
{
    File.ReadAllText("myfile.txt");
}
catch (FileNotFoundException)
{
    // 文件不存在的处理
}
```
好的做法
```cs
if (File.Exists("myfile.txt"))
{
    File.ReadAllText("myfile.txt");
}
else
{
    // 文件不存在的处理
}
```

2. 从最具体到最不具体捕获异常
    - 这样能确保最合适的处理程序被执行

3. 不要“吞噬”异常
    - 空的`catch`块会隐藏错误，使得调试极其困难
```cs
// 不好的做法
try { /*dosomething*/ }
catch (Exception) { } // 吞掉异常，什么也不做
```
- 至少应该记录下异常信息，一遍后续分析和调试
```cs
catch (Exception ex)
{
    Logger.LogError(ex, "操作失败");
    // 可能还需要决定是重新抛出、吞下还是抛出新的异常
}
```

4. 使用`throw;`而不是`throw ex;`来重新抛出
    - `throw;`会保留原始的异常堆栈跟踪，而`throw ex;`会重置堆栈跟踪，丢失关键的调试信息
```cs
catch (Exception)
{
    // 一些清理工作
    throw; // 正确，保留原始堆栈跟踪
    // throw ex; // 错误，堆栈跟踪从这里开始
}
```

5. 利用`using`语句管理资源
    - 对于实现了`IDisposable`接口的对象（如文件流、数据库连接），使用`using`语句可以确保资源被正确释放，即使发生异常。它在功能上等同于`try-finally`
```cs
// using 语句等价于 try-finally，并自动调用 Dispose()
using (var fileStream = new FileStream("file.txt", FileMode.Open))
{
    // 使用 fileStream
} // 这里会自动调用 fileStream.Dispose(), 关闭文件
```

异常的捕获，要么处理它，要么别动它\
catch之后什么都不做，然后继续运行，这类代码是灾难。要么把错误往上传，要么记录日志，要么转成更具体的错误，要么在catch后让程序回到一个安全状态\
C#的异常体系不是为了“修补错误”，而是为了“让错误显式化、结构化、可追踪”\
写代码不怕出错，怕的是出错后系统没反应；优秀的程序员不会让异常消失，而是让它有迹可循\
在好的架构里，异常有“层级传递”
- 底层：抛出具体异常（IO、网络、解析等）
- 中层：转译为业务语义异常
- 顶层：集中捕获、记录日志、优雅退出

| 场景 | 建议 |
| - | - |
| 可预期错误 | 用`if`检查、不抛异常 |
| 不可预期错误 | 抛异常（`throw`）|
| 临界资源 | `try-finally`或`using` |
| 顶层逻辑 | 全局异常捕获（`AppDomain.CurrentDomain.UnhandledException`）|
| 框架封装 | 定义自定义异常类，分层管理 |

#### 异常适用场景

| 场景 | 说明 | 是否该抛异常 |
| - | - | - |
| 文件不存在 | 用户输入错误可预期 | 用`File.Exists()`检查 |
| 网络断开 | 系统不可控因素 | 抛异常 |
| 参数非法 | 编程错误 | 抛`ArgumentException` |
| 玩家按错按钮 | 业务逻辑 | if检查 |
| 程序逻辑错误 | 无法恢复 | 抛异常或`Debug.Assert` |

通俗讲：可预期的用条件判断，不可预期的才抛异常

## 用返回值表示失败 vs 抛出异常
异常是API契约的一部分。当设计一个方法，是用返回值表示失败，还是用异常，背后是一个哲学问题：失败是“预期路径”还是“异常路径”\
- 返回值表示错误：显式、可控、但容易被忽略
  - 优点：没有隐藏成本，没有额外控制流跳跃，性能更可预测，非常适合底层代码、性能敏感路径、游戏引擎内部循环
  - 缺点：调用者完全忽略
  - 适用场景
    - 预期的、经常发生的失败情况
    - 性能敏感场景
    - 与其他语言/系统交互
    - 简单状态检查
- 抛出异常：强制中断流、自动传播
  - 优点：写业务逻辑时不需要每行都在if(err)里反复检查
  - 缺点：异常跨栈展开会毁掉性能预知性，在游戏循环、渲染管线、实时逻辑里异常传播增加调试难度
  - 适用场景
    - 意外的、异常的情况
    - 严重的、不可恢复的错误
    - 违反前置条件的情况
    - 需要沿调用栈向上传播的错误

判断是否该抛异常，只问一句话：这件事的失败，是“可预期事件”还是“违反世界规则”

无论作何选择，一致性比绝对正确更重要。在同一个项目或模块中保持统一的错误处理策略