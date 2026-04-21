---
title: Ctags
date: 2026-04-21
author: ljf12825
type: file
summary: usage and overview of Ctags
---

Ctags是一个经典的代码索引工具，核心作用是为源代码中的符号（函数、变量、类、宏）生成一个标签文件（通常叫`tags`），共编辑器和IED快速定位定义位置

当看到一个函数调用`get_user()`，想查看它的具体实现时，无需手动翻找文件。在Vim中按一个快捷键，就能瞬间跳转到定义该符号的那一行

Ctags存在两个主要的分支

1. Exuberant Ctags
    - 原作者：Darren Hiebert
    - 这是Ctags本尊，最后版本是5.8（2009年），目前已不再更新
    - [ctags.source.forge.net](https://ctags.source.forge.net/)
2. Universal Ctags
    - 这是Exuberant Ctags的一个Fork
    - 目前全行业标准使用的独立项目。各大Linux发行版里运行`ctags`命令实际上安装的都是它

- Cscope
- Gutentags
- vim-clang
