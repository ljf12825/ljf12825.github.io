---
title: OOP
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# oop
---

C#是强类型，面向对象语言

### 类和对象
- 类是定义对象的模板或蓝图，定义了对象的属性（字段）和行为（方法）
- 对象是类的实例，可以将类看作是抽象的定义，对象则是这个定义的具体实现

### 面向对象特性
- 封装（encapsulation）
封装是将数据（属性）和操作数据的代码（方法）放在一个类的内部，外部代码只能通过类提供的公共方式来访问这些数据。这样可以隐藏实现细节，保护数据的完整性

- 继承（inheritance）
继承允许一个类继承另一个类的属性和方法，使得子类可以重用父类的代码，并且可以扩展或修改父类的功能。继承体现了类与类之间的is-a关系

- 多态（polymorphism）
多态是指一个对象可以表现出不同的行为，通常通过方法重写（Override）和方法重载（Overload）来实现
- Override是指在子类中重写父类的方法，以改变父类方法的实现
- Overload是指同名的方法根据参数的不同来实现不同的功能

- 抽象（abstraction）
抽象是指从多个对象中提取出共同的特性，提供一个抽象的类或接口，使得具体的实现对外部是透明的。抽象类可以包含抽象方法（没有实现的函数），具体的子类需要实现这些方法

### C#中面向对象的实现
在C#中对象被视作引用类型存储在托管堆上

#### 访问限定修饰符
默认访问修饰符
- 类：默认情况下使`internal`，这意味着类只能在同一程序集内部访问
- 成员：对于类中的成员，如果没有指定，字段默认为`private`，方法和属性默认为`private`

- `public`
  - 修饰类：使类对多有代码可见，可以从任何地方访问
  - 修饰成员：是成员对所有代码可见

- `internal`
  - 修饰类：使类仅对同一程序集中的代码可见，外部程序集无法访问
  - 修饰成员：使成员仅对同一程序集中的代码可见
  > 同一程序集（Assembly）是指在.NET或C#中编译后的代码和资源的集合，通常会包含一个或多个类型（如类、接口、结构等）
  > 程序集是.NET应用程序的基本组成单元，通常对应一个.dll或.exe文件
  > 程序集是.NET的元数据（Metadata）和代码（IL代码）的封装，它是运行时加载、版本控制和部署的单位

- `protected`
  - 修饰类：不能用于类，只能修饰成员
  - 修饰成员：使成员对继承类（子类）可见，但不能被外部代码直接访问

- `private`
  - 修饰类：不能用于类，只能修饰成员
  - 修饰成员：使成员仅包含对它的类内部可见，外部无法访问

- `protected internal`
  - 修饰类：使类对同一程序集中的代码以及继承该类的外部类可见
  - 修饰成员：使成员对同一程序集中的代码以及继承该类的外部类可见

- `private protected`
  - 修饰类：不能修饰类，只能修饰成员
  - 修饰成员：使成员对当前类以及在同一程序集内的继承类可见，但对其他类不可见


#### 字段与属性
在C#中，字段和属性是用于存储数据的两种主要方式，它们之间有很大的区别
1. 字段（Field）
字段是类或结构体中的一个变量，用于存储数据。它们通常直接定义在类中，并且可以通过类的实例进行访问
字段的特点：
- 字段是类的成员变量，用来直接存储数据
- 字段可以有不同的访问修饰符，来控制其可访问性
- 字段一般不包含逻辑，主要是存储数据

2. 属性（Property）
属性是C#中的一种特殊成员，用于对字段进行封装，是一种语法糖。它通常与字段关联，通过getter和setter方法来访问和修改字段的值

属性是C#中的一个重要特性，它不仅能提供对数据的访问，还可以在访问数据时添加额外的逻辑，比如验证、计算或其他操作。属性通常用于对类的字段提供更控制的访问方式

属性的特点：
- 属性本质上是对字段的封装，可以控制数据的读写
- 属性通常由getter和setter组成，它们可以是自动实现的或手动实现的
- 属性能够提供更复杂的逻辑，比如验证输入数据、计算值或触发事件等

自动实现的属性\
从C# 3.0开始，如果不需要写特殊逻辑，可以用简化语法\
自动实现的属性不需要显式定义字段，编译器会自动为其生成一个匿名的私有字段
```cs
class Person
{
    public string Name { get; set; } // 自动实现的属性
    public int Age { get; set; } // 自动实现的属性

    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
}
```

手动实现的属性\
手动实现的属性允许在访问和设置字段时添加自定义逻辑
```cs
class Person
{
    private int age; // 私有字段

    public int Age
    {
        get { return age; } // 获取age字段的值
        set
        {
            if (value >= 0) // 设置前验证
            {
                age = value;
            }
            else throw ArgumentOutOfRangeException("Age cannot be negative.");
        }
    }

    public Person(int age) => Age = age; // 通过get {} 访问
}
```

属性可以由不同的访问控制：
- 自动实现的属性：编译器自动提供私有字段的实现
- 只读属性：只有`get`访问器，没有`set`访问器，用于只允许读取值的情况
  `public string Id { get; }`
- 只写属性：只有`set`访问器，通常用于需要在对象初始化时设置值，但之后不能更改的字段
  `public sring Passwork( set; )`
- 属性带私有set
  `public string Username { get; private set; }`

C# 9.0 提供了新的访问器`init`\
只允许初始化时设置值
`public string Name { get; init; }`

```cs
public class Person
{
    public string Name { get; init; }
    public int Age { get; init; }
}

ver person = new Person
{
    Name = "Alice",
    Age = 30
};

// person.Name = "A" // 报错
```


抽象属性\
抽象类可以拥有抽象属性，这些属性应该在派生类中被实现
```cs
public abstract class Person
{
    public abstract string Name { get; set; }
    public abstract int Age { get; set; }
}

class Student : Person
{
    public string Code { get; set; } = "N.A";
    public override string Name { get; set; } = "N.A";
    public override int Age { get; set; } = 0;
}
```
当创建该类的实例时，如果没有显式为`Code`,`Name`，`Age`赋值，则默认值为给定值

表达式体属性\
这种简化语法避免了使用完整的`{ get; set; }`
```cs
class Person
{
    private string name;

    public string Name
    {
        get => name; // 返回字段name的值
        set => name = value; // 设置字段name的值
    }
}
```
对于那些只包含单行逻辑的属性，使用`=>`语法可以使代码更加简洁，特别适合于只需要返回一个字段值的简单属性，或者只需要执行一个简单操作的`set`\
只包含`get`的属性
```cs
class Person
{
    private string name = "N.A";

    public string Name => name; // get { return name; }
}
```
只包含`set`的属性
```cs
class Person
{
    private int age;

    public int Age
    {
        set => age = value;
    }
}
```

字段vs属性

| **特性**   | **字段**                                | **属性**                       |
| -------- | ------------------------------------- | ---------------------------- |
| **定义方式** | 直接声明为类的成员变量                           | 通过 `get` 和 `set` 方法定义并封装字段   |
| **访问控制** | 通常通过访问修饰符来控制访问权限                      | 可以通过 `get` 和 `set` 方法来控制访问权限 |
| **用途**   | 用于直接存储数据                              | 用于控制数据的访问，通常用于封装字段           |
| **数据验证** | 不能直接进行数据验证                            | 可以在 `set` 访问器中实现数据验证逻辑       |
| **默认行为** | 没有默认行为，直接存取数据                         | 允许在访问数据时加入逻辑或计算              |
| **继承行为** | 字段不能在子类中访问，除非是 `public` 或 `protected` | 属性可以被继承和重写，可以控制子类如何访问数据      |
| **性能**   | 直接存取，性能开销较小                           | 因为涉及方法调用，所以通常稍微慢一些，但差异通常很小   |


#### this
在C#中，`this`是一个关键字。它用于引用当前对象，尤其是在类的实例方法和构造函数中非常常见

1. `this`用于引用当前实例
`this`关键字用于指向当前对象的实例。在类的成员方法或构造函数中，可以使用`this`来访问当前对象的字段、属性或方法

```cs
class Person
{
    public string Name;

    public void SetName(string name)
    {
        this.Name = name; // 使用this引用当前对象的字段
    }
}

class Program
{
    static void Main()
    {
        Person person = new Person();
        person.SetName("Alice");
        Console.WriteLine(person.Name);
    }
}
```
在`SetName`方法中，`this.Name`代表当前实例的`Name`字段，而方法参数`name`是传入的值。通过`this.Name`，明确区分了成员变量和参数变量

2. `this`用于区分字段和参数
在类的方法中，当参数名称和成员字段名称相同时，可以使用`this`来区分它们，这对于避免变量命名冲突非常有用
```cs
class Person
{
    private string name;

    public Person(string name)
    {
        this.name = name; // 使用this来区分字段和参数
    }


    public void PrintName() => Console.WriteLine(this.Name); // 使用this引用字段
}
```
在构造函数中，`this.name`明确表示字段`name`，而构造函数的参数也叫`name`，使用`this`来区分这两个具有相同名称的成员

3. `this`用于调用当前类的其他构造函数
C#允许类中使用`this`来调用当前类的其他构造函数，这叫做构造函数链。这种方式使得多个构造函数能够共享部分代码，避免重复
```cs
class Person
{
    public string Name;
    public int Age;

    // 默认构造函数
    public Person() : this("Unknown", 0) // 调用其他构造函数
    {}

    // 带参数的构造函数
    public Person(string name, int age)
    {
        this.Name = name;
        this.Age = age;
    }
}

class Program
{
    static void Main()
    {
        Person person = new Person(); // 调用默认构造函数
        Console.WriteLine($"{person.Name}, {person.Age}"); // 输出"Unknown, 0"
    }
}
```

4. `this`用于传递当前对象作为参数
有时可能需要将当前对象传递给其它方法或者类，这是`this`可以用来表示当前对象

```cs
class Person
{
    public string Name;

    public void PrintPerson()
    {
        Console.WriteLine(this.Name); // 输出当前对象的名称
    }

    public void PrintOtherPerson(Person otherPerson)
    {
        Consle.WriteLine(otherPerson.Name); // 输出其他Person对象的名称
    }

    public void CompareWithOtherPerson(Person otherPerson)
    {
        if (this == otherPerson) // 比较当前对象和传入对象
        {
            Console.WriteLine("The same Person");
        }
        else
        {
            Console.WriteLine("Different persons");
        }
    }
}
```
在`CompareWithOtherPerson`方法中，`this`用来表示当前对象，便于和另一个对象进行比较

5. `this`用于扩展方法
在C#中，扩展方法可以为现有类型添加方法，而无需修改它们的源代码。扩展方法的第一个参数是`this`，它表示要扩展的方法所在的对象类型
```cs
public static class PersonExtensions
{
    public static void PrintUpperCaseName(this Person person)
    {
        Console.WriteLine(person.Name.ToUpper()); // 使用this访问Person对象
    }
}

class Program
{
    static void Main()
    {
        Person person = new Person { Name = "Alice" };
        person.PrintUpperCaseName(); // 输出“ALICE”（扩展方法）
    }
}
```
在这个例子中，`this`关键字使得`PrintUpperCaseName`方法能够扩展`Person`类型

6. `this`与静态成员
`this`关键字不能在静态方法中使用，因为静态方法是属于类而不是类的实例的。在静态方法中，`this`没有意义

```cs
class Person
{
    public static void StaticMethod()
    {
        // this.Name = "Alice"; // 错误：无法在静态方法中使用'this'
    }
}
```

#### static
在C#中，`static`关键字用于定义静态成员，它使得某个成员属于类本身而不是某个类的某个实例

这意味着静态成员在所有类的实例中共享，而不是每个实例拥有一份独立的副本

`static`可以用于类、字段、方法、属性、构造函数等多个场景

##### 静态类
`static`可以用来定义静态类，一个类如果声明为静态的，它就不能被实例化，也不能包含实例成员（如实例字段、实例方法等）静态类只能包含静态成员
```cs
public static class MathHelper
{
    public static double Pi = 3.14159;
    
    public static double Add(double a, double b) => a + b;
}

class Program
{
    static void Main()
    {
        // 访问静态类的成员
        Console.WriteLine(MathHelper.Pi); // 输出：3.14159
        Console.WriteLine(MathHelper.Add(2, 3)); // 输出：5
    }
}
```
- 静态类不能被实例化，不能使用`new`来创建对象
- 静态类额成员必须是静态的

##### 静态字段
`static`可以用于声明静态字段。静态字段属于类本身，而不是类的某个实例。所有类的实例共享一个静态字段的值
```cs
public class Counter
{
    public static int Count = 0; // 静态字段

    public Counter() => Count++; // 每次创建一个实例时，静态字段Count会增加
}

class Program
{
    static void Main()
    {
        Console.WriteLine(Counter.Count); // 输出：0
        Counter c1 = new Counter();
        Counter c2 = new Counter();
        Console.WriteLine(Counter.Count); // 输出：2
    }
}
```
- `Count`是一个静态字段，它被类的所有实例共享，因此在创建每个实例时，静态字段的值会发生变化

##### 静态方法
`static`也可以用于声明静态方法，静态方法只能访问静态成员，不能访问实例成员。静态方法通常用来执行类级别的操作，而不是操作某个具体实例的数据
```cs
public class MathHelper
{
    public static int Add(int a, int b) => return a + b;
}

class Program
{
    static void Main()
    {
        // 调用静态方法
        int result = MathHelper.Add(3, 4);
        Console.WriteLine(result); // 输出7
    }
}
```
- 静态方法可以通过类名直接访问，无需创建类的实例

##### 静态构造函数
静态构造函数是一个特殊的构造函数，它用于初始化静态类成员，在类的任何静态成员第一次被访问之前，静态构造函数会自动被调用。静态构造函数没有访问修饰符，并且不能接收参数
```cs
public class MyClass
{
    public static int Counter;

    static MyClass()
    {
        Counter = 10; // 静态构造函数初始化静态成员
        Console.WriteLine("静态构造函数调用");
    }

    public static void PrintCounter() => Console.WriteLine(Counter);
}

class Program
{
    static void Main()
    {
        MyClass.PrintCounter(); // 输出10
    }
}
```
- 静态构造函数在类的静态成员第一次被访问时自动执行一次
- 静态构造函数只能存在一个

##### 静态属性
`static`也可以用于声明静态属性，它允许你在类层面上控制静态字段的访问。静态属性是对静态字段的一种封装，通常用于获取或设置静态字段的值
```cs
public class GlobalSettings
{
    private static string settingValue;

    public static string Setting
    {
        get { return settingValue; }
        set { settingValue = value; }
    }
}

class Program
{
    static void Main()
    {
        GlobalSettings.Setting = "Dark Mode";
        Console.WriteLine(GlobalSettings.Setting); // 输出Dark Mode
    }
}
```
- 静态属性提供了对静态字段的访问控制，并且同样可以通过类名直接访问

静态类的局限性
- 静态类不能实例化
- 静态类只能包含静态成员，不能有实例成员
- 静态构造函数只能有一个，它会在类的静态成员首次访问时被自动调用

静态成员的使用场景
- 共享数据：静态字段适合用来存储在所有实例之间共享的数据
- 工具类：静态方法常用于那些不依赖实例的功能，比如数学运算、字符串处理等
- 单例模式：静态类和静态字段可以用于实现单例模式，确保一个类只有一个实例

#### 嵌套类
在C#中，嵌套类是指定义在另一个类内部的类。嵌套类可以时静态的或实例化的，并且它的访问权限可以受到外部类访问控制修饰符的限制。嵌套类通常用于以下几种情况：
- 封装逻辑：将一些仅在外部类内使用的类封装在外部类内部，避免类的暴露，确保数据和方法的封装性
- 辅助功能：嵌套类用于实现外部类的某些辅助功能，比如构建复杂数据结构、实现辅助算法等

##### 嵌套类的定义
嵌套类通常定义在外部类内部，并且有自己的访问修饰符，这决定了它的可访问范围
```cs
public class OuterClass
{
    // 外部类的成员
    public int outerField;

    // 嵌套类
    public class NestedClass
    {
        public int nestedField;

        public void Display() => Console.WriteLine("Nested class method");
    }

    public void Display() => Console.WriteLine("Outer class method");
}

class Program
{
    static void Main()
    {
        // 创建外部类的实例
        OuterClass outer = new OuterClass();
        outer.outerField = 10;
        outer.Display();

        // 创建嵌套类的实例
        OuterClass.NestedClass nested = new OuterClass.NestedClass();
        nested.nestedField = 20;
        nested.Display();
    }
}
```
- `OuterClass`包含了一个嵌套类`NestedClass`
- `OuterClass`和`NestedClass`都可以包含自己的字段和方法
- 嵌套类通过`OuterClass.NestedClass`访问

##### 访问修饰符
嵌套类的访问修饰符决定了它的访问范围，嵌套类和它的成员可以设置为不同的访问级别
```cs
public class OuterClass
{
    private class PrivateNestedClass
    {
        public void Display()
        {
            Console.WriteLine("Private nested class");
        }
    }

    public class PublicNestedClass
    {
        public void Display()
        {
            Console.WriteLine("Public nested class");
        }
    }

    public void CreateNestedClasses()
    {
        // 只有外部类的实例方法能访问私有嵌套类
        PrivateNestedClass privateNested = new PrivateNestedClass();
        privateNested.Display();

        PublicNestedClass publicNested = new PublicNestedClass();
        publicNested.Display();
    }
}

class Program
{
    static void Main()
    {
        OuterClass outer = new OuterClass();
        outer.CreateNestedClasses();

        // 无法直接访问 PrivateNestedClass
        // OuterClass.PrivateNestedClass privateNested = new OuterClass.PrivateNestedClass(); // 错误！

        OuterClass.PublicNestedClass publicNested = new OuterClass.PublicNestedClass(); // 允许
        publicNested.Display();
    }
}

```

##### 嵌套静态类
嵌套类可以是 静态的，这意味着它不能访问外部类的实例成员，只能访问外部类的静态成员。静态嵌套类通常用于封装一些与外部类实例无关的功能

```cs
public class OuterClass
{
    public static int staticField = 100;

    // 嵌套静态类
    public static class StaticNestedClass
    {
        public static void Display()
        {
            Console.WriteLine("Static nested class method");
            Console.WriteLine("Accessing static field from outer class: " + OuterClass.staticField);
        }
    }
}

class Program
{
    static void Main()
    {
        // 访问静态嵌套类
        OuterClass.StaticNestedClass.Display();
    }
}

```

##### 嵌套类访问外部类的实例成员
嵌套类能够访问外部类的实例成员（字段和方法）。但要注意，嵌套类访问外部类实例成员时，必须先实例化外部类
```cs
public class OuterClass
{
    public int outerField = 42;

    // 嵌套类访问外部类实例成员
    public class NestedClass
    {
        public void Display(OuterClass outer)
        {
            Console.WriteLine("Outer class field: " + outer.outerField);  // 访问外部类的实例成员
        }
    }
}

class Program
{
    static void Main()
    {
        OuterClass outer = new OuterClass();
        OuterClass.NestedClass nested = new OuterClass.NestedClass();
        nested.Display(outer);  // 传入外部类实例
    }
}
```

##### 嵌套类的使用场景
- 封装实现细节：当某个类仅在另一个类的上下文中有意义时，可以将其作为嵌套类来封装
- 逻辑分组：将功能相关的类进行嵌套，避免类的过度暴露，减少命名冲突
- 辅助功能：嵌套类用于实现外部类的辅助功能，比如遍历、处理数据等

```cs
public class Book
{
    public string Title { get; set; }
    public string Author { get; set; }

    // 嵌套类用于表示书籍的章节
    public class Chapter
    {
        public string Title { get; set; }
        public int PageCount { get; set; }

        public void Display() => Console.WriteLine($"{Title}, {PageCount}");
    }
}

class Program
{
    static void Main()
    {
        Book book = new Book { Title = "C# Programming", Author = "John Doe" };
        Book.Chapter chapter = new Book.Chapter { Title = "Introduction", PageCount = 10 };
        chapter.Display();
    }
}
```

#### 扩展方法（Extension Methods）
在C#中，扩展方法是一种通过静态方法扩展现有类型功能的技术，而无需修改原始类型的代码。这使得可以为已经存在的类型（如系统库中的类）添加新方法，而不需要继承、修改类或重新编译库

**定义**\
扩展方法实际上是静态方法，但是它们的调用方式和实例方法一样。扩展方法的定义依赖于`this`关键字，它指定了要扩展的类型

**扩展方法的语法**\
扩展方法必须是静态的，并且定义在一个静态类中。扩展方法的第一个参数表示被扩展的类型，前面加上`this`关键字。通过这种方式，编译器会将扩展方法作为实例方法来调用
```cs
public static class ExtensionClass
{
    public static ReturnType MethodName(this TargetType instance, Parameters)
    {
        // 方法体
    }
}
```
- `this TargetType`：这是扩展方法的目标类型，也就是说这个方法是为`TargetType`类型添加的
- `MethodName`：扩展方法的名称，可以像调用实例方法一样调用
- `Parameters`：扩展方法可以有参数，就像普通方法一样

**示例**\
1. 为`string`类型扩展一个方法\
假设要为`string`类型扩展一个方法`IsNullOrEmpty`，用于检查字符串是否为`null`或空字符串
```cs
using System;

public static class StringExtensions
{
    // 扩展方法：检查字符串是否为null或空
    public static bool IsNullOrEmpty(this string str)
    {
        return string.InNullOrEmpty(str);
    }
}

class Program
{
    static void Main()
    {
        string text = "Hello, World!"
        bool result = text.IsNullOrEmpty(); // 调用扩展方法
        Console.WriteLine(result); // False

        string exptyText = "";
        Console.WriteLine(emptyText.IsNullOrEmpty()); //True
    }
}
```
在这个例子中，为`string`类型添加了一个`IsNullOrEmpty`方法，它检查字符串是否为空或为`null`
- 调用时像调用实例方法一样，`text.IsNullOrEmpty()`
- 编译器会自动将`text`当作第一个参数传递给扩展方法

2. 为`List<int>`扩展一个方法\
为`List<int>`扩展一个`Sum`方法，用于计算一个整数列表的和
```cs
using System;
using System.Collections.Generic;

public static class ListExtensions
{
    // 扩展方法：计算整数列表的和
    public static int Sum(this List<int> list)
    {
        int sum = 0;
        foreach (var item in list) sum += item;
        
        return sum;
    }
}

class Program
{
    static void Main()
    {
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
        Console.WriteLine(numbers.Sum());
    }
}
```

3. 为`DateTime`扩展一个方法\
为`DateTime`扩展一个方法，检查是否是工作日
```cs
using System;

public static class DateTimeExtensions
{
    // 扩展方法：检查日期是否是工作日
    public static bool IsWeekday(this DateTime date) => date.DayOfWeek != DayOfWeek.Saturday && date.DayOfWeek != DayOfWeek.Sunday;
}
```

**注意事项**\
- 命名空间：扩展方法定义在特定的静态类中，所以需要确保在使用扩展方法的文件中包含该类的命名空间
- 扩展方法的优先级：扩展方法在方法解析时具有较高的优先级。如果目标类型本身已经定义了相同的方法，编译器会优先选择目标类型的方法，而不是扩展方法
- 静态方法：扩展方法本质上是静态方法，但它的调用方式与实例方法相同
- 不能重载扩展方法：你不能为一个类型扩展多个相同名称、参数个数和类型的方法

**实际应用**\
- 为.NET库提供额外功能
- 简化常见操作
- 增强可读性和维护性

**特点**\
优点
- 不修改现有代码
- 提升可读性
- 增强灵活性

缺点
- 可能导致混淆：如果扩展方法和目标类型的方法名称及或功能相似，可能会导致方法解析的冲突或混淆
- 只能使用`static`方法：扩展方法本质上是静态方法，不能访问实例的非静态成员

#### 抽象类与接口（interface）
抽象类和接口都是用来定义一组方法和属性，但它们的目的和使用方式不同

##### 抽象类
抽象类是一种不能实例化的类，它提供一个模板，可以包含已实现的方法和未实现的方法（抽象方法）。抽象类允许部分实现，因此它可以定义字段、构造函数和方法，并且可以在其中包含抽象方法（没有方法体）\
特点：
- 不能实例化：抽象类不能直接创建实例
- 可以包含已实现的方法：抽象类可以有已实现的方法，也可以有未实现的方法（抽象方法）
- 可以包含字段和构造函数：抽象类允许有实例字段、静态字段和构造函数
- 可以实现接口：抽象类可以实现接口，这样它就需要提供接口的所有抽象方法实现，或者让其子类来提供实现

```cs
public abstract class Animal
{
    // 抽象方法：子类必须实现
    public abstract void MakeSound();

    // 已实现方法
    public void Sleep() => Console.WriteLine("Sleeping...");
}

public class Dog : Animal
{
    // 必须实现抽象方法
    public override void MakeSound() => Console.WriteLine("Bark!");
}

class Program
{
    static void Main()
    {
        // Animal animal = new Animal(); // 不能实例化抽象类
        Animal dog = new Dog(); // 通过子类实例化
        dog.MakeSound(); // Bark!
        dog.Sleep(); // Sleeping...
    }
}
```
`Animal`本身不能实例化，只能通过其子类来实例化

**使用场景**\
- 当有多个类需要共享某些方法的实现时，可以将这些方法放在抽象类中，并让各个子类继承和重写抽象方法
- 当需要部分实现，比如某些方法需要通用实现而其他子方法则有子类提供实现

##### 接口
接口是一种定义契约的方式，所有声明的成员都是抽象的（没有实现）。接口只能包含方法、属性、事件或索引器的声明，而不能包含任何实现。类可以实现多个接口，但它们必须实现接口中的所有方法

特点：
- 只包含声明：接口只能声明方法、属性、事件等，而不能提供任何实现
- 不能包含字段：接口不能包含字段或构造函数
- 多继承：一个类可以实现多个接口（C#允许类实现多个接口，但只能继承一个类）
- 强制实现：当类实现接口时必须实现接口中声明的所有方法
- 不能实例化：接口本身不能被实例化

```cs
public interface IAnimal
{
    // 接口方法：没有实现
    void MakeSound();
}

public interface ICanFly
{
    void Fly();
}

public class Bird : IAnimal, ICanFly
{
    public void MakeSound()
    {
        Console.WriteLine("Chirp!");
    }

    public void Fly()
    {
        Console.WriteLine("Flying...");
    }
}

class Program
{
    static void Main()
    {
        IAnimal animal = new Bird();
        animal.MakeSound(); // 输出：Chirp

        ICanFly bird = new Bird();
        bird.Fly(); // 输出：Flying...
    }
}
```
- `IAnimal`和`ICanFly`是接口，分别声明了`MakeSound`和`Fly`方法
- `Bird`类实现了这两个几口，并提供了这两个方法的实现

**使用场景**
- 当需要定义一组方法，但不关心这些方法如何实现，这时可以使用接口
- 当多个类需要共享某种行为，而不需要继承相同的类，例如，一个类可以实现多个接口来获得不同的功能
- 用于多继承：C#不支持多类继承，但可以通过接口来实现类似的功能

##### 抽象类与接口

| 特性         | 抽象类                                       | 接口                        |
| ---------- | ----------------------------------------- | ------------------------- |
| **设计理念**     |  is-a                                 | can-do                                |
| **实现方法**   | 可以有部分实现（普通方法）                             | 只能有方法声明，无实现               |
| **构造函数**   | 可以有构造函数                                   | 不能有构造函数                   |
| **字段**     | 可以有字段（实例或静态）                              | 不能有字段                     |
| **多继承**    | 只能继承一个类                                   | 可以实现多个接口                  |
| **实现方式**   | 类继承，子类必须实现所有抽象方法                          | 类实现，必须实现接口中的所有方法          |
| **成员访问控制** | 可以有访问修饰符（`public`、`protected`、`private`等） | 所有成员默认是 `public`，不能有访问修饰符 |
| **默认行为**   | 可以有默认实现（非抽象方法）                            | 所有方法默认是抽象的，不能有实现          |

#### 继承问题
在C#中，继承方式总是`public`，接口只能继承接口，类只能继承一个类，但可以继承多个接口，以实现多继承，同时避免了菱形继承问题，因为接口中只有函数签名，实现在子类中‘

##### `virtual`和`abstract`
1. `virtual`方法

`virtual`关键字用于允许类中的方法、属性和事件被重写（`override`）或继承，但它不强制要求子类必须重写该方法。如果子类没有重写该方法，它将调用基类提供的默认实现

特点：
- 可以提供默认实现：`virtual`方法有一个默认实现，子类可以选择重写它，也可以继承这个实现
- 子类可以重写：子类如果需要修改该方法的行为，可以使用`override`关键字重写
- 可选重写：如果子类不重写，基类的默认实现将被使用

```cs
public class Animal
{
    // virtual方法，允许被重写
    public virtual void Speak() => Console.WriteLine("Animal speaks");

    public class Dog : Animal
    {
        // 重写基类的虚拟方法
        public override void Speak() => Console.WriteLine("Dog barks");
    }
}

public class Program
{
    public static void Main()
    {
        Animal myAnimal = new Animal();
        myAnimal.Speak(); // Animal speaks

        Animal myDog = new Dog();
        myDog.Speak(); // Dog barks
    }
}
```
- `Speak`方法是`virtual`的，可以在`Dog`类中重写
- `Dog`类重写了`Speak`方法，使得调用`myDog.Speak()`时输出 Dog barks，而不是基类`Animal`的默认实现

使用场景
- 当你想提供一个默认实现，但希望子类可以根据需要覆盖它时
- 当你希望子类能够自定义基类方法的行为，但保留基类默认行为时

2. `abstract`方法
`abstract`关键字用于声明抽象方法，这意味着该方法在基类中没有实现，并且必须在派生类中实现。抽象方法只能存在于抽象类中，抽象类时是不能被实例化的，它用于定义子类的模板

特点：
- 没有实现：`abstract`方法没有方法体，它只是方法签名
- 必须被重写：所有继承自抽象类的非抽象子类必须重写该方法
- 用于强制派生类实现特定行为

```cs
public abstract class Animal
{
    // abstract方法，必须在派生类中实现
    public abstract void Speak();
}


public class Dog : Animal
{
    // 必须实现基类的抽象方法
    public override void Speak() => Console.WriteLine("Dog barks");
}

public class Program
{
    public static void Main()
    {
        // Animal myAnimal = new Animal(); // 错误：不能实例化抽象类
        Animal myDog = new Dog();
        myDog.Speak(); // 输出：Dog barks
    }
}
```
- `Speak`方法是`abstract`的，没有实现，因此无法在`Animal`类中提供具体实现
- `Dog`类继承`Animal`并实现了`Speak`方法，这样就满足了抽象类的要求

使用场景
- 当你希望确保派生类实现特定的行为时，例如定义一组必须被所有派生类实现的操作
- 当你不能为某些方法提供通用实现时，而是希望每个派生类都有自己的特定实现

`virtual` vs `abstract`

| 特性          | `virtual` 方法        | `abstract` 方法    |
| ----------- | ------------------- | ---------------- |
| **方法实现**    | 有默认实现，可以选择重写        | 没有默认实现，必须在派生类中实现 |
| **派生类的要求**  | 派生类可以选择是否重写方法       | 派生类必须实现该方法       |
| **可用范围**    | 可以用于普通类，派生类可以选择是否重写 | 只能用于抽象类，必须被重写    |
| **是否可以实例化** | 可以在基类中实例化           | 不能实例化抽象类         |
| **行为**      | 允许派生类重写该方法          | 强制派生类提供该方法的实现    |

`virtual`与`abstract`的组合使用
可以在某些情况下结合使用`virtual`和`abstract`，例如，在抽象类中定义一个抽象方法，然后提供一个虚拟方法作为默认实现，这样派生类可以选择重写该方法，或者使用基类提供的默认实现
```cs
public abstract class Animal
{
    // abstract 方法：强制子类实现
    public abstract void MakeSound();

    // virtual 方法：提供默认实现，可以选择重写
    public virtual void Sleep() => Console.WriteLine("Aniaml sleeps");
}

public class Dog : Animal
{
    public override void MakeSound() => Console.WriteLine("Dog barks");

    // 可以选择重写虚拟方法
    public override void Sleep() => Console.WriteLine("Dog sleeps");
}

public class Program
{
    public static void Main()
    {
        Animal myDog = new Dog();
        myDog.MakeSound(); // Dog barks
        myDog.Sleep(); // Dog sleeps
    }
}
```

#### 运算符重载

#### 构造函数和析构函数
在C#中，构造函数和析构函数时特殊的方法，它们分别在创建对象和销毁对象时被自动调用。它们用于初始化对象和清理资源

##### 构造函数（Constructor）
构造函数时当创建对象时自动调用的特殊方法，它用于初始化对象，通常用于设置对象的初始状态

特点：
- 构造函数没有返回值（即使时`void`也不能指定）
- 与类同名：构造函数的名称必须与类名相同
- 可以重载：类可以有多个构造函数（重载），以便以不同的方式初始化对象
- 自动调用：每次实例化对象时，构造函数都会自动调用

构造函数的类型
- 默认构造函数
- 参数化构造函数
- 静态构造函数：仅在类第一次使用时自动调用，用于初始化静态成员

```cs
public class MyClass
{
    public static int StaticValue;

    // 静态构造函数
    static MyClass()
    {
        Console.WriteLine("Static constructor called.");
        StaticValue = 10;
    }

    public static void DisplayValue() => Console.WriteLine($"Static Value: {StaticValue}");
}

class Program
{
    static void Main()
    {
        MyClass.DisplayValue(); 
    }
}
```

##### 析构函数（Destructor）
析构函数时当对象销毁时自动调用的特殊方法，主要用于释放资源，尤其时非托管资源（如文件句柄、数据库连接等）

在C#中，析构函数通常用来清理那些没有被垃圾回收器管理的资源

特点：
- 析构函数没有参数和返回值
- 自动调用：当对象的生命周期结束并被垃圾回收时，析构函数会自动调用
- 只会有一个析构函数：每个类只能有一个析构函数
- 不需要显式调用：析构函数由GC管理，在对象生命周期结束时自动调用

注意事项：
- 不建议手动调用析构函数，它是由垃圾回收器管理的
- C#的垃圾回收器自动管理托管资源的清理，所以析构函数主要用于清理非托管资源
- 如果在类中使用了`IDisposable`接口来管理资源，那么应考虑使用`Dispose`方法来显式释放资源而不是依赖析构函数

#### `partial`
`partial`关键字的作用是将一个类、结构、接口、方法的定义拆分到多个文件或多个位置，在编译时由C#编译器把它们合并成一个完整定义

它本质上就是编译器的代码拼接，运行时你看到的还是一个完整的类型或方法

##### 示例
1. 拆分类
```cs
// Player.Data.cs
public partial class Player
{
    public string Name;
    public int Level;
}
```
```cs
// Player.Logic.cs
public partial class Player
{
    public void Levelup()
    {
        Level++;
        Console.WriteLine($"{name} 升级到 {Level}级！");
    }
}
```
编译时，C#会自动把`Player.Data.cs`和`Player.Logic.cs`的代码合并成一个`Player`类

2. 拆分方法
C# 3.0引入了`partial method`，用于让一个方法的声明和实现分开，且实现可选
```cs
// Game.partial.cs
public partial class Game
{
    partial void OnGameStart(); // 声明（没有方法体）
}
```
```cs
// Game.impl.cs
public partial class Game
{
    partial void OnGameStart()// 实现
    {
        Console.WriteLine("游戏开始！");
    }
}
```
特点：
- 没有实现的话，编译器会直接删除这个方法声明和所有调用（不会报错）
- 必须是`void`且默认是`private`
- 常用于自动生成代码是预留扩展点

##### 常见应用场景
1. 代码生成 + 手写代码分离
比如WinForms、WPF、Unity自动生成的UI代码
```cs
// Form1.Designer.cs（自动生成）
partial class Form1
{
    private void InitializeComponent() { ... }
}
```
```cs
// Form1.cs （手写逻辑）
partial class Form1
{
    private void Form1_Load(...) { ... }
}
```
这样自动生成的代码和手写的逻辑分开，避免每次UI改动都覆盖手写部分

2. 大型类文件拆分
当一个类太大时，可以按功能模块拆到多个文件
```
Enemy.Movement.cs
Enemy.Attack.cs
Enemy.Health.cs
```
阅读和维护更轻松

3. 团队协作
多人维护同一个类时，`partial`允许每个人在不同文件里写各自负责的部分，减少合并冲突

##### 注意事项
1. 所有`partial`部分必须
  - 在同一个命名空间中
  - 有相同的访问修饰符
  - 同类型

2. 编译时自动合并，不会影响运行时性能

3. `partial method`如果没有实现，编译器会把它和调用都优化掉

#### `readonly`
在C#中，`readonly`关键字用于修饰字段，使得这些字段在初始化后不能再修改，确保字段在对象生命周期内的不可变性。具体来说，`readonly`适用于以下情况
1. 只能在构造函数中初始化
`readonly`字段只能在构造函数中被复制，或者在声明时进行初始化。它不能在类的其他方法或外部代码中被修改
```cs
public class MyClass
{
    public readonly int x;
    
    public MyClass(int val) => x = val; // 可以在构造函数中赋值
}
```

2. 不可再其他方法或外部修改
一旦被赋值，`readonly`字段的值就不能再被修改。如果尝试再其他地方修改它，编译器会报错
```cs
public class MyClass
{
    public readonly int x = 10;

    public void ChangeValue()
    {
        // x = 20; // 编译错误，无法修改只读字段
    }
}
```

3. 对于静态字段
如果一个字段被声明为`static readonly`，它将是类级别的常量，并且只能再静态构造函数中初始化
```cs
public class MyClass
{
    public staitc readonly string MyConstant = "Hello, World!";

    static MyClass()
    {
        // 也可以再静态构造函数中初始化
    }
}
```

4. 和`const`的区别
- `const`字段在编译时就已知，并且是隐式静态的，无法在运行时修改
- `readonly`字段可以在构造函数中初始化，因此支持运行时赋值，且只能在类的实例创建时设置

```cs
public class MyClass
{
    public const int ConstantValue = 100; // 编译时确定
    public readonly int ReadonlyValue; // 运行时可以初始化

    public MyClass(int value) => ReadonlyValue = value;
}
```

##### 常见用法
`readonly`主要用于哪些需要保证值在对象生命周期内不变的场景，比如配置参数、唯一标识符等
例如，一个表示”出生日期”的字段可以使用`readonly`
```cs
public class Person
{
    public readonly DateTime DateOfBirth;

    public Person(DateTime birthDate) => DateOfBirth = birthDate;
}
```
这样一来，`DateOfBirth`一旦初始化后，就不能在对象的生命周期中被改变，确保了数据的安全性和一致性

#### `sealed`
`sealed`（密封）是一个关键字，用于限制类或类成员的继承和重写，控制继承行为，并非访问修饰符
##### `sealed`修饰类
当一个类被声明为`sealed`时，它不能被其他类继承
```cs
sealed class SealedClass
{
    public void Display() => Console.WriteLine("这是一个sealed类");
}

// class DerivedClass : SealedClass { } // Error: 'DerivedClass': cannot derive from sealed type 'SealedClass'
```
使用场景
- 防止意外的继承
- 安全性考虑（如System.String就是sealed类）
- 性能优化（某些情况下）

##### `sealed`修饰方法
当方法被声明为`sealed`时，它不能在派生类中被重写。注意：`sealed`只能用于已标记为`override`的方法
```cs
class BaseClass
{
    public virtual void Method1() => Console.WriteLine("Base Method1");

    public virtual void Method2() => Console.WriteLine("Base Method2");
}

class DerivedClass : BaseClass
{
    // 重写并密封 Method1，防止进一步重写
    public sealed override void Method1() => Console.WriteLine("Derived sealed Method1");

    // 只重写Method2，没有密封
    public override void Method2() => Console.WriteLine("Derived Method2");
}

class ThirdClass : DerivedClass
{
    // public override void Method1() { } // 错误，不能重写sealed方法

    public override void Method2() { } // 可以重写非sealed方法
}
```
##### 破坏sealed
在正常的C#编程中，没有官方支持的方法可以打破`sealed`的限制\
但有一些非正统的技术手段，不过这些都有严重的问题，不推荐在生产环境中使用

1. 反射（有限度的打破）
只能访问成员，不能继承sealed类

2. 直接使用指针操作内存（危险行为）

3. 使用DynamicMethod或IL生成
可以绕过一些编译时检查，但极其复杂且不稳定

4. 序列化技巧
通过序列化/反序列化可能改变对象状态，但无法改变类的继承关系

##### 使用sealed的好处
1. 安全性：防止关键功能被修改
2. 性能：编译器可以进行更好的优化
3. 设计意图明确：明确表示该类或方法不应被进一步扩展
4. 版本控制：确保基类行为的一致性

##### 注意事项
- `sealed`类不能是抽象类
- `sealed`方法必须与`override`一起使用
- 谨慎使用，因为它限制了代码的扩展性

#### `base`
`base`关键字用于从派生类（子类）中访问基类（父类）的成员。它的作用类似于对象自身的`this`关键字，但`base`指向的是其直接基类

##### 主要用途
1. 调用基类中已被重写的方法
当在派生类中重写（使用`override`关键字）了也给基类的虚方法或抽象方法后，有时希望在执行新代码的同时，仍然保留基类方法的原有逻辑。这时候就可以使用`base`来调用它
```cs
public class Animal
{
    public virtual void MakeSound()
    {
        Console.WriteLine("The animal makes a sound.");
    }
}

public class Dog : Animal
{
    public override void MakeSound()
    {
        // 调用基类 Animal 的 MakeSound 方法
        base.MakeSound(); // 输出：The animal makes a sound.

        // 然后添加狗特有的行为
        Console.WriteLine("The dog barks: Woof woof!");
    }
}

class Program
{
    static void Main()
    {
        Dog myDog = new Dog();
        myDog.MakeSound();
        // 输出：
        // The animal makes a sound.
        // The dog barks: Woof woof!
    }
}
```
在这个例子中，`Dog`类重写了`MakeSound`方法。通过`base.MakeSound()`，它首先执行了基类`Animal`中的通用逻辑，然后才执行自己特有的逻辑\
它避免了代码重复，可以在扩展功能的同时，复用基类已经实现好的、稳定的核心功能

2. 调用基类的构造函数（特别是在派生类的构造函数中）
这是`base`关键字非常常见和重要的用法。当一个派生类被实例化时，其构造函数首先调用其基类的构造函数，以确保基类部分的成员被正确初始化。这个过程是自动的，但有时需要显式地控制调用基类的哪一个构造函数
```cs
public class Vehicle
{
    public string Brand { get; set; }
    public int Year { get; set; }

    // 基类构造函数 1
    public Vehicle(string brand)
    {
        Brand = brand;
        Console.WriteLine($"Vehicle constructor called for {brand}");
    }

    // 基类构造函数 2
    public Vehicle(string brand, int year) : this(brand) // 使用 this 调用同一个类的另一个构造函数
    {
        Year = year;
        Console.WriteLine($"Vehicle constructor with year called. Year: {year}");
    }
}

public class Car : Vehicle
{
    public int NumberOfDoors { get; set; }

    // Car 的构造函数，调用基类 Vehicle 的构造函数 (string, int)
    public Car(string brand, int year, int doors) : base(brand, year) // 关键在这里！
    {
        NumberOfDoors = doors;
        Console.WriteLine($"Car constructor called. Doors: {doors}");
    }
}

class Program
{
    static void Main()
    {
        Car myCar = new Car("Toyota", 2023, 4);
    }
}

// 输出
// Vehicle constructor called for Toyota
// Vehicle constructor with year called. Year: 2023
// Car constructor called. Doors: 4
```
执行顺序
1. 创建`Car`对象时，首先进入`Car`的构造函数
2. 但由于有`: base(brand, year)`，所以程序会先跳转到基类`Vehicle`匹配的构造函数`Vehicle(string brand, int year)`
3. 在`Vehicle(string brand, int year)`中，又因为`: this(brand)`，会先调用`Vehicle(string brand)`
4. 执行完所有基类构造函数的逻辑后，最后才回到`Car`的构造函数体中执行`NumberOfDoors = doors;`

##### 重要规则
- 基类构造函数的调用发生在派生类构造函数体执行之前
- 如果基类没有定义任何构造函数，编译器会提供一个默认的无参构造函数，并且派生类会隐式地调用它
- 如果基类没有无参构造函数（只有有参构造函数），那么派生类必须使用`base`关键字显式地调用基类的某个有参构造函数，否则会编译错误