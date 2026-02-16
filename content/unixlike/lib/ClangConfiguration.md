---
title: Clang and Configuration
date: 2025-12-31
categories: [Linux]
tags: [Toolchains, Compiler, Clang]
author: "ljf12825"
type: blog
summary: Clang and Clang configuration
---

Clang是一个开源的、基于LLVM的编译器前端，支持C、C++、Objective-C、Objective-C++、CUDA、OpenCL等多种编程语言的编译。Clang的目标是提供一个高效、灵活、现代化的编译器，同时拥有非常清晰和易于维护的代码结构

**背景**\
Clang的背景可以追溯到LLVM项目，它是由苹果公司开发的，并于2007年首次发布

LLVM（Low Level Virtual Machine）项目最初由Chris Lattner在2000年发起，目标是创建一个可重用、跨平台的编译器基础设施。LLVM最初的设计目的是为了支持程序优化和高效的目标代码，特别是为新兴的编程语言提供后端支持

Clang是LLVM项目的一部分，旨在作为一个编译器前端（Complier Frontend）替代现有的GCC。Clang的出现给GCC带来了激烈的竞争。Clang强调更高的编译速度、更好的错误信息以及更加现代化的架构设计。Clang在很多开发者中受到欢迎，尤其在macOS和iOS开发中，Clang成为苹果平台的默认编译器

**LLVM生态系统**\
LLVM项目不仅仅是Clang，它还包含了许多其他组件和工具
- LLVM IR：中间表示，用于进行代码优化
- LLVM 后端：生成目标代码，可以针对不同的架构和平台进行优化
- LLDB调试器：与Clang紧密集成的调试器，支持调试C/C++/Objective-C代码
- Flang：基于LLVM的Fortran编译器

**Clang的主要特点**\
1. 高性能
Clang在编译速度和生成代码的质量方面都表现优异。它的编译过程通常比GCC更快，并且生成的代码质量也很高

2. 友好的错误信息
Clang以其详细、清晰、易于理解的错误信息而著称，尤其是在语法错误、类型错误以及代码优化问题的诊断方面，Clang的错误消息往往比GCC更加清晰

3. 模块化和可扩展性
Clang是基于LLVM（低级虚拟机）架构的，具有高度的模块化结构，开发者可以根据自己的需求进行定制和扩展

4. 兼容性
Clang与GCC兼容，支持GCC大多数编译选项，同时也可以与GCC编译的代码一起使用。这意味着可以将Clang用作替代GCC进行编译，同时保持代码的兼容性

5. 广泛支持的语言
  - C/C++
  - Objective-C/Objective-C++
  - OpenCL
  - CUDA
  - Fortran（通过`Flang`，也属于LLVM的一部分）

还支持与其他语言相关的编译和工具链工作，如`Swift`（由Apple开发）

6. 集成调试器
Clang与LLVM调试器（LLDB）紧密集成，提供了高效的调试体验，尤其适用于调试C、C++和Objective-C代码

7. 开源项目
Clang是LLVM项目的一部分，作为一个开源项目，它的代码可以自由使用和修改

**Clang的应用场景**\
- 开发工具链：许多现代开发环境使用Clang作为编译器，尤其是在macOS和iOS开发中，Clang是默认的编译器
- 静态分析：Clang提供了强大的静态分析功能，可以帮助开发者在编译时发现潜在代码问题
- 跨平台开发：Clang支持多种操作系统和平台，包括Linux、macOS、Windows等

### Clang工具链的安装
**通过系统包管理器安装**\
```bash
sudo apt update
sudo apt install clang clangd clang-tidy clang-format lldb lld
```
- `clang`：C/C++编译器
- `clangd`：语言服务器（用于IDE智能提示）
- `clang-tidy`：静态代码分析工具
- `clang-format`：代码格式化工具
- `lldb`：LLVM调试器
- `lld`：LLVM高性能链接器

**安装最新版本**\
```bash
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18 # 安装 Clang 18
```
安装后，工具会命名为`clang-18`、`clang++-18`等，可通过`update-alternatives`设为默认
```bash
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-18 100
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-18 100
```

**从源码编译**\
```bash
# 1. 下载LLVM源码
git clone https://github.com//llvm/llvm-project.git
cd llvm-project

# 2. 配置编译选项（推荐使用Ninja加快编译）
cmake -S llvm -B build -G "Ninja" \
  -DCMAKE_INSTALL_PREFIX=/usr/local/llvm-18 \
  -DLLVM_ENABLE_PROJECTS="clang;clang=tools=extra;lldb;lld" \
  -DCMAKE_BUILD_TYPE=Release

# 3. 编译并安装（耗时较长， -jN 使用多核加速）
cd build
ninja -j$(nproc)
sudo ninja install

# 4. 添加到环境变量
echo 'export PATH=/usr/local/llvm-18/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**验证安装**\
```bash
clang --version
clang++ --version
lldb --version
lld --version
clangd --version
```

## 切换默认工具链
如果系统同时安装了GCC和Clang，可通过`update-alternatives`切换
```bash
# 设置默认编译器为 Clang
sudo update-alternatives --config cc
sudo update-alternatives --config c++

# 设置默认链接器为 LLD
sudo update-alternatives --install /usr/bin/ld ld /usr/bin/lld 50
sudo update-alternatives --config ld

# 设置 gcc 为默认 C 编译器
sudo update-alternatives --install /usr/bin/cc cc /usr/bin/gcc 100
sudo update-alternatives --set cc /usr/bin/gcc

# 设置 g++ 为默认 C++ 编译器
sudo update-alternatives --install /usr/bin/c++ c++ /usr/bin/g++ 100
sudo update-alternatives --set c++ /usr/bin/g++

# 检查当前ld的候选
ls -l /usr/bin/ld*  # 查看所有 ld 变体
update-alternatives --list ld  # 查看已注册的 alternatives

# 如果update-alternatives未配置ld，可以手动设置
# 注册 GNU ld 为默认链接器
sudo update-alternatives --install /usr/bin/ld ld /usr/bin/ld.bfd 100

# 如果系统有多个链接器（如 lld），可以手动选择
sudo update-alternatives --config ld

```
验证
```bash
cc --version # 显示当前编译器版本
c++ --version # 显示当前编译器版本
ld --version # 显示当前链接器版本
```

强制使用某个工具链\
以GCC为例
```bash
export CC=gcc
export CXX=g++
export LD=ld
```
或者在编译时指定
```bash
gcc main.c -o main # 显式使用 gcc
ld ... # 显式使用GNU ld
```

恢复默认设置
```bash
# 重置编译器
sudo update-alternatives --auto cc
sudo update-alternatives --auto c++

# 重置链接器
sudo update-alternatives --auto ld
```

