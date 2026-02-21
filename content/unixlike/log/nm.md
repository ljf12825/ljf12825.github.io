---
title: nm
date: 2025-12-31
categories: [GNU]
tags: [coreutils]
author: "ljf12825"
type: log
draft: false
summary: usage of gnu nm
---

`nm`是一个非常有用的命令行工具，用于查看目标文件（如`.o`, `.a`, `.so`, `.exe`等）中的符号表。符号表包含了目标文件中所有符号的信息，符号可以是变量、函数、数组等

## 功能概述

`nm`命令主要用于显示目标文件中符号的信息，包括符号的名称、类型、大小和地址等。通过这些信息，可以了解目标文件中定义和引用的符号，帮助进行调试、链接和优化等操作

## 符号表

符号表（Symbol Table）是编译器、链接器和调试器使用的一个数据结构，它包含了程序中所有符号（如变量、函数、常量等）的相关信息。符号表的主要作用是帮助程序员、编译器和链接器识别和管理程序中使用的符号，通常包括符号的名称、类型、地址、作用域等信息

### 符号表的组成

符号表的每个条目通常包含以下信息

1. 符号名称（Symbol Name）
每个符号在符号表中都有一个唯一的标识符（例如，函数的名称、全局变量的名称）
2. 符号类型（Symbol Type）
该符号的类型，如函数、变量、常量、标签等
3. 符号的作用域（Symbol Scope）
符号的作用域定义了它在程序中的可见性。作用域可以是局部的（例如函数内部的局部变量）或全局的（例如全局变量和函数）
4. 符号的存储位置（Storage Location）
对于变量或函数，这通常是其在内存中的位置。对于未定义的符号，存储位置可能是一个“占位符”，表示它将在链接过程中被解决
5. 符号的地址（Address）
符号在程序或目标文件中的地址（例如内存地址）。这个信息对于运行时的加载和执行非常重要
6. 符号的大小（Size）
对于某些符号（如变量和数组），符号表可能会记录它们的大小。对于函数符号，通常不记录大小
7. 符号的绑定性（Binding）
符号的绑定性决定了符号是否可以被其他代码共享。例如，全局符号是“可重定位”的，可以被其他模块引用，而局部符号只能在定义它的模块内使用
8. 符号的可见性（Visibility）
符号是“可见”的还是”不可见“的。例如在C语言中，`static`关键字使符号仅在本文件中可见

### 符号表在不同阶段的作用

1. 编译阶段
在源代码编译时，编译器会为每个符号生成符号表条目。编译器使用符号表来确保每个符号有正确的类型、作用域，并检查符号是否定义或声明正确
2. 汇编阶段
汇编器将生成符号表条目并生成目标文件（例如`.o`文件）。符号表会 包含所有局部而全局符号，部分符号可能会标记为”未定义“（如外部函数）
3. 链接阶段
链接器会合并来自不同目标文件的符号表，将所有符号链接在一起。它会检查未定义符号，并为这些符号分配地址。链接器还会处理全局符号和库的引用
4. 调试阶段
调试器使用符号表来查看程序的内部结构，帮助调试员查看变量值、函数调用栈等信息。调试器通常需要一个包含调试符号的符号表，这些符号表可能包含丰富的调试信息，如函数名称、变量名称和源代码行号。符号表能帮助调试器将机器代码映射回源代码的行号和函数名称，调试器能够从符号表中获得所有变量的名称、类型和当前值。符号表哦能够帮助调试器显示函数调用栈的内容，便于开发者追踪函数调用的顺序

### 符号表的分类

符号表通常根据生命周期和作用域分为几种类型
- 本地符号表：仅在某个源文件或函数内部可见的符号，如全局变量和局部函数
- 全局符号表：在整个程序中可见的符号，如全局变量和全局函数
- 外部符号表：在其他目标文件中定义的符号，但被当前目标文件引用（例如，外部函数或变量）。这些符号在编译时可能未定义，但在链接时会被解析

## 用法

```bash 
nm [option] <targetfile> 
```
例如，要查看一个目标文件`program.o`中的符号，可以运行

```bash 
nm program.o 
```
如果未指定文件，默认分析`a.out`

### 核心输出内容

对于每个符号，`nm`默认输出三列信息
1. 符号值/地址：以十六进制表示（默认），是符号在内存或节中的位置
2. 符号类型：一个字母，表示符号的性质和所在节
3. 符号名称：符号的标识符

### 符号类型详解

类型字母表明了符号的作用域、存储位置和特殊属性

- 小写字母：符号通常是局部（`local`）的，只在定义它的文件内可见（如`static`函数/变量）
- 大写字母：符号通常是全局（`global`）或外部（`external`）的，可以被其他目标文件引用

| 类型 | 描述 |
| - | - |
| `A` | 绝对值符号。链接时其值不变 |
| `B`, `b` | BSS段符号。存放未初始化或零初始化的静态/全局变量 |
| `C` | 公共符号（Common）。未初始化的全局变量（C语言）。链接时多个同名符号会合并 |
| `D`, `d` | 数据段符号。存放已初始化的静态/全局变量 |
| `T`, `t` | 代码段（Text）符号。通常是函数。`T`表示全局函数，`t`表示静态函数 |
| `U` | 未定义符号。在本文件使用但未定义，需要在其他文件中链接 |
| `R`, `r` | 只读数据段符号。存放常量（如字符串字面量，`const`全局变量 |
| `W`, `w` | 弱符号。已定义但链接时优先级低于强符号（同名时用强符号）|
| `V`, `v` | 弱对象符号（特定类型的弱符号）|
| `i` | 间接函数（ifunc）。GNU扩展，运行时解析的函数地址（用于优化）|
| `N` | 调试符号 |
| `?` | 未知类型或特殊格式符号 |


### 选项
1. 控制输出格式
    - `-f <格式>`：指定输出格式。`bsd`（默认），`sysv`（表格形式，更详细），`posix`（标准化格式），`just-symbol`（仅输出名称）
    - `-P`：使用`posix`格式（`-f posix`的简写）
    - `-t <基数>`：指定地址的基数。`d`（十进制），`o`（八进制），`x`（十六进制，默认）
    - `-S`, `--print-size`：在BSD格式下，同时打印符号的大小（对于数据和BSS段符号特别有用）
    - `-A`, `-o`：在每个符号前打印其所在的文件名，适用于分析多个文件
2. 控制符号筛选
    - `-g`, `--extern-only`：只显示外部（全局）符号
    - `-u`, `--undefined-only`：只显示未定义符号。用于检查缺少哪些依赖
    - `-U`, `--defined-only`：只显示已定义符号
    - `--no-weak`：不显示弱符号
    - `-a`：显示所有符号，包括调试符号（默认会过滤掉一些）
3. 控制排序方式
    - `-n`, `-v`：按符号的地址/值进行数值排序（默认按名称字母排序）
    - `-p`：不排序，按目标文件中的出现顺序输出
    - `-r`：反向排序（与当前排序顺序相反）
    - `--size-sort`：按符号的大小排序。需要与`-S`配合查看大小
4. 符号名称处理
    - `-C`, `--demangle`：还原（demangle）C++等语言的修饰名，将类似`_Z3foov`的符号变为可读的`foo()`。这是最常用的选项之一
    - `--no-demangle`：不还原修饰名（默认）
5. 附加信息显示
    - `-l`, `--line-numbers`：尽可能使用调试信息，显示符号对应的源文件名和行号
    - `-s`. `--print-armap`：当分析静态库（`.a`文件）时，显示库的符号索引（armap），即哪些符号在哪个目标文件(`.o`)中
    - `-D`, `--dynamic`：显示动态符号表（共享库中的符号），而不是常规符号表

### 示例
1. 查看可执行文件/库的接口
```bash 
nm -gC myprogram | grep " T "
```
列出所有全局函数

2. 检查为解决符号（链接错误）
```bash 
nm -uC *.o 
```
查看所有目标文件中未定义的符号

3. 查找特定符号的定义
```bash 
nm -AC libxxx.a | grep function_name
```
在静态库中查找哪个`.o`文件定义了某个函数

4. 分析符号大小
```bash 
nm -S --size-sort libxxx.so | tail -20
```
查看共享库中最大的20个符号

5. 分析C++二进制文件
```bash 
nm -nC a.out 
```
按地址排序并还原名称，便于查看函数局部

### 重要特性与说明
- 符号版本化：支持GNU扩展的符号版本控制，符号名后可能带有`@VERSION`或`@@VERSION`
- 间接函数（ifunc）：支持GNU的间接函数，可通过`--ifunc-chars`自定义显示字符
- 递归还原限制：为防止恶意名称导致栈溢出，对C++名称还原有递归深度限制（默认2048），可通过`--no-recurse-limit`禁用（不推荐）
- 插件系统：支持通过`--plugin`加载插件以分析非标准格式

### 用途

1. 查看符号信息
`nm`用于iechu目标文件中的所有符号信息。它显示每个符号的地址、符号类型、符号名等内容。这对于理解程序的结构和符号的布局非常有帮助

2. 调试和分析程序
在调试时，你可以使用`nm`查看程序中包含哪些符号（如函数和变量），并检查它们是否已正确定义或未定义（比如查看是否有未定义符号）。这对于提案是链接错误和运行时错误非常有用

3. 分析目标文件的符号类型
`nm`会根据符号类型对符号进行分类。这样你可以清楚地知道符号是函数、全局变量、弱符号还是未定义符号，甚至可以查看符号是否为调试符号或是被编译器生成的特殊符号

4. 查找未定义符号
通过使用`nm`查看目标文件，可以帮助你快速定位未定义的符号（通常标记为`U`），这有助于检查程序是否存在缺失的符号或错误的依赖关系

5. 分析静态库和共享库
对于静态库（`.a`文件）和共享库（`.so`文件）,`nm`可以帮助你查看库文件中的符号，了解该库提供了哪些函数和变量，以及它们是否已被正确导出

6. 查看符号版本
`nm`支持查看符号的版本信息（通过`--with-symbol-versions`选项）。这在使用动态链接库时特别有用，能够帮助你确保符号的版本兼容性

7. 检查符号冲突
当链接多个目标文件或库时，可能会发生符号冲突。`nm`可以帮助你检查哪些符号是全局符号，哪些是局部符号，从而帮助你调试符号冲突问题

### 示例
- test.c 主程序
```c 
#include <stdio.h>

/* 全局变量（将在不同的段中） */
int global_uninit;           /* BSS段 - 未初始化 */
int global_init = 100;       /* 数据段 - 已初始化 */
const int global_const = 200; /* 只读数据段 */
static int static_global = 300; /* 数据段，但局部于本文件 */

/* 函数声明（将产生未定义符号） */
extern void external_function(void);
extern int external_variable;

/* 弱符号声明 */
__attribute__((weak)) void weak_function(void);
__attribute__((weak)) int weak_variable = 500;

/* 全局函数定义 */
void global_function(void) {
    printf("Global function\n");
}

/* 静态函数（局部于本文件） */
static void static_function(void) {
    printf("Static function\n");
}

/* 另一个全局函数，调用其他函数 */
void another_global_function(void) {
    static_function();
    if (weak_function) {
        weak_function();
    }
}

/* 公共符号（C语言中的未初始化全局变量） */
int common_symbol; /* 注意：这取决于编译选项 */

/* 使用未定义符号 */
void use_undefined(void) {
    external_function();
    printf("External variable: %d\n", external_variable);
}

/* 内联函数测试 */
static inline void inline_function(void) {
    printf("Inline function\n");
}

void call_inline(void) {
    inline_function();
}

int main(void) {
    global_function();
    static_function();
    another_global_function();
    use_undefined();
    call_inline();
    
    printf("Global init: %d\n", global_init);
    printf("Global const: %d\n", global_const);
    printf("Static global: %d\n", static_global);
    
    return 0;
}

/* 定义一个弱函数（可能被覆盖） */
__attribute__((weak)) void weak_function(void) {
    printf("Weak function (default)\n");
}
```

- `extern.c` 提供外部符号定义
```c 
#include <stdio.h>

/* 定义在 test_nm.c 中声明的外部符号 */
void external_function(void) {
    printf("External function defined\n");
}

int external_variable = 999;

/* 强函数，可能覆盖弱函数 */
void strong_function(void) {
    printf("This is a strong function\n");
}

/* 可以尝试把这个函数名改为 weak_function 来测试弱符号覆盖 */
/*
void weak_function(void) {
    printf("Strong version of weak function\n");
}
*/
```

执行命令
```bash 
gcc test.c extern.c -o a.out 
nm a.out 
```
输出
```text 
000000000000038c r __abi_tag
000000000000119d T another_global_function
0000000000004020 B __bss_start
00000000000011f4 T call_inline
0000000000004028 B common_symbol
0000000000004020 b completed.0
                 w __cxa_finalize@GLIBC_2.2.5
0000000000004000 D __data_start
0000000000004000 W data_start
00000000000010b0 t deregister_tm_clones
0000000000001120 t __do_global_dtors_aux
0000000000003db8 d __do_global_dtors_aux_fini_array_entry
0000000000004008 D __dso_handle
0000000000003dc0 d _DYNAMIC
0000000000004020 D _edata
0000000000004030 B _end
0000000000001299 T external_function
000000000000401c D external_variable
00000000000012d0 T _fini
0000000000001160 t frame_dummy
0000000000003db0 d __frame_dummy_init_array_entry
0000000000002318 r __FRAME_END__
0000000000002004 R global_const
0000000000001169 T global_function
0000000000004010 D global_init
0000000000003fb0 d _GLOBAL_OFFSET_TABLE_
0000000000004024 B global_uninit
                 w __gmon_start__
00000000000020d4 r __GNU_EH_FRAME_HDR
0000000000001000 T _init
00000000000011de t inline_function
0000000000002000 R _IO_stdin_used
                 w _ITM_deregisterTMCloneTable
                 w _ITM_registerTMCloneTable
                 U __libc_start_main@GLIBC_2.34
0000000000001204 T main
                 U printf@GLIBC_2.2.5
                 U puts@GLIBC_2.2.5
00000000000010e0 t register_tm_clones
0000000000001080 T _start
0000000000001183 t static_function
0000000000004014 d static_global
00000000000012b3 T strong_function
0000000000004020 D __TMC_END__
00000000000011b2 T use_undefined
000000000000127f W weak_function
0000000000004018 V weak_variable
```

#### 分析
##### 用户定义的符号
全局函数（T-代码段）
```text 
000000000000119d T another_global_function
00000000000011f4 T call_inline
0000000000001299 T external_function
0000000000001169 T global_function
0000000000001204 T main
00000000000011b2 T use_undefined
00000000000012b3 T strong_function
```

静态/局部函数（t-局部代码）
```text 
00000000000011de t inline_function        # 内联函数（实际被实例化）
0000000000001183 t static_function        # 你的静态函数
0000000000001160 t frame_dummy           # 编译器生成的
0000000000001120 t __do_global_dtors_aux # 编译器生成的
00000000000010b0 t deregister_tm_clones  # 编译器生成的
00000000000010e0 t register_tm_clones    # 编译器生成的
```

数据段变量（D/d-已初始化数据）
```text 
0000000000004010 D global_init          # 你的全局初始化变量
0000000000004014 d static_global        # 你的静态全局变量（小写d）
000000000000401c D external_variable    # external.c中的变量
0000000000004018 V weak_variable        # 弱变量（特殊类型V）
```

BSS段变量（B/b-未初始化数据）
```text 
0000000000004024 B global_uninit        # 你的全局未初始化变量
0000000000004028 B common_symbol        # 你的common符号（现在是BSS）
0000000000004020 b completed.0          # 编译器生成的局部BSS变量
```

只读数据（R/r-常量）
```text 
0000000000002004 R global_const         # 你的全局常量
```

弱符号
```text 
000000000000127f W weak_function        # 弱函数
0000000000004018 V weak_variable        # 弱对象变量
```

##### 编译器/链接器生成的符号

程序入口和初始化
```text 
0000000000001080 T _start               # 程序真正的入口点（不是main！）
0000000000001000 T _init                # 初始化函数
00000000000012d0 T _fini                # 终止函数
```

ELF段标记符号
```text 
0000000000004020 B __bss_start          # BSS段开始
0000000000004030 B _end                 # 程序结束地址
0000000000004020 D _edata               # 数据段结束/BSS段开始
0000000000004000 D __data_start         # 数据段开始
0000000000004000 W data_start           # 数据段开始（弱符号）
```

TLS（线程局部存储）相关
```text 
0000000000004020 D __TMC_END__          # TLS控制块结束
```

动态链接相关
```text 
0000000000003dc0 d _DYNAMIC             # 动态段地址
0000000000003fb0 d _GLOBAL_OFFSET_TABLE_ # 全局偏移表（用于PIC）
```

数组和框架
```text 
0000000000003db0 d __frame_dummy_init_array_entry
0000000000003db8 d __do_global_dtors_aux_fini_array_entry
0000000000002318 r __FRAME_END__
00000000000020d4 r __GNU_EH_FRAME_HDR   # 异常处理框架头
```

##### 外部库符号（动态链接）

GLIBC库函数（U-未定义，需要动态链接）
```text 
                 U __libc_start_main@GLIBC_2.34  # 启动main函数
                 U printf@GLIBC_2.2.5           # printf函数
                 U puts@GLIBC_2.2.5             # puts函数（编译器可能优化使用）
```

弱引用的库函数（w-弱引用）
```text 
                 w __cxa_finalize@GLIBC_2.2.5    # C++终止处理
                 w __gmon_start__               # gprof分析器
                 w _ITM_deregisterTMCloneTable  # 事务内存
                 w _ITM_registerTMCloneTable
```

##### 特殊符号

```text 
0000000000002000 R _IO_stdin_used        # 标准IO使用标记
0000000000004008 D __dso_handle          # DSO句柄
00000000000038c r __abi_tag              # ABI标签
```

#### 特别的

1. 地址空间布局
    - 代码段：从`0x1000`到`0x12d0`左右（可执行，只读）
    - 只读数据：从`0x2000`开始（常量）
    - 数据段：从`0x4000`开始（已初始化变量）
    - BSS段：从`0x4020`开始（未初始化变量）
2. 实际与理论的区别
    - common_symbol：在输出中是`B`(BSS段)，而不是`C`（Common）。这是因为现代GCC默认使用`-fno-common` 
    - inline_function：虽然声明为`inline`，但编译器仍然生成了实例（`t`类型）
    - printf vs puts：编译器可能将`printf`调用优化为`puts`
3. 动态链接符号的版本控制
    注意`@GLIBC_2.2.5`和`@GLIBC_2.34`这样的后缀，这是符号版本控制
    - 确保程序链接到正确版本的库函数
    - 允许同一个库中有多个版本的函数
