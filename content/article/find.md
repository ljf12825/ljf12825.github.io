---
title: find
author: ljf12825
date: 2026-06-14
type: file
summary: linux find command
---

## `find`

`find`是Linux下的文件搜索命令，它的核心哲学是查找并执行操作

### 核心语法

`find`不像`ls`那样简单，它必须遵循固定结构

```bash
find [搜索起始路径] [搜索条件表达式] [对结果执行的动作]
```

- 搜索路径：从yali开始找，可以指定多个目录。当前目录用`.`
- 表达式：如何过滤文件
- 动作：找到后做什么，默认是`-print`（打印换行路径）。如果换成`-print0`，会将分隔符换成`\0`字符，常配合`xargs -0`安全地处理带空格或特殊字符的文件名

如果不指定任何条件，`find`会递归列出该目录下的所有文件和文件夹

### 常用的筛选条件

#### 按文件名

```bash
find . -name "*.log" # 严格区分大小写，通配符需引号
find . -iname "readme.txt" # 不区分大小写
```

#### 按文件类型

```bash
find . -type f # 普通文件
find . -type d # 目录
find . -type l # 符号链接
```

#### 按文件大小

```bash
find . -size +100M # 大于 100MB
find . -size -10k # 小于 10KB
find . -size 0 # 空文件
```

#### 按时间

`find`的按时间查找比较特别

| 选项 | 含义 |
| - | - |
| `-mtime` | 文件内容修改时间 |
| `-ctime` | inode状态变化时间（权限、属主等）|
| `-atime` | 访问时间 |

`-mtime`/`-mmin`的时间单位和取整规则如下

`-mtime`的时间单位是天，也就是24小时

```bash
find . -mtime 1
```

表示“24～48小时”内修改的文件，因为基本单位是天，就像昨天任意时间修改一个文件，从今天开始到今天结束，这24小时内都叫昨天修改

| 写法 | 含义 |
| - | - |
| `-mtime 0` | 24小时内 |
| `-mtime 1` | 24~48小时 |
| `-mtime +1` | 超过48小时 |
| `-mtime -1` | 不到24小时 |

- `+` 意为超过
- `-` 意为不足

`-mmin` 同理，基本单位是分钟，提供更精细的时间刻度

`-newer` 谁比谁新

```bash
find . -newer reference_file
```

找出所有修改时间严格晚于`reference_file`的文件

#### 按权限和属主

```bash
find . -user jeff
find . -perm 644 # 精确匹配
find . -perm -u+w # 属主有写权限
```

### 对结果执行操作

#### 删除

```bash
# 先确认列出的无误
find . -name "*.tmp"
# 再执行删除
find . -name "*.tmp" -delete
```

#### 批量执行命令

写法1：每找到一个文件就执行一次

```bash
# 结尾的\;是必须的
find . -name "*.jpg" -exec ls -lh {} \;
```

- `find .` 从当前目录开始找
- `-name "*.jpg"` 文件名匹配
- `-exec` 对找到的每个文件，执行后面的命令
- `ls -lh` 要执行的命令
- `{}` 占位符，代表“当前找到的那个文件的路径”
- `\;` 结束标记，告诉`find`命令到这里就结束了
- `;` Shell里的特殊字符（命令分隔符），所以用`\`转义

写法2：收集一批文件一起执行

```bash
find . -name "*.jpg" -exec chmod 644 {} +
```

这种效率更高，因为它减少了命令启动的次数，类似xargs的效果\
不过，`+`会把文件名都堆在命令末尾，而`\;`可以把`{}`嵌在命令中间

管道与xargs处理复杂逻辑

当`-exec`不够用时

```bash
# 删除文件名带空格的文件，安全做法
find . -name "*.tmp" -print0 | xargs -0 rm
```

