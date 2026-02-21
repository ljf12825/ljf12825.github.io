# `rev-parse`
`git rev-parse`是一个底层辅助命令，它的核心工作是将各种“引用”解析成唯一的、不可变的SHA-1哈希值（或简称“对象名”）

在Gti中，每一个提交、文件、树对象都有一个唯一的40位SHA-1哈希值作为身份证。但平时操作时，用的都是`main`, `HEAD`, `v1.0`这样的名字，因为它们更好记。`git rev-parse`就是连接人类友好名称和机器精确哈希值之间的桥梁

## 核心功能与常用场景
1. 解析引用
这是`rev-parse`最基本、最常用的用途
```bash
# 解析当前分支（HEAD）指向的提交哈希
$ git rev-parse HEAD
d4a5d3e7e4a4e4a4e4a4e4a4e4a4e4a4e4a4e4a4

# 解析某个分支（如 main）的提交哈希
$ git rev-parse main
d4a5d3e7e4a4e4a4e4a4e4a4e4a4e4a4e4a4e4a4

# 解析某个标签（如 v1.0）的提交哈希
$ git rev-parse v1.0
c4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b

# 解析父提交。`HEAD^` 表示 HEAD 的第一个父提交
$ git rev-parse HEAD^
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b
```

2. 验证引用是否存在
如果你给`rev-parse`一个不存在的引用，它会报错并返回非零状态码。这在脚本中非常有用，用于检查一个分支或标签是否存在
```bash 
$ git rev-parse non-existent-branch
fatal: ambiguous argument 'non-existent-branch': unknown revision or path not in the working tree.

# 在脚本中，可以通过 $? 获取上一条命令的退出状态码
$ echo $?
128
```

3. 获取Git目录和工作树路径
这些选项对于编写脚本或者工具集成非常有用
```bash 
# 显示 Git 仓库的 .git 目录的绝对路径
$ git rev-parse --git-dir
/path/to/your/project/.git

# 显示工作树的根目录的绝对路径
$ git rev-parse --show-toplevel
/path/to/your/project

# 显示相对于工作树根目录的路径（如果你在子目录中）
$ cd /path/to/your/project/src
$ git rev-parse --show-prefix
src/

# 显示当前目录相对于 Git 根目录的完整路径
$ git rev-parse --show-cdup
../../
```

4. 剥离修饰符（`--verify`）
`--verify`用于严格验证一个参数是否是有效的对象名。如果参数是像`main`这样的符号引用，它会输出该引用指向的SHA-1.如果参数本身已经是一个SHA-1（哪怕是缩写），它会尝试验证并原样返回
```bash 
# 验证 main 分支
$ git rev-parse --verify main
d4a5d3e...

# 验证一个缩写哈希（如果唯一）
$ git rev-parse --verify d4a5d3
d4a5d3e...

# 如果验证失败（如引用不存在），则命令失败
$ git rev-parse --verify invalid-ref
fatal: Needed a single revision
```
注意：`--verify`不期望接收像`HEAD^`这样的“修饰符”，它期望一个具体的引用。如果要解析`HEAD^`，直接使用感i`git rev-paarse HEAD^`即可

5. 缩写哈希（`--short`）
又是不需要完整的40位哈希，只需要前7位或更多位来保证唯一性即可
```bash 
$ git rev-parse --short HEAD
d4a5d3e
```
