---
title: update-index
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: blog
summary: git update-index
---

`git update-index`主要用于操作索引（暂存区），将工作区中的文件内容注册到索引中，通常用在一些特定的而场合，比如修改文件的权限、将文件标记为假定未更改，或者手动将文件添加到暂存区

## 常见用法
1. 将文件添加到暂存区
如果向手动将文件添加到暂存区，虽然通常情况下使用`git add`来添加，但也可以使用`git update-index`
```bash
git update-index --add <file>
```

2. 标记文件为假定未更改（assume unchanged）
如果文件的内容发生了变化，但暂时不想Git跟踪这些变化（例如为了提高性能），可以使用
```bash
git update-index --assume-unchanged <file>
```
这条命令告诉Git临时“忽略”该文件的变化，知道明确告知它重新跟踪该文件的变化

3. 取消“假定未更改”状态
如果之前让Git假定某个文件没有更改，而现在希望Git开始跟踪该文件的变化，可以使用
```bash
git update-index --no-assume-unchanged <file>
```

4. 改变文件权限
Git默认只跟踪文件内容，不跟踪文件权限的变化。但可以强制Git注意到权限的变化
```bash
git update-index --chmod=+x <file> # 使文件变为可执行
git update-index --chmod=-x <file> # 移除可执行权限
```

5. 从暂存区移除文件
如果想从将文件从暂存区移除（但不删除工作区的文件）
```bash
git update -index --remove <file>
```

6. 更新文件内容（强制提交，而不修改）
在一些特殊情况下，可能想手动标记一个文件为已暂存，即使它的内容没有被修改
```bash
git update-index --replace <file>
```

7. 强制添加被忽略的文件
```bash
# 强制添加被.gitignore忽略的文件
git update-index --add --force ignored_file
```

8. 跳过工作树
```bash
# 标记文件为跳过工作树检查（比assume-unchanged更强）
git update-index --skip-worktree config.local

# 取消标记
git update-index --no-skip-worktree config.local
```

## `--assume-unchanged` vs `--skip-worktree`

| 特性 | `assume-unchanged` | `--skip-worktree` |
| - | - | - |
| 目的 | 性能优化 | 配置文件个性化 |
| Git操作 | 可能被覆盖 | 更安全 |
| 合并 | 可能被覆盖 | 保持本地修改 |
| 典型用途 | 大文件、频繁更新的文件 | 本地配置文件 |

## 注意事项
1. 底层命令：`update-index`是管道（plumbing）命令，日常使用高级命令更安全
2. 谨慎使用：错误使用可能导致索引损坏
3. 不是忽略机制：`-assume-unchanged`不是忽略文件的正确方式，应使用`.gitignore`
4. 临时方案：`skip-worktree`和`assume-unchanged`都是临时方案，不适合长期使用

## 常见问题解决
```bash
# 如果索引损坏，可以重建
rm .git/index
git reset

# 重置所有 assume-unchanged 标记
git update-index --really-refresh
```