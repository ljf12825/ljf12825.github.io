---
title: Email
date: 2025-12-31
categories: [Git]
tags: [Command, Porcelain]
author: "ljf12825"
type: blog
summary: git Email interaction
---

## apply
`git apply`是一个用于将补丁（patch）文件中的更改应用到当前工作区和暂存区的Git命令。它接收一个由`git diff`或`diff -u`生成的标准diff格式的补丁文件，并直接修改你的文件\
它的核心特点是：它只应用文件的更改，而不会生成新的提交。需要手动将更改暂存并创建提交

### 使用场景
1. 测试补丁：检查一个补丁是否能无冲突地应用到当前代码上（使用`--check`）
2. 临时应用更改：向应用更改但暂时还不想做提交，或者需要先修改一下
3. 应用非标准补丁：应用的补丁文件不是由`git format-patch`生成的的（即不包含提交信息等元数据），而是普通的`.diff`或`.patch`文件
4. 只修改工作区：可以选择只将补丁应用到工作目录的文件，而不添加到暂存区

### 基本用法
1. 检查补丁是否能成功应用（试运行）
在真正应用之前，先检查补丁是否会产生冲突。这是一个非常好的习惯
```bash
git apply --check your_patch_file.patch
```
  - 如果改命令没有输出，则表示补丁可以干净地应用
  - 如果输出错误，则表示存在冲突，需要先解决

2. 应用补丁到工作区（不暂存）
这个命令只会修改工作目录中的文件，不会自动执行`git add`
```bash
git apply your_patch_file.patch
```
应用后，需要使用`git add`和`git commit`来手动创建提交

3. 应用补丁并直接暂存（添加到索引）
使用`--index`选项可以同时更改应用到工作区和暂存区。这相当于应用补丁后立即执行了`git add`
```bash
git apply --index your_patch_file.patch
```
应用后，只需要执行`git commit`即可

4. 反向应用补丁（撤销更改）
`--reverse`选项可以尝试反向应用补丁，这通常用于撤销该补丁引入的更改
```bash
# 先检查是否能撤销成功
git apply --reverse --check your_patch_file.patch

# 执行撤销操作（只应用到工作区）
git apply --reverse your_patch_file.patch
```

### 常用选项

| 选项 | 全称 | 说明 |
| - | - | - |
| `--check` | | 检查补丁是否能干净应用，而不实际应用它。类似于”试运行“ |
| `--stat` | | 显示摘要。不应用补丁，而是显示这个补丁将要更改哪些文件以及更改的统计信息（多少插入、多少删除）|
| `--numstat` | | 显示字数摘要。类似`--stat`，但只显示字数，不显式图形 |
| `--index` | | 将补丁应用到了工作区的同时也应用到暂存区（索引）|
| `--reverse` | `-R` | 反向应用补丁，用于撤销更改 |
| `--reject` | | 如果发生冲突，拒绝应用那些有冲突的更改，但会成功应用没有冲突的部分。有冲突的部分会生成`.rej`文件供手动处理 |
| `-v` | `--verbose` | 显示更详细的输出信息 |
| `--3way` | | 如果补丁不能干净应用，尝试进行三方合并。这需要补丁中包含必要的blob ID（如果补丁是由`git diff`或`git format-patch`生成的则会有 |

### 三方合并（Three-way merge）
是一种解决分支冲突或合并分支时常用的机制\
顾名思义，就是利用三个版本（commit）进行合并
1. 共同祖先（Base）
两个分支的最近公共祖先，也就是它们分叉前的最后一个提交
2. 当前分支的版本（Local/HEAD）
现在所在的分支的提交（通常是HEAD指向的commit）
3. 要合并进来的分支版本（Remote/Other）
要合并的分支最新的提交

Git会根据共同祖先来对比本地分支和目标分支的不同，从而决定如何合并

#### 举例
假设有两个分支
- `main`
- `feature`

历史提交结构
```css
A --- B --- C (main)
 \
  D --- E (feature)
```
- A：共同祖先（Base）
- B：当前分支的最新提交（Local）
- E：要合并的分支的最新提交（Remote）

当在`main`分支执行`git merge feature`时，Git会进行三方合并
- 比较A -> C的修改
- 比较A -> E的修改
- 把两者合并到一起

三方合并同时参考了三个“点”：`Base`,`Local`,`Remote`\
如果两个分支的修改互不冲突（比如一个改了函数A，另一个改了函数B），Git会自动合并\
如果两边都改了同一处（比如都修改了同一行代码），就会产生冲突，需要手动解决

#### 两方合并 vs 三方合并

| 类型 | 用途 | 参考点数量 | 示例 |
| - | - | - | - |
| 两方合并（Fast-forward）| 当目标分支正好在当前分支之后时 | 2个 | `main`直接快进到`feature` |
| 三方合并（Three-way merge）| 两个分支都往前推进过，需要找到最近公共祖先再合并 | 3个 | `main`和`feature`各自有新提交 |

### 工作流程
假设有一个`bugfix.patch`文件，需要测试并应用他
1. 首先，检查补丁
```bash
git apply --check bugfix.patch
```
如果无输出，说明可以应用。如果有冲突，需要先解决冲突的源头，或者手动应用

2. 应用补丁到工作区并进行测试
```bash
git apply bugfix.patch
```
现在工作区的文件已经改变了。可以编译、运行测试，确保修改是正确的

3. 如果测试通过，将更改添加到暂存区并提交
```bash
git add . # 将所有修改的文件暂存
git commit -m "Apply the bugfix patch"
```

4. 或者一步到位应用并暂存
```bash
git apply --index bugfix.patch
git commit -m "Apply the bugfix patch"
```

## am
`git am`是一个Git命令，用于从邮箱格式文件（mailbox）中应用一个或多个补丁（patch）。这些补丁文件通常是由`git format-patch`命令生成的（`.patch`文件），或者是从邮件中直接保存出来的\
它的核心功能是将补丁文件转换成一个个完整的提交（commit），并保留原提交的所有信息，如作者、日期、提交说明等


### 特点
1. 保留提交历史：它会为每个补丁创建一个新的提交，历史记录清晰
2. 保留作者信息：应用的提交会显示原始作者，而不是执行`git am`的人。这对于项目维护非常重要
3. 高效处理系列补丁：可以一次性应用一个补丁序列（如`0001-*.patch`,`0002-*.patch`），并保持正确的顺序

### 基本用法
1. 应用一个或多个补丁文件
这是最常见的用法。首先需要将补丁文件放在项目目录下
```bash
# 应用单个补丁文件
git am your_patch_file.patch

# 应用多个补丁文件（使用通配符 *，会按数字顺序应用）
git am 00*.patch

# 明确指定多个文件
git am patch1.patch patch2.patch
```

2. 从标准输入（stdin）读取补丁
这通常用于通过管道（pipe）直接将另一个命令的输出作为`git am`的输入
```bash
# 例如，直接使用curl下载一个补丁并应用
curl -s https://example/com/patch.patch | git am

# 或者使用 cat 命令（效果和直接指定文件一样）
cat patch.patch | git am
```

### 常用选项

| 选项 | 全称 | 说明 |
| - | - | - |
| `-3` | `--3way` | 三方合并。如果补丁不能干净地应用（例如由冲突），Git会尝试使用三方合并策略。非常推荐使用可以大大提高应用的成功率 |
| `-i` | `--interactive` | 交互模式。逐个补丁询问是否应用 |
| `-s` | `--signoff` | 在提交信息的末尾添加一行`Signed-off-by: Your Name <your.email@example.com>`这是向内核等大型项目提交代码时的规范要求 |
| `--abort` | | 放弃当前的am操作。如果应用补丁时发生冲突且想从头开始，这个命令会恢复到`git am`之前的状态 |
| `-r` | `--resolved` | 在手动解决冲突之后，使用此选项继续应用剩余补丁。相当于`git rebase --continue` |
| `-q` | `--quiet` | 安静模式，减少输出信息 |
| `-v` | `--verbose` | 详细模式，输出更多信息 |

### 工作流程：应用补丁并解决冲突
假设收到了一个`feature.patch`文件，需要将它应用到代码库中
1. 尝试应用补丁
```bash
git am -3 feature.patch
```
使用`-3`选项让Git在发生冲突时尝试自动解决

2. 如果发生冲突
  - Git会停止并标记哪些文件有冲突。会看到类似`Applying: Your patch subject`停在了某处
  - 手动解决冲突：用编辑器打开冲突文件，找到冲突标记符，修改代码解决冲突

3. 标记冲突已解决并继续
  - 将解决后的文件添加到暂存区
```bash
git add resolved-file.txt
```
  - 告诉`git am`解决完毕，继续操作
```bash
git am --resolved
```

### am vs apply

| 特性 | `git am` | `git apply` |
| - | - | - |
| 输入格式 | 邮箱格式（含提交信息） | 标准diff格式（仅代码差异）|
| 结果 | 创建新的提交 | 只修改工作区/暂存区，不生成新的提交 |
| 保留元数据 | 是（作者、日期、信息）| 否 |
| 适用场景 | 接收别人通过`git format-patch`生成的完整补丁 | 临时应用一个代码差异，或者测试一个补丁是否能成功应用（用`--check`）|

## imap-send 
`git imap-send`用于通过IMAP协议发送补丁(patch)文件。它最常用于从Git提交中生成补丁，并将其通过邮件发送给其他开发者。这通常在代码审查、贡献代码或协作开发时使用

```bash
git imap-send [options] <patch-file>
```
options
- `--quiet`：使命令输出尽可能少
- `--dry-run`：模拟发送补丁，但不会实际发送邮件。这对于调试很有用
- `--smtp-server`：使用特定的SMTP服务器来发送邮件
- `--from`：设置邮件的发件人地址
- `--to`：设置邮件的收件人地址
- `--subjec`：设置邮件的主题
- `-cc`：设置邮件的抄送地址
- `--message-id`：指定邮件的ID,通常Git会自动生成一个
- `--no-signature`：不附加签名

### 使用场景
1. 邮件发送补丁
如果有一组本地的提交，想要将这些提交作为补丁文件发送到一个邮件列表或团队成员，可以先将这些提交转化为补丁格式，然后通过`git imap-send`将其发送出去
2. 代码审查
许多开源项目采用这种方法进行代码审查，开发者通过邮件提交补丁文件，而不是直接推送到仓库
3. 协作开发
在一些开发流程中，团队成员可能通过邮件来传递补丁。`git imap-send`便是将Git提交转化为补丁并通过邮件发送的工具

### 示例：发送补丁
生成补丁
```bash
git format-patch -1 <commit-hash>
```
这会在当前目录生成一个补丁文件，比如`0001-<commit-message>.patch`。然后可以通过`git imap-send`发送这个补丁
```bash
git imap-send 0001-<commit-message>.patch 
```
在发送过程中，Git会要求你输入邮件相关的设置（如SMTP服务器、收件人等）

#### 配置SMTP服务器
要使`git imap-send`能正常工作，需要配置Git使用的邮件发送服务器（SMTP服务器）。这通常通过Git配置文件设置
```bash
git config --global sendemail.smtpServer smtp.example.com 
```
也可以设置其他邮件选项，如发件人地址
```bash
git config --global sendemail.from "you@example.com"
```

### 注意事项
- 在某些情况下，Git会要求你提供SMTP服务器的认证信息（例如用户名和密码）
- 邮件发送功能需要配置正确的IMAP或SMTP设置，否则可能无法正常工作
- 并非所有的Git安装都默认包含`imap-send`，可能需要安装额外的组件或者工具

## format-patch 
`git format-patch`用于将Git提交转换成邮件补丁格式（patch format），这样你就可以将这些补丁通过电子邮件分享给其他开发者，或将其应用到其他Git仓库中

这个命令通常用于开源开发中，尤其是在没有直接访问权限推送到主仓库的情况下，通过邮件提交补丁供他人审查和合并

```bash
git format-patch [options] <commit-range>
```
主要选项
1. `<commit-range>`
指定要生成补丁的提交范围。可以使用提交的哈希值、分支名或者其他应用来指定提交范围。例如：
  - `git format-patch -3`：生成最近三个提交的补丁
  - `git format-patch <commit-hash>^..HEAD`：从某个提交到当前`HEAD`的所有提交
  - `git format-patch <branch>`：生成当前分支与目标分支之间的补丁

2. `-n`
这个选项用于指定生成补丁的编号。例如`-n 5`会生成编号为`0001-0005`的补丁

3. `--stdout`
将生成的补丁直接输出到标准输出（屏幕）。而不是将其保存到文件中。通常用于查看补丁内容或管道传输
```bash
git format-patch -1 <commit-hash> --stdout 
```
4. `--cover-letter`
生成一个封面信（cover letter）作为补丁的一部分，通常包含对补丁的描述、背景信息等。这在通过邮件提交多个补丁时非常有用

5. `--attach`
生成补丁文件时，将补丁以附件的形式附加到邮件中

6. `--no-signature`
禁用生成的补丁中默认添加的签名（即`--signed-off-by`）。用于不想让补丁包含个人签名的情况

7. `--thread`
在生成多个补丁时，使得补丁之间的邮件能够形成线程，通常用于提交多个相关的补丁

### 示例
1. 生成单个提交的补丁
```bash
git format-patch -1 <commit-hash>
```
这个命令会生成指定提交的补丁文件，文件名通常为`0001-<commit-message>.patch`

2. 生成多个提交的补丁
```bash
git format-patch -3 
```
这将生成最近三次提交的补丁，文件名会按顺序自动编号：`0001-<commit-message>.patch`, `0002-<commit-message>.patch`等

3. 生成提交范围的补丁
```bash
git format-patch <commit-hash>^..HEAD 
```
这条命令会生成从指定提交`<commit-hash>`到当前`HEAD`的所有提交补丁

4. 生成补丁并输出到标准输出
```bash
git format-patch -1 <commit-hash> --stdout 
```
这个命令会将补丁的内容直接输出到屏幕，而不是写入文件。这在需要快速查看补丁内容或将补丁通过管道传递给其他应用程序时非常有用

5. 生成补丁并附带封面信
```bash
git format-patch -3 --cover-letter 
```
这个命令会包含三次提交的补丁，并且生成一个封面信。封面信通过长会包含补丁的背景信息、说明和其他相关内容

6. 使用`--no-signature`禁用签名
```bash
git format-patch -1 <commit-hash> --no-signature 
```

7. 生成带附件的补丁（用于邮件）
```bash
git format-patch -1 <commit-hash> --attach 
```
这个命令会将补丁生成并附加为邮件附件

### 补丁文件结构
生成的补丁文件通常包含以下几个部分
1. 邮件头部（Message Header）
包括补丁文件的元数据，如补丁编号、作者、日期、主题等
```sql 
From: Author Name <author@example.com>
Date: Wed Oct 7 12:34:56 2025 +0000
Subject: [PATCH] Commit message 
Message-ID: <unique-message-id>
```

2. 补丁内容（Patch Content）
紧接着邮件头部的是补丁的内容，显示出差异（diff）以及文件的更改部分\
这部分内容是实际的代码更改，会用`diff`格式显示
```diff 
diff --git a/file.txt b/file.txt
index 1234567..89abcd0 100644
--- a/file.txt
+++ b/file.txt
@@ -1,4 +1,4 @@
-Old content
+New content
```

### 使用场景
1. 代码审查
开发者提交补丁而不是直接推送到主仓库，其他开发者可以通过邮件审查这些补丁，然后合并
2. 跨仓库补丁传递
在一些项目中，开发者无法直接推送到目标仓库，但可以通过邮件分享补丁，仓库维护者可以直接应用这些补丁
3. 贡献开源项目
许多开源项目仍然使用邮件来接受贡献者的补丁，`git format-patch`是生成这种邮件补丁的标准工具

## send-email
`git send-email`用于将生成的补丁通过电子邮件发送给指定的收件人。它常用于开源项目中的代码审查、提交补丁等场景，尤其是在开发者没有权限直接推送到仓库时。通过`git send-email`，开发者可以将补丁以邮件的方式发送给仓库的维护者或其他贡献者
```bash
git send-email [options] <patch-file>
```
options
- `--to=<email>`
指定补丁邮件的接收者，可以是一个或多个电子邮件地址。如果没有指定，`git send-email`会提示输入

- `--cc=<email>`
指定抄送的电子邮件地址，适用于需要同时通知其他人的情况

- `--from=<email>`
设置发件人的电子邮件地址，通常是提交者的邮箱

- `--smtp-server=<server>`
配置邮件发送使用的SMTP服务器。例如，使用Gmail的SMTP服务器时，可以设置
```bash
git config --global sendemail.smtpServer smtp.gmail.com 
```
这个选项也可以在命令中直接指定

- `--smtp-user=<username>`和`--smtp-pass=<password>`
如果使用的SMTP服务器需要身份验证，可以使用这些选项设置用户名和密码

- `--subject=<subject>`
设置邮件的主题

- `--attach`
将补丁文件作为附件发送，而不是直接在邮件正文中插入补丁

- `--dry-run`
模拟发送，不实际发送，用于测试邮件设置是否正确

- `--no-signature`
禁用补丁中的签名（如`Signed-off-by`）

- `--in-reply-to=<message-id>`
用于将补丁与某个已有的邮件进行关联。通常在发送回复时使用

- `--chain-reply-to`
使邮件形成链式回复。适用于多个补丁或多次讨论的场景

### 邮件格式
`git send-email`会将补丁内容（diff格式）作为邮件正文发送，默认格式为`PATCH`。它会包含邮件头部、补丁内容、以及作者的签名等信息。邮件头部包含以下信息
```markdown
- From:发件人地址
- Date:邮件发送时间
- Subject:邮件主题，通常是`[PATCH] <commit message>`
- Message-ID:邮件的唯一标识符
- In-Reply-To:如果是对之前邮件的回复，邮件头中会包含该字段
```

### 示例
1. 发送补丁文件
假设已经用`git format-patch`生成了补丁文件，接下来可以使用`git send-email`发送这些补丁
```bash
git send-email 0001-<commit-message>.patch --to="maintainer@example.com"
```
这条命令会将指定的补丁通过电子邮件发送给`maintainer@example.com`

2. 发送多个补丁文件
如果有多个补丁文件并且想要一次性发送，命令会发送所有指定的补丁
```bash
git send-email *.patch --to="maintainer@example.com"
```

3. 使用SMTP服务器发送邮件
```bash
git config --global sendemail.smtpServer smtp.example.com
git send-email 0001-<commit-message>.patch --to="maintainer@example.com"
```
或者，也可以在命令行中指定SMTP服务器
```bash
git send-email --smtp-server=smtp.example.com --smtp-user="your-email@example.com" --smtp-pass="yourpassword" 0001-<commit-message>.patch --to="maintainer@example.com"
```
4. 发送补丁并抄送其他人
如果想在发送补丁时抄送其他开发者，可以使用`--cc`选项
```bash
git send-email 0001-<commit-message>.patch --to="maintainer@example.com" --cc="cc1@example.com, cc2@example.com"
```

5. 模拟发送文件
在发送实际邮件之前，可以使用`--dry-run`来模拟发送，确保邮件配置正确
```bash
git send-email 0001-<commit-message>.patch --to="maintainer@example.com" --dry-run 
```

6. 发送补丁并附带签名
```bash
git send-email 0001-<commit-message>.patch --to="maintainer@example.com" --signoff
```

## request-pull
`git request-pull`用于生成一个拉取请求（pull request）邮件模板。它会根据你本地分支的变更，生成一封包含变更信息的邮件，通常用于请求将这些变更合并到远程仓库。这个命令经常用于开源项目，特别是在开发者无法直接推送代码到主仓库时

`git request-pull`的作用是创建一个邮件内容，其中包含了从一个特定提交或分支到目标仓库的变更。然后，可以通过邮件将这个请求发送给项目维护者或者相关开发者，请求他们将这些变更合并到主仓库

```bash
git request-pull <start> <url> <end>
```
- `<start>`: 希望从哪里开始（通常是提交的开始点），例如某个commit或分支
这是变更的起点，通常是你所基于的上游提交，或者是本地分支与目标分支的差异起点。如果是`HEAD~5`，表示从当前提交的前5次提交开始
- `<url>`: 远程仓库URL,通常是目标仓库的URL
- `<end>`: 要推送到目标仓库的分支或提交，通常是本地的分支（例如`HEAD`或`master`）

**常用选项**
- `verbose`：显示更多的信息，包括变更的具体内容
- `--no-edit`：在请求邮件中不包含变更的详细描述，适用于简单的变更
- `--signoff`：在请求邮件的尾部添加`Signed-off-by`行，通常用于开源贡献，表示你同意贡献代码

### 示例
1. 基本的拉取请求
假设在本地分支`feature-branch`上做了修改，想要将这些修改提交给远程仓库进行合并。可以使用`git request-pull`生成一个拉取请求
```bash
git request-pull master https://github.com/maintainer/repo.git feature-branch
```
这个命令会生成一封邮件，内容包括
- 从`master`分支开发的变更
- 要求将`feature-branch`上的提交合并到`https://github.com/maintainer/repo.git`仓库
- 邮件的正文会显示差异以及相关的变更说明

2. 指定提交范围
如果你只想请求合并从某个提交到当前的所有变更，可以这样指定提交范围
```bash
git request-pull <start-commit> https://github.com/maintainer/repo.git HEAD 
```
这会请求将从`<start-commit>`到当前`HEAD`的所有变更合并到远程仓库

3. 使用`--verbose`显示详细信息
```bash
git request-pull master https://github.com/maintainer/repo.git feature-branch --verbose 
```
这将包含更多细节信息，比如每个文件的修改内容

4. 使用`--signoff`添加签名
如果正在进行开源贡献，可能需要在邮件尾部添加`Signed-off-by`表示同意贡献这些变更
```bash
git request-pull master https"//github.com/maintainer/repo.git feature-branch --signoff"
```

### 输出格式
`git request-pull`会生成一封标准的拉取请求邮件，邮件包括
1. 邮件头部：包含拉取请求的基本信息，如分支起点、目标仓库等
2. 邮件正文：显示本地分支与目标分支的差异
3. `Signed-off-by`（如果使用了`--signoff`）：表示开发者同意该变更，并允许将其合并到目标仓库

邮件的结构通常如下
```pgsql
From: Your Name <your.email@example.com>
Date: <date>
Subject: [PATCH] <commit-message>

Requesting pull from <start-commit> to <end-commit>.

<diff-content>

Signed-off-by: Your Name <your.email@example.com>
```

### 使用场景
1. 开源项目贡献
很多开源项目仍然使用邮件列表来提交补丁和合并请求，`git request-pull`能帮助开发者生成符合标准的拉取请求邮件
2. 没有直接推送权限仓库
如果你没有直接向目标仓库推送的权限，可以通过`git request-pull`生成拉取请求，并将其发送给项目维护者，请求合并
3. 请求代码审查
可以通过`git request-pull`请求其他开发者对你所做的修改进行审查，然后决定是否合并这些改动
