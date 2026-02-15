---
title: linux command
date: 2026-01-14
draft: false
summary: linux common command
---

# Command in Linux
Linux命令系统是基于Shell（常见的有`bash`, `zsh`, `fish`）的交互环境
- 命令本质上就是一个程序（可执行文件），比如`/bin/ls`、`/usr/bin/grep`
- 在命令行里输入的东西，Shell负责解析，然后调用相应的程序执行

所以“命令系统”不是内核强制规定的，而是围绕Unix哲学发展出来的一整套生态：
> "做一件事，并且把它做好。通过管道组合小工具，完成大任务"

## 命令的组成结构
在Linux中，一个命令通常由**命令名+选项+参数**组成
```bash
ls -l /home/user
```
- `ls` -> 命令名
- `-l` -> 选项（长列表显示）
- `/home/user` -> 参数（目标目录）

选项有两种风格
- 短选项：`-l`
- 长选项：`-all`

这套风格来自GNU工具链

## 命令来源
终端命令的来源主要来自于以下几个模块
- Shell内置
- GNU工具集
- 其他软件
- 用户自定义

## /bin

`bin`=binary,存放可执行程序（二进制文件）

### 存在意义

系统最小可用，即：\
在系统刚启动时、还没挂载其他分区时就能用

### `/bin`, `/usr/bin`

| 目录 | 含义 |
| - | - |
| `/bin` | 启动和救援必须 |
| `/usr/bin` | 普通用户命令 |
| `/sbin` | 管理员命令 |
| `/usr/sbin` | 非关键管理员命令 |

在大多数现代发行版中

```bash
/bin -> /usr/bin
/sbin -> /usr/sbin
```

```bash
ls -l /bin
```

可以看到

```bash
/bin -> usr/bin
```

这被称作`usr merge`，可以简化目录结构，减少重复，容器/initramfs更干净

### bin中的程序形态

#### 1. ELF二进制

```bash
file /bin/ls
```

输出类似

```bash
ELF 64-bit LSB executable
```

这是编译好的C程序，由内核直接加载执行

#### 2. Shell脚本

```bash
file /bin/sh
```

可能是

```bash
symbolic link to dash
```

或

```bash
#!/bin/sh
```

但这并不代表用户可以自己往`/bin`内放程序\
这需要root权限，可能破坏系统一致性，还可能导致包管理器冲突\
正确的做法是\

| 目的 | 位置 |
| - | - |
| 个人脚本 | `~/bin` |
| 本地工具 | `/usr/local/bin` |
| 系统包 | 交给 apt/pacman |

### /bin中程序的来源

`/bin`不是一个“统一来源”的目录，它是多个软件包 + 多种构建方式的集合

它大致包含：

1.GNU coreutils: GNU官方，C语言实现，所有Linux必备
2.Shell相关：来源于不同项目`bash`,`sh`,`dash`,`zsh`等
3.util-linux：系统工具集
4.发行版自带/历史遗留工具
5.符号链接

> bin 是通过PATH找到的

```bash
echo $PATH
```

常见包含

```bash
/usr/local/bin:/usr/bin:/bin
```

当敲下`ls`时，Shell实际做的是

1.在`/usr/local/bin`找
2.再`/usr/bin`
3.再`/bin` 


### Shell内置命令
Shell内置命令是指那些直接由Shell提供支持、实现并在Shell环境中执行的命令。它们不依赖于外部可执行文件，而是内建在Shell中。内置命令执行起来非常高效，因为它们不需要启动新的进程来执行任务，直接由Shell解释执行\
不同的Shell会有不同或额外的命令，下面是`bash`中的内置命令，可以通过`man bash`显示Bash的说明书，中有一个专门的章节详细描述来所有内置命令
- `cd`：改变当前工作目录
- `pwd`：打印当前工作目录路径
- `echo`：输出内容
- `alias`：创建命令别名
```bash
alias ll='ls -l'
```
- `unalias`：删除命令别名
```bash
unalias ll
```
- `export`：设置或显示环境变量
- `unset`：删除环境变量或Shell变量
- `env`：查看环境变量
- `set`：设置Shell变量和显示当前Shell环境的所有变量
- `exit`：退出Shell或脚本，返回指定的状态码
- `return`：从函数中返回，指定返回值
- `wait`：等待后台进程完成
- `eval`：计算并执行字符串中的命令
- `trap`：设置一个命令，在指定信号时执行
```bash
trap 'echo "Caught signal!"' SIGINT
```
- `if`：条件语句
```bash
if [ condition  ]; then
    # commands
fi
```
- `for`：循环语句
```bash
for i in {1..5}; do
    echo $i
done
```
- `while`：条件循环语句
```bash
while [ condition  ]; do
        # commands
done
```
- `case`：条件判断的另一种形式
```bash
case $variable in
  pattern1) command ;;
  pattern2) command ;;
  *) command ;;
esac
```
- `continue`：跳过当前循环的剩余部分，开始下一次循环
- `break`：跳出循环
- `bg`：将作业放到后台运行
```bash
bg %1 # 将作业号为1的任务放入后台
```
- `fg`：将后台作业调回到前台
```bash
fg %1
```
- `jobs`：列出当前Shell会话中的作业
- `kill`：发送信号到进程（通常是用来终止进程）
```bash
kill -9 1234 # 发送 SIGKILL信号，终止PID 1234的进程
```
- `history`：显示命令历史
- `source`或`.`：执行文件中的命令，通常用于加载脚本
```bash
source ~/.bashrc
. ~/.bashrc
```
- `type`：显示命令的类型（是内置命令，外部命令、函数等）
- `read`：从标准输入读取一行数据
- `test`：检查条件表达式（用于脚本中）
```bash
test -f file.txt && echo "File exists"
```
- `let`：执行算术运算
```bash
let result=5+3
```
- `exec`：替换当前Shell进程为指定的命令
```bash
exec ls -l
```

### GUN Utilities 
GUN工具集（GNU Utilities）是指GNU项目提供的一整套自由软件开发与系统工具集合，它构成了现代Unix/Linux系统的基础生产力层
#### GNU Coreutils
GNU Coreutils是GNU最核心的部分，是GNU项目提供的一组最基础、最核心的用户空间命令行工具集合。它定义了一个最小可用的Unix用户空间长什么样。它包含日常必备的基础命令，覆盖三大类
- 文件操作类
- 文本处理类
- 系统操作类

## 文件与目录操作

### `ls`

`ls`(list directory contents)，用于列出目录内容

```bash
ls [options] [file/directory]
```

#### 选项

##### `-l`

详细列表格式

```bash
-rw-r--r--  1 ljf12825 users   4096 Jan 12 20:31 main.cpp
[1]        [2]  [3]      [4]    [5]     [6]         [7]
权限与类型 硬链接数  所有者    所属组   大小     时间        文件名
```

###### 文件类型

第1个字符

| 字符  | 含义        |
| --- | --------- |
| `-` | 普通文件      |
| `d` | 目录        |
| `l` | 符号链接（软链接） |
| `c` | 字符设备      |
| `b` | 块设备       |
| `p` | 管道        |
| `s` | 套接字       |

###### 权限位

后9个字符

- 前3位：user
- 中3位：group
- 后3位：others

- `r`：读
- `w`：写
- `x`：执行
- `-`：无权限
- `s`：程序执行时临时获得文件所有者权限
- `t`：常见于`/tmp`，只能删除自己创建的文件
 
---

- `h`/`--human-readable`
人性化显示，文件大小用K, M, G表示

- `-1`
每行显示一个文件

- `-m`
用逗号分隔显示

- `-x`
按行排列

- `-C`
按列排列

- `-t`
按修改时间排序（最新在前）

- `-r`
反向排序，与其他参数共同使用

- `u`
按访问时间排序

- `-c`
按inode变更时间排序

- `--full-time`
显示完整时间戳

- `-S`
按文件大小降序

- `X`
按扩展名排序

- `v`
按版本号排序

- `U`
不排序（按目录顺序）

- `-a`
显示所有文件，包括隐藏文件（以`.`开头）

- `-A`
显示所有文件，但不包括.和..

- `-R`
递归显示子目录内容

- `-d`
显示目录本身，而不是内容

- `F`
添加文件类型标识符，`/`目录，`*`可执行文件，`@`符号连接，`|`，FIFO（管道），`=`套接字

- `--color=auto`
用颜色区分文件类型（默认）

- `--color=always`
总是显示颜色

- `--color=never`
不显示颜色

- `-i`
显示文件inode号

- `--author`
显示文件作者

- `--hide=*.tmp`
隐藏tmp文件

- `-I`/`--ignore`
排除tmp文件

---

### `cd`

`cd`(Change Directory)，用于在文件系统的目录之间进行导航

特殊符号

- `.`表示当前目录（在`cd`中不常用，常用于其他命令）
- `..`表示父目录
- `~`表示当前用户的主目录
- `-`表示上一次访问的目录（类似“后退”）

### `pwd`

`pwd`(Print Working Directory)，用于显示当前所在的目录的完整路径

参数

- `-L`（默认），显示逻辑路径（解析符号链接）
- `-P`显示物理路径（不解析符号链接）

为什么需要pwd?

- 在多层目录中容易迷失当前位置
- 脚本中需要绝对路径来确保操作正确
- 排查问题时需要知道执行环境

### `mkdir`

`mkdir`(Make Directory)，用于在系统中创建新的目录

#### 基本语法

```bash
mkdir [options] directoryname...
```

#### 基本用法

- 创建单个目录

```bash
mkdir folder1
```

- 创建多个目录

```bash
mkdir folder1 folder2 folder3
```

- 创建带有空格的目录名

```bash
mkdir "my folder"

mkdir 'another folder'
```

- 创建包含特殊字符的目录名

```bash
mkdir folder-with-dash
mkdir folder_with_underscore
mkdir "folder with space"
```

#### 常用选项

- `-p, --parents`：创建多层目录

```bash
mkdir -p dir1/dir2/dir3
```

如果父目录不存在，会自动创建，如果目录存在，不会报错

一次性创建多层目录结构

```bash
mkdir -p project/{src,test,docs,logs}
# 创建：project/src, project/test, project/docs, project/logs
```

- `-m, --mode=MODE`：设置目录权限

```bash
mkdir -m 755 public_dir
mkdir -m 700 private_dir
```

- `-v, --verbose`：显示创建过程

```bash
mkdir -v new_folder
# 输出：mkdir: create directory 'new_folder'
```

### `rmdir` / `rm -r`

- `rmdir`

删除空目录，空是指，只含`.`和`..`，哪怕有任何文件或子目录（即使是隐藏的），都会失败

`rmdir`存在的意义就是安全性优先，防止误操作

```bash
rmdir -p a/b/c

# a/
# |__b/
#    |__c/
```

删除`c` -> `b`变空了删除`b` -> `a`变空了删除`a`，否则停下

`rm -r`递归删除目录

### `cp`：复制文件或目录

`cp`用来复制文件/目录

```bash
cp [options] source destination
cp [options] source... directory
```

| 情况 | 行为 |
| - | - |
| 目标不存在 | 新建 |
| 目标是文件 | 覆盖 |
| 目标是目录 | 复制到目录里 |

#### OPTIONS

##### `-r`/`-R` 递归复制

```bash
cp -r src dst
```

没有这个选项不能复制目录，`-r`和`-R`在GNU `cp`中基本等价\
会跟随目录结构，不会自动保留元数据

##### `-a` 归档模式

```bash
cp -a src dst
```

等价于

```bash
cp -dR --preserve=all
```

会保留以下内容

- 权限
- 所有者/组
- 时间戳
- 符号链接（不解引用）
- 设备文件、FIFO

复制目录，90%场景都应该使用`-a`

##### `-f`/`-i` 覆盖行为控制

- `-f` 强制覆盖不提示
- `-i` 覆盖前询问

```bash
cp -i a b
cp -f a b
```

##### `-d`/`-P` 不解引用软连接

```bash
cp -d link dst
```

复制的是link本身，而不是link指向的文件

##### `-L` 解引用软连接

```bash
cp -L link dst
```

复制链接指向的内容，得到的是普通文件


##### `--preserve`

```bash
cp --preserve=mode,ownership,timestamps file dst
```

或

```bash
cp -p file dst
```

可保留属性

| 属性 | 说明 |
| - | - |
| mode | 权限 |
| ownership | uid/gid |
| timestamps | 时间 |
| links | 硬链接 |
| xattr | 扩展属性 |
| context | SELinux |

`-a` = 全保留

`--no-preserve` 不保留

```bash
cp -a --no-preserve=ownership src dst
```

##### `-u` 只在更新时复制

```bash
cp -u src dst
```

目标不存在或源比目标新时执行

##### `--remove-destination`

```bash
cp --remove-destination src dst
```

先删dst再复制，可避免只读文件覆盖失败

##### `--sparse`

```bash
cp --sparse=always src dst
```

保留空洞

##### `--reflink`

```bash
cp --reflink-auto a b
```

- Btrfs/XFS
- O(1)复制
- 写时复制

##### `-v` 显示过程

##### `--parents` 将dst作为父目录

```bash
cp --parents a/b/c.txt dst
```

结果

```text
dst/a/b/c.txt
```

##### `cp` vs `rsync`

| 场景     | 推荐               |
| ------ | ---------------- |
| 简单复制   | cp               |
| 大目录增量  | rsync            |
| 断点续传   | rsync            |
| 网络     | rsync            |
| 保留全部属性 | cp -a / rsync -a |

### `mv`：移动或重命名

`mv`(move)，用于移动或重命名文件和目录

#### 基本功能

1.移动文件/目录：将文件从一个位置移动到另一个位置
2.重命名文件/目录：在原地更改文件/目录名
3.覆盖文件：如果目标文件已存在，默认会覆盖（无警告）

#### 基本语法

```bash
mv [options] src/dir src/dir
```

##### 选项

| 选项 | 描述 |
| - | - |
| `-i` | 交互模式，覆盖前询问确认 |
| `-f` | 强制模式，不询问（默认行为）|
| `-n` | 不覆盖已存在的文件 |
| `-u` | 只移动比目标文件新的文件 |
| `-v` | 详细模式，显示操作过程 |
| `-b` | 覆盖前为目标文件创建备份 |
| `-t dir` | 先将目标目录指定，然后是要移动的文件 |

#### 使用

1.重命名文件

```bash
mv oldfile.txt newfile.txt
# 将 oldfile.txt 重命名为 newfile.txt
```

2.移动单个文件

```bash
mv file.txt /home/user/documents/
# 将 file.txt 移动到 documents 目录
```

3.移动多个文件到目录

```bash
mv file1.txt file2.txt file3.txt /target/directory/
# 将三个文件移动到目标目录
```

4.移动目录

```bash
mv dir1/ dir2/
# 如果 dir2 不存在：将 dir1 重命名为 dir2
# 如果 dir2 存在：将 dir1 移动到 dir2/ 目录下
```

5.交互模式（避免误覆盖）

```bash
mv -i source.txt target.txt
# 如果 target.txt 已存在，会询问是否覆盖
```

6.显示移动过程

```bash
mv -v file.txt /backup/
# 输出：'file.txt' -> '/backup/file.txt'
```

7.不覆盖现有文件

```bash
mv -n file.txt existing.txt
# 如果 existing.txt 存在，则不移动/覆盖
```

8.只移动较新的文件

```bash
mv -u newfile.txt oldfile.txt
# 只当 newfile.txt 比 oldfile.txt 新时才移动
```

9.覆盖前创建备份

```bash
mv -b source.txt target.txt
# 如果 target.txt 存在，会先备份为 target.txt~
```

### `rm`：删除文件

`rm`(remove)，用于删除文件或目录

`rm`删除的文件通常无法恢复，不像图形界面会进回收站

Linux没有回收站，除非特殊配置，删除操作立即生效

#### 基本语法

```bash
rm [options] file/dir...
```

##### 常用选项

| 选项 | 描述 |
| - | - |
| `-f` | 强制删除，不提示 |
| `-r`或`-R` | 递归删除（用于目录）|
| `-i` | 交互模式，删除前询问 |
| `-v` | 显示详细过程 |
| `-d` | 删除空目录 |
| `--preserve-root` | 不删除根目录（默认）|
| `--no-preserve-root` | 允许删除根目录 |

`rm`不是把文件内容清零，而是删除目录项（文件名），减少inode的引用技术，当引用计数为0 -> 数据库可被复用\
`rm`内部调用`unlink()`/`unlinkat()`\
`rm`为什么不提示成功：No news is good news
`rm`可以删除正在使用的文件，进程仍能访问，文件名消失，程序结束后才真正释放空间

### `cat`

`cat`(concatenate)，把输入的内容原样输出到标准输出(stdout)

#### 用法

##### 查看文件内容

```bash
cat a.txt
```

把`a.txt`的内容一次性全部输出，不分页，不暂停

##### 同时查看多个文件

```bash
cat a.txt b.txt
```

输出顺序

```text
a.txt内容
b.txt内容
```

中间不会自动加分隔符

##### 合并文件

```bash
cat a.txt b.txt > all.txt
```

- `>`：覆盖
- `>>`：追加

#### `cat`与重定向

##### 从标准输入读取

```bash
cat
```

然后输入

```txt
hello
world
```

再`^D`(EOF)\
终端输出

```txt
hello
world
```

##### 手动创建文件

```bash
cat > test.txt
```

输入内容 -> `^D`结束

##### Here Document

```bash
cat << EOF > config.ini
[server]
port=8080
host=127.0.0.1
EOF
```

shell把内容交给cat

#### 参数

- `n` 显示行号，所有行
- `b` 只给非空行编号
- `A` 显示不可见字符，`$`行尾，`^I`Tab, `^M`CR

`cat` 不适合大文件，它会一次全部输出，终端会被卡住

`tac`,`cat`的反向，输出方向和cat相反，从文档末尾->文档开头


### `more`/`less`

`more`与`less`都是用于分页查看文件内容的工具，通常被称为分页器（pagers）

| 特性 | `more` | `less` |
| - | - | - |
| 诞生时间 | 1978年 | 1984年 |
| 名称含义 | 显示更多 | 更少即是更多 |
| 向后滚动 | 不支持 | 支持 |
| 向前搜索 | 不支持 | 支持 |
| 向后搜索 | 不支持 | 支持 |
| 行号显示 | 有限支持 | 支持 |
| 文件内跳转 | 有限 | 灵活 |
| 查看多个文件 | 支持 | 支持 |
| 跟随模式 | 不支持 | 支持 |
| 内存使用 | 较少 | 较多 |
| 默认位置 | 通常默认安装 | 更现代的默认 |

`less`是`more`的增强版，现在基本都用`less`

#### `more`

##### 基本语法

```bash
more [options] file
```

##### 常用选项

| 选项 | 说明 |
| - | - |
| `-d` | 显示提示信息 |
| `-f` | 不折叠长行 |
| `-l` | 忽略换页符 |
| `-p` | 从指定行开始 |
| `-s` | 将多个空行压缩为一行 |
| `+n` | 从第n行开始显示 |
| `+/pattern` | 从匹配模式的第一行开始 |

##### 基本操作

| 按键 | 功能 |
| - | - |
| `空格`或`f` | 向下翻一页 |
| `Enter` | 向下翻一行 |
| `=` | 显示当前行号 |
| `:f` | 显示文件名和行号 |
| `q`或`Q` | 退出 |
| `/字符串` | 向前搜索字符串（有限）|

#### `less`

Less is more 少即是多，功能比`more`更多

##### 基本语法

```bash
less [options] file
```

##### 常用选项

| 选项 | 说明 |
| - | - |
| `-N` | 显示行号 |
| `-i` | 搜索时忽略大小写 |
| `-I` | 搜索时智能忽略大小写 |
| `-S` | 不换行（水平滚动）|
| `-F` | 如果文件小于一屏，自动退出 |
| `-X` | 退出时不清理屏幕 |
| `-R` | 显示原始控制字符（如颜色）|
| `-M` | 显示更多提示信息 |
| `+/pattern` | 从匹配模式开始 |
| `+G` | 直接跳转到文件末尾 |

##### 操作

###### 导航命令

| 按键 | 功能 |
| - | - |
| `空格`或`f` | 向前翻一页 |
| `b` | 向后翻一页 |
| `u` | 向后翻半页 |
| `Enter`或`e`或`j` | 向前一行 |
| `y`或`k` | 向后一行 |
| `g` | 跳到文件开头 |
| `G` | 跳到文件末尾 |
| `10g` | 跳到第10行 |
| `50%` | 跳到文件的50%位置 |

###### 搜索命令

| 按键 | 功能 |
| - | - |
| `/pattern` | 向前搜索匹配模式 |
| `?pattern` | 向后搜索匹配模式 |
| `n` | 重复上一次搜索（同方向）|
| `N` | 重复上一次搜索（反方向）|
| `&pattern` | 仅显示匹配的行 |
| `Esc+u` | 关闭高亮显示 |

###### 文件操作

| 按键 | 功能 |
| - | - |
| `:e file` | 打开新文件 |
| `:n` | 查看下一个文件（多文件时）|
| `:p` | 查看上一个文件（多文件时）|
| `:x` | 查看第一个文件 |
| `h` | 显示帮助 |
| `q`或`ZZ` | 退出 |

###### 标记和跳转

| 按键 | 功能 |
| - | - |
| `mchar` | 用字母标记当前位置 |
| `'char` | 跳转到标记的位置 |
| `''` | 跳转到上次的位置 |

###### 特殊功能

| 按键 | 功能 |
| - | - |
| `v` | 用默认编辑器打开当前文件 |
| `!command` | 执行shell命令 |
| `s file` | 保存当前内容到文件 |
| `F` | 跟随模式（实时查看日志，类似`tail -f` |

##### 使用示例

1.查看文件并显示行号

```bash
less -N lgofile.txt
```

2.查看压缩文件

```bash
# less可以直接查看压缩文件
less access.log.gz
less error.log.bz2
zcat file.gz | less # 替代方法
```

3.实时监控日志（跟随模式）

```bash
less +F /var/lgo/syslog
# 按 ^C 停止跟随，再按F恢复
```

4.查看命令输出

```bash
# 保留颜色输出
ls --color=always | less -R
grep --color=always "error" log.txt | less -R

# 查看进程，按内存排序
ps aux --sort=-%mem | less
```

5.查看多个文件

```bash
less file1.txt file2.txt file3.txt
# 使用 :n 和 :p 在文件间切换
```

6.查看文件特定部分

```bash
# 只查看包含"ERROR"的行
less -p ERROR log.txt

# 查看第100-200行
less +100 -p200 log.txt  # 从100行开始，显示到200行附近
```

7.在less中执行命令

```bash
# 在 less 中按 ! 然后输入命令
!ls -la  # 查看当前目录，按回车返回less
```

#### 为什么需要分页器

- `more`几乎不用
- `less`广泛使用
- `most`另一个分页器，功能介于more和less之间
- `bat` 现代替代品，需要安装

分页器在特定场景下有不可替代的作用

- 只读查看
- 启动和退出速度快
- 可通过管道

### `head`/`tail`

#### `head`

查看文件开头

##### 基本用法

```bash
# 查看文件前10行（默认）
head filename.txt

# 查看指定行数（如5行）
head -n 5 filename.txt
head -5 filename.txt # 简写形式
```

##### 常用选项

```bash
# 查看前100个字节
head -c 100 filename.txt

# 查看前1KB的内容
head -c 1k filename.txt

# 查看前1MB的内容
head -c 1M filename.txt

# 查看多个文件
head file1.txt file2.txt

# 显示文件名标题
head -v filename.txt

# 不显示文件名标题（默认多个文件时才显示）
head -q file1.txt file2.txt
```

#### `tail`

查看文件结尾

##### 基本用法

```text
# 查看文件最后10行（默认）
tail filename.txt

# 查看指定行数（如20行）
tail -n 20 filename.txt
tail -20 filename.txt # 简写形式
```

##### 常用选项

```bash
# 实时监控文件变化（日志监控神器）
tail -f /var/log/syslog
# 当文件新增内容时，实时输出

# 监控文件变化，即使文件被重命名或重新创建
tail -F /var/log/app.log

# 查看最后100个字节
tail -c 100 filename.txt

# 从第10行开始显示到文件末尾
tail -n +10 filename.txt

# 查看最后50行并实时监控
tail -n 50 -f access.log
```

#### 示例

```bash
# 查看第11-20行（先取前20行，再取最后10行）
head -n 20 file.txt | tail -n 10

# 查看第5到15行
sed -n '5,15p' file.txt # 替代方法
```

### `wc`

`wc`(word count) 用来统计输出中的

- 行数(lines)
- 单词数(words)
- 字节数(bytes)
- 字符数(chars)

默认输出三项

```bash
wc file.txt
```

输出

```text
 120     900     6321 file.txt
lines   words   bytes
```

#### 常用参数

- `-l` 行数
- `-w` 单词数
- `c` 字节数
- `m` 字符数（考虑Unicode）

只看行数

```bash
wc -l main.cpp
```

同时看多个

```bash
wc -l -w main.cpp
```

#### 底层本质

```bash
wc -l
```

统计的是换行符`\n`数量

```bash
echo "你好" | wc -c # 7
echo "你好" | wc -m # 3
```

- `-c`是UTF-8字节数
- `-m`是实际字符数

`wc`本质就是一个

```c
while(read(buf)) {
    count '\n'
    count space-sep words
    count bytes
}
```

- 顺序IO
- 状态机（单词边界判断）

- 时间复杂度：O(n
- 空间复杂度：O(1)

也就是说，`wc`是最理想的流式算法范例

### `grep`

`grep`(Global Regular Expression Print)，从文本流中，按规则筛选你想要的行

`grep`接受两种输入：

1. 文件参数：grep pattern filename
2. 标准输入：其他命令的输出

示例

```bash
grep "ERROR" server.log
```

在`server.log`中，找出包含ERROR的所有行

#### 参数

- `-i` 忽略大小写
- `-n` 显示行号
- `-v` 取反（显示不匹配的行）
- `-r` 递归目录
- `-l` 只显示文件名
- `-L` 只显示不包含匹配项的文件名
- `-c` 统计匹配行数
- `-E` 扩展正则
- `-F` 当作普通字符串（不解析正则）
- `-w` 精确匹配整个单词
- `-x` 精确匹配整行
- `-o` 只显示匹配部分
- `-h` 不显示文件名前缀
- `-H` 显示文件名前缀（默认）
- `A NUM` 显示匹配行后的NUM行
- `B NUM` 显示匹配行前的NUM行
- `C NUM` 显示匹配行先后各NUM行


#### grep与正则表达式

正则表达式是grep的灵魂

##### 1. 匹配任意一个字符

```bash
grep "pla.er" file.txt
```

匹配

- player
- placer
- plaXer

##### 2. 行首/行尾

```bash
grep "^ERROR" log.txt
```

以ERROR开头

```bash
grep "failed$" log.txt
```

以failed结尾

##### 3. 数量限定（需要-E）

```bash
grep -E "a{3,5}" file.txt
```

匹配

- aaa
- aaaa
- aaaaa

##### 4. 或条件

```bash
grep -E "ERROR|WARN" log.txt
```

#### 其他

##### 1. 显示高亮

```bash
grep --color=auto ERROR log.txt
```

##### 2. 显示上下文

```bash
grep -C 3 ERROR log.txt
```

显示错误行前后3行

##### 3. 多条件过滤

```bash
grep ERROR log.txt | grep timeout
```

等价于：同时包含ERROR和timeout

#### 底层本质

grep本质是

```c
while(read_line()) {
    if (regex_match(line))
        print(line);
}
```

关键是

- 正则状态机（DFA/NFA）
- 流式处理
- 不缓存全文件

### `touch`

`touch`用来创建空文件，或者修改文件的时间戳（时间属性）

它主要做两件事情

1. 文件不存在 -> 创建新文件
2. 文件存在 -> 更新访问时间/修改时间

#### 常见用法

##### 创建空文件

```bash
touch a.txt
```

效果

- 如果`a.txt`不存在 -> 创建一个0字节文件
- 如果存在 -> 不改内容，只改时间

等价于

```bash
> a.txt
```

但`touch`更语义化，也更安全

##### 一次创建多个文件

```bash
touch a.txt b.txt c.txt
```

#### 时间戳相关

Linux每个文件至少有三个时间

| 时间 | 含义 |
| - | - |
| atime | 最后访问时间 |
| mtime | 最后修改内容时间 |
| ctime | 最后状态改变时间（权限等）|

`touch`主要影响的是

- atime
- mtime

##### 1. 只改访问时间

```bash
touch -a file.txt
```

##### 2. 只改修改时间

```bash
touch -m file.txt
```

##### 3. 设置为指定时间

```bash
touch -t 202401231530 file.txt
```

格式

```
YYYYMMDDhhmm
```

###### 4. 对齐另一个文件的时间

```bash
touch -r source.txt target.txt
```

让`target.txt`的时间戳=`source.txt`

#### 本质

`touch`就是一次`open + utimensat`系统调用封装

核心行为

1. 如果文件不存在 -> `open(0_CREAT)`
2. 如果存在 -> `utime / utimensat` 修改inode时间戳


### `diff`

`diff`用来比较两个文件（或目录），输出它们之间的差异(difference)

#### 基本用法

比较两个文件

```bash
diff a.txt b.txt
```

输出的是行级别的差异

a.txt

```text
hello
world
```

b.txt

```text
hello
linux
world
```

diff输出

```text
1a2
> linux
```

意思是：在a.txt的第1行后，增加了一行`linux`

#### 统一格式

```bash
diff -u a.txt b.txt
```

输出（unified diff）

```diff
--- a.txt
+++ b.txt
@@ -1,2 +1,3 @@
 hello
+linux
 world
```

- `--- a.txt` 原文件名
- `+++ b.txt` 新文件名
- `@@ -1,2 +1,3 @@` hunk header
  - 格式是固定的 `@@ -old_start,old_len +new_start,new_len @@`
  - `-1,2` 旧文件：从第1行开始，共2行
  - `+1,3` 新文件：从第1行开始，共3行

这就是Git, patch, code review, PR背后统一使用的格式

`git diff`本质上就是一个高级版的diff + 内部算法 + 语义增强

输出符号

| 符号 | 含义 |
| - | - |
| `+` | 新增 |
| `-` | 删除 |
| ` ` | 未变化 |
| `@@` | 变更块位置 |
| `---` | 原文件 |
| `+++` | 新文件 |

#### 目录diff

```bash
diff -r dir1 dir2
```

递归比较整个目录树

比如用于比较两次构建产物差哪了

#### 参数

| 参数 | 含义 |
| `-u` | 统一格式 |
| `-r` | 递归比较目录 |
| `-q` | 只告诉你是否不同 |
| `-w` | 忽略所有空白 |
| `-b` | 忽略多个空格差异 |
| `-B` | 忽略空行 |
| `-i` | 忽略大小写 |
| `-I` | 忽略匹配行 |

#### diff背后的算法

diff本质是一个经典CS问题：最长公共子序列（LCS）

给你两行文本

```text
A B C D E F
A B X D E Y
```

找最长公共子序列

```text
A B D E
```

然后推导出

- C -> X 是修改
- F -> Y 是修改

这就是diff的数学本质

Git内部是优化版

- Myers diff algorithm
- O(ND)时间复杂度

## 打包压缩

[Compress_Archive](~/unix-like/docs/linux/Compress_Archive.md)

## 权限与用户
- `chmod`：修改权限
- `chown`：修改文件所有者
- `id`：查看当前用户信息
- `whoami`：当前登录的用户名
- `su`：切换用户
- `sudo`：以管理员权限执行命令
- `hostname`：显示或设置系统主机名
- `last`：显示用户登录日志
- `history`：显示命令历史记录
- `passwd`：修改用户密码
- `exit`/`logout`：退出当前登录会话
- `shutdown`：关闭或重启系统
- `reboot`：重启系统
- `useradd`/`adduser`：添加新用户
- `usermod`：修改用户属性
- `userdel`：删除用户

## 系统与进程管理
- `ps`：查看进程
- `top`/`htop`：实时监控系统资源
- `kill`：终止进程
- `pkill`：按进程名终止进程
- `bg`/`fg`：将进程置于后台/前台运行
- `jobs`：查看当前后台任务列表
- `nohup`：使进程在用户退出登录后继续运行
- `df`：查看磁盘空间
- `du`：统计目录大小
- `uptime`：系统运行时间
- `uname`：显示系统信息
- `date`：显示或设置系统时间
- `mount`/`umount`：挂载/卸载文件系统

## [输入输出与管道](InputOutputPipelines.md)

## 常用工具命令
- `find`：查找文件
- `sort`：排序
- `uniq`：去重
- `cut`：按列截取
- `xargs`：批量传递参数
- `awk`：文本处理利器
- `sed`：流编辑器，做文本替换、删除

## 网络相关
- `ping`：测试网络
- `curl`/`wget`：下载文件、调接口
- `scp`：跨机器复制文件
- `ssh`：远程登录
- `ifconfig`/`ip`：查看和配置网络接口
- `netstat`：显示网络状态信息
- `ss`：比`netstat`更快，功能类似

## [软件包管理](AdvancedPackageToolSeries.md)

## 帮助
- `--help`：命令自带的帮助
  - 定位：命令行内置的简易帮助
  - 用法：`ls--help`
  - 特点：
    - 内容最短小，直接列出常用参数
    - 基本上每个GNU命令都会支持
    - 不需要跳页，结果一屏幕看完，查参数非常快
- `man`：manual
  - 定位：Unix传统命令参考手册
  - 用法：`man ls`就能看到`ls`命令的完整文档
  - 特点：
    - 内容比较标准化，每个命令的介绍基本都包括：NAME、SYNOPSIS、DESCRIPTION、OPTIONS、EXAMPLES
    - 结构清晰，适合快速查参数
  - 小技巧：
    - 翻页：空格（下翻），`b`（上翻）
    - 搜索：`/关键字`
    - 跳出：`q`
- `info`：GNU info文档
  - 定位：GNU项目提供的“扩展手册”，比`man`更详细
  - 用法：`info ls`
  - 特点：
    - 支持“超链接”导航，像一本电子书，可以在不同章节间跳转
    - 内容往往比`man`全，比如`coreutils`的命令（`ls`,`cp`,`mv`等）在`info`里有更完整的介绍和教程感
  - 操作方式：
    - `n`=next（下一章），`p`=previous（上一章），`u`=up（回到上层），`q`=quit

## 命令查看
- `compgen`（在Bash下）
  - `-c`：列出当前Shell能执行的所有命令（内置 + 外部）
  - `-b`：列出所有内置命令
  - `-a`：列出所有别名
- `ls /bin /usr/bin /usr/local/bin`：列出这些目录里的可执行文件（大多数命令就在那里）
- `which <命令>`：查看某个命令的真实路径
