---
title: ln
author: ljf12825
date: 2026-06-18
type: file
summary: Overview of linux command "ln"
---

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
