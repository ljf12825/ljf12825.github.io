---
title: linux file system
date: 2026-01-14
draft: false
summary: linux files, permission, link
---

# File System

Linux文件系统就像是整个操作系统的地基和骨架——所有数据都靠它来组织和存取。要理解它，需要同时把它当作一棵“倒挂的树”和一套“抽象层”

## 整体视角：一棵单一的大树（统一的命名空间）
在Linux里，不管有多少硬盘、分区、U盘，统统被挂到一个统一的目录树下
- 根目录`/`是起点，类似于Windows的`C:\`
- 其他设备（分区、外部存储）不会像Windows那样显示成`D:\ E:\`，而是通过挂载点(mount point)嵌入到树中，比如`/mnt/usb`, `/home`, `/media/cdrom`
- 一切皆文件：设备、套接字、管道甚至进程接口（如`/proc`）都表现为文件
  - 这不仅是一种技术更是一种哲学。它意味着几乎所有资源和操作都可以通过一套统一的`open`, `read`, `write`, `close`, `ioctl`接口来访问和管理，把资源抽象为可流动的字节流

## Linux常见目录结构（FHS标准）
熟悉目录相当于熟悉操作系统的器官功能
- `/bin`：用户最基本的二进制可执行文件，比如`ls`, `cp`, `mv`
- `/sbin`：系统管理工具（`ifconfig`, `mount`等）
- `/etc`：配置文件，整个系统的“设置中心”
- `/dev`：设备文件，例如`/dev/sda`硬盘、`/dev/tty`终端
- `/proc`：伪文件系统，实时反映内和和进程状态。比如`/proc/cpuinfo`, `/proc/meminfo`
- `/sys`：sysfs，和内核设备树挂钩的接口
- `/var`：可变数据，日志，缓存，邮件队列
- `/usr`：用户级别程序和库，体量最大
- `/home`：用户主目录

### `/dev`

#### `/dev/null`
`dev/null`是Unix/Linux系统中的一个特殊设备文件，通常被称为“空设备(null device)”\
从工程角度讲，它的语义非常明确：写入它的数据会被立即丢弃；从它读取永远得到EOF\
它是一个字符设备文件，由内核实现，位于虚拟设备文件系统（`/dev`），它不是普通文件，不占磁盘空间，不保存任何数据

##### 行为模型
写入`/dev/null` 
```bash 
echo "hello" > /dev/null 
```
结果
- 写成功
- 数据直接消失
- 不报错

内核行为等价于
```c 
write(fd, buf, len); // 返回 len,但什么都没保存
```

从`/dev/null`读取
```bash 
cat /dev/null 
```
结果
- 立即EOF
- 无任何输出

等价于
```c 
read(fd, buf, len); // 立即返回 0 
```

##### 存在意义
Unix的一条核心哲学是：一切皆文件；既然标准输入/输出/错误都是“文件描述符”，那就需要一个合法的“什么都不做”的端点。`/dev/null`就是这个“黑洞”

##### 常见用途
1. 丢弃输出
```bash 
make > /dev/null 
```
只关心返回码，不关心输出

2. 丢弃错误输出
```bash 
cmd 2> /dev/null 
```
忽略所有错误输出

3. 同时丢弃stdout + stderr 
```bash 
cmd > /dev/null 2>&1 
```

4. 禁用程序读取输入
```bash 
cmd < /dev/null 
```
告诉程序：不要等用户输入

##### 设计哲学
`/dev/null`的意义在于：提供一个“合法但无副作用”的IO终点\
这让
- shell重定向
- 管道
- 守护进程
- 构建系统
- 编译工具

都可以不加分支地工作

## 底层机制：inode与block
这是Linux文件系统的灵魂
- block（块）：存储数据的基本单位，通常4KB
- inode（索引节点）：描述文件的元数据，存储文件大小、权限、所有者、时间戳、数据块位置
- 每个文件都有一个inode号，可以通过`ls-i`查看
- 目录本质上是“文件名 -> inode号”的映射表
- 文件名并不是文件本身，inode才是核心身份
  - 这就是为什么硬连接（hard link）可以让一个文件有多个名字——它们指向同一个inode

### inode结构
inode（索引节点）是Linux文件系统的灵魂。一个文件对应一个inode,里面存的是“元数据”，而不是文件名\
典型的ext4 inode结构里包含：
- 文件类型和权限（普通文件、目录、设备文件）
- 所有者（UID）、组（GID）
- 时间戳：创建、修改、访问时间（ext4支持纳秒级）
- 文件大小
- 指针数组（block pointers）：记录数据存放的位置

指针机制是关键：
- 12个直接指针（直接指向数据块）
- 1个间接指针（指向“数据块指针的块”）
- 1个双重间接指针（指向“指针块的指针块”）
- 1个三重间接指针（三级寻址，能管理超大文件）

这就是为什么一个inode本身不存放数据，而是存放“数据的地图”

### inode本质
inode是文件系统设计的分水岭。早期系统（如FAT）只有“文件名 + 数据块列表”，无法支持硬链接或权限模型\
inode的发明，让“名字”和“实体”解耦：
- 目录项（dentry）存储名字
- inode存储实体信息
- 数据块存储内容

这种分离让Linux能支持：
- 同一个文件多个名字（硬链接）
- 删除名字但文件仍然存在（进程持有fd时）
- 稳定的权限与时间戳机制
- 高级缓存与写回控制

### 文件名与目录
文件名其实不在inode里
- 目录文件是一个特殊的文件，内容就是一张表：`文件名 -> inode号`
- 当`ls`时，系统就是先读目录文件，找到inode. 再通过inode找到数据块
- 这也就是为什么文件名可以删掉（目录项消失），但inode和数据块还在（硬链接依旧存在）

## 虚拟文件系统（VFS）
Linux内核引入了一个抽象层叫VFS（Virtual File System），程序调用`open/read/write`系统调用时，不用管底层是ext4还是XFS，VFS会帮忙翻译。它就像一个“通用接口”，底下可以换不同实现，这就是Linux能挂载不同文件系统的原因。VFS在内核中定义了一组所有文件都必须实现的通用接口（如`inode_operations`, `file_operations`）。当用户程序执行文件操作时，调用先到VFS,再由VFS根据文件所在的路径，路由到具体的文件系统实现去处理

### Linux文件系统的三层抽象
真正理解文件系统，需要看到三层“视角”
1. 用户空间（User Space）
程序看到的只是路径和文件描述符(`fd`)，并不直接感知inode或block。所有访问都要经过系统调用接口，比如`open()`, `read()`, `write()`
2. 内核抽象层（VFS层）
VFS是统一接口层，它让ext4, xfs, btrfs, procfs这些完全不同的实现都能“看起来像文件系统”\
内核中，每种文件系统驱动都要注册一组操作函数（`super_operations`, `inode_operations`, `file_operations`）\
这就像面向对象编程中的“虚函数表”：VFS只关心接口，不关心底层实现
3. 存储层（Block Layer）
VFS最终调用具体的文件系统驱动（如ext4），它通过块设备层（Block I/O Layer）与物理设备交互\
在这里出现的关键词包括：页缓存（Page Cache）、缓冲区（Buffer Head）、I/O调度器（Elevator Algorithm）、DMA（直接内存访问）

这三层结构保证了可替换性与高性能。Linux可以在不改动应用程序的前提下挂载任意文件系统，也能用同一套机制管理网络文件、虚拟内存文件、甚至设备节点

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

## namespace
namespace是Linux内核提供的一种资源隔离机制\
它允许你把同一台机器的内核资源分成多个“视图”（view），每个进程只看到自己的那一份世界\
这意味着两个进程可能：
- 有相同的`/`根目录名，但实际上是不同的文件系统
- 各自有自己的PID=1
- 看不到彼此的网络接口
- 有独立的主机名
- 甚至有自己的用户ID映射

每个namespace控制一类资源。Linux通过这些不同类型的namespace拼出“独立宇宙”

### namespace的类型
Linux支持几种不同类型的namespaces，每种类型负责隔离不同的资源
1. Mount namespace(`mnt`)
    - 用来隔离文件系统的挂载点。每个挂载命名空间都有自己独立的挂载表，这意味着不同的命名空间可以有不同的挂载视图
    - 举个例子，一个进程在一个命名空间中挂载的文件系统，并不会影响其他命名空间中的进程
2. Process ID namespace(`pid`)
    - 用来隔离进程ID。每个命名空间中的进程有自己的进程ID号，并且在命名空间内看到的进程树是独立的
    - 比如，在一个进程ID命名空间中，进程的PID从1开始，这使得容器中的进程与主机的进程互相独立
3. Network namespace(`net`) 
    - 用来隔离网络资源，每个命名空间都有独立的网络设备、IP地址、路由表等网络配置
    - 这样，进程在不同命名空间中可以拥有不同的网络配置，相互之间无法直接通信
4. IPC namespace(`ipc`)
    - 用来隔离进程间通信（IPC）资源。每个命名空间拥有独立的消息队列、信号量、共享内存等IPC资源
    - 这样，进程在不同命名空间中无法直接使用其他命名空间的IPC资源
5. UTS namespace(`uts`)
    - 用来隔离主机名和域名，每个命名空间中的进程可以有自己独立的主机名和域名，而不会影响到其他命名空间
    - 这对于容器化应用特别有用，因为它可以让每个容器看起来像是独立的主机
6. User namespace(`user`)
    - 用来隔离用户和组ID。每个命名空间中的进程可以有独立的用户ID（UID）和组ID（GID），这使得进程在不同命名空间中可以拥有不同的权限
    - 在容器中，进程可以拥有root权限，但仅限于容器内，不会影响主机系统
7. Cgroup namespace(`cgroup`) 
    - 用来隔离进程的控制组(cgroup)信息。每个命名空间中的进程可以有自己独立的资源限制（如CPU、内存等）

### 从进程的视角看隔离
每个进程都有自己的namespace集合，内核通过task_struct里的指针指向这些namespace，可以使用`lsns`或`cat /proc/$$/ns/`查看当前shell所处的各个命名空间
```less 
ipc -> ipc:[4026531839]
mnt -> mnt:[4026531840]
net -> net:[4026531992]
pid -> pid:[4026531836]
user -> user:[4026531837]
uts -> uts:[4026531838]
```
这些数字是namespace的唯一标识符（实质上是内核对象）

多个进程如果指向同一个namespace,就共享那份“世界观”，如果不同，就各自在不同的宇宙
### 使用namespace
- 创建命名空间
可以使用`unshare`命令或通过编程调用`clone()`系统调用来创建一个新的命名空间
```bash 
unshare --net bash 
```
这回启动一个新的shell,运行在一个新的网络命名空间中，意味着它无法访问主机的网络资源

- 查看命名空间
在`/proc/[pid]/ns`目录下，可以查看每个进程的命名空间信息。每种类型的命名空间都有对应的文件，如
```bash 
ls /proc/self/ns 
```
这里可以看到当前进程所属于的各个命名空间

## 不同的Linux文件系统类型
Linux有多个文件系统实现，各有优劣：
- ext2/ext3/ext4：最经典的文件系统，ext4最常用，支持journaling（日志机制）防止崩溃时丢数据
- XFS：高性能文件系统，擅长处理超大文件，常用于服务器
- Btrfs：新一代文件系统，支持快照、压缩、子卷，类似于ZFS的野心
- tmpfs：内存中的临时文件系统，用于`/tmp`，掉电即失
- procfs/sysfs：伪文件系统，数据来自内核而不是硬盘

### ext4文件系统的大布局
当在磁盘上格式化一个ext4分区时，它会分成几大区域
```css
[ Boot Block][ Superblock ][ Block Group 0 ][ Block Group 1 ]...
```
- Boot Block：通常占用前1KB,可以存放引导程序（但一般给GRUB用）
- Superblock（超级块）：文件系统的“身份证”，存储文件系统大小、inode数量、block大小、挂载次数等全局信息
- Block Groups（块组）：整个文件系统被划分为一个个块组（类似分区里的“格子”）。每个块组内部都有自己的元数据和数据存储区

### Block Group的内部结构
每个块组都包含以下部分
```css
[ Superblock（副本） ][ Group Descriptor ][ Block Bitmap ][ Inode Bitmap ]
[ Inode Table ][ Data Blocks ]
```
- Superblock副本：为了防止损坏，ext4会在不同块组里保存超级块的备份
- Group Descriptor：描述当前块组的元信息，比如这个块组的空闲inode/块数量
- Block Bitmap：记录哪些块被占用，哪些是空闲的
- Inode Bitmap：记录哪些inode被占用
- Inode Table：存放inode结构体数组
- Data Blocks：真正存放文件内容的地方

### ext4改进机制
相比ext2/ext3, ext4加了很多现代特性
- Extents：替代传统的“每块一指针”，用一个“范围”来表示连续的数据块，大幅减少大文件的寻址开销
- Journal（日志）：写操作先写入日志，再写到数据区，保证崩溃后能恢复一致性
- 延迟分配（delayed allocation）：写文件时先缓存，等缓冲区满了再写盘，提高性能
- 大文件/大分区支持：单文件最大16TB,分区最大1EB（1 exabyte = 1024 PB）

### 现代文件系统的趋势
Linux文件系统的演进方向，正在从“可靠 + 通用”转向“可验证 + 可回滚”
1. ext4：稳定成熟，但本质是20世纪的架构
2. Btrfs/ZFS：Copy-on-Write（COW）架构，内置校验、快照、压缩。数据安全性高，但对写入延迟敏感
3. OverlayFS/UnionFS：容器时代的利器，可将多层文件系统叠加成一个视图（如Docker的镜像层）
4. FUSE（Filesystem in Userspace）：允许用户空间实现文件系统，典型如sshfs. AppImage, rclone
这体现了Linux哲学中的“机制优于策略”——内核只提供通用机制，不规定策略

当代Linux的存储体系已经超越了传统磁盘概念：
- 页缓存（Page Cache）和块缓存（Buffer Cache）是内核层的“第二层文件系统”
- `tmpfs`是“以内存为磁盘”的反向结构
- `over layfs`是“虚拟叠加”的组合
- `procfs / sysfs`是“状态即文件”的抽象

换句话说，Linux的文件系统并不仅仅是管理数据的，而是管理抽象和语义的

### 数据读写流程：从抽象到具体
结合VFS和底层实现，一个`read`操作的大致流程如下
1. 系统调用：用户程序调用`read(fd, buf, count)`
2. VFS层：内核通过文件描述符`fd`找到对应的`file`结构体，其中包含来指向VFS通用操作的指针
3. 路由到具体文件系统：VFS根据文件所在的挂载点，确定其文件系统类型（如ext4），并调用ext4注册的`read`操作
4. 页缓存（Page Cache）：如果缓存未命中，ext4开始工作。它根据VFS传来的偏移量，通过文件的inode中的指针（或Extents）计算出数据所在的块（block）号
6. 块设备层：ext4向块设备层发起I/O请求，读取这些块
7. I/O调度：块设备层的I/O调度器会对多个请求进行合并和排序（如电梯算法），以优化磁盘磁头的移动路径
8. 设备驱动：最终，请求被发送到具体的硬盘驱动程序，由驱动通过DMA等方式将数据从磁盘读入页缓存
9. 完成：数据从页缓存复制到用户空间的`buf`，系统调用返回

写入（`write`）操作也是类似的路径，但更复杂，涉及回写（Writeback）：数据通常先写到页缓存，内核线程再异步地将脏页刷回磁盘。这提升了性能，但也带来了数据一致性的考虑，这就是Journaling（日志）发挥作用的地方

### 日志（Journaling）机制的工作流程
日志是防止文件系统在崩溃后陷入不一致状态的关键技术（如ext3/ext4的`data=ordered`模式）：
1. 记录日志：在真正向数据块写入用户内容之前，先将本次写入的元数据（如要写入哪些块、inode如何更新）作为一个“事务”追加到日志区域
2. 提交日志：将日志事务标记为提交，确保日志记录是完整的
3. 写入数据：开始真正的数据写入（Commit）
4. 清理日志：数据写入成功后，清理日志中对应的记录

**崩溃恢复**
- 如果崩溃发生在步骤1-2,日志中的事务不完整，直接忽略
- 如果崩溃发生在步骤3-4,重启后文件系统检查日志，发现有一个已提交但未完成的事务，它会重放（replay）这个事务，确保元数据的一致性。这比传统的`fsck`扫描整个磁盘要快几个数量级

### 现代特性：Copy-on-Write（COW）
这是Btrfs和ZFS等新一代文件系统的核心思想，与传统的日志式文件系统（如ext4）有根本不同：
- 原理：当需要修改一个数据块时，并不直接在原位置覆盖写入，而是将块复制到一个新位置，在新位置进行修改，最后更新指针指向块
- 优势：
  - 几乎即时的快照：快照只需记录当前的数据块指针，创建成本极低
  - 数据一致性：避免了崩溃时“半新半旧”的块的问题
  - 潜在的性能提升：适合并行写入


## 权限与安全模型
Linux的安全模型并不是一个附加功能，而是文件系统设计的一部分\
每个文件的inode都存储着以下信息：
- 所有者（user ID, UID）
- 所属组（group ID, GID）
- 权限位（permission bits）

这些字段定义了系统中不同主体对文件的操作权

### 基本权限
Linux将文件权限分为三组：所有者（user）/ 所属组（group）/其他用户（others）\
每组有是三个权限位：
- `r`（read）：读取文件内容或列出目录内容
- `w`（write）：修改文件内容或在目录中添加/删除文件
- `x`（execute）：执行文件（如果是程序），或进入目录（如果是目录）

通过`ls -l`查看权限，显示为

```bash 
-rwxr-x--- 1 user group size date filename 
```
前是个字符即为权限标志，每三个一组，分别对应user, group, others 
- 文件所有者：可读、可写、可执行
- 所属组：可读、可执行
- 其他用户：无权访问

当执行`ls -l`后，最前面的字符表示文件的类型，而不是权限本身，比如
```bash 
drwxr-xr-x  2 user user 4096 Oct 23  folder
-rw-r--r--  1 user user 1024 Oct 23  file.txt
lrwxrwxrwx  1 user user   12 Oct 23  link -> /some/path
```

| 符号 | 含义 |
| - | - |
| d | 目录（directory）|
| - | 普通文件（regular file）|
| l | 符号链接（symbolic link）|
| c | 字符设备（character device, 比如终端、串口）|
| b | 块设备（block device, 比如硬盘、U盘）|
| p | 管道（pipe）|
| s | 套接字（socket）|

#### 权限与文件类型的交互
不同类型的文件，权限意义略有不同

| 文件类型 | `r` | `w` | `x` |
| - | - | - | - |
| 普通文件 | 读内容 | 改内容 | 执行 |
| 目录 | 列出文件 | 新增/删除文件 | 进入目录 |
| 设备文件 | 允许I/O操作 | 允许写入设备 | 无意义 |
| 管道/套接字 | 允许读 | 允许写 | 无意义 |

### 权限修改
#### chmod(change mode)
改变权限，有两种写法：
1. 符号式
```bash 
chmod u+x file # 给用户增加执行权限
chmod g-w file # 移除组写权限
chmod o=r file # 设置其他用户只读
chmod a+x file # 给所有人加执行权限
```
2. 八进制式
三组权限用三位八进制数字表示：
    - r=4, w=2, x=1 
    - 组合相加得出
      - `rwx`=7
      - `rw-`=6
      - `r-x`=5
      - `r--`=4
      - `-wx`=3
      - `-w-`=2
      - `--x`=1 

```bash 
chmod 755 file 
```
- user: rwx 
- group: r-x 
- other: r-x 

#### chown（change owner）
改变文件的拥有者
```bash 
sudo chown alice file.text # 改变所有者
sudo chown alice:developers file # 同时改组
```

#### chgrp（change group）
单独改组
```bash 
chgrp developers file 
```

### 特殊权限位
Linux文件权限不止`rwx`三种，还有三种特殊位用于控制执行时的行为

1. setuid（Set User ID）
应用于可执行文件\
当普通用户执行带setuid位的程序时，程序会以文件所有者的身份运行\
常用于需要短暂提升权限的系统工具
```bash 
ls -l /usr/bin/passwd 
-rwsr-xr-x 1 root root 54256 ...
```
`rws`中的`s`表示setuid \
这让用户能修改自己的密码（写入`/etc/shadow`），而不需要root权限 

2. setgid（Set Group ID）
有两种作用：
- 对可执行文件：程序运行时继承文件所属组
- 对目录：新建文件自动继承该目录的组，而不是创建者的组

```bash 
chmod g+s /shared_dir 
```
这样`/shared_dir`中的所有文件都属于同一组，方便团队协作

3. sticky bit 
常用于共享目录（如`/tmp`）\
表示目录中的文件只有文件所有者或root才能删除
```bash 
chmod +t /tmp 
```
```bash 
drwxrwxrwt 10 root root 4096 ...
```
末尾的`t`表示sticky bit 

### 总结
Linux权限系统体现了Unix的哲学：“最小权限原则”——默认拒绝，按需授予\
系统中一切操作最终都由文件描述符驱动，权限控制是确保这个接口不会滥用的根机制\
在现代系统中，这套传统权限模型还扩展为
- ACL（Access Control List）：更精细的权限控制
- SELinux/AppArmor：基于安全的上下文的强制访问控制
- cgroups + namespaces：容器级的资源与权限隔离

## 硬连接与软链接
### 核心概念
- 硬链接（hard link）：不同的目录项（不同名字）指向同一个inode（同一份数据）。没有“原始文件”这一说法，只有同一数据的多个名字
- 软链接（符号链接, symbolic link/symlink）：一个独立的小文件，内容是目标路径——访问它会跳转到目标路径上（类似快捷方式）

### 创建命令
- 硬链接
```bash 
ln fileA fileB # fileB 是 fileA的硬链接
```
- 软连接
```bash 
ln -s targetpath linkname # 创建符号链接
```
- 删除链接：`rm linkname`（对硬链接是删除一个名字，对软连接是删除链接文件本身）

### 示例
假设有`file1`，inode假定为 1000 
```bash 
echo hello > file1 
ln file1 file_hard # 硬链接
ln -s file1 file_soft # 符号链接
ls -li 
```
- `file1`与`file_hard`会显示相同的inode号，且link count（链接计数）会是2 
- `file_soft`会以`l`开头（`lrwxrwxrwx`），并显示`file1 -> file1`，它有自己的inode,但内容只是路径字符串

关键行为区别：
- 修改`file_hard`的内容，`file1`看到的是相同内容（因为是同一inode）
- 删除`file`(`rm file1`)后，`file_hard`仍然存在并能读到数据（数据直到最后一个硬链接删除且没有打开的fd才释放）
- 删除`file1`后，`file_soft`变成断链（broken symlink），因为它指向的路径不存在

### 技术与限制
1. 跨文件系统
    - 硬链接不能跨文件系统（必须在同一分区/同一文件系统内）
    - 软连接可以指向任意路径（包括不同分区、网络挂载、甚至不存在的路径）

2. 目录链接
    - 普通用户不能对目录创建硬链接（历史守丧出于放置环和破坏树结构的考虑）。root也极少使用。软连接可以指向目录且很常用（例如`/ect/alternatives`、指向配置目录等）

3. link count（链接计数）
    - 硬链接会增加inode的link count（`stat`或`ls -l`第二列显示）。只有当link count为0且没有进程持有该inode的打开文件描述符时，内核才回收数据块
    - 软连接不会影响目标文件的link count 

4. 权限与元数据
    - 硬链接与目标共享同一个inode,所有它们共享权限、所有者、时间戳等元数据（对其中一个改权限，另一个也变）
    - 软链接本身有自己的权限位（通常`lrwxrwxrwx`），但系统在访问时会忽略这些，实际权限由目标文件决定（注意：`lstat`与`stat`的区别，可分别查看链接本身和目标）

5. 性能与实现成本
    - 硬链接只是多了一个目录项，几乎零成本（没有额外I/O除了目录项更新）
    - 软连接需要一次额外的路径解析/跳转（一次额外查inode），成本极小且通常可忽略

6. 符号链接的相对/绝对路径问题
    - 绝对symlink（`/usr/bin/foo`）在移动包含该链接的整个目录后会失效
    - 相对symlink（`../lib/foo`）在移动整个目录树时更稳健，推荐在项目内部/仓库使用相对链接

### 检测与诊断命令
- 查看inode和link count：
```bash 
ls -li file1 file_hard file_soft 
stat file1 
```
- 找出与某inode关联的所有硬链接（假设inode=12345）
```bash 
find /path -xdev -inum 12345 -print 
```
`-xdev`防止快文件系统搜索（可选）

- 找出断开的软连接（可靠写法）
```bash 
find /path -type l | -exec test -e {} \; -print 
```
解释：找所有类型为symlink且`test -e`为假的（目标不存在）的项

- 查看symlink指向
```bash 
readlink linkname # 只输出目标路径
readlink -f linkname # 输出解析后的绝对真实路径（跟随所有中间链接）
```

### 常见误区与安全隐患
- 误区：`ln -s`会复制文件？不会。它只创建路径指向。若想复制并保留链接属性，用`cp -a`（保留属性并复制链接本身）或`rsync -a`等工具并留意参数
- Symlink TOCTOU与竞态攻击：当脚本以root权限操作文件名时，恶意用户可能替换为symlink来诱导操作到敏感位置（典型的临时文件/tmp/文件竞态攻击）。写脚本时要避免盲目用`tmp`中固定名字，或用`mktemp`
- 备份工具行为差异：tar/rsync/cp等对链接的处理不同（有些会保存为链接，有些会解引用并复制目标）。使用前看清选项（`-h, -a, --copy-links`等）

### 何时用硬链接，何时用软连接（实战建议）
- 用硬链接当需要
  - 在同一分区内让同一份数据有多个名字（节省空间），需要完全等价的副本（同inode）
  - 例如：同一日志文件放在两个目录同时可见
- 用软连接当需要
  - 指向目录或跨分区/网络挂载目标
  - 想要“快捷方式”或允许目标不存在（先建链接，稍后填目标）
  - 在包管理、配置、版本切换场景（例如`python3 -> python3.10`）非常常用
  - 想让链接在移动整个目录树时仍然有效时优先用相对symlink
