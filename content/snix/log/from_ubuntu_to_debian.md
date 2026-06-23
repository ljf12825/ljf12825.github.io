---
title: "From Ubuntu to Debian ? Ultimate control : Ultimate simplicity"
author: ljf12825
date: 2026-05-26
tags: [Linux, Ubuntu, Debian]
categories: [Recording]
type: log
summary: A record of the transition from Ubuntu to Debian
---

## 从 Windows 到 Ubuntu

我本想把这部分写成"From Windows to Ubuntu"的一篇独立文章的，但是因为时间有点久远，而且Ubuntu的安装过程比较傻瓜，唯一值得注意的是分区问题，网上有很多教程。所以我把从 Windows 到 Ubuntu 写在这篇文章的开头，也算是作为一个系列存在

2025年9月左右，我在笔记本上安装了Ubuntu与Windows双系统。初衷是因为觉得Windows很难用，包括但不限于更新策略，资源占用和几乎与外界生态绝缘等原因；还有一点就是微软对Windows10的支持将停止于2025年10月，之前Windows11最早推出Preview的时候我就升级并使用过一段时间（至今感到后悔），发现Windows11的任务栏只能在屏幕最下方，正式版也是这样，我便退回Windows10。我想起了Ubuntu，上次接触Ubuntu还是在大学操作系统课，在VMWare中的Ubuntu。我便给硬盘额外分出了一个区域作为`/`。没想到安装到裸机上的Ubuntu比在VMWare中的好用太多了，甚至感觉上是两个系统。

在Ubuntu的使用过程中，我逐渐被GNU Linux的哲学影响，意识到GNOME华丽的外表下是怎样一套高效朴实的系统，我便开始拆Ubuntu，从Ubuntu Server 到 Snap 再到DE, DM, 换上i3wm, alacritty, tmux, i3这些简洁高效的工具，趋近最小可用的Linux。在这个过程中，我认识到我可以清楚地掌握和控制我内存和硬盘的每一个bit。在某个内核版本下，我的Ubuntu开机内存占用只有大约900MB左右

## 从 Ubuntu 到 Debian

受到GNU, Linux哲学的持续影响，我开始频繁了解到各种Linux发行版，也一直在追寻最小可用Linux，想知道什么是Linux\
Ubuntu对我来说是Linux世界的很好的入门路径，在这个对新手友好的环境下，我熟悉了基本命令，发行版的组成部分，包管理器，Linux与闭源软件的冲突，Linux上的工具链，GNU套件，glibc，grub，文件系统，权限，Linux的大致结构等，于是决定从Ubuntu毕业

我亲手拆了Ubuntu，但一直觉得拆的不干净，我对我的硬盘，我的内存里有什么，后台在跑什么，仍然保持怀疑。这就像给充满油污的厨房做完卫生，擦的再干净，心里也知道许多犄角旮旯里仍藏着很多陈年老灰和顽固油污\
其次，我不想被一个发行版的生态限制，希望跳出单一发行版去观测整个Linux世界

我选择Debian有以下几个理由

1. Ubuntu属Debian系，它们的环境80%相似，迁移成本较低
2. Debian是众多服务器的选择，更新较慢较稳定
3. Debian提供最小安装，12版本以后包含常用的闭源网卡固件

唯一点，Debian追求的绝对的开源纯洁性，对于开发者来说带来一些不便

所以我选择Debian作为我的第二个Linux发行版，供我继续研究和开发\
或许在未来某天我会再切换到其他版本比如Arch，Gentoo，甚至最后到LFS

## 指南

### 备份

建议用git + 软连接管理所有配置文件，并上传到云端

### 准备Debian安装盘

找一个U盘，将其挂载到Linux文件系统上，确定它的名称，在一个多硬盘、多U口的机器上，名字是会变的，确定完成后弹出

下载Debain的netinst镜像\
可以用`wget`下载到Linux文件系统中

```bash
cd ~/Downloads
wget https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.5.0-amd64-netinst.iso
```

或者直接在<https://www.debian.org/> 中下载

#### 校验文件完整性

下载页上有`SHA256SUMS`文件，可用来校验ISO是否完整

校验需要三个文件：ISO镜像文件，校验和列表（哈希清单），签名文件

<https://www.debian.org/CD/verify>

在同一个目录下，下载官方的`SHA256SUMS`文件和签名文件

```bash
cd ~/Downloads
wget https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS
wget https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/SHA256SUMS.sign
```

##### 导入Debian官方公钥

上方链接列出了三个官方签署密钥，负责稳定版(Stable)和测试版(Testing)的镜像签署\
需要通过它的Key fingerprint（密钥指纹）从公共密钥服务器把它抓下来，导入到本地GPG钥匙串中\
以稳定版`DA87E80D6294BE9B`为例

```bash
gpg --keyserver keyring.debian.org --recv-keys DF9B9C49EAA9298432589D76DA87E80D6294BE9B
```

如果报错找不到服务器，可以换成`--keyserver hkps://keyserver.ubuntu.com`

##### 验证哈希清单是否真的由官方签署

有了公钥，可以用它来检查`SHA256SUMS`这个文本文件有没有被人动过

```bash
gpg --verify SHA256SUMS.sign SHA256SUMS
```

如果终端输出包含`gpg: Good signature from "Debian CD signing key <debian-cd@lists.debian.org>"`\
这就证明这个`SHA256SUMS`文本文件100%完好无损，且是由Debian官方核心团队签发出来的\
大概率会包含一条`WARNING: This key is not certified with a trusted signature!`，这是正常的，说明没有在本地与这个指纹的主人建立面对面的”信任网络“

##### 验证ISO

```bash
sha256sum --check --ignore-missing SHA256SUMS
```

如果最终屏幕上出现

```txt
debian-13.5.0-amd64-netinst.iso: OK
```

这就意味着镜像在下载时没有损毁，也没有被任何黑客掉包

#### 将ISO写入U盘

使用`Rufus`（Windows下）或`dd`命令（Ubuntu下）；以`dd`为例

这是危险操作，确保正确路径，`dd`命令会清空全盘，建立新的分区表和分区

确保U盘已卸载但未拔出

```bash
sudo umount /dev/sdb1
```

执行写入

```bash
sudo dd if=~/Downloads/debian-13.5.0-amd64-netinst.iso of=/dev/sdb bs=4M status=progress
```

- `if=`：输入文件
- `of=`：输出设备，注意是磁盘本身，不是分区
- `bs=4M`：块大小，加快写入速度
- `status=progress`：显示进度条

看到类似输出，说明完成

```txt
xxx MiB copied, xx.xxxx s, xx.x MB/s
```

刷新缓存，确保写完

```bash
sync
```

正常的Debian netinst镜像写入U盘后，通常会产生一个700M左右的EFI分区存放安装引导和内核和一个3-5M的数据分区BIOS兼容引导或元数据分区

### 安装

重启电脑，选择从U盘进入Debian安装程序\
此处可以选择Graphical Install 或 Install（非图形化）

会经历：

- 语言、地区、键盘
- 配置网络
- 磁盘分区
- 软件选择

#### 配置网络

如果插着网线会自动获取IP，如果提示缺少固件，且网卡是博通或Realtek的，可以先跳过，装好系统后手动补\
一般Intel的网卡能直接驱动

#### 磁盘分区

设置完网卡、时区、root密码后，会来到磁盘分区(Partition disks)界面\

1. 选择手动分区(Manual)
2. 在分区列表里，找到本属于Ubuntu的分区（可以通过大小确定，且通常为`ext4`格式）
3. 处理Ubuntu分区
    - 选中原本Ubuntu的根分区(`/`)，将操作改为：用于(Use as):`ext4` journaling file system
    - 勾选格式化这个分区(Format the partition): Yes（这会彻底擦除Ubuntu遗留的旧文件）
    - 设置挂载点(Mount point):`/`
4. 处理EFI引导分区
    - 在列表中找到电脑现有的EFI分区（通常是一个100MB-500MB左右、格式为`fat32`的分区，Windows引导也在里面）
    - 选中它，将操作改为：用于(Use as): EFI system partition
    - 注意：千万不要格式化这个分区，只需要让Debian把自己的引导文件写入这个分区中
5. 确认无误后，选择分区设定结束并将修改写入磁盘(Finish partitioning and write changes to disk)

#### 软件选择

在安装快结束时，系统会弹出Tasksel（软件选择）菜单

- `[ ] Debian desktop environment` Debian的定制GNOME
- `[ ] GNOME`传统GNOME
- `[ ] Xfce` 这是一个传统轻量桌面，只占200MB内存
- `[ ] ... desktop environment` 其他桌面
- `[X] SSH server`
- `[X] standard system utilities` 基础系统工具

### 安装完成

安装完成后，系统会提示你拔掉U盘并重启\
重启并登录后立刻

```bash
sudo update-grub
```

清理GRUB菜单里的残留Ubuntu启动项

在终端里输入`sudo nmtui`，会弹出一个友好的伪图形界面，可以选择无线网络

## 实践

### apt 源

Debian会根据你所在地区，提供多个apt源供选择

[![debian_install_apt_source](/images/content/debian_install_apt_source.png)](/images/content/debian_install_apt_source.png)

`deb.debian.org`需要代理才能访问

[![partition_disk_0](/images/content/partition_disk_0.png)](/images/content/partition_disk_0.png)

[![partition_disk](/images/content/partition_disk.png)](/images/content/partition_disk.png)

[![partition_disk_select](/images/content/partition_disk_select.png)](/images/content/partition_disk_select.png)

[![debian_contest](/images/content/debian_contest.png)](/images/content/debian_contest.png)

[![debian_install_complete](/images/content/debian_install_complete.png)](/images/content/debian_install_complete.png)

[![partition_mount_option](/images/content/partition_mount_option.png)](/images/content/partition_mount_option.png)

[![partition_mount](/images/content/partition_mount.png)](/images/content/partition_mount.png)

[![software_selection](/images/content/software_selection.png)](/images/content/software_selection.png)

