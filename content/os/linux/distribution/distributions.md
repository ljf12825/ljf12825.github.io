---
title: Linux Distributions
date: 2026-05-14
author: ljf12825
type: file
summary: Debian, Red Hat, SUSE, Arch, Slackware, Gentoo, NixOS, Alpine, Void
---

Linux 发行版不仅仅是Linux内核，它是一个构建在内核之上的完整操作系统\
发行版将内核与系统工具、桌面环境、库和应用程序打包在一起\
比较活跃的发行版：

- Debian系
  - Debian, Ubuntu, Linux Mint等
  - 包格式为`.deb`
  - 包管理器为`apt`, `dpkg`
  - 生态丰富，大多数商业软件和社区都围绕它
- Rad Hat 系
  - Fedora, REHL, CentOS, Stream, Rocky Linux等
  - 包格式为`.rpm`
  - 包管理器为`dnf`, `yum`
  - 企业级标准，服务器常用
- SUSE 系
  - openSUSE Leap（稳定），openSUSE Tumbleweed（滚动更新版本）
  - 包格式为`.rpm`
  - 包管理器`Zypper`
  - YaST(Yet another Setup Tool)一个全能系统管理工具，德国造
- Arch 系
  - Arch Linux, Manjaro, EndeavoourOS, Garuda Linux, SteamOS
  - 包格式为`.pkg.tar.zst`
  - 包管理器为`pacman`
  - 滚动更新，Arch的软件仓库AUR几乎包含所有软件
- 其他
  - Slackware
    - 包格式为`.txz`
    - 包管理器为`slackpkg`
    - 没有现代发行版的复杂抽象（比如`systemd`），只做基础整合，极简，需要手动处理链接
  - Gentoo
    - 包单元为`Ebuild`，是无数以`.ebuild`结尾的Bash脚本组成的目录树，包含源码地址，依赖清单，编译流程和USE Flag逻辑
    - 包管理器`Portage` 管理编译流程，进行USE Flag（功能裁剪），对当前CPU架构进行精准定制
    - 所有软件都在本地机器上及时编译生成，通常花费很长时间
  - NixOS
    - 把软件看作数学函数的输出，采用声明式配置，在`/etc/nixos/configuration.nix`中写下最终状态来配置系统，每次修改配置都会生成一个新的系统`Generation`
    - 如果某个`Generation`崩溃，重启时在引导菜单选前一个`Generation`，系统会物理级恢复到完全正常时刻
    - 它使用自己的一套Nix语言，且文件系统布局奇怪，所有的包都在`/nix/store/` 下，不再遵循传统的FHS目录规范
  - Alpine
    - Alpine最初是为路由器设计的，现在常用于Docker容器中
    - 极度轻量，使用极度精简的`musl`取代了`glibc`，也没有完整的GNU工具链，而是由`BusyBox`代替
    - 可以完全加载到内存中运行，磁盘占用极小，基础镜像仅占5MB
  - Void
    - 由NetBSD创立者维护，试图在保持简单和现代滚动更新之间找到完美平衡
    - 包管理器为`XBPS`，是一个完全从零编写的、极速的包管理器
    - 使用`runit` 替代 `systemd`
    - 原生支持 `musl` 和 `glibc`，可供选择 

综上所属，不同Linux发行版的差异体现在

- Stack Composition
  - C Standard Lib
  - Init System
  - compiler and build system
- Lifecycle Logic
  - Rolling Release
  - Fixed/Stable
  - Atomic/Declarative
- Package Philosophy
  - Pre-compiled
  - Source-based
  - Functional
- Ecosystem
  - Community Repository
  - Community Documents

## Linux distro includes

### 1. Core Layer: Linux Kernel

The kernel is the heart of the system. It manages:
- Processes – CPU scheduling and multitasking
- Memory – Allocation and virtual memory
- Hardware – Drivers for GPU, network, storage, etc.
- File systems – Ext4, Btrfs, XFS, etc.

> Kernel versions differ: Debian stable uses LTS kernels, Arch tracks the latest stable kernel.

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

## Debian

## Ubuntu

## Arch
