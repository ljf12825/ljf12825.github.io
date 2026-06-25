---
title: Reflection
date: 2025-06-01
author: "ljf12825"
type: file
summary: C# reflection
---

## 基本概念
反射是一种计算机编程语言的能力，它允许程序在运行时（Runtime）检查、分析甚至修改自身的结构（如类、方法、属性、接口等）的行为\
反射像一面镜子\
在编写代码的编译时(Compiletime)，你很清晰程序的结构\
而反射则让程序在运行时(Runtime)能够”照镜子“，看到自己由什么组成，并能动态地调用或操作这些部分\
>代码中有许多类，每个类都包含了许多字段，现在提供一个类`Type`，可以获得任何一个类的任何字段（包括私有字段），提供查看，修改，创建功能

### 反射的作用
1. 在运行时检查类型信息
  - 获取任何一个对象的类型（Class）
  - 获取类的所有成员（字段/属性、方法、构造函数）
  - 判断一个对象是否属于某个特定类，或者实现了某个接口
2. 在运行时操作类、对象和成员
  - 动态创建对象：即使编译时不知道类的名字，也可以在运行时通过字符串形式的类名来创建实例
  - 动态调用方法：通过方法的名字（字符串形式）来调用也给对象的方法
  - 动态获取和设置字段值：访问甚至修改一个对象的字段（包括私有字段，取决于语言的安全策略）
3. 晚期绑定（Late Binding）
  - 调用COM组件或那些在编译时无法直接引用的程序集中的方法。不需要在项目中提前”Add Reference“，可以在运行时动态加载程序集并与之交互

### 反射的优缺点
优点
- 极高的灵活性和动态性：这是其最大价值。它使得编写通用框架、插件系统、序列化/反序列化工具、对象关系映射器（ORM）成为可能
- 赋能框架：像ASP.NET Core（依赖注入、MVC路由）、Entity Framework Core（将数据库表映射到实体类）、xUnit（发现并运行测试方法）等而核心.NET技术都重度依赖反射来实现

缺点：
- 性能开销：反射操作比直接编译代码调用要慢几个数量级。因为所有的检查、方法查找和成员访问都是在运行时进行的，JIT编译器无法对其进行优化。应避免在性能关键的循环或路径中使用
- 安全性：反射可以绕过访问修饰符，这可能破坏封装性，带来安全风险
- 代码可维护性：大量使用反射的代码难以阅读、理解和调试，因为很多行为要到运行时才能确定
- 脆弱性：如果通过字符串名称查找类型或成员，一旦名称拼写错误或成员不存在，错误将在运行时才抛出，而不是在编译时

### 反射使用场景
**优先考虑编译时安全性和性能，仅在别无他法或收益远大于成本时，才在严格限制下使用反射**\

1. 构建基础设施、框架和工具
编写通用工具或辅助方法\
一个深度克隆（Deep Clone）工具方法。需要遍历一个对象的所有字段（包括私有字段），来创建一个完美的副本。这种方法通常会在项目的基础工具库中写一次，然后被广泛复用\
时刻问自己：“我是在编写像框架一样的通用基础设施吗？”如果答案是否定的，那么你很可能不应该使用反射。日常业务中，99.9%的情况都有更好的、不依赖反射的解决方案

2. 与外部系统或动态配置集成
当你的程序需要根据外部配置（如配置文件、数据库中的设置）来动态决定行为时\
一个简单的插件系统。在配置文件中写上插件类的名称`"MyApp.Plugins.EmailNotifier"`，主程序通过`Type.GetType()`创建并加载它。虽然用了反射，但它被隔离在程序启动的初始化阶段，不会影响核心性能\
反射操作比直接代码调用慢几个数量级。在性能关键的路径上使用反射是自杀行为

3. 使用重度依赖反射的成熟库
很多时候，已经在“间接地”使用反射了，只是库帮你处理了所有复杂的细节，并做了性能优化

4. 绝对尊重封装
仅仅因为能访问私有字段，不意味着应该这么做。修改私有成员是最后的手段，通常只用于测试、序列化等框架场景。滥用它会创建极其脆弱和难以维护的代码，因为代码与类的内部实现细节紧密耦合，一旦类的私有成员改变，代码就会立刻崩溃

5. 安全风险
如果正在处理敏感数据（如密码、令牌），反射的存在意味着任何能运行代码的组件都可能提取这些数据。在设计安全敏感的系统时，必须考虑到这一点

## C#反射核心
### 核心命名空间及其下的类
- `System`
  - `System.Type`：一个类型的`Type`对象包含所有该类型的元数据信息
- `System.Reflection`
  - `Assembly`, `Module`, `MemberInfo`, `MethodInfo`, `PropertyInfo`, `FieldInfo`, `ConstructorInfo`, `ParameterInfo`, `BindingFlags`
- `System.Reflection.Emit`：动态生成/IL代码
  - `AssemblyBuilder`, `ModuleBuilder`, `TypeBuilder`, `MethodBuilder`, `ILGenerator`, `DynamicMethod`
- `System.Reflection.Metadata`：高级、只读元数据分析，用于直接读PE/元数据（通常用于工具/静态分析）
- `System.Runtime.Serialization`/`System.Reflection.TypeExtension`（若干辅助API）


### `System.Type`/`TypeInfo`
#### 背景
`TypeInfo`是`Type`功能的扩展，是`Type`的增强视图，它提供了更丰富、更符合现代.NET开发模式的反射API，尤其是在.NET Core和现代应用模型中\
在传统的、完整的.NET Framework中，反射的核心一直是`System.Type`类。所有关于类型的信息都通过它来获取\
当微软开始开发.NET Core（一个跨平台、模块化、高性能的.NET版本）时，他们需要一个策略来让平台更轻量级。一个核心思想是按需付费：你的应用程序不应该被迫加载一个庞大的完整程序集，而是只加载它实际需要的部分\
传统的`System.Type`位于`mscorlib.dll`（后来是`System.Runtime.dll`）中，它是一个非常庞大和全面的类型。为了支持这种模块化，反射API被拆分和重新设计\
`System.Type`是一个装工具的大工具箱。`TypeInfo`就像是把这个工具箱打开，把里面的工具（方法、属性、基类等信息）都拿出来，整齐地摆在你面前，让你看得更清楚，用起来也更符合“按需取用”的原则\
**`System.Type` vs `TypeInfo`

| 特性 | `System.Type`（传统方式） | `TypeInfo`（现代方式）|
| - | - | - |
| 所在程序集 | `System.Runtime` | `System.Reflection` |
| 设计哲学 | “拉”（Pull）。你向`Type`请求信息（例如，调用`.GetMethods()`，它才会去加载并返回 | “展”（Expose）API。类型的信息已经作为属性展示在`TypeInfo`对象上了 |
| 成员访问 | 通过方法获取数组成员（如`GetMethods()`, `GetProperties()`）| 通过属性获取集合成员（如`DeclaredMethods`, `DeclaredProperties`），这些集合是预计算好的 |
| 延迟加载 | √ 当你调用`GetMethod()`时，它才去计算并返回结果 | 概念上更倾向于提前计算。`TypeInfo`对象本身就承载着这些信息集合 |
| 主要使用场景 | 传统的.NET Framework应用 | .NET Core+、.NET 5+、UWP、Xamarin等现代应用模型。特别是依赖于`Microsoft.Extensions.DependencInjection`的应用（如ASP.NET Core）|

#### `System.Type`
##### 获取
1. `typeof`运算符：当你在编译时就知道类型时
```cs
Type stringType = typeof(string);
Type myClassType = typeof(MyClass);
```

2. `Object.GetType()`实例方法：当你有一个对象实例时
```cs
Person person = new Person();
Type personType = person.GetType(); // 获取 person 实例的运行时类型
```

3. `Type.GetType()`静态方法：当你只有类型的完全限定名称字符串时（最动态的方式）
```cs
// 格式：“命名空间.类名，程序集名”
Type type = Type.GetType("System.String, mscorlib"); // 获取string的类型
Type type2 = Type.GetType("MyNamespace.MyClass, MyAssembly");
```

##### 内容
`Type`类包含了海量的信息，以下分类列出最重要和最常用的部分
1. 类型标识信息（Identity Information）
这些属性告诉你这个类型“是谁”
  - `Name`：类型的名称（例如：`"String"`, `"List`1"）
  - `FullName`：类型的完全限定名，包括命名空间（例如：`"System.String"`, `System.Collections.Generic.List`1"）
  - `Namespace`：类型所属的命名空间（例如`"System"`）
  - `Assembly`：获取声明该类型的`Assembly`。非常重要，告诉你类型来自哪个.dll或.exe
  - `IsClass`, `InInterface`, `IsEnum`, `IsValueType`, `IsPrimitive`（如`int`, `bool`）：一系列布尔属性，用于判断类型的种类
  - `BaseType`：获取该类型直接继承的父类的`Type`。这是实现继承树遍历的基础

2. 成员discovery（发现成员）
这是反射最核心的功能之一：获取类型的所有成员。这些方法通常返回`XXXInfo`类型的数组
  - `GetMethods()`：返回所有公共方法的`MethodInfo[]`
  - `GetProperties()`：返回所有公共属性的`PropertyInfo[]`
  - `GetFields()`：返回所有公共字段的`FieldInfo[]`
  - `GetEvents()`：返回所有公共事件的`EventInfo[]`
  - `GetConstructors()`：返回所有公共构造函数的`ConstructorInfo[]`
  - `GetMembers()`：返回所有公共成员的`MemberInfo[]`（是上述所有成员的基类）

以上方法通常有重载版本，接收`BindingFlags`枚举参数，让你能精确控制搜索范围（例如，查找私有成员、静态成员等）

3. 泛型信息（Generic Information）
对于泛型类型，`Type`提供了专门的处理
  - `IsGenericType`：判断是否是泛型类型（如`List<T>`）
  - `GetGenericTypeDefinition()`：获取泛型类型的未绑定版本的类型。例如，对于`List<string>`，调用子方法会返回`List<T>`的`Type`
  - `GetGenericArguments()`：获取泛型类型参数或泛型方法类型参数的`Type`数组。例如，对于`Dictionary<string, int>`，这会返回`[typeof(string), typeof(int)]`

4. 接口实现（Interface Implementation）
  - `GetInterfaces()`：获取该类型实现的所有接口的`Type[]`

5. 创建实例与获取特定成员
 - `Activator.CreateInstance(Type)`：虽然这不是`Type`的实例方法，但它是使用`Type`对象最常见的方式之一：动态创建该类型的实例
```cs
object myInstance = Activator.CreateInstance(myType);
```
  - `GetMethod(string name)`, `GetProperty(string name)`, `GetField(string name)`等：通过名称获取特定的成员，返回对应的`MethodInfo`, `PropertyInfo`等。这比遍历数组高效

6. 特性（Attributes）信息
  - `GetCustomAttributes()`：获取应用于此类型的所有自定义特性（Attribute）。这是实现“约定由于配置”模式的基础
```cs
var attributes = myType.GetCustomAttributes(typeof(ObsoleteAttribute), false);
if (attribute.Length > 0) Console.WriteLine("This class is obsolete!")
```

7. 判断类型特征属性（`Isxxx`）
**类型本质**

| 属性                   | 说明                         | 示例                                                      |
| -------------------- | -------------------------- | ------------------------------------------------------- |
| `IsClass`            | 是否为类（不含接口、值类型）             | `typeof(string).IsClass → true`                         |
| `IsInterface`        | 是否为接口                      | `typeof(IDisposable).IsInterface → true`                |
| `IsValueType`        | 是否为值类型（struct/enum）        | `typeof(int).IsValueType → true`                        |
| `IsEnum`             | 是否为枚举                      | `typeof(DayOfWeek).IsEnum → true`                       |
| `IsPrimitive`        | 是否为基元类型（int, bool, char 等） | `typeof(int).IsPrimitive → true`                        |
| `IsArray`            | 是否为数组                      | `typeof(int[]).IsArray → true`                          |
| `IsPointer`          | 是否为指针类型                    | `typeof(int*).IsPointer → true`                         |
| `IsByRef`            | 是否为 `ref` 传递类型             | `typeof(int).MakeByRefType().IsByRef → true`            |
| `IsSubclassOf(Type)` | 是否为某类型的子类                  | `typeof(List<int>).IsSubclassOf(typeof(object)) → true` |


**类修饰符相关**

| 属性            | 说明                   | 示例                                 |
| ------------- | -------------------- | ---------------------------------- |
| `IsAbstract`  | 是否为抽象类/抽象方法          | `typeof(Stream).IsAbstract → true` |
| `IsSealed`    | 是否为密封类（sealed）       | `typeof(string).IsSealed → true`   |
| `IsPublic`    | 是否为公共类型              | `typeof(string).IsPublic → true`   |
| `IsNotPublic` | 是否为非公共类型             | 内部类等                               |
| `IsVisible`   | 是否对外可见（公共并且程序集可见性允许） |                                    |

**嵌套类可见性**\
当类型时嵌套类才有意义

| 属性                    | 说明                             |
| --------------------- | ------------------------------ |
| `IsNestedPublic`      | 公共嵌套类                          |
| `IsNestedPrivate`     | 私有嵌套类                          |
| `IsNestedFamily`      | `protected` 嵌套类                |
| `IsNestedAssembly`    | `internal` 嵌套类                 |
| `IsNestedFamANDAssem` | `protected internal` 且要在同一程序集中 |
| `IsNestedFamORAssem`  | `protected internal` 或程序集可见    |


**泛型相关**

| 属性                          | 说明                | 示例                                                       |
| --------------------------- | ----------------- | -------------------------------------------------------- |
| `IsGenericType`             | 是否为泛型类型           | `typeof(List<int>).IsGenericType → true`                 |
| `IsGenericTypeDefinition`   | 是否为开放泛型定义         | `typeof(List<>).IsGenericTypeDefinition → true`          |
| `IsConstructedGenericType`  | 是否为已构造泛型（有具体类型参数） | `typeof(List<int>).IsConstructedGenericType → true`      |
| `ContainsGenericParameters` | 是否还包含未绑定的泛型参数     | `typeof(Dictionary<,>).ContainsGenericParameters → true` |
| `IsGenericParameter`        | 是否为泛型参数本身         | 在 `T` 这样的泛型占位符时才为 true                                   |


**高级/特殊情况**

| 属性                                                                        | 说明                           |
| ------------------------------------------------------------------------- | ---------------------------- |
| `IsCOMObject`                                                             | 是否为 COM 对象类型                 |
| `IsMarshalByRef`                                                          | 是否为按引用封送（Remoting 相关）        |
| `IsSecurityCritical` / `IsSecuritySafeCritical` / `IsSecurityTransparent` | 与安全模型相关                      |
| `IsSerializable`                                                          | 是否可序列化                       |
| `IsImport`                                                                | 是否使用 `ComImportAttribute` 标记 |

#### `TypeInfo`
##### 获取
```cs
using System.Reflection;

Type type = typeof(string); // 先获取普通Type对象

TypeInfo typeInfo = type.GetTypeInfo(); // 通过Type对象获取增强视图TypeInfo

Console.WriteLine(typeInfo.FullName);
foreach (var method in typeInfo.DeclaredMethods)
    Console.WriteLine(method.Name);
```
这是一种优雅的向后兼容策略。现有的代码仍然使用`Type`，完全不受影响。而新的、面向现代平台的代码可以轻松地切花电脑更强大的`TypeInfo`API
##### 内容
`TypeInfo`不仅包含了`Type`的所有功能（通过其基类），还添加了更符合逻辑的分组和查询方式
1. 声明成员（Declared Members）
返回直接在该类型上声明的成员，而不是从基类继承来的
  - `DeclaredMethods`
  - `DeclaredProperties`
  - `DeclaredFields`
  - `DeclaredConstructors`
  - `DeclaredEvents`
  - `DeclaredNestedTypes`

2. 更清晰的继承链分析
  - `BaseType`属性仍然存在（来自`Type`），直接获取基类
  - `ImplementedInterfaces`：获取该类型实现的所有接口的集合(`IEnumerable<Types>`)，这比`Type.GetInterfaces()`返回数组更现代，更适合LINQ操作

3. 泛型信息的扩展
  - `GenericTypeParameters`：对于泛型类型定义（如`List<T>`），获取其泛型参数列表（`T`的`Type`数组）。这与`Type.GetGenericArguments()`行为类似，但集成在`TypeInfo`的API中
  - `GenericTypeArguments`：对于构造的泛型类型（如`List<string>`），获取其类型实参（`string`的`Type`数组）
  - `IsGenericTypeDefinition`：判断是否是泛型类型定义

4. Attributes信息
  - `GetCustomAttributes()`：虽然`Type`也有此方法，但`TypeInfo`上的版本更好地集成在了新的反射模型中，用于检查应用于该类型的特性

5. 程序集和模块信息
  - `Assembly`：获取声明该类型的程序集（`Assembly`）
  - `Module`：获取声明该类型的模块（`Module`）。模块是程序集内部的子结构

##### 核心价值
1. 声明视图：提供了`DeclaredXxx`属性，让你能专注于类型自身声明的成员，过滤掉继承的“噪音”，这是它相对于直接使用`Type`的`GetMethods()`等方法的巨大优势
2. LINQ友好：其属性大多返回`IEnumerable<T>`集合，可以无缝于LINQ查询集成，使得对类型元数据的查询、过滤和投影操作变得非常简洁和强大
3. 现代API设计：它代表了.NET反射和API的现代化方向，更侧重于暴露数据而不是通过方法调用获取数据，这更符合.NET Core的轻量级和可组合性理念
4. 功能完备：因为它继承自`Type`，所以可以在任何需要`Type`对象的地方使用`TypeInfo`，同时还能享受这些新增功能的强大

在现代.NET开发中（.NET5+），当需要进行复杂的类型内省时，`TypeInfo`应该是首先工具，而传统的`Type`方法则更适合简单的、一次性的反射操作

### `System.Reflection`
`System.Reflection`是.NET Runtime的一个内省（introspection）和交互工具包，提供了程序在运行时检查、发现和操作程序集、模块、类型及其成员的所有能力

这个命名空间包含的类的能力：
1. 加载和分析程序集（`Assembly`）
2. 检查和遍历类型结构（`Type`, `TypeInfo`）
3. 操作类型成员：方法、属性、字段、构造函数、事件等
5. 处理泛型和自定义特性

#### 关键类和结构
##### `Assembly`
程序集的代表。反射的起点之一。可以用它来加载程序集、获取其中定义的所有类型、获取程序集信息（名称、版本、文化等）
`Assembly.LoadFrom("MyLibrary.dll")`：从文件路径加载程序集
`Assembly.GetExecutingAssembly()`：获取当前正在执行的代码所在的程序集
`assembly.GetTypes()`：获取程序集中定义的所有类型

##### `Module`
代表程序集内的一个模块(.netmodule)。程序集由一个或多个模块组成，但在日常开发中很少使用，通常一个程序集就是一个模块

##### `Type` & `TypeInfo`
类型的代表。这是反射最核心的类，包含了关于类型的所有元数据。`TypeInfo`是`Type`的扩展视图，在现代.NET中提供更丰富的API

##### `MemberInfo`派生类
这些类提供了对类型成员的具体操作能力，它们都继承自`MemberInfo`
- `ConstructorInfo`：提供了关于构造函数的信息。用于动态创建对象实例
  - `constructor.Invoke(new object[] { arg1, arg2 })`：调用构造函数创建对象
- `MethodInfo`：提供关于方法的信息。用于动态调用方法
  - `method.Invoke(obj, new object[] { param1 })`：在对象`obj`上调用此方法
- `PropertyInfo`：提供关于属性的信息。用于动态获取或设置属性值
  - `prop.GetValue(obj)`/`prop.SetValue(obj, value)`
- `FieldInfo`：提供关于字段（成员变量）的信息。用于动态读取或写入字段值，甚至可以访问`private`字段
  - `field.GetValue(obj)`/`field.SetValue(obj, value)`
- `EventInfo`：提供关于事件的信息。用于动态添加或移除事件处理程序
  - `eventInfo.AddEventHandler(obj, handler)`
- `ParameterInfo`：提供关于方法参数的信息

##### 其他
- `BindingFlags`：用于精确控制如何搜索和返回成员。例如，可以指定要搜索`public`/`non-public`、`static`/`instance`成员
  - `BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly`
- `CustomAttributeExtensions`：提供扩展方法（如`GetCustomAttribute()`）来检索应用于类型或成员的自定义特性
- `TargetException`, `TargetParamterCountException`等：反射操作失败时抛出的特定异常
- `IsDefined`：判断某个特性是否应用在类型或成员上
  - 所在类型
    - `MemberInfo.IsDefined(Type attributeType, bool inherit)`
    - `ParameterInfo.IsDefined(Type attributeType, bool inherit)`
    - `Module.IsDefined(Type attributeType, bool inherit)`
    - `Assembly.IsDefined(Type attributeType, bool inherit)`
  - 返回值：`bool`

### `System.Reflection.Emit`
`System.Reflection`的作用是检查和分析已有代码元数据，`System.Reflection.Emit`就是让在运行时动态地创建和生成全新的代码\
它提供了在内存中或磁盘上动态构建新Assembly、Module、Type and Method的能力，甚至可以直接生成IL指令

#### 核心思想：运行时代码生成
不是在VS里写C#代码然后编译成`.dll`，而是用C#代码编写一个程序，这个程序本身会像一个编译器一样，在运行时输出另一个`.dll`或在内存中创建一个新的类型。这就是`Reflection.Emit`所做的事

#### 关键类
这个命名空间包含一整套用于按层次结构构建程序集的类

##### `AssemblyBuilder`, `ModuleBuilder`
- `AssemblyBuilder`：代表一个正在构建中的动态程序集。这是所有动态代码生成的起点。可以选择将其保存到磁盘上的一个`.dll`或`.exe`文件，或者仅仅在内存中创建它
  - 通过`AppDomain.DefineDynamicAssembly`（旧版）或`AssemblyBuilder.DefineDynamicAssembly`（.NET Core+）创建
- `ModuleBuilder`：代表动态程序集内的一个模块。程序集由一个或多个模块组成。必须在模块内定义类型
  - 通过`AssemblyBuilder.DefineDynamicModule`创建

##### `TypeBuilder`, `EnumBuilder`
- `TypeBuilder`：用于在模块内定义新的类、接口、结构体。可以指定其名称、可见性、父类、实现的接口等
  - 通过`ModuleBuilder.DefineType`创建
- `EnumBuilder`：用于定义枚举类型。是`TypeBuilder`的一种特化形式

##### `MethodBuilder`, `ConstructorBuilder`, `FieldBuilder`, `PropertyBuilder`, `EventBuilder`
这些类用于为动态类型添加成员你
- `MethodBuilder`：用于在动态类型上定义方法。可以指定方法名、参数、返回类型、可见性等
- `ConstructorBuilder`：用于定义构造函数（`.ctor`）和静态构造函数（`.cctor`）
- `FieldBuilder`：用于定义字段（成员变量）
- `PropertyBuilder`：用于定义属性（包括`get`和`set`访问器）
- `EventBuilder`：用于定义事件

##### `ILGenerator`
编写实际代码，这是最底层的，当使用`MethodBuilder`或`ConstructorBuilder`定义了方法的签名后，需要一个`ILGenerator`来填充方法的实际逻辑
- `ILGenerator`这个类提供了发出（Emit）IL操作码的方法。IL是.NET的底层指令集
  - 通过`MethodBuilder.GetILGenerator()`获取
  - 使用其方法如`Emit(OpCode)`、`EmitWriteLine`来生成指令
  - 试用期方法来定义标签（`DefineLabel`）、声明局部变量（`DeclareLocal`），实现流程控制（如`if`判断、循环）

常见的IL指令示例
- `OpCodes.Ldarg_0`：加载第0个参数（对于实例方法，通常是`this`）
- `OpCodes.Ldstr`：加载一个字符串
- `OpCodes.Call`：调用一个方法
- `OpCodes.Ret`：从方法返回
- `OpCodes.Newobj`：调用构造函数创建新对象
- `OpCodes.Stfld`：将值存储到对象的字段中

#### 主要用途和应用场景
1. 动态代理（AOP - Aspect-Oriented Programming）
  - 框架如Castle DynamicProxy就是基于`Reflection.Emit`构建的。它们能在运行时生成一个继承自目标类或实现目标接口的代理类，并在调用实际方法前后插入代码（如日志、事务、缓存等）
2. ORM和序列化器的动态实现
  - 为了极致性能，ORM（如Dapper的高阶用法）可以动态生成一个专门用于映射特定实体类和数据行的代码，避免使用反射带来的开销
3. 编译器或脚本引擎
  - 动态语言（如IronPython, IronRuby）的.NET实现使用它来将脚本代码编译成.NET程序集
  - 你自己的领域特定语言（DSL）解释器
4. 动态生成高性能代码：
  - 对于某些复杂的、基于配置的算法，可以动态生成最优化的IL代码，这比通过反射调用或解释配置要快得多

#### 总结
`System.Reflection.Emit`是一个极其强大但也非常复杂的底层API。它让你从”代码的消费者”变成了“代码的生产者”
- 优点：无与伦比的灵活性和性能潜力
- 缺点：
  - 难：需要理解.NET类型系统、CLR内存模型和IL指令
  - 难以调试：生成的IL代码很难调试和诊断
  - 脆弱：生成的代码如果出错，通常会在运行时导致可怕的`InvalidProgramException`

因此，绝大多数普通开发者不会直接使用它，而是使用基于它构建的高级库。它的主要用户是框架、库和编译器开发者

### `System.Reflection.Metadata`
`System.Refelction.Metadata`是一个更现代、更轻量级、更高性能的用于读取.NET程序集元数据的API。它提供了对ECMA-335(.NET程序集标准格式)的低级访问

#### 核心思想：低级、只读、高性能
与`System.Reflection`不同，`System.Reflection.Metadata`：
1. 只读（Read-Only）：它只用于读取元数据，不能用于动态创建或修改类型（那是`System.Reflection.Emit`的工作）
2. 低级（Low-Level）：它不提供高层的抽象（如`Type`，`MethodInfo`对象），而是提供对元数据表、对、Blob的直接访问。需要自己组装出需要的信息
3. 高性能（High-Performance）：因为它避免了创建大对象（如为每个方法创建一个`MethodInfo`实例）和复杂的逻辑，所以它的速度极快，内存占用极低
4. 无负载（No Load）：它不会将程序集假爱到当前的`AppDomain`或`AssemblyLoadContext`中。它只是直接解析程序集的字节流。这意味着它更安全，不会导致程序集冲突或锁定文件

#### 关键概念和核心类
要理解这个命名空间，需要先了解ECMA-335元数据格式的几个核心概念
- 元数据表（Metadata Tables）：程序集元数据被组织成一系列的表，例如`TypeDef`表（类型定义）、`MethodDef`表（方法定义）、`FieldDef`表（字段定义）等。每张表都由许多行组成
- 句柄（Handles）：这是`System.Refelction.Metadata`的核心标识符。它是对元数据表中某一行的一个轻量级、高效的引用（类似于数据库中的行ID）。例如`TypeDefinitionHandle`, `MethodDefinitionHandle`。使用句柄来从阅读器中获取具体数据
- Blob & Heap：字符串、签名、常量值等数据不是直接存储在表里，而是存储在特殊的堆（Heap）区域中，表里只能存储一个指向堆的偏移量（Blob Pointer）

##### `MetadataReader`
这是整个API的核心和入口点。通过它来访问程序集的所有元数据
- 如何创建：通过一个`byte[]`（程序集的字节）或`Stream`（指向程序集文件的流）来创建`PEReader`，然后再从`PEReader`获取`MetadataReader`
- 功能：它提供了属性和方法来访问所有的元数据表、解析句柄、读取字符串等

##### `XXXDefinition`和`XXXDefinitionHandle`
对于每种元数据元素，通常有一对类：
- `XXXDefinition`：包含该元素的实际数据（如`TypeDefinition`包含类型的特性、名称、基类等）
- `XXXDefinitionHandle`：用于获取对应`XXXDefinition`的句柄

例如：
- `TypeDefinition` & `TypeDefinitionHandle`
- `MethodDefinition` & `MethodDefinitionHandle`
- `FieldDefinition` & `FieldDefinitionHandle`
- `AssemblyDefinition` & `AssemblyDefinitionHandle`

##### 其他重要类型
- `EntityHandle`：所有具体句柄（如`TypeDefinitionHandle`）的基类
- `BlobReader`：用于读取Blob堆中的二进制数据（例如方法签名）
- `StringReader`：用于从字符串堆中读取字符串

如果用传统的`System.Reflection`，代码会简单得多：`Assembly.LoadFrom("MyLibrary.dll").GetTypes()`。但代价是加载了整个程序集，消耗了更多资源和时间

#### 主要用途和应用场景
1. 编译器和分析器（Roslyn）
  - .NET编译器平台（Roslyn）本身大量使用此API来快速分析代码和元数据，而无需加载所有程序集
2. 高级代码分析工具
  - 需要快速扫描大量程序集以生成依赖关系图、查找特定模式、检查代码规范的工具。因为它的低内存开销，可以同时处理成百上千个程序集
3. IDE功能
  - Visual Studio 或 VS Code中的"Go to Definition"、"Find All References"、智能感知（IntelliSense）等功能需要在后台快速读取元数据，这个API是理想选择
4. 序列化器/映射器的高级优化
  - 类似于`Reflection.Emit`的用途，但这里是用于分析而非生成。一个库可以在启动时使用`System.Reflection.Metadata`快速分析所有需要序列化的类型结构，然后为它们动态生成（通过`Emit`）最优化的序列化代码
5. 安全的元数据检查
  - 当需要检查一个程序集的信息（版本、公开类型等），但又绝对不想把它加载到应用程序域中执行时（处于安全或隔离考虑），这是完美工具

### 原类型如何避免被反射
1. `SecurityCritical`和`SecuritySafeCritical`特性（在部分信任环境中）
在旧的.NET Framework代码访问安全（CAS）模型中，可以将代码标记为安全关键的，这会在部分信任的沙箱环境中阻止非特权代码通过反射进行访问。不过，这套模型在现代.NET中已经被认为过时且很少使用

2. 运行时检查并拒绝
理论上，可以在属性的`setter`或方法里检查是谁在调用它。`.NET`提供了`StackTrace`和`CallingAssembly`等类来检查调用堆栈
```cs
public string SecretPassword
{
  set
  {
    var stackTrace = new StackTrace();
    var callingMethod = stacckTrace.GetFrame(1)?.GetMethod();

    // 如果调用者是通过反色和来的，可以拒绝
    if (callingMethod?.Name == "Invoke" && callingMethod.DeclaringType?.Name == "RuntimeMethodInfo")
    {
      throw new InvalidOperationException("Direct assignment only! No reflection allowed!");
    }
    _secretPassword = value;
  }
}
```
但是这种方法非常脆弱、有性能开销，而且很容易被绕过（例如，反射调用底层私有字段`_secretPassword`就直接绕过了这个属性setter），因此极不推荐

## 反射在Unity中的使用

## 性能优化
### 反射与委托结合

### 反射与泛型结合

### 反射与LINQ结合

## 最佳实践

## 底层原理

### 底层理解

### `MethodInfo.Invoke`, `Property.SetValue`, `Property.GetValue`

### 反射链路