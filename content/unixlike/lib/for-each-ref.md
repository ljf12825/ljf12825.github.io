---
title: for-each-ref
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: blog
summary: git for-each-ref
---

`git for-each-ref`是一个用于遍历和格式化Git引用（refs）的低级命令。它可以被看作是Git引用系统的“查询工具”
- 低级：它直接操作Git内部数据结构，功能强大且灵活，但输出默认较为原始
- 遍历引用：它可以列出和处理所有类型的Git引用，包括
  - 分支（`refs/heads`）
  - 标签（`refs/tags`）
  - 远程跟踪分支（`refs/remotes`）
  - stash（`refs/stash`）
  - Git Hooks等
- 格式化输出：它的真正的威力在于能够按照你指定的格式输出引用信息，非常适合用于脚本和自动化人物

## 基本语法
```bash 
git for-each-ref [<选项>] [<模式>] --format="<格式字符串>"
```
- `<模式>`：可选，用于过滤引用。例如`refs/heads/*`只显示本地分支
- `--format`：核心选项，指定输出格式

## 使用场景
1. 基本使用：查看所有引用
不加任何参数，它会显示仓库中的所有引用
```bash 
git for-each-ref 
```
输出示例
```text 
7a31e33 commit refs/heads/feature/login
f8b4c1d commit refs/heads/main
a1b2c3d tag    refs/tags/v1.0.0
d4e5f6a commit refs/remotes/origin/main
```
每一行包含：提交哈希、对象类型、引用名称

2. 使用`--format`自定义输出（核心功能）
这是`git for-each-ref`最强大的地方。可以使用`%(fieldname)`占位符来提取引用的各种属性

获取简洁的分支列表（只显示名字）
```bash 
git for-each-ref --format-'%(refname:short)' refs/heads/
```
输出
```text 
feature/login 
main 
```
获取更详细的分支信息
```bash 
git for-each-ref --format='%(color:cyan)%(refname:short)%(color:reset) - %(contents:subject) - %(authorname) (%(committerdate:relative))' refs/heads/
```
输出
```text 
feature/login - Add user authentication - Alice (2 days ago)
main - Bump version to 2.1.0 - Bob (1 week ago)
```
3. 过滤引用
通过指定引用模式，可以只查看特定类型的引用

只查看本地分支
```bash 
git for-each-ref refs/heads/
```
只查看标签
```bash 
git for-each-ref refs/tags/ 
```
只查看远程分支
```bash 
git for-each-ref refs/remotes/
```
4. 排序引用
使用`--sort`选项可以对结果进行排序

按提交日期降序排序（最新的在最前面）
```bash 
git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:short) %(refname:short)'
```
输出
```text 
2023-10-27 feature/login
2023-10-25 main
2023-10-20 feature/payment
```
按名字排序
```bash 
git for-each-ref --sort=refname refs/heads/ --format='%(refname:short)'
```

## 常用格式字段

| 字段 | 描述 |
| - | - |
| %(refname) | 完整的引用名称（例如 refs/heads/main）|
| %(refname:short) | 缩短的引用名称（例如 main）|
| %(objectname) | 完整的对象 SHA-1（提交哈希）|
| %(objectname:short) | 缩短的对象 SHA-1（通常前7位）|
| %(objecttype) | 对象类型（commit, tag, tree, blob）|
| %(contents:subject) | 提交或标签的标题/主题 |
| %(contents:body) | 提交或标签的正文 |
| %(authorname) | 作者名字 |
| %(committername) | 提交者名字 |
| %(committerdate) | 提交日期 |
| %(committerdate:relative)	| 相对提交日期（例如 "2 hours ago"）|
| %(committerdate:short) | 短格式提交日期（例如 "2023-10-27"）|
| %(color:red)... | 设置输出颜色 |
| %(align)...%(end)	| 对齐文本块 |

## 示例
1. 查找过时的特性分支
查找那些分支而最后提交时间早于1个月
```bash 
git for-each-ref --sort=committerdate refs/heads/ --format='%(committerdate:relative) %(refname:short)' | grep "months ago"
```

2. 创建自定义分支列表
创建一个格式优美、信息丰富的分支列表
```bash 
git for-each-ref \
  --sort=committerdate \
  --format='%(align:width=20)%(color:bold blue)%(refname:short)%(end) %(color:yellow)%(objectname:short)%(color:reset) - %(contents:subject) (%(color:green)%(committerdate:relative)%(color:reset))' \
  refs/heads/
```
3. 模仿`git branch -avv`的输出
```bash 
git for-each-ref --format='%(color:bold green)%(refname:short)%(color:reset) %(objectname:short) %(contents:subject)' refs/heads/
```

4. 在脚本中使用
在Shell脚本中循环处理分支
```bash 
git for-each-ref --format='%(refname:short)' refs/heads/ | while read branch; do
  echo "Processing branch: $branch"
  # 对每个分支执行某些操作
done
```

## 总结
`git for-each-ref`有以下特点
1. 一致性：用同一个命令处理所有类型的引用（分支、标签、远程分支等）
2. 可定制性：`--format`选项可以让你精确控制输出内容，提取任何需要的信息
3. 脚本友好：清晰的输出格式非常适合在Shell脚本、Git Hooks或其他自动化工具中使用
4. 性能：直接访问引用数据库，效率很高
5. 强大过滤：结合`--sort`和模式匹配，可以轻松找到特定的引用
