---
title: rebase
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git rebase
---

`git rebase`是Git中用于重新整理提交历史的命令。它可以将一个分支的提交“移动”到另一个分支的最新提交之后，从而创建更线性的项目历史

现在的历史

```text
A---B---C---D   main
         \
          E---F   feature
```

你在`feature`，`main`已经多了`D`

使用rebase

```bash
git checkout feature
git rebase main
```

Git会做

1. 把`E` `F`暂存起来
2. 把分支移到`D`
3. 再把`E` `F`一个个“重放”上去

结果

```text
A---B---C---D---E'---F' feature
```

- `E'` `F'`不是原来的E F
- 它们是“复制品”(commit hash全变)

## `merge` vs `rebase`

| 维度 | merge | rebase |
| - | - | - |
| 历史 | 保留分叉 | 拉直 |
| 提交 | 多一个merge commit | 没有额外提交 |
| 干净度 | 容易乱 | 非常干净 |
| 是否改历史 | NO | YES |
| 团队推荐 | 适合公共分支 | 适合个人分支 |

## 同步主分支（替代pull）

```bash
git pull --rebase
```

等价于

```bash
git fetch
git rebase origin/main
```

- 保证本地提交在最前面
- 不制造merge垃圾提交

## 交互式rebase

清理提交历史

```bash
git rebase -i HEAD~5
```

可以看到

```text
pick a1 Fix typo
pick b2 Add log
pick c3 debug print
pick d4 final logic
pick e5 wip
```

可以改成

```text
pick a1 Fix typo
squash b2 Add log
squash c3 debug print
pick d4 final logic
drop e5 wip
```

| 命令 | 含义 |
| - | - |
| pick | 保留（默认） |
| squash | 合并到上一个 |
| drop | 删除 |
| reword | 改提交信息 |
| edit | 中途暂停修改 |
| fixup | 类似squash,但丢弃提交信息 |

## 修改上次commit

```bash
git commit --amend
```

底层就是rebase 1个提交

## 移动某段提交到别的基点

```bash
git rebase --onto new_base old_base feature
```

## 拆分一个提交

```bash
git rebase -i HEAD~3
# 把某个 pick 改成 edit
```

然后

```bash
git reset HEAD^
git add ...
git commit
git add ...
git commit 
git rebase --continue
```

## 处理冲突

rebase本质是

```text
apply commit1
apply commit2
apply commit3
```

每一步都有可能冲突\
Git会暂停在冲突的提交

会看到

```bash
CONFLICT (content)
```

处理流程

```bash
# 1. 手动解决冲突
git add .

# 2. 继续
git rebase --continue

# 放弃
git rebase --abort
```

## 选项

- `--onto`：将分支移动到新基础

```bash
# 将 feature 分支移动到 new-base
git rebaes --onto new-base old-base feature
```

- `--continue`：继续变基

解决冲突后

```bash
git add .
git rebase --continue
```

- `--abort`：中止变基
- `skip`：跳过提交



## 注意事项

可以对本地分支、未推送的提交进行变基\
不要rebase已经推送到公共分支的提交

变基会重写提交历史，导致其他协作者的本地副本与远程不同步

示例

1. 你push了

```text
A --- B --- C (origin/main)
```

2. 别人pull了

```text
A --- B --- C （别人的本地main）
```

3. 你又在`main`上做了

```bash
git rebase -i HEAD~2
# 改了 B, C
git push --force
```

现在远端变成

```text
A --- B' --- C'
```

而别人手里的还是

```text
A --- B --- C
```

这时别人再push/pull, Git会看到你的历史和远端历史完全不一样，谁也不是谁的祖先

然后要么

- 产生一堆冲突
- 要么让别人强制reset
- 要么历史变成两条平行时间线

## 示例1：简单的变基更新

```bash
# 在 feature 分支上
git fetch origin
git rebase origin/main

# 如果有冲突，解决后
git add .
git rebase --continue

# 强制推送到远程（因为历史已改变）
git push --force-with-lease # 只有远端没被别人更新时才覆盖
```

## 示例2：整理提交历史

```bash
# 1. 查看最近提交
git log --oneline -5

# 2. 交互式变基整理
git rebase -i HEAD~5

# 3. 在编辑器中
# - 将某些提交改为squash 合并
# - 修改提交顺序
# - 编辑提交信息

# 4. 完成整理
```
