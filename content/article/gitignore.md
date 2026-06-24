---
title: .gitignore
date: 2026-03-29
author: ljf12825
type: file
summary: usage of .gitignore
---

`.gitignore`是Git高级协作中非常实用的工具，它关系到项目整洁、性能以及协作效率

## `.gitignore`的作用

`.gitignore`文件告诉Git哪些文件或文件夹不需要被版本控制。它常用于：

- 临时文件：编译产物、临时缓存、日志
- 系统文件：OS自动生成的隐藏文件，如macOS的`.DS_Store`，Windows的`Thumbs.db`
- 用户配置：IDE配置、Unity的本地设置
- 大文件敏感文件：模型、贴图、音频、大数据文件、或API key等

> 使用`.gitignore`可以保证仓库干净、克隆快速，也避免不必要的冲突

## 基本匹配规则

### `*`匹配任意字符（除`/`）

```gitignore
*.o # 忽略所有 .o文件
```

### `?`匹配单个字符

```gitignore
file?.txt # 匹配 file1.txt, fileA.txt，但不匹配 file10.txt
```

### `[abc]`匹配方括号中的任意一个字符

```gitignore
file[12].txt # 匹配file1.txt 或 file2.txt
```

### `**`匹配任意层级目录

```gitignore
**/temp # 忽略任意子目录下的 temp 文件夹
```

### 斜杠(`/`)的作用

以`/`开头：从仓库根目录匹配

```gitignore
/config.json # 只忽略根目录下的 config.json
```

以`/`结尾：只匹配目录

```gitignore
logs/ # 忽略所有 logs 目录及其内容
```

中间`/`：按路径匹配

```gitignore
src/*.o # 忽略 src 目录下的所有 .o文件，但不影响其他目录
```

### 排除规则`!`

`!`用来排除`.gitignore`的忽略规则，即“不忽略这个文件”

```gitignore
*.c
!main.c
```

要注意递归问题，如果上层目录被忽略，子文件即使`!`排除，也无法追踪，必须用`!*/`先允许Git进入目录

#### 示例：“白名单”

```gitignore
* # 忽略所有
!*/ # 不忽略子目录
!*.c # 不忽略.c文件
```

### 注释和空行

以`#`开头的行是注释，空行会被忽略，用于分组

### 优先级与执行顺序

`.gitignore`从上到下读取，后面的规则可以覆盖前面的规则

```gitignore
*.c # 忽略所有的.c文件
!main.c # 但是不要忽略 main.c
```

## 高级技巧

1. 针对每个分支或环境可用不同规则
    - 比如测试分支保留日志，生产分支忽略日志
    - 用`.git/info/excluede`做局部忽略，不影响仓库
2. 动态生成ignore文件
    - 可以通过脚本在项目初始化时生成`.gitignore`
3. 已经被追踪的为念不会被忽略
    - 如果文件已经加入版本控制，需要先`git rm --cached <file>`，然后才会生效

```bash
git rm --cached Library/ -r
git commmit -m "Remove ignored Library folder"
```

[GitHub在线模板](https://github.com/github/gitignore)

## `check-ignore`

`git check-ignore`命令用于检查某个文件或目录是否被Git忽略，检查的依据是`.gitignore`、`.git/info/excluede`文件或全局gitignore文件中的规则。这个命令可以帮助你排查为什么某些文件没有被Git跟踪

```bash 
git check-ignore -v <file path>
```

### 常用选项

#### `-q --quit`

不输出任何信息，仅设置退出状态。当之检查一个路径时使用此选项
  - 退出状态`0`：表示路径被忽略
  - 退出状态`1`：表示路径没有被忽略

#### `-v, --verbose`

输出匹配的排除规则及其源文件、行号和路径。如果路径与排除模式匹配，输出会包含该模式的具体信息；如果模式以`!`开头（表示否定模式），则意味着匹配后路径不被忽略

#### `--stdin`

从标准输入读取路径名，而不是从命令行读取。这对于检查多个文件很有用。路径名每行一个

#### `-z`

输出格式修改为机器可解析格式，路径名之间用NUL字符分隔，适用于机器处理

#### `-n, --non-matching`

显示没有匹配任何排除模式的路径。这仅在启用`--verbose`时才有意义，便于区分匹配和不匹配的路径

#### `--no-index`

在检查时不查看Git索引。这对调试某个路径为何被`git add ,`添加至跟踪状态，但没有被`.gitignore`忽略非常有用

### 退出状态

- 0：表示至少有一个路径被忽略
- 1：表示没有路径被忽略
- 128：遇到致命错误