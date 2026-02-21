# `rev-list`
`git rev-list`是Git中最核心、最底层的对象遍历命令之一。它的名字可以理解为“revision list”（版本列表），其主要功能就是按照给定的顺序和规则，列出一系列提交的SHA-1哈希值

## 是什么
简单来说，`git rev-list`是一个“提交列表生成器”。给它一个或多个起点（有时也包括终点），它就能根据提交历史的有向无环图，遍历并列出所有符合条件的提交

关键点
- 输出的是SHA-1：默认情况下，它只输出完整的提交哈希ID,而不是像`git log`那样格式化的信息
- 底层命令：它是“管道”命令，设计用来被其他程序或脚本调用，而不是直接给用户看
- 顺序重要：默认的遍历顺序对Git的操作（如打包、计算差异）至关重要

## 基本用法
最基本的用法是指定一个起点，它会列出所有可以从该起点回溯到达的提交
```bash
# 列出 master 分支上的所有提交
# 顺序通常是反向时间顺序，即最新的提交先列出
git rev-list master 

# 列出某个特定提交及其所有祖先
git rev-list <commit-hash>
```

## 常见选项和场景
`rev-list`的强大之处在于其丰富的选项，它们可以组合出非常复杂的查询

1. 指定范围
    这是`rev-list`最核心的功能之一，用于比较两个分支或提交
    - 双点语法`..`：查看在分支B上但不在分支A上的提交
```bash 
# 查看在 feature 分支上但不在 main 分支上的提交
git rev-list main..feature 
```
这在`git push`或`git log`时非常有用。`git push origin main..feature`就是推送这些提交

    - 三点语法`...`：查看在分支A上或分支B上，但不同时在两个分支上的提交（即对称差集）
```bash 
# 查看 feature 和 main 分支独有的提交（排除它们的共同祖先）
git rev-list main...feature 
```

2. 限制输出数量
    - `-n <number>`, `--max-count=<number>`：限制输出的提交数量
```bash 
# 获取最近的5个提交
git rev-list main -5
```

3. 过滤和筛选
    - `--since`, `--until`：按时间过滤
```bash 
# 列出过去一周内在 main 分支上的提交
git rev-list main --since="1 week age"
```
    - `--grep=<pattern>`：在提交信息中搜索
```bash 
# 查找提交信息中包含 "bugfix" 的提交
git rev-list main --grep="bugfix"
```
    - `--author=<pattern>`：按作者过滤
    - `--merge`/`--no-merges`：只显示/不显示合并提交

4. 输出格式化
虽然主要输出SHA-1,但它也提供了一些基本格式
    - `--pretty=<format>`：可以以其他格式（如`online`, `format:`）输出
```bash 
# 像 git log --oneline 一样输出
git rev-list main --pretty=online 
```

5. 高级和内部使用
    - `objects`：列出所有相关的Git对象，而不仅仅是提交。这包括提交对象、树对象和文件对象。这是`git pack-objects`命令的基础，用于生成打包文件
```bash 
# 列出分支main引用的所有对象
git rev-list --objects main 
```
    - `--count`：不显示SHA-1，只显示符合条件的提交数量
```bash 
git rev-list --count main..feature 
```
    - `--reverse`：反转输出顺序（例如，从最旧的提交开始输出）
    - `--first-parent`：一个非常重要的选项。它只跟随合并提交的第一个父提交，这让你看到项目的主线发展，而忽略掉特性分支内部的具体合并历史
```bash 
# 查看 main 分支的主线历史
git rev-list --first-parent main 
```
