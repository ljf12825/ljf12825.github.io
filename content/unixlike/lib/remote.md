---
title: Git Remote
date: 2025-12-31
categories: [Git]
tags: [Network, Command, Porcelain]
author: "ljf12825"
type: blog
summary: git remote
---

## git remote
`git remote`是Git中用于管理远程仓库地址的工具命令\
它并不是用来直接传输数据的，而是用来记录、查看和修改远程仓库的别名和地址\
可以理解为：
- Git仓库的本地配置表：记录“远程仓库名称” -> “远程仓库URL”的映射
- 用别名代替URL

### 基本用法
**查看现有远程仓库**
```bash
git remote # 只显示名字（如 origin）
```
```bash
git remote -v # 显示名字和对应的URL（fetch和push的地址)
```

会显示
```scss
origin  git@github.com:username/respositoryname.git (fetch)
origin  git@github.com:username/respositoryname.git (push)

```
- `origin`是远程仓库的别名（默认名字）
- `(fetch)`是拉取用的URL
- `(push)`是推送用的URL

**添加远程仓库**
```bash
git remote add <别名> <仓库URL>
```
例如
```bash
git remote add origin git@github.com:username/respositoryname.git
```
- `origin`是别名
- URL可以是HTTPS或SSH

> 惯例：
> 第一个远程仓库通常叫`origin`
> 可以有多个远程仓库，例如：
> - `origin` -> GitHub
> - `gitee` -> Gitee
> - `backup` -> 自建服务器

**删除远程仓库**
```bash
git remote remove <别名>
```
或者旧写法
```bash
git remote rm <别名>
```

**修改远程仓库地址**
```bash
git remote set-url <别名> <新URL>
```

**重命名远程仓库**
```bash
git remote rename <旧名> <新名>
```

### 常见场景
1. 本地已有项目，推送到GitHub
```bash
git init
git add .
git commit -m "init commit"
git remote add 别名 URL
git push -u 别名 main
```
- `-u`会设置默认推送目标，下次可以直接`git push`

2. 一个项目多个远程
```bash
git remote add 别名1 URL1
git remote add 别名2 URL2
```
推送到URL1
```bash
git push 别名1 main
```
推送到URL2
```bash
git push 别名2 main
```

3. 远程地址变更（换账号或换仓库）
```bash
git remote set-url origin git@github.com:newuser/newrepo.git
```

### 深入原理
在`.git/config`里，`git remote`其实是操作`[remote "<name>"]`这部分
```ini
[remote "origin"]
    url = URL
    fetch = +refs/heads/*:refs/remotes/origin/*
```
- `url`就是远程仓库地址
- `fetch`是同步分支映射规则
`git remote`命令本质上就是修改这个配置文件（也可以直接用`git config`命令改）

### 特别的
- 推送失败常见原因
如果远程分支不存在，需要
```bash
git push -u origin main
```
`-u`会绑定默认分支，省去后续输入

- fetch和push URL可以不同
用`git remote set-url --push`可以单独设置推送地址，比如拉代码用GitHub，推送到内部服务器

- 查看所有URL
```bash
git remote show origin
```
这个会列出fetch/push URL、追踪分支等详细信息

## 分支与仓库
1. 本地仓库（Local Repository）
定义\
个人电脑上这个项目的完整Git仓库，包含：
- 版本历史（commit记录）
- 分支、标签等元数据
- 暂存区（staging area）
- 工作区（working directory）

它其实就是`.git`目录存的东西

特点\
- 完全用户控制，可以离线工作
- 不依赖网络，所有提交都先存在这里

2. 本地分支（Local Branch）
定义\
本地仓库里正在操作的“开发线路”，例如：`main`、`dev`、`feature-physics`等
- 它是指向某个commit的指针（HEAD可以指向它）
- 当`git commit`时，提交只更新当前本地分支

特点\
- 可以随意创建、删除，不影响远程仓库
- 推送（`git push`）后，才会让远程仓库看到它

3. 远程仓库（Remote Repository）
定义\
放在服务器上的Git仓库
- 它有一个URL（HTTP或SSH）
- 在本地仓库里通过`git remote add`建立别名

特点\
- 是多人协作的“中心”存储点（但Git是分布式的，没有绝对中心）
- 不能直接在上面用Git命令改代码，一般是本地推送过去

4. 远程分支（Remote Branch）
定义\
存在于远程仓库的分支，比如`origin/main`、`origin/dev`
- 在本地看到的`origin/main`不是实时的远程状态，而是远程跟踪分支（remote-tracking branch），记录了上次`git fetch`后远程的状态
- 它是只读的，不能直接切换到它开发（切换会进入`detached HEAD`状态）

特点\
- 更新它需要`git fetch`或`git pull`
- 推送时，本地分支会更新对应远程分支

## HTTPS与SSH
HTTPS和SSH是Git中连接远程仓库最常见的两种方式

在Git中，远程仓库是通过一个URL来标识的，比如
- HTTPS
```bash
https://github.com/username/resposityname.git
```
- SSH
```bash
git@github.com:username.resposityname.git
```
它们本质上只是两种不同的通信协议
- HTTPS：走HTTP/SSL协议
- SSH：走Secure Shell协议

### 认证方式
Git访问远程仓库是，最重要的就是身份验证，防止别人随便推送代码

HTTPS
- 验证方式：用户名 + 密码（GitHub现在必须用Personal Access Token代替密码）
- 每次push/pull都会要求输入一次（除非用`git cedential`缓存）
- 适合临时、一次性的连接，配置简单

SSH
- 验证方式：密钥对（公钥 + 私钥）
- 在本地生成SSH密钥对，把公钥上传到Git服务器
- 每次连接自动用私钥验证，无需反复输入密码
- 更适合长期使用，尤其是经常pull/push的开发者

| 特性          | HTTPS          | SSH             |
| ----------- | -------------- | --------------- |
| **安全性**     | 高（依赖 TLS 加密）   | 高（公私钥加密）        |
| **认证方式**    | 用户名+Token      | 公钥+私钥           |
| **第一次配置难度** | 低              | 中（需要生成密钥并配置）    |
| **后续使用体验**  | 需要输入凭证（可缓存）    | 免密码，直接用         |
| **防火墙兼容性**  | 高（443端口几乎都开放）  | 有些公司防火墙会屏蔽22端口  |
| **适合场景**    | 一次性、小项目、受限网络环境 | 日常开发、频繁推送、自动化部署 |

### 配置方式
**HTTPS方式**\
添加远程仓库
```bash
git remote add 别名 URL
```
首次push
```bash
git push -u 别名 main
# 需要输入GitHub用户名 + Personal Access Token
```
可以用
```bash
git config --gloabl credential.helper stroe
```
来缓存凭证

**SSH方式**\
1. 生成密钥对
```bash
ssh-keygen -t rsa -b 4096 -C "邮箱“
```
一路回车，默认生成
```bash
~/.ssh/id_rsa # 私钥
~/.ssh/id_rsa.pub # 公钥
```

2. 把公钥添加到GitHub
  - 登录GitHub -> Settings -> SSH and GPG keys -> New SSH key
  - 把`id_rsa.pub`内容粘贴进去

3. 测试连接
```bash
ssh -T git@github.com
```
如果看到
```bash
Hi uername You're successfully authenticated...
```
就成功了
4. 添加远程仓库
```bash
git remote add 别名 SSHURL
```

### 实际建议
- 如果是长期维护项目、频繁提交 -> 直接用SSH
- 如果在公司内网、22端口被封 -> 用HTTPS
- 在服务器上做自动化部署（CI/CD） -> 用SSH，避免人工输入
- 开源项目贡献代码，一次性fork/提交 -> HTTPS更快上手

### 常见问题
#### 如果使用SSH传输，但是需要输入密码，可以排查以下问题
1. 需要生成和加载SSH密钥，公钥要在远程仓库添加，否则会走密码认证

2. 远程地址不是SSH格式

3. SSH Agent没有加载密钥
  - SSH私钥需要被`ssh-agent`加载，才能在连接时自动用它认证
  - 启动并添加密钥
  ```bash
  eval "(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa
  ```
  - 检查
  ```bash
  ssh-add -l
  ```
  如果没有输出任何密钥指纹，就说明还没加载

4. SSH配置文件问题
建议在`~/.ssh/config`里明确指定
```bash
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa
```
这样Git访问`github.com`时会强制用密钥

5. 权限问题
- 私钥文件权限太高，SSH会拒绝使用
```bash
chmod 600 ~/.ssh/id_rsa
chmod 700 ~/.ssh
```
- 如果生成了多个密钥，但没指定用哪一个，也可能会退回到密码认证

**什么时候不需要手动 `ssh-add`**
- Linux / macOS
如果你用的就是默认的 `~/.ssh/id_rsa`（或者 `id_ed25519`）这种名字，SSH 客户端会自动尝试加载它，不用你手动加到 `ssh-agent`
- Windows（Git Bash + OpenSSH）
如果你启动了 `ssh-agent` 服务，并且默认密钥放在` ~/.ssh/` 里，也会自动加载
- IDE/工具集成
比如 VS Code、JetBrains 系列，如果已经配置好 SSH key，它们会帮你管理

什么时候必须手动 `ssh-add`
- 你生成的密钥文件名不是默认的（比如 `~/.ssh/github_rsa`）
- 你同时有多个密钥，需要指定哪一个给 GitHub 用
- 系统没有自动启动 `ssh-agent`（很多 Linux 服务器是这样）
- 你想在当前 shell 会话里立即生效密钥，而不等下次登录

**如何验证是否走了密钥认证**\
```bash
ssh -T git@github.com
```
- 成功会显示
```rust
Hi uername You're successfully authenticated...
```

---

#### ssh:connect to host github.com port 22: Connection timed out
这个错误说明客户端尝试通过22号端口访问`github.com`，但是连接超时了\
可能原因：
1. 公司/学校/网络环境屏蔽了22端口
很多网络会直接拦截SSH默认端口（22），防止用SSH隧道

2. 防火墙/代理设置
本地Windows防火墙、杀毒软件、代理软件也可能阻止了

3. GitHub服务器没问题
GitHub本身基本不会挂掉，问题大多在网络或配置\
如果怀疑GitHub网站状态有问题，可以查看GitHub官方服务状态网站，它会显式显示GitHub当前的运行状况（是否宕机、部分功能异常、API/SSH/网页服务延迟等）\
[`https://www.githubstatus.com/`](https://www.githubstatus.com/)

**解决方案**\
方案一：改用HTTPS

方案二：使用GitHub的443端口SSH
GitHub提供了一个特殊的SSH地址，可以通过443端口走SSH，绕过22被封的情况\
1. 修改`~/.ssh/config`文件（Windows上在`C:\Users\<username>\.ssh\config）
```txt
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
```
2. 测试连接
```bash
ssh -T git@github.com
```
如果成功，会提示
```txt
Hi username! You've successfully authenticated...
```

