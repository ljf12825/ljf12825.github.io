---
title: Event
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: blog
summary: C# event
---

事件是C#和.NET框架中实现**发布-订阅**模式的核心机制。它允许一个对象（发布者）在特定事情发生时，通知其他多个对象（订阅者）。这种设计实现了对象之间的松耦合，发布者不需要知道谁订阅了它，也不需要知道订阅者将如何处理通知

## 核心概念
- 发布者：拥有事件的对象。当某个条件满足或某个动作发生时，它负责触发事件。也称为"Sender"或"Event Source"
- 订阅者：对事件感兴趣的对象。它包含一个方法，当事件被触发时，这个方法会被调用。它负责订阅和取消订阅事件。也称为"Receiver"或"Event Handler"

## 事件的五个组成部分
1. 委托：事件的**契约**或**蓝图**。它定义了订阅者的事件处理方法必须具有的签名（返回值类型和参数列表）
2. 事件：使用`event`关键字声明的对象，它是委托的一个封装后的、安全的“包装器”
3. 事件数据：一个从`EventArgs`派生的类，用于在触发事件时向订阅者传递相关信息
4. 事件触发者：发布者类中负责调用事件（即调用封装在事件内的委托）的代码
5. 事件处理器：订阅者类中符合委托签名的方法，用于响应事件

## 声明和使用事件的完整步骤
以“按钮点击”为例
1. 定义事件数据类
通常继承自`EventArgs`。如果不需要传递额外数据，可以直接使用`EventArgs.Empty`
```cs 
// 自定义事件数据类，用于传递点击发生的时间
public class ButtonClickedEventArgs : EvnetArgs
{
    public DateTime ClickedTime { get; }

    public ButtonClickedEventArgs(DateTime time) => ClickedTime = time;
}
```
2. 定义委托
.NET提供了一个通用的委托类型`EventHandler<TEventArgs>`，在大多数情况下不需要自定义委托
```cs
// 过去可能需要这样定义委托
// public delegate void ButtonClickEventHandler(object sender, ButtonClickedEventArgs e);

// 现在，直接使用 EvnetHandler<T>即可
// 它的签名是：void (object sender, TEventArgs e)
```
3. 在发布者类中声明事件
使用`event`关键字，后跟委托类型和事件名称
```cs
// 发布者
public class Button
{
    // 1. 声明事件
    public event EventHandler<ButtonClickedEventArgs> Clicked;

    // 一个模拟按钮被按下去的方法
    public void SimulateClick()
    {
        Console.WriteLine("按钮被按下了...");
        OnClicked(new ButtonClickedEventArgs(DateTime.Now));
    }

    // 2. 定义触发事件的方法（约定以 On 开头）
    // 使用 virtual 关键字允许子类重写触发逻辑
    protected virtual void OnClicked(ButtonClickedEventArgs e)
    {
        // 临时将事件赋值给一个局部变量，防止竞态条件（在检查null后，另一个线程取消订阅）
        // EventHandler<ButtonClickedEventArgs> handler = Clicked;

        // 检查是否有订阅者
        // if (handler != null)
        // {
        //     // 触发事件！‘this’是发送者（发布者自己），e是事件数据
        //     handler(this, e);
        // }

        // 在C# 6.0 及以后，可以使用更简洁的Null条件操作符
        Clicked?.Invoke(this, e);
    }
}
```
- `OnClicked`方法是触发事件的推荐方式。它封装了触发逻辑，使代码更清晰、更安全
- 使用`?.Invoke()`或局部变量是为了线程安全，确保在检查null和调用之间，事件不会被设置为null

4. 在订阅者类中创建事件处理器并订阅
事件处理器就是一个与委托签名匹配的方法
```cs
// 订阅者
public class UserInterface
{
    public UserInterface(Button button)
    {
        // 订阅事件：使用+=操作符
        button.Clicked += OnButtonClicked;

        // 也可以使用 Lambda 表达式
        // button.Clicked += (sender, e) => Console.WriteLine($"Lambda: 按钮在 {e.ClickedTime}被点击了");
    }

    // 事件处理器方法
    private void OnButtonClicked(object sender, ButtonClickedEventArgs e)
    {
        // 可以获取是哪个按钮触发的
        // Button button = sender as Button; 
        Console.WriteLine($"用户界面收到通知：按钮在{e.ClickedTime}被点击了。");
        // 这里可以更新UI，比如改变按钮颜色、弹出对话框等
    }

    // 一个用于取消订阅的方法
    public void UnsubscribeFromButton(Button button)
    {
        button.Clicked -= OnButtonClicked;
    }
}
```

5. 运行程序
```cs
class Program
{
    static void Main(string[] args)
    {
        // 1. 创建发布者
        Button myButton = new Button();

        // 2. 创建订阅者，并订阅事件
        UserInterface ui = new UserInterface(myButton);

        // 3. 模拟事件发生
        myButton.SimulateClick();

        // 4. 取消订阅（如果需要）
        // ui.UnsubscribeFromButton(myButton);

        Console.ReadKey();
    }
}
```
输出
```text
按钮被按下了...
用户界面收到通知：按钮在 YYYY-mm-dd HH:MM:SS 被点击了
```

## `EventHandler`
`EventHandler`是.NET框架中预定义的一个委托类型，专门用于表示不携带自定义数据的事件处理方法\
它定义在`System`命名空间中
```cs
public delegate void EventHandler(object sender, EventArgs e);
```
- 返回类型：`void`-事件处理器不返回值
- 第一个参数：`object sender`-触发事件的对象的引用
- 第二个参数：`EventArgs e`-事件数据，通常使用`EventArgs.Empty`

### 存在意义：统一的事件模式
在早期.NET中，如果没有标准化委托，每个事件都需要自定义委托
```cs
// 不统一的做法-每个事件都有自己的委托
public delegate void ClickHandler(object sender);
public delegate void LoadHandler(object sender, string message);
public delegate void CloseHandler();

public event ClickHandler Clicked;
public event LoadHandler Loaded;
public event CloseHandler Closed;
```
这导致了：
- 不一致的签名
- 难以记忆的参数
- 代码重复

`EventHandler`引入了统一的标准
```cs
// 统一的做法 - 所有事件都使用 EventHandler
public event EventHandler Clicked;
public event EventHandler Loaded;
public event EventHandler Closed;
```

### 基本用法
声明事件
```cs
public class Button
{
    // 声明使用 EventHandler 委托的事件
    public event EventHandler Clicked;

    public void SimulateClick()
    {
        Console.WriteLine("按钮被点击...");
        OnClicked();
    }

    protected virtual void OnClicked()
    {
        // 触发事件，使用 EventArgs.Empty 表示没有额外数据
        Clicked?.Invoke(this, EventArgs.Empty);
    }
}
```
订阅和处理事件
```cs
public class UserInterface
{
    public UserInterface(Button button)
    {
        // 订阅事件
        button.Clicked += OnButtonClicked;

        // 或者使用 Lambda表达式
        button.Clicked += (sender, e) =>
        {
            Console.WriteLine("Lambda：按钮被点击了！");
        };
    }

    // 事件处理方法 - 必须匹配 EventHandler 签名
    private void OnButtonClicked(object sender, EventArgs e)
    {
        Console.WriteLine("收到按钮点击事件");

        // 可以通过 sender 参数知道哪个对象触发的事件
        Button clickedButton = sender as Button;
        if (clickedButton != null)
        {
            Console.WriteLine($"触发者：{clickedButton.GetType().Name}");
        }
    }
}
```
使用
```cs
class Program
{
    static void Main()
    {
        var button = new Button();
        var ui = new UserInterface(button);

        button.SimulateClicked();
    }
}
```

### `EventHandler` vs `EventHandler<T>`

| 特性 | `EventHandler` | `EventHandler<TEventArgs>` |
| - | - | - |
| 定义 | `delegate void EventHandler(object sender, EventArgs e)` | `delegate void EventHandler<T>(object sender, T e)` |
| 数据传递 | 只能使用`EventArgs.Empty` | 可以传递自定义事件数据 |
| 使用场景 | 不需要额外数据的事件 | 需要传递数据的事件 |
| 示例 | `event EventHandler Clicked` | `event EventHandler<MouseEventArgs> MouseClick` |

- 使用`EventHandler`：事件本身的发生就是唯一信息
```cs
public event EventHandler Initialized; // 初始化完成
public event EventHandler Shutdown; // 关闭
public event EventHandler StatusChanged; // 状态改变
```
- 使用`EventHandler<T>`：需要传递具体数据
```cs
public event EventHandler<PriceChangedEventArgs> PriceChanged; // 价格变化
public event EventHandler<ErrorEventArgs> ErrorOccurred; // 错误发生
public event EventHandler<ProgressEventArgs> ProgressUpdated; // 进度更新
```

## `EventArgs`
`EventArgs`是.NET类库中的一个类，位于`System`命名空间。它的核心作用是作为所有事件数据类的基类
```cs
// 在.NET中的定义（简化）
public class EventArgs
{
    public static readonly EventArgs Empty;
    public EventArgs();
}
```
它本身不包含任何数据。它主要提供两种用途
1. 作为一个标记：表示这是一个用于事件参数的类型
2. 作为基类：可以派生出自定义的事件数据类

### 存在意义
在没有`EventArgs`的情况下，如果想通过事件传递数据，可能会这样定义委托和事件
```cs
// 不推荐的做法：为每种数据都定义不同的委托
public delegate void ClickEventHandler(int x, int y, string buttonName);
public event ClickEventHandler Clicked;
```
这种做法的问题：
- 缺乏统一性：每个事件的数据签名都不同，订阅者需要记住各种不同的参数顺序和类型
- 扩展性差：如果未来需要传递新的数据（比如时间戳），就必须改变委托签名，这会破坏所有现有的订阅者代码

`EventArgs`通过引入一个标准化的、可扩展的容器来解决这些问题

### 使用场景
#### 1. 不需要传递任何数据
当事件本身的发生就是唯一的信息时（例如，“任务完成”、“状态重置”），可以使用`EventArgs.Empty`。这是一个静态只读字段，表示一个空的、不包含任何数据的事件参数实例
```cs
public class Timer
{
    // 使用 EventHandler 而不是 EventHandler<T>，因为不需要自定义数据
    public event EventHandler Tick;

    protected virtual void OnTick()
    {
        // 使用 EventArgs.Empty
        Tick?.Invoke(this, EventArgs.Empty)
    }
}

// 订阅
timer.Tick += (sender, e) =>
{
    // 这里的e就是EventArgs.Empty
    Console.WriteLine("Tick! 无需任何额外数据");
}
```

#### 2. 需要传递自定义数据
这是`EventArgs`最主要的使用场景。需要创建一个继承自`EventArgs`的类
```cs
// 自定义事件数据类
public class PriceChangedEventArgs : EventArgs
{
    // 通常属性是只读的，以保证在事件处理过程中的数据一致性
    public decimal OldPrice { get; }
    public decimal NewPrice { get; }

    public PriceChangedEventArgs(decimal oldPrice, decimal newPrice)
    {
        OldPrice = oldPrice;
        NewPrice = newPrice;
    }
}

// 在发布者类中使用
public class Stock
{
    private decimal _price;

    // 声明使用自定义 EventArgs 的事件
    public event EventHandler<PriceChangedEventArgs> PriceChanged;

    public decimal Price
    {
        get => _price;
        set
        {
            if (_price == value) return; // 价格未变，直接返回

            decimal oldPrice = _price;
            _price = value;

            // 价格变化时，触发事件并传递旧价格和新价格
            OnPriceChanged(new PriceChangedEventArgs(oldPrice, _price));
        }
    }

    protected virtual void OnPriceChanged(PriceChangedEventArgs e)
    {
        PriceChanged?.Invoke(this, e);
    }
}

// 订阅者
var stock = new Stock();
stock.PriceChanged += (sender, e) => 
{
    Console.WriteLine($"价格从 {e.OldPrice:C} 变为 {e.NewPrice:C}"); // e 是 PriceChangedEventArgs 类型
    // 可以根据新旧价格做出不同反应，例如：
    if (e.NewPrice > e.OldPrice)
    {
        Console.WriteLine("股票上涨了！");
    }
};
```

### 设计EventArgs类的最佳实践
1. 命名：类名应以`EventArgs`结尾，例如`MouseEventArgs`, `KeyPressEventArgs`
2. 不可变性：事件数据对象在创建后不应该被修改。因此，通常：
    - 通过构造函数来初始化所有数据
    - 只提供只读属性（只有`get`访问器）来暴露数据
```cs
public class MailReceivedEventArgs : EventArgs
{
    public string From { get; }
    public string Subject { get; }

    public MailReceivedEventArgs(string from, string subject)
    {
        From = from;
        Subject = subject;
    }
}
```
- 这确保了所有订阅者接收到的是同一时刻、同一状态的数据，避免了在事件处理过程中数据意外被修改的风险

3. 继承自 EventArgs：始终从`EventArgs`派生，这是.NET的通用约定
4. 包含相关信息：只包含订阅者处理该事件时真正需要的数据。不要传递整个发布者对象，而是通过`sender`参数来访问发布者

## `sender`参数
在事件处理器中，除了`EventArgs e`，还有一个`object sender`参数。它是对触发事件的发布者对象的引用
```cs
stock.PriceChanged += (sender, e) =>
{
    // 可以将 sender 转换回具体的类型，以访问其成员
    Stock stockWhichChanged = sender as Stock;
    if (stockWhichChanged != null)
    {
        Console.WriteLine($"当前股票价格是：{stockWhichChanged.Price}");
    }
    
    // 同时使用 sender 和 e
    Console.WriteLine($"变化详情：{e.OldPrice} -> {e.NewPrice}");
};
```
使用建议：
- 优先使用`e`来获取数据，因为它就是为此目的设计的
- 只有当事件数据`e`中没有包含需要的、属于发布者的其他信息时，才使用`sender`并对其进行类型转换

## `?.Invoke()`
`?.Invoke()`主要用于安全地调用委托和事件，它实际上是两个操作的组合：
- `?.`：Null条件操作符（Null-conditional operator），也叫Elvis操作符
- `.Invoke()`：委托的调用方法

组合在一起，它的作用是：如果左边的对象不为null，就调用其Invoke方法；如果为null，就什么都不做，返回null

### 存在意义
**传统方式的问题**\
在C# 6.0 引入`?.`操作符之前，这样触发事件
```cs
public class Button
{
    public event EventHandler Clicked;

    protected virtual void OnClicked()
    {
        // 传统方式 - 存在竞态条件风险
        if (Clicked != null)
        {
            Clicked(this, EventArgs.Empty);
        }
    }
}
```
问题：在多线程环境下，可能存在竞态条件
1. 线程A检查`Clicked != null` -> 结果为 true
2. 线程B取消了事件订阅，设置`Clicked = null`
3. 线程A执行`Clicked(this, EventArgs.Empty)` -> 抛出`NullReferenceException`

**解决方案1：使用局部变量（C# 6.0之前）**
```cs
protected virtual void OnClicked()
{
    // 将委托复制到局部变量
    EventHandler handler = Clicked;
    if (handler != null)
    {
        handler(this, EventArgs.Empty);
    }
}
```
原理：委托是不可变的，`+=`和`-=`操作实际上回创建新的委托实例。将事件复制到局部变量后，即使其他线程修改了原始事件，局部变量仍然指向原来的委托链

**解决方案2：使用`?.Invoke()`（C# 6.0+）**
```cs
protected virtual void OnClicked()
{
    // 现代方式 - 线程安全且简洁
    Clicked?.Invoke(this, EventArgs.Empty);
}
```
这行代码等价于
```cs
var handler = Clicked;
if (handler != null)
{
    handler.Invoke(this, EventArgs.Empty);
}
```

### 工作原理
```cs
// 这行代码：
Clicked?.Invoke(this, EvnetArgs.Empty);

// 实际上被编译器转换为
var temp = Clicked;
if (temp != null)
{
    temp.Invoke(this, EventArgs.Empty);
}
```
关键点：
1. 线程安全：先将事件引用复制到临时变量
2. 空值检查：检查临时变量是否为null
3. 安全调用：只有不为null时才调用Invoke

## 为什么使用事件而不是简单的委托
事件本质上是委托的安全封装
- 封装性
  - 委托（public）：订阅者可以使用`=`操作符，这会覆盖掉之前所有的订阅
  - 事件（public）：订阅者只能使用`+=`和`-=`来添加或移除自己的处理器，无法覆盖其他人的订阅，也无法直接触发事件。事件在类外部只能出现在`+=`和`-=`左边

示例对比
```cs
public class PublisherWithDelegate
{
    public Action PublicDelegate; // 公共委托
    public event Action PublicEvent; // 公共事件

    public void Test()
    {
        // 在类内部，两者都可以调用
        PublicDelegate?.Invoke();
        PublicEvent?.Invoke();
    }
}

// 在另一个类中
var pub = new PublisherWithDelegate()

// 委托的危险操作
pub.PublicDelegate = () => Console.WriteLine("Handler 1"); // 直接赋值，清空其他订阅
pub.PublicDelegate += () => Console.WriteLine("Handler 2");
pub.PublicDelegate(); // 外部可以直接触发！这可能不是我们想要的

// 事件的安全操作
// pub.PublicEvent = ... // 错误！编译不通过，不能直接赋值
pub.PublicEvent += () => Console.WriteLine("EventHandler 1");
pub.PublicEvent += () => Console.WriteLine("EventHandler 2");
// pub.PublicEvent(); // 错误！编译不通过，外部不能触发事件
```

`event`实际上是编译器在委托基础上生成了一组`add`/`remove`访问器
```cs
public event EventHandler Clicked;
// 编译后大致等于
private EventHandler _Clicked;
public void add_Clicked(EventHandler value) => _Clicked += value;
public void remove_Clicked(EventHandler value) => _Clicked -= value;
```

## 现代语法与高级技巧
### Lambda表达式订阅
传统订阅事件时，必须写完整方法
```cs
button.Clicked += OnButtonClicked;

private void OnButtonClicked(object sender, EventArgs e)
{
    Console.WriteLine("按钮被点击");
}
```
现代C#提供Lambda表达式，直接内联事件处理逻辑
```cs
button.Clicked += (_, e) => Console.WriteLine("Lambda: 按钮被点击！");
```
特点：
- `_`表示忽略`sender`参数（C#9.0引入的弃元变量discard）
- 适用于小型、一次性逻辑
- 缺点是无法取消订阅，因为Lambda是匿名的
```cs
button.Clicked -= (_, e) => Console.WriteLine("..."); // ❌ 无法解除，会生成不同的匿名类
```
如果可能需要取消订阅，应保留委托引用
```cs
EventHandler handler = (_, e) => Console.WriteLine("Lambda：按钮被点击！");
button.Clicked += handler;
button.Clicked -= handler; // 可以正确取消
```

### 轻量事件：使用`Action`或`Func`替代标准模式
当在引擎、工具或内部系统中实现简化事件机制时，不一定非要用`EventHandler`\
C#允许使用任意委托类型作为事件
```cs
public event Action<int> HealthChanged; // 比 EventHandler<T> 更轻

protected void OnHealthChanged(int hp)
{
    HealthChanged?.Invoke(hp);
}
```
优点：
- 简洁、高性能（少一层封装）
- 对于频繁触发的小事件（如游戏中帧级回调）更高效

缺点：
- 失去了统一签名（`object sender, EventArgs e`）的兼容性
- 不适合公开API或框架接口，建议仅用于内部模块通信

### 线程安全触发：`?.Invoke()`的底层原理
C# 6 引入的Null条件操作符简化了事件触发
```cs
Clicked?.Invoke(this, EventArgs.Empty);
```
编译器会自动生成线程安全代码
```cs
var temp = Clicked;
if (temp != null)
    temp.Invoke(this, EventArgs.Empty);
```
核心点：
- 委托是不可变对象，`+=`或`-=`实际会创建新的委托实例；
- 将事件复制到局部变量后，即使别的线程取消订阅，也不会影响当前触发
- 因此这是事件触发的推荐写法

### 弱事件（WeakEventManager）
强引用事件的风险：\
订阅者（Subscriber）被发布者（Publisher）强引用，若发布者生命周期更长，则订阅者无法被GC释放，造成内存泄露

**解决方案：弱事件**
```cs
using System.Windows;

WeakEventManager<Button, EventArgs>.AddHandler(button, "Clicked", OnButtonClicked);
WeakEventManager<Button, EventArgs>.RemoveHandler(button, "Clicked", OnButtonClicked);
```
适用场景：
- WPF、MVVM、长期存在的全局事件系统
- 游戏/编辑器中持久对象监听短期对象事件
- 日志、状态广播系统

原理：
- `WeakEventManager`使用弱引用（`WeakReference`）保存订阅者
- 当订阅者被GC回收时，事件会自动移除，不阻止释放
- 代价是触发时略有性能开销

### 反射访问事件（高级元编程）
可以通过反射读取类型中声明的所有事件
```cs
var events = typeof(Button).GetEvents();
foreach (var e in events)
    Console.WriteLine($"事件名：{e.Name}，委托类型：{e.EventHandlerType}");
```
可以用于
- 自动绑定事件（例如UI自动注册）
- 事件系统调试与日志
- 框架级信号分发（如Unity的Editor工具）

不过
- 无法直接通过反射触发事件（因为`event`只公开`add/remove`访问器）
- 若缺失需要触发，可通过`FieldInfo`获取backing field（不推荐，仅限内部框架使用）

### 异步事件：事件 + async/await
事件处理器可以是异步方法
```cs
public event Func<object, EventArgs, Task> DataLoaded;

protected virtual async Task OnDataLoadedAsync()
{
    if (DataLoaded != null)
        await DataLoaded.Invoke(this, EventArgs.Empty);
}
```
这允许订阅者异步执行逻辑（例如网络请求、IO操作）而不阻塞主线程\
但要注意：
- 所有订阅方法都会被await；若其中任何一个耗时，发布者会等待全部完成
- 若想并发执行所有订阅，可用`Task.WhenAll`

## 最佳实践和注意事项
1. 命名约定：
    - 事件名使用PasalCase，如`Clicked`,`ValueChanged`
    - 事件处理器方法名通常为`On`+事件名，如`OnButtonClicked`
    - 触发事件的方法名为`On`+事件名，如`OnClicked`
2. 线程安全：始终使用`?.Invoke()`或局部变量来触发事件，以防止竞态条件
3. 及时取消订阅：如果订阅者的生命周期短于发布者，务必在订阅者销毁前取消订阅（例如在`Dispose`方法中）。否则，发布者会持有对订阅者的引用，导致内存泄露，因为垃圾回收器无法回收仍在被引用的对象
4. 事件数据不可变性：`EventArgs`派生类中的属性应该是只读的，以防止订阅者在事件处理过程中修改数据，影响其他订阅者