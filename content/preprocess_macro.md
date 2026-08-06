---
title: Preprocess & Macro
date: 2026-04-20
author: ljf12825
type: file
summary: C macro and preprocess
---

## 预处理

预处理是C编译流程的第一个阶段，它在真正的编译开始之前对源代码进行文本处理

C 代码从源文件到可执行文件经过四个步骤

```
源代码(.c)
   v
预处理（Preprocessing）
   v
编译（Compile）
   v
汇编（Assemble）
   v
链接（Link）
```

可以通过`gcc -E`命令观察预处理后的代码

```bash
gcc -E source.c -o source.i
```

可以发现`source.i`中的`#define`消失，`#include`被展开

### 预处理器

预处理器(Preprocessor)是编译前的“文本处理器”，它不理解语法，不理解类型，不执行代码，只做文本替换 + 条件裁剪

#### 预处理器指令

##### 文件包含 `#include`

两种查找策略



防递归包含的标准写法（头文件保护）

```c
// my_header.h
#ifndef MY_HEADER_H
#define MY_HEADER_H
// 头文件内容
#endif
```

或者更现代的写法（几乎所有编译器支持）

```c
#pragma once
```

##### 宏定义`#define`

对象宏（无参数）

```c
#define PI 3.14159
#define DEBUG_MODE // 定义为空，常用于条件编译
```

函数宏（带参数）

```c
#define SQUARE(x) ((x) * (x))
#define MAX(a, b) ((a) > (b) ? (a) : (b))
```

重要规则：函数宏的每个参数和整个表达式都要用括号包裹

```c
// 错误写法
#define BAD_SQUARE(x) x * x
int y = BAD_SQUARE(1 + 2); // 展开为 1 + 2 * 1 + 2 = 5，而不是 9

// 正确写法
#define GOOD_SQUARE(x) ((x) * (x))
```

`#define`的语法规定：宏定义必须在同一行内完成

```c
// 错误：预处理器认为宏定义在第一行就结束了
#define ASSERT(cond)
    do { ... } while(0) // 这部分被视为普通的C代码，不属于宏

// 正确：用 \ 告诉预处理器”这还没完，继续看下一行“
#define ASSERT(cond) \
    do { ... } while(0)
```

##### 宏取消 `#undef`

```c
#define TEMP 100
// 使用 TEMP
#undef TEMP
// 现在 TEMP 不再有定义
```

##### 条件编译 `#if`/`#ifdef`/`#ifndef`

这是跨平台代码的核心工具

```c
#ifdef _WIN32
    #include <windows.h>
    #define SLEEP(ms) Sleep(ms)
#elif defined(__linux__) || defined(__APPLE__)
    #include <unistd.h>
    #define SLEEP(ms) usleep((ms) * 1000)
#else
    #error "Unsupported platform"
#endif

// 版本控制
#if VERSION_MAJOR >= 2
    void new_api();
#else
    void old_api();
#endif

// 调试代码
#ifndef NDEBUG
    #define LOG(msg) printf("Debug: %s\n", msg)
#else
    #define LOG(msg) ((void)0) // 空操作
#endif
```

##### 特殊字符 `#` 和 `##`

字符串化运算符`#`：将参数转为字符串字面量

```c
#define STRINGIFY(x) #x
printf("%s\n", STRINGIFY(hello world)); // 输出 "hello world"
```

连接运算符 `##`：拼接两个符号

```c
#define CONCAT(a, b) a ## b
int CONCAT(my, Var) = 10; // 展开为 int myVar = 10;

// 实用案例：泛型函数生成
#define MAKE_GETTER(type, name) type get_##name() { return name; }
MAKE_GETTER(int, count) // 生成 int get_count()
MAKE_GETTER(char*, name) // 生成 char* get_name()
```

##### 预定义宏（编译器自动提供）

| 宏 | 含义 |
| - | - |
| `__FILE__` | 当前文件名（字符串）|
| `__LINE__` | 当前行号（整数）|
| `__DATE__` | 编译日期 |
| `__TIME__` | 编译时间 |
| `__FUNCTION__`/`__func__` | 当前函数名(C99) |
| `__STDC__` | 是否遵循ANSI C |
| `__cplusplus` | 在C++编译时定义 |

示例，一个调试日志宏的经典写法

```c
#define ASSERT(cond) \
    do { \
        if (!(cond)) { \
            fprintf(stderr, "Assertion failed: %s\nFile: %s, Line: %d\n", \
                    #cond, __FILE__, __LINE__); \
            abort(); \
        }\
    } while(0)
```

`\`反斜杠，是C预处理器的行连接符(Line Continuation)；它的核心作用是：把多行物理代码变成一行逻辑代码\
预处理器在扫描源代码时，如果看到`\`后紧跟着换行符，它会

1. 删除`\`
2. 删除紧跟其后的换行符
3. 把下一行的内容连接到当前行末尾

上述调试日志宏最终会变为

```c
#define ASSERT(cond) do { if (!(cond)) { fprintf(stderr, "Assertion failed: %s\nFile: %s, Line: %d\n", #cond, __FILE__, __LINE__); abort(); } } while(0)
```

严格的使用规则

1. `\` 必须是该行的最后一个字符，之后只能跟换行符
2. 换行符前不能有空格——如果`\`后面有空格，它连接的就是空格而不是下一行
3. 最后一行不需要`\`，因为定义到此结束

##### 其他指令

| 指令 | 作用 |
| - | - |
| `#error "message"` | 强制编译报错并停止 |
| `#warning "message"` | 产生警告但不停止（GCC/Clang扩展）|
| `#line 42 "fake.c"` | 修改`__LINE__`和`__FILE__`的值 |
| `#pragma` | 编译器特定指令 |

#### 宏使用指南

推荐行为

- 头文件保护用`#pragma once`或严格的`#ifndef`守卫
- 宏名全大写：`#define MAX_BUFFER_SIZE 1024`
- 多语句宏用`do { ... } while(0)`包裹
- 使用`#ifdef __cplusplus`处理C/C++混编

避免

- 不要用宏定义全局变量：`#define global extern`
- 不要在宏中忘记参数括号
- 不要写跨越多行但没有反斜杠的宏

## 宏

宏在C语言中有四种不可替代的用途，这些是函数、变量、类型都无法做到的事情

### 条件编译——一份代码，多平台运行

这是宏最重要的用途。没有宏，就要给各个平台分别维护一套代码

现实场景

- 操作系统API差异
- 编译Debug/Release不同版本
- 不同CPU架构的优化代码
- 功能裁剪（客户版 vs 旗舰版）

### 编译期常量与静态断言

```c
#define MAX_CONNECTIONS 1024
#define VERSION_MAJOR 2
#define VERSION_MINOR 1

// 编译期数组大小
char buffer[MAX_CONNECTTIONS];

// 编译期版本检查
#if VERSION_MAJOR < 2
    #error "This code requires version 2.0 or higher"
#endif
```

### 元编程——自动生成重复代码

#### 场景一：为多个类型生成相同的函数

```c
#define DEFINE_VECTOR(Type) \
    typedef struct { \
        Type* data; \
        size_t size; \
        size_t capacity; \
    } Vector ##Type; \
    \
    void vector_##Type##_push(Vector_##Type* v, Type value) { \
        // 实现 \
    }

// 一行生成两个完整的类型
DEFINE_VECTOR(int) // 生成 Vector_int, vector_int_push
DEFINE_VECTOR(double) // 生成 Vector_double, vector_double_push
```

#### 场景二：X-Macro技巧

```c
#define FRUIT_TABLE \
    X(APPLE, 0) \
    X(BANANA, 1) \
    X(ORANGE, 2)

// 生成枚举
enum Fruit {
    #define X(name, id) FRUIT_##name = id,
    FRUIT_TABLE
    #undef X
};

// 生成字符串数组
const char* fruit_names[] = {
    #define X(name, id) [id] = #name,
    FRUIT_TABLE
    #undef X
};
```

### 调试与日志——获取代码位置信息

```c
#define LOG_ERROR(msg) \
    fprintf(stderr, "[ERROR] %s:%d in %s(): %s\n", \
            __FILE__, __LINE__, __func__, msg)

// 使用
LOG_ERROR("Failed to open file");
// 输出：{ERROR} main.c:42 in main(): Failed to open file
```

`__FILE__`, `__LINE__`, `__func__`是编译器在预处理阶段自动替换的，函数永远无法获取调用者的源代码位置

### 宏与函数

| 需求 | 宏 | 函数 |
| - | - | - |
| 获取调用位置（文件名、行号）| 可以 | 做不到 |
| 条件编译（平台/版本差异）| 可以 | 做不到 |
| 类型泛型（为多个类型生成代码）| 可以(`##` 拼接) | 需`_Generic`或C++模板 |
| 编译期常量（数组大小、case标签）| 可以 | 做不到 |
| 类型检查 | 无 | 有 |
| 调试可见 | 展开后消失 | 可单步进入 |
| 避免副作用 | 需小心 | 天然安全 |

宏的作用是：在编译前，用文本替换的方式，做到函数和变量永远做不到的事情\
能用函数/常量解决的，别用宏；只能用宏解决的（条件编译、元编程、调试信息），放心用

### 现代C的替代趋势

宏的部分功能正在被语言新特性取代，但核心场景仍然无法替代

| 宏的传统用法 | 现代替代方案 | 是否完全替代 |
| - | - | - |
| 定义常量 | `const`/`enum` | 完全替代 |
| 短小函数 | `inline`/`static inline` | 大部分替代 |
| 类型泛型 | `_Generic`(C11) | 部分替代，语法繁琐 |
| 条件编译 | 无 | 不可替代 |
| 符号拼接(`##`) | 无 | 不可替代 |
| 字符串化(`#`) | 无 | 不可替代 |
| 获取`__FILE__`/`__LINE__` | 无 | 不可替代 |

## 示例

- [条件编译：跨平台原子操作](https://github.com/ljf12825/c/tree/main/preproccess_macro/atomic_portable)
- [元编程：泛型数据结构生成](https://github.com/ljf12825/c/tree/main/preproccess_macro/generic_datastructure)
- [X-Macro：状态机自动生成](https://github.com/ljf12825/c/tree/main/preproccess_macro/x-macro_fsm)
- 断言调试
- 日志宏
- 编译期字符串拼接与常量生成













