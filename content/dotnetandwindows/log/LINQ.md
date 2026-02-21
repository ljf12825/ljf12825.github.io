---
title: LINQ
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# linq
---

LINQ的全称是“Language-Integrated Query”，即语言继承查询\
可以把它理解成C#（或 VB.NET）语言的一部分，它允许你使用类似SQL的语法，直接在代码中对各种数据源进行查询和操作

核心思想：用一种统一的方式来查询任何类型的数据，无论数据是存在于
- 内存中的集合（如List, Array, Dictionary）
- 数据库（通过Entity Framework等）
- XML文档
- JSON数据
- 甚至 Web Service等

## LINQ存在的意义
在没有LINQ的时代，开发者面临一些问题
- 语言不统一：查询内存集合用`for/foreach`循环，查询数据库用SQL字符串，查询XML用DOM或XPath。每种数据源都有自己的一套查询方法，学习成本高，代码风格不一致
- 编译时无法检查：SQL查询通常以字符串形式嵌入代码，编译器无法检查其语法正确性，只能在运行时发现问题
- 缺乏智能感知：由于是字符串，IDE无法提供表名、列名的智能感知提示，容易写错

LINQ解决了这些问题
- 统一语法：用同一种语法风格处理所有数据
- 强类型检查：LINQ查询是强类型的，编译器可以检查语法和类型，减少运行时错误
- 智能感知：得益于强类型，Visual Studio可以提供强大的智能感知

## 语法
LINQ提供了两种等价的语法：查询语法和方法语法

### 查询语法
这种语法看起来很想SQL，关键在包括`from`, `where`, `select`, `orderby`, `group by`, `join`等。它可读性更强，尤其是对于熟悉SQL的人\
示例：从一个数字列表中筛选出大于10的数字，并排序
```cs
List<int> numbers = new List<int> { 5, 12, 8, 20, 3, 18 };

// 查询语法
var query = from num in numbers
            where num > 10
            orderby num descending
            select num;

foreach (var num in query)
{
    Console.WriteLine(num);
}
// 输出：20， 18， 12
```

### 方法语法（基于扩展方法）
这种语法依赖于扩展方法和Lambda表达式。它在`System.Linq`命名空间下定义了一系列扩展方法（如`Where`, `Select`, `OrderBy`等），可以直接在集合上调用

示例：同上
```cs
List<int> numbers = new List<int> { 5, 12, 8, 20, 3, 18 };

// 方法语法
var query = numbers
            .Where(num => num > 10)
            .OrderByDescending(num => num)
            .Select(num => num); // 这里的 Select 可以省略，因为就是选择自己

foreach (var num in query)
{
    Console.WriteLine(num);
}
// 输出： 20, 18, 12
```
两种风格的关系
- 编译器最终会将查询语句翻译成方法语法
- 方法语法更强大，有些操作（如`First()`, `Count()`）只有方法语法
- 在实际开发中，两种风格经常混合使用，选择哪种主要看个人喜好和场景的可读性

### 核心概念与操作符
LINQ操作符可以分为两大类
- 延迟执行：查询被定义，但不会立即执行。只有当你真正遍历结果（如使用`foreach`）时，查询才会执行。`Where`, `OrderBy`, `Select`等都属于此类
- 立即执行：查询会立即执行，并返回一个具体的结果（如单个值或新的集合）。`Count()`, `ToList()`, `First()`, `Max()`等都属于此类

#### 示例
假设有一个`Student`类
```cs
public class Student
{
    public string Name { get; set; }
    public int Age { get; set; }
    public int Score { get; set; }
}
```
和一组数据
```cs
List<Student> student = new List<Stuednt> {
    new Student { Name = "Alice", Age = 20, Score = 85 },
    new Student { Name = "Bob", Age = 22, Score = 90 },
    new Student { Name = "Charlie", Age = 19, Score = 78 },
    new Student { Name = "Diana", Age = 21, Score = 92 }
};
```
- 过滤-`Where`
```cs
// 找到所有年龄大于20的学生
var result = students.Where(s => s.Age > 20);
```
- 投影-`Select`
```cs
// 只获取学生的名字列表
var names = students.Select(s => s.Name);
// 创建一个匿名类型
var info = students.Select(s => new { s.Name, s.Score });
```
- 分组-`GroupBy`
```cs
// 按年龄分组
var groups = students.GroupBy(s => s.Age);
foreach (var group in groups)
{
    Console.WriteLine($"Age: {group.Key}");
    foreach (var student in group)
    {
        Console.WriteLine($" - {student.Name}");
    }
}
```
- 聚合-`Count`, `Max`, `Min`, `Average`, `Sum`
```cs
int count = students.Count(); // 学生总数
double avgScore = students.Average(s => s.Score); // 平均分
int maxScore = students.Max(s => s.Score); // 最高分
```
- 元素操作-`First`/`FirstOrDefault`, `Single`/`SingleOrDefault`
```cs
// 获取一个分数大于80的学生（如果没有，First会抛出异常，FirstOrDefault返回null）
var first = students.FirstOrDefault(s => s.Score > 80);
// 获取唯一一个叫“Bob”的学生（如果没有或超过一个，Single会抛异常）
var single = students.Single(s => s.Name == "Bob");
```

## LINQ提供程序
LINQ的强大之处在于它的可扩展性。不同的数据源有不同的LINQ提供程序，它们负责将LINQ查询翻译成该数据源的原生查询语言
- LINQ to Object：用于查询内存中的集合（如List, Array）
- LINQ to Entity(EF Core)：用于查询关系型数据库。LINQ查询会被转换成SQL语句发送给数据库
- LINQ to XML：用于查询和操作XML文档
- LINQ to JSON（如Newtonsoft.Json.Linq）：用于查询JSON数据

## 底层
LINQ的底层主要建立在三大核心技术之上
- 扩展方法
- 委托和Lambda表达式
- 表达式树和IQueryable<T>接口

#### 扩展方法 - 语法的基础
LINQ的方法语法完全依赖于扩展方法。这些方法定义在`System.Linq`命名空间中，它们扩展了`IEnumerable<T>`接口\
示例：实现一个简单的`Where`方法来查看本质
```cs
// LINQ Where 操作符简化版
public static class MyLinqExtensions
{
    // 这是一个扩展方法
    public static IEnumerable<T> Where<T>(
        this IEnumerable<T> source,
        Func<T, bool> predicate // 关键：接受一个委托
    ) 
    {
        // 验证参数
        if (source == null) throw new ArgumentNullException(nameof(source));
        if (predicate == null) throw new ArgumentNullException(nameof(predicate));

        // 核心逻辑
        foreach (T item in source)
        {
            if (predicate(item)) // 对每个元素应用过滤条件
            {
                yield return item; // 使用 yield return 实现迭代器
            }
        }
    }
}
```
总结：接受一个数据源和委托，对这个数据源中的所有数据调用委托方法，对符合条件的数据使用yield return形成迭代器\
关键点：
- 扩展方法让我们可以像调用实例方法一样调用静态方法
- 核心逻辑就是简单的循环和条件判断
- 使用`yield return`实现延迟执行

### 委托和Lambda表达式 - 行为参数化
LINQ操作符的核心是能够接收”行为“作为参数，这是通过委托实现的\
委托的演进
```cs
// 传统委托（LINQ出现前的方式）
Func<int, bool> predicate1 = new Func<int, bool>(IsGreaterThanTen);

// 匿名方法（C# 2.0）
Func<int, bool> predicate2 = delegate(int x) { return x > 10; };

// Lambda表达式（C# 3.0, LINQ的伴侣）
Func<int, bool> predicate3 = x => x > 10;

static bool IsGreaterThanTen(int x) { return x > 10; }
```
在LINQ中的实际应用
```cs
var result = numbers.Where(x => x > 10);
// 编译器会将 x => x > 10 编译成：
// Func<int, bool> redicate = x => x > 10;
// numbers.Where(predicate);
```

### 延迟执行（Deferred Execution）
这是LINQ的最重要的特性之一，也是最容易产生困惑的地方

查询在定义时不会立即执行，只有在真正需要结果时（如遍历、调用`ToList()`等）才会执行
```cs
var numbers = new List<int> { 1, 2, 3, 4, 5 };

// 这只是定义查询，不会执行
var query = numbers.Where(x => {
    Console.WriteLine($"检查：{x}"); // 这行不会立即输出
    return x > 2;
});

Console.WriteLine("查询已定义");

// 现在才开始真正执行
foreach (var num in query) // 这里才会输出 ”检查：1“， ”检查：2“等
{
    Console.WriteLine($"结果：{num}");
}
```
- 通过迭代器块和`yield return`关键字
- 每次调用`MoveNext()`时，才执行到下一个`yield reutrn`

### 立即执行方法
与延迟执行对应，有些方法会强制查询立即执行
```cs
// 这些方法会立即执行查询
var list = query.ToList();      // 转换为 List
var array = query.ToArray();    // 转换为 Array
var count = query.Count();      // 获取数量
var first = query.First();      // 获取第一个元素
```

### 表达式树和IQueryable<T> - LINQ to SQL的魔法
这是LINQ最精妙的部分，也是区分`IEnumerable<T>`和`IQueryable<T>`的关键
- IEnumerable<T>的局限
```cs
// 假设有一个数据库上下文
var dbContext = new MyDbContext();

// 这样写有问题
var badQuery = dbContext.Customers
                        .AsEnumerable() // 转换为 IEnumerable
                        .Where(c => c.City == "London");

// 实际执行过程：
// 1. SELECT * FROM Customers -> 把所有数据拉到内存中
// 2. 在内存中执行 .Where(c => c.City == "London")
```
`IQueryable<T>`的解决方案
```cs
// 正确的写法
var goodQuery = dbContext.Customers
                        .AsQueryable() // 实际上是IQueryable（通常默认就是）
                        .Where(c => c.City == "London");

// 实际执行过程
// 1. 构建表达式树
// 2. 最终执行：SELECT * FROM Customers WHERE City = 'London'
```
表达式树的本质
```cs
// Lambda 表达式给 IEnumerable：编译成委托
Func<Customer, bool> predicate = c => c.City == "London";

// Lambda 表达式给 IQueryable：编译成表达式树
Expression<Func<Customer, bool>> expression = c => c.City == "London";

// 表达式树是一个数据结构，可以分析、分解、翻译
// LINQ Provider （如 EF Core）会分析这个表达式树，生成对应的SQL
```
表达式树的简单分析
```cs
Expression<Func<Customer, bool>> expression = c => c.City == "London";

// 可以分析表达式树的结构
var body = expression.Body as BinaryExpression; // 这是一个二元表达式
var left = body.Left as MemberExpression; // 左边：c.City
var right = body.Right as ConstantExpression; // 右边："London"

Console.WriteLine($"左边: {left.Member.Name}");    // 输出: City
Console.WriteLine($"操作: {body.NodeType}");       // 输出: Equal
Console.WriteLine($"右边: {right.Value}");          // 输出: London
```

#### `IEnumerable<T>`与`IQueryable<T>`
核心区别：执行位置
- `IEnumerable<T>`：在内存中（客户端）执行查询操作
- `IQueryable<T>`：在数据源端（如数据库）执行查询操作

##### `IEnumerable<T>`-客户端查询
###### 特点
- 命名空间：`System.Collections.Generic`
- 执行位置：在应用程序的内存中执行
- 数据源：主要针对内存集合（List, Array, Dictionary等）
- 查询能力：使用委托和Lambda表达式

###### 工作原理
```cs
List<Student> students = GetStudentsFromMemory();

// IEnumerable - 客户端执行
IEnumerable<Student> query = students
    .Where(s => s.Age > 20) // 在内存中过滤
    .OrderBy(s => s.Name) // 在内存中排序
    .Select(s => new { s.Name, s.Age }); // 在内存中投影

// 执行过程：
// 1. 从数据源获取所有数据
// 2. 在应用程序内存中执行所有查询操作
```

###### 底层机制
```cs
// IEnumerable 的 Where 方法大致实现
public static IEnumerable<T> Where<T>(this IEnumerable<T> source, Func<T, bool> predicate)
{
    foreach (T item in source) // 在客户端循环
    {
        if (predicate(item)) // 在客户端执行过滤逻辑
            yield return item;
    }
}
```

##### `IQueryable<T>`-数据源查询
###### 特点
- 命名空间：`System.Linq`
- 执行位置：在数据源（数据库、服务等）执行
- 数据源：主要针对外部数据源（SQL数据库、Web服务等）
- 查询能力：使用表达式树

###### 工作原理
```cs
IQueryable<Student> students = dbContext.Students; // 来自数据库

// IQueryable - 数据源端执行
IQueryable<Student> query = students
    .Where(s => s.Age > 20)        // 生成 SQL WHERE 子句
    .OrderBy(s => s.Name)          // 生成 SQL ORDER BY 子句
    .Select(s => new { s.Name, s.Age }); // 生成 SQL SELECT 子句

// 执行过程：
// 1. 构建表达式树
// 2. 将表达式树翻译成数据源原生查询语言（如SQL）
// 3. 在数据源端执行查询
// 4. 只返回最终结果到客户端
```

###### 底层机制
```cs
// IQueryable 使用表达式树
IQueryable<Student> query = students
    .Where(s => s.Age > 20); // 这里 s => s.Age > 20 是表达式树，不是委托

// 实际类型是：
Expression<Func<Student, bool>> expression = s => s.Age > 20;
```

### LINQ Provider 的工作流程
以 Entity Framework 为例
1. 构建表达式树：你的LINQ查询被转换成表达式树
2. 分析表达式树：LINQ Provider 遍历表达式树，理解你的查询意图
3. 生成SQL：根据表达式树生曾最优的SQL语句
4. 执行查询：在数据库上执行SQL
5. 物化结果：将数据库返回的数据转换成.NET对象

## 性能
LINQ的性能表现不能一概而论，它既可能非常高效，也可能成为性能瓶颈，完全取决于如何使用
- LINQ to Objects（内存集合）：有轻微开销，但大多数场景下可以接收。性能关键在于避免低效用法
- LINQ to Entities（数据库查询）：性能翻译非常好（甚至优于手动SQL），也可能非常差，完全取决于是否生成高效的SQL

### LINQ to Objects
开销来源
1. 委托调用开销
```cs
var result = list.Where(x => x > 10);
// 每个元素都需要通过委托调用Lambda表达式
// 这比直接for循环有额外开销
```

2. 迭代器模式开销
```cs
// LINQ 使用 yield return, 每次 MoveNext()都有状态机开销
public static IEnumerable<T> Where<T>(this IEnumerable<T> source, Func<T, bool> predicate)
{
    foreach (T item in source) // 迭代器状态机
    {
        if (predicate(item))
            yield return item; // 状态保持和恢复
    }
}
```

#### LINQ to Objects 性能最佳实践
好的做法
1. 合理使用立即执行方法
```cs
// 如果需要多次遍历，先物化
var frequentList = expensiveQuery.ToList();

// 多次使用
var count = frequentList.Count;
var first = frequentList.First();
```
2. 选择合适的数据结构
```cs
// List 适合遍历，HashSet适合查找
var hashSet = new HashSet<int>(numbers);
bool exists = hashSet.Contains(123); // O(1)

// 比下面这个快得多
bool existsSlow = numbers.Any(x => x == 123); // O(n)
```
3. 使用索引优化
```cs
// 对于 List，可以混合使用
var list = numbers.ToList();
for (int i = 0; i < list.Count; i++)
{
    if (someCondition(list[i]))
    {
        // 使用索引操作
    }
}
```
性能陷阱
1. 重复计算
```cs
// 不好：重复执行相同查询
if (users.Any(u => u.Age > 65))
{
    var seniors = users.Where(u => u.Age > 65); // 重新执行！
    Process(seniors);
}

// 好的做法
var seniors = users.Where(u => u.Age > 65).ToList();
if (seniors.Any())
{
    Process(seniors);
}
```
2. 在循环中使用LINQ
```cs
// 性能灾难：O(n^2)复杂度
foreach (var category in categories)
{
    var products = allProducts.Where(p => p.CategoryId == category.Id); // 每次都要扫描
    Process(products);
}

// 优化：使用 Lookup 或 GroupBy
var productsByCategory = allProducts.ToLookup(p => p.CategoryId);
foreach (var category in categories)
{
    var products = productsByCategory[category.Id]; // O(1) 查找
    Process(products);
}
```
3. 不必要的排序
```cs
// 不好：只需要第一个，却排序了整个集合
var oldest = users.OrderByDescending(u => u.Age).First();

// 好的做法：O(n) vs O(n log n)
var oldest = users.MaxBy(u => u.Age); // .NET 6+
// 或者
var oldest = users.Aggregate((max, next) => next.Age > max.Age ? next : max);
```

#### LINQ to Entities（数据库LINQ）性能分析
性能可以很好的情况\
当LINQ Provider能生成高效的SQL时
```cs
// 好的 LINQ - 生成高效的 SQL
var result = dbContext.Orders
    .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
    .Where(o => o.Status == "Completed")
    .Select(o => new { o.Id, o.TotalAmount })
    .ToList();

// 生成的 SQL 可能是：
// SELECT Id, TotalAmount FROM Orders 
// WHERE OrderDate BETWEEN @startDate AND @endDate AND Status = 'Completed'
```

性能灾难情况
1. N+1查询问题（最常见）
```cs
// 性能灾难：N+1 查询
var orders = dbContext.Orders.Take(100).ToList();

foreach (var order in orders)  // 循环 100 次
{
    // 每次循环都执行一次数据库查询！
    var customer = dbContext.Customers.Find(order.CustomerId);
    Console.WriteLine($"{order.Id} - {customer.Name}");
}

// 总共执行：1 (取orders) + 100 (循环查询) = 101 次数据库往返
```
解决方案：使用`Include`或投影
```cs
// 方案1: 预先加载 (Eager Loading)
var orders = dbContext.Orders
    .Include(o => o.Customer)  // 一次性 JOIN 查询
    .Take(100)
    .ToList();

// 方案2: 投影 (Projection)
var orders = dbContext.Orders
    .Join(dbContext.Customers,
          o => o.CustomerId,
          c => c.Id,
          (o, c) => new { Order = o, CustomerName = c.Name })
    .Take(100)
    .ToList();
```
2. 在客户端进行筛选
```cs
// 不好：把所有数据拉到内存中筛选
var users = dbContext.Users
    .AsEnumerable()  // 切换到客户端处理！危险！
    .Where(u => u.Age > 18)
    .ToList();

// 执行过程：
// 1. SELECT * FROM Users (可能返回百万行)
// 2. 在内存中执行 .Where(u => u.Age > 18)
```
正确做法：保持`IQueryable`
```cs
// 好：在数据库端筛选
var users = dbContext.Users
    .Where(u => u.Age > 18)  // 生成 WHERE 子句
    .ToList();
```
3. 选择过多列
```cs
// 不好：选择不需要的列
var names = dbContext.Users
    .Select(u => u)  // SELECT * FROM Users
    .ToList()
    .Select(u => u.Name);  // 在内存中提取 Name

// 好：只选择需要的列
var names = dbContext.Users
    .Select(u => u.Name)  // SELECT Name FROM Users
    .ToList();
```

### 性能总结


| 场景 | 性能表现 | 建议 |
| - | - | - |
| 简单内存操作 | 轻微开销，通常可接受 | 优先考虑代码可读性 |
| 复杂内存操作 | 可能有显著开销 | 考虑传统循环或优化算法 |
| 数据库查询（正确使用）| 非常好，接近手动SQL | 保持 IQueryable，避免 N+1 |
| 数据库查询（错误使用）| 可能极差 | 监控生成的 SQL，理解延迟加载 |
| 性能关键算法 | 不适合 | 使用传统循环和数组 | 

最终建议
- 不要过早优化：在大多数业务代码中，LINQ的性能是可接受的
- 测量，不要猜测：使用性能分析工具是被真正的瓶颈
- 数据库LINQ要格外小心：N+1问题是真正的性能杀手
- 在关键路径上保持谨慎：了解替代方案的成本