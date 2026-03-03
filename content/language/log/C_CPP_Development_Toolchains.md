---
title: Overview of C/C++ Developement Toolchains
date: 2026-02-28
author: ljf12825
type: log
categories: [Toolchain]
tags: [C, C++, Windows, Linux, GNU]
summary: overview of C/C++ developement toolchains
---

> 我曾纠结过把toolchain系列文章放在unix-like模块还是language模块，最终还是决定跟language放在一起。原因有二：1. 工具链是语言的一部分，尤其是在C/C++这种依赖底层实现和平台ABI的语言中，工具链甚至比语言标准更能决定代码行为；2. C/C++是跨平台的

一个完整的工具链通常包括

| 组件 | 作用 | 主流工具 |
| - | - | - |
| 编译器 | 把源码变成目标文件 | GCC, Clang/LLVM, MSVC |
| 汇编器 | 把汇编变成机器码 | GNU as, NASM, MASM |
| 链接器 | 把目标文件拼成可执行文件 | GNU ld, LLD, Microsoft Linker, ld64 |
| 构建系统 | 管理编译流程 | Make, CMake, Ninja |
| 调试器 | 调试程序 | GDB, LLDB, Visual Studio Debugger |
| 包管理 | 管理第三方库 | vcpkg, Conan, apt/yum |
| 静态/动态分析工具 | 代码质量保障 | clang-tidy, cppcheck, Valgrind, AddressSanitizer, UBSan |
| 动态链接器 | 加载共享库 | ld-linux.so, Ldr dyld |
| CRT(C Runtime) | 程序入口点之前的初始化 | glibc, musl, MSVCRT, ucrt |

---

## 不同平台的默认组合

### Linux

```
binutils(ld/as)
+ GCC / Clang
+ glibc / musl
+ make / cmake
```

特征：

- 目标文件格式：ELF
- 动态加载器：ld-linux.so
- ABI: System V ABI

### Windows

```
MSVC(cl + link)
+ Windows SDK
+ MSVCRT / UCRT
+ CMake / Ninja
```

特征：

- 目标文件格式：PE/COFF
- 动态加载器：ntdll + loader
- ABI：Microsoft ABI

### macOS

```
Apple Clang
+ ld64
+ dyld
+ libSystem
```

特征：

- 目标文件格式：Mach-O
- 动态加载器：dyld
- ABI：Apple ABI

---

## 工具链流程

```text
源码 (.c/.cpp) 
    ↓ [预处理器] 
预处理后源码 (.i)
    ↓ [编译器前端] 
抽象语法树 (AST)
    ↓ [优化器] 
中间表示 (IR)
    ↓ [编译器后端] 
汇编代码 (.s)
    ↓ [汇编器] 
目标文件 (.o) + 重定位信息
    ↓ [链接器] + [静态库] 
可执行文件 (ELF/PE)
    ↓ [加载器] 
内存中的进程镜像
    ↓ [动态链接器] + [共享库] 
完整的运行环境
    ↓ [CRT 初始化] 
调用 main()
```

---

## 构建系统

构建系统是自动化组织如何把一堆源码变成可执行程序的流程控制器，它不编译代码，不链接代码，它负责的是调度和管理整个编译流程

构建系统解决三个核心问题

- 如何知道要编译什么
- 如何按正确顺序编译
- 如何避免重复编译

### 手动编译的局限性

假设有一个中等项目

```
engine/
  math.cc
  renderer.cc
  texture.cc
  main.cc
```

如果手动编译

```bash
g++ -c math.cc
g++ -c renderer.cc
g++ -c texture.cc
g++ -c main.cc
g++ math.o renderer.o texture.o main.o -o engine
```

会产生以下问题

- 改动了一个源文件要全部重新编译
- 依赖头文件需要处理
- Debug和Release如何切换
- 不同平台如何处理

当项目变得很庞大时，根本不可能手动管理，这时候就需要构建系统

### 构建系统行为

#### 依赖管理

它会自动判断

- 哪个源文件被修改了
- 哪些文件需要重新编译
- 哪些可以复用旧的.o

这叫增量构建（incremental build）

#### 调用编译器

构建系统本质上是在背后执行

- GCC
- Clang
- MSVC

它只是替你组织这些命令

#### 管理构建配置

- Debug/Release
- 是否开启优化
- 是否开启AddressSanitizer
- 是否开启LTO

#### 跨平台抽象

- Linux用gcc
- Windows用MSVC
- macOS用Clang

构建系统帮你统一接口

### 常见构建系统

#### Make

最传统的，核心思想：

```makefile
target: dependency
    command
```

它通过时间戳判断是否重新构建

- 优点：简单直接
- 缺点：大型项目难维护

#### CMake

CMake不是构建系统，它是生成构建系统的工具

它生成

- Makefile
- Ninja文件
- Visual Studio工程

#### Ninja

特点：

- 极快
- 只做构建
- 不处理复杂逻辑

---

## 编译器

编译器的作用是把一种语言的语义模型，转换成另一种语言的语义模型

对于C/C++来说

```text
C/C++ 语义
v
机器指令语义
```

编译器不是翻译器，它做的是语义保持的程序变换 + 优化

### 现代编译器的结构

```text
源码
v
词法分析(Lexer)
v
语法分析(Parser)
v
抽象语法树(AST)
v
语义分析
v
中间表示(IR)
v
优化器
v
后端代码生成
v
汇编
```

## 汇编器

汇编器(Assembler)负责把汇编指令翻译成机器码，并生成重定位信息

典型实现

- GNU as
- NASM
- MASM

### 汇编器行为

汇编器主要做4件事情

#### 1. 指令编码

```asm
mov eax, 5
```

汇编器查表

- mov imm32 -> eax的opcode是`B8`
- 立即数5转成little-endian

输出

```
B8 05 00 00 00
```

本质上是：助记符 -> 指令编码表查找

#### 2. 符号解析

```asm
jmp label
...
label:
```

汇编器需要

- 记录label的位置
- 计算跳转偏移

如果label在同一个文件里，可以直接计算；如果在别的文件里，就需要生成重定位信息

#### 3. 生成目标文件格式

在Linux上通常生成`ELF`，在Windows上则是`PE/COFF`\
目标文件包含

- .text（代码段）
- .data（数据段）
- 符号表
- 重定位表

汇编器不生成“可执行文件”，只生成“可链接单元”

#### 4. 生成重定位记录

```asm
call printf
```

printf不在本文件里

汇编器会在指令位置写一个占位地址（通常是0），在重定位表里记录

```
offset: 0x14
symbol: printf
type: R_X86_64_PC32
```

然后交给链接器处理

### 汇编器内部结构

```text
源码 (.s)
↓
词法分析
↓
语法分析
↓
符号表建立
↓
指令编码
↓
重定位记录生成
↓
写入目标文件
```

### 两种汇编器风格

- AT&T风格（GAS默认）

```asm
movl $5, %eax
```

- Intel风格（NASM）

```asm
mov eax, 5
```

语法不同，本质相同


### 总结

和编译器相比，汇编器面临着

- 指令集是固定的
- 编码规则是确定的
- 没有复杂优化

它是一个表驱动型的严格的编码器，而不是一个推理系统

- 它定义了机器级抽象边界，机器不理解“函数”，“变量”，只有“指令”，“地址”，“内存”；汇编器是最后一层人类可读抽象
- 它决定目标文件结构

总的来说，在现有架构下的汇编器是非常稳定的，创新和算法优化空间很小，但是理解它和使用它对于二进制安全的研究是绕不开的

## 链接器

链接器(Linker)的作用是把多个目标文件合并成一个完整程序，并解决所有符号引用与地址布局问题

常见实现

- GNU ld
- LLD
- Microsoft Linker

### 链接器行为

#### 1. 符号解析(Symbol Resolution)

假设有两个文件

```c
// a.c
int add(int a, int b)
int main() { return add(1, 2); }
```

```c
// b.c
int add(int a, int b) { return a + b; }
```

编译后

- main.o里有“对add的引用”
- add.0里有“add的定义”

链接器要做的就是把引用和定义匹配起来\
如果找不到，报错：undefined reference

#### 2. 重定位(Relocation)

目标文件里并没有真实地址

```asm
call add
```

汇编器只是写了

- 占位地址
- 重定位记录

链接器会

- 决定add的最终地址
- 修改call指令里的偏移量

这一步叫地址修正

#### 3. 地址空间布局(Layout)

链接器决定

- .text放哪
- .data放哪
- .bss放哪
- 程序入口在哪

### 链接器内部流程

```text
读取所有.o文件
v
读取符号表
v
合并相同section
v
符号解析
v
地址分配
v
执行重定位
v
写出最终可执行文件
```

### 静态链接 vs 动态链接

#### 静态链接

```bash
gcc main.o -static
```

- 所有库代码都拷贝进可执行文件
- 文件变大
- 运行时不依赖外部库

#### 动态链接

```bash
gcc main.o
```

- 只记录库引用
- 运行时由动态加载器处理

## 动态链接器

动态链接器是负责程序启动后加载共享库、解析动态符号、建立运行时地址映射的系统组件

典型实现

- ld-linux.so(Linux)
- dyld(macOS)
- Windows loader（内置在系统运行时）

```text
可执行文件启动
v
操作系统加载器
v
动态链接器
v
解析依赖库
v
建立符号映射
v
执行程序入口
```

### 动态链接器行为

#### 加载共享库

例如程序依赖

- libc.so
- libm.so
- libpthread.so

动态链机器会

- 找到库文件
- 映射到虚拟内存

涉及内存页映射，权限设置，这里通常依赖ELF文件结构

#### 符号解析

假设程序调用

```c
printf("hello");
```

但printf在libc动态库中，动态链接器要做的就是把printf的调用地址绑定到真实函数地址

> 延迟绑定(Lazy Binding)
> 这是动态链接器的经典优化，思想是：不在程序启动时解析所有符号，而是第一次调用函数时再解析。机制依赖GOT(Global Offset Table)，PLT(Procedure Linkage Table)

#### 重定位修正

程序中可能包含位置无关代码（PIC），例如

```
call [GOT + offset]
```

动态链接器会修改GOT表中的真实地址

### 动态链接器内部结构

```text
ELF Header
v
Program Headers
v
加载各个 Segment
v
解析 DT_NEEDED 依赖
v
加载共享库
v
符号查找
v
重定位处理
v
跳转到程序入口
```

## CRT

CRT, C Runtime, 它不是标准库本身，而是在`main()`之前和之后负责初始化与收尾的一整套运行时支撑代码

### 程序启动流程

以ELF程序（Linux）为例

```
内核加载 ELF
v
动态链接器
v
CRT入口（_start）
v
__libc_start_main
v
初始化环境
v
调用main()
v
exit()
v
清理流程
```

真正的入口不是main，而是`_start`

### CRT行为

#### 建立运行时环境

CRT负责

- 准备栈
- 解析argc/argv
- 准备环境变量envp

Linux下栈布局

```
argc
argv[]
NULL
envp[]
NULL
auxv[]
```

CRT负责解析这些

#### 初始化全局变量

```c
int x = 5;
```

这些数据段需要

- BSS清零
- DATA初始化

如果是C++

- 构造全局对象
- 注册析构函数

#### 调用libc初始化

在GNU系统中，GNU C Library的核心入口是`__libc_start_main()`

它负责

- 初始化线程系统
- 初始化I/O
- 初始化malloc
- 注册exit handler

#### 调用main()

#### 程序退出清理

当main返回

- 执行atext注册函数
- 调用全局析构函数
- 刷新缓冲区
- 关闭文件

## 使用VSCode开发C/C++

在VSCode里开发C/C++，核心不是编译器本身，而是VSCode + Language Server + Toolchain + Build System的组合

```text
VSCode UI
v
C/C++ Extension (Language Client)
v
C/C++ Language Server
v
Compiler Toolchain
v
Build System
v
Executable Binary
```

### 项目结构

```text
project/
├── src/
├── include/
├── build/
├── CMakeLists.txt
└── main.cpp
```

### .vscode/

VSCode可以抽象为三层架构

```text
VSCode UI 编辑器
v
Language Service（代码理解）
v
Build / Debug Execution 层
```

`.vscode/`就是执行层配置

#### tasks.json

作用：定义如何执行编译构建流程\
本质上是VSCode调用外部命令

例如

```json
{
    "label": "build",
    "type": "shell",
    "command": "cmake --build build"
}
```

tasks.json常用于

- 编译项目
- 运行脚本
- 清理工程
- 自动化流程

它不做：

- 语法分析
- 调试控制

#### launch.json

作用：控制debugger如何启动和连接目标程序

## 使用Visual Studio开发C/C++




















