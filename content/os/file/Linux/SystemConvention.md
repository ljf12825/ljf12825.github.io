---
title: system conventions
date: 2026-01-14
draft: false
summary: $PATH, $HOME, env, alternatives
---

# SystemConventions 

## 环境变量(Environment Variables)
- 定义：环境变量是存储在操作系统中的动态值，可以呗运行在系统上的程序访问。它们用于配置程序的行为，存储系统路径、用户偏好、临时数据等
- 特性
   - 继承性：子进程继承父进程的环境变量
   - 键值对结构：`KEY=value`格式
   - 字符串类型：所有值都以字符串形式存储
   - 进程级作用域：每个进程有自己的环境变量副本

### 重要环境变量
1. 常用核心环境变量
   - `PATH`：可执行文件的搜索路径
   - `HOME`：当前用户的主目录
   - `USER`：当前用户名
   - `SHELL`：当前shell的路径
   - `PWD`：当前工作目录
   - `OLDPWD`：上一次的工作目录
   - `LANG`：语言和字符编码设置
   - `TERM`：终端类型
2. 系统信息变量
   - `HOSTNAME`：系统主机名
   - `HOSTTYPE`：主机架构（x86_64等）
   - `OSTYPE`：操作系统类型
3. 历史与提示相关
   - `HISTSIZE`：历史命令保存数量
   - `PS1`：主提示符格式
   - `PS2`：次提示符格式（多行命令时）


### 相关命令
#### 查看环境变量
```bash 
# 查看所有环境变量
$ printenv 
$ env 

# 查看特定变量
$ echo $PATH
$ printenv HOME 

# 显示变量的定义方式
$ declare -x # 显示所有导出变量
$ set # 显示所有变量（包括环境变量和shell变量）

# 比较进程间的环境差异
$ cat /proc/$$/environ | tr '\0' '\n' # 当前shell的环境
$ cat /proc/1/environ | tr '\0' '\n' # init 进程的环境
```

#### 数据类型和限制
```bash 
# 键的命名规则（通常）
# - 大写字母、数字、下划线
# - 区分大小写

# 值的限制
$ export MYVAR="value with spaces" # 需要引号
$ export MYVAR=$(pwd) # 命令替换
$ export MYVAR=$HOME:$PATH 

# 长度限制
# 在Linux中，单个环境变量值+名称的最大长度
# - getconf ARG_MAX 查看最大值（通常2MB+）
$ getconf ARG_MAX
2097152 

# 整个环境块的总大小限制
$ xargs --show-limits 2>&1 | grep "environment" 
Maximum length of command we could actually use: 208804
```

#### 设置环境变量
```bash 
# 临时设置（仅当前shell会话有效）
export MY_VAR="value"

# 设置并立即生效（bash）
MY_VAR="value"

# 永久设置 - 添加到配置文件
```

#### 删除环境变量
```bash 
unset MY_VAR
```

#### 测试变量是否存在
```bash 
# 检查变量是否设置
if [ -z "$MY_VAR" ]; then 
    echo '变量未设置'
fi 

# 使用默认值
echo ${MY_VAR:-"默认值"}
```

### 环境变量的配置文件加载顺序
登录Shell的加载顺序
```text  
/etc/profile 
v 
~/.bash_profile 
~/.bash_login 
~/.profile（仅加载第一个存在的）
v
~/.bashrc 
v 
/etc/bash.bashrc
```
非登录Shell
```text 
~/bashrc 
v 
/etc/bash.bashrc
```

### 环境变量的生命周期和作用域
#### 作用域层次
```text 
系统级作用域（所有用户）
|__ /etc/environment 
|__ /etc/profile
|__ /etc/profile.d/*.sh 
|
用户级作用域
|__ ~/.profile（登录shell）
|__ ~/.bash_profile（Bash登录）
|__ ~/.bashrc（交互式shell）
|__ ~/.bash_logout（退出时）
|
会话级作用域
|__ 当前shell会话中设置
|__ 脚本执行时设置
|
进程级作用域
|__ 进程启动时继承+可修改
```

#### 继承机制
```bash 
# 演示环境变量继承
$ export PARENT_VAR="parent_value"

# 方式1：直接执行（继承环境）
$ bash -c 'echo Child sees: $PARENT_VAR'

# 方式2：env命令（可以修改继承的环境）
$ env PARENT_VAR="changed" bash -c 'echo Child sees: $PARENT_VAR'

# 方式3：清空环境后执行
$ env -i bash -c 'echo Child sees: $PARENT_VAR; echo Total vars: $(env | wc -l)'

# 查看进程环境树
$ pstree -p $$
$ cat /proc/<PID>/environ | tr '\0' '\n'
```

### 环境变量的作用

环境变量在Linux系统中起着至关重要的作用，它们就像系统的"记忆"和"配置中心"，影响和控制系统及应用程序的行为。以下是环境变量的主要作用：

#### 系统配置与行为控制

**程序路径查找**
```bash
# PATH变量决定系统在哪里查找可执行文件
echo $PATH
# 输出示例：/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin

# 当输入命令时，系统按PATH顺序查找
ls  → 系统依次查找：
    1. /usr/local/sbin/ls
    2. /usr/local/bin/ls
    3. /usr/sbin/ls
    4. /usr/bin/ls（找到！）
```

**用户环境配置**
```bash
# HOME - 确定用户主目录
echo $HOME  # /home/username

# SHELL - 指定默认shell
echo $SHELL # /bin/bash

# EDITOR - 设置默认文本编辑器
export EDITOR=vim  # 许多程序会使用此编辑器
```

**语言和区域设置**
```bash
# 控制程序显示语言
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 时区设置
export TZ="Asia/Shanghai"
```

#### 程序运行与交互控制

**程序行为定制**
```bash
# 控制程序输出详细程度
export DEBUG=1
export VERBOSE=true

# 设置程序配置路径
export MYAPP_CONFIG="/etc/myapp/config.yaml"

# 控制颜色显示
export CLICOLOR=1  # macOS/Linux颜色支持
export LS_COLORS="di=1;36:ln=35:so=32:pi=33"
```

**开发与编译环境**
```bash
# C/C++开发
export CC=gcc
export CXX=g++
export CFLAGS="-O2 -Wall"
export LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"

# Python开发
export PYTHONPATH="/my/project:$PYTHONPATH"
export PYTHONUNBUFFERED=1  # 实时输出，不缓冲

# Java开发
export JAVA_HOME="/usr/lib/jvm/java-11-openjdk"
export CLASSPATH=".:$JAVA_HOME/lib"
```

**网络与代理配置**
```bash
# HTTP代理设置
export http_proxy="http://proxy.company.com:8080"
export https_proxy="http://proxy.company.com:8080"
export no_proxy="localhost,127.0.0.1,.internal"

# 网络超时设置
export FTP_TIMEOUT=60
export CURL_TIMEOUT=30
```

#### 系统管理与监控
**Shell行为控制**
```bash
# 历史命令设置
export HISTSIZE=10000      # 内存中保存的历史数量
export HISTFILESIZE=20000  # 历史文件中的命令数量
export HISTCONTROL=ignoreboth  # 忽略重复命令和空格开头的命令

# 提示符定制
export PS1='\[\e[1;32m\]\u@\h\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ '
```

**系统资源管理**
```bash
# 控制文件描述符限制
ulimit -n  # 查看限制
# 可通过环境变量设置某些程序的资源限制

# 内存分配控制
export MALLOC_ARENA_MAX=2  # 限制glibc内存分配
```

#### 安全与权限

**安全相关配置**
```bash
# SSH配置
export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/ssh-agent.socket"

# 密码安全
export PASSWORD_STORE_DIR="$HOME/.password-store"

# 避免敏感信息泄露
export HISTIGNORE="*password*:*secret*"  # 不记录包含密码的命令
```

**用户身份与权限**
```bash
# 用户和组信息
echo $USER    # 当前用户名
echo $UID     # 用户ID
echo $GROUPS  # 用户所属组

# Sudo相关
export SUDO_EDITOR=vim  # sudoedit使用的编辑器
```

#### 软件开发与构建
**构建系统控制**
```bash
# Make构建控制
export MAKEFLAGS="-j4"  # 并行编译，使用4个核心

# CMake配置
export CMAKE_BUILD_TYPE="Release"
export CMAKE_PREFIX_PATH="/opt/custom/libs"

# Docker构建
export DOCKER_BUILDKIT=1  # 启用BuildKit
```

**版本控制**
```bash
# Git配置
export GIT_AUTHOR_NAME="Your Name"
export GIT_AUTHOR_EMAIL="your@email.com"
export GIT_EDITOR=vim

# 代码仓库位置
export REPO_BASE="$HOME/repositories"
```

#### 应用程序特定配置

**数据库连接**
```bash
# PostgreSQL
export PGHOST="localhost"
export PGPORT=5432
export PGDATABASE="mydb"
export PGUSER="myuser"

# MySQL
export MYSQL_HOST="localhost"
export MYSQL_PWD="password"  # 注意安全！
```

**Web开发**
```bash
# Node.js开发
export NODE_ENV="development"
export NODE_PATH="/usr/lib/node_modules"

# Ruby on Rails
export RAILS_ENV="production"
export SECRET_KEY_BASE="your-secret-key"

# Django
export DJANGO_SETTINGS_MODULE="myproject.settings"
```

#### 系统信息传递
**进程间通信**
```bash
# 父进程 → 子进程传递信息
export TASK_ID="12345"
export JOB_NAME="daily_backup"

# 脚本执行时传递参数
./script.sh
# 在script.sh中可以通过环境变量获取配置
```

**容器化环境**
```bash
# Docker容器内部
# 传递配置到容器
docker run -e "DATABASE_URL=postgres://..." myapp

# Kubernetes Pod环境变量
# 在Deployment中定义
# env:
# - name: DATABASE_HOST
#   value: "postgres-service"
```

#### 调试与故障排除
**调试信息输出**
```bash
# 启用详细日志
export DEBUG="app:*"  # 特定模块的debug
export NODE_DEBUG="http,net"  # Node.js调试
export PYTHONDEBUG=1  # Python调试

# 性能分析
export LD_DEBUG="libs"  # 动态链接器调试
export MALLOC_CHECK_=3  # 内存分配检查
```

**兼容性设置**
```bash
# 向后兼容
export GNUTLS_CPUID_OVERRIDE=0x1  # 特定加密库设置

# 特定程序兼容
export GTK_IM_MODULE="ibus"  # 输入法框架
export QT_IM_MODULE="ibus"
```

##### 实际应用场景示例
1. 开发环境设置
```bash
# 在~/.bashrc中设置开发环境
export DEV_HOME="$HOME/development"
export PATH="$DEV_HOME/bin:$PATH"
export GOPATH="$DEV_HOME/go"
export PYTHONPATH="$DEV_HOME/python:$PYTHONPATH"
export NODE_PATH="$DEV_HOME/node_modules"
alias devenv="cd $DEV_HOME && source venv/bin/activate"
```

2. 多版本管理
```bash
# 切换Python版本
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# 使用特定版本
pyenv global 3.9.1
```

3. 项目特定配置
```bash
# 项目启动脚本 project_env.sh
#!/bin/bash
export PROJECT_NAME="myproject"
export DATABASE_URL="postgresql://localhost/$PROJECT_NAME"
export LOG_LEVEL="INFO"
export SECRET_KEY="$(openssl rand -hex 32)"
export DEBUG="false"

# 激活项目环境
source project_env.sh
```

### 环境变量的核心价值总结

1. **灵活性** - 无需修改代码即可改变程序行为
2. **隔离性** - 不同环境使用不同配置，互不干扰
3. **可移植性** - 配置与代码分离，便于迁移
4. **安全性** - 敏感信息（如密码）可以环境变量形式传递，不写入代码
5. **动态性** - 运行时可以动态修改，立即生效
6. **层次性** - 系统级、用户级、会话级、进程级的多层配置

环境变量是Linux生态系统的重要组成部分，它们提供了一种简单而强大的方式来配置和控制系统的各个方面，从最简单的命令行工具到复杂的分布式系统都离不开环境变量的支持。


## Alternatives 
Alternatives是Linux系统中用于管理多个软件版本或实现的工具。它允许系统存在同一个命令的多个版本（如python2和python3），并通过符号链接动态切换默认版本

### 核心概念
1. 主要组件
```bash 
# 管理命令
update-alternatives #Debian/Ubuntu/RHEL 8+ 
alternatives # RHEL/CentOS 7 及更早版本

# 管理目录
/etc/alternatives # 所有 alternatives的符号链接
/var/lib/dpkg/alternatives # Debian 系配置数据库
/var/lib/alternatives # RHEL 系配置数据库
```

2. 工作原理
```text 
实际程序路径：/usr/bin/python3.12
                /usr/bin/python3.10 
                /usr/bin/python2.7
                v 
Alternatives 链接: /etc/alternatives/python 
                v 
系统命令路径：/usr/bin/python
```

### 基本使用命令
1. 查看已注册的alternatives
```bash
# 查看所有
update-alternatives --get-selections 

# 查看特定命令
update-alternatives --list python
update-alternatives --display python 

# 查看当前选择
ls -l /usr/bin/python 
ls -l /etc/alternatives/python 
```

2. 注册新alternative
```bash 
# 语法：--install <链接> <名称> <路径> <优先级> 
update-alternatives --install /usr/bin/python python /usr/bin/python3.9 100 

# 详细示例
update-alternatives --install \
    /usr/bin/python \ # 系统命令路径
    python \ # alternatives名称
    /usr/bin/python3.9 \ # 实际程序路径
    100 \ # 优先级
    --slave /usr/share/man/man1/python.1.gz python-man /usr/share/man/man1/python3.9.1.gz 
```

3. 切换版本
```bash 
# 交互式选择
update-alternatives --config python

# 输出示例：
# There are 2 choices for the alternative python (providing /usr/bin/python).
# 
#   Selection    Path                Priority   Status
# ------------------------------------------------------------
# * 0            /usr/bin/python3.9   100       auto mode
#   1            /usr/bin/python2.7   50        manual mode
#   2            /usr/bin/python3.9   100       manual mode
# 
# Press <enter> to keep the current choice[*], or type selection number: 2

# 自动选择最高优先级
update-alternatives --auto python

# 手动设置特定版本
update-alternatives --set python /usr/bin/python2.7
```

4. 删除alternative
```bash 
# 移除一个选项
update-alternatives --remove python /usr/bin/python2.7 

# 完全移除所有配置
update-alternatives --remove-all python 
```

### 使用示例
#### 管理Python版本
```bash 
# 1. 安装多个 Python 版本
sudo apt install python2.7 python3.9 python3.10

# 2. 注册所有版本到 alternatives
sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 50
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.9 100
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.10 110

# 3. 配置关联的 man page（从属链接）
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.9 100 \
  --slave /usr/share/man/man1/python.1.gz python-man /usr/share/man/man1/python3.9.1.gz

# 4. 查看当前配置
update-alternatives --query python

# 5. 切换版本
sudo update-alternatives --config python
```

#### 管理编辑器
```bash 
# 注册多个编辑器
sudo update-alternatives --install /usr/bin/editor editor /usr/bin/vim 100 
sudo update-alternatives --install /usr/bin/editor editor /ur/bin/nano 50 
sudo update-alternatives --install /usr/bin/editor editor /usr/bin/emacs 25 

# 设置默认编辑器
sudo update-alternatives --set editor /usr/bin/vim 

# 在其他程序中使用（如visudo 会使用 editor 变量）
export EDITOR=$(which editor)
```

### 高级用法
#### 从属链接（Slave Links）
```bash 
# 为主命令配置相关的从属命令
update-alternatives --install /usr/bin/python python /usr/bin/python3.9 100 \
  --slave /usr/bin/python-config python-config /usr/bin/python3.9-config \
  --slave /usr/bin/pip pip /usr/bin/pip3.9 \
  --slave /usr/share/man/man1/python.1.gz python-man /usr/share/man/man1/python3.9.1.gz

# 这样切换 python 时，python-config、pip 和 man page 会自动切换
```

#### 优先级系统
优先级决定自动模式下的选择，数字越大优先级越高，auto模式会选择最高优先级的版本\
设置优先级策略
- 稳定版：1000 
- 测试版：500 
- 旧版本：100 
- 开发版：50

#### 手动模式 vs 自动模式
```bash 
# 查看模式
update-alternatives --display python | grep mode 

# 手动模式：用户明确选择了版本
# 自动模式：系统使用最高优先级的版本

# 切换回自动模式
update-alternatives --auto python
```

#### 使用groups（组管理）
```bash 
# 创建组（某些系统支持）
update-alternatives --install-group java-group

# 将相关命令加入组
update-alternatives --add-to-group java java-group
update-alternatives --add-to-group javac-group 

# 一次性切换组内所有命令
update-alternatives --set-group java-group /usr/lib/jvm/java-17-openjdk/
```

### 配置文件和数据库
1. Debian系（/var/lib/dpkg/alternatives)
```bash 
# 查看 python 的配置
cat /var/lib/dpkg/alternatives/python

# 示例内容：
# auto
# /usr/bin/python3.9
# 
# /usr/bin/python
# python.1.gz
# 
# /usr/bin/python2.7
# 
# /usr/bin/python3.9
```

2. RHEL系（/var/lib/alternatives）
```bash 
# 二进制格式存储，使用 alternatives 命令查看
alternatives --display python
```

### 注意事项
不要随意把`python`/`gcc`/`ld`切到非发行默认版本，可能破坏系统工具，这是由Linux发行版的工程假设决定的\
发行版不是“一堆独立软件”，而是一个强耦合系统\
以Ubuntu/Debian为例，发行版在构建时隐含了大量硬性假设
- `/usr/bin/python`：是某一个确定语义的Python 
- `/usr/bin/gcc`：是某一代ABI兼容的GCC 
- `/usr/bin/ld`：是与glibc/binutils完全匹配的linker 

这些不是“推荐版本”，而是系统工具链的组成部分。通过`update-alternatives`改的不是“你自己的工具”，而是：整个系统赖以运行的公共基础设施入口

`python`，系统工具直接依赖`/usr/bin/python`，大量系统组件写死了shebang
```bash 
#!/usr/bin/python 
```
典型的例子
- `apt`
- `add-apt-repository`
- `update-alternatives`
- `lsb_release`
- `software-properties-*`

这些脚本不是普通应用，而是
- 在安装阶段运行
- 在系统修复阶段运行
- 在无GUI/最小环境下运行

Python版本 != 语法兼容，一旦把`/usr/bin/python -> python3.12`而系统脚本仍假设`python == Python 3.x with distro patches`，结果只有一个：脚本在关键路径直接崩溃\
这是不可恢复的，最危险的一点：崩溃的正是用来修系统的工具本身，例如`apt`启动失败，`update-alternatives`本身报错，无法再用包管理器恢复

`gcc`/`ld`更危险，但更隐蔽\
`gcc`不是一个编译器，而是ABI决策者\
发行版构件时固定了
- GCC主版本
- 默认`libstdc++`ABI
- 默认`libgcc_s`
- 默认`crt*.o` 

系统中几乎所有C/C++程序都假设：用系统GCC编译 == 与系统glibc / libstdc++ ABI匹配\

`ld`（或`ld.gold`/`ld.lld`）直接决定
- ELF重定位方式
- 动态链接器交互
- TLS/RELRO/PIE行为

发行版的glibc是按特定binutils版本测试的

`update-alternatives`的设计目标不是“开发者玩具”，它的原始用途是
- `vi`/`vim`
- `editor`
- `pager`
- `java` 

这些命令的共同点，系统本身不依赖其具体语义，只是用户工具

但`python/gcc/ld`不满足这个前提\
它们是构建期依赖，启动期依赖，系统维护期依赖\
换句话说，alternatives假设“切换不会影响系统稳定性”，而python/gcc/ld恰恰违反了这个假设

#### 正确做法
1. Python：永远不要用alternatives
正确方式：
- `/usr/bin/python3`：系统Python 
- `python3.12`：显式版本
- `pyenv/venv/poetry`：用户空间隔离

2. GCC/Clang：只在PATH层面控制
```bash 
export PATH=/opt/gcc-14/bin:$PATH
```
或
```bash
CC=gcc-14 CXX=g++-14 cmake ..
```
绝不动`/usr/bin/gcc`

3. 只有这些适合alternatives
安全区
- editor
- pager 
- x-www-browser 
- java（仍需谨慎）
- vi 

危险区
- python
- gcc 
- ld 
- make 
- cmake 
- sh 

## POSIX/SUS 
在Linux系统中，那些几乎理所当然被假设存在的基础工具和运行环境，叫做POSIX或SUS. 它们是使用者工作的基石，很多脚本和软件都会默认依赖它们 

### Concept

| 名词 | 层次 | 含义 | 示例 |
| - | - | - | - |
| POSIX / SUS | 标准与规范 | 官方定义了什么工具和接口必须存在及如何行为 | sh, vi, awk, grep 的标准行为 |
| GNU Coreutils | 具体实现 | Linux上最常见的POSIX工具集的具体实现包 | /bin/ls, /bin/cp (通常来自GNU coreutils包) |
| Base System | 发行版定义 | 一个特定Linux发行版能启动并运行的最小软件包集合 |	Debian的base、essential包优先级 |
| Unix Philosophy | 设计哲学 | 指导这些工具设计的思想原则 |	工具“小而专”，通过管道组合 | 
| Userland | 系统架构 | 内核之外的所有程序，包括shell和所有您假设的工具 | 与Linux内核相对的概念 |
| BusyBox | 嵌入式实现 | 为资源受限环境提供的多合一替代实现 | 路由器、Android Recovery中的工具 |
| Build-Essential | 开发环境 | 用于编译软件所假设存在的一套工具 | gcc, make, ld, libc-dev |

```text  
[ 用户自行安装的工具 ]
[ 发行版工具 ]
--------------------------
[ 系统约定接口 ]
--------------------------
[ 内核 + libc ]
```

