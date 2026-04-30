---
title: compress & archive
date: 2026-04-03
type: file
author: ljf12825
summary: .gz .bz2 .xz .zip .tar
---

- 打包(archive)：把多个文件合成一个文件（不减小体积）
- 压缩(compress)：用算法缩小体积

在Linux中最经典的组合就是：tar打包，gzip/bzip2/xz压缩工具

```bash
xxx.tar.gz
xxx.tar.bz2
xxx.tar.xz
```

意思是：先tar打包，再用不同算法压缩

## 常用压缩格式及工具

### `.gz`

- 工具：`gzip`
- 特点：速度快，压缩率中等
- 几乎所有服务器都默认支持
- 底层：LZ77 + Huffman

```bash
# 压缩
gizp file.txt

# 解压
gzip -d file.txt.gz
# 或
gunzip file.txt.gz

# 查看压缩文件内容
zcat filename.gz
```

### `.bz2`

- 工具：`bzip2`
- 特点：压缩率比gzip高，但慢
- 底层：Burrows-Wheeler

```bash
# 压缩
bzip2 filename
bzip2 -9 filename # 最大压缩率

# 解压缩
bunzip2 filename.bz2
bzip2 -d filename.bz2

# 查看内容
bzcat filename.bz2
```

### `.xz`

- 工具：`xz`
- 特点：压缩率最高，但最慢
- 内核源码、发行版常用
- 底层：LZMA2

```bash
# 压缩
xz filename
xz -9 filename # 最大压缩率

# 解压缩
unxz filename.xz
xz -d filename.xz

# 查看内容
xzcat filename.xz
```

### `.zip`

- Windows/Linux通用
- 特点：跨平台兼容性好

```bash
# 压缩
zip archive.zip file1 file2 dir1
zip -r archive.zip directory/ # 递归压缩目录

# 解压
unzip archive.zip
unzip -l archive.zip # 查看内容
unzip -d target_dir archive.zip # 解压到指定目录
```

zip可以同时打包和压缩目录，但在Linux生态中会导致丢失关键信息：

- 文件权限被修改（丢失原始权限）
- 所有者信息破坏
- 硬链接被破坏

### 其他压缩工具

需要安装

- `7z`(.7z)：压缩率很高
- `Zstandard`(.zst)

## 归档工具`tar`

`tar`主要用途是将多个文件/目录打包成一个文件

1979年，tar在Unix V7中引入，用于磁带备份

既然有gzip, xz等压缩工具，为什么还需要tar

核心原因：压缩工具不擅长处理目录，gzip, xz, bzip2等压缩文件只能压缩单个文件，不能直接压缩目录

```bash
# 这些命令会报错或只处理单个文件
gzip myfolder/
gzip: myfolder/ is a directory -- ignored

xz myfolder/
xz: myfolder/: Is a directory, skipping
```

tar的作用：打包 + 保留元数据

tar = Tape ARchive（磁带归档），最初设计用于磁带备份。它的核心功能是

1. 将多个文件/目录合并成单个文件流
2. 保留文件元数据（权限、所有者、时间戳、目录结构）
3. 支持追加、增量备份等操作

```bash
# 压缩一个目录下的所有文件（每个文件独立压缩），不能包含文件夹
$ xz folder/*
$ ls folder/
file1.txt.xz file2.txt.xz

# 解压时需要分别处理
xz -d test/*.xz
# 可能导致元数据丢失
```

使用tar先打包

```bash
# 打包并压缩（常用组合）
$ tar -czf archive.tar.gz folder/
# -c: 创建归档
# -z: 通过 gzip 压缩
# -f: 指定归档文件

# 一个命令完成打包+压缩，一个命令完成解压+解包
$ tar -xzf archive.tar.gz
# 完整恢复：目录结构、权限、时间戳全部保留
```

tar的独特优势

- 保留权限（755/644）
- 保留所有者（uid/gid）
- 保留硬链接
- 保留符号链接
- 保留时间戳
- 增量备份
- 追加文件到已有归档
- 跨多卷磁带/磁盘

### 常用组合

```bash
# 打包并压缩
tar -czvf archive.tar.gz file1 file2 dir1 # gzip压缩
tar -cjvf archive.tar.baz file1 file2 dir1 # bzip2压缩
tar -cJvf archive.tar.xz file1 file2 dir1 # xz压缩

# 解包解压
tar -xzvf archive.tar.gz # 解压.gz
tar -xjvf archive.tar.bz2 # 解压.bz2
tar -xJvf archive.tar.xz # 解压.xz

# 仅查看内容不解压
tar -tzvf archive.tar.gz

# 查看归档内容（不解压）
tar -tf archive.tar.gz

# 解压到指定目录
tar -xzf archive.tar.gz -C /target/path/

# 只打包，不压缩（速度最快）
tar-cf archive.tar folder/
```

### 参数

- `-c`：创建归档
- `-x`：提取归档
- `-z`：使用gzip
- `-j`：使用bzip2
- `-J`：使用xz
- `-v`：显示详细信息
- `-f`：指定文件名
- `-t`：列出归档内容
