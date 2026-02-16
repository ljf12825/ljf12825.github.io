---
title: Filemode
date: 2025-12-31
categories: [Git, Linux]
tags: [Command, Porcelain, Mechanism]
author: "ljf12825"
type: blog
summary: Linux filemode in Git
---

Filemode是Git中用于跟踪和存储文件权限（Unix/Linux文件权限）的机制。它决定来Git如何处理文件的执行权限位

## 核心概念
1. Filemode 
Filemode是Git的一个配置选项，控制是否跟踪文件的执行权限（executable bit）。它影响`chmod +x`这样的权限更改是否会被Git记录

2. 三种权限状态
在Unix/Linux中，每个文件有三种权限位
```text  
rwx rwx rwx
│││ │││ │|│ 其他用户执行
│││ │││ │└─ 其他用户写权限
│││ │││ └── 其他用户读权限  
│││ ││└──── 组用户执行权限
│││ │└───── 组用户写权限
│││ └────── 组用户读权限
││└──────── 所有者执行权限
│└───────── 所有者写权限
└────────── 所有者读权限
```
Git主要关心执行权限（x位），因为
- 读/写权限通常由umask控制
- 执行权限对脚本和程序至关重要

## Filemode配置
### 查看当前配置
```bash 
# 查看全局配置
git config --global core.filemode

# 查看本地仓库配置
git config core.filemode

# 查看所有相关配置
git config --list | grep filemode 
```

### 设置Filemode
```bash 
# 启动（默认在Linux/Mac 上通常是启用的）
git config core.filemode true 

# 禁用（Windows 上通常禁用）
git config core.filemode false

# 全局设置
git config --global core.filemode true 
```

### 检测系统默认
```bash 
# Git会检测文件系统是否支持权限
# Linux/Unix：通常为true 
# Windows(NTFS)：通常为false 
# Windows(WSL)：通常为true 
# macOS(APFS/HFS+)：通常为true 
```

## Filemode的实际影响
启用时(core.filemode = true)
```bash 
# 创建一个脚本
echo '#!/bin/bash' > script.sh 
echo 'echo "Hello"' >> script.sh 

# 添加执行权限
chmod +x script.sh 

# Git能检测到权限变化
git status
# 输出：modified: script.sh 
# Git看到文件模式从 100644 变为 100755 

git diff 
# 显示：old mode 100644 
#       new mode 100755 
```

禁用时（core.filemode = false)
```bash 
# 即使修改了权限，Git也忽略
chmod +x script.sh 
git status
# 输出：nothing to commit （如果文件内容未变）

# Git只关心文件内容，不关心权限
```

## Git对象中的Filemode 
### 文件模式值
Git使用八进制值表示文件模式

#### 基本结构：六位八进制
Git的文件模式由6个八进制数字组成
```text 
1   0   0   6   4   4
│   │   │   │   │   │
│   │   │   │   │   └── 其他用户权限 (4 = r--)
│   │   │   │   └────── 组用户权限 (4 = r--)
│   │   │   └────────── 所有者权限 (6 = rw-)
│   │   │
│   │   └────────────── 特殊位（setuid/setgid/sticky）
│   └────────────────── 文件类型高位
└────────────────────── 文件类型低位
```

#### 文件类型部分（前两位）
前两个数字（0-3位）表示文件类型

| 八进制值 | 二进制 | 文件类型 | 说明 |
| - | - | - | - |
| 04 | `000100` | 目录 | `040000` |
| 10 | `001000` | 普通文件 | `100644` |
| 12 | `001010` | 符号链接 | `120000` |
| 16 | `001110` | Git子模块 | `160000` |

#### 权限部分（后四位）
后四个数字是标准的Unix权限八进制表示

| 八进制 | 二进制 | 权限 |
| - | - | - |
| 0 | 000 | `---` |
| 1 | 001 | `--x` |
| 2 | 010 | `-w-` |
| 3 | 011 | `-wx` |
| 4 | 100 | `r--` |
| 5 | 101 | `r-x` |
| 6 | 110 | `rw-` |
| 7 | 111 | `rwx` |

#### 完整表示

| 模式值 | 权限 | 文件类型 | 示例 |
| - | - | - | - |
| 100644 | `rw-r--r--` | 普通文件 | `.txt`, `.js`, `.py`（非可执行）|
| 100755 | `rwxr-xr-x` | 可执行文件 | 脚本、二进制文件 |
| 120000 | 特殊 | 符号链接 | `ln -s target linkname` |
| 040000 | 特殊 | 目录 | `drwxr-xr-x` | 
| 160000 | 特殊 | Git子模块 | `git submodule` |

### 查看文件模式
```bash 
# 查看工作区文件模式
ls -l file.txt 

# 查看Git索引中的文件模式
git ls-files --stage 
# 100644 e69de29... 0 file.txt 
# 100755 7b8b4a9... 0 script.sh 

# 查看提交中的文件模式
git ls-tree HEAD 
# 100644 blob e69de29... file.txt 
# 100755 blob 7b8b4a9... script.sh 
# 040000 tree 1f8a3e5... src 

# 详细查看
git show --raw HEAD 
```

## 跨平台问题与解决方案
### Windows上的挑战
Windows没有Unix权限管理，导致问题
1. 权限丢失：从Linux仓库克隆到Windows后，执行权限丢失
2. 虚假变化：在Windows上修改文件可能导致Git误认为权限变化

### 解决方案
1. 统一禁用（推荐用于跨平台团队）
```bash 
# 所有开发者全局禁用
git config --global core.filemode false 

# 仓库也禁用
git config core.filemode false 
```

2. 使用`.gitattributes`
在仓库根目录创建`.gitattributes`文件
```gitattributes
# 为特定文件设置权限
*.sh text eol-llf # Shell 脚本
*.py text eol-lf # Python 脚本
*.exe .text binary # 二进制文件

# 手动设置执行权限
script.sh text eol=lf executable
```

3. 使用update-index 
```bash 
# 手动设置文件的执行位
git update-index --chmod=+x script.sh 

# 移除执行位
git update-index --chmod=-x file.txt 

# 查看索引中的权限
git ls-files --stage script.sh 
```
