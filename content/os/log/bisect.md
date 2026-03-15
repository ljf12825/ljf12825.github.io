---
title: bisect
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: usage of git bisect
---

在代码库里某个时间点引入了bug，但不知道是哪一次提交导致的\
只知道：
- 过去某个提交时好的（没有bug）
- 现在最新提交是坏的（有bug）

手动一条条提交去差太慢了。`git bisect`就是用二分查找的思想来快速缩小范围，最后精确定位是哪一次提交引入了问题

## 基本流程
假设在`main`分支上
1. 启动bisect
```bash
git bisect start
```

2. 告诉Git哪个是坏的提交（通常是当前的HEAD）
```bash
git bisect bad
```

3. 告诉Git哪个是好的提交（比如记得某个旧版本能正常工作）
```bash
git bisect good <commit_hash>
```

4. Git会自动checkout到两者之间的一个“中间提交”，让你测试
  - 测试这个版本有没有bug
  - 如果有bug，输入：
    ```bash
    git bisect bad
    ```
  - 如果没有bug，输入：
    ```bash
    git bisect good
    ```
5. Git会继续缩小范围，直到最后定位到“第一个坏提交”
6. 找到后，执行
```bash
git bisect reset
```
回到原来的分支状态

- 如果在测试过程中搞错了，可以使用`git bisect reset`，然后`git bisect start`重新开始；或者使用`git bisect skip`跳过某个无法测试的提交

## 自动化测试
如果有一个脚本可以自动判断“好/坏”，`git bisect`可以全自动完成\
例如有个`test.h`，返回`0`表示好，返回非零表示坏
```bash
git bisect start
git bisect bad
git bisect good <commit_hash>
git bisect run ./test.sh
```
它会自动在中间提交跑脚本，直到定位出问题提交

## 使用场景
- 某个提交引入了崩溃、性能退化、错误行为
- 不知道具体什么时候坏掉的，只能确定一段区间
- 项目提交很多，人工查找非常低效
