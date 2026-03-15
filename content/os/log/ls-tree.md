---
title: ls-tree
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: log
summary: git ls-tree
---

`git ls-tree`是一个用于查看Git树对象（Tree Object）内容的命令

在Git中，文件并不是直接存储在提交里的。每一次提交都指向一个树对象，这个树对象就像是文件系统中的一个目录。它记录了该提交下包含的文件和子目录的权限、类型、哈希值和名字

`git ls-tree`的作用就是“列出”这个特定“目录”（树对象）里的所有内容

## 基本用法
```bash 
git ls-tree [<options>] <tree-ish> [<path>...]
```
- `<tree-ish>`:这是Git中一个术语，指任何可以最终解析为一个树对象的东西，常见的有
  - 提交的SHA-1哈希值（如`a1b2c3d`）
  - 分支名（如`main`, `master`, `develop`）
  - 标签名（如`v1.0.0`）
  - `HEAD`（代表当前检出的提交）
- `<path>`：可选的路径参数。如果指定，则只列出该路径下的内容，相当于查看子目录

## 常用选项

| 选项 | 全称 | 作用 |
| - | - | - |
| `-r` | `--recursive` | 递归地列出所有子目录的内容。这是最常用的选项之一，可以让你看到整个项目的文件树 |
| `-t` | `--tree` | 在递归模式下`-r`，同时列出目录本身 |
| `-l` | `--long` | 显示文件的大小（单位：字节）|
| `-d` | `--directory` | 只显示树对象本身（即目录），不显示其包含的blob对象 |
| `--name-only` | | 只显示文件名/路径，不显示模式、类型和哈希值 |
| `--name-status` | | 只显示文件名/路径，但其输出格式与`git status`类似（实际上这里只会显示文件名，因为内容都是已跟踪的）|
| `--full-name` | | 显示从仓库根目录开始的完整路径。通常与`-r`一起使用 |

## 输出格式解析
在不使用`--name-only`等选项时，默认输出格式为
```text 
<mode> <type> <object> <file> 
```
- `<mode>`：文件的权限模式，类似Unix文件权限
  - `100644`：普通文件（不可执行）
  - `100757`：可执行文件
  - `120000`：符号链接文件
  - `040000`：目录（树对象）
- `<type>`：对象的类型
  - `blob`：代表一个文件
  - `tree`：代表一个子目录
- `<object>`：对象的SHA-1哈希值。这是Git在内部唯一标识这个文件或目录内容的密钥
- `<file>`：文件或目录的名称

## 示例
假设有如下项目结构
```text 
my-project/
├── README.md
├── src/
│   ├── main.c
│   └── helper.h
└── docs/
    └── index.txt
```
1. 查看最新提交的根目录树
```bash 
git ls-tree HEAD 
```
输出可能类似
```text 
040000 tree a1b2c3d...    docs
100644 blob e4f5g6h...    README.md
040000 tree b2c3d4e...    src
```
可以看到根目录下有一个`docs`目录，一个`README.md`文件和一个`src`目录
2. 递归查看整个项目树
```bash 
git ls-tree -r HEAD 
```
输出可能类似
```text 
100644 blob e4f5g6h...    README.md
100644 blob i7j8k9l...    docs/index.txt
100644 blob m1n2o3p...    src/helper.h
100644 blob q4r5s6t...    src/main.c
```
这会列出该提交下所有文件的完整路径

3. 递归查看并显示文件大小
```bash 
git ls-tree -rl HEAD 
```
输出可能类似
```text 
100644 blob e4f5g6h...     123    README.md
100644 blob i7j8k9l...     456    docs/index.txt
100644 blob m1n2o3p...      78    src/helper.h
100644 blob q4r5s6t...    1024    src/main.c
```
第五列显示了文件的大小（字节数）
4. 只查看某个子目录的内容
```bash 
git ls-tree HEAD src 
```
输出可能类似
```text 
100644 blob m1n2o3p...    helper.h
100644 blob q4r5s6t...    main.c
```
5. 只显示文件名
```bash 
git ls-tree -r --name-only HEAD 
```
输出
```text 
README.md
docs/index.txt
src/helper.h
src/main.c
```
这个命令非常实用，可以快速获取某个提交版本下的所有文件列表

6. 查看历史某个特定提交的树
```bash 
git ls-tree -r a1b2c3d
```
这里的`a1b2c3d`是某个旧提交的哈希值（或者前7位）
