---
title: WSL
date: 2026-02-26
categories: [Tool]
tags: [WSL]
author: "ljf12825"
type: log
summary: Usage of WSL
---

WSL全称是Windows Subsystem for Linux

WSL可以在Windows里面“原生”运行Linux

## 工作原理

它不是一个虚拟机，也不是一个Cygwin。它是一个更底层、更集成、更高效的解决方案。Linux内核与Windows内核通过一种轻量级的虚拟化技术协同工作，使得Linux系统调用能够被翻译并直接在Windows上执行，从而实现了近乎原生的性能

### WSL 两大版本

| 特性 | WSL1 | WSL2 |
| - | - | - |
| 架构 | 翻译层。将Linux系统调用翻译为Windows内核的系统调用 | 轻量级实用工具。运行在由Hyper-V技术管理的轻量级虚拟机中，包含完整的Linux内核 |
| 文件系统性能 | 在跨操作系统的文件操作中表现较好（例如在Linux中访问`C:\`下的文件） | 在Linux文件系统内部操作中表现极快（例如在Linux `home`目录下进行`git clone`, `npm install`）。跨OS文件操作较慢 |
| 系统调用兼容性 | 有限。并非所有Linux系统调用都被支持，某些应用可能无法运行 | 完全兼容。因为运行在真正的Linux内核上，可以运行绝大多数未修改的Linux应用，如Docker |
| 与Windows的集成 | 无缝。可以直接在Windows的`C:\`路径下访问Linux文件 | 通过 `\\wsl$\`网络路径访问。Linux文件系统作为一个独立的网络位置挂载 |
| 启动时间 | 瞬时 | 极快（虚拟机从休眠状态恢复，通常在几秒内）|
| 运行位置 |与Windows共享同一个内核和文件系统 | 运行在轻量级虚拟机中，拥有自己的内核和完整的文件系统 |

## WSL的局限性和注意事项

1. GUI应用：虽然微软已经支持在WSL2中运行Linux GUI应用（需要安装相应的驱动和组件，且系统为Windows10或11的较新版本），但性能和兼容性仍在不断完善中。对于复杂的3D图形应用，可能不如原生Linux或虚拟机流畅
2. 硬件访问：直接访问硬件（如GPU进行计算、USB设备）在WSL2中曾经是难题。现在，GPU计算(CUDA, OpenCL)和USB设备直通已经得到官方或社区解决方案的支持，但配置过程可能比原生系统复杂一些
3. 文件系统性能的取舍：如果工作流需要频繁地在Windows和Linux文件系统之间移动文件，性能可能是一个需要权衡的因素。最佳实践是：将项目文件放在Linux的`home/`下，并实用VS Code的Remote-WSL打开它
4. 系统资源占用：虽然比传统虚拟机轻量，但WSL2仍然会占用一部分内存。默认情况下，WSL2最多可使用主机总内存的50%或8GB（取较小值）。可以在Windows用户目录下创建一个`.wslconfig`文件来限制WSL2的内存和CPU使用

## 安装

Windows10/11里直接在PowerShell输入

```
wsl --install
```

这个命令会自动

- 启动WSL功能
- 安装WSL2作为默认版本
- 安装一个默认的Linux发行版（通常是Ubuntu）
- 安装Linux内核更新包

重启后，开始菜单中会出现安装的Linux发行版。点击打开，它会继续初始化，并提示创建一个新的用户名和密码（Linux用户名和`sudo`密码）

## 使用

### 基本命令管理

- 列出已安装的发行版：`wsl --list --verbose`或`wsl -l -v`
- 设置默认发行版：`wsl --setdefault <发行版名称>`
- 设置特定发行版的WSL版本：`wsl --set-version <发行版名称> 2`
- 终止所有正在运行的WSL实例：`wsl --shutdown`
- 导出某个发行版为tar文件（用于备份）：`wsl --export <发行版名称> <文件名.tar>`
- 从tar文件导入发行版：`wsl --import <发行版名称> <安装目录> <文件名.tar>`
- 运行特定的发行版：`wsl -d <发行版名称>`

### 打开

打开方式有三种

- 开始菜单搜索 `Ubuntu`
- 在PowerShell里输入 `wsl`
- 在VSCode里安装插件 `WSL`

### 文件系统

WSL有两个文件系统

#### Linux 文件系统（WSL内部）

```text
/
├── bin
├── etc
├── home
├── usr
├── var
└── mnt
```

这部分属于Linux原生文件系统(ext4)

在WSL2里，它实际存储在一个虚拟磁盘文件里`ext4.vhdx`，位置大概在`C:\Users\Yourusername\AppData\Local\Packages\`

#### Windows文件系统（被挂载进来）

在Linux里，`/mnt/c`代表Windows的C盘，例如`/mnt/c/Users`就是Windows用户目录

#### 文件系统桥接原理

WSL2的结构是

```text
Windows
   │
   ├── ext4.vhdx（Linux虚拟磁盘）
   │
   └── drvfs（挂载Windows文件系统）
```

##### Linux -> Windows

通过`/mnt/c`访问Windows文件

##### Windows -> Linux

通过`\\wsl$\Ubuntu\`访问Linux文件

`explorer.exe .`这个命令可以在WSL里打开Windows资源管理器，打开当前目录

#### 性能差异

存放在`/home`中的文件访问速度快，存放在`/mnt/c`中的文件访问速度慢\
因为

- Linux文件系统是ext4（原生）
- Windows文件系统是NTFS
- WSL需要跨文件系统翻译

#### 权限模型

Linux有`rwxr-xr-x`权限体系，Windows有`ACL`权限模型\
当访问`/mnt/c`时

- 权限会被映射
- 可能出现chmod不生效