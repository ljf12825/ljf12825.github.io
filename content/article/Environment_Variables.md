---
title: Environment Variables
author: ljf12825
date: 2026-04-05
type: file
summary: $PATH, $HOME, env, alternatives
---

## 环境变量(Environment Variables)

- 定义：环境变量是存储在操作系统中的以一组键值对(KEY=value)形式的动态命名值，可以被运行在系统上的程序访问。它们用于配置程序的行为，存储系统路径、用户偏好、临时数据等
- 特性

| 特征 | 说明 |
| - | - |
| 键值对结构 | `PATH=/usr/bin:/bin`, KEY通常大写 |
| 字符串存储 | 所有值都是字符串，即使是数字 |
| 进程级隔离 | 每个进程有自己的环境变量副本 |
| 继承性 | 子进程继承父进程的环境变量 |
| 可修改 | 进程可以增、删、改自己的环境变量 |

环境变量是父进程告诉子进程“这个世界长什么样”的方式

### Shell变量 vs 环境变量

| 类型 | 命令 | 子进程是否继承 |
| Shell变量（局部）| `VAR=value` | 不继承 |
| 环境变量 | `export VAR=value` | 继承 |

```bash
$ LOCAL_VAR="only me"
$ export ENV_VAR="pass to child"
$ bash -c 'echo $LOCAL_VAR; echo $ENV_VAR'
# 输出：空行（LOCAL_VAR看不到） + "pass to child"
```

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

两种Shell类型

| Shell类型 | 触发场景 | 读取的配置文件 |
| - | - | - |
| 登录Shell | 输出密码登录、`su -`, `ssh` | profile类文件 |
| 非登录交互式Shell | 打开终端窗口、`bash` | `~/.bashrc` |

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
/etc/bash.bashrc（发行版不同可能有差异）
```

### 环境变量的生命周期，作用域和继承机制

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

### 安全注意事项

#### 敏感信息

敏感信息不要用环境变量传递，子进程可以通过`env`看到所有变量，`/proc/<pid>/environ`可被同用户其他进程读取（权限允许时），崩溃转储(core dump)可能包含环境变量

替代方案：

- 配置文件 + 严格权限(600)
- 密钥管理服务(Vault, AWS Secrets Manager)
- 临时文件 + 用完删除

#### PATH注入风险

```bash
# 危险：把当前目录放在PATH最前面
export PATH=".:$PATH"

# 更危险：/tmp目录
export PATH="/tmp:$PATH"
```

shell会先从当前目录或/tmp目录里查询，当前目录可能不安全，/tmp是所有人可写的\
如果有人在你执行的目录放了恶意`ls`脚本，就会出问题\
建议：当前目录用`./script`显式执行，不要放进PATH

## 总结

| 场景 | 推荐做法 |
| - | - |
| 永久环境变量 | 写入`~/.bashrc`，用`export` |
| 登录时一次性任务 | 写入`~/.profile` |
| 脚本内部 | 使用`export`或直接在命令前赋值`VAR=value cmd` |
| 临时覆盖 | `PATH=/custom/bin:$PATH ./my_script` |
| 敏感信息 | 不要用环境变量，用配置文件 + 控制权限 |
| 跨多个项目的不同配置 | 用`direnv`或`dotenv`这类目录级环境管理工具 |
