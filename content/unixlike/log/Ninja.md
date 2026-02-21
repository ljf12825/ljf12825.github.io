---
title: Ninja
date: 2025-12-31
categories: [Linux]
tags: [Toolchains]
author: "ljf12825"
type: log
summary: Usage of Ninja
---

Ninja是一个小巧、高效的构建系统，专注于快速执行构建规则\
它不负责生成构建规则，而是执行已有规则，规则通常由CMake之类的工具生成，Ninja本身只关注如何根据描述的依赖关系来执行命令\
Make是既要写规则，又要执行；Ninja是只管执行，生成规则交给别的工具\

**Ninja的核心特点**
- 极快：它的目标就是比`make`快很多，特别是在增量构建时；相比于传统的`make`，Ninja在启动开销、依赖检查、任务调度等方面都进行了极致优化
- 并行化：天生支持多核运行（`ninja -j N`控制线程数）
- 最小化I/O：Ninja避免过度扫描文件，依赖检查逻辑很轻量
- 专注单一目标：不像CMake或Make那样很多花哨功能，Ninja只有一个任务：尽快跑完编译命令；Ninja的构建文件（`build.ninja`）由高级生成器（如CMake）输出。这意味着依赖关系显式且精确，避免了`make`中可能因隐式导致的错误构建
- 设计简单：Ninja的语法和功能极其简单，它不包含复杂的逻辑（如条件判断、函数调用）。所有复杂逻辑都留给上一级的生成器，Ninja只负责执行。这使得它非常稳定和可预测

## 使用
1. 使用CMake生成Ninja构建文件
在配置CMake项目时，使用`-G Ninja`参数指定生成器未Ninja
```bash
# 在项目构建目录中
mkdir build && cd build
cmake -G Ninja .. -DCMAKE_BUILD_TYPE=Release
```
这条命令会读取上一级目录（`..`）的`CMakeLists.txt`，并根据其内容生成`build.ninja`文件和各种`.ninja`片段，而不是Makefile

2. 使用Ninja进行构建
在上一步的`build`目录中，直接运行`ninja`命令
```bash
ninja
```
Ninja会读取`build.ninja`文件，开始编译项目。会看到它的输出非常简洁，直接显示正在进行的任务和进度，没有冗余信息

3. 常用Ninja命令
  - `ninja`：构建默认目标（通常是`all`）
  - `ninja target_name`：构建指定的目标（例如`ninja hello_world`）
  - `ninja -j N`：指定并行编译的任务数（例如`ninja -j 8`使用8个线程）。Ninja会自动检测CPU核心数，但有时手动指定可以获得更好性能
  - `ninja -C builddir`：指定在`builddir`目录下执行构建（等价于`cd builddir && ninja`）
  - `ninja clean`：清理所有构建处的文件
  - `ninja -t clean`：这是Ninja自带的清理命令，有时比生成器生成的`clean`规则更高效
  - `ninja -t targets`：列出所有可构建的目标
  - `ninja -t graph`：以`graphviz`格式输出所有目标的依赖图，可用于可视化依赖关系
  - `ninja -n`：`--dry-run`，显示将要执行的命令但实际上不执行，用于调试

## Ninja构建文件
虽然不推荐手写，但了解其基本语法有助于调试。`build.ninja`文件主要由`rule`（规则），`build statement`（构建语句）和`variable`（变量）组成
- `rule`：定义了如何执行一个任务，类似于Makefile中的模式规则
```ninja
# 定义一个名为'compile'的规则
rule compile
    command = gcc -c -o $out $in # 要执行的命令
    description = Compiling $out # 构建时显示的信息
    depfile = $out.d # 用于存储头文件等依赖信息
```
  - `$in`代表输入文件（如`.c`文件）
  - `$out`代表输出文件（如`.o`文件）

- `build`：是Ninja的核心，它定义了具体的文件依赖关系和使用的规则
```ninja
# 构建语句格式：build output_file: rule_name input_file
build hello.o: compile hello.c
```
这表示：要构建`hello.o`，需要使用`compile`这个规则，并且它依赖于`hello.c`文件

- `variable`
```ninja
cflags = -Wall -O2
rule compile
    command = gcc $cflags -c -o $out $in
```
- 默认目标
```ninja
default hello
```
- 伪目标
```ninja
build all: phony hello.exe other_target
```
`phony`表示`all`不是一个真实的文件，它总是需要被构建

完整示例
```ninja
cflags = -Wall

rule compile
  command = gcc $cflags -c -o $out $in

rule link
  command = gcc -o $out $in

build main.o: compile main.c
build utils.o: compile utils.c

build myapp: link main.o utils.o

default myapp
```