---
title: DOS
author: ljf12825
date: 2026-07-04
tags: [OS]
summary: Introduction of DOS; Install FreeDOS；Using DOSBox-X
---

DOS(Disk Operation System)，磁盘操作系统，是一类统治了20世纪80年代到90年代的个人计算机操作系统的统称\
它包含以下几个主流分支

- MS-DOS(Microsoft DOS)，1981年微软购入Tim Paterson写的86-DOS，最初叫QDOS(Quick and Dirty Operating System)，并以此为基础为IBM PC打造了操作系统
- PC DOS(IBM Personal Computer DOS)，由微软为IBM专门定制的版本。在早期(DOS 1.0到5.0)，PC DOS 和 MS-DOS的核心代码几乎完全一样，只是改了名字和部分内置工具；到了1993年(DOS 6.0)，微软和IBM结束了合作关系，IBM开始独立开发PC DOS，并内置了IBM自己的高级实用工具
- DR DOS(Digital Research DOS)，由CP/M系统的开发商Digital Research推出，是MS-DOS最强劲的竞争对手，DR-DOS经常在技术上领先微软一步，比如，DR-DOS 5.0/6.0率先引入了优秀的内存管理（把驱动移到高端内存，留出宝贵的640KB常规内存给游戏和软件）和磁盘压缩功能，逼得微软不得不紧急开发MS-DOS 5.0和6.0来应对
- FreeDOS（自由操作系统），一个开源、免费的纯16位DOS兼容系统，于1994年因微软宣布全面转向Windows且准备放弃DOS而由民间发起；它完全兼容MS-DOS的软件和游戏，且至今仍持续更新内核和现代网络/包管理工具。很多现代主板刷BIOS用的引导盘，或者无系统的笔记本出厂预装的系统，很多就是FreeDOS

DOS作为主流桌面操作系统的时代已经在2000年就结束了，但DOS并没有彻底消亡。凭借着极地的硬件开销、无虚拟化延迟的直接硬件访问能力，以及庞大的历史遗产，仍活跃在四大特定领域

- 工业控制、医疗与嵌入式系统的底层控制软件都是80-90年代基于DOS编写的，因为它很稳定，重写底层控制软件的代价很大；一些特定的嵌入式设备，这里指的是只需要跑但个控制程序的硬件，DOS启动速度很快而且不用担心像Windows那样频繁更新或联网蓝屏的风险
- 现代硬件维护和固件刷写，虽然许多现代主板(UEFI)支持在Windows内或直接在BIOS里升级固件，但在许多服务器、工控机或某些特定显卡固件刷写工具中，官方依然会提供一个纯DOS版的闪存工具；一些极其追求“干净运行环境”的底层维护工具（如硬盘检测修复工具MHDD，早期的Memtest86等），仍需要通过DOS引导盘启动。在纯DOS下，没有多任务调度，没有复杂的内存分页和虚拟化保护，软件可以直接向主板I/O端口和寄存器发送K&R/汇编指令，从而获得精准的硬件控制权
- 开源世界中的延续，社区正处于FreeDOS 3.0时代，主要在优化现代硬件的兼容性、引入更完善的网卡驱动等；如果今天去买一台没有预装Windows系统的“裸机”联想、戴尔或惠普笔记本，为了证明电脑硬件完好并应付合规检查，厂商往往会在硬盘里预装FreeDOS
- 怀旧游戏与文化保护，这也是我研究DOS的原因，DOSBox及其变体(DOSBox-Staging, DOSBox-X)：由于现代CPU已经彻底抛弃了纯16位实模式（甚至Intel最新架构正在逐步削减32位支持，全力转向64-bit-only），直接在现代PC上跑旧DOS是不可能的。但通过DOSBox这类模拟器，玩家可以在Windows11, Linux甚至手机上完美模拟出一台拥有Sound Blaster 16声卡和VGA显卡的486电脑；时至今日，很多无数经典的DOS游戏仍然在售卖，它们的底层都捆绑着一个配置好的DOSBox

## FreeDOS的安装

在Linux上使用QEMU来模拟DOS所需硬件环境

先创建虚拟机所在目录`~/freedos_sandbox/`\
从<https://freedos.org/>下载Live CD，得到一个.zip压缩包，将其内容解压到`~/freedos_sandbox/`中\


- qemu
- mtools

## DOS的使用

### 命令

#### `dir`(Directory)

输入`dir`回车，它会列出当前目录下的所有文件和文件夹（在DOS里叫”子目录“），并显示它们的大小和最后修改时间

- `dir/p`：如果文件太多一屏显示不下，加上`/p`会分屏显示，按下任意键看下一页
- `dir/w`：宽屏紧凑显示，只看文件名，不看大小和时间

#### `cd`(Change Directory)

DOS的文件系统是树状结构的，需要用`cd`命令来回穿梭

- `cd game`：进入当前目录下名为`game`的文件夹
- `cd ..`：返回上一级母文件夹
- `cd \`：直接回到当前盘符的根目录

#### 切换盘符

DOS不用`cd`来切换硬盘分区或软驱，而是直接输入盘符加冒号

- `A:` 切换到A盘（通常是软驱）
- `C:` 切换到C盘（主硬盘）

#### 运行

在DOS下，只有后缀名为`.EXE`, `.COM`, `.BAT`的文件才是可执行文件；如果进入一个游戏目录，看到一个叫`PLAY.EXE`的文件

```txt
C:\GAMES\PAL\> play
```

#### 文件操作

| 命令 | 示范 | 作用 |
| - | - | - |
| `md`(Make Dir) | `md work` | 新建一个名叫work的文件夹 |
| `rd`(Remove Dir) | `rd work` | 删除work文件夹（必须是空文件夹）|
| `copy` | `copy a.txt c:\backup` | 把`a.txt`复制到C盘的backup目录下 |
| `del`/`erase` | `del test.txt` | 删除`test.txt`文件 |
| `ren`(Rename) | `ren old.txt new.txt` | 将文件重命名 |
| `type` | `type readme.txt` | 直接在屏幕上打印出文本文件的内容 |

#### 磁盘与内存管理

##### `mem`

查看当前系统的内存分配情况\

```bash
mem
```

会显示类似

```txt
Memory Type        Total      Used      Free
--------------- ----------- -----      -----
Conventional       640K       85K       555K
Upper              128K       60K        68K
Reserved            64K       64K         0K
Extended (XMS)   16384K      512K     15872K
--------------- ----------- -----      -----
Total memory
```

- 常规内存(Conventional Memory)
- 上位内存(Upper Memory)
- 保留内存(Reserved Memory)
- 扩展内存(Extended Memory)

- `/c`参数，Classify分类显示内存，它会按程序、驱动程序和TSR（Terminate and Stay Resident，驻留内存程序）分类，显示每个模块占用了多少内存

##### `chkdsk`/`scandisk`

检查磁盘错误、修复逻辑坏道\
在传统MS-DOS下用`scandisk`，在FreeDOS下可以使用兼容的`chkdsk`。当觉得QEMU镜像写入异常或者文件损坏时，用它来扫描

##### `fdisk`

`fdisk`是磁盘分区工具。FreeDOS的`fdisk`极为强大，支持现代的大容量硬盘分区以及FAT32格式

##### `format`

`format c: /s`：格式化C盘，加上`/s`参数(System)，它会在格式化后自动把DOS的引导核心和系统文件传输过去，让这个盘具备独立启动的能力

#### 文本与效率文件命令

提升文件操作效率

##### `xcopy`

传统的`copy`只能拷贝一个目录下的文件，`xcopy`可以拷贝整个磁盘

```bash
xcopy c:\src d:\dest /s /e
```

把`src`文件夹下的所有子目录(`/e`意为包含空文件夹)原封不动地复制到D盘

##### `tree`

以直观的字符画形式，把当前盘符下的所有文件结构打印成一颗“树”

```bash
tree /f
```

不仅显示文件夹，连文件夹里面的文件名也一起列出来

##### `edit`

DOS的御用编译器。蓝底白字，支持快捷键（按`Alt`键可以呼出文件、编辑菜单），可以直接使用鼠标操作

#### 网络与现代进化命令

这些是FreeDOS专属命令，如果用QEMU开启了网络模拟（如`-net nic -net user`），FreeDOS里内置了一套现代操作系统才有的网络命令

##### `fdimples`/`fdnpm`

- `fdimples`是图形化/菜单式的软件仓库管理器，用来装游戏和开发工具
- `fdnpm`是FreeDOS Network Package Manager（类似Linux的`apt`或`npm`）。联网上网后，可以通过类似`fdnpm install wget`的命令直接在线下载DOS软件

##### `fdn`

FreeDOS自动化联网脚本，一键加载Packet Driver并通过DHCP获取IP

##### `ifconfig`

查看当前FreeDOS网卡的IP地址、子网掩码

##### `ping`

测试网络连通性

### 批处理

## DOSBox-X 的使用

## 开发环境

- open watcom

<https://freedos.org/>

[![freedos_erase_c](/images/content/freedos_erase_c.png)](/images/content/freedos_erase_c.png)

[![freedos_formatting_c](/images/content/freedos_formatting_c.png)](/images/content/freedos_formatting_c.png)

[![freedos_guide](/images/content/freedos_guide.png)](/images/content/freedos_guide.png)

[![freedos_installing](/images/content/freedos_installing.png)](/images/content/freedos_installing.png)

[![freedos_install](/images/content/freedos_install.png)](/images/content/freedos_install.png)

[![freedos_packages_select](/images/content/freedos_packages_select.png)](/images/content/freedos_packages_select.png)

[![freedos_partition](/images/content/freedos_partition.png)](/images/content/freedos_partition.png)

[![freedos_boot](/images/content/freedos_boot.png)](/images/content/freedos_boot.png)

[![freedos_installed](/images/content/freedos_installed.png)](/images/content/freedos_installed.png)
