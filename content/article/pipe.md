---
title: Pipe
author: ljf12825
date: 2026-07-03
tags: [CLI, IPC, VFS]
summary: Overview of pipe
---

Pipe的发明者是Douglas McIlroy

在Linux中，管道(Pipe)是一种最基本、最常用的进程间通信(IPC, Inter-Process Communication)机制。它就像一条单向流动的流水线，用于将一个命令的标准输出(stdout)直接连接到另一个命令的标准输入(stdin)

管道具有以下特点：

- 无需临时文件，数据保留在内存中
- 并行性，所有阶段同时运行
- 它的思想符合UNIX的哲学：“只做好一件事，并通过组合小工具来完成复杂任务”

## 语法与基本使用

```bash
command1 | command2
```

工作原理：内核会在内存中开辟一块环形缓冲区(pipe buffer)，默认容量通常为16个内存页面，`command1`不再把结果打印到屏幕上，而是写进这个缓冲区；`command2`也不再等待用户键盘输入，而是直接从这个缓冲区中读取数据

### 标准流

默认情况下，只有标准输出会通过管道\
如果也想传递错误信息：

```bash
command 2>&1 | nextcommand
```

`2>&1`merges stderr(2) into stdout(1)

### 多级管道

管道可以无限连接

```bash
cat access.log \
| grep "404" \
| cut -d' ' -f1 \
| sort \
| uniq -c \
| sort -nr
```

数据流：`cat` -> `grep` -> `cut` -> `sort` -> `uniq` -> `sort`\
每个命令执行一个小的、单一的任务；组合起来，它们就形成了一条强大的处理流水线

## 管道的分类

Linux中的管道主要分为两种

### 1. 匿名管道(Anonymous Pipe)

就是平常用的`|`

- 特点：没有名字，只存在于内存中
- 限制：只能在具有亲缘关系的进程之间使用（通常是父子进程）。当在终端输入`A | B`时，Shell会作为父进程fork出A和B两个子进程，并通过内核建立管道把它们连起来。命令执行完毕后，管道自动销毁

### 2. 命名管道(Named Pipe / FIFO)

存在于文件系统中，可以通过路径访问

- 创建命令：`mkfifo my_pipe`
- 特点：它在文件系统中被标记为一个类型为`p`的特殊文件，但它的内容依然存储在内存中（不占用磁盘空间）
- 优势：允许两个完全没有亲缘关系的独立进程进行通信。一个进程往`my_pipe`写数据，另一个进程从`my_pipe`读数据，只要文件路径一致即可

## 管道的内核行为与系统调用

创建一个匿名管道

```c
int fd[2];
pipe(fd);
```

或者

```c
pipe2(fd, O_NONBLOCK);
```

执行后得到两个文件描述符

```txt
fd[0] # 读端(read end)
fd[1] # 写端(write end)
```

之后就是普通文件操作

```c
write(fd[1], buf, len);
read(fd[0], buf, len);
close(fd[0]);
close(fd[1]);
```

在这个过程中涉及的系统调用大致如下

- `pipe()`
- `pipe2()`
- `read()`
- `write()`
- `close()`
- `fcntl()`
- `dup()`
- `dup2()`
- `poll()`
- `select()`
- `epoll()`
- `splice()`
- `tee()`
- `vmsplice()`

#### `pipe()`行为

调用

```c
pipe(fd);
```

以后，CPU进入内核，内核做以下事情

##### 1. 创建pipe inode（现代Linux实际上使用pipe_inode_info）

内核分配`struct pipe_inode_info`，它里面保存整个管道

```txt
pipe_inode_info
    |
    +---- ring buffer
    |
    +---- readers
    |
    +---- writers
    |
    +---- wait queue
```

##### 2. 创建两个file

Linux里面：一个文件描述符不是一个文件

```txt
fd
v
struct file
v
pipe_inode_info
```

因此

```txt
fd[0]
v
struct file
v
pipe_inode_info

fd[1]
v
struct file
v
pipe_inode_info
```

两个file共享同一个pipe

区别只是

```txt
读端：FMODE_READ
写端：FMODE_WRITE
```

##### 3. 放进当前进程fd table

```txt
task_struct
v
files_struct
v
fdtable
v
3 > struct file(read)
v
4 > struct file(write)
```

返回

```txt
fd[0] = 3
fd[1] = 4
```

### 内核中的数据结构

真正的数据不是直接存在file里面，而是在`pipe_inode_info`里面\
大致像

```txt
pipe_inode_info

+--------------------------------+

read index

write index

nrbufs

buffer[16]

wait queue

mutex

+--------------------------------+
```

其中`buffer`是一个环形缓冲区(Ring Buffer), Linux默认容量一般是16 pages，从Linux 2.6.35开始，用户态可以通过`fcntl()`的`F_SETPIPE_SZ`命令来动态修改管道的容量（在`/proc/sys/fs/pipe-max-size`的限制范围内）

### 系统调用`write()`

```c
write(fd[1], "hello", 5);
```

进入内核以后

```txt
sys_write()
v
vfs_write()
v
pipe_write()
```

真正执行的是`pipe_write()`，它会：

1. 检查ring buffer有没有空间
2. 通过`copy_from_user()`把用户空间数据复制进来，Linux不能直接访问用户地址
3. 更新write index
4. 唤醒等待read的人，如果reader是sleep，通过`wake_up()`将其唤醒

### 系统调用`read()`

```c
read(fd[0], buf, 5);
```

进入

```txt
sys_read()
v
vfs_read()
v
pipe_read()
```

`read()`会先通过pipe查询ring buffer里有没有数据
- 如果有数据，它会通过`copy_to_user()`复制数据，然后read index++
- 如果没有数据，默认阻塞，即将当前进程`TASK_INTERRUPTIBLE`，放入wait queue，然后执行`schedule()`把CPU让出，直到被`wake_up()`唤醒

如果buffer写满了，再`write()`时，也会将当前进程sleep后放入wait queue，等待唤醒

### 内存拷贝的优化：页面拼接(Splice)

Linux管道中还有`splice()`和`vmsplice()`系统调用\
它允许直接将文件描述符之间的数据在内核中进行移动（通过移动`pipe_buffer`的页面引用计数），而完全不需要将数据拷贝到用户空间，从而实现真正的零拷贝(Zero-Copy)\
这也是现代高性能数据传输（如Kafka, Nginx内部的一些本地优化）常用的压榨性能手段

### 原子性保证：`PIPE_BUF`

在多进程同时往一个管道写数据时，数据会不会错乱？

- 当写入的数据量<= `PIPE_BUF`时，内核能保证这次`write`是原子性的，多进程并发写不会互相交织穿插
- 当写入的数据量 > `PIPE_BUF`时，内核不保证原子性，数据可能会和别的人写的数据混在一起

### 关闭管道

```c
close(fd[1]);
```

最终

```txt
fput() -> 减少引用计数
```

如果`writers == 0`以后，返回`0`表示`EOF`\
如果没有reader，再`write()`会收到`SIGPIPE`，如果进程忽略了`SIGPIPE`或者注册了信号处理函数从其中返回，那么`write()`系统调用最终会失败，并返回`-1`，同时将`errno`设置为`EPIPE`

### 总体流程

```txt
           用户态
 ┌──────────────────────────────┐
 │ pipe(fd)                     │
 │ write(fd[1], data, len)      │
 │ read(fd[0], buf, len)        │
 │ close(fd[0]/fd[1])           │
 └──────────────┬───────────────┘
                │ 系统调用
                v 
           Linux 内核
 ┌──────────────────────────────┐
 │ sys_pipe2()                  │
 │   ├─ 创建 pipe_inode_info    │
 │   ├─ 创建两个 struct file    │
 │   └─ 安装到 fdtable          │
 │                              │
 │ sys_write()                  │
 │   └─ pipe_write()            │
 │       ├─ copy_from_user()    │
 │       ├─ 写入环形缓冲区       │
 │       └─ wake_up(reader)     │
 │                              │
 │ sys_read()                   │
 │   └─ pipe_read()             │
 │       ├─ 从环形缓冲区读取     │
 │       ├─ copy_to_user()      │
 │       └─ wake_up(writer)     │
 │                              │
 │ close()                      │
 │   └─ fput()                  │
 └──────────────────────────────┘
```
