---
title: Three Local Area
date: 2025-12-31
categories: [Git]
tags: [Note]
author: "ljf12825"
type: log
summary: Git 3 local areas and 4 objects
---

# 工作区
工作区就是实际操作的目录，包含项目的所有文件和子目录

## 作用
- 直接可见和可编辑的文件
- 也成为工作目录或工作副本
- 文件状态可能是：未跟踪（untracked）、已修改(modified)和未修改(unmodified)

## 常用命令
- 直接编辑文件
- `git status`查看文件状态
- `git add`将修改加入暂存区
- `git restore`恢复工作区或暂存区状态

## `git add`
`git add`是Git中最基础且重要的命令之一，用于将工作目录中的变更添加到暂存区，为后续提交做准备

### 基本语法
```bash
git add [选项] <文件/目录/模式>
```
**主要用法**
1. 添加单个文件
```bash
git add filename.txt
```
将指定的文件变更添加到暂存区

2. 添加多个文件
```bash
git add file1.txt file2.js file3.css
```
可以一次性添加多个文件

3. 添加整个目录
```bash
git add dirname/
```
添加指定目录下的所有变更（不包括子目录，除非使用递归选项）

4. 添加当前目录所有变更
```bash
git add .
```
添加当前目录及其所有子目录中的所有已追踪文件的变更（不包括未追踪的新文件）

5. 添加所有变更（包括为未跟踪的文件）
```bash
git add -A
# 或
git add --all
```
添加工作区中所有已跟踪文件的修改和删除，以及所有未跟踪的新文件（不包括`.gitignore`中指定的文件）

6. 交互式添加
```bash
git add -i
# 或
git add -interactive
```
进入交互模式，可以更精细地控制要暂存的变更，在交互模式中，可以选择
  - 暂存更新
  - 暂存撤销
  - 暂存补丁
  - 暂存差异

7. 按补丁添加（部分添加）
```bash
git add -p
# 或
git add --patch
```
交互式选择文件中的部分变更进行添加，而不是整个文件，操作提示：
  - y：暂存当前块
  - n：不暂存当前块
  - s：拆分当前块
  - e：手动编辑当前块

8. 添加已跟踪文件的修改（不包括新文件）
```bash
git add -u
# 或
git add --update
```

**特殊用法**
1. 使用通配符添加文件
```bash
git add *.js
```
添加所有`.js`文件

2. 添加修改和删除的文件，但不包括新文件
```bash
git add -u .
```

3. 强制添加被忽略的文件
```bash
git add -f ignored_file.log
```

### 常用参数

| 选项 | 全称 | 说明 |
| - | - | - |
| `-n` | `--dry-run` | 只显示要添加的文件，不实际执行 |
| `-v` | `--verbose` | 显示详细信息 |
| `-f` | `--force` | 允许添加通常被忽略的文件 |
| `-e` | `--edit` | 手动编辑差异 |
| `--ignore-errors` | | 跳过因错误无法添加的文件 |
| `--ignore-missing` | | 检查文件是否存在 |

### 注意事项
1. `git add`不会自动添加`.gitignore`忽略的文件
2. 添加后的变更可以通过`git reset`从暂存区移除
3. 使用`git add -A`或`git add .`时要小心，避免添加不必要的文件
4. 建议经常使用`git status`查看添加后的状态变化

## `git restore`
`git restore`是Git2.23版本引入的一个新命令，旨在提供更职官和安全的文件恢复操作，它替代了部分`git checkout`和`git reset`功能

### 核心功能
`git restore`主要用于三种场景
1. 丢弃工作区的修改（恢复到最后一次提交或暂存区状态）
2. 取消暂存（将文件从暂存区移出）
3. 从指定提交恢复文件

### 基础用法
1. 丢弃工作区修改（危险操作）
```bash
git resotre <file>
```
- 将工作区文件恢复到暂存区状态（如果已暂存）
- 如果没有暂存，则恢复到最近一次提交的状态
- 会永久丢失工作区未暂存的修改

2. 取消暂存（安全操作）
```bash
git resotre --staged <file>
```
- 将文件从暂存区移出
- 保留工作区的修改
- 相当于旧命令`git reset HEAD <file>`

3. 从特定提交恢复
```bash
git restore --source=<commit> <file>
```
- 从指定提交恢复文件到工作区
- 不影响暂存区
- 例如：`git restore --source=HEAD~2 config.ini`

4. 组合操作
```bash
git restore --source=HEAD --staged --worktree <file>
```
- 同时恢复工作区和暂存区
- 完全重置文件到最后一次提交状态

5. 交互式恢复
```bash
git restore --patch <file>
```
- 交互式选择要恢复的变更块
- 类似于`git add -p`的反向操作

6. 恢复整个目录
```bash
git restore
```
- 恢复当前目录所有文件
- 可结合`--staged`等选项使用

### 注意事项
1. `git restore`是一个破坏性操作，特别是没有`--staged`选项时会丢弃工作区修改
2. 恢复操作不可逆，建议先提交或备份重要更改
3. 可以使用`--dry-run`选项先模拟操作结果

# 暂存区
暂存区也称为”索引“（Index）。它是Git工作流程中的一个中间步骤，位于工作目录和版本库之间

## 作用
1. 选择性提交：允许只提交部分修改过的文件，甚至是一个文件中的部分修改
2. 准备提交内容：将工作目录中的变更收集起来，形成一个逻辑上完整的变更集
3. 分离修改与提交：可以在提交前审查和整理变更

## 特点
- 存储了下次将要提交的文件变更
- 允许选择性提交部分
- 是Git独有的概念，其他VCS通常没有这一层

## 常用命令
- `git add`添加文件到暂存区
- `git reset`从暂存区移除文件
- `git diff --cached`查看暂存区与仓库的差异

## 原理
1. 存储位置：`.git/index`二进制文件
2. 内容结构
  - 文件路径的SHA-1哈希值
  - 时间戳
  - 文件大小
  - 权限信息
3. 查看原始内容
```bash
git ls-files --stage # 查看暂存区完整内容
```

# Git仓库
Git仓库是Git存储项目历史记录的地方，包含所有提交的对象

## 特点
- 存储完整的历史项目
- 包含提交（commit）、树(tree)和二进制大对象(blob)
- 本地仓库存储在项目目录的`.git`子目录中
- 可以推送到远程仓库与他人共享

## 仓库结构
Git仓库核心目录结构（.git目录）
```text
.git/
├── HEAD                  # 当前所在分支的引用
├── config                # 仓库特定的配置
├── description           # 仓库描述（主要用于GitWeb）
├── hooks/                # 客户端和服务端钩子脚本
│   ├── pre-commit.sample    # 提交前钩子示例
│   ├── post-update.sample   # 更新后钩子示例
│   └── ...                 # 其他钩子示例
├── info/                 # 全局排除模式
│   └── exclude           # 本地忽略规则（不共享）
├── objects/              # 所有Git对象数据库
│   ├── info/             # 对象信息
│   └── pack/             # 打包的对象（优化存储）
├── refs/                 # 引用（分支和标签）指针
│   ├── heads/            # 本地分支引用
│   └── tags/             # 标签引用
└── index                 # 暂存区（索引）文件
```

### objects in .git
Git的核心是一个简单的键值对数据库（key-value data store），这个数据库主要包含四种基本对象：blob对象、tree对象、commit对象和tag对象。这些对象共同构成了Git版本控制的基础

**git对象的存储机制**
所有Git对象都存储在`.git/objects`目录下，采用分目录 + 压缩的方式每个对象都有一个40个字符的SHA-1哈希值作为唯一标识
- 前两个字符作为目录名，后38个字符作为文件名
- 内容是zlib压缩的
- 每个对象在压缩前的格式是
```php-template
<type> <size>\0<content>
```
这是Git计算SHA-1哈希的原始数据格式
- Git对象是不可变的，如果内容相同（包括元数据），对象哈希就相同，不会重复存储
- 新对象会先存在`.git/objects/`目录中（松散对象），多了之后，Git会用`git gc`打包成`.pack`文件以节省空间，并生成`.idx`索引
- 分支本质上是`.git/refs/heads/`下的一个指针文件，里面存一个commit SHA
- `HEAD`通常指向某个分支（间接引用），也可以直接指向某个commit（游离状态）

#### 四种对象类型
1. Bolb对象（二进制大对象）
- 作用：存储文件内容
- 特点：
  - 只保存文件内容，不保存文件名、权限等元数据
  - 相同内容只会存储依次（节省空间）
  - 通过`git hash-object`命令创建
  ```bash
  echo 'test content` | git hash-object -w --stdin
  ```
  - 用命令查看
  ```bash
  git hash-object hello.txt # 计算文件哈希值
  git cat-file -p <blob_sha> # 查看 blob内容
  ```

2. Tree对象（树对象）
- 作用：代表目录结构，记录文件名和目录结构
- 特点：
   - 包含一组指向blob对象或其他tree对象的指针
   - 每条记录包含：文件模式、对象类型、SHA-1哈希值和文件名
   - 通过`git write-tree`命令创建
   - 类似一个“目录快照”
   - 查看
   ```bash
   git ls-tree <tree_sha>
   ```

3. Commit
  - 代表一次提交
  - 保存的信息包括
    - 指向一个tree（即此提交的根目录快照）
    - 父提交（parent）
    - 作者（author）和提交者（committer）
    - 提交说明（message）
  - 查看
  ```bash
  git cat-file -p <commit_sha>
  ```

4. Tag
- 给commit打标签，可以是轻量标签或附注标签
- 附注标签本身也是Git对象，包含tag创建者、时间、描述等信息
- 查看
```bash
git cat-file -p <tag_sha>
```

```rust
commit ----> tree ----> blob (文件内容)
           └----> tree ----> blob
tag ------> commit
```
commit只认它的顶级Tree
tag是commit的别名，方便引用

#### 总结
Git对象的层级关系
1. Blob和Tree
  - Tree是目录对象，像一个文件夹
  - Tree的节点可以是：
    - Blob（文件内容对象）
    - 另一个Tree（子目录）
  - 所以，Blob和Tree都是Tree的子节点，但Blob永远是叶子节点，Tree可以继续分支

2. Commit
  - Commit并不是直接保存文件内容，而是保存一个Tree的哈希
  - 这个Tree是该次提交的项目根目录快照
  - Commit还会记录：
    - 父commit（形成历史链）
    - 作者、时间、提交信息
    - 所以，Commit相当于一个“版本标签”，指向一个完整的目录快照（Tree）

3. Tag
  - Tag是对一个对象的引用（最常见的是指向Commit）
  - Tag也可能指向Blob或Tree，但通常没有意义，其几乎不用
  - 附注标签本身是一个Git对象，记录标签作者、时间、说明，并包含一个指向目标对象（通常是Commit）的指针




## 常用命令
- `git commit`：将暂存区内容提交到仓库
- `git show <commit>` 查看特定提交的详细信息
- `git log`：查看提交了历史
- `git push`：推送到远程仓库
- `git init`：初始化新仓库
- `git clone`：克隆远程仓库
- `git gc`：垃圾回收优化仓库
- `git prune`：删除孤立对象
- `git repack`：重新打包松散对象
- `git fsck`：检查仓库完整性
- `git reflog`：查看所有历史操作（救命命令）
- `git filter-branch`：批量修改历史
- `git archive`：归档
- `git replace`：在引用图中替换某个对象的指针

## `git commit`
`git commit`的作用是将staging area中的内容作为一个新的提交保存到Git仓库中
```bash
git commit -m "提交信息"
```
这会
1. 将暂存区的内容创建一个新的提交
2. 使用指定的提交信息记录这次变更
3. 更新当前分支指向这个新提交

### 常用参数
1. 修改提交信息
```bash
git commit --amend
```
这会
- 打开编辑器修改最后一次提交的提交信息
- 或者与`-m`一起使用直接指定新信息
```bash
git commit --amend -m "新的提交信息"
```

2. 添加变更到上次提交
```bash
git commit --amend --no-edit
```
这会
- 将当前暂存区的变更添加到上次提交中
- 保持原有的提交信息不变

3. 跳过暂存区直接提交
```bash
git commit -a -m "提交信息"
```
或
```bash
git commit -am "提交信息"
```
这会：
- 自动暂存所有已跟踪文件的变更
- 然后创建提交（相当于`git add -u` + `git commit` ）

4. 部分文件提交
```bash
git add file1.txt file2.txt
git commit -m "部分提交"
```

5. 空提交
```bash
git commit --allow-empty -m "空提交"
```
用于触发CI

6. 指定作者信息
```bash
git commit -m "提交信息" --author="名字 <emali>"
```

7. 指定日期
```bash
git commit -m "提交信息" --date="2023-01-01T12:00:00"
```

### 最佳实践
1. 原子性提交：每个提交只做一件事
2. 频繁提交：小步提交比大变更更好
3. 描述性信息：清楚地说明为什么变更，而不仅是做了什么
4. 验证提交：提交前使用`git dirr --cached`检查

## `git show`
`git show`是Git中用于显示各种Git对象（如提交、标签、树和blob）详细信息的强大命令

### 基本用法
1. 显示最新提交的详细信息
```bash
git show
```
这会显示最近一次提交的：
- 提交哈希
- 作者信息
- 提交日期
- 提交信息
- 变更内容（diff）

2. 显示特定提交的详情
```bash
git show <commit-hash>
```

3. 显示标签对应的提交
```bash
git show <tag-name>
```

4. 仅显示提交信息（不显示diff）
```bash
git show --stat <commit>
```
这会显示
- 提交元数据
- 更改的文件统计（那哪些文件被修改，增减行数>

5. 显示特定文件的变更
```bash
git show <commit>:<file-path>
```

6. 简洁格式显示
```bash
git show --oneline <commit>
```

7. 显示原始差异（raw diff）
```bash
git show --raw <commit>
```

8. 显示特定作者提交
```bash
git show <commit> --author="John"
```

9. 比较两次提交间的差异
```bash
git show <commit1>..<commit2>
```

10. 显示合并提交的父提交差异
```bash
git show -m <merge-commit>
```

11. 显示文件在特定提交时的内容
```bash
git show <commit>:<path/to/file>
```

12. 显示提交引入的补丁
```bash
git show -p <commit>
```

13. 输出格式控制
自定义格式
```bash
git show --pretty=format:"%h - %an, %ar : %s" <commit>
```
常用格式占为符
  - `%H`：完整提交哈希
  - `%h`：简短提交哈希
  - `%an`：作者名字
  - `%ar`：相对作者日期
  - `%s`：提交信息主题

JSON格式输出
```bash
git show --pretty=format:'{%n  "commit": "%H",%n  "author": "%an",%n  "date": "%ad",%n  "message": "%s"%n}' -s <commit>
```

## `git init`
`git init`是初始化命令，用于创建一个新的Git仓库
```bash
git init
```
这会在当前目录创建一个新的Git仓库，生成一个隐藏的`.git`目录，包含所有必要的Git元数据

### 常用选项
1. 指定目录名称
```bash
git init <目录名>
```
这会：
- 创建指定名称的目录
- 在该目录中初始化Git仓库

2. 创建裸仓库
```bash
git init --bare
```
裸仓库特点：
- 没有工作目录
- 专门用于共享/协作
- 通常用于中央仓库或服务器

3. 指定初始分支名称
```bash
git init -b <分支名>
```

### 注意事项
1. 在已有Git仓库中再次运行`git init`是安全的，不会覆盖已有内容
2. Git2.28+版本开始，默认初始分支可以通过配置修改
```bash
git config --global init.defaultBranch main
```
3. 初始化后需要至少一个提交才会真正创建分支


## `git clone`
`git clone`用于将远程仓库完整地复制到本地
```bash
git clone <仓库URL> [目录名]
```

### 核心功能
1. 完整复制远程仓库：包括所有历史记录、分支和配置
2. 自动设置远程追踪：默认创建名为`origin`的远程连接
3. 检出工作副本：自动检出默认分支（通常是`main`或`master`）

### 常用用法
1. 基本克隆
```bash
git clone <repoURL>
```

2. 克隆到指定目录
```bash
git clone <repoURL> [目录名]
```

3. 克隆时指定分支
```bash
git clone -b branch_name <repoURL>
```

4. 克隆深度克隆（只获取最近历史）
```bash
git clone --depth 1 <repoURL>
```

5. 克隆裸仓库
```bash
git clone --bare <repoURL>
```

6. 克隆时排除某些历史
```bash
git clone --filter=blob:none <repoURL>
```

7. 克隆子模块（递归克隆）
```bash
git clone --recursive <repoURL>
```

8. 克隆时指定配置
```bash
git clone -c core.autocrlf=input <repoURL>
```

### 支持的协议
`git clone`支持多种协议
- HTTPS：`https://github.com/user/repo.git`
- SSH：`git@github.com:user/repo.git`
- Git：`git://github.com/user/repo.git`
- 本地路径：`/path/to/repo` 或 `file:///path/to/repo`

### 注意事项
1. 克隆大型仓库可能需要较长时间和足够的磁盘空间
2. 私有仓库需要配置正确的认证方式
3. 默认只克隆默认分支，其他分支需要通过`git checkout`获取
4. 克隆后会自动设置远程跟踪分支，可以直接使用`git pull`更新

## `git gc`
`git gc`（Garbage Collection）是Git的垃圾回收命令，用于优化本地仓库性能并清理不必要的文件
```bash
git gc
```
核心功能
1. 清理松散对象：删除不再被引用的对象（commit，tree，blob等）
2. 压缩对象：将多个松散对象打包成更高效的`.pack`文件
3. 优化仓库结构：重组Git内部数据结构提高性能
4. 修剪过时引用：清理陈旧的reflog条目

### 常用选项

| 选项 | 描述 |
| - | - |
| `--aggressive` | 更彻底的优化（耗时更长）|
| `--auto` | 只在必要时执行（Git自动调用时使用） |
| `--prune=<date>` | 删除指定日期前的松散对象（如`--prune=now`）|
| `--no-prune` | 不删除任何松散对象 |
| `--quiet` | 静默模式，减少输出 |

### 执行时机
Git会在以下情况自动执行`gc`
- 创建太多松散对象时
- 执行某些命令时（如`git push`）
- 达到配置的阈值时

**手动执行场景**
1. 仓库体积异常增大时
2. Git操作变慢时
3. 大量提交后准备归档时
4. 长时间使用的仓库定期维护

### 配置参数
可通过`git config`调整GC行为
```bash
# 自动设置GC的松散对象阈值
git config gc.auto 1000

# 设置自动打包的对象阈值
git config gc.autoPackLimit 50

# 设置prune过期时间（默认两周）
git config gc.pruneExpire "1 month ago"
```

### `git prune`
`git prune`是Git中用于清理不可达对象的底层命令，通常被`git gc`自动调用，但在某些特殊情况下需要手动调用

```bash
git prune [-n] [-v] [--expire <time>] [--] [<head>...]
```

#### 核心功能
1. 删除孤立对象：清理没有被任何引用（分支、标签、reflog等）指向的Git对象
2. 回收存储空间：减少`.git/objects`目录的大小
3. 维护仓库健康：移除无用数据，优化仓库性能

#### 常用选项

| 选项 | 描述 |
| - | - |
| `-n`/`--dry-run` | 只显示将要删除的对象，不实际执行 |
| `-v-/`--verbose` | 显示详细处理信息 |
| `--expire <time>` | 只删除早于指定时间的对象（如`--expire=now`） |
| `--progress` | 显示进度条 |

#### 工作原理
1. 扫描`.git/objects`目录中的所有对象
2. 检查每个对象是否被以下引用
  - 分支和标签
  - reflog记录
  - 其他对象引用
3. 删除所有未被引用的对象

#### 注意事项
1. 危险操作：删除的对象无法恢复，确保没有重要数据未被引用
2. 通常不需要手动执行：`git gc`会自动调用`prune`
3. 可能影响悬空提交：会清理违背引用但可能有价值的提交
4. 大型仓库耗时：对象多的仓库可能需要较长时间

### `git repack`
`git gc`的子操作，`git repack`是Git中用于优化仓库存储结构的底层命令，它会将多个松散对象（loose objects）重新打包成更高效的pack文件

```bash
git repack [选项]
```

#### 核心功能
1. 将松散对象打包：将`.git/objects`中的单个文件对象合并为pack文件
2. 删除冗余对象：移除重复的或未被引用的对象
3. 优化存储：通过delta压缩减少仓库体积
4. 提高性能：减少Git操作时需要访问的文件数量

#### 常用选项

| 选项 | 描述 |
| - | - |
| `-a` | 打包所有松散对象（包括未被引用的） |
| `-d` | 打包后删除冗余的松散对象 |
| `-f` | 强制重新打包已有pack文件 |
| `-l` | 保留旧的pack文件（安全选项） |
| `-n` | 只显示将要执行的操作，不实际运行 |
| `--window=<n>` | 设置delta压缩窗口大小（默认10） |
| `--depth=<n>` | 设置delta压缩的深度（默认50） |
| `--threads=<n>` | 设置打包使用的线程数 |

####  配置参数
可通过`git config`调整repack行为
```bash
# 设置 delta压缩窗口大小
git config repack.window 50

# 设置 delta的深度
git config repack.depth 100

# 设置自动打包
git config gc.autoPackLimit 50
```

#### 注意事项
1. 大型仓库可能耗时：深度优化可能需要较长时间
2. 网络仓库慎用：可能导致后续推送需要重新上传对象
3. 内存使用：大窗口/深度设置会增加内存消耗
4. 通常不需要手动执行：`git gc`会自动处理

## `git fsck`
`git fsck`（File System ChecK）是Git提供的仓库完整性检查工具，用于验证Git对象数据库的连通性和有效性

```bash
git fsck [选项]
```

### 核心功能
1. 验证对象完整性：检查所有Git对象（blob、tree、commit、tag）是否有效
2. 检测损坏对象：找出存储损坏或内容不完整的对象
3. 发现孤立对象：识别没有被任何引用指向的对象
4. 检查仓库健康状态：确保仓库数据结构一致

### 常用选项

| 选项 | 描述 |
| - | - |
| `--full` | 执行完整检查（默认行为）|
| `--unreachable` | 只显示不可达对象 |
| `dangling` | 显示悬空对象（无引用但未损坏） |
| `--no-reflogs` | 忽略refolg引用进行检查 |
| `--strict` | 执行更严格的检查 |
| `--verbose` | 显示详细输出 |
| `--lost-found` | 将悬空对象写入`.git/lost-found` |

### 输出分析
1. 悬空对象
```text
dangling blob <sha1>
dangling commit <sha1>
```
这些是未被引用但内容完整的对象，通常安全

2. 损坏对象
```text
corrut blob <sha1>
missing blob <sha1>
```
表示对象已损坏或丢失，需要修复

3. 不可达对象
```text
unreachable commit <sha1>
```
这些提交无法从任何引用达到

## `git reflog`
`git reflog`是Git的安全网，它记录了本地仓库中所有的引用变更历史，可以帮助恢复意外丢失的提交或分支

```bash
git reflog [show] [<引用>] # 显示引用日志
git reflog expire # 删除过期的reflog条目
git reflog delete # 删除特定reflog条目
```

### 核心概念
1. 引用日志：记录HEAD和分支引用的所有变更
2. 时间限制：默认保留90天（可通过`gc.reflogExpire`配置）
3. 本地特有：reflog不会推送到远程仓库

### 使用
1. 查看HEAD的变更历史
```bash
git reflog
```

2. 查看特定分支的历史
```bash
git reflog show feature-branch
```

**关键组成部分**
1. 提交哈希：每次操作对应的提交ID（可能缩写）
2. 引用位置：如`HEAD@{n}`表示HEAD的第n次前位置
3. 操作类型：commit、reset、checkout、merge等
4. 操作描述：简要说明发生了什么

### 实用场景
1. 恢复误删的提交
```bash
git reflog
# 找到删除前的提交哈希
git checkout <提交哈希>
git checkout -b  recovered-branch
```

2. 撤销错误的reset
```bash
git reflog
git reset --hard HEAD@{1} # 恢复到上一步状态
```

3. 找回误删的分支
```bash
git reflog | grep "deleted branch"
git branch <分支名> <提交哈希>
```

4. 查看分支创建时间
```bash
git reflog show --date=iso <分支名>
```

5. 显示详细时间信息
```bash
git reflog --date=iso
```

6. 搜索特定操作
```bash
git reflog | grep "merge"
```

7. 清理旧纪录
```bash
git reflog expire --expire=now --all
git gc
```

### 注意事项
1. reflog是本地独有的，不会推送到远程
2. 默认保留90天（可通过`git config gc.reflogExpire`修改）
3. 执行`git gc --prune=now`会清理reflog
4. 重要变更建议立即创建分支或标签，而非依赖reflog

## `git filter-branch`
`git filter-branch`是Git中一个强大的历史重写工具，它可以批量修改提交历史。由于它的破坏性和复杂性，Git官方现在推荐使用`git filter-repo`作为替代

```bash
git filter-branch [选项] <过滤器> [修订范围]
```
主要用途为
- 从历史中彻底删除文件（包括所有提交记录）
- 修改提交元数据（作者/提交者信息）
- 提取子目录作为新仓库
- 全局替换文件内容

常用过滤器类型

| 过滤器选项 | 作用 |
| - | - |
| `--tree-filter` | 对每个提交的工作树执行命令（慢但彻底）|
| `--index-filter` | 只修改暂存区（快，适用于文件删除） |
| `--parent-fileter` | 修改提交的父引用 |
| `--msg-filter` | 修改提交信息 |
| `--env-filter` | 修改作者/提交者环境变量 |
| `--subdirectory-filter` | 提取子目录作为新根目录 |

### 使用场景
1. 从历史中删除大文件
```bash
git filter-branch --force --index-filter \
  'git rm --cached --inigore-unmatch 文件名' \
  --prune-empty --tag-name-filter cat -- --call
```

2. 批量修改作者名字
```bash
git filter-branch --env-filter '
  if [ "$GIT_AUTHOR_NAME" = "旧名字" ];
  then
    GIT_AUTHOR_NAME="新名字";
    GIT_AUTHOR_EMAIL="新邮箱";
  fi
' -- --all
```

3. 提取子目录为新仓库
```bash
git filter-branch --sundirectory-filter 子目录名 -- --all
```

4. 全局替换文件内容
```bash
git filter-branch --tree-filter \
  'sed -i "s/旧文件/新文本/g" 文件名' -- --all
```

### 注意事项
1. 破坏性操作：会重写整个历史，必须提前备份
2. 协作影响：重写后所有协作者需要重新克隆
3. 性能问题：大型仓库可能耗时极长
4. 替代方案：考虑使用`git filter-repo`（更现代的工具）

## `git archive`
`git archive`是Git提供的归档命令，用于将仓库内容打包成非Git格式的压缩文件，非常适合代码发布、备份或与不需要Git历史的用户共享项目
```bash
git archive [选项] <tree-ish> [<路径>...]
```

核心功能
1. 将代码快照打包：不包含`.git`目录和版本控制信息
2. 支持多种格式：zip, tar, tar.gz, tar.xz等
3. 精确控制内容：可指定特定提交/分支/标签和子目录
4. 保留文件权限：保持原始执行权限和属性

常用选项

| 选项 | 描述 |
| - | - |
| `--format=<fmt>` | 指定格式（zip, tar, tar.gz）|
| `--output=<file>` | 指定输出文件名 |
| `--prefix=<prefix>/` | 为文件添加路径前缀 |
| `-v`/`--verbose` | 显示详细处理信息 |
| `-l`/`--list` | 列出支持的格式 |

### 用法
1. 打包当前分支最新代码
```bash
git archive --format=zip --output=release-v1.0.zip HEAD
```

2. 打包特定标签版本
```bash
git archive --format=tar.gz v2.1.0 | gzip > project-v2.1.0.tar.gz
```

3. 只打包指定子目录
```bash
git archive --format=zip HEAD:src/ > src-only.zip
```

4. 添加前缀路径
```bash
git archive --format=tar --prefix=project-1.0/ v1.0 | gzip > project-1,0.tar.gz
```

5. 基于工作树创建归档（包含未提交修改）
```bash
git archive -o pathc.zip HEAD $(git diff --name-only HEAD)
```

6. 导出特定日期版本的代码
```bash
git archive -o snapshot.zip $(git rev-list -n 1 --before="2023-01-01" main)
```

7. 创建分卷压缩包
```bash
git archive --format=tar HEAD | split -b 50m - project.tar.part
```

8. 排除某些文件
```bash
git archive HEAD --format=tar --output=project.tar $(git ls-files | grep -v 'test/')
```

### 与普通压缩的区别

| 特性 | git archive | 普通压缩 |
| - | - |- |
| 内容来源 | 版本库快照 | 工作目录文件系统 |
| 包含.git | 从不包含 | 可能包含 |
| 文件权限 | 精确保留 | 可能丢失 |
| 元数据 | 不含.git信息 | 保留所有文件属性 |
| 构建方式 | 基于提交对象 | 基于文件系统 |

### 注意事项
1. 归档不包含Git历史记录，仅包含文件快照
2. 默认基于提交对象，如需包含工作目录修改需特殊处理
3. 大仓库归档可能需要较长时间
4. 建议在归当前执行`git gc`优化仓库

## `git replace`
**基本作用**
1. 替换任意Git对象：commit、tree、blob、tag都可以
2. Git读取对象时，如果存在替换关系，会自动用替换对象替换原对象
3. 原对象文件不变，提花内心戏记录在`.git/refs/replace/`下

**语法**
```bash
# 创建替换
git replace <old> <new>

# 列出替换记录
git replace -l

# 删除替换
git replace -d <old>

# 清空所有替换
git replace --delete <old> # 单个
git replace --delete $(git replace -l) # 全部
```

### 应用场景
1. 修复历史提交信息
  - 如果发现某个commit的作者写错了，但又不想用`git rebase`重写整个历史，可以
  ```bash
  git cat-file commit <commit_sha> tmp.txt
  # 编辑tmp.txt修改作者信息
  git hash-object -t commit -w tmp.txt
  git replace <old_commit_sha> <new_commit_sha>
  ```
  这样Git会认为旧commit已经被替换了

2. 测试新的父提交
  - 临时更改某个commit的父指针，测试不同分支合并的结果

3. 调试或数据恢复
  - 如果仓库损坏，可以用`git replace`指向修复后的对象，让仓库可用
4. 部分历史替换
  - 如果fork了一个大仓库，只想替换某部分的历史文件，而不动其他commit

### 底层实现
当执行`git replace A B`时，Git会创建`.git/refs/replace/A`，里面的内容是`B`；当Git读取A时，会先看`.git/refs/replace/A`是否存在，如果有，就用B代替

### 注意事项
- 替换只是本地生效，不会推送到远程，除非显式推送`.git/refs/replace`
- 适合临时修改、调试，不适合长期依赖
- 如果想永久修改历史，还是应该用`git filter-branch`或`git filter-repo`