---
title: sudo
type: file
author: ljf12825
date: 2026-05-28
summary: sudo command
---

## 背景

`sudo`是"Super User DO"的缩写；它允许一个普通用户临时以超级用户(root)的身份执行命令，执行完后又立即回到普通用户状态

`sudo`最初是由Bob Coggeshall和Cliff Spencer于1980年在纽约州立大学布法罗分校独立开发，随后作为一个开源项目在社区中不断演进（目前由Todd C.Miller维护）

<https://www.sudo.ws/>

直接以root登录操作非常危险：

- 没有容错机制：`rm -rf/`这种错误操作会被立即执行，系统直接崩溃
- 缺乏审计：无法知道是谁在什么时候做了什么操作，多人管理的服务器上这是灾难
- 权限过大：任何程序漏洞都可能导致系统被完全攻破

`sudo`完美解决了这些问题

- 权限最小化：只在需要时提权，平时是普通用户
- 精细化授权：可以精确到“哪个用户，能在哪台机器上，以谁的身份，执行哪些命令”
- 完整审计：所有`sudo`操作都会被记录到日志中

因为它的安全机制设计的太优秀了，能够完美解决多用户权限管理的痛点，所以各大Linux发行版在打包自己的系统镜像时，主动把`sudo`预装进去。就这样它变成了“默认配置”

## 从源码编译，安装，配置

大多数Linux发行版是自带`sudo`的，但如果是某些最小化版本或者LFS则需要手动安装

$ sudo apt update

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

For security reasons, the password you type will not be visible.

visudo

## 使用

## 机制


