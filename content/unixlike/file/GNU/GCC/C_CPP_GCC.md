---
title: C/C++ GCC
date: 2026-03-09
author: ljf12825
summary: Usage of GCC in C/C++ Project
---

## 基本概念

### 基础语法

```bash
gcc/g++ [选项] [源文件] [选项] [目标文件]
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

##### 输出默认文件名

```bash
gcc main.c
```

- 没有`-o`参数
- GCC默认会把可执行文件叫`a.out`（这是Unix系统的传统名字）

##### 输出指定文件名

```bash
gcc main.c -o main
```

gcc内部进行以下四个阶段

1. 预处理：处理宏定义、头文件包含等

```bash
gcc -E main.c -o main.i
```

2. 编译：将预处理后的文件编译成汇编代码

```bash
gcc -S main.i -o main.s
```

3. 汇编：将汇编代码转换成机器码

```bash
gcc -c main.s -o main.o
```

4. 链接：将目标文件链接成可执行文件

```bash
gcc main.o -o main
```

在链接完成后，中间文件会被删除掉

##### 分步编译

###### 预处理

不指定文件名

```bash
gcc -E main.c
```

这会执行标准输出，将结果打印到屏幕上

指定文件名

```bash
gcc -E main.c -o main.i
```

`main.i`这个名字可以自定义，扩展名也可以自定义，比如`.txt`, `.abc`

常见约定

| 扩展名 | 含义 | 常用性 |
| - | - | - |
| `.i` | 预处理后的C文件 | 最常用 |
| `.ii` | 预处理后的C++文件 | 最常用 |
| `.txt` | 文本文件 | 可用 |
| 无扩展名 | 任意文件名 | 不推荐 |

同理对于`.s`, `.o`文件也是一样的，这对于gcc来说是可以的，但对于make或其他通过扩展名判断文件类型的工具来说未必行得通

###### 编译



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
gcc main.c -o main
g++ main.cpp -o main

# 编译并运行
gcc main.c -o main && ./main
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


## gcc vs g++


















