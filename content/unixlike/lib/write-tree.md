---
title: write-tree
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: blog
summary: git write-tree
---

`git write-tree`的作用是：将当前暂存区（index/staging area）的内容，作为一个树对象（tree object）写入到Git对象数据库中，并返回该对象的唯一哈希值

## 核心概念
1. 底层 vs. 高层命令
    - 高层命令（porccelain）：日常使用的`git add`, `git commit`, `git push`等。它们对用户友好，完成了复杂的工作流
    - 底层命令（plumbing）：`git write-tree`, `git hash-object`, `git cat-file`等。它们是构建高层命令的“砖块”，直接操作Git的内部对象和数据结构
2. Git对象模型
    Git的核心是一个简单的键值对数据库。插入数据，它会返回一个唯一的键（SHA-1哈希值，现在也逐渐支持SHA-256）。主要有四种对象
    - blob对象：存储文件内容（不包括文件名、权限等元数据）
    - tree对象：存储目录结构。它包含一系列条目，每个条目指向一个`blob`（文件）或另一个`tree`（子目录），并附有文件名和权限模式
    - commit对象：存储一次提交。它指向一个顶层的`tree`对象（代表项目快照），并包含作者、提交者、提交信息以及父提交的指针
    - tag对象：存储标签信息
3. 暂存区（Stage Area/Index）
这是一个位于`.git/index`的二进制文件，它是一个预期的下一次提交的快照。当执行`git add`时，文件内容被存入数据库成为`blob`，同时文件的路径和模式信息被记录到暂存区

## `write-tree`的功能
假设有如下项目目录结构
```text
my-project/
├── README.md
├── src/
│   ├── main.c
│   └── utils.c
└── Makefile
```
步骤分解：
1. 准备暂存区：先通过`git add`将一些文件添加到暂存区
```bash
git add README.md src/main.c src/utils.c Makefiles
```
现在，暂存区里记录了这4个文件的路径、模式和它们对应`blob`的哈希值

2. 执行`write-tree`
```bash
git write-tree
```
这个命令会
- 读取暂存区：分析其中所有的条目
- 构建树对象：在内存中按目录结构，从底向上构建`tree`对象
  - 它会为`src/`目录创建一个`tree`对象，包含`main.c`和`utils.c`两个条目
  - 它会为根目录创建一个顶层的`tree`对象，包含`README.md`, `Makefile`和`src/`（指向刚才创建的子`tree`）三个条目
  - 写入数据库：将这个顶层的`tree`对象进行SHA-1哈希计算，然后将其内容（目录结构数据）压缩并存储到`.git/objects/`目录下（例如，如果哈希是`abc123...`，泽存入`.git/objects/ab/c123...`文件）
  - 返回哈希值：命令输出这个顶层`tree`对象的哈希值

此时，得到了一个代表当前暂存区状态的项目目录快照。但这个快照还不是一个提交，它没有作者、时间、提交信息，也没有历史

## 使用`write-tree`创建一个提交
`write-tree`通常不会单独使用，它需要和另外两个底层命令配合来手动创建一个提交
1. `git write-tree`：创建代表快照的树对象
```bash
tree_sha=$(git write-tree) # 假设得到哈希 T
```

2. `git commit-tree`：创建一个提交对象，它需要指定一个树对象（上一步的结果）和父提交（如果是第一次提交，则没有父提交）
```bash
# 假设这是第一个提交，没有父提交
commit_sha=$(git commit-tree $tree_sha -m "Initial commit")
# 或者，如果不是第一个提交，需要执行父提交哈希 P
# commit_sha=$(git commit-tree $ tree_sha -p $parent_sha -m "Second commit")
```
这一步会创建`commit`对象并返回其哈希值

3. 更新分支引用：新创建的提交对象还没有被任何分支引用。需要手动将当前分支（如`master`）的指针移动到新提交上
```bash
git update-ref refs/heads/master $commit_sha
```
执行完这一步，分支才真正“前进”到了这个新提交。此时运行`git log`就可以看到它了

> `git commit`这个命令，在底层大致就是完成了以上三个步骤
> 1. `git write-tree`（创建快照）
> 2. `git commit-tree`（创建提交对象）
> 3. `git update-ref`（更新分支引用）
> `git commit`还处理了大量其他工作，如校验、钩子（hooks）执行、生成默认信息等

## 示例
```bash
# 1. 初始化一个新仓库
mkdir test-write-tree && cd test-write-tree
git init

# 2. 创建文件并添加到暂存区
echo "Hello, World" > hello.txt
git add hello.txt

# 3. 将暂存区写入树对象
tree_sha=$(git write-tree)
echo "Tree object hash: $tree_hash"

# 4. 查看这个树对象的内容（使用另一个底层命令）
git cat-file -p $tree_hash
# 输出类似：100644 blob 980a0d5... hello.txt
# 这表示树对象包含一个文件，模式是100644（普通文件），指向一个blob

# 5. 查看那个blob的内容
git cat-file -p 980a0d5...
# 输出：Hello, World

# 6. 基于这个树创建提交
commit_hash=$(git commit-tree $tree_hash -m "My first commit, made manually")
echo "Commit object hash: $commit_hash"

# 7. 将master分支指向这个新提交
git update-ref refs/heads/master $commit_hash

# 8. 查看日志
git log --oneline
```