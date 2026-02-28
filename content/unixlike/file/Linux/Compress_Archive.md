---
title: compress & archive
date: 2026-01-14
draft: false
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

### 其他压缩工具

需要安装

- `7z`(.7z)：压缩率很高
- `Zstandard`(.zst)

## 归档工具`tar`

`tar`主要用途是将多个文件/目录打包成一个文件

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

















