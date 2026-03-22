---
title: add
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: log
summary: git add
---

`git add`的作用是将新增或已更改文件的内容添加到index中，作为下次`commit`的内容\
在一次`commit`之前，可以执行多次`add`，一次`add`就是一次拍照，内容是当前的新增或更改内容，如果后续对内容进行修改且希望提交，需要再次`add`\
默认情况下，`add`不会添加忽略文件，使用`--force`可强制添加。如果不使用`--force`，命令会失败并返回忽略的文件列表

## 语义及设计理念
`git add`的作用不是“添加文件”，而是把工作区中的文件内容，写入Git对象数据库，并更新index中对应路径指向的对象
```text 
Working Tree（工作区）
        ↓ git add
Index / Staging Area（暂存区）
        ↓ git commit
Repository（对象库 + 提交历史）
```
`git add`只负责从工作区读取文件内容，生成（或复用）blob对象，更新index，它不产生commit，也不更改HEAD

### 底层行为
#### Git不关心文件，只关心内容
当执行
```bash 
git add a.txt 
```
Git做的事情是
- 读取a.txt内容
- 对内容计算SHA-1/SHA-256（新仓库）
- 生成一个`blob`对象（如果这个内容以前不存在）
- 把这个blob的hash写进index 
- index中记录
```text 
路径名 -> blob hash + 文件模式
```

如果文件内容没变，`git add`不会生成新对象，这就是Git去重能力极强的根本原因

#### index 
index存储下一次commit的完整快照草稿，index中的每一条记录包含
- 文件路径
- 文件权限（100644/100755等）
- blob对象hash 

### 设计哲学
`git add`是Git的核心设计之一
#### 支持部分提交
假设改了一个文件
```c 
// main.c 
修了 bug 
加了日志
写了一半新功能（未完成）
```
可以
```bash 
git add -p main.c 
```
只把bug修复，日志加入index,而把未完成的新功能留在工作区\
Git的单位不是文件，是”内容块（hunk）“

#### index的设计
index是缓冲层，如果没有`git add`，每次commit只能提交工作区的全部状态，无法构建干净、可回溯的历史



## OPTIONS
- `<pathspec>`
要添加的文件内容\
可以使用文件通配符（例如，`*.c`）来添加所有匹配的文件\
也可以指定一个前导目录名（例如`dir/`来添加`dir/`下所有文件）\
`.`也是`<pathspec>`，是指从当前目录开始，递归匹配所有路径，`git add .`，在不同Git版本/配置下，会add新文件，会add修改文件，可能不会stage删除
`<pathspec>`是一个匹配规则系统，支持：目录，glob,排除，魔法前缀


- `-n`/`--dry-run`
模拟执行

- `-v`/`--verbose`
尽可能多的显示信息

- `-f`/`--force`
允许添加已忽略的文件

- `--sparse`
允许更新sparse-checkout范围之外的索引条目。通常情况下，`git add`命令会拒绝更新路径不再sparse-checkout范围内的索引条目，因为这些文件可能会在未发出警告的情况下从工作树中移除

- `-i`/`--interactive`
以交互方式将工作树中修改后的内容添加到索引中。可以提供可选的路径参数，以将操作限制在工作树的子集中

- `p`/`--patch`
以交互方式选择索引和工作树之间的补丁块，并将其添加到索引中。这使用户有机会在将修改后的内容添加到索引之前查看差异。这实际上运行了`add--interactive`命令，但绕过了初始命令菜单，直接跳转到补丁子命令

- `-U<n>`/`--unified=<n>`
生成包含<n>行上下问的而差异。默认值为diff.context,如果未设置配置选项，则默认值为3

- `--inter-hunk-context=<n>`
显示差异代码块之间的上下文，最多显示指定的行数，从而合并彼此接近 的代码块。默认值为diff.interHunkContext,如果为设置配置选项，则默认值为0

- `-e`/`--edit`
在编辑器中打开差异文件与索引的对比，并允许用户进行编辑。编辑器关闭后，调整代码块标题并将补丁应用到索引。此选项的目的是选择要应用的补丁行，甚至可以修改要暂存的行的内容。这比使用交互式代码块选择器更快、更灵活。但是很容易出错，导致创建了一个不适用于索引的补丁

- `-u`/`--update`
仅更新索引中已存在与`<pathspec>`匹配的条目。此操作会删除并修改索引条目以匹配工作树，但不会添加新文件。如果在使用`-u`选项时未指定`<pathspec>`，则会更新整个工作树中所有跟踪的文件（旧版本的Git会将更新限制在当前目录及其子目录中）

- `-A`/`--all`/`--no-ignore-removal`
不仅更新工作树中存在与`<pathspec>`匹配的文件的索引，还会更新索引中已存在条目的文件。此操作会根据工作树添加、修改和删除索引条目。如果在使用`-A`选项时未执行`<pathspec>`，则会更新整个工作树中的所有文件（旧版本的Git会将更新限制在当前目录及其子目录中），简单来说，该操作会复刻工作区中的所有行为（添加，修改，删除）到index 

- `--no-all`/`--ignore-removal`
更新index，只处理新增和修改，忽略“已删除”的文件。新文件: 加入index, 修改文件: 更新index, 删除文件: index中仍保留（不stage删除）。当不提供`<pathspec>`时，这个选项是no-op（无效）

- `-N`/`--intent-to-add`
在index中记录“我打算将来add这个文件”，但不记录内容。index中有路径，但没有blob内容，这是一个空条目。在Git内部，index有该文件的entry, blob hash是“未定义状态”，文件被视为tracked（已跟踪），但内容仍完全来自工作区，还未进入对象数据库。`-N`是一个逻辑跟踪标记，不是内容操作。这个功能的作用：1.让`git diff`显示“未add的新文件内容”，默认情况下`git diff`不会显示新文件内容，因为diff的基准是index，新文件index不存在，`-N`选项让diff可以显示出新文件内容。2.配合`git commit -a`，`git commit -a`只会提交tracked文件。如果想用`commit -a`但又有新文件，可以使用`-N`

- `--refresh`
不添加内容，只更新index中的stat信息。index里除了blob hash,还有文件大小，mtime,inode（部分系统）。Git用这些来做快速是否变更判断。使用场景：文件内容没变，但时间戳/元数据异常，Git误判为modified，使用`git add --refresh`修正index的文件状态缓存

- `--ignore-errors`
部分文件add失败，不中断整个add操作。行为：成功的：继续add,失败的：跳过，最终返回非0.Git默认是要么全部成功，要么失败。这个选项是尽量成功，但告诉你有问题

- `--ignore-missing`
检查pathspec中哪些文件会被忽略，不关心它们是否存在。该命令只能和`--dry-run`一起用，不修改index 

- `--no-warn-embedded-repo`
当`git add some_dir/`，而`some_dir/.git`存在时，Git会警告：你正在添加一个嵌套仓库。因为这通常意味着：子模块没有正确处理，历史会混乱。这个选项的作用是关闭该警告，你需要明确知道自己在干什么

- `--renormalize`
对所有已跟踪文件，重新执行官clean过滤器，然后重新写入index. 典型clean行为：CRLF->LF, text属性生效。触发场景：修改了`core.autocrlf`,`.gitattributes`的`text`/`eol`、历史index中内容脏了。该命令只会影响index,不修改工作区文件，隐含`-u` 

- `--chmod=(+|-)x`
只修改index中的可执行位，不修改磁盘文件，只改Git记录

- `--pathspec-from-file`/`--pathspec-file-nul`
pathspec不从命令行传，而是从文件/stdin读。适用于路径太多，路径包含空格、换行、特殊字符、自动化工具生成路径列表。`--pathspec-file-nul`用`\0`分隔，所有字符字面量处理，最安全的批量路径方式

- `--`
选项终止符，明确告诉Git：后面全是路径，不是选项

## 交互式`add`

```bash
# 启动交互式暂存界面
git add -i

# 或使用完整命令
git add --interactive

# 简写模式（更新版本）
git add -p # 补丁模式，最常用
```

启动后显示菜单

```text
           staged     unstaged path
  1:    unchanged       +12/-0 README.md
  2:    unchanged       +20/-4 src/main.py
  3:    unchanged        +3/-0 newfile.txt

*** Commands ***
  1: status       2: update       3: revert       4: add untracked
  5: patch        6: diff         7: quit         8: help
What now>
```

1. status（状态）

显示当前更改的摘要信息

```bash
What now> 1
# 显示哪些文件已暂存、未暂存
```

2. update（更新）

将整个文件的更改添加到暂存区

```bash
What now> 2
           staged     unstaged path
  1:    unchanged       +12/-0 README.md
  2:    unchanged       +20/-4 src/main.py
Update>>
# 输入文件编号（如 1,2 或 1-3）
Update>> 1,2
# 暂存选中文件的全部更改
```

3. revert（恢复）

从暂存区移除已暂存的文件

```bash
What now> 3
           staged     unstaged path
  1:        +12/-0    unchanged README.md
Revert>>
# 输入要取消暂存的文件编号
```

4. add untracked（添加未跟踪文件）

添加新文件到暂存区

```bash
What now> 4
           staged     unstaged path
  1:    unchanged        +3/-0 newfile.txt
Add untracked>>
```

5. patch（补丁模式）

逐块暂存更改-这是交互式add的核心功能

```bash
What now> 5
# 或直接使用补丁模式
git add -p
git add --patch
```

6. diff（查看差异）

显示暂存区与工作区的差异

```bash
What now> 6
           staged     unstaged path
  1:        +12/-0     +4/-2 README.md
Diff>>
# 输入文件编号查看具体差异
```

7. quit（退出）

退出交互式界面

8. help（帮助）

显示命令帮助信息


## 补丁模式

启动补丁模式

```bash
# 对特定文件使用补丁模式
git add -p filename.py

# 对所有更改文件使用
git add -p

# 等价于
git add --patch
```

补丁模式的工作流程

1. Git逐块显示更改
2. 每个块前显示选项提示
3. 用户选择如何操作该块
4. 继续处理下一个块

### 选项

当Git显示一个代码块时，会提示

```text
Stage this hunk [y,n,q,a,d,j,J,g,/,s,e,?]?
```

常用选项

- y(yes)：暂存此块
- n(no)：不暂存此块
- q(quit)：退出，不暂存当前块及后续所有块
- a(all)：暂存当前文件的所有块
- d(done)：不暂存当前文件的所有块
- j(jump)：跳过当前块，暂不决定
- J(Join)：跳到下一个块，但把当前块合并到下一个
- g(goto)：选择特定块处理
- /(search)：用正则表达式搜索块
- s(split)：将当前大块分割成更小的块
- e(edit)：手动编辑当前块
- ?(help)：显示帮助

#### s(split) 分割大块

当Git显示的块太大，包含多个逻辑更改时

```diff
@@ -10,7 +10,10 @@ def calculate_total(items)
    total = 0
    for item in items:
        total += item.price
-   return total
+
+   # 添加折扣计算
+   # discount = total * 0.1
+   return total - discount

# 另一个不相关的函数
def validate_input(data):
```

输入`s`后，Git会尝试将大块分割成更小的逻辑块

#### e(edit) 手动编辑

- 选择特定暂存行
- 修改要暂存的内容
- 完全自定义暂存内容

输入`e`后进入编辑界面

```diff
# Manual hunk edit mode -- see bottom for a quick guide.
@@ -10,7 +10,10 @@ def calculate_total(items):
     total = 0
     for item in items:
         total += item.price
-    return total
+    
+    # 添加折扣计算
+    discount = total * 0.1
+    return total - discount
 
# ---
# To remove '-' lines, make them ' ' lines (context).
# To remove '+' lines, delete them.
# Lines starting with # will be removed.
```

编辑规则

- 保留`-`开头的行：从暂存区删除
- 删除`+`开头的行：不添加这些更改
- 将`-`改为空格：保留原行
- 添加新行：使用`+`开头

#### Hunk

在Git中，Hunk是diff输出的一个基本单位，代表文件中一组连续的更改行。一个hunk包含

- 上下文行（未更改）
- 删除的行（以`-`开头）
- 添加的行（以`+`开头）

<!---TODO: Hunk划分机制-->
