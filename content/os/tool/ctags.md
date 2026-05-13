---
title: Ctags
date: 2026-05-13
author: ljf12825
type: file
summary: usage and overview of Ctags
---

## 前言

Ctags是一个经典的代码索引工具，核心作用是为源代码中的符号（函数、变量、类、宏）生成一个标签文件（通常叫`tags`），供编辑器和IED快速定位定义位置

当看到一个函数调用`get_user()`，想查看它的具体实现时，无需手动翻找文件。在Vim中按一个快捷键，就能瞬间跳转到定义该符号的那一行

Ctags存在两个主要的分支

1. Exuberant Ctags
    - 原作者：Darren Hiebert
    - 这是Ctags本尊，最后版本是5.8（2009年），目前已不再更新
    - [ctags.source.forge.net](https://ctags.source.forge.net/)
2. Universal Ctags
    - 这是Exuberant Ctags的一个Fork
    - 目前全行业标准使用的独立项目。各大Linux发行版里运行`ctags`命令实际上安装的都是它
    - [ctags.io](https://ctags.io/)

### 安装 Universal Ctags

`ctags`变种很多，Universal Ctags 是支持最多语言且仍在维护的

#### 通过包管理器安装

```bash
# Debian's
sudo apt install universal-ctags
```
#### 在GitHub上下载二进制文件

Universal Ctags 每天晚上会通过 GitHub Action 编译一版最新的二进制文件，详情参见Ctags的README

拿到压缩包并解压后会得到如下内容

```txt
uctags/
|-- bin/
|   |-- ctags
|   |--readtags
|   |__ optscript
|__ man/
```

可以将其放在`~/.local`下，然后加PATH写进`~/.bashrc`\
或者可以将其放在/usr/local/bin/`下

#### 源码编译安装

Ctags的构建系统是典型的Autotools\

拿到源码后，需要先生成configure

```bash
./autogen.sh
```

这一步会生成

- configure
- Makefile.in
- aclocal.m4

接着

```bash
./configure # 默认在 `usr/local/bin/` 下
```

也可以指定安装目录

```bash
./configure --prefix=$HOME/.local
```

编译

```bash
make -j$(nproc)
```

安装

```bash
sudo make install # 系统默认
make install # 用户目录
```

如果安装在了用户目录，记得添加环境

## 核心原理

`ctags`生成的文件叫`tags`，默认放在当前目录下。它的每一行格式大致是这样

```txt
main main.c /^int main(int argc, char *argv[])$/;"  f
```

- `main` 标签名（按`^]`时，Vim会找这个词）
- `main.c` 这个标签在哪个文件
- `/^int main(...)$/` 在文件中的具体位置（一个正则表达式）
- `f` 类型标记（这里`f`表示函数）

当光标在`main`上按下`^]`，Vim就去`tags`文件里找这一行，然后打开`main.c`，跳到那一行

## 使用

### 生成 tags 文件

在项目根目录下

```bash
ctags -R .
```

- `-R`：递归扫描所有子目录
- `.`：从当前目录开始

这会生成一个`tags`文件，生成和项目规模成正比

### 让 Vim 找到它

Vim 默认会在当前目录查找`tags`文件。但如果在项目子目录里打开Vim，它可能找不到根目录的`tags`\
解决办法：在 `~/.vimrc` 里加

```vim
" 从当前目录向上递归查找 tags 文件，直到找到为止
set tags=./tags;,tags;
```

这行的意思是：先找当前目录的`tags`，如果没有找到就往上一级找，一直找到文件系统根目录。这样不管在项目的哪个层级打开Vim，都能用上同一个索引

### 核心快捷键

| 按键 | 效果 |
| - | - |
| `^]` | 跳转到这个函数的第一个定义 |
| `^T` | 返回到跳转前的位置 |
| `^W }` | 在预览窗口中显示定义，光标不离开当前文件 |
| `g]` | 如果这个名字有多个含义（如函数重载），列出所有定义供选择 |
| `:tn` | 跳转到下一个匹配的标签（比如有多个同名函数）|
| `:tp` | 跳转到上一个匹配的标签 |
| `:ts <名字>` | 列出所有匹配的标签，选择一个跳转 |

### 参数

## ctags 的局限






- Cscope
- Gutentags
- vim-clang
