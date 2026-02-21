---
title: Branch
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain, Mechanism]
author: "ljf12825"
type: log
summary: git branch and commmand
---

Git中分支（branch）是一个非常强大和灵活的功能，它使得在不同的开发线（工作流）上并行开发成为可能

## 为什么要使用Git分支
1. 并行开发：不同的功能、特性或bug修复可以在不同的分支上进行开发，互不干扰
2. 避免破坏主分支：在开发新特性时，可以避免对主分支（通常是`master`或`main`）造成不稳定或破坏性改动
3. 隔离开发环境：每个分支都有自己的开发环境，可以在上面做实验、修改、测试，而不会影响到其他开发分支或主分支

## Git分支的基本操作
1. 查看当前分支
查看当前所在的分支，可以使用以下命令：
```bash
git branch
```
当前分支会在分支名旁边标出`*`

2. 创建新分支
创建一个新分支但不切换到新分支
```bash
git branch <branch_name>
```
例如，创建一个名为`feature/login`的分支
```bash
git branch feature/login
```
如果你创建新分支并直接切换过去，可以使用：
```bash
git checkout -b <branch_name>
```
这个命令相当于先创建新分支并切换过去

3.  切换分支
切换到其他分支可以使用
```bash
git checkout <branch_name>
```
例如，切换到`feature/login`分支：
```bash
git checkout feature/login
```
在Git2.23及之后的版本，你还可以使用`git switch`命令来切换分支
```bash
git switch <branch_name>
```
所有分支都是历史代码库的一部分，只是不同的版本快照，当切换分支后，相应的快照也会切换，你会看到相同文件在不同分支上的不同呈现  
所以，开发前要明确当前所在分支  
此外，本地分支和远端分支是一一对应的  

## 分支的本质
Git分支本质上只是一个指针，它指向某一次提交（Commit对象）

**分支的底层结构**\
Git存储数据的三类核心对象
- Blob对象（文件内容）
- Tree对象（目录结构）
- Commit对象（一次提交，包含作者、时间、父提交、tree对象等）
- Tag对象（Commit对象的别名）

分支就是`.git/refs/heads/<分支名>`文件，里面存的是一个commit哈希值（40为SHA-1）\
例如
```bash
$ cat .git/refs/heads/main
5d41402abc4b2a76b9719d911017c592
```
哈希值就是`main`分支当前指向的提交

**HEAD**\
HEAD也是一个指针，指向当前检出的分支（或直接指向某个commit，叫“分离头”状态）
例如
```bash
$ cat .git/HEAD
ref: refs/heads/main
```
意思是：HEAD -> main（分支名），main -> 某个 commit 哈希， commit -> 对应代码快照

**分支切换的本质**\
假设当前结构
```css
HEAD -> main -> C2 -> C1
```
执行：
```bash
git checkout dev
```
发生的事
1. HEAD改成指向`dev`
2. 工作区和暂存区的内容更新为`dev`所指向的提交的快照

**分支创建的本质**\
```bash
git branch feature
```
发生的事
- 在`.git/refs/heads/`下新建一个`feature`文件
- 把当前HEAD所指的提交哈希写进去（所以新分支和原分支指向同一提交）

**分支合并的本质**\
合并就是生成一个新的commit，它有多个父提交
```makefile
main:   C1 → C2
dev:         ↘ C3
merge:           M (父是 C2 和 C3)
```
M就是合并提交，它的tree对象是合并后的文件状态


4. 删除分支
如果你不再需要某个分支，可以将其删除：
  - 删除本地分支（如果分支已经合并）
```bash
git branch -d <branch_name>
```
例如，删除`feature/login`分支：
```bash
git branch -d feature/login
```
  - 强制删除未合并的分支（如果该分支上有尚未合并的更改）
```bash
git branch -D <branch_name>
```

5. 查看分支的提交历史
查看某个分支的提交历史
```bash
git log <branch_name>
```
例如，查看`feature/login`分支的提交历史
```bash
git log feature/login
```

6. 合并分支
将一个分支的更改合并到另一个分支，通常是将开发分支合并回主分支（`main`或`master`）
 1. 切换到目标分支（例如，`main`）
    ```bash
    git chechout main
    ```
 2. 合并目标分支（例如，`feature/login`）
    ```bash
    git merge feature/login
    ```
如果出现冲突，Gi会提示你解决冲突。解决冲突后，提交合并结果

7. 查看分支图
为了更清楚地了解分支和提交之间的关系，可以使用`git log`命令与`--graph`参数，生成分支的图形表示：
```bash
git log --oneline --graph --all
```
这将显示所有分支及其历史提交的图形化视图

## 分支工作流
Git的分支模型非常灵活，可以支持不同的工作流。以下是一些常见的分支工作流：
1. Git Flow
Git Flow是一种常见的分支管理模型，它定义了几个主要分支来进行不同的开发工作：
- `master`：始终包含稳定的代码，通常是部署到生产环境的代码
- `develop`：包含最新的开发代码，功能开发完成后会合并到这个分支
- `feature`：功能分支，用于开发新的功能，每个功能一个分支
- `release`：发布分支，用于准备发布版本
- `hotfix`：热修复分支，修复生产环境中的紧急bug

2. GitHub Flow
GitHub Flow是一个简化版的工作流，适用于持续部署和快速发布：
- 只使用`master`或`main`分支
- 每次开发新特性时，创建一个新分支（如`feature/login`）
- 完成功能后，提交Pull Request（PR），等待团队审查并合并到`main`分支

3. GitLab Flow
GitLab Flow是Git Flow和GitHub Flow的结合，支持更多的DevOps和持续集成/持续交付（CI/CD）流程
它支持不同的环境（如`production`和`staging`）和功能分支

## 分支管理的最佳实践
1. 保持分支简洁：每个功能、bug修复或者实验都应该有自己的独立分支，避免一个分支做太多事情
2. 频繁合并：如果多个开发人员同时工作，应该保持分支频繁合并，以避免冲突积压
3. 避免过长生命周期的分支：长期存在的分支可能会与主分支的内容发生较大的差异，增加合并的复杂度。尽量在功能开发完成后尽快合并回主分支
4. 使用Pull Request/Merge Request：在合并分支之前，通过Pull Request或Merge Request来进行代码审查和讨论，保持代码质量

## Merge
`git merge`是Git中用于合并不同分支的命令，它的作用是将一个分支合并到当前分支。通常用在将功能分支（如feature分支）或bugfix分支的改动合并到主分支（如main或master）

### 基本用法
要将一个分支合并到当前分支，可以使用：
```bash
git merge <branch_name>
```

例如，假设你现在在`main`分支上，要将`feature-branch`分支的修改合并过来，你应该：
```bash 
git checkout main # 确保在main分支上
git merge feature-branch
```

### 合并场景
- 快速合并（Fast-forward Merge）

如果你的当前分支（例如`main`）自从创建分支以来没有任何新提交，而目标分支（如`feature-branch`）有所有的新提交，Git会执行快进合并。也就是说，`main`的指针会直接跳到`feature-branch`的位置，不会创建额外的合并提交
```bash
git merge feature-branch
```
这时，Git会直接将`main`分支的指针“前进”到`feature-branch`的位置，不会创建新的合并提交

- 非快进合并（Non-fast-forward Merge）
如果你的当前分支（例如`main`）有新的提交，而目标分支（如`feature-branch`）也有新的提交，Git就需要创建一个合并提交来将者两个分支的改动整合起来
```bash
git merge feature-branch
```
Git会将`main`和`feature-branch`中的提交进行合并，并生成一个新的合并提交，这个提交会有两个父提交指针

- 合并冲突（Merge Conflicts）

分支合并时可能会遇到冲突，这通常发生在同一文件的相同位置被多个分支修改的情况下。解决冲突的方法是：
 1. Git会标记冲突的部分，开发者需要手动编辑文档，选择保留哪一部分或合并两者的内容
 2. 完成修改后，使用`git add`将解决后的文件标记为已解决
 3. 最后提交合并结果：`git commit`

### 冲突示例
1. 冲突通常出现在以下情况：
   - 两个分支修改了同一个文件的相同部分
   - Git无法决定如何合并这些修改
例如，假设：
- `main`分支的`file.txt`文件包含文本`Hello world!`
- `feature/login`分支对`file.txt`文件做了修改，变成`Hello from login!`

当你执行`git merge`时，Git会发现这两个分支对`file.txt`做了不同的修改，并提示你解决冲突

2. 执行`git merge`并遇到冲突
首先，当你执行`git merge`时，如果发生冲突，Git会停止合并并提醒你：
```bash
git merge feature/login
```
Git会输出类似下面的错误信息：
```bash
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```
此时，Git会：
- 标记冲突的文件为未合并的文件（Unmerged paths）
- 在冲突文件中插入标记，这些标记标明了冲突区域

3. 查看冲突文件
使用`git status`查看哪些文件有冲突
```bash
git status
```
会输出：
```bash
both modified: file.txt
```

4. 解决冲突
打开冲突文件（例如`file.txt`），会看到类似下面的标记：
```plaintext
<<<<<<< HEAD
Hello world!
=======
Hello from login!
>>>>>>> feature/login
```
- `<<<<<<< HEAD`：表示当前分支（例如`main`）的代码
- `=======`：分隔线，标记不同分支的修改位置
- `>>>>>>> feature/login`：表示被合并的分支（例如`feature/login`）的代码

解决冲突的几种方法：
1. 手动编辑文件：你需要选择保留当前分支、被合并分支的代码，或者手动合并两者的内容。删除冲突标记并修改文件为你想要的结果
2. 选择一个版本：
   - 如果你希望保留当前分支的代码，你可以删除`=======`和`>>>>>>> feature/login`之后的部分，只保留`HEAD`之前的部分
   - 如果你希望保留被合并分支的代码，你可以删除`<<<<<<< HEAD`和`=======`之前的部分，只保留`feature/login`之后的部分

5. 标记冲突为已解决
解决了所有冲突后，保存文件并标记冲突已解决：
```bash
git add file.txt
```

6. 提交合并
一旦所有冲突都解决并且修改已添加到暂存区，你需要提交合并。Git会自动为合并提交生成一个默认的提交信息，你可以修改提交信息，或者直接提交：
```bash
git commit
```
Git会创建一个合并提交，记录你解决冲突的过程

7. 推送远端