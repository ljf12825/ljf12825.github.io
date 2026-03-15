---
title: linux distributions
date: 2026-01-14
draft: false
summary: debian ubuntu arch
---

# Linux Distribution(distro)
A Linux distro is not just the Linux kernel----itś a complete operation system built on top of the kernel.\
A distro packages the kernel with system tools, desktop environments, libraries, and applications.

Most distributions are derived from the following ¨ancestors¨

| base          | representative distros           | package management | features    |
| ------------- | -------------------------------- | ---------------- | ------------- |
| **Debian**    | Debian, Ubuntu, Linux Mint       | `.deb` (APT)     | 稳定、社区驱动、软件包极多 |
| **Red Hat**   | RHEL, CentOS Stream, Fedora      | `.rpm` (DNF/YUM) | 企业级、服务器常用     |
| **Arch**      | Arch Linux, Manjaro, EndeavourOS | `pacman`         | 滚动更新、极简、自主配置  |
| **Slackware** | Slackware                        | `pkgtool`        | 最古老、极简、几乎无自动化 |
| **Gentoo**    | Gentoo                           | `portage`        | 源码编译、可高度定制    |
| **独立系**       | NixOS, Alpine, Void              | 各自独立             | 特殊理念或轻量化      |


## Linux distro includes
### 1. Core Layer: Linux Kernel
The kernel is the heart of the system. It manages:
- Processes – CPU scheduling and multitasking
- Memory – Allocation and virtual memory
- Hardware – Drivers for GPU, network, storage, etc.
- File systems – Ext4, Btrfs, XFS, etc.

>Kernel versions differ: Debian stable uses LTS kernels, Arch tracks the latest stable kernel.


### 2. GNU Userland Tools
These provide the basic command-line environment:
- Shell:`bash`. `zsh`
- COre commands:`ls`, `cp`. `mv`, `grep`, `find`, `tar`, `sed`, `awk`
- Libraries: GNU C Library(glibc)或musl

### 3. Package Manager
The package Manager is the soul of the distro----it handles software installation, updates, and dependencies
- Debian-based: APT/dpkg(`.deb`)
- Red Hat-based: DNF/YUM(`.rpm`)
- Arch-based: pacman(`.pkg.tar.zst`)
- Gentoo: Portage(source-based)

> It typically connects to software repositories, making it easy to install or update applications.

### 4. Init System
The init system starts system processes and services after boot:
- `systemd`(most modern distros like Ubuntu, Fedora, Arch)
- `SysVinit`(older Debian releases)
- `runit`/`OpenRC`(Void, Alpine, Gentoo options)

### 5. Desktop Environment(optional)
For desktop distro:
- Common DEs: GNOME, KDE Plasma, XFCE, Cinnamon, MATE, LXQt
- Some distros may only include a window manager like i3wm or Openbox
- Server distros often have no GUI, just CLI

### 6. Base Applications
Default applications often include:
- Terminal emulator: `gnome-terminal`, `konsole`, `xterm`
- Text editors: `nano`, `vim`, `gedit`
- File manager: `Nautilus`, `Dolphin`
- Browser:`Firefox`, `Chromium`
- Networking tools: `NetworkManager`, `wget`, `curl`
- Software installer GUI: GNUMO Software, Discover

### 7. System Services / Daemons
Examples:
- Networking: NetworkManager, systemd-networkd
- Printing: CUPS
- Audio: PulseAudio, PipeWire
- Time sync: systemd-timesyncd, ntpd
- Security: SELinux(Fedora/RHEL), AppArmor(Ubuntu)

### 8. Installer & Setup Tools
- Graphical or CLI installers(Ubiquity, Calamares, Anaconada)
- User management utilities
- Partitioning tools(parted, gparted)

### Key Differences Between Distros
1. Package manager & repositories - APT vs pacman vs DNF
2. Default desktop environment - GNOME vs KDE vs XFCE
3. Update strategy - fixed release vs rolling release
4. Stability vs cutting-edge software - Debian Stable vs Arch
5. Security & system libraries - SELinux, AppArmor, musl libc

## Ubuntu 
### 定位与哲学
- 面向大众用户，强调开箱即用
- 有完整的桌面环境(GNOME/KDE），驱动、常用软件、更新机制都预先配置好
- 它的哲学是“让Linux普及化”，哪怕用户完全不懂命令行，也能用

### 安装过程
有图形化安装器（Ubiquity/Subiquity），选语言 -> 分区 -> 用户 -> 安装 -> 完成，适合新手\
装完后就是一个能用的桌面系统，日常办公娱乐都没问题

### 软件包管理
用APT（Advanced Package Tool）管理软件包，基于`.deb`包\
官方仓库很稳定，但软件版本相对较旧（稳定优先）\
也支持Snap、Flatpak等新型打包方式

### 更新机制
有长期支持版（LTS,5年支持）；也有短期版（9个月）\
更新以“稳定”为主，版本更新不快\
适合追求稳定的工作环境

## Arch
### 定位与哲学
- 面向有经验的用户，强调KISS原则（Keep It Simple, Stupid）
- 不预装桌面环境，没有多余的东西，从最小系统开始，让你自己组装成想要的样子
- 哲学是“自由和极简”，一切都让用户自己决定

### 安装过程
完全命令行安装，给你一个shell,剩下的全靠自己：手动分区、挂载、安装引导、安装桌面环境\
安装过程本身就是学习Linux的一种训练

### 软件包管理
用pacman管理软件包，基于`.pkg.tar.zst`包\
官方仓库软件非常新，几乎是“滚动更新”（最新内核、最新桌面环境）\
拥有AUR（Arch User Respository），社区贡献的海量软件脚本，几乎能找到一切

### 更新机制
滚动更新，一直是最新版本，不存在“大版本升级”\
更新速度快，但有时可能会引入不兼容问题\
适合喜欢折腾、保持系统最新的用户
