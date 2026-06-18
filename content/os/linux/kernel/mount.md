---
title: mount
author: ljf12825
date: 2026-06-18
type: file
summary: Overview of mount
---

## mount
Linux的目录树只是一个逻辑结构，它与物理存储设备（硬盘、分区、U盘、光盘）是解耦的
- Windows的思路：`C:\`, `D:\`, `E:\`这些盘符直接代表一块物理存储设备或分区。设备和逻辑视图是强绑定的
- Linux的思路：只有一个`/`根。所有的物理存储设备都需要手动地、有组织地“映射”或“注入”到这棵单一的树中。这个“映射”的动作，就是挂载

**官方定义：** 挂载是指将一个存储设备（如硬盘分区）上的文件系统，关联到Linux目录树中的一个特定目录（称为挂载点，Mount Point）的过程\
一旦挂载成功，对该挂载点目录的任何访问操作，都将被透明地重定向到该存储设备上的文件系统

### 挂载的意义
1. 统一的视图：对用户和程序来说，无需关心文件具体在哪个物理设备上。它们只需要遵循统一的目录树结构即可找到所有文件。`/home/alice/Documents`可能在一个独立的SSD上，而`/var/log`可能在另一块老硬盘上，但用户完全无感
2. 极致的灵活性：
  - 可以把任何目录作为挂载点。常见的如`/home`, `/var`, `/opt`
  - 可以根据需求动态调整存储。如果`/home`空间不足，可以买块新硬盘，格式化后直接挂载到`/home`，空间就扩容了，无需移动任何用户数据
  - 可以把远程网络存储（NFS, Samba）挂载到本地目录，像使用本地磁盘一样使用它

### 命令`mount` & `umount`
#### mount
基本语法：`mount [选项] <设备源> <挂载点>`
- 设备源：可以是设备文件（如`/dev/sdb1`），也可以是网络路径（如`server:/share`），甚至是一个镜像文件（使用`-o loop`选项）
- 挂载点：必须是一个已经存在的目录

##### 示例
1. 挂载U盘（通常系统会自动完成，手动演示如下）
```bash
## 首先，创建挂载点目录
sudo mkdir /mkt/my_usb

# 然后，挂载设备（假设U盘被识别为 /dev/sdc1)
sudo mount /dev/sdc1 /mnt/my_usb

# 现在，可以通过 /mnt/my_usb 访问U盘内容
ls /mnt/my_usb
```

2. 挂载光盘
```bash
sudo mount /dev/cdrom /media/cdrom
```

3. 挂载一个镜像文件
```bash
sudo mount -o loop ubuntu-22.04.iso /mnt/iso
```

#### umount
卸载是为了确保所有数据都已写入设备，保证数据安全。直到拔掉设备可能导致数据损坏\
语法：`umount <挂载点或设备源>`
```bash
# 通过挂载点卸载
sudo umount /mnt/my_usb

# 或者通过设备源卸载
sudo umount /dev/sdc1
```
如果遇到`device is busy`报错，表示有进程正在使用挂载点下的文件。需要退出所有在该目录下的终端和程序，或用`lsof /mnt/my_sub`命令查看并结束相关进程

### 自动挂载：/etc/fstab文件
每次开机都手动挂载非常麻烦。`/etc/fstab`（file systems table）文件就是用来配置启动时挂载的\
它的每一行定义了一个需要挂载的文件系统，包含六个字段
```text
<设备源> <挂载点> <文件系统类型> <挂载选项> <dump备份标志> <fsck检查顺序>
```
示例
```bash
# 将 /dev/sdb1 在启动时自动挂载到 /data 目录，使用 ext4 文件系统，默认选项
UUID=1234-abcd-5678 /data ext4 defaults 0 2
```

### 临时文件系统（tmpfs）的挂载
挂载的概念不仅用于物理设备，还可以用于内存
```bash
# 将一部分内存挂载到 /tmp目录，提高临时文件读写速度
sudo mount -t tmpfs -o size=512M tmpfs /tmp
```
这样，所有写入`/tmp`的文件实际上都写在内存里，速度极快，但重启后消失

