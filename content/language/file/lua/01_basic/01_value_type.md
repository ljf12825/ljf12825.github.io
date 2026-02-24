---
title: Value&Type
author: ljf12825
date: 2026-02-23
type: file
summary: type, value and conversion in lua
---

## Value

Lua是一种动态类型语言，变量本身没有类型，只有值才有类型。语言中不存在类型定义。所有值都携带自身的类型

在C/C++里

```cpp
int a = 10;
```

变量`a`有类型`int`

但在Lua里

```lua
a = 10
a = "hello"
```

变量`a`本身没有类型，它只是“引用某个值”\
真正有类型的是值

这就叫动态类型 + 值携带类型

Lua中的所有值都是一等公民，这意味着所有值都可以

- 存储在变量中
- 作为参数传递给其他函数
- 作为函数结果返回

## Type

Lua有八种基本类型

| 类型 | 说明 | 语义 |
| - | - | - |
| nil | 空值 | 值类型 |
| boolean | 布尔 | 值类型 |
| number | 数字 | 值类型 |
| string | 字符串 | 值类型 |
| function | 函数 | 引用类型 |
| userdata | 用户数据 | 引用类型 |
| thread | 协程 | 引用类型 |
| table | 表 | 引用类型 |

- 值类型复制会拷贝
- 引用类型只复制“引用”

Lua的类型系统是极简的，没有类、结构体、枚举、模板，只靠table + metatable实现\
弱类型会自动转换

```lua
"10" + 5  -- 会自动转number
```

```lua
"abc" + 1  -- 会报错
```

### nil

类型nil只有一个值：nil

它的主要特性是与任何其他值都不同；它通常表示“没有有用的值”

表中不存在的key也是`nil`

```lua
if a then
```

nil和false都会使条件判断结果为false；它们统称为“假值（false values）”。任何其他值在条件判断中都为true（包括0和""）

尽管其名称如此，false经常被用作nil的替代值，不同之处在与

- false在table中表现为普通值
- nil在table中表示键不存在

### boolean

`true`, `false`

### number

类型number表示整数和实数（浮点数），通过两个子类型实现

- integer
- float

```lua
a = 10    -- 整数
b - 3,14  -- 浮点
```

Lua会自动区分

标准Lua使用

- 64位整数
- 双精度（64位）浮点数

也可以编译Lua使其使用

- 32位整数
- 和/或单精度（32位）浮点数

这对小型机器和嵌入式系统友好

除非另有说明，整数运算发生溢出时会按照补码算术的常规规则回绕，换句话说，实际结果是\
在整数类型位数为n的情况下，与数学结果在模2^n意义下相等的唯一可表示整数

Lua对每个子类型何时使用有明确规则，但也会在需要时自动在整数和浮点数之间转换\
因此，程序员可以

- 基本忽略整数与浮点的区别
- 或完全控制每个数值的表示形式

### string

```lua
a = "hello"
b = 'world'
c = [[多行字符串]]
```

特点：

- 不可变
- 自动内存管理
- 支持自动字符串数字转换

```lua
print("10" + 20)  --> 30
```

### function

Lua可以调用（并操作）用Lua编写的函数以及用C编写的函数，两者都由类型function表示

函数是第一类值，可以

- 赋值
- 传参
- 返回
- 存入table

```lua
function add(a, b)
    return a + b
end

f = add
print(f(1,2))
```

### userdata

类型userdata用于允许任意C/C++数据存储在Lua变量中

userdata值表示一块原始内存

有两种userdata

- full userdata：由Lua管理其内存的对象
- light userdata：仅仅是一个C指针值

这是给C/C++绑定用的，比如

- 游戏引擎对象
- C++结构体
- 外部资源句柄

Lua里只保存“引用”


### thread

Lua的thread不是OS线程，而是协程（coroutine）

```lua
co = coroutine.create(function()
    print("hello")
end)
```

协程是Lua控制流的核心机制之一

### table

Lua里几乎一切抽象都用table实现

- 数组
- 字典
- 对象
- 类
- 模块

```lua
t = {}
t[1] = 100
t["name"] = "ljf"
```

Lua的table是混合数组 + 哈希表，而且是引用类型

```lua
a = {}
b = a
b.x = 10
print(a.x) --> 10
```

## 类型转换

- 自动转换(Coercion)
  - Lua在运行时会对字符串和数字进行有限的自动转换，主要发生在算术运算和字符串链接上
  - 规则：
    - 算术运算`+ - * / % ^`中，如果操作数中存在字符串，会尝试将其转换为数字
    - 字符串链接 `..` 中，如果操作数中存在数字，会尝试将其转换为字符串
  - 注意：自动转换只对合法的数字格式字符串有效。像`"abc" + 1`这样的操作会直接引发运行时错误
- 显式转换
  - 推荐使用显式转换来避免歧义和错误
  - `tonumber(x)`：将值`x`转换为数字，失败则返回`nil`
  - `tostring(x)`：将值`x`转换为字符串

## 类型检测

`type()`函数是进行类型检测的唯一内置方式，它以字符串形式返回传入值的类型名称

示例

```lua
print(type(10))     --> number
print(type("abc"))  --> string
print(type({}))     --> table
```
