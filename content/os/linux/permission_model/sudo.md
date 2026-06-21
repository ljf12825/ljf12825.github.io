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

大多数Linux发行版内置`sudo`，但如果是某些最小化版本或者LFS则需要手动安装\
该部分内容是从源码进行编译和安装的步骤\

`sudo`是典型的Autotools构建系统

进入`sudo`的源码根路径下，需要先配置编译参数，并生成Makefile。为了保证`sudo`的正常运行，建议指定一些标准的系统路径

```bash
./configure --prefix=/usr \
            --libexecdir=/usr/lib \
            --with-secure-path \
            --sysconfdir=/etc
```

- `--prefix=/usr`：确保sudo安装到系统的标准二进制目录(`/usr/bin`)，而不是默认的`usr/local`
- `--sysconfdir=/etc`：确保其配置文件放在`/etc/sudoers`
- `--with-secure-path`：当`secure_path`为`no`时，用户在使用`sudo`执行命令时，会直接继承

然后编译并安装

通过`make install`安装的`sudo`二进制文件，可能并没有被正确赋予SUID权限以及root所有权，普通用户运行`sudo`时会直接报错：`sudo: must be setuid root`
在root身份下执行以下两条命令修复权限

```bash
# 确保 sudo 的所有者和所属组都是 root
chown root:root /usr/bin/sudo

# 赋予 SUID 权限（让普通用户执行它时，能临时获得 root 身份）
chmod 4755 /usr/bin/sudo
```

但现代版本的`sudo`会在configure时自动修复SUID权限

```bash
/bin/bash ../scripts/install-sh -c -o 0 -g 0 -m 04755 .libs/sudo /usr/bin/sudo
```

`-m 04755`说明安装脚本在把`sudo`复制到`usr/bin`的同时，自己已自动赋予了他核心的SUID权限，且所有者改为了root(`-o 0 -g 0`)

当第一次使用sudo时，会弹出以下内容

```txt
We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

For security reasons, the password you type will not be visible.
```

如果弹出类似的错误

```txt
username is not in the suders file. This incident will be reported.
```

说明虽然装好了`sudo`，但没有把普通用户`username`加入允许提权的“白名单”中

切换回root用户，在root执行

```bash
visudo
```

在打开的文件中找到
```txt
root    ALL=(ALL:ALL) ALL
```

在这行下面添加

```txt
username    ALL=(ALL:ALL) ALL
```

保存并退出即可

安装配置后可以使用

```bash
sudo whoami
```

进行测试，如果输出`root`，则说明配置成功

### `/etc/sudoers`

`visudo`是Linux系统中专门用来编辑和配置`sudo`权限白名单（即

## 使用

## 机制


