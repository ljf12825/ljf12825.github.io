---
title: cherry-pick
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: git cherry-pick
---

`git cherry-pick`的作用：把某个分支上的一个或多个提交（commit），复制到当前分支上\
它不会合并整个分支，只是“挑选”你需要的那几颗“樱桃”（commit）

比方说：
- 在`feature`分支上修了一个bug
- 但是`main`分支现在也需要这个修复
- 不想整个`feature`分支都合并过去（里面有很多未完成的功能）
- 可以用
```bash
git checkout main
git cherry-pick <commit-hash>
```
这样只把那次修复搬过来

## 基本用法
挑选单个提交
```bash
git cherry-pick <commit-hash>
```

挑选多个提交
```bash
git cherry-pick <hash1> <hash2> <hash3>
```

挑选一段提交（连续的）
```bash
git cherry-pick <hashA>^..<hashB>
```
注意`^`，表示包含`<hashA>`本身

## 常见选项
- `-x`
在commit message里自动加一句"cherry picked form commit ..."，方便追踪
```bash
git cherry-pick -x <hash>
```

- `-e`
编辑提交说明

- `n/ --no-commit`
应用更改但不提交，允许修改后再`git commit`

- `-m`
用于cherry-pick合并提交（merge commit），要指定保留哪个parent

## 可能遇到的问题
**冲突**\
如果cherry-pick的提交和当前分支代码冲突，会进入冲突解决状态
```bash
git status # 查看冲突文件
# 手动修改
git add <文件>
git cherry-pick --coutinue
```
如果不想继续
```bash
git cherry-pick --abort
```
