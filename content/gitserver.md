---
title: Git Server
date: 2025-12-31
author: ljf12825
tags: [Git]
summary: Create a Git Server and relating commands
---

# git instaweb

`git instaweb`是Git自带的一个命令，用来快速启动一个本地Web页面浏览当前Git仓库\
它实际上是启动gitweb，然后临时运行一个Web服务器，把仓库历史、提交、diff等信息以网页形式展示出来

类似的还有Jupyter, VS Code Remote, TensorBoard, Prometheus + Grafana

## 使用

```bash
cd my-project
git instaweb
```

它会：

1. 生成gitweb配置
2. 启动一个本地HTTP服务
3. 打开浏览器访问

默认通常是`http://127.0.0.1:1234`

页面类似gcc等开源项目的git服务器，可以查看commit历史、branch、tag、文件内容、diff、blame

[![gitinstaweb](/images/content/gitinstaweb.png)](/images/content/gitinstaweb.png)

停止服务

```bash
git instaweb --stop
```

重启服务

```bash
git instaweb --restart
```

指定服务器

```bash
git instaweb --httpd=python
```

或者

```bash
git instaweb --port=8080
```

默认使用的HTTP server取决于Git配置，常见是lighttpd

## lighttpd

lighttpd是一个轻量级Web服务器，类似于Apache HTTP Server, NGINX

lighttpd负责接收浏览器的HTTP请求，然后把请求交给对应程序处理，再把结果返回给浏览器

```
浏览器
| HTTP
v
lighttpd
| CGI
v
gitweb.cgi
v
git repository
```

# git daemon

`git daemon`是Git自带的一个简单服务器，用来通过Git协议(git://)提供仓库访问

它和`git instaweb`的区别

- `git instaweb`：提供网页浏览接口
- `git daemon`：提供Git客户端访问接口

```
git clone
v
git:// protocol
v
git daemon
v
git 仓库
```

# 建立一个Git服务器

建立一个Git服务器，本质上就是：在一台机器上放置Git仓库，并提供一种远程访问方式

现代常见方案有三种：

1. SSH + bare repository
2. HTTP/HTTPS + Git backend（类似GitHub）
3. Git服务软件(GitLab/Gitea等)


