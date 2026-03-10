---
title: Function
date: 2025-06-01
author: "ljf12825"
type: file
summary: C# function
---

在C#中，函数通常被称为方法（Method）\
```cs
// 基本结构
[修饰符] [返回类型] 方法名([参数列表])
{
    // 方法体
}
```
## 参数传递
1. 值传递（默认）
传入的是参数的副本，方法内修改不影响外部
```cs
void Change(int x) { x = 10; }
int a = 5;
Change(a); // a 还是 5
```

2. 引用传递`ref`
传入的是变量的引用，方法内修改会影响外部，传入时必须已经赋值
```cs
void Change(ref int x) { x = 10; }
int a = 5;
Change(ref a); // a 变成 10
```

3. 输出参数`out`
必须在方法内赋值，用来返回多个结果，传入时可以不赋值
```cs
void Divide(int a, int b, out int result, out int remainder)
{
    result = a / b;
    remainder = a % b;
}

int res, rem;
Devide(10, 3, out res, out rem); // res = 3, rem = 1
```

4. 只读引用`in`(C# 7.2+)
方法内只能读取，不可更改（只读保证），传入时必须已经赋值\
避免大对象复制，提升性能，同时保证只读安全
```cs
void Change(in int x) 
{
    Console.WriteLine(x);
    // x = 8; // error
}
```

5. 可选参数(Optional Parameters)
在定义方法时，给参数一个默认值，调用方法时，如果不传这个参数，就使用默认值\
默认值必须是编译时常量或者`default(T)`

```cs
void Greet(string name = "Guest", int times = 1) => for (int i = 0; i < times; ++i) Console.WriteLine($"Hello, {name}!");
Greet(); // Hello, Guest!(使用默认)
Greet("Alice"); // Hello, Alice!
Greet("Bob", 3); // Hello, Bob（输出三次）
```
注意：
  - 可选参数必须放在参数列表的末尾，否则调用时会产生歧义
  - 默认值必须是常量表达式或`default(T)`
  ```cs
  void Print(int x = 10, string y = "hello", object obj = null, int z = default(T)) {}
  ```

6. 命名参数(Named Parameters)
调用方法时，可以显式写出参数名，而不是按顺序传参，可以提高可读性，尤其是参数很多的时候，可以和可选参数结合使用

```cs
void CreateUser(string username, int age, bool isAdmin = false) => Console.WriteLine($"{username}, {age}, Admin={isAdmin}");

// 常规调用
CreateUser("Tom", 20, true);

// 命名参数调用（顺序可变）
CreateUser(age: 25, username: "Alice", isAdmin: true);

// 结合可选参数
CreateUser(username: "Bob", age: 30); // isAdmin使用默认值
```

**可选参数和命名参数结合的优势**\
减少方法重载\
使用重载支持多种调用
```cs
void Log(string message) { ... }
void Log(string message, int level) { ... }
```
可以直接写
```cs
void Log(string message, int level = 1) { ... }
```

提升可读性
```cs
// 不易读
SendEmail("test@example.com", "hi", true, false, true);

// 易读
SendEmail(to: "test@example.com", subject: "hi", cc: true, bcc: false, isImportant: true);
```

**注意事项**\
  - 命名参数必须在位置参数之后
  ```cs
  Greet("Alice", times: 3); // 正确
  Greet(name: "Alice", 3); // 错误
  ```
  - 不要随意修改默认值：因为默认值在编译时就确定，如果API发布后改了默认值，调用方法没重新编译的话，还是用老值
  - 慎用太多可选参数：过多的可选参数会导致方法签名复杂，建议拆分成配置类

7. `params`参数
`params`修饰符允许方法接收数量不定的参数\
调用方法时可以传入：0个参数，多个参数，或者一个数组\
编译器会自动把多个参数打包成一个数组传给方法

```cs
void PrintNumbers(params int[] numbers) => foreach (int n in numbers) Console.WriteLine(n);

// 调用方式
PrintNumbers(); // 什么都不打印
PrintNumbers(1, 2, 3, 4); // 打印 1 2 3 4
PrintNumbers(new int[] {5, 6, 7}); // 打印 5 6 7
```
等价于写了一个接收`int[]`的函数，但调用时更灵活

**限制条件**\
只能有一个`params`参数
```cs
void Foo(params int[] a, params string[] b); // 错误
```
必须是方法参数列表中的最后一个
```cs
void Foo(int x , params int[] numbers); // 正确
void Bar(params int[] numbers, int x); // 错误
```
`params`可以是任意类型的数组(`int[]`、`string[]`、`object[]`等)\
示例：使用`pramas` + `object` 传入不同类型参数
```cs
void PrintAll(params object[] items) => foreach (var item in items) Console.WriteLine(item);

PrintAll(1, "hello", 3.14, true);
// 输出：1 hello 3.14 Ture
```
这种方式常见于日志系统，类似`Console.WriteLine`的实现

示例：和其他参数混用
```cs
void Log(string tag, params string[] messages) => Console.WriteLine($"[{tag}]" + string.Join(", ", message));

Log("INFO", "Game Start", "Player Joined");
Log("ERROR"); // 没有消息也行
```

**注意事项**\
每次调用带`params`的方法，都会分配一个数组（哪怕只传1个参数）\
如果方法在性能敏感的地方（比如游戏循环内）频繁调用，可能会导致GC压力\
优化方案：提供带数组的重载，避免数组分配

## Main Function
在C#程序中，必须有一个`Main`方法作为入口。它通常写在一个类或结构体内
```cs
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello World");
    }
}
```
- `static`：`Main`必须是静态方法，因为在程序启动时还没有对象的实例，必须通过类来调用
- 返回值：返回值类型可以是`void`或`int`，返回值会作为程序的退出码
- `string[] args`：命令行参数，可选

`Main`函数的几种有效签名
```cs
static void Main();                // 无返回值，无参数
static void Main(string[] args);   // 无返回值，有参数
static int Main();                 // 有返回值，无参数
static int Main(string[] args);    // 有返回值，有参数
```

### 命令行参数
假设编译成`MyApp.exe`，然后运行
```
MyApp.exe hello world 123
```
在代码里
```cs
static void Main(string[] args)
{
    foreach (var arg in args) Console.WriteLine(arg);
}
```

命令行参数的作用时允许用户在启动应用程序时，从外部向程序传递配置信息或数据，从而让程序的行为可以根据输入动态改变，而无需修改代码本身。这极大地提高了程序的灵活性和可重用性\
常见场景：
1. 配置程序运行模式
允许用户指定程序以不同的模式运行，例如开启调试模式、详细输出模式或指定使用哪种算法
  - 示例：`MyApp.exe --debug --verbose`
    - 程序接收到`--debug`和`--verbose`参数后，可以输出更详细的日志信息

2. 传递输入/输出文件路径
这是最常见的用途之一。程序本身不硬编码文件路径，而是由用户通过参数指定要处理的文件以及结果输出的位置
  - 示例：`MyApp.exe -input data.txt -output report.pdf`
    - 程序会读取`data.txt`文件，处理后将结果生成到`report.pdf`

3. 设置程序选项和标志
用于开启或关闭特定功能，或者设置一些简单的值
  - 示例：`MyApp.exe -level 5 -name "John Doe" -force`
    - `-level`后面跟了一个值`5`
    - `-name`后面跟了一个字符串值
    - `-force`是一个标志（flag），通常表示“强制执行”，它本身不需要值，它的存在即代表`true`

4. 自动化脚本和任务
在批处理文件(.bat)、PowerShell脚本或CI/CD流程中，经常通过命令行参数来调用和控制应用程序，实现自动化

5. 开发与调试
开发者可以在IDE中预设命令行参数，方便在调试时测试程序对不同参数的处理逻辑
  - 在Visual Studio中设置
    - 右键点击项目 -> “属性”
    - 选择“调试”选项卡
    - 在“命令行参数”文本框中输入你的参数（例如：-input test.txt）
    - 这样每次从Visual Studio启动调试时，都会自动带上这些参数。

#### 在程序中获取命令行参数
1. 使用`Main`方法的参数（最常用）
`Main`方法是C#应用程序的入口点，它可以被定义为一个接受字符串数组参数的方法，这个数组就是命令行参数
```cs
using System;

namespace CommandLineArgsDemo
{
    class Program
    {
        // Main 方法的参数 string[] args 就是命令行参数数组
        static void Main(string[] args)
        {
            Console.WriteLine("Number of command line arguments: " + args.Length);

            for (int i = 0; i < args.Length; i++)
            {
                Console.WriteLine($"Arg[{i}] = {args[i]}");
            }

            // 简单的参数处理示例
            if (args.Length > 0 && args[0] == "--help")
            {
                Console.WriteLine("This is the help message.");
            }
        }
    }
}
```
  - 编译运行
  ```bash
  dotnet run -- arg1 arg2 "third argument" --help
  ```
    - 注意：在`dotnet run`命令中，`--`之后的参数才会传递给程序。`args`数组将包含：`["arg1", "arg2", "third argument"， "--help"]`
  - 直接运行EXE:
  ```bash
  .\CommandLineArgsDemo.exe arg1 arg2 "third argument" --help
  ```

2. 使用`Environment.GetCommandLineArgs`
这个方法返回一个字符串数组，其中也包含了命令行参数。与`Main`方法的参数不同的是
  - 数组的第一个元素（索引`[0]`）是当前程序的可执行文件路径
  - 从第二个元素（索引`[1]`）开始才是用户传入的参数
```cs
using System;

namespace CommandLineArgsDemo
{
    class Program
    {
        static void Main() // Main 方法可以不接受参数
        {
            // 使用 Environment.GetCommandLineArgs
            string[] allArgs = Environment.GetCommandLineArgs();

            Console.WriteLine("Executable path: " + allArgs[0]);
            Console.WriteLine("Arguments:");

            for (int i = 1; i < allArgs.Length; i++) // 从1开始，跳过exe路径
            {
                Console.WriteLine($"  [{i}] {allArgs[i]}");
            }
        }
    }
}
```

#### 复杂命令行参数
对于简单的`-flag value`格式，自己写循环和逻辑判断就足够了。但如果参数非常复杂，例如支持`--long-option`、`-s`（短选项）、可选参数等，手动解析就非常麻烦\
可以使用专门的命令行参数解析库，它们可以自动处理各种复杂的场景，并提供`--help`帮助文档生成等功能
流行的NuGet包有
1. System.CommandLine(.NET推荐)
  - 这是微软官方推出的新一代命令行解析库，功能强大，集成度高，是未来的方向

2. CommandLineParser
  - 一个非常流行且成熟的库，通过属性（Attribute）来定义参数模型，非常直观

## Lambda
Lambda表达式本质上是匿名函数（没有名字的函数），可以用来简化委托和表达式树的写法。它的形式是
```cs
(参数列表) => 表达式或语句块
```
`=>`读作goes to 左边是输入参数，右边是返回结果或逻辑
```cs
x => x * x
```
这是一个接收一个参数`x`并返回`x * x`的函数

### 基础用法
1. 单参数表达式
```cs
Func<int, int> square = x => x * x;
Console.WriteLine(square(5)); // 25
```
这里`Func<int, int>`代表输入`int`，返回`int`

2. 多参数表达式
```cs
Func<int, int, int> add = (a, b) => a + bl
Console.WriteLine(add(3, 4)); // 7
```

3. 无参数
```cs
Func<int> getRandom = () => new Random().Next(1, 10);
Console.WriteLine(getRandom());
```

4. Lambda的语句块写法
如果逻辑复杂，可以用花括号写多条语句
```cs
Func<int, int, int> multiplyAndAdd = (a, b) =>
{
  int product = a * b;
  return product + 10;
};
Console.WriteLine(multiplyAndAdd(2, 3)); // 16
```

5. Lambda与委托
传统写法（委托 + 匿名方法）
```cs
Func<int, int> square = delegate (int x) { return x * x; };
```
Lambda简化后
```cs
Func<int, int> square = x => x * x;
```

6. LINQ中使用
```cs
int[] nums = { 1, 2, 3, 4, 5 };;
var evenNums = nums.Where(n => n % 2 == 0);

foreach (var n in evenNums) Console.WriteLine(n); // 2, 4
```
排序
```cs
List<string> names = new() { "Tom", "Jerry", "Alice" };
names.Sort((a, b) => a.Length.CompareTo(b.Length));
```

7. Lambda的类型推断
C#会根据上下文推断参数和返回类型，不用显式写类型
```cs
var list = new List<int> {1, 2, 3};
list.ForEach(n => Console.WriteLine(n));
```
这里`n`自动推断为`int`

8. Lambda捕获外部变量（闭包）
Lambda可以“记住”它定义时的上下文变量
```cs
int factor = 10;
Func<int, int> multiplier = x => x * factor;

Console.WriteLine(multiplier(5)); // 50
```
注意：`factor`是捕获变量，如果后面改`factor`，Lambda内的值也会改变

9. Action与Func
  - Func：有返回值的Lambda
  例如`Func<int, int, int>`表示接收两个`int`，返回一个`int`
  - Action：无返回值的Lambda
  例如`Action<string>`表示接收一个`string`参数但没有返回值
  ```cs
  Action<string> greet = name => Console.WriteLine($"Hello {name}");
  greet("World");
  ```

10. Lambda与事件
Lambda可以简化事件订阅
```cs
button.Click += (sender, e) => MessageBox.Show("Button clicked!");
// 传统方法需要定义一个单独的方法
```

11. 表达式树（Expression Trees）
高级用法：Lambda不仅可以编译成委托，还可以编译成数据结构（表达式树），允许在运行时分析、转换或翻译代码\
例如LINQ to SQL将C#代码翻译成SQL语句
```cs
// 这是一个表达式Lambda，它被编译器识别为表达式树
System.Linq.Expressions.Expression<Func<int, bool>> isEvenExpression = n => n % 2 == 0;

// 这只是一个普通的委托
Func<int, bool> isEvenDelegate = n => n % 2 == 0;
```
`isEvenExpression`不是一个可执行的方法，而是一个描述`n => n % 2 == 0`这个逻辑的树形数据结构，可以被其他组件（如ORM框架）解析

## 局部函数（C# 7.0+）
局部函数就是定义在方法（或属性、构造函数等）内部的函数\
它只在当前方法作用域内可见，外部不能之际调用
```cs
class Calculator
{
  public int SumToN(int n)
  {
    int Add(int x, int y) => x + y; // 局部函数
    int total = 0;
    for (int i = 1; i <= n; ++i)
      total = Add(total, i);
    return total;
  }
}
```
这里的`Add`是个局部函数，只能在`SumToN`内使用

### 局部函数的优势
1. 封装性更强
避免只把方法内部用的小逻辑暴露成类的公有/私有方法

2. 可读性更好
把复杂逻辑拆成小块，但又不会污染类的命名空间

3. 性能比匿名函数更优
  - 匿名函数（Lambda）如果捕获外部变量，会生成闭包对象，增加分配
  - 局部函数是编译期就确定的，不需要额外分配对象，性能更高

### 局部函数的特性
1. 可访问外部变量
```cs
void PrintSquares(int n)
{
  int counter = 0;

  void PrintOne(int x) // 局部函数
  {
    counter++;
    Console.WriteLine(x * x);
  }

  for (int i = 1; i <= n; ++i) PrintOne(i);

  Console.WriteLine($"调用了{counter}次")
}
```

2. 支持递归
```cs
int Factorial(int n)
{
  int Inner(int x)
  {
    if (x <= 1) return 1;
    return x * Inner(x - 1);
  }
  return Inner(n);
}
```

3. 可以是异步函数
```cs
async Task<int> GetDataAsync()
{
  async Task<int> Fetch() // 局部异步函数
  {
    await Task.Delay(500);
    return 42;
  }
  return await Fetch();
}
```

4. 可以用`static`修饰（C# 8+）
表示不捕获外部变量，避免闭包
```cs
int AddNumbers(int a, int b)
{
  static int Add(int x, int y) => x + y;
  return Add(a, b);
}
```

**使用场景**
- 复杂方法内的子逻辑：避免写到类级别
- 递归辅助函数：比如`DFS`、`Factorial`
- 提高性能：在需要小函数但不想用Lambda时
- 异步内部步骤：`async Task`拆分


## [异步](/LearnCSharp/Thread.cs)

## 顶级语句(Top-level statements)(C# 9.0+)
在C# 9.0之后，微软引入了“顶级语句”的概念，它的作用是：让简单程序（特别是控制台应用）写起来更简洁，不必再写`class Program`和`static void Main`\
比如以前要写
```cs
using System;

class Program
{
  static void Main(string[] args)
  {
    Console.WriteLine("Hello, World!");
  }
}
```
有了顶级语句之后，只需要
```cs
using System;

Console.WriteLine("Hello, World!");
```
这里没有类，也没有`Main`，但编译器会自动生成一个`Program`类和`Main`方法，将顶级语句放入其中\
所以顶级语句只是语法糖，不影响本质

### 限制与规则
1. 只能有一个文件使用顶级语句
  - 如果多个文件使用了顶级语句，会报错

2. 命名空间、类、方法必须卸载顶级语句之后
```cs
using System;

Console.WriteLine("Hello");

class MyClass { }
```

3. 顶级语句不能出现在方法或类内部
4. 适合小型程序、示例代码、脚本化开发