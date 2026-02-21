---
title: Data Type and Convert
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# type system
---

C#中的数据类型可以分为值类型、引用类型、指针类型

## 值类型（Value Types）
变量直接包含其值，而不是引用

它们通常分配在栈上（也可能在堆上，取决于上下文）

### 特点
- 存储位置：通常在stack上分配
- 值的复制方式：赋值时复制整个值本身，两个变量互不影响
- 默认值：没有显示初始化时，具有默认值
- 继承限制：不能从另一个值类型继承，只能继承自`System.ValueType`

### 常见的值类型
1. 内置基本类型（C#关键字）

- 整数类型 默认值：0
  - int 4Byte
  - uint 4Byte
  - short 2Byte
  - ushort 2Byte
  - long 8Byte
  - ulong 8Byte
  - byte 1Byte (uint)
  - sbyte 1Byte (signed)

- 浮点类型 默认值：0.0
  - float 4Byte
  - double 8Byte
  - decimal 16Byte

- 布尔类型 默认值：flase
  - bool 1Byte

2. 枚举类型(`enum`)
```cs
enum Day { Sunday, Monday, Tuesday }
```
- 本质上时整数类型（默认为`int`）
- 是值类型，存储为对应的数值

3. 结构体类型(`struct`)
```cs
struct Point
{
	public int X;
	public int Y;
}
```
- 用户自定义的复合值类型
- 不支持继承其他结构体，但可实现接口
- 是`System.ValueType`的子类

4. `Nullable<T>`（可空值类型）
可空值类型是C#中用于给值类型添加`null`表示能力的一种语法和语义扩展，主要解决“值类型不能为null”的限制
很多情况下，值类型需要一个“未赋值”或“无值”的状态，例如\
- 数据库中的`int?`字段
- UI输入框中的可选数值
- 网络传输中的可能缺失的字段

定义方式（两种等价）
```cs
int? x = null; // 常用写法（语法糖）
Nullale<int> x = null; // 等价写法（本质）
```
可以用在任何值类型上
```cs
bool? b;
float? f;
decimal? money;
DateTime? birthday;
```

Nullable<T>的本质\
编译器背后的原理是这个结构体
```cs
public struct Nullable<T> where T : struct
{
  public T Value { get; }
  public bool HasValue { get; }
}
```
所以`int?`本质上是`Nullable<int>`，包含两部分
- `Value`：存储实际数值
- `HasValue`：是否有值（不是null）

`HasValue`
```cs
int? a = null;
Console.WriteLine(a.HasValue); // false
```

`Value`
```cs
int? b = 10;
if (b.HasValue)
	Console.WriteLine(b.value); // 10
```
如果访问`null`值的`.Value`，会抛出异常`InvalidOperationException`

空合并运算符`??`
```cs
int? age = null;
int realAge = age ?? 18; // 如果age是null，则使用18
```

可空值运算
```cs
int? a = null;
int? b = 5;
int? c = a + b; // c == null, 如果任意一项是null，结果是null
```



**判断一个类型是否是值类型**\
可以使用`typeof(T).IsValueType`
```cs
Console.WriteLine(typeof(int).IsValueType); // True
Console.WriteLine(typeof(stirng).IsValueType); // False
```

**判断一个类型的大小**\
可以使用`sizeof(T)`

**获取类型名**\
`this.GetType().Name`, `typeof(T).Name`

### System.ValueType
`System.ValueType`是.NET类型系统中的一个基础类，位于`System`命名空间中，它是所有值类型(value types)的基类，其存在意义主要是为了让值类型可以作为对象(object)使用

`System.ValueType`是值类型的抽象父类，本身是一个引用类型，它继承自`System.Object`，但专门为值类型提供了一些特性

> 所有用`struct`关键字定义的类型，都会自动继承`System.ValueType`，这与`class`自动继承`System.Object`类似

### ValueType的作用
1. 实现值类型和引用类型的桥梁
  - 虽然值类型本质不是对象，但因为继承了`ValueType`，它们可以被装箱(Boxing)，从而以`object`的形式使用

2. 重写了`Object`的方法
`ValueType`重写了`Equals`、`GetHashCode`和`ToStirng`方法，使得结构体能够正确地比较和显示内容
```cs
struct Point
{
  public int X;
  public int Y;
}
Point p1 = new Point { X = 1, Y = 2 };
Point p2 = new Point { X = 1, Y = 2 };

Console.WriteLine(p1.Equals(p2)); // 比较字段而不是引用
```
为所有值类型统一提供对`System.Object`的方法的“默认特化实现”

- `System.Object.Equals()`默认是引用比较(==)
- `System.Object.GetHashCOde()`默认基于引用地址生成hash
- `System.Object.ToString()`默认返回类型名

而这些对于值类型来说是不合理的

在内部，`System.ValueType`重写了这些方法
1. `Equals(object obj)`
  - 反射方式：比较两个值类型实例的每个字段是否相等
  - 如果没有手动重写结构体的`Equals`，它会自动比较字段值

2. `GetHashCode()`
  - 基于字段计算哈希值，而不是像`Object`那样基于地址

3. `ToString()`
  - 默认行为是打印字段列表（不如类那样详细，建议手动重写）

虽然`ValueType`做了字段比较，但性能不算高，因为使用的是反射（尤其在`Equals()`中)

所以在性能敏感场景（如大量结构体比较）推荐手动重写

## 引用类型(Reference Types)
在C#中，引用类型表示变量中存储的是对象的引用地址，而不是对象本身。对象的实际数据存储在托管堆中

| 特性      | 值类型（Value Type）                | 引用类型（Reference Type）  |
| ------- | ------------------------------ | --------------------- |
| 存储位置    | 栈或嵌入到对象中                       | 堆（实际对象），栈中存储引用        |
| 是否复制对象  | 是，按值复制                         | 否，复制的是引用              |
| 可为 null | 否（除非是 `Nullable<T>`）           | 是                     |
| 继承      | 不能继承（只能继承自 `System.ValueType`） | 可继承                   |
| 默认比较行为  | 比较内容                           | 比较引用地址（除非重写 `Equals`） |

| 类型种类        | 说明                   | 示例                           |
| ----------- | -------------------- | ---------------------------- |
| `class`     | 类，是最常用的引用类型          | `class Person {}`            |
| `interface` | 接口，也是引用类型            | `interface IMovable {}`      |
| `delegate`  | 委托，用于函数对象            | `delegate void Action();`    |
| `object`    | 所有引用类型的基类            | `object obj = new Person();` |
| `string`    | 字符串是特殊的引用类型（**不可变**） | `string s = "hello";`        |

内存结构：引用类型的生命周期
```text
变量声明:
Person p = new Person();

内存布局:
+--------------------+
| 栈内存             |
|--------------------|
| p (引用地址) ------|------+
+--------------------+      |
                            |
+--------------------+      |
| 堆内存             | <----+
|--------------------|
| Person 实例        |
| name = "Jeff"      |
+--------------------+

```
栈中保存变量`p`的引用地址，堆中存储实际的`Person`对象。当引用失效，GC会自动清理对象

### 深拷贝与浅拷贝
```cs
class Person { public string Name; }

Person p1 = new Person { Name = "Alice" };
Person p2 = p1; // p2引用同一个对象

p2.Name = "Bob";
Console.WriteLine(p1.Name); // Bob
```
> 两个变量指向同一块堆内存，修改其中一个变量的字段，另一个变量也会反映这个修改

- 浅拷贝：复制引用（默认行为，使用`MemberwiseClone()`）
- 深拷贝：复制整个对象内容（需手动实现）

```cs
public Person DeepCopy() => return new Person { Name = string.Copy(this.Name) };
```
或者使用序列化技术实现深拷贝（如`JsonSerializer`/`BinaryFormatter`）

### 引用类型的默认行为

| 方法              | 默认行为                    |
| --------------- | ----------------------- |
| `Equals()`      | 比较引用地址（可重写）             |
| `GetHashCode()` | 与引用相关（可重写）              |
| `==` 运算符        | 比较地址（除非被重载，例如 `string`） |

### 引用类型与GC
引用类型对象位于托管堆中，由CLR的GC管理内存

**GC回收条件**
- 没有任何活动引用指向该对象
- 不是被根对象（如局部变量、静态字段）引用的对象

C#的析构函数不确定何时调用，由GC控制

### 为什么需要引用对象
有很多实际需求无法通过值类型（拷贝）来完成，必须依赖对象共享、动态行为、抽象能力、复杂结构等特性，而这些特性只能由引用对象提供

值类型效率高但灵活性低，引用类型牺牲了一些效率，换来了更强大的表达力与建模能力

| 目的        | 引用对象的作用           |
| --------- | ----------------- |
|  共享数据    | 多个变量/系统使用同一个对象    |
|  建模复杂实体  | 对象可以拥有状态、行为、继承层次  |
|  动态性与多态性 | 支持虚方法、接口、动态派发等    |
|  避免内存复制  | 对象很大时，拷贝成本高，引用更轻便 |
|  支持链式结构  | 如图结构、树、图、链表等      |
|  GC自动管理  | 堆分配+GC管理，程序更安全稳定  |

### 为什么引用类型内容在堆上
1. 引用类型大小不可预知
栈是一块连续的内存区域，要求每个变量在编译期就确定大小\
而引用类型是：
  - 可以继承（派生类可能添加字段）
  - 字段可以是引用类型（嵌套）
  - 包含对象图（Object Graph）
  - 可变结构（如数组、链表）

所以，引用类型的大小通常在运行时才知道，无法放在栈上

2. 栈的生命周期与方法调用同步，太短
栈上的变量在方法返回后立即销毁，如果对象存在于栈上，那一旦函数返回了，对象也就不存在了\
而引用类型经常在方法之外继续使用（比如：作为成员变量、事件回调、全局数据等），必须在方法栈帧之外生存

3. 需要支持多个引用指向同一个对象
如果把对象放在栈中，那么指向该对象的引用就可能失效，为了保证引用安全和共享性，引用类型的数据必须放在一个不会随函数退出而消失的地方：也就是托管堆

4. 支持GC
值类型（在栈上）是自动释放的，编译器控制生命周期\
引用类型（在堆上）需要动态管理\
所以CLR引入了GC，自动清理没有引用的堆对象

### Object
在C#中，`Object`类（也叫`System.Object`）是一切类型的根基，是CLR类型系统的根基（Root Class），无论是值类型、引用类型，最终都从`Object`直接或间接继承而来

```cs
namespace System
{
  public class Object
  {
    public Object();
	public virtual bool Equals(object obj);
	public static bool Equals(object objA, object objB);
	public static bool ReferenceEquals(object objA, object objB);
	public virtual int GetHashCode();
	public virtual string ToString();
	public virtual void Finalize();
	public Type GetType();
  }
}
```
- 所有类型都隐式或显式继承自`System.Object`
- 是CLR类型系统统一的抽象基础
- 是实现装箱、反射、多态的核心

1. `Equals()`
用于判断两个对象是否“值相等”（默认比较地址），如果需要比较“值”，需要重写`Equals()`

2. `ReferenceEquals()`
比较两个引用是否指向完全相同的对象
- 与`==`不同，`ReferenceEquals`不可重载，绝对安全

3. `GetHashCode()`
返回一个整数，用于表示对象的哈希值\
默认行为是：
- 引用类型：使用对象地址或内部ID
- 值类型：使用字段值组合而成

如果自定义类并重写`Equals()`，必须也重写`GetHashCode()`，以保证在哈希表中工作正确

4. `ToString()`
返回对象的字符串表示，默认是类名

5. `GetType()`
获取当前实例的运行时类型（返回`System.Type`对象），是实现反射的基础

6. `Finalize()`
析构函数的底层形式
```cs
~MyClass() { ... } // 实际上编译成 override Finalize()
```
- `Finalize`是GC回收前调用的最后机会
- 默认`Object`实现是空的
- 不推荐滥用（推荐使用`IDisposable`）

#### `Object`、`object`、`System.Object`
在C#中，`object`是一个语言关键字，它等价于`System.Object`，而`Object`通常是指引入了`System`命名空间后对`System.Object`的简写引用名

它们其实都代表同一个.NET类型：`System.Object`，区别仅仅是上下文不同

| 名称              | 类型       | 含义                             | 示例                                       |
| --------------- | -------- | ------------------------------ | ---------------------------------------- |
| `System.Object` | 完整类型名    | BCL中的真正类型，定义在 `mscorlib.dll` 中 | `System.Object o = new System.Object();` |
| `Object`        | 类型别名（类名） | 当引入了 `using System;` 后的简写写法    | `Object o = new Object();`               |
| `object`        | C# 关键字   | 编译器关键字，等价于 `System.Object`，就像`int`等价于`System.Int32`一样     | `object o = new object();`               |

**编译器角度**
这三种形式在IL中都是一样的
```cs
object o = new object();
Object o2 = new Object();
System.Object o3 = new System.Object();
```
编译之后的IL代码中，它们都会创建一个`System.Object`实例

| 用法                | 推荐写法            | 原因                    |
| ----------------- | --------------- | --------------------- |
| 普通开发              | `object`        | 符合 C# 语言习惯，简洁         |
| 底层开发（如反射、Interop） | `System.Object` | 更明确，避免命名冲突            |
| 语法糖场景             | `object`        | 与 `int`, `string` 等一致 |

一般写object即可，它们三个是一个东西

### String
String是C#中最常用也是最重要的类型之一，它不仅仅是字符串的容器，更体现了C#语言设计的不可变性、托管安全、优化机制等诸多理念

> `string`是C#关键字，对应.NET中的`System.String`类型，它是一个不可变（immutable）的引用类型，用于表示Unicode字符

| 特性     | 描述                       |
| ------ | ------------------------ |
| 类型名    | `System.String`          |
| C# 关键字 | `string`                 |
| 所属程序集  | `mscorlib.dll`           |
| 类型分类   | 引用类型，但行为类似值类型（不可变 + 值语义） |
| 存储内容   | UTF-16 编码的 Unicode 字符数组  |

#### String的不可变性
```cs
string s = "Hello";
s += " World";
```
虽然看起来在修改字符串，但其实
- `Hello`是原始字符串
- `Hello World`是新创建的字符串
- `s`指向了一个新的字符串对象

旧字符串仍然存在于内存中，等待GC回收

**为什么要设计成不可变**
1. 线程安全（无锁共享）
2. 哈希值缓存稳定
3. 可用于字典、集合等键类型
4. 提升性能（如字符串驻留）
5. 减少错误（避免被外部修改）

#### 字符串驻留（Interning）
C#编译器会把相同字面值的字符串常量指向同一内存
```cs
string a = "abc";
string b = "abc";
Console.WriteLine(object.ReferenceEquals(a, b)); // True
```
所以字符串字面量是驻留的，避免重复创建

##### 实现机制
1. 编译器阶段优化
当有多个相同的字符串字面量时，编译器会自动合并为一个驻留字符串

2. 运行时通过Intern Pool判断
CLR通过内部的字符串池（intern pool）判断字符串是否已存在，并决定是否复用

当在运行时动态创建字符串时（如拼接、读取）时，它不会自动驻留

**手动判断/驻留**\
1. 使用`string.IsInterned()`判断是否驻留
2. 使用`string.Intern()`手动驻留
`Intern()`会
  - 检查池中是否已经有相同内容字符串
  - 若有，返回现有实例
  - 若没有，加入池并返回这个实例

**驻留池生命周期**
- 驻留池存在于应用程序域（AppDomain）中
- 字符串一旦被驻留，就不会被GC回收
- 所以不要频繁动态调用`Intern()`来驻留临时字符串，会造成内存泄露


#### string的特殊性
string的分类为引用类型（在堆中分配），但是语义缺执行值语义行为（赋值复制引用，但不可变），比较时按值比较（而不是引用）
```cs
string s1 = "abc";
string s2 = s1; // s2指向同一个字符串
s2 = "xyz"; // s2改指向一个新的字符串，s1不受影响
Console.WriteLine(s1) // abc
```

#### string的实现
C#中的`string`是一个类（引用类型），它内部使用`char[]`表示字符内容
```cs
public sealed class String : IComparable, ICloneable, IEnumerable<char>
{
  private readonly int _stringLength;
  private readonly char _firstChar;
  // 实际上还有内部字段存储字符数组
}
```
由于是`sealed`，`String`不能被继承

**操作符重载**
- `==`/`!=`：按值不叫字符串内容（已经被重载）
- `+`：连接字符串（编译器自动转换为`Concat`或`StringBuilder`）

```cs
string s = "Hello" + "World"; // 编译器优化为常量”Hello World“
```

#### 字符串操作效率问题
由于不可变，频繁拼接会创建大量新对象
```cs
string result = "";
for (int i = 0; i < 1000; ++i) result += i;
```
性能极差

推荐使用
```cs
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.Append(i);
string result = sb.ToString();
```

#### API

| 方法                                     | 功能           |
| -------------------------------------- | ------------ |
| `Length`                               | 获取字符串长度（字符数） |
| `Substring(start, length)`             | 截取子串         |
| `IndexOf(char/str)`                    | 查找字符/子串索引    |
| `ToUpper()` / `ToLower()`              | 字母大小写转换      |
| `Trim()` / `TrimStart()` / `TrimEnd()` | 去除空白字符       |
| `Replace(old, new)`                    | 替换子串         |
| `Split(char[])`                        | 拆分成字符串数组     |
| `Contains(string)`                     | 是否包含子串       |
| `StartsWith()` / `EndsWith()`          | 前缀/后缀判断      |


### Dynamic（慎用）
它代表了动态类型系统的入口，让C#拥有了类似Python、JavaScript的运行时绑定的能力


## 指针类型（Pointer Types）
这是C#中一部分不常用但非常底层的特性，它让C#在特定场景下具备类似C++的裸指针能力

指针类型是C#的unsafe功能，它允许直接访问内存地址、操作指针，就像在C/C++中一样，但需要使用`unsafe`关键字显式开启

### 语法
```cs
type* pointerName;
```
- `type`可以是任意可寻址类型
- 必须写在`unsafe`上下文中

```cs
unsafe
{
	int x = 10;
	int* ptr = &x;
	Console.WriteLine(*ptr);
}
```

**开启条件**\
由于C#是类型安全的语言，默认不允许使用指针，因此必须：
1. 显式使用`unsafe`修饰代码块或方法
2. 在项目属性中开启允许不安全代码

```cs
unsafe class UnsafeClass
{
  static void Main()
  {
    int x = 123;
	int* p = &x;
	Console.WriteLine(*p); // 123
  }
}
```

指针可用于所有值类型，不可用于所有引用类型，也就是说，指针蹦年指向托管堆上的对象，这是不安全行为，堆上的对象会被GC移动

C#提供了更安全的替代方式
- Span<T>/ReadOnlySpan<T> 高性能、零拷贝内存访问
- Memory<T> 可用于异步场景
- Marshal类 于非托管内存交互
- fixed关键字 将托管变量固定以防止GC移动

## 类型转换

| 类型转换类别               | 描述                              |
| -------------------- | ------------------------------- |
| 隐式转换（implicit）       | 安全、自动完成，无需强制转换符                 |
| 显式转换（cast）           | 可能丢失精度，需使用强制转换符 `()`            |
| 装箱（Boxing）           | 值类型 → 引用类型（object）              |
| 拆箱（Unboxing）         | 引用类型 → 值类型（需类型匹配）               |
| 使用 `Convert` 类       | 安全地处理类型转换，含 null 检查等            |
| `Parse` / `TryParse` | 将字符串转换为数值等基本类型                  |
| 用户自定义转换              | 自定义 `implicit` 或 `explicit` 运算符 |

### 隐式转换（implicit）
隐式转换是指：编译器自动完成类型转换而不显式使用`cast`操作符的情况

它是语言的类型和操作符重载机制中非常重要的一部分

特点：
- 编译器自动完成（无需(T)xxx）
- 不会造成数据丢失或运行时异常
- 常用于“容量小”到“容量大”的数值类型转换

#### 内置类型的隐式转换
**常见数值类型之间的隐式转换**

| 来源类型    | 目标类型                                                                   |
| ------- | ---------------------------------------------------------------------- |
| `byte`  | `short`, `int`, `long`, `float`, `double`, `decimal`                   |
| `short` | `int`, `long`, `float`, `double`, `decimal`                            |
| `int`   | `long`, `float`, `double`, `decimal`                                   |
| `float` | `double`                                                               |
| `char`  | `ushort`, `int`, `uint`, `long`, `ulong`, `float`, `double`, `decimal` |

```cs
int i = 100;
double d = i; // 隐式转换：int -> double

float f = 3.14f;
double d2 = f; // 隐式转换：float -> double
```

#### 自定义类型中的隐式转换
使用`implicit`关键字来自定义转换操作符
```cs
public class Meter
{
  public double value { get; }

  public Meter(double value) => Value = value;

  // 自定义从double到Meter的隐式转换
  public static implicit operator Meter(double value) => return new Meter(value);

  // 自定义从Meter到double的隐式转换
  public static implicit operator double(Meter meter) => return meter.Value;
}
```
用法
```cs
Meter m = 5.0; // 隐式double -> Meter
double d = m; // 隐式Meter -> double
```

#### 注意事项
1. 不要滥用隐式转换操作符：过度使用可能会降低代码的可读性，使得类型之间的边界变得模糊
2. 避免转换歧义：如果两个类型之间同时定义了`implicit`和`explicit`，要明确选择
3. 接口与继承结构中，隐式转换通常用于“上转型”
```cs
Stream s = new FileStream(...); // FileStream -> Stream 是隐式转换
```

#### 示例：封装单位系统
```cs
public struct Celsius
{
    public double Degrees { get; }

    public Celsius(double degrees)
    {
        Degrees = degrees;
    }

    public static implicit operator Fahrenheit(Celsius c)
    {
        return new Fahrenheit(c.Degrees * 9 / 5 + 32);
    }
}

public struct Fahrenheit
{
    public double Degrees { get; }

    public Fahrenheit(double degrees)
    {
        Degrees = degrees;
    }

    public static implicit operator Celsius(Fahrenheit f)
    {
        return new Celsius((f.Degrees - 32) * 5 / 9);
    }
}

// 用法
Celsius c = new Fahrenheit(98.6); // 自动转为 Celsius
Fahrenheit f = new Celsius(37);  // 自动转为 Fahrenheit
```

### 显式转换（cast）
开发者使用强制类型转换(cast)语法手动进行的类型转换
```cs
int i = (int)3.14;
```
C#中的显式转换用于那些可能丢失信息或失败的转换，因此编译器不会自动完成，必须使用`(T)`的形式进行转换

#### 内置类型的显式转换
内置数值类型之间存在一些需要显式转换的形式：

| 来源类型     | 目标类型   | 是否需要显式转换 | 原因 |
| -------- | ------ | -------- | --------- |
| `double` | `int`  | 是      | 可能丢失小数部分  |
| `long`   | `int`  | 是      | 可能溢出      |
| `float`  | `byte` | 是      | 可能精度损失和溢出 |

示例：
```cs
double d = 3.14;
int i = (int)d; // i = 3

long l = 9999999999;
int j = (int)l; // 溢出，j的值将错误
```



#### 显式转换的本质
C#通过`explicit`关键字来定义类中的自定义显式类型转换操作符，用来让开发者明确地从一种类型转换为另一种类型
```cs
public static explicit operator TargetType(SourceType value)
```
示例：显式转换一个自定义类为`int`
```cs
public class MyClass
{
  public int Value { get; set; }

  public MyClass(int value) => Value = value;

  public static explicit operator int(MyClass obj)
  {
    return obj.Value;
  }

  public static explicit operator MyClass(int value)
  {
    return new MyClass(value);
  }
}
```
用法
```cs
MyClass a = (MyClass)42; // 显式从int转为MyClass
int x = (int)a; // 显式从MyClass转为int
```
如果不使用`(int)`强制转换，上面代码将无法编译

#### 隐式转换 vs 显式转换

| 对比项    | 隐式转换（implicit）       | 显式转换（explicit）           |
| ------ | -------------------- | ------------------------ |
| 编译器行为  | 自动进行                 | 必须手动 `(T)value`          |
| 安全性    | 必须是无损转换              | 可以是有损或可能失败的转换            |
| 用户体验   | 更加自然、易于使用            | 更安全，提醒开发者确认转换逻辑          |
| 典型用法场景 | 小类型 → 大类型、单位包装类、语义增强 | 大类型 → 小类型、自定义类结构、需防误用的场景 |

#### 示例
数值和包装类
```cs
public struct Health
{
    public int Value;

    public Health(int value) => Value = value;

    public static explicit operator int(Health h) => h.Value;
    public static explicit operator Health(int v) => new Health(v);
}

// 用法
int hp = (int)new Health(100);
Health h2 = (Health)hp;
```

从字符串解析对象
```cs
public class IPAddress
{
    public string Address { get; private set; }

    private IPAddress(string addr) => Address = addr;

    public static explicit operator IPAddress(string input)
    {
        // 假设格式检查
        if (input.Contains("."))
            return new IPAddress(input);
        throw new FormatException("Invalid IP address");
    }
}

```

### 值类型与引用类型之间的转换
#### 装箱（Boxing）=> 值类型 -> 引用类型
将值类型转换为引用类型（通常是`object`或接口类型），该值会被拷贝一份并放到堆上，返回的是引用
```cs
int i = 42;
object obj = i; // 装箱：int -> object
```
本质：
1. 在堆上分配一块内存
2. 把`i`的值拷贝到堆上
3. 包装成一个`System.ValueType`的实例
4. 返回该引用（地址）

注意：
- 装箱是隐式的，自动进行
- 但是开销很大：堆分配 + 复制 + 类型信息封装

#### 拆箱（Unboxing）=> 引用类型 -> 值类型
将一个已经装箱的对象（如`object`）重新转换为其原始的值类型
```cs
object obj = 42; // 装箱
int i = (int)obj; // 拆箱
float f = (float)obj; // 抛出异常，不能拆箱为不同类型
```
注意：
- 拆箱是显式的，必须用强制类型转换`(T)`
- 拆箱过程中必须提供原始的值类型，否则运行时会抛出`InvalidCastException`

#### 结构体和接口之间的装箱
```cs
struct MyStruct : IMyInterface
{
  public int Value;
  public void DoSomething() => Console.WriteLine(Value);
}

IMyInterface iface = new MyStruct { Value = 10 }; // 装箱
iface.DoSometing(); // iface是一个引用
```
结构体实现接口时，赋值给接口类型变量会触发装箱，导致拷贝和性能损耗

#### 值类型转引用类型的其他形式
1. 值类型 ->`object`/`dynamic`/接口类型
```cs
int a = 5;
object obj = a; // boxing
dynamic d = a; // boxing
IComparable cmp = a; // boxing
```

2. 使用泛型装箱陷阱
```cs
void Print<T>(T value) => object obj = value; // 如果T是值类型，这里会装箱
```

#### 值类型转换为引用类型的扩展方式
除了`object`、接口等默认机制，也可以在自定义类中自定义显式或隐式转换
```cs
struct Health
{
  public int value;

  public static implicit operator Health(int value) => new Health { Value = value; };
  public static explicit operator int(Health h) => h.Value;
}
```
这样就可以
```cs
Health h = 100; // 隐式装箱为结构体（无引用）
int value = (int)h;
```

#### 避免装箱的优化建议
- 接口调用结构体：使用泛型接口（如`IEquatable<T>`，或避免接口封装
- Unity ECS：使用`struct` + `ref struct` + 泛型，尽量避免装箱
- 遍历集合：使用`for`遍历代替`foreach`（尤其对`struct`）
- 自定义数据结构：用泛型减少类型擦除、减少runtime装箱开销

### String转基本类型
三种常见的转换方式

| 方法                                | 是否安全 | 失败行为       | 备注                  |
| --------------------------------- | ---- | ---------- | ------------------- |
| `Convert.ToXxx(string)`           | 否  | 抛出异常       | 快捷但不安全              |
| `Xxx.Parse(string)`               | 否  | 抛出异常       | 比较常见，但需自己 try-catch |
| `Xxx.TryParse(string, out value)` | 是  | 返回 `false` | 推荐，性能更稳健            |


#### `Parse`
`Parse`是一组用于将字符串转换为对应基本类型的方法，它们存在于相应类型的静态方法中
```cs
int.Parse(string);
float.Parse(string);
DateTime.Parse(string);
Enum.Parse(Type, string)
```
`Parse`是强类型转换的一种形式，要求输入格式必须合法，否则会抛出异常

##### `Parse`的基本行为
- 属于静态方法
- 输入必须是合法格式的字符串
- 失败时抛出异常
- 不安全，不建议用于不确定来源的字符串

##### 常见类型的转换
- `int.Parse`
```cs
int num = int.Parse("123"); // OK
int bad = int.Parse("abc"); // FormatException
```
- `float.Parse`
```cs
float pi = float.Parse("3.14");
```
- `bool.Parse`
```cs
bool b1 = bool.Parse("true"); // OK
bool b2 = bool.Parse("FALSE"); // OK
bool b3 = bool.Parse("yes"); // FormatException
```
- `DataTime.Parse`
```cs
DataTime dt = DataTime.Parse("2025-07-29");
```
支持多种格式，但有区域性依赖（受`CultureInfo`控制）

- `Enum.Parse`
```cs
enum Direction { Up, Down, Left, Right }

Dirction d = (Direction)Enum.Parse(typeof(Direction), "Up");

// 也可以忽略大小写
Enum.Parse(typeof(Direction), "down", true);  // 返回 Direction.Down
```

**常见异常**

| 异常类型                    | 说明                                      |
| ----------------------- | --------------------------------------- |
| `FormatException`       | 字符串格式不合法                                |
| `ArgumentNullException` | 传入的是 `null`                             |
| `OverflowException`     | 数值超出类型范围（如 `int.Parse("999999999999")`） |

##### 自定义类中实现Parse
```cs
class Person
{
  public string Name;
  public int Age;

  public static Person Parse(string s)
  {
    var parts = s.Split(',');
    return new Person
    {
      Name = parts[0], 
      Age = int.Parse(parts[1])
    };
  }
}
```
使用
```cs
Person p = Person.Parse("Jeff,24"")
```

#### `TryParse`
`TryParse`是C#中用于安全地将字符串转换为基本类型的一种方法，它是`Parse`的安全替代方案。`TryParse`不会抛出异常，而是返回一个布尔值表示转换是否成功，转换结果通过`out`参数返回

##### 基本语法
```cs
bool TryParse(string s, out T result)
```
- `s`：要转换的字符串
- `result`：输出参数，转换成功后的值，转换失败为0
- 返回值为`true`表示转换成功，`false`表示失败

##### 基本类型的TryParse
`int.TryParse`
```cs
string input = "123";
if (int.TryParse(input, out int number))
    Console.WriteLine("转换成功：" + number);
else
    Console.WriteLine("转换失败");
```

`float.TryParse`
```cs
float.TryParse("3.14", out float pi); // pi = 3.14
float.TryParse("abc", out float pi); // fail = 0
```

`bool.TryParse`
```cs
bool.TryParse("true", out bool b1); // true
bool.TryParse("yes", out bool b2); // false
```
##### `Parse` vs `TryParse`

| 特性     | `Parse`         | `TryParse`        |
| ------ | --------------- | ----------------- |
| 失败处理方式 | 抛出异常            | 返回 false，不抛异常     |
| 推荐程度   | 不推荐（除非能确保输入） | 推荐用于所有用户输入或不确定值 |
| 返回类型   | 转换后的类型          | `bool`（成功与否）      |
| 性能表现   | 较差（失败时抛异常开销大）   | 优秀，特别是在循环中        |

##### Enum.TryParses示例
```cs
enum Direction { Up, Down, Left, Right }

Enum.TryParse("Left", out Direction d); // 成功
Enum.TryParse("INVALID", out Dirction d2); // 失败，d2 = default(Direction)
Enum.TryParse("up", ignoreCase: true, out Direction d3); // 忽略大小写
```
`Enum.TryParse<TEnum>(string, bool ignoreCase, out TEnum)`是泛型形式，推荐使用

##### 封装通用TryParse方法
如果频繁使用TryParse，或者string要转复杂的大量的自定义类型，可以做以下封装，提高代码扩展性
```cs
public static class ParseHelper
{
    public static bool TryParse<T>(string input, out T result)
    {
        result = default;

        var type = typeof(T);

        if (type == typeof(int) && int.TryParse(input, out int i)) { result = (T)(object)i; return true; }
        if (type == typeof(float) && float.TryParse(input, out float f)) { result = (T)(object)f; return true; }
        if (type == typeof(bool) && bool.TryParse(input, out bool b)) { result = (T)(object)b; return true; }
        if (type.IsEnum && Enum.TryParse(type, input, true, out object e)) { result = (T)e; return true; }

        return false;
    }
}
```

### `Convert`
`Convert`类是C#中一个非常强大的工具，它提供了一些列静态方法，用于将各种类型之间进行转换

相比于`Parse`和`TryParse`，`Convert`在类型转换上更为宽松，支持更广泛的类型转换，不仅支持值类型和引用类型之间的转换，还可以处理不同类型之间的转换，如从`int`到`double`，从`DateTime`到`string`等

#### `Convert`类的作用
`Convert`类位于`System`命名空间下，提供了一些非常常见的转换方法，它的作用主要包括：
1. 类型转换： 支持 值类型到值类型、引用类型到值类型、值类型到引用类型 的转换。

2. 兼容性强： 能够在很多情况下进行类型的宽松转换，例如将数字类型（int、double、float）互相转换，或者将日期类型转换为字符串等。

3. null 处理： 与 Parse 不同，Convert 不会抛出异常，而是将 null 转换为适当的默认值。

#### `Convert`常用方法
`Convert`类提供了多个静态方法，以下是其中一些常用的方法
- `Convert.ToInt32` / `Convert.ToInt64` / `Convert.ToDouble` / `Convert.ToBoolean`
这些方法会尝试将一个对象转换为目标类型，如果无法转换，会抛出异常
```cs
object obj = "123";
int num = Convert.ToInt32(obj); // 结果：123

object nullObj = null;
int result = Convert.ToInt32(nullObj); // 结果：0（null 转为默认值）
```

- `Convert.ToString`
将对象转换为字符串，如果对象是`null`，则返回空字符串
```cs
object obj1 = 123;
string str1 = Convert.ToString(obj1); // 结果："123"

object obj2 = null;
string str2 = Convert.ToString(obj2); // 结果""（空字符串）
```

- `Convert.ToDateTime`
将对象转换为`DateTime`类型
```cs
object obj = "2025-07-29";
DateTime date = Convert.ToDateTime(obj); // 结果：2025/07/-29

object obj2 = null;
DateTime date2 = Convert.ToDateTime(obj2); // 结果：01/01/0001 00：00：00（默认值）
```

- `Convert.ToDecimal`
将对象转换为`decimal`类型，禅功与金融和高精度计算
```cs
object obj = 3.14f;
decimal dec = Convert.ToDecimal(obj);  // 结果：3.14
```

- `Convert.ChangeType`
`Convert.ChangeType`是一种非常强大的方法，允许将对象转换为任何类型，但必须指定目标类型。适合于更动态的场景\
它的强大之处在于可以第二个参数，可以在运行时动态获得\
它返回一个object类型
```cs
object obj = 123;
int num = (int)Convert.ChangeType(obj, typeof(int));  // 结果：123

object strObj = "2025-07-29";
DateTime date = (DateTime)Convert.ChangeType(strObj, typeof(DateTime));  // 结果：2025/07/29
```
`Convert.ChangeType`是通过反射来实现的，适用于需要动态类型转换的情况
`Convert.ChangeType`没有对null的特殊处理，所以当将null转换为非空类型时会抛出异常，需要进行显式处理

#### Convert内部原理
1. 基于 IConvertible 接口：C# 中的大部分类型（如 int、float、double、DateTime、string 等）都实现了 IConvertible 接口，Convert 类使用该接口提供的转换方法来执行类型转换。
2. 处理 null 值：Convert 类会自动将 null 转换为该类型的默认值。例如，Convert.ToInt32(null) 会返回 0，Convert.ToDateTime(null) 会返回 DateTime.MinValue，而Convert.ChangeType需要显式处理
3. 类型溢出处理：Convert 会根据目标类型的大小范围执行适当的类型溢出检查。如果值超出目标类型的范围，Convert 会抛出 OverflowException。
4. 宽松转换：Convert 会尽可能地进行宽松的类型转换，比如将 int 转换为 double，将 float 转换为 decimal 等。但有些类型无法自动转换，如将 string 转换为 int（必须是格式正确的字符串）。