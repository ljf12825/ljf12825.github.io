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
    - 最终，GCC的后端将优化后的IR转化为汇编预言家，然后通过汇编器（Assembler）生成机器代码

5. 链接（Linker）
    - GCC通常会调用链接器，将多个对象文件和库文件链接成一个最终可执行的程序

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

**可选组件**\
安装特定版本的GCC\
如果系统自带的GCC版本比较旧，可以手动安装新版
```bash
sudo apt install gcc-15 g++-15 # 例如安装GCC 15
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc -15 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-15 100
```
然后使用`sudo update-alternatives --config gcc`切换版本

**手动编译安装**\
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

## GCC的编译过程
GCC隐式地经历了四个主要阶段：
1. 预处理（Preprocessing）
  - 执行者：`cpp`（C Preprocessor）
  - 工作：
    - 展开所有的宏（`#define`）
    - 处理所有条件编译指令（`#if`, `ifdef`, `#endif`等）
    - 包含头文件（`include`）的内容
    - 删除所有注释和空行
  - 命令：`gcc -E main.c -o main.i`（输出`.i`文件）

2. 编译（Compilation）
  - 工作：将预处理后的代码（高级语言）翻译成汇编语言（特定于目标CPU的低级代码）
  - 命令：`gcc -S main.i -o main.s`（输出`.s`文件）
  - 注意：这里的“编译”是狭义上的，广义上的编译指整个从源码到二进制的过程

3. 汇编（Assembly）
  - 执行者：`as`（汇编器）
  - 工作：将汇编代码`.s`文件翻译成机器指令，生成目标文件（`.o`或`.obj`文件）。目标文件是二进制格式，但还不能直接运行
  - 命令：`gcc -c main.s -o main.o`（输出`.o`文件）

4. 链接（Linking）
  - 执行者：`ld`（链接器，GCC会调用它）
  - 工作：
    - 将多个目标文件（`.o`）合并成一个可执行文件
    - 解析库文件（如 C 标准库`libc.so`）中函数引用（例如`prinf`函数在哪）
    - 解决所有符号（函数、变量）的地址
  - 命令：`gcc main.o utils.o -o myapp`（输出为可执行文件）

`gcc main.c -o main`，GCC自动完成了以上所有四个步骤

## 常用GCC选项

| 类别 | 选项 | 说明 | 示例 |
| - | - | - | - |
| 常用选项 | `-o <file>` | 指定输出文件名 | `gcc main.c -o myapp` |
| | `-c` | 只编译不链接，生成`.o`文件 | `gcc -c main.c` -> `main.o` |
| | `-g` | 添加调试信息，便于使用GDB调试 | `gcc -g main.c -o main` |
| 警告选项 | `Wall` | 开启大部分常用警告（W all）| `gcc -Wall main.c` |
| | `-Wextra` | 开启额外的警告 | `gcc -Wall -Wextra main.c` |
| | `-Werror` | 将所有警告视为错误，强制要求代码0警告 | `gcc -Wall -Werror main.c` |
| 优化选项 | `-O0` | 不优化（默认），编译快，适合调试 | `gcc -O0 -g main.c` |
| | `-O1`, `-O2` | 不同级别的优化，`-O2`最常用 | `gcc -O2 main.c` |
| | `-O3` | 最高级别优化，可能激进地改变代码 | `gcc -O3 main.c` |
| | `-Os` | 优化代码大小（Optimize for size）| |
| 目录选项 | `-I<dir>` | 添加头文件搜索路径 | `gcc -I./include main.c` |
| | `-L<dir>` | 添加库文件搜索路径 | `gcc -L./lib main.o -lfoo` |
| 链接选项 | `-l<library>` | 链接指定的库 | `gcc main.o -lm`（链接数学库）|
| | `-static` | 静态链接，将库打包进最终程序 | `gcc -static main.c` |
| | `-shared` | 生成共享库（`.so`）而不是可执行文件 | `gcc -shared -o libfoo.so foo.c` |

## 示例
假设项目结构如下
```txt
my_project/
├── src/
│   ├── main.c
│   └── utils.c
├── include/
│   └── utils.h
└── lib/
    └── thirdparty.a
```
手动分步编译：
```bash
# 1. 编译源文件为目标文件，并指定头文件路径
gcc -c src/main.c -I./include -o build/main.o
gcc -c src/utils.c -I./include -o build/utils.o

# 2. 链接所有目标文件和第三方库，生成可执行程序
gcc build/main.o build/utils.o -L./lib -lthirdparty -o bin/myapp
```
一条指令完成（GCC自动处理中间步骤）
```bash
gcc src/main.c src/utils.c -I./include -L./lib -lthirdparty -o bin/myapp
```

## `gcc` and `g++`
`gcc`和`g++`都是GNU编译器套件里的前端驱动程序，不是单独的编译器，而是“驱动”不同后端编译工具链的入口。它们的主要区别体现在默认行为和语言支持上
1. `gcc`
  - 原名是GNU C Compiler，但后来扩展成了 GNU Compiler Collection
  - 主要职责：默认当作 C 编译器来使用
  - 行为特点：
    - 如果输入`.c`文件：当成C源文件处理
    - 如果输入`.cpp`/`.cc`/`.cxx`文件：也会尝试用C++编译器，但不会自动连接C++标准库（libstdc++）
    - 编译C++文件时，需要手动加上`-lstdc++`，否则使用C++标准库的程序（例如用`std::cout`）会报连接错误

示例
```bash
gcc test.cpp -o test # 可能会报错：未定义引用 std::cout
gcc test.cpp -o test -lstdc++ # 手动指定链接C++库，才能运行
```

2. `g++`
  - 是专门针对C++的编译驱动程序
  - 主要职责：把输入文件当作C++源代码来处理
  - 行为特点：
    - 输入`.c`或`.cpp`文件时，都会默认按C++语法处理
    - 编译和链接会自动加上C++标准库（libstdc++）
    - 适合C++项目编译，不用额外指定库

示例
```bash
g++ test.cpp -o test # 自动链接 stdc++，直接可以用 std::cout
```

### 实际建议
- 如果写纯C：用`gcc`
- 如果写C++：用`g++`，避免手动添加库的麻烦
- 如果写混合项目（C&C++）：通常使用`g++`做最终链接（因为要链上`libstdc++`），中间的`.o`文件可以用`gcc -c`或`g++ -c`来生成

## GCC的扩展和插件

GCC还支持通过插件机制扩展编译器的功能。开发者可以编写自己的插件，添加新的分析、优化或代码生成特性。这个功能使得GCC在一些特定领域（如静态分析、代码检查等）非常灵活和强大

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
gcc --help=warnings # 查看所有警告悬念
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
GNU GCC官网提供了完整的[在线文档](https://gcc/gnu.org/onlinedocs)，阅读体验通常比终端更好

### 询问编译器本身（`-Q --help=xxx`）

可以让GCC告诉你它默认启用了哪些选项，或者不同优化级别具体包含了哪些子选项

1. 查看激活的优化选项：
`-O2`与`-O3`有什么区别

```bash
# 查看使用 -O2 时，哪些优化器被开启了
gcc -Q -O2 --help=optimizers

# 与 -O3 进行对比
gcc -Q -O3 --help=optimizers
```

输出会是一个很长的列表，显示每个优化选项是 `[enabled]` 还是 `[disabled]`。通过对比，你就可以清晰地看到 `-O3` 比 `-O2` 多开启了哪些具体的优化

2. 查看默认启用的警告

```bash
gcc -Q --help=warnings | grep enabled
```

这个命令可以查看哪些警告选项默认情况下是开启的（即使没有指定`-Wall`）
