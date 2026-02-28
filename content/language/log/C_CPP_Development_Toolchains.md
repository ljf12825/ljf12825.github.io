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

























