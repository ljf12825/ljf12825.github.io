---
title: Generic
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: blog
summary: C# generic
---

简单来说，泛型允许在编写类、接口、方法时，使用“类型参数”来代替具体的类型。这个类型参数在编译时或运行时才被指定

## 为什么需要
在泛型出现之前，如果想创建一个可以存放任意类型数据的集合（比如一个盒子），通常会使用`object`类型，因为C#中所有类型都继承自`object`
```cs
// 一个只能存放整数的盒子
public class IntBox
{
    public int Data { get; set; }
}

// 一个只能存放字符串的盒子
public class StringBox
{
    public string Data { get; set; }
}

// 为了存放任意类型，使用object
public class ObjectBox
{
    public object Data { get; set; }
}
```
使用`objectBox`时会出现两个问题
1. 性能损失（拆箱装箱）：当存放值类型（如`int`, `struct`）时，会发生装箱（Boxing）和拆箱（Unboxing）操作，影响性能
```cs
ObjectBox box = new ObjectBox();
box.Data = 42; // 装箱：将值类型int包装为object引用类型
int data = (int)box.Data; // 拆箱：将object转换回值类型int
```

2. 类型不安全：编译器无法在编译时保证类型安全，容易在运行时引发`InvalidCastException`
```cs
ObjectBox box = new ObjectBox();
box.Data = "Hello World"; // 存放一个字符串
int data = (int)box.Data; // 运行时错误！无法将字符串转换为整数
```

### 泛型如何解决这些问题
用泛型重新写这个“盒子”
```cs
// T 是一个整数参数，它只是一个占位符
public class GenericBox<T>
{
    public T Data { get; set; }
}
```
使用这个泛型类
```cs
// 创建一个专门存放int的盒子
GenericBox<int> intBox = new GenericBox<int>();
intBox.Data = 42; // 类型安全，只能是int
int intData = intBox.Data; // 无需类型转换和拆箱，性能高

// 创建一个专门存放string的盒子
GenericBox<string> stringBox = new GenericBox<string>();
stringBox.Data = "Hello"; // 类型安全，只能是string
string stringData = stringBox.Data; // 无需类型转换
```
优势：
- 类型安全：编译器在编译时就能确保你使用的是正确的类型
- 性能提升：消除了对于值类型的装箱和拆箱操作
- 代码复用：只需编写一次`GenericBox<T>`，就可以用于创建无数种特定类型的盒子

## 语法
- 泛型类
```cs
public class Box<T>
{
    public T Value { get; set; }
    public Box(T value) => Value = value;
}
```
用法
```cs
var intBox = new Box<int>(42);
var strBox = new Box<string>("hello");
```

- 泛型方法
方法也可以是泛型的，即时它所属的类不是泛型类
```cs
public class Utility
{
    // Generic Method
    public static void Swap<T>(ref T a, ref T b)
    {
        T temp = a;
        a = b;
        b = temp;
    }
}

// 使用
int x = 1, y = 2;
Utility.Swap<int>(ref x, ref y); // 显式指定类型
// 或者更常见的，让编译器推断
Utility.Swap(ref x, ref y);

string s1 = "foo", s2 = "bar";
Utility.Swap(ref s1, ref s2); // 同样适用于string
```

- 泛型接口
```cs
// 泛型接口
public interface IRepository<T>
{
    void Add(T entity);
    T GetById(int id);
    IEnumerable<T> GetAll();
}

// 实现泛型接口
public class ProductRepository : IRepository<Product>
{
    public void Add(Product entity) { /* ... */ }
    public Product GetById(int id) { /* ... */ }
    public IEnumeralbe<Product> GetAll() { /* ... */ }
}

public class UserRepository : IRepository<User>
{
    public void Add(User entity) { /* ... */ }
    public User GetById(int id) { /* ... */ }
    public IEnumerable<User> GetAll() { /* ... */ }
}
```

- 泛型集合
.NET Framework在`System.Collections.Generic`命名空间中提供了丰富的泛型集合类，它们完全取代了旧的`ArrayList`, `Hashtable`等非泛型集合
```cs
// 旧的非泛型集合（不推荐）
ArrayList list = new ArrayList();
list.Add(1);
list.Add("string"); // 可以混合类型，危险！
int i = (int)list[0]; // 需要强制转换

// 新的泛型集合（推荐）
List<int> intList = new List<int>();
intList.Add(1);
// inList.Add("string"); // 编译错误！类型安全
int i = intList[0]; // 无需强制转换

Dictionary<string, int> keyValuePairs = new Dictionary<string, int>();
keyValuePairs.Add("Alice", 95);
int score = keyValuePairs["Alice"]; // 类型安全，键是string，值是int
```

## 泛型约束（`where`）
有时需要对类型参数`T`施加一些限制，比如要求`T`必须是一个类，或者必须实现某个接口。这就是泛型约束
```cs
public class GenericClass<T> where T : class, new() // T 必须是引用类型，并且有无参构造函数
{
    public T CreateInstance()
    {
        return new T(); // 因为有了 new() 约束，所以可以 new T()
    }
}

public class Calculator<T> where T : IComparable<T>
{
    public T Max(T a, T b)
    {
        return a.CompareTo(b) > 0 ? a : b; // 因为有了 IComparable约束，所以可以调用 CompareTo方法
    }
}
```
常见的约束类型
- `where T : class`——引用类型
- `where T : struct`——值类型（非可空）
- `where T : new()`——必须有public无参构造函数（通常和`Activator.CreateInstance<T>()`替代）
- `where T : BaseClass`——继承约束
- `where T : IInterface`——实现接口
- `where T : unmanaged`——非托管类型（C#7.3+）
- `where T : notnull`——不能为null（C#8.0+的场景）
- `where T : System.Enum`/`where T : System.Delegate`——枚举/委托（C#7.3+）

约束可以组合`where T : Base, IMyInterface, new()`顺序不限，但通常把`new()`放在最后

### 方差
方差是C#类型系统中一个非常重要但稍显复杂的概念，它关乎泛型类型参数的继承关系如何影响泛型类型本身的继承关系\
**核心思想：协变（Convariance）与逆变（Contravariance）**\
为了更好地理解，首先需要明确一个基础：在面向对象编程中，存在一种“里氏替换原则”。即，如果`Dog`继承自`Animal`，那么在任何需要`Animal`的地方，我们都可以安全地使用`Dog`。我们把这个关系记作：`Dog` -> `Animal`（Dog可以替换Animal）

假设有两个类
```cs
class Animal { }
class Dog : Animal { }
```
显然：
- `Dog`是`Animal`的子类
- 换句话说：`Dog`可以被当作`Animal`来用

```cs
Animal a = new Dog(); // 合法
```
这就是正常的继承兼容（subtyping）

泛型类型
```cs
List<Animal> animals = new List<Dog>(); // 编译错误
```
因为`List<Dog>`不是`List<Animal>`\
虽然`Dog`是`Animal`的子类，但“装着狗的列表”不是“装着动物的列表”

原因很简单：\
如果允许这样写，那就可能往`animal`里加一只`Cat`，而者实际上塞进了一个`List<Dog>`，逻辑崩溃

#### 协变
- 定义：如果泛型类型参数`T`的继承关系，与泛型类型`I<T>`的继承关系方向一致，则称为协变
- 关键字：`out`
- 含义：它表示`T`只从接口/委托中输出（作为返回值、属性获取器等），而不被输入（作为参数）

例子：
```cs
// 使用 'out' 关键字声明协变接口
interface IReadOnlyCollection<out T>
{
    T GetItem(int index);
    int Count { get; }
}

class Animal { }
class Dog : Animal { }

// 因为Dog -> Animal，并且接口是协变的
// 所以 IReadOnlyCollection<Dog> -> IReadOnlyCollection<Animal>
IReadOnlyCollection<Dog> dogs = GetSomeDogs();
IReadOnlyCollection<Animal> animal = dogs; // 这是合法的！协变允许这样赋值
// IReadOnlyCollection<T>只用作输出，Dog当Animal输出，不写入
```
##### 为什么这是安全的
因为`IReadOnlyCollection<Animal>`的消费者只期望从它哪里获取`Animal`对象。而我们的`dogs`集合里装的虽然是`Dog`，但每一个`Dog`都是一个`Animal`。所以，把`Dog`当作`Animal`返完全是安全的。`T`只输出，不会写入，编译器知道不会往里加别的动物，保证了不会有“把Cat塞进Dog集合”的风险，所以是安全的

##### .NET中的实际例子
`IEnumerable<T>`接口就是协变的，因为它只有一个方法`GetEnumerator()`返回`IEnumerator<T>`，而`IEnumerator<T>`的核心是`T Current { get; }`属性，`T`只用于输出
```cs
IEnumerable<Dog> dogs = new List<Dog>();
IEnumerable<Animal> animals = dogs; // 合法，因为 IEnumerable<out T>
```

#### 逆变
- 定义：如果泛型类型参数`T`的继承关系，与泛型类型`I<T>`的继承关系方向相反，则称为逆变
- 关键字：`in`
- 含义：它表示`T`只向接口/委托中输入（作为参数）而不被输出

```cs
// 使用 'in' 关键字声明逆变接口
interface IComparer<in T>
{
    int Compare(T x, T y);
}

class Animal { }
class Dog : Animal { }

// 因为 Dog -> Animal，并且接口是可逆的
// 所以 ICompare<Animal> -> IComparer<Dog> (变为反向)
IComparer<Animal> animalComparer = GetAnimalComparer();
IComparer<Dog> dogComparer = animalComparer; // 这是合法的！逆变允许这样赋值
```
##### 为什么这是安全的
`IComparer<Dog>`的消费者需要的是一个能比较两个Dog对象的比较器。而我们有一个`animalComparer`，它声称自己能比较任何Animal（包括Dog）。既然它能比较任何动物，那么它当然也能比较两个特定的Dog。所以，把一个“更通用的”比较器当作一个“更具体的”比较器来使用是安全的。`T`只出现在输出位置，保证了比较器不会要求返回一个具体的`Dog`

##### .NET中的实际例子
`IComparer<T>`和`Action<T>`委托都是逆变的
```cs
Action<Animal> actOnAnimal = (animal) => Console.WriteLine(animal.Name);
Action<Dog> actOnDog = actOnAnimal; // 合法，因为 Action<in T>

// 现在调用 actOnDog(someDog)
// 实际上是执行actOnAnimal(someDog)
// 而 actOnAnimal 可以处理任何 Animal，所以处理一个Dog是安全的
```

#### 不变
- 定义：如果泛型类型参数`T`既不协变也不逆变，则称为不变。这是大多数泛型类型的默认行为
- 含义：`T`既用于输入，也用于输出。此时，`I<Dog>`和`I<Animal>`之间没有任何继承关系

```cs
// 没有 'in' 或 'out' 关键字，是不变接口
interface IList<T>
{
    T GetItem(int index); // T 用于输出
    void Add(T item);     // T 用于输入
}

class Animal { }
class Dog : Animal { }

IList<Dog> dogs = new List<Dog>();
IList<Animal> animals = dogs; // 编译错误！不允许！
```

##### 为什么不安全
假设上面的赋值是合法的
```cs
// 假设合法
animals.Add(new Cat()); // 因为 animals 是 IList<Animal>，添加 Cat 从它的角度看是合法的。

// 但 animals 实际上指向的是一个 List<Dog> dogs!
// 现在，我们试图把一只 Cat 放进一个 Dog 的列表里！这会导致类型不安全，运行时可能会崩溃。
```
因此，对于像`IList<T>`这样同时进行输入和输出的类型，C#强制其不变，以保障类型安全

#### 重要规则
1. 仅限接口和委托：方差（`in`/ `out`修饰符）只能用于接口和委托的泛型参数，不能用于类和结构体
2. 类型安全是前提：C#的方差系统是在编译时和CLR层面严格检查的，其根本目的是提供灵活性的同时，100%保证安全

> 方差本质上就是让泛型类型系统具备类似“继承”的能力，从而解决泛型代码的复用问题

## 底层实现
### 编译阶段
当写下
```cs
class Box<T> { public T Value; }
```
编译器不会生成多个类型副本\
它只在元数据（metadata）中生成一个定义模板
```il
.class public auto ansi beforefieldinit Box`1<T> // `1表示有一个泛型参数
        extends [System.Runtime]System.Object
{
    .field public !0 Value
}
```
编译器生成的是“开放泛型类型定义（open generic type definition），这是一种模板。真正的类型要到运行时才“实例化”（instantiation）

### CLR类型系统中的泛型机制
.NET的CLR实现了真正的泛型（reified generics），这和Java的类型擦除机制不同。\
这意味着：
- 泛型参数在运行时仍然存在
- 可以用反射拿到真实参数（`typeof(List<int>).GetGenericArguments()`）
- 值类型不会被装箱成`object`

CLR中两种泛型类型
1. 开放泛型（open generic）：像`List<T>`、`Dictionary<Tkey, TValue>` 还没绑定具体类型
2. 封闭泛型（closed generic）：比如`List<int>`、`List<string>` 类型参数已被具体化

运行时首次遇到`List<int>`时，会“构造”出一个新的类型实例
```cs
System.Collections.Generic.List<Int32>
```
CLR把这当成一个真正的新类型，有独立的元数据和方法表（vtable）

### JIT编译
当CLR JIT编译泛型方法或类时，它会根据类型参数决定是“复用”还是“重新生成代码”

| 类型参数 | JIT行为 | 原因 |
| - | - | - |
| 引用类型 | 共享代码（code sharing）| 所有引用类型的IL/JIT实现一样，只操作引用 |
| 值类型 | 特化代码（code specialization）| 值类型大小和布局不同，不能共享 |

```cs
List<int> a = new();
List<string> b = new();
```
- 对`List<string>`和`List<object>`：JIT只生成一份机器码
- 对`List<int>`：JIT生成一份新的专用代码，直接操作`int`（无装箱）

这就是泛型性能强大的原因

### 元数据与类型句柄（TypeHandle）
每个封闭泛型类型在运行时都有唯一的RuntimeTypeHandle\
这意味着CLR知道`List<int>`和`List<string>`是不同的\
这种机制确保了
- 类型安全：JIT编译器知道确切的类型布局
- 反射友好：`typeof(List<int>) != typeof(List<string>)`
- 性能高：值类型直接在栈上操作

### IL层观察
```cs
static void Main()
{
    var list = new List<int>();
    list.Add(42);
}
```
反编译IL
```il
IL_0000: newobj instance void class [System.Collections]System.Collections.Generic.List`1<int32>::.ctor()
IL_0005: ldc.i4.s 42
IL_0007: callvirt instance void class [System.Collections]System.Collections.Generic.List`1<int32>::Add(!0)
```
注意`!0`————它代表第一个泛型参数`T`\
CLR看到`List<int>`时，会将`!0`替换成实际类型`int32`，在生成的机器码中直接操作32位整数

### 值类型与装箱对比实验
```cs
List<int> list1 = new List<int>();
List<object> list2 = new List<object>();

list1.Add(123); // 无装箱
list2.Add(123); // 发生装箱
```
原因：
- `List<int>`直接操作`int`内存
- `List<object>`要把`123`装箱成`System.Int32`对象引用

所以泛型的好处：避免频繁的堆分配与GC压力

### 运行时缓存机制（Type Instantiation Cache）
CLR内部有一张“泛型实例化缓存表”
- 当第一次构造`List<int>`时，CLR会生成新的类型句柄并缓存
- 下次再用相同类型参数，就直接复用

这部分逻辑在`MethodTableBuilder`与`Generics::CreateTypeInstantiation`内部完成（CLR源码可查）

### 协变与逆变的运行时原理（接口/委托）
协变（out）和逆变（in）只在编译器和运行时的类型检查层有效\
CLR在方法签名元数据中标记这些参数的方差属性\
运行时验证时允许安全的替换（如`IEnumerable<string>` -> `IEnumerable<object>`）\
但在方法表布局上仍是独立类型，没有动态类型转换

### 泛型静态成员隔离机制
每个封闭泛型类型都有独立的静态字段副本
```cs
class Counter<T> { public static int Count; }

Counter<int>.Count = 1;
Counter<string>.Count = 2;
Console.WriteLine(Counter<int>.Count); // 1
```
CLR在创建封闭类型时，独立分配静态区块\
底层就是每个RuntimeTypeHandle拥有独立静态存储区

## `Activator.CreateInstance<T>()`与`new()`约束
### `new()`约束机制与特点
语法
```cs
public class Factory<T> where T : new()
{
    public T Create() => new T();
}
```
编译层面：
- `where T : new()`告诉编译器：类型参数T必须有一个public的无参构造函数
- 编译器因此允许你写`new T()`
否则这行代码连编译都过不了
> 注意：没有`new()`约束，写`new T()`会报错：
> CS0304: Cannot create an instance of the variable type 'T' because it does not have the new() constraint

运行时层面：\
`new T()`是内联构造，编译器会在IL中直接生成
```il
newobj instance void !0::.ctor()
```
JIT时，这会被特化成对T的构造函数直接调用，没有任何反射

性能层面：\
`new T()`和直接`new MyClass()`一样快，没有额外开销

### `Activator.CreateInstance<T>()`
基本用法：
```cs
T obj = Activator.CreateInstance<T>()
```
机制：
- 由System.Activator类提供，内部使用反射
- 它通过运行时的类型信息（`typeof(T)`）找到对应的构造函数并调用
- 不要求`T`有`new()`约束，编译器不会限制

IL表现：
```il
call !!0 [System.Private.CoreLib]System.Activator::CreateInstance<!!0>()
```
这其实是泛型方法调用，内部最终会调用
```cs
Acticator.CreateInstance(Type type)
```
这个方法执行时走的是反射路径
1. 查询类型句柄（TypeHandle）
2. 取构造函数信息
3. 通过`RuntimeMethodHandle.InvokeMethod()`调用

性能层面：\
因为走了反射，速度大约是`new()`的20~50倍慢（取决于JIT优化与类型缓存）\
不过`Activator.CreateInstance<T>()`比`Activator.CreateInstance(Type)`稍快一点，因为它缓存了泛型参数信息

### 使用场景
1. 业务逻辑工厂（推荐`new()`）
```cs
public class ObjectPool<T> where T : new()
{
    private readonly Stack<T> _pool = new();

    public T Get() => _pool.Count > 0 ? _pool.Pop() : new T();
    public void Release(T item) => _pool.Push(item);
}
```
性能关键场景下，应始终用`new()`约束

2. 动态类型加载（必须用`Activator`）
如果类型在编译时未知，只能运行时从字符串或配置加载
```cs
Type type = Type.GetType("MyNamespace.MyClass, MyAssembly");
object instance = Activator.CreateInstance(type);
```
或者在泛型方法中实例化不满足`new()`的类型
```cs
public T Create<T>()
{
    return (T)Activator.CreateInstance(typeof(T), nonPublic: true);
}
```
例如T的构造函数是`private`或带参数时，这就是唯一办法

3. 结合依赖注入（反射创建 + 缓存）
现代框架（如ASP.NET Core）在底层就是用类似`ActivatorUtilities`的机制，反射创建实例后缓存构造函数委托，提高性能
```cs
var ctor = typeof(T).GetConstructors().First();
var lambda = Expression.Lambda<Func<T>>(Expression.New(ctor)).Compile();
T obj = lambda(); // 比 Activator 快很多
```
这属于“动态生成构造函数委托”的优化版

### 内部机制
```scss
[编译阶段]
   ↓
 new T()  → 编译器检查 new() 约束 → 生成 newobj IL → 直接调用构造函数
   ↓
 Activator.CreateInstance<T>() → 调用反射API → 查找构造函数 → 调用MethodHandle.Invoke
```

### 最佳实践
1. 能用`new()`就绝不要用`Activator`
    - 编译期安全
    - 性能极高
    - 可被JIT优化与内联
2. 仅当类型在编译期未知时才用`Activator`
    - 如插件系统、反射加载模块、序列化框架
3. 避免在循环或性能关键路径中使用`Activaotr`
    - 如果一定要用，创建后缓存委托（`Func<T>`）复用
4. 不要再泛型工具类里随意使用`Activator`代替约束
    - 它会破坏类型安全和调试可预测性

## 运行时类型信息与反射
运行时类型信息（RTTI, Run-Time Type Infomation）是“类型信息存在于运行时”的机制；反射是“利用RTTI在运行时查询或操作类型”的手段

### RTTI
当写下
```cs
object obj = new List<int>();
```
编译器并不知道`obj`实际上是一个`List<int>`，但在运行时，CLR会保存每个对象的“类型描述符”信息，也就是RTTI

在C#中，每个对象在内存中其实带着一个指向它的`TypeHandle`的指针，这个句柄告诉CLR
- 这个对象的类型名
- 它继承自哪个基类
- 它实现了哪些接口
- 它有哪些字段、属性、方法
- 它的泛型参数是什么
- 它的元数据在程序集（Assembly）中的位置

换句话说：每个对象都知道自己是谁

### 反射
反射（Reflection）就是CLR提供的一组API，可以在运行时
- 获取类型信息
- 动态创建实例
- 调用方法
- 访问字段和属性
- 获取自定义特性（Attribute）

```cs
Type t = typeof(List<int>);
Console.WriteLine(t.FullName); // System.Collections.Generic.List`1[System.Int32]
```
`typeof()`、`GetType()`、`Type.GetMethod()`这些都是反射的入口\
再比如动态创建对象
```cs
object list = Activator.CreateInstance(typeof(List<int>));
```
这是反射的常见用途之一：动态加载类，这意味着：
- 可以在不知道类型的情况下实例化它
- 可以从插件或配置文件中加载类型
- 可以实现通用框架、依赖注入容器

### 反射与泛型的结合
C#的泛型是“真实泛型（reified generics）”，也就是说：
- 泛型参数不会在编译时擦除（不像Java的类型擦除机制）
- CLR在运行时能区分`List<int>`和`List<string>`
- 每个封闭类型（closed generic type）都会生成独立的运行时类型描述

所以可以
```cs
Type t1 = typeof(List<int>);
Type t2 = typeof(List<string>);
Console.WriteLine(t1 == t2); // false
```

## 泛型和NULL（nullable reference types）
在C#中，`null`是引用类型（reference type）或可空值类型（nullable value type）的默认值\
而泛型类型参数`T`的行为取决于它被“约束（constraint）”成什么样
```cs
void Foo<T>(T value)
{
    if (value == null) // 可能报错
        Console.WriteLine("Null!");
}
```
上面这段代码编译不通过，因为编译器不知道`T`是引用类型还是值类型\
- 如果`Foo<string>(null)`，没有问题
- 如果`Foo<int>(0)`时，`0`不是`null`

编译器无法保证`value == null`是合法的比较

### 通过约束告诉编译器`T`可以为`null`
C#的约束系统可以明确告诉编译器`T`是哪一类
1. `where T : class`
    - 说明 `T` 必须是引用类型
    - 此时就可以写`if (value == null)`
```cs
void Foo<T>(T value) where T : class
{
    if (value == null) Console.WriteLine("Null!");
}
```

2. `where T : struct`
    - 说明 `T` 必须是值类型
    - 此时 `T` 不可能为`null`
    - 但可以用`Nullable<T>`来允许null值
```cs
void Foo<T>(T? value) where T : struct
{
    if (value == null) Console.WriteLine("Null");
}
```

3. `where T : unmanaged`
    - 说明 `T` 必须是非托管类型（纯值类型，没有引用字段）
    - 同样，不能为null
    - 常用于底层内存操作、指针、Span<T>等结合

### `default<T>`
当不知道 `T` 是值类型还是引用类时，不能直接写`null`，但可以写
```cs
T value = default;
```
或者
```cs
T value = default(T);
```
这在泛型里是万能解法，编译器会根据类型自动选择默认值\
`default(T)`在泛型中就像一把“万能钥匙”，无论T是什么类型，都能安全获得“空值”或“默认初始状态”

### 可空值类型
当希望值类型也能用`null`时
```cs
int? x = null;
Nullable<int> = default;
```
`Nullable<T>`是一个特殊的泛型结构体，定义大致是这样的
```cs
public struct Nullable<T> where T : struct
{
    private bool hasValue;
    private T value;
}
```
这让`int?`, `bool?`, `float?`等拥有了“null状态”，编译器对`?.`, `??`, `== null`等操作都内置了特殊支持

### 可空引用类型
从C#8.0起，语言引入了一个语义层的“null检查系统”
- `string`表示非空
- `string?`表示可空
- 这样并不会改变运行时行为，但能让编译器在静态分析时警告潜在的`NullReferenceException`

所以在泛型中，如果启用了可空上下文
```cs
void Foo<T>(T? value)
```
就意味着在声明：`value`可以是null————不管`T`是值类型还是引用类型

## 泛型静态成员
```cs
class Generic<T>
{
    public static int Count;
}

Generic<int>.Count = 10;
Generic<string>.Count = 20;

Console.WriteLine(Generic<int>.Count); // 10
Console.WriteLine(Generic<string>.Count); // 20
```
虽然它们是“同一个泛型类”，但不同的`T`会生成不同的静态副本\
也就是说
> 对于每个封闭泛型类型（如`Generic<int>`、`Generic<string>`），CLR都会为它生成独立的静态数据区

C#的泛型是真实泛型，这意味着在CLR层面，每个具体的`Generic<T>`都会被“实例化”成一个独立的运行时类型描述
- `Generic<int>` != `Generic<string>`
- 它们在运行时是两个不同的TypeHandle
- 每个都有自己的静态字段表和类型初始化逻辑

这不是语法糖，而是真实的类型区分
```cs
typeof(Generic<int>) == typeof(Generic<string>) // false
```

### 静态构造函数（`static ctor`）
每个封闭类型在第一次使用时，都会运行自己的静态构造函数
```cs
class Generic<T>
{
    static Generic()
    {
        Console.WriteLine($"Static ctor for {typeof(T)}");
    }
}

new Generic<int>();
new Generic<string>();
```
输出
```cs
Static ctor for System.Int32
Static ctor for System.String
```
可以看到，CLR会为每个封闭类型单独触发一次初始化\
这是非常关键的行为，意味着泛型的静态成员可以安全地缓存类型相关的全局信息，而互不干扰

### 利用这一特性：类型级缓存器
这个特性被许多框架、序列化器、ORM用来做“类型级缓存器”
```cs
class TypeCache<T>
{
    public static readonly string TypeName = typeof(T).FullName;

    static TypeCache()
    {
        Console.WriteLine($"Cache built for {TypeName}");
    }
}

// 初始化多个类型
var a = TypeCache<int>.TypeName;
var b = TypeCache<string>.TypeName;
```
输出
```cs
Cache built for System.Int32
Cache built for System.String
```
这种设计可以让每个类型都有自己的缓存，而不用用字典去手动区分类型，性能极高，而且线程安全\
这在诸如：
- JSON序列化器（如Newtonsoft.Json）
- ORM（如Dapper、EF Core）
- 反射缓存框架

中都是非常经典的优化模式

### 泛型静态成员的JIT编译逻辑
当JIT编译器遇到一个泛型类型时，它的行为是这样的
- 对于引用类型参数（class），多个封闭类型可能共享一份代码
- 对于值类型参数（struct），每个类型参数都会生成新的机器码
- 但无论共享代码与否，静态字段总是独立的

共享JIT代码 != 共享静态数据

## 陷阱与建议
1. 不要把泛型当万能替代：类型安全没了约束时仍会出错。合理加`where`约束
2. 方差只在接口/委托上：尝试对`List<T>`使用`out`/`in`时不可能的
3. 注意装箱：如果把泛型值类型赋给非泛型接口/`object`就会装箱。尽量使用泛型接口
4. 过度复杂的泛型层次会降低可读性：泛型设计要平衡灵活性与易用性
5. `new()`约束：若仅为创建实例就加`new()`，考虑是否更好地注入工厂以便测试与解耦
6. 不要用反射做泛型的常态逻辑：反射慢、复杂。只在必要时用

---
- 仓储/服务层：用泛型接口 + 具体实现（`IRepository<T>`）能减少重复代码，但要避免把业务逻辑放在无法约束的泛型层
- 工具库：算法和数据结构实现用泛型几乎是必须的（例如泛型堆、泛型树）
- API设计：如果方法接受/返回不同类型但逻辑一致，使用泛型；但若有类型特异行为，别勉强用泛型
- 限制泛型的可视化：写文档和注释，给出常见T应当满足的接口/契约说明