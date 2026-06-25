---
title: Lambda
date: 2025-06-01
author: "ljf12825"
type: file
summary: C# lambda
---

简单来说，Lambda表达式是一个匿名函数。可以把它理解为一个没有名字的、简洁的方法。它使用`=>`这个Lambda运算符（读作"goes to"）来连接参数列表和表达式主体

它的核心思想是：需要方法的地方，如果这个方法很简单，且只会用一次，就不必费心去定义一个完整的方法，而是直接用Lambda表达式内联写出它的实现

## Lambda表达式的语法演变
假设有一个需求：从一个整数列表中找出所有偶数
- 传统方法：命名方法
这是C#1.0的方式，需要定义一个完整的方法，然后将这个方法作为参数传递
```cs
class Program
{
    static void Main()
    {
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6 };

        // 将命名方法 IsEven 作为参数传递给 FindAll 方法
        List<int> evenNumvers = numbers.FindAll(IsEven);

        foreach (var num in evenNumbers)
        {
            Console.WriteLine(num);
        }
    }

    // 定义一个独立的、命名的方法
    static bool IsEven(int number)
    {
        return (number %2) == 0;
    }
}
```

- 匿名方法
C#2.0引入了匿名方法，允许内联地定义一个没有名字的代码块
```cs
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6 };

// 使用匿名方法，省略了方法名和返回类型声明
List<int> evenNumbers = numbers.FindAll(delegate (int number)
{
    return (number % 2) == 0;
});
```

- Lambda表达式
C#3.0引入了Lambda表达式，语法得到了极大的简化
```cs
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6 };

// 使用 Lambda 表达式
List<int> evenNumbers = numbers.FindAll(number => number % 2 == 0);
```
> Lambda表达式的本质是：编译器在语法层面自动生成了一个符合委托签名的方法，然后在运行时通过委托对象引用它

## Lambda表达式的两种形式
- 表达式Lambda
当函数体只有一个表达式时，可以省略`{ }`和`return`语句。编译器会自动计算这个表达式并返回其结果
```cs
(input-parameters) => expression
```
示例
```cs
// 一个参数，可以省略括号
x => x * x

// 两个参数，必须加括号
(x, y) => x == y

// 显式指定参数类型（通常编译器能推断，但有时需要）
(int x, string s) => s.Length > x
```

- 语句 Lambda
当函数体包含多条语句时，需要使用`{ }`将它们包围起来，并且需要显式地使用`return`语句（如果有返回值的话）
```cs
(input-parameters) => { <sequence-of-statements> }
```
示例
```cs
// 多条语句，使用 { }
(name, age) => {
    string greeting = $"Hello, {name}";
    Console.WriteLine(greeting);
    return age >= 18; // 显式 return
}
```

## Lambda底层与性能
Lambda在底层有两种完全不同的实现路径，性能差异巨大

### 两种底层实现
C#的Lambda主要分两种语义

| 类型 | 示例 | 编译后本质 | 性能特点 |
| - | - | - | - |
| 委托 Lambda | `x => x * 2`（直接赋给`Func<int, int>`）| 编译成**方法 + 委托对象** | 快，零表达式树开销 |
| 表达式树 Lambda | `x => x * 2`（赋给`Expression<Func<int, int>>`）| 编译成 **表达式树对象（AST）** | 慢，主要用于动态执行或编译时分析 |

#### 委托 Lambda（最常见）
```cs
Func<int, int> f = x => x * 2;
Console.WriteLine(f(10));
```
编译器行为：会生成一个隐藏的类（closure class）和一个静态或实例方法。例如
```cs
private sealed class DisplayClass
{
    public int Multiply(int x) => x * 2;
}

f = new Func<int, int>(new DisplayClass().Multiply);
```
如果Lambda没有捕获外部变量，那么甚至连类都不需要
```cs
f = new Func<int, int>(<PrivateImplementationDetails>.LambdaMethod);
```
- 如果不捕获外部变量，Lambda编译成普通的静态方法 -> 零额外内存分配
- 如果捕获了外部变量，会生成一个闭包类（closure object），捕获的变量变为这个类的字段

#### 表达式树 Lambda
```cs
Expression<Func<int, int>> expr = x => x * 2;
```
这不是一个可直接执行的函数，而是生成一个完整的表达式树对象结构
```cs
BinaryExpression(
    ParameterExpression("x") * ConstantExpression(2)
)
```
这个结构在运行时可分析、修改、在编译成可执行代码（通过`Compile()`）\
这类Lambda常见于 LINQ to SQL / EF / 动态编译场景\
性能上，它要创建大量对象节点，远慢于普通委托 Lambda

### 闭包（Closure）的底层机制
这是影响性能的关键
```cs
int factor = 3;
Func<int, int> f= x => x * factor;
```
编译器生成的底层代码会变成
```cs
class DisplayClass
{
    public int factor;
    public int Multiply(int x) => x * factor;
}
```
执行时
```cs
var display = new DisplayClass { factor = 3 };
Func<int, int> f = new Func<int, int>(display.Multiply);
```
这意味着：
- `factor`不再是栈变量，而是被提升到堆上的对象字段
- Lambda的生命周期和这个closure对象绑定
- 只要`f`存活，`factor`也不会被回收

所以闭包在频繁创建时会产生GC压力

| 场景                      | 底层实现                | 性能影响           | 建议       |
| ----------------------- | ------------------- | -------------- | -------- |
| 不捕获外部变量                 | 静态方法 + 委托           | 最快，等价于普通函数调用 | 尽量用这种形式  |
| 捕获外部变量                  | 生成闭包类 + 对象分配        | 会有额外堆分配     | 在高频路径中避免 |
| 表达式树 Lambda             | 创建表达式节点 + Compile() | 极慢           | 只在动态场景使用 |
| async / await 中的 Lambda | 状态机 + 闭包 + 任务封装     | 有编译器生成状态类   | 避免频繁创建   |

### JIT优化与调用成本
Lambda委托最终在JIT阶段优化的非常彻底
- 调用开销：几乎等价于调用一个普通方法（`callvirt`指令调用委托）
- 内联：JIT不会自动内联委托调用，但可以通过直接写方法绕过
- 分配：捕获变量会产生一次堆分配，但复用时不会反复分配

> Lambda只是语法糖，真正的性能瓶颈来自闭包捕获和委托分配，不来自Lambda本身

## Lambda表达式的核心特性：捕获外部变量（闭包）（closure class）
这是Lambda表达式最强大也是最让人困惑的特性之一。Lambda可以访问和修改其定义所在作用域内的变量（局部变量、参数、`this`等）

### 本质
当Lambda使用了外部变量时（比如局部变量、参数），编译器必须想办法让这个变量在Lambda执行期间依然存在\
因为Lambda可能在原函数返回后才执行

于是，编译器会自动生成一个类（称为closure class或display class），把这些捕获的变量变成它的字段
```cs
void Test()
{
    int counter = 0;
    Action inc = () => counter++;
    inc();
    Console.WriteLine(counter);
}
```
表面看是一个局部变量被Lambda修改了\
实际上编译器生成了相当于
```cs
class DisplayClass
{
    public int counter;

    public void Inc() => counter++;
}

void Test()
{
    var display = new DisplayClass();
    display.counter = 0;
    Action inc = new Action(display.Inc);
    inc();
    Console.WriteLine(display.counter);
}
```
所以`counter`不再在栈上，而是在堆上\
这就是“捕获外部变量”的本质：将局部变量提升到堆上，以延长生命周期

### 捕获类型详解
C#的捕获规则非常精细

| 捕获形式 | 示例 | 底层行为 |
| - | - | - |
| 捕获值类型局部变量 | `int a = 1; Func<int> f = () => a;` | 自动生成类字段，存值的拷贝（值类型）|
| 捕获引用类型变量 | `var list = new List<int>(); Func<int> f = () => list.Count;` | 捕获的是“引用”，即堆地址 |
| 捕获参数 | `void F(int x) { Func<int> f = () => x; }` | 参数同样变为闭包字段 |
| 捕获`this` | `Action f = () => this.DoSomething()` | 捕获外部对象引用 |
| 捕获`in`, `ref`, `out`参数 | 不允许，编译器禁止，因为生命周期无法保证 | |

### 多个Lambda捕获同一变量
这个情况很关键
```cs
void Foo()
{
    int n = 0;
    Action a1 = () => n++;
    Action a2 = () => n--;
    a1();
    a2();
}
```
编译器只生成一个共享的closure对象
```cs
class DisplayClass
{
    public int n;
    public void A1() => n++;
    public void A2() => n--;
}
```
也就是说，这两个Lambda实际上在操作同一个堆对象的字段\
任何修改都会互相影响

### 生命周期延长与GC问题
因为捕获的变量被放进堆上的closure对象中，只要Lambda存活，变量就不会被回收
```cs
Func<int> MakeCounter()
{
    int count = 0;
    return () => ++count;
}
```
`count`在栈上原本会随着函数退出而消失\
但由于Lambda返回出去了，它被提升到了堆上，直到返回Lambda不再被引用才释放

这就是闭包的“延长生命周期”特性\
在异步任务、事件回调中尤其容易导致隐藏的内存泄露（比如UI事件不注销）

| 情况               | 成本              | 说明            |
| ---------------- | --------------- | ------------- |
| 捕获 0 个外部变量       | 零分配           | 编译器生成静态方法     |
| 捕获 1+ 外部变量       | 1 次堆分配       | 生成 closure 对象 |
| 多个 Lambda 捕获相同变量 | 共享 closure 对象 | 不额外分配         |
| 捕获大量值类型          | 装箱或堆字段       | 可能产生额外复制或装箱   |
| 闭包长期存活           | 内存压力          | 导致 GC 不回收局部变量 |

### 避免无意的捕获
这是写高性能C#的关键
1. 用`static`Lambda，见后文
2. 不要在循环中声明捕获变量
```cs
// 每次循环都会创建新的闭包对象
for (int i = 0 ; i < 10; i++)
    actions.Add(() => Console.WriteLine(i));

// 改写
for (int i = 0; i < 10; i++)
{
    int local = i;
    actions.Add(() => Console.WriteLine(local));
} 
```
3. 短生命周期场景中复用闭包
    - 比如事件绑定要即时解绑
    - 不要在频繁调用路径中反复创建Lambda
4. 注意 async + Lambda
    - async会生成状态机对象
    - 再加Lambda，会叠加多个堆分配

> Lambda捕获外部变量，就是编译器自动帮你把这些变量提升到堆上，生成一个闭包对象，让Lambda可以在原作用域消失后仍能访问这些变量。性能问题的根源在于：堆分配 + 生命周期延长，不是Lambda语法本身

## 使用场景
### LINQ查询
```cs
var names = new List<string> { "Alice", "Bob", "Charlie" };

// Where：过滤
var shortNames = names.Where(name => name.Length < 5);

// Select：投影/转换
var nameLengths = names.Select(name => name.Length);

// OrderBy：排序
var sortedNames = names.OrderBy(name => name);

// Any/All：判断存在性
bool hasA = names.Any(name => name.StartsWith("A"));
bool allLone = names.All(name => name.Length > 3);
```

### 事件处理
让事件处理代码更紧凑
```cs
// 传统方式
button.Click += new EventHandler(Button_Click);
void Button_Click(object sender, EventArgs e) { ... }

// Lambda 方式
button.Click += (sender, e) => MessageBox.Show("Button clicked!");
```

### 创建委托实例
快速创建`Func`（有返回值的委托）或`Action`（无返回值的委托）的实例
```cs
Func<int, int, int> add = (a, b) => a + b;
int result = add(5, 3);

Action<string> logger = message => Console.WriteLine($"[LOG] {message}");
logger("This is a log");
```

### 用于`Task`和异步编程
```cs
// 启动一个后台任务
Task.Run(() => {
    // 执行一些耗时操作
    for (int i = 0; i < 10; i++)
    {
        Console.WriteLine($"Working... {i}");
        Thread.Sleep(500);
    }
});
```

## Lambda生命周期
Lambda表达式在C#中看起来只是“匿名函数语法糖”，但它的生命周期其实和闭包捕获、委托实例化以及垃圾回收机制紧密相关

在C#编译阶段，Lambda会被“脱糖”成一个方法（或一个隐藏类中的方法）\
有两种情况
1. 不捕获外部变量的Lambda
编译器会直接生成一个静态方法\
生命周期和普通静态方法一样：
- 它的代码在程序集加载后常驻
- 它不会引用任何外部对象
- 不会延长外部变量或对象的寿命
```cs
Func<int, int> f = x => x * 2;
```
编译器生成相当于
```cs
static int <lambda>(int x) => x * 2;
Func<int, int> f = new Func<int, int>(<lambda>);
```
生命周期：常驻，只有委托对象`f`被GC掉之后，这个引用关系结束

2. 捕获外部变量的Lambda（闭包）
编译器会为Lambda生成一个隐藏类（closure class），把被捕获的变量转化为这个类的字段
```cs
int counter = 0;
Func<int> next = () => ++counter;
```
编译器生成的伪代码大致是
```cs
class DisplayClass
{
    public int counter;
    public int <lambda>() => ++counter;
}

var obj = new DisplayClass();
obj.counter = 0;
Func<int> next = new Func<int>(obj.<lambda>);
```
此时，`counter`已经不在栈上，而是提升到堆上，由这个`DisplayClass`实例持有\
只要`next`委托还存在，对象`obj`就不会被GC回收

### 总结
- Lambda的生命周期由它所捕获的上下文对象决定
- 这个上下文对象的生命周期会被委托延长
- 当没有任何地方再引用这个委托时，Lambda与其闭包对象才能一起被回收

## Lambda与委托类型、表达式树
### 委托类型
Lambda表达式可以隐式转换为兼容的委托类型。编译器会根据使用Lambda的上下文来推断其类型
```cs
// 编译器推断 number => number > 0 是一个 Func<int, bool>
Func<int, bool> isPositive = number => number > 0;
```

### 表达式树
表达式树（Expression Tree）是C#语言中非常强大的一个特性，它不是“Lambda的另一种写法”，而是把代码本身结构化成数据的机制\
它是LINQ、ORM、动态编译、规则引擎、AI模型DSL等领域的核心基础之一

#### 表达式树是什么
表达式树是把Lambda表达式的语法结构保存为对象树，而不是编译成可执行的IL代码
```cs
Expression<Func<int, int>> expr = x => x * 2;
```
这里的`expr`不是一个可直接执行的委托，而是一个对象结构
```text
LambdaExpression
 └── BinaryExpression (*)
     ├── ParameterExpression (x)
     └── ConstantExpression (2)
```
可以像访问AST一样去遍历和修改它

#### 存在意义
普通Lambda是执行逻辑的工具\
表达式树是分析逻辑的工具
- 普通Lambda：执行一段逻辑（`Func<int, int>`）
- 表达式树Lambda：描述一段逻辑（`Expression<Func<int, int>>`）

简单来说，表达式树的核心意义在于：它将代码（逻辑）从“执行指令”变成了“可遍历的数据结构”。这个根本性的转变，带来了巨大的灵活性和可能性

##### 核心意义
在传统编程中，一个表达式`x + y`在编译后就会变成一系列的CPU指令，它的唯一目的就是立即计算出一个结果

而表达式树则不同，它把这个表达式本身的结构（操作数是`x`和`y`，操作符是`+`）存储为一个树形结构的数据。这样，就可以在运行时分析、修改、解释这个表达式，而不是仅仅执行它
- 传统方式（立即执行）：`var result = x + y` -> 直接得到结果
- 表达式树方式（延迟或转换执行）：`Expression<Func<int, int>> expr = () => x + y;` -> 得到一个表达式`x + y` 这个逻辑的数据结构

##### 主要应用和优势
###### 应用一：LINQ to SQL / Entity Framework（将C#代码转换为SQL）
这是表达式树最经典、最成功的应用场景
- 问题：当我们写`db.User.Where(u => u.Age > 18)`时，C#的`u.Age > 18`时也给委托（lambda表达式）。如果直接执行，他需要在客户端过滤所有数据，效率极低
- 解决方案：这里的`u => u.Age > 18`被编译器转换为一个表达式树，而不是一个编译后的委托
- 过程：
    1. EF Core 或 Dapper 等库接收到这个表达式树
    2. 它像一个“编译器”，遍历这棵树的节点（这是一个参数`u`，这是一个成员访问`u.Age`，这是一个常量`18`，这是一个“大于”操作）
    3. 根据遍历的结果，它动态地生成对应的SQL语句：`SELECT * FROM Users WHERE Age > 18`
    4. 这个SQL语句被发送到数据库服务器执行，实现了高效的服务端查询

意义：它架起了一座桥梁，让.NET世界中的C#代码能够无缝地映射到外部数据源（如数据库、Web服务）在查询语言上

###### 应用二：动态生成代码
可以在运行时动态地构建一个表达式树，然后将其编译成可执行的委托。这比使用`Emit`或`CodeDom`要简单和安全的多
- 示例：创建一个属性设置器的委托
```cs
var param = Expression.Parameter(typeof(string), "x");
var property = Expression.Property(Expression.Constant(myObject), "Name");
var assignment = Expression.Assign(property, param);
var lambda = Expression.Lambda<Action<string>>(assignment, param).Compile();

lambda("New Name"); // 这行代码等价于 myObject.Name = "New Name";
```
- 意义：极大地简化了运行时代码生成，常用于实现ORM、序列化库、依赖注入容器、Mock框架等需要高性能反射替代方案的场景

###### 应用三：构建动态查询
在UI中，用户可能通过下拉菜单、输入框等组合复杂的查询操作。使用表达式树可以轻松地动态拼接`Where`、`OrderBy`等子句
- 示例：根据用户输入，动态构建`Where(u => u.Age > 18 && u.Name.Contains("A"))`这样的查询
- 意义：提供了极大的灵活性，能够应对复杂多变的业务查询需求

###### 应用四：规则引擎和DSL（领域特定语言）
可以用表达式树来构建一个简单的规则引擎。规则可以被定义数据（例如存储在JSON或XML中）\
然后在运行时被解析并构建成表达式树来执行
- 意义：使业务规则可配置、可扩展，而无需修改和重新编译代码

| 特性 | 传统委托（立即执行）| 表达式树（作为数据结构）|
| - | - | - |
| 核心 | 做什么（What to do）| 如何做（How to do）的描述 |
| 执行时机 | 立即在本地执行 | 可以延迟执行，或转换为其他形式（如SQL）|
| 可读性 | 编译后时机器码，不可读 | 是结构化数据，可在运行时被分析和理解 |
| 主要用途 | 通用编程逻辑 | 数据转换（如LINQ to SQL）、动态代码生成、元编程 |

> 总而言之，表达式树存在的根本意义在于它实现了“元编程”的一个关键环节：让程序能够像处理数据一样处理自身的逻辑。它将代码从“静态的、编译时的”领域解放出来，使其成为“动态的、运行时的”实体，从而为解决像ORM、动态查询、代码生成等复杂问题提供了优雅而强大的工具

#### 内部结构（System.Linq.Expressions 命名空间）
表达式树的核心类型是`Expression`抽象类\
它有几十个派生类型，常见的几类：

| 类型 | 代表语法 | 示例 |
| - | - | - |
| `ConstantExpression` | 常量 | `2`, `"hello"` |
| `ParameterExpression` | 参数 | `x` |
| `BinaryExpression` | 二元运算 | `x * 2`, `x + y` |
| `UnaryExpression` | 一元运算 | `-x`, `!flag` |
| `MemberExpression` | 成员访问 | `x.Age` |
| `MethodCallExpression` | 方法调用 | `x.ToString()` |
| `LambdaExpression` | Lambda定义 | `x => x + 1` |

这些类组合起来，就能完整描述一段计算逻辑

#### 编译器行为
当你写
```cs
Expression<Func<int, int>> expr = x => x * 2;
```
编译器做了两件事
1. 分析Lambda表达式语法
2. 构造表达式树对象（而非IL代码）

实际上，它等价于手动构造
```cs
ParameterExpression p = Expression.Parameter(typeof(int), "x");
ConstantExpression c = Experssion.Constant(2);
BinaryExpression body = Expression.Multiply(p, c);
Expression<Func<int, int>> expr = Expression.Lambda<Func<int, int>>(body, p)
```
表达式树本身只是数据结构，不可直接执行\
要执行它，必须先编译成委托
```cs
var func = expr.Compile(); // 生成 Func<int, int>
Console.WriteLine(func(5)); // 输出 10
```
`Compile()`会动态生成IL（使用 Reflection.Emit），开销很大\
频繁调用Compile()是性能杀手，通常应该缓存结果

#### 用法
1. LINQ to SQL / Entity Framework
```cs
var q = from u in db.Users
        where u.Age > 18 && u.Name.StartsWith("A");
        select u;
```
这个`where`子句编译成表达式树
```cs
x => (x.Age > 18) && x.Name.StartsWith("A");
```
EF不执行它，而是解析表达式树结构，翻译成SQL
```sql
SELECT * FROM Users WHERE Age > 18 AND Name LIKE 'A%'
```
所以LINQ to SQL 能把 C#代码“转译”为SQL，就是靠表达式树解析

2. 动态编译和规则引擎
例如想在运行时根据配置拼出一段逻辑
```cs
Expression<Func<int, bool>> expr = null;

if (rule == "greaterThan10")
    expr = x => x > 10;
else
    expr = x => x < 5;

var compiled = expr.Compile();
Console.WriteLine(compiled(8));
```
这里Lambda的逻辑是动态的，不需要写死\
还能再运行时拼接表达式
```cs
Expression<Func<int, bool>> e1 = x => x > 10;
Expression<Func<int, bool>> e2 = x => x < 5;
var body = Expression.OrElse(e1.Body, e2.Body);
var param = e1.Parameters[0];
var combined = Expression.Lambda<Func<int, bool>>(body, param);
```
实现动态规则系统的关键原理就在这

3. 代码分析与重写
可以用`ExpressionVisitor`遍历并修改表达式树
```cs
class MyVisitor : ExpressionVisitor
{
    protected override Expression VisitConstant(ConstantExpression node)
    {
        if (node.Type == typeof(int))
            return Expression.Constant((int)node.Value * 10);
        return node;
    }
}

var modified = new MyVisitor().Visit(expr);
Console.WriteLine(modified);
```
这可以用来做
- 自动代码重写
- 日志插桩
- 调试器表达式分析
- 自定义DSL解释器

| 操作        | 开销 | 原因        |
| --------- | -- | --------- |
| 构造表达式树    | 高  | 多对象创建     |
| 遍历表达式树    | 中  | 反射式访问     |
| Compile() | 很高 | 动态生成 IL   |
| 调用编译后委托   | 快  | 等价于普通函数调用 |

> 表达式树用于“构建逻辑”，而非“高频执行逻辑”；一旦编译完成并缓存，性能就接近普通委托

| 版本        | 新特性                        |
| --------- | -------------------------- |
| .NET 3.5  | 引入表达式树，支持 Lambda 表达式（LINQ） |
| .NET 4.0  | Expression 可表示更多语法（如循环、条件） |
| .NET 4.6+ | Compile() 性能提升显著           |
| C# 10     | 支持更复杂的表达式模式                |

C#的表达式树本质上是一个受限的AST，目标是安全 + 可分析，而不是编译器级别的AST

#### 类比语法树
##### 编译时的语法树（Syntax Tree）
1. 阶段：编译时（Compile-time）
2. 目的：帮助编译器理解代码结构，进行语法检查、类型推断、优化，并最终生成IL代码或本地机器码
3. 生命周期：一旦编译完成，这个语法树通常就被丢弃了。它存在于编译过程中，不会出现在最终的程序集里
4. 内容：包含所有的语言结构，如`if`语句、`for`循环、方法定义、类定义等。它是一个完整的程序结构表示

它的使命是翻译：将C#源代码翻译成可执行的指令

##### 运行时的表达式树（Expression Tree）
1. 阶段：运行时（Runtime）
2. 目的：将代码逻辑（特别是单行的表达式逻辑）表示为一种可遍历、可检查、可动态构建的数据结构。它本身不是用来直接执行的，而是作为数据供其他组件分析
3. 生命周期：作为数据存在于运行时的内存中，可以被程序动态创建、修改、传递
4. 内容：主要表示一个单一的表达式，例如`x + y`、`user.Age > 18`、`obj.Method()`。它不包含复杂的语句（在早期版本中，后来也支持了块等更复杂的结构，但核心用途仍是表达式）

它的使命是代表：在运行时充当代码逻辑的蓝图

编译器的工作在程序运行前就结束了。它生成的语法树包含了编译所需的全部信息，但运行时的环境（比如数据库连接、动态条件）是编译时无法预知的

表达式树是.NET框架特意暴露给运行时的一个API，它只选取了语法树中关于“表达式”的那一小部分，将其物化为`System.Linq.Expressions.Expression`类的实例，使得开发者可以在运行时像操作普通对象一样操作代码逻辑

> .NET将AST这个概念的一部分“下游化”，使其从编译器的内部工具，变成了开发者可以在运行时使用的强大武器

## 异步Lambda
简单来说，异步Lambda就是使用`async`和`await`关键字来编写能够执行异步操作的Lambda表达式。它允许在Lambda中方便地调用诸如HTTP请求、文件I/O、数据库查询等异步方法，而不会阻塞调用线程

### 从同步到异步
同步Lambda
```cs
// 一个接受字符串并返回整数的同步Lambda
Func<string, int> parse = (string s) => int.Parse(s);
Console.WriteLine(parse("123")); // 输出：123

// 一个无返回值的同步Lambda
button.Click += (sender, e) => MessageBox.Show("Clicked!");
```
假设想在Lambda内部调用一个异步方法（例如`HttpClient.GetStringAsync`）。如果直接用同步Lambda，会导致编译错误或阻塞线程

**错误示例**
```cs
// Error this
// 无法在同步Lambda中等待异步方法
Func<string, string> getWebpage = (string url) =>
{
    // HttpClient.GetStringAsync 返回 Task<string>
    // 无法直接“等待”这个Task
    var task = httpClient.GetStringAsync(url);
    return task.Result; // 会阻塞线程
}
```
为了解决这个问题，需要异步Lambda

### 异步Lambda是什么
异步Lambda(asynchronous lambda)是带有`async`修饰符的Lambda表达式，本质上就是返回一个`Task`或`Task<T>`的匿名函数\
最常见的场景是使用`Func<Task>`或`Func<T, Task>`等委托类型
1. 无返回值的异步Lambda（`Func<Task>`）
```cs
// 这是一个异步Lambda，它不接收参数，返回一个Task
Func<Task> doSomethingAsync = async () =>
{
    Console.WriteLine("开始异步操作...");
    await Task.Delay(1000); // 模拟一个异步操作（如网络请求）
    Consolw.WriteLine("异步操作完成！");
};

// 调用时，需要等待它返回的Task
await doSomethingAsync();
```

2. 有返回值的异步Lambda（`Func<T, Task<TResult>>`）
```cs
// 这是一个异步Lambda，它接收一个string 参数，返回一个 Task<string>
Func<string, Task<string>> getWebpage = async (string url) =>
{
    using (var httpClient = new HttpClient())
    {
        // 等待异步HTTP请求
        string content = await httpClient.GetStringAsync(url);
        return content; // 注意：这里返回的是 string，但整个Lambda的返回值是 Task<string>
    }
};

// 调用
string html = await getWebpage("https://api.example.com/data");
Console.WriteLine(html);
```

3. 用于事件处理程序的异步Lambda
这是一个非常常见的用法，但需要小心
```cs
// 例如，一个按钮点击事件
button.Click += async (sender, e) =>
{
    // 禁用按钮防止重复点击
    button.Enabled = false;

    try
    {
        // 执行一些异步工作
        await SomeAsyncOperation();
        MessageBox.Show("操作成功！");
    }
    finally
    {
        button.Enable = true;
    }
}
```

### 要点与注意事项
1. `async void` Lambda应尽量避免
与`async void`方法一样，`async void`Lambda通常只用于事件处理程序。因为无法等待`async void`方法，其中的异常会直接在上下文中抛出，可能导致应用程序崩溃
```cs
// 尽量避免这样写，除非是顶级事件处理器
button.Click += async (sender, e) => { ... }; // 这是 async void

// 如果可以，使用返回Task的Lambda，并等待它
```

2. 返回值类型
在异步Lambda中，`return`语句返回的是`T`，但整个Lambda表达式返回的是`Task<T>`。编译器会自动进行包装
```cs
Func<Task<int>> getNumberAsync = async () =>
{
    await Task.Delay(100);
    return 42; // 这里返回int， 但 getNumberAsync的返回值是Task<int>
};
```

3. 异常处理
异步Lambda中的异常会被捕获并放置在返回的`Task`对象中；当`await`这个Task时，异常会被重新抛出
```cs
Func<Task> throwAsync = async () =>
{
    await Task.Delay(100);
    throw new InvalidOperationException("异步Lambda中的错误！");
};

try
{
    await throwAsync();
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"捕获到异常：{ex.Message}");
}
```

4. 与LINQ一起使用
在LINQ方法（如`Where`, `Select`）中，如果谓词或选择器需要调用异步方法，情况会变得复杂。因为标准的LINQ操作不接受返回`Task<bool>`的谓词\
**错误示例**
```cs
// 无法编译 Where期望一个返回bool的委托，而不是 Task<bool>
var results = data.Where(async x => await SomeAsyncCheck(x));
```
解决方案是使用异步流(`IAsyncEnumerable<T>`)和相应的异步LINQ库（例如`System.Linq.Async`）
```cs
// 使用 System.Linq.Async包
IAsyncEnumerable<Data> filteredData = data
    .ToAsyncEnumerable()
    .WhereAwait(async x => await SomeAsyncCheck(x));

await foreach (var item in filteredData)
{
    Console.WriteLine(item);
}
```

5. 不能用在`Expression<Func<>>`中
因为异步Lambda不是可表达的表达式树，只能存在于委托中

6. 不要忘记`await`
会丢失异常、逻辑提前执行完
```cs
var task = asyncLambda(); // 忘记 await
// task 在后台跑，异常不会在这里抛出
```

7. 同步方法内不能直接调用异步Lambda
```cs
// 错误，不能await
var result = f2(5); // 返回的是 Task<int>
```

8. 异步Lambda不支持`ref`/`out`参数

### 底层
编译器会把
```cs
async (x) => { await Task.Delay(1000); return x * 2; }
```
编译成一个生成状态机的匿名类，类似
```cs
(x) => {
    var stateMachine = new <Anonymous>d__Something();
    stateMachine.x = x;
    stateMachine.builder = AsyncTaskMethodBuilder<int>.Create();
    stateMachine.Start(ref stateMachine);
    return stateMachinebuilder.Task;
}
```
也就是说，每个异步Lambda实际是一个自动生成状态机的匿名函数，它的执行结果就是一个`Task`

## 静态Lambda
这是C# 9.0引入的一个重要特性\
静态Lambda是通过在Lambda表达式前添加`static`修饰符来声明Lambda。它强制Lambda不捕获（即不访问）任何来自外部作用域的变量或实例成员，只能使用其参数和静态成员\
这是一种编译层面的限制，也就是说，它根本不会被编译，更不会等到运行时去“报错”

### 语法
```cs
// 静态 Lambda 语法
Func<int, int, int> staticAdder = static (a, b) => a + b;

// 等同于这个静态方法
static int StaticAdd(int a, int b) => a + b;
```

### 特性
禁止捕获外部变量\
静态Lambda不能访问来自外部作用域的实例变量、局部变量或`this`引用
```cs
class Calculator
{
    private int _instanceValue = 10;
    private static int _staticValue = 20;

    public void Test()
    {
        int localValue = 5;

        // ✔，只使用参数
        Func<int, int, int> adder = static (a, b) => a + b;

        // ✔，使用静态成员
        Func<int, int> staticMultiplier = static (x) => x * _staticValue;

        // 编译错误，不能捕获实例成员
        Func<int, int> instanceMultiplier = static (x) => x * _instanceValue;

        // 编译错误，不能捕获局部变量
        Func<int, int> localMultiplier = static (x) => x * localValue;

        // 编译错误，不能使用this
        Func<int, int> thisMultiplier = static (x) => x * this._instanceValue;
    }
}
```
性能优势\
静态Lambda的主要优势在于性能
1. 减少分配：普通Lambda需要分配一个闭包对象来存储捕获的变量，而静态Lambda不需要
2. 减少GC压力：避免了不必要的内存分配
3. 更好的内联机会：编译器可以更积极地进行优化

### 使用场景
1. 高性能LINQ查询
```cs
var numbers = Enumeralbe.Range(1, 1000);

// 普通Lambda，可能分配闭包
var evenNumbers = numbers.Where(x => x & 2 == 0).ToList();

// 静态Lambda，无闭包分配，性能更好
var evenNumbersStatic = numbers.Where(static x => x % 2 == 0).ToList();
```

2. 避免意外捕获
```cs
class EventProcessor
{
    private string _processorName = "Processor1";

    public void SetupEventHandlers()
    {
        // 危险，可能意外捕获 this，导致内存泄露
        SomeEvent += (sender, args) => Process(args, _processorName);

        // 安全，静态Lambda防止意外捕获
        SomeEvent += static (sender, args) => ProcessStatic(args);
        // ProcessStatic必须是静态方法
    }

    private void Process(EventArgs args, string name) { }
    private static void ProcessStatic(EventArgs args) { }
}
```

3. 与本地函数结合
```cs
public void ProcessData(List<int> data)
{
    // 静态本地函数 + 静态 Lambda
    static bool IsPrime(int number)
    {
        // 使用静态Lambda进行数学计算
        Func<int, int, bool> hasDivisor = static (n, divisor) => n % divisor == 0;

        if (number < 2) return false;
        for (int i = 2; i * i <= number; i++)
        {
            if (hasDivisor(number, i)) return false;
        }
        return true;
    }
    
    var primes = data.Where(IsPrime).ToList();
}
```

4. 事件处理器（不依赖外部的前提下）
```cs
button.Click += static (sender, args) => Console.WriteLine("Clicked!");
```

5. 委托缓存（避免重复创建闭包）
```cs
private static readonly Func<int, int> MultiplyBy2 = static x => x * 2;
```

### 总结

| 特性 | 普通Lambda | 静态Lambda |
| - | - | - |
| 捕获能力 | 可以捕获外部变量、实例成员 | 只能使用参数和静态成员 |
| 内存分配 | 可能分配闭包对象 | 通常无额外分配 |
| 性能 | 可能稍慢 | 通常更快 |
| 使用场景 | 需要访问外部状态时 | 纯函数、性能敏感代码 |
| 安全性 | 可能意外捕获导致内存泄露 | 更安全、避免意外捕获 |

## 最佳实践与注意事项
1. 保持简洁：Lambda的优势在于简洁。如果逻辑非常复杂，超过3-4行，考虑重构为命名方法，以提高可读性
2. 避免副作用：尽量编写纯函数式的Lambda（输出完全由输入决定，不修改外部状态），避免因捕获外部变量导致难以调试的问题
3. 注意变量的捕获：在循环或异步上下文中使用Lambda时，要特别注意捕获的变量是否是期望的值
4. 合理命名参数：即使参数类型很明显，给参数一个有意义的名字（如`student => student.Age`而不是`x => x.Age`）也能大大提高代码的可读性