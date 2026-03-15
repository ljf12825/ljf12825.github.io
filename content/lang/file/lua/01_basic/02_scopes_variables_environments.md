---
title: Scopes, Variables, and Environments
author: ljf12825
date: 2026-02-23
type: file
summary: ..
---

## 变量类型

Lua中有三种变量：全局变量、局部变量和表字段

### 全局变量

在默认情况下，在代码中直接赋值的变量默认都是全局变量

- 特点
  - 无需声明：不需要`local`声明直接赋值即创建（或更新）
  - 全局可见：一旦定义，在整个程序运行的任何地方（只要在赋值之后）都可以访问它
  - 生存周期：从被赋值开始，直到程序结束。如果没有任何地方再引用它，Lua的垃圾回收器最终会回收其内存，但它所代表的名字本身是全局存在的

```lua
-- 定义一个变量
g = 100

function foo()
    -- 在函数内部访问和修改全局变量
    g = g + 10
    print("inside foo, g =", g) -- 输出：inside foo, g = 110
end

foo()
print("outside, g =", g) -- 输出：outside, g = 110

-- 再定义一个全局变量
a = 1
b = 2

function bar()
    -- 这里没有使用local声明，所以c也是全局变量
    c = a + b
    print("c =", c) -- 输出：c = 3
end

bar()
print(c) -- 输出3
```

全局变量存储在一个叫做`_G`的全局表中。访问全局变量`x`本质上等于访问`_G["x"]`

```lua
x = 10 -- 全局变量，存在_G.x中
print(_G["x"]) -- 输出 10
```

全局变量在整个程序运行期间都存在，未赋值前值为`nil`

### 局部变量

用`local`声明，作用域限定在声明所在的块(block)内

- 特点
  - 需要显式声明：必须用`local`关键字
  - 作用域有限：它的可见范围仅限于声明它的代码块（如一个函数体、一个`do ... end`块，一个`for`循环体等）以及该块的内嵌块
  - 生存周期：与其作用域一致。进入作用域时分配内存，离开作用域时（或者变得不可达时）即成为垃圾回收器的回收目标
  - 访问速度更快：因为局部变量存储在寄存器（虚拟机的）中，访问速度比存储在全局中的全局变量快
  - 避免命名冲突：合理使用局部变量是编写高质量、无副作用的代码的关键

```lua
local a = 1

do
    local a = 2 -- 新的局部变量，遮蔽外层的 a
    print(a) -- 2
end

print(a) -- 1，内层的 a 已超出作用域
```

局部变量的好处：访问速度更快（通过寄存器/栈访问，而非哈希表查找），并且避免污染全局命名空间

## 作用域（Scope）

Lua是词法作用域（Lexical Scoping），作用域在编译期确定，而非运行期

### Chunk

### 块(Block)

作用域以块为单位，以下结构都会产生新的块

- `do ... end`
- `if ... then ... end`
- `while ... do ... end`
- `for ... do ... end`
- `function ... end`

```lua
for i - 1, 3 do
    local x = i * 2 -- x 的作用域仅在 for 循环体内
end
-- print(x) -- error! x 已不可见
```

### 变量遮蔽（Shadowing）

内层块可以声明同名局部变量，遮蔽外层变量

```lua
local x = "outer"
do
    local x = "inner"
    print(x) -- inner
end
print(x) -- outer
```

### 闭包与上值（Upvalue）

这是Lua作用域最精妙的一点。当一个函数引用了外层函数的局部变量时，该变量就成为上值(upvalue)，函数与它捕获的上值共同构成闭包(closure)

```lua
function makeCounter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local c1 = makeCounter()
local c2 = makeCounter()

print(c1()) -- 1
print(c1()) -- 2
print(c2()) -- 1 c2 有自己独立的 count
```

同一个外层函数产生的多个闭包，共享同一个upvalue

```lua
function sharedUpvalue()
    local x = 0
    local function inc() x = x + 1 end
    local function get() return x end
    return inc, get
end

local inc, get = sharedUpvalue()
inc(); inc()
print(get()) -- 2, inc和get共享同一个 x
```

## Environment

环境这个概念在Lua5.1和5.2中有较大的变换。但核心思想是：环境是用来存储全局变量的地方

### 全局环境

Lua 5.1中，所有全局变量都存储在`_G`这个表里，这个表就是全局环境\
访问全局变量`print`等价于`_G.print`，Lua实际上是在`_G`表中查找键为`"print"`的值\
可以直接操作`_G`

```lua
-- 定义一个全局变量
_G["dynamicVar"] = 42
print(dynamicVar)

-- 以下两行是等价的
print("Hello")
_G["print"]("Hello")

```

也可以遍历所有全局变量

```lua
for k, v in pairs(_G) do
    print(k, v)
end
```

### 函数环境

可以改变一个函数（或一个chunk)的环境，让它在另一个环境中查找“全局”变量。这对于实现沙箱(sandbox)非常有用

### Lua5.1的`setfenv/getfenv`（历史）

- `getfenv([f])`：获取函数`f`的当前环境。如果不传参，则获取当前函数的环境
- `setfenv(f, table)`：将函数`f`的环境设置为`table`。`f`可以是函数本身，也可以是表示栈层级的数字（1表示当前函数，2代表调用者，以此类推）

```lua
-- Lua 5.1写法
local sandbox = {}
setfenv(1, sandbox) -- 将当前函数的环境设为 sandbox
x = 10 -- x 进入 sandbox, 而非 _G
```

### Lua5.2+的环境变化

Lua5.2移除了旧的`setfenv/getfenv`，改用`_ENV`机制\
它是一个局部变量，存储了当前chunk的“全局”环境\
每个函数都有一个隐式的上值`_ENV`，所有全局变量访问本质上都是对`_ENV`的字段访问\
可以通过覆盖`_ENV`来改变一个代码块的环境

```lua
-- 等价
x = 10
_EVN.x = 10
```

`_G`只是初始`_ENV`的默认值，可以替换`_ENV`来改变函数的“全局”环境

```lua
local myEnv = { print = print } -- 给新环境一个 print 函数

-- 通过local 指定环境
local f = load("x = 100; print(x)", "chunk", "t", myEnv)
f()
print(myEnv.x) -- 100
print(x) -- nil, x没有进入真正的 _G
```












