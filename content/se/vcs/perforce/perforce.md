---
title: Perforce
author: ljf12825
date: 2026-04-29
type: file
summary: overview of perforce
---

Perforce，现在通常指的是 Helix Core，即 Perforce Software 提供的核心工具，是一款企业级版本控制系统 (VCS)。它专为大型团队、大型文件和高性能而设计\
它采用集中式架构；所有数据都驻留在服务器上，开发人员仅在自己的工作区内工作\
Perforce 对大型文件有着非常强大的支持，因此特别适合：

- 游戏开发
- 美术资源
- 二进制文件

### 功能

#### 文件锁定

Perforce 支持检出锁定，这意味着一次只能由一个人修改文件，从而避免冲突。

#### 性能

Perforce 在处理 TB 级代码库、数千人的团队以及单个代码库中数十万个文件方面表现出色。

### 核心概念

- depot（仓库），类似于 Git 仓库
- workspace，本地映射
- changelist（变更集），提交前添加到变更列表中
- sync：从服务器拉取文件，类似于 `git pull`，但粒度更细
- submit：向服务器提交更改，类似于 `git push`

### 缺点

- 付费服务
- 分支操作不如 Git 灵活
- 离线功能较弱
