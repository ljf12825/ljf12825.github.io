---
title: config
date: 2025-12-31
author: ljf12825
type: file
summary: git config
---

## 配置作用域

Git的配置文件不是只有一个，而是分三层，优先级从高到低是

```txt
项目级 > 用户级 > 系统级
```

### 项目级

位于`.git/config`，具有最高优先级，只对当前仓库生效。用`--local`参数标识。通常存的是

- 这个仓库专用的用户名和邮箱
- 项目特定的`remote`地址
- Git hooks 路径
- 子模块配置

### 用户级

位于`~/.gitconfig`。对当前用户的所有仓库生效。用`--global`参数标识。通常存的是

- 全局的用户名和邮箱
- 个人常用的 alias
- diff/merge 工具的偏好
- GPG签名密钥

### 系统级

位于`etc/gitconfig`，最低优先级，对所有用户的所有仓库生效。用`--system`标识。一般公司或团队做统一配置时会用到，个人很少碰

### 用命令操作三层

读取配置时，Git自动合并三层，高优先级覆盖低优先级

```bash
# 查看生效的最终值（已经合并三层后的结果）
git config <key>

# 查看某一层的原始值
git config --local <key> # 项目级
git config --global <key> # 用户级
git config --system <key> # 系统级

# 写入某一层
git config --local user.name "Project Name" # 写入 .git/config
git config --global user.name "My Name" # 写入 ~/.gitconfig
git config --system user.name "Admin" # 写入 /etc/gitconfig

# 查看某一层的整个文件
git config --local --list
git config --global --list
git config --system --list
```

### 配置文件格式

配置文件采用INI风格，由节(section)和键值对组成

基本结构

```ini
[section]
    key = value
```

节名用方括号包裹，键值对缩进写在节下面，等号两边空格可选

带子节(subsection)

```ini
[branch "main"]
    remote = origin
```

子节名用双引号包裹，大小写敏感（节名本身大小写不敏感）。常用于`remote`, `branch`, `submodule`等需要具名的场景

注释
```ini
# 以`#`或`;`开头的行都是注释
[core]
    autocrlf = input # 仅在提交时转换
```

值的类型

- 字符串：直接写，含空格时加引号`"my value"`
- 布尔：`true`/`false`，也接受`yes`/`no`, `on`/`off`, `1`/`0`
- 整数：支持`k`, `m`, `g`后缀，如`pack.packSizeLimit = 100m`

多值（同一key出现多次）

```ini
[remote "origin"]
    fetch = +refs/heads/*:refs/remotes/origin/*
    fetch = +refs/pull/*:refs/remotes/origin/pr/*
```

同一key可以重复，`git config --get-all`可以读出全部值

转译字符

值里的特殊字符用反斜杠转义：`\\`表示反斜杠，`\"`表示双引号，`\n`表示换行，`\t`表示Tab

`include` 无条件引入

`~/.gitconfig`里可以用`include`引入额外文件

```ini
[include]
    path = ~/.gitconfig.local    # 机器特定的配置
    path = ~/.gitconfig.company  # 公司项目的通用配置
```

Git读到这里时，会把指定文件的内容“内联”进来，效果等同于直接写在原文件里。路径支持`~`和相对路径（相对于当前配置文件所在目录）

`includeIf`条件引入

根据条件决定是否加载某个配置文件

```ini
[includeIf "条件:值"]
    path = ~/.gitconfig_xxx
```

常用条件类型

`gitdir`：匹配仓库的`.git`目录路径

```ini
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig_work

[includeIf "gitdir:~/personal/"]
    path = ~/.gitconfig_personal
```

`~/work/`下的所有仓库自动用工作账号，`~/personal/`下用个人账号。路径末尾的`/`表示匹配该目录及其所有子目录

`onbranch`：匹配当前分支名

```ini
[includeIf "onbranch:release/**"]
    path = ~/.gitconfig_release
```

在`release/`开头的分支上，自动加载额外配置

环境变量覆盖

Git读取配置文件的路径本身可以被环境变量替换。优先级高于默认路径

| 环境变量 | 作用 |
| - | - |
| `GIT_CONFIG_SYSTEM` | 覆盖系统级配置文件路径 |
| `GIT_CONFIG_GLOBAL` | 覆盖用户级配置文件路径 |
| `GIT_CONFIG_NOSYSTEM` | 设为`1`时完全跳过系统级配置 |
| `GIT_CONFIG_COUNT` + `GIT_CONFIG_KEY_n` / `GIT_CONFIG_VALUE_n` | 临时注入键值对，不修改任何文件 |

最后一个适合CI/CD场景临时传入配置

```bash
GIT_CONFIG_COUNT=2 \
GIT_CONFIG_KEY_0=user.name \
GIT_CONFIG_VALUE_0="CI Bot" \
GIT_CONFIG_KEY_1=user.email \
GIT_CONFIG_VALUE_1="ci@example.com" \
git commit -m "automated commit"
```

进程结束配置就会消失，不需要修改任何配置文件

## 常用配置文件字段和对应命令参数

### 身份配置

`user.name` 提交作者名

```ini
[user]
    name = ljf12825
```

等价命令

```bash
git config --global user.name "ljf12825"
```

对应提交对象里的 `author`, `committer`，只影响后续新提交，不会修改历史commit

`user.email` 提交作者邮箱

```ini
[user]
    email = xxx@example.com
```

等价命令

```bash
git config --global user.email "xxx@example.com"
```
