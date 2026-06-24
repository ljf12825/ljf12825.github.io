---
title: Delegate
date: 2025-06-01
author: "ljf12825"
type: file
summary: C# delegate
---

委托是类型安全的函数指针——它把方法当作值来传递、存储、组合和调用\
可以把“要做的动作”抽象成一个委托类型，然后把不同的方法绑定到它上面

## 声明与使用
```cs
using System;

public delegate void DelegateTest(int x);

public class FuncLib
{
    public static void Foo(int x) => Console.WriteLine("foo" + x);
    public static void Bar(int x) => Console.WriteLine("bar" + x);

    public void Func1(int x) => Console.WriteLine("func1" + x);
}

class Program
{

    public static void Func_inner(int x) => Console.WriteLine("funcinner" + x);

    static void Main()
    {
        FuncLib funclib = new();
        DelegateTest d = FuncLib.Foo;
        d += FuncLib.Bar;
        d += funclib.Func1;

        d(4);

        DelegateTest dd = x => Console.WriteLine("inner" + x);
        dd(5);
    }
}
```
委托绑定的函数具有以下约束
- 访问修饰符：绑定额方法必须对当前上下文可见
```cs
public class MyClass
{
    private void PrivateMethod(int x) => Console.WriteLine("private");
    protected void ProtectedMethod(int x) => Console.WriteLine("protected");
    internal void InternalMethod(int x) => Console.WriteLine("internal");
    public void PublicMethod(int x) => Console.WriteLine("public");
}

class Program
{
    static void Main()
    {
        MyClass obj = new MyClass();
        DelegateTest d;

        d = obj.PublicMethod; // 可以访问
        d = obj.InternalMethod; // 同程序集可以访问

        // d = obj.PrivateMethod; // 不可访问
        // d = obj.ProtectedMethod; // 不可访问
    }
}
```
- 静态上下文：静态方法中不能直接绑定实例方法
```cs
class Program
{
    private void InstanceMethod(int x) => Console.WriteLine("instance");
    private static void StaticMethod(int x) => Console.WriteLine("static");

    DelegateTest instanceDelegate = InstanceMethod; // 实例字段绑定实例方法
}
```
- 作用域：委托可以绑定局部方法，但会延长其生命周期
```cs
static void Main()
{
    // 局部方法
    void LocalMethod(int x) => Console.WriteLine($"local: {x}");

    DelegateTest d = LocalMethod; // 可以绑定局部方法
    d(5);

    // 注意：委托会延长局部方法的生命周期
    // 即使退出Main方法，LocalMethod也不会被立即回收
}
```
- 对象生命周期：绑定实例方法时，要确保对象实例不会被意外回收
- 封装性：即使通过委托，也不能绕过类的访问控制规则

## 常见内置委托
不用显式声明类型时常用
- `Action<T1,...>`：返回`void`，可以有0~16个参数，适合用在回调函数，事件响应，不关心返回值
```cs
// Action
Action action1 = () => Console.WriteLine("Hello, World!");
action1();

// Action<T>
Action<string> action2 = (name) => Console.WriteLine($"Hello, {name}!");
action2("Alice");

// Action<T1, T2>
Action<string, int> action3 = (name, age) => Console.WriteLine($"{name} is {age} years old");
action3("Bob", 25);

// 多播
Action multiAction = () => Console.WriteLine("First action");
multiAction += () => Console.WriteLine("Second action");
multiAction += () => Console.WriteLine("Third action");
multiAction();
```
- `Func<T1,...,TReturn>`：返回值类型放最后，可以有0~16个参数，适合用在数据转换、计算、延迟计算，组合函数逻辑
```cs
// Func<TReturn>
Func<int> func1 = () => 42;
Console.WriteLine($"Result: {func1()}");

// Func<T, TReturn>
Func<int, string> func2 = (x) => $"Number: {x}";
Console.WriteLine(func2(100));

// Func<T1, T2, TReturn>
Func<int, int, int> func3 = (a, b) => a + b;
Console.WriteLine($"Sum: {func3(5, 3)}");

// 复杂示例：字符串处理
Func<string, string, string> formatName = (firstName, lastName) => $"{lastName}, {firstName}";
Console.WriteLine(formatName("John", "Doe"));

// 多播（只返回最后一个方法的返回值）
Func<int> multiFunc = () => { Console.WriteLine("First"); return 1; };
multiFunc += () => { Console.WriteLine("Second"); return 2; };
int result = multiFunc(); // 输出：First, Second, 返回2
```
- `Predicate<T>`：`Func<T,bool>`的特例，表示“判定”函数
```cs
// Predicate<T>
Predicate<int> isEven = (x) => x % 2 == 0;
Console.WriteLine($"Is 10 even? {isEven(10)}");
Console.WriteLine($"Is 7 even? {isEven(7)}");

// 字符串判断
Predicate<string> isLongEnough = (s) => s.Length >= 5;
Console.WriteLine($"Is 'hello' long enough? {isLongEnough("hello")}");

// 在List中使用Predicate
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 使用Predicate查找所有偶数
List<int> evenNumber = numbers.FindAll(isEven);
Console.WriteLine("Even numbers: " + string.Join(", ", evenNumber));

// 使用匿名方法
Predicate<int> isGreaterThan5 = (x) => x > 5;
List<int> largeNumbers = numbers.FindAll(isGreaterThan5);
Console.WriteLine("Numbers > 5: " + string.Join (", ", largeNumbers));
```
- `Comparison<T>`：比较委托器，常用于排序
```cs
// Comparison
List<string> names = new List<string>
{
    "John", "Alice", "Bob", "Zoe", "Mike"
};

// Comparison<T>
Comparison<string> byLength = (x, y) => x.Length.CompareTo(y.Length);
Comparison<string> alphabetically = (x, y) => string.Compare(x, y);
Comparison<string> byLengthDesc = (x, y) => y.Length.CompareTo(x.Length);

// 按长度排序
names.Sort(byLength);
Console.WriteLine("By length: " + string.Join(", ", names));

// 按字母顺序排序
names.Sort(alphabetically);
Console.WriteLine("Alphabetically: " + string.Join(", ", names));

// 按长度降序排序
names.Sort(byLengthDesc);
Console.WriteLine("By length desc: " + string.Join(", ", names));
```

- `Converter<TInput, TOutput>`：转换器委托，把一个对象转换成另一个对象
```cs
// Converter
List<int> numbers_ = new List<int> { 1, 2, 3, 4, 5 };

// Converter<TInput, TOutput>
Converter<int, string> intToString = (x) => $"Number: {x}";
Converter<int, double> intToDouble = (x) => x * 1.5;

// 转换整个列表
List<string> stringNumbers = numbers_.ConvertAll(intToString);
List<double> doubleNumbers = numbers_.ConvertAll(intToDouble);

// 复杂转换示例
Converter<string, int> parseToInt = (s) =>
{
    if (int.TryParse(s, out int result))
        return result;
    return 0;
};

List<string> stringValues = new List<string> { "10", "20", "abc", "30" };
List<int> parsedNumbers = stringValues.ConvertAll(parseToInt);
Console.WriteLine("Parsed numbers: " + string.Join(", ", parsedNumbers));
```
## 绑定与多播
### 绑定(Binding)
绑定就是将具体的方法与委托实例关联起来的过程
1. 直接绑定单个方法
```cs
void Show(string msg) => Console.WriteLine(msg);

MyDelegate del = Show; // 绑定
del("Hello"); // 调用
```
- 绑定时编译器会检查签名是否匹配
- 实际上这会生成一个委托对象，内部保存着方法的引用（MethodInfo）和目标对象（如果是实例方法）

2. 绑定静态方法
```cs
static void Print(string msg) => Console.WriteLine(msg);

MyDelegate del = Print;
del("Static method");
```
静态方法没有目标对象，委托内部的`Target`字段为`null`

3. 绑定实例方法
```cs
var obj = new Program();
MyDelegate del = obj.Show;
```
实例方法绑定时，委托内部保存着
- 方法指针
- `Target`指向这个`obj`

调用时就像`obj.Show(msg)`一样执行


### 多播（Multicast）
一个委托实例可以绑定多个方法，调用时会按顺序执行所有方法
1. 使用`+`或`+=`
```cs
void A(string msg) => Console.WriteLine("A: " + msg);
void B(string msg) => Console.WriteLine("B: " + msg);

MyDelegate del = A;
del += B; // 多播绑定
del("Hi");
```
输出
```txt
A: Hi
B: Hi
```

2. 使用`-=`取消绑定
```cs
del -= A;
del("Hi again");
```
输出
```txt
B: Hi again
```
多播委托内部维护一个调用列表（Invocation List）\
可以通过
```cs
Delegate[] list = del.GetInvocationList();
```
来查看有哪些函数被绑定\
当执行`del()`时，运行时会按列表顺序依次调用每个目标函数

对于多播委托
- 只有最后一个方法的返回值会被保留
```cs
delegate int Calc();

Calc c = () => 1;
c += () => 2;
int result = c(); // result == 2
```
- 如果中间某个方法抛异常，后续方法不会执行，异常会直接抛出
- 如果委托使用`=`绑定过一个方法，然后用`+=`进行多播绑定，随后再次`=`绑定，则之前的绑定会被覆盖掉
```cs
delegate int Func();

Func f = () => Console.WriteLine(1);
f += () => Console.WriteLine(2);
f = () Console.WriteLine(3);
f(); // 3
```

## 委托的底层
委托在C#中本质上就是一个类\
它并不是“语法糖”或“函数指针”，而是一个真正的类实例————一个封装了“函数入口 + 调用目标”的对象\
但这东西的地位很特殊：
- 它是CLR层面专门支持的类
- 编译器和运行时对它有特殊处理
- 它是C#函数式能力的底层基石（包括事件、Lambda、LINQ都靠它）

### 委托的编译后结构
源代码 vs 编译后代码
```cs
// 源代码
public delegate void MyDelegate(string message);

// 编译后实际上会生成一个完整的类
public class MyDelegate : System.MulticastDelegate
{
    // 构造函数
    public MyDelegate(object target, IntPtr methodPtr); // 构造函数的参数决定其可以接受任意类型，任意类型函数

    // 调用方法
    public virtual void Invoke(string message);

    // 异步调用方法
    public virtual IAsyncResult BeginInvoke(string message, AsyncCallback callback, object state);

    public virtual void EndInvoke(IAsyncResult result);
}
```
这说明
- `delegate`语法其实是一个类型定义器
- 每定义一个委托类型，编译器就生成一个继承自`MulticastDelegate`的密封类
- 委托变量就是这个类的实例
- `Invoke`是真正的调用方法（编译器自动插入调用）

虽然语法上看是`class`，但它不是普通的用户类，而是CLR特殊支持类型\
`Delegate`和`MulticastDelegate`是由运行时（Runtime）内部硬编码逻辑管理的\
也就是说：编译器和CLR一起为委托类型生成了“隐藏的行为”

看起来很普通，但关键在于
- `MyDelegate`的构造函数、`Invoke`、`BeginInvoke`、`EndInvoke`都是由CLR自动充填行为
- 它的构造器能接受任意目标对象和方法指针
- CLR在创建时会验证方法签名与委托签名兼容
- 一旦兼容，就能把这个方法“封装”为一个委托实例

### 构造过程的底层逻辑
当写
```cs
MyDelegate d = new MyDelegate(SomeMethod);
```
编译器其实转成
```cs
d = (MyDelegate)Delegate.CreateDelegate(typeof(MyDelegate), null, methodInfo);
```
而`Delegate.CreateDelegate`的底层逻辑是
1. 检查方法签名是否和`MyDelegate`匹配
2. 拿到该方法的入口地址（`IntPtr methodPtr`）
3. 如果是实例方法，记录目标对象（`target`）
4. 创建一个委托对象
5. 把`_methodPtr`和`_target`写进去
6. 返回一个完整可调用的委托实例

所以每一个委托实例，本质上就是
```text
{
    _target = 对象指针（或null）
    _methodPtr = 方法JIT后入口地址
}
```
只要这个方法签名匹配，CLR就能让它调用起来

这其实跟C++的函数指针没本质区别\
可以这样类比
```cpp
typedef void (*MyDelegate)(int);
```
这个函数指针可以指向任意`void f(int)`的函数，因为签名匹配

C#委托就是它的“安全封装版”
- 增加了类型信息
- 增加了目标对象引用
- 增加了GC跟踪
- 增加了多播支持
- 增加了JIT校验
- 增加了调用时异常安全

> C#委托就是类型安全的函数指针对象

### 委托的内存布局
委托对象的内部结构
```cs
public abstract class Delegate
{
    // 三个核心字段
    private object _target; // 方法所属的对象实例（静态方法时为null）
    private IntPtr _methodPtr; // 方法指针
    private IntPtr _invocationList; // 多播委托的调用列表
}
```
C#的`MulticastDelegate`正是基于`_invocationList`实现多播

实际内存示例
```cs
class Program
{
    public static void StaticMethod(string msg) { }
    public void InstanceMethod(string msg) { }

    static void Main()
    {
        // 单播委托
        MyDelegate del1 = StaticMethod;
        MyDelegate del2 = new Program().InstanceMethod;

        // 内存结构
        // del1: _target = null, _methodPtr = StaticMethod地址
        // del2: _target = Program实例，_methodPtr = InstanceMethod地址
    }
}
```

### 多播委托的底层实现
调用链的存储方式
```cs
static void Main()
{
    MyDelegate multicast = Method1;
    multicast += Method2;
    multicast += Method3;

    // 底层实现
    // multicast._invocationList 指向一个数组
    // [Delegate(Method1), Delegate(Method2), Delegate(Method3)]
}
```
多播委托的调用过程
```cs
// 伪代码展示多播委托的Invoke实现
public void Invoke(string message)
{
    if (_invocationList == null)
    {
        // 单播委托：直接调用
        _methodPtr.Invoke(_target, message);
    }
    else
    {
        // 多播委托：遍历调用列表
        var delegates = (Delegate[])_invocationList;
        foreach (var del in delegates)
        {
            del.Invoke(message);
        }
    }
}
```

### 通过ILDASM查看实际IL代码
源代码
```cs
public delegate void MyDelegate(string msg);

class Program
{
    public static void Method1(string msg) { }
    public static void Method2(string msg) { }

    static void Main()
    {
        MyDelegate del = Method1;
        del += Method2;
        del("test");
    }
}
```
对应的IL代码（简化）
```il
// 委托实例化
IL_0000: ldnull
IL_0001: ldftn void Program::Method1(string)
IL_0007: newobj instance void MyDelegate::.ctor(object, native int)

// 多播委托组合
IL_000c: ldnull  
IL_000d: ldftn void Program::Method2(string)
IL_0013: newobj instance void MyDelegate::.ctor(object, native int)
IL_0018: call class [mscorlib]System.Delegate 
        [mscorlib]System.Delegate::Combine(class [mscorlib]System.Delegate, 
                                          class [mscorlib]System.Delegate)

// 委托调用
IL_001d: ldstr "test"
IL_0022: callvirt instance void MyDelegate::Invoke(string)
```

## 性能与开销
### 委托的本质（性能角度）
委托本质是一个类对象，继承自`System.MulticastDelegate`\
它不是轻量的“函数指针”，而是一个包含以下信息的结构体/对象
```cs
class MulticastDelegate 
{
    object Target; // 实例引用（如果静态方法则为null）
    IntPtr MethodPtr; // 方法指针
    MulticastDelegate Prev; // 用于形成调用链（多播）
}
```
每次写
```cs
Action a = Foo;
```
编译器背后做的是
1. 创建一个新的委托对象
2. 在其中记录目标实例和方法指针

这意味着：
- 创建委托时会分配堆内存
- 调用委托时会简洁调用目标方法

### 创建成本（绑定阶段）

| 场景 | 开销 |
| - | - |
| 绑定静态方法 | 较低（一次分配）|
| 绑定实例方法 | 稍高（需要保存目标引用）|
| 多播（`+=`）| 较高（新建委托链对象）|
| Lambda捕获 | 最高（生成闭包类 + 实例化）|

```cs
Action a = Foo; // 创建一个委托对象
a += Bar; // 实际上创建了一个新的MulticastDelegate
```
每次`+=`都会产生一个新对象，因为`MulticastDelegate`是不可变的

> 因此频繁地`+=`/`-=`会产生GC压力；尤其在事件系统中，建议提前缓存委托对象，不要每帧都新建

### 调用成本（执行阶段）
调用委托的成本主要来自
1. 一次间接跳转（类似虚函数调用）
2. 安全检查与封装开销
3. 多播时的循环遍历

大致性能对比（以Release模式为基准）

| 调用方式 | 相对耗时 | 说明 |
| - | - | - |
| 直接方法调用 | 1x | 基准 |
| 虚函数调用 | ~1.2x | 有一次虚表跳转 |
| 单播委托调用 | ~1.5x | 额外的委托封装层 |
| 多播委托调用（3个目标）| ~3.5x | 逐个调用InvocationList |

> 在现代JIT(RyuJIT)下，单播委托的调用几乎能被内联优化到接近直接调用。但多播或捕获闭包的情况仍然较慢

### 闭包带来的额外成本
```cs
int x = 0;
Action a = () => x++;
```
编译器生成
```cs
class DisplayClass
{
    public int x;
    public void Lambda() { x++; }
}
```
这会带来
- 一次堆分配（DisplayClass）
- 一次委托分配（Action对象）
- 闭包对象会被捕获在堆上，直到lambda不再被引用才释放

> 所以如果在Update、Timer或循环中频繁创建lambda，GC压力会显著上升

优化策略
- 尽量避免在高频逻辑中捕获变量的lambda
- 可将委托缓存为静态字段
- 或使用结构化回调（`struct` + `interface`）代替

### 多播调用链的开销
当有多播委托时
```cs
Action a = Foo;
a += Bar;
a += Baz;
a();
```
执行过程：
1. 获取`InvocationList`
2. 遍历每个目标
3. 逐个调用

这意味着时间复杂度是O(n)\
当n较大时（例如事件订阅几十个监听器），性能会线性下降

### JIT优化与委托内联
现代.NET JIT（RyuJIT、CoreCLR）在以下场景可内联委托
- 单播委托
- 无捕获lambda
- 委托在局部作用域内
- 无需boxing/unboxing

```cs
Action a = Foo;
a(); // JIT可直接内联为 Foo();
```

## 常见陷阱
### 引用捕获陷阱（Lambda闭包）
1. 捕获外部变量的生命周期延长
```cs
List<Action> actions = new List<Action>();
for (int i = 0; i < 3; i++)
{
    actions.Add(() => Console.WriteLine(i));
}
foreach (var a in actions) a();
```
输出
```
3
3
3
```
因为Lambda捕获了变量`i`的引用，而不是当时的值。`i`在循环结束后等于`3`，所以所有委托都输出3\
正确做法：
```cs
for (int i = 0; i < 3; i++)
{
    int copy = i;
    actions.Add(() => Console.WriteLine(copy));
}
```

2. 捕获导致GC无法回收
如果一个委托捕获了外部对象引用（比如`this`或局部变量），即使那个对象已经“理论上”不需要了，委托持有的闭包对象依然会让它存活\
结果：内存泄露

### 事件解绑陷阱
```cs
button.Click += (s, e) => DoSomething();
button.Click -= (s, e) => DoSomething(); // 无效解绑
```
这两个Lambda是不同的实例，所以第二行不会解除绑定\
正确做法
```cs
EventHandler handler = (s, e) => DoSomething();
button.Click += handler;
button.Click -= handler; // 有效解绑
```
陷阱实质
- Lambda每次定义都会生成一个新的委托对象
- 想要解绑，必须持有同一个委托实例

### 性能陷阱
1. 多播委托开销
多播委托（`+=`多个方法）内部是也给调用链表，每次`Invoke()`都会遍历调用
```cs
foreach (var d in invocationList)
    d.DynamicInvoke(args);
```
问题
- 不能短路（每个都调用）
- 每个`Invoke`都有堆栈开销
- 若中间某个委托抛异常，后面的不会执行

> 在高频调用场景（如游戏Update循环）中，多播委托不适合直接使用。可以用事件分发器（如UnityEvent、自定义ActionList）优化

### 异步与委托陷阱
1. 异步捕获上下文
```cs
button.Click += async(s, e) => await.LongTask();
```
如果`LongTask()`抛异常，事件调用者无法感知异常（因为返回的是`void`异步委托）\
推荐
- 避免在事件中直接用`async void`
- 或者在内部手动捕获异常
```cs
button.Click += async (s, e) => {
    try { await LongTask(); }
    catch (Exception ex) { Log(ex); }
}
```

### 静态与实例绑定陷阱
委托可绑定
- 静态方法（无目标）
- 实例方法（有目标`Target`）

在某些情况下，忘记解除绑定的实例方法会持有整个对象的引用，导致
```cs
eventHandler += obj.SomeMethod; // obj无法被回收
```
这会引起对象长期驻留内存，尤其是订阅了全局事件（例如静态事件）\
解决方案：
- 使用弱引用包装（`WeakEventManager`或自定义WeakDelegate）
- 或在对象销毁时手动解绑

### Delegate.Combine/Remove的逻辑陷阱
```cs
Action a = A;
a += B;
a += A;
a -= A;
a();
```
输出
```
B
A
```
因为`-=`只移除最后一次出现的匹配项，要清除所有`A`，必须循环调用`-=`或重新构造链

### 泛型委托的类型匹配陷阱（协变/逆变）
```cs
Func<object> f1 = () => "hello";
Func<string> f2 = f1; // 编译错误（逆变不允许）
```
协变和逆变在`delegate`类型参数上有限制
- `Func<out T>`协变，只能从子类 -> 父类
- `Action<in T>`逆变，只能从父类 -> 子类

理解错会导致委托赋值异常

### Delegate.DynamicInvoke性能坑
使用`DynamicInvoke()`调用委托非常慢（涉及反射调用和装箱拆箱），除非必要，不要再热路径使用\
替代方案：直接调用委托
```cs
delegateInstance(param); // 比DynamicInvoke快几十倍
```
