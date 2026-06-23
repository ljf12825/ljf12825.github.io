---
title: Linux commands
author: ljf12825
date: 2026-06-16
type: file
summary: Overview of commands in Linux
---

## 命令

Linux中的命令根据系统底层的执行机制和来源来看，可以被划分为4大核心种类\
可以通过`type <command_name>`来查看某个命令到底属于哪一类

### 1. 内置命令(Shell Builtins)

内置命令是指直接写在Shell（如Bash, Zsh）源码内部的命令。当终端启动时，这些命令就已经随着Shell进程一起加载到内存中了

- 执行机制：默认不会创建子进程（不fork)。Shell收到命令后，直接在当前的Shell进程内部调用相应的C语言函数来执行。但某些builtin在pipeline中仍可能在subshell执行（如`(cd /tmp)`）
- 为什么需要内置：因为有些操作必须改变当前Shell进程的状态。如果创建子进程去执行，子进程一退出，对父进程毫无影响
- 经典代表：
  - `cd`：必须在当前进程调用`chdir()`系统调用来改变工作目录
  - `exit`：终止当前Shell进程
  - `export`, `set`, `unset`：修改当前Shell的环境变量
  - `alias`：设置当前Shell的别名
- 如何识别：运行`type cd`，会输出`cd is a shell builtin`

### 2. 外部命令(External Commands / Disk Commands)

外部命令是独立于Shell之外的、存在于磁盘上的可执行文件（二进制程序文件或脚本）。它们通常存放在`/bin`, `/sbin`, `/usr/bin`等目录下

- 执行机制：必须创建子进程。Shell会通过`fork()`创建一个子进程，然后子进程调用`exec()`家族系统调用（如`execve`），将磁盘上的可执行文件加载到内存中替换自己，最后父进程(Shell)等待子进程执行完毕
- 环境变量`PATH`：当输入一个外部命令（如`ls`）且没有执行绝对路径时，Shell会根据系统的`PATH`环境变量中定义的目录顺序，挨个去磁盘上搜寻对应的同名文件
- 经典代表：`ls`, `cp`, `mv`, `grep`, `awk`, `tar`等
- 如何识别：运行`type ls`，会输出`ls is hashed(/usr/bin/ls)`或绝对路径

### 3. 别名(Aliases)

别名是用户或系统自定义的命令“快捷方式”。它允许用户用一个简短的词来代替一长串复杂的命令

- 执行机制：它属于Shell的文本替换阶段。在Shell解析命令的骨架之前，如果发现第一个词匹配别名，就会直接把它替换成原本的长命令，然后再去判断它是内置命令还是外部命令
- 经典代表：很多Linux发行版默认会将`ll`设置为`ls -l`或`ls -la --color=auto`的别名
- 如何识别：运行`type ll`，会输出`ll is an alias for ls -l`

### 4. Shell函数(Shell Functions)

Shell函数是写在Shell配置文件（如`.bashrc`, `zshrc`）或者脚本中的一段代码块。它类似于编程语言中的函数

- 执行机制：与内置命令类似，函数通常在当前Shell的上下文环境中执行（除非在函数内部显式使用了管道或括号导致触发subshell）。它的优先级高于外部命令
- 为什么需要：用于将多个复杂的命令组合在一起，封装成一个自定义的高级命令，并且可以接收参数
- 如何识别：运行`type <function_name>`，会输出`... is a function`以及函数的具体实现代码

### Linux命令的执行优先级

当在终端输入一个名字时（假设这个名字同时存在于别名、函数、内置和外部命令中），Shell会按照以下严格的优先级顺序去匹配并执行它

```txt
Alias > Function > Builtin > External/PATH
```
