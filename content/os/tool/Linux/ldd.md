---
title: ldd
author: ljf12825
date: 2026-04-13
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

## 示例

## 替代


