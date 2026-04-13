---
title: POSIX & SUS
date: 2026-04-10
author: ljf12825
summary: POSIX concept
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
- 本质：它是一系列的标准和规范，定义了操作系统应该为应用程序提供哪些接口（API）

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

### SUS

SUS(Single UNIX Specification)，SUS定义了“一个系统要被称为UNIX,需要满足什么接口和行为”

它规定了：

- 命令
- 系统调用接口(API)
- shell行为
- 文件系统语义

SUS = POSIX + 一些扩展 + UNIX认证规范

SUS是一个更完整的UNIX标准，由The Open Group制定
