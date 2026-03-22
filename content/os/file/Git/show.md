---
title: show
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git show
---

Git底层是一个K-V存储数据库。提交的所有内容（文件、提交记录、标签等）都存储为对象，并通过其SHA-1哈希值来寻址

`git show`的核心作用就是：给定一个对象的哈希值或引用，以一种对人类友好的方式展示这个对象的内容

## 使用
### 显示最新的提交（HEAD）
最常用的命令是不带任何参数
```bash
git show
```
这默认会显示`HEAD`（当前最新的提交）的详细信息，包括
1. 提交元数据：提交哈希、作者、提交者、日期和提交信息
2. 变更内容：显示这次提交引入的所有更改，以统一的diff格式呈现（`-`表示删除的行，`+`表示新增的行）

### 显示指定提交
可以通过提交哈希、分支名、标签名或任何Git能识别的引用来查看特定对象
```bash
git show f47ac10b # 显示前几位哈希即可，Git会自动匹配
git show main # 显示main分支的最新提交
git show v1.0.0 # 显示标签 v1.0.0所指向的提交
git show HEAD~1 # 显示上一个提交(HEAD的父提交)
git show HEAD^ # 同上，显示父提交
```

### 显示不同类型的对象
1. 提交（Commit）
这是默认行为

2. 标签（Annotated Tag）
附注标签（Annotated Tag）本身也是一个对象，它包含打标签者的信息、日期和注释信息
```bash
git show v1.0.0
```
输出会分为两部分
1. 标签对象本身的信息：打标签的人、时间、标签信息
2. 标签所指向的提交：显示该提交的diff信息

3. 树（Tree）
树对象代表目录结构。虽然不常用，但你可以查看某个提交时的目录树
```bash
git show HEAD^{tree} # 查看 HEAD 提交的根目录树
```

4. 数据块（Blob）
Blob对象存储着文件内容。可以查看某个文件在特定提交时的原始内容
```bash
git show HEAD:README.md # 查看 HEAD 中 README.md 的内容
git show f47ac10:src/app.js # 查看特定提交中 app.js 的内容
```
这非常有用，它可以让你快速查看历史版本中的文件，而无需切换分支或撤销更改

5. 父提交的比较
一个合并提交（Merge Commit）有两个或多个父提交。`git show`默认可能不会显示一个直观的diff。可以使用一些选项来调整
```bash
git show -m <merge-commit-hash>
git show --fitst-parent <merge-commit-hash> # 仅显示与对一个父提交的差异
```

## 常用选项
`git show`有许多选项来定制输出内容

| 选项 | 描述 |
| - | - |
| `--name-only` | 只显示更改的文件名，不显示具体的diff内容。快速浏览提交影响了哪些文件 |
| `--nama-status` | 比`--name-only`更详细一点，显示文件名和更改状态（A,M,D） |
| `--oneline` | 将输出压缩为一行，只显示缩略哈希和提交信息的第一行。通常与`-s`一起用 |
| `-s`/`--no-patch` | 不显示diff内容，只显示提交信息。当你只关心是谁、在什么时候、为什么提交，而不关心具体改了什么的时候使用 |
| `--format=<format>` | 自定义输出格式。功能极其强大，可以精确控制显示哪些元数据 |
| `--stat` | 显示一个摘要统计，包括更改的文件列表以及每个文件增加/删除了多少行。在`git log`中很常见，`git show`也可以使用 |
| `-w` | 忽略空白字符的更改。这样，如果提交只是调整了缩进或空格，diff输出会更清晰，专注于实质内容的修改 |

`--format`常用占位符
- `%H`: 提交完整哈希
- `%h`: 提交简短哈希
- `%an`: 作者名字
- `%ae`: 作者邮箱
- `%ad`: 作者日期（可用 --date=format: 定制）
- `%ar`: 相对作者日期（如 "2 hours ago"
- `%s`: 提交信息主题
- `%b`: 提交信息正文