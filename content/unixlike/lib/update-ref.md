---
title: update-ref
date: 2025-12-31
categories: [Git]
tags: [Command, Plumbing]
author: "ljf12825"
type: blog
summary: git update-ref
---

`git update-ref`用于直接创建、更新和删除Git引用（ref）。引用是指向Git提交对象（或其他对象）的指针，例如
- 分支：`ref/heads/main`
- 标签：`refs/tags/v1.0`
- HEAD：特殊的引用，指向当前检出的提交或分支

## 基本语法
```bash
git update-ref [option] <ref-name> <new-value> [<old-value>] [--] [<message>]
```

## 使用示例
1. 移动分支指针（类似`reset`）
```bash 
# 将 main 分支指向某个提交
git update-ref refs/heads/main a1b2c3d

# 等同于 git reset --hard a1b2c3d，但不影响工作目录
```

2. 安全地更新引用（使用旧值验证）
```bash 
# 只有当 main 当前指向 old-commit 时，才更新为 new-commit 
git update-ref refs/heads/main new-commit old-commit 
```
这在并发环境中很有用，确保没有其他人同时修改了引用

3. 创建新分支
```bash 
# 创建一个指向特定提交的新分支
git update-ref refs/heads/new-feature abc1234

# 等同于 git branch new-feature abc1234 
```

4. 删除引用
```bash 
# 删除分支
git update-ref -d refs/heads/old-branch 

# 删除标签
git update-ref -d refs/tags/v1.0-rc 
```

5. 更新HEAD 
```bash 
# 将 HEAD 直接指向一个提交（进入分离头状态）
git update-ref HEAD abc1234

# 将 HEAD 指向一个分支
git update-ref HEAD refs/heads/main 
```

6. 从标准输入批量更新
```bash 
# 格式：<新值> SP <引用> LF 
# 可以原子性地更新多个引用（要么全成功，要么全失败）
echo "a1b2c3d refs/heads/branch1" | git update-ref --stdin 
echo "d4e5f678 refs/heads/branch2" | git update-ref --stdin 

# 或一次更新多个
cat <<EOF | git update-ref --stdin 
a1b2c3d refs/heads/main 
b2c3d4e refs/heads/develop 
EOF 
```

7. 添加更新日志
```bash 
git update-ref -m "reset: 回滚到稳定版本" refs/heads/main abc123 
```
Git会在reflog中记录这个操作
