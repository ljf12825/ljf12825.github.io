---
title: Property
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# property
---

属性是提供了对字段的安全访问机制，是面向对象编程中封装性的重要体现

## 定义
属性（Property）是对字段（Field）的封装，提供了受控的访问方式\
简单说：字段是数据，属性是访问字段的接口
- 字段可以直接被外部访问（不安全）
- 属性可以控制读写逻辑（安全、可扩展）

## 基本语法
### 完整的属性写法
```cs
private string _name; // 私有字段

public string Name; // 公有属性
{
    get { return _name; } // 读取访问器
    set { _name = value; } // 写入访问器
}
```
示例
```cs
class Person
{
    private int _age;

    public int Age;
    {
        get { return _age; }
        set 
        {
            if (value >= 0 && value <= 150)
                _age = value;
            else
                throw new ArgumentException("年龄必须在0~150岁之间")
        }
    }
}

Person p = new Person();
p.Age = 25; // 调用set访问器
Console.WriteLine(p.Age); // 调用get访问器
```

### 自动实现属性（Auto-Implemented Property）
C#为了简化代码，允许不用手动写字段
```cs
class Person
{
    public string Name { get; set; } // 自动生成私有字段
}
```
等价于
```cs
private string _name;
public string Name
{
    get { return _name; }
    set { name = value; }
}
```

### 只读、只写
- 只读属性
```cs
public string Name { get; } // 外部只能读
```
- 只写属性
```cs
private int _age;
public int Age { set { age = value; } } // 外部只能写
```

### 属性中的逻辑控制
属性不仅是字段访问的包装，它还可以嵌入逻辑
```cs
private int _age;
public int Age
{
    get { return age; }
    set 
    {
        if (value < 0)
            throw new ArgumentException("年龄不能为负数");
        age = value;
    }
}
```
优点：
- 可以做验证
- 可以触发事件
- 可以延迟计算（懒加载）

### 表达式体属性（Expression-Bodied Property）
C# 6+ 提供了简化写法
```cs
public string FullName => FirstName + " " + LastName; // 只读属性
public int Age { get => _age; set => age = value; } // 读写属性
```

### 静态属性
属性也可以是静态的
```cs
class Counter
{
    private static int _count;
    public static int Count
    {
        get { return count; }
        set { count = value; }
    }
}
```

### 属性 vs 方法
- 访问语义：`obj.Prop`更像字段访问，而`obj.Method()`是调用方法
- 属性适合快速获取、可能有简单逻辑的值
- 方法适合复杂计算、可能消耗性能的操作

错误示例
```cs
public int ComputeValue { get { return ExpensiveCalculation(); } }
```
这是应使用方法而不是属性，否则会误导使用者以为是简单读取

### 索引器（Indexer）
可以像访问数组一样访问对象
```cs
class MyList
{
    private int[] _data = new int[100];
    public int this[int index]
    {
        get { return data[index]; }
        set { data[index] = value; }
    }
}
```

### init访问器
C# 9+ 支持，只允许初始化时设置属性的值；用来增强“不可变对象（immutable object）”的设计能力
```cs
class Person
{
    public string Name { get; init; }
    public int Age { get; init; }
}
```
使用
```cs
var p = new Person
{
    Name = "Alice",
    Age = 25
};

// p.Age = 30; // 编译错误：只能在对象初始化时赋值
```

#### 与`record`的完美结合
C# 9 引入的`record`类型天生和`init`绑定，用于不可变数据模型
```cs
public record Player
{
    public string Name { get; init; }
    public int Level { get; init; }
}
```
或缩写
```cs
public record Player(string Name, int Level);
```
使用
```cs
var p1 = new Player("Alice", 10);
var p2 = p1 with { Level = 20 }; // 复制修改
```

#### `init`的实现机制（底层原理）
- `init`本质上时一个`set`，但带有`initonly`修饰符
- 编译器限制：只能在构造函数或对象初始化器中调用它

用反编译工具（如ILSpy）看，会看到它生成的`set`方法带`[IsExternalInit]`属性

### 抽象属性
抽象类可以拥有抽象属性，这些属性应在派生类中被实现
```cs
public abstract class Person
{
    public abstract string Name { get; set; }
    public abstract int Age { get; set; }
}

class Student : Person
{
    public string Code { get; set; } = "N.A"; // 默认值 C# 6.0+ 支持
    public override string Name { get; set; } = "N.A";
    public override int Age { get; set; } = 0;
}
```

### 访问修饰符
可以给get和set分别设置访问级别
```cs
public class BankAccount
{
    private decimal _balance;

    public decimal Balance
    {
        get { return _balance; }
        private set { _balance = value; } // 只能在类内部修改
    }

    public BankAccount(string accountNumber, decimal initialBalance)
    {
        AccountNumber = accountNumber;
        Balance = initialBalance;
    }

    public void Deposit(decimal amount)
    {
        if (amount > 0)
            Balance += amount; // 类内部可以修改
    }
}
```

### 计算属性 vs 缓存属性
计算属性（每次访问都计算）
```cs
public class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }

    public double Area => Width * Height; // 每次访问都计算
}
```
缓存属性（计算一次并缓存）
```cs
public class Rectangle
{
    private double? _area;
    private double _width;
    private double _height;

    public double Width
    {
        get => _width;
        set 
        {
            _width = value;
            _area = null; // 宽度改变时清除缓存
        }
    }

    public double Height
    {
        get => _height;
        set
        {
            _height = value;
            _area = null; // 高度改变时清除缓存
        }
    }

    public duoble Area
    {
        get
        {
            if (_area == null)
                _area = Width * Height;
            return _area.Value;
        }
    }
}
```

## `value`
`value`是C#属性和索引器中的一个隐式关键字\
在属性的`set`或`init`访问器中，`value`表示“外部赋进来的值”
```cs
private int age;

public int Age
{
    get { return age; }
    set { age = value; }
}
```
当你写
```cs
person.Age = 20;
```
实际上编译器会做
```cs
person.set_Age(20);
```
此时`value = 20`\
`set`块里的`value`就是调用者赋给属性的那个值

### `value`是隐式的参数
在编译器层面，属性的`set`被视作一个带一个参数的函数
```cs
void set_Age(int value) => age = value;
```
你不能声明它，也不能修改它的名字，`value`是一个固定的、隐式存在的形参

### 实际用途示例
用来做验证
```cs
private int age;

public int Age
{
    get { return age; }
    set
    {
        if (value < 0)
            throw new ArgumentException("年龄不能为负数");
        age = value;
    }
}
```
这里的`value`就是外部传进来的值

用来做转换
```cs
private string name;

public string Name
{
    get => name;
    set => name = value.Trim(); // 自动去掉空格
}
```

在`init`中同样存在
```cs
public string Name { get; init; } = "Default";
```
如果改成显式写法
```cs
private string _name;
public string Name
{
    get => _name;
    init => _name = value; // 仍然用 value
}
```

### 索引器中的`value`
在索引器(indexer)中`value`同样出现
```cs
class MyList
{
    private int[] data = new int[10];

    public int this[int index]
    {
        get => data[index];
        set => data[index] = value; // 外部传来的赋值内容
    }
}
```
调用
```cs
list[3] = 42; // => 调用 set 索引器，value = 42
```

### 注意事项
- `value`只能在`set`或`init`块中使用
- `get`中使用会编译错误
- 在表达式体属性中，仍然可以使用
```cs
set => field = value;
```
- 不能改名，也不能声明自己的`value`变量

### IL机制
如果反编译
```cs
public int Age { get; set; }
```
可以看到两个方法
```cs
public int get_Age() { ... }
public void set_Age(int value) { ... }
```
也就是说
- `get` -> 无参数方法，返回字段
- `set` -> 带一个参数（就是`value`）

这就是C#的属性语法糖的底层实现