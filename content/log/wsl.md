---
title: WSL
date: 2026-04-09
categories: [Tool]
tags: [WSL]
author: "ljf12825"
type: log
summary: Usage of WSL
---

[WSL](https://learn.microsoft.com/en-us/windows/wsl/)全称是Windows Subsystem for Linux

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

### 通过`wsl --install`

这是最简单的方法

Windows10/11里直接在PowerShell输入

```
wsl --install
```

这个命令会自动

- 启动WSL功能
- 安装WSL2作为默认版本
- 安装一个默认的Linux发行版（通常是Ubuntu）
- 安装Linux内核更新包
- 默认安装到C盘

本质就是从Microsoft Store里下载安装

重启后，开始菜单中会出现安装的Linux发行版。点击打开，它会继续初始化，并提示创建一个新的用户名和密码（Linux用户名和`sudo`密码）

### 通过`wsl --import`

`wsl --import`命令用于将之前导出的WSL发行版`.tar`备份文件恢复为可用的WSL实例

#### 基本语法

```bash
wsl --import <发行版名称> <安装位置路径> <备份文件路径.tar> [--version 1|2]
```

| 参数 | 说明 | 示例 |
| - | - | - |
| `<发行版名称>` | 在`wsl -l -v`列表中显示的自定义名字 | `Ubuntu-Backup` |
| `<安装位置>` | 虚拟硬盘`ext4.vhdx`存放的文件夹路径 | `D:\WSL\Ubuntu-Backup\` |
| `<备份文件路径>` | 之前用`wsl --export`生成的`.tar`文件 | `C:\backup\ubuntu.tar` |
| `--version 2` | （可选）指定使用WSL 2内核，默认一般是WSL2 | `--version 2` |

#### 使用示例

##### 1. 基本导入（恢复备份）

将之前导出的`ubuntu_backup.tar`恢复，并命名为`Ubuntu-20.04-Restored`，数据存放在`D:\WSL`下

```bash
wsl --import Ubuntu-20.04-Restored D:\WSL\Ubuntu-Restored D:\Backups\ubuntu_backup.tar
```

##### 2. 强制指定为WSL 2版本

如果当前默认版本是WSL 1，或者为了保险起见，加上版本参数

```bash
wsl --import MyNewDistro D:\WSL\MyNewDistro D:\Backups\export.tar --version 2
```

##### 3. 导入Docker Desktop导出的镜像

WSL2的Docker数据也可以这样备份迁移

```bash
wsl --import docker-date D:\WSL\docker-date D:\Backups\docker-desktop-data.tar
```

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

## 迁移

如果是在微软应用商店安装的wsl（包括`wsl --install`，本质相同），那么WSL会被默认安装在C盘下\
这会导致C盘的大量空间被WSL占用，所以迁移是很有必要的

WSL实际是一个Linux文件系统，在Windows里是一个名为`ext4.vhdx`的虚拟磁盘文件，默认路径在`C:\Users\用户名\AppData\Local\Packages\...`

### 迁移步骤

#### 1. 查看发行版本

```bash
wsl -l -v
```

```
Ubuntu # 以Ubuntu为例
```

#### 2. 导出

```bash
wsl --export Ubuntu D:\wsl\ubuntu.tar
```

> 需要手动创建文件夹，--export不会帮助处理

这一步会生成一个tar包（系统镜像）

#### 3. 注销原来的

```bash
wsl --unregister Ubuntu
```

#### 4. 导入到D盘

```bash
wsl --import Ubuntu D:\wsl\ubuntu D:\wsl\ubuntu.tar
```

vhdx就在新位置了

#### 5. 启动

```bash
wsl
```

### 常见问题

导出后可能会遇到默认用户变为root的问题\
实测wsl2 ubuntu保留了原先用户名

如果碰到了这个问题

```bash
ubuntu config --default-user your_username
```

或

```bash
wsl -d Ubuntu -u your_username
```
