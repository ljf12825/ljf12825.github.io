---
title: Filter
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: filter-branch and filter-repo
---

# Filter
`git filter-branch`和`git filter-repo`都是Git提供的工具，用于在历史提交中对提交内容进行重写、过滤或修改。两者的功能相似，都是用于修改Git仓库的历史记录，但它们之间有一些显著的区别，尤其是在性能、易用性和功能扩展性方面

## 主要用途
1. 删除敏感信息
在开发的过程中，可能不小心将敏感信息（如密码、API密钥、私密文件等）提交到Git仓库。使用`gir filter-branch`或`git filter-repo`，可以删除这些敏感信息，甚至在所有历史提交中都清除掉。比如
  - 删除历史提交中的某个文件（如`.env`文件）
  - 删除敏感的字符串（如某个API密钥）
2. 修改提交信息
在提交之后，你可能会发现某些提交信息需要修改，例如
  - 错误的作者姓名或邮件地址
  - 错误的提交信息（比如`Fix typo`，实际上是`Correct typo`）

这时候，`git filter-branch`或`git filter-repo`可以帮助你修改历史中的这些提交信息

3. 删除不需要的文件或目录
有时候你可能希望删除某些文件或目录，这些文件或目录已经被误提交到Git仓库中，并且你希望它们从历史中永久消失。使用这些工具，你可以在所有历史提交中删除这些文件或目录

4. 批量替换内容
比如你想批量替换所有提交中的某个文本内容，或者对某个文件的内容做出修改（比如代码重构或注释风格统一），这些工具都可以实现

5. 重新组织提交
通过这些工具，你还可以对提交的顺序或结构进行修改，例如
  - 合并多个提交
  - 将多个提交拆分称更小的提交

6. 清理历史记录
有时Git仓库的历史记录可能包含了一些无关的文件或大量的垃圾数据，`git filter-branch`或`git filter-repo`可以帮助清理这些不需要的历史记录，减小仓库大小

## `git filter-branch`
### 概述
`git filter-branch`是Git自带的一个工具，旨在允许用户修改仓库历史记录。它可以用来重写提交历史，例如
- 删除某些文件
- 修改文件内容
- 修改提交作者
- 更改提交信息

不过，`git filter-branch`已经不再被推荐用于大多数操作，原因是它的性能较差，特别是在历史记录较大的仓库中，它运行速度很慢，且容易出错

```bash
git filter-branch --tree-filter '<command>' <branch>
```
- `--tree-filter`：该选项允许你在每个提交的工作区中执行指定的命令。通过此命令，你可以对每次提交的文件内容进行更改
- `<command>`：指定你要在每个提交上执行的命令，例如删除某个文件
- `<branch>`：要执行过滤的分支

### 示例
1. 删除某个文件
```bash
git filter-branch --tree-filter 'rm -f path/to/file' HEAD
```
这将从所有历史提交中删除`path/to/file`文件

2. 更改提交作者
```bash
git filter-branch --env-filter '
if [ "$GIT_AUTHOR_NAME" = "Old Name" ]; then
  GIT_AUTHOR_NAME="New Name"
  GIT_AUTHOR_EMAIL="new-email@example.com"
fi 
' HEAD
```

3. 替换文件内容
```bash
git filter-branch --tree-filter 'sed -i "s/old-text/new-text/g" path/to/file' HEAD
```

### 缺点
- 性能差：`filter-branch`的运行速度很慢，尤其在历史提交非常多的情况下。因为它是逐个提交地修改整个仓库的历史
- 易出错：因为它修改了所有历史提交，它的操作不可逆，并且需要非常小心
- 不易操作：语法较为复杂，并且有很多不太直观的选项

## `git filter-repo`
### 概述
`git filter-repo`是Git官方推荐的用于替代`git filter-branch`的工具。它提供了更快、更灵活的功能，并且易于使用。`git filter-repo`是Git社区开发的，并且它已经在Git官方文档中推荐替代`git filter-branch`

`git filter-repo`比`git filter-branch`更加高效和功能强大，它通过直接操作Git仓库的数据结构来进行历史重写，极大地提升了性能

### 安装
`git filter-repo`并不是Git默认安装的一部分，通常需要单独安装。可以通过以下方式安装
```bash
pip install git-filter-repo 
```

### 用法
```bash
git filter-repo --<operation> <parameters>
```
- `--<operation>`：这是你要执行的操作类型，例如删除文件、修改文件内容等
- `<parameters`：操作的具体参数，例如要删除的文件路径、要替换的文本等

### 常见操作
1. 删除某个文件
```bash
git filter-repo --path path/to/file --invert-paths 
```
这会从所有历史提交中删除`path/to/file`文件

2. 更改提交作者
```bash
git filter-repo --commit-callback '
if commit.author_name == b"Old Name":
commit.author_name == b"New Name"
commit.author_email =b"new-email@example.com"
'
```

3. 删除特定路径下的所有文件
```bash
git filter-repo --path-glob "path/to/folder/*" --invert-paths 
```

4. 重写提交信息
```bash
git filter-repo --message-callback '
if b"Fix typo" in commit.message:
    commit.message = commit.message.replace(b"Fix typo", b"Correct typo")
'
```

### 优势
- 性能高：`git filter-repo`直接操作Git数据结构，比`git filter-branch`更高效，特别是在处理大仓库时
- 简洁易用：相比`git filter-branch`, `git filter-repo`提供了更加简洁和直观的命令格式，并且对常见任务有专门的选项
- 灵活性：它支持更多类型的过滤和修改操作，比如通过Python脚本编写自定义操作
