---
title: Indexer
date: 2025-06-01
author: "ljf12825"
type: file
summary: C# indexer
---

在C#中，索引器(Indexer)允许对象像数组一样用下标`[]`访问内部数据\
**它提供一种更直观、更简洁的方式来访问类或结构体内部封装的数据元素，尤其是包含集合或数组的类**\
它本质上是类结构体定义的一个特殊属性（property），通过下标访问成员
> 核心思想：让对象具备“array-like”的行为


### 基本语法
索引器的声明类似于属性，但它使用`this`关键字，并且在方括号中指定参数
```cs
access_modifier return_type this[parameter_type parameter, ...]
{
    get 
    { 
        // 返回与提供参数对应的值
    }
    set
    {
        // 设置于提供参数对应的值
    }
}
```
- `access_modifier`：访问修饰符
- `return_type`：索引器返回值的类型
- `this`：关键字，指代当前类的实例
- `parameter_type parameter`：索引参数，可以是任何类型。最常见的是`int`（像数组下标）或`string`（像字典的键）。可以有多个参数，实现多维索引
- `get`访问器：当读取对象`obj[index]`时被调用，必须返回`return_type`类型的值
- `set`访问器：当向对象`obj[index] = value`写入时被调用。它有一个隐式的参数`value`，其类型为`return_type`


### 示例
封装一个数组
```cs
public class DataBox
{
    private int[] _data = new int[10]; // 内部私有数组

    // 索引器：使用 int 作为索引
    public int this[int index]
    {
        get
        {
            // 可以进行边界检查，这是封装的一大优势
            if (index < 0 || index >= _data.Length)
                throw new IndexOutOfRangeException("Index is out of range");
            
            return _data[index];
        }
        set
        {
            if (index < 0 || index >= _data.Length)
                throw new IndexOutOfRangeException("Index is out of range");
            
            _data[index] = value;
        }
    }

    // 一个返回内部数组长度的方法
    public int Length => _data.Length;
}

class Program
{
    static void Main(string[] args)
    {
        DataBox box = new DataBox();

        // 使用索引器设置值 (调用 set 访问器)
        box[0] = 42;
        box[1] = 100;
        box[2] = 15;

        // 使用索引器获取值 (调用 get 访问器)
        for (int i = 0; i < 3; i++)
        {
            Console.WriteLine($"box[{i}] = {box[i]}");
        }

        // 输出：
        // box[0] = 42
        // box[1] = 100
        // box[2] = 15
    }
}
```
优势：在`get`和`set`访问器中添加了边界检查，这是直接暴露公共数组无法轻易做到的

### 特性
1. 索引器的参数类型不限于整数
示例：以字符串作为索引，模拟字典的行为
```cs
public class StringKeyCollection
{
    private Dictionary<string, string> _dictionary = new Dictionary<string, string>();

    // 索引器：使用 string 作为键
    public string this[string key]
    {
        get
        {
            // 如果键不存在，返回一个默认值，而不是抛出异常
            _dictionary.TryGetValue(key, out string value);
            return value;
        }
        set
        {
            _dictionary[key] = value;
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        StringKeyCollection collection = new StringKeyCollection();

        collection["name"] = "Alice";
        collection["name"] = "C#";

        Console.WriteLine(collection["name"]); // Alice
        Console.WriteLine(collection["language"]); // C# 
        Console.WriteLine(collection["age"]); // 空字符串
    }
}
```

2. 多维索引器
通过提供多个参数，可以实现多维索引器
```cs
public class Matrix
{
    private int[,] _matrix = new int[3, 3];

    // 多维索引器
    public int this[int row, int col]
    {
        get {  return _matrix[row, col]; } 
        set { _matrix[row, col] = value; }
    }
}

class Program
{
    static void Main(string[] args)
    {
        var matrix = new Matrix();

        for (int i = 0; i < 3; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                matrix[i, j] = i + j;
                Console.WriteLine(matrix[i, j]);
            }
        }
    }
}
```

3. 索引器重载
和普通方法一样，索引器也可以被重载。只要参数列表（参数的类型或数量）不同即可
```cs
public class OverloadedIndexer
{
    private int[] _intData = new int[10];
    private string[] _stringData = new string[10];

    // 通过 int 索引访问 int 数据
    public int this[int index]
    {
        get => _intData[index];
        set => _intData[index] = value;
    }

    // 通过 int 索引访问 string 数据 (重载)
    public string this[int index]
    {
        get => _stringData[index];
        set => _stringData[index] = value;
    }

    // 通过 string 索引访问 string 数据 (另一个重载)
    public string this[string name]
    {
        get { /* ... */ return ""; }
        set { /* ... */ }
    }
}
```

### 常见用途
- 封装集合：让自定义类像数组/集合一样使用
- 提供便捷访问：比如`Dictionary`、`List`、`DataTable`都依赖索引器
- 模拟多维数组：通过自定义索引器实现

示例：索引器与LINQ结合
```cs
public class LinqIndexer
{
    private List<Person> people = new List<Person>();

    // 通过ID索引
    public Person this[int id] => people.FirstOrDefault(p => p.Id = id);

    // 通过姓名索引
    public IEnumerable<Person> this[string name] => people.Where(p => p.Name = name);

    // 通过条件索引
    public IEnumerable<Person> this[Func<Person, bool> predicate] => people.Where(predicate);

    public void Add(Person person) => people.Add(person);
}

public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age( get; set; )
}

// 使用
var collection = new LinqIndexer();
collection.Add(new Person { Id = 1, Name = "Alice", Age = 25});
collection.Add(new Person { Id = 2, Name = "Bob", Age = 30});

var person = collection[1]; // 通过ID获取
var adults = collection[p => p.Age >= 18]; // 通过条件索引获取
```

### 底层与性能
```cs
// Source Code
public class MyCollection
{
    private string[] _data = new stirng[10];

    public string this[int index]
    {
        get { return _data[index]; }
        set { _data[index] = value; }
    }
}
```
编译后相当于
```cs
public class MyCollection
{
    private string[] _data = new string[10];

    // get 访问器变成 get_Item方法
    public string get_Item(int index)
    {
        return _data[index];
    }

    // set 访问器变成 set_Item方法
    public void set_Item(int index, string value)
    {
        _data[index] = value;
    }
}
```
IL代码层面
```il
// get 访问器
.method public hidebysig specialname instance string get_Item(int32 index) cil managed
// set 访问器  
.method public hidebysig specialname instance void set_Item(int32 index, string value) cil managed
```
- `specialname`：标记这是特殊用途的方法
- 命名模式：`get_Item`/`set_Item`是默认命名

性能考虑\
由于索引器在编译时就被转换成普通方法调用，所以没有运行时性能开销

### 最佳实践
1. 保持简单：索引器应该简单高效，避免复杂逻辑
2. 适当的错误处理：对无效索引提供合理的处理方式
3. 文档化：清楚地文档化索引的行为和异常
4. 一致性：保持索引器行为与类似集合的一致性
5. 性能考虑：对于大型集合，考虑使用更高效的数据结构