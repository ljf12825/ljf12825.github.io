---
title: user and permission
date: 2026-01-14
draft: false
summary: user, usergroup, file permission, umask
---

# User & Permission

Linux核心思想，一切皆文件；在Linux中，几乎所有的资源（普通文件、目录、硬件设备、进程等）都被抽象为“文件”。\
因此，权限管理本质上就是对文件的访问控制

## 用户与用户组
为了进行权限管理，Linux首先需要知道“谁”在访问文件。这就引入了用户和用户组的概念
### 用户
每个使用系统的人或进程都应该有一个唯一的用户账户
- root用户（超级用户）：系统的最高管理员，UID为0。拥有对整个系统无限制的完全访问权限。日常操作应该避免使用root账户，以免误操作导致系统损坏
- 系统用户：通常用于运行系统服务和进程，没有登录权限。如`www-data`用户用于运行Web服务器
- 普通用户：为一般使用者创建的账户，权限受限，只能访问自己的文件和被授权访问的文件

#### 相关文件
- `/etc/passwd`：存储用户账户信息
  - 格式：`username:x:UID:GID:description:home_directory:login_shell`
    - `username`：用户的登录名称
    - `x`：存储的是密码的加密哈希值（通常在`/etc/shadow`文件中
    - `UID`：用户的唯一标识符
    - `GID`：用户所属的主用户组ID 
    - `description`：一般包含用户的全名或其他描述信息
    - `home_directory`：用户的主目录路径（例如，`/home/alice`
    - `login_shell`：用户登录后使用的默认Shell程序（例如，`/bin/bash`）
- `/etc/shadow`：存储加密后的用户密码以及相关策略（只有root可读）

### 用户组
用户组是用户的集合，主要用于简化权限管理。可以将权限分配给一个组，那么组内的所有成员都会自动获得这些权限。一个用户可以数据多个用户组
- 主要组：用户创建文件时，文件的默认属组；通常，用户的主组与用户名相同（例如，`alice`用户的主组也叫`alice`）
- 附加组：用户可以属于多个附加组。附加组用于扩展用户权限，使得用户可以访问属于其他组的文件

#### 相关文件
- `/etc/group`：存储用户组信息
  - 格式：`group_name:x:GID:user_list`
    - `group_name`：组的名称
    - `x`：如果组有密码，存储的是加密哈希值（通常为空）
    - `GID`：组的唯一标识符
    - `user_list`：属于该组的用户列表，用户之间用逗号分隔
- `/etc/gshadow`：存储关于组密码和成员的加密信息（只有root用户可访问）

### 相关命令
#### 用户管理命令
##### 1. `useradd`-创建新用户
基本语法：`useradd [选项] 用户名`\
常用选项：
- `-c "注释"`：用户的注释信息，通常是全名
- `-d /home/目录`：指定用户的家目录
- `-m`：如果家目录不存在，则创建它（非常重要）
- `-s /bin/bash`：指定用户的登录Shell 
- `-g 主要组`：指定用户的主要组（组名或GID）
- `-G 附加组`：指定用户的附加组（组名或GID），多个组用逗号分隔
- `-u UID`：手动指定用户的UID

```bash 
# 创建一个名为alice的用户，并自动创建家目录
sudo useradd -m alice 

# 创建用户 bob, 指定家目录、注释信息，并设置主要组为 'developers'
sudo useradd -m -d /home/bob_home -c "Bob Smith" -g developers bob 

# 创建用户 charlie, 并加入到 'wheel, ftp' 两个附加组中
sudo useradd -m -G wheel,ftp charlie 

# 创建系统用户（无家目录，不用于登录），用于运行服务
sudo useradd -r -s /bin/false my_service_user 
```

##### 2. `usermod`-修改用户属性
基本语法：`usermod [选项] 用户名`\
常用选项：
- `-c, -d, -s, -g, -u`：与`useradd`相同，用于修改对应信息
- `-G 附加组`：注意：此选项会覆盖用户当前的附加组列表。使用`-aG`来追加
- `-ag 附加组`：（追加模式）将用户追加到一个或多个附加组中，不覆盖原有组（最常用）
- `-L`：锁定用户账户，禁止其登录
- `-U`：解锁用户账户

```bash 
# 将用户 alice 加入到 'sudo' 组（能够使用sudo提权）
sudo usermod -aG sudo alice

# 修改用户bob 的登录Shell为 /bin/zsh 
sudo usermod -s /bin/zsh bob 

# 锁定用户charlie 
sudo usermod -L charlie 

# 同时修改用户的主要组和附加组（覆盖式）
sudo usermod -g new_primary_group -G group1,group2 username 
```

##### 3. `userdel`-删除用户
基本语法：`userdel [选项] 用户名`\
常用选项：
- `-r`：删除用户的同时，一并删除其家目录和邮件池
```bash 
# 删除用户 alice，但保留其家目录
sudo userdel alice 

# 彻底删除用户 bob （包括家目录）
sudo userdel -r bob 
```

##### 4. `passwd`-管理用户密码
基本语法：`passwd [选项] [用户名]`\
常用用法：
```bash 
# 当前用户修改自己的密码
passwd 

# root用户为指定用户设置密码（无需旧密码）
sudo passwd alice 

# 锁定用户密码（禁止登录）
sudo passwd -l alice 

# 查看用户密码状态
sudo passwd -S alice 
```

##### 5. `id`-查看用户身份信息
基本语法：`id[用户名]`\
示例：
```bash 
# 查看当前用户的信息
id 

# 查看用户 alice 的信息
id alice 
# 输出示例：uid=1001(alice) git=1001(alice) groups=1001(alice),27(sudo)
# 这表示 alice 的UID是1001，主要组GID是1001，同时属于 alice 和 sudo 组 
```

#### 用户组管理命令
##### 1. `groupadd`-创建新用户组
基本语法：`groupadd [选项] 组名`\
常用选项：
- `-g GID`：指定新组的GID
```bash 
# 创建一个名为 developers 的组
sudo groupadd developers 

# 创建一个GID为2000的组
sudo groupadd -g 2000 project_team 
```

##### 2. `groupmod`-修改用户组属性
基本语法：`groupmod [选项] 组名`\
常用选项：
- `-n 新组名`：修改组名
- `-g 新GID`：修改组的GID

```bash 
# 将组名 developers 改为 engineers
sudo groupmod -n engineers developers 
```

##### 3. `groupdel`-删除用户组
基本语法：`groupdel 组名`\
注意：如果该组是某个用户的主要组，则无法删除。必须先修改那些用户的主要组或删除那些用户\
示例：
```bash 
sudo groupdel engineers 
```

##### 4. `gpasswd`-管理组（核心命令）
基本语法：`gpasswd [选项] 组名`\
常用选项：
- `-a 用户`：将用户添加到组中
- `-d 用户`：将用户从组中移除
- `-M "用户1,用户2,..."`：设置组的成员列表（会覆盖原有成员）
```bash 
# 将用户 alice 添加到 developers 组
sudo gpasswd -a alice developers

# 将用户 bob 从 developers 组中移除
sudo gpasswd -d bob developers

# 一次性设置 developers 组的成员为 alice 和 charlie 
sudo gpasswd -M "alice,charlie" developers 
```

#### 切换与查看命令
##### 1. `su`-切换用户
基本语法：`su [选项] [用户名]`\
常用选项：
- `-`或`-l`或`--login`：模拟完成登录，会加载目标用户的环境变量
- 不指定用户名：默认切换到root 

示例：
```bash 
# 切换到 root 用户（不加载root的环境变量，保留原用户环境）
su 

# 切换到 root 用户（推荐方式，加载root的环境变量，如PATH）
su - # 或 su - root 

# 切换到 alice 用户
su - alice 
```

##### `sudo`-以超级用户权限执行命令
基本语法：`sodo [命令]`\
核心思想：给受信任的用户临时授予root权限来执行特定命令，所有操作都会被记录\
相关命令：
- `sudo -i`：类似于`su -`，启动一个root的交互shell 
- `visudo`：安全地编辑`/etc/sudoers`文件，配置sudo权限

##### `whoami`-我是谁
```bash 
whoami 
# 输出：alice
```

##### `groups`-查看所属组
```bash 
# 查看当前用户属于哪些组
groups 

# 查看指定用户 alice 属于哪些组
groups alice 
```

## 文件权限基础
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

### 文件访问控制列表
基础的`rwx`权限只能针对一个所有者、一个组和其他人，如果需要更精细的控制（例如，让多个不同的用户和组拥有不同的权限），就需要使用ACL
- 查看ACL：`getfacl filename`
- 设置ACL：`setfacl`
```bash 
# 为用户david添加读写权限
setfacl -m u:david:rw file.txt

# 为组contractors添加只读权限
setfacl -m g:contractors:r file.txt 

# 递归设置ACL给一个目录
setfacl -R -m u:david:rwx /shared_folder/

# 移除david的ACL条目
setfacl -x u:david file.txt 
```

## umask 

`umask`（用户文件创建掩码）是一个操作系统（尤其是在类Unix系统中）用于确定新创建文件或目录的默认权限工具。它定义了在文件系统中创建文件或目录时，哪些权限应该被禁用

### umask的作用

每次当你创建一个文件或目录时，系统会为其分配一组默认权限。这些默认权限通常为`666`（文件，表示所有用户都有读取和写入权限）或者`777`（目录，表示所有用户都有读取、写入和执行权限）。然后，`umask`会通过屏蔽某些权限来减少这些默认权限

例如，假设你的`umask`是`022`，那么
- 对于一个新文件，默认权限是`666`，而`umask`会将其屏蔽掉`2`（即去掉写权限）。所以新文件的权限会是`644`（所有者可以读写，组和其他人只能读取）
- 对于一个新目录，默认权限是`777`，`umask`会去掉`2`（去掉写权限）。所以新目录的权限会是`755`（所有者可以读写执行，组和其他人只能读和执行）

### 查看与设置

- 查看当前`umask`值
```bash 
$ umask
0022
```

- 设置`umask`值
```bash 
umask 0777
```
这将屏蔽所有权限，使新创建的文件和目录没有任何权限

### `umask`常见值

- `0000`：没有权限被屏蔽，意味着文件或目录将具有默认权限
- `0222`：仅屏蔽写权限，使得其他用户可以读取和执行文件
- `0777`：完全屏蔽所有权限，几乎没有权限可以被赋予

`umask`是非常有用的，特别是在多用户环境中，确保不同用户对文件的访问权限符合预期
