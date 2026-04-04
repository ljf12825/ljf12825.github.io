---
title: Abstract Command
author: ljf12825
date: 2026-04-04
type: file
summary: POSIX interface utility implemented as a wrapper/dispatcher with late binding
---

- xdg-open

## 统一接口

## 编译器前端名

## POSIX规范接口

## 环境分法器(dispatcher)

## Alternatives 系统

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
