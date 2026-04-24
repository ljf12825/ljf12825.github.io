---
title: ldd
author: ljf12825
date: 2026-04-24
type: file
summary: using of ldd
---

`ldd`全称List Dynamic Dependencies，是Linux命令行工具\
它的核心功能是打印一个可执行程序或共享库所依赖的共享库列表

## 基本用法

```bash
ldd <可执行文件的路径>
```

输出

```text
linux-vdso.so.1 (0x0000717dff500000)
libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x0000717dff48f000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x0000717dff200000)
libpcre2-8.so.0 => /lib/x86_64-linux-gnu/libpcre2-8.so.0 (0x0000717dff166000)
/lib64/ld-linux-x86-64.so.2 (0x0000717dff502000)
```

| 输出部分 | 含义 |
| - | - |
| `libselinux.so.1` | 程序需要的动态库名称 |
| `=>` | 指向符号，表示“解析到了哪里” |
| `/lib/x86_64...` | 实际加载的文件路径。如果这里显示`not found`，说明程序启动会因缺少库而报错 |
| `(0x00007f...)` | 加载地址。这是库被映射到虚拟内存中的起始位置 |

### 特殊输出

- `linux-vdso.so.1` 这不是一个真实的文件，它是Linux内核直接映射进用户空间的一段代码，用于加速系统调用（如`gettimeofday`)，不需要担心找不到它
- `/lib64/ld-linux-x86-64.so.2`：动态链接器本身，这个程序能运行，首先要靠它来加载其他库。如果这个不存在，系统基本就瘫痪了
- `not found`：这是最需要关注的状态，意味着程序依赖的库不再标准搜索路径或`LD_LIBRARY_PATH`中

### 常用参数

| 参数 | 作用 | 典型场景 |
| `-v` | 冗余模式 | verbose |
| `-u` | 显示未使用的直接依赖 | 清理编译链接时多余指定的`-l`选项 |
| `-d` | 执行重定位并报告缺失函数 | 比普通的`ldd`更深入，能发现`R_X86_64_JUMP_SLOT`无法解析的错误 |
| `-r` | 执行函数和数据重定位 | 综合`-d`和`-u`的功能，检查是否有符号未定义 |

## 警告

不要对不信任的文件使用`ldd`

虽然`man ldd`说它只是运行`LD_TRACE_LOADED_OBJECTS=1`环境变量下的程序，但在某些实现中（或对于某些特殊构建的恶意程序），直接执行`ldd ./可疑文件`会运行该文件的初始化代码

这可能出现恶意代码可以在你仅想“查看依赖”时直接获得你当前用户的Shell权限

### 安全替代方案

```bash
# 使用 objdump 查看依赖（完全静态分析，不执行代码）
objdump -p /path/to/binary | grep NEEDED

# 或者使用 readelf
readelf -d /path/to/binary | grep 'NEEDED'
```

## 原理

理解`ldd`的输出内容，其实就是理解了Linux加载程序的第一步

1. 内核识别：发现文件是ELF格式，查看`.interp`段，找到解释器路径（如`/lib64/ld-linux-x86-64.so.2`
2. 解释器启动：内核将控制权交给这个`ld-linux`解释器
3. 解析依赖：解释器读取ELF文件的`.dynamic`段，找到`DT_NEEDED`条目（即`ldd`打印出来的库名）
4. 搜索路径：按照以下顺序查找库文件
    - 环境变量`LD_LIBRARY_PATH`
    - 缓存文件：`/etc/ld.so.cache`
    - 系统默认路径`/lib`, `/usr/lib`
5. 映射内存：找到后将库加载到内存地址（即`ldd`括号里的数字）

## 示例

### 查看普通程序的依赖

```bash
ldd /usr/bin/curl
```

输出

```text
linux-vdso.so.1 (0x00007ffe5bdf0000)
libcurl.so.4 => /usr/lib/x86_64-linux-gnu/libcurl.so.4 (0x00007f5a3c000000)
libssl.so.3 => /usr/lib/x86_64-linux-gnu/libssl.so.3 (0x00007f5a3c800000)
libcrypto.so.3 => /usr/lib/x86_64-linux-gnu/libcrypto.so.3 (0x00007f5a3b800000)
libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007f5a3b400000)
/lib64/ld-linux-x86-64.so.2 (0x00007f5a3d000000)
```

每行都有`=>`指向具体路径，没有`not found`。`curl`依赖libcurl, OpenSSL等，链接器都能正常找到

### 缺少依赖库

假设有一个第三方程序`my_tool`，直接运行报错

```bash
./my_tool: error while loading shared libraries: libfoo.so.1: cannot open shared object file: No such file or directory
```

用`ldd`查看

```bash
ldd ./my_tool
```

输出

```text
linux-vdso.so.1 (0x00007ffd9b5e6000)
libfoo.so.1 => not found
libc.so.6 => /usr/lib/x86_64-linux-gnu/libc.so.6 (0x00007f8e2a400000)
/lib64/ld-linux-x86-64.so.2 (0x00007f8e2a800000)
```

关键信息：`libfoo.so.1 => not found`\
排查方向：

1. 检查库文件是否真的在系统里：`find /usr /opt -name "libfoo.so*"`
2. 如果存在但没被找到，临时添加路径：`export LD_LIBRARY_PATH=/path/to/lib:$LD_LIBRARY_PATH`

### 架构不匹配导致的`not found`

在64位系统上运行一个32位程序，`file`命令显示

```bash
file ./old_32bit_app
# ./old_32bit_app: ELF 32-bit LSB executable, Intel 80386 ...
```

`ldd`输出

```bash
ldd ./old_32bit_app
```

输出

```text
    linux-gate.so.1 (0xf7f5d000)
    libc.so.6 => /lib/i386-linux-gnu/libc.so.6 (0xf7d00000)
    /lib/ld-linux.so.2 (0xf7f5f000)
```

如果输出中任然有`not found`（尤其是libc），说明没有安装32位兼容库

### 使用`-r`检查缺失的函数符号（运行时symbol lookup error）

程序能启动，但运行到某个功能时崩溃，报错

```text
./my_app: symbol lookup error: /usr/lib/libcustom.so: undefined symbol: calculate_offset
```

这表示库文件存在，但库里面缺少某个函数。用`ldd -r`可以提前发现

```bash
ldd -r ./my_app
```

输出

```text
linux-vdso.so.1 (0x00007ffd2f3e5000)
libcustom.so.1 => /usr/lib/libcustom.so.1 (0x00007f1234000000)
libc.so.6 => /usr/lib/libc.so.6 (0x00007f1233c00000)
/lib64/ld-linux-x86-64.so.2 (0x00007f1234200000)
undefined symbol: calculate_offset    (./my_app)
```

`-r`参数执行了重定位检查，直接指出了`undefined symbol: calculate_offset`，问题一目了然

### 用`-u`找出编译时多余的链接（清理Makefile）

假设在编译程序时在Makefile里写了`-lm -lpthread -ldl`，但实际上只用到了`pthread`。用`-u`可以找出那些”声明了但没用上“的直接依赖

```bash
ldd -u ./my_app
```

输出

```text
Unused direct dependencies:
    /usr/lib/libm.so.6
    /usr/lib/libdl.so.2
```

这表示编译时可以去掉`-lm`和`-ldl`，让程序更精简，启动稍快一些

## `lddtree`

如果需要可视化复杂的依赖树（即A依赖B，B又依赖C），普通`ldd`是扁平列表，不够直观，可以使用`pax-utils`包中的`lddtree`

```bash
apt install pax-utils
lddtree /bin/ls
```

输出会以树状结构展开，清晰展示哪些库是共享的、哪些是被间接引入的

```text
/bin/ls (interpreter => /lib64/ld-linux-x86-64.so.2)
    libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1
        libpcre2-8.so.0 => /lib/x86_64-linux-gnu/libpcre2-8.so.0
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6
```

[ldd using](/os/lab/ldd_using/)
