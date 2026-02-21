---
title: Submodule
date: 2025-12-31
categories: [Git]
tags: [Mechanism, Command, Porcelain]
author: "ljf12825"
type: log
summary: Git Submodule
---

`git submodule`是Git提供的一种机制，用来在一个Git仓库中嵌套另一个Git仓库\
可以理解为：
- 主仓库（superproject）像是“容器”
- 子模块（submodule）是“指针”，指向某个外部仓库的某个提交（commit）

这非常适合管理依赖库、插件、公共组件等，因为它能让你把一个外部项目直接纳入你的项目里，但又保持它独立管理

适用场景举例：
- 在开发游戏项目，用到一个公共UI框架（仓库A）
- 希望这个UI框架独立管理，但又能被多个项目引用
- 如果直接复制粘贴代码，将来UI框架升级就很麻烦
- 用Submodule就可以做到：
  - 你的游戏仓库只存一个“指针”指向UI框架某个版本
  - UI框架更新后，可以选择`git submodule update`或手动切换分支来升级

## 基本操作
**添加子模块**
```bash
git submodule add <仓库地址> <路径>
```
示例
```bash
git submodule add https://github.com/username/libfoo extern/libfoo
```
这会在`extern/libfoo`文件夹下放入`libfoo`仓库

**克隆包含子模块的仓库**\
直接`git clone`主仓库时，子模块目录是空的
需要执行
```bash
git submodule update --init --recursive
```
这样才能把子模块拉取下来
> `--recursive`的作用是：如果子模块里还有自模块，也一并初始化

**更新子模块**\
拉取主仓库后，子模块可能停在某个commit。要更新到子模块仓库的最新提交，可以：
```bash
git submodule update --remote
```
或者进入子模块目录手动
```bash
cd extern/libfoo
git checkout main
git pull
```
更新后要回到主仓库提交一次，因为主仓库记录的只是子模块的commit指针

**删除子模块**\
删除比较繁琐，需要
```bash
git submodule deinit -f <路径>
rm -rf .git/modules/<路径>
git rm -f <路径>
```

## 注意事项
- 子模块不是自动更新的
`git pull`主仓库不会自动更新子模块，需要显式执行`git submodule update`
- 主仓库只记录commit，不记录分支
所以多人协作时，经常会有人忘记了更新子模块，导致版本不一致
- 建议写脚本/Makefile
比如`setup.sh`里写好
```bash
git submodule update --init --recursive
```
让团队一键拉取依赖
- 提交分离头状态（Detached HEAD）：子模块默认不处在任何分支上，而是处于一个“分离头指针”状态，指向某个具体的提交。这意味着如果在子模块内直接修改代码并提交，很容易丢失这些提交，正确的做法是先创建并切换到一个分支

## 替代方案
Submodule用得不好会很麻烦，常见的替代方案
- Git Subtree：把外部仓库直接合并进来，历史保留，但依赖更新不如submodule灵活
- 包管理器（Unity的UPM、C++的vcpkg、C#的NuGet）：更现代化，自动化程度更高