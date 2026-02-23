---
title: Value&Type
author: ljf12825
date: 2026-02-23
type: file
summary: type and value in lua
---

## 值与类型

Lua是一种动态类型语言。这意味着变量本身没有类型；只有值慈爱有类型。语言中不存在类型定义。所有值都携带自身的类型

Lua中的所有值都是一等值(first-class values)。这意味着所有值都可以

- 存储在变量中
- 作为参数传递给其他函数
- 作为函数结果返回

Lua有八种基本类型

- nil
- boolean
- number
- string
- function
- userdata
- thread
- table

### nil & boolean

类型nil只有一个值：nil

它的主要特性是与任何其他值都不同；它通常表示“没有有用的值”

类型boolean有两个值：false和true

nil和false都会使条件判断结果为false；它们统称为“假值（false values）”。任何其他值在条件判断中都为true

尽管其名称如此，false经常被用作nil的替代值，不同之处在与

- false在table中表现为普通值
- nil在table中表示键不存在

### number

类型number表示整数和实数（浮点数），通过两个子类型实现

- integer
- float

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

类型string表示不可变的字节序列

Lua是“8位透明的(8-bit clean)”：字符串可以包含任何8位值，包括嵌入的零字符('\0')

Lua也是与编码无关的(encoding-agnostic)；它不对字符串内容做任何假设

Lua中任意字符串的长度必须能放入一个Lua整数，并且字符串加上一个小的头部结构必须能放入size_t

### function

Lua可以调用（并操作）用Lua编写的函数以及用C编写的函数，两者都由类型function表示

### userdata

类型userdata用于允许任意C数据存储在Lua变量中

userdata值表示一块原始内存

有两种userdata

- full userdata：由Lua管理其内存的对象
- light userdata：仅仅是一个C指针值

userdata在Lua中没有预定义操作，除了赋值和同一性测试


















