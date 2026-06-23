---
title: Linux Permission Model
author: ljf12825
date: 2026-06-18
type: file
summary: Overview of Linux Permission Model
---

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
