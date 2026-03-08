---
title: GCC
date: 2025-12-31
author: "ljf12825"
type: file
summary: GCC general content overview
---

GCC(GNU Compiler Collection)是一个开源的编译器系统，支持多种编程语言，包括C、C++、Fortran、Ada、Go、D、Object-C和其他一些语言\
它最初是由Richard Stallman在 1987年启动的，用于构建GNU操作系统的一部分，但现在已经发展成一个跨平台的工具，广泛应用于各类操作系统中\

- 历史：它最初名为 GNU C Compiler，只用于编译 C 语言。随着时间推移，它扩展支持了C++、Fortran、Ada、Go、D等多种语言，因此在 1999 年更名为现在的名字
- 核心地位：它是 GNU 工具链的核心组成部分，也是 Linux 生态的基石。几乎所有Linux发行版上的软件都是用 GCC 编译的
- 跨平台与开源：GCC 是自由软件，遵循 GPL 许可证。它支持几乎所有主流处理器架构（x86, ARM, RISC-V, MIPS等）和操作系统（Linux, Windows, macOS, BSD等）

GCC是一个家族，包含多个前端编译器：

- `gcc`：用于编译 C 程序
- `g++`：C++
- `gfortran`：Fortran （取代了旧的`g77`）
- `gnat`：Ada
- `gccgo`：Go
- `gdc`：D

GCC的主要特点是高效性、跨平台、开源，它支持多种体系结构，并且不断更新以支持新的编程语言和硬件架构

## GCC的结构

GCC是一个由多个组件构成的编译器集合。其主要结构可以分为以下几个部分：

1. 前端（Front-End）
    - 前端负责处理源代码的语法和语义分析，将源代码转换为中间表示（IR）
    - GCC有不同的前端，支持多种编程语言
    - 每个前端都包括词法分析器、语法分析器、语义分析器

2. 中间层（Middle-End）
    - GCC的中间层主要处理中间表示（IR）的优化和转换
    - GCC使用GIMPLE和RTL（Register Transfer Language）两种中间表示
    - 这个阶段的主要目标是提高程序的执行效率，包括常见的优化，如常量传播、循环优化、死代码消除等

3. 后端（Back-End）
    - 后端将经过优化的中间表示（IR）转换成目标平台的机器代码
    - GCC支持多种硬件架构，后端会根据目标架构的指令集来生成对应的汇编代码
    - 后端还负责处理与具体平台相关的任务，如寄存器分配、指令选择等

4. 代码生成（Code Generation）
    - 最终，GCC的后端将优化后的IR转化为汇编语言，然后通过汇编器（Assembler）生成机器代码

5. 链接（Linker）
    - GCC通常会调用链接器，将多个对象文件和库文件链接成一个最终可执行的程序

### 前端(Front End)

不同语言有不同的前端，前端负责语言规则

| 前端 | 语言 |
| - | - |
| `cc1` | C |
| `cc1plus` | C++ |
| `f951` | Fortran |
| `go1` | Go |

作用

```
源码 -> 语法分析 -> AST -> GIMPLE
```

### 中间表示(IR)

语言转换过程

```text
Source Code
v
AST：抽象语法树,保留源代码结构
v
GENERIC：语言无关的AST
v< 中端优化1
GIMPLE：三地址代码，简化控制流
v
GIMPLE SSA：静态单赋值形式，便于优化
v< 中端优化2
RTL：接近机器指令，用于寄存器分配、指令选择、指令调度
v
Assembly
```

### 后端(Backend)

后端负责`RTL -> 目标机器指令`

支持架构

- x86
- x86_64
- ARM
- RISC-V
- MIPS
- PowerPC

这就是GCC可以跨平台的原因

## 编译流程工具

在Linux上，gcc实际会调用这些程序

- `cpp`：预处理器
  - 作用：预处理
  - 命令：`gcc -E main.c`
  - 输出：`main.i`
- `cc1`/`cc1plus`（编译器）
  - 作用：C/C++ -> IR -> Assembly
  - 命令：`gcc -S main.c`
  - 输出：`main.s`
- `as`：汇编器
  - 作用：汇编 -> 机器码
  - 命令：`gcc -c main.c`
  - 输出：`main.o`
- `ld`：链接器
  - 作用：.o文件 + 库 -> 可执行文件
  - 示例：`gcc main.o -o app`

### GCC相关工具

这是编译工具之外的配套工具

- `ar`
  - 作用：生成静态库
  - 命令：`ar rcs libmath.a math.o`
- `ranlib`
  - 作用：生成库索引
  - `ranlib libmath.a`
  - 现在`ar`一般会自己做
- `nm`
  - 作用：查看符号表
  - `nm main.o`
- `objdump`
  - 作用：反汇编
  - `objdump -d app`
- `objcopy`
  - 作用：复制/转换目标文件
- `strip`
  - 作用：去掉调试信息，减少程序大小
  - `strip app`

### GCC的运行时库

编译程序时会链接很多库

- `libgcc`
  - 最核心库：`libgcc.a`, `libgcc_s.so`
  - 提供：除法、异常处理、栈展开
  - 很多CPU指令没有实现的功能由它补充
- `libstdc++`
  - C++标准库
  - `g++`会自动链接`-lstdc++`
- `libc`
  - 标准C库
  - Linux上一般是`glibc`

### 其他组件

- `collect2`
  - 它是GCC的一个辅助程序，用于包装系统链接器`ld`。它主要负责收集全局构造函数和析构函数，并生成初始化代码及，以保证C++的静态对象在程序启动时正确初始化

## GCC的主要功能

1. 编译和优化
    - GCC不仅能够将源代码编译为机器代码，还能执行大量的优化以提高程序的执行效率
    - 支持的优化包括：循环优化、函数内联、代码移除、分支预测等

2. 跨平台支持
    - GCC支持多种操作系统和硬件平台，包括x86、x64、ARM、MIPS、PowerPC、RISC-V等
    - 通过调整目标架构，GCC可以生成不同平台上运行的可执行文件

3. 调试信息支持
    - GCC可以生成调试信息，支持GDB（GNU Debugger）等调试工具，帮助开发者调试程序

4. 静态分析和诊断
    - GCC提供了强大的诊断信息，能够帮助开发者发现潜在的错误（如未初始化的变量、类型不匹配等）
    - 还支持静态分析工具，如`-Wall`（启用所有警告）和`-Wextra`（启用额外警告）

5. 多语言支持
    - GCC支持多种编程语言，并且可以在同一个项目中混合使用不同语言编写的代码

6. 生成可执行文件、库文件和目标文件
    - GCC支持生成可执行文件、静态库、动态库、目标文件等

## GCC工作流程

1. 编译阶段
    - GCC首先会对源代码进行预处理，处理宏定义、头文件引用等
    - 然后，源代码被转换成汇编代码

2. 汇编阶段
    - 汇编器将汇编代码转换为目标文件（`.o`文件）

3. 链接阶段
    - 链接器将目标文件和库文件链接在一起，生成最终的可执行文件

### `gcc`本质

`gcc`本身不是编译器，而是compiler driver

它负责调用上述组件\
如编译C语言项目

```
gcc main.c
v
cpp
v
cc1
v
as
v
ld
```

## GCC工具链的安装

### 通过版管理器安装

以Ubuntu为例

```bash
sudo apt update
sudo apt install build-essential gdb binutils
```

- `build-essential`：包含`gcc`、`g++`、`make`、`libc-dev`等基本工具
- `gdb`：GNU调试器
- `binutils`：包含`ld`（链接器）、`as`（汇编器）、`objdump`等工具

验证安装

```bash
gcc --version
g++ --version
gdb --version
ld --version
```

如果这些命令输出版本信息，说明安装成功

#### 可选组件

安装特定版本的GCC\
如果系统自带的GCC版本比较旧，可以手动安装新版

```bash
sudo apt install gcc-15 g++-15 # 例如安装GCC 15
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-15 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-15 100
```

然后使用`sudo update-alternatives --config gcc`切换版本

#### 手动编译安装

如果需要最新版或自定义配置，可以从源码编译

```bash
# 下载源码
wget https://ftp.gnu.org.gnu/gcc/gcc-15.1.0/gcc-15.1.0.tar.gz
tar -xzf gcc-15.1.0.tar.gz
cd gcc-15.1.0

# 安装依赖
./contrib/download_prerequisites

# 编译安装（较耗时）
mkdir build && cd build
../configure --prefix=/usr/local/gcc-15.1.0 --enable-languages=c, c++ --disable-multilib
make -j$(nproc) # 并行编译，加快速度
sudo make install

# 添加到PATH
echo 'export PATH=/usr/local/gcc-15.1.0/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## GCC Pass System

GCC的优化不是由一个巨大的函数完成的，而是由超过200个独立的`Pass`（遍）组成的管道

- Pass类型
  - GIMPLE Pass：运行在GIMPLE上，执行语言/架构无关的优化（如内联、循环展开、向量化）
  - RTL Pass：运行在RTL上，执行与架构相关的准备工作（如指令组合、寄存器分配、指令调度）

## GCC Plugin

GNU Compiler Collection支持插件扩展机制(Plugin Framework)，允许开发者在不修改GCC源码的情况下，向编译器内部注入自定义逻辑

简单来说，就是GCC内部提供的Hook

可以在编译流程的任意阶段插入代码，比如

- 静态分析
- 代码检查
- 自动插桩(Instrumentation)
- 自定义优化
- 安全检测
- Profiling工具开发

## GCC Cross Compiler

GNU Compiler Collection是工业界最常用的交叉编译工具\
GCC从设计之初就考虑到了交叉编译的需求，这是它成为嵌入式领域事实标准的重要原因之一

GCC在编译过程中区分三个不同的平台概念

```text
构建平台(build)：运行编译器的机器
    |
    |-- 主机平台(host)：编译器本身将要运行的平台（通常与构建平台相同）
    |
    |__ 目标平台(target)：生成的可执行文件运行的平台
```

在交叉编译场景下：构建平台 = 主机平台 =/ 目标平台

GCC的架构使其天然支持交叉编译

```text
前端（语言相关）
v
中间层(IR优化，语言/架构无关)
v
后端（架构相关）
```

关键设计

- 前端和后端分离：只需要更换后端，就能支持新架构
- 中间表示(IR)：优化在IR层面运行，与具体架构无关
- 机器描述文件：用高级语言描述指令集，自动生成代码

## LTO(Link Time Optimization)

这是现代编译器的一个强大特性：链接时优化

传统编译是“分而治之”的，每个`.c`文件单独编译成`.o`文件，这使得跨文件的优化（如跨文件内联）变得不可能


- LTO工作原理：在使用`-flto`编译时，GCC不仅讲汇编代码写入`.o`文件，还会将中间表示(GIMPLE)也写入其中。在最终的链接阶段，GCC（通过`collect2`和`lto-plugin`）会读取所有`.o`文件中的GIMPLE，将它们合并成一个大的单元，然后在全局范围内重新运行优化Pass。这就像拥有了整个项目的“全局视野”
- 优点：极大的优化潜力（跨文件内联、更好的死代码消除）
- 缺点：显著增加链接时间和内存消耗

## Sanitizer

在编译时插入检测代码，在运行时发现bug

GCC支持

```
-fsanitize=address
-fsanitize=undefined
-fsanitize=thread
```

## 文档与帮助

查阅GCC选项的详细内容，可以通过以下几种方式

### `help`

这是最快、最直接的方式，用于在终端中快速查看所有选项的概览

```bash
gcc --help
```

这会输出一个很长的列表，按类别（如优化选项、警告选项等）列出所有可用的命令行选项以及其简要说明\
如果想查看某个特定类别的选项，可以使用

```bash
gcc --help=optimizers # 查看所有优化选项
gcc --help=warnings # 查看所有警告选项
gcc --help=target # 查看目标平台相关选项
gcc --help=common # 查看通用选项
```

- 优点：极其快速，无需联网，随编译器自带
- 缺点：说明非常简短，没有详细解释和示例

### `man`手册页

这是Linux/Unix系统下查询命令和工具详情的标准方法。`man`（manual）页面提供了非常详尽的文档
```bash
man gcc
```
这会打开一个完整的、结构化的手册。可以使用键盘进行导航
- 上下箭头：逐行滚动
- Page Up / Page Down：翻页
- `/`：搜索。例如，输入`/O2`然后按回车，可以跳转到`-O2`选项的解释
- `n`：跳转到下一个搜索匹配项
- `q`：退出手册页

**手册页结构：**
手册页通常包含以下部分，对于查找选项非常有用：
- NAME：名称和简要描述
- SYNOPSIS：语法概要
- DESCRIPTION：详细描述（重点阅读部分）
- OPTIONS：所有选项的详细解释
- SEE ALSO：相关参考

优点：信息非常详细，包含每个选项的行为、注意事项和与其他选项的交互。离线可用\
缺点：内容量大，需要一定的阅读和搜索技巧

### `info`文档

```bash
info gcc
```

### 在线查询官方文档
GNU GCC官网提供了完整的[在线文档](https://gcc.gnu.org/onlinedocs)，阅读体验通常比终端更好

### 询问编译器本身（`-Q --help=xxx`）

可以让GCC告诉你它默认启用了哪些选项，或者不同优化级别具体包含了哪些子选项

#### 查看激活的优化选项：

`-O2`与`-O3`有什么区别

```bash
# 查看使用 -O2 时，哪些优化器被开启了
gcc -Q -O2 --help=optimizers

# 与 -O3 进行对比
gcc -Q -O3 --help=optimizers
```

输出会是一个很长的列表，显示每个优化选项是 `[enabled]` 还是 `[disabled]`。通过对比，你就可以清晰地看到 `-O3` 比 `-O2` 多开启了哪些具体的优化

#### 查看默认启用的警告

```bash
gcc -Q --help=warnings | grep enabled
```

这个命令可以查看哪些警告选项默认情况下是开启的（即使没有指定`-Wall`）
