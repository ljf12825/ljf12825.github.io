---
title: C/C++ GCC
date: 2026-03-28
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
2. 编译：将预处理后的文件编译成汇编代码
3. 汇编：将汇编代码转换成机器码
4. 链接：将目标文件链接成可执行文件

在链接完成后，中间文件会被删除掉

##### 预处理

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


- 命令：GCC内部调用`cpp`
- 作用：
  - 处理`#include` -> 把头文件内容插入进来
  - 处理宏定义`#define`
  - 处理条件编译`#if/#ifdef`
- 输出一个扩展后的C文件

##### 编译

```bash
gcc -S main.i -o main.s
```

- 预处理后的文件 -> GCC转换称汇编代码
- 这一步就是C -> 汇编

`main.s`是gcc编译阶段最后的人类可读的文件

##### 汇编

```bash
gcc -c main.s -o main.o
```

- 汇编代码 -> 汇编器(`as`) -> 目标文件`.o`
- `.o`文件是机器码二进制，基本不可读
- 每个`.c`文件都会生成一个`.o`文件

`.o`文件里有

- 函数的机器指令
- 数据段、符号表
- 调用其他库函数的信息

##### 链接

```bash
gcc main.o -o main
```

- 链接器`ld`会把`.o`文件，系统库(`libc`, `libm`等)，其他`.o`问阿金，合并成最终的可执行文件`main`，这时`printf`等函数才真正找到实现

#### 警告选项

| 选项 | 作用 |
| - | - |
| `-Wall` | 显示所有常见警告 |
| `-Wextra` | 显示额外警告 |
| `-Werror` | 将警告视为错误 |
| `-w` | 禁止所有警告 |
| `-pedantic` | 遵循标准C,提醒非标准用法 |

GCC只会报真正严重的语法错误或链接错误

- 语法错误（如缺括号、括号不匹配）
- 类型错误（如`int *p = "abc";`）
- 链接错误（如调用不存在的函数）

但像初始化、隐式转换、可能丢失精度等警告，默认不报

> GCC设计之初遵循“兼容老代码”原则，C语言历史上很多老程序有未初始化、隐式转换等现象，默认警告太多导致就代码编译报满屏，用户体验很差

因此，开发中推荐的做法是

```bash
gcc -Wall -Wextra -Werror main.c
```

这样可以保证代码更安全、更规范，尤其是底层/库开发、游戏引擎开发、嵌入式开发等

##### `-Wall`

开启常用警告，比如

- 未使用的函数或变量
- 不匹配的格式化字符串(`printf`/`scanf`)
- 可能的类型转换问题

但不会开启一些“更严格的检查”

##### `-Wextra`

常见警告示例

| 类型 | 示例代码 | 警告 |
| - | - | - |
| 未使用参数 | `int f(int x){return 0;}` | `unused parameter 'x'` |
| 空函数体 | `void f(){}` | `empty body `(depends) |
| 不完全初始化数组 | `int arr[5] = {1,2};` | `missing initializer for element 2` |
| 多余的逗号 | `int arr[] = {1,2,};` | `extra comma` |
| 隐式`int`转换 | `char c = 200;` | `overflow in implicit constant conversion` |
| `return`没有值 | `int f(){}` | `control reaches end of non-void function` |

不同版本GCC会有差异

#### 优化选项

| 选项 | 级别 | 特点 | 适用场景 |
| - | - | - | - |
| `-O0` | 不优化（默认）| 编译最快，调试信息完整 | 开发调试阶段 |
| `-O1` | 基本优化 | 基本优化，不增加编译时间 | 快速测试，平衡模式 |
| `-O2` | 推荐优化 | 常用优化，不增加代码体积 | 生产环境默认选择 |
| `-O3` | 激进优化 | 高级优化，可能增加代码体积 | 性能更关键代码 |
| `-Os` | 体积优化 | 优化代码体积 | 嵌入式、移动设备 |
| `-0fast` | 极致优化 | 突破标准限制的优化 | 数值计算场景 |

##### -O0

```bash
gcc -O0 program.c -o program
```

特点：

- 编译速度最快
- 代码直接对应源代码，不优化
- 调试体验最好（变量不会被优化掉）
- 适合开发和调试阶段

##### -O1

```bash
gcc -O1 program -o program
```

开启的优化：

- 删除未使用的变量和函数
- 简单的常量传播
- 基本的指令调度
- 不增加编译时间

示例：

```c
int test() {
    int a = 10;
    int b = 20;
    int c = a + b; // O1会直接计算为30
    return c;
}
```

##### -O2

```bash
gcc -O2 program.c -o program
```

在-O1的基础上增加：

- 函数内联（小函数）
- 循环展开
- 更激进的指令调度
- 寄存器分配优化
- 死代码消除

这是生产环境最常用的选项

##### -O3

```bash
gcc -O3 program.c -o program
```

在-O2基础上增加：

- 所有函数内联（即使是大的）
- 循环完全展开
- 预测分支优化
- 向量化（SIMD指令）

潜在问题：

- 可能增加代码体积
- 可能降低指令缓存命中率
- 极少情况下反而更慢

##### -Os

```bash
gcc -Os program.c -c program
```

特点：

- 以-O2为基础
- 额外优化代码体积
- 不进行会增大代码体积的优化
- 适合嵌入式系统、移动应用

##### -Ofast

```bash
gcc -Ofast program.c -o program
```

特点：

- 包含-O3所有优化
- 加上`-ffast-math`（浮点运算优化）
- 可能不符合IEEE/ANSI标准
- 适合数值计算、科学计算

##### 具体优化选项

###### 控制内联

```bash
# 禁止内联
-fno-inline

# 限制内联函数大小
--param inline-unit-growth=20

# 内联所有函数（即使没标记inline）
-finline-functions
```

###### 循环优化

```bash
# 循环展开
-funroll-loops

# 循环合并
-fmerge-constant

# 循环向量化
-ftree-vectorize
```

###### 浮点优化

```bash
# 快速数学运算（不保证精度）
--ffast-math

# 不进行浮点优化
-fno-fast-math

# 允许重排浮点运算
-funsafe-math-optimizations
```

###### 内存优化

```bash
# 消除未使用的变量
-fdead-code-elimination

# 合并全局常量
-fmerge-all-constants

# 地址空间布局随机化
-fpie
```

##### 性能对比示例

测试程序

```c
// benchmark.c
#include <stdio.h>
#include <time.h>

#define ITERATIONS 10000000000 // 10^10

int main() {
    clock_t start = clock();
    long long sum = 0;

    for (long long i = 0; i < ITERATIONS; i++) {
        sum += i * i; // 浮点运算
    }

    clock_t end = clock();
    double time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("Time: %.3f seconds\n", time);
    printf("Sum: %lld\n", sum);
    return 0;
}
```

编译指令

```bash
gcc -O0 main.c -o main_O0 && time ./main_O0
gcc -O1 main.c -o main_O1 && time ./main_O1
gcc -O2 main.c -o main_O2 && time ./main_O2
gcc -O3 main.c -o main_O3 && time ./main_O3
gcc -Ofast main.c -o main_Ofast && time ./main_Ofast
```

运行结果

```text
Time: 19.453 seconds
Sum: 7032546979563742720

real    0m19.459s
user    0m19.452s
sys     0m0.001s
Time: 7.349 seconds
Sum: 7032546979563742720

real    0m7.334s
user    0m7.350s
sys     0m0.000s
Time: 3.671 seconds
Sum: 7032546979563742720

real    0m3.646s
user    0m3.670s
sys     0m0.001s
Time: 3.659 seconds
Sum: 7032546979563742720

real    0m3.639s
user    0m3.660s
sys     0m0.000s
Time: 3.665 seconds
Sum: 7032546979563742720

real    0m3.650s
user    0m3.665s
sys     0m0.001s
```

分析

```text
-O0 ~ -O1 有2.7x的提升
-O1 ~ -O2 有2x的提升
-O2 ~ -O3 的提升不明显
-Ofast 轻微提升

sum值在所有优化选项下相同，说明

1. 所有优化都保持了计算结果一致
2. 溢出是确定的（无符号/有符号溢出是正确行为）
3. 编译器优化没有改变计算结果

理论计算公式（取模2^64）
sum = (N-1) * N * (2N-1) / 6
N = 10 ^ 10
结果应该是一个64位整数

详细优化可以对比编译后的汇编文件进行分析
```

#### 调试选项

调试选项本质上是在编译阶段保留足够的信息，从而让调试器能够还原源码级的执行过程

##### `-g`

```bash
gcc -g main.c -o main
```

作用：

- 生成调试信息(debug symbols)
- 包括：
  - 变量名
  - 函数名
  - 源码行号
  - 类型信息

没有`-g`，gdb只能看到汇编，看不到源码和变量名

###### `-g`的不同等级

```bash
-g0 // 不生成调试信息
-g1 // 最少（只有函数/行号）
-g2 // 默认
-g3 // 最详细（包含宏）
```

一般用`-g`，如果调试宏用`-g3`

##### `-ggdb`

含义：

- 生成GDB专用增强调试信息
- 比`-g`更GDB友好

##### 增强调试能力的选项

- `-fno-inline`
  - 禁止函数内联，否则在GDB中打不到断点、无调用栈
- `-fno-omit-frame-pointer`
  - 推荐在linux下使用，可保留rbp(x86_64)，让GDB,perf,火焰图更加准确
- `-fvar-tracking`
  - 提高变量追踪能力
- `-fvar-tracking-assignments`
  - 更强的变量追踪

##### 调试信息格式 DWARF

```bash
-gdwarf-4
-gdwarf-5
```

DWARF是调试信息标准

- v4版本：稳定
- v5版本：更现代（压缩更好）

##### Sanitizer

###### AddressSanitizer

```bash
-fsanitize=address -g
```

检查越界，user-after-free, stack overflow

###### UndefinedBehaviorSanitizer

```bash
-fsanitize=undefined -g
```

检测UB

#### 优化与调试的关系

`-O`会破坏调试体验

```bash
-O0 // 无优化，最适合调试
-O2 // 常规优化
-O3 // 激进优化
```

优化会导致：

- 变量被优化掉(optimized out)
- 代码重排
- 内联函数
- 行号错乱

##### `-Og`

`-Og`可以理解成“为调试而设计的优化级别”，它介于`-O0`和`-O1`之间，但目标不是性能，而是在保证可调式性的前提下做一些“安全优化”

`-O0`最好调试，但代码很原始，执行慢；`-O2`性能好，但变量消失，行号错乱，断点跳来跳去\
gcc引入`-Og`的目的就是在不破坏调试体验的前提下，让程序稍微接近真实执行状态

`-Og`做

- 简单常量传播
- 死代码消除（不会影响调试语义的）
- 基本块简化
- 一些轻量SSA优化

不会做：

- 激进内联
- 复杂循环优化
- 重排导致行号错乱
- 变量寄存器化过度

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

# 方式3：Makefile
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

## Release & Debug

GCC 本身没有Debug/Release模式，这是构建系统层面的概念

GCC只有一堆编译选项，而Debug/Release只是这些选项的组合约定

Debug/Release通常来自：CMake, Makefile, IDE，它们自己约定

- Debug = 一组“好调试”的编译参数
- Release = 一组“高性能”的编译参数

GCC只关心三件事

1. 是否生成调试信息
2. 优化级别
3. 宏控制行为

所谓Debug/Release,就是这三者的组合

- Debug = 有调试信息 + 低优化
- Release = 无调试信息 + 高优化 + 关闭断言

### 示例

#### Debug

```bash
-g -O0
```

或者更现代的

```bash
-g -Og
```

特点

- 有完整调试信息
- 几乎不优化
- 变量可见
- 断点稳定

#### Release

```bash
-O2 -DNDEBUG
```

特点：

- 高优化（性能好）
- 去掉调试信息
- 去掉断言


##### DNDEBUG

```c
#include <assert.h>

assert(x > 0);
```

Debug:

```bash
-g
```

`assert`生效

Release

```bash
-DNDEBUG
```

`assert`被优化掉

```c
// 等价于
((void)0
```

### CMake行为

在Cmake里

```bash
cmake -DCMAKE_BUILD_TYPE=Debug
```

等价于

```bash
-g
```

```bash
cmake =DCMAKE_BUILD_TYPE=Release
```

等价于

```bash
-O3 -DNDEBUG
```

```bash
cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

等价于

```bash
-O2 -g
```















