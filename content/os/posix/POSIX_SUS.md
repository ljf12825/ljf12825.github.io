---
title: POSIX & SUS
date: 2026-04-14
author: ljf12825
summary: Overview of POSIX and SUS
type: file
---

## POSIX

上世纪Unix分裂严重，每家公司都有自己的Unix：\
Bell UNIX, BSD, HP-UX, AIX, Solaris...\
两大主流分支是AT&T的System V和伯克利的BSD；它们在系统调用、命令工具、库函数等方面存在许多细微差别\
为一个Unix系统（比如SunOS）写的程序，在另一个Unix系统（比如HP-UX）上可能完全编译不过或者运行异常\
为了解决这个原因，IEEE牵头制定了POSIX标准。它统一了“游戏规则”，告诉操作系统厂商：要提供的接口的标准

POSIX (Portable Operating System Interface，可移植操作系统接口)，是一个由IEEE制定，并被ISO和IEC采纳为国际标准的家族标准编号(ISO/IEC 9945)

- 目标：解决Unix系统碎片化为题，让为不同Unix系统编写的软件能够很容易地移植到其他Unix系统上，而无需大量重写代码
- 本质：它是一系列的标准和规范，定义了操作系统应该为应用程序提供哪些接口（API）；更工程化，精准化的说法是POSIX定义了用户态的ABI + 行为语义契约

比如：

- 文件操作要怎么调
- 进程怎么创建
- 信号的语义是什么
- 线程API怎么命名
- 错误码应该返回什么
- 路径语义怎么定义

简单说，只要代码只调用POSIX规定的函数，不碰特定系统的私有API, 就能在Linux, macOS, FreeBSD, Solaris甚至Windows（通过WSL）上直接编译运行

### 内容

POSIX不仅仅是一个库，它定义了一整套操作系统必须提供的“语言”

1. 系统调用接口：这是最核心的部分。定义了诸如`fork`, `exec`, `open`, `read/write`, `socket`等底层函数应该如何工作
2. 命令行工具和实用程序：如`ls`, `grep`, `awk`, `sed`, `cp`, `mv`等，它们的选项、行为和输出格式都被标准化了
3. Shell标准：定义了Shell的基本功能和语法。`/bin/sh`就是一个POSIX兼容的Shell。Bash, Zsh等是它的超集
4. 线程接口：`pthreads`库就是POSIX线程标准的一部分，它定义了如何创建、管理和同步线程
5. 文件和目录结构：对文件系统的布局提出了一些建议，例如`/tmp`目录用于存放临时文件，`/dev`目录存放设备文件等

### 意义

对于开发者而言，理解POSIX有三个立竿见影的好处

1. 优雅处理跨平台代码：在Linux下使用`open()`没问题，但如果用了`open64()`或者直接操作`/proc`下的非标准文件，移植到macOS就会编译失败。遵循POSIX可以避免这种重写代价
2. 理解“一切皆文件”的哲学：POSIX规定设备、管道、套接字、普通文件都共用一套读写接口。可以用`write()`向屏幕输出文字，也能用同一个`write()`向网络连接发送数据包
3. 区分Linux和Unix的区别：Linux遵循POSIX标准，但Linux有很多GNU扩展。如`grep -P`(Perl正则)不是POSIX标准，而`gerp -E`才是

### 实时性与并发

除了基础文件操作，POSIX还有几个重要的标准子扩展，决定了现代操作系统的底层能力

- POSIX线程(Pthreads)：虽然现在都是用更高层的封装（如C++的`std::thread`），但底层统一是POSIX定义的线程模型。它规定了互斥锁`mutex`、条件变量`cond`的精确语义，避免了不同CPU架构下多线程行为的诡异差异
- POSIX信号(Signals)：定义了`SIGINT`(^C)和`SIGSEGV`（段错误）的处理流程。虽然发送信号的机制各系统略有不同，但处理函数的签名`void handler(int sig)`是统一的
- POSIX异步I/O(AIO)：定义了在后台读写文件而不阻塞主线程的标准接口。虽然Linux实现有其历史缺陷，但这是高性能数据库（如Oracle, PostgreSQL）设计磁盘交互的逻辑基础

### 局限性

POSIX看起来已经很完美了，但现实中仍有很多Linux专用程序，因为以下原因

- 进程创建的经典分歧：POSIX规定用`fork()`复制进程。但在Windows原生环境下，由于缺少`fork`语义，即便是遵循POSIX的Cygwin工具，其进程创建效率也远低于Linux
- 落后:它不包含select/poll/epoll的现代IO模型（epoll根本不是POSIX），现代线程同步原语（原子操作部分不是POSIX范围），高性能网络API（比如io_uring），现代权限模型（SElinux, AppArmor），容器与namespace（Linux特有）

POSIX只适合作为“最低共识”，想追求性能，必然越界到“非POSIX平台特性”

### POSIX合规认证

不是所有类Unix系统都是“完全POSIX兼容”的。认证由The Open Group颁发（持有UNIX商标）

- macOS：自10.5 Leopard起是Single UNIX Specification认证的UNIX系统（POSIX的超集）
- Linux：绝大多数发行版没有花钱去做正式认证（太贵且更新太快），但行为上是POSIX兼容的（Linus曾调侃“我们符合标准，除了哪些标准错的地方”）
- Windows：原生NT内核不兼容POSIX，但WSL1通过系统调用翻译实现了极佳的POSIX模拟，WSL2则直接运行Linux内核

## SUS

SUS(Single UNIX Specification，单一UNIX规范) 是UNIX操作系统的核心标准集，由The Open Group制定\
POSIX作为最低标准，但POSIX比较宽泛，任何系统都能宣称兼容。SUS是一个更完整，更严格UNIX标准，是POSIX的超集，并且带有官方认证机制\
SUS = POSIX + 一些扩展 + UNIX认证规范

### 组成

SUS不是单一文档，而是以下四部分的统称

1. Base Definitions（基础定义）：Chapter1 ~ Chapter7的`man`手册内容
2. System Interfacces（系统接口）：Chapter2 & Chapter3（系统调用与C库函数）
3. Shell and Utilities（Shell与工具）：Chapter1命令。例如`awk`, `sed`, `ls`, `cp`的具体选项行为。这是区分Linux和UNIX的重要细节——例如SUS规定`cp -r`行为不同于Linux的`cp -R`

### 对比

SUS与POSIX，Linux的关系

| 概念 | 关系类比 | 法律/商标地位 |
| - | - | - |
| POSIX | 教科书大纲 | 仅需声明兼容，无需付费测试 |
| SUS | 严格的高考真题 | 必须通过The Open Group官方测试套件(VSX)，并付费取得认证 |
| Linux(LTP/LSB) | 在家做了高考真题 | 绝大数Linux发行版技术上符合SUSv3,但没有UNIX商标。只有少数极昂贵的Linux（如华为EulerOS, Inspur K-UX）曾经付费获得过UNIX03认证 |

Linux的众多发行版迭代速度很快，且大都是社区或组织进行维护，SUS认证的价格不菲，如果每个版本都SUS认证，费用极高且意义不大

### `_XOPEN_SOURCE`

对于开发者，SUS最重要的价值体现在`_XOPEN_SOURCE`这个宏

当写C/C++代码时，如果希望调用的是SUS标准严格定义的函数（而不是GNU扩展函数），需要定义

```c
#define _XOPEN_SOURCE 700 // 700代表 SUSv4 / POSIX 2008
#include <unistd.h>
```

这会组织编译器暴露仅在Linux上可用的非标准函数（如`get_current_dir_name()`），强制使用SUS规定的`getcwd()`，从而确保代码可以零成本移植到AIX、Solaris、macOS\
如果不定义这些宏，你写的代码是glibc扩展代码，不是POSIX代码

---

截至2026年，通过SUSv4(UNIX03)认证的主流系统包括

- macOS（自10.5Leopard起，每一版都是官方认真的UNIX）
- IBM AIX
- HP-UX
- Oracle Solaris


## 核心版本

| 名称 | 正式编号/发布年 | 对应SUS版本 | 关键特性变化 |
| - | - | - | - |
| POSIX.1-1988 | IEEE Std 1003.1-1988 | 无（早于SUS）|起点。仅定义了C语言系统接口，不含Shell和工具 |
| POSIX.1-1990 | ISO/IEC 9945-1:1990 | 无 | 国际标准化版本，内容与1988版几乎相同 |
| POSIX.1b | 1003.1b-1993 | 无 | 实时扩展：信号量、消息队列、共享内存、定时器 |
| POSIX.1c | 1003.1c-1995 | 无 | 线程扩展：`pthread_create`，互斥锁，条件变量 |
| POSIX.1-1996 | SUSv1 | 首次大合并：合并了基本规范 + 实时 + 线程 |
| POSIX.1-2001 | IEEE Std 1003.1-2001 | SUSv3 | 重要分水岭。与SUSv3内容完全相同。Linux内核2.6/glibc的主要对标目标 |
| POSIX.1-2008 | IEEE Std 1003.1-2008 | SUSv4 | 当前主流基准。移除了过时函数（如`gethostbyname`，引入`openat`等新接口。macOS、AIX以此认证 |
| POSIX.1-2017 | IEEE std1003.1-2008 | SUSv4 2018 | 勘误维护版，无重大新特性 |
| POSIX.1-2024 | IEEE Std 1003.1-2024 | SUSv5（推测）| 最新。引入`_FORTIFY_SOURCE`风格的安全函数，`pthread_mutex_clocklock`，修复`fork`与多线程的原子性问题 |

特殊版本

- POSIX.2（已废弃）：曾经独立规定Shell和工具（如`grep`, `find`），1996年后内容全部并入POSIX.1主文档
- POSIX 1003.1d/e/j：一些从未大规模流行的“实时调度增强”，仅用于航空电子或军工嵌入式

实际写代码时，不需要记年份，只需要记住Feature Test Macro对应的值

- `_POSIX_C_SOURCE=199309L` 包含POSIX.1b（实时信号）
- `_POSIX_C_SOURCE=199506L` 包含POSIX.1c（线程）
- `_POSIX_C_SOURCE=200112L` POSIX.1-2001（Linux默认版本）
- `_POSIX_C_SOURCE=200809L` POSIX.1-2008（macOS默认基础）















