---
title: GitPS1
author: ljf12825
date: 2025-12-31
tags: [git, shell]
lab: true
summary: a git state command prompt implemented
---

灵感来源于Git For Windows中有这个功能，发现Linux环境不显示，以为Linux下没有，于是自己实现了一个，写完用了两个月了才发现Git有这个功能：`__git_ps1`

不过我写的当前版本比`__git_ps1`的基础上多一个功能：能区分本地和SSH
