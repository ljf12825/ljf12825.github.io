---
title: Make and Makefile
date: 2025-12-31
categories: [Linux]
tags: [Toolchains]
author: "ljf12825"
type: blog
summary: Usage of Make and Makefile
---

1. `make`：是一个命令行工具它根据一个名为`Makefile`的脚本文件中的指令，自动地构建和管理项目
2. `Makefile`：是一个文本文件，它定义了源文件之间的依赖关系以及构建这些文件的命令

Make是一个构建工具（build tool），最早在Unix上诞生，用来自动化编译和构建项目\
它的核心思想是：
- 目标（target）：想要创建的东西（比如`main.o`或者`app.exe`或者一个自定义动作如`clean`）
- 依赖（dependencies）：生成目标需要依赖哪些文件（比如源文件`.c`、头文件`.h`）。如果任何一个依赖文件比目标文件新，`make`就知道目标过期了，需要重新构建
- 规则（rule）：告诉Make如何从依赖生成目标（通常是编译命令）

Make根据文件的修改时间，自动决定需要重新编译哪些文件，从而避免全量编译

## 存在意义
想象一个由多个文件组成的C++项目：
- `main.cpp`
- `utils.cpp`
- `helper.cpp`
- `myapp`（最终的可执行文件）

没有`make`，每次修改后都需要手动输入一长串命令来编译
```bash
g++ -c main.cpp -o main.o
g++ -c utils.cpp -o utils.o
g++ -c helper.cpp -o helper.o
g++ main.o utils.o helper.o -o myapp
```
繁琐且低效。如果只修改了`helper.cpp`，重新编译所有文件会浪费大量时间\
有了`Makefile`，只需要输入`make`，`make`工具就会：
1. 读取`Makefile`
2. 检查依赖关系和时间戳
3. 只重新编译哪些被修改的文件以及依赖于这些文件的目标
4. 最后链接可执行文件

这极大地提高了开发效率，实现了增量编译\
在C/C++项目中，头文件依赖是最大的麻烦：修改了一个头文件，所有包含它的`.c`都要重新编译\
常见的做法是让编译器生成依赖
```bash
g++ -MM main.cpp
```
这会输出类似：
```makefile
main.o: main.cpp helper.h utils.h
```
通常会配合`Makefile`里的`-include`来自动引入依赖文件（如`.d`文件），保证依赖关系正确，而不用手写

## Make的核心机制与哲学
- 依赖检查：Make会比较目标文件和依赖文件的时间戳
  - 如果目标比依赖新 -> 不需要重新生成
  - 如果依赖比目标新 -> 需要重新执行命令
- 声明式：在Makefile中，你声明目标和依赖，至于如何决定是否执行，由`make`根据时间戳和规则自动推导。这和命令式脚本不同，后者是需要一步一步写明要做什么
- 递归构建：Make会递归地检查依赖关系
- 最小重建：只编译修改过的部分（增量编译），节省时间
- 自动化 + 增量化：它的核心价值不在于“能编译”，而在于“避免重复劳动”，只编译需要更新的部分

## `Makefile`语法
```makefile
target: dependencies
<TAB> command
```
- `target`：目标文件，最终要生成的东西
- `dependencies`：依赖文件，如果依赖比目标新，Make就会执行规则
- `command`：生成目标的命令，一行或多行shell命令（注意必须以Tab开头，不能用空格代替，这是`make`的历史遗留语法，但必须遵守）

**示例**
假设有一个项目：`main.c`和`helper.c`，最终形成可执行文件`hello`\
Makefile如下
```makefile
# 最终目标：生成可执行文件 hello
hello: main.o helper.o
    gcc main.o helper.o -o hello

# 目标文件 main.o 依赖于源文件 main.c和头文件 helper.h
main.o: main.c helper.h
    gcc -c main.c -o main.o

# 目标文件 helper.o 依赖于源文件 helper.c和头文件 helper.h
helper.o: helper.c helper.h
    gcc -c helper.c -o helper.o

# 自定义目标：清理编译生成的文件
clean:
    rm -f *.o hello

# 告诉 make: 'clean' 不是一个文件，而是一个动作名称
.PHONY: clean
```
- 当运行`make`（不加参数）时，`make`会默认执行`Makefile`中的第一个目标（这里是`hello`）
- 为了构建`hello`，它需要`main.o`和`helper.o`。如果这些`.o`文件不存在或比`hello`新，`make`会先去执行生成它们的规则
- 在生成`main.o`时，它会检查`main.c`和`helper.h`是否比`main.o`新。如果只修改了`helper.h`，那么`main.o`和`helper.o`（因为它们都依赖`helper.h`）都会被重新编译，最重新链接`hello`。这就是依赖关系的强大之处
- `clean`目标没有依赖。它用于删除所有编译生成的文件。可以通过`make clean`来执行
- `.PHONY: clean`告诉`make`，`clean`是一个“伪目标”，并不是要生成一个名为`clean`的文件。这是一个好习惯，可以避免如果当前目录下恰好有一个叫`clean`的文件时，`make clean`命令失效的问题

**伪目标（phony targets）**
`.PHONY`不只是`clean`，可以用它组织构建过程
```makefile
.PHONY: all debug release

all: debug

debug:
    $(MAKE) CFLAGS="-g -Wall"

release:
    $(MAKE) CFLAGS="-O2 -DNDEBUG"
```
这体现了Make还能作为一个任务调度器，不只是编译器的前端

**条件语句**
```makefile
ifeq ($(DEBUG),1)
    CFLAGS += -g
else
    CFLAGS += -O2
endif
```
这样就可以`make DEBUG=1`控制编译模式

**递归Make**\
在大型项目里，通常每个子目录都有自己的`Makefile`，顶层`Makefile`统一调度
```makefile
SUBDIRS = src utils tests

all:
    for dir in $(SUBDIRS); do $(MAKE) -C $$dir; done
```

## 变量和隐含规则
**变量**\
可以定义变量来保存编译器名称、编译选项等
```makefile
# 定义变量
CC = gcc
CFLAGS = -Wall -g
TARGET = hello
OBJS = main.o helper.o

# 使用变量 $(VAR_NAME)
$(TARGET): $(OBJS)
    $(CC) $(OBJS) -o $(TARGET)

main.o: main.c helper.h
    $(CC) $(CFLAGS) -c main.c

helper.o: helper.c helper.h
    $(CC) $(CFLAGS) -c helper.c

clean: 
    rm -f $(OBJS) $(TARGET)

.PHONY: clean
```

**自动变量**\
`make`提供了一些特殊的“自动变量”，在规则的命令中非常有用
- `$@`：当前规则中的目标文件名
- `$<`：第一个依赖项的文件名
- `$^`：所有依赖项的文件列表

使用自动变量可以进一步简化
```makefile
CC = gcc
CFLAGS = -Wall -g
TARGET = hello
OBJS = main.o helper.o

$(TARGET): $(OBJS)
    $(CC) $^ -o $@

# 使用模式规则：如何从 .c 文件构建 .o 文件
%.o： %.c
    $(CC) $(CFLAGS) -c $< -o $@

clean:
    rm -f $(OBJS) $(TARGET)

.PHONY: clean
```
这里的`%.o: %.c`是一个模式规则，它告诉`make`：任何`.o`文件都依赖于同名的`.c`文件，并使用下面的命令来构建。这使得`Makefile`非常简洁，无需为每个`.o`文件写重复的规则\
GNU Make内建了大量的默认规则，比如
```makefile
%.o : %.c
    $(CC) -c $(CFLAGS) $< -o $@
```
很多时候，甚至不用写`.o`的生成规则，Make会自动推导出来。这就是为什么很多简单的Makefile看起来“缺失了一些规则，但依旧能工作

## `make`的使用
在终端中，进入包含`Makefile`的目录
1. 最基本的用法
在项目目录下直接运行
```bash
make
```
默认会执行Makefile中的第一个目标\
如果第一个目标是`all`，那就会先编译所有程序

2. 指定目标
```bash
make target_name
```
例如
```bash
make main
make clean
```
那就会执行`main`或`clean`目标对应的命令

3. 指定Makefile文件
默认情况下，`make`会去找
  - `GNUmakefile`
  - `makefile`
  - `Makefile`
如果文件名不是这些，可以手动指定
```bash
make -f MyMakefile
```

4. 多线程编译（加速）
```bash
make -j
```
- `-j`：让`make`并行执行任务（依赖允许的情况下）
- 可以指定线程数
```bash
make -j4 # 开 4 个线程
make -j8 # 开 8 个线程
```
对大型C++项目编译速度提升非常大

5. 查看执行的命令
有时候想知道`make`实际执行了哪些命令，可以加
```bash
make VERBOSE=1
make -n # 只打印命令，不执行
```

6. 强制重新编译
有时候源文件没变，但想强制重新执行
```bash
make -B
```
忽略时间戳，强制执行所有命令

7. 清理构建
一般`Makefile`里会有
```makefile
.PHONY: clean
clean:
    rm -f *.o main
```
使用：
```bash
make clean
```
删除中间文件，保证下次编译干净

8. 指定变量
在命令行传递变量覆盖Makefile内定义的
```bash
make CC=gcc
make CFLAGS="-02 -Wall"
```
非常适合调试或切换编译器

9. 只执行某一步
有时候只想编译某个`.o`文件
```bash
make main.o
```
它会自动执行生成`main.o`的规则，不会编译整个项目




