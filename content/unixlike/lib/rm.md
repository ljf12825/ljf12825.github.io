---
title: rm
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: git rm
---

`git rm`是一个Git命令，用于从Git仓库的索引和工作目录中同时删除文件\
简单来说，它做了两件事：
1. 从工作目录删除物理文件
2. 将这次“删除操作”`add`，下次`commit`时，这个删除会被记录

它的作用等同于手动执行以下两个命令
1. `rm <filename>`（在磁盘上删除文件）
2. `git add <filename>`（将删除这个变动添加到暂存区）

但`git rm`一步到位，更加方便和语义化

## 使用
1. 删除普通文件
删除一个已经被Git跟踪的文件（已经`add`和`commit`）
```bash
git rm <file_path>
```
示例
```bash
git rm ole_file.txt
git status # deleted:: old_file.txt已被暂存
git commit -m "Remove the old file"
```

2. 删除文件夹
删除整个文件夹及其中的所有文件，使用`-r`（递归）选项
```bash
git rm -r <directory_path>
```

3. 强制删除（`-f`或`--force`）
如果一个文件被修改过，并且修改还没有被暂存，Git为了防止意外丢失尚未保存的更改，会拒绝用普通的`git rm`删除\
此时，如果确定要删除的话，可以使用`-f`选项
```bash
git rm -f <file_path>
```

4. 仅从索引中删除，但保留在工作目录中(`--cached`)
它只将文件从Git的暂存区中移除，停止对文件的跟踪，但会保留文件在本地工作目录中\
使用场景：
  - 误将不应该提交的文件添加到了Git（比如包含密码的配置文件、编译产生的临时文件等）
  - 想让一个文件被`.gitignore`规则忽略，但这个文件已经被Git跟踪了。仅仅把它添加到`.gitignore`是没用的，必须先`git rm --cache`来取消对他的追踪

```bash
git rm --cached <file_path>
```
示例：\
假设不小心把`config.json`（包含数据库密码）提交到了Git仓库，现在不想让它被Git跟踪，但又不想再本地删除它
  1. 首先，把`config.json`添加到`.gitignore`文件中，防止未来再次被跟踪
  2. 然后执行
```bash
git rm --cached config.json

# 查看状态，会看到"delete: config.json"在暂存区
# 同时，本地文件会显示为“未跟踪（untracked）”
git status

# 提交这次删除操作。注意：这次提交会从仓库历史中删除这个文件
# 但本地的 config.json文件依然存在
git commit -m "Stop tracking sensitive config file"
```
现在，`config.json`就不再被Git管理了，并且因为把它加入了`.gitignore`，它以后也不会被意外添加进去。其他开发者拉取这次提交后，他们的仓库中`config.json`会被删除，但他们本地的副本不会被影响（除非他们使用了`git clean`之类的命令）

## 参数
| 参数 | 描述 |
| - | - |
| `f` | 强制 |
| `-n`/`--dry-run` | 仅显示 |
| `-r` | 递归 |
| `--cached` | 仅对暂存区 |
| `--ignore-unmatch` | 即时没有匹配的文件也以零状态退出 |
| `--sparse` | 稀疏检出，只检出版本库中的一个子集文件 | 
| `-q`/`--quiet` | 隐藏git rm对删除文件的输出 |
| `--pathspec-from-file=<file>` | 从文件中读取要删除的内容的路径（pathspec）|
| `--pathspec-file-nul` | 仅对`--pathspec-from-file`有意义，使用NUL字符将pathspec元素分开，其他所有字符的含义不变 |
