---
title: Control Blocks
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: blog
summary: C# control blocks
---

### while / do while
#### `while`
用于事前检查型循环，常见于：
- 等待条件成立
- 迭代器遍历
- 流式读取

- 基本结构
```cs
while (condition)
{
	// loop body
}
```
1. 先判断条件
2. 条件为`true` -> 执行循环体
3. 条件为`false` -> 直接跳出循环

#### `do while`
用于必须先执行依次的场景，例如
- 菜单输入循环
- 用户输入验证
- 游戏主循环（update-loop原型）

```cs
do
{
	// loop body
}
while (condition)
```
执行逻辑：
1. 先执行循环体一次
2. 再判断条件
3. 条件为`true` -> 继续循环
4. 否则跳出

### `for`, `foreach`, `GetEnumerator()`
#### `for`
最原始，最接近机器模型的循环\
语法本质
```cs
for (init; condition; iterator)
{
	body
}
```
这是纯语法结构，不是方法，也不是接口驱动的\
编译器做的事情非常直接
```cs
init;
while (condition)
{
	body;
	iterator;
}
```
##### 核心特性
- 完全程序员控制
  - 循环变量生命周期
  - 步进方式
  - 终止条件
- 不依赖任何接口
- 可被JIT极度优化
  - 边界检查消除（bounds check elimination）
  - 向量化（SIMD）
  - 循环展开（unrolling）

##### 性能与内存视角
```cs
for (int i = 0; i < arr.Length; i++)
{
	sum += arr[i];
}
```
JIT在这里可以做到
- `arr.Length`hoist到循坏外
- 消除重复bounds check
- 使用寄存器保存`i`
- 几乎等价于C/C++循环

这也是为什么数值计算、引擎代码、热路径几乎只用`for`

#### `foreach`与`GetEnumerator`
```cs
foreach (var x in collection)
{
	body;
}
```
`foreach`是编译器级别的语法糖，核心依赖`GetEnumerator()`协议，但它不是简单地调用接口

##### `foreach`查找规则
注意：`foreach`不要求类型实现`IEnumerable`接口**\
编译器在看到 `foreach (var x in expr)` 时，会按顺序尝试
###### 1. 是否存在可访问的实例方法
```cs
GetEnumerator()
```
返回的类型（Enumerator）必须满足
- 有`bool MoveNext`
- 有`Current`属性（或字段）

不要求接口，不要求继承，只要“形状匹配”，即duck typing，但发生在编译期

###### 2. 如果没有实例方法
尝试扩展方法`GetEnumerator()`  

###### 3. 如果都没有
才退化为
- `IEnumerable`
- `IEnumerable<T>`

##### 一个“非接口”的枚举器例子
```cs
struct MyCollection
{
	public Enumerator GetEnumerator() => new Enumerator();

	public struct Enumerator
	{
		int i;

		public int Current => i;

		public bool MoveNext()
		{
			i++;
			return i < 10;
		}
	}
}
```
完全合法的`foreach`对象，没有接口，没有继承，没有装箱，编译器在编译期通过形状匹配识别枚举器

##### 编译器对`foreach`的处理
1. 源代码
```cs
foreach (var x in collection)
{
	Do(x);
}
```

2. 编译器展开（概念等价）
```cs
var enumerator = collection.GetEnumerator();
try
{
	while (enumerator.MoveNext())
	{
		var x = enumerator.Current;
		Do(x);
	}
}
finally
{
	if (enumerator is IDisposable d)
		d.Dispose();
}
```

##### `GetEnumerator()`
###### 基本概念
`GetEnumerator()`是一个方法，用来获取集合的枚举器（Enumerator）。枚举器是对象或结构体，负责在循环中提供“当前元素”和迭代状态
```cs
List<int> list = new() { 1, 2, 3 };
var enumerator = list.GetEnumerator();
while (enumerator.MoveNext())
{
	int x = enumerator.Current;
	Console.WriteLine(x);
}
```
- `foreach`就是编译器把循环展开成调用`GetEnumerator()` + `MoveNext()` + `Current`

###### 语言层定义
在C#中，`GetEnumerator()`有两种常见签名
1. 非泛型版本（`IEnumerable`）
```cs
IEnumerator IEnumerable.GetEnumerator();
```
返回IEnumerator，只提供`object Current`

2. 泛型版本（`IEnumerable<T>`）
```cs
IEnumerator<T> IEnumerable<T>.GetEnumerator();
```
返回IEnumerator<T>，提供类型安全的`T Current`

###### `GetEnumerator()`与枚举器协议
枚举器协议：C#编译器规定，只要返回对象满足以下条件就可以用于`foreach`
- 有`MoveNext()`方法，返回`bool`
- 有`Current`属性（类型可以是`T`或`object`）
- 可选：实现IDisposable，编译器会在`finally`自动调用
	
> 不要求实现`IEnumerator`接口，只要“形状匹配”即可


###### `GetEnumerator()`的两种实现方式
1. 类似数组`List<T>`的结构体枚举器
	- 返回struct，避免装箱
	- JIT可内联`MoveNext()`和`Current`，性能接近`for`
	- 保存索引和版本号

```cs
public struct Enumerator
{
    private List<T> _list;
    private int _index;
    private int _version;
    public T Current => _list[_index];
    public bool MoveNext() { ... }
}
```

2. yield / iterator 生成器
	- 编译器自动生成 state machine类
	- `GetEnumerator()`返回class类型的枚举器
	- `MoveNext`内部控制状态机
	- 支持延迟计算

```cs
IEnumerable<int> Numbers()
{
	yield return 1;
	yield return 2;
}
```
实际生成
```cs
private sealed class NumbersIterator : IEnumerable<int>, IEnumerator<int>
{
	int state;
	int current;
	public bool MoveNext() { ... }
	public int Current => current;
	public IEnumerator<int> GetEnumerator() => this;
}
```

##### `GetEnumerator`存在的意义
回到最开始的问题，`foreach`不要求类型实现`IEnumerable`接口，可以通过`GetEnumerator`，而不是只靠接口\
原因只有一个：性能 + 表达力
- 接口 -> 必然虚调用
- 值类型 + 接口 -> 必然装箱

这是高性能场景无法接受的\
所有C#选择：编译期协议，而非运行时

##### 值类型枚举器 vs 接口枚举器
为什么`List<T>.foreach`很快

```cs
foreach (var x in list)
```
因为
- `List<T>.Enumerator`是struct
- `GetEnumerator()`返回具体类型
- 没有接口调用
- 没有装箱
- JIT可以内联`MoveNext()`

慢的情况
```cs
IEnumerable<int> e = list;
foreach (var x in e)
```
此时
- 使用`IEnumerator<int>`接口
- `struct Enumerator`被装箱
- `MoveNext`是虚调用
- 性能显著下降

##### 只读遍历
这是一个语言设计层面的“硬约束”问题，C#无法、也不愿意，为`foreach`保证“可写语义”在所有枚举器模型下成立

```cs
foreach (var x in list)
{
	x = 10 ; // 编译错误
}
```
或
```cs
foreach (int x in array)
{
	x++; // 不影响原数组
}
```
- `x = ...`直接报错（语法层）
- `x++`不生效（语义层）

原因不完全相同但本质一致

###### `foreach`的核心语义
编译器对`foreach`的展开中
```cs
var x = enumerator.Current;
```
`Current`是一个属性，属性返回值，不是可写引用。`foreach`根本不知道你枚举的是什么东西

`GetEnumerator`协议只要求
```cs
bool MoveNext();
T Current { get; }
```
- 没有`set`
- 没有“回写”语义

因此，语言层面只能承诺：可以读到一个元素，而不是可以修改集合中的这个位置

###### 为什么不能设计成“可写foreach”
1. 因为很多集合根本不存在“可写位置”
```cs
IEnumerable<int> Numbers()
{
	yield return 1;
	yield return 2;
}
```
这里的`Current`不是数组元素，不是内存位置，是状态机计算出来的临时值

2. 即使是数组，也存在歧义
```cs
foreach (var x in GetArray())
{ 
	x = 10;
}
```
`GetArray()`是什么？未知

###### 值类型枚举器
常见枚举器是`struct`
```cs
List<T>.Enumerator : struct
```
如果允许
```cs
foreach (var x in list)
{
	x = ...
}
```
那等价于
```cs
enumerator.Current = ...
```
但问题是
- `enumerator`是值类型
- `Current`是属性
- 属性返回的是副本

如果强行支持，会导致灾难性不一致：值类型可改，引用类型不可改，这在语言设计上是不可接受的\
C#的设计原则是：宁可统一禁止，也不制造“看起来能用、但实际上不可靠”的语义

###### `foreach`中允许修改对象的字段
```cs
foreach (var obj in list)
{
	obj.Value = 10; // 合法
}
```
`obj`是引用的拷贝，拷贝的是地址，修改的是对象本体；没有修改“枚举变量”，而是修改它指向的对象，这和`foreach`的只读规则不冲突

###### `ref foreach`
C# 7.3 引入特例
```cs
foreach (ref var x in array)
{
	x = 10;
}
```
这里成立是因为
- 数组元素有稳定内存地址
- 编译器能拿到`ref T`
- 完全没有枚举器抽象

这是专门为数组和Span设计的“受限逃生口”

为什么不能对所有IEnumerable生效？\
因为
- 大多数枚举器无法提供ref返回
- `ref T Current`会破坏现有协议
- 会强迫所有集合暴露内部存储

这是不可接收的API破坏

##### 版本检查
###### 定义
- 几乎所有可变集合(`List<T>`, `Dictionary<TKey, TValue>`等)都有一个内部整型字段，通常叫`_version`或类似名字
- 初始值：通常从0开始
- 每次修改集合都会让`_version`增加

###### 作用
检测枚举器在枚举期间是否被修改
- 如果在`foreach`迭代过程中修改了集合，枚举器会通过对比版本号发现不一致，然后抛出`InvalidOperationException`
- 这是fail-fast（枚举器一致性检查）机制，防止隐藏的bug（比如数组越界、引用失效）

###### 运行机制
枚举开始前保存枚举器开始时的集合版本，每次`MoveNext()`检查`_version`是否匹配，不匹配则抛出异常

```cs
public class List<T> : IEnumerable<T>
{
    private int _version;  // 每次修改集合时递增
    private T[] _items;
    
    public void Add(T item)
    {
        // ... 添加逻辑
        _version++;  // 修改后版本号递增
    }
    
    public struct Enumerator
    {
        private readonly List<T> _list;
        private int _index;
        private readonly int _version;  // 保存迭代开始时的版本号
        
        public Enumerator(List<T> list)
        {
            _list = list;
            _index = 0;
            _version = list._version;  // 捕获当前版本
        }
        
        public bool MoveNext()
        {
            // 关键检查！
            if (_version != _list._version)
            {
                throw new InvalidOperationException(
                    "Collection was modified; enumeration operation may not execute.");
            }
            
            // ... 正常的迭代逻辑
        }
    }
}
```

- 正常情况（没有修改）
```cs
List<int> list = new List<int> { 1, 2, 3 };

foreach (var item in list) // 创建枚举器：_version = 1
{
	Console.WriteLine(item); // MoveNext() 检查：1 == 1
}
// 顺利执行完成
```
- 异常情况
```cs
List<int> list = new List<int> { 1, 2, 3 };

foreach (var item in list) // 创建枚举器 _version = 1
{
	Console.WriteLine(item);
	if (item == 1)
	{
		lsit.Add(4); // 修改集合：_version = 2
	}
	// 下次 MoveNext() 检查失败，抛出异常
}
// InvalidOperationException
```


#### 值类型（struct）下的行为不同点
`foreach`中结构体是拷贝副本
```cs
struct MyStruct
{
  public int X;
}

Mystruct[] arr = { new MyStruct { X = 1 } };

foreach (var s in arr) s.X = 999; // 改变的是副本原数组不会改变
```
而`for`中是通过索引器访问，直接修改原始结构体
```cs
for (int i = 0; i < arr.Length; ++i) arr[i].X = 999; // 真正修改了数组中的元素
```

#### 适用场景
- `for`
  - 性能关键路径
  - 需要修改集合元素，可在遍历时直接修改
  - 复杂迭代逻辑

- `foreach`
  - 只读遍历
  - 不确定集合类型时
  - 自定义集合（实现了GetEnumerator）

- `GetEnumerator()`
  - 设计自定义集合时

### if 
#### 基本结构
`if`是C#中最常见的条件分支语句
```cs
if (condition expr)
{
	// 条件为 true 时执行的代码
}
```
可以加上
```cs
if (expr1)
{
	// expr1 成立
}
else if (expr2)
{
	// expr2 成立
}
else
{
	// 前面的都不成立
}
```

#### 条件表达式的要求
C#中`if`后面必须是一个布尔类型表达式（`bool`）\
不像C/C++那样可以把`int`当成真假
```cs
int x = 1;

// if (x) // Error: Cannot implicitly convert type 'int' to 'bool'

if (x != 0)
{
	Console.WriteLine("x is not zero");
}
```
这体现了C#更强的类型安全设计理念

#### 简写与嵌套
1. 单行简写
如果只有一条语句，可以省略花括号（但不推荐）
```cs
if (score > 90)
	Console.WriteLine("Excellent");
```
2. 嵌套if
```cs
if (age > 18)
{
	if (hasID)
	{
		Console.WriteLine("Access granted");
	}
}
```
嵌套太多会让逻辑混乱，建议使用`&&`、`||`合并逻辑或提取函数

#### 进阶写法
1. 条件表达式（三元运算符）
```cs
string msg = (score >= 60) ? "及格" : "不及格";
```
相当于
```cs
if (score >= 60)
	msg = "及格";
else 
	msg="不及格";
```
2. `if`与`var`结合
```cs
if (int.TryParse(input, out var number))
	Console.WriteLine($"输入了数字 {number}")；
else Console.WriteLine("输入无效")；
```
这里的`number`只在`if`的作用域内有效

#### 常见陷阱
1. 多行省略花括号陷阱
```cs
if (flag)
	Console.WriteLine("Yes");
	Console.WriteLine("No"); // 这行总会执行
```
2. 混用`=`和`==`
```cs
if (a = true) // 编译错误
```
C#特意设计为错误，防止C风格的低级错误

`if`是控制流的最小单元，但成熟的代码尽量减少显式if
- 通过策略模式、多态、字典映射、switch表达式替代复杂分支
- `if`应该表达“决策点”，而不是“流程泥潭”

###  switch
#### 基础语法（C#早期版本）
```cs
switch (day)
{
	case 1:
		Console.WriteLine("Monday");
		break;
	
	case 2:
		Console.WriteLine("Tuesday");
		break;
	
	default:
		Console.WriteLine("Unknown");
		break;
}
```
- `switch`表达式里的值必须是整型、枚举或字符串（早期限制，现在放宽）
- 每个`case`后必须`break`（或`return`、`throw`）
- `default`是可选的，用来兜底

#### 字符串与枚举支持
C#从早期版本就支持
```cs
switch (command)
{
	case "start":
		Start();
		break;
	case "stop":
		Stop();
		break;
}
```
枚举更常见
```cs
enum Direction { Up, Down, Left, Right }

switch (dir)
{
	case Direction.Up:
		MoveUp();
		break;
}
```

#### C#7+模式匹配
C# 7开始，`switch`不再局限于“相等比较”，而是能做类型匹配与条件判断
```cs
object obj = 42;

switch (obj)
{
	case int i when i > 0:
		Console.WriteLine($"正整数: {i}");
		break;
	case string s:
		Console.WriteLine($"字符串: {s}");
		break;
	case null:
		Console.WriteLine($"null 值");
		break;
	default:
		Console.WriteLine($"未知类型");
		break;
}
```
这里引入了两个关键点
1. 类型模式（`case int i`）
自动检测类型并声明局部变量
2. 条件保护(when)
让`case`可以附加逻辑判断

#### C# 8+ 新写法：`switch 表达式`
`switch`不再是语句(statement)，而是表达式(expression)
```cs
string GetDayType(int day) =>
	day switch
	{
		1 or 2 or 3 or 4 or 5 => "工作日",
		6 or 7 => "周末"
		_ => "未知"
	};
```
- 不需要`break`
- 用箭头表达式(`=>`)
- 支持逻辑模式（`or`/`and`/`_`通配符）
- 返回值直接表达逻辑结果，更函数时、更干净

##### 语句(statement)与表达式(expression)

| 概念 | 定义 | 特点 | 结果 |
| - | - | - | - |
| 表达式（Expression）| 能计算出一个值的代码单元 | 有值、有类型、可嵌套 | 产生一个结果 |
| 语句（Statement）| 执行某种操作或行为的代码单元 | 无值、控制流程、作用于状态 | 不产生值（或值被丢弃）|

> 表达式是“有结果的东西”，语句是“做事的东西”

```cs
int x = 3 + 4;
```
- `3 + 4` 表达式（它有值：7）
- `int x = 3 + 4` 语句（它做了一件事：定义并赋值变量）

```cs
x = y * 2;
```
- `y * 2`是表达式（有值）
- 整句`x = y * 2`是语句（执行赋值动作）

```cs
if (x > 0)
	y = 1;
```
- `(x > 0)`是表达式（返回`true`或`false`）
- `if (...) y = 1;`是语句（控制执行流程）

1. 表达式可以嵌套、组合
```cs
int z = (x + y) * max(3, f(2));
```
整个都是表达式，嵌套了函数调用、算术运算、常量等

2. 语句控制执行顺序
```cs
if (...) { ... }
for (...) { ... }
return ...;
```
它们决定代码“什么时候做什么事”，但自身不返回值

3. 部分语言模糊两者界限
- 在C、C++、C#里：语句和表达式是分开的
- 在Python、Rust、Scala、F#里：很多语句其实都是表达式

现代语言设计趋向于“让语句表达式化”，这样可以写出更简洁的代码

#### C# 9~12的进一步强化
1. 关系模式
```cs
string GetTempDesc(double t) => t switch
{
	< 0 => "冰点以下",
	>= 0 and < 30 => "正常",
	>= 30 => "高温",
};
```

2. 属性模式
```cs
Person p = new Person { Name = "Tom", Age = 20 };

var type = p switch
{
	{ Age: < 18 } => "未成年",
	{ Age: >= 18 and < 65 } => "成年人",
	{ Age: >= 65 } => "老年人",
}
```

3. 嵌套解构模式
```cs
var result = point switch
{
	{ X: 0, Y: 0 } => "原点",
	{ X: > 0, Y: > 0 } => "第一象限",
	_ => "其他", 
};
```
这些新特性让`switch`变成一种模式匹配引擎，而不仅仅是分支语句

#### 常见陷阱
1. 忘了`break`（老语法会导致穿透）
2. 混用值类型和引用类型导致匹配失败
3. 早期C#不支持多个`case`合并，现在可用`or`

#### 核心哲学
C#的`switch`从命令式走向声明式，从“判断谁”变成“描述模式”\
这种变化的本质，是把控制流逻辑结构化、数据化、函数化