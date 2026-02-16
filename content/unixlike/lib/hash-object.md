---
title: hash-object
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: blog
summary: git hash-object
---

`git hash-object`是一个将数据内容转换为Git对象，并返回其唯一SHA-1哈希值的底层命令

## 存在意义
要理解`hash-object`，必须先理解Git的核心思想：Git是一个内容寻址文件系统
1. 存储的是内容，不是文件差异：与某些版本控制系统不同，Git不存储文件的前后差异。它存储的是文件在某个时刻的完整内容快照
2. 通过内容生成密钥：Git会对文件的内容（外加一个小的头信息）计算一个SHA-1校验和。这个校验和就是一个40位的十六进制字符串（如`d670460b4b4aece5915caf5c68d12f560a9fe3e4`）
3. 用密钥来寻址：这个SHA-1哈希值就是该内容在Git数据库中的唯一身份证。Git通过这个“身份证”来找到并取出对应内容

`git hash-object`就是执行2和3的工具

## 基本用法与参数
1. 计算内容的哈希值（不保存）
最基本的用法是计算一段内容的哈希值，但不将其真正存入Git数据库
```bash 
$ echo 'hello world' | git hash-object --stdin
d670460b4b4aece5915caf5c68d12f560a9fe3e4
```
- `--stdin`：告诉命令从标准输入读取内容，而不是从文件。这里通过管道`|`将`echo`的输出传给了它
- 这个命令只是计算了一下，并没有存入`.git/objects`目录下

2. 计算并保存为Git对象（`-w`）
这是更常见的用法，不仅计算哈希值，还将内容作为一个Blob对象写入Git的数据库（`.git/objects`）
```bash 
$ echo 'hello world' | git hash-object --stdin
d670460b4b4aece5915caf5c68d12f560a9fe3e4
```
- `-w`（wirte）：关键选项。表示将对象写入数据库
- 执行后，Git会在`.git/objects`下创建一个文件：
`objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4` Git为了效率，用哈希值的前两位创建了一个子目录

3. 对文件进行操作
更直接的方式是直接指定一个文件
```bash 
# 1. 创建一个新文件
$ echo 'This is my file content.' > myfile.txt

# 2. 将该文件的内容存入Git数据库
$ git hash-object -w myfile.txt 
5e1c309dae7f45e0f39a1ddcacc1ecb7cf211e83

# 3. 验证对象已存在
$ git cat-file -p 5e1c309 
This is my file content.
```

### 示例
```bash 
# 1. 在一个新目录初始化Git仓库
$ mkdir my-test-repo && cd my-test-repo
$ git init

# 2. 创建一个文件
$ echo ‘Version 1 of my content’ > demo.txt

# 3. 手动将这个文件的内容存入Git数据库（注意：此时demo.txt还在工作区，未被git add）
$ git hash-object -w demo.txt
c89fb7b6a1d409d5b4f78c6a4b0c9c82a7c80d8f

# 4. 去看看Git把东西存到哪里了
$ find .git/objects -type f
.git/objects/c8/9fb7b6a1d409d5b4f78c6a4b0c9c82a7c80d8f
# 对象已经创建了。文件名就是其内容的哈希值。

# 5. 用cat-file查看这个对象的内容和类型
$ git cat-file -t c89fb7 # 查看类型
blob
$ git cat-file -p c89fb7 # 查看内容
Version 1 of my content

# 6. 现在修改文件内容
$ echo ‘Version 2 of my content’ > demo.txt

# 7. 再次将新内容存入Git数据库
$ git hash-object -w demo.txt
1a8a0f674c9b8c8a3e4e4d6b2e7d8b9f0a1b2c3d4

# 8. 再次查看Git对象库，现在有两个对象了！
$ find .git/objects -type f
.git/objects/c8/9fb7b6a1d409d5b4f78c6a4b0c9c82a7c80d8f
.git/objects/1a/8a0f674c9b8c8a3e4e4d6b2e7d8b9f0a1b2c3d4
```
修改了文件的内容，Git就创建了一个全新的、独立的对象。它没有覆盖旧的对象。这就是Git存储快照的本质

## `hash-object`与`git add`的关系
`git add`在底层实际上就是调用了`git hash-object -w`

当执行`git add demo.txt`时
1. Git读取`demo.txt`的内容
2. Git计算内容的SHA-1哈希值
3. Git使用`hash-object -w`将这个内容作为一个Blob对象存入`.git/objects`
4. 然后，Git将这个Blob的哈希值、文件路径等信息更新到暂存区

## 应用场景
数据恢复：如果不小心删除了一个分支，但还记得某个文件的哈希值，可以用`hash-object`和`cat-file`等命令尝试恢复数据
