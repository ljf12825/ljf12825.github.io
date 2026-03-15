---
title: push
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git push
---

`git push`的作用是把本地提交推送到远程仓库，让别人能看到改动
```bash
git push <远程名> <分支名>
```
例如
```bash
git push origin main
```
意为
- 把当前本地`main`分支的提交推送名为`origin`的远程仓库，如果远程也有`main`，就更新它

**注意事项**
- 如果远程分支比你本地新，`push`会被拒绝（避免覆盖别人的提交）
- 解决方式
```bash
git pull --rebase # 先拉取并在新基础上重放你的提交
# 或者
git merge origin/main
```

`push`的原理是把本地提交的对象（commit、tree、blob）上传到远程，更新远程分支指针

**常见参数**
- `git push <remote> <branch>`
将当前分支推送到指定的远程分支
```bash
git push origin main
```

- `--force`或`-f`
强制推送，覆盖远程分支历史，一般用于重写远程分支（例如`git rebase`后）。谨慎使用，可能会覆盖其他人的更改
```bash
git push --force origin main
```

- `--force-with-lease`
强制推送，但会先检查远程分支是否发生了变更，如果变更了就不会覆盖。比`--force`更安全
```bash
git push --force-with-lease origin main
```

- `set-upstream`或`-u`
将本地分支与远程分支关联。首次推送时常使用此参数
```bash
git push --set-upstream origin feature-branch
```

- `--all`
推送所有分支，而不仅仅是当前分支
```bash
git push --all origin
```

- `--tags`
推送所有标签到远程仓库
```bash
git push --tag
```

- `--dry-run`
模拟推送，查看将会推送什么内容，但并不执行推送操作
```bash
git push --dry-run
```