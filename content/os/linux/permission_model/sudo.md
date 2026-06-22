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

`visudo`是Linux系统中专门用来编辑和配置`sudo`权限白名单（即`/etc/sudoer` 文件）的专用安全命令\
绝对不要直接用文本编辑器修改这个文件，一旦写错语法，整个`sudo`服务可能瘫痪，永远无法提权\
`visudo`这个命令会在保存前做语法检查，防止低级错误；并在编辑时锁定文件，防止多个管理员同时修改该文件造成冲突

```txt
## sudoers file.
##
## This file MUST be edited with the 'visudo' command as root.
## Failure to use 'visudo' may result in syntax or file permission errors
## that prevent sudo from running.
##
## See the sudoers man page for the details on how to write a sudoers file.
##

##
## Host alias specification
##
## Groups of machines. These may include host names (optionally with wildcards),
## IP addresses, network numbers or netgroups.
# Host_Alias	WEBSERVERS = www1, www2, www3

##
## User alias specification
##
## Groups of users.  These may consist of user names, uids, Unix groups,
## or netgroups.
# User_Alias	ADMINS = millert, dowdy, mikef

##
## Cmnd alias specification
##
## Groups of commands.  Often used to group related commands together.
# Cmnd_Alias	PROCESSES = /usr/bin/nice, /bin/kill, /usr/bin/renice, \
# 			    /usr/bin/pkill, /usr/bin/top
#
# Cmnd_Alias	REBOOT = /sbin/halt, /sbin/reboot, /sbin/poweroff
#
# Cmnd_Alias	DEBUGGERS = /usr/bin/gdb, /usr/bin/lldb, /usr/bin/strace, \
# 			    /usr/bin/truss, /usr/bin/bpftrace, \
# 			    /usr/bin/dtrace, /usr/bin/dtruss
#
# Cmnd_Alias	PKGMAN = /usr/bin/apt, /usr/bin/dpkg, /usr/bin/rpm, \
# 			 /usr/bin/yum, /usr/bin/dnf,  /usr/bin/zypper, \
# 			 /usr/bin/pacman

##
## Defaults specification
##
## Preserve editor environment variables for visudo.
## To preserve these for all commands, remove the "!visudo" qualifier.
Defaults!/usr/sbin/visudo env_keep += "SUDO_EDITOR EDITOR VISUAL"
##
## Use a hard-coded PATH instead of the user's to find commands.
## This also helps prevent poorly written scripts from running
## arbitrary commands under sudo.
Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
##
## You may wish to keep some of the following environment variables
## when running commands via sudo.
##
## Locale settings
# Defaults env_keep += "LANG LANGUAGE LINGUAS LC_* _XKB_CHARSET"
##
## Run X applications through sudo; HOME is used to find the
## .Xauthority file.  Note that other programs use HOME to find   
## configuration files and this may lead to privilege escalation!
# Defaults env_keep += "HOME"
##
## X11 resource path settings
# Defaults env_keep += "XAPPLRESDIR XFILESEARCHPATH XUSERFILESEARCHPATH"
##
## Desktop path settings
# Defaults env_keep += "QTDIR KDEDIR"
##
## Allow sudo-run commands to inherit the callers' ConsoleKit session
# Defaults env_keep += "XDG_SESSION_COOKIE"
##
## Uncomment to enable special input methods.  Care should be taken as
## this may allow users to subvert the command being run via sudo.
# Defaults env_keep += "XMODIFIERS GTK_IM_MODULE QT_IM_MODULE QT_IM_SWITCHER"
##
## Uncomment to disable "use_pty" when running commands as root.
## Commands run as non-root users will run in a pseudo-terminal,
## not the user's own terminal, to prevent command injection.
# Defaults>root !use_pty
##
## Uncomment to run commands in the background by default.
## This can be used to prevent sudo from consuming user input while
## a non-interactive command runs if "use_pty" or I/O logging are
## enabled.  Some commands may not run properly in the background.
# Defaults exec_background
##
## Uncomment to send mail if the user does not enter the correct password.
# Defaults mail_badpass
##
## Uncomment to enable logging of a command's output, except for
## sudoreplay and reboot.  Use sudoreplay to play back logged sessions.
## Sudo will create up to 2,176,782,336 I/O logs before recycling them.
## Set maxseq to a smaller number if you don't have unlimited disk space.
# Defaults log_output
# Defaults!/usr/bin/sudoreplay !log_output
# Defaults!/usr/local/bin/sudoreplay !log_output
# Defaults!REBOOT !log_output
# Defaults maxseq = 1000
##
## Uncomment to disable intercept and log_subcmds for debuggers and
## tracers.  Otherwise, anything that uses ptrace(2) will be unable
## to run under sudo if intercept_type is set to "trace".
# Defaults!DEBUGGERS !intercept, !log_subcmds
##
## Uncomment to disable intercept and log_subcmds for package managers.
## Some package scripts run a huge number of commands, which is made
## slower by these options and also can clutter up the logs.
# Defaults!PKGMAN !intercept, !log_subcmds
##
## Uncomment to disable PAM silent mode.  Otherwise messages by PAM
## modules such as pam_faillock will not be printed.
# Defaults !pam_silent

##
## Runas alias specification
##

##
## User privilege specification
##
root ALL=(ALL:ALL) ALL

## Uncomment to allow members of group wheel to execute any command
# %wheel ALL=(ALL:ALL) ALL

## Same thing without a password
# %wheel ALL=(ALL:ALL) NOPASSWD: ALL

## Uncomment to allow members of group sudo to execute any command
# %sudo ALL=(ALL:ALL) ALL

## Uncomment to allow any user to run sudo if they know the password
## of the user they are running the command as (root by default).
# Defaults targetpw  # Ask for the password of the target user
# ALL ALL=(ALL:ALL) ALL  # WARNING: only use this together with 'Defaults targetpw'

## Read drop-in files from /etc/sudoers.d
@includedir /etc/sudoers.d
```

### log

## 使用

## 机制


