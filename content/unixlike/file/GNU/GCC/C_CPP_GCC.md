---
title: C/C++ GCC
date: 2026-03-09
author: ljf12825
summary: Usage of GCC in C/C++ Project
---

## 基本概念

### 基础语法

```bash
gcc/g++ [选项] 源文件 [选项] [目标文件]
```

### 常用选项

#### 基本选项

| 选项 | 作用 |
| - | - |
| `-o <file>` | 指定输出文件名 |
| `-c` | 只编译不链接，生成目标文件(.o) |
| `-E` | 只进行预处理不编译 |
| `-S` | 编译到汇编语言，不汇编 |
| `-v` | 显示编译过程的详细信息 |

#### 警告选项

| 选项 | 作用 |
| - | - |
| `-Wall` | 显示所有常见警告 |
| `-Wextra` | 显示额外警告 |
| `-Werror` | 将警告视为错误 |
| `-w` | 禁止所有警告 |

#### 优化选项

| 选项 | 作用 |
| - | - |
| `-O0` | 不优化（默认）|
| `-O1` | 基本优化 |
| `-O2` | 进一步优化（推荐）|
| `-O3` | 最高级别优化 |
| `-Os` | 优化代码大小 |

#### 调试选项

| 选项 | 作用 |
| - | - |
| `-g` | 生成调试信息 |
| `-ggdb` | 生成GDB专用的调试信息 |
| `-pg` | 生成性能分析信息 |

#### 语言标准选项

`-std`

```bash
gcc -std=c99 file.c
```

- c99
- c11
- gnu99
- c++11
- c++20

### 使用示例

#### 基本编译

```bash
# 编译单个文件
gcc hello.c -o hello
g++ hello.cpp -o hello

# 编译并运行
gcc hello.c -o hello && ./hello
```

#### 多文件编译

```bash
# 方式1：直接编译多个文件
gcc file1.c file2.c file3.c -o program

# 方式2：分步编译（适合大型项目）
gcc -c file1.c -o file1.o
gcc -c file2.c -o file2.o
gcc file1.o file2.o -o program
```

#### 链接库文件

```bash
# 链接数学库
gcc program.c -o program -lm

# 链接pthread线程库
g++ program.cpp -o program -lpthread

# 指定库路径
g++ program.cpp -o program -L/path/to/lib -lmylib
```

#### 包含头文件

```bash
# 添加头文件搜索路径
g++ program.cpp -o program -I/path/to/include
```

## 编译过程

gcc/g++编译分为四个阶段

1. 预处理：处理宏定义、头文件包含等

```bash
gcc -E hello.c -o hello.i
```

2. 编译：将预处理后的文件编译成汇编代码

```bash
gcc -S hello.i -o hello.s
```

3. 汇编：将汇编代码转换成机器码

```bash
gcc -c hello.s -o hello.o
```

4. 链接：将目标文件链接成可执行文件

```bash
gcc hello.o -o hello
```

## gcc vs g++


















