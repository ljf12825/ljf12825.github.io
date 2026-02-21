# `git restore`
Git2.23(2019)新增命令，它的目标是简化之前易混淆的`git checkout`用法，专门用于恢复文件

## 主要用法
### 1. 丢弃工作区的修改（尚未`git add`）
```bash
git restore <file>
```
或者更明确地指定源（最后一次提交）
```bash
git restore --source=HEAD <file>
```
- 原理：它使用`HEAD`（即当前分支最新的提交）中的文件版本，覆盖工作目录中指定的文件。当前工作区的修改会被永久丢弃，无法找回（除非用其他方式备份），谨慎操作
- 等效于：`git checkout -- <file>`

**示例**
```bash
# 修改了README.md，但想放弃修改
git restore README.md

# 恢复所有被修改的文件
git restore .
```

### 2. 取消暂存（已`git add`，但尚未`git commit`）
```bash
git restore --staged <file>
```
- 原理：它使用`HEAD`中的文件版本，覆盖暂存区中的文件。但不会影响工作目录中的文件。所以效果是，暂存区被重置，工作目录仍然保留
- 等效于`git reset HEAD <file>`

**示例**
```bash
# 不小心把 debug.log 文件 add 了，想把它从暂存区移除
git restore --staged debug.log

# 取消暂存所有文件
git restore --staged .
```

### 3. 同时恢复工作区和暂存区
```bash
git restore --staged --worktree <file>
# 或者简化为
git restore -S -W <file>
# 或（因为 --source=HEAD 是默认值）
git restore -s HEAD -S -W <file>
```
- 原理：这相当于先执行了`git restore --staged <file>`，然后又立即执行了`git restore <file>`

### 4. 恢复到更早的提交版本
```bash
git restore --source=<commit-hash-or-branch> <file>
```
- 原理：它从指定的历史提交（通过哈希值、分支名或标签名）中提取文件，并覆盖工作目录中的文件，需要再次`git add`和`git commit`来完成这次还原

**示例**
```bash
# 发现当前的改动不对，想将 index.html 文件恢复到 3 次提交之前的状态
git restore -s HEAD~3 index.html

# 从另一个分支（比如 main）恢复一个文件到当前工作目录
git restore -s main some-file.js
```

## 常用参数

| 选项 | 简写 | 作用 |
| - | - | - |
| `--source` | `-s` | 指定恢复的源（提交、分支、标签）默认为`HEAD` |
| `--staged` | `-S` | 只恢复暂存区。文件内容从源中取出，放入暂存区，不影响工作目录 |
| `--worktree` | `-W` | 只恢复工作目录。这是默认行为，通常可以省略 |
| `--patch` | `-p` | 交互式地选择要恢复的代码块 |
