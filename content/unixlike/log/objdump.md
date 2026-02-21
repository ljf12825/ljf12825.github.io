---
title: objdump
date: 2025-12-31
categories: [GNU]
tags: [coreutils]
author: "ljf12825"
type: log
draft: false
summary: usage of gnu objdump
---


# objdump

`objdump`用来查看二进制目标文件的内部结构

它可以解析的文件包括

- `.o`（目标文件）
- 可执行文件（ELF）
- `.so`（动态库/共享库）
- 静态库中的对象文件

`objdump`能查看

| 能力 | 说明 |
| - | - |
| 反汇编 | 看机器指令 |
| 符号表 | 函数/变量是否存在 |
| 段信息 | `.text`, `.data`, `.bss` |
| 重定位信息 | 链接器怎么补地址 |
| 动态依赖 | 用了那些`.so` |
| 调试信息 | DWARF |

## 实际应用场景

1. 逆向工程：分析未知二进制文件结构
2. 调试辅助：查看崩溃时的代码位置
3. 性能优化：分析热点函数的汇编代码
4. 安全审计：检查二进制中的字符串和函数调用
5. 学习工具：理解编译器如何生成代码
6. 问题诊断：分析符号冲突、重定位问题

## 使用

```bash
objdump [options] objfile...
```

至少要指定一个选项

```text
-a, -d, -D, -e, -f, -g, -G, -h, -H, -p, -P, -r, -R, -s, -S, -t, -T, -V, -x
```

### 主要功能

1. 文件结构分析
    - `-f`/`--file-headers`：显示文件整体头部摘要（架构、入口地址等）
    - `-h`/`--section-headers`：显示节区头部表（.text, .data, .bss等段的信息）
    - `-x`/`--all-headers`：显示所有头部信息（等价于`-a -f -h -p -r -t`的组合）
2. 反汇编与分析
    - `-d`/`--disassemble`：反汇编代码段（仅包含指令的节区）
    - `-D`/`--isassemble-all`：反汇编所有非空节区（包括可能包含数据的节区）
    - `-S`/`--source`：源代码与汇编代码交错显示（需调试信息）
    - `-l`/`--line-numbers`：显示源代码行号信息
3. 符号表查看
    - `-t`/`--syms`：显示符号表（类似`nm`命令）
    - `-T`/`--dynamic-syms`：显示动态符号表（用于共享库）
    - `--special-syms`：显示特殊符号
4. 节区内容查看
    - `-s`/`--full-contents`：显示节区完整内容（十六进制+ASCII）
    - `-j section`/`--section=section`：指定显示特定节区
    - `-z`/`--disassemble-zeroes`：反汇编零值块（默认跳过）
5. 调试信息分析
    - `-g`/`--debugging`：显示调试信息（STABS/DWARF格式）
    - `-W`/`--dwarf`：显示DWARF调试信息（多种子选项）
        - `=info`：显示`.debug_info`节区
        - `=decodedline`：显示解码的行号信息
        - `=frames`：显示调用帧信息
        - `-follow-links`：跟随调试信息链接
6. 重定位信息
    - `-r`/`--reloc`：显示重定位条目
    - `-R`/`--dynamic-reloc`：显示动态重定位条目
7. 特殊格式分析
    - `-a`/`--archive-headers`：分析归档文件（如`.a`静态库）
    - `-G`/`--stabs`：显示STABS调试信息
    - `--ctf`：显示CTF(Compact Type Format)信息
    - `--sframe`：显示栈帧信息

### 重要选项

#### 反汇编控制

- `-M intel`/`-M att`：选择Intel或AT&T汇编语法
- `--no-show-raw-insn`：不显示原始指令字节
- `--insn-width=width`：设置每行显示的指令字节数
- `--visualize-jumps[=color]`：可视化跳转（ASCII艺术图）
- `--disassemble-color`：彩色语法高亮

#### 架构与格式

- `-b bfdname`/`--target=bfdname`：指定目标文件格式
- `-m machine`/`--architecture=machine`：指定目标架构
- `-EB`/`-EL`/`--endian={big|little}`：指定字节序

#### 显示控制

- `--start-address=addr`/`--stop-address=addr`：限制显示地址范围
- `--no-addresses`：不显示地址（便于代码比较）
- `--prefix-addresses`：显示完整地址（旧格式）
- `-w`/`--wide`：宽格式输出（不截断长符号名）
- `-C`/`--demangle`：解码C++符号名

#### 调试相关

- `--dwarf-depth=n`：限制DWARF信息显示深度
- `dwarf-start=n`：从指定DIE开始显示
- `--adjust-vma=offset`：调整节区显示地址

#### 架构特定功能

##### x86/x86_64

- `M intel`：Intel语法
- `-M att`：AT&T语法（默认）
- `-M suffix`：显示指令后缀
- `-M x86-64`/`-M i386`：指定指令集

##### ARM

- `-M reg-names-std`：标准寄存器名
- `-M reg-names-raw`：原始寄存器名（r0, r1...）
- `-M force-thumb`：强制解释为Thumb指令

##### MIPS

- `-M no-aliases`：显示原始指令
- `-M gpr-names=ABI`：指定ABI寄存器名

## 示例

### 测试程序

```cpp
#include <iostream>

int g_value = 10;

__attribute__((noinline))
int Add(int a, int b) {
    return a + b + g_value;
}

int main() {
    int x = 3;
    int y = 4;
    int z = Add(x, y);
    std::cout << z << std::endl;
    return 0;
}
```

- `g_value`：全局变量
- `Add`：强制不inline（方便观察）
- `main`：函数调用 + I/O

### 编译

#### 1. 不优化 + 带调试信息

```bash
g++ -O0 -g test.cpp -o test_O0
```

- `-O0`：关闭优化（汇编直观）
- `-g`：生成调试信息（给objdump -S 用）

#### 2. 开启优化

```bash
g++ -O2 test.cpp -o test_O2
```

### 查看ELF基本结构

查看段(Section)信息

```bash
objdump -h test_O0
```

```text
test_O0:     file format elf64-x86-64

Sections:
Idx Name          Size      VMA               LMA               File off  Algn
  0 .interp       0000001c  0000000000000318  0000000000000318  00000318  2**0
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  1 .note.gnu.property 00000030  0000000000000338  0000000000000338  00000338  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  2 .note.gnu.build-id 00000024  0000000000000368  0000000000000368  00000368  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  3 .note.ABI-tag 00000020  000000000000038c  000000000000038c  0000038c  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  4 .gnu.hash     00000028  00000000000003b0  00000000000003b0  000003b0  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  5 .dynsym       00000108  00000000000003d8  00000000000003d8  000003d8  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  6 .dynstr       0000012f  00000000000004e0  00000000000004e0  000004e0  2**0
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  7 .gnu.version  00000016  0000000000000610  0000000000000610  00000610  2**1
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  8 .gnu.version_r 00000060  0000000000000628  0000000000000628  00000628  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  9 .rela.dyn     000000f0  0000000000000688  0000000000000688  00000688  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 10 .rela.plt     00000030  0000000000000778  0000000000000778  00000778  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 11 .init         0000001b  0000000000001000  0000000000001000  00001000  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 12 .plt          00000030  0000000000001020  0000000000001020  00001020  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 13 .plt.got      00000010  0000000000001050  0000000000001050  00001050  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 14 .plt.sec      00000020  0000000000001060  0000000000001060  00001060  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 15 .text         00000162  0000000000001080  0000000000001080  00001080  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 16 .fini         0000000d  00000000000011e4  00000000000011e4  000011e4  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 17 .rodata       00000007  0000000000002000  0000000000002000  00002000  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 18 .eh_frame_hdr 0000003c  0000000000002008  0000000000002008  00002008  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 19 .eh_frame     000000cc  0000000000002048  0000000000002048  00002048  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 20 .init_array   00000008  0000000000003d98  0000000000003d98  00002d98  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 21 .fini_array   00000008  0000000000003da0  0000000000003da0  00002da0  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 22 .dynamic      00000200  0000000000003da8  0000000000003da8  00002da8  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 23 .got          00000058  0000000000003fa8  0000000000003fa8  00002fa8  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 24 .data         00000014  0000000000004000  0000000000004000  00003000  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 25 .bss          00000118  0000000000004040  0000000000004040  00003014  2**6
                  ALLOC
 26 .comment      0000002b  0000000000000000  0000000000000000  00003014  2**0
                  CONTENTS, READONLY
 27 .debug_aranges 00000030  0000000000000000  0000000000000000  0000303f  2**0
                  CONTENTS, READONLY, DEBUGGING, OCTETS
 28 .debug_info   00002084  0000000000000000  0000000000000000  0000306f  2**0
                  CONTENTS, READONLY, DEBUGGING, OCTETS
 29 .debug_abbrev 00000581  0000000000000000  0000000000000000  000050f3  2**0
                  CONTENTS, READONLY, DEBUGGING, OCTETS
 30 .debug_line   00000146  0000000000000000  0000000000000000  00005674  2**0
                  CONTENTS, READONLY, DEBUGGING, OCTETS
 31 .debug_str    0000104e  0000000000000000  0000000000000000  000057ba  2**0
                  CONTENTS, READONLY, DEBUGGING, OCTETS
 32 .debug_line_str 0000027c  0000000000000000  0000000000000000  00006808  2**0
                  CONTENTS, READONLY, DEBUGGING, OCTETS
```

#### 分析

##### 表头

1. `Idx(Index)` 索引号
    - 含义：节区在节区头表中的顺序索引（从0开始）
    - 用途：快速引用节区，某些工具使用索引而非名称
2. `Name` 节区名称
    - 含义：节区的标准名称
    - 常见名称：
        - `.text`：程序代码
        - `.data`：已初始化数据
        - `.bss`：未初始化数据
        - `.rodata`：只读数据
        - `.shstrtab`：节区名称字符串表
    - 注意：名称前的点号是ELF标准约定
3. `Size` 节区大小
    - 含义：节区在内存中占用的字节数（十六进制）
    - 重要区别
        - 文件大小 vs 内存大小
        - 例如`.bss`：内存有大小（0x118），但文件大小为0
    - 单位：字节（byte）
4. `VMA(Virtual Memory Address)` 虚拟内存地址
    - 含义：节区在进程虚拟地址空间中的加载地址
    - 也称为：`sh_addr`（节区头部中的地址字段）
    - 关键点
        - 程序运行时，节区会被加载到这个地址
        - 代码中的绝对地址引用基于此
        - 不同进程相同的VMA（因为每个进程有独立的地址空间）
5. `LMA(Load Memory Address)` 加载内存地址
    - 含义：节区在物理内存中的加载地址
    - 关键点
        - 对于大多数系统程序，LMA=VMA
        - 差异出现在嵌入式/特殊系统（如ROM中运行的程序）
            - 程序存储在ROM(LMA)，运行时拷贝到RAM(VMA)
6. `File off(File Offset)` 文件偏移
    - 含义：节区内容在ELF文件中的起始位置
    - 关键点：
        - 从文件开头计算的字节偏移
        - 调试节区（如`.debug_info`）的VMA=0但File off有效
        - 用于`objdump -s -j` 查看节区原始内容
7. `Algn(Alignment)` 对齐要求
    - 格式`2**n`(2的n次方)
    - 含义：节区在内存和文件中的对齐边界
    - 示例
        - `2**0`：1字节对齐（任意地址）
        - `2**4`：16字节对齐（地址末4位为0）
        - `2**13`：4096字节对齐（页对齐）
    - 作用：提高内存访问效率，满足硬件要求

##### 节区标志

节区标志是ELF文件中描述节区属性的位掩码，定义了一个节区在内存中的行为权限

1. CONTENTS
    - 含义：节区在文件中有实际内容
    - 反例：`.bss`节区没有CONTENTS标志
        - 在文件中不占空间
        - 运行时分配并初始化为0
2. ALLOC
    - 含义：节区在进程运行时占用内存
    - 关键：几乎所有有意义的节区都有ALLOC
    - 例外：纯调试信息节区（如`.debug_info`）通常没有ALLOC, 它们只存在于文件中，不加载到内存

3. LOAD
    - 含义：节区需要从文件加载到内存
    - 条件：必须同时有CONTENTS + ALLOC
    - 示例：
        - `.text`：需要从文件加载代码到内存执行
        - `.data`：加载初始化数据
    - 反例：
        - `.bss`：有ALLOC但无LOAD（无需从文件加载）
        - `.debug_info`：有CONTENTS但无LOAD（不加载到内存）

4. READONLY
    - 含义：节区在内存中只读
    - 保护：尝试写入会导致段错误（Segmentation Fault）
    - 包含：
        - `.text`：代码段（不可自我修改）
        - `.rodata`：只读数据（字符串常量等）
        - `.eh_frame`：异常处理信息
        - 所有只读数据节区
5. CODE
    - 含义：节区包含可执行代码
    - 权限：通常同时有READONLY（现代系统）
    - 示例：`.text`, `.init`, `.fini`, `.plt*`
    - 注意：代码段在现代系统中一般是不可写的（W^X安全策略）
6. DATA
    - 含义：节区包含数据（非代码）
    - 子类型：
        - 读写数据：`.data`, `.bss`
        - 只读数据：`.rodata`, `.eh_frame*`
        - 特殊数据：`.dynamic`, `.got`, `.init_array`
7. DEBUGGING
    - 含义：节区包含调试信息
    - 特点：通常没有ALLOC和LOAD
    - 示例：`.debug_info`, `debug_line`, `debug_str`
    - 用途：仅供调试器（gdb）使用，运行时不需要
8. OCTETS
    - 含义：节区包含任意字节数据
    - 出现：主要与DEBUGGING一起出现
    - 表示：该节区没有特定结构

在ELF标准中，节区头有一个`sh_flags`字段，包含以下位标志

| 标志名 | 值（十六进制）| 含义 | objdump显示名 |
| - | - | - | - |
| SHF_WRITE | 0x1 | 节区可写 | (无，READONLY的反面) |
| SHF_ALLOC | 0x2 | 节区在内存中分配 | ALLOC |
| SHF_EXECINSTR | 0x4 | 节区包含可执行指令 | CODE |
| SHF_MERGE | 0x10 | 节区内容可合并 | (不常见) |
| SHF_STRINGS | 0x20 | 节区包含以null结尾的字符串 | (不常见) |
| SHF_INFO_LINK | 0x40 | sh_info 包含节区索引 | (内部使用) |
| SHF_LINK_ORDER | 0x80 | 特殊链接顺序要求 | (内部使用) |
| SHF_OS_NONCONFORMING | 0x100 | 需要特定OS支持 | (不常见) |
| SHF_GROUP | 0x200 | 节区属于一个组 | (不常见) |
| SHF_TLS | 0x400 | 线程局部存储 | (特殊) |
| SHF_COMPRESSED | 0x800 | 节区内容被压缩 | (不常见) |
| SHF_MASKOS | 0x0ff00000 | 操作系统特定 | (OS相关) |
| SHF_MASKPROC | 0xf0000000 | 处理器特定 | (CPU相关) |

##### 示例

```text
 15 .text         00000162  0000000000001080  0000000000001080  00001080  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
```

- 索引号：`15` - 这是16th个节区（从0开始计数）
- 名称：`.text` - 主程序代码段，包含所有可执行代码
- 大小：`00000162`（16进制） = 354字节
  - 这是程序所有编译后代码的总大小
  - 包括main函数和其他所有函数
  - 注意：这只是用户代码，不包括库函数（它们在共享库中）
- VMA（虚拟内存地址）：`0000000000001080`
  - 程序运行时，这段代码将加载到进程地址空间的0x1080处
  - 这是典型的起始地址（避开低地址区域）
- LMA（加载内存地址）：`0000000000001080`
  - 与VMA相同，表示这是普通系统程序
  - 对于嵌入式系统可能不同（如ROM中执行）
- 文件偏移：`00001080`（十六进制） = 4224字节
  - 在ELF文件中，这个节区的内容从第4224字节开始
  - 使用`objdump -s -j .text`可以查看这里的原始字节
- 对齐：`2**4` = 16字节对齐
  - 节区的内存和文件中的起始地址必须是16的倍数
  - 0x1080确实是16的倍数
- 标志位
  - CONTENTS
    - 节区在文件中有实际内容
    - 文件偏移0x1080到0x1080+0x162 = 0x11e2之间有354字节的机器码
    - 可以用`hexdump -C test_O0 -s 0x1080 -n 0x162`查看原始字节
  - ALLOC
    - 节区在进程运行时占用内存
    - 运行时会在虚拟地址0x1080处分配354字节内存
    - 几乎所有可执行代码都有此标志
  - LOAD
    - 节区需要从文件加载到内存
    - 程序启动时，加载器会将文件中的354字节机器码复制到内存地址0x1080
  - READONLY
    - 节区在内存中只读
    - 关键安全特性：防止代码被修改（代码注入攻击）
    - 尝试写入此内存区域会导致段错误（Segmentation Fault）
    - 现代系统的W^X（写异或执行）原则：内存页不能同时可写和可执行
  - CODE
    - 节区包含可执行机器指令
    - 操作系统会将此内存标记为可执行
    - CPU可以直接从这里取指令执行

##### 实际内存映射

```c
// 类似这样的系统调用
mmap(
    (void*)0x1080,          // 请求的地址
    0x162,                  // 大小：354字节
    PROT_READ | PROT_EXEC,  // 权限：可读 + 可执行（不可写！）
    MAP_PRIVATE | MAP_FIXED, // 私有映射，固定地址
    fd,                     // ELF文件描述符
    0x1080                  // 文件偏移
);
```

##### 前后节区关系

###### 前后节区

```text
14 .plt.sec      00000020  0000000000001060  0000000000001060  00001060  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
15 .text         00000162  0000000000001080  0000000000001080  00001080  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
16 .fini         0000000d  00000000000011e4  00000000000011e4  000011e4  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
```

- `.plt.sec`：在`.text`之前（0x1060-0x1080），动态链接跳转
- `.text`：主代码段（0x1080-0x11e2）
- `.fini`：在`.text`之后（0x11e4-0x11f1），程序清理代码

###### 地址计算

- `.text`结束地址：0x1080 + 0x162 = 0x11e2
- `.fini`开始地址：0x11e4
- 中间有2字节间隙（0x11e2-0x11e3），可能是对齐充填或特殊用途

#### 查看符号表（函数 & 变量）

```bash
objdump -t test_O0
```

```text
test_O0:     file format elf64-x86-64

SYMBOL TABLE:
0000000000000000 l    df *ABS*  0000000000
000000              Scrt1.o
000000000000038c l     O .note.ABI-tag  00
00000000000020              __abi_tag
0000000000000000 l    df *ABS*  0000000000
000000              crtstuff.c
00000000000010b0 l     F .text  0000000000
000000              deregister_tm_clones
00000000000010e0 l     F .text  0000000000
000000              register_tm_clones
0000000000001120 l     F .text  0000000000
000000              __do_global_dtors_aux
0000000000004150 l     O .bss   0000000000
000001              completed.0
0000000000003da0 l     O .fini_array    00
00000000000000              __do_global_dt
ors_aux_fini_array_entry
0000000000001160 l     F .text  0000000000
000000              frame_dummy
0000000000003d98 l     O .init_array    00
00000000000000              __frame_dummy_
init_array_entry
0000000000000000 l    df *ABS*  0000000000
000000              test.cpp
0000000000002004 l     O .rodata        00
00000000000001              _ZNSt8__detail
30__integer_to_chars_is_unsignedIjEE
0000000000002005 l     O .rodata        00
00000000000001              _ZNSt8__detail
30__integer_to_chars_is_unsignedImEE
0000000000002006 l     O .rodata        00
00000000000001              _ZNSt8__detail
30__integer_to_chars_is_unsignedIyEE
0000000000000000 l    df *ABS*  0000000000
000000              crtstuff.c
0000000000002110 l     O .eh_frame      00
00000000000000              __FRAME_END__
0000000000000000 l    df *ABS*  0000000000
000000              
0000000000002008 l       .eh_frame_hdr  00
00000000000000              __GNU_EH_FRAME
_HDR
0000000000003da8 l     O .dynamic       00
00000000000000              _DYNAMIC
0000000000003fa8 l     O .got   0000000000
000000              _GLOBAL_OFFSET_TABLE_
0000000000004014 g       .data  0000000000
000000              _edata
0000000000004000  w      .data  0000000000
000000              data_start
0000000000002000 g     O .rodata        00
00000000000004              _IO_stdin_used
0000000000000000  w    F *UND*  0000000000
000000              __cxa_finalize@GLIBC_2
.2.5
0000000000001189 g     F .text  0000000000
000059              main
0000000000000000       F *UND*  0000000000
000000              _ZSt4endlIcSt11char_tr
aitsIcEERSt13basic_ostreamIT_T0_ES6_@GLIBC
XX_3.4
0000000000004008 g     O .data  0000000000
000000              .hidden __dso_handle
00000000000011e4 g     F .fini  0000000000
000000              .hidden _fini
0000000000000000       F *UND*  0000000000
000000              __libc_start_main@GLIB
C_2.34
0000000000001080 g     F .text  0000000000
000026              _start
0000000000000000       F *UND*  0000000000
000000              _ZNSolsEPFRSoS_E@GLIBC
XX_3.4
0000000000001000 g     F .init  0000000000
000000              .hidden _init
0000000000004018 g     O .data  0000000000
000000              .hidden __TMC_END__
0000000000001169 g     F .text  0000000000
000020              _Z3Addii
0000000000004010 g     O .data  0000000000
000004              g_value
0000000000004040 g     O .bss   0000000000
000110              _ZSt4cout@GLIBCXX_3.4
0000000000004000 g       .data  0000000000
000000              __data_start
0000000000004158 g       .bss   0000000000
000000              _end
0000000000004040 g       .bss   0000000000
000000              __bss_start
0000000000000000       F *UND*  0000000000
000000              _ZSt21ios_base_library
_initv@GLIBCXX_3.4.32
0000000000000000       F *UND*  0000000000
000000              _ZNSolsEi@GLIBCXX_3.4
0000000000000000  w      *UND*  0000000000
000000              _ITM_deregisterTMClone
Table
0000000000000000  w      *UND*  0000000000
000000              __gmon_start__
0000000000000000  w      *UND*  0000000000
000000              _ITM_registerTMCloneTa
ble
```

##### 解析

符号表格式解析

```text
<地址> <标志> <节区> <大小> <名称>
```

1. 地址列（Address）
    - 符号在内存中的地址（VMA）
    - `0000000000000000`表示未定义（UND）或未分配
2. 标志列（Flags）
    单个字符表示符号属性
    - l(local)：局部符号（文件内可见）
    - g(global)：全局符号（外部可见）
    - w(weak)：弱符号（可被覆盖）
    - 空格：普通符号
    - F：函数符号
    - O：对象/数据符号
3. 节区列（Section）
    - 符号所属节区名称
    - `*ABS*`：绝对符号（不依赖节区）
    - `*UND*`：未定义（在其他文件中定义）
4. 大小列（Size）
    - 符号占用字节数
    - `0000000000000000`表示大小未知或为0
5. 名称列（Name）
    - 符号名称（可能被C++修饰）
    - 以`@`结尾表示版本信息（如`@GLIBC_2.34`）

可以使用`grep`过滤关键内容

```bash
objdump -t test_O0 | grep -E "Add|main|g_value"
```

#### 反汇编

##### 默认反汇编（AT&T风格）

```bash
objdump -d test_O0
```

符号比较反直觉

```test
test_O0:     file format elf64-x86-64


Disassembly of section .init:

0000000000001000 <_init>:
    1000:       f3 0f 1e fa             en
dbr64
    1004:       48 83 ec 08             su
b    $0x8,%rsp
    1008:       48 8b 05 e1 2f 00 00    mo
v    0x2fe1(%rip),%rax        # 3ff0 <__gm
on_start__@Base>
    100f:       48 85 c0                te
st   %rax,%rax
    1012:       74 02                   je
     1016 <_init+0x16>
    1014:       ff d0                   ca
ll   *%rax
    1016:       48 83 c4 08             ad
d    $0x8,%rsp
    101a:       c3                      re
t

Disassembly of section .plt:

0000000000001020 <.plt>:
    1020:       ff 35 8a 2f 00 00       pu
sh   0x2f8a(%rip)        # 3fb0 <_GLOBAL_O
FFSET_TABLE_+0x8>
    1026:       ff 25 8c 2f 00 00       jm
p    *0x2f8c(%rip)        # 3fb8 <_GLOBAL_
OFFSET_TABLE_+0x10>
    102c:       0f 1f 40 00             no
pl   0x0(%rax)
    1030:       f3 0f 1e fa             en
dbr64
    1034:       68 00 00 00 00          pu
sh   $0x0
    1039:       e9 e2 ff ff ff          jm
p    1020 <_init+0x20>
    103e:       66 90                   xc
hg   %ax,%ax
    1040:       f3 0f 1e fa             en
dbr64
    1044:       68 01 00 00 00          pu
sh   $0x1
    1049:       e9 d2 ff ff ff          jm
p    1020 <_init+0x20>
    104e:       66 90                   xc
hg   %ax,%ax

Disassembly of section .plt.got:

0000000000001050 <__cxa_finalize@plt>:
    1050:       f3 0f 1e fa             en
dbr64
    1054:       ff 25 76 2f 00 00       jm
p    *0x2f76(%rip)        # 3fd0 <__cxa_fi
nalize@GLIBC_2.2.5>
    105a:       66 0f 1f 44 00 00       no
pw   0x0(%rax,%rax,1)

Disassembly of section .plt.sec:

0000000000001060 <_ZNSolsEPFRSoS_E@plt>:
    1060:       f3 0f 1e fa             en
dbr64
    1064:       ff 25 56 2f 00 00       jm
p    *0x2f56(%rip)        # 3fc0 <_ZNSolsE
PFRSoS_E@GLIBCXX_3.4>
    106a:       66 0f 1f 44 00 00       no
pw   0x0(%rax,%rax,1)

0000000000001070 <_ZNSolsEi@plt>:
    1070:       f3 0f 1e fa             en
dbr64
    1074:       ff 25 4e 2f 00 00       jm
p    *0x2f4e(%rip)        # 3fc8 <_ZNSolsE
i@GLIBCXX_3.4>
    107a:       66 0f 1f 44 00 00       no
pw   0x0(%rax,%rax,1)

Disassembly of section .text:

0000000000001080 <_start>:
    1080:       f3 0f 1e fa             en
dbr64
    1084:       31 ed                   xo
r    %ebp,%ebp
    1086:       49 89 d1                mo
v    %rdx,%r9
    1089:       5e                      po
p    %rsi
    108a:       48 89 e2                mo
v    %rsp,%rdx
    108d:       48 83 e4 f0             an
d    $0xfffffffffffffff0,%rsp
    1091:       50                      pu
sh   %rax
    1092:       54                      pu
sh   %rsp
    1093:       45 31 c0                xo
r    %r8d,%r8d
    1096:       31 c9                   xo
r    %ecx,%ecx
    1098:       48 8d 3d ea 00 00 00    le
a    0xea(%rip),%rdi        # 1189 <main>
    109f:       ff 15 3b 2f 00 00       ca
ll   *0x2f3b(%rip)        # 3fe0 <__libc_s
tart_main@GLIBC_2.34>
    10a5:       f4                      hl
t
    10a6:       66 2e 0f 1f 84 00 00    cs
 nopw 0x0(%rax,%rax,1)
    10ad:       00 00 00 

00000000000010b0 <deregister_tm_clones>:
    10b0:       48 8d 3d 61 2f 00 00    le
a    0x2f61(%rip),%rdi        # 4018 <__TM
C_END__>
    10b7:       48 8d 05 5a 2f 00 00    le
a    0x2f5a(%rip),%rax        # 4018 <__TM
C_END__>
    10be:       48 39 f8                cm
p    %rdi,%rax
    10c1:       74 15                   je
     10d8 <deregister_tm_clones+0x28>
    10c3:       48 8b 05 1e 2f 00 00    mo
v    0x2f1e(%rip),%rax        # 3fe8 <_ITM
_deregisterTMCloneTable@Base>
    10ca:       48 85 c0                te
st   %rax,%rax
    10cd:       74 09                   je
     10d8 <deregister_tm_clones+0x28>
    10cf:       ff e0                   jm
p    *%rax
    10d1:       0f 1f 80 00 00 00 00    no
pl   0x0(%rax)
    10d8:       c3                      re
t
    10d9:       0f 1f 80 00 00 00 00    no
pl   0x0(%rax)

00000000000010e0 <register_tm_clones>:
    10e0:       48 8d 3d 31 2f 00 00    le
a    0x2f31(%rip),%rdi        # 4018 <__TM
C_END__>
    10e7:       48 8d 35 2a 2f 00 00    le
a    0x2f2a(%rip),%rsi        # 4018 <__TM
C_END__>
    10ee:       48 29 fe                su
b    %rdi,%rsi
    10f1:       48 89 f0                mo
v    %rsi,%rax
    10f4:       48 c1 ee 3f             sh
r    $0x3f,%rsi
    10f8:       48 c1 f8 03             sa
r    $0x3,%rax
    10fc:       48 01 c6                ad
d    %rax,%rsi
    10ff:       48 d1 fe                sa
r    $1,%rsi
    1102:       74 14                   je
     1118 <register_tm_clones+0x38>
    1104:       48 8b 05 ed 2e 00 00    mo
v    0x2eed(%rip),%rax        # 3ff8 <_ITM
_registerTMCloneTable@Base>
    110b:       48 85 c0                te
st   %rax,%rax
    110e:       74 08                   je
     1118 <register_tm_clones+0x38>
    1110:       ff e0                   jm
p    *%rax
    1112:       66 0f 1f 44 00 00       no
pw   0x0(%rax,%rax,1)
    1118:       c3                      re
t
    1119:       0f 1f 80 00 00 00 00    no
pl   0x0(%rax)

0000000000001120 <__do_global_dtors_aux>:
    1120:       f3 0f 1e fa             en
dbr64
    1124:       80 3d 25 30 00 00 00    cm
pb   $0x0,0x3025(%rip)        # 4150 <comp
leted.0>
    112b:       75 2b                   jn
e    1158 <__do_global_dtors_aux+0x38>
    112d:       55                      pu
sh   %rbp
    112e:       48 83 3d 9a 2e 00 00    cm
pq   $0x0,0x2e9a(%rip)        # 3fd0 <__cx
a_finalize@GLIBC_2.2.5>
    1135:       00 
    1136:       48 89 e5                mo
v    %rsp,%rbp
    1139:       74 0c                   je
     1147 <__do_global_dtors_aux+0x27>
    113b:       48 8b 3d c6 2e 00 00    mo
v    0x2ec6(%rip),%rdi        # 4008 <__ds
o_handle>
    1142:       e8 09 ff ff ff          ca
ll   1050 <__cxa_finalize@plt>
    1147:       e8 64 ff ff ff          ca
ll   10b0 <deregister_tm_clones>
    114c:       c6 05 fd 2f 00 00 01    mo
vb   $0x1,0x2ffd(%rip)        # 4150 <comp
leted.0>
    1153:       5d                      po
p    %rbp
    1154:       c3                      re
t
    1155:       0f 1f 00                no
pl   (%rax)
    1158:       c3                      re
t
    1159:       0f 1f 80 00 00 00 00    no
pl   0x0(%rax)

0000000000001160 <frame_dummy>:
    1160:       f3 0f 1e fa             en
dbr64
    1164:       e9 77 ff ff ff          jm
p    10e0 <register_tm_clones>

0000000000001169 <_Z3Addii>:
    1169:       f3 0f 1e fa             en
dbr64
    116d:       55                      pu
sh   %rbp
    116e:       48 89 e5                mo
v    %rsp,%rbp
    1171:       89 7d fc                mo
v    %edi,-0x4(%rbp)
    1174:       89 75 f8                mo
v    %esi,-0x8(%rbp)
    1177:       8b 55 fc                mo
v    -0x4(%rbp),%edx
    117a:       8b 45 f8                mo
v    -0x8(%rbp),%eax
    117d:       01 c2                   ad
d    %eax,%edx
    117f:       8b 05 8b 2e 00 00       mo
v    0x2e8b(%rip),%eax        # 4010 <g_va
lue>
    1185:       01 d0                   ad
d    %edx,%eax
    1187:       5d                      po
p    %rbp
    1188:       c3                      re
t

0000000000001189 <main>:
    1189:       f3 0f 1e fa             en
dbr64
    118d:       55                      pu
sh   %rbp
    118e:       48 89 e5                mo
v    %rsp,%rbp
    1191:       48 83 ec 10             su
b    $0x10,%rsp
    1195:       c7 45 f4 03 00 00 00    mo
vl   $0x3,-0xc(%rbp)
    119c:       c7 45 f8 04 00 00 00    mo
vl   $0x4,-0x8(%rbp)
    11a3:       8b 55 f8                mo
v    -0x8(%rbp),%edx
    11a6:       8b 45 f4                mo
v    -0xc(%rbp),%eax
    11a9:       89 d6                   mo
v    %edx,%esi
    11ab:       89 c7                   mo
v    %eax,%edi
    11ad:       e8 b7 ff ff ff          ca
ll   1169 <_Z3Addii>
    11b2:       89 45 fc                mo
v    %eax,-0x4(%rbp)
    11b5:       8b 45 fc                mo
v    -0x4(%rbp),%eax
    11b8:       89 c6                   mo
v    %eax,%esi
    11ba:       48 8d 05 7f 2e 00 00    le
a    0x2e7f(%rip),%rax        # 4040 <_ZSt
4cout@GLIBCXX_3.4>
    11c1:       48 89 c7                mo
v    %rax,%rdi
    11c4:       e8 a7 fe ff ff          ca
ll   1070 <_ZNSolsEi@plt>
    11c9:       48 8b 15 08 2e 00 00    mo
v    0x2e08(%rip),%rdx        # 3fd8 <_ZSt
4endlIcSt11char_traitsIcEERSt13basic_ostre
amIT_T0_ES6_@GLIBCXX_3.4>
    11d0:       48 89 d6                mo
v    %rdx,%rsi
    11d3:       48 89 c7                mo
v    %rax,%rdi
    11d6:       e8 85 fe ff ff          ca
ll   1060 <_ZNSolsEPFRSoS_E@plt>
    11db:       b8 00 00 00 00          mo
v    $0x0,%eax
    11e0:       c9                      le
ave
    11e1:       c3                      re
t

Disassembly of section .fini:

00000000000011e4 <_fini>:
    11e4:       f3 0f 1e fa             en
dbr64
    11e8:       48 83 ec 08             su
b    $0x8,%rsp
    11ec:       48 83 c4 08             ad
d    $0x8,%rsp
    11f0:       c3                      re
t
```

##### Intel 风格汇编

```bash
objdump -d -M intel test_O0
```

```text
est_O0

test_O0:     file format elf64-x86-64


Disassembly of section .init:

0000000000001000 <_init>:
    1000:       f3 0f 1e fa             en
dbr64
    1004:       48 83 ec 08             su
b    rsp,0x8
    1008:       48 8b 05 e1 2f 00 00    mo
v    rax,QWORD PTR [rip+0x2fe1]        # 3
ff0 <__gmon_start__@Base>
    100f:       48 85 c0                te
st   rax,rax
    1012:       74 02                   je
     1016 <_init+0x16>
    1014:       ff d0                   ca
ll   rax
    1016:       48 83 c4 08             ad
d    rsp,0x8
    101a:       c3                      re
t

Disassembly of section .plt:

0000000000001020 <.plt>:
    1020:       ff 35 8a 2f 00 00       pu
sh   QWORD PTR [rip+0x2f8a]        # 3fb0 
<_GLOBAL_OFFSET_TABLE_+0x8>
    1026:       ff 25 8c 2f 00 00       jm
p    QWORD PTR [rip+0x2f8c]        # 3fb8 
<_GLOBAL_OFFSET_TABLE_+0x10>
    102c:       0f 1f 40 00             no
p    DWORD PTR [rax+0x0]
    1030:       f3 0f 1e fa             en
dbr64
    1034:       68 00 00 00 00          pu
sh   0x0
    1039:       e9 e2 ff ff ff          jm
p    1020 <_init+0x20>
    103e:       66 90                   xc
hg   ax,ax
    1040:       f3 0f 1e fa             en
dbr64
    1044:       68 01 00 00 00          pu
sh   0x1
    1049:       e9 d2 ff ff ff          jm
p    1020 <_init+0x20>
    104e:       66 90                   xc
hg   ax,ax

Disassembly of section .plt.got:

0000000000001050 <__cxa_finalize@plt>:
    1050:       f3 0f 1e fa             en
dbr64
    1054:       ff 25 76 2f 00 00       jm
p    QWORD PTR [rip+0x2f76]        # 3fd0 
<__cxa_finalize@GLIBC_2.2.5>
    105a:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]

Disassembly of section .plt.sec:

0000000000001060 <_ZNSolsEPFRSoS_E@plt>:
    1060:       f3 0f 1e fa             en
dbr64
    1064:       ff 25 56 2f 00 00       jm
p    QWORD PTR [rip+0x2f56]        # 3fc0 
<_ZNSolsEPFRSoS_E@GLIBCXX_3.4>
    106a:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]

0000000000001070 <_ZNSolsEi@plt>:
    1070:       f3 0f 1e fa             en
dbr64
    1074:       ff 25 4e 2f 00 00       jm
p    QWORD PTR [rip+0x2f4e]        # 3fc8 
<_ZNSolsEi@GLIBCXX_3.4>
    107a:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]

Disassembly of section .text:

0000000000001080 <_start>:
    1080:       f3 0f 1e fa             en
dbr64
    1084:       31 ed                   xo
r    ebp,ebp
    1086:       49 89 d1                mo
v    r9,rdx
    1089:       5e                      po
p    rsi
    108a:       48 89 e2                mo
v    rdx,rsp
    108d:       48 83 e4 f0             an
d    rsp,0xfffffffffffffff0
    1091:       50                      pu
sh   rax
    1092:       54                      pu
sh   rsp
    1093:       45 31 c0                xo
r    r8d,r8d
    1096:       31 c9                   xo
r    ecx,ecx
    1098:       48 8d 3d ea 00 00 00    le
a    rdi,[rip+0xea]        # 1189 <main>
    109f:       ff 15 3b 2f 00 00       ca
ll   QWORD PTR [rip+0x2f3b]        # 3fe0 
<__libc_start_main@GLIBC_2.34>
    10a5:       f4                      hl
t
    10a6:       66 2e 0f 1f 84 00 00    cs
 nop WORD PTR [rax+rax*1+0x0]
    10ad:       00 00 00 

00000000000010b0 <deregister_tm_clones>:
    10b0:       48 8d 3d 61 2f 00 00    le
a    rdi,[rip+0x2f61]        # 4018 <__TMC
_END__>
    10b7:       48 8d 05 5a 2f 00 00    le
a    rax,[rip+0x2f5a]        # 4018 <__TMC
_END__>
    10be:       48 39 f8                cm
p    rax,rdi
    10c1:       74 15                   je
     10d8 <deregister_tm_clones+0x28>
    10c3:       48 8b 05 1e 2f 00 00    mo
v    rax,QWORD PTR [rip+0x2f1e]        # 3
fe8 <_ITM_deregisterTMCloneTable@Base>
    10ca:       48 85 c0                te
st   rax,rax
    10cd:       74 09                   je
     10d8 <deregister_tm_clones+0x28>
    10cf:       ff e0                   jm
p    rax
    10d1:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]
    10d8:       c3                      re
t
    10d9:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]

00000000000010e0 <register_tm_clones>:
    10e0:       48 8d 3d 31 2f 00 00    le
a    rdi,[rip+0x2f31]        # 4018 <__TMC
_END__>
    10e7:       48 8d 35 2a 2f 00 00    le
a    rsi,[rip+0x2f2a]        # 4018 <__TMC
_END__>
    10ee:       48 29 fe                su
b    rsi,rdi
    10f1:       48 89 f0                mo
v    rax,rsi
    10f4:       48 c1 ee 3f             sh
r    rsi,0x3f
    10f8:       48 c1 f8 03             sa
r    rax,0x3
    10fc:       48 01 c6                ad
d    rsi,rax
    10ff:       48 d1 fe                sa
r    rsi,1
    1102:       74 14                   je
     1118 <register_tm_clones+0x38>
    1104:       48 8b 05 ed 2e 00 00    mo
v    rax,QWORD PTR [rip+0x2eed]        # 3
ff8 <_ITM_registerTMCloneTable@Base>
    110b:       48 85 c0                te
st   rax,rax
    110e:       74 08                   je
     1118 <register_tm_clones+0x38>
    1110:       ff e0                   jm
p    rax
    1112:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]
    1118:       c3                      re
t
    1119:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]

0000000000001120 <__do_global_dtors_aux>:
    1120:       f3 0f 1e fa             en
dbr64
    1124:       80 3d 25 30 00 00 00    cm
p    BYTE PTR [rip+0x3025],0x0        # 41
50 <completed.0>
    112b:       75 2b                   jn
e    1158 <__do_global_dtors_aux+0x38>
    112d:       55                      pu
sh   rbp
    112e:       48 83 3d 9a 2e 00 00    cm
p    QWORD PTR [rip+0x2e9a],0x0        # 3
fd0 <__cxa_finalize@GLIBC_2.2.5>
    1135:       00 
    1136:       48 89 e5                mo
v    rbp,rsp
    1139:       74 0c                   je
     1147 <__do_global_dtors_aux+0x27>
    113b:       48 8b 3d c6 2e 00 00    mo
v    rdi,QWORD PTR [rip+0x2ec6]        # 4
008 <__dso_handle>
    1142:       e8 09 ff ff ff          ca
ll   1050 <__cxa_finalize@plt>
    1147:       e8 64 ff ff ff          ca
ll   10b0 <deregister_tm_clones>
    114c:       c6 05 fd 2f 00 00 01    mo
v    BYTE PTR [rip+0x2ffd],0x1        # 41
50 <completed.0>
    1153:       5d                      po
p    rbp
    1154:       c3                      re
t
    1155:       0f 1f 00                no
p    DWORD PTR [rax]
    1158:       c3                      re
t
    1159:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]

0000000000001160 <frame_dummy>:
    1160:       f3 0f 1e fa             en
dbr64
    1164:       e9 77 ff ff ff          jm
p    10e0 <register_tm_clones>

0000000000001169 <_Z3Addii>:
    1169:       f3 0f 1e fa             en
dbr64
    116d:       55                      pu
sh   rbp
    116e:       48 89 e5                mo
v    rbp,rsp
    1171:       89 7d fc                mo
v    DWORD PTR [rbp-0x4],edi
    1174:       89 75 f8                mo
v    DWORD PTR [rbp-0x8],esi
    1177:       8b 55 fc                mo
v    edx,DWORD PTR [rbp-0x4]
    117a:       8b 45 f8                mo
v    eax,DWORD PTR [rbp-0x8]
    117d:       01 c2                   ad
d    edx,eax
    117f:       8b 05 8b 2e 00 00       mo
v    eax,DWORD PTR [rip+0x2e8b]        # 4
010 <g_value>
    1185:       01 d0                   ad
d    eax,edx
    1187:       5d                      po
p    rbp
    1188:       c3                      re
t

0000000000001189 <main>:
    1189:       f3 0f 1e fa             en
dbr64
    118d:       55                      pu
sh   rbp
    118e:       48 89 e5                mo
v    rbp,rsp
    1191:       48 83 ec 10             su
b    rsp,0x10
    1195:       c7 45 f4 03 00 00 00    mo
v    DWORD PTR [rbp-0xc],0x3
    119c:       c7 45 f8 04 00 00 00    mo
v    DWORD PTR [rbp-0x8],0x4
    11a3:       8b 55 f8                mo
v    edx,DWORD PTR [rbp-0x8]
    11a6:       8b 45 f4                mo
v    eax,DWORD PTR [rbp-0xc]
    11a9:       89 d6                   mo
v    esi,edx
    11ab:       89 c7                   mo
v    edi,eax
    11ad:       e8 b7 ff ff ff          ca
ll   1169 <_Z3Addii>
    11b2:       89 45 fc                mo
v    DWORD PTR [rbp-0x4],eax
    11b5:       8b 45 fc                mo
v    eax,DWORD PTR [rbp-0x4]
    11b8:       89 c6                   mo
v    esi,eax
    11ba:       48 8d 05 7f 2e 00 00    le
a    rax,[rip+0x2e7f]        # 4040 <_ZSt4
cout@GLIBCXX_3.4>
    11c1:       48 89 c7                mo
v    rdi,rax
    11c4:       e8 a7 fe ff ff          ca
ll   1070 <_ZNSolsEi@plt>
    11c9:       48 8b 15 08 2e 00 00    mo
v    rdx,QWORD PTR [rip+0x2e08]        # 3
fd8 <_ZSt4endlIcSt11char_traitsIcEERSt13ba
sic_ostreamIT_T0_ES6_@GLIBCXX_3.4>
    11d0:       48 89 d6                mo
v    rsi,rdx
    11d3:       48 89 c7                mo
v    rdi,rax
    11d6:       e8 85 fe ff ff          ca
ll   1060 <_ZNSolsEPFRSoS_E@plt>
    11db:       b8 00 00 00 00          mo
v    eax,0x0
    11e0:       c9                      le
ave
    11e1:       c3                      re
t

Disassembly of section .fini:

00000000000011e4 <_fini>:
    11e4:       f3 0f 1e fa             en
dbr64
    11e8:       48 83 ec 08             su
b    rsp,0x8
    11ec:       48 83 c4 08             ad
d    rsp,0x8
    11f0:       c3                      re
t
```

#### 反汇编 + 源码对照

```bash
objdump -S -M intel test_O0
```

```text
est_O0

test_O0:     file format elf64-x86-64


Disassembly of section .init:

0000000000001000 <_init>:
    1000:       f3 0f 1e fa             en
dbr64
    1004:       48 83 ec 08             su
b    rsp,0x8
    1008:       48 8b 05 e1 2f 00 00    mo
v    rax,QWORD PTR [rip+0x2fe1]        # 3
ff0 <__gmon_start__@Base>
    100f:       48 85 c0                te
st   rax,rax
    1012:       74 02                   je
     1016 <_init+0x16>
    1014:       ff d0                   ca
ll   rax
    1016:       48 83 c4 08             ad
d    rsp,0x8
    101a:       c3                      re
t

Disassembly of section .plt:

0000000000001020 <.plt>:
    1020:       ff 35 8a 2f 00 00       pu
sh   QWORD PTR [rip+0x2f8a]        # 3fb0 
<_GLOBAL_OFFSET_TABLE_+0x8>
    1026:       ff 25 8c 2f 00 00       jm
p    QWORD PTR [rip+0x2f8c]        # 3fb8 
<_GLOBAL_OFFSET_TABLE_+0x10>
    102c:       0f 1f 40 00             no
p    DWORD PTR [rax+0x0]
    1030:       f3 0f 1e fa             en
dbr64
    1034:       68 00 00 00 00          pu
sh   0x0
    1039:       e9 e2 ff ff ff          jm
p    1020 <_init+0x20>
    103e:       66 90                   xc
hg   ax,ax
    1040:       f3 0f 1e fa             en
dbr64
    1044:       68 01 00 00 00          pu
sh   0x1
    1049:       e9 d2 ff ff ff          jm
p    1020 <_init+0x20>
    104e:       66 90                   xc
hg   ax,ax

Disassembly of section .plt.got:

0000000000001050 <__cxa_finalize@plt>:
    1050:       f3 0f 1e fa             en
dbr64
    1054:       ff 25 76 2f 00 00       jm
p    QWORD PTR [rip+0x2f76]        # 3fd0 
<__cxa_finalize@GLIBC_2.2.5>
    105a:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]

Disassembly of section .plt.sec:

0000000000001060 <_ZNSolsEPFRSoS_E@plt>:
    1060:       f3 0f 1e fa             en
dbr64
    1064:       ff 25 56 2f 00 00       jm
p    QWORD PTR [rip+0x2f56]        # 3fc0 
<_ZNSolsEPFRSoS_E@GLIBCXX_3.4>
    106a:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]

0000000000001070 <_ZNSolsEi@plt>:
    1070:       f3 0f 1e fa             en
dbr64
    1074:       ff 25 4e 2f 00 00       jm
p    QWORD PTR [rip+0x2f4e]        # 3fc8 
<_ZNSolsEi@GLIBCXX_3.4>
    107a:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]

Disassembly of section .text:

0000000000001080 <_start>:
    1080:       f3 0f 1e fa             en
dbr64
    1084:       31 ed                   xo
r    ebp,ebp
    1086:       49 89 d1                mo
v    r9,rdx
    1089:       5e                      po
p    rsi
    108a:       48 89 e2                mo
v    rdx,rsp
    108d:       48 83 e4 f0             an
d    rsp,0xfffffffffffffff0
    1091:       50                      pu
sh   rax
    1092:       54                      pu
sh   rsp
    1093:       45 31 c0                xo
r    r8d,r8d
    1096:       31 c9                   xo
r    ecx,ecx
    1098:       48 8d 3d ea 00 00 00    le
a    rdi,[rip+0xea]        # 1189 <main>
    109f:       ff 15 3b 2f 00 00       ca
ll   QWORD PTR [rip+0x2f3b]        # 3fe0 
<__libc_start_main@GLIBC_2.34>
    10a5:       f4                      hl
t
    10a6:       66 2e 0f 1f 84 00 00    cs
 nop WORD PTR [rax+rax*1+0x0]
    10ad:       00 00 00 

00000000000010b0 <deregister_tm_clones>:
    10b0:       48 8d 3d 61 2f 00 00    le
a    rdi,[rip+0x2f61]        # 4018 <__TMC
_END__>
    10b7:       48 8d 05 5a 2f 00 00    le
a    rax,[rip+0x2f5a]        # 4018 <__TMC
_END__>
    10be:       48 39 f8                cm
p    rax,rdi
    10c1:       74 15                   je
     10d8 <deregister_tm_clones+0x28>
    10c3:       48 8b 05 1e 2f 00 00    mo
v    rax,QWORD PTR [rip+0x2f1e]        # 3
fe8 <_ITM_deregisterTMCloneTable@Base>
    10ca:       48 85 c0                te
st   rax,rax
    10cd:       74 09                   je
     10d8 <deregister_tm_clones+0x28>
    10cf:       ff e0                   jm
p    rax
    10d1:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]
    10d8:       c3                      re
t
    10d9:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]

00000000000010e0 <register_tm_clones>:
    10e0:       48 8d 3d 31 2f 00 00    le
a    rdi,[rip+0x2f31]        # 4018 <__TMC
_END__>
    10e7:       48 8d 35 2a 2f 00 00    le
a    rsi,[rip+0x2f2a]        # 4018 <__TMC
_END__>
    10ee:       48 29 fe                su
b    rsi,rdi
    10f1:       48 89 f0                mo
v    rax,rsi
    10f4:       48 c1 ee 3f             sh
r    rsi,0x3f
    10f8:       48 c1 f8 03             sa
r    rax,0x3
    10fc:       48 01 c6                ad
d    rsi,rax
    10ff:       48 d1 fe                sa
r    rsi,1
    1102:       74 14                   je
     1118 <register_tm_clones+0x38>
    1104:       48 8b 05 ed 2e 00 00    mo
v    rax,QWORD PTR [rip+0x2eed]        # 3
ff8 <_ITM_registerTMCloneTable@Base>
    110b:       48 85 c0                te
st   rax,rax
    110e:       74 08                   je
     1118 <register_tm_clones+0x38>
    1110:       ff e0                   jm
p    rax
    1112:       66 0f 1f 44 00 00       no
p    WORD PTR [rax+rax*1+0x0]
    1118:       c3                      re
t
    1119:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]

0000000000001120 <__do_global_dtors_aux>:
    1120:       f3 0f 1e fa             en
dbr64
    1124:       80 3d 25 30 00 00 00    cm
p    BYTE PTR [rip+0x3025],0x0        # 41
50 <completed.0>
    112b:       75 2b                   jn
e    1158 <__do_global_dtors_aux+0x38>
    112d:       55                      pu
sh   rbp
    112e:       48 83 3d 9a 2e 00 00    cm
p    QWORD PTR [rip+0x2e9a],0x0        # 3
fd0 <__cxa_finalize@GLIBC_2.2.5>
    1135:       00 
    1136:       48 89 e5                mo
v    rbp,rsp
    1139:       74 0c                   je
     1147 <__do_global_dtors_aux+0x27>
    113b:       48 8b 3d c6 2e 00 00    mo
v    rdi,QWORD PTR [rip+0x2ec6]        # 4
008 <__dso_handle>
    1142:       e8 09 ff ff ff          ca
ll   1050 <__cxa_finalize@plt>
    1147:       e8 64 ff ff ff          ca
ll   10b0 <deregister_tm_clones>
    114c:       c6 05 fd 2f 00 00 01    mo
v    BYTE PTR [rip+0x2ffd],0x1        # 41
50 <completed.0>
    1153:       5d                      po
p    rbp
    1154:       c3                      re
t
    1155:       0f 1f 00                no
p    DWORD PTR [rax]
    1158:       c3                      re
t
    1159:       0f 1f 80 00 00 00 00    no
p    DWORD PTR [rax+0x0]

0000000000001160 <frame_dummy>:
    1160:       f3 0f 1e fa             en
dbr64
    1164:       e9 77 ff ff ff          jm
p    10e0 <register_tm_clones>

0000000000001169 <_Z3Addii>:
# include <iostream>

int g_value = 10;

__attribute__((noinline))
    int Add(int a, int b) {
    1169:       f3 0f 1e fa             en
dbr64
    116d:       55                      pu
sh   rbp
    116e:       48 89 e5                mo
v    rbp,rsp
    1171:       89 7d fc                mo
v    DWORD PTR [rbp-0x4],edi
    1174:       89 75 f8                mo
v    DWORD PTR [rbp-0x8],esi
        return a + b + g_value;
    1177:       8b 55 fc                mo
v    edx,DWORD PTR [rbp-0x4]
    117a:       8b 45 f8                mo
v    eax,DWORD PTR [rbp-0x8]
    117d:       01 c2                   ad
d    edx,eax
    117f:       8b 05 8b 2e 00 00       mo
v    eax,DWORD PTR [rip+0x2e8b]        # 4
010 <g_value>
    1185:       01 d0                   ad
d    eax,edx
    }
    1187:       5d                      po
p    rbp
    1188:       c3                      re
t

0000000000001189 <main>:

int main() {
    1189:       f3 0f 1e fa             en
dbr64
    118d:       55                      pu
sh   rbp
    118e:       48 89 e5                mo
v    rbp,rsp
    1191:       48 83 ec 10             su
b    rsp,0x10
    int x = 3;
    1195:       c7 45 f4 03 00 00 00    mo
v    DWORD PTR [rbp-0xc],0x3
    int y = 4;
    119c:       c7 45 f8 04 00 00 00    mo
v    DWORD PTR [rbp-0x8],0x4
    int z = Add(x, y);
    11a3:       8b 55 f8                mo
v    edx,DWORD PTR [rbp-0x8]
    11a6:       8b 45 f4                mo
v    eax,DWORD PTR [rbp-0xc]
    11a9:       89 d6                   mo
v    esi,edx
    11ab:       89 c7                   mo
v    edi,eax
    11ad:       e8 b7 ff ff ff          ca
ll   1169 <_Z3Addii>
    11b2:       89 45 fc                mo
v    DWORD PTR [rbp-0x4],eax
    std::cout << z << std::endl;
    11b5:       8b 45 fc                mo
v    eax,DWORD PTR [rbp-0x4]
    11b8:       89 c6                   mo
v    esi,eax
    11ba:       48 8d 05 7f 2e 00 00    le
a    rax,[rip+0x2e7f]        # 4040 <_ZSt4
cout@GLIBCXX_3.4>
    11c1:       48 89 c7                mo
v    rdi,rax
    11c4:       e8 a7 fe ff ff          ca
ll   1070 <_ZNSolsEi@plt>
    11c9:       48 8b 15 08 2e 00 00    mo
v    rdx,QWORD PTR [rip+0x2e08]        # 3
fd8 <_ZSt4endlIcSt11char_traitsIcEERSt13ba
sic_ostreamIT_T0_ES6_@GLIBCXX_3.4>
    11d0:       48 89 d6                mo
v    rsi,rdx
    11d3:       48 89 c7                mo
v    rdi,rax
    11d6:       e8 85 fe ff ff          ca
ll   1060 <_ZNSolsEPFRSoS_E@plt>
    return 0;
    11db:       b8 00 00 00 00          mo
v    eax,0x0
}
    11e0:       c9                      le
ave
    11e1:       c3                      re
t

Disassembly of section .fini:

00000000000011e4 <_fini>:
    11e4:       f3 0f 1e fa             en
dbr64
    11e8:       48 83 ec 08             su
b    rsp,0x8
    11ec:       48 83 c4 08             ad
d    rsp,0x8
    11f0:       c3                      re
t
```

#### 优化对比

test_O0的Add

##### 方法1（推荐）

```bash
objdump -d -M intel --disassemble=_Z3Addii test_O0
```

- `_Z3Addii` Add的真实名称

##### 方法2

```bash
objdump -d -M intel test_O0 | grep -A20 "<Add>"
```

- `-A20`：多显示20行，函数过长可能截断

##### 方法3

先查函数地址

```bash
objdump -t test_O0 | grep " Add$"
```

指定起止地址反汇编

```bash
objdump -d -M intel \
  --start-address=0x1149 \
  --stop-address=0x115e \
  test_O0
```

结果

```text
test_O0:     file format elf64-x86-64


Disassembly of section .init:

Disassembly of section .plt:

Disassembly of section .plt.got:

Disassembly of section .plt.sec:

Disassembly of section .text:

0000000000001169 <_Z3Addii>:
    1169:       f3 0f 1e fa             en
dbr64
    116d:       55                      pu
sh   rbp
    116e:       48 89 e5                mo
v    rbp,rsp
    1171:       89 7d fc                mo
v    DWORD PTR [rbp-0x4],edi
    1174:       89 75 f8                mo
v    DWORD PTR [rbp-0x8],esi
    1177:       8b 55 fc                mo
v    edx,DWORD PTR [rbp-0x4]
    117a:       8b 45 f8                mo
v    eax,DWORD PTR [rbp-0x8]
    117d:       01 c2                   ad
d    edx,eax
    117f:       8b 05 8b 2e 00 00       mo
v    eax,DWORD PTR [rip+0x2e8b]        # 4
010 <g_value>
    1185:       01 d0                   ad
d    eax,edx
    1187:       5d                      po
p    rbp
    1188:       c3                      re
t

Disassembly of section .fini:
```

查看test_O2的Add

```text
test_O2:     file format elf64-x86-64


Disassembly of section .init:

Disassembly of section .plt:

Disassembly of section .plt.got:

Disassembly of section .plt.sec:

Disassembly of section .text:

0000000000001270 <_Z3Addii>:
    1270:       f3 0f 1e fa             en
dbr64
    1274:       8d 04 37                le
a    eax,[rdi+rsi*1]
    1277:       03 05 93 2d 00 00       ad
d    eax,DWORD PTR [rip+0x2d93]        # 4
010 <g_value>
    127d:       c3                      re
t

Disassembly of section .fini:
```

##### 对比

| 对比点  | `-O0`         | `-O2`        |
| ---- | ------------- | ------------ |
| 栈帧   | **完整建立 / 销毁** | **完全消失**     |
| 参数   | 存栈再取          | **直接用寄存器**   |
| 中间变量 | 全部落内存         | **寄存器直算**    |
| 指令数  | 多             | **极少（接近极限）** |
| 可调试性 | 极好            | 很差           |
| 执行效率 | 低             | **高**        |

- `O0`是“给人看的代码”
- `O2`是“给CPU吃的代码”

###### 两者的共同点

`endbr64`

```asm
f3 0f 1e fa endbr64
```

- 这是CET/IBT(Control-flow Enforcement Technology)
- 用来防ROP/JOP
- 和优化级别无关
- GCC/Clang默认在支持的平台上会加

```cpp
int Add(int a, int b) {
    return a + b + g_value;
}
```

###### `-O0`

1.建立标准栈

```asm
push rbp
mov rbp, rsp
```

强制生成栈，方便debugger,即使不需要，也要建

2.参数强制落栈

```asm
mov DWORD PTR [rbp-0x4], edi  ; a
mov DWORD PTR [rbp-0x8], esi  ; b
```

即使参数已经在寄存器里，也要写回内存

3.再从栈里取出来

```asm
mov edx, DWORD PTR [rbp-0x4]
mov eax, DWORD PTR [rbp-0x8]
add edx, eax
```

这是典型的“O0冗余模式”：写->读->算

4.访问全局变量

```asm
mov eax, DWORD PTR [rip+0x2e8b]  # g_value
```

- RIP-relative addressing
- PIE友好
- 和优化级别关系不大

5.返回值

```asm
add eax, edx
pop rbp
ret
```

O0本质目标：不要聪明，只要可追踪

###### `O2`

1.直接算，不落栈

```asm
lea exa, [rdi + rsi*1]
```

为什么是`lea`

- `lea`不影响flags
- 执行快
- 本质：`exa = a + b`

2.再加全局变量

```asm
add exa, DWORD PTR [rip+0x2d93] # g_value
```

- 直接memory->register
- 没有任何中间变量

3.直接返回

```asm
ret
```

#### `-j` 查看部分

- 只反汇编`.text`

```bash
objdump -d -j .text test_O0
```

- 查看数据段内容（16进制）

```bash
objdump -s -j .data test_O0
```
