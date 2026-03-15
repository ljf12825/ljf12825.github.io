---
title: LFS
date: 2025-12-31
categories: [Git]
tags: [Extension]
author: "ljf12825"
type: log
summary: git LFS
---

Git本身是为源代码管理设计的，源代码问及那通常比较小（KB级别），而且会有频繁的修改提交\
但在某些场景下会遇到的问题：
- 二进制文件（如图片、音频、视频、模型、PSD、美术资源）非常大
- Git对二进制文件diff和合并支持很差
- 大文件会让仓库提交暴增，clone/pull/push都会变慢

Git LFS是Git的一个扩展，用来解决大文件管理问题的
它的原理是：
- 把大文件本体存储在一个单独的存储服务器（可以是GitHub LFS、GitLab LFS、自己搭建的LFS服务器、S3、OSS等）
- 在Git仓库里只存一个指针文件（几十字节），指向大文件的实际位置

这样：
- Git的版本库仍然保持小体积
- 真正需要时（比如checkout某个 commit），LFS才会下载对应的大文件

## 使用方式
1. 安装
```bash
git lfs install
```

2. 跟踪大文件
告诉Git哪些文件类型用LFS管理，例如Unity游戏开发常见的资源
```bash
git lfs track "*.psd"
git lfs track "*.png"
git lfs track "*.fbx"
```
这会在项目里生成/修改`.gitattributes`文件，记录规则：
```bash
*.psd filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
```

3. 提交 & 推送
之后这些文件就不会存进Git，而是以指针为念的形式进入版本库，真正的文件会上传到LFS服务器
```bash
git add .gitattributes
git add my_texture.png
git commit -m "Add texture"
git push
```

## 特点
### 优点
- 避免仓库臃肿，大文件不会一直占用Git仓库体积
- clone时不会一次性下载所有大文件，只拉需要的
- 对二进制文件的版本管理更合理

### 缺点
- 需要LFS服务端支持（GitHub/GitLab/Bitbucket都支持，但有存储/流量限制）
- 大文件依然会占用内存，只是Git本身不会变臃肿
- 在团队里必须所有人都安装Git LFS，否则会遇到“拿到的只是指针文件”的情况
