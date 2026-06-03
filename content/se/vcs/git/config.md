---
title: config
date: 2025-12-31
author: ljf12825
type: file
summary: git config
---

<https://git-scm.com/docs/git-config>

`git config`是Git用来设置配置的命令个，允许你定义Git的行为，适应不同共工作流。通过它，你可以配置Git用户信息、颜色、别名、文件忽略规则等等。`git config`的配置分为三个级别：
 1. 系统级别（`--system`）：对整个系统有效，通常用于全局配置文件，如`/etc/gitconfig`
 2. 用户级别（`--global`）：对当前用户有效，配置存储在用户的`~/.gitconfig`文件中
 3. 仓库级别（`--local`）：仅对当前Git仓库有效，配置存储在仓库的`.git/config`文件中

## 设置用户信息
最常见的设置是配置Git的用户名和邮箱，这会影响你提交的作者信息
```bash
# 设置全局用户名
git config --global user.name "Your Name"

# 设置全局邮箱
git config --global user.email "your_email@example.com"
```
如果只想为某个特定仓库设置用户名和邮箱，可以进入该仓库目录并使用不带`--global`的命令：
```bash
# 设置当前仓库的用户名
git config user.name "Another Name"

# 设置当前仓库的邮箱
git config user.email "another_email@example.com"
```

## 配置Git编辑器
Git使用编辑器来编写提交信息或进行其他配置操作。默认是`vi`或`vim`，如果你喜欢其他编辑器，可以修改它
```bash
# 设置编辑器为 VS Code
git config --global core.editor "code --wait"
```

## 别名设置
`git config`还可以设置命令别名，减少输入的字符数。例如，你可以创建一个`st`的别名来代替`git status`:
```bash
# 设置别名
git config --global alias.st status

# 使用别名
git st
```

## 查看当前配置
要查看Git的当前配置，可以使用以下命令：
```bash
# 查看全局配置
git config --global --list

## 查看所有配置（包括系统级、全局级和仓库级)
git config --list

# 查看某个配置项
git config user.name
```

## 配置合并工具和差异工具
Git允许你配置合并和差异工具，例如，设置在冲突时使用`meld`来解决冲突
```bash
# 设置差异工具为 meld
git config --global diff.tool meld

# 设置合并工具为 meld
git cofig --global merge.tool meld
```

## 配置颜色输出
Git允许你启用或禁用命令行中的颜色输出，帮助提高可读性
```bash
# 启用Git输出的颜色
git config --global color.ui auto

# 禁用颜色输出
git config --global color.ui false
```

## 配置忽略规则
你可以为Git配置`.gitignore`文件，指定哪些文件或目录应该被忽略
```bash
# 设置Git忽略某些文件类型
git config --global core.excludesfile ~/.gitignore_global
```
然后在`~/.gitignore_global`文件中添加你希望忽略的文件规则

## 配置代理
如果在工作中需要通过代理使用Git，可以设置代理
```bash
# 设置 HTTP 代理
git config --global http.proxy http://proxy.example.com:8080

# 设置 HTTPS 代理
git config --global https.proxy https://proxy.example.com:8080
```

## 使用GPG签名
Git可以使用GPG来签署提交，确保提交的真实性
```bash
# 配置GPG密钥
git config --global user.signingkey GPG_KEY_ID

# 启用GPG签名所有提交
git config --global commit.gpgSign true
```

## 配置推送和拉取行为
- 设置推送默认行为：
默认情况下，Git的`git push`会推送当前分支的更新，如果你希望推送所有分支，可以修改：
```bash
git config --global push.default matching
```

- 设置默认`git pull`行为
`git pull`默认会拉取当前分支的变更，如果你想要拉取远程的所有分支，可以这样设置：
```bash
git config --global pull.rebase true
```
## 三级配置

Git的配置文件不是只有一个，而是分三层，优先级从高到低是

```txt
项目级 > 用户级 > 系统级
```

### 项目级

位于`.git/config`，具有最高优先级，只对当前仓库生效。通常存的是

- 这个仓库专用的用户名和邮箱
- 项目特定的`remote`地址
- Git hooks 路径
- 子模块配置

### 用户级

位于`~/.gitconfig`。对当前用户的所有仓库生效。通常存的是

- 全局的用户名和邮箱
- 个人常用的 alias
- diff/merge 工具的偏好
- GPG签名密钥

### 系统级

位于`etc/gitconfig`，最低优先级，对所有用户的所有仓库生效。一般公司或团队做统一配置时会用到，个人很少碰

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

`~/.gitconfig`里可以用`include`引入额外文件，方便管理

```ini
[include]
    path = ~/.gitconfig.local    # 机器特定的配置
    path = ~/.gitconfig.company  # 公司项目的通用配置
```

### 示例
